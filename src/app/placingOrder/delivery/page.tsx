'use client'
import '../placingOrder.css'
import React, {useEffect, useState} from "react";
import axios from "axios";
import {usePathname, useRouter} from "next/navigation";
import OrderNavBarContainer from "@/components/navigation/OrderNavBarContainer";
import {OrderProvider, useOrderContext} from "@/orderContext/store";
import {useCurrentUser} from "@/hooks/useCurrentUser";

type Props = {
    params: {
        id: any;
    }
};

export default function PlacingOrder({params: {id}}: Props): JSX.Element {
    const router = useRouter();
    const pathname = usePathname();
    const [userData, setUserData] = useState(null);
    const [orderData, setOrderData] = useState({
        zip: '298312',
        house: '23',
        apartment: '2',
        deliveryMethod: '',
        city: 'Россия',
        country: 'Москва'
    });
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    // @ts-ignore
    const { name, email, telephone, zip, setZip, city, setCity, country, setCountry, house, setHouse, apartment, setApartment, street, setStreet, additionalInformation, setAdditionalInformation, deliveryMethod, setDeliveryMethod, promotionalCode, totalCost, totalNumber, createdBy, products} = useOrderContext();
    const user = useCurrentUser();
    const handleDeliverySelection = (method) => {
        setSelectedDelivery(method);
        setDeliveryMethod(method);
        setOrderData({...orderData, deliveryMethod: method });
    };
    const createOrder = async () => {
        try {

            const storedOrderData = localStorage.getItem('orderData');
            const currentOrderData = storedOrderData ? JSON.parse(storedOrderData) : {};

            const updatedOrderData = {
                ...currentOrderData,
                zip: zip === '' ? '' : zip,
                house: house === '' ? '' : house,
                apartment: apartment === '' ? '' : apartment,
                deliveryMethod: deliveryMethod,
                city: city === '' ? '' : city,
                country: country === '' ? '' : country,
                additionalInformation: additionalInformation === '' ? 'Без дополнительной информации' : additionalInformation,
                street: street === '' ? '' : street,
            };

            localStorage.setItem('orderData', JSON.stringify(updatedOrderData));

            router.push(`/placingOrder/payment`);
        } catch (error:any) {
            console.log(error.message);
        }
    }

    useEffect(() => {

        const storedOrderData = localStorage.getItem('orderData');
        const currentOrderData = storedOrderData ? JSON.parse(storedOrderData) : {};

        if (currentOrderData.zip) {
            setZip(currentOrderData.zip);
        } else {
            setZip('');
        }

        if (currentOrderData.city) {
            setCity(currentOrderData.city);
        } else {
            setCity('');
        }

        if (currentOrderData.country) {
            setCountry(currentOrderData.country);
        } else {
            setCountry('');
        }

        if (currentOrderData.apartment) {
            setApartment(currentOrderData.apartment);
        } else {
            setApartment('');
        }

        if (currentOrderData.house) {
            setHouse(currentOrderData.house);
        } else {
            setHouse('');
        }

        if (currentOrderData.street) {
            setStreet(currentOrderData.street);
        } else {
            setStreet('');
        }

        if (currentOrderData.additionalInformation) {
            setAdditionalInformation(currentOrderData.additionalInformation);
        } else {
            setAdditionalInformation('');
        }

        if (currentOrderData.deliveryMethod) {
            setDeliveryMethod(currentOrderData.deliveryMethod);
        } else {
            setDeliveryMethod('');
        }

        setUserData(user);
    }, []);

    return (
        <OrderProvider>
            <div className='placingOrderBlock'>
                <OrderNavBarContainer/>
                <h2>{"Оформление заказа"}</h2>
                <label className={'order-input-title'}>Способ доставки</label>
                <div className={'deliveryMethodBlockFirst'}>
                    <div
                        className={deliveryMethod === 'Самовывоз' ? 'selectedDeliveryMethodInput' : 'deliveryMethodInputFirst'}
                        onClick={() => setDeliveryMethod('Самовывоз')}
                    >
                        <p className={'deliveryMethodInputTitle'}>Самовывоз</p>
                        <p className={'deliveryMethodInputText'}>Херсонская ул., 20, Санкт-Петербург</p>
                    </div>
                    <div
                        className={deliveryMethod === 'Доставка' ? 'selectedDeliveryMethodInput' : 'deliveryMethodInputFirst'}
                        onClick={() => setDeliveryMethod('Доставка')}
                    >
                        <p className={'deliveryMethodInputTitle'}>Доставка</p>
                        <p className={'deliveryMethodInputText'}>Почта России</p>
                    </div>
                </div>
                {deliveryMethod === 'Доставка' && (
                    <div>
                        <div className={'deliveryMethodBlock'}>
                            <div className={'deliveryInputBlock'}>
                                <label className={'order-input-title'}>Страна</label>
                                <input
                                    value={country}
                                    className={'deliveryMethodInputC'}
                                    onChange={(e) => setCountry(e.target.value)}
                                    placeholder={'Россия'}
                                    type="text"
                                />
                            </div>
                            <div className={'deliveryInputBlock'}>
                                <label className={'order-input-title'}>Город</label>
                                <input
                                    value={city}
                                    className={'deliveryMethodInputC'}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder={'Санкт-Петербург'}
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className={'deliveryMethodBlock'}>
                            <div className={'deliveryOneInputBlock'}>
                                <label className={'order-input-title'}>Улица</label>
                                <input
                                    value={street}
                                    className={'deliveryMethodInputC'}
                                    onChange={(e) => setStreet(e.target.value)}
                                    placeholder={'Пушкинская'}
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className={'deliveryMethodBlock'}>
                            <div className={'deliveryInputThreeBlocks'}>
                                <label className={'order-input-title'}>Дом</label>
                                <input
                                    value={house}
                                    className={'deliveryMethodInputC'}
                                    onChange={(e) => setHouse(e.target.value)}
                                    placeholder={'23'}
                                    type="text"
                                />
                            </div>
                            <div className={'deliveryInputThreeBlocks'}>
                                <label className={'order-input-title'}>Квартира</label>
                                <input
                                    value={apartment}
                                    className={'deliveryMethodInputC'}
                                    onChange={(e) => setApartment(e.target.value)}
                                    placeholder={'54'}
                                    type="text"
                                />
                            </div>
                            <div className={'deliveryInputThreeBlocks'}>
                                <label className={'order-input-title'}>Почтовый индекс</label>
                                <input
                                    value={zip}
                                    className={'deliveryMethodInputC'}
                                    onChange={(e) => setZip(e.target.value)}
                                    placeholder={'124521'}
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className={'deliveryMethodBlock'}>
                            <div className={'deliveryOneInputBlock'}>
                                <label className={'order-input-title'}>Дополнительная информация</label>
                                <textarea
                                    value={additionalInformation}
                                    className={'deliveryMethodInputC'}
                                    onChange={(e) => setAdditionalInformation(e.target.value)}
                                    placeholder={'Особенности места назначения'}
                                />
                            </div>
                        </div>
                    </div>
                )}
                <button
                    onClick={createOrder}
                    style={{pointerEvents: buttonDisabled ? "none" : null}}>
                    {"Перейти к оплате"}
                </button>
            </div>
        </OrderProvider>
    )
}
