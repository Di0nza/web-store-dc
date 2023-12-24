import mongoose, {Schema, model} from 'mongoose'
import {IProduct} from "@/types/Product";


const productSchema = mongoose.models.Product ?
    mongoose.model('Product') :
    model('Product', new Schema<IProduct>({
        title: {type: String, required: true},
        description: {type: String, required: true},
        category: {type: String, required: true},
        price: {type: String, required: true},
        favorites: {type: Number, default: 0},
        views: {type: Number, default: 0},
        sizes: [{size: String, amount: String}],
        pictures: [String],
        additionalInformation: [{title: String, description: String}],
    }));

export default productSchema as mongoose.Model<IProduct & Document>;
