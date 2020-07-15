const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

const router = Router();

router.post(
  '/register',
  [
    check('email', 'Invalid email').isEmail(),
    check('username', 'Invalid username')
      .isLength({ min: 3 })
      .matches(/^[a-z._0-9]+$/),
    check('password', 'Invalid password').isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Incorrect registration data',
        });
      }

      const { email, username, password } = req.body;
      let candidate = await User.findOne({ email });

      if (candidate) {
        return res
          .status(400)
          .json({ message: `User with email ${email} already exists!` });
      }

      candidate = await User.findOne({ username });
      if (candidate) {
        return res.status(400).json({ message: 'Username already taken!' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, username, password: hashedPassword });
      await user.save();

      res.status(201).json({ message: 'User successfully created!' });
    } catch (e) {
      console.error(e);
    }
  },
);

router.post(
  '/login',
  [
    check('login')
      .not()
      .isEmpty()
      .isString()
      .custom((value) => {
        if (validator.isEmail(value) || value.match(/^[a-zA-Z._0-9]+$/)) {
          return true;
        }
        throw new Error('Invalid login');
      }),
    check('password', 'Enter password').exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Incorrect login data',
        });
      }

      const { login, password } = req.body;
      let user = await User.findOne({ email: login });

      if (!user) {
        user = await User.findOne({ username: login });
      }

      if (!user) {
        return res.status(400).json({ message: 'User not exists!' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect login data' });
      }

      const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'), {
        expiresIn: '1h',
      });

      res.json({ token, userId: user.id });
    } catch (e) {
      console.error(e);
    }
  },
);

module.exports = router;
