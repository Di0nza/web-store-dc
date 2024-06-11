import {NextRequest, NextResponse} from "next/server";
import Product from "@/models/productModel";
export const maxDuration = 59;
import {connect} from "@/db/db";

connect();
export async function GET(
    request: NextRequest,
    {params}: { params: { productId: string } }
) {
    try {
        const product = await Product.findById(params.productId);
        //console.log(product)
        product.views += 1;
        const updatedProduct = await product.save();

        if (!product) {
            return NextResponse.json({error: "No such product"}, {status: 400})
        }

        console.log(product)

        return NextResponse.json({
            message:"Product found successfully",
            success: true,
            updatedProduct
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}
