import { procedure } from "@/app";
import {
    AlreadyAlteredError,
    AlreadyJoinedError,
    LFGAlterResultSchema,
    LFGJoinResultSchema,
    LFGLeaveResultSchema,
    LFGParticipateOptionSchema,
    NotParticipatedError
} from "@/feature/lfg/member/model";
import { LFGMemberManager } from "@/feature/lfg/member/manager";

export const joinLFG = procedure
    .input(LFGParticipateOptionSchema)
    .output(LFGJoinResultSchema)
    .mutation(async ({ input }) => {
        try {
            await LFGMemberManager.instance.joinLFG(input.id, input.userId);
            return "SUCCESS";
        } catch (e) {
            if (e instanceof AlreadyJoinedError) return "ALREADY_JOINED";
            else throw e;
        }
    });

export const alterLFG = procedure
    .input(LFGParticipateOptionSchema)
    .output(LFGAlterResultSchema)
    .mutation(async ({ input }) => {
        try {
            await LFGMemberManager.instance.alterLFG(input.id, input.userId);
            return "SUCCESS";
        } catch (e) {
            if (e instanceof AlreadyAlteredError) return "ALREADY_ALTERED";
            else throw e;
        }
    });

export const leaveLFG = procedure
    .input(LFGParticipateOptionSchema)
    .output(LFGLeaveResultSchema)
    .mutation(async ({ input }) => {
        try {
            await LFGMemberManager.instance.leaveLFG(input.id, input.userId);
            return "SUCCESS";
        } catch (e) {
            if (e instanceof NotParticipatedError) return "NOT_PARTICIPATED";
            else throw e;
        }
    });
