'use client'
import './placingOrder.css'
import React, {useEffect, useState} from "react";
import {Metadata} from "next";
import axios from "axios";
import {usePathname, useRouter} from "next/navigation";
import {OrderProvider, useOrderContext} from "@/orderContext/store";
import OrderNavBarContainer from "@/components/navigation/OrderNavBarContainer";
import {useCurrentUser} from "@/hooks/useCurrentUser";

interface UserData {
    name: string;
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
        name: '',
        email: '',
        telephone: ''
    });
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    // @ts-ignore
    const {name, setName, email, setEmail, telephone, setTelephone} = useOrderContext();
    const user = useCurrentUser();

    const createOrder = async () => {
        try {
            setName(userData.name);
            setEmail(userData.email);
            setTelephone(telephone);
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
        setUserData(user);
    }, []);

    return (
        <OrderProvider>
            <div className='placingOrderBlock'>
                <OrderNavBarContainer/>
                <h2>{"Оформление заказа"}</h2>
                <label className={'order-input-title'}>Имя</label>
                <input
                    type="text"
                    value={userData.name}
                    placeholder={'Иван Иванов'}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                />
                <label className={'order-input-title'}>Почта</label>
                <input
                    type="email"
                    value={userData.email}
                    placeholder={'someemail@gmail.com'}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                />
                <label className={'order-input-title'}>Телефон <p>(необязательно)</p></label>
                <input
                    type="tel"
                    value={telephone}
                    placeholder={'+7342894734'}
                    onChange={(e) => setTelephone(e.target.value)}
                />
                <button onClick={createOrder}>
                    {"Перейти к доставке"}
                </button>
            </div>
        </OrderProvider>
    )
}
