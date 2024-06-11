"use client"
import React, {useEffect, useState, useTransition} from 'react';
import {Button} from "@/components/ui/button";
import {CldUploadButton} from 'next-cloudinary';
import {getVideo, postVideo} from "@/services/MainPageVideoFunctions";
import {ModalType, useModal} from "@/hooks/useModalStore"
import {ActionToolTip} from "@/components/ActionToolTip";
import {Trash} from "lucide-react";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {getAllPhotos, patchPhoto, postPhoto} from "@/services/MainPagePhotoFunctions";
import {getNewCollectionAdmin, patchNewCollection} from "@/services/NewCollectionFunctions";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {LoginSchema} from "@/types/authSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import '@/app/adminProfile/(adminPanel)/promocodes/adminPromocodes.css'
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {INewCollection} from "@/types/NewCollection";
import fakeLogo from '@/img/HomeScreenLogo.png';
import axios from "axios";
import Image from "next/image";
import deleteIco from "@/img/delete.png";

const Page = () => {

    const [mainVideoPublicUrl, setMainVideoPublicUrl] = useState("")
    const [videoSrc, setVideoSrc] = useState("")


    const [mainPhotoPublicUrl, setMainPhotoPublicUrl] = useState("")
    const [images, setImages] = useState([]);

    const [newCollectionVideoPublicUrl, setNewCollectionPublicUrl] = useState("");
    const [newCollection, setNewCollection] = useState<INewCollection>();
    const [isPending, startTransition] = useTransition();


    const {isOpen, onClose, type, data, onOpen} = useModal();

    useEffect(() => {
        getVideo().then((data) => setVideoSrc(data.data.video?.url));
        getAllPhotos().then((data) => setImages(data.data.photos));
        getNewCollectionAdmin().then((data)=> setNewCollection(data.data.newCollection));
        console.log(data)
    }, [data]);


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

    // useEffect(() => {
    //     console.log(newCollectionVideoPublicUrl)
    //     try {
    //         if (newCollectionVideoPublicUrl) {
    //             patchNewCollection({secure_url: newCollectionVideoPublicUrl}).then((data) => {
    //                 setNewCollectionPublicUrl("");
    //                 setNewCollectionVideoSrc(newCollectionVideoPublicUrl);
    //             });
    //         }
    //     } catch (error: any) {
    //         console.log(error.message);
    //     }
    // }, [newCollectionVideoPublicUrl])


    const updateActiveImages = async (id) => {
        try {
            const updatedImage = await patchPhoto(id);
            const updatedImageIndex = images.findIndex(image => image._id === id);

            if (updatedImageIndex !== -1) {
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

    const NewCollectionSchema = z.object({
        title: z.string().min(1, {
            message: "Введите название коллекции",
        }),
        videoUrl: z.optional(z.string().min(1, {
        })),
        active: z.boolean(),
    });


    const form = useForm<z.infer<typeof NewCollectionSchema>>({
        resolver: zodResolver(NewCollectionSchema),
        defaultValues: {
            title: newCollection?.title,
            videoUrl: newCollection?.videoUrl,
            active: newCollection?.active
        },
    });

    useEffect(() => {
        if (newCollection) {
            form.setValue("title", newCollection.title);
            form.setValue("videoUrl", newCollection.videoUrl);
            form.setValue("active", newCollection.active)
        }
    }, [newCollection, form])

    const onSubmit = async (values: z.infer<typeof NewCollectionSchema>) => {


        startTransition(async () => {
           await patchNewCollection({title: values.title, videoUrl: newCollection?.videoUrl || "hjgjhvbh", active: values.active})
                .then(async (data) => {
                    console.log(data)
                    setNewCollection(data.data.newCollection)
                    //window.location.reload();
                });
        });
    };

    return (
        <div className="store-container">
            <div className="text-xl font-semibold mt-10">Страница стилизации главного экрана</div>
            <div className="editing-home-page">
                <div className="fake-home-header">
                    <div className="fake-home-header-logo">
                        <Image src={fakeLogo} alt={'Logo'}></Image>
                    </div>
                    <div className="fake-home-header-text"></div>
                </div>
                <div className="fake-home-video-preview">
                    <div className="fake-home-video-container">
                        <div>
                            <Image src={fakeLogo} alt={'Logo'}></Image>
                            <div className="fake-home-video-text"></div>
                            <div className="fake-home-video-text"></div>
                        </div>
                    </div>
                    <div>
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1" style={{borderBottom: 'none'}}>
                                <AccordionTrigger
                                    className="text-lg editing-block-header">Изменение видеобаннера</AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex flex-col" style={{padding: '0'}}>
                                        {videoSrc ?
                                            <video key={videoSrc} className="home-video-preview" controls muted loop>
                                                <source src={videoSrc} type="video/mp4"/>
                                                Your browser does not support the video tag.
                                            </video>
                                            : <div className="none-home-video-preview">Видеобаннеров нет</div>
                                        }
                                        <div className="home-video-btn-block">
                                            <CldUploadButton
                                                className={'home-video-btn'}
                                                uploadPreset="pnfbfwpd"
                                                onUpload={(result: any) => {
                                                    setMainVideoPublicUrl(result.info.secure_url)
                                                }}>
                                                Добавить новый баннер
                                            </CldUploadButton>
                                            <div className={'home-video-btn'}
                                                             onClick={() => onOpen("editMainPageVideo", {reload: "reload"})}>
                                                <p>Посмотреть существующие баннеры</p>
                                            </div>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
                <div className="fake-home-text-info">
                    <div className="fake-text-info-text"></div>
                    <div className="fake-text-info-text"></div>
                    <div className="fake-text-info-text"></div>
                    <div className="fake-text-info-text"></div>
                </div>
                <div className="fake-home-video-preview">
                    <div className="fake-new-collection-container">
                        {/*<div className="fake-new-running-line">*/}
                        {/*    <Image src={fakeLogo} alt={'Logo'}></Image>*/}
                        {/*    <Image src={fakeLogo} alt={'Logo'}></Image>*/}
                        {/*    <Image src={fakeLogo} alt={'Logo'}></Image>*/}
                        {/*    <Image src={fakeLogo} alt={'Logo'}></Image>*/}
                        {/*    <Image src={fakeLogo} alt={'Logo'}></Image>*/}
                        {/*    <Image src={fakeLogo} alt={'Logo'}></Image>*/}
                        {/*</div>*/}
                        <div className="fake-new-running-line">
                            <div className="fake-running-line-text"></div>
                            <div className="fake-running-line-text"></div>
                            <div className="fake-running-line-text"></div>
                            <div className="fake-running-line-text"></div>
                            <div className="fake-running-line-text"></div>
                            <div className="fake-running-line-text"></div>
                        </div>
                        <div>
                            <div className="fake-new-collection-text"></div>
                        </div>
                        <div className="fake-new-running-line">
                            <div className="fake-running-line-text"></div>
                            <div className="fake-running-line-text"></div>
                            <div className="fake-running-line-text"></div>
                            <div className="fake-running-line-text"></div>
                            <div className="fake-running-line-text"></div>
                            <div className="fake-running-line-text"></div>
                        </div>
                    </div>
                    <div>
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1" style={{borderBottom: 'none'}}>
                                <AccordionTrigger className="text-lg editing-block-header">Новая
                                    коллекция</AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex flex-col">
                                        {videoSrc ?
                                            <div>
                                                <video
                                                    key={newCollection?.videoUrl}
                                                    className="home-video-preview"
                                                    controls
                                                    muted
                                                    loop
                                                >
                                                    <source src={newCollection?.videoUrl} type="video/mp4"/>
                                                    Your browser does not support the video tag.
                                                </video>
                                            </div>
                                            : <div className="none-home-video-preview">Видеобаннеров нет</div>}

                                        <div className="flex flex-col justify-center space-y-2">
                                            <Form {...form}>
                                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                                    <div>
                                                        <div className="new-collection-edit-container">
                                                            <div className="new-collection-switch-block">
                                                                <p>Показывать на главном экране</p>
                                                                <FormField
                                                                    control={form.control}
                                                                    name="active"
                                                                    render={({field}) => (
                                                                        <FormItem>
                                                                            <FormControl
                                                                                className="w-full flex items-center justify-between content-center">
                                                                                <div>
                                                                                    <Switch
                                                                                        disabled={isPending}
                                                                                        checked={field.value}
                                                                                        onCheckedChange={field.onChange}
                                                                                    />
                                                                                </div>
                                                                            </FormControl>
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className="new-collection-input-block">
                                                                <FormField
                                                                    control={form.control}
                                                                    name="title"
                                                                    render={({field}) => (
                                                                        <FormItem>
                                                                            <FormLabel style={{fontWeight: '600'}}>Название
                                                                                новой коллекции</FormLabel>
                                                                            <FormControl style={{
                                                                                height: '47px',
                                                                                boxShadow: 'none'
                                                                            }}>
                                                                                <Input
                                                                                    style={{padding: '15px 10px'}}
                                                                                    className="new-collection-input"
                                                                                    disabled={isPending}
                                                                                    {...field}
                                                                                    placeholder="Введите название"
                                                                                />
                                                                            </FormControl>
                                                                            <FormMessage/>
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="home-video-btn-block" style={{margin: '0'}}>
                                                            <CldUploadButton
                                                                className={'home-video-btn'}
                                                                uploadPreset="pnfbfwpd"
                                                                onUpload={(result: any) => {
                                                                    setNewCollection((prevCollection) => ({
                                                                        ...prevCollection,
                                                                        videoUrl: result.info.secure_url
                                                                    }));

                                                                }}>
                                                                Изменить видео для новой коллекции
                                                            </CldUploadButton>
                                                            <Button
                                                                disabled={isPending}
                                                                type="submit"
                                                                className={'home-video-btn'}
                                                                onClick={() => onSubmit}
                                                            >
                                                                Сохранить
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </Form>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
                <div className="fake-home-top-products">
                    <div className="fake-home-top-products-title">
                        <div className="fake-home-top-products-title-text"></div>
                        <div className="fake-home-top-products-title-text"></div>
                    </div>
                    <div className="fake-home-top-products-body">
                        <div className="fake-home-top-products-body-item">
                            <div className="top-products-body-image"></div>
                            <div className="top-products-body-title"></div>
                            <div className="top-products-body-text"></div>
                        </div>
                        <div className="fake-home-top-products-body-item">
                            <div className="top-products-body-image"></div>
                            <div className="top-products-body-title"></div>
                            <div className="top-products-body-text"></div>
                        </div>
                        <div className="fake-home-top-products-body-item">
                            <div className="top-products-body-image"></div>
                            <div className="top-products-body-title"></div>
                            <div className="top-products-body-text"></div>
                        </div>
                        <div className="fake-home-top-products-body-item">
                            <div className="top-products-body-image"></div>
                            <div className="top-products-body-title"></div>
                            <div className="top-products-body-text"></div>
                        </div>
                    </div>
                    <div className="fake-home-top-products-footer">
                        <div className="fake-text-info-text"></div>
                    </div>
                </div>
                <div className="fake-home-video-preview">
                    <div className="fake-new-slider-container">
                        <div className="fake-new-slider-block">
                            <div className="fake-new-slider-form"></div>
                            <div className="fake-new-slider-form"></div>
                            <div className="fake-new-slider-form"></div>
                            <div className="fake-new-slider-form"></div>
                            <div className="fake-new-slider-form"></div>
                        </div>
                        <div className="fake-new-slider-block">
                            <div className="fake-new-slider"></div>
                        </div>
                    </div>
                    <div>
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1" style={{borderBottom: 'none'}}>
                                <AccordionTrigger className="text-lg editing-block-header">Слайдер
                                    фотографий</AccordionTrigger>
                                <AccordionContent>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 slider-images-block slider-images-item-block">
                                        {images.map((image, index) => (
                                            <div key={image._id}
                                                 className={`relative p-1 rounded-xl ${image.active ? 'border-2 border-solid border-green-500' : ''} cursor-pointer`}>
                                                <img
                                                    className="h-72 object-cover z-4 rounded-xl transition-opacity duration-500 ease-in-out current"
                                                    src={image.url}
                                                    alt={`Slide ${index}`}
                                                    onClick={() => updateActiveImages(image._id)}
                                                />
                                                <div className="absolute rounded top-3 right-3">
                                                    <ActionToolTip label="Удалить">
                                                        <div
                                                            onClick={(e) => onActionDelete(e, "deleteMainPagePhoto", image)}
                                                            className="bg-white p-1 rounded delete-home-btn">
                                                            <Image src={deleteIco} alt={'x'}></Image>
                                                        </div>
                                                    </ActionToolTip>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="home-slider-btn-block" style={{margin: '0'}}>
                                        <CldUploadButton
                                            className={'home-slider-btn'}
                                            uploadPreset="pnfbfwpd"
                                            onUpload={(result: any) => {
                                                setMainPhotoPublicUrl(result.info.secure_url)
                                            }}>
                                            Добавить новое фото
                                        </CldUploadButton>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
                <div className="fake-home-footer">
                    <div className="fake-home-footer-info">
                        <div className="fake-home-footer-info-nav">
                            <div className="fake-home-footer-info-nav-block">
                                <div className="fake-home-footer-nav"></div>
                                <div className="fake-home-footer-nav"></div>
                                <div className="fake-home-footer-nav"></div>
                            </div>
                            <div className="fake-home-footer-info-nav-block">
                                <div className="fake-home-footer-nav"></div>
                                <div className="fake-home-footer-nav"></div>
                                <div className="fake-home-footer-nav"></div>
                            </div>
                            <div className="fake-home-footer-info-nav-block">
                                <div className="fake-home-footer-nav"></div>
                                <div className="fake-home-footer-nav"></div>
                            </div>
                        </div>
                        <div className="fake-home-links-logo">
                            <Image src={fakeLogo} alt={'Logo'}></Image>
                            <div className="fake-home-links"></div>
                        </div>
                    </div>
                    <div>
                        <div className="fake-home-footer-info">
                            <div className="fake-home-footer-btn"></div>
                            <div className="fake-home-footer-btn"></div>
                        </div>

                    </div>
                    <div className="fake-home-footer-policy"></div>
                </div>
            </div>
        </div>
    );
};

export default Page;