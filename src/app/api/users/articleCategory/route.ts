import {NextRequest, NextResponse} from "next/server";
import {currentUser, isAdmin} from "@/lib/auth";
import ArticleCategory from "@/models/articleCategoryModel";
import User from "@/models/userModel";
import {IProduct} from "@/types/Product";
import Product from "@/models/productModel";
import {connect} from "@/db/db";

connect();
export const maxDuration = 59;
export async function GET(request: NextRequest) {
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

export async function DELETE(request: NextRequest) {
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

        const reqBody: IProduct = await request.json()
        const {
            id
        } = reqBody;

        console.log(reqBody)

        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({error: "No such product"}, {status: 400})
        }
        const deletedProduct = await Product.findByIdAndDelete(id);
        return NextResponse.json({error: "Product successfully deleted"}, {status: 200})
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}
