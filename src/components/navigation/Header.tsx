"use client";
import Link from "next/link";
import '../componentsStyles.css'
import Image from "next/image";
import headerLogo from '../../img/headerLogo.png';
import React, {useEffect, useState} from "react";
import {Navigation} from "./Navigation";
import axios from "axios";
import arrowB from "@/img/arrowB.png";
import {OrderProvider, useOrderContext} from "@/orderContext/store";
import {useCurrentUser} from "@/hooks/useCurrentUser";

interface UserData {
    isAdmin: boolean;
    name: string;
    email: string;
    createdAt?: string;
}

const Header = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const user = useCurrentUser();
    // @ts-ignore
    const {sessionTime, setSessionTime} = useOrderContext();
    const navItems = [
        {label: 'О нас', href: '/about'},
        {label: 'Магазин', href: '/store'},
        {label: userData ? 'Профиль' : 'Войти', href: userData ? '/profile' : '/login' },
        {label: 'Корзина', href: '/cart'},
    ];
    const navAdminItems = [
        {label: 'Стилизация', href: '/adminProfile/customizations'},
        {label: 'Товары', href: '/adminProducts'},
        {label: 'Заказы', href: '/allAdminOrders'},
        {label: 'Профиль', href: '/adminProfile'},
    ];
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
        getUserDetails();
        setUserData(user);
    }, [sessionTime]);

    return (
        <OrderProvider>
            <header className='header-container'>
                <Navigation navLinks={userData?.isAdmin ? navAdminItems : navItems}/>
            </header>
        </OrderProvider>
    )
}

export {Header}
