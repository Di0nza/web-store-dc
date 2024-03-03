"use client";
import React, {useState} from 'react';
import axios from "axios";
import '../../app/profile/profileStyles.css'
import specialBg from '../../img/special.png'

const OwnDesignOrder = () => {
    const [orderTitle, setOrderTitle] = useState('');
    const [message, setMessage] = useState({
        title: '',
        message: '',
        categories: 'Особый заказ',
        authorsContact: '',
        createdAt: Date.now,

    });
    const addDesignMessage = async () => {
        try {
            const messageData = {
                title: message.title,
                message: message.message,
                category: message.categories,
                authorsContact: message.authorsContact,
                createdAt: Date.now,
            };
            const response = await axios.post("/api/users/messages", messageData);
            console.log(response.data.messages._id);
            window.location.reload();
        } catch (error:any) {
            console.log(error.message);
        }
    };
    const handleTitleChange = (event) => {
        setMessage({ ...message, title: event.target.value });
    };
    const handleAuthorsContactChange = (event) => {
        setMessage({ ...message, authorsContact: event.target.value });
    };
    const handleMessageChange = (event) => {
        setMessage({ ...message, message: event.target.value });
    };


    return (
        <div className="ownDesignOrder">
            <header className="shearContainerHeader">
                <p className="shearContainerTitle">
                    Уникальный стиль по вашему желанию
                </p>
                <p className="shearContainerText">
                    Дайте жизнь своим идеям! Независимо от того, ищете ли вы особый дизайн
                    для повседневной одежды, специальное платье для важного события или что-то совершенно новое,
                    мы готовы воплотить вашу мечту в реальность. Оставьте заявку,
                    чтобы мы могли начать работу над вашим индивидуальным заказом уже сегодня!
                </p>
            </header>
            <div className="shearContainerBlock">
                <form>
                    <input
                        value={message.title} onChange={handleTitleChange}
                        placeholder={'Введите заголовок сообщения'}
                        className="shearContainerInput"/>
                    <textarea
                        value={message.message} onChange={handleMessageChange}
                        placeholder={'Опишите вашу задумку'}
                        className="shearContainerTextarea"
                    />
                    <input
                        value={message.authorsContact} onChange={handleAuthorsContactChange}
                        placeholder={'Ваша почта или Tg'}
                        className="shearContainerInput"/>
                </form>
            </div>
            <footer>
                <button className='ownDesignMsgButton' onClick={addDesignMessage}>
                    <p>Отправить</p>
                </button>
            </footer>
        </div>
    );
};

export default OwnDesignOrder;
