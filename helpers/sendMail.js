/** @format */

const nodemailer = require("nodemailer");

function sendMail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  var mailOptions = {
    from: process.env.USER,
    to,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(info.response);
    }
  });
}

module.exports = sendMail;
