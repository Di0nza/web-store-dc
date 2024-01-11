'use client';
import React, {useState, useEffect} from 'react';
import Link from "next/link";
import {usePathname} from "next/navigation";
import '../componentsStyles.css'
import Image from "next/image";
import headerLogo from '../../img/headerLogo.png';
import cartLogo from '../../img/cart.svg'
import cartLogoB from '../../img/cartB.svg'
import close from '../../img/close.png'
import deleteItem from '../../img/delete.png'
import plus from '../../img/plus.png'
import minus from '../../img/minus.png'
import axios from "axios";
import {OrderProvider, useOrderContext} from "@/orderContext/store";
import {useCurrentUser} from "@/hooks/useCurrentUser";

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

type Props = {
    navLinks: NavLink[];
}

const Navigation = ({navLinks}: Props) => {
    const pathname = usePathname();
    // @ts-ignore
    const {sessionTime, setSessionTime} = useOrderContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [userData, setUserData] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const user = useCurrentUser();

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
        getUserDetails();
        setUserData(user);
        setIsAdmin(user?.isAdmin);

    }, [sessionTime]);

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
        setCartItems(storedCartItems);
    }, []);

    const groupedCartItems: Record<string, GroupedCartItem> = cartItems.reduce((acc, item) => {
        const key = `${item.title}-${item.size}`;
        if (!acc[key]) {
            acc[key] = {...item, totalPrice: parseFloat(item.price), count: 1};
        } else {
            acc[key].totalPrice += parseFloat(item.price);
            acc[key].count += 1;
        }
        return acc;
    }, {});

    return (
        <OrderProvider>
            <nav className='header-block'>
                <Link href={userData?.isAdmin ? '/adminProfile' : '/'}>
                    <Image className='header-logo' src={headerLogo} alt={'MaryDeniz'}></Image>
                </Link>
                <div className='header-links-block'>
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return link.label === 'Корзина' ? (
                            pathname === '/cart' ? (
                                <div key={link.label} className={"cartNavLink"}>
                                    <Image className={"cartLogo"} src={cartLogo} alt={link.label}></Image>
                                    <p>{cartItems.length}</p>
                                </div>
                            ) : (
                                <div
                                    key={link.label}
                                    onClick={handleLinkClick}
                                    className={isModalOpen ? "cartNavLink" : 'inactiveCartNavLink'}
                                >
                                    <Image
                                        className={"cartLogo"}
                                        src={isModalOpen ? cartLogo : cartLogoB}
                                        alt={link.label}
                                    ></Image>
                                    <p>{cartItems.length}</p>
                                </div>
                            )
                        ) : (
                            isAdmin ? (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className={pathname === link.href ? "activeNavLink" : ''}
                                >
                                    {link.label}
                                </Link>
                            ) : (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className={pathname.startsWith(link.href) ? "activeNavLink" : ''}
                                >
                                    {link.label}
                                </Link>
                            )
                        );
                    })}
                </div>

                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div className="modal-header-title">
                                    <h4>Корзина</h4>
                                    <div onClick={closeModal}>
                                        <Image src={close} className="close-button" alt={'x'}></Image>
                                    </div>
                                </div>
                                <div className="modal-header-info">
                                    <p><b>{cartItems.length}</b> товаров на
                                        сумму <b>${cartItems.reduce((total, item) => parseFloat(total) + parseFloat(item.price), 0)}.00</b>
                                    </p>
                                </div>
                            </div>
                            <div className={'mini-cart-items-block'}>
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
                                                    <b><p className={'mini-cart-item-size'} key={index}>{item.size}</p>
                                                    </b>
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
                                                    <b><p>{item.count}</p></b>
                                                    <Image src={plus} alt={'+'} className='mini-count-pad-icon'
                                                           onClick={() => handleIncrease(item)}></Image>
                                                </div>
                                                <h5>
                                                    ${item.price * item.count}.00
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Link className={'go-to-cart'} href={'/cart'} onClick={closeModal}>
                            Перейти к корзине
                        </Link>
                    </div>
                )}
            </nav>
        </OrderProvider>
    )
}

export {Navigation}
