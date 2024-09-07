import { resolve } from "path";

export const ROOT_PATH = resolve(__dirname, "../..");

export const SRC_PATH = resolve(ROOT_PATH, "src");

export const RESOURCE_PATH = resolve(ROOT_PATH, "resource");

export { resolve };
