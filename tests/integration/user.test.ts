import supertest from "supertest";
import httpStatus from 'http-status';
import { faker } from '@faker-js/faker';
import prisma from "@/config/database";
import app from 'app';

const server = supertest(app);

describe('GET /users', () => {
    const generateValidBody = () => ({
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 10 })
    });

    it('should respond with status 200 and correct body if no users registered', async () => {
        await prisma.session.deleteMany();
        await prisma.user.deleteMany();
        const response = await server.get('/users');

        expect(response.status).toBe(httpStatus.OK)
        expect(response.body).toEqual({
            users: []
        })
    })
})
