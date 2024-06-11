import { connect } from "@/db/db";
import Order from "@/models/orderModel";
import { NextRequest, NextResponse } from "next/server";
import {currentUser} from "@/lib/auth";
import User from "@/models/userModel";

export const maxDuration = 59;

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

        const allOrders = await Order.find({email: userDB.email});

        return NextResponse.json({
            message: "All orders retrieved successfully",
            orders: allOrders
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
