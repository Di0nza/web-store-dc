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
        images: 'https://res.cloudinary.com/maticht12345/image/upload/v1701277508/Letter_-_16_wds2cz.png',
    },
    icons: 'https://res.cloudinary.com/maticht12345/image/upload/v1701277508/Letter_-_16_wds2cz.png',
}

export default function Home() {
    return (
        <main className={styles.main}>
            <SplashScreen />
            <VideoPreview/>
            <div className={styles.homeDescriptionBlock}>
                <p>Добро пожаловать в уникальный мир рок-панк стиля,
                    где энергия музыки сливается с художественным дизайном,
                    создавая уникальные модные образы. Наш интернет-магазин —
                    это путешествие в смелый и дерзкий мир выражения через одежду.
                    Мы вдохновляемся духом свободы, рок-музыкой и панк-культурой,
                    предлагая вам не просто стильные наряды, а искусство,
                    отражающее вашу уникальность. Станьте частью нашей коллекции,
                    где каждая покупка становится вашим неповторимым посланием
                    миру и частью вашей истории.</p>
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
