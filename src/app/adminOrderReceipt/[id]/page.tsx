'use client'
import './placingOrder.css'
import Link from "next/link";
import React, {useEffect, useRef, useState} from "react";
import {Metadata} from "next";
import axios from "axios";
import Image from "next/image";
import arrowW from '../../../img/arrowW.png'
import deleteItem from "@/img/delete.png";
import checkOrderStatusW from "@/img/checkOrderStatusW.png";
import checkOrderStatusB from "@/img/checkOrderStatusB.png";

interface orderData {
    name: string;
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
    const [trackingCode, setTrackingCode] = useState('');
    const [trackingLink, setTrackingLink] = useState('');
    const [formattedDateTime, setFormattedDateTime] = useState('');
    const [orderData, setOrderData] = useState(null);
    const getUserDetails = async () => {
        try {
            const res = await axios.get<{ data: orderData }>(`/api/users/getAllOrders`);
            let foundOrder: any;
            foundOrder = res.data.orders.find(order => order._id === id);
            setOrderData(foundOrder);
            setTrackingCode(foundOrder.trackingCode);
            setTrackingLink(foundOrder.trackingLink);
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
            return "600";
        } else {
            return "300";
        }
    };
    const handleStatusUpdate = async (statusTitle, orderId) => {
        try {
            const updatedStatus = {
                id: orderId,
                title: statusTitle,
                createdDate: Date.now(),
            };
            const res = await axios.put(`/api/users/order`, updatedStatus);
            console.log(res.data.updatedOrder.orderStatus)
            window.location.reload();
        } catch (error) {
            console.error('Error updating status:', error.message);
        }
    };
    const handleTrackingUpdate = async (orderId) => {
        try {
            const updatedStatus = {
                id: orderId,
                trackingCode: trackingCode,
                trackingLink: trackingLink
            };
            const res = await axios.put(`/api/users/orderTracking`, updatedStatus);
            console.log(res.data.updatedOrder);
            window.location.reload();
        } catch (error) {
            console.error('Error updating status:', error.message);
        }
    };

    return (
        <div className='placingOrderBlock'>
            <h2>{`Заказ #${orderData?._id}`}</h2>
            <h4><b>{orderData?.totalNumber}</b> товаров на сумму <b>${orderData?.totalCost}</b> ({orderData?.paymentState})</h4>
            <div>
                <div className='placingOrderBlockRow'>
                    <div className={'firstInfoContainer'}>
                        <div className='firstInfoBlock'>
                            <h3>Информация о доставке</h3>
                            <p><b>Способ доставки:</b> {orderData?.deliveryMethod}</p>
                            <p><b>Адрес:</b> {orderData?.country}, {orderData?.city},
                                ул. {orderData?.street},(д.{orderData?.house},
                                кв.{orderData?.apartment}), {orderData?.zip}</p>
                            <p><b>Дата создания:</b> {formattedDateTime}</p>
                            <p><b>Дополнительная информация:</b> {orderData?.additionalInformation}</p>
                        </div>
                        <div className='placingOrderInfoContainer'>
                            <div className='placingOrderInfoBlock'>
                                <h3>Статус заказа:</h3>
                                <p className='placingOrderAdvice'>
                                    Лучше редактировать статус заказа после реального изменения статуса заказа.
                                    Если "Доставка", то указать, что товар в пути лучше только после добавления
                                    трек-кода</p>
                                <div className={'orderStatusBtnsBlock'}>
                                    {statuses.map((status, index) => (
                                        <div key={index} className='orderStatusInput'>
                                            <div>
                                                <div key={index} style={{
                                                    color: getStatusColor(index, status.selected),
                                                    fontWeight: getStatusWeight(index, status.selected)
                                                }}>
                                                    <p>{status.title}</p>
                                                </div>
                                                <div key={index} style={{
                                                    color: getStatusColor(index, status.selected),
                                                }}>
                                                    {status.createdDate !== '' ? (
                                                            <p>{formatTimestampToDate(status.createdDate)}</p>)
                                                        : (
                                                            <p>Пока неизвестно</p>
                                                        )}
                                                </div>
                                            </div>
                                            <button className={'orderStatusInputBtn'}
                                                    onClick={() => handleStatusUpdate(status.title, orderData?._id)}>
                                                <Image className={'orderStatusInputBtnImg'} src={arrowW} alt={'>'}/>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Link href={'/'} className={'placingOrderBlockButton'}>
                                {"На главную"}
                            </Link>
                        </div>
                    </div>
                    <div className={'firstInfoContainer'}>
                        <div className='firstInfoBlock'>
                            <h3>Контактные данные</h3>
                            <p><b>Имя:</b> {orderData?.name}</p>
                            <p><b>Email:</b> {orderData?.email}</p>
                            <p><b>Телефон:</b> {orderData?.telephone}</p>
                        </div>
                        <div className={'check-cart-trek-inputs'}>
                            <h3>Трекер заказа:</h3>
                            <input
                                id="trackingCodeInput"
                                type="text"
                                placeholder="Трекер-код"
                                value={trackingCode}
                                onChange={(e) => setTrackingCode(e.target.value)}
                            />
                            <input
                                id="trackingLinkInput"
                                type="text"
                                placeholder="Сайт для отслеживания"
                                value={trackingLink}
                                onChange={(e) => setTrackingLink(e.target.value)}
                            />
                            <button onClick={() => handleTrackingUpdate(orderData?._id)}>Обновить трекер</button>
                        </div>
                        <div className='products-value-cont'>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
