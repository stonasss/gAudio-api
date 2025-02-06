export type Pick = {
    id: number;
    image: string;
    title: string;
    artist: string;
    description: string;
    link: string;
    userId: number;
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
    pickId: number;
    image: string;
    title: string;
    artist: string;
    description: string;
    link: string;
}

export type NewPick = Omit<Pick, "id" | "userId">
export type ValidPick = Omit<Pick, "id">
