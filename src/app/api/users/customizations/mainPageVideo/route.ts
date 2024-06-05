import {NextRequest, NextResponse} from "next/server";
import {ITokenData} from "@/types/TokenData";
import {getDataFromToken} from "@/helpers/getDataFromToken";
import Product from "@/models/productModel";
import MainPageVideo from "@/models/mainPageVideoModel";

export async function GET(
    request: NextRequest,
) {
    try {
        console.log(request)
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