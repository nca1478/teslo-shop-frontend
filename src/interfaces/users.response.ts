import type { User } from "./user.interface";

export interface UsersResponse {
    count: number;
    pages: number;
    users: User[];
}
