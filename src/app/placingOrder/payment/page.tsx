'use client'
import '../placingOrder.css'
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {Metadata} from "next";
import axios from "axios";
import {usePathname, useRouter} from "next/navigation";
import OrderNavBarContainer from "@/components/navigation/OrderNavBarContainer";
import {useOrderContext} from "@/orderContext/store";
import {useCurrentUser} from "@/hooks/useCurrentUser";
import {makeNewPayment} from "@/services/getData";
import {FormError} from "@/components/auth/FormError";
import {toast} from "sonner";

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
    const pathname = usePathname();
    const [userData, setUserData] = useState(null);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [order, setOrder] = useState({
        name: '',
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
    //const { name, email, telephone,  zip, city, country, house, apartment,orderStatus, deliveryMethod, street, additionalInformation, promotionalCode, totalCost, totalNumber, createdBy, products, setSessionTime, idempotenceKey} = useOrderContext();
    const createOrder = async () => {
        try {
            const storedOrderData = localStorage.getItem('orderData');
            const currentOrderData = storedOrderData ? JSON.parse(storedOrderData) : {};
            const updatedOrderData = {
                ...currentOrderData,
                orderStatus: [
                    {title: "Обработка заказа", createdDate: Date.now(), selected: true},
                    {title: "Упаковка заказа", createdDate: '', selected: false},
                    {title: "Товар в пути", createdDate: '', selected: false},
                    {title: "Ожидает в пункте выдачи", createdDate: '', selected: false},
                    {title: "Получен покупателем", createdDate: '', selected: false},
                ],
                paymentState: 'Оплачено',
                createdAt: Date.now(),
                trackingCode: '',
                trackingLink: '',
            };

            // const updatedOrder = {
            //     name: name,
            //     email: email,
            //     telephone: telephone,
            //     zip: zip,
            //     city: city,
            //     country: country,
            //     house: house,
            //     apartment: apartment,
            //     street: street,
            //     additionalInformation: additionalInformation,
            //     deliveryMethod: deliveryMethod,
            //     paymentState: 'Оплачено',
            //     promotionalCode: promotionalCode,
            //     orderStatus: orderStatus,
            //     totalCost: totalCost,
            //     totalNumber: totalNumber,
            //     createdBy: createdBy,
            //     createdAt: Date.now(),
            //     products: products,
            //     trackingCode: '',
            //     trackingLink: '',
            // };

            const response = await axios.post("/api/users/order", updatedOrderData);
            console.log(response.data.savedOrder._id);
            router.push(`/OrderReceipt/${response.data.savedOrder._id}`);
            localStorage.removeItem('cart');
        } catch (error:any) {
            console.log(error.message);
        }
    }
    const getUserDetails = async () => {
        try {
            const res = await axios.get<{ data: UserData }>('/api/users/userdata');
            setUserData(res.data.data);
        } catch (error: any) {
            console.log(error.message);
        }
    };

    const user = useCurrentUser();

    useEffect(() => {
        setUserData(user);
    }, []);



    const [isLoaded, setIsLoaded] = useState(false);
    const [confirmationToken, setConfirmationToken] = useState('');
    const [error, setError] = useState<string | undefined>("");


    useEffect(() => {

        const storedOrderData = localStorage.getItem('orderData');
        const currentOrderData = storedOrderData ? JSON.parse(storedOrderData) : {};

        makeNewPayment({totalCost: currentOrderData.totalCost, idempotenceKey: currentOrderData.idempotenceKey}).then((data) => {
            console.log(data);
            if (data.data.error) {
                console.log(data.data.error);
                setError(data.data.error);
            }
            const updatedOrderData = {
                ...currentOrderData,
                paymentInfo: {
                    id: data.data.paymentResult.id,
                    created_at: data.data.paymentResult.created_at
                }
            };

            localStorage.setItem('orderData', JSON.stringify(updatedOrderData));
            setConfirmationToken(data.data.paymentResult.confirmation.confirmation_token);
        }).catch(error => {
            console.error('Ошибка при выполнении платежа:', error);
        });

        const loadScript = () => {
            const script = document.createElement("script");
            script.src = "https://yookassa.ru/checkout-widget/v1/checkout-widget.js";
            script.async = true;
            script.onload = () => setIsLoaded(true);
            document.body.appendChild(script);
        };

        // @ts-ignore
        if (!window.YooMoneyCheckoutWidget) {
            loadScript();
        } else {
            setIsLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (isLoaded && confirmationToken) {
            // @ts-ignore
            const checkout = new window.YooMoneyCheckoutWidget({
                confirmation_token: confirmationToken,
                customization: {
                    colors: {
                        control_primary: '#000000'
                    }
                },
                // return_url: 'https://example.com',
                error_callback: function(error) {
                    setError("Ошибка оплаты заказа. Пройдите этап оформления заказа еще раз!");
                }
            });

            checkout.on('success', async () => {
                await createOrder();
                toast.success("Оплата прошла успешно");

                //Удаление инициализированного виджета
                checkout.destroy();
            });

            checkout.on('fail', () => {
                setError("Ошибка оплаты заказа. Пройдите этап оформления заказа еще раз!");

                checkout.destroy();
            });

            checkout.render('payment-form');
        }
    }, [isLoaded, confirmationToken]);

    return (
        <div className='placingOrderBlock'>
            <OrderNavBarContainer/>
            <h2>{"Оформление заказа"}</h2>
            <div id="payment-form"></div>
            {/*<button onClick={createOrder}></button>*/}
            {error ?
                    <div style={{margin: '5px 0 10px 0'}}>
                        <FormError message={error}/>
                        <Link className={"errorOrderLink"} href={'/cart'}>
                            Перейти к корзине
                        </Link>
                    </div>
                : <div></div>
            }

            {/*<div className={'order-payment-sorry'}>*/}
            {/*    <div className={'order-payment-sorry-head'}>*/}
            {/*        <h2>Приносим свои извинения!</h2><br/>*/}
            {/*        В данный момент оплата на сайте временно недоступна.<br/>*/}
            {/*    </div>*/}
            {/*    <span>Вы можете оформить заказ с оплатой:</span><br/>*/}
            {/*    <span>Наличными</span> при курьерской доставке/самовывозе или*/}
            {/*    наложенным платежом через <span>СДЭК</span> или <span>Почту России.</span>*/}
            {/*</div>*/}
            {/*<div className={'order-payment-block'}>*/}
            {/*    <label className={'order-input-title'}>Номер карты</label>*/}
            {/*    <input type="text" placeholder={'0000 0000 0000 0000'}/>*/}
            {/*    <label className={'order-input-title'}>Имя и фамилия</label>*/}
            {/*    <input type="text" placeholder={'IVAN IVANOV'}/>*/}
            {/*    <div className={'deliveryMethodBlock'}>*/}
            {/*        <div className={'deliveryInputBlock'}>*/}
            {/*            <label className={'order-input-title'}>Дата истечения</label>*/}
            {/*            <input className={'deliveryMethodInputC'} placeholder={'23/23'} type="text"/>*/}
            {/*        </div>*/}
            {/*        <div className={'deliveryInputBlock'}>*/}
            {/*            <label className={'order-input-title'}>CVC</label>*/}
            {/*            <input className={'deliveryMethodInputC'} placeholder={'111'} type="text"/>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            {/*<button onClick={createOrder}*/}
            {/*        style={{pointerEvents: buttonDisabled ? "none" : null}}>*/}
            {/*    {"Завершить заказ"}*/}
            {/*</button>*/}
        </div>
    )
}
