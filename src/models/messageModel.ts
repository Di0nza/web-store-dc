import mongoose, {model, Schema} from 'mongoose'
import {IMessages} from "@/types/Messages";

const messagesSchema = mongoose.models.Messages ?
    mongoose.model('Messages') :
    model('Messages', new Schema<IMessages>({
        title: String,
        message: String,
        category: String,
        authorsContact: String,
        createdAt: {type: Date, default: Date.now},
    }));

export default messagesSchema as mongoose.Model<IMessages & Document>;
