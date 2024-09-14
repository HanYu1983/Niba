import { v7 } from "uuid";

export const ToolFn = {
    getUUID(): string {
        return v7()
    }
}