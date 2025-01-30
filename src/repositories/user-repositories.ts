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

async function findSessionByToken(userToken: string) {
    return prisma.session.findFirst({
        where: {
            token: userToken,
        },
    });
}

async function createUser({ username, email, password }: User) {
    const user = await prisma.user.create({
        data: {
            username,
            email,
            password,
        },
    });

    return user;
}

async function createSession(token: string, userId: number) {
    const session = await prisma.session.upsert({
        where: {
            userId,
        },
        create: {
            userId,
            token
        },
        update: {
            token
        }
    })

    return session;
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

async function deleteUser(userId: number){
    const deletedUser = await prisma.user.delete({
        where: {
            id: userId,
        }
    });

    return deletedUser;
}

export const userRepositories = {
    findUsers,
    findUserByEmail,
    findSessionByToken,
    findUserById,
    createUser,
    createSession,
    updateUser,
    deleteUser
}
