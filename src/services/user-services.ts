import bcrypt from "bcrypt";
import { userRepositories } from "@/repositories/user-repositories";
import { errors } from "@/errors/index"
import { User } from "@/utils/user-protocols";

async function getUsers() {
    const users = await userRepositories.findUsers();
    if (!users) throw errors.notFoundError();
    return users;
}

async function createUser({ username, email, password }: User) {
    const userExists = await userRepositories.findUserByEmail(email);

    if (userExists) throw errors.duplicatedEmail();

    const hashedPasswd: string = await bcrypt.hash(password, 10);
    await userRepositories.createUser({
        username,
        email,
        password: hashedPasswd,
    });
}

export const userServices = {
    getUsers,
    createUser
}
