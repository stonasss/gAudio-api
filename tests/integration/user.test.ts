import supertest from "supertest";
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker';
import prisma from "@/config/database";
import app from 'app';
import { cleanDb } from "../helpers";
import { loginUser, createUser } from "../factories/users-factory";

beforeAll(async () => {
    await cleanDb();
});

const server = supertest(app);

const generateValidBody = () => ({
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 10 })
});

describe('GET /users', () => {
    beforeAll(async () => {
        await cleanDb();
    })

    it('should respond with status 200 and correct body if no users registered', async () => {
        await prisma.session.deleteMany();
        await prisma.user.deleteMany();

        const response = await server.get('/users');
        expect(response.status).toBe(httpStatus.OK)
        expect(response.body).toEqual({
            users: []
        })
    });

    it('should respond with status 200 and correct body if users registered', async () => {
        const body = generateValidBody();
        await server.post('/register').send(body)

        const response = await server.get('/users')
        expect(response.status).toBe(httpStatus.OK)
        expect(response.body).not.toEqual({
            users: []
        })
    });
})

describe('POST /register', () => {
    beforeAll(async () => {
        await cleanDb();
    });

    it('should respond with status 400 when body is not given', async () => {
        const response = await server.post('/register')
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
    })

    it('should respond with status 400 when body is not valid', async () => {
        const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };
        const response = await server.post('/register').send(invalidBody);
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
    })

    describe('when body is valid', () => {
        beforeAll(async() => {
            await prisma.session.deleteMany();
            await prisma.user.deleteMany({});
        })

        it('should respond with status 409 when there is already a user with the same email', async () => {
            const body = generateValidBody();
            await createUser(body);
            const response = await server.post('/register').send(body);
            expect(response.status).toBe(httpStatus.CONFLICT);
        });

        it('should respond with status 201 and create user when email is unique', async () => {
            const body = generateValidBody();
            const response = await server.post('/register').send(body);
            expect(response.status).toBe(httpStatus.CREATED);
            expect(response.body).toEqual({
                username: body.username,
                email: body.email
            })
        });

        it('should not return user password on body', async () => {
            const body = generateValidBody();
            const response = await server.post('/register').send(body);
            expect(response.body).not.toHaveProperty('password');
        });

        it('should save user in database', async () => {
            const body = generateValidBody();
            await server.post('/register').send(body);

            const user = await prisma.user.findUnique({
                where: { email: body.email }
            });
            expect(user).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    username: body.username,
                    email: body.email,
                    password: user.password,
                    created_at: user.created_at,
                    updated_at: user.updated_at
                })
            )
        });
    });
})

describe('POST /login', () => {
    beforeAll(async () => {
        await cleanDb();
    });

    it('should respond with status 400 when body is not given', async () => {
        const response = await server.post('/login');
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when body is not valid', async () => {
        const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };
        const response = await server.post('/login').send(invalidBody);
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe('when body is valid', () => {
        beforeAll(async () => {
            await prisma.session.deleteMany();
            await prisma.user.deleteMany();
        })

        it(`should respond with status 401 if email is correct and password isn't`, async () => {
            const body = generateValidBody();
            await server.post('/register').send(body);

            const incorrectPassword = {
                email: body.email,
                password: faker.internet.password({ length: 10 }),
            }
            const response = await server.post('/login').send(incorrectPassword)
            expect(response.status).toBe(httpStatus.UNAUTHORIZED)
        })

        it(`should respond with status 401 if password is correct and email isn't`, async () => {
            const body = generateValidBody();
            await server.post('/register').send(body);

            const incorrectEmail = {
                email: faker.internet.email(),
                password: body.password,
            }
            const response = await server.post('/login').send(incorrectEmail)
            expect(response.status).toBe(httpStatus.UNAUTHORIZED)
        })

        it('should respond with status 200 and correct body with token', async () => {
            const body = generateValidBody();
            await server.post('/register').send(body);

            const login = {
                email: body.email,
                password: body.password,
            }
            const response = await server.post('/login').send(login)
            expect(response.status).toBe(httpStatus.OK)
            expect(response.body).toEqual({
                token: {
                    id: expect.any(Number),
                    user_id: expect.any(Number),
                    token: response.body.token.token,
                    created_at: response.body.token.created_at,
                    updated_at: response.body.token.updated_at
                },
                username: {
                    id: expect.any(Number),
                    username: response.body.username.username,
                    email: body.email,
                    password: expect.any(String),
                    created_at: response.body.username.created_at,
                    updated_at: response.body.username.updated_at
                }
            })
        })
    })
})

describe('DELETE /users', () => {
    beforeAll(async () => {
        await cleanDb();
    });

    it('should respond with status 404 and correct body if id does not exist', async () => {
        const id = {
            id: 99999
        }

        const response = await server.delete('/users').send(id)
        expect(response.status).toBe(httpStatus.NOT_FOUND)
        expect(response.body).toEqual({})
    })

    it('should respond with status 401 if token is not valid', async () => {
        const body = generateValidBody();
        await server.post('/register').send(body);

        const user = await prisma.user.findUnique({
            where: {
                email: body.email
            },
        });
        const token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY)
        await loginUser(token, user.id)
        const invalidToken = { [faker.lorem.word()]: faker.lorem.word() };
        const response = await server.delete(`/users/${user.id}`).set('Authorization', `Bearer ${invalidToken}`)
        expect(response.status).toBe(httpStatus.UNAUTHORIZED)
    })

    it('should respond with status 204 if deletion successful', async () => {
        const body = generateValidBody();
        await server.post('/register').send(body);

        const user = await prisma.user.findUnique({
            where: {
                email: body.email
            },
        });
        const token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY)
        await loginUser(token, user.id)
        const response = await server.delete(`/users/${user.id}`).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(httpStatus.NO_CONTENT)
    })
})

describe('UPDATE /users', () => {
    beforeAll(async () => {
        await cleanDb();
    });

    it('should respond with status 404 and correct body if id does not exist', async () => {
        const id = {
            id: 99999
        }

        const response = await server.put('/users').send(id)
        expect(response.status).toBe(httpStatus.NOT_FOUND)
        expect(response.body).toEqual({})
    })

    describe('when id exists', () => {
        beforeAll(async () => {
            await prisma.session.deleteMany();
            await prisma.user.deleteMany();
        })

        it('should respond with 400 when body is not given', async () => {
            const body = generateValidBody();
            await server.post('/register').send(body);
    
            const user = await prisma.user.findUnique({
                where: {
                    email: body.email
                },
            });
            const token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY)
            await loginUser(token, user.id)
    
            const response = await server.put(`/users/${user.id}`).set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(httpStatus.BAD_REQUEST)
        })

        it('should respond with 400 when body is not valid', async () => {
            const body = generateValidBody();
            await server.post('/register').send(body);
    
            const user = await prisma.user.findUnique({
                where: {
                    email: body.email
                },
            });
            const token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY)
            await loginUser(token, user.id)

            const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };
            const response = await server.put(`/users/${user.id}`).set('Authorization', `Bearer ${token}`).send(invalidBody)
            expect(response.status).toBe(httpStatus.BAD_REQUEST)
        })

        it('should respond with 401 when token is not valid', async () => {
            const body = generateValidBody();
            await server.post('/register').send(body);
    
            const user = await prisma.user.findUnique({
                where: {
                    email: body.email
                },
            });
            const token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY)
            await loginUser(token, user.id)

            const updatedBody = {
                username: faker.internet.username(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            }
            const invalidToken = { [faker.lorem.word()]: faker.lorem.word() };
            const response = await server.put(`/users/${user.id}`).set('Authorization', `Bearer ${invalidToken}`).send(updatedBody)
            expect(response.status).toBe(httpStatus.UNAUTHORIZED)
        })

        it('should respond with 200 when user is succesfully updated', async () => {
            const body = generateValidBody();
            await server.post('/register').send(body);
    
            const user = await prisma.user.findUnique({
                where: {
                    email: body.email
                },
            });
            const token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY)
            await loginUser(token, user.id)

            const updatedBody = {
                username: faker.internet.username(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            }
            const response = await server.put(`/users/${user.id}`).set('Authorization', `Bearer ${token}`).send(updatedBody)
            expect(response.status).toBe(httpStatus.OK)
        })
    })
})
