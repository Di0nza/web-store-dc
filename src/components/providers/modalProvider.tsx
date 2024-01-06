"use client"


import {useState, useEffect} from "react";

import {CreateProductModal} from "@/components/modals/CreateProductModal";
import {EditProductModal} from "@/components/modals/EditProductModal";
import {DeleteProductModal} from "@/components/modals/DeleteProductModal";
import {EditMainPageVideoModal} from "@/components/modals/EditMainPageVideoModal";

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
        </>
    )
}