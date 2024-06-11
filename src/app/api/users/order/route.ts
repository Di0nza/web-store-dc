import {connect} from "@/db/db";
import Order from "@/models/orderModel";
import Product from "@/models/productModel"
import {NextRequest, NextResponse} from "next/server";
import {currentUser} from "@/lib/auth";
import User from "@/models/userModel";
import {sendOrderConfirmationEmail} from "@/lib/mail";
export const maxDuration = 59;


export async function POST(request: NextRequest) {
    try {
        const user = await currentUser();
        if(!user){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }
        const userDB = await User.findById(user.id)
        if(!userDB){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }
        const reqBody = await request.json()
        const {
            name,
            email,
            telephone,
            products,
            zip,
            city,
            country,
            street,
            additionalInformation,
            deliveryMethod,
            paymentState,
            paymentInfo,
            promotionalCode,
            house,
            apartment,
            orderStatus,
            totalCost,
            totalNumber,
            createdBy,
            createdAt,
            trackingCode,
            trackingLink,
        } = reqBody

        if(user.email !== email){
            return NextResponse.json({error: "Forbidden. You don't have this rights."}, {status: 403})
        }
        console.log(reqBody);
        const newOrder = new Order({
            name,
            email,
            telephone,
            products,
            zip,
            city,
            country,
            house,
            apartment,
            street,
            additionalInformation,
            deliveryMethod,
            paymentState,
            paymentInfo,
            promotionalCode,
            orderStatus,
            totalCost,
            totalNumber,
            createdBy,
            createdAt,
            trackingCode,
            trackingLink
        })
        const savedOrder = await newOrder.save()
        console.log(savedOrder);
        let sizeToDec;
        let prod;
        for (let i = 0; i < products.length; i++) {
            sizeToDec = products[i].size;
            prod = await Product.findById(products[i].id);
            const sizeIndex = prod.sizes.findIndex((size) => size.size === sizeToDec);
            if (sizeIndex !== -1) {
                prod.sizes[sizeIndex].amount = parseInt(prod.sizes[sizeIndex].amount) - 1;
                await prod.save();
            }
        }
        await sendOrderConfirmationEmail(email, {
            name,
            products,
            zip,
            city,
            country,
            street,
            house,
            apartment,
            totalCost,
            promotionalCode,
            orderStatus,
            trackingCode,
            trackingLink,
            deliveryMethod,
            createdAt,
        });
        return NextResponse.json({
            message: "Order created successfully",
            savedOrder
        });
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
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

        const reqBody = await request.json()
        const { orderId } = reqBody
        const order = await Order.findById(orderId)

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 })
        }

        if(order.email !== userDB.email){
            return NextResponse.json({error: "Forbidden. You do not have access to this action."}, {status: 403});
        }

        if(order.orderStatus.slice().reverse().find(status => status.selected)?.title !== "Получен покупателем"){
            return NextResponse.json({error: "Forbidden. You do not have access to this action."}, {status: 403});

        }

        const deletedOrder = await Order.findByIdAndDelete(orderId);

        return NextResponse.json({
            message: "Order deleted successfully",
            promo: deletedOrder
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}


