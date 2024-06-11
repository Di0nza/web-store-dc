import {NextRequest, NextResponse} from "next/server";
import {currentUser} from "@/lib/auth";
import User from "@/models/userModel";
import Order from "@/models/orderModel";
export const maxDuration = 59;

export async function GET(
    request: NextRequest,
    {params}: { params: { orderId: string } }
) {
    try {

        const user = await currentUser();

        if (!user) {
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        const userDB = await User.findById(user.id)

        if(!userDB){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        const order = await Order.findById(params.orderId);
        //console.log(product)

        if(order.email !== userDB.email){
            return NextResponse.json({error: "Forbidden. You do not have access to this page."})
        }

        if (!order) {
            return NextResponse.json({error: "No such order"}, {status: 400})
        }

        //console.log(product)

        return NextResponse.json({
            message: "Order found successfully",
            success: true,
            order
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

