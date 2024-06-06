import {connect} from "@/db/db";
import {NextRequest, NextResponse} from "next/server";
import {currentUser, isAdmin} from "@/lib/auth";
import ArticleCategory from "@/models/articleCategoryModel";
import User from "@/models/userModel";

connect()
export async function GET() {
    try {

        const articleCategories = await ArticleCategory.find();

        const sortedArticleCategories = articleCategories.sort((a,b) => a.name.localeCompare(b.name));


        return NextResponse.json({
            message: "All article categories",
            success: true,
            articleCategories: sortedArticleCategories
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}