import User from "@/models/userModel";
import {connect} from "@/db/db";
import Account from "@/models/accountModel";
import mongoose from "mongoose";

connect();

export const getUserByEmail = async (email:string) => {
    try{
        return await User.findOne({email});
    }catch{
        return null;
    }
}

export const getUserById = async (id:string) => {
    try{
        return await User.findById(id);
    }catch{
        return null;
    }
}

export const getAccountById = async (userId:string) => {
    try{
        // @ts-ignore
        return await Account.findOne({userId: new mongoose.Types.ObjectId(userId)});
    }catch{
        return null;
    }
}