import { ApplicationError } from "../utils/user-protocols";

export function notFoundError() {
    return {
        name: "NotFoundError",
        message: "user or users not found",
    }
}
