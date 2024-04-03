const nodemailer = require("nodemailer");

function mailerConfig(email, subject, htmlTemplate) {
	const transporter = nodemailer.createTransport({
		service: "hotmail",
		auth: {
			user: process.env.MAILER_EMAIL,
			pass: process.env.MAILER_PASSWORD,
		},
	});

	const mailOptions = {
		from: process.env.MAILER_EMAIL,
		to: email,
		subject: subject,
		html: htmlTemplate,
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.error("Sending email failed :: ", error);
		} else {
			console.log("Email sent: " + info.response);
		}
	});
}
module.exports = { mailerConfig };
