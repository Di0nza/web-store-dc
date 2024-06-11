import {NextRequest, NextResponse} from "next/server";
import {currentUser} from "@/lib/auth";
import NewCollection from "@/models/newCollectionModel";
import * as z from "zod";
import {IProduct} from "@/types/Product";
import Product from "@/models/productModel";
import User from "@/models/userModel";
import {connect} from "@/db/db";

connect();


const NewCollectionSchema = z.object({
    title: z.string().min(1, {
        message: "Введите название коллекции",
    }),
    videoUrl: z.optional(z.string().min(1, {
    })),
    active: z.boolean(),
});

export const maxDuration = 59;

export async function PATCH(
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


        const reqBody = await request.json()
        const validateFields = NewCollectionSchema.safeParse(reqBody);
        console.log(reqBody);
        if (!validateFields.success) {
            return NextResponse.json({error: "Неправильные поля"})
        }

        const {title, videoUrl, active} = validateFields.data;

        const collection = await NewCollection.findOne();

        if (!collection) {
            return NextResponse.json({error: "No such collection"}, {status: 400})
        }

        collection.title = title;
        collection.videoUrl = videoUrl;
        collection.active = active;
        collection.updatedAt = new Date();

        const newCollection = await collection.save();

        return NextResponse.json({
            message: "New active video updated successfully",
            success: true,
            newCollection
        })

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export async function GET(){
    try{

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

        const newCollection = await NewCollection.findOne();

        return NextResponse.json({
            message: "New collection",
            success: true,
            newCollection
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}