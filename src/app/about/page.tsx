'use client'
import './AboutStyles.css'
import Image from "next/image";
import aboutBg from '../../img/aboutBg.png'
export default function AboutUs() {
    return (
        <div className={'contacts'}>
            <Image className={'contacts-bg-img'} src={aboutBg} alt={''}/>
            <h2 className={'title'}>О нас</h2>
            <div className={'description-block'}>
                <p className={'description'}>
                    Мы — пункт назначения для всех, кто ищет выражение через одежду.
                    Наш магазин предлагает <b>эксклюзивные коллекции</b> в стиле панк-рок,
                    где каждая вещь — это возможность выделиться и подчеркнуть свою
                    индивидуальность.
                </p>
                <p className={'description'}>
                    <b>Наша миссия</b> — предоставить не просто одежду, а ключ к вашему уникальному
                    стилю. Мы вдохновляемся революционными звуками музыки и духом свободы,
                    чтобы создавать модные образы, отражающие ваш характер и стиль жизни.
                </p>
                <p className={'description'}>
                    Присоединяйтесь к нам в этом удивительном путешествии моды и стиля.
                    Добро пожаловать в мир аутентичной и выразительной моды!
                </p>
            </div>
        </div>
    )
}
