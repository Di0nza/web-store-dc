'use client'
import './placingOrder.css'
import Link from "next/link";
import React, {useEffect, useRef, useState} from "react";
import {Metadata} from "next";
import axios from "axios";
import Image from "next/image";
import deleteItem from "@/img/delete.png";
import checkOrderStatusW from "@/img/checkOrderStatusW.png";
import checkOrderStatusB from "@/img/checkOrderStatusB.png";

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
    const formattedDateRef = useRef(null);
    const [formattedDateTime, setFormattedDateTime] = useState('');
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

    const createdAt = orderData?.createdAt;
    const monthsInRussian = [
        'Янв.', 'Фев.', 'Мар.', 'Апр.', 'Мая', 'Июн.',
        'Июл.', 'Авг.', 'Сен.', 'Окт.', 'Ноя.', 'Дек.'
    ];
    const formatTimestampToDate = (timestamp) => {
        if (!timestamp) return '';

        const formattedDate = new Date(parseInt(timestamp));
        const monthIndex = formattedDate.getMonth();
        const day = formattedDate.getDate();
        const year = formattedDate.getFullYear();
        const monthInRussian = monthsInRussian[monthIndex];
        const hours = formattedDate.getHours().toString().padStart(2, '0');
        const minutes = formattedDate.getMinutes().toString().padStart(2, '0');

        return `${day} ${monthInRussian} ${year} ${hours}:${minutes}`;
    };

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

    const statuses = orderData?.orderStatus || [];

    const getStatusColor = (index, selected) => {
        if (selected) {
            return "#111111";
        } else {
            return "#d3d3d3";
        }
    };

    const getStatusWeight = (index, selected) => {
        if (selected) {
            return "500";
        } else {
            return "300";
        }
    };

    return (
        <div className='placingOrderBlock'>
            <h2>{"Спасибо за ваш заказ!"}</h2>
            <div className='placingOrderBlockRow'>
                <div className='products-value-block'>
                    {orderData?.products.map((item, index) => (
                        <div className={'check-cart-item'} key={index}>
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
                <div>
                    <div className='placingOrderInfoBlock'>
                        <h4>{orderData?.totalNumber} товаров на сумму ${orderData?.totalCost}</h4>
                        <h3>Контактные данные</h3>
                        <p><b>Имя:</b> {orderData?.username}</p>
                        <p><b>Email:</b> {orderData?.email}</p>
                        <p><b>Телефон:</b> {orderData?.telephone}</p>
                        <h3>Информация о доставке</h3>
                        <p><b>Способ доставки:</b> {orderData?.deliveryMethod}</p>
                        <p><b>Пункт назначения:</b> {orderData?.country}, {orderData?.city}(д.{orderData?.house}, кв.{orderData?.apartment}), {orderData?.zip}</p>
                        <p><b>Дата создания:</b> {formattedDateTime}</p>
                        <p><b>Статус оплаты:</b> {orderData?.paymentState}</p>
                        <p><b>Статус заказа:</b></p>
                        <div className={'orderStatusBlock'}>
                            <div className={'orderStatusTimeBlock'}>
                                {statuses.map((status, index) => (
                                    <div key={index} style={{color: getStatusColor(index, status.selected), fontWeight: getStatusWeight(index, status.selected)}}>
                                        {status.createdDate !== '' ? (<p>{formatTimestampToDate(status.createdDate)}</p>)
                                            : (
                                                <p>Пока неизвестно</p>
                                            )}
                                    </div>
                                ))}
                            </div>
                            <div className="orderStatusLine">
                                {statuses.map((status, index) => (
                                    <div key={index} style={{ backgroundColor: getStatusColor(index, status.selected) }}>
                                        {status.selected ? <Image className="statusLineCheckImg" src={checkOrderStatusB} alt="Selected" /> : <Image className="statusLineCheckImg" src={checkOrderStatusW} alt="Selected" />}
                                    </div>
                                ))}
                            </div>
                            <div className={'orderStatusTitleBlock'}>
                                {statuses.map((status, index) => (
                                    <div key={index} style={{color: getStatusColor(index, status.selected), fontWeight: getStatusWeight(index, status.selected)}}>
                                        <p>{status.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Link href={'/'} className={'placingOrderBlockButton'}>
                        {"На главную"}
                    </Link>
                </div>
            </div>
        </div>
    )
}
