import mongoose, {model, Schema} from 'mongoose'

const ObjectId = mongoose.Schema.Types.ObjectId;
import {IArticle} from "@/types/Article";

const productSchema = mongoose.models.Article ?
    mongoose.model('Article') :
    model('Article', new Schema<IArticle>({
        title: String,
        categories: [],
        backgroundImage: String,
        description: String,
        keywords: [],
        content: String,
        likes: Number,
        comments: [],
        views: Number,
        coAuthors: [],
        createdAt: {type: Date, default: Date.now},
    }));

export default productSchema as mongoose.Model<IArticle & Document>;