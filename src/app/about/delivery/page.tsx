'use client'
import '../AboutStyles.css'
import aboutBg from "@/img/aboutBg.png";
import Image from "next/image";
export default function Delivery() {
    return (
        <div className={'contacts'}>
            <Image src={aboutBg} alt={''}/>
            <h2 className={'title'}>Доставка и сроки</h2>
            <div className={'description-block'}>
                <p className={'description'}>
                    Мы предлагаем различные способы доставки, чтобы сделать получение вашего заказа максимально удобным.
                    Вы можете воспользоваться <b>самовывозом</b> по адресу Херсонская ул., 20, Санкт-Петербург или
                    выбрать
                    доставку через <b>Почту России</b> или Яндекс Доставку, если вы находитесь в Москве, для более
                    удобного
                    получения заказа.
                </p>
                <p className={'description'}>
                    Для жителей Москвы мы обеспечиваем доставку в пределах <b>1-2 рабочих дней</b>. По всей России срок
                    доставки составляет обычно <b>5-7 рабочих дней</b>. Для доставки в Казахстан, Армению, Турцию и
                    Беларусь
                    сроки могут составить от <b>полутора до двух недель</b>.
                </p>
            </div>
        </div>
    )
}
