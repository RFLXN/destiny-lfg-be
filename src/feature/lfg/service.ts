import { procedure } from "@/app";
import { LFGManager } from "@/feature/lfg/manager";
import {
    CreateLFGOptionsSchema,
    GuildIdInputSchema, LFGIdInputSchema,
    LFGListSchema,
    LFGSchema,
    UpdateLFGOptionsSchema
} from "@/feature/lfg/model";

export const getLFGs = procedure
    .input(GuildIdInputSchema)
    .output(LFGListSchema)
    .query(async ({ input }) => {
        const { guildId } = input;
        return LFGManager.instance.getLFGs(guildId);
    });

export const createLFG = procedure
    .input(CreateLFGOptionsSchema)
    .output(LFGSchema)
    .mutation(async ({ input }) => {
        return LFGManager.instance.createLFG(input);
    });

export const updateLFG = procedure
    .input(UpdateLFGOptionsSchema)
    .output(LFGSchema)
    .mutation(async ({ input }) => {
        return LFGManager.instance.updateLFG(input.id, input);
    });

export const deleteLFG = procedure
    .input(LFGIdInputSchema)
    .mutation(async ({ input }) => {
        return LFGManager.instance.deleteLFG(input.id);
    });
