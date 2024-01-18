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
import {useCurrentUser} from "@/hooks/useCurrentUser";
import {toast} from "sonner";
import {FormError} from "@/components/auth/FormError";
import {ExclamationTriangleIcon} from "@radix-ui/react-icons";


type NavLink = {
    label: string;
    href: string;
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
    const [discountError, setDiscountError] = useState('');
    const [promoList, setPromoList] = useState(null);
    const [discountName, setDiscountName] = useState(0);
    const user = useCurrentUser();
    const [order, setOrder] = useState({
        name: '',
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
            console.log(res.data.data.name);
            setUserData(res.data.data);
        } catch (error: any) {
            console.log(error.message);
        }
    };
    useEffect(() => {
        setUserData(user);
    }, []);

    const getPromoCodes = async () => {
        try {
            const res = await axios.get(`/api/users/promoCode`);
            setPromoList(res.data.promo);
            console.log(res.data)
        } catch (error: any) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        getPromoCodes();
    }, []);

    const applyPromoCode = (e) => {
        e.preventDefault();
        const foundPromoCode = promoList?.find(
            (item) => item.title === promoCode
        );
        console.log(foundPromoCode);
        if (foundPromoCode && foundPromoCode.isValid) {
            setDiscount(foundPromoCode.value);
            setDiscountError('');
        } else {
            setDiscount(0);
            setDiscountError('Извините такого промокода нет');
        }
    };
    const handlePromoCodeChange = (e) => {
        setPromoCode(e.target.value);
    };

    const createOrder = async () => {
        try {
            const allProductsAvailable = Object.values(groupedCartItems)
                .every((item)=> availableCounts[item.id] >= item.count);
            if(!allProductsAvailable){
                toast.warning("Некоторых товаров из корзины нет в наличии")
            }else{
                setTotalNumber(cartItems.length);
                setTotalCost(cartItems.reduce(
                    (total, item) => parseFloat(total) + parseFloat(item.price),
                    0
                ) * ((100 - discount) / 100));
                setCreatedBy(userData?._id);
                setProducts(cartItems);
                setPromotionalCode(discount);
                router.push(`/placingOrder`);
            }
        } catch (error: any) {
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

    const addToCartLocalStorage = async (newItem) => {
        const productsOfNewItemType = Object.values(groupedCartItems).find((item) => item.title === newItem.title && item.size === newItem.size);
        const response = await axios.post(`/api/users/products/checkSize/${newItem.id}`, newItem).then((data) => {
            if (parseInt(data.data.amount) - productsOfNewItemType.count <= 0) {
                toast.warning("Таких товаров больше нет в наличии")
            } else {
                const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
                const updatedCartItems = [...storedCartItems, newItem];
                localStorage.setItem('cart', JSON.stringify(updatedCartItems));
                setCartItems(updatedCartItems);
            }
        });
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
    const totalValue = cartItems.reduce(
        (total, item) => parseFloat(total) + parseFloat(item.price), 0
    ) * ((100 - discount) / 100);

    const roundedTotalValue = totalValue.toFixed(2);


    const [groupedCartItems, setGroupedCartItems] = useState([]);
    const [availableCounts, setAvailableCounts] = useState({});

    useEffect(() => {
        // Загрузка данных о товарах в корзине и их группировка
        const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const groupedItems = storedCartItems.reduce((acc, item) => {
            const key = `${item.title}-${item.size}`;
            if (!acc[key]) {
                acc[key] = {...item, totalPrice: parseFloat(item.price), count: 1};
            } else {
                acc[key].totalPrice += parseFloat(item.price);
                acc[key].count += 1;
            }
            return acc;
        }, {});
        setGroupedCartItems(groupedItems);
    }, [cartItems]);

    useEffect(() => {
        // Загрузка доступных количеств товаров из базы данных
        const fetchAvailableCounts = async () => {
            const availableCountsData = {};
            const items = Object.values(groupedCartItems);

            for (const item of items) {
                try {
                    const response = await axios.post(`/api/users/products/checkSize/${item.id}`, item);
                    availableCountsData[item.id] = parseInt(response.data.amount);
                } catch (error) {
                    console.error(`Error fetching amount for ${item.title}:`, error);
                    availableCountsData[item.id] = 0;
                }
            }

            setAvailableCounts(availableCountsData);
        };

        fetchAvailableCounts();
    }, [groupedCartItems]);

    const renderCartItem = (item, index) => {
        console.log(availableCounts)
        const availableCount = availableCounts[item.id] || 0;

        return (
            <div className="" key={index}>
                <div>{`Title: ${item.title} - ${item.size}`}</div>
                <div>{`Available: ${availableCount}, In Cart: ${item.count}`}</div>
            </div>
        );
    };

    const renderCartItems = () => {
        const items = Object.values(groupedCartItems);
        return items.map(renderCartItem);
    };

    return (
        <OrderProvider>
            <div className="cart-block">
                <h3>Корзина</h3>
                <div className="cart-frame">
                    <div className={'cart-items-block'}>
                        {availableCounts[Object.values(groupedCartItems)[0]?.id] && Object.values(groupedCartItems).map((item, index) => {
                            return availableCounts[item.id] >= item.count ? (
                                <div className={`mini-cart-item`}
                                     key={index}>
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
                                            <div className="delete-button"
                                                 onClick={() => removeAllFromCartLocalStorage(item)}>
                                                <Image src={deleteItem} className="delete-button" alt={'x'}/>
                                            </div>
                                        </div>
                                        <div className={'mini-cart-footer'}>
                                            <div key={index} className='mini-count-pad'>
                                                <Image src={minus} alt={'-'} className='mini-count-pad-icon'
                                                       onClick={() => handleDecrease(item)}></Image>
                                                <p>{item.count}</p>
                                                <Image src={plus} alt={'+'} className='mini-count-pad-icon'
                                                       onClick={() => handleIncrease(item)}></Image>
                                            </div>
                                            <h5>
                                                ${item.price * item.count}.00
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={`mini-cart-item-disabled`}
                                     key={index}>
                                    <img
                                        className={'mini-cart-item-img-disabled'}
                                        key={index}
                                        src={item.image}
                                        alt={`Thumbnail ${index}`}
                                    />
                                    <div className={'mini-cart-item-info-disabled'}>
                                        <div className={'mini-cart-item-info-head'}>
                                            <div>
                                                <h5 className={'mini-cart-item-title-disabled'}>{item.title}</h5>
                                                <p key={index} style={{opacity: 0.5}}>{item.size}</p>
                                                <div
                                                    className=" mb-2 bg-destructive/15 p-2 rounded-md flex items-center gap-x-2 text-sm text-destructive">
                                                    <ExclamationTriangleIcon className="h-4 w-4"/>
                                                    {availableCounts[item.id] === 0 ?
                                                        <p>Товара нет в наличии</p>
                                                        :
                                                        <p>Осталось товаров в наличии: {availableCounts[item.id]}</p>
                                                    }
                                                </div>
                                            </div>
                                            <div className="delete-button"
                                                 onClick={() => removeAllFromCartLocalStorage(item)}>
                                                <Image src={deleteItem} className="delete-button" alt={'x'}/>
                                            </div>
                                        </div>
                                        <div className={'mini-cart-footer-disabled'}>
                                            <div className="flex flex-row items-center">
                                                <div key={index} className='mini-count-pad'>
                                                    <Image src={minus} alt={'-'}
                                                           className={availableCounts[item.id] === 0 ? 'mini-count-pad-icon-disabled' : 'mini-count-pad-icon'}
                                                           onClick={() => {
                                                               availableCounts[item.id] === 0 ? null : handleDecrease(item)
                                                           }}
                                                    ></Image>
                                                    <p>{item.count}</p>
                                                    <Image src={plus} alt={'+'}
                                                           className='mini-count-pad-icon-disabled'></Image>
                                                </div>
                                                {/*<div className="text-sm ml-3">*/}
                                                {/*    Осталось товаров в наличии: {availableCounts[item.id]}*/}
                                                {/*</div>*/}
                                            </div>
                                            <h5 style={{opacity: 0.5}}>
                                                ${item.price * item.count}.00
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="summary-block">
                        <div className="modal-header">
                            <div className="modal-header-title">
                                <h4>Итог заказа:</h4>
                                <p className="modal-header-title-value">${roundedTotalValue}</p>
                            </div>
                        </div>
                        <div className="summary-info">
                            <p><b>{cartItems.length}</b> товаров на сумму{' '}
                                <b>
                                    ${(cartItems.reduce((total, item) => parseFloat(total) + parseFloat(item.price), 0)).toFixed(2)}{' '}
                                    {discount !== 0 && `- ${discount}%`}
                                </b>
                            </p>
                            <p className="summary-additional-text">НДС и стоимость доставки включены в стоимость
                                товара</p>
                            <div className={'promoCodesBlock'}>
                                <label>Промокод</label>
                                <form className='promoCodesBlockInput' onSubmit={applyPromoCode}>
                                    <input type='search'
                                           placeholder='Промокод'
                                           value={promoCode}
                                           onChange={handlePromoCodeChange}/>
                                    <button type='submit'><Image className={'promoCodesBlockInputBtnImg'} src={arrowIco}
                                                                 alt={">"}/></button>
                                </form>
                                {discountError && <p className={'discountError'}>{discountError}</p>}
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
