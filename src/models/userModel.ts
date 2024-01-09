import mongoose from "mongoose";
import {IUser} from "@/types/User"

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    emailVerified: {
        type: Date,
        default: null
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // accounts: [{
    //    type: mongoose.Schema.Types.ObjectId, ref: 'Account'
    // }],
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
})

const User = mongoose.models?.users || mongoose.model("users", userSchema);

export default User;
