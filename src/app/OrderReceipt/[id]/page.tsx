'use client'
import './placingOrder.css'
import Link from "next/link";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import Image from "next/image";
import checkOrderStatusW from "@/img/checkOrderStatusW.png";
import checkOrderStatusB from "@/img/checkOrderStatusB.png";
import pdfLogo from "@/img/pdfLogo.png";
import qrlogo from "@/img/qrlogo.webp"
import shearLogo from "@/img/shearlogo.png";
import {jsPDF} from 'jspdf';
import {useCurrentUser} from "@/hooks/useCurrentUser";
import 'jspdf-autotable';
import {amiriFont} from "@/fonts/amiriFont";
import {FormError} from "@/components/auth/FormError";
import {
    Drawer, DrawerClose,
    DrawerContent,
    DrawerDescription, DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";

import QRCode from "qrcode";


interface orderData {
    name: string;
    email: string;
    telephone: string;
}
type Props = {
    params: {
        id: any;
    }
};
interface CartItem {
    title: string;
    size: string;
    price: number;
    image: string;
    category: string;
}
export default function PlacingOrder({params: {id}}: Props): JSX.Element {
    const formattedDateRef = useRef(null);
    const [formattedDateTime, setFormattedDateTime] = useState('');
    const [orderData, setOrderData] = useState(null);
    const [copied, setCopied] = useState(false);
    const [orderTotal, setOrderTotal] = useState(0);
    const [vat, setVat] = useState(0);
    const [orderTotalWithoutVat, setOrderTotalWithoutVat] = useState(0);
    const [discountedTotal, setDiscountedTotal] = useState(0);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const user = useCurrentUser();
    const [error, setError] = useState();
    const [qrCodeSrc, setQrCodeSrc] = useState<string>("");

    const [open, setOpen] = React.useState(false)
    const isDesktop =   window.innerWidth >= 768

    const generateQrCode = (data) => {
        let opts = {
            errorCorrectionLevel: 'H',
            type: 'image/jpeg',
            quality: 1,
            margin: 1,
            color: {
                dark:"#000000",
                light:"#ffffff"
            },
            width: 248,
            height: 248
        }
        QRCode.toDataURL(data._id.toString(), opts).then(setQrCodeSrc);
    }


    const handleDeliverySelection = (method) => {
        setSelectedDelivery(method);
    };
    const getUserDetails = async () => {
        try {
            const res = await axios.get(`/api/users/order/${id}`).then((data)=> {
                console.log(data)
                if(data.data.error){
                    setError(data.data.error)
                }
                setOrderData(data.data.order);
                generateQrCode(data.data.order)
            });

        } catch (error: any) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        getUserDetails();

    }, []);

    const createdAt = orderData?.createdAt;
    const monthsInRussian = [
        'Янв.', 'Фев.', 'Мар.', 'Апр.', 'Мая', 'Июн.',
        'Июл.', 'Авг.', 'Сен.', 'Окт.', 'Ноя.', 'Дек.'
    ];
    const formatTimestampToDate = (timestamp) => {
        if (!timestamp) return '';

        const formattedDate = new Date(parseInt(timestamp));
        const monthIndex = formattedDate.getMonth();
        const day = formattedDate.getDate();
        const year = formattedDate.getFullYear();
        const monthInRussian = monthsInRussian[monthIndex];
        const hours = formattedDate.getHours().toString().padStart(2, '0');
        const minutes = formattedDate.getMinutes().toString().padStart(2, '0');

        return `${day} ${monthInRussian} ${year} ${hours}:${minutes}`;
    };

    useEffect(() => {
        if (createdAt) {
            const formattedDate = new Date(createdAt);
            const monthIndex = formattedDate.getMonth();
            const monthInRussian = monthsInRussian[monthIndex];
            const hours = formattedDate.getHours();
            const minutes = formattedDate.getMinutes();

            const formattedDateTimeString = `${formattedDate.getDate()} ${monthInRussian} ${formattedDate.getFullYear()} ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
            setFormattedDateTime(formattedDateTimeString);
        }
    }, [createdAt]);

    const statuses = orderData?.orderStatus || [];

    const getStatusColor = (index, selected) => {
        if (selected) {
            return "#111111";
        } else {
            return "#d3d3d3";
        }
    };

    const getStatusWeight = (index, selected) => {
        if (selected) {
            return "600";
        } else {
            return "300";
        }
    };
    const copyLinkToClipboard = () => {
        navigator.clipboard.writeText(orderData?.trackingCode)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => console.error('Could not copy text: ', err));
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.addFileToVFS("Amiri-Regular.ttf", amiriFont);
        doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
        doc.setFont("Amiri");

        const pdfTitle = `Заказ #${orderData?._id.toString()}`;
        const pdfContent = 'Спасибо за ваш заказ!';
        const pdfContent3 =
            `Сумма заказа: ${orderData?.totalCost.toFixed(2)}$ - (${orderData?.promotionalCode ? orderData?.promotionalCode : 0}%) (${orderData?.paymentState})`;
        const pdfContent5 = 'Дата оформления: ' + formattedDateTime;
        const pdfContent6 = 'Способ доставки: ' + orderData?.deliveryMethod;
        const data = [
            `Имя: ${orderData.name}`,
            `Email: ${orderData.email}`,
            `Телефон: ${orderData.telephone}`,
            `Пункт назвачения: ${orderData?.country}, ${orderData?.city},ул. ${orderData?.street},(д.${orderData?.house},кв.${orderData?.apartment}),${orderData?.zip}`,
        ];
        const pdfContentBlock1 = `Сумма заказа: ${orderTotal.toFixed(2)}$`;
        const pdfContentBlock2 = `НДС (+23%): ${orderTotalWithoutVat.toFixed(2)} + ${vat.toFixed(2)}$`;
        const pdfContentBlock3 = `Просокод (-${orderData?.promotionalCode}%): ${discountedTotal}$`;
        const pdfContentBlock4 = `Итого: ${orderData?.totalCost.toFixed(2)}$`;

        doc.setFontSize(18);
        doc.text(pdfTitle, 10, 20);
        doc.setFontSize(12);
        doc.text(pdfContent, 10, 40);
        doc.text(pdfContent3, 10, 50);
        doc.text(pdfContent6, 10, 60);
        let verticalPosition = 80;
        data.forEach((line) => {
            doc.setFontSize(12);
            doc.text(line, 10, verticalPosition);
            verticalPosition += 10;
        });
        doc.text(pdfContentBlock1, 10, 130);
        doc.text(pdfContentBlock2, 10, 140);
        doc.text(pdfContentBlock3, 10, 150);
        doc.text(pdfContentBlock4, 10, 160);
        doc.text('MariDeniz', 170, 280);
        doc.text(pdfContent5, 10, 280);
        doc.save(`order${orderData?._id.toString().substring(7)}.pdf`);
    };

    useEffect(() => {
        if (orderData && orderData.products && orderData.products.length > 0) {
            const calculatedOrderTotal = calculateOrderTotal(orderData.products);
            const calculatedVat = 0.23 * calculatedOrderTotal;
            const calculatedOrderTotalWithoutVat = calculatedOrderTotal - calculatedVat;

            setOrderTotal(calculatedOrderTotal);
            setVat(calculatedVat);
            setOrderTotalWithoutVat(calculatedOrderTotalWithoutVat);
        }
    }, [orderData]);

    useEffect(() => {
        if (orderTotal && orderData && orderData.promotionalCode) {
            const discountPercentage = Number(orderData.promotionalCode);
            const discountedAmount = (orderTotal * (discountPercentage / 100)).toFixed(2);
            // @ts-ignore
            setDiscountedTotal(discountedAmount);
        }
    }, [orderTotal, orderData]);

    function calculateOrderTotal(products) {
        if (!products || products.length === 0) {
            return 0;
        }
        return products.reduce((total, item) => total + Number(item.price), 0);
    }

    if (error){
        return (<FormError message={error}/>);
    }
    return (<div className='bigPlacingOrderBlock'>
        <div className='placingOrderBlockRow'>
            <div>
                <h2>{"Спасибо за ваш заказ!"}</h2>
                <h4 className='placingOrderBlockTitle'><b>{orderData?.totalNumber}</b> товаров на
                    сумму <b>${orderData?.totalCost.toFixed(2)}</b> ({orderData?.paymentState})</h4>
            </div>
        </div>
        <div>
            <div className='placingOrderBlockRow'>
                <div className={'firstInfoContainer'}>
                    <div className='firstInfoBlock'>
                        <h3>Информация о доставке</h3>
                        <p><b>Способ доставки:</b> {orderData?.deliveryMethod}</p>
                        <p><b>Адрес:</b> {orderData?.country}, {orderData?.city},
                            ул. {orderData?.street},(д.{orderData?.house},
                            кв.{orderData?.apartment}), {orderData?.zip}</p>
                        <p><b>Дата создания:</b> {formattedDateTime}</p>
                        <p><b>Дополнительная информация:</b> {orderData?.additionalInformation}</p>
                        <p><b>Код для получения товара:</b> {orderData?._id.toString()}</p>
                    </div>
                    <div className='firstInfoBlock firstInfoContactBlock'>
                        <h3>Контактные данные</h3>
                        <p><b>Имя:</b> {orderData?.name}</p>
                        <p><b>Email:</b> {orderData?.email}</p>
                        <p><b>Телефон:</b> {orderData?.telephone}</p>
                    </div>
                    <div className='products-value-cont'>
                        <div className='products-value-block'>
                            {orderData?.products.map((item, index) => (
                                <div className={'check-cart-item'} key={index}>
                                    <img
                                        className={'mini-cart-item-img'}
                                        key={index}
                                        src={item.image}
                                        alt={`Thumbnail ${index}`}
                                    />
                                    <div className={'mini-cart-item-info'}>
                                        <div className={'mini-cart-item-info-head'}>
                                            <div>
                                                <h5 className={'mini-cart-item-title'}>{item.title}</h5>
                                                <p key={index}>{item.size}</p>
                                            </div>
                                        </div>
                                        <div className={'mini-cart-footer'}>
                                            <h5>
                                                ${item.price}.00
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={'firstInfoContainer'}>
                    <div className='placingOrderInfoBlock'>
                        <h3>Статус заказа:</h3>
                        <div className={'orderStatusBlock'}>
                            <div className="orderStatusLine">
                                {statuses.map((status, index) => (
                                    <div key={index}
                                         style={{backgroundColor: getStatusColor(index, status.selected)}}>
                                        {status.selected ? (
                                            <Image className="statusLineCheckImg" src={checkOrderStatusB}
                                                   alt="Selected"/>) : (
                                            <Image className="statusLineCheckImg" src={checkOrderStatusW}
                                                   alt="Selected"/>)}
                                    </div>
                                ))}
                            </div>
                            <div className={'orderStatusTitleBlock'}>
                                {statuses.map((status, index) => (
                                    <div className={'orderStatusItem'} key={index}
                                         style={{color: getStatusColor(index, status.selected)}}>
                                        <p style={{fontWeight: getStatusWeight(index, status.selected)}}
                                           className={'orderStatusTitle'}>{status.title}</p>
                                        {status.createdDate !== '' ? (
                                            <p className={'orderStatusTime'}>{formatTimestampToDate(status.createdDate)}</p>) : (
                                            <p className={'orderStatusTime'}>Пока неизвестно</p>)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {orderData?.trackingCode && (
                        <div className='trackingInfoBlock'>
                            <h3>Трекинг заказа</h3>
                            <p><b>Сайт отслеживания:</b> {orderData?.trackingLink}</p>
                            <b>Трекер-код</b>
                            <div className={'firstInfoUrl'}>
                                <input
                                    className={'firstInfoUrlInput'}
                                    style={{border: 'none', marginBottom: '0', height: '38px'}}
                                    value={copied ? 'Скопировано!' : orderData?.trackingCode}>
                                </input>
                                <div className={'inputCurrentBtn'}>
                                    <Image className={'inputCurrentBtnImg'} src={shearLogo}
                                           onClick={copyLinkToClipboard} alt={'+'}/>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className='OrderTotalCost'>
                        <div className={'OrderTotalCostBlockHead'}>
                            <div className={'OrderTotalBlockTitles'}>
                                <b>Сумма заказа:</b>
                            </div>
                            <div className={'OrderTotalBlockValues'}>
                                <p>${orderTotal.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className={'OrderTotalCostBlock'}>
                            <div className={'OrderTotalBlockTitles'}>
                                <b>НДС (+23%):</b>
                                <b>Просокод (-{orderData?.promotionalCode}%):</b>
                            </div>
                            <div className={'OrderTotalBlockValues'}>
                                <p>${orderTotalWithoutVat.toFixed(2)} + ${vat.toFixed(2)}</p>
                                <p>${discountedTotal}</p>
                            </div>
                        </div>
                        <div className={'OrderTotalCostBlockBottom'}>
                            <div className={'OrderTotalBlockTitles'}>
                                <b>Итого:</b>
                            </div>
                            <div className={'OrderTotalBlockValues'}>
                                <p>${orderData?.totalCost.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className={'orderBtnBlock'}>
                            <Link href={'/'} className={'placingOrderBlockButton'}>
                                {"На главную"}
                            </Link>
                            <div className={'placingOrderPdfButton'} onClick={generatePDF}>
                                <p>{"Скачать чек"}</p>
                                <Image src={pdfLogo} alt={'PDF'}></Image>
                            </div>
                            {isDesktop ?
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <div className={'placingOrderQRButton'}>
                                            <p>{"QR"}</p>
                                            <Image src={qrlogo} alt={'QR'}></Image>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[490px] placingOrderQRContent">
                                        <DialogHeader>
                                            <DialogTitle>QR-код для получения заказа при самовывозе</DialogTitle>
                                            {/*<DialogDescription>*/}
                                            {/* Покажите этот QR-код, для получения заказа*/}
                                            {/*</DialogDescription>*/}

                                        </DialogHeader>
                                        <div className="flex flex-col items-center justify-center">
                                            <Image src={qrCodeSrc} alt={'QRImage'} width={248} height={248}></Image>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                :
                                <Drawer open={open} onOpenChange={setOpen}>
                                    <DrawerTrigger asChild>
                                        <div className={'placingOrderQRButton'}>
                                            <p>{"QR"}</p>
                                            <Image src={qrlogo} alt={'QR'}></Image>
                                        </div>
                                    </DrawerTrigger>
                                    <DrawerContent className="h-[60%] text-black p-0 overflow-hidden flex flex-col justify-between">
                                        <DrawerHeader className="text-left">
                                            <DrawerTitle>  QR-код для получения заказа при самовывозе</DrawerTitle>
                                            {/*<DrawerDescription>*/}
                                            {/*  */}
                                            {/*</DrawerDescription>*/}
                                        </DrawerHeader>


                                        <div className="flex flex-col items-center justify-center flex-grow">
                                            <Image src={qrCodeSrc} alt={'QRImage'} width={248} height={248}></Image>
                                        </div>

                                        <DrawerFooter className="">
                                            <DrawerClose asChild>
                                                <Button variant="outline" className={'orderQRButton'}>Закрыть</Button>
                                            </DrawerClose>
                                        </DrawerFooter>
                                    </DrawerContent>
                                </Drawer>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}
