import {connect} from "@/db/db";
import Product from "@/models/productModel";
import {NextRequest, NextResponse} from "next/server";
import {IProduct} from "@/types/Product";
import {ITokenData} from "@/types/TokenData";
import {getDataFromToken} from "@/helpers/getDataFromToken";
import MainPageVideo from "@/models/mainPageVideo";


export async function PATCH(
    request: NextRequest,
    {params}: { params: { mainPageVideoId: string } }
) {
    try {

        const tokenData: ITokenData = getDataFromToken(request);
        console.log(tokenData)

        if (tokenData.isAdmin == false) {
            return NextResponse.json({error: "Access denied"}, {status: 403})
        }

        const video = await MainPageVideo.findByIdAndUpdate(params.mainPageVideoId, {
            active:true
        });

        await MainPageVideo.updateMany({_id: {$ne: video._id}}, {active:false});

        if (!video) {
            return NextResponse.json({error: "No such video"}, {status: 400})
        }


        return NextResponse.json({
            message: "New active video updated successfully",
            success: true,
        })

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export async function DELETE(
    request: NextRequest,
    {params}: { params: { mainPageVideoId: string } }
) {
    try {
        const tokenData: ITokenData = getDataFromToken(request);
        console.log(tokenData)
        if (tokenData.isAdmin === false) {
            return NextResponse.json({error: "Access denied"}, {status: 403})
        }

        const video = await Product.findByIdAndDelete(params.mainPageVideoId);

        if (!video) {
            return NextResponse.json({error: "No such product"}, {status: 400})
        }

        return NextResponse.json({
            message:"Product deleted successfully",
            success: true
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

