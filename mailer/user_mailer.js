const { mailerConfig } = require("./mailer_config");

function sendUserEmail(email, otp) {
	const subject = "Verify your email address";
	const htmlTemplate = verifyEmailTemplate(email, otp);

	mailerConfig(email, subject, htmlTemplate);
}

function verifyEmailTemplate(email, otp) {
	const orgName = "PerkPickle";
	const currentTime = Date.now();
	return `
    <html>
      <body>
        <!-- opacity: 0 - to ensures Gmail doesn't trim the email -->
        <span style="opacity: 0"> ${currentTime} </span>
        <p>Dear ${email.substr(0, email.indexOf("@"))},</p>  <!-- we have only email to proceed -->
        <p>We hope this email finds you well. Thank you for choosing ${orgName} as your preferred platform. We are excited to have you on board!</p>
        <p>To complete the sign-up process and ensure the security of your account, we have generated a One-Time Password (OTP) for you. This additional step is part of our commitment to safeguarding your information and providing a secure user experience.</p>
        <p>Please find your OTP below:</p>
        <p><b>OTP: ${otp}</b></p>
        <p>Please follow these simple steps to complete your sign-up:</p>
        <p>Visit the <a href=${process.env.PERKPICKLE_WEB_URL} target="blank">${orgName} sign-up page</a>.</p>
        <p>Insert the OTP provided above in the designated field.</p>
        <p>Please note that the OTP is valid for a limited time to enhance security. If you encounter any issues, feel free to contact our customer support team at <a href="${process.env.PERKPICKLE_WEB_URL}/contact-us" target="blank">support@perkpickle.com</a>.</p>
        <p>Thank you for your cooperation in ensuring a secure sign-up process. We look forward to providing you with a delightful experience on ${orgName}.</p>
        <p>Best regards,</p>
        <p>${orgName} Customer Support Team</p>
        <!-- opacity: 0 - to ensure Gmail doesn't trim the email -->
        <span style="opacity: 0"> ${currentTime} </span>
      </body>
    </html>
  `;
}

module.exports = { sendUserEmail };
