import { z } from "zod";

export function ZodLiteralType<KeyType extends string, ZodValueType extends z.ZodTypeAny>(
    keys: KeyType[],
    zodValueType: ZodValueType
) {
    return z.object(keys.reduce(
        (agg, k) => ({
            ...agg,
            [k]: zodValueType.optional()
        }),
        {} as Record<KeyType, z.ZodUnion<[ZodValueType, z.ZodUndefined]>>
    ));
}
