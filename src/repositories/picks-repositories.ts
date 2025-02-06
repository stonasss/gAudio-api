import prisma from "@/config/database";
import { ValidPick } from "@/utils/picks-protocols";

async function getPicks() {
    return prisma.picks.findMany();
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

export const picksRepositories = {
    getPicks,
    createPick,
}
