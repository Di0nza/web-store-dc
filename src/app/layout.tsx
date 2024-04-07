import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import './globals.css'
import {Header} from "@/components/navigation/Header";
import {Footer} from "@/components/navigation/Footer";
// @ts-ignore
import {OrderProvider} from "@/orderContext/store";
import {ModalProvider} from "@/components/providers/modalProvider";
import {SessionProvider} from "next-auth/react";
import {auth} from "@/auth";
import {Toaster} from "@/components/ui/sonner";

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
export default async function RootLayout({children}: { children: React.ReactNode }) {

    const session = await auth();

    return (
        <SessionProvider session={session}>
            <html lang="en">
            <ModalProvider/>
            <OrderProvider>
                <body className={inter.className}>
                <Header/>
                <main className='home-container'>
                    {children}
                    <Toaster/>
                </main>
                <Footer/>
                </body>
            </OrderProvider>
            </html>
        </SessionProvider>
    )
}
