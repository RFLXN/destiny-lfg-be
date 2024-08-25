import { EventEmitter } from "events";
import type { default as TypedEmitter, EventMap } from "typed-emitter";
import { type CreateLFGOptions, type LFG, LFGNotExistError, type LFGWithUsers } from "@/feature/lfg/model";
import database from "@/config/db";
import logger from "@/config/logger";
import { UserManager } from "@/feature/user/manager";
import type { Nullable } from "@/type/nullable";
import { LFGMemberManager } from "@/feature/lfg/member/manager";

export interface LFGEvents extends EventMap {
    error: (error: Error) => void;
    newLFG: (lfg: LFG) => void;
    updateLFG: (before: LFG, after: LFG) => void;
    deleteLFG: (lfgId: number) => void;
}

export class LFGManager extends (EventEmitter as new() => TypedEmitter<LFGEvents>) {
    private static readonly i = new LFGManager();
    public static get instance() {
        return this.i;
    }

    private constructor() {
        super();
    }

    public async hasLFG(lfgId: number): Promise<boolean> {
        return !!await database.lFG.findUnique({ where: { id: lfgId } });
    }

    public async getLFG(lfgId: number): Promise<Nullable<LFG>> {
        const raw = await database.lFG.findUnique({ where: { id: lfgId } });
        if (!raw) return;

        return {
            ...raw,
            creatorId: raw.creatorId.toString(),
            guildId: raw.guildId.toString(),
            activityId: raw.lfgActivityId
        };
    }

    public async createLFG(lfg: CreateLFGOptions): Promise<LFG> {
        await UserManager.instance.createUserIfNotExist({ discordId: lfg.creatorId });

        const created = await database.lFG.create({
            data: {
                description: lfg.description,
                guildId: BigInt(lfg.guildId),
                activity: {
                    connect: { id: lfg.activityId }
                },
                when: lfg.when,
                creator: {
                    connect: { id: BigInt(lfg.creatorId) }
                }
            }
        });

        await LFGMemberManager.instance.joinLFG(created.id, lfg.creatorId);

        const result = {
            ...created,
            activityId: created.lfgActivityId,
            guildId: created.guildId.toString(),
            creatorId: created.creatorId.toString()
        };

        this.emit("newLFG", result);
        return result;
    }

    public async getLFGs(guildId: string): Promise<LFGWithUsers[]> {
        return (await database.lFG.findMany({
            relationLoadStrategy: "join",
            where: {
                guildId: BigInt(guildId)
            },
            include: {
                joinedMembers: {
                    include: {
                        user: true
                    }
                },
                alteredMembers: {
                    include: {
                        user: true
                    }
                }
            }
        })).map(l => ({
            ...l,
            activityId: l.lfgActivityId,
            creatorId: l.creatorId.toString(),
            guildId: l.guildId.toString(),
            joinedMembers: l.joinedMembers.map(u => ({ discordId: u.user.id.toString(), bungieId: u.user?.bungieId?.toString() })),
            alteredMembers: l.alteredMembers.map(u => ({ discordId: u.user.id.toString(), bungieId: u.user?.bungieId?.toString() }))
        }));
    }

    public async updateLFG(id: number, lfg: Omit<CreateLFGOptions, "creatorId" | "guildId">): Promise<LFGWithUsers> {
        const before = await this.getLFG(id);
        if (!before) throw new LFGNotExistError(id);

        const updated = await database.lFG.update({
            relationLoadStrategy: "join",
            where: { id },
            data: {
                description: lfg.description,
                activity: {
                    connect: { id: lfg.activityId }
                },
                when: lfg.when
            },
            include: {
                joinedMembers: {
                    include: {
                        user: true
                    }
                },
                alteredMembers: {
                    include: {
                        user: true
                    }
                }
            }
        });

        const result = {
            ...updated,
            activityId: updated.lfgActivityId,
            guildId: updated.guildId.toString(),
            creatorId: updated.creatorId.toString(),
            joinedMembers: updated.joinedMembers.map(u => ({ discordId: u.user.id.toString(), bungieId: u.user?.bungieId?.toString() })),
            alteredMembers: updated.alteredMembers.map(u => ({ discordId: u.user.id.toString(), bungieId: u.user?.bungieId?.toString() }))
        };

        this.emit("updateLFG", before, result);
        return result;
    }

    public async deleteLFG(id: number) {
        if (!await this.hasLFG(id)) throw new LFGNotExistError(id);

        await database.lFG.delete({ where: { id } });
        this.emit("deleteLFG", id);
    }
}

LFGManager.instance.on("newLFG", ({ id, description, activityId, creatorId }) => {
    logger.info(`[LFG Manager] New LFG created: (ID: ${id} / Activity: ${activityId}) ${description} by ${creatorId}`);
});

LFGManager.instance.on("updateLFG", (before, after) => {
    logger.info(`[LFG Manager] LFG updated: (ID: ${before.id} / Activity: ${before.activityId}) ${before.description}\n\t\t\t\t\t-> (Activity: ${after.activityId}) ${after.description}`);
});

LFGManager.instance.on("deleteLFG", (id) => {
    logger.info(`[LFG Manager] LFG deleted: (ID: ${id})`);
});
