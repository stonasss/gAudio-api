export type Review = {
    id: number;
    userId: number;
    pickId: number;
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

export type NewReview = Omit<Review, "id" | "userId" | "pickId">
export type ValidReview = Omit<Review, "id">