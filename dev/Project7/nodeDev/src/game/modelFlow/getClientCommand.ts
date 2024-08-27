import { log2 } from "../../tool/logger";
import { getCardState } from "../gameState/CardStateComponent";
import { getBlockOwner } from "../gameState/GameState";
import { GameContext } from "./GameContext";

export function getClientCommand(ctx: GameContext, clientID: string) {
    return ctx.gameState.commandEffect.filter((effect) => {
      const controller = getBlockOwner(effect);
      if (controller != clientID) {
        log2("getClientCommand", "you are not owner. return");
        return;
      }
      if (effect.cause?.id != "BlockPayloadCauseUpdateCommand") {
        throw new Error("must from command cause");
      }
      const { cardID, cardTextID } = effect.cause;
      // 在堆疊裡的技能不能再次發動(記免同一個技能一直切入)
      if (
        ctx.gameState.stackEffect.filter((e) => {
          if (e.cause?.id != "BlockPayloadCauseUpdateCommand") {
            return false;
          }
          if (e.cause.cardTextID != cardTextID) {
            return false;
          }
          return true;
        }).length
      ) {
        log2("getClientCommand", `cardTextID(${cardTextID})已經在堆疊裡.`);
        return;
      }
      const cardState = getCardState(ctx.gameState, cardID);
      const text = cardState.cardTextStates.find((v) => v.id == cardTextID);
      if (text == null) {
        throw new Error("must find text");
      }
      const siYouTiming = (() => {
        switch (text.cardText.id) {
          case "使用型":
            return text.cardText.timing;
          case "恒常":
          case "特殊型": {
            const t = text.cardText.texts.find((v) => v.id == "使用型");
            if (t == null) {
              throw new Error("t must find");
            }
            if (t.id != "使用型") {
              throw new Error("t must be 使用型");
            }
            return t.timing;
          }
          default:
            throw new Error("not support:" + text.cardText.id);
        }
      })();
      switch (siYouTiming[0]) {
        case "自軍":
          if (ctx.gameState.activePlayerID != clientID) {
            log2(
              "getClientCommand",
              `ctx.gameState.activePlayerID != ${clientID}`,
              effect
            );
            return;
          }
          break;
        case "敵軍":
          if (ctx.gameState.activePlayerID == clientID) {
            log2(
              "getClientCommand",
              `ctx.gameState.activePlayerID == ${clientID}`,
              effect
            );
            return;
          }
          break;
        case "戦闘フェイズ":
          if (ctx.gameState.timing[1][0] != "戦闘フェイズ") {
            log2(
              "getClientCommand",
              `ctx.gameState.timing[1][0] != "戦闘フェイズ"`,
              effect
            );
            return;
          }
          break;
        case "攻撃ステップ":
        case "防御ステップ":
        case "ダメージ判定ステップ":
        case "帰還ステップ":
          if (ctx.gameState.timing[1][0] != "戦闘フェイズ") {
            log2(
              "getClientCommand",
              `ctx.gameState.timing[1][0] != "戦闘フェイズ"`,
              effect
            );
            return;
          }
          if (ctx.gameState.timing[1][1] != siYouTiming[0]) {
            log2(
              "getClientCommand",
              `ctx.gameState.timing[1][1] != ${siYouTiming[0]}`,
              effect
            );
            return;
          }
          break;
      }
      switch (siYouTiming[0]) {
        case "自軍":
        case "敵軍":
          switch (siYouTiming[1]) {
            case "配備フェイズ":
            case "戦闘フェイズ":
              if (ctx.gameState.timing[1][0] != siYouTiming[1]) {
                log2(
                  "getClientCommand",
                  `ctx.gameState.timing[1][0] != ${siYouTiming[1]}`,
                  effect
                );
                return;
              }
              break;
            case "攻撃ステップ":
            case "防御ステップ":
            case "ダメージ判定ステップ":
            case "帰還ステップ":
              if (ctx.gameState.timing[1][0] != "戦闘フェイズ") {
                log2(
                  "getClientCommand",
                  `ctx.gameState.timing[1][0] != "戦闘フェイズ"`,
                  effect
                );
                return;
              }
              if (ctx.gameState.timing[1][1] != siYouTiming[1]) {
                log2(
                  "getClientCommand",
                  `ctx.gameState.timing[1][1] != ${siYouTiming[1]}`,
                  effect
                );
                return;
              }
              break;
          }
          break;
      }
      return true;
    });
  }
  
  