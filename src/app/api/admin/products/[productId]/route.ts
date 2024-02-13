import {connect} from "@/db/db";
import Product from "@/models/productModel";
import {NextRequest, NextResponse} from "next/server";
import {IProduct} from "@/types/Product";
import {ITokenData} from "@/types/TokenData";
import {getDataFromToken} from "@/helpers/getDataFromToken";
import {currentUser, isAdmin} from "@/lib/auth";
import User from "@/models/userModel";

const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

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

        const user = await currentUser();

        if (!user) {
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        const userDB = await User.findById(user.id)

        if(!userDB){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        if (user?.isAdmin === false) {
            return NextResponse.json({error: "Forbidden. You don't have administrator rights."}, {status: 403})
        }

        const data = await request.formData();

        console.log(data, params.productId)

        const title = data.get('title');
        const description = data.get('description');
        const price = data.get('price');
        const category = data.get('category');
        const collection = data.get('collection');
        const sex = data.get('sex');
        const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => ({
            size: size,
            amount: data.get(size),
        }));


        const additionalInformation = [];

        for (const key of data.keys()) {
            if (key.startsWith('additionalInformation')) {
                const [index, field] = key
                    .match(/additionalInformation\[(\d+)\]\.(title|description)/)
                    .slice(1);

                if (!additionalInformation[index]) {
                    additionalInformation[index] = {};
                }

                additionalInformation[index][field] = data.get(key);
            }
        }

        const picturesNames = [];

        for (const [key, value] of data.entries()) {
            if (typeof key === 'string') {
                if (key.startsWith('picturesFiles[')) {
                    const fileValue = value as File;
                    const bytes = await fileValue.arrayBuffer();
                    const buffer = Buffer.from(bytes)
                    const uploadPromise = new Promise((resolve, reject) => {
                        let cld_upload_stream = cloudinary.uploader.upload_stream({folder: 'my-folder'}, function (error, result) {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result.secure_url);
                            }
                        });

                        streamifier.createReadStream(buffer).pipe(cld_upload_stream);
                    });
                   picturesNames.push(await uploadPromise)
                } else if (key.startsWith('picturesString[')) {
                    picturesNames.push(value as string);
                }
            }
        }

        const product = await Product.findByIdAndUpdate(params.productId, {
            title: title,
            description: description,
            category: category,
            collection: collection,
            sex: sex,
            price: price,
            sizes: sizes,
            pictures: picturesNames,
            additionalInformation: additionalInformation
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

        const user = await currentUser();

        if (!user) {
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        const userDB = await User.findById(user.id)

        if(!userDB){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        if (user?.isAdmin === false) {
            return NextResponse.json({error: "Forbidden. You don't have administrator rights."}, {status: 403})
        }

        const product = await Product.findByIdAndDelete(params.productId);

        if (!product) {
            return NextResponse.json({error: "No such product"}, {status: 400})
        }

        return NextResponse.json({
            message: "Product deleted successfully",
            success: true,
            product
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export async function GET(
    request: NextRequest,
    {params}: { params: { productId: string } }
) {
    try {

        const user = await currentUser();

        if (!user) {
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        const userDB = await User.findById(user.id)

        if(!userDB){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        if (user?.isAdmin === false) {
            return NextResponse.json({error: "Forbidden. You don't have administrator rights."}, {status: 403})
        }

        const product = await Product.findById(params.productId);
        //console.log(product)

        if (!product) {
            return NextResponse.json({error: "No such product"}, {status: 400})
        }

        //console.log(product)

        return NextResponse.json({
            message: "Product found successfully",
            success: true,
            product
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

