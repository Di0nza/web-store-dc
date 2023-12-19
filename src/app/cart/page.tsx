'use client';
import {usePathname, useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import Image from "next/image";
import deleteItem from "@/img/delete.png";
import minus from "@/img/minus.png";
import plus from "@/img/plus.png";
import promoCodes from '../../mockData/promoCodes.json';
import './cart.css'
import axios from "axios";
import arrowIco from "@/img/arrowW.png";
import {OrderProvider, useOrderContext} from "@/orderContext/store";


type NavLink = {
    label: string;
    href:string;
}
interface CartItem {
    title: string;
    size: string;
    price: number;
    image: string;
    category: string;
}
interface GroupedCartItem extends CartItem {
    totalPrice: number;
    count: number;
}
export default function Cart() {
    const router = useRouter();
    const pathname = usePathname();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [stringCartItems, setStringCartItems] = useState('');
    const [userData, setUserData] = useState(null);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [discountName, setDiscountName] = useState(0);
    const [order, setOrder] = useState({
        username: '',
        email: '',
        zip: '',
        city: '',
        country: '',
        house: '',
        apartment: '',
        deliveryMethod: 'Почта',
        paymentState: 'Неоплачено',
        promotionalCode: 'Без промокода',
        orderStatus: 'Обработка заказа',
        totalCost: 0,
        totalNumber: 0,
        createdBy: '',
        createdAt: Date.now(),
        products: [],
    });
    // @ts-ignore
    const {setProducts, setTotalNumber, setTotalCost, setCreatedBy, setPromotionalCode} = useOrderContext();


    const getUserDetails = async () => {
        try {
            const res = await axios.get('/api/users/userdata');
            console.log(res.data.data.username);
            setUserData(res.data.data);
        } catch (error: any) {
            console.log(error.message);
        }
    };
    useEffect(() => {
        getUserDetails();
    }, []);

    const applyPromoCode = (e) => {
        e.preventDefault();
        const foundPromoCode = promoCodes.promoCodes.find(
            (code) => code.title === promoCode
        );
        console.log(foundPromoCode);
        if (foundPromoCode) {
            setDiscount(foundPromoCode.value);
        } else {
            setDiscount(0);
        }

    };
    const handlePromoCodeChange = (e) => {
        setPromoCode(e.target.value);
    };

    const createOrder = async () => {
        try {
            setTotalNumber(cartItems.length);
            setTotalCost(cartItems.reduce(
                (total, item) => total + item.price,
                0
            ) * ((100 - discount) / 100));
            setCreatedBy(userData?._id);
            setProducts(cartItems);
            setPromotionalCode(discount);
            router.push(`/placingOrder`);
        } catch (error:any) {
            console.log(error.message);
        }
    }

    const handleLinkClick = (event) => {
        event.preventDefault();
        setIsModalOpen(!isModalOpen);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const addToCartLocalStorage = (newItem) => {
        const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const updatedCartItems = [...storedCartItems, newItem];
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
        setCartItems(updatedCartItems);
    };

    const removeAllFromCartLocalStorage = (removedItem) => {
        const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const updatedCartItems = storedCartItems.filter(item => (
            item.title !== removedItem.title || item.size !== removedItem.size
        ));
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
        setCartItems(updatedCartItems);
    };
    const removeFromCartLocalStorage = (removedItem) => {
        const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const indexToRemove = storedCartItems.findIndex(item => (
            item.title === removedItem.title && item.size === removedItem.size
        ));

        if (indexToRemove !== -1) {
            const updatedCartItems = [
                ...storedCartItems.slice(0, indexToRemove),
                ...storedCartItems.slice(indexToRemove + 1)
            ];

            localStorage.setItem('cart', JSON.stringify(updatedCartItems));
            setCartItems(updatedCartItems);
        }
    };
    const handleIncrease = (item) => {
        addToCartLocalStorage(item);
    };
    const handleDecrease = (item) => {
        removeFromCartLocalStorage(item);
    };
    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
        setStringCartItems(JSON.stringify(storedCartItems));
        setCartItems(storedCartItems);
    }, []);

    const groupedCartItems: Record<string, GroupedCartItem> = cartItems.reduce((acc, item) => {
        const key = `${item.title}-${item.size}`;
        if (!acc[key]) {
            acc[key] = { ...item, totalPrice: item.price, count: 1 };
        } else {
            acc[key].totalPrice += item.price;
            acc[key].count += 1;
        }
        return acc;
    }, {});

    return (
        <OrderProvider>
            <div className="cart-block">
                <h3>Корзина</h3>
                <div className="cart-frame">
                    <div className={'cart-items-block'}>
                        {Object.values(groupedCartItems).map((item, index) => (
                            <div className={'mini-cart-item'} key={index}>
                                <img
                                    className={'mini-cart-item-img'}
                                    key={index}
                                    src={item.image}
                                    alt={`Thumbnail ${index}`}
                                />
                                <div className={'mini-cart-item-info'}>
                                    <div className={'mini-cart-item-info-head'}>
                                        <div>
                                            <h5 className={'mini-cart-item-title'}>{item.title}</h5>
                                            <p key={index}>{item.size}</p>
                                        </div>
                                        <div className="delete-button" onClick={() => removeAllFromCartLocalStorage(item)}>
                                            <Image src={deleteItem} className="delete-button"  alt={'x'}/>
                                        </div>
                                    </div>
                                    <div className={'mini-cart-footer'}>
                                        <div key={index} className='mini-count-pad'>
                                            <Image src={minus} alt={'-'} className='mini-count-pad-icon' onClick={() => handleDecrease(item)}></Image>
                                            <p>{item.count}</p>
                                            <Image src={plus} alt={'+'} className='mini-count-pad-icon' onClick={() => handleIncrease(item)}></Image>
                                        </div>
                                        <h5>
                                            ${item.price * item.count}.00
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="summary-block">
                        <div className="modal-header">
                            <div className="modal-header-title">
                                <h4>Итог заказа:</h4>
                                <p className="modal-header-title-value">${cartItems.reduce(
                                    (total, item) => total + item.price,
                                    0
                                ) * ((100 - discount) / 100)}</p>
                            </div>
                        </div>
                        <div className="summary-info">
                            <p><b>{cartItems.length}</b> товаров на сумму <b>${cartItems.reduce(
                                (total, item) => total + item.price, 0)}.00 {discount !== 0 && `- ${discount}%`}</b></p>
                            <p className="summary-additional-text">НДС и стоимость доставки включены в стоимость товара</p>
                            <div className={'promoCodesBlock'}>
                                <label>Промокод</label>
                                <form className='promoCodesBlockInput' onSubmit={applyPromoCode}>
                                    <input type='search'
                                           placeholder='Промокод'
                                           value={promoCode}
                                           onChange={handlePromoCodeChange}/>
                                    <button type='submit'><Image className={'promoCodesBlockInputBtnImg'} src={arrowIco} alt={">"}/></button>
                                </form>
                            </div>
                        </div>
                        <button className={'go-to-checkOut'} onClick={createOrder}>
                            Оформить заказ
                        </button>
                    </div>
                </div>
            </div>
        </OrderProvider>
    )
}
