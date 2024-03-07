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

export const DeleteArticleModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "deleteArticle";
    const { article } = data;

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            await axios.delete(`/api/admin/article/${article?._id}`);

            onClose();

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden deleteModalBlock" >
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-left font-bold">
                        Удаление статьи
                    </DialogTitle>
                    <DialogDescription className="text-left text-zinc-500">
                        Вы уверены, что хотите удалить эту статью ? <br />
                        Статья <span className="text-black font-semibold">"{article?.title}"</span> будет удалена безвозвратно.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            className="p-0"
                            disabled={isLoading}
                            onClick={onClose}
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
