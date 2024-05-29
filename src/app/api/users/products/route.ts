import {connect} from "@/db/db";
import Product from "@/models/productModel";
import {NextRequest, NextResponse} from "next/server";
import {IProduct} from "@/types/Product";
import {currentUser, isAdmin} from "@/lib/auth";

export async function GET(){
    try{
            const headers = new Headers();
            headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            headers.set('Pragma', 'no-cache');
            headers.set('Expires', '0');
        const products:IProduct[] = await Product.find();
        return NextResponse.json({
            message: "All products",
            success: true,
            products
        });
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}
