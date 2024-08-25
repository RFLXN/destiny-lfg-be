import { z } from "zod";
import { LFGParticipateOptionSchema } from "@/feature/lfg/member/model";

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
    when: z.number(),
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

export interface LFGWithUsers extends LFG {
    joinedMembers: { discordId: string; bungieId?: string }[];
    alteredMembers: { discordId: string; bungieId?: string }[];
}

export const LFGSchema = CreateLFGOptionsSchema.extend({
    id: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
});

const LFGParticipantSchema = z.object({
    discordId: z.string(),
    bungieId: z.string().optional()
});

export const LFGWithUsersSchema = LFGSchema.extend({
    joinedMembers: z.array(LFGParticipantSchema),
    alteredMembers: z.array(LFGParticipantSchema)
});

export const LFGListSchema = z.array(LFGSchema);

export const LFGWithUserListSchema = z.array(LFGWithUsersSchema);

export class LFGNotExistError extends Error {
    constructor(id: number) {
        super(`LFG '${id}' does not exist.`);
    }
}
