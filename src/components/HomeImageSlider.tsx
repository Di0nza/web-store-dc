'use client'
import React, { useState, useEffect } from 'react';
import styles from '../app/page.module.css'
import Image from "next/image";
import arrowW from '../img/arrowW.png'
import sliderImg1 from '../img/homeSlider/00751.jpg';
import sliderImg2 from '../img/homeSlider/00757.jpg';
import sliderImg3 from '../img/homeSlider/00755.jpg';
import sliderImg4 from '../img/homeSlider/00763.jpg';

const HomeImageSlider = () => {
    const images = [sliderImg1,sliderImg2,sliderImg3,sliderImg4,];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [slideAnimation, setSlideAnimation] = useState('');

    const nextSlide = () => {
        setSlideAnimation('slide-left');
        setTimeout(() => {
            const newIndex = (currentImageIndex + 1) % images.length;
            setCurrentImageIndex(newIndex);
            setSlideAnimation('');
        }, 100);
    };

    const prevSlide = () => {
        setSlideAnimation('slide-right');
        setTimeout(() => {
            const newIndex = (currentImageIndex - 1 + images.length) % images.length;
            setCurrentImageIndex(newIndex);
            setSlideAnimation('');
        }, 100);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 3000);

        return () => clearInterval(interval);
    }, [currentImageIndex]);

    return (
        <div className={styles.slider}>
            <div className={styles.slideContainer}>
                <div className={styles.blurContainer}>
                    <Image
                        className={styles.blurBackground}
                        src={images[currentImageIndex]}
                        alt="Blurred Background"
                        layout="fill"
                        objectFit="cover"
                        quality={100}
                    />
                </div>
                <Image
                    className={`${styles.slideImg} ${slideAnimation === 'slide-left' ? 'previous' : 'current'}`}
                    src={images[currentImageIndex]}
                    alt={`Slide ${currentImageIndex}`}
                />
                <div className={styles.sliderOverlay}>
                    <div className={styles.arrowSlider} onClick={prevSlide}>
                        <Image className={styles.lastArrowSliderImg} src={arrowW} alt={'<'}/>
                    </div>
                    <div className={styles.arrowSlider} onClick={nextSlide}>
                        <Image className={styles.arrowSliderImg} src={arrowW} alt={'>'}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
export {HomeImageSlider}
