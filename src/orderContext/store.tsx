'use client';
import React,{useState,useContext, createContext} from "react";

export let OrderContext: React.Context<unknown>;
// @ts-ignore
OrderContext = createContext();


export const OrderProvider = ({children}) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [zip, setZip] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [house, setHouse] = useState('');
    const [apartment, setApartment] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState('Почта');
    const [paymentState, setPaymentState] = useState('Неоплачено');
    const [promotionalCode, setPromotionalCode] = useState('Без промокода');
    const [orderStatus, setOrderStatus] = useState('Обработка заказа');
    const [totalCost, setTotalCost] = useState(0);
    const [totalNumber, setTotalNumber] = useState(0);
    const [createdBy, setCreatedBy] = useState('');
    const [createdAt, setCreatedAt] = useState(Date.now());
    const [products, setProducts] = useState([]);

    return (
        <OrderContext.Provider
            value={{
                username, setUsername,
                email, setEmail,
                telephone, setTelephone,
                zip, setZip,
                city, setCity,
                country, setCountry,
                house, setHouse,
                apartment, setApartment,
                deliveryMethod, setDeliveryMethod,
                paymentState, setPaymentState,
                promotionalCode, setPromotionalCode,
                orderStatus, setOrderStatus,
                totalCost, setTotalCost,
                totalNumber, setTotalNumber,
                createdBy, setCreatedBy,
                createdAt, setCreatedAt,
                products, setProducts,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
}

export const useOrderContext = () => {
    return useContext(OrderContext);
};
