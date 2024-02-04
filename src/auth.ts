import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config";
import clientPromise from "@/lib/mongodb";
import User from "@/models/userModel";
import {db} from "@/lib/db";


// @ts-ignore
export const {
    handlers: {GET, POST},
    auth,
    signIn,
    signOut,
} = NextAuth({
    pages: {
        signIn: "/login",
        error: "/error",
    },
    events: {
        async linkAccount({user}) {
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() }
            })
        }
    },
    callbacks: {
        async signIn({user, account}) {
            if (account?.provider !== "credentials") {
                return true;
            }

            const id = user.id;

            const existingUser  = await db.user.findUnique({ where: { id } });

            if (!existingUser?.emailVerified) return false;

            return true;
        },
        async session({session, token} : { session: any; token?: any }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            if ((token.isAdmin === false || token.isAdmin === true) && session.user) {
                session.user.isAdmin = token.isAdmin as boolean;
            }
            if (token.emailVerified && session.user) {
                session.user.emailVerified = token.emailVerified as Date;
            }
            if (session.user) {
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.isOAuth = token.isOAuth as boolean;
            }
            return session;
        },
        async jwt({token}) {
            if (!token.sub) return token

            const id = token.sub;

            const existingUser  = await db.user.findUnique({ where: { id } });

            const account = await db.account.findFirst({
                where: { id }
            });

            if (!existingUser) return token;

            token.name = existingUser.name;
            token.email = existingUser.email;
            token.isAdmin = existingUser.isAdmin;
            token.emailVerified = existingUser.emailVerified;
            token.isOAuth = !!account;

            return token;
        }
    },
    adapter: PrismaAdapter(db),
    session: {strategy: "jwt"},
    ...authConfig
});