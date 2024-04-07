"use client";
import "./advertisingPage.css";
import Link from "next/link";
import Image from "next/image";
import advertisingPageQr from '@/img/advertisingPageQr.png'
import tgImg from '@/img/shearIcons/tglogo.png'
import vkImg from '@/img/shearIcons/vklogo.png'
import instImg from '@/img/shearIcons/instlogo.png'
import aboutBg from "@/img/aboutBg.png";

export default function AdvertisingPage() {
    return (
        <div className={'AdvertisingContacts'}>
            <Image className={'contacts-bg-img'} src={aboutBg} alt={''}/>
            <div className={'description-block'}>
                <h2 className={'title'}>Спасибо что посетили нас !</h2>
                <p className={'description'}>
                    Шагните в мир <span>MariDeniz</span>, где мода доступна, выразительна и вдохновляет.
                </p>
                <p className={'description'}>
                    <span>Здесь вы найдете:</span><br/>

                    &#10004; Качественную и удобную дизайнерскую одежду.<br/>
                    &#10004; Уникальные идеи и советы от наших экспертов.<br/>
                    &#10004; Вдохновляющие истории о моде и стиле.
                </p>
                <p className={'description'}>
                    Мы рады помочь вам создать свой неповторимый образ!
                    Присоединяйтесь к нашему сообществу!
                </p>
                <div className={'AdvertisingLinks'}>
                    <a href="https://www.instagram.com/marideniz.ru/" target="_blank" rel="nofollow">
                        <Image className="advertisingSocialImg" src={instImg} alt="instagram"/>
                    </a>
                    <a href="https://t.me/marideniz_brand28" target="_blank" rel="nofollow">
                        <Image className="advertisingSocialImg" src={tgImg} alt="tg"/>
                    </a>
                    <a href="https://vk.com/marideniz_brend" target="_blank" rel="nofollow">
                        <Image className="advertisingSocialImg" src={vkImg} alt="vk"/>
                    </a>
                </div>
                <Link className={'AdvertisingContactsBtn'} href={'/store'}>Ознакомиться с ассортиментом</Link>
            </div>

        </div>
    )
}