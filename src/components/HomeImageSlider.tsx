'use client'
import React, { useState, useEffect } from 'react';
import styles from '../app/page.module.css'
import Image from "next/image";
import sliderImg1 from '../img/homeSlider/maxresdefault.jpg';
import sliderImg2 from '../img/homeSlider/gucci-ajjvb4hud7mpthy4.jpg';
import sliderImg3 from '../img/homeSlider/GettyImages-1469437081.webp';
import sliderImg4 from '../img/homeSlider/real-gq-october-2020.webp';

const HomeImageSlider = () => {
    const images = [sliderImg1,sliderImg2,sliderImg3,sliderImg4,];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextSlide = () => {
        const newIndex = (currentImageIndex + 1) % images.length;
        setCurrentImageIndex(newIndex);
    };

    const prevSlide = () => {
        const newIndex = (currentImageIndex - 1 + images.length) % images.length;
        setCurrentImageIndex(newIndex);
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
                <Image
                    className={styles.slideImg}
                    src={images[currentImageIndex]}
                    alt={`Slide ${currentImageIndex}`}
                />
                <div className={styles.sliderOverlay}>
                    <div className={styles.arrowLeft} onClick={prevSlide}></div>
                    <div className={styles.arrowRight} onClick={nextSlide}></div>
                </div>
            </div>
        </div>
    )
}
export {HomeImageSlider}
