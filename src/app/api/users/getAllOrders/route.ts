import { connect } from "@/db/db";
import Order from "@/models/orderModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
    try {
        const allOrders = await Order.find({});
        return NextResponse.json({
            message: "All orders retrieved successfully",
            orders: allOrders
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
