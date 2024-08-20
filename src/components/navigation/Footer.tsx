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
import instLogo from "@/img/shearIcons/instlogo.png";
import vklogo from "@/img/shearIcons/vklogo.png";
import tglogo from "@/img/shearIcons/tglogo.png";
interface UserData {
    isAdmin: boolean;
    name: string;
    email: string;
    createdAt?: string;
}
const Footer = () => {
    const [userData, setUserData] = useState(null);
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
        // @ts-ignore
        setUserData(user);
        console.log(userData);
    }, [sessionTime]);
    return (
        <OrderProvider>
            <footer className='footer-container'>
                <div className='footer-block'>
                    {isFooterErrorBlockOpen && (
                        <FooterErrorBlock onClose={toggleFooterErrorBlock}/>
                    )}
                    {isFooterCooperationBlockOpen && (
                        <FooterCooperationBlock onClose={toggleFooterCooperationBlock}/>
                    )}
                    <div className='footer-info-block'>
                        <div className='footer-navigation-container'>
                            {userData?.isAdmin ? (
                                    <div className='footer-navigation-block'>
                                        <Link href={'/changeProfileData'}>Изменение</Link>
                                        <Link href={'/allAdminMessages'}>Сообщения</Link>
                                        <Link href={'/adminProfile/customizations'}>Стилизация</Link>
                                    </div>
                                ) : (
                                    <div className='footer-navigation-block'>
                                        <Link href={'/about'}>О нас</Link>
                                        <Link href={'/about/contacts'}>Контакты</Link>
                                        <Link href={'/about/instructions'}>Команда</Link>
                                    </div>
                                )}
                            {userData !== null ? (
                                userData?.isAdmin ? (
                                    <div className='footer-navigation-block'>
                                        <Link href={'/adminProfile'}>Профиль</Link>
                                        <Link href={'/allAdminOrders'}>Заказы</Link>
                                        <Link href={'/adminProducts'}>Товары</Link>
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
                                        <Link href={'/adminProfile/articles'}>Статьи</Link>
                                    </div>
                                ) : (
                                    <div className='footer-navigation-block'>
                                        <Link href={'/store'}>Магазин</Link>
                                        <Link href={'/cart'}>Корзина</Link>
                                        <Link href={'/articles'}>Статьи</Link>
                                    </div>
                                )
                            }
                        </div>
                        <div className='footer-info-social-block'>
                            <Link className='footer-info-title' href={userData?.isAdmin ? '/adminProfile' : '/'}>
                                <Image className='footer-title-textLogo' src={textLogo} alt={'MaryDeniz'}></Image>
                                <Image className='footer-title-logo' src={headerLogo} alt={'MaryDeniz'}></Image>
                            </Link>
                            <div className='footer-social-links'>
                                <div className='footer-social-links-block'>
                                    <a href="https://t.me/marideniz_brand28" target="_blank" rel="noopener noreferrer">
                                        <Image src={tglogo} alt="Telegram"/>
                                    </a>
                                </div>
                                <div className='footer-social-links-block'>
                                    <a href="https://vk.com/marideniz_brand" target="_blank" rel="noopener noreferrer">
                                        <Image src={vklogo} alt="VKontakte"/>
                                    </a>
                                </div>
                                <div className='footer-social-links-block'>
                                    <a href="https://www.instagram.com/marideniz.ru?igsh=aDV0eDJpOW1ndW5t"
                                       target="_blank" rel="noopener noreferrer">
                                        <Image src={instLogo} alt="Instagram"/>
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='footer-error-block'>
                        {/*<p>Помогите сделать наш сервис лучше</p>*/}
                        <div className='footer-btns-block'>
                            <button className='footer-error-btn' onClick={toggleFooterErrorBlock}>
                                <p>Сообщить об ошибке</p>
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
