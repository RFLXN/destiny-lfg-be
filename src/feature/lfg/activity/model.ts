import { z } from "zod";
import { LocaleCodeList } from "@/config/locale";
import { ZodLiteralType } from "@/util/zod";

export const LFGLocaleMapSchema = ZodLiteralType(LocaleCodeList, z.string());

const BaseLFGActivitySchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    maxJoinedMembers: z.number().optional(),
    nameLocale: LFGLocaleMapSchema,
    descriptionLocale: LFGLocaleMapSchema
});

export type LFGActivity = z.infer<typeof BaseLFGActivitySchema> & {
    children?: LFGActivity[];
};

export const LFGActivitySchema: z.ZodType<LFGActivity> = BaseLFGActivitySchema.extend({
    // lazy for self reference (recursive) type
    children: z.lazy(() => z.array(LFGActivitySchema).optional())
});

export const LFGActivityListSchema = z.array(LFGActivitySchema);

export type LFGActivityList = z.infer<typeof LFGActivityListSchema>;
