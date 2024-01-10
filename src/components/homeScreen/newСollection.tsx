import styles from "../../app/page.module.css";
import Image from "next/image";
import HomeScreenLogo from "../../img/HomeScreenLogo.png";
import textLogo from "@/img/textLogoW.png";
import NewCollectionLogo from "@/img/NewCollectionLogo.png";
import NewCollectionText from "@/img/NewCollectionText.png";
import React, {useEffect, useState} from "react";
import MainPageVideo from "@/models/mainPageVideoModel";
import {connect} from "@/db/db";
import Marquee from "react-fast-marquee";

connect();

async function getVideo() {
    const video = await MainPageVideo.findOne({active: true});
    return video.url as string;
}


const NewCollection = async () => {

    const videoSrc = await getVideo()

    return (
        <div className="NewCollection">
            <div className="NewCollectionContainer">
                <Marquee speed={110} direction={'left'} autoFill={true}>
                    <Image src={NewCollectionLogo} alt="MaryDeniz"/>
                </Marquee>
            </div>
            <div className={styles.videoContainer}>
                <video
                    className={styles.videoPlayerNewCollection}
                    controls={false}
                    autoPlay
                    muted
                    loop
                >
                    <source src="https://res.cloudinary.com/maticht12345/video/upload/v1703431672/b60cd259-26b8-495c-9ac0-e1b1c03163b7_xet17i.mp4" type="video/mp4" />
                    <source src={videoSrc} type="video/mp4"/>
                    Your browser does not support the video tag.
                </video>
                <div className={styles.overlay}>
                    <Image src={HomeScreenLogo} alt="Logo" className={styles.logo}/>
                    <div className={styles.text}>
                        <Image className={styles.textLogoNewCollection} src={textLogo} alt={'MaryDeniz'}></Image>
                        <p>New Collection</p>
                    </div>
                </div>
            </div>
            <div className="NewCollectionContainer">
                <Marquee speed={110} direction={'right'} autoFill={true}>
                    <Image style={{height:'12px'}} src={NewCollectionText} alt="MaryDeniz"/>
                </Marquee>
            </div>
        </div>

    )
}
export {NewCollection}
