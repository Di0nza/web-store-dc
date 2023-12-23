import {Metadata} from "next";
import '../../profile/profileStyles.css'
import ProductContainer from '../../../components/ProductContainer'
import axios from "axios";
import {NextResponse} from "next/server";
import Product from "@/models/productModel";
import {IProduct} from "@/types/Product";

type Props = {
    params: {
        id: any;
    }
};

export async function generateMetadata({params: {id}}: Props): Promise<Metadata> {
    const product = await getProductById(id) as IProduct;

    return {
        title: product.title,
        description: product.description,
        keywords: ['Clothing', 'fashion', 'women\'s clothing', 'men\'s clothing'],
        openGraph: {
            images: product.pictures[0],
        },
        icons: 'https://res.cloudinary.com/maticht12345/image/upload/v1701277508/Letter_-_16_wds2cz.png',
    }
}

async function getProductById(id){
    try {
        const product = await Product.findById(id).lean();
        console.log(product)

        if (!product) {
            return NextResponse.json({error: "No such product"}, {status: 400})
        }

        console.log(product)
        return product;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return null;
    }
}


export default async function oneProduct({params: {id}}: Props) {
    const product = await getProductById(id);
    return (
        <div className='store-container'>
            {product && <ProductContainer product={product} />}
        </div>
    )
}
