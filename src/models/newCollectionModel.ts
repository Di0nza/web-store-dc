import mongoose, {model, Schema} from 'mongoose'
import {INewCollection} from "@/types/NewCollection";

const newCollectionSchema = mongoose.models.NewCollection ?
    mongoose.model('NewCollection') :
    model('NewCollection', new Schema<INewCollection>({
        title: String,
        videoUrl: String,
        active: Boolean,
        updatedAt: {type: Date, default: Date.now},
    }));

export default newCollectionSchema as mongoose.Model<INewCollection & Document>;
