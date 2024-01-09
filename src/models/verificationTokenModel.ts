import mongoose, {model, Schema} from 'mongoose'
import {IVerificationToken} from "@/types/VerificationToken";

const verificationTokenSchema = mongoose.models.VerificationToken ?
    mongoose.model('VerificationToken') :
    model('VerificationToken', new Schema<IVerificationToken>({
        email: String,
        token: String,
        expires: Date,
    }));

export default verificationTokenSchema as mongoose.Model<IVerificationToken & Document>;
