import nodemailer from 'nodemailer';
import config from 'config';

export default nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.get('gmail.user'),
    pass: config.get('gmail.password'),
  },
});
