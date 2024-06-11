import type {Metadata} from 'next'
import Link from "next/link";
import './AboutStyles.css'
import AboutNavigation from "@/components/aboutNavigation";

export const metadata: Metadata = {
    title: 'About | MariDenizDesign',
    description: 'Shop unique fashion clothing with signature designs',
    keywords: ['Clothing', 'fashion', 'women\'s clothing', 'men\'s clothing'],
    openGraph: {
        images: 'https://res.cloudinary.com/maticht12345/image/upload/v1701277508/Letter_-_16_wds2cz.png',
    },
    icons: 'https://res.cloudinary.com/maticht12345/image/upload/v1701277508/Letter_-_16_wds2cz.png',
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
