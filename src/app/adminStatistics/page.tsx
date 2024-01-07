"use client";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import './statisticsStyles.css'
import deleteItem from "@/img/delete.png";
import Image from "next/image";
import OrdersChart from "@/components/OrdersChart";
import {getAllProductsUser} from "@/services/getData";
import ProductRadialChart from "@/components/ProductRadialChart";
import ProductViewsFavorites from "@/components/ProductViewsFavorites";

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
        <div className='adminOrdersBlock'>
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
                            <p className='product-title'>{product.title}</p>
                            <img className='product-stat-img' src={product.pictures[0]} alt={product.title}></img>
                            <p className='product-category'>{product.category}</p>
                            <p className='product-price'>${product.price}.00</p>
                        </div>
                        <div className='productStatisticViewsFavorites'>
                            <ProductViewsFavorites product={product}/>
                        </div>
                        <div className='productStatisticBlock'>
                            <ProductRadialChart product={product}/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
