const { mailerConfig } = require("./mailer_config");

// forgot password email
function sendForgotPasswordEmail(userData) {
	const subject = "Password Reset Request for Your PerkPickle Account";
	const htmlTemplate = forgotPasswordEmailTemplate(userData);

	mailerConfig(userData.email, subject, htmlTemplate);
}
// forgot password email template
function forgotPasswordEmailTemplate(userData) {
	const orgName = "PerkPickle";
	const currentTime = Date.now();
	return `
    <html>
      <body>
      <!-- opacity: 0 - to ensures Gmail doesn't trim the email -->
      <span style="opacity: 0"> ${currentTime} </span>
        <p>Dear ${userData.first_name} ${userData.last_name},</p>
        <p>We hope this email finds you well. It appears that a request has been made to reset the password for your ${orgName} account. If you initiated this request, please proceed with the steps outlined below. If you did not make this request, we recommend contacting our support team immediately at <a href="${process.env.PERKPICKLE_WEB_URL}/contact-us" target="blank">support@perkpickle.com</a>.</p>
        <p>To reset your password, follow these simple steps:</p>
        <p>Visit the <a href=${process.env.PERKPICKLE_WEB_URL} target="blank">${orgName} password reset page</a><p>
        <p>Enter the <b>OTP ${userData.otp}</b> in the designated field to verify your identity.</p>
        <p>Please note that the OTP is time-sensitive for security purposes. If you did not request a password reset or if you encounter any issues, please reach out to our support team at <a href="${process.env.PERKPICKLE_WEB_URL}/contact-us" target="blank">support@perkpickle.com</a> immediately.</p>
        <p>Thank you for your prompt attention to this matter. We are committed to ensuring the security of your ${orgName} account and appreciate your cooperation.</p>
        <p>Best regards,</p>
        <p>${orgName} Customer Support Team</p>
        <!-- opacity: 0 - to ensure Gmail doesn't trim the email -->
       <span style="opacity: 0"> ${currentTime} </span>
      </body>
    </html>
  `;
}

module.exports = { sendForgotPasswordEmail };
