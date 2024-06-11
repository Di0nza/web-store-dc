import {NextRequest, NextResponse} from "next/server";
import {currentUser} from "@/lib/auth";
import User from "@/models/userModel";
import Article from "@/models/articleModel";
import {v2 as cloudinary} from "cloudinary";
import Product from "@/models/productModel";
import ArticleCategory from "@/models/articleCategoryModel";
export const maxDuration = 59;


export async function GET(
    request: NextRequest,
    {params}: { params: { articleId: string } }
) {
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

        const article = await Article.findById(params.articleId);

        if (!article) {
            return NextResponse.json({error: "No such article"}, {status: 400})
        }

        return NextResponse.json({
            message: "Article found successfully",
            success: true,
            article: article
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}


export async function PUT(
    request: NextRequest,
    {params}: { params: { articleId: string } }
) {
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

        const reqBody = await request.json()
        const {
            title,
            categories,
            backgroundImage,
            description,
            keywords,
            content,
            likes,
            comments,
            views,
            coAuthors,
            createdAt
        } = reqBody

        const article = await Article.findById(params.articleId);

        if (!article) {
            return NextResponse.json({error: "No such article"}, {status: 400})
        }

        const updatedArticle = await Article.findByIdAndUpdate(params.articleId, {
            title,
            categories,
            backgroundImage,
            description,
            keywords,
            content,
            likes,
            comments,
            views: article.views,
            coAuthors,
            createdAt
        });

        const oldCategories = article.categories;
        const newCategories = categories;

        const oldCategoriesIds = oldCategories.map(oldCategory => oldCategory._id.toString());
        const newCategoriesIds = newCategories.map(newCategory => newCategory._id.toString());

        let articleCategory;

        for (const oldCategoryId of oldCategoriesIds) {
            if (newCategoriesIds.includes(oldCategoryId)) {

            } else {
                articleCategory = await ArticleCategory.findById(oldCategoryId);
                articleCategory.numberOfArticles = articleCategory.numberOfArticles - 1;
                await articleCategory.save();
            }
        }

        for (const newCategoryId of newCategoriesIds) {
            if (oldCategoriesIds.includes(newCategoryId)) {

            } else {
                articleCategory = await ArticleCategory.findById(newCategoryId);
                articleCategory.numberOfArticles = articleCategory.numberOfArticles + 1;
                await articleCategory.save();
            }
        }

        return NextResponse.json({
            message: "Article updated successfully",
            success: true,
        })

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export async function DELETE(
    request: NextRequest,
    {params}: { params: { articleId: string } }
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

        const article = await Article.findByIdAndDelete(params.articleId);

        if (!article) {
            return NextResponse.json({error: "No such article"}, {status: 400})
        }

        return NextResponse.json({
            message: "Article deleted successfully",
            success: true
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}
