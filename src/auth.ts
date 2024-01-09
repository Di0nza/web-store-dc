import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import {MongoDBAdapter} from "@auth/mongodb-adapter";
import authConfig from "@/auth.config";
import clientPromise from "@/lib/mongodb";
import {getUserById} from "@/services/users";
import User from "@/models/userModel";




export const {
    handlers: {GET, POST},
    auth,
    signIn,
    signOut,
} = NextAuth({
    pages:{
      signIn:"/login",
      error:"/error",
    },
    events:{
        async linkAccount({user}){
            await User.findByIdAndUpdate(user.id, {
                emailVerified: new Date()
            })
        }
    },
    callbacks: {
        async signIn({user, account}){
            if(account?.provider !== "credentials"){
                return true;
            }

            const existingUser = await getUserById(user.id);

            if (!existingUser?.emailVerified) return false;

            return true;
        },
        async session({token, session}) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            if ((token.isAdmin === false || token.isAdmin === true) && session.user) {
                session.user.isAdmin = token.isAdmin as boolean;
            }
            if (token.emailVerified && session.user) {
                session.user.emailVerified = token.emailVerified;
            }
            return session;
        },
        async jwt({token}) {
            if (!token.sub) return token

            const existingUser = await getUserById(token.sub);

            if (!existingUser) return token;

            token.isAdmin = existingUser.isAdmin;

            return token;
        }
    },
    adapter: MongoDBAdapter(clientPromise),
    session: {strategy: "jwt"},
    ...authConfig,
});