import { z } from "zod";
import { LFGIdInputSchema } from "@/feature/lfg/model";

export class AlreadyJoinedError extends Error {
    constructor(lfgId: number, userId: string) {
        super(`User ${userId} already joined in LFG ${lfgId}`);
    }
}

export class AlreadyAlteredError extends Error {
    constructor(lfgId: number, userId: string) {
        super(`User ${userId} already altered in LFG ${lfgId}`);
    }
}

export class NotParticipatedError extends Error {
    constructor(lfgId: number, userId: string) {
        super(`User ${userId} is not participated in LFG ${lfgId}`);
    }
}

export type LFGMemberStatus = "JOINED" | "ALTERED" | "LEFT";

export const LFGParticipateOptionSchema = LFGIdInputSchema.extend({
    userId: z.string()
});

export const LFGParticipationResultSchema = z.enum([
    "SUCCESS", "ALREADY_JOINED", "ALREADY_ALTERED", "NOT_PARTICIPATED"
]);

export const LFGJoinResultSchema = LFGParticipationResultSchema.exclude(["ALREADY_ALTERED", "NOT_PARTICIPATED"]);

export const LFGAlterResultSchema = LFGParticipationResultSchema.exclude(["ALREADY_JOINED", "NOT_PARTICIPATED"]);

export const LFGLeaveResultSchema = LFGParticipationResultSchema.exclude(["ALREADY_JOINED", "ALREADY_ALTERED"]);
