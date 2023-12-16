export interface IUser {
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
    isAdmin: boolean;
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
