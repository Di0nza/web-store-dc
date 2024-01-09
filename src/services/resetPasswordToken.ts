import ResetPasswordToken from "@/models/resetPasswordTokenModel";
import {connect} from "@/db/db";
connect();

export const getResetPasswordTokenByEmail = async (email:string) => {
    try{
        return await ResetPasswordToken.findOne({email});
    }catch{
        return null;
    }
}

export const getResetPasswordTokenByToken = async (token:string) => {
    try{
        return await ResetPasswordToken.findOne({token});
    }catch{
        return null;
    }
}