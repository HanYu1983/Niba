import { TText } from "./Text";

export type GlobalEffectAddText = {
    type: "AddText",
    cardIds: string[],
    text: TText
}

export type GlobalEffectRollAsG = {
    type: "自軍Gとしてロール",
    cardIds: string[],
}

export type GlobalEffect = GlobalEffectAddText | GlobalEffectRollAsG;
