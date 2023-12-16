"use client";
import axios from "axios";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import googleLogo from "@/img/pngwinggoogleLogo.png";
import './profileStyles.css'
import arrowB from '../../img/arrowB.png'

interface UserData {
    username: string;
    email: string;
    createdAt?: string;
}

export default function ProfilePage() {
    const router = useRouter();
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
            <h2>{"Личный кабинет"}</h2>
            {userData && (
                <>
                    <p className='profileHelloText'>Здравсвуйте, {userData.username}</p>
                    <p  className='createdDate'>Дата создания аккаунта: {new Date(userData.createdAt).toLocaleString()}</p>
                </>
            )}
            <div className='profileLinkBlock'>
                <Link href={'/changeProfileData'} className='additionalProfileLink'>
                    <p>Изменить данные профиля</p>
                    <Image className='additionalProfileImage' src={arrowB} alt={'>'}/>
                </Link>
                <div className='additionalProfileLink'>
                    <p>Мои заказы</p>
                    <Image className='additionalProfileImage' src={arrowB} alt={'>'}/>
                </div>
                <div className='additionalProfileLink'>
                    <p>Корзина</p>
                    <Image className='additionalProfileImage' src={arrowB} alt={'>'}/>
                </div>
                <div className='additionalProfileLink'>
                    <p>Избранные</p>
                    <Image className='additionalProfileImage' src={arrowB} alt={'>'}/>
                </div>
                <div className='additionalProfileLink' onClick={logout}>
                    <p>Выйти из аккаунта</p>
                    <Image className='additionalProfileImage' src={arrowB} alt={'>'}/>
                </div>
            </div>

        </div>
    );
}

