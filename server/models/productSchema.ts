import  {Schema, model, Types} from 'mongoose'
import {IProduct} from "../types/product";


const productSchema = new Schema<IProduct>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    sizes: [{ size: String, amount: Number }],
    pictures: [{ picture: String }],
    additionalInformation: [{ title: String, description: String }],
});

const Product = model<IProduct>('Product', productSchema);
export default Product;
