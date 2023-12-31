"use client";
import React, {useState} from 'react';
import axios from "axios";
import '../app/profile/profileStyles.css'
import Image from "next/image";
import close from "@/img/close.png";

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
        <div className="blur-background">
            <div className="сooperationContainer">
                <header className="shearStoreContainerHeader">
                    <p className="shearContainerTitle">
                        Предложение о сотруднечисве
                    </p>
                    <button onClick={() => window.location.reload()}>
                        <Image className="shearContainerCloseImg" src={close} alt={'x'}></Image>
                    </button>
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
        </div>
    );
};

export default FooterCooperationBlock;
