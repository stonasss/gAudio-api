import prisma from "@/config/database";
import { User, UserUpdate } from "@/utils/user-protocols";

async function findUsers() {
    const users = await prisma.user.findMany()
    return users;
}

async function findUserByEmail(email: string) {
    const user = await prisma.user.findFirst({
        where: {
            email
        }
    })

    return user;
};

async function findUserById(id: number) {
    const user = await prisma.user.findFirst({
        where: {
            id: id,
        }
    })

    return user;
}

async function createUser({ username, email, password }: User) {
    const user = await prisma.user.create({
        data: {
            username,
            email,
            password,
        },
    });

    return user
}

async function updateUser({ username, email, password, userId }: UserUpdate) {
    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            username,
            email,
            password,
        },
    });

    return updatedUser;
}

export const userRepositories = {
    findUsers,
    findUserByEmail,
    findUserById,
    createUser,
    updateUser
}
