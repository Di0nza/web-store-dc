'use client';
import '../profile/profileStyles.css'
import Link from "next/link";
import {useEffect, useState} from "react";
import {getData} from '../../services/getData'
import {Products} from "../../components/Products";
import {ProductsSearch} from "../../components/ProductsSearch";

export default function Store() {
    const [products, setProducts] = useState<any[]>([]);
    useEffect(() => {
        getData().then(setProducts)
    }, [])
    return (
        <div className='store-container'>
            <div className='store-head-block'>
                <div>
                    <h3>Каталог товаров</h3>
                    <p className='store-quantity'>Количество товаров {products.length}</p>
                </div>
                <ProductsSearch onSearch={setProducts}/>
            </div>
            <Products products={products}/>
        </div>
    )
}
