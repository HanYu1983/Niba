import { Text } from "./Text";

export type GlobalEffectAddText = {
    type: "AddText",
    cardIds: string[],
    text: Text
}

export type GlobalEffectRollAsG = {
    type: "自軍Gとしてロール",
    cardIds: string[],
}

export type GlobalEffect = GlobalEffectAddText | GlobalEffectRollAsG;
