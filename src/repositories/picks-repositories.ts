import prisma from "@/config/database";
import { EditPick, ValidPick } from "@/utils/picks-protocols";

async function getPicks() {
    return prisma.picks.findMany();
}

async function getPickById(pick_id: number) {
    const pick = await prisma.picks.findFirst({
        where: {
            id: pick_id,
        },
    });

    return pick;
}

async function getPicksByUser(user_id: number) {
    const picks = await prisma.picks.findMany({
        where: {
            user_id,
        },
    });

    return picks;
}

async function createPick({ image, title, artist, description, link, user_id }: ValidPick) {
    const pick = await prisma.picks.create({
        data: {
            user_id,
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

async function updatePick({ image, title, artist, description, link, pick_id }: EditPick) {
    const result = await prisma.picks.update({
        where: {
            id: pick_id,
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
