import { initTRPC } from "@trpc/server";
import logger from "@/config/logger";

const t = initTRPC.create();

const procedure = t.procedure.use(async ({ path, type, next }) => {
    const begin = Date.now().valueOf();
    const result = await next();
    const end = Date.now().valueOf();
    const elapsed = end - begin;

    if (result.ok) {
        logger.info(`[tRPC] Respond with "ok" to ${path}.${type} (${elapsed}ms)`);
    } else {
        logger.error(`[tRPC] Respond with "error" to ${path}.${type} (${elapsed}ms)`, result.error);
    }

    return result;
});
const router = t.router;

export { procedure, router };
