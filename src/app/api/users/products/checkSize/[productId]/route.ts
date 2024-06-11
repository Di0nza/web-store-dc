import {NextRequest, NextResponse} from "next/server";
import Product from "@/models/productModel";
import {connect} from "@/db/db";

connect();
export const maxDuration = 59;

export async function POST(
    request: NextRequest,
    {params}: { params: { productId: string } }
) {
    try {
        const reqBody = await request.json();
        console.log(reqBody)
        const {size} = reqBody;
        const product = await Product.findById(params.productId);

        if (!product) {
            return NextResponse.json({error: "No such product"}, {status: 400})
        }

        console.log(product)

        const sizes = product.sizes;
        const sizeObject = sizes.find((item)=> item.size === size);
        const amount = sizeObject ? sizeObject.amount : null;

        console.log(amount)

        return NextResponse.json({
            message:"The amount of the selected size for the product",
            success: true,
            amount
        });

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}
