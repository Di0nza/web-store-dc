import {NextRequest, NextResponse} from "next/server";
import {ITokenData} from "@/types/TokenData";
import {getDataFromToken} from "@/helpers/getDataFromToken";
import Product from "@/models/productModel";
import MainPageVideo from "@/models/mainPageVideo";

export async function POST(
    request: NextRequest,
) {
    try {

        const tokenData: ITokenData = getDataFromToken(request);
        console.log(tokenData)
        if (tokenData.isAdmin === false) {
            return NextResponse.json({error: "Access denied"}, {status: 403})
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