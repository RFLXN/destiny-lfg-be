import { router } from "@/app";
import { createLFG, deleteLFG, getLFGs, updateLFG } from "@/feature/lfg/service";

const lfg = router({
    list: getLFGs,
    create: createLFG,
    update: updateLFG,
    delete: deleteLFG
});

export const appRouter = router({
    lfg
});

export type AppRouter = typeof appRouter;
