"use client"
import React, {useState} from 'react';

const Page = () => {

    const [createProductModalIsOpen, setCreateProductModalIsOpen] = useState(false)

    const createProduct = ( ) => {

    }

    return (
        <div>
            <button onClick={()=> setCreateProductModalIsOpen(true)}>
                Добавить продукт
            </button>

        </div>
    );
};

export default Page;