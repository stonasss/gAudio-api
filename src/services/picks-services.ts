import { NewPick, PickToUpdate, ValidPick } from "@/utils/picks-protocols";
import { picksRepositories } from "../repositories/picks-repositories";
import { errors } from "@/errors";

async function getPicks() {
    const result = await picksRepositories.getPicks();
    return result;
};

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

async function createPick({ image, title, artist, description, link, user_id }: ValidPick) {
    const pick = await picksRepositories.createPick({
        image,
        title,
        artist,
        description,
        link,
        user_id
    });

    return pick;
}

async function deletePick(id: string) {
    const pickId = parseInt(id);
    const pick = await picksRepositories.getPickById(pickId);
    if (!pick) throw errors.notFoundError();
    const result = await picksRepositories.deletePick(pickId);
    return result;
}

async function updatePick({ image, artist, title, description, link, id }: PickToUpdate) {
    const pick_id = parseInt(id);
    const pick = await picksRepositories.updatePick({
        image,
        artist, 
        title,
        description,
        link,
        pick_id
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
