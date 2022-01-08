import { CardPrototype, DEFAULT_CARD_PROTOTYPE } from "../model/gameContext";
import { CardColor } from "../model/basic";
import { RequireTarget } from "../model/blockPayload";

export function getPrototype(imgID: string): CardPrototype {
  try {
    return require(`./${imgID}.ts`);
  } catch (e) {
    console.error(`script/${imgID}.ts not found`);
  }
  return DEFAULT_CARD_PROTOTYPE;
}

export function getImgSrc(imgID: string) {
  return `https://storage.googleapis.com/particle-resources/cardPackage/gundamWarN/${imgID}.jpg`;
}

export function createRollCostRequire(
  costNum: number,
  color: CardColor | null
): RequireTarget {
  return {
    id: "RequireTarget",
    targets: {
      cards: {
        id: "カード",
        cardID: new Array(costNum).fill(null),
      },
    },
    action: [
      {
        id: "ActionConsumeG",
        cards: "cards",
        ...(color
          ? {
              color: {
                id: "カードの色",
                color: color,
              },
            }
          : null),
      },
    ],
  };
}
