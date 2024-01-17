"use client";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import './statisticsStyles.css'
import views from "@/img/eye.svg";
import favorites from "@/img/favorite.png";
import Image from "next/image";
import OrdersChart from "@/components/charts/OrdersChart";
import {getAllProductsUser} from "@/services/getData";
import ProductRadialChart from "@/components/charts/ProductRadialChart";
import ProductViewsFavorites from "@/components/product/ProductViewsFavorites";

export default function AdminStatistics() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [userOrders, setUserOrders] = useState(null);
    const [filteredOrders, setFilteredOrders] = useState(null);
    const [categories, setCategories] = useState([]);
    const [formattedDateTime, setFormattedDateTime] = useState('');

    const getUserOrders = async () => {
        try {
            const res = await axios.get(`/api/users/getAllOrders`);
            setUserOrders(res.data.orders);
            setFilteredOrders(res.data.orders);
        } catch (error: any) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        getUserOrders();
    }, []);

    useEffect(() => {
        if (userOrders) {
            const uniqueCategories = Array.from(new Set(userOrders[0]?.orderStatus?.map(item => item.title)));
            setCategories(uniqueCategories);
        }
    }, [userOrders]);


    const createdAt = filteredOrders?.createdAt;
    const monthsInRussian = [
        'Янв.', 'Фев.', 'Мар.', 'Апр.', 'Мая', 'Июн.',
        'Июл.', 'Авг.', 'Сен.', 'Окт.', 'Ноя.', 'Дек.'
    ];
    useEffect(() => {
        if (createdAt) {
            const formattedDate = new Date(createdAt);
            const monthIndex = formattedDate.getMonth();
            const monthInRussian = monthsInRussian[monthIndex];
            const hours = formattedDate.getHours();
            const minutes = formattedDate.getMinutes();

            const formattedDateTimeString = `${formattedDate.getDate()} ${monthInRussian} ${formattedDate.getFullYear()} ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
            setFormattedDateTime(formattedDateTimeString);
        }
    }, [createdAt]);

    useEffect(() => {
        getAllProductsUser().then((data) => setProducts(data.data.products))
    }, [])

    return (
        <div className='adminStatisticContainer'>
            <h2>{"Статистика"}</h2>
            <p className='changeBlockText'>{`На данный момент зарегистрировано заказов: ${userOrders?.length}`}</p>
            {userOrders && (
                <div className='orderStatisticBlock'>
                    <OrdersChart userOrders={userOrders}/>
                </div>
            )}
            <div className='productsStatisticBlock'>
                {products.map((product) => (
                    <div key={product._id} className='productStatistics'>
                        <div className='productStatisticsInfo'>
                            <img className='product-statistic-img' src={product.pictures[0]} alt={product.title}></img>
                            <div className={'productStatisticsInfoBlock'}>
                                <div>
                                    <p className='product-title'>{product.title}</p>
                                    <p className='product-category'>{product.category}</p>
                                    <div>
                                        <div className={'viewsBlock'}>
                                            <Image src={views} alt={''}></Image>
                                            <b>Просмотры: </b>
                                            <p>{product.views}</p>
                                        </div>
                                        <div className={'viewsBlock'}>
                                            <Image src={favorites} alt={''}></Image>
                                            <b>Избранные: </b>
                                            <p>{product.favorites}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className='product-price'>${product.price}.00</p>
                                    <div className={'productSizeBlock'}>
                                        {product.sizes.map((size, index) => (
                                            <div className={'productSize'}>
                                                <b key={index}>{size.size}:</b>
                                                <p key={index}>{size.amount}</p>
                                            </div>

                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                        {/*<div className='productStatisticViewsFavorites'>*/}
                        {/*    <ProductViewsFavorites product={product}/>*/}
                        {/*</div>*/}
                        <div className='productStatisticBlock'>
                            <ProductRadialChart product={product}/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
