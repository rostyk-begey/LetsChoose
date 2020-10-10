import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import md5 from 'md5';

import User from '../../models/User';
import Contest from '../../models/Contest';
import ContestItem from '../../models/ContestItem';
import emailTransporter from '../../usecases/emailTransporter';
import renderConfirmationEmail from '../../usecases/renderConfirmationEmail';
import renderResetPasswordEmail from '../../usecases/renderResetPasswordEmail';
import { AppError } from '../../usecases/error';
import { IUserController, LoginResponseBody } from './types';

const generateTokens = ({
  _id,
  passwordVersion = 0,
}: {
  _id: string;
  passwordVersion: number;
}): {
  accessToken: string;
  refreshToken: string;
} => {
  const payload = { userId: _id, passwordVersion };
  const accessToken = jwt.sign(payload, config.get('jwt.accessSecret'), {
    expiresIn: '15s',
  });
  const refreshToken = jwt.sign(payload, config.get('jwt.refreshSecret'), {
    expiresIn: '7d',
  });
  return { accessToken, refreshToken };
};

const UserController: IUserController = {
  async login(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError('Incorrect login data', 400, {
        errors: errors.array(),
      });
    }

    const { login, password } = req.body;
    let user = await User.findOne({ email: login });

    if (!user) user = await User.findOne({ username: login });

    if (!user) throw new AppError('User not exists!', 400);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new AppError('Incorrect login data', 400);

    if (!user.confirmed) throw new AppError('Email confirmation needed', 403);

    const { accessToken, refreshToken } = generateTokens(user);

    const responseBody: LoginResponseBody = {
      userId: user._id,
      accessToken,
    };

    res.cookie('jid', refreshToken, {
      httpOnly: true,
    });

    if (req.query?.refreshTokenLocation === 'body') {
      responseBody.refreshToken = refreshToken;
    }

    res.status(200).json(responseBody);
  },
  async register(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError('Incorrect registration data', 400, {
        errors: errors.array(),
      });
    }

    const { email, username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      username,
      password: hashedPassword,
      avatar: `https://www.gravatar.com/avatar/${md5(email)}?s=200&d=identicon`,
      bio: '',
    });
    await user.save();

    jwt.sign(
      { userId: user._id },
      config.get('jwt.emailSecret'),
      {}, //{ expiresIn: '1d' }, // todo: check
      (err, emailToken) => {
        const url = `${config.get('appUrl')}/email/confirm/${emailToken}`;

        emailTransporter.sendMail({
          to: user.email,
          subject: 'Confirm Email',
          html: renderConfirmationEmail(config.get('appUrl'), url),
        });
      },
    );

    res.status(201).json({ message: 'User successfully created!' });
  },
  async forgotPassword(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError('Incorrect email', 400, {
        errors: errors.array(),
      });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) throw new AppError('Invalid email', 404);

    const resetPasswordToken = await jwt.sign(
      { userId: user._id },
      config.get('jwt.passwordResetSecret'),
      { expiresIn: '10m' },
    );

    const url = `${config.get('appUrl')}/password/reset/${resetPasswordToken}`;

    emailTransporter.sendMail({
      to: user.email,
      subject: 'Password reset',
      html: renderResetPasswordEmail(config.get('appUrl'), url),
    });

    res
      .status(201)
      .json({ message: `Reset password link has been sent to ${email}!` });
  },
  async resetPassword(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError('Incorrect data', 400, {
        errors: errors.array(),
      });
    }

    const { password } = req.body;
    const { token } = req.params;

    let userId = '';

    try {
      // @ts-ignore
      ({ userId } = jwt.verify(token, config.get('jwt.passwordResetSecret')));
    } catch (e) {
      throw new AppError('Reset password link expired', 403);
    }

    const user = await User.findById(userId);

    if (!user) throw new AppError('User not found', 404);

    const newPassword = await bcrypt.hash(password, 12);

    await user.update({
      password: newPassword,
      passwordVersion: user.passwordVersion + 1,
    });

    res.status(201).json({ message: 'Password was successfully changed!' });
  },
  async refreshToken(req, res) {
    let token;
    let userId;

    if (req.query?.refreshTokenLocation === 'body') {
      token = req.body.refreshToken;
    } else {
      token = req.cookies.jid;
    }

    if (!token) throw new AppError('Invalid token', 400);

    try {
      // @ts-ignore
      ({ userId } = jwt.verify(token, config.get('jwt.refreshSecret')));
    } catch (e) {
      throw new AppError('Invalid signature', 400);
    }

    const user = await User.findById(userId).select('-password');

    if (!user) throw new AppError('Invalid token', 400);

    const { accessToken, refreshToken } = generateTokens(user);

    const responseBody: LoginResponseBody = {
      userId: user.id,
      accessToken,
    };

    res.cookie('jid', refreshToken, {
      httpOnly: true,
    });

    if (req.query?.refreshTokenLocation === 'body') {
      responseBody.refreshToken = refreshToken;
    }

    res.status(200).json(responseBody);
  },
  async find(req, res) {
    const {
      userId,
      params: { username },
    } = req;
    let user;
    if (username === 'me') {
      user = await User.findById(userId).select('-password');
    } else {
      user = await User.findOne({ username }).select('-password');
    }
    if (!user) throw new AppError('Resource not found!', 404);
    res.status(200).json(user);
  },
  async confirmEmail(req, res) {
    const {
      params: { token },
    } = req;
    try {
      // @ts-ignore
      const { userId } = jwt.verify(token, config.get('jwt.emailSecret'));
      await User.updateOne({ _id: userId }, { confirmed: true });
    } catch (e) {
      throw new AppError('Invalid url', 400);
    }

    res.status(200).json({ message: 'Email was successfully verified!' });
  },
  // todo: validate permissions
  async remove(req, res) {
    const {
      params: { username },
    } = req;
    const user = await User.findOne({ username });

    if (!user) throw new AppError('User does not exists', 404);

    const contests = await Contest.find({ author: user._id });
    const deletes = contests.map(
      async (contest): Promise<void> => {
        await ContestItem.deleteMany({ contestId: contest.id });
        await Contest.deleteOne({ _id: contest.id });
      },
    );
    await Promise.all(deletes);
    res.status(200).json({ message: 'User successfully deleted!' });
  },
};

export default UserController;
