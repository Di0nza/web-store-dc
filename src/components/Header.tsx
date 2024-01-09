"use client";
import Link from "next/link";
import './componentsStyles.css'
import Image from "next/image";
import headerLogo from '../img/headerLogo.png';
import React, {useEffect, useState} from "react";
import {Navigation} from "./Navigation";
import axios from "axios";
import arrowB from "@/img/arrowB.png";

interface UserData {
    isAdmin: boolean;
    username: string;
    email: string;
    createdAt?: string;
}

const Header = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const navItems = [
        {label: 'О нас', href: '/about'},
        {label: 'Магазин', href: '/store'},
        {label: userData ? 'Профиль' : 'Войти', href: userData ? '/profile' : '/signup' },
        {label: 'Корзина', href: '/cart'},
    ];
    const navAdminItems = [
        {label: 'Стилизация', href: '/adminProfile'},
        {label: 'Товары', href: '/adminProfile'},
        {label: 'Заказы', href: '/adminProfile'},
        {label: 'Промокоды', href: '/adminPromocodes'},
    ];
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
        //getUserDetails();
    }, []);

    return (
        <header className='header-container'>
            <Navigation navLinks={userData?.isAdmin ? navAdminItems : navItems}/>
        </header>
    )
}

export {Header}
