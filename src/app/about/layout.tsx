import type {Metadata} from 'next'
import Link from "next/link";
import './AboutStyles.css'
import AboutNavigation from "@/components/aboutNavigation";

export const metadata: Metadata = {
    title: 'About | MariDenizDesign',
    description: 'Shop unique fashion clothing with signature designs',
    keywords: ['Clothing', 'fashion', 'women\'s clothing', 'men\'s clothing'],
    openGraph: {
        images: 'https://res.cloudinary.com/dzdmstsam/image/upload/v1718646315/Letter_-_16_zwgkz9.png',
    },
    icons: 'https://res.cloudinary.com/dzdmstsam/image/upload/v1718646289/Letter_-_126_x8fpma.png',
}

export default function AboutLayout({children}: { children: React.ReactNode }) {
    return (
        <div className='about-container'>
            <div className='about-content'>
                <AboutNavigation/>
                {children}
            </div>
        </div>
    )
}
