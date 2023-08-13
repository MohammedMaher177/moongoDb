
import nodemailer from 'nodemailer'


const sendEmail = async ({ to, subject, text, html, attachments = [] } = {}) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
        }
    });

    const info = await transporter.sendMail({
        from: `"Social Media App 👻" <${process.env.EMAIL}>`, // sender address
        to,
        // bcc: "anahammo777@gmail.com",
        subject,
        text,
        html,
        attachments
    });
    console.log(info);
}


export default sendEmail;