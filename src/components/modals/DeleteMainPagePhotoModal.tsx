"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import { Button } from "@/components/ui/button";
import '../componentsStyles.css'
import {deletePhoto} from "@/services/MainPagePhotoFunctions";

export const DeleteMainPagePhotoModal = () => {
    const { isOpen, onClose, type, data, onOpen } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "deleteMainPagePhoto";
    const { photo } = data;

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            deletePhoto(photo._id);
            onClose();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleClose = () => {
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
ащ            <DialogContent className="bg-white text-black p-0 overflow-hidden deleteModalBlock" style={{fontFamily: "Raleway", backgroundColor:'#fafafa', maxWidth:'450px'}}>
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-left font-bold">
                        Удаление фотографии с главного экрана
                    </DialogTitle>
                    <DialogDescription className="text-left text-zinc-500">
                        Вы уверены, что хотите удалить эту фотографию ? <br />
                        Она будет удалена безвозвратно.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            className="p-0"
                            disabled={isLoading}
                            onClick={handleClose}
                            variant="ghost"
                        >
                            Отмена
                        </Button>
                        <Button
                            className="bg-black hover:bg-red-600"
                            disabled={isLoading}
                            onClick={onClick}
                        >
                            Удалить
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
