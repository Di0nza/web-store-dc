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

export const DeleteMainPageVideoModal = () => {
    const { isOpen, onClose, type, data, onOpen } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "deleteMainPageVideo";
    const { video } = data;

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            await axios.delete(`/api/admin/customizations/mainPageVideo/${video?._id}`);

            onClose();
            onOpen("editMainPageVideo");
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleClose = () => {
        onClose();
        onOpen("editMainPageVideo");
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden deleteModalBlock" style={{fontFamily: "Century Gothic", backgroundColor:'#fafafa', maxWidth:'450px'}}>
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-left font-bold">
                        Удаление видеобаннера
                    </DialogTitle>
                    <DialogDescription className="text-left text-zinc-500">
                        Вы уверены, что хотите удалить этот баннер ? <br />
                        Он будет удален безвозвратно.
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
