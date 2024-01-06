import styles from "../app/page.module.css";
import Image from "next/image";
import HomeScreenLogo from "../img/HomeScreenLogo.png";
import textLogo from "@/img/textLogoW.png";
import React, {useEffect, useState} from "react";
import MainPageVideo from "@/models/mainPageVideo";
import {connect} from "@/db/db";

connect();

async function getVideo() {
    const video = await MainPageVideo.findOne({active: true});
    return video.url as string;
}


const VideoPreview = async () => {

    const videoSrc = await getVideo()

    return (
        <div className={styles.videoContainer}>
            <video
                className={styles.videoPlayer}
                controls={false}
                autoPlay
                muted
                loop
            >
                {/*<source src="https://res.cloudinary.com/maticht12345/video/upload/v1703431672/b60cd259-26b8-495c-9ac0-e1b1c03163b7_xet17i.mp4" type="video/mp4" />*/}
                <source src={videoSrc} type="video/mp4"/>
                Your browser does not support the video tag.
            </video>
            <div className={styles.overlay}>
                <Image src={HomeScreenLogo} alt="Logo" className={styles.logo}/>
                <div className={styles.text}>
                    <Image className={styles.textLogo} src={textLogo} alt={'MaryDeniz'}></Image>
                    <p>fashion brand</p>
                </div>
            </div>
        </div>
    )
}
export {VideoPreview}
