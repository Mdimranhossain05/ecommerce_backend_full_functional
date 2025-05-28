const nodemailer = require("nodemailer");
const { smptUsername, smptPasssword } = require("../secret");

const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: smptUsername,
            pass: smptPasssword,
        },
    });

const sendEmailWithNodeMailer = async (emailData) => {

    try {
        const mailOptions = {
            from: smptUsername, // sender address
            to: emailData.email, // list of receivers
            subject: emailData.subject, // Subject line
            html: emailData.html, // html body
        }

        // send mail with defined transport object
        const info = await transporter.sendMail(
            mailOptions
        );
        console.log("Message sent: %s", info.response);
    } catch (error) {
        console.log("Error occured while sending email", error);
        throw error
    }
}

module.exports = sendEmailWithNodeMailer;