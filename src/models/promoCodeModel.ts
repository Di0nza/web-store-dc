import mongoose, {model, Schema} from 'mongoose'
import {IPromoCode} from "@/types/PromoCode";

const productSchema = mongoose.models.PromoCode ?
    mongoose.model('PromoCode') :
    model('PromoCode', new Schema<IPromoCode>({
        title: String,
        value: String,
        isValid: Boolean,
    }));

export default productSchema as mongoose.Model<IPromoCode & Document>;
