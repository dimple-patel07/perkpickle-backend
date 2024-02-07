const { mailerConfig } = require("./mailer_config");

function sendContactMail(req, res) {
	params = req.body;
	const subject = "Contact details";
	const htmlTemplate = contactEmailTemplate(params);

	mailerConfig(process.env.CONTACT_US_EMAIL, subject, htmlTemplate);
	res.statusCode = 200;
	return { message: "message sent successfully" };
}

function contactEmailTemplate(params) {
	const currentTime = Date.now();
	return `
    <html>
      <body>
      <!-- opacity: 0 - to ensures Gmail doesn't trim the email -->
      <span style="opacity: 0"> ${currentTime} </span>
        <p>Name : ${params.name}</p>
        <p>Email : ${params.email}</p>
        <p>Subject : ${params.subject}</p>
        <p>Message : ${params.message}</p>
        <!-- opacity: 0 - to ensure Gmail doesn't trim the email -->
        <span style="opacity: 0"> ${currentTime} </span>
      </body>
    </html>
  `;
}

module.exports = { sendContactMail };
