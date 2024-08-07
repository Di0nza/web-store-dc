'use client'
import '../AboutStyles.css'
import aboutBg from "@/img/aboutBg.png";
import Image from "next/image";
export default function Payment() {
    return (
        <div className={'contacts'}>
            <Image className={'contacts-bg-img'} src={aboutBg} alt={''}/>
            <h2 className={'title'}>Оплата</h2>
            <div className={'description-block'}>
                <p className={'description'}>
                    Вы можете оплатить заказ онлайн на сайте при оформлении заказа.
                    У нас действует самый удобный способ оплаты СПБ с удобным вам банком, а также мы принимаем к оплате карты VISA, Master Card, МИР.
                </p>
                <h1 className={'subtitle'}>Реквизиты</h1>
                <p className={'requisites'}>
                    <b>ИП:</b> Дэниз Мария Владимировна
                </p>
                <p className={'requisites'}>
                    <b>ИНН:</b> 501814167861
                </p>
                <p className={'requisites'}>
                    <b>ОГРН:</b> 324774600247934
                </p>
            </div>
        </div>
    )
}
