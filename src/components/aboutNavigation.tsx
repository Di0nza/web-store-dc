"use client";
import Link from "next/link";
import '../app/about/AboutStyles.css'
import {usePathname} from "next/navigation";


export default function AboutNavigation() {
    const pathname = usePathname();
    return (
        <div className='about-navigation'>
            <h4>Ознакомьтесь с нашими</h4>
            <div className='about-links-block'>
                <Link className={pathname !== '/about' ? `about-link` : `selected-link`} href={'/about'}>Основное</Link>
                <Link className={pathname !== '/about/contacts' ? `about-link` : `selected-link`} href={'/about/contacts'}>Контакты</Link>
                <Link className={pathname !== '/about/instructions' ? `about-link` : `selected-link`} href={'/about/instructions'}>Рекомендации по уходу</Link>
                <Link className={pathname !== '/about/delivery' ? `about-link` : `selected-link`} href={'/about/delivery'}>Доставка</Link>
                <Link className={pathname !== '/about/returns' ? `about-link` : `selected-link`} href={'/about/returns'}>Возврат</Link>
                <Link className={pathname !== '/about/payment' ? `about-link` : `selected-link`} href={'/about/payment'}>Оплата</Link>
            </div>
        </div>
    )
}