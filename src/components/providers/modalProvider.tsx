"use client"


import {useState, useEffect} from "react";

import {CreateProductModal} from "@/components/modals/CreateProductModal";
import {EditProductModal} from "@/components/modals/EditProductModal";
import {DeleteProductModal} from "@/components/modals/DeleteProductModal";
import {EditMainPageVideoModal} from "@/components/modals/EditMainPageVideoModal";
import {DeleteMainPageVideoModal} from "@/components/modals/DeleteMainPageVideoModal";
import {DeleteMainPagePhotoModal} from "@/components/modals/DeleteMainPagePhotoModal";
import {ChangePasswordModal} from "@/components/modals/ChangePasswordModal";

export const ModalProvider = () => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(()=>{
        setIsMounted(true);
    },[]);

    if(!isMounted){
        return null;
    }

    return (
        <>
            <CreateProductModal />
            <EditProductModal/>
            <DeleteProductModal/>
            <EditMainPageVideoModal/>
            <DeleteMainPageVideoModal/>
            <DeleteMainPagePhotoModal/>
            <ChangePasswordModal/>
        </>
    )
}