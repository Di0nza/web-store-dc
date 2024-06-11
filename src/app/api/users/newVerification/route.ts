import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {ITokenData} from "@/types/TokenData";
import * as z from "zod";
import {signIn} from "@/auth";
import {LoginSchema} from "@/types/authSchemas";
import {DEFAULT_USER_LOGIN_REDIRECT} from "@/routes";
import {AuthError} from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect";
import {RedirectErrorBoundary} from "next/dist/client/components/redirect-boundary";
import {generateVerificationToken} from "@/lib/tokens";
import {getUserByEmail} from "@/services/users";
import {sendVerificationEmail} from "@/lib/mail";
import {getVerificationTokenByEmail, getVerificationTokenByToken} from "@/services/verificationToken";
import userModel from "@/models/userModel";
import verificationTokenModel from "@/models/verificationTokenModel";
import {connect} from "@/db/db";

connect();
export const maxDuration = 59;

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json()

        const {token} = reqBody

        const existingToken = await getVerificationTokenByToken(token);

        if (!existingToken) {
            return NextResponse.json({error: "Верификационный токен отсутствует"});
        }

        const hasExpired = new Date(existingToken.expires) < new Date();

        if (hasExpired){
            return NextResponse.json({error: "Верификационный токен просрочен"});
        }

        const existingUser = await getUserByEmail(existingToken.email)

        if (!existingUser) {
            return NextResponse.json({error: "Пользователь с таким Email не найден"});
        }

        await userModel.findByIdAndUpdate(existingUser.id, {
            emailVerified: new Date()
        })

        await verificationTokenModel.findByIdAndDelete(existingToken.id)

        return NextResponse.json({success: "Почта подтверждена"})

    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}