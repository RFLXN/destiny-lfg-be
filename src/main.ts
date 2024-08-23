import "@/env";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { WebSocketServer } from "ws";
import { appRouter, type AppRouter } from "@/router";
import logger from "@/config/logger";
import { applyWSSHandler } from "@trpc/server/adapters/ws";

let port = Number(process.env.PORT);
if (isNaN(port)) {
    port = 3000;
}

const server = createHTTPServer<AppRouter>({
    router: appRouter
});

const wss = new WebSocketServer({ server });

applyWSSHandler<AppRouter>({
    wss, router: appRouter
});

server.listen(port, () => {
    logger.info(`Sever listening on port ${port}`);
});
