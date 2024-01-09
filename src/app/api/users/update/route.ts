import { connect } from "@/db/db";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ITokenData } from "@/types/TokenData";
connect();

export async function PUT(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { name, email } = reqBody;
        const userId = await getDataFromToken(request);
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId.id },
            { name, email },
            { new: true, select: '-password' }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: "User does not exist" }, { status: 400 });
        }
        const tokenData: ITokenData = {
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        };
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" });

        const response = NextResponse.json({
            message: "User profile updated successfully",
            success: true,
            updatedUser
        });
        response.cookies.set("token", token, {
            httpOnly: true,
        });

        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
