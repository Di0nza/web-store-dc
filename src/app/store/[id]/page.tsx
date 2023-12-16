import {Metadata} from "next";
import Products from '../../../mockData/mockProducts.json'
import '../../profile/profileStyles.css'
import ProductContainer from '../../../components/ProductContainer'

type Props = {
    params: {
        id: any;
    }
};
function getProductById(id) {
    if (Products.Products) {
        const product = Products.Products.find(item => item._id === id);
        return product || null;
    } else {
        return null;
    }
}
export async function generateMetadata({params: {id}}: Props): Promise<Metadata> {
    const product = await getProductById(id);
    return {
        title: product.title,
    }
}


export default async function Product({params: {id}}: Props) {
    const product = await getProductById(id);
    return (
        <div className='store-container'>
            {product && <ProductContainer product={product} />}
        </div>
    )
}
