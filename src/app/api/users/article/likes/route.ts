import {NextRequest, NextResponse} from "next/server";
import Article from "@/models/articleModel";
import {IArticle} from "@/types/Article";

enum OptionsType { LIKE = "ADD", UNLIKE = "DEL"}

export async function POST(request: NextRequest) {
    try {

        const reqBody = await request.json()
        const {id, option} = reqBody;

        console.log(reqBody)

        // const user = await currentUser();
        //
        // const userDB = await User.findById(user?.id)
        //
        // if(!userDB){
        //     return NextResponse.json({error: "Unauthorized."}, {status: 401})
        // }

        const article = await Article.findById(id);

        if (!article) {
            return NextResponse.json({error: "No such article"}, {status: 400});
        }

        if(option === OptionsType.LIKE){
            article.likes +=1;
        }else if (option === OptionsType.UNLIKE){
            article.likes -=1;
        }

        await article.save();

        return NextResponse.json({
            message: "Likes updated successfully",
            success: true
        })

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}