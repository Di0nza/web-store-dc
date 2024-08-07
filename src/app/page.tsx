import styles from './page.module.css'
import {VideoPreview} from "@/components/homeScreen/videoPreview";
import {HomeImageSlider} from "@/components/homeScreen/HomeImageSlider";
import OwnDesignOrder from "@/components/homeScreen/ownDesignOrder";
import {NewCollection} from "@/components/homeScreen/newСollection";
import {BestProducts} from "@/components/homeScreen/BestProducts";
import SplashScreen from "@/components/SplashScreen/SplashScreen";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'MariDeniz',
    description: 'Shop unique fashion clothing with signature designs',
    keywords: ['Clothing', 'fashion', 'women\'s clothing', 'men\'s clothing'],
    openGraph: {
        images: 'https://res.cloudinary.com/dzdmstsam/image/upload/v1718646315/Letter_-_16_zwgkz9.png',
    },
    icons: 'https://res.cloudinary.com/dzdmstsam/image/upload/v1718646289/Letter_-_126_x8fpma.png',
}

export default function Home() {
    return (
        <main className={styles.main}>
            <SplashScreen />
            <VideoPreview/>
            <div className={styles.homeDescriptionBlock}>
                <p>MariDeniz - бренд, вдохновленный внутренней свободой и гармонией между телом, разумом и душой. Каждый
                    из нас мечтает об этом состоянии, когда наша жизненная энергия освещает мир вокруг нас.
                    <br/>
                    <br/>
                    Мы верим, что одежда должна не только красиво выглядеть, но и вдохновлять вас быть собой.
                    <br/>
                    <br/> Когда вы даете себе возможность быть увиденными и принятыми миром, вы обретаете свое
                    собственное
                    место, к которому стремитесь. Выбирайте то, что резонирует с вашим внутренним миром, и позвольте
                    себе быть по-настоящему счастливыми.
                    Находясь в гармонии со своей душой, телом и разумом, вы живете своей мечтой - это и есть главная
                    миссия бренда MariDeniz.</p>
            </div>
            <NewCollection/>
            <BestProducts/>
            <div className={styles.homeOrderSliderBlock}>
                <HomeImageSlider/>
                <OwnDesignOrder/>
            </div>
        </main>
    );
}
