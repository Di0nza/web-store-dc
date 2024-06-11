import ArticleCategory from "@/models/articleCategoryModel";
import {NextRequest, NextResponse} from "next/server";
import {currentUser} from "@/lib/auth";
import User from "@/models/userModel";
import {connect} from "@/db/db";

connect();
export const maxDuration = 59;

export async function DELETE(
    request: NextRequest,
    {params}: { params: { articleCategoryId: string } }
) {
    try {

        const user = await currentUser();

        if (!user) {
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        const userDB = await User.findById(user.id)

        if(!userDB){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        if (user?.isAdmin === false) {
            return NextResponse.json({error: "Forbidden. You don't have administrator rights."}, {status: 403})
        }

        const articleCategory = await ArticleCategory.findByIdAndDelete(params.articleCategoryId);

        if (!articleCategory) {
            return NextResponse.json({error: "No such article category"}, {status: 400})
        }

        return NextResponse.json({
            message: "Article category deleted successfully",
            success: true,
            articleCategory
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}


