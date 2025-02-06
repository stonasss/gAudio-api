import prisma from "@/config/database";
import { EditPick, ValidPick } from "@/utils/picks-protocols";

async function getPicks() {
    return prisma.picks.findMany();
}

async function getPickById(pickId: number) {
    const pick = await prisma.picks.findFirst({
        where: {
            id: pickId,
        },
    });
    
    return pick;
}

async function getPicksByUser(userId: number) {
    const picks = await prisma.picks.findMany({
        where: {
            userId,
        },
    });

    return picks;
}

async function createPick({ image, title, artist, description, link, userId }: ValidPick) {
    const pick = await prisma.picks.create({
        data: {
            userId,
            image,
            title,
            artist,
            description,
            link
        },
    });

    return pick;
}

async function deletePick(pickId: number) {
    const result = await prisma.picks.delete({
        where: {
            id: pickId,
        },
    });

    return result;
}

async function updatePick({ image, title, artist, description, link, pickId }: EditPick) {
    const result = await prisma.picks.update({
        where: {
            id: pickId,
        },
        data: {
            image,
            title,
            artist,
            description,
            link,
        },
    });

    return result;
}

export const picksRepositories = {
    getPicks,
    createPick,
    getPickById,
    deletePick,
    updatePick,
    getPicksByUser
}
