import {connect} from "@/db/db";
import Order from "@/models/orderModel";
import Product from "@/models/productModel"
import {NextRequest, NextResponse} from "next/server";
connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const {
            username,
            email,
            telephone,
            products,
            zip,
            city,
            country,
            deliveryMethod,
            paymentState,
            promotionalCode,
            house,
            apartment,
            orderStatus,
            totalCost,
            totalNumber,
            createdBy,
            createdAt
        } = reqBody

        console.log(reqBody);

        const newOrder = new Order({
            username,
            email,
            telephone,
            products,
            zip,
            city,
            country,
            house,
            apartment,
            deliveryMethod,
            paymentState,
            promotionalCode,
            orderStatus,
            totalCost,
            totalNumber,
            createdBy,
            createdAt,
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
        const {id} = request.query;
        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
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
        const reqBody = await request.json();
        const orderId = reqBody.id;
        const existingOrder = await Order.findById(orderId);
        if (!existingOrder) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }
        for (const key in reqBody) {
            if (key !== 'orderId') {
                if (reqBody[key] !== undefined) {
                    existingOrder[key] = reqBody[key];
                }
            }
        }
        const updatedOrder = await existingOrder.save();
        return NextResponse.json({
            message: "Order updated successfully",
            updatedOrder
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
