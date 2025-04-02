import * as jwt from 'jsonwebtoken';
import prisma from 'config/database';
import { user } from '@prisma/client';
import { createUser } from './factories/users-factory';
import { createSession } from './factories/sessions-factory';

export async function cleanDb() {
    await prisma.reviews.deleteMany({});
    await prisma.picks.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.user.deleteMany({});
}

export async function generateValidToken(user?: user) {
    const incomingUser = user || (await createUser());
    const token = jwt.sign({ userId: incomingUser.id }, process.env.SECRET_KEY );

    await createSession(token);

    return token;
}
