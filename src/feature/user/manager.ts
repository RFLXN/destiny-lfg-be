import { EventEmitter } from "events";
import type { default as TypedEmitter, EventMap } from "typed-emitter";
import type { CreateUserOptions, User } from "@/feature/user/model";
import database from "@/config/db";
import type { Nullable } from "@/type/nullable";
import logger from "@/config/logger";

export interface UserEvents extends EventMap {
    newUser: (user: User) => void;
}

export class UserManager extends (EventEmitter as new() => TypedEmitter<UserEvents>) {
    private static readonly i = new UserManager();
    public static get instance() {
        return this.i;
    }

    private constructor() {
        super();
    }

    public async hasUser(discordId: bigint): Promise<boolean> {
        const user = await database.user.findUnique({
            where: {
                id: discordId
            }
        });

        return !!user;
    }

    public async createUserIfNotExist(user: CreateUserOptions): Promise<Nullable<User>> {
        if (await this.hasUser(BigInt(user.discordId))) {
            return;
        }

        const created = await database.user.create({
            data: {
                id: BigInt(user.discordId)
            }
        });

        const result = {
            discordId: created.id.toString()
        };

        this.emit("newUser", result);
        return result;
    }
}

UserManager.instance.on("newUser", ({ discordId, bungieId }) => {
    logger.info(`[User Manager] New user created: Discord: ${discordId}${bungieId ? ` / Bungie: ${bungieId}` : ""}`);
});
