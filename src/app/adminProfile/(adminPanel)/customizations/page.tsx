"use client"
import React, {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {CldUploadButton} from 'next-cloudinary';
import axios from "axios";
import {useRouter} from "next/navigation";
import {getVideo, postVideo} from "@/services/uploadVideo";
import styles from "@/app/page.module.css";
import {useModal} from "@/hooks/useModalStore";
import {getAllProductsAdmin} from "@/services/getData";


const Page = () => {

    const [showCloudinaryUploader, setShowCloudinaryUploader] = useState(false);
    const [mainVideoPublicUrl, setMainVideoPublicUrl] = useState("")
    const [videoSrc, setVideoSrc] = useState("")
    const router = useRouter();

    const {onOpen, data} = useModal();

    useEffect(() => {
        getVideo().then((data) => setVideoSrc(data.data.video.url))
        console.log(data)
    }, [data]); // Update products when `updated` state changes

    type UploadResult = {
        info: {
            secure_url: string,
            public_id: string
        },
        event: "success"
    }

    useEffect(() => {
    }, [])

    useEffect(() => {
        console.log(mainVideoPublicUrl)
        try {
            if (mainVideoPublicUrl) {
                postVideo({secure_url: mainVideoPublicUrl})
            }
        } catch (error: any) {
            console.log(error.message);
        }
    }, [mainVideoPublicUrl])


    return (
        <div>
            <div className="store-container">
                <div className="text-xl font-semibold mt-10">Страница стилизации главного экрана</div>
                <div className="mt-5 flex flex-col">
                    <div className="text-lg">Видеобаннер</div>
                    <div className="flex flex-row">
                        {videoSrc ? <video
                                key={videoSrc}
                                className="h-60 w-120 rounded mt-3"
                                controls
                                muted
                                loop
                            >
                                <source src={videoSrc} type="video/mp4"/>
                                Your browser does not support the video tag.
                            </video>
                            : <div className="h-60 w-120 mt-3"></div>}
                        <div className="flex flex-col justify-center ml-10 space-y-2">
                            <CldUploadButton
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                                uploadPreset="qiladgcy"
                                onUpload={(result: UploadResult) => {
                                    setMainVideoPublicUrl(result.info.secure_url)
                                }}>
                                Добавить новый баннер
                            </CldUploadButton>
                            <Button onClick={() => onOpen("editMainPageVideo", {reload: "reload"})}>
                                Посмотреть существующие баннеры
                            </Button>

                        </div>
                    </div>
                </div>

                <div className="text-lg">Новая коллекция</div>
                <div className="text-lg">Слайдер фотографий</div>
                <div className="flex flex-row space-x-2 mx-auto mt-5">

                </div>
            </div>
        </div>
    );
};

export default Page;