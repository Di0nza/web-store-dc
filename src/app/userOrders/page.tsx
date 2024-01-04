"use client";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import './orderStyles.css'

interface UserData {
    username: string;
    email: string;
    createdAt?: string;
}

export default function UserOrders() {
    const router = useRouter();
    const [userOrders, setUserOrders] = useState(null);
    const [userData, setUserData] = useState<UserData | null>(null);

    const getUserDetails = async () => {
        try {
            const res = await axios.get<{ data: UserData }>('/api/users/userdata');
            console.log(res.data.data.username);
            setUserData(res.data.data);
        } catch (error: any) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    const getUserOrders = async () => {
        try {
            const userRes = await axios.get<{ data: UserData }>('/api/users/userdata');
            const res = await axios.get(`/api/users/getAllOrders`);
            const filteredOrders = res.data.orders.filter(order => {
                return order.createdBy === userRes.data.data._id;
            });

            setUserOrders(filteredOrders);
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
            <h2>{"Мои заказы"}</h2>
            <p className='changeBlockText'>{`Вы уже сделали ${userOrders?.length} в нашем магазине!`}</p>
            {userOrders && (
                <div className='orderProfileBlock'>
                    {userOrders?.map((item, index) => (
                        <Link href={`/OrderReceipt/${item._id}`} key={index}>
                            <div className={'mini-order-item-info'}>
                                <h4 className={'mini-cart-item-info-head'}>Заказ #{item._id.toString().substring(0, 7)}</h4>
                                {item.orderStatus && (
                                    <p className={'mini-cart-item-order-status'}>
                                        Статус заказа: <b>{item.orderStatus.slice().reverse().find(status => status.selected)?.title}</b>
                                    </p>
                                )}

                                <div className={'mini-cart-footer'}>
                                    <p className={'mini-cart-item-date'}>{formatTimestampToDate(item.orderStatus[0].createdDate)}</p>
                                    <h5 className={'mini-cart-item-cost'}>Стоимость: <b>${item.totalCost.toFixed(2)}</b></h5>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
