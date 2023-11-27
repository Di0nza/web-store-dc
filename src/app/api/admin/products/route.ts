import {connect} from "@/db/db";
import Product from "@/models/productModel";
import {NextRequest, NextResponse} from "next/server";
import {IProduct} from "@/types/Product";

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody: IProduct = await request.json()
        const {
            title,
            description,
            sizes,
            pictures,
            additionalInformation
        } = reqBody;

        console.log(reqBody)

        const product = await Product.findOne({title});
        if(product){
            return NextResponse.json({error: "Product already exist"}, {status: 400})
        }
        const newProduct = new Product({
            title: title,
            description: description,
            sizes: sizes,
            pictures: pictures,
            additionalInformation: additionalInformation
        })

        const savedProduct = await newProduct.save();
        console.log(savedProduct);


        return NextResponse.json({
            message: "Product created successfully",
            success: true,
            savedProduct
        })

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}