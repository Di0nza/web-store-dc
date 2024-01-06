"use client"
import React, {useEffect, useState} from 'react';
import {useModal} from "@/hooks/useModalStore";
import {getAllVideos, patchVideo} from "@/services/uploadVideo";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {X} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";

export const EditMainPageVideoModal = () => {

    const {isOpen, onClose, type, data} = useModal();
    const [videos, setVideos] = useState([])

    const isModalOpen = isOpen && type === "editMainPageVideo";


    useEffect(() => {
        getAllVideos().then((data) => setVideos(data.data.videos))
    }, [isOpen])

    const handleClose = (id) => {
        patchVideo(id).then(r => onClose());
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden"
                           style={{fontFamily: "Century Gothic", backgroundColor: '#fafafa', maxWidth: '800px'}}>
                <DialogHeader className="pt-8 px6 ml-6">
                    <DialogTitle className="text-2xl text-left font-bold">
                        Все видеобаннеры
                    </DialogTitle>
                    <DialogDescription className="text-left text-zinc-500">
                        Выберите видеобаннер, который будет отображаться на главной странице.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6 flex flex-wrap w-full" style={{maxHeight: '70vh', overflowY: 'auto'}}>
                    {videos.map((video) => (
                        <div key={video._id} className={`w-full mb-4`}>
                            <video
                                className={`w-full p-0.5 rounded ${video.active ? 'border-4 border-solid border-green-500' : ''} cursor-pointer`}
                                controls={false}
                                muted
                                loop
                                autoPlay
                                onClick={() => handleClose(video._id)}
                            >
                                <source src={video.url} type="video/mp4"/>
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};
