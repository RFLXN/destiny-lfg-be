import { procedure } from "@/app";

export const ping = procedure
    .query(() => "pong");
