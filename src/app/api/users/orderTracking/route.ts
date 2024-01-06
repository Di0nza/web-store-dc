import {connect} from "@/db/db";
import Order from "@/models/orderModel";
import {NextRequest, NextResponse} from "next/server";
connect()

export async function PUT(request: NextRequest) {
    try {
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





