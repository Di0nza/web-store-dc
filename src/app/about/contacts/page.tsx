'use client'
import '../AboutStyles.css'

export default function Contacts() {
    return (
        <div className={'contacts'}>
            <h2 className={'title'}>Контакты</h2>
            <p className={'description'}>Наш адрес: ул. Название, город, Почтовый индекс</p>
            <p className={'description'}>Телефон: +123456789</p>
            <p className={'description'}>Email: info@example.com</p>
            <p className={'description'}>График работы: Пн-Пт, 9:00-18:00</p>
        </div>
    );
}
