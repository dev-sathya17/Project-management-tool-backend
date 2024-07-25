const { EMAIL_ID } = require("../utils/config");
const transporter = require("../utils/transporter");
const sendEmail = (email, subject, text) => {
  const mailOptions = {
    from: EMAIL_ID,
    to: email,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendEmail;
