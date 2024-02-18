import mongoose, {model, Schema} from 'mongoose'
import {IArticle} from "@/types/Article";

const productSchema = mongoose.models.Article ?
    mongoose.model('Article') :
    model('Article', new Schema<IArticle>({
        title: String,
        category: String,
        backgroundImage: String,
        description: String,
        keywords: String,
        content: String,
        likes: [],
        comments: [],
        views: Number,
        coAuthors: [],
        createdAt: {type: Date, default: Date.now},
    }));

export default productSchema as mongoose.Model<IArticle & Document>;