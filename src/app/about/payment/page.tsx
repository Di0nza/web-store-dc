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
                    Мы предлагаем различные удобные способы оплаты, чтобы сделать ваше покупательское
                    взаимодействие с нами максимально комфортным.
                </p>
                <p className={'description'}>
                    Вы можете оплатить ваш заказ онлайн с помощью <b>банковской карты</b>, используя защищенные
                    платежные системы. Мы также предлагаем возможность оплаты <b>наличными</b> при самовывозе вашего
                    заказа.
                </p>
                <p className={'description'}>
                    Все наши платежные методы обеспечивают безопасную и удобную оплату для вас, а ваша
                    конфиденциальность и <b>безопасность</b> информации при оплате гарантированы.
                </p>
            </div>
        </div>
    )
}
