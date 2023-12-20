"use client"


import {useState, useEffect} from "react";

import {CreateProductModal} from "@/components/modals/CreateProductModal";

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
            <CreateProductModal/>

        </>
    )
}