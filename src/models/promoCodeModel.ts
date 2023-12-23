import mongoose, {model, Schema} from 'mongoose'
import {IPromoCode} from "@/types/PromoCode";

const promoCodeSchema = mongoose.models.PromoCode ?
    mongoose.model('PromoCode') :
    model('PromoCode', new Schema<IPromoCode>({
        title: String,
        value: String,
        isValid: Boolean,
    }));

export default promoCodeSchema as mongoose.Model<IPromoCode & Document>;
