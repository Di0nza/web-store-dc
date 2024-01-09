import User from "@/models/userModel";
import {connect} from "@/db/db";
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