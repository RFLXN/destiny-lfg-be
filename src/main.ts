import "@/env";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { WebSocketServer } from "ws";
import { appRouter, type AppRouter } from "@/router";
import logger from "@/config/logger";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { LFGActivityManager } from "@/feature/lfg/activity/manager";

(async () => {
    let port = Number(process.env.PORT);
    if (isNaN(port)) {
        port = 3000;
    }

    // init HTTP server
    const server = createHTTPServer<AppRouter>({
        router: appRouter
    });

    // init WS server
    const wss = new WebSocketServer({ server });
    applyWSSHandler<AppRouter>({
        wss, router: appRouter
    });

    // init Managers
    await LFGActivityManager.instance.initActivities();

    // listen server
    server.listen(port, () => {
        logger.info(`Sever listening on port ${port}`);
    });
})().catch(console.error);
