import mongoose, {model, Schema} from 'mongoose'
import {IArticleCategory} from "@/types/ArticleCategory";

const articleCategorySchema = mongoose.models.ArticleCategory ?
    mongoose.model('ArticleCategory') :
    model('ArticleCategory', new Schema<IArticleCategory>({
        name: String,
        numberOfArticles: {type: Number, default: 0},
    }));

export default articleCategorySchema as mongoose.Model<IArticleCategory & Document>;
