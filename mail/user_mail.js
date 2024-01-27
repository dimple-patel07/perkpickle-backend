function sendUserEmail (req,res){
    var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'eitvand@gmail.com',
    pass: 'jaexmhhjfukjtmfh'
  }
});

var mailOptions = {
  from: 'eitvand@gmail.com',
  to: 'gohilkiransinh23@gmail.com',
  subject: 'Testing..',
  text: 'Hello...'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    res.statusCode = 500;
    console.log(error);
  } else {
    res.statusCode = 200;
    console.log('Email sent: ' + info.response);
  }
});
}

module.exports = {sendUserEmail}