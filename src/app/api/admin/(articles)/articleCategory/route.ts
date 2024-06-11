import {NextRequest, NextResponse} from "next/server";
import {currentUser, isAdmin} from "@/lib/auth";
import ArticleCategory from "@/models/articleCategoryModel";
import User from "@/models/userModel";
import {connect} from "@/db/db";

connect();
export const maxDuration = 59;


export async function POST(request: NextRequest) {
    try {

        const user = await currentUser();

        if (!user) {
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        const userDB = await User.findById(user.id)

        if (!userDB) {
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        if (user?.isAdmin === false) {
            return NextResponse.json({error: "Forbidden. You don't have administrator rights."}, {status: 403})
        }

        const reqBody = await request.json();

        const {name} = reqBody;

        const articleCategoryCandidate = await ArticleCategory.findOne({name: name});

        if(articleCategoryCandidate){
            return NextResponse.json({error: "Такая категория уже есть"}, {status: 200})
        }

        const newArticleCategory = new ArticleCategory({name})

        const savedArticleCategory = await newArticleCategory.save();

        return NextResponse.json({
            message: "Article category created successfully",
            success: true,
            savedArticleCategory
        })

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export async function GET() {
    try {

        const user = await currentUser();

        if (!user) {
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        const userDB = await User.findById(user.id)

        if (!userDB) {
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        if (user?.isAdmin === false) {
            return NextResponse.json({error: "Forbidden. You don't have administrator rights."}, {status: 403})
        }

        const articleCategories = await ArticleCategory.find();

        return NextResponse.json({
            message: "All article categories",
            success: true,
            articleCategories
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}