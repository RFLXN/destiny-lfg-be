import { procedure } from "@/app";
import { LFGActivityListSchema } from "@/feature/lfg/activity/model";
import { LFGActivityManager } from "@/feature/lfg/activity/manager";

export const getActivities = procedure
    .output(LFGActivityListSchema)
    .query(() => LFGActivityManager.instance.getActivities());
