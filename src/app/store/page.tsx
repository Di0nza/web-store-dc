'use client';
import '../profile/profileStyles.css'
import Link from "next/link";
import {useEffect, useState} from "react";
import {getAllProductsUser, getData} from '@/services/getData'
import {Products} from "@/components/product/Products";
import {ProductsSearch} from "@/components/product/ProductsSearch";
//import {getProviders} from "next-auth/react";

export default function Store() {
    const [products, setProducts] = useState<any[]>([]);
    useEffect(() => {
        getAllProductsUser().then((data)=>setProducts(data.data.products))
    }, [])

    // useEffect(() => {
    //     (async () => {
    //         const proivders = await getProviders();
    //         console.log('providers :>> ', proivders);
    //     })();
    // }, []);

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
