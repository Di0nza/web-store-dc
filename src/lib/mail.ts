import {Resend} from "resend";
import {Mailer, PdfMailer} from "@/services/mailer";
import { jsPDF } from "jspdf";
import {amiriFont} from "@/fonts/amiriFont";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (
    email: string,
    token: string
) => {
    await resend.emails.send({
        from: "mail@auth-masterclass-tutorial.com",
        to: email,
        subject: "2FA Code",
        html: `<p>Your 2FA code: ${token}</p>`
    });
};

// export const sendPasswordResetEmail = async (
//     email: string,
//     token: string,
// ) => {
//     const resetLink = `${domain}/newPassword?token=${token}`
//
//     await resend.emails.send({
//         from: "onboarding@resend.dev",
//         to: email,
//         subject: "Reset your password",
//         html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
//     });
// };
//
// export const sendVerificationEmail = async (
//     email: string,
//     token: string
// ) => {
//     const confirmLink = `${domain}/newVerification?token=${token}`;
//
//     await resend.emails.send({
//         from: "onboarding@resend.dev",
//         to: email,
//         subject: "Confirm your email",
//         html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
//     });
// };


const generatePDF = (orderDetails) => {
    const doc = new jsPDF();
    doc.addFileToVFS("Amiri-Regular.ttf", amiriFont);
    doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
    doc.setFont("Amiri");
    //
    // const pdfTitle = `Заказ #${orderDetails?._id.toString()}`;
    // const pdfContent = 'Спасибо за ваш заказ!';
    // const pdfContent3 =
    //     `Сумма заказа: ${orderDetails?.totalCost.toFixed(2)}₽ - (${orderDetails?.promotionalCode ? orderDetails?.promotionalCode : 0}%) (${orderDetails?.paymentState})`;
    // let formattedDateTime = "";
    // const monthsInRussian = [
    //     "января", "февраля", "марта", "апреля", "мая", "июня",
    //     "июля", "августа", "сентября", "октября", "ноября", "декабря"
    // ];
    // if (orderDetails.createdAt) {
    //     const formattedDate = new Date(orderDetails.createdAt);
    //     const monthIndex = formattedDate.getMonth();
    //     const monthInRussian = monthsInRussian[monthIndex];
    //     const hours = formattedDate.getHours();
    //     const minutes = formattedDate.getMinutes();
    //
    //     formattedDateTime = `${formattedDate.getDate()} ${monthInRussian} ${formattedDate.getFullYear()} ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    // }
    // const pdfContent5 = 'Дата оформления: ' + formattedDateTime;
    // const pdfContent6 = 'Способ доставки: ' + orderDetails?.deliveryMethod;
    // const data = [
    //     `Имя: ${orderDetails.name}`,
    //     `Email: ${orderDetails.email}`,
    //     `Телефон: ${orderDetails.telephone}`,
    //     `Пункт назвачения: ${orderDetails?.country}, ${orderDetails?.city},ул. ${orderDetails?.street},(д.${orderDetails?.house},кв.${orderDetails?.apartment}),${orderDetails?.zip}`,
    // ];
    // const orderTotal = orderDetails.promotionalCode ? (orderDetails.totalCost * (1 - orderDetails.promotionalCode / 100)) : orderDetails.totalCost;
    // const vat = orderTotal * 0.23;
    // const orderTotalWithoutVat = orderTotal - vat;
    // const discountedTotal = orderDetails.promotionalCode ? orderTotal - (orderTotal * (1 - orderDetails.promotionalCode / 100)) : 0;
    // const pdfContentBlock1 = `Сумма заказа: ${orderTotal.toFixed(2)}₽`;
    // const pdfContentBlock2 = `НДС (+23%): ${orderTotalWithoutVat.toFixed(2)} + ${vat.toFixed(2)}₽`;
    // const pdfContentBlock3 = `Просокод (-${orderDetails?.promotionalCode}%): ${discountedTotal}₽`;
    // const pdfContentBlock4 = `Итого: ${orderDetails?.totalCost.toFixed(2)}₽`;
    //
    // doc.setFontSize(18);
    // doc.text(pdfTitle, 10, 20);
    // doc.setFontSize(12);
    // doc.text(pdfContent, 10, 40);
    // doc.text(pdfContent3, 10, 50);
    // doc.text(pdfContent6, 10, 60);
    // let verticalPosition = 80;
    // data.forEach((line) => {
    //     doc.setFontSize(12);
    //     doc.text(line, 10, verticalPosition);
    //     verticalPosition += 10;
    // });
    // doc.text(pdfContentBlock1, 10, 130);
    // doc.text(pdfContentBlock2, 10, 140);
    // doc.text(pdfContentBlock3, 10, 150);
    // doc.text(pdfContentBlock4, 10, 160);
    doc.addImage('https://res.cloudinary.com/dzdmstsam/image/upload/v1717702108/headerLogo_e5dhwk.png', 'PNG', 166, 260, 25, 13);
    // doc.addImage(orderDetails.qrCodeSrc, 'PNG', 9, 220, 45, 45);
    doc.text('MariDenizDesign', 160, 280);
    // doc.text(pdfContent5, 10, 280);

    // Return the generated PDF as a Blob
    return doc.output('arraybuffer');
};

export const sendOrderConfirmationEmail = async (email: string, orderDetails: any) => {
    const {
        name,
        products,
        zip,
        city,
        country,
        street,
        house,
        apartment,
        totalCost,
        promotionalCode,
        trackingCode,
        trackingLink,
        deliveryMethod,
        createdAt,
    } = orderDetails;

    const orderTotal = promotionalCode ? (totalCost * (1 - promotionalCode / 100)) : totalCost;
    const vat = orderTotal * 0.23;
    const orderTotalWithoutVat = orderTotal - vat;
    const discountedTotal = promotionalCode ? orderTotal - (orderTotal * (1 - promotionalCode / 100)) : 0;

    const productRows = products.map(product => `
        <tr>
            <td style="padding: 8px; border: 1px solid #dddddd;">
                <img src="${product.image}" alt="${product.name}" style="width: 50px; height: auto;">
            </td>
            <td style="padding: 8px; border: 1px solid #dddddd;">${product.title}</td>
            <td style="padding: 8px; border: 1px solid #dddddd;">${product.size}</td>
            <td style="padding: 8px; border: 1px solid #dddddd;">${product.price} ₽</td>
        </tr>
    `).join('');

    const htmlContent = `
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <div style="background-color: #000000; padding: 20px;">
                    <img src="https://res.cloudinary.com/dzdmstsam/image/upload/v1717702099/HomeScreenLogo_vxswth.png" alt="MariDenizDesign Logo" style="width: 100px; height: auto;">
                </div>
                <div style="padding: 20px 30px 40px;">
                    <h2 style="color: #212121;">Подтверждение заказа</h2>
                    <p style="color: #626262;">Спасибо за ваш заказ, ${name}!</p>
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <thead>
                            <tr style="color: #212121;">
                                <th style="padding: 8px; border: 1px solid #dddddd; background-color: #f2f2f2;">Изображение</th>
                                <th style="padding: 8px; border: 1px solid #dddddd; background-color: #f2f2f2;">Название</th>
                                <th style="padding: 8px; border: 1px solid #dddddd; background-color: #f2f2f2;">Размер</th>
                                <th style="padding: 8px; border: 1px solid #dddddd; background-color: #f2f2f2;">Цена</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productRows}
                        </tbody>
                    </table>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div style="text-align: left; width: 48%;">
                            <p style="color: #626262;"><b>Адрес доставки:</b> ${street}, ${house}${apartment ? `, кв. ${apartment}` : ''}, ${zip}, ${city}, ${country}</p>
                            <p style="color: #626262;"><b>Способ доставки:</b> ${deliveryMethod}</p>
                            <p style="color: #626262;"><b>Дата создания заказа:</b> ${new Date(createdAt).toLocaleDateString()}</p>
                            ${trackingCode ? `<p style="color: #626262;"><b>Код отслеживания:</b> ${trackingCode}</p>` : ''}
                            ${trackingLink ? `<p style="color: #626262;"><a href="${trackingLink}">Ссылка для отслеживания</a></p>` : ''}
                        </div>
                        <div style="width: 52%;">
                            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                                <tr>
                                    <td style="text-align: left; background-color: #f2f2f2; padding: 10px; border: 1px solid #dddddd;"><b>Сумма заказа:</b></td>
                                    <td style="text-align: left; padding: 10px; border: 1px solid #dddddd;">${totalCost.toFixed(2)} ₽</td>
                                </tr>
                                <tr>
                                    <td style="text-align: left; background-color: #f2f2f2; padding: 10px; border: 1px solid #dddddd;"><b>НДС (+23%):</b></td>
                                    <td style="text-align: left; padding: 10px; border: 1px solid #dddddd;">${orderTotalWithoutVat.toFixed(2)} ₽ + ${vat.toFixed(2)} ₽</td>
                                </tr>
                                <tr>
                                    <td style="text-align: left; background-color: #f2f2f2; padding: 10px; border: 1px solid #dddddd;"><b>Промокод (-${promotionalCode}%):</b></td>
                                    <td style="text-align: left; padding: 10px; border: 1px solid #dddddd;">${discountedTotal.toFixed(2)} ₽</td>
                                </tr>
                                <tr>
                                    <td style="text-align: left; background-color: #f2f2f2; padding: 10px; border: 1px solid #dddddd;"><b>Итого:</b></td>
                                    <td style="text-align: left; padding: 10px; border: 1px solid #dddddd;">${orderTotal.toFixed(2)} ₽</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // const pdfArrayBuffer = generatePDF(orderDetails);
    //
    // // Convert the ArrayBuffer to a Buffer
    // const pdfBuffer = Buffer.from(pdfArrayBuffer);
    //
    // // Send the email with the PDF attachment
    // await PdfMailer(email, "Подтверждение заказа", htmlContent, [
    //     {
    //         filename: `order${orderDetails?._id.toString().substring(7)}.pdf`,
    //         content: pdfBuffer,
    //         contentType: 'application/pdf'
    //     }
    // ]);
    await Mailer(email, "Подтверждение заказа", htmlContent);
};

export const ChangeOrderStatusEmail = async (email: string, orderDetails: any) => {
    const {
        name,
        products,
        zip,
        city,
        country,
        street,
        house,
        apartment,
        totalCost,
        promotionalCode,
        trackingCode,
        trackingLink,
        deliveryMethod,
        createdAt,
        orderStatus,
    } = orderDetails;

    const orderTotal = promotionalCode ? (totalCost * (1 - promotionalCode / 100)) : totalCost;
    const vat = orderTotal * 0.23;
    const orderTotalWithoutVat = orderTotal - vat;
    const discountedTotal = promotionalCode ? orderTotal - (orderTotal * (1 - promotionalCode / 100)) : 0;

    const productRows = products.map(product => `
        <tr>
            <td style="padding: 8px; border: 1px solid #dddddd;">
                <img src="${product.image}" alt="${product.name}" style="width: 50px; height: auto;">
            </td>
            <td style="padding: 8px; border: 1px solid #dddddd;">${product.title}</td>
            <td style="padding: 8px; border: 1px solid #dddddd;">${product.size}</td>
            <td style="padding: 8px; border: 1px solid #dddddd;">${product.price} ₽</td>
        </tr>
    `).join('');

    const getStatusColor = (index, selected) => selected ? '#0c0c0c' : '#cccccc';
    const getStatusWeight = (index, selected) => selected ? 'bold' : 'normal';
    const formatTimestampToDate = (timestamp) => new Date(timestamp).toLocaleDateString();
    const currentStatus = orderStatus.slice().reverse().find(status => status.selected);

    const htmlContent = `
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <div style="background-color: #000000; padding: 20px;">
                    <img src="https://res.cloudinary.com/dzdmstsam/image/upload/v1717702099/HomeScreenLogo_vxswth.png" alt="MariDenizDesign Logo" style="width: 100px; height: auto;">
                </div>
                <div style="padding: 20px 30px 40px;">
                    <h2 style="color: #212121;">Изменение статуса заказа</h2>
                    <p style="color: #626262;">Текущий статус: <strong>${currentStatus ? currentStatus.title : 'Пока неизвестно'}</strong></p>
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <thead>
                            <tr style="color: #212121;">
                                <th style="padding: 8px; border: 1px solid #dddddd; background-color: #f2f2f2;">Изображение</th>
                                <th style="padding: 8px; border: 1px solid #dddddd; background-color: #f2f2f2;">Название</th>
                                <th style="padding: 8px; border: 1px solid #dddddd; background-color: #f2f2f2;">Размер</th>
                                <th style="padding: 8px; border: 1px solid #dddddd; background-color: #f2f2f2;">Цена</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productRows}
                        </tbody>
                    </table>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div style="text-align: left; width: 48%;">
                            <p style="color: #626262;"><b>Адрес доставки:</b> ${street}, ${house}${apartment ? `, кв. ${apartment}` : ''}, ${zip}, ${city}, ${country}</p>
                            <p style="color: #626262;"><b>Способ доставки:</b> ${deliveryMethod}</p>
                            <p style="color: #626262;"><b>Дата создания заказа:</b> ${new Date(createdAt).toLocaleDateString()}</p>
                            ${trackingCode ? `<p style="color: #626262;"><b>Код отслеживания:</b> ${trackingCode}</p>` : ''}
                            ${trackingLink ? `<p style="color: #626262;"><a href="${trackingLink}">Ссылка для отслеживания</a></p>` : ''}
                        </div>
                        <div style="width: 52%;">
                            <h3>Статус заказа:</h3>
                            <div>
                                <div>
                                    ${orderStatus.map((status, index) => `
                                        <div key=${index} style="margin-bottom: 4px;">
                                            <p style="font-weight: ${getStatusWeight(index, status.selected)}; margin: 2px 0; text-align: right; text-decoration: none; color: ${getStatusColor(index, status.selected)};">${status.title}</p>
                                            ${status.createdDate !== '' ? `<p style="margin: 2px 0; text-align: right; text-decoration: none; color: ${getStatusColor(index, status.selected)};">${formatTimestampToDate(status.createdDate)}</p>` : `<p style="margin: 2px 0; text-align: right; text-decoration: none; color: ${getStatusColor(index, status.selected)};">Пока неизвестно</p>`}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    await Mailer(email, "Измение статуса заказа", htmlContent);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const domain = process.env.DOMAIN;
    const resetLink = `${domain}/newPassword?token=${token}`;

    const htmlContent = `
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <div style="background-color: #000000; padding: 20px;">
                    <img src="https://res.cloudinary.com/dzdmstsam/image/upload/v1717702099/HomeScreenLogo_vxswth.png" alt="MariDenizDesign Logo" style="width: 100px; height: auto;">
                </div>
                <div style="padding: 20px 30px 40px;">
                    <h2 style="color: #212121;">Сброс пароля</h2>
                    <p style="color: #626262;">Пожалуйста, нажмите на кнопку ниже, чтобы установить новый пароль</p>
                    <a href="${resetLink}" 
                    style=" display: inline-block; 
                    margin-top: 20px; 
                    padding: 10px 20px; 
                    background-color: #000000; 
                    color: #ffffff; 
                    text-decoration: none; 
                    border-radius: 10px; 
                    font-weight: 500; 
                    font-size: 15px">
                    Сбросить пароль
                    </a>
                </div>
            </div>
        </div>
    `;

    await Mailer(email, "Reset your password", htmlContent);
};

// Функция для отправки верификационного письма
export const sendVerificationEmail = async (email: string, token: string) => {
    const domain = process.env.DOMAIN;
    const confirmLink = `${domain}/newVerification?token=${token}`;

    const htmlContent = `
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <div style="background-color: #000000; padding: 20px;">
                    <img src="https://res.cloudinary.com/dzdmstsam/image/upload/v1717702099/HomeScreenLogo_vxswth.png" alt="MariDenizDesign Logo" style="width: 100px; height: auto;">
                </div>
                <div style="padding: 20px 30px 40px;">
                    <h2 style="color: #212121;">Добро пожаловать в MariDenizDesign!</h2>
                    <p style="color: #626262;">Спасибо за регистрацию! Пожалуйста, нажмите на кнопку ниже, чтобы верифицировать ваш аккаунт</p>
                    <a href="${confirmLink}" 
                    style=" display: inline-block; 
                    margin-top: 20px; 
                    padding: 10px 20px; 
                    background-color: #000000; 
                    color: #ffffff; 
                    text-decoration: none; 
                    border-radius: 10px; 
                    font-weight: 500; 
                    font-size: 15px">
                    Верифицировать аккаунт
                    </a>
                </div>
            </div>
        </div>
    `;

    await Mailer(email, "Confirm your email", htmlContent);
};