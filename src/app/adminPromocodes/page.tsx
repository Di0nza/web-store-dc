"use client";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import deleteItem from "@/img/delete.png";
import './adminPromocodes.css'
import Image from "next/image";


export default function adminPromocodes() {
    const router = useRouter();
    const [promoList, setPromoList] = useState(null);
    const [promoCode, setPromoCode] = useState({
        title: '',
        value: '',
        isValid: true
    });
    const addPromoCode = async () => {
        try {
            const promoCodeData = {
                title: promoCode.title,
                value: promoCode.value,
                isValid: promoCode.isValid
            };
            const response = await axios.post("/api/admin/promoCode", promoCodeData);
            console.log(response.data.promo._id);
            window.location.reload();
        } catch (error:any) {
            console.log(error.message);
        }
    };

    const getPromoCodes = async () => {
        try {
            const res = await axios.get(`/api/admin/promoCode`);
            setPromoList(res.data.promo);
        } catch (error: any) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        getPromoCodes();
    }, []);

    const handleTitleChange = (event) => {
        setPromoCode({ ...promoCode, title: event.target.value });
    };

    const handleValueChange = (event) => {
        setPromoCode({ ...promoCode, value: event.target.value });
    };

    const deletePromoCode = async (promoCodeId) => {
        try {
            const response = await axios.delete(`/api/admin/promoCode`, {
                data: { promoCodeId }
            });
            console.log(response.data.message);
            getPromoCodes();
            window.location.reload();
        } catch (error) {
            console.error(error.message);
        }
    };

    const toggleValidity = async (promoCodeId, isValid) => {
        try {
            const response = await axios.put('/api/admin/promoCode', {
                promoCodeId,
                isValid: !isValid
            });
            if (response.data.promo) {
                const updatedPromoList = promoList.map((promo) => {
                    if (promo._id === promoCodeId) {
                        return response.data.promo;
                    }
                    return promo;
                });
                setPromoList(updatedPromoList);
                getPromoCodes();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='profileBlock'>
            <h2>{"Добавление промокодов"}</h2>
            <p className='changeBlockText'>Добавление и изменение</p>
            <div className='updateProfileBlock'>
                <label className='updateProfileBlockLabel'>Название</label>
                <input placeholder={'SAVE20NOW'} type="text" value={promoCode.title} onChange={handleTitleChange} />
                <label className='updateProfileBlockLabel'>Значение скидки</label>
                <input  placeholder={'20'} type="text" value={promoCode.value} onChange={handleValueChange} />
                <button onClick={addPromoCode}>Добавить</button>
            </div>
            <h4>{"Доступные промокоды"}</h4>
            {promoList && (
                <div className='promocodesProfileBlock'>
                    {promoList?.map((item, index) => (
                        <div className={'promocodes-item-info'}>
                            <div className={'promocodes-item-info-block'}>
                                <label className={'toggleSwitch'}>
                                    <input
                                        type="checkbox"
                                        checked={item.isValid}
                                        onChange={() => toggleValidity(item._id, item.isValid)}
                                    />
                                    <span className={'switch'} />
                                </label>
                                <h5 className={`mini-cart-item-title ${item.isValid ? '' : 'transparent-text'}`}>{item.title}</h5>
                            </div>
                            <div className={'promocodes-item-info-block'}>
                                <h5 className={`mini-cart-item-title ${item.isValid ? '' : 'transparent-text'}`}>Скидка: {item.value}%</h5>
                                <Image onClick={() => deletePromoCode(item._id)} className={'promocodes-item-delete-img'} src={deleteItem} alt={'x'}></Image>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
