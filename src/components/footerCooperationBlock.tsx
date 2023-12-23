"use client";
import React, {useState} from 'react';
import axios from "axios";
import '../app/profile/profileStyles.css'

const FooterCooperationBlock = () => {
    const [orderTitle, setOrderTitle] = useState('');
    const [message, setMessage] = useState({
        title: '',
        message: '',
        category: 'Сотрудничество',
        authorsContact: '',
        createdAt: Date.now(),
    });
    const addDesignMessage = async () => {
        try {
            const messageData = {
                title: message.title,
                message: message.message,
                category: message.category,
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
        setMessage({...message, title: event.target.value});
    };
    const handleAuthorsContactChange = (event) => {
        setMessage({ ...message, authorsContact: event.target.value });
    };
    const handleMessageChange = (event) => {
        setMessage({ ...message, message: event.target.value });
    };


    return (
        <div className="сooperationContainer">
            <header className="shearContainerHeader">
                <p className="shearContainerTitle">
                    Предложение о сотруднечисве
                </p>
            </header>
            <div className="shearContainerBlock">
                <form>
                    <input
                        value={message.title} onChange={handleTitleChange}
                        placeholder={'Введите тему сообщения'}
                        className="shearContainerInput"/>
                    <textarea
                        value={message.message} onChange={handleMessageChange}
                        placeholder={'Опишите вашу идею'}
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

export default FooterCooperationBlock;
