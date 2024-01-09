export interface IOrder {
    username: string;
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
