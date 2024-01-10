'use client';
import '../profile/profileStyles.css'
import {useEffect, useState} from "react";
import {getAllProductsUser, getData} from '@/services/getData'
import {Products} from "@/components/product/Products";
import {ProductsSearch} from "@/components/product/ProductsSearch";

export default function Store() {
    const [products, setProducts] = useState<any[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        getData().then((data) => {
            setProducts(data);
            const favoritesFromStorage = JSON.parse(localStorage.getItem('favorites') || '[]');
            setFavorites(favoritesFromStorage);
        });
    }, []);

    useEffect(() => {
        getAllProductsUser().then((data)=>setProducts(data.data.products))
    }, [])

    const filteredProducts = products.filter((product: any) => favorites.includes(product._id));

    return (
        <div className='store-container'>
            <div className='store-head-block'>
                <div>
                    <h3>Избранные товары</h3>
                    <p className='store-quantity'>Товаров в избранных {filteredProducts.length}</p>
                </div>
            </div>
            <Products products={filteredProducts}/>
        </div>
    );
}
