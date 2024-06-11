import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {ITokenData} from "@/types/TokenData";
import * as z from "zod";
import {signIn} from "@/auth";
import {ResetPasswordSchema} from "@/types/authSchemas";
import {DEFAULT_USER_LOGIN_REDIRECT} from "@/routes";
import {AuthError} from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect";
import {RedirectErrorBoundary} from "next/dist/client/components/redirect-boundary";
import {generateResetPasswordToken, generateVerificationToken} from "@/lib/tokens";
import {getUserByEmail} from "@/services/users";
import {sendPasswordResetEmail, sendVerificationEmail} from "@/lib/mail";
import {getVerificationTokenByEmail, getVerificationTokenByToken} from "@/services/verificationToken";
import userModel from "@/models/userModel";
import verificationTokenModel from "@/models/verificationTokenModel";
import {connect} from "@/db/db";

connect();

/**Вызывается на странице, где вводится email, для восстановление пароля*/
export const maxDuration = 59;


export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json()
        const validateFields = ResetPasswordSchema.safeParse(reqBody);
        console.log(reqBody);
        if (!validateFields.success) {
            return NextResponse.json({error: "Неправильные поля"})
        }
        const {email} = validateFields.data;

        const existingUser = await getUserByEmail(email)

        if (!existingUser) {
            return NextResponse.json({error: "Пользователь с таким Email не найден"});
        }

        const resetPasswordToken = await generateResetPasswordToken(email);

        await sendPasswordResetEmail(resetPasswordToken.email, resetPasswordToken.token);



        return NextResponse.json({success: "Письмо для восстановления пароля отправлено"})

    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}