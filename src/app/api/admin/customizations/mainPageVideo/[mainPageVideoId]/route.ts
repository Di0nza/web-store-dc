import {connect} from "@/db/db";
import Product from "@/models/productModel";
import {NextRequest, NextResponse} from "next/server";
import {IProduct} from "@/types/Product";
import {ITokenData} from "@/types/TokenData";
import {getDataFromToken} from "@/helpers/getDataFromToken";
import MainPageVideo from "@/models/mainPageVideoModel";
import {currentUser, isAdmin} from "@/lib/auth";
import User from "@/models/userModel";


export async function PATCH(
    request: NextRequest,
    {params}: { params: { mainPageVideoId: string } }
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

        const video = await MainPageVideo.findByIdAndUpdate(params.mainPageVideoId, {
            active:true
        });

        if (!video) {
            return NextResponse.json({error: "No such video"}, {status: 400})
        }

        await MainPageVideo.updateMany({_id: {$ne: video._id}}, {active:false});

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

        const video = await MainPageVideo.findByIdAndDelete(params.mainPageVideoId);

        if (!video) {
            return NextResponse.json({error: "No such video"}, {status: 400})
        }

        return NextResponse.json({
            message:"Video deleted successfully",
            success: true
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

