import type { Nullable } from "@/type/nullable";

export interface CreateUserOptions {
    discordId: string;
}

export interface User extends CreateUserOptions {
    bungieId?: Nullable<string>;
}
