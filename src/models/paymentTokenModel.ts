import mongoose, {model, Schema} from 'mongoose'
import {IPaymentToken} from "@/types/PaymentToken";

const expirationDate = new Date();
expirationDate.setMinutes(expirationDate.getMinutes() + 10);

const paymentTokenSchema = mongoose.models.PaymentToken ?
    mongoose.model('PaymentToken') :
    model('PaymentToken', new Schema<IPaymentToken>({
        userId: String,
        idempotenceKey: String,
        active: {type: Boolean, default: true},
        expiresIn: {type: Date, default: expirationDate},
    }));

export default paymentTokenSchema as mongoose.Model<IPaymentToken & Document>;
