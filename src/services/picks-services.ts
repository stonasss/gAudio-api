import { ValidPick } from "@/utils/picks-protocols";
import { picksRepositories } from "../repositories/picks-repositories";
import { errors } from "@/errors";

async function getPicks() {
    const result = await picksRepositories.getPicks();
    return result;
};

async function createPick({ image, title, artist, description, link, userId }: ValidPick) {
    const pick = await picksRepositories.createPick({
        image,
        title,
        artist,
        description,
        link,
        userId
    });

    return pick;
}

async function getPickById(id: string) {
    const pickId = parseInt(id);
    const pick = await picksRepositories.getPickById(pickId);
    if (!pick) throw errors.notFoundError();
    return pick;
}

async function deletePick(id: string) {
    const pickId = parseInt(id);
    const pick = await picksRepositories.getPickById(pickId);
    if (!pick) throw errors.notFoundError();
    const result = await picksRepositories.deletePick(pickId);
    return result;
}

export const picksServices = {
    getPicks,
    createPick,
    getPickById,
    deletePick,
}
