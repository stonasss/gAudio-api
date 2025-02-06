import prisma from "@/config/database";
import { ValidPick } from "@/utils/picks-protocols";

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

export const picksRepositories = {
    getPicks,
    createPick,
    getPickById,
    deletePick,
}
