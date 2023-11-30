import Link from "next/link";
import './componentsStyles.css'
import Image from "next/image";
import headerLogo from '../img/headerLogo.png';
import {Navigation} from "./Navigation";

const navItems = [
    {label: 'О нас', href: '/about'},
    {label: 'Магазин', href: '/store'},
    {label: 'Корзина', href: '/cart'},
    {label: 'Профиль', href: '/profile'}
]

const Header = () => {
    return (
        <header className='header-container'>
            <Navigation navLinks={navItems}/>
        </header>
    )
}

export {Header}
