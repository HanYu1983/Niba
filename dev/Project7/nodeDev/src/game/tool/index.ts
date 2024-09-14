import { v7 } from "uuid";

export const ToolFn = {
    getUUID(prefix: string = ""): string {
        return prefix + "_" + v7()
    }
}