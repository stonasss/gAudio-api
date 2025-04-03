import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import prisma from '@/config/database';
import { user } from '@prisma/client';

export async function createUser(params: Partial<user> = {}): Promise<user> {
    const incomingPassword = params.password || faker.internet.password({ length: 10 });
    const hashedPassword = await bcrypt.hash(incomingPassword, 10);

    return prisma.user.create({
        data: {
            username: params.username || faker.person.firstName(),
            email: params.email || faker.internet.email(),
            password: hashedPassword,
        },
    })
}

export async function loginUser(token: string, user_id: number) {
    return await prisma.session.create({
        data: {
            token,
            user_id
        },
    })
}