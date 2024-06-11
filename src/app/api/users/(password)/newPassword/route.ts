import {NextRequest, NextResponse} from "next/server";
import {getResetPasswordTokenByToken} from "@/services/resetPasswordToken";
import {getUserByEmail} from "@/services/users";
import userModel from "@/models/userModel";
import {NewPasswordSchema} from "@/types/authSchemas";
import bcryptjs from "bcryptjs";
import ResetPasswordTokenModel from "@/models/resetPasswordTokenModel";
import {connect} from "@/db/db";

connect();
/**Вызывается со страницы, на которой уже пишут новый пароль, с токеном в адресной строке*/

export const maxDuration = 59;

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json()

        console.log(reqBody)

        const validateFields = NewPasswordSchema.safeParse(reqBody);

        console.log(validateFields)

        if(!validateFields){
            return NextResponse.json({error: "Некорректные поля"})
        }

        // @ts-ignore
        const {password, token} = validateFields.data;

        const existingToken = await getResetPasswordTokenByToken(token);

        if(!existingToken){
            return NextResponse.json({error: "Токен для восстановления пароля отсутствует или неверен"})
        }

        const hasExpired = new Date(existingToken.expires) < new Date();

        if (hasExpired){
            return NextResponse.json({error: "Токен для восстановления пароля просрочен"});
        }

        const existingUser = await getUserByEmail(existingToken.email)

        if (!existingUser) {
            return NextResponse.json({error: "Пользователь с таким Email не найден"});
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        await userModel.findByIdAndUpdate(existingUser.id, {
            password: hashedPassword
        })

        await ResetPasswordTokenModel.findByIdAndDelete(existingToken.id);

        return NextResponse.json({success: "Пароль изменен"})
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}