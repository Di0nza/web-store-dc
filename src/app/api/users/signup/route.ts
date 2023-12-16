import {connect} from "@/db/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {ITokenData} from "@/types/TokenData";

connect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {username, email, password, createdAt} = reqBody

        console.log(reqBody);

        const user = await User.findOne({email})
        if(user){
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            createdAt: createdAt,
        })

        const savedUser = await newUser.save()
        console.log(savedUser);

        const tokenData: ITokenData = {
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            isAdmin: savedUser.isAdmin
        }

        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"})
        const response = NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        })

        response.cookies.set("token", token, {
            httpOnly: true,
        })

        return response;

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})

    }
}
