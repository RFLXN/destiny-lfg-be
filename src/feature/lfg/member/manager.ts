import { EventEmitter } from "events";
import type { default as TypedEmitter, EventMap } from "typed-emitter";
import database from "@/config/db";
import { LFGNotExistError } from "@/feature/lfg/model";
import {
    AlreadyAlteredError,
    AlreadyJoinedError,
    type LFGMemberStatus,
    NotParticipatedError
} from "@/feature/lfg/member/model";
import logger from "@/config/logger";

export interface LFGMemberEvents extends EventMap {
    newJoin: (lfgId: number, userId: string) => void;
    newAlter: (lfgId: number, userId: string) => void;
    leave: (lfgId: number, userId: string) => void;
    joinFromAlter: (lfgId: number, userId: string) => void;
    alterFromJoin: (lfgId: number, userId: string) => void;
}

export class LFGMemberManager extends (EventEmitter as new() => TypedEmitter<LFGMemberEvents>) {
    private static readonly i = new LFGMemberManager();
    public static get instance() {
        return this.i;
    }

    private constructor() {
        super();
    }

    public async getLFGMembers(lfgId: number) {
        const res = (await database.lFG.findUnique({
            relationLoadStrategy: "join",
            where: {
                id: lfgId
            },
            include: {
                joinedMembers: true,
                alteredMembers: true
            }
        }));

        if (!res) throw new LFGNotExistError(lfgId);

        return {
            joined: res.joinedMembers,
            altered: res.alteredMembers
        };
    }

    public async isParticipant(lfgId: number, userId: string): Promise<LFGMemberStatus> {
        const members = await this.getLFGMembers(lfgId);
        const biUserId = BigInt(userId);

        if (members.joined.find(m => m.userId == biUserId)) return "JOINED";
        if (members.altered.find(m => m.userId == biUserId)) return "ALTERED";

        return "LEFT";
    }

    public async joinLFG(lfgId: number, userId: string) {
        const status = await this.isParticipant(lfgId, userId);

        if (status == "JOINED") throw new AlreadyJoinedError(lfgId, userId);
        if (status == "ALTERED") await this.deleteAlteredMember(lfgId, userId);
        await this.createJoinedMember(lfgId, userId);

        if (status == "ALTERED") this.emit("joinFromAlter", lfgId, userId);
        else this.emit("newJoin", lfgId, userId);
    }

    public async alterLFG(lfgId: number, userId: string) {
        const status = await this.isParticipant(lfgId, userId);

        if (status == "ALTERED") throw new AlreadyAlteredError(lfgId, userId);
        if (status == "JOINED") await this.deleteJoinedMember(lfgId, userId);
        await this.createAlteredMember(lfgId, userId);

        if (status == "JOINED") this.emit("alterFromJoin", lfgId, userId);
        else this.emit("newAlter", lfgId, userId);
    }

    public async leaveLFG(lfgId: number, userId: string) {
        const status = await this.isParticipant(lfgId, userId);

        if (status == "LEFT") throw new NotParticipatedError(lfgId, userId);
        if (status == "JOINED") await this.deleteJoinedMember(lfgId, userId);
        else await this.deleteAlteredMember(lfgId, userId);

        this.emit("leave", lfgId, userId);
    }

    private async createJoinedMember(lfgId: number, userId: string) {
        await database.lFGJoinedMember.create({
            data: {
                lfgId: lfgId,
                userId: BigInt(userId)
            }
        });
    }

    private async createAlteredMember(lfgId: number, userId: string) {
        await database.lFGAlteredMember.create({
            data: {
                lfgId: lfgId,
                userId: BigInt(userId)
            }
        });
    }

    private async deleteJoinedMember(lfgId: number, userId: string) {
        await database.lFGJoinedMember.delete({
            where: {
                lfgId_userId: {
                    lfgId, userId: BigInt(userId)
                }
            }
        });
    }

    private async deleteAlteredMember(lfgId: number, userId: string) {
        await database.lFGAlteredMember.delete({
            where: {
                lfgId_userId: {
                    lfgId, userId: BigInt(userId)
                }
            }
        });
    }
}

LFGMemberManager.instance.on("newJoin", (lfgId, userId) => {
    logger.info(`[LFG Member Manager] User ${userId} joined in LFG ${lfgId}`);
});

LFGMemberManager.instance.on("newAlter", (lfgId, userId) => {
    logger.info(`[LFG Member Manager] User ${userId} altered in LFG ${lfgId}`);
});

LFGMemberManager.instance.on("leave", (lfgId, userId) => {
    logger.info(`[LFG Member Manager] User ${userId} left from LFG ${lfgId}`);
});

LFGMemberManager.instance.on("joinFromAlter", (lfgId, userId) => {
    logger.info(`[LFG Member Manager] User ${userId} joined in LFG ${lfgId} from altered`);
});

LFGMemberManager.instance.on("alterFromJoin", (lfgId, userId) => {
    logger.info(`[LFG Member Manager] User ${userId} altered in LFG ${lfgId} from joined`);
});
