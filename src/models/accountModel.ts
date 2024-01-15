import mongoose from "mongoose";
import {IAccount} from "@/types/Account";

const accountSchema = new mongoose.Schema<IAccount>({

    access_token: {
        type: String,
        required: true,
    },
    id_token: {
        type: String,
        required: true,
    },
    expires_at: {
        type: Date,
        required: true,
    },
    scope: {
        type: String,
        required: true,
    },
    token_type: {
        type: String,
        required: true,
    },
    providerAccountId: {
        type: String,
        required: true,
    },
    provider: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users',
        required: true,
    },
})

const Account = mongoose.models?.accounts || mongoose.model("accounts", accountSchema);

export default Account;
