import styles from "../../app/page.module.css";
import Image from "next/image";
import HomeScreenLogo from "../../img/HomeScreenLogo.png";
import textLogo from "@/img/textLogoW.png";
import NewCollectionLogo from "@/img/NewCollectionLogo.png";
import NewCollectionText from "@/img/NewCollectionText.png";
import React, {useEffect, useState} from "react";
import NewCollectionModel from "@/models/newCollectionModel";
import {connect} from "@/db/db";
import Marquee from "react-fast-marquee";

connect();

async function getNewCollection() {
    const newCollection = await NewCollectionModel.findOne();
    console.log(newCollection)
    return newCollection;
}


const NewCollection = async () => {

    const collection = await getNewCollection()

    return collection.active && (
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
                    <source src={collection.videoUrl} type="video/mp4"/>
                    Your browser does not support the video tag.
                </video>
                <div className={styles.overlay}>
                    {/*<Image src={HomeScreenLogo} alt="Logo" className={styles.logo}/>*/}
                    <div className={styles.text}>
                        {/*<Image className={styles.textLogoNewCollection} src={textLogo} alt={'MaryDeniz'}></Image>*/}
                        <p>{collection.title}</p>
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
