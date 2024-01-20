"use client"
import React, {useEffect, useState} from 'react';
import {ModalType, useModal} from "@/hooks/useModalStore";
import {getAllVideos, patchVideo} from "@/services/MainPageVideoFunctions";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Trash, X} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {ActionToolTip} from "@/components/ActionToolTip";
import deleteIco from '@/img/delete.png';
import '../componentsStyles.css'
import Image from "next/image";
import {currentUser} from "@/lib/auth";
import {useCurrentUser} from "@/hooks/useCurrentUser";

export const EditMainPageVideoModal = () => {

    const {isOpen, onClose, type, data, onOpen} = useModal();
    const [videos, setVideos] = useState([])

    const isModalOpen = isOpen && type === "editMainPageVideo";
    const user = useCurrentUser();


    useEffect(() => {
        if (user?.isAdmin) {
            getAllVideos().then((data) => setVideos(data?.data?.videos))
        }
    }, [isOpen])


    const updateActiveBanner = (id) => {
        patchVideo(id).then(r => onClose());
    }

    const onActionDelete = (e: React.MouseEvent, action: ModalType, video) => {
        onClose();
        e.stopPropagation();
        onOpen(action, {video});
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden"
                           style={{fontFamily: "Century Gothic", backgroundColor: '#fafafa', maxWidth: '700px'}}>
                <DialogHeader className="pt-6 px4 ml-6">
                    <DialogTitle className="text-2xl text-left font-bold">
                        Все видеобаннеры
                    </DialogTitle>
                    <DialogDescription className="text-left text-zinc-500">
                        Выберите видеобаннер, который будет отображаться на главной странице.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6 flex flex-wrap w-full" style={{maxHeight: '70vh', overflowY: 'auto'}}>
                    {videos?.map((video) => (
                        <div key={video._id} className={`relative w-full mb-4`}>
                            <video
                                className={`w-full p-2 rounded-3xl ${video.active ? 'border-2 border-solid border-green-500' : 'p-3.5'} cursor-pointer `}
                                controls={false}
                                muted
                                loop
                                autoPlay
                                onClick={() => updateActiveBanner(video._id)}
                            >
                                <source src={video.url} type="video/mp4"/>
                                Your browser does not support the video tag.
                            </video>
                            <div className="absolute rounded top-5 right-5">
                                <ActionToolTip label="Удалить">
                                    <div onClick={(e) => onActionDelete(e, "deleteMainPageVideo", video)} className="bg-white p-1 rounded delete-home-btn">
                                        <Image src={deleteIco} alt={'x'}></Image>
                                    </div>
                                </ActionToolTip>
                            </div>

                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};
