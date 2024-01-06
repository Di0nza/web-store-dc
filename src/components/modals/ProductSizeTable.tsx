"use client";
import React,{useState} from 'react';
import Image from "next/image";
//import tableInfo from '../../img/sizesinfo.png'
import '../componentsStyles.css'


const ProductSizeTable = ({ onClose }) => {
    return (
        <div className='size-table-modal'>
            <div className='size-table-modal-content'>
                <div className='modal-content-header'>
                    <h2>Таблица размеров</h2>
                    <span className='close' onClick={onClose}>&times;</span>
                </div>
                <p>Чтобы правильно измерить талию, грудь и плечи, используйте гибкую сантиметровую
                    ленту. Вот как это сделать:</p>
                <div className='modal-content-info'>
                    {/*<Image src={tableInfo} alt={'tableInfo'}></Image>*/}
                    <div>
                        <p><b>1. Талия:</b> Измерьте самую узкую часть тела, обычно это на уровне пупка.</p>
                        <p><b>2. Грудь:</b> Обхватите лентой самую широкую часть груди, под подмышками, обеспечивая
                            небольшой запас.</p>
                        <p><b>3. Плечи:</b> Измерьте от начала одного плеча до начала другого через верхнюю часть спины.
                        </p>
                        <br/>
                        <p>Пожалуйста, обратите внимание, что представленные здесь значения могут немного отличаться в
                            зависимости от конкретного стиля одежды.
                            Размеры варьируются в пределах диапазона, чтобы учесть различия в моделях и фасонах</p>
                    </div>
                </div>

                <div className="size-chart">
                    <div className="size-column">
                        <div className="size-item">
                            <p>Размер</p>
                            <p>XS</p>
                            <p>S</p>
                            <p>M</p>
                            <p>L</p>
                            <p>XL</p>
                            <p>XXL</p>
                        </div>
                    </div>
                    <div className="size-column">
                        <div className="size-item">
                            <p>Талия (см)</p>
                            <p>60-65</p>
                            <p>65-70</p>
                            <p>70-75</p>
                            <p>75-80</p>
                            <p>80-85</p>
                            <p>85-90</p>
                        </div>
                    </div>
                    <div className="size-column">
                        <div className="size-item">
                            <p>Грудь (см)</p>
                            <p>78-83</p>
                            <p>83-88</p>
                            <p>88-93</p>
                            <p>93-98</p>
                            <p>98-103</p>
                            <p>103-108</p>
                        </div>
                    </div>
                    <div className="size-column">
                        <div className="size-item">
                            <p>Плечи (см)</p>
                            <p>35-36</p>
                            <p>36-38</p>
                            <p>38-40</p>
                            <p>40-42</p>
                            <p>42-44</p>
                            <p>44-46</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductSizeTable;