"use client";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import './orderStyles.css'
import Image from "next/image";
import close from "@/img/close.png";
interface MessageData {
    messageId: string;
}
export default function allAdminMessages() {
    const router = useRouter();
    const [userOrders, setUserOrders] = useState(null);
    const [filteredOrders, setFilteredOrders] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const getUserOrders = async () => {
        try {
            const res = await axios.get(`/api/users/messages`);
            setUserOrders(res.data.messages);
        } catch (error: any) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        getUserOrders();
    }, []);

    useEffect(() => {
        if (userOrders) {
            const uniqueCategories = Array.from(new Set(userOrders.map(item => item.category)));
            setCategories(uniqueCategories);
        }
    }, [userOrders]);

    const handleCategoryFilter = (category) => {
        if (userOrders) {
            const filtered = userOrders.filter(item => item.category === category);
            setFilteredOrders(filtered);
            setSelectedCategory(category);
        }
    };

    const showAllMessages = () => {
        setFilteredOrders(null);
        setSelectedCategory(null);
    };

    const createdAt = userOrders?.createdAt;
    const monthsInRussian = [
        'Янв.', 'Фев.', 'Мар.', 'Апр.', 'Мая', 'Июн.',
        'Июл.', 'Авг.', 'Сен.', 'Окт.', 'Ноя.', 'Дек.'
    ];
    const formatTimestampToDate = (timestamp) => {
        if (!timestamp) return '';

        const formattedDate = new Date(timestamp);
        const monthIndex = formattedDate.getMonth();
        const day = formattedDate.getDate();
        const year = formattedDate.getFullYear();
        const monthInRussian = monthsInRussian[monthIndex];
        const hours = formattedDate.getHours().toString().padStart(2, '0');
        const minutes = formattedDate.getMinutes().toString().padStart(2, '0');

        return `${day} ${monthInRussian} ${year} ${hours}:${minutes}`;
    };
    const deleteMessage = async (messageId: string) => {
        try {
            const messageData: MessageData = {
                messageId: messageId,
            };
            const response = await axios.delete("/api/users/messages", { data: messageData });
            console.log(response.data.messages?._id);
            window.location.reload();
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className='profileBlock'>
            <h2>{"Сообщения"}</h2>
            <p className='changeBlockText'>{`Увас ${userOrders?.length} сообщений!`}</p>
            {categories && (
                <div className='profileBlockCategories'>
                    <div className={`blockCategory ${!selectedCategory ? 'selected' : ''}`}
                         onClick={showAllMessages}>
                        Показать всех
                    </div>
                    {categories.map((category, index) => (
                        <div className={`blockCategory ${selectedCategory === category ? 'selected' : ''}`}
                             key={index}
                             onClick={() => handleCategoryFilter(category)}>
                            {category}
                        </div>
                    ))}
                </div>
            )}
            {userOrders && (
                <div className='orderProfileBlock'>
                    {(filteredOrders || userOrders)?.map((item, index) => (
                        <div key={index} className={'mini-order-item-info'}>
                            <div className={'mini-cart-item-info-head'}>
                                <div>
                                    <h4 className={'mini-cart-item-title'}>{item.title}</h4>

                                </div>
                                <div className={'mini-cart-item-close-block'} onClick={() => {deleteMessage(item._id)}}>
                                    <Image className="shearContainerCloseImg" src={close} alt={'x'}></Image>
                                </div>
                            </div>
                            <div className={'mini-admin-cart-footer'}>
                                <p className={'messages-category-block'}>{item.category}</p>
                                <h5 className={'messages-category-sender'}>
                                    <b>Отправитель:</b> {item.authorsContact}
                                </h5>
                                <p className={'messages-category-sender'}>{(item.message)}</p>
                                <p className={'mini-cart-item-date'}>{formatTimestampToDate(item.createdAt)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
