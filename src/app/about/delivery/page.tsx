'use client'
import '../AboutStyles.css'
import aboutBg from "@/img/aboutBg.png";
import Image from "next/image";
export default function Delivery() {
    return (
        <div className={'contacts'}>
            <Image className={'contacts-bg-img'} src={aboutBg} alt={''}/>
            <h2 className={'title'}>Доставка и сроки</h2>
            <div className={'description-block'}>
                <p className={'description'}>
                    Ежедневно мы работаем над улучшением качества и скорости доставки, поэтому сейчас готовы предложить самые оптимальные условия для вашего комфорта.

                    По Москве в пределах МКАД вы можете заказать товар с доставкой до двери.При совершении покупки на сумму от <b>10.000 </b>
                    рублей доставка будет бесплатной. При оформлении заказа вам будет доступен выбор ближайшей даты и временного интервала доставки.
                </p>
                <p className={'description'}>
                    Стоимость доставки по России рассчитывается индивидуально, согласно тарифам <b>СДЭК</b> непосредственно при оформлении заказа. Информация о стоимости доставки будет видна при оформлении до момента оплаты. Доставка будет для вас бесплатной при совершении покупки на сумму от 10.000 рублей.

                    При заказе на меньшую сумму действуют стандартные условия доставки.

                    Доставка по миру осуществляется курьерской службой <b>EMS</b>, оплата рассчитывается согласно тарифам логистической службы. Оформить доставку можно через менеджера в <b>WhatsApp </b>
                        по номеру: +7 (929) 524-47-28

                    Также, часть нашей линейке представлена на маркетплейсах Яндекс Маркет, Валдберес и Озон в скором времени и на Ла моде - следите за новостями в соц сетях
                </p>
            </div>
        </div>
    )
}
