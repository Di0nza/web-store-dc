import {NextRequest, NextResponse} from "next/server";
import {currentUser} from "@/lib/auth";
import User from "@/models/userModel";
import Article from "@/models/articleModel";

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

        if(user?.isAdmin === false){
            return NextResponse.json({error: "Forbidden. You don't have administrator rights."}, {status: 403})
        }

        const reqBody = await request.json()
        const {title, category, backgroundImage, description, keywords, content, likes, comments, views, coAuthors, createdAt} = reqBody
        const newArticle = new Article({title, category, backgroundImage, description, keywords, content, likes, comments, views, coAuthors, createdAt});
        const savedArticle = await newArticle.save()
        return NextResponse.json({
            message: "Article created successfully",
            article: savedArticle
        });
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}