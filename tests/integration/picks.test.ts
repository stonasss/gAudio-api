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

afterAll(async () => {
    await prisma.$disconnect();
})

const server = supertest(app);

const generateValidPick = () => ({
    image: faker.image.avatar(),
    title: faker.music.album(),
    artist: faker.music.artist(),
    description: faker.lorem.sentence({ min: 3, max: 5 }),
    link: faker.internet.url()
});

jest.retryTimes(5);

describe('GET /picks', () => {
    beforeEach(async () => {
        await cleanDb();
    });

    afterEach(async () => {
        await cleanDb();
    })

    it('should respond with status 200 and correct body if no picks registered', async () => {
        const response = await server.get('/picks');
        expect(response.status).toBe(httpStatus.OK)
        expect(response.body).toEqual({
            picks: []
        })
    });

    it('should respond with status 200 and correct body if picks are registered', async () => {
        const newPick = generateValidPick();
        const userBody = createUser();
        await server.post('/register').send(userBody)

        const user = await prisma.user.findUnique({
            where: {
                email: (await userBody).email
            },
        });
        const token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY)
        await loginUser(token, user.id)

        await server.post('/picks/new').set('Authorization', `Bearer ${token}`).send(newPick)
        const response = await server.get('/picks');
        expect(response.status).toBe(httpStatus.OK)
        expect(response.body).not.toEqual({
            picks: []
        })
    });
})

describe('/GET /picks/:id', () => {
    beforeEach(async () => {
        await cleanDb();
    });

    afterEach(async () => {
        await cleanDb();
    })

    it('should respond with status 404 and correct body if id does not exist', async () => {
        const newPick = generateValidPick();
        const userBody = createUser();
        await server.post('/register').send(userBody);

        const user = await prisma.user.findUnique({
            where: {
                email: (await userBody).email
            },
        });
        const token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY)
        await loginUser(token, user.id)
        await server.post('/picks/new').set('Authorization', `Bearer ${token}`).send(newPick)

        const invalidId = 99999;
        const response = await server.get(`/picks/${invalidId}`).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(httpStatus.NOT_FOUND)
        expect(response.body).toEqual({ 
            "message": "No results found",
        })
    });

    it('should respond with status 200 and correct body if id exists and there are picks registered', async () => {
        const newPick = generateValidPick();
        const userBody = createUser();
        await server.post('/register').send(userBody);

        const user = await prisma.user.findUnique({
            where: {
                email: (await userBody).email
            },
        });
        const token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY)
        await loginUser(token, user.id)
        await server.post('/picks/new').set('Authorization', `Bearer ${token}`).send(newPick)

        const response = await server.get(`/picks/${user.id}`).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(httpStatus.OK)
        expect(response.body).not.toEqual({
            "userPicks" : []
        })
    });

    it('should respond with status 200 and correct body if id exists and there are no picks registered', async () => {
        const userBody = createUser();
        await server.post('/register').send(userBody);

        const user = await prisma.user.findUnique({
            where: {
                email: (await userBody).email
            },
        });
        const token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY)
        await loginUser(token, user.id)

        const response = await server.get(`/picks/${user.id}`).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(httpStatus.OK)
        expect(response.body).toEqual({
            "userPicks" : []
        })
    })
})

describe('/POST /picks', () => {
    beforeEach(async () => {
        await cleanDb();
    });

    afterEach(async () => {
        await cleanDb();
    })

    it('should respond with status 400 when body is not given', async () => {
        const userBody = createUser();
        await server.post('/register').send(userBody);

        const user = await prisma.user.findUnique({
            where: {
                email: (await userBody).email
            },
        });
        const token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY)
        await loginUser(token, user.id)

        const response = await server.post('/picks/new').set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(httpStatus.BAD_REQUEST)
    })

    it('should respond with status 400 if body is not valio', async () => {
        const userBody = createUser();
        await server.post('/register').send(userBody);

        const user = await prisma.user.findUnique({
            where: {
                email: (await userBody).email
            },
        });
        const token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY)
        await loginUser(token, user.id)

        const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };
        const response = await server.post('/picks/new').set('Authorization', `Bearer ${token}`).send(invalidBody)
        expect(response.status).toBe(httpStatus.BAD_REQUEST)
    })

    describe('when token is invalid/missing', () => {
        beforeEach(async () => {
            await cleanDb();
        });
    
        afterEach(async () => {
            await cleanDb();
        })

        it('should respond with status 401 when body is given but token is not', async () => {
            const userBody = createUser();
            const newPick = generateValidPick();
            await server.post('/register').send(userBody);

            const response = await server.post('/picks/new').send(newPick)
            expect(response.status).toBe(httpStatus.UNAUTHORIZED)
        })

        it('should respond with stats 401 when body is given but token is invalid', async () => {
            const userBody = createUser();
            const newPick = generateValidPick();
            await server.post('/register').send(userBody);

            const invalidToken = faker.lorem.word()
            const response = await server.post('/picks/new').set('Authorization', `Bearer ${invalidToken}`).send(newPick)
            expect(response.status).toBe(httpStatus.UNAUTHORIZED)
        })
    })

    it('should respond with status 201 when user is authorized and entry is successful', async () => {
        const userBody = createUser();
        const newPick = generateValidPick();
        await server.post('/register').send(userBody);

        const user = await prisma.user.findUnique({
            where: {
                email: (await userBody).email
            },
        });
        const token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY)
        await loginUser(token, user.id)

        const response = await server.post('/picks/new').set('Authorization', `Bearer ${token}`).send(newPick)
        expect(response.status).toBe(httpStatus.CREATED)
        expect(response.body).toEqual({
            "result" : expect.objectContaining({
                user_id: expect.any(Number),
                image: newPick.image,
                title: newPick.title,
                artist: newPick.artist,
                description: newPick.description,
                id: expect.any(Number),
                link: newPick.link || null
            })
        })
    })
})

describe('DELETE /posts', () => {
    beforeEach(async () => {
        await cleanDb();
    });

    afterEach(async () => {
        await cleanDb();
    })

    it('should respond with status 404 and correct body if id does not exist', async () => {
        const userBody = createUser();
        await server.post('/register').send(userBody);

        const user = await prisma.user.findUnique({
            where: {
                email: (await userBody).email
            },
        });
        const token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY)
        await loginUser(token, user.id)

        const invalidId = 99999;
        const response = await server.delete(`/picks/${invalidId}`).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(httpStatus.NOT_FOUND)
        expect(response.body).toEqual({
            "message": "No results found",
        })
    })

    it('should respond with status 401 if token is not valid', async () => {
        const userBody = createUser();
        const newPick = generateValidPick();
        await server.post('/register').send(userBody);

        const user = await prisma.user.findUnique({
            where: {
                email: (await userBody).email
            },
        });
        const token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY)
        await loginUser(token, user.id)
        await server.post('/picks/new').set('Authorization', `Bearer ${token}`).send(newPick)

        const pick = await prisma.picks.findFirst({
            where: {
                link : newPick.link,
                user_id: user.id
            }
        })
        const invalidToken = faker.lorem.word()
        const response = await server.delete(`/picks/${pick.id}`).set('Authorization', `Bearer ${invalidToken}`)
        expect(response.status).toBe(httpStatus.UNAUTHORIZED)
    })

    it('should respond with status 204 if deletion is a success', async () => {
        const userBody = createUser();
        const newPick = generateValidPick();
        await server.post('/register').send(userBody);

        const user = await prisma.user.findUnique({
            where: {
                email: (await userBody).email
            },
        });
        const token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY)
        await loginUser(token, user.id)
        await server.post('/picks/new').set('Authorization', `Bearer ${token}`).send(newPick)

        const pick = await prisma.picks.findFirst({
            where: {
                user_id: user.id,
                link: newPick.link
            },
        })

        const response = await server.delete(`/picks/${pick.id}`).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(httpStatus.NO_CONTENT)
        expect(response.body).toEqual({})
    })
})

describe('PUT /picks', () => {
    beforeEach(async () => {
        await cleanDb();
    });

    afterEach(async () => {
        await cleanDb();
    })

    it('should respond with status 404 and correct body if id does not exist', async () => {
        const userBody = createUser();
        await server.post('/register').send(userBody);

        const user = await prisma.user.findUnique({
            where: {
                email: (await userBody).email
            },
        });
        const token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY)
        await loginUser(token, user.id)
        const updatedBody = {
            image: faker.image.avatar(),
            title: faker.music.album(),
            artist: faker.music.artist(),
            description: faker.lorem.sentence({ min: 3, max: 5 }),
            link: faker.internet.url()
        }

        const invalidId = 99999;
        const response = await server.put(`/picks/${invalidId}`).set('Authorization', `Bearer ${token}`).send(updatedBody)
        expect(response.status).toBe(httpStatus.NOT_FOUND)
        expect(response.body).toEqual({
            "message": "No results found",
        })
    })

    describe('when id exists', () => {
        beforeEach(async () => {
            await cleanDb();
        });

        afterEach(async () => {
            await cleanDb();
        });

        it('should respond with 400 when body is not given', async () => {
            const userBody = createUser();
            const newPick = generateValidPick();
            await server.post('/register').send(userBody);

            const user = await prisma.user.findUnique({
                where: {
                    email: (await userBody).email
                },
            });
            const token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY)
            await loginUser(token, user.id)
            await server.post('/picks/new').set('Authorization', `Bearer ${token}`).send(newPick)

            const pick = await prisma.picks.findFirst({
                where: {
                    user_id: user.id,
                    link: newPick.link
                },
            })
            const response = await server.put(`/picks/${pick.id}`).set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(httpStatus.BAD_REQUEST)
        })

        it('should respond with 400 when body is not valid', async () => {
            const userBody = createUser();
            const newPick = generateValidPick();
            await server.post('/register').send(userBody);

            const user = await prisma.user.findUnique({
                where: {
                    email: (await userBody).email
                },
            });
            const token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY)
            await loginUser(token, user.id)
            await server.post('/picks/new').set('Authorization', `Bearer ${token}`).send(newPick)

            const pick = await prisma.picks.findFirst({
                where: {
                    user_id: user.id,
                    link: newPick.link
                },
            })
            const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };
            const response = await server.put(`/picks/${pick.id}`).set('Authorization', `Bearer ${token}`).send(invalidBody)
            expect(response.status).toBe(httpStatus.BAD_REQUEST)
        })

        it('should respond with 401 when token is not valid', async () => {
            const userBody = createUser();
            const newPick = generateValidPick();
            await server.post('/register').send(userBody);

            const user = await prisma.user.findUnique({
                where: {
                    email: (await userBody).email
                },
            });
            const token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY)
            await loginUser(token, user.id)
            await server.post('/picks/new').set('Authorization', `Bearer ${token}`).send(newPick)

            const pick = await prisma.picks.findFirst({
                where: {
                    user_id: user.id,
                    link: newPick.link
                },
            })
            const updatedBody = {
                image: faker.image.avatar(),
                title: faker.music.album(),
                artist: faker.music.artist(),
                description: faker.lorem.sentence({ min: 3, max: 5 }),
                link: faker.internet.url()
            }

            const invalidToken = faker.lorem.word();
            const response = await server.put(`/picks/${pick.id}`).set('Authorization', `Bearer ${invalidToken}`).send(updatedBody)
            expect(response.status).toBe(httpStatus.UNAUTHORIZED)
        })

        it('should respond with 200 when user is successfully updated', async () => {
            const userBody = createUser();
            const newPick = generateValidPick();
            await server.post('/register').send(userBody);

            const user = await prisma.user.findUnique({
                where: {
                    email: (await userBody).email
                },
            });
            const token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY)
            await loginUser(token, user.id)
            await server.post('/picks/new').set('Authorization', `Bearer ${token}`).send(newPick)

            const pick = await prisma.picks.findFirst({
                where: {
                    user_id: user.id,
                    link: newPick.link
                },
            })
            const updatedBody = {
                image: faker.image.avatar(),
                title: faker.music.album(),
                artist: faker.music.artist(),
                description: faker.lorem.sentence({ min: 3, max: 5 }),
                link: faker.internet.url()
            }

            const response = await server.put(`/picks/${pick.id}`).set('Authorization', `Bearer ${token}`).send(updatedBody)
            expect(response.status).toBe(httpStatus.OK)
        })
    })
})
