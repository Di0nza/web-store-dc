"use client";
import axios from "axios";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import googleLogo from "@/img/pngwinggoogleLogo.png";
import './profileStyles.css'
import arrowB from '../../img/arrowB.png'
import {signOut} from "next-auth/react";
import {useCurrentUser} from "@/hooks/useCurrentUser";

interface UserData {
    name: string;
    email: string;
    createdAt?: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const user = useCurrentUser();

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
        console.log(user)
        setUserData(user);
        //getUserDetails();
    }, []);

    const logout = async () => {
        try {
            await signOut()
            // await axios.get('/api/users/logout');
            // router.push('/');
            // window.location.reload();
        } catch (error: any) {
            console.log(error.message);
        }
    };

    return (
        <div className='profileBlock'>
            <h2>{"Личный кабинет"}</h2>
            {userData && (
                <>
                    <p className='profileHelloText'>Здравсвуйте, {userData?.name}</p>
                    <p  className='createdDate'>Дата создания аккаунта: {new Date(userData?.emailVerified).toLocaleString()}</p>
                </>
            )}
            <div className='profileLinkBlock'>
                <Link href={'/changeProfileData'} className='additionalProfileLink'>
                    <p>Изменить данные профиля</p>
                    <Image className='additionalProfileImage' src={arrowB} alt={'>'}/>
                </Link>
                <Link href={'/store'} className='additionalProfileLink'>
                    <p>Магазин</p>
                    <Image className='additionalProfileImage' src={arrowB} alt={'>'}/>
                </Link>
                <Link href={'/userOrders'} className='additionalProfileLink'>
                    <p>Мои заказы</p>
                    <Image className='additionalProfileImage' src={arrowB} alt={'>'}/>
                </Link>
                <Link href={'/cart'} className='additionalProfileLink'>
                    <p>Корзина</p>
                    <Image className='additionalProfileImage' src={arrowB} alt={'>'}/>
                </Link>
                <Link href={'/favorites'} className='additionalProfileLink'>
                    <p>Избранные</p>
                    <Image className='additionalProfileImage' src={arrowB} alt={'>'}/>
                </Link>
                <Link href={'/about'} className='additionalProfileLink'>
                    <p>О Нас</p>
                    <Image className='additionalProfileImage' src={arrowB} alt={'>'}/>
                </Link>
                <div className='additionalProfileLink' onClick={logout}>
                    <p>Выйти из аккаунта</p>
                    <Image className='additionalProfileImage' src={arrowB} alt={'>'}/>
                </div>
            </div>
        </div>
    );
}

