// Source - https://stackoverflow.com/a/71315105
// Posted by NeNaD, modified by community. See post 'Timeline' for change history
// Retrieved 2026-05-15, License - CC BY-SA 4.0

const nodemailer = require('nodemailer');
const process = require('process');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

exports.sendEmail = (sendTo, subject, message) => {
  return new Promise((resolve, reject) => {
    const email_message = {
      from: { name: process.env.EMAIL_NAME },
      to: sendTo,
      subject: subject,
      text: message,
    };

    transporter
      .sendMail(email_message)
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        reject(false);
      });
  });
};
