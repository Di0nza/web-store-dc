import {NextRequest, NextResponse} from "next/server";
import {ITokenData} from "@/types/TokenData";
import {getDataFromToken} from "@/helpers/getDataFromToken";
import Product from "@/models/productModel";
import MainPageVideo from "@/models/mainPageVideoModel";
import {currentUser, isAdmin} from "@/lib/auth";

export async function POST(
    request: NextRequest,
) {
    try {

        const user = await currentUser();

        if(!user){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        if(user?.isAdmin === false){
            return NextResponse.json({error: "Forbidden. You don't have administrator rights."}, {status: 403})
        }

        const reqBody = await request.json()
        const {secure_url} = reqBody;

        console.log(secure_url);

        const video = await new MainPageVideo({
            title:"Main Page Video",
            url: secure_url,
            active: true
        }).save();

        await MainPageVideo.updateMany({_id: {$ne: video._id}}, {active:false});

        return NextResponse.json({
            message:"Video uploaded successfully",
            success: true,
            video
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export async function GET(
    request: NextRequest,
) {
    try {

        const user = await currentUser();

        if(!user){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        if(user?.isAdmin === false){
            return NextResponse.json({error: "Forbidden. You don't have administrator rights."}, {status: 403})
        }

        const video = await MainPageVideo.findOne({active:true});

        return NextResponse.json({
            message:"Video fetch successfully",
            success: true,
            video
        })

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}