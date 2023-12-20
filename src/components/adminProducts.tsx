"use client"
import React from 'react';
import {ModalType, useModal} from "@/hooks/useModalStore";
import {Button} from "@/components/ui/button";

export const AdminProducts = () => {

    const { onOpen } = useModal();
    const onAction = (e: React.MouseEvent, action: ModalType) => {
        e.stopPropagation();
        onOpen(action, {});
    }

    return (
        <div>
            <Button className="bg-emerald-500" variant="ghost" onClick={(e) => onAction(e, "createProduct")}>
                Добавить продукт
            </Button>
        </div>
    );
};
