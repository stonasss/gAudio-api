import bcrypt from "bcrypt";
import { userRepositories } from "@/repositories/user-repositories";
import { errors } from "@/errors/index"
import { LoginUser, User, UserId, UserUpdate } from "@/utils/user-protocols";
import jwt from "jsonwebtoken";

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

async function loginUser({ email, password }: LoginUser) {
    const userExists = await userRepositories.findUserByEmail(email);
    if (!userExists) throw errors.invalidCredentialsError();

    const validPassword = await bcrypt.compare(password, userExists.password);
    if (!validPassword) throw errors.invalidCredentialsError();

    const userId = Number(userExists.id);
    const token = jwt.sign({ id: userExists.id }, process.env.SECRET_KEY);

    const userInfo = await userRepositories.createSession(token, userId);
    return userInfo;
}

async function getSpecificUser(id: number) {
    const user = await userRepositories.findUserById(id);
    if (!user) throw errors.notFoundError();
    return user;
}

async function updateUser({ username, email, password, userId }: UserUpdate) {
    const user = await userRepositories.findUserById(userId);
    if (!user) throw errors.notFoundError();

    const hashedPasswd: string = await bcrypt.hash(password, 10);
    const updatedUser = await userRepositories.updateUser({
        username,
        email,
        password: hashedPasswd,
        userId
    });

    return updatedUser;
}

async function deleteUser({ userId }: UserId) {
    const user = await userRepositories.findUserById(userId)
    if (!user) throw errors.notFoundError()

    const result = await userRepositories.deleteUser(userId)
    return result;
}

async function retrieveSession(userToken: string) {
    const result = await userRepositories.findSessionByToken(userToken);
    if (!result) throw errors.notFoundError();
    return result.userId;
}

export const userServices = {
    getUsers,
    createUser,
    loginUser,
    getSpecificUser,
    updateUser,
    deleteUser,
    retrieveSession
}
