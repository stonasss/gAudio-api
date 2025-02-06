import prisma from "@/config/database";

async function getPicks() {
    return prisma.picks.findMany();
}

export const picksRepositories = {
    getPicks,
}
