import mongoose from "mongoose";

export interface IAccount {
    _id?: string;
    access_token: string;
    id_token: string;
    expires_at: Date;
    scope: string;
    token_type: string;
    providerAccountId: string;
    provider: string;
    type: string;
    userId: mongoose.Schema.Types.ObjectId;
}