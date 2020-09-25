const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const md5 = require('md5');
const User = require('../models/User');
const Contest = require('../models/Contest');
const ContestItem = require('../models/ContestItem');
const { AppError } = require('../usecases/error');

// todo: update token version
const generateTokens = ({ _id, tokenVersion = 0 }) => {
  const accessToken = jwt.sign({ userId: _id }, config.get('jwtAccessSecret'), {
    expiresIn: '15s',
  });
  const refreshToken = jwt.sign(
    { userId: _id, tokenVersion },
    config.get('jwtRefreshSecret'),
    { expiresIn: '7d' },
  );
  return { accessToken, refreshToken };
};

const UserController = {
  async login(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError('Incorrect login data', 400, {
        errors: errors.array(),
        message: 'Incorrect login data',
      });
    }

    const { login, password } = req.body;
    let user = await User.findOne({ email: login });

    if (!user) user = await User.findOne({ username: login });

    if (!user) throw new AppError('User not exists!', 400);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new AppError('Incorrect login data', 400);

    const { accessToken, refreshToken } = generateTokens(user);

    const responseBody = {
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
  async register(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError('Incorrect registration data', 400, {
        errors: errors.array(),
        message: 'Incorrect registration data',
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

    res.status(201).json({ message: 'User successfully created!' });
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
      ({ userId } = jwt.verify(token, config.get('jwtRefreshSecret')));
      req.userId = userId;
    } catch (e) {
      throw new AppError('Invalid signature', 400);
    }

    const user = await User.findById(userId).select('-password');

    if (!user) throw new AppError('Invalid token', 400);

    const { accessToken, refreshToken } = generateTokens(user);

    const responseBody = {
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
  async find({ userId, params: { username } }, res) {
    let user;
    if (username === 'me') {
      user = await User.findById(userId).select('-password');
    } else {
      user = await User.findOne({ username }).select('-password');
    }
    if (!user) throw new AppError('Resource not found!', 404);
    res.status(200).json(user);
  },
  // todo: validate permissions
  async remove({ params: { username } }, res) {
    const user = await User.findOne({ username });
    const contests = await Contest.find({ author: user._id });
    const deletes = contests.map(async (contest) => {
      await ContestItem.deleteMany({ contestId: contest.id });
      await Contest.deleteOne({ _id: contest.id });
    });
    await Promise.all(deletes);
    res.status(200).json({ message: 'User successfully deleted!' });
  },
};

module.exports = UserController;
