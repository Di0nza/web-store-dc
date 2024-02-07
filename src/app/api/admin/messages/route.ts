import {connect} from "@/db/db";
import Messages from "@/models/messageModel";
import {NextRequest, NextResponse} from "next/server";
import {currentUser} from "@/lib/auth";
import User from "@/models/userModel";
connect()


export async function GET(request: NextRequest) {
    try {

        const user = await currentUser();

        if(!user){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        const userDB = await User.findById(user.id)

        if(!userDB){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        if(user?.isAdmin === false){
            return NextResponse.json({error: "Forbidden. You don't have administrator rights."}, {status: 403})
        }

        const allMessages = await Messages.find({});
        return NextResponse.json({
            message: "All Messages retrieved successfully",
            messages: allMessages
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
export async function DELETE(request: NextRequest) {
    try {

        const user = await currentUser();

        if(!user){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        const userDB = await User.findById(user.id)

        if(!userDB){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        if(user?.isAdmin === false){
            return NextResponse.json({error: "Forbidden. You don't have administrator rights."}, {status: 403})
        }

        const reqBody = await request.json()
        const { messageId } = reqBody
        const deletedMessage = await Messages.findByIdAndDelete(messageId)
        if (!deletedMessage) {
            return NextResponse.json({ message: "PromoCode not found" }, { status: 404 })
        }
        return NextResponse.json({
            message: "Message deleted successfully",
            messages: deletedMessage
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
