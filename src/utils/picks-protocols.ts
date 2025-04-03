export type Pick = {
    id: number;
    image: string;
    title: string;
    artist: string;
    description: string;
    link: string;
    user_id: number;
};

export type PickToUpdate = {
    id: string,
    image: string;
    title: string;
    artist: string;
    description: string;
    link: string;
}

export type EditPick = {
    pick_id: number;
    image: string;
    title: string;
    artist: string;
    description: string;
    link: string;
}

export type NewPick = Omit<Pick, "id" | "user_id">
export type ValidPick = Omit<Pick, "id">
