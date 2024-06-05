import { Resend } from "resend";
import {Mailer} from "@/services/mailer";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (
    email: string,
    token: string
) => {
    await resend.emails.send({
        from: "mail@auth-masterclass-tutorial.com",
        to: email,
        subject: "2FA Code",
        html: `<p>Your 2FA code: ${token}</p>`
    });
};

// export const sendPasswordResetEmail = async (
//     email: string,
//     token: string,
// ) => {
//     const resetLink = `${domain}/newPassword?token=${token}`
//
//     await resend.emails.send({
//         from: "onboarding@resend.dev",
//         to: email,
//         subject: "Reset your password",
//         html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
//     });
// };
//
// export const sendVerificationEmail = async (
//     email: string,
//     token: string
// ) => {
//     const confirmLink = `${domain}/newVerification?token=${token}`;
//
//     await resend.emails.send({
//         from: "onboarding@resend.dev",
//         to: email,
//         subject: "Confirm your email",
//         html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
//     });
// };

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const domain = process.env.DOMAIN;
    const resetLink = `${domain}/newPassword?token=${token}`;

    await Mailer(email, "Reset your password", `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`);
};

// Функция для отправки верификационного письма
export const sendVerificationEmail = async (email: string, token: string) => {
    const domain = process.env.DOMAIN;
    const confirmLink = `${domain}/newVerification?token=${token}`;

    await Mailer(email, "Confirm your email", `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`);
};