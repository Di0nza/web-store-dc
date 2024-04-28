export interface IPaymentToken {
    id?: string;
    userId: string;
    idempotenceKey: string;
    active: boolean;
    expiresIn: Date;
}