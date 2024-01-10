import React from 'react';
import styles from "@/app/page.module.css";
import Image from "next/image";
import HomeScreenLogo from "@/img/HomeScreenLogo.png";
import textLogo from "@/img/textLogoW.png";
import MainPageVideo from "@/models/mainPageVideoModel";

async function getVideo() {
    const video = await MainPageVideo.findOne({active: true});
    return video.url as string;
}


export const NewCollection = async() => {

    const videoSrc = await getVideo()

    return (
        <div className={styles.videoContainer}>
            <div className="marquee">
                <div className="marquee__content scroll">
                    <div>
                        NEW COLLECTION
                    </div>
                </div>
            </div>
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
    );
};
