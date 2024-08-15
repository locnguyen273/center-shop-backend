const nodemailer = require("nodemailer");
// import "dotenv/config";

const { MAIL_ID, MP } = process.env;

const nodemailerConfig = {
  service: "gmail",
  auth: {
    user: MAIL_ID,
    pass: MP,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const SendEmail = (data) => {
  const email = { ...data, from: MAIL_ID };
  return transport.sendMail(email);
};
module.exports = { SendEmail };
