import {NextRequest, NextResponse} from "next/server";
import {ITokenData} from "@/types/TokenData";
import {getDataFromToken} from "@/helpers/getDataFromToken";
import Product from "@/models/productModel";
import MainPageVideo from "@/models/mainPageVideoModel";
import {currentUser, isAdmin} from "@/lib/auth";
import User from "@/models/userModel";
export async function GET(
    request: NextRequest,
) {
    try {

        const user = await currentUser();

        if(!user){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        const userDB = await User.findById(user.id)

        if(!userDB){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        if(user?.isAdmin === false){
            return NextResponse.json({error: "Forbidden. You don't have administrator rights."}, {status: 403})
        }

        const videos = await MainPageVideo.find();

        return NextResponse.json({
            message:"Video fetch successfully",
            success: true,
            videos
        })

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}