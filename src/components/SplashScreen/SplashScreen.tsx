"use client";
import React, { useState, useEffect } from 'react';
import './SplashScreen.css'
import styles from "@/app/page.module.css";
import Image from "next/image";
import HomeScreenLogo from "@/img/headerLogo.png";
import textLogo from "@/img/textLogo.png";
const SplashScreen = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 700);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`splash-screen ${isVisible ? 'visible' : 'hidden'}`}>
            <div className={'splash-screen-overlay-header'}></div>
            <div className={'splash-screen-overlay'}>
                <Image src={HomeScreenLogo} alt="Logo" className={'splash-screen-logo'}/>
                <div className={'splash-screen-text'}>
                    <Image className={'splash-screen-text-logo'} src={textLogo} alt={'MaryDeniz'}></Image>
                    <p>fashion brand</p>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
