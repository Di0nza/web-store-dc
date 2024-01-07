"use client"
import React, {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {CldUploadButton} from 'next-cloudinary';
import axios from "axios";
import {useRouter} from "next/navigation";
import {getVideo, postVideo} from "@/services/MainPageVideoFunctions";
import {ModalType, useModal} from "@/hooks/useModalStore"
import Image from "next/image";
import {ActionToolTip} from "@/components/ActionToolTip";
import {Trash} from "lucide-react";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {getAllPhotos, patchPhoto, postPhoto} from "@/services/MainPagePhotoFunctions";
import sliderImg1 from "@/img/homeSlider/00751.jpg";
import sliderImg2 from "@/img/homeSlider/00757.jpg";
import sliderImg3 from "@/img/homeSlider/00755.jpg";
import sliderImg4 from "@/img/homeSlider/00763.jpg";


const Page = () => {

    const [showCloudinaryUploader, setShowCloudinaryUploader] = useState(false);
    const [mainVideoPublicUrl, setMainVideoPublicUrl] = useState("")
    const [videoSrc, setVideoSrc] = useState("")
    const router = useRouter();


    const [mainPhotoPublicUrl, setMainPhotoPublicUrl] = useState("")
    const [images, setImages] = useState([]);


    const {isOpen, onClose, type, data, onOpen} = useModal();

    useEffect(() => {
        getVideo().then((data) => setVideoSrc(data.data.video.url));
        getAllPhotos().then((data) => setImages(data.data.photos));
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
        console.log(mainVideoPublicUrl)
        try {
            if (mainVideoPublicUrl) {
                postVideo({secure_url: mainVideoPublicUrl}).then(() => setMainVideoPublicUrl(""));
            }
        } catch (error: any) {
            console.log(error.message);
        }
    }, [mainVideoPublicUrl])

    useEffect(() => {
        console.log(mainPhotoPublicUrl)
        try {
            if (mainPhotoPublicUrl) {
                postPhoto({secure_url: mainPhotoPublicUrl}).then((data) => {
                    setMainPhotoPublicUrl("")
                    setImages([...images, data.data.photo]);
                });
            }
        } catch (error: any) {
            console.log(error.message);
        }
    }, [mainPhotoPublicUrl])

    const updateActiveImages = async (id) => {
        try {
            const updatedImage = await patchPhoto(id);
            const updatedImageIndex = images.findIndex(image => image._id === id);

            if(updatedImageIndex !== -1){
                const updatedImagesArr = [...images];
                updatedImagesArr[updatedImageIndex] = updatedImage.data.photo;
                setImages(updatedImagesArr);
            }
        } catch (error: any) {
            console.log(error.message);
        }
    }

    const onActionDelete = (e: React.MouseEvent, action: ModalType, photo) => {
        // const updatedImageIndex = images.findIndex(image => image._id === photo._id);
        // if(updatedImageIndex !== -1){
        //     const updatedImagesArr = [...images];
        //     setImages(updatedImagesArr.splice(updatedImageIndex, 1));
        // }
        e.stopPropagation();
        onOpen(action, {photo});
    }

    return (
        <div className="store-container">
            <div className="text-xl font-semibold mt-10">Страница стилизации главного экрана</div>
            <div className="mt-5 flex flex-col space-y-10 w-full">

                <div>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg">Видеобаннер</AccordionTrigger>
                            <AccordionContent>
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
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>


                <div>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg">Новая коллекция</AccordionTrigger>
                            <AccordionContent>
                                НОВАЯ КОЛЛЕКЦИЯ
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>


                <div>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg">Слайдер фотографий</AccordionTrigger>
                            <AccordionContent>
                                <CldUploadButton
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                                    uploadPreset="qiladgcy"
                                    onUpload={(result: UploadResult) => {
                                        setMainPhotoPublicUrl(result.info.secure_url)
                                    }}>
                                    Добавить новое фото
                                </CldUploadButton>

                                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {images.map((image, index) => (
                                        <div key={image._id}
                                             className={`relative p-1 rounded ${image.active ? 'border-2 border-solid border-green-500' : ''} cursor-pointer`}>
                                            <img
                                                className="h-72 object-cover z-4 transition-opacity duration-500 ease-in-out current"
                                                src={image.url}
                                                alt={`Slide ${index}`}
                                                onClick={() => updateActiveImages(image._id)}
                                            />
                                            <div className="absolute rounded top-3 right-3">
                                                <ActionToolTip label="Удалить">
                                                    <div className="bg-white p-1 rounded">
                                                        <Trash
                                                            onClick={(e) => onActionDelete(e, "deleteMainPagePhoto", image)}
                                                            className="group-hover:block w-6 h-6 text-zinc-800 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                                                        />
                                                    </div>
                                                </ActionToolTip>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>


            </div>
        </div>
    );
};

export default Page;