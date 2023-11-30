import Link from "next/link";
import './componentsStyles.css'
import Image from "next/image";
import headerLogo from '../img/headerLogo.png';

const Header = () => {
    return (
        <footer className='header-container'>
            <nav className='header-block'>
                <Link href='/'>
                    <Image  className='header-logo' src={headerLogo} alt={'MaryDeniz'}></Image>
                </Link>
                <div className='header-links-block'>
                    <Link href='/about'>О нас</Link>
                    <Link href='/store'>Магазин</Link>
                    <Link href='/cart'>Корзина</Link>
                    <Link href='/profile'>Профиль</Link>
                </div>
            </nav>
        </footer>
    )
}

export {Header}
