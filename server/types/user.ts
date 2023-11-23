export interface IUser {
    name: string;
    email: string;
    password: string;
    role: "admin" | "user" | undefined;
}

export interface IUserLogin {
    email: string;
    password: string;
}
