import {NextRequest, NextResponse} from "next/server";
import {currentUser} from "@/lib/auth";
import User from "@/models/userModel";
import Article from "@/models/articleModel";
import ArticleCategory from "@/models/articleCategoryModel";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
    try {

        const user = await currentUser();

        if(!user){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        const userDB = await User.findById(user.id)

        if(!userDB){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }


        const reqBody = await request.json()
        const {comment, articleId} = reqBody

        const article = await Article.findById(articleId);

        if(!article){
            return NextResponse.json({error: "No such article"}, {status: 400})
        }

        const newObjectId = new mongoose.Types.ObjectId();

        article.comments.push({
            _id: newObjectId,
            comment: comment,
            username: user.name,
            image: user.image,
            createdAt: new Date()
        })

        await article.save();

        return NextResponse.json({
            message: "Comment created successfully",
        });
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}