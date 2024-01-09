export interface IUser {
    name: string;
    email: string;
    password: string;
    emailVerified: Date;
    isAdmin: boolean;
    accounts:[object],
    createdAt: Date;
    forgotPasswordToken: string;
    forgotPasswordTokenExpiry: string;
    verifyToken: string;
    verifyTokenExpiry: string;
}

export interface IUserLogin {
    email: string;
    password: string;
}
