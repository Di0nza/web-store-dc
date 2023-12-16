import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import './globals.css'
import {Header} from "@/components/Header";
import {Footer} from "@/components/Footer";
// @ts-ignore
import {OrderProvider} from "@/orderContext/store";
const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'MariDeniz',
    description: 'Shop unique fashion clothing with signature designs',
    keywords: ['Clothing', 'fashion', 'women\'s clothing', 'men\'s clothing'],
    openGraph: {
        images: 'https://res.cloudinary.com/maticht12345/image/upload/v1701277508/Letter_-_16_wds2cz.png',
    },
    icons: 'https://res.cloudinary.com/maticht12345/image/upload/v1701277508/Letter_-_16_wds2cz.png',
}

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <OrderProvider>
                <body className={inter.className}>
                    <Header/>
                        <main className='home-container'>{children}</main>
                    <Footer/>
                </body>
            </OrderProvider>
        </html>
    )
}
