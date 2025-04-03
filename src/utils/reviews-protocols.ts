export type Review = {
    id: number;
    user_id: number;
    pick_id: number;
    description: string;
    relisten: boolean;
};

export type ReviewToUpdate = {
    id: string,
    description: string;
    relisten: boolean;
}

export type EditReview = {
    reviewId: number;
    description: string;
    relisten: boolean;
}

export type NewReview = Omit<Review, "id" | "user_id" | "pick_id">
export type ValidReview = Omit<Review, "id">