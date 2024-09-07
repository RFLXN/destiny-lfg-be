import * as runtime from "@prisma/client/runtime/library";
import type { PrismaClient } from "@prisma/client";

export type PrismaTransaction = Omit<PrismaClient, runtime.ITXClientDenyList>;
