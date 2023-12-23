import mongoose, {Schema, model} from 'mongoose'
import {IProduct} from "@/types/Product";


const productSchema = mongoose.models.Product ?
    mongoose.model('Product') :
    model('Product', new Schema<IProduct>({
        title: {type: String, required: true},
        description: {type: String, required: true},
        sizes: [{size: String, amount: String}],
        price: {type: String, required: true},
        pictures: [String],
        additionalInformation: [{title: String, description: String}],
    }));

export default productSchema as mongoose.Model<IProduct & Document>;
