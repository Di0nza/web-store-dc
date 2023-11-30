import '../app/store/storeStyles.css'
import Link from "next/link";

type Props = {
    products: any[];
}

const Products = ({products}: Props) => {
    return (
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
    )
}
export {Products};
