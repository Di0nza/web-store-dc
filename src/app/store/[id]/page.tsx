import {Metadata} from "next";
import '../../profile/profileStyles.css'
import ProductContainer from '../../../components/ProductContainer'
import axios from "axios";
import {NextResponse} from "next/server";
import Product from "@/models/productModel";
import {IProduct} from "@/types/Product";
import {connect} from "@/db/db";

connect();

type Props = {
    params: {
        id: any;
    }
};

export async function generateMetadata({params: {id}}: Props): Promise<Metadata> {
    const product = await getProductById(id) as IProduct;


    return {
        title: `MariDenizDesign | ${product.title}`,
        description: product.description,
        keywords: ['Clothing', 'fashion', 'women\'s clothing', 'men\'s clothing'],
        openGraph: {
            images: product.pictures[0].toString(),
        },
        icons: 'https://res.cloudinary.com/dzdmstsam/image/upload/v1718646289/Letter_-_126_x8fpma.png',
    }
}

async function getProductById(id){
    try {

        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({error: "No such product"}, {status: 400})
        }
        product.views += 1;
        const updatedProduct = await product.save();
        console.log(product)
        let resultProduct;
        if(updatedProduct){
            resultProduct = product.toObject();
        }else{
            return NextResponse.json({error: "No such product"}, {status: 400})
        }

        console.log("RESULT",resultProduct)
        return resultProduct;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return null;
    }
}


export default async function oneProduct({params: {id}}: Props) {
    const product = await getProductById(id);
    return (
        <div className='product-store-container'>
            {product && <ProductContainer product={product} />}
        </div>
    )
}
