'use client';
import React, {useState, useEffect, useLayoutEffect} from 'react';
import Link from "next/link";
import {usePathname} from "next/navigation";
import '../componentsStyles.css'
import axios from "axios";
import {OrderProvider, useOrderContext} from "@/orderContext/store";
import {getAllProductsUser} from "@/services/getData";
import Image from "next/image";
import unFavorites from "@/img/unfavorite.png";
import favorites from "@/img/favorite.png";
import arrowW from "@/img/arrowW.png";


const BestProducts = () => {
    const pathname = usePathname();
    const [products, setProducts] = useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        getAllProductsUser().then((data) => {
            const sortedProducts = data.data.products.sort((a, b) => b.views - a.views);
            const topFourProducts = sortedProducts.slice(0, 4);
            setProducts(topFourProducts);
        });
    }, []);

    return (
        <OrderProvider>
            <div className='best-product-block'>
                <div className='best-product-head'>
                    <h3>Наши товары</h3>
                    <p>Исследуйте уникальные товары, которые подчеркнут ваш стиль. Новая коллекция уже ждёт вас!</p>
                </div>
                <div className='best-product-items-body'>
                    <div className='best-product-scroll-block'>
                        <div className='best-product-items-block'>
                            {products.map((product: any) => (
                                <div key={product._id} className='best-product-item'>
                                    <Link href={`store/${product._id}`}>
                                        <div className='best-product-info'>
                                            <img className='best-product-img' src={product.pictures[0]}
                                                 alt={product.title}></img>
                                            <p className='product-title'>{product.title}</p>
                                            <p className='product-category'>{product.category}</p>
                                        </div>
                                        <p className='product-price'>${product.price}.00</p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='best-product-input'>
                        <p>В магазин</p>
                        <Link href={'/store'}>
                            <Image src={arrowW} alt={'>'}/>
                        </Link>
                    </div>
                </div>
            </div>
        </OrderProvider>
    )
}

export {BestProducts}