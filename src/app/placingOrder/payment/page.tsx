'use client'
import '../placingOrder.css'
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {Metadata} from "next";
import axios from "axios";
import {usePathname, useRouter} from "next/navigation";
import OrderNavBarContainer from "@/components/OrderNavBarContainer";
import {useOrderContext} from "@/orderContext/store";

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
    const pathname = usePathname();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [order, setOrder] = useState({
        username: '',
        email: '',
        telephone: '',
        zip: '',
        city: '',
        country: '',
        house: '',
        apartment: '',
        deliveryMethod: 'Почта',
        paymentState: 'Неоплачено',
        promotionalCode: 'Без промокода',
        orderStatus: [
            {title: "Обработка заказа", createdDate: Date.now(), selected: true},
            {title: "Упаковка заказа", createdDate: '', selected: false},
            {title: "Товар в пути", createdDate: '', selected: false},
            {title: "Ожидает в пункте выдачи", createdDate: '', selected: false},
            {title: "Получен покупателем", createdDate: '', selected: false},
        ],
        totalCost: 0,
        totalNumber: 0,
        createdBy: '',
        createdAt: Date.now(),
        products: [],
        trackingCode: '',
        trackingLink: '',
    });
    // @ts-ignore
    const { username, email, telephone,  zip, city, country, house, apartment,orderStatus, deliveryMethod, street, additionalInformation, promotionalCode, totalCost, totalNumber, createdBy, products, setSessionTime} = useOrderContext();
    const createOrder = async () => {
        try {
            const updatedOrder = {
                username: username,
                email: email,
                telephone: telephone,
                zip: zip,
                city: city,
                country: country,
                house: house,
                apartment: apartment,
                street: street,
                additionalInformation: additionalInformation,
                deliveryMethod: deliveryMethod,
                paymentState: 'Оплачено',
                promotionalCode: promotionalCode,
                orderStatus: orderStatus,
                totalCost: totalCost,
                totalNumber: totalNumber,
                createdBy: createdBy,
                createdAt: Date.now(),
                products: products,
                trackingCode: '',
                trackingLink: '',
            };
            const response = await axios.post("/api/users/order", updatedOrder);
            console.log(response.data.savedOrder._id);
            router.push(`/OrderReceipt/${response.data.savedOrder._id}`);
            localStorage.removeItem('cart');
            setSessionTime(Date.now());
        } catch (error:any) {
            console.log(error.message);
        }
    }
    const getUserDetails = async () => {
        try {
            const res = await axios.get<{ data: UserData }>('/api/users/userdata');
            setUserData(res.data.data);
            console.log(username, email, telephone, createdBy, products, totalCost, totalNumber, street, additionalInformation, promotionalCode, zip, city, country, house, apartment, deliveryMethod)
        } catch (error: any) {
            console.log(error.message);
        }
    };
    useEffect(() => {
        getUserDetails();
    }, []);

    return (
        <div className='placingOrderBlock'>
            <OrderNavBarContainer/>
            <h2>{"Оформление заказа"}</h2>
            <label className={'order-input-title'}>Номер карты</label>
            <input type="text" placeholder={'0000 0000 0000 0000'} />
            <label className={'order-input-title'}>Имя и фамилия</label>
            <input type="text" placeholder={'IVAN IVANOV'}/>
            <div className={'deliveryMethodBlock'}>
                <div className={'deliveryInputBlock'}>
                    <label className={'order-input-title'}>Дата истечения</label>
                    <input className={'deliveryMethodInputC'} placeholder={'23/23'} type="text" />
                </div>
                <div className={'deliveryInputBlock'}>
                    <label className={'order-input-title'}>CVC</label>
                    <input className={'deliveryMethodInputC'} placeholder={'111'} type="text"/>
                </div>
            </div>
            <button onClick={createOrder}
                    style={{pointerEvents: buttonDisabled ? "none" : null }}>
                {"Завершить заказ"}
            </button>
        </div>
    )
}
