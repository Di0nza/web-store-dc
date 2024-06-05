import Product from "@/models/productModel";
import {NextRequest, NextResponse} from "next/server";
import {IProduct} from "@/types/Product";


export async function GET(request:NextRequest){
    try{
        console.log(request)
        const products:IProduct[] = await Product.find();
        return NextResponse.json({
            message: "All products",
            success: true,
            products
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}