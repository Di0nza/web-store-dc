import {connect} from "@/db/db";
import {NextRequest, NextResponse} from "next/server";
import {ITokenData} from "@/types/TokenData";
import {getDataFromToken} from "@/helpers/getDataFromToken";
import MainPagePhoto from "@/models/mainPagePhotoModel";
import {currentUser, isAdmin} from "@/lib/auth";
import User from "@/models/userModel";

export const maxDuration = 59;

export async function PATCH(
    request: NextRequest,
    {params}: { params: { mainPagePhotoId: string } }
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

        const photoToUpdate = await MainPagePhoto.findById(params.mainPagePhotoId);

        photoToUpdate.active = !photoToUpdate.active;

        const photo = await photoToUpdate.save();

        if (!photo) {
            return NextResponse.json({error: "No such video"}, {status: 400})
        }

        return NextResponse.json({
            message: "Photo array updated successfully",
            success: true,
            photo
        })

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export async function DELETE(
    request: NextRequest,
    {params}: { params: { mainPagePhotoId: string } }
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

        const photo = await MainPagePhoto.findByIdAndDelete(params.mainPagePhotoId);

        if (!photo) {
            return NextResponse.json({error: "No such photo"}, {status: 400})
        }

        return NextResponse.json({
            message:"Photo deleted successfully",
            success: true
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

