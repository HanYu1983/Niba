export type TOriginTextID = ["origin", string, number]
export type TAddedTextID = ["added", string, string]
export type TTextID = TOriginTextID | TAddedTextID

function toString(t1: TTextID): string {
    return JSON.stringify(t1)
}

function eq(t1: TTextID, t2: TTextID): boolean {
    return JSON.stringify(t1) == JSON.stringify(t2)
}

function getCardID(t1: TTextID): string {
    return t1[1]
}

function getTextID(t1: TTextID): string | number {
    return t1[2]
}

export default {
    eq, toString, getCardID, getTextID
}