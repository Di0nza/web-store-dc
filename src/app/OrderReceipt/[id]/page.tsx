'use client'
import './placingOrder.css'
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {Metadata} from "next";
import axios from "axios";
import Image from "next/image";
import deleteItem from "@/img/delete.png";
import minus from "@/img/minus.png";
import plus from "@/img/plus.png";

interface orderData {
    username: string;
    email: string;
    telephone: string;
}
type Props = {
    params: {
        id: any;
    }
};
interface CartItem {
    title: string;
    size: string;
    price: number;
    image: string;
    category: string;
}
export default function PlacingOrder({params: {id}}: Props): JSX.Element {
    const [orderData, setOrderData] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState(null);

    const handleDeliverySelection = (method) => {
        setSelectedDelivery(method);
    };
    const getUserDetails = async () => {
        try {
            const res = await axios.get<{ data: orderData }>(`/api/users/getAllOrders`);
            let foundOrder: any;
            foundOrder = res.data.orders.find(order => order._id === id);
            setOrderData(foundOrder);
        } catch (error: any) {
            console.log(error.message);
        }
    };
    useEffect(() => {
        getUserDetails();
    }, []);

    return (
        <div className='placingOrderBlock'>
            <h2>{"Спасибо за ваш заказ!"}</h2>
            <p>Имя пользователя: {orderData?.username}</p>
            <p>Email: {orderData?.email}</p>
            <p>Телефон: {orderData?.telephone}</p>
            <p>Индекс: {orderData?.zip}</p>
            <p>Город: {orderData?.city}</p>
            <p>Страна: {orderData?.country}</p>
            <p>Дом: {orderData?.house}</p>
            <p>Квартира: {orderData?.apartment}</p>
            <p>Способ доставки: {orderData?.deliveryMethod}</p>
            <p>Статус оплаты: {orderData?.paymentState}</p>
            <p>Промо-код: {orderData?.promotionalCode}</p>
            <p>Статус заказа: {orderData?.orderStatus}</p>
            <p>Общая стоимость: ${orderData?.totalCost}</p>
            <p>Общее количество товаров: {orderData?.totalNumber}</p>
            <p>Создано пользователем: {orderData?.createdBy}</p>
            <p>Дата создания: {orderData?.createdAt}</p>
            <h3>Продукты в заказе:</h3>
            <div className='products-block'>
                {orderData?.products.map((item, index) => (
                    <div className={'mini-cart-item'} key={index}>
                        <img
                            className={'mini-cart-item-img'}
                            key={index}
                            src={item.image}
                            alt={`Thumbnail ${index}`}
                        />
                        <div className={'mini-cart-item-info'}>
                            <div className={'mini-cart-item-info-head'}>
                                <div>
                                    <h5 className={'mini-cart-item-title'}>{item.title}</h5>
                                    <p key={index}>{item.size}</p>
                                </div>
                            </div>
                            <div className={'mini-cart-footer'}>
                                <h5>
                                    ${item.price}.00
                                </h5>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button
                style={{pointerEvents: buttonDisabled ? "none" : null }}>
                {"Перейти к оплате"}
            </button>
        </div>
    )
}
