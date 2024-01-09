import {NextResponse} from "next/server";
import {signOut} from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect";

export async function GET() {
    try {
        const response = NextResponse.json(
            {
                message: "Logout successful",
                success: true,
            }
        )
        try {
            await signOut();
        }catch (e){
            console.log(e.message)
        }
        return response;
    } catch (error: any) {
        return NextResponse.json({error: error}, {status: 500});
    }
}
