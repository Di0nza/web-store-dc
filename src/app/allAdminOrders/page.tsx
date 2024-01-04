"use client";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import './orderStyles.css'

export default function UserOrders() {
    const router = useRouter();
    const [userOrders, setUserOrders] = useState(null);

    const getUserOrders = async () => {
        try {
            const res = await axios.get(`/api/users/getAllOrders`);
            setUserOrders(res.data.orders);
        } catch (error: any) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        getUserOrders();
    }, []);

    const createdAt = userOrders?.createdAt;
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

    return (
        <div className='profileBlock'>
            <h2>{"Все заказы"}</h2>
            <p className='changeBlockText'>{`В обработке находятся ${userOrders?.length} заказов`}</p>
            {userOrders && (
                <div className='orderProfileBlock'>
                    {userOrders?.map((item, index) => (
                        <Link href={`/adminOrderReceipt/${item._id}`} key={index}>
                            <div className={'mini-order-item-info'}>
                                <p className={'mini-admin-item-info-head'}><b>Заказ #{item._id.toString().substring(0, 7)}</b></p>
                                {item.orderStatus && (
                                    <p className={'mini-cart-item-order-status'}>
                                        Статус заказа: <b>{item.orderStatus.slice().reverse().find(status => status.selected)?.title}</b>
                                    </p>
                                )}
                                <div className={'mini-cart-footer'}>
                                    <p className={'mini-cart-item-date'}>{formatTimestampToDate(item.orderStatus[0].createdDate)}</p>
                                    <h5 className={'mini-cart-item-cost'}>Стоимость: <b>${item.totalCost.toFixed(2)}</b>
                                    </h5>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
