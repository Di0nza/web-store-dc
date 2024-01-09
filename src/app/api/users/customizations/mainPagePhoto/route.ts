import {NextRequest, NextResponse} from "next/server";
import MainPagePhoto from "@/models/mainPagePhotoModel";

export async function GET(
    request: NextRequest,
) {
    try {

        const photos = await MainPagePhoto.find({active:true});

        //console.log(photos)
        return NextResponse.json({
            message:"Video fetch successfully",
            success: true,
            photos
        })

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}