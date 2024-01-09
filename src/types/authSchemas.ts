import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Введите Email",
    }),
    password: z.string().min(1, {
        message: "Введите пароль",
    }),
    code: z.optional(z.string()),
});

export const SignUpSchema = z.object({
    email: z.string().email({
        message: "Введите Email",
    }),
    password: z.string().min(6, {
        message: "Пароль должен состоять минимум из 6 символов",
    }),
    name: z.string().min(1,{
        message: "Введите ваше имя"
    }),
    code: z.optional(z.string()),
});

export const ResetPasswordSchema = z.object({
    email: z.string().email({
        message: "Введите Email",
    }),
});

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Пароль должен состоять минимум из 6 символов",
    }),
    token: z.optional(z.string()),
});