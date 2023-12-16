import '../app/profile/profileStyles.css'
import Link from "next/link";

type Props = {
    products: any[];
}

const Products = ({products}: Props) => {

    return (
        <div className='products-block'>
            {products.map((product: any) => (
                <Link key={product._id} href={`store/${product._id}`} className='product-item'>
                    <div className='product-info'>
                        <img className='product-img' src={product.pictures[0]} alt={product.title}></img>
                        <p className='product-title'>{product.title}</p>
                        <p className='product-category'>{product.category}</p>
                    </div>
                    <p className='product-price'>${product.price}.00</p>
                </Link>
            ))}
        </div>
    )
}
export {Products};
