"use client";
import Image from "next/image";
import headerLogo from "@/img/headerLogo.png";
import textLogo from "@/img/textLogo.png";
import Link from "next/link";
import React, {useState} from "react";
import axios from "axios";
import OwnDesignOrder from "@/components/ownDesignOrder";
import FooterCooperationBlock from "@/components/footerCooperationBlock";
import FooterErrorBlock from "@/components/footerErrorBlock";
interface UserData {
    isAdmin: boolean;
    username: string;
    email: string;
    createdAt?: string;
}
const Footer = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isFooterErrorBlockOpen, setIsFooterErrorBlockOpen] = useState(false);
    const [isFooterCooperationBlockOpen, setIsFooterCooperationBlockOpen] = useState(false);
    const toggleFooterErrorBlock = () => {
        setIsFooterErrorBlockOpen(!isFooterErrorBlockOpen);
        setIsFooterCooperationBlockOpen(false);
    };

    const toggleFooterCooperationBlock = () => {
        setIsFooterCooperationBlockOpen(!isFooterCooperationBlockOpen);
        setIsFooterErrorBlockOpen(false);
    };


    const getUserDetails = async () => {
        try {
            const res = await axios.get<{ data: UserData }>('/api/users/userdata');
            console.log(res.data.data.username);
            setUserData(res.data.data);
        } catch (error: any) {
            console.log(error.message);
        }
    };
    return (
        <footer className='footer-container'>

            <div className='footer-block'>
                {isFooterErrorBlockOpen && (
                    <FooterErrorBlock/>
                )}
                {isFooterCooperationBlockOpen && (
                    <FooterCooperationBlock/>
                )}
                <p className='footer-privacy-text'>Этот веб-сайт использует Google Analytics, чтобы помочь нам улучшить его содержимое.
                    <Link className='footer-privacy-link-text' href={'/privacyPolicy'}> Политика Конфиденциальности</Link>
                </p>

                <div className='footer-info-block'>
                    <div className='footer-error-block'>
                        <p>Помогите сделать наш сервис лучше</p>
                        <div className='footer-btns-block'>
                            <button className='footer-error-btn' onClick={toggleFooterErrorBlock}>
                                <p>Сообщить об ошоибке</p>
                            </button>
                            <button className='footer-cooperation-btn' onClick={toggleFooterCooperationBlock}>
                                <p>Предложение о сотрудничестве</p>
                            </button>
                        </div>
                    </div>
                    <Link className='footer-info-title' href={userData?.isAdmin ? '/adminProfile' : '/'}>
                        <Image  className='footer-title-textLogo' src={textLogo} alt={'MaryDeniz'}></Image>
                        <Image  className='footer-title-logo' src={headerLogo} alt={'MaryDeniz'}></Image>
                    </Link>
                </div>
            </div>
        </footer>
    )
}
export {Footer}
