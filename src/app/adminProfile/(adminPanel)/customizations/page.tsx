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
import axios from "axios";

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
        getVideo().then((data) => setVideoSrc(data.data.video.url));
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
                                <div className="flex flex-row">
                                    {videoSrc ?
                                        <div>
                                            <video
                                                key={newCollection?.videoUrl}
                                                className="h-60 w-120 rounded mt-3"
                                                controls
                                                muted
                                                loop
                                            >
                                                <source src={newCollection?.videoUrl} type="video/mp4"/>
                                                Your browser does not support the video tag.
                                            </video>
                                            <CldUploadButton
                                                className="mt-5 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                                                uploadPreset="qiladgcy"
                                                onUpload={(result: UploadResult) => {
                                                    setNewCollection((prevCollection) => ({
                                                        ...prevCollection,
                                                        videoUrl: result.info.secure_url
                                                    }));

                                                }}>
                                                Изменить видео для новой коллекции
                                            </CldUploadButton>
                                        </div>
                                        : <div className="h-60 w-120 mt-3"></div>}

                                    <div className="flex flex-col justify-center ml-10 space-y-2">

                                        <Form {...form}>
                                            <form
                                                onSubmit={form.handleSubmit(onSubmit)}
                                                className="space-y-6"
                                            >
                                                <>
                                                    <FormField
                                                        control={form.control}
                                                        name="title"
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <FormLabel>Название новой коллекции</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        disabled={isPending}
                                                                        {...field}
                                                                        placeholder="Введите название"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="active"
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <div className="flex items-center space-x-2">
                                                                        <Label htmlFor="airplane-mode">Показывать на
                                                                            главном экране</Label>
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

                                                    <Button
                                                        disabled={isPending}
                                                        type="submit"
                                                        className="w-full"
                                                        onClick={()=>onSubmit}
                                                    >
                                                        Сохранить
                                                    </Button>
                                                </>
                                            </form>

                                        </Form>



                                    </div>
                                </div>
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