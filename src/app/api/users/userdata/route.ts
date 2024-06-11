import { getDataFromToken } from "@/helpers/getDataFromToken";
import {connect} from "@/db/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 59;

export async function GET(request:NextRequest){
    try {
        const userId = await getDataFromToken(request).id;
        const user = await User.findOne({_id: userId}).select("-password");
        return NextResponse.json({
            message: "User found",
            data: user
        })
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 400});
    }

}
