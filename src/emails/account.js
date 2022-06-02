const sgMail = require('@sendgrid/mail');
const { MongoGridFSStreamError } = require('mongodb');

require('dotenv').config();

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'cryptogames.eth@gmail.com',
    subject: 'Thanks for joining in!',
    text: `
      Welcome to the app, ${name}.
      Let me know how you get along with the app.`,
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'cryptogames.eth@gmail.com',
    subject: 'Sorry to see you go!',
    text: `
      Goodbye, ${name}.
      I hope to see you back sometime soon.`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};
