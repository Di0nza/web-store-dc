import {NextRequest, NextResponse} from "next/server";
import MainPageVideo from "@/models/mainPagePhotoModel";
import {ITokenData} from "@/types/TokenData";
import {getDataFromToken} from "@/helpers/getDataFromToken";
import MainPagePhoto from "@/models/mainPagePhotoModel";
import {currentRole} from "@/lib/auth";

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

        const photo = await new MainPagePhoto({
            url: secure_url,
            active: true
        }).save();

        return NextResponse.json({
            message:"Photo uploaded successfully",
            success: true,
            photo
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export async function GET(
    request: NextRequest,
) {
    try {

        const photos = await MainPagePhoto.find();

        console.log(photos)

        return NextResponse.json({
            message:"Photos fetch successfully",
            success: true,
            photos
        })

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}