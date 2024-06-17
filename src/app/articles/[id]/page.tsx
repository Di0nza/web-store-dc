import {Metadata} from "next";
import '../../profile/profileStyles.css'
import {NextResponse} from "next/server";
import Article from "@/models/articleModel";
import {IArticle} from "@/types/Article";
import '@/styles/text-editor.css';
import ArticleContainer from "@/components/ArticleContainer";
import {connect} from "@/db/db";

connect();

type Props = {
    params: {
        id: any;
    }
};

export const maxDuration = 59;

export async function generateMetadata({params: {id}}: Props): Promise<Metadata> {
    const article = await getArticleById(id) as IArticle;

    return {
        title:`MariDenizDesign | ${article?.title}`,
        description: article?.description,
        keywords: article?.keywords,
        openGraph: {
            images: article?.backgroundImage,
        },
        icons: 'https://res.cloudinary.com/dzdmstsam/image/upload/v1718646289/Letter_-_126_x8fpma.png',
    }
}

async function getArticleById(id){
    try {

        const article = await Article.findById(id);
        if (!article) {
            return NextResponse.json({error: "No such product"}, {status: 400})
        }
        article.views += 1;
        const updatedArticle = await article.save();
        console.log(article)
        let resultArticle;
        if(updatedArticle){
            resultArticle = article.toObject();
        }else{
            return NextResponse.json({error: "No such product"}, {status: 400})
        }
        console.log("RESULT",resultArticle)
        return article;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return null;
    }
}

export default async function oneArticle({params: {id}}: Props) {
    const article = await getArticleById(id);
    console.log(article);
    return (
        <div className='product-store-container'>
            {article && <ArticleContainer article={article} />}
        </div>
    )
}