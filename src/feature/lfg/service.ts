import { procedure } from "@/app";
import { LFGManager } from "@/feature/lfg/manager";
import {
    CreateLFGOptionsSchema,
    GuildIdInputSchema,
    LFGIdInputSchema,
    LFGSchema, LFGWithUserListSchema, LFGWithUsersSchema,
    UpdateLFGOptionsSchema
} from "@/feature/lfg/model";

export const getLFGs = procedure
    .input(GuildIdInputSchema)
    .output(LFGWithUserListSchema)
    .query(async ({ input }) => {
        const { guildId } = input;
        return (await LFGManager.instance.getLFGs(guildId))
            .map(lfg => ({
                ...lfg,
                when: lfg.when.valueOf(),
                createdAt: lfg.createdAt.valueOf(),
                updatedAt: lfg.updatedAt.valueOf()
            }));
    });

export const createLFG = procedure
    .input(CreateLFGOptionsSchema)
    .output(LFGSchema)
    .mutation(async ({ input }) => {
        const created = await LFGManager.instance.createLFG({
            ...input,
            when: new Date(input.when)
        });

        return {
            ...created,
            when: created.when.valueOf(),
            createdAt: created.createdAt.valueOf(),
            updatedAt: created.updatedAt.valueOf()
        };
    });

export const updateLFG = procedure
    .input(UpdateLFGOptionsSchema)
    .output(LFGWithUsersSchema)
    .mutation(async ({ input }) => {
        const updated = await LFGManager.instance.updateLFG(input.id, {
            ...input, when: new Date(input.when)
        });

        return {
            ...updated,
            when: updated.when.valueOf(),
            createdAt: updated.createdAt.valueOf(),
            updatedAt: updated.updatedAt.valueOf()
        };
    });

export const deleteLFG = procedure
    .input(LFGIdInputSchema)
    .mutation(async ({ input }) => {
        return LFGManager.instance.deleteLFG(input.id);
    });
