import {connect} from "@/db/db";
import Messages from "@/models/messageModel";
import {NextRequest, NextResponse} from "next/server";
import {currentUser} from "@/lib/auth";
import User from "@/models/userModel";
connect()

export async function POST(request: NextRequest) {
    try {

        const reqBody = await request.json()
        const {title, message, category, authorsContact, createdAt} = reqBody
        const newMessage = new Messages({title, message, category: category, authorsContact, createdAt});
        const savedMessage = await newMessage.save()
        return NextResponse.json({
            message: "Message created successfully",
            messages: savedMessage
        });
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}
