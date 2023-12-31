"use client"
import React, {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {CldUploadButton} from 'next-cloudinary';
import axios from "axios";
import {useRouter} from "next/navigation";
import {postVideo} from "@/services/uploadVideo";


const Page = () => {

    const [showCloudinaryUploader, setShowCloudinaryUploader] = useState(false);
    const [mainVideoPublicUrl, setMainVideoPublicUrl] = useState("")
    const router = useRouter();

    type UploadResult = {
        info: {
            secure_url: string,
            public_id: string
        },
        event: "success"
    }

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
                <div className="flex flex-row space-x-2 mx-auto mt-5">
                    <CldUploadButton
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                        uploadPreset="qiladgcy"
                        onUpload={(result: UploadResult) => {
                            setMainVideoPublicUrl(result.info.secure_url)
                        }}>
                        Добавить видео для главной страницы
                    </CldUploadButton>
                    <Button>
                        Добавить новые фото для слайдера
                    </Button>
                    <Button>
                        Добавить новую коллекцию
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Page;