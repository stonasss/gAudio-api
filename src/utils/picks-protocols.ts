export type Pick = {
    id: number;
    image: string;
    title: string;
    description: string;
    link: string;
    userId: number;
};

export type NewPick = Omit<Pick, "id" | "userId">
export type ValidPick = Omit<Pick, "id">