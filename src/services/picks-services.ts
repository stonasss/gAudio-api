import { picksRepositories } from "../repositories/picks-repositories";

async function getPicks() {
    const result = await picksRepositories.getPicks();
    return result;
}

export const picksServices = {
    getPicks,
}
