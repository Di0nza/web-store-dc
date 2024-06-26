import type {Metadata} from 'next'
import Link from "next/link";
import './PrivacyPolicyStyles.css'
import {usePathname} from "next/navigation";

export const metadata: Metadata = {
    title: 'PrivacyPolicy | MariDenizDesign',
    description: 'Shop unique fashion clothing with signature designs',
    keywords: ['Clothing', 'fashion', 'women\'s clothing', 'men\'s clothing'],
    openGraph: {
        images: 'https://res.cloudinary.com/dzdmstsam/image/upload/v1718646315/Letter_-_16_zwgkz9.png',
    },
    icons: 'https://res.cloudinary.com/dzdmstsam/image/upload/v1718646289/Letter_-_126_x8fpma.png',
}
export default function PrivacyPolicy() {
    return (
        <div className='about-container'>
            <div className='about-content'>
                <div className={'privacyPolicy'}>
                    <h1>Политика конфиденциальности</h1>
                    <p>
                        Добро пожаловать в MariDenizDesign! Мы ценим вашу конфиденциальность и стремимся
                        обеспечить безопасное использование нашего интернет-магазина.
                    </p>

                    <h2>Сбор информации</h2>
                    <p>
                        Мы собираем информацию, необходимую для обработки заказов и обеспечения
                        качественного обслуживания клиентов. Эта информация может включать ваши
                        имя, контактные данные, адрес доставки и платежные реквизиты.
                    </p>

                    <h2>Использование информации</h2>
                    <p>
                        Мы используем предоставленную информацию для обработки заказов, обеспечения
                        доставки товаров, связи с вами относительно вашего заказа и предоставления
                        информации о новых акциях и предложениях, если вы дали на это согласие.
                    </p>

                    <h2>Защита информации</h2>
                    <p>
                        Мы принимаем все необходимые меры для защиты вашей личной информации
                        от несанкционированного доступа или использования.
                    </p>

                    <h2>Предоставление третьим лицам</h2>
                    <p>
                        Мы не продаем, не обмениваем и не передаем вашу личную информацию
                        третьим лицам без вашего согласия, за исключением случаев, предусмотренных
                        законодательством.
                    </p>

                    <h2>Согласие</h2>
                    <p>
                        Используя наш интернет-магазин, вы соглашаетесь с нашей политикой
                        конфиденциальности.
                    </p>

                    <h2>Изменения в политике</h2>
                    <p>
                        Мы оставляем за собой право вносить изменения в нашу политику конфиденциальности,
                        которые будут опубликованы на этой странице.
                    </p>

                    <p>
                        Последнее обновление: Декабрь 2023 года
                    </p>
                </div>
            </div>
        </div>

    )
}
