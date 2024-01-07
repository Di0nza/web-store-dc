import mongoose, {model, Schema} from 'mongoose'
import {IMainPageVideo} from "@/types/MainPageVideo";

const mainPageVideoSchema = mongoose.models.MainPageVideo ?
    mongoose.model('MainPageVideo') :
    model('MainPageVideo', new Schema<IMainPageVideo>({
        title: String,
        url: String,
        active: Boolean,
        uploadedAt: {type: Date, default: Date.now},
    }));

export default mainPageVideoSchema as mongoose.Model<IMainPageVideo & Document>;
