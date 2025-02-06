import { NewPick, PickToUpdate, ValidPick } from "@/utils/picks-protocols";
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

async function getPicksByUserId(id: string) {
    const userId = parseInt(id);
    const userPicks = await picksRepositories.getPicksByUser(userId);
    return userPicks;
}

async function deletePick(id: string) {
    const pickId = parseInt(id);
    const pick = await picksRepositories.getPickById(pickId);
    if (!pick) throw errors.notFoundError();
    const result = await picksRepositories.deletePick(pickId);
    return result;
}

async function updatePick({ image, artist, title, description, link, id }: PickToUpdate) {
    const pickId = parseInt(id);
    const pick = await picksRepositories.updatePick({
        image,
        artist, 
        title,
        description,
        link,
        pickId
    });
    return pick;
}

export const picksServices = {
    getPicks,
    createPick,
    getPickById,
    deletePick,
    getPicksByUserId,
    updatePick
}
