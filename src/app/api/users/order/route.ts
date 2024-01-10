import {connect} from "@/db/db";
import Order from "@/models/orderModel";
import Product from "@/models/productModel"
import {NextRequest, NextResponse} from "next/server";
import {currentUser} from "@/lib/auth";
connect()

export async function POST(request: NextRequest) {
    try {

        const user = await currentUser();

        if(!user){
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
        return NextResponse.json({
            message: "Order created successfully",
            savedOrder
        });
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

interface IParams {
    orderId?: string;
}


export async function GET(request: NextRequest) {
    try {
        const user = await currentUser();

        if(!user){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        const {id} = request.query;
        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if(user.email !== order.email && user.isAdmin !== true){
            return NextResponse.json({error: "Forbidden. You don't have this rights."}, {status: 403})
        }


        return NextResponse.json({
            message: "Order retrieved successfully",
            order
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {

        const user = await currentUser();

        if(!user){
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



