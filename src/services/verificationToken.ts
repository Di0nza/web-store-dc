import VerificationToken from "@/models/verificationTokenModel";
import {connect} from "@/db/db";
connect();

export const getVerificationTokenByEmail = async (email:string) => {
    try{
        return await VerificationToken.findOne({email});
    }catch{
        return null;
    }
}

export const getVerificationTokenByToken = async (token:string) => {
    try{
        return await VerificationToken.findOne({token});
    }catch{
        return null;
    }
}