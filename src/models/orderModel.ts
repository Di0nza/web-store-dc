import mongoose, {model, Schema} from 'mongoose'
import {IOrder} from "@/types/Order";

// @ts-ignore
const productSchema = mongoose.models.Order ?
    mongoose.model('Order') :
    model('Order', new Schema<IOrder>({
        name: String,
        email: String,
        telephone: String,
        zip: String,
        city: String,
        country: String,
        house: String,
        apartment: String,
        street: String,
        additionalInformation: String,
        deliveryMethod: String,
        paymentState: String,
        paymentInfo: {
            id: String,
            created_at: Date,
        },
        promotionalCode: String,
        orderStatus: [],
        totalCost: Number,
        totalNumber: Number,
        createdBy: String,
        createdAt: {type: Date, default: Date.now},
        products: [],
        trackingCode: String,
        trackingLink: String,
    }));

export default productSchema as mongoose.Model<IOrder & Document>;
