'use client';
import Link from "next/link";
import {usePathname} from "next/navigation";
import './componentsStyles.css'
import Image from "next/image";
import headerLogo from '../img/headerLogo.png';

type NavLink = {
    label: string;
    href:string;
}

type Props = {
    navLinks: NavLink[];
}

const Navigation = ({navLinks}: Props) => {
    const pathname = usePathname();
    return (
        <>
            <nav className='header-block'>
                <Link href='/'>
                    <Image  className='header-logo' src={headerLogo} alt={'MaryDeniz'}></Image>
                </Link>
                <div className='header-links-block'>
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href
                        return (
                            <Link key={link.label} href={link.href} className={isActive ? "activeNavLink" : ''}>{link.label}</Link>
                        )
                    })}
                </div>
            </nav>
        </>
    )
}

export {Navigation}
