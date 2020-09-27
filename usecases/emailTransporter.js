const nodemailer = require('nodemailer');
const config = require('config');

module.exports = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.get('gmail.user'),
    pass: config.get('gmail.password'),
  },
});
