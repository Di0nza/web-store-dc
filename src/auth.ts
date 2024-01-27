import NextAuth from "next-auth"
import {MongoDBAdapter} from "@auth/mongodb-adapter";
import authConfig from "@/auth.config";
import clientPromise from "@/lib/mongodb";
import {getAccountById, getUserByEmail, getUserById} from "@/services/users";
import User from "@/models/userModel";


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
            await User.findByIdAndUpdate(user.id, {
                emailVerified: new Date()
            })
        }
    },
    callbacks: {
        async signIn({user, account}) {
            if (account?.provider !== "credentials") {
                return true;
            }

            const existingUser = await getUserById(user.id);

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

            const existingUser = await getUserById(token.sub);

            const account = await getAccountById(token.sub)

            if (!existingUser) return token;

            token.name = existingUser.name;
            token.email = existingUser.email;
            token.isAdmin = existingUser.isAdmin;
            token.emailVerified = existingUser.emailVerified;
            token.isOAuth = !!account;

            return token;
        }
    },
    adapter: MongoDBAdapter(clientPromise),
    session: {strategy: "jwt"},
    ...authConfig
});