"use client";
import Image from "next/image";
import headerLogo from "@/img/headerLogo.png";
import textLogo from "@/img/textLogo.png";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import axios from "axios";
import OwnDesignOrder from "@/components/homeScreen/ownDesignOrder";
import FooterCooperationBlock from "@/components/modals/footerCooperationBlock";
import FooterErrorBlock from "@/components/modals/footerErrorBlock";
import {OrderProvider, useOrderContext} from "@/orderContext/store";
import {useCurrentUser} from "@/hooks/useCurrentUser";
interface UserData {
    isAdmin: boolean;
    name: string;
    email: string;
    createdAt?: string;
}
const Footer = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isFooterErrorBlockOpen, setIsFooterErrorBlockOpen] = useState(false);
    const [isFooterCooperationBlockOpen, setIsFooterCooperationBlockOpen] = useState(false);
    // @ts-ignore
    const {sessionTime, setSessionTime} = useOrderContext();
    const user = useCurrentUser();
    const toggleFooterErrorBlock = () => {
        setIsFooterErrorBlockOpen(!isFooterErrorBlockOpen);
        setIsFooterCooperationBlockOpen(false);
    };

    const toggleFooterCooperationBlock = () => {
        setIsFooterCooperationBlockOpen(!isFooterCooperationBlockOpen);
        setIsFooterErrorBlockOpen(false);
    };


    const getUserDetails = async () => {
        try {
            const res = await axios.get<{ data: UserData }>('/api/users/userdata');
            console.log(res.data.data.name);
            setUserData(res.data.data);
        } catch (error: any) {
            console.log(error.message);
        }
    };
    useEffect(() => {
        setUserData(user);
        console.log(userData);
    }, [sessionTime]);
    return (
        <OrderProvider>
            <footer className='footer-container'>
                <div className='footer-block'>
                    {isFooterErrorBlockOpen && (
                        <FooterErrorBlock/>
                    )}
                    {isFooterCooperationBlockOpen && (
                        <FooterCooperationBlock/>
                    )}
                    <div className='footer-info-block'>
                        <div className='footer-navigation-container'>
                            {userData?.isAdmin ? (
                                    <div className='footer-navigation-block'>
                                        <Link href={'/changeProfileData'}>Изменение данных</Link>
                                        <Link href={'/allAdminMessages'}>Сообщения</Link>
                                        <Link href={'/adminProfile/customizations'}>Изменение главной</Link>
                                    </div>
                                ) : (
                                    <div className='footer-navigation-block'>
                                        <Link href={'/about'}>О нас</Link>
                                        <Link href={'/about/contacts'}>Контакты</Link>
                                        <Link href={'/about/team'}>Команда</Link>
                                    </div>
                                )}
                            {userData !== null ? (
                                userData?.isAdmin ? (
                                    <div className='footer-navigation-block'>
                                        <Link href={'/adminProfile'}>Профиль</Link>
                                        <Link href={'/allAdminOrders'}>Заказы</Link>
                                        <Link href={'/adminProfile/products'}>Товары</Link>
                                    </div>
                                ) : (
                                    <div className='footer-navigation-block'>
                                        <Link href={'/profile'}>Профиль</Link>
                                        <Link href={'/userOrders'}>Заказы</Link>
                                        <Link href={'/favorites'}>Избранные</Link>
                                    </div>
                                )

                            ) : (
                                <div className='footer-navigation-block'>
                                    <Link href={'/login'}>Авторизация</Link>
                                    <Link href={'/signup'}>Регистрация</Link>
                                </div>
                            )}
                            {
                                userData?.isAdmin ? (
                                    <div className='footer-navigation-block'>
                                        <Link href={'/adminStatistics'}>Статистика</Link>
                                        <Link href={'/adminProfile/promocodes'}>Промокоды</Link>
                                    </div>
                                ) : (
                                    <div className='footer-navigation-block'>
                                        <Link href={'/about'}>Магазин</Link>
                                        <Link href={'/cart'}>Корзина</Link>
                                    </div>
                                )
                            }
                        </div>
                        <Link className='footer-info-title' href={userData?.isAdmin ? '/adminProfile' : '/'}>
                            <Image className='footer-title-textLogo' src={textLogo} alt={'MaryDeniz'}></Image>
                            <Image className='footer-title-logo' src={headerLogo} alt={'MaryDeniz'}></Image>
                        </Link>
                    </div>
                    <div className='footer-error-block'>
                        <p>Помогите сделать наш сервис лучше</p>
                        <div className='footer-btns-block'>
                            <button className='footer-error-btn' onClick={toggleFooterErrorBlock}>
                                <p>Сообщить об ошоибке</p>
                            </button>
                            <button className='footer-cooperation-btn' onClick={toggleFooterCooperationBlock}>
                                <p>Предложение о сотрудничестве</p>
                            </button>
                        </div>
                    </div>
                    <p className='footer-privacy-text'>Этот сайт использует Google Analytics, чтобы помочь нам улучшить
                        его содержимое.
                        <Link className='footer-privacy-link-text' href={'/privacyPolicy'}>Политика
                            Конфиденциальности</Link>
                    </p>
                </div>
            </footer>
        </OrderProvider>
    )
}
export {Footer}
