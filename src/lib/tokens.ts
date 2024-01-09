const uuid = require('uuid');
import {getVerificationTokenByEmail} from "@/services/verificationToken";
import VerificationTokenModel from "@/models/verificationTokenModel";
import {getResetPasswordTokenByEmail} from "@/services/resetPasswordToken";
import ResetPasswordTokenModel from "@/models/resetPasswordTokenModel";

export const generateVerificationToken = async (email:string)=>{
    const token = uuid.v4();
    const expires = new Date(new Date().getTime()+3600*1000);
    const existingToken = await getVerificationTokenByEmail(email);
    if(existingToken){
        await VerificationTokenModel.findByIdAndDelete(existingToken.id)
    }
    const verificationToken = await new VerificationTokenModel({
        email,
        token,
        expires
    }).save();

    return verificationToken;
}

export const generateResetPasswordToken = async (email:string)=>{
    const token = uuid.v4();
    const expires = new Date(new Date().getTime()+3600*1000);
    const existingToken = await getResetPasswordTokenByEmail(email);
    if(existingToken){
        await ResetPasswordTokenModel.findByIdAndDelete(existingToken.id)
    }
    const resetPasswordToken = await new ResetPasswordTokenModel({
        email,
        token,
        expires
    }).save();

    return resetPasswordToken;
}