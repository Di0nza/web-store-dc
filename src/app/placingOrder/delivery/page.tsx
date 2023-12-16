'use client'
import '../placingOrder.css'
import React, {useEffect, useState} from "react";
import axios from "axios";
import {usePathname, useRouter} from "next/navigation";
import OrderNavBarContainer from "@/components/OrderNavBarContainer";
import {OrderProvider, useOrderContext} from "@/orderContext/store";

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
    const [orderData, setOrderData] = useState({
        zip: '',
        house: '',
        apartment: '',
        deliveryMethod: '',
        city: '',
        country: ''
    });
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    // @ts-ignore
    const { username, email, telephone, setZip, setCity, setCountry, setHouse, setApartment, setDeliveryMethod,promotionalCode, totalCost, totalNumber, createdBy, products} = useOrderContext();

    const handleDeliverySelection = (method) => {
        setSelectedDelivery(method);
        setOrderData({...orderData, deliveryMethod: method });
    };
    const createOrder = async () => {
        try {
            setZip(orderData.zip);
            setCity(orderData.city);
            setCountry(orderData.country);
            setApartment(orderData.apartment);
            setHouse(orderData.house);
            setDeliveryMethod(orderData.deliveryMethod);
            router.push(`/placingOrder/payment`);
        } catch (error:any) {
            console.log(error.message);
        }
    }
    const getUserDetails = async () => {
        try {
            const res = await axios.get<{ data: UserData }>('/api/users/userdata');
            setUserData(res.data.data);
            console.log(username, email, telephone, createdBy, products, totalCost, totalNumber, promotionalCode)
        } catch (error: any) {
            console.log(error.message);
        }
    };
    useEffect(() => {
        getUserDetails();
    }, []);

    return (
        <OrderProvider>
            <div className='placingOrderBlock'>
                <OrderNavBarContainer/>
                <h2>{"Оформление заказа"}</h2>
                <label className={'order-input-title'}>Способ доставки</label>
                <div className={'deliveryMethodBlock'}>
                    <div
                        className={selectedDelivery === 'Самовывоз' ? 'selectedDeliveryMethodInput' : 'deliveryMethodInput'}
                        onClick={() => handleDeliverySelection('Самовывоз')}
                    >
                        <p className={'deliveryMethodInputTitle'}>Самовывоз</p>
                        <p className={'deliveryMethodInputText'}>Херсонская ул., 20, Санкт-Петербург</p>
                    </div>
                    <div
                        className={selectedDelivery === 'Доставка' ? 'selectedDeliveryMethodInput' : 'deliveryMethodInput'}
                        onClick={() => handleDeliverySelection('Доставка')}
                    >
                        <p className={'deliveryMethodInputTitle'}>Доставка</p>
                        <p className={'deliveryMethodInputText'}>Почта России</p>
                    </div>
                </div>
                {selectedDelivery === 'Доставка' && (
                    <div>
                        <div className={'deliveryMethodBlock'}>
                            <div className={'deliveryInputBlock'}>
                                <label className={'order-input-title'}>Страна</label>
                                <input className={'deliveryMethodInputC'} onChange={(e) => setOrderData({ ...orderData, country: e.target.value })} placeholder={'Россия'} type="text" />
                            </div>
                            <div className={'deliveryInputBlock'}>
                                <label className={'order-input-title'}>Город</label>
                                <input className={'deliveryMethodInputC'} onChange={(e) => setOrderData({ ...orderData, city: e.target.value })} placeholder={'Санкт-Петербург'} type="text"/>
                            </div>
                        </div>
                        <div className={'deliveryMethodBlock'}>
                            <div className={'deliveryInputThreeBlocks'}>
                                <label className={'order-input-title'}>Дом</label>
                                <input className={'deliveryMethodInputC'} onChange={(e) => setOrderData({ ...orderData, house: e.target.value })} placeholder={'23'} type="text" />
                            </div>
                            <div className={'deliveryInputThreeBlocks'}>
                                <label className={'order-input-title'}>Квартира</label>
                                <input className={'deliveryMethodInputC'} onChange={(e) => setOrderData({ ...orderData, apartment: e.target.value })} placeholder={'54'} type="text"/>
                            </div>
                            <div className={'deliveryInputThreeBlocks'}>
                                <label className={'order-input-title'}>Почтовый индекс</label>
                                <input className={'deliveryMethodInputC'} onChange={(e) => setOrderData({ ...orderData, zip: e.target.value })} placeholder={'124521'} type="text"/>
                            </div>
                        </div>
                    </div>
                )}
                <button
                    onClick={createOrder}
                    style={{pointerEvents: buttonDisabled ? "none" : null }}>
                    {"Перейти к оплате"}
                </button>
            </div>
        </OrderProvider>
    )
}
