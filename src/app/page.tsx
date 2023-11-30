import styles from './page.module.css'
import {VideoPreview} from "../components/videoPreview";
import {HomeImageSlider} from "../components/HomeImageSlider";

export default function Home() {
    return (
        <main className={styles.main}>
            <VideoPreview/>
            <div className={styles.homeDescriptionBlock}>
                <h2>Mary Deniz</h2>
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
            <HomeImageSlider/>
        </main>
    );
}
