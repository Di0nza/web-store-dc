import {connect} from "@/db/db";
import Product from "@/models/productModel";
import {NextRequest, NextResponse} from "next/server";
import {IProduct} from "@/types/Product";
import {ITokenData} from "@/types/TokenData";
import {getDataFromToken} from "@/helpers/getDataFromToken";
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_API_SECRET,
})

const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
};

export async function PATCH(
    request: NextRequest,
    {params}: { params: { productId: string } }
) {
    try {
        const tokenData: ITokenData = getDataFromToken(request);
        if (tokenData.isAdmin === false) {
            return NextResponse.json({error: "Access denied"}, {status: 403})
        }
        const data = await request.formData();

        console.log(data, params.productId)

        const title = data.get('title');
        const description = data.get('description');
        const price = data.get('price');
        const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => ({
            size: size,
            amount: data.get(size),
        }));

        const picturesNames = [];

        const promises = [];
        // @ts-ignore
        for (const key of data.keys()) {
            if (key.startsWith('picturesFiles[')) {
                const value = data.get(key) as File;
                    await cloudinary.uploader.upload(value, opts, { folder: 'my-folder' })
                        .then((res)=> picturesNames.push(res.secure_url))

            } else if (key.startsWith('picturesString[')){
                const value = data.get(key)
                picturesNames.push(value)
            }
        }

        const product = await Product.findByIdAndUpdate(params.productId, {
            title: title,
            description: description,
            price: price,
            sizes: sizes,
            pictures: picturesNames
        });
        if (!product) {
            return NextResponse.json({error: "No such product"}, {status: 400})
        }


        console.log("Title:", title);
        console.log("Description:", description);
        console.log("Price:", price);
        console.log("Sizes:", sizes);
        console.log("Pictures", picturesNames);

        return NextResponse.json({
            message: "Product updated successfully",
            success: true,
            //product
        })

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export async function DELETE(
    request: NextRequest,
    {params}: { params: { productId: string } }
) {
    try {
        const tokenData: ITokenData = getDataFromToken(request);
        if (tokenData.isAdmin === false) {
            return NextResponse.json({error: "Access denied"}, {status: 403})
        }

        const product = await Product.findByIdAndDelete(params.productId);

        if (!product) {
            return NextResponse.json({error: "No such product"}, {status: 400})
        }

        return NextResponse.json({
            message:"Product deleted successfully",
            success: true,
            product
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}