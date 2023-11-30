import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import {ITokenData} from "../types/TokenData";
import {json} from "stream/consumers";

export const getDataFromToken = (request:NextRequest):ITokenData => {
    try {
        const token = request.cookies.get("token")?.value || '';
        const decodedToken:ITokenData = jwt.verify(token, process.env.TOKEN_SECRET!) as ITokenData;
        return decodedToken;
    } catch (error: any) {
        throw new Error(error.message);
    }

}