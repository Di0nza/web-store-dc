import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

import {LoginSchema} from "@/types/authSchemas";
import {getUserByEmail} from "@/services/users";
import bcryptjs from "bcryptjs";
import {db} from "@/lib/db";

export default {
    trustHost: true,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            async authorize(credentials){
                try {
                    const validateFields = LoginSchema.safeParse(credentials);
                    if (validateFields.success) {
                        const {email, password} = validateFields.data;
                        console.log("Я тут", email, password);
                        const user = await db.user.findUnique({ where: { email } });
                        if (!user || !user?.password) {
                            return null;
                        }

                        const validPassword = await bcryptjs.compare(password, user?.password)
                        if (validPassword) {
                            return user;
                        }
                    }
                    return null;
                }catch (e){
                    console.log(e.message)
                }

            }
        })
    ],
    secret: "6b50f23c169987e10b348b18479312c8",
} satisfies NextAuthConfig