import './storeStyles.css'
import {Metadata} from "next";
import Link from "next/link";
import Products from '../../mockData/mockProducts.json'

async function getData() {
    try {
        return Products.Products;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

export const metadata: Metadata = {
    title: 'Store | MariDeniz',
}

export default async function Store() {
    const products = await getData();
    return (
        <div className='store-container'>
            <h3>Каталог товаров</h3>
            <p className='store-quantity'>Количество товаров {products.length}</p>
            <div className='products-block'>
                {products.map((product: any) => (
                    <Link key={product._id} href={`store/${product._id}`} className='product-item'>
                        <img className='product-img' src={product.pictures[0]} alt={product.title}></img>
                        <div className='product-info'>
                            <p className='product-title'>{product.title}</p>
                            <p className='product-price'>{product.price} $</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
