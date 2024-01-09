'use client'
import './placingOrder.css'
import React, {useEffect, useState} from "react";
import {Metadata} from "next";
import axios from "axios";
import {usePathname, useRouter} from "next/navigation";
import {OrderProvider, useOrderContext} from "@/orderContext/store";
import OrderNavBarContainer from "@/components/OrderNavBarContainer";

interface UserData {
    username: string;
    email: string;
    telephone: string;
}
type Props = {
    params: {
        id: any;
    }
};

export default function PlacingOrder({params: {id}}: Props): JSX.Element {
    const router = useRouter();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        telephone: ''
    });
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    // @ts-ignore
    const {setUsername, setEmail, setTelephone} = useOrderContext();

    const createOrder = async () => {
        try {
            setUsername(userData.username);
            setEmail(userData.email);
            setTelephone(userData.telephone);
            router.push(`/placingOrder/delivery`);
        } catch (error:any) {
            console.log(error.message);
        }
    }

    const handleDeliverySelection = (method) => {
        setSelectedDelivery(method);
    };
    const getUserDetails = async () => {
        try {
            const res = await axios.get<{ data: UserData }>('/api/users/userdata');
            setUserData(res.data.data);
        } catch (error: any) {
            console.log(error.message);
        }
    };
    useEffect(() => {
        //getUserDetails();
    }, []);

    return (
        <OrderProvider>
            <div className='placingOrderBlock'>
                <OrderNavBarContainer/>
                <h2>{"Оформление заказа"}</h2>
                <label className={'order-input-title'}>Имя</label>
                <input
                    type="text"
                    value={userData.username}
                    onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                />
                <label className={'order-input-title'}>Почта</label>
                <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                />
                <label className={'order-input-title'}>Телефон <p>(необязательно)</p></label>
                <input
                    type="tel"
                    value={userData.telephone}
                    placeholder={'+7342894734'}
                    onChange={(e) => setUserData({ ...userData, telephone: e.target.value })}
                />
                <button onClick={createOrder}>
                    {"Перейти к доставке"}
                </button>
            </div>
        </OrderProvider>
    )
}
