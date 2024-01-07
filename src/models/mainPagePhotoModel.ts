import mongoose, {model, Schema} from 'mongoose'
import {IMainPagePhoto} from "@/types/MainPagePhoto";

const mainPagePhotoSchema = mongoose.models.MainPagePhoto ?
    mongoose.model('MainPagePhoto') :
    model('MainPagePhoto', new Schema<IMainPagePhoto>({
        url: String,
        active: Boolean,
        uploadedAt: {type: Date, default: Date.now},
    }));

export default mainPagePhotoSchema as mongoose.Model<IMainPagePhoto & Document>;
