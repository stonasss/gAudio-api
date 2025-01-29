import { userRepositories } from "../repositories/user-repositories";
import { notFoundError } from "../errors/";

async function getUsers() {
    const users = await userRepositories.findUsers();
    if (!users) throw notFoundError();
    return users;
}

export const userServices = {
    getUsers
}
