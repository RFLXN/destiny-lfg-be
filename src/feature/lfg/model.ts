import { z } from "zod";

export const GuildIdInputSchema = z.object({ guildId: z.string() });

export const LFGIdInputSchema = z.object({ id: z.number() });

export interface CreateLFGOptions {
    description: string;
    guildId: string;
    activityId: number;
    when: Date;
    creatorId: string;
}

export const CreateLFGOptionsSchema = z.object({
    description: z.string(),
    guildId: z.string(),
    activityId: z.number(),
    when: z.date(),
    creatorId: z.string()
});

export const UpdateLFGOptionsSchema = CreateLFGOptionsSchema
    .omit({ guildId: true, creatorId: true })
    .extend({ id: z.number() });

export interface LFG extends CreateLFGOptions {
    id: number;
    createdAt: Date;
    updatedAt: Date;
}

export const LFGSchema = CreateLFGOptionsSchema.extend({
    id: z.number(),
    createdAt: z.date(),
    updatedAt: z.date()
});

export const LFGListSchema = z.array(LFGSchema);

export class LFGNotExistError extends Error {
    constructor(id: number) {
        super(`LFG '${id}' does not exist.`);
    }
}
