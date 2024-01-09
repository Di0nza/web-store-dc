import mongoose, {model, Schema} from 'mongoose'
import {IResetPassword} from "@/types/ResetPasswordToken";

const resetPasswordTokenSchema = mongoose.models.ResetPasswordToken ?
    mongoose.model('ResetPasswordToken') :
    model('ResetPasswordToken', new Schema<IResetPassword>({
        email: String,
        token: String,
        expires: Date,
    }));

export default resetPasswordTokenSchema as mongoose.Model<IResetPassword & Document>;
