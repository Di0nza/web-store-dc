import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import {
    DEFAULT_USER_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publicRoutes,
    adminRoutes,
    DEFAULT_ADMIN_LOGIN_REDIRECT,
    adminEmails,
    apiAdminPrefix,
    storePrefix,
    apiPublicProductPrefix,
} from "@/routes";
import {NextResponse} from "next/server";
import {isAdmin} from "@/lib/auth";

const {auth} = NextAuth(authConfig);

export default auth(async (req) => {
    const {nextUrl} = req;
    // console.log("ROUTE:", nextUrl.pathname)
    const isLoggedIn = !!req.auth;
    const isAdmin = adminEmails.includes(req.auth?.user?.email);

    //console.log("АДМИН:", isAdmin)

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isApiAdminRoute = nextUrl.pathname.startsWith(apiAdminPrefix);
    const isApiPublicProductRoute = nextUrl.pathname.startsWith(apiPublicProductPrefix);

    // const isApiPublicRoute = nextUrl.pathname.startsWith(apiPublicPrefix);

    const isStore = nextUrl.pathname.startsWith(storePrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAdminRoute = adminRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute) {
        return null;
    }
    //
    if (isAuthRoute) {
        if (isLoggedIn) {

            if(isAdmin === true){
                return NextResponse.redirect(new URL(DEFAULT_ADMIN_LOGIN_REDIRECT, nextUrl));
            }
            return NextResponse.redirect(new URL(DEFAULT_USER_LOGIN_REDIRECT, nextUrl));
        }
        return null;
    }

    if (!isLoggedIn && !isPublicRoute && !isStore && !isApiPublicProductRoute){
        return NextResponse.redirect(new URL("/login", nextUrl));
    }

    if (isAdminRoute || isApiAdminRoute){
        if(!isLoggedIn){
            return NextResponse.redirect(new URL("/login", nextUrl));
        }
        if(!isAdmin){
            return NextResponse.redirect(new URL("/", nextUrl));
        }
        return null;
    }

    return null;
})

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}