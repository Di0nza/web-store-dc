"use client";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import './profileStyles.css'
import Link from "next/link";

interface UserData {
    username: string;
    email: string;
    createdAt?: string;
}

export default function ChangeProfileData() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const handleUpdateProfile = async () => {
        try {
            const updatedData: Partial<UserData> = {};
            if (username.trim() !== '' && username !== (userData?.username ?? '')) {
                updatedData.username = username;
            }
            if (email.trim() !== '' && email !== (userData?.email ?? '')) {
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

    const getUserDetails = async () => {
        try {
            const res = await axios.get<{ data: UserData }>('/api/users/userdata');
            console.log(res.data.data.username);
            setUserData(res.data.data);
            setUsername(res.data.data.username);
            setEmail(res.data.data.email);
        } catch (error: any) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    return (
        <div className='profileBlock'>
            <h2>{"Изменение данных профиля"}</h2>
            <p className='changeBlockText'>Хотите <Link className='loginLink' href="/login">Изменить пароль</Link>?</p>
            {userData && (
                <>
                    <div className='updateInfoProfileBlock'>
                        <label className='updateProfileBlockLabel'>Имя</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                        <label className='updateProfileBlockLabel'>Почта</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <button onClick={handleUpdateProfile}>Изменить</button>
                    </div>

                </>
            )}
        </div>
    );
}
