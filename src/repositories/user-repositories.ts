import prisma from "../config/database";

async function findUsers() {
    const users = await prisma.user.findMany()
    return users;
}

export const userRepositories = {
    findUsers
}
