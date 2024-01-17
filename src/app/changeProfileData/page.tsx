"use client";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import './profileStyles.css'
import Link from "next/link";
import {useCurrentUser} from "@/hooks/useCurrentUser";
import {update} from "next-auth/lib/actions";
import {useSession} from "next-auth/react";
import {useModal} from "@/hooks/useModalStore";

interface UserData {
    name: string;
    email: string;
    createdAt?: string;
}

export default function ChangeProfileData() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [name, setName] = useState('');
    const user = useCurrentUser();
    const {update} = useSession();

    const {onOpen} = useModal();

    const handleUpdateProfile = async () => {
        try {
            const updatedData: Partial<UserData> = {};
            if (name.trim() !== '' && name !== (userData?.name ?? '')) {
                updatedData.name = name;
                updatedData.email = user.email;
            }
            if (Object.keys(updatedData).length === 0) {
                return;
            }
            await axios.put('/api/users/update', updatedData).then(() => {
                    update();
                }
            );
            setUserData({...userData, ...updatedData});
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setUserData(user);
        setName(user.name);
        //setEmail(user.email);
    }, []);

    return (
        <div className='profileBlock'>
            <h2>{"Изменение данных профиля"}</h2>
            {userData?.isOAuth === false ?
                <div className="flex flex-row items-center mt-4 mb-6 ">
                    <div className="text-black text-sm">
                        Хотите
                    </div>
                    <div
                        className='mr-1 ml-1 text-black text-sm hover:underline cursor-pointer font-bold'
                        onClick={() => onOpen("changePassword")}
                    >
                        Изменить пароль
                    </div>
                    <div className="text-black text-sm">
                        ?
                    </div>

                </div> : null}
            {userData && (
                <>
                    <div className='updateInfoProfileBlock'>
                        <label className='updateProfileBlockLabel'>Имя</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                        {/*<label className='updateProfileBlockLabel'>Почта</label>*/}
                        {/*<input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>*/}
                        <button onClick={handleUpdateProfile}>Изменить</button>
                    </div>

                </>
            )}
        </div>
    );
}
