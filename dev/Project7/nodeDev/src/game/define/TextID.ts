export type OriginTextID = ["origin", string, number]
export type AddedTextID = ["added", string, string]
export type TextID = OriginTextID | AddedTextID

function inspect(t1: TextID): string {
    return JSON.stringify(t1)
}

function eq(t1: TextID, t2: TextID): boolean {
    return JSON.stringify(t1) == JSON.stringify(t2)
}

function getCardID(t1: TextID): string {
    return t1[1]
}

function getTextID(t1: TextID): string | number {
    return t1[2]
}

export const TextIDFns = {
    inspect, eq, getCardID, getTextID
}