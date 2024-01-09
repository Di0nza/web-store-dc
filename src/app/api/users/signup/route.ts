import {connect} from "@/db/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import {SignUpSchema} from "@/types/authSchemas";
import {getUserByEmail} from "@/services/users";
import {generateVerificationToken} from "@/lib/tokens";
import {sendVerificationEmail} from "@/lib/mail";

connect();

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const validateFields = SignUpSchema.safeParse(reqBody);
        console.log(reqBody);
        if(!validateFields.success){
            return NextResponse.json({error:"Некорректные поля"})
        }

        const {name, email, password} = validateFields.data;

        const user = await getUserByEmail(email);
        if(user){
            return NextResponse.json({error: "Пользователь с таким Email уже существует"})
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            createdAt: Date.now(),
        })

        const savedUser = await newUser.save()
        console.log(savedUser);

        const verificationToken = await generateVerificationToken(email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token)

        const response = NextResponse.json({
            message: "Письмо для подтверждения регистрации выслано на почту",
            success: "Письмо для подтверждения регистрации выслано на почту",
            savedUser
        })

        return response;

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})

    }
}
