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

export const ChangePasswordSchema = z.object({
    password: z.optional(z.string()),
    newPassword: z.optional(z.string().min(6, {
        message: "Пароль должен состоять минимум из 6 символов",
    })),
})
    .refine((data) => {
        if (data.password && !data.newPassword) {
            return false;
        }
        return true;
    }, {
        message: "Необходимо ввести новый пароль",
        path: ["newPassword"]
    })
    .refine((data) => {
        if (data.newPassword && !data.password) {
            return false;
        }
        return true;
    }, {
        message: "Необходимо ввести текущий пароль",
        path: ["password"]
    })
