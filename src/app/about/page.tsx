'use client'
import './AboutStyles.css'
import '../../components/componentsStyles.css'
import Image from "next/image";
import aboutBg from '../../img/aboutBg.png'
export default function AboutUs() {
    return (
        <div className={'contacts'}>
            <Image className={'contacts-bg-img'} src={aboutBg} alt={''}/>
            <h2 className={'title'}>О нас</h2>
            <div className={'description-block'}>
                <p className={'description'}>
                    Мы - молодая пара - основатели бренда MariDeniz. В основу создания бренда лег симбиоз между нашими чувствами.
                    Мы раскрываем в одежде такие понятия как: любовь к себе, страсть, свободу, сексуальность, объединение творчества, стиль, дерзость и, конечно же, любовь.
                </p>
                <p className={'description'}>
                    <b>Миссия бренда MariDeniz</b> — помочь вам позволить себе быть увиденными и принятыми миром, раскрыть и ощутить чувство внутренней свободы, обрести гармонию между своей душой и телом. Не бояться дерзнуть, рисковать и показать себя такими, какие вы есть, быть счастливыми.
                </p>
                <p className={'description'}>
                    Мы не выбираем наши чувства, мы выбираем, в каком состоянии нам быть и какой образ сегодня надеть. Мы верим, что каждый человек имеет право на самовыражение и принятие себя полностью, безусловно.
                </p>
            </div>
        </div>
    )
}
