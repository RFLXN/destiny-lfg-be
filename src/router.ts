import { router } from "@/app";
import { createLFG, deleteLFG, getLFGs, updateLFG } from "@/feature/lfg/service";
import { alterLFG, joinLFG, leaveLFG } from "@/feature/lfg/member/service";
import { ping } from "@/feature/ping";

const member = router({
    join: joinLFG,
    alter: alterLFG,
    leave: leaveLFG
});

const lfg = router({
    list: getLFGs,
    create: createLFG,
    update: updateLFG,
    delete: deleteLFG,
    member
});

export const appRouter = router({
    lfg,
    ping
});

export type AppRouter = typeof appRouter;
