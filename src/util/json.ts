import { readFile } from "fs/promises";
import type { PathLike } from "fs";
import type { z } from "zod";

export async function loadJson<T>(filePath: PathLike): Promise<T> {
    const raw = await readFile(filePath);
    return JSON.parse(raw.toString()) as T;
}

export async function loadJsonWithType<T extends z.ZodTypeAny>(filePath: PathLike, schema: T): Promise<z.infer<T>> {
    const raw = await loadJson<z.infer<T>>(filePath);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return schema.parse(raw);
}
