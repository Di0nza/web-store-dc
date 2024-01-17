import { connect } from "@/db/db";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ITokenData } from "@/types/TokenData";
import {currentUser} from "@/lib/auth";
connect();

export async function PUT(request: NextRequest) {
    try {

        const user = await currentUser();

        if(!user){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        const userDB = await User.findById(user.id)

        if(!userDB){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        const reqBody = await request.json();
        const { name, email } = reqBody;

        console.log(user, email)

        if(user.email !== email){
            return NextResponse.json({error: "Forbidden. You don't have this rights."}, {status: 403})
        }



        const updatedUser = await User.findOneAndUpdate(
            { _id: user.id },
            { name },
            { new: true, select: '-password' }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: "User does not exist" }, { status: 400 });
        }

        const response = NextResponse.json({
            message: "User profile updated successfully",
            success: true,
            updatedUser
        });

        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
