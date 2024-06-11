import {NextRequest, NextResponse} from "next/server";
import {currentUser} from "@/lib/auth";
import User from "@/models/userModel";
import ArticleCategory from "@/models/articleCategoryModel";
import Article from "@/models/articleModel";
import {connect} from "@/db/db";

connect();
export const maxDuration = 59;


export async function GET(
    request: NextRequest,
    {params}: { params: { articleCategoryId: string } }
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

        console.log(params.articleCategoryId)

        const articles = await Article.find({ 'categories._id': { $in: [params.articleCategoryId] } });


        // @ts-ignore
        const sortedArticles = articles.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))

        return NextResponse.json({
            message: "Article fetched successfully",
            article: sortedArticles
        });
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}