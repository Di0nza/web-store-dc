interface IPaymentInfo{
    id: string,
    created_at: Date
}
export interface IOrder {
    name: string;
    email: string;
    telephone: string;
    zip: string;
    city: string,
    country: string,
    house: string,
    apartment: string,
    street: string,
    additionalInformation: string,
    deliveryMethod: string,
    paymentState: string,
    paymentInfo: IPaymentInfo,
    promotionalCode: string,
    orderStatus: any,
    totalCost: number,
    totalNumber: number,
    createdBy: string,
    createdAt: Date;
    products: any,
    trackingCode: string,
    trackingLink: string,
}
