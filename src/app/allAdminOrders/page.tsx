"use client";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import './orderStyles.css'
import deleteItem from "@/img/delete.png";
import Image from "next/image";

export default function UserOrders() {
    const router = useRouter();
    const [userOrders, setUserOrders] = useState(null);
    const [filteredOrders, setFilteredOrders] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedMainCategory, setSelectedMainCategory] = useState('Показать всех');
    const [selectedDateCategory, setSelectedDateCategory] = useState(null);
    const [formattedDateTime, setFormattedDateTime] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [orderIdToDelete, setOrderIdToDelete] = useState(null);

    const getUserOrders = async () => {
        try {
            const res = await axios.get(`/api/users/getAllOrders`);
            setUserOrders(res.data.orders);
            setFilteredOrders(res.data.orders);
        } catch (error: any) {
            console.log(error.message);
        }
    };
    const deleteOrder = async (orderId, event) => {
        event.preventDefault();
        try {
            const response = await axios.delete(`/api/users/order`, {
                data: { orderId }
            });
            console.log(response.data.message);
            setShowConfirmation(false);
            getUserOrders();
        } catch (error) {
            console.error(error.message);
        }
    };
    const openConfirmationModal = (orderId, event) => {
        event.preventDefault();
        setOrderIdToDelete(orderId);
        setShowConfirmation(true);
    };
    const cancelDeleteOrder = () => {
        setShowConfirmation(false);
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

    const handleCategoryFilter = (statusTitle) => {
        if (userOrders) {
            const filtered = userOrders.filter(item => {
                const lastSelectedStatus = item.orderStatus.slice().reverse().find(status => status.selected);
                return lastSelectedStatus && lastSelectedStatus.title === statusTitle;
            });
            setFilteredOrders(filtered);
            setSelectedMainCategory('Показать всех');
            setSelectedCategory(statusTitle);
        }
    };
    const statusOrder = [
        "Обработка заказа",
        "Упаковка заказа",
        "Товар в пути",
        "Ожидает в пункте выдачи",
        "Получен покупателем"
    ];
    const handleDateCategoryFilter = (sortingType) => {
        if (filteredOrders) {
            let sortedOrders = [...filteredOrders]; // Создаем копию заказов для изменения сортировки

            switch (sortingType) {
                case 'dateAscending':
                    sortedOrders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                    break;
                case 'dateDescending':
                    sortedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    break;
                case 'statusAscending':
                    sortedOrders.sort((a, b) => {
                        const lastStatusA = a.orderStatus.slice().reverse().find(status => status.selected)?.title || '';
                        const lastStatusB = b.orderStatus.slice().reverse().find(status => status.selected)?.title || '';
                        return statusOrder.indexOf(lastStatusA) - statusOrder.indexOf(lastStatusB);
                    });
                    break;
                case 'statusDescending':
                    sortedOrders.sort((a, b) => {
                        const lastStatusA = a.orderStatus.slice().reverse().find(status => status.selected)?.title || '';
                        const lastStatusB = b.orderStatus.slice().reverse().find(status => status.selected)?.title || '';
                        return statusOrder.indexOf(lastStatusB) - statusOrder.indexOf(lastStatusA);
                    });
                    break;
                default:
                    break;
            }

            setFilteredOrders(sortedOrders);
            setSelectedDateCategory(sortingType);
        }
    };

    const showAllMessages = () => {
        setFilteredOrders(userOrders);
        setSelectedCategory(null);
        setSelectedMainCategory('Показать всех');
    };
    const showOnlyActiveMessages = () => {
        if (userOrders) {
            const activeOrders = userOrders.filter(item =>
                item.orderStatus.slice().reverse().find(status => status.selected)?.title !== 'Получен покупателем'
            );
            setFilteredOrders(activeOrders);
            setSelectedCategory(null);
            setSelectedMainCategory('Только активные');
        }
    };

    const showOnlyInactiveMessages = () => {
        if (userOrders) {
            const inactiveOrders = userOrders.filter(item =>
                item.orderStatus.slice().reverse().find(status => status.selected)?.title === 'Получен покупателем'
            );
            setFilteredOrders(inactiveOrders);
            setSelectedCategory(null);
            setSelectedMainCategory('Только неактивные');
        }
    };
    const createdAt = filteredOrders?.createdAt;
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
    const formatDateTime = (createdAt) => {
        const formattedDate = new Date(createdAt);
        const monthIndex = formattedDate.getMonth();
        const monthInRussian = monthsInRussian[monthIndex];
        const hours = formattedDate.getHours();
        const minutes = formattedDate.getMinutes();

        return `${formattedDate.getDate()} ${monthInRussian} ${formattedDate.getFullYear()} ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    };

    return (
        <div className='adminOrdersBlock'>
            {showConfirmation && (
                <div className="confirmation-modal-overlay">
                    <div className="confirmation-modal">
                        <h2>Подтвердите удаление</h2>
                        <p>Вы уверены, что хотите удалить заказ <b>{orderIdToDelete}</b>?</p>
                        <div className="order-delete-btns">
                            <div className="confirm-order-delete" onClick={() => cancelDeleteOrder()}
                                 >Отмена
                            </div>
                            <div
                                className="cancel-order-delete"
                                onClick={(event) =>
                                    deleteOrder(orderIdToDelete, event)
                            }>Удалить</div>
                        </div>
                    </div>
                </div>
            )}
            <h2>{"Все заказы"}</h2>
            <p className='changeBlockText'>{`В обработке находятся ${userOrders?.length} заказов`}</p>
            {userOrders && (
                <div className='orderFilterBlock'>
                    <div className='ordersProfileBlock'>
                        {filteredOrders?.map((item, index) => (
                            <Link href={`/adminOrderReceipt/${item._id}`} key={index}>
                                <div className={'mini-order-item-info'}
                                style={{opacity:item.orderStatus.slice().reverse().find(status => status.selected)?.title === "Получен покупателем" ? '0.4' : '1'}}>
                                    <div className={'order-header'}>
                                        <p className={'mini-admin-item-info-head'}><b>Заказ
                                            #{item._id.toString().substring(0, 7)}</b></p>
                                        <Image onClick={(event) => openConfirmationModal(item._id, event)} className={'order-item-delete-img'} src={deleteItem} alt={'x'}></Image>
                                    </div>
                                    {item.orderStatus && (
                                        <p className={'mini-cart-item-order-status'}>
                                            Статус
                                            заказа: <b>{item.orderStatus.slice().reverse().find(status => status.selected)?.title}</b>
                                        </p>
                                    )}
                                    <div className={'mini-order-footer'}>
                                        <p className={'mini-cart-item-date'}>{formatTimestampToDate(item.orderStatus.slice().reverse().find(status => status.selected)?.createdDate)}</p>
                                        <div className={'mini-cart-footer-right'}>
                                            <h5 className={'mini-cart-item-cost'}>Стоимость: <b>${item.totalCost.toFixed(2)}</b>
                                            </h5>
                                            <p className={'mini-cart-item-date'}>{formatDateTime(item.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className='filterBlock'>
                        <h4>Сортировка заказов</h4>
                        {categories && (
                            <div className='profileBlockOrderFiltersColumn'>
                                <div className='profileBlockOrderFilters'>
                                    <div className={`blockCategory ${selectedMainCategory === 'Показать всех' ? 'selected' : ''}`}
                                         onClick={showAllMessages}>
                                        Показать всех
                                    </div>
                                    <div className={`blockCategory ${selectedMainCategory === 'Только активные' ? 'selected' : ''}`}
                                         onClick={showOnlyActiveMessages}>
                                        Только активные
                                    </div>
                                    <div className={`blockCategory ${selectedMainCategory === 'Только неактивные' ? 'selected' : ''}`}
                                         onClick={showOnlyInactiveMessages}>
                                        Только неактивные
                                    </div>
                                </div>
                                <div className='profileBlockOrderFilters'>
                                    <div onClick={() => handleDateCategoryFilter('dateAscending')}
                                         className={`blockCategory ${selectedDateCategory === 'dateAscending' ? 'selected' : ''}`}>
                                        Дата: по возрастанию
                                    </div>
                                    <div onClick={() => handleDateCategoryFilter('dateDescending')}
                                        className={`blockCategory ${selectedDateCategory === 'dateDescending'  ? 'selected' : ''}`}>
                                        Дата: по убыванию
                                    </div>
                                    <div onClick={() => handleDateCategoryFilter('statusAscending')}
                                        className={`blockCategory ${selectedDateCategory === 'statusAscending'  ? 'selected' : ''}`}>
                                        Статус: по возрастанию
                                    </div>
                                    <div onClick={() => handleDateCategoryFilter('statusDescending')}
                                         className={`blockCategory ${selectedDateCategory === 'statusDescending'  ? 'selected' : ''}`}>
                                        Статус: по убыванию
                                    </div>
                                </div>
                                <div className='profileBlockOrderFilters'>
                                    {categories.map((category, index) => (
                                        <div
                                            className={`blockCategory ${selectedCategory === category ? 'selected' : ''}`}
                                            key={index}
                                            onClick={() => handleCategoryFilter(category)}>
                                            {category}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
