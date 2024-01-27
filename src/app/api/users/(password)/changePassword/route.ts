import {NextRequest, NextResponse} from "next/server";
import {ChangePasswordSchema, NewPasswordSchema} from "@/types/authSchemas";
import {getResetPasswordTokenByToken} from "@/services/resetPasswordToken";
import {getUserByEmail} from "@/services/users";
import userModel from "@/models/userModel";
import ResetPasswordTokenModel from "@/models/resetPasswordTokenModel";
import User from "@/models/userModel";
import {currentUser} from "@/lib/auth";
import bcryptjs from "bcryptjs";

/**Вызывается из профиля пользователя, когда она залогинен*/

export async function POST(request:NextRequest) {
    try {

        const user = await currentUser();


        if(!user){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        if(user.isAdmin === undefined){
            return NextResponse.json({error: "Forbidden."}, {status: 403})
        }

        const userDB = await User.findById(user.id)

        if(!userDB){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        const reqBody = await request.json()

        console.log(reqBody)

        const validateFields = ChangePasswordSchema.safeParse(reqBody);

        console.log(validateFields)

        if(!validateFields.success){
            return NextResponse.json({error: "Некорректные поля"})
        }

        const {password, newPassword} = validateFields.data;

        let passwordMatch = false;

        if(password && newPassword && userDB.password){
            passwordMatch = await bcryptjs.compare(
                password,
                userDB.password
            )
        }

        if(!passwordMatch){
            return NextResponse.json({error:"Неверный пароль"})
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(newPassword, salt)

        await userModel.findByIdAndUpdate(userDB.id, {
            password: hashedPassword
        })

        return NextResponse.json({success: "Пароль изменен"})
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}