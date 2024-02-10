import { connect } from "@/db/db";
import Order from "@/models/orderModel";
import { NextRequest, NextResponse } from "next/server";
import {currentUser} from "@/lib/auth";
import User from "@/models/userModel";

connect();

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

        if (user?.isAdmin === false) {
            return NextResponse.json({error: "Forbidden. You don't have administrator rights."}, {status: 403})
        }

        const allOrders = await Order.find();

        return NextResponse.json({
            message: "All orders retrieved successfully",
            orders: allOrders
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

interface IParams {
    orderId?: string;
}


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
        const existingOrder = await Order.findById(orderId);
        if (!existingOrder) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }
        const { title, createdDate } = reqBody;
        const statusToUpdate = existingOrder.orderStatus.find(status => status.title === title);

        if (!statusToUpdate) {
            return NextResponse.json({ message: "Status not found" }, { status: 404 });
        }
        statusToUpdate.createdDate = createdDate;
        statusToUpdate.selected = true;
        let updated = false;
        for (let i = existingOrder.orderStatus.indexOf(statusToUpdate) - 1; i >= 0; i--) {
            if (!existingOrder.orderStatus[i].selected && !existingOrder.orderStatus[i].createdDate) {
                existingOrder.orderStatus[i].createdDate = createdDate;
                existingOrder.orderStatus[i].selected = true;
                updated = true;
            } else {
                break;
            }
        }
        existingOrder.markModified('orderStatus');
        const updatedOrder = await existingOrder.save();

        return NextResponse.json({
            message: "Order updated successfully",
            updatedOrder
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
        const { orderId } = reqBody
        const deletedOrder = await Order.findByIdAndDelete(orderId)
        if (!deletedOrder) {
            return NextResponse.json({ message: "PromoCode not found" }, { status: 404 })
        }
        return NextResponse.json({
            message: "Order deleted successfully",
            promo: deletedOrder
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}


