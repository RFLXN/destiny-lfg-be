import {
    type LFGActivity, type LFGActivityList, LFGActivityListSchema
} from "@/feature/lfg/activity/model";
import { resolve, RESOURCE_PATH } from "@/config/path";
import { loadJsonWithType } from "@/util/json";
import database from "@/config/db";
import type { PrismaTransaction } from "@/type/prisma";
import logger from "@/config/logger";

export class LFGActivityManager {
    private static readonly i = new LFGActivityManager();
    public static get instance() {
        return this.i;
    }

    private cachedActivities: LFGActivity[] = [];

    private constructor() {
        // Prevent instantiation
    }

    public async initActivities(): Promise<void> {
        logger.info("[LFG Activity Manager] Initializing LFG activities...");
        await database.$transaction(async (transaction) => {
            logger.info("[LFG Activity Manager] Initializing: Clearing all existing activities...");
            await this.clearAll(transaction);
            logger.info("[LFG Activity Manager] Initializing: Loading bulk activities from local...");
            const activities = await this.loadBulkFromLocal();
            this.cachedActivities = activities;
            logger.info("[LFG Activity Manager] Initializing: Inserting bulk activities...");
            await this.insertBulk(activities, transaction);
        });
        logger.info("[LFG Activity Manager] LFG activities initialized.");
    }

    public getActivities(): LFGActivity[] {
        return this.cachedActivities;
    }

    private async loadBulkFromLocal(): Promise<LFGActivity[]> {
        const filePath = resolve(RESOURCE_PATH, "lfg-activities.json");
        return loadJsonWithType(filePath, LFGActivityListSchema);
    }

    private async traverseActivities(activities: LFGActivity[], callback: (activity: LFGActivity, parent?: LFGActivity) => Promise<void> | void, parent?: LFGActivity): Promise<void> {
        for (const activity of activities) {
            await callback(activity, parent); // Perform some operation on the current activity

            // Recursively traverse the children
            if (activity.children && activity.children.length > 0) {
                await this.traverseActivities(activity.children, callback, activity);
            }
        }
    }

    private async insertBulk(activities: LFGActivityList, transaction: PrismaTransaction): Promise<void> {
        await this.traverseActivities(activities, async (activity, parent) => {
            const targetObj = {
                id: activity.id,
                name: activity.name,
                description: activity.description,
                maxJoinedMembers: activity.maxJoinedMembers,
                nameLocale: activity.nameLocale,
                descriptionLocale: activity.descriptionLocale
            };
            if (parent) {
                await transaction.lFGActivity.create({
                    data: {
                        ...targetObj,
                        parentId: parent.id
                    }
                });
            } else {
                await transaction.lFGActivity.create({
                    data: targetObj
                });
            }
        });
    }

    private async clearAll(transaction: PrismaTransaction): Promise<void> {
        await transaction.lFGActivity.deleteMany();
    }
}
