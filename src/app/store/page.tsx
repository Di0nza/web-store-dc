'use client';
import '../profile/profileStyles.css'
import Link from "next/link";
import {useEffect, useState} from "react";
import {getAllProductsUser, getData} from '@/services/getData'
import {Products} from "@/components/Products";
import {ProductsSearch} from "@/components/ProductsSearch";

export default function Store() {
    const [products, setProducts] = useState<any[]>([]);
    useEffect(() => {
        getAllProductsUser().then((data)=>setProducts(data.data.products))
    }, [])

    return products ? (

                <div className='store-container'>
                    <div className='store-head-block'>
                        <div>
                            <p className='store-container-title'>Каталог товаров</p>
                            <p className='store-quantity'>Количество товаров {products.length}</p>
                        </div>
                        <ProductsSearch onSearch={setProducts}/>
                    </div>
                    <Products products={products}/>
                </div>

    ) : (<div></div>)
}
