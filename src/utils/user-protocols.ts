export interface User {
    username: string;
    email: string;
    password: string;
};

export type LoginUser = Omit<User, "token" | "id" | "username">

export interface ApplicationError {
    name: string;
    message: string;
};

export interface UserUpdate {
    username: string;
    email: string;
    password: string;
    userId: number;
}

export interface UserId { userId: number }