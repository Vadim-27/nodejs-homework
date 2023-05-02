// const sgMail = require('@sendgrid/mail');

// const { SENGRID_API_KEY, EMAIL_FROM } = process.env;

// require('dotenv').config();

// sgMail.setApiKey(SENGRID_API_KEY);

// const sendEmail = async (data) => {
//     const email = { ...data, EMAIL_FROM };
//     await sgMail.send(email);
//     return true;
// }
// module.exports = sendEmail;

const sgMail = require("@sendgrid/mail");

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendMail = async (data) => {
  const mail = { ...data, from: "vadim.bulanyi@gmail.com" };
  await sgMail.send(mail);
  return true;
};

module.exports = sendMail;