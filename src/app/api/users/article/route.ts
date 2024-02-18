import {NextRequest, NextResponse} from "next/server";
import {currentUser} from "@/lib/auth";
import User from "@/models/userModel";
import Article from "@/models/articleModel";

export async function GET(request: NextRequest) {
    try {
        const user = await currentUser();
        // if(!user){
        //     return NextResponse.json({error: "Unauthorized."}, {status: 401})
        // }
        // const userDB = await User.findById(user.id)
        //
        // if(!userDB){
        //     return NextResponse.json({error: "Unauthorized."}, {status: 401})
        // }
        const allArticles = await Article.find({});
        return NextResponse.json({
            message: "All allArticles retrieved successfully",
            article: allArticles
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}