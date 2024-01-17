import {connect} from "@/db/db";
import User from "@/models/userModel";
import {NextRequest, NextResponse} from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {ITokenData} from "@/types/TokenData";
import * as z from "zod";
import {signIn} from "@/auth";
import {LoginSchema} from "@/types/authSchemas";
import {DEFAULT_USER_LOGIN_REDIRECT} from "@/routes";
import {AuthError} from "next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {RedirectErrorBoundary} from "next/dist/client/components/redirect-boundary";
import {generateVerificationToken} from "@/lib/tokens";
import {getUserByEmail} from "@/services/users";
import {sendVerificationEmail} from "@/lib/mail";

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const validateFields = LoginSchema.safeParse(reqBody);
        console.log(reqBody);
        if (!validateFields.success) {
            return NextResponse.json({error: "Неправильные поля"})
        }
        const {email, password} = validateFields.data;

        const existingUser = await getUserByEmail(email);

        if (!existingUser) {
            return NextResponse.json({error: "Пользователя с такой почтой не существует"});
        }
        if (!existingUser.email || !existingUser.password) {
            return NextResponse.json({error: "Аккаунт для этой почты был зарегистрирован с помощью Google"});
        }

        const validPassword = await bcryptjs.compare(password, existingUser.password)
        if(!validPassword){
            return NextResponse.json({error: "Неверный пароль"})
        }

        if (!existingUser.emailVerified) {
            const verificationToken = await generateVerificationToken(email);
            await sendVerificationEmail(verificationToken.email, verificationToken.token);
            return NextResponse.json({success: "Необходимо завершить регистрацию. Письмо для подтверждения выслано на почту"});
        }

        await signIn("credentials", {
            email,
            password,
            //redirectTo: `${request.headers.get("origin")}${DEFAULT_LOGIN_REDIRECT}`
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return NextResponse.json({error: "Неверный логин или пароль"});
                default:
                    return NextResponse.json({error: "Что-то пошло не так"});

            }
        }
        if (isRedirectError(error)) {

        } else {

        }
        throw error;
        return NextResponse.json({error: error.message}, {status: 500})
    }

}
