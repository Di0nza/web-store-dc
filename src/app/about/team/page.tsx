'use client'
import '../AboutStyles.css'
import aboutBg from "@/img/aboutBg.png";
import Image from "next/image";
export default function Team() {
    return (
        <div className={'contacts'}>
            <Image className={'contacts-bg-img'} src={aboutBg} alt={''}/>
            <h2 className={'title'}>Наша команда</h2>
            <div className={'description-block'}>
                <p className={'description'}>
                    Наша команда — это объединение энтузиастов, преданных моде и стилю.
                    Каждый из нас имеет свою уникальную историю и вместе мы создаем
                    атмосферу креатива и вдохновения.
                </p>
                <p className={'description'}>
                    Мы уверены, что стиль не только в одежде, но и в нашем подходе к работе.
                    Мы <b>стремимся к инновациям</b>, ищем новые идеи и всегда рады воплотить их
                    в жизнь вместе.
                </p>
                <p className={'description'}>
                    Мы не просто команда, мы семья, где каждый член приносит свой вклад в
                    наше общее дело — <b>делать моду доступной</b>, выразительной и вдохновляющей
                    для наших клиентов.
                </p>
            </div>
        </div>
    )
}
