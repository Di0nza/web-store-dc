'use client'
import React, {useState, useEffect} from 'react';
import styles from '../../app/page.module.css'
import Image from "next/image";
import arrowW from '../../img/arrowW.png'
import sliderImg1 from '../../img/homeSlider/00751.jpg';
import sliderImg2 from '../../img/homeSlider/00757.jpg';
import sliderImg3 from '../../img/homeSlider/00755.jpg';
import sliderImg4 from '../../img/homeSlider/00763.jpg';
import {getActivePhotos, getAllPhotos} from "@/services/MainPagePhotoFunctions";

const HomeImageSlider = () => {
    const [images, setImages] = useState([]); //[sliderImg1,sliderImg2,sliderImg3,sliderImg4,];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [slideAnimation, setSlideAnimation] = useState('');

    useEffect(() => {
        getActivePhotos().then((data) => {
            setImages(data?.data?.photos);
            console.log(data?.data?.photos);
        });
    }, []);

    useEffect(() => {
        if (images?.length !== 0) {
            const interval = setInterval(() => {
                nextSlide();
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [currentImageIndex, images]);

    const nextSlide = () => {
        setSlideAnimation('slide-left');
        setTimeout(() => {
            const newIndex = (currentImageIndex + 1) % images?.length;
            setCurrentImageIndex(newIndex);
            setSlideAnimation('');
        }, 100);
    };

    const prevSlide = () => {
        setSlideAnimation('slide-right');
        setTimeout(() => {
            const newIndex = (currentImageIndex - 1 + images?.length) % images?.length;
            setCurrentImageIndex(newIndex);
            setSlideAnimation('');
        }, 100);
    };

    return images ? (
        <div
            className={styles.slider}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={styles.slideContainer}>
                <div className={styles.blurContainer}>
                    <Image
                        className={`${styles.blurBackground} ${styles[slideAnimation]} ${styles.fade}`}
                        src={images[currentImageIndex]?.url}
                        alt="Blurred Background"
                        layout="fill"
                        objectFit="cover"
                        quality={100}
                    />
                </div>
                <img
                    className={`${styles.slideImg} ${slideAnimation === 'slide-left' ? 'previous' : 'current'} ${styles.fade}`}
                    src={images[currentImageIndex]?.url}
                    alt={`Slide ${currentImageIndex}`}
                />
                {isHovered && (
                    <div className={styles.sliderOverlay}>
                        <div className={styles.arrowSlider} onClick={prevSlide}>
                            <Image className={styles.lastArrowSliderImg} src={arrowW} alt={'<'} />
                        </div>
                        <div className={styles.arrowSlider} onClick={nextSlide}>
                            <Image className={styles.arrowSliderImg} src={arrowW} alt={'>'} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    ) : null;
};
export {HomeImageSlider}
