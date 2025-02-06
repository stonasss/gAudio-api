import { ValidPick } from "@/utils/picks-protocols";
import { picksRepositories } from "../repositories/picks-repositories";

async function getPicks() {
    const result = await picksRepositories.getPicks();
    return result;
};

async function createPick({ image, title, description, link, userId }: ValidPick) {
    const pick = await picksRepositories.createPick({
        image,
        title,
        description,
        link,
        userId
    });

    return pick;
}

export const picksServices = {
    getPicks,
    createPick,
}
