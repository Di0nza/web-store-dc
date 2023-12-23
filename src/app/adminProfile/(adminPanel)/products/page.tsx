"use client"
import React, {useEffect, useState} from 'react';
import {AdminProducts} from "@/components/adminProducts";
import {ProductsSearch} from "@/components/ProductsSearch";
import {Products} from "@/components/Products";
import {getData} from "@/services/getData";

const Page = () => {
    const [products, setProducts] = useState<any[]>([]);
    useEffect(() => {
        getData().then(setProducts)
    }, [])

    return (
        <div>
            <div className='store-container'>
                <AdminProducts/>
                <div className='store-head-block'>
                    <div>
                        <h3>Каталог товаров</h3>
                        <p className='store-quantity'>Количество товаров {products.length}</p>
                    </div>
                    <ProductsSearch onSearch={setProducts}/>
                </div>
                <Products products={products}/>
            </div>
        </div>
    );
};

export default Page;