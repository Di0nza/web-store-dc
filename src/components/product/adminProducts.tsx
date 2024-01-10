"use client"
import React, {useEffect, useState} from 'react';
import {ModalType, useModal} from "@/hooks/useModalStore";
import {Button} from "@/components/ui/button";
import {getAllProductsAdmin} from "@/services/getData";
import {Trash} from "lucide-react";
import {ActionToolTip} from "@/components/ActionToolTip";
import deleteProduct from '../../img/delete.png'
import '../componentsStyles.css'
import Image from "next/image";
import {fromDate} from "next-auth/core/lib/utils";


type AdminProductsProps = {
    products: any[];
}
export const AdminProducts = ({search}) => {

    const [products, setProducts] = useState<any[]>([]);
    const [updated, setUpdated] = useState("")

    const {onOpen, data} = useModal();

    useEffect(() => {
        getAllProductsAdmin().then((data) => setProducts(data.data.products));
    }, [data]); // Update products when `updated` state changes

    const handleProductUpdate = () => {
        setUpdated(Date.now().toString());
    };


    const onActionCreate = (e: React.MouseEvent, action: ModalType) => {
        e.stopPropagation();
        onOpen(action, {});
    }

    const onActionEdit = (e: React.MouseEvent, action: ModalType, product) => {
        e.stopPropagation();
        onOpen(action, {product});
    }
    const onActionDelete = (e: React.MouseEvent, action: ModalType, product) => {
        e.stopPropagation();
        onOpen(action, {product});
    }

    useEffect(()=>{
        setProducts(search)
    },[search])

    return (
        <>
            <div>
                <Button className="addItemBtn" variant="ghost" onClick={(e) => onActionCreate(e, "createProduct")}>
                    Добавить Товар
                </Button>
            </div>
            <div className='admin-products-block'>
                {products.map((product: any) => (
                    <div key={product._id}
                         className='admin-product-item'
                         onClick={() => onOpen("editProduct", {product})}
                         style={{cursor:"pointer"}}
                    >
                        <div className='product-overlay'>
                            <div className="deleteBtnBlock" onClick={(e) => onActionDelete(e, "deleteProduct", product)}>
                            <ActionToolTip label="Удалить">
                                    <Image
                                        src={deleteProduct} alt={'x'}></Image>
                            </ActionToolTip>
                            </div>
                        </div>
                        <div className='product-info'>
                            <img className='admin-product-img' src={product.pictures[0]} alt={product.title}></img>
                            <p className='product-title'>{product.title}</p>
                            <p className='product-category'>{product.category}</p>
                        </div>
                        <p className='product-price'>${product.price}.00</p>
                    </div>
                ))}
            </div>
        </>
    );
};
