import { connect } from "@/db/db";
import Order from "@/models/orderModel";
import { NextRequest, NextResponse } from "next/server";
import {currentUser} from "@/lib/auth";
import User from "@/models/userModel";

connect();

export async function GET(request: NextRequest) {
    try {

        const user = await currentUser();

        // if(!user){
        //     return NextResponse.json({error: "Unauthorized."}, {status: 401})
        // }
        //
        // const userDB = await User.findById(user.id)
        //
        // if(!userDB){
        //     return NextResponse.json({error: "Unauthorized."}, {status: 401})
        // }
        //
        // if(user?.isAdmin === false){
        //     return NextResponse.json({error: "Forbidden. You don't have administrator rights."}, {status: 403})
        // }

        const allOrders = await Order.find({});
        return NextResponse.json({
            message: "All orders retrieved successfully",
            orders: allOrders
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
