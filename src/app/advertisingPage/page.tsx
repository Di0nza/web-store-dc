"use client";
import "./advertisingPage.css";
import Link from "next/link";
import Image from "next/image";
import advertisingPageQr from '@/img/advertisingPageQr.png'
import tgImg from '@/img/shearIcons/tglogo.png'
import vkImg from '@/img/shearIcons/vklogo.png'
import instImg from '@/img/shearIcons/instlogo.png'
export default function AdvertisingPage() {
    return (
        <div className='advertisingContainer'>
            <h1>Спасибо что посетили нас !</h1>
            <Image className='advertisingQRImage' src={advertisingPageQr} alt={'link'}/>
            <div className='advertisingSocialBlock'>
                <a href={'https://www.instagram.com/marideniz.ru/'}>
                    <p>Посетить</p>
                    <Image className='advertisingSocialImg' src={instImg} alt={'instagram'}/>
                </a>
                <a href={'https://t.me/marideniz_brand28'}>
                    <p>Посетить</p>
                    <Image className='advertisingSocialImg' src={tgImg} alt={'tg'}/>
                </a>
                <a href={'https://vk.com/marideniz_brend'}>
                    <p>Посетить</p>
                    <Image className='advertisingSocialImg' src={vkImg} alt={'vk'}/>
                </a>
                <Link href={'/store'}>Ознакомиться с ассортиментом</Link>
            </div>
        </div>
    )
}