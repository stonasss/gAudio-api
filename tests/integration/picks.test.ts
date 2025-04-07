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

const generateValidPick = () => ({
    image: faker.image.avatar(),
    title: faker.string.alpha(),
    password: faker.internet.password({ length: 10 })
});
