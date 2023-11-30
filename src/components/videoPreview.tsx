import styles from "../app/page.module.css";
import Image from "next/image";
import HomeScreenLogo from "../img/HomeScreenLogo.png";

const VideoPreview = () => {
    return (
        <div className={styles.videoContainer}>
            <video
                className={styles.videoPlayer}
                controls={false}
                autoPlay
                muted
                loop
            >
                <source src="https://res.cloudinary.com/maticht12345/video/upload/v1701300494/videoplayback_k5t3xv.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className={styles.overlay}>
                <Image src={HomeScreenLogo} alt="Logo" className={styles.logo} />
                <div className={styles.text}>
                    <h2>MaryDeniz</h2>
                    <p>fashion brand</p>
                </div>
            </div>
        </div>
    )
}
export {VideoPreview}
