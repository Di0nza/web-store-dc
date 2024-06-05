import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const Mailer = async (email: string, subject: string, html: string) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.timeweb.ru",
            port: 2525,
            auth: {
                user: "maridenizbrand@maridenizbrand.com",
                pass: "gz2UXb05$5jr",
            },
            secure: false,
        } as SMTPTransport.Options);

        await transporter.sendMail({
            from: "maridenizbrand@maridenizbrand.com",
            to: email,
            subject: subject,
            html: html,
        });
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email!");
        console.error(error);
        return error;
    }
};