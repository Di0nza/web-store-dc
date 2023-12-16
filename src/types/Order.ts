export interface IOrder {
    username: string;
    email: string;
    telephone: string;
    zip: string;
    city: string,
    country: string,
    house: string,
    apartment: string,
    deliveryMethod: string,
    paymentState: string,
    promotionalCode: string,
    orderStatus: string,
    totalCost: number,
    totalNumber: number,
    createdBy: string,
    createdAt: Date;
    products: any,
}
