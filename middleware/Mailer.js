
const nodemailer = require('nodemailer');
const Mailer = (user, OTP) => {

    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'foruse150@gmail.com',
        pass: 'lkkrplvldghsmmkv'
      }
    });
    
    const mailOptions = {
      from: 'Auth Portal',
      to: user,
      subject: 'OTP to reset password' ,
      text: `Your otp is ${OTP}`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
     console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        // do something useful
      }
    });
    };
    module.exports = { Mailer };