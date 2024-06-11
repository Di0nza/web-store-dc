import {connect} from "@/db/db";
import Order from "@/models/orderModel";
import {NextRequest, NextResponse} from "next/server";
import {currentUser} from "@/lib/auth";
import User from "@/models/userModel";

export const maxDuration = 59;


export async function PUT(request: NextRequest) {
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

        const reqBody = await request.json();
        const orderId = reqBody.id;
        const { trackingCode, trackingLink } = reqBody;

        const existingOrder = await Order.findById(orderId);
        if (!existingOrder) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        existingOrder.trackingCode = trackingCode;
        existingOrder.trackingLink = trackingLink;

        const updatedOrder = await existingOrder.save();

        return NextResponse.json({
            message: "Tracking information updated successfully",
            updatedOrder
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}





