const { mailerConfig } = require("./mailer_config");

function sendContactMail(req, res) {
	const subject = "Verify your email address";
	const htmlTemplate = contactEmailTemplate(otp);

	mailerConfig(email, subject, htmlTemplate);
	res.statusCode = 200;
	return { message: "contact email sent successfully" };
}

function contactEmailTemplate(otp) {
	const orgName = "PerkPickle";
	const currentTime = Date.now();
	return `
    <html>
      <body>
      <!-- opacity: 0 - to ensures Gmail doesn't trim the email -->
      <span style="opacity: 0"> ${currentTime} </span>
        <p>To finish setting up your ${orgName} account, we just need to make sure that this email address is yours.</p>
        <p>To verify your email address, use this security code: <b>${otp}</b></p>
        <p>If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.</p>
        <p>Thanks,</p>
        <p>The ${orgName} team</p>
        <!-- opacity: 0 - to ensure Gmail doesn't trim the email -->
        <span style="opacity: 0"> ${currentTime} </span>
      </body>
    </html>
  `;
}

module.exports = { sendContactMail };
