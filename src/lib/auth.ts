import {auth} from "@/auth";
import {NextResponse} from "next/server";

export const currentUser = async () => {
    const session = await auth();
    return session?.user;
}

export const isAdmin = async () => {
    const session = await auth();
    return session?.user?.isAdmin;
}

// export const checkIsUserAuth = async () => {
//     const session = await auth();
//     if (session?.user) {
//         return NextResponse.json({error: "Unauthorized."}, {status: 401})
//     }
// }