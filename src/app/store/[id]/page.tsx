import {Metadata} from "next";
import Products from '../../../mockData/mockProducts.json'
import '../storeStyles.css'

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
            <h3>{product.title}</h3>
            <div className='product-container'>
                <div className='product-slider'>
                    <img className='product-slider' src={product.pictures[0]}/>
                </div>
                <div className='product-info-block'>
                    <div>
                        <p>{product.description}</p>
                        <p><b>{product.price} $</b></p>
                        <div className='product-sizes-block'>
                            {product.sizes.map((info: any) => (
                                <div className='product-size'>{info.size}</div>
                            ))}
                        </div>
                        <div className='product-additionalInformation-block'>
                            {product.additionalInformation.map((info: any) => (
                                <span>{info.title}: {info.description}</span>
                            ))}
                        </div>
                    </div>
                    <div className='product-btn'>
                        Добавить в корзину
                    </div>
                </div>

            </div>
        </div>
    )
}
