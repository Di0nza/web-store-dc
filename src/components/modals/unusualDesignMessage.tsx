"use client";
import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useParams} from "next/navigation";
import Image from "next/image";
import close from '../../img/close.png'

const UnusualDesignMessage = ({show, onHide, item}) => {
    const [value, setValue] = useState('');
    const [isSend, setIsSend] = useState(false);
    const params = useParams();
    const [message, setMessage] = useState({
        title: `Особое предпочтение насчет ${item.title}`,
        message: '',
        categories: 'Особое из текущего',
        authorsContact: '',
        createdAt: Date.now,

    });
    const addDesignMessage = async () => {
        try {
            const messageData = {
                title: message.title,
                message: value,
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

    useEffect(() => {
        const timerId = setTimeout(() => {
            setIsSend(false)
        }, 100);
        return () => {
            clearTimeout(timerId)
        };
    }, [onHide]);

    const handleAuthorsContactChange = (event) => {
        setMessage({ ...message, authorsContact: event.target.value });
    };
    const [block1Disabled, setBlock1Disabled] = useState(false);
    const [block2Disabled, setBlock2Disabled] = useState(false);
    const [block3Disabled, setBlock3Disabled] = useState(false);

    const handleBlockClick = (blockText, blockNumber) => {
        if (value.indexOf(blockText) === -1) {
            setValue((prevValue) => prevValue + blockText);
            if (blockNumber === 1) {
                setBlock1Disabled(true);
            } else if (blockNumber === 2) {
                setBlock2Disabled(true);
            } else if (blockNumber === 3) {
                setBlock3Disabled(true);
            }
        }
    };
    useEffect(() => {
        setBlock1Disabled(value.indexOf('Иной размер. ') !== -1);
        setBlock2Disabled(value.indexOf('Отличающийся дизайн. ') !== -1);
        setBlock3Disabled(value.indexOf('Другой материал. ') !== -1);
    }, [value]);


    return show && (
        <div className="shearContainer">
            {isSend ? (
                <div>
                    <div>
                        <header>
                            <p className="shearContainerTitle">
                                Дополнительные предпочтения
                            </p>
                        </header>
                        <div className="shearSuccess">
                            Ваше сообщение отправлено
                        </div>
                        <footer  className="shearSuccessFooter"></footer>
                    </div>
                </div>
            ) : (
                <>
                    <header className="shearStoreContainerHeader">
                        <p className="shearContainerTitle">
                            Дополнительные предпочтения
                        </p>
                        <button onClick={onHide}>
                            <Image className="shearContainerCloseImg" src={close} alt={'x'}></Image>
                        </button>
                    </header>
                    <div className="shearContainerBlock">
                        <form>
                            <div className="shearContainerOptionsBlock" style={{ }}>
                                <div className="shearContainerOption"
                                    style={{
                                        cursor: block1Disabled ? 'default' : 'pointer',
                                        padding: block1Disabled ? '7.2px 9.2px' : '8px 10px',
                                        border: block1Disabled ? '2px solid #111111' : '1px solid #dedede',
                                    }}
                                    onClick={() => handleBlockClick('Иной размер. ', 1)}
                                >
                                    Иной размер
                                </div>
                                <div className="shearContainerOption"
                                    style={{
                                        cursor: block2Disabled ? 'default' : 'pointer',
                                        padding: block2Disabled ? '7.2px 9.2px' : '8px 10px',
                                        border: block2Disabled ? '2px solid #111111' : '1px solid #dedede',
                                    }}
                                    onClick={() => handleBlockClick('Отличающийся дизайн. ', 2)}
                                >
                                    Отличающийся дизайн
                                </div>
                                <div className="shearContainerOption"
                                    style={{
                                        cursor: block3Disabled ? 'default' : 'pointer',
                                        padding: block3Disabled ? '7.2px 9.2px' : '8px 10px',
                                        border: block3Disabled ? '2px solid #111111' : '1px solid #dedede',
                                    }}
                                    onClick={() => handleBlockClick('Другой материал. ', 3)}
                                >
                                    Другой материал
                                </div>
                            </div>
                            <textarea
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder={'Введите текст сообщения'}
                                className="shearContainerTextarea"
                            />
                            <input
                                value={message.authorsContact} onChange={handleAuthorsContactChange}
                                placeholder={'Ваша почта или Tg'}
                                className="shearContainerInput"/>
                        </form>
                    </div>
                    <footer>
                        <button className='mainMsgButton' onClick={addDesignMessage}>
                            <p>Отправить</p>
                        </button>
                    </footer>
                </>
            )}
        </div>
    );
};

export default UnusualDesignMessage;
