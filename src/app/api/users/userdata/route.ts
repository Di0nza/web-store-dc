import { getDataFromToken } from "@/helpers/getDataFromToken";
import {connect} from "@/db/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request:NextRequest){
    try {
        const userId = await getDataFromToken(request);
        console.log(userId.id);
        const user = await User.findOne({_id: userId.id}).select("-password");
        return NextResponse.json({
            message: "User found",
            data: user
        })
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 400});
    }

}
