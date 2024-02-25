import {connect} from "@/db/db";
import {NextRequest, NextResponse} from "next/server";
import {currentUser, isAdmin} from "@/lib/auth";
import ArticleCategory from "@/models/articleCategoryModel";
import User from "@/models/userModel";

connect()
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