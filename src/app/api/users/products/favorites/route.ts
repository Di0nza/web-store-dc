import {NextRequest, NextResponse} from "next/server";
import Product from "@/models/productModel";
import {IProduct} from "@/types/Product";
export const maxDuration = 59;


enum OptionsType { ADD_TO_FAV = "ADD", DELETE_FROM_FAV = "DEL"}
export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const {id, option} = reqBody;

        console.log(reqBody)

        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({error: "No such product"}, {status: 400});
        }

        if(option === OptionsType.ADD_TO_FAV){
            product.favorites +=1;
        }else if (option === OptionsType.DELETE_FROM_FAV){
            product.favorites -=1;
        }

        await product.save();

        return NextResponse.json({
            message: "Favorites updated successfully",
            success: true
        })

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}