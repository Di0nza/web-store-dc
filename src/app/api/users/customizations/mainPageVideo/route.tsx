import {NextRequest, NextResponse} from "next/server";
import {ITokenData} from "@/types/TokenData";
import {getDataFromToken} from "@/helpers/getDataFromToken";
import Product from "@/models/productModel";
import MainPageVideo from "@/models/mainPageVideo";

export async function GET(
    request: NextRequest,
) {
    try {

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