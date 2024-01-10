"use client";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import './profileStyles.css'
import Link from "next/link";
import {useCurrentUser} from "@/hooks/useCurrentUser";

interface UserData {
    name: string;
    email: string;
    createdAt?: string;
}

export default function ChangeProfileData() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const user = useCurrentUser();

    const handleUpdateProfile = async () => {
        try {
            const updatedData: Partial<UserData> = {};
            if (name.trim() !== '' && name !== (userData?.name ?? '')) {
                updatedData.name = name;
            }
            if (email.trim() !== '') {
                updatedData.email = email;
            }
            if (Object.keys(updatedData).length === 0) {
                return;
            }
            await axios.put('/api/users/update', updatedData);
            setUserData({...userData, ...updatedData});
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        setUserData(user);
        setName(user.name);
        setEmail(user.email);
    }, []);

    return (
        <div className='profileBlock'>
            <h2>{"Изменение данных профиля"}</h2>
            <p className='changeBlockText'>Хотите <Link className='loginLink' href="/login">Изменить пароль</Link>?</p>
            {userData && (
                <>
                    <div className='updateInfoProfileBlock'>
                        <label className='updateProfileBlockLabel'>Имя</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                        <label className='updateProfileBlockLabel'>Почта</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <button onClick={handleUpdateProfile}>Изменить</button>
                    </div>

                </>
            )}
        </div>
    );
}
