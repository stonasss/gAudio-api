import { session } from "@prisma/client";
import { createUser } from "./users-factory";
import prisma from "config/database";

export async function createSession(token: string): Promise<session> {
    const user = await createUser();

    return prisma.session.create({
        data: {
            token,
            user_id: user.id
        },
    });
};