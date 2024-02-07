"use client";
import axios from "axios";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import Image from "next/image";
import googleLogo from "@/img/pngwinggoogleLogo.png";
import './profileStyles.css'
import arrowB from '../../img/arrowB.png'
import {useCurrentUser} from "@/hooks/useCurrentUser";


interface UserData {
    name: string;
    email: string;
    createdAt?: Date;
}

export default function ProfilePage() {
    const router = useRouter();
    const pathname = usePathname();
    const [userData, setUserData] = useState(null);
    const [userOrders, setUserOrders] = useState(null);
    const user = useCurrentUser();
    const getUserOrders = async () => {
        try {
            const res = await axios.get(`/api/admin/messages`);
            setUserOrders(res.data.messages);
            console.log(res.data.messages)
        } catch (error: any) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        getUserOrders();
    }, []);

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
        //getUserDetails();
        setUserData(user);
    }, []);

    const logout = async () => {
        try {
            await axios.get('/api/users/logout');
            router.push('/');
            window.location.reload();
        } catch (error: any) {
            console.log(error.message);
        }
    };

    return (
        <div className='profileBlock'>
            <h2>{"Личный кабинет администратора"}</h2>
            {userData && (
                <>
                    <p className='profileHelloText'>Здравсвуйте, Админ {userData.name}</p>
                    <p  className='createdDate'>Дата создания аккаунта: {new Date(userData?.emailVerified).toLocaleString()}</p>
                </>
            )}
            <div className='profileLinkBlock'>
                <Link href={'/changeProfileData'} className='additionalProfileLink'>
                    <p>Изменить данные профиля</p>
                    <Image className='additionalProfileImage' src={arrowB} alt={'>'}/>
                </Link>
                <Link  href={`${pathname}/customizations`}  className='additionalProfileLink'>
                    <p>Стилизация</p>
                    <Image className='additionalProfileImage' src={arrowB} alt={'>'}/>
                </Link>
                <Link href={`adminProducts`} className='additionalProfileLink'>
                    <p>Товары</p>
                    <Image className='additionalProfileImage' src={arrowB} alt={'>'}/>
                </Link>
                <Link href={`allAdminOrders`} className='additionalProfileLink'>
                    <p>Заказы</p>
                    <Image className='additionalProfileImage' src={arrowB} alt={'>'}/>
                </Link>
                <Link href={`${pathname}/promocodes`} className='additionalProfileLink'>
                    <p>Промокоды</p>
                    <Image className='additionalProfileImage' src={arrowB} alt={'>'}/>
                </Link>
                <Link href={'/adminStatistics'} className='additionalProfileLink'>
                    <p>Статистика</p>
                    <Image className='additionalProfileImage' src={arrowB} alt={'>'}/>
                </Link>
                <Link href={'/allAdminMessages'} className='additionalProfileLink'>
                    <p>Сообщения</p>
                    <div className='messagesBlock'>
                        <div className='messagesBlockCount'>
                            <p>{userOrders?.length}</p>
                        </div>
                        <Image className='additionalProfileImage' src={arrowB} alt={'>'}/>
                    </div>
                </Link>
                <div className='additionalProfileLink' onClick={logout}>
                    <p>Выйти из аккаунта</p>
                    <Image className='additionalProfileImage' src={arrowB} alt={'>'}/>
                </div>
            </div>

        </div>
    );
}

