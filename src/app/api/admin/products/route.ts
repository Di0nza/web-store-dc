import {connect} from "@/db/db";
import Product from "@/models/productModel";
import {NextRequest, NextResponse} from "next/server";
import {IProduct} from "@/types/Product";
import {ITokenData} from "@/types/TokenData";
import {getDataFromToken} from "@/helpers/getDataFromToken";
import path from "path";
import {writeFile} from "fs/promises";
const uuid = require('uuid')

connect()

export async function POST(request: NextRequest) {
    try {
        const tokenData: ITokenData = getDataFromToken(request);
        if (tokenData.isAdmin === false) {
            return NextResponse.json({error: "Access denied"}, {status: 403})
        }

        // const reqBody: IProduct = await request.json()
        // const {
        //     title,
        //     description,
        //     sizes,
        //     additionalInformation
        // } = reqBody;

        const data = await request.formData();

        console.log(data)

        const title = data.get('title');
        const product = await Product.findOne({title});
        if (product) {
            return NextResponse.json({error: "Product already exist"}, {status: 400})
        }

        const description = data.get('description');
        const sizes = JSON.parse(<string>data.get('sizes'));
        const additionalInformation = JSON.parse(<string>data.get('additionalInformation'));

        const picturesFiles = data.get("pictures") as unknown as File[]
        const picturesNames = [];

        if(!picturesFiles){
            return NextResponse.json({error: "No files in request"}, {status: 400})
        }

        for (let i = 0; i < picturesFiles.length; i++) {
            let fileName = uuid.v4() + ".jpg"
            const bytes = await picturesFiles[i].arrayBuffer();
            const buffer = Buffer.from(bytes);
            await writeFile(path.resolve(__dirname, '..', 'src/static', fileName), buffer);
            picturesNames.push(fileName);
        }
        //console.log(reqBody)


        const newProduct = new Product({
            title: title,
            description: description,
            sizes: sizes,
            pictures: picturesNames,
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

export async function DELETE(request: NextRequest) {
    try {
        const tokenData: ITokenData = getDataFromToken(request);
        if (tokenData.isAdmin === false) {
            return NextResponse.json({error: "Access denied"}, {status: 403})
        }
        const reqBody: IProduct = await request.json()
        const {
            id
        } = reqBody;

        console.log(reqBody)

        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({error: "No such product"}, {status: 400})
        }
        const deletedProduct = await Product.findByIdAndDelete(id);
        return NextResponse.json({error: "Product successfully deleted"}, {status: 200})
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export async function GET(){
    try{
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