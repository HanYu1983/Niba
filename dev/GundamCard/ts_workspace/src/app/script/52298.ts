// キラ・ヤマト
//（戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。
import {
  Context,
  CardPosition,
  Action,
  Payment,
  Effect,
  ActionEffect,
} from "../types";
import { Card, getCard, mapCard, moveCard } from "../../tool/table";
import { askCardPosition, cardPositionID } from "../model/alg/tool";
import { getCardState } from "../model/alg/getCardState";
import { isBattlePhase } from "../model/alg/isBattlePhase";
import { mapCardState } from "../model/alg/mapCardState";

const abilitySpeed =
  "（戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。";

type Memory = {
  enableSpeed: boolean;
};

const DEFAULT_MEMORY: Memory = {
  enableSpeed: false,
};

module.exports.askAction = (ctx: Context, card: Card): Action[] => {
  const actions: Action[] = [];
  if (isBattlePhase(ctx)) {
    actions.push({
      id: "PlayCardAbilityAction",
      cardID: card.id,
      abilityID: abilitySpeed,
      playerID: card.ownerID || "",
    });
  }
  return [];
};

module.exports.askPlayAbilityPayment = (
  ctx: Context,
  card: Card,
  abilityID: string
): Payment[] => {
  switch (abilityID) {
    case abilitySpeed:
      return [
        {
          id: "ColorPayment",
          color: "任意",
          cardID: null,
          playerID: card.ownerID || "",
          tipCardID: [],
        },
        {
          id: "ColorPayment",
          color: "任意",
          cardID: null,
          playerID: card.ownerID || "",
          tipCardID: [],
        },
      ];
  }
  return [];
};

module.exports.askPlayPayment = (ctx: Context, card: Card): Payment[] => {
  return [
    {
      id: "ColorPayment",
      color: "白",
      cardID: null,
      playerID: card.ownerID || "",
      tipCardID: [],
    },
    {
      id: "GCountPayment",
      gCount: 4,
      playerID: card.ownerID || "",
      tipCardID: [],
    },
  ];
};

module.exports.onEffect = (
  ctx: Context,
  card: Card,
  effect: ActionEffect
): Context => {
  switch (effect.action.id) {
    case "PlayCardAbilityAction": {
      switch (effect.action.abilityID) {
        case abilitySpeed:
          mapCardState(ctx, [card.id], (cardID, _card, cardState) => {
            let memory: Memory = cardState.memory || DEFAULT_MEMORY;
            memory = {
              ...memory,
              enableSpeed: true,
            };
            return {
              ...cardState,
              memory,
            };
          });
          break;
      }
    }
  }
  return ctx;
};

module.exports.onEndTurn = (ctx: Context, card: Card): Context => {
  ctx = mapCardState(ctx, [card.id], (cardID, _card, cardState) => {
    let memory: Memory = cardState.memory || DEFAULT_MEMORY;
    memory = {
      ...memory,
      enableSpeed: false,
    };
    return {
      ...cardState,
      memory,
    };
  });
  return ctx;
};
