"use client";
import axios from "axios";
import React, {FormEventHandler, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import './orderStyles.css'
import Image from "next/image";
import deleteItem from "@/img/delete.png";
import {RoleGate} from "@/components/auth/RoleGate";
import searchIco from "@/img/searchIco.png";
import {getDataBySearch} from "@/services/getData";

interface MessageData {
    messageId: string;
}

export default function AllAdminMessages() {
    const router = useRouter();
    const [userOrders, setUserOrders] = useState(null);
    const [filteredOrders, setFilteredOrders] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [messageTitleToDelete, setMessageTitleToDelete] = useState(null);
    const [messageIdToDelete, setMessageIdToDelete] = useState(null);
    const [selectedMainCategory, setSelectedMainCategory] = useState('Показать всех');
    const [search, setSearch] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleSubmit = async () => {
        if (search.trim() === '') {
            setFilteredOrders(userOrders);
            setSelectedCategory(null);
            showAllMessages();
        } else {
            const filteredResults = userOrders.filter(order =>  order.title.includes(search) ||
                order.message.includes(search) ||
                order.authorsContact.includes(search));
            setFilteredOrders(filteredResults);
        }
    };

    const getUserOrders = async () => {
        try {
            const res = await axios.get(`/api/admin/messages`);
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
            setSelectedMainCategory(null);
        }
    };
    const cancelDeleteOrder = () => {
        setShowConfirmation(false);
    };
    const openConfirmationModal = (messageId, messageTitle, event) => {
        event.preventDefault();
        setMessageIdToDelete(messageId);
        setMessageTitleToDelete(messageTitle);
        setShowConfirmation(true);
    };

    const showAllMessages = () => {
        setFilteredOrders(null);
        setSelectedCategory(null);
        setSelectedMainCategory('Показать всех');
    };
    const handleDateCategoryFilter = (sortingType) => {
        if (filteredOrders === null) {
            let sortedOrders = [...userOrders];

            switch (sortingType) {
                case 'dateAscending':
                    sortedOrders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                    break;
                case 'dateDescending':
                    sortedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    break;
                default:
                    break;
            }

            setFilteredOrders(sortedOrders);
            setSelectedCategory(sortingType);
        } else {
            let sortedOrders = [...filteredOrders];

            switch (sortingType) {
                case 'dateAscending':
                    sortedOrders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                    break;
                case 'dateDescending':
                    sortedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    break;
                default:
                    break;
            }

            setFilteredOrders(sortedOrders);
            setSelectedCategory(sortingType);
        }
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
            const response = await axios.delete("/api/admin/messages", {data: messageData});
            console.log(response.data.messages?._id);
            getUserOrders();
            cancelDeleteOrder();
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <RoleGate isAdmin={true}>
            <div className='messagesContainer'>
                {showConfirmation && (
                    <div className="confirmation-modal-overlay">
                        <div className="confirmation-modal">
                            <h2>Подтвердите удаление</h2>
                            <p>Вы уверены, что хотите удалить заказ <b>{messageTitleToDelete}</b>?</p>
                            <div className="order-delete-btns">
                                <div className="confirm-order-delete" onClick={() => cancelDeleteOrder()}
                                >Отмена
                                </div>
                                <div
                                    className="cancel-order-delete"
                                    onClick={() => {
                                        deleteMessage(messageIdToDelete)
                                    }}>Удалить
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <h1>{"Сообщения"}</h1>
                <p className='changeBlockText'>{`Увас ${userOrders?.length} сообщений!`}</p>
                <div className='messagesSortContainer'>
                    <div className='filterSearchMsg'>
                        <div className='filterSearchMsgBlock'>
                            <input
                                type='search'
                                placeholder='Поиск'
                                value={search}
                                onChange={event => setSearch(event.target.value)}
                            />
                            <div onClick={() => {
                                handleSubmit();
                            }} className='filterSearchBtn'>
                                <Image src={searchIco} alt={"Искать"}/>
                            </div>
                        </div>

                        <div className='filterMsgBlock'>
                            <h4>Сортировка заказов</h4>
                            {categories && (
                                <div className='profileBlockOrderFiltersColumn'>
                                    <div className='msgBlockCategories'>
                                        <div className={`blockCategory ${selectedMainCategory === 'Показать всех' ? 'selected' : ''}`}
                                             onClick={showAllMessages}>
                                            Показать всех
                                        </div>
                                        {categories.map((category, index) => (
                                            <div
                                                className={`blockCategory ${selectedCategory === category ? 'selected' : ''}`}
                                                key={index}
                                                onClick={() => handleCategoryFilter(category)}>
                                                {category}
                                            </div>
                                        ))}
                                    </div>
                                    <div className='msgBlockCategories'>
                                        <div onClick={() => handleDateCategoryFilter('dateAscending')}
                                             className={`blockCategory ${selectedCategory === 'dateAscending' ? 'selected' : ''}`}>
                                            Дата: сначала старые
                                        </div>
                                        <div onClick={() => handleDateCategoryFilter('dateDescending')}
                                             className={`blockCategory ${selectedCategory === 'dateDescending' ? 'selected' : ''}`}>
                                            Дата: сначала новые
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {userOrders && (
                        <div className='messagesProfileBlock'>
                            {(filteredOrders || userOrders)?.map((item, index) => (
                                <div key={index} className={'mini-msg-item-info'}>
                                    <div className={'mini-cart-item-info-head'}>
                                        <div>
                                            <h4 className={'mini-cart-item-title'}>{item.title}</h4>

                                        </div>
                                        <div className={'mini-cart-item-close-block'} onClick={(event) => openConfirmationModal(item._id, item.title, event)}>
                                            <Image className="shearMessageCloseImg" src={deleteItem} alt={'x'}></Image>
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
            </div>
        </RoleGate>
    );
}
