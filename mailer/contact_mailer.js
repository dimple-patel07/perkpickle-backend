const { mailerConfig } = require("./mailer_config");

function sendContactMail(req, res) {
	params = req.body;
	const subject = "Contact details";
	// send email to support team
	const contactTemplate = contactEmailTemplate(params);
	mailerConfig(process.env.CONTACT_US_EMAIL, subject, contactTemplate);
	// send email to contact person
	const acknowledgmentSubject = "Re: Your Inquiry - PerkPickle Customer Support";
	const acknowledgmentTemplate = acknowledgmentEmailToContactPerson(params);
	mailerConfig(params.email, acknowledgmentSubject, acknowledgmentTemplate);
	res.statusCode = 200;
	return { message: "message sent successfully" };
}
// email template for support team
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
// acknowledgment email to contact person
function acknowledgmentEmailToContactPerson(params) {
	const currentTime = Date.now();
	const orgName = "PerkPickle";
	return `
    <html>
      <body>
      <!-- opacity: 0 - to ensures Gmail doesn't trim the email -->
      <span style="opacity: 0"> ${currentTime} </span>
        <p>Dear ${params.name},</p>
        <p>Thank you for reaching out to ${orgName} Customer Support! We appreciate the opportunity to assist you. Our team is dedicated to providing timely and helpful responses to all inquiries.</p>
        <p>We have received your message and will review it shortly. Please allow us some time to investigate your query thoroughly. Please be advised that our standard response time is 2-3 business days. Rest assured, we are committed to resolving your concerns and providing you with the support you need.</p>
        <p>Once again, thank you for choosing ${orgName}. We value your feedback and are here to ensure your experience with us is nothing short of excellent.</p>
        <p>Best regards,</p>
        <p>${orgName} Customer Support Team</p>
        <!-- opacity: 0 - to ensure Gmail doesn't trim the email -->
        <span style="opacity: 0"> ${currentTime} </span>
      </body>
    </html>
  `;
}

module.exports = { sendContactMail };
