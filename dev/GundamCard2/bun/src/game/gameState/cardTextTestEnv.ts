import { dropRepeats, repeat } from "ramda";
import { loadPrototype, getPrototype } from "../../script";
import { AbsoluteBaSyouFn } from "../define/BaSyou";
import { PlayerA, PlayerB } from "../define/PlayerID";
import { setActivePlayerID } from "./ActivePlayerComponent";
import { addCards, createCardWithProtoIds, getCard } from "./CardTableComponent";
import { createPlayEffects } from "./createPlayEffects";
import { createCommandEffectTips, setTipSelectionForUser, doEffect } from "./doEffect";
import { addDestroyEffect, getImmediateEffects, getTopEffect, removeEffect } from "./EffectStackComponent";
import { createGameState, GameState } from "./GameState";
import { setPhase } from "./PhaseComponent";
import { SiYouTiming } from "../define/Timing";
import { logCategory } from "../../tool/logger";
import { GameEvent } from "../define/GameEvent";
import { doTriggerEvent } from "./doTriggerEvent";
import { CommandEffecTipFn } from "../define/CommandEffectTip";
import { mapItemState, setItemState } from "./ItemStateComponent";
import { CardPrototype } from "../define/CardPrototype";
import { CardText, TextSpeicalEffectFn } from "../define/CardText";
import { setSetGroupParent } from "./SetGroupComponent";
import { getGlobalEffects, setGlobalEffects } from "./globalEffects";
import { checkIsBattle } from "./IsBattleComponent";
import { isCardMaster } from "./card";
import { createTextsFromSpecialEffect } from "./createTextsFromSpecialEffect";
import { doCutInDestroyEffectsAndClear } from "./doCutInDestroyEffectsAndClear";
import { createDestroyEffect } from "./createDestroyEffect";
import { getItemIdsByBasyou, getItemPrototype } from "./ItemTableComponent";
import { getPlayerHandIds } from "./player";
import { createBridge } from "../bridge/createBridge";

export async function testAllCardTextTestEnv() {
  const extIds = ["unit", "unitHasPhy", "charBlue", "unitHasGain", "charBlueNT", "unitHasRange"]
  const all = createDecks().flatMap(v => v).concat(...extIds)
  for (const id of all) {
    await loadPrototype(id)
  }
  extIds.map(getPrototype).forEach(proto => {
    proto.texts?.flatMap(text => text.title[0] == "特殊型" ? createTextsFromSpecialEffect(text, {}) : []).forEach(text => {
      testText(proto, text, { isCheckDescription: true })
    })
  })
  dropRepeats(all).map(getPrototype).forEach(proto => {
    if (proto.commandText) {
      testText(proto, proto.commandText)
    }
    proto.texts?.forEach(text => {
      testText(proto, text)
    })
  })
}

export function testText(proto: CardPrototype, text: CardText, options?: { isCheckDescription?: boolean }) {
  if (text.testEnvs) {
    text.testEnvs.forEach(testEnv => {
      let ctx = createGameState()
      if (proto.commandText) {
        ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), [proto.id || "unknown"]) as GameState
        ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), repeat(proto.id || "unknown", 9)) as GameState
      }
      ctx = setActivePlayerID(ctx, PlayerA) as GameState
      const originGesLength = getGlobalEffects(ctx, null).length
      if (testEnv.thisCard) {
        const [side, kw, card, state] = testEnv.thisCard
        card.id = "TestCard"
        ctx = addCards(ctx, AbsoluteBaSyouFn.of(side == "自軍" ? PlayerA : PlayerB, kw), [card]) as GameState
        if (state) {
          ctx = mapItemState(ctx, card.id, is => ({ ...is, ...state })) as GameState
          if (state.destroyReason) {
            ctx = addDestroyEffect(ctx, createDestroyEffect(ctx, state.destroyReason, card.id)) as GameState
          }
        }
      }
      if (testEnv.addCards) {
        for (const [side, kw, cards] of testEnv.addCards) {
          ctx = addCards(ctx, AbsoluteBaSyouFn.of(side == "自軍" ? PlayerA : PlayerB, kw), cards) as GameState
        }
      }
      if (testEnv.createCards) {
        for (const [side, kw, pairs] of testEnv.createCards) {
          for (const [protoId, num] of pairs) {
            ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(side == "自軍" ? PlayerA : PlayerB, kw), repeat(protoId, num)) as GameState
          }
        }
      }
      const ges = getGlobalEffects(ctx, null)
      ctx = checkIsBattle(ctx) as GameState
      ctx = doCutInDestroyEffectsAndClear(ctx, null, { ges: ges })
      if (testEnv.setGroupParent) {
        for (const cardId in testEnv.setGroupParent) {
          const parent = testEnv.setGroupParent[cardId]
          ctx = setSetGroupParent(ctx, parent, cardId) as GameState
        }
      }
      try {
        switch (text.title[0]) {
          case "使用型": {
            ctx = setGameStateWithUseTiming(ctx, text.title[1])
            let effects = createPlayEffects(ctx, PlayerA, { ges: ges })
            let effect: any = null
            if (options?.isCheckDescription) {
              effect = effects.find(eff => eff.text.description == text.description)
            } else {
              effect = effects.find(eff => eff.text.id == text.id)
            }
            if (effect == null) {
              console.log(effects, text.id, text.description)
              throw new Error()
            }
            const cets = createCommandEffectTips(ctx, effect).filter(CommandEffecTipFn.filterNoError)
            if (cets.length == 0) {
              console.log(createCommandEffectTips(ctx, effect).map(toe => toe.tipOrErrors))
              throw new Error()
            }
            let successCount = 0
            cets.forEach(cet => {
              logCategory("testText", "cets.forEach", effect.description, cet.logicID, cet.logicSubID)
              ctx = setTipSelectionForUser(ctx, effect, cet.logicID, cet.logicSubID)
              ctx = doEffect(ctx, effect, cet.logicID, cet.logicSubID)
              for (let i = 0; i < 99; ++i) {
                let effect = getTopEffect(ctx)
                if (effect) {
                  ctx = doEffect(ctx, effect, 0, 0)
                  ctx = removeEffect(ctx, effect.id) as GameState
                }
                effect = getImmediateEffects(ctx)[0]
                if (effect) {
                  ctx = setTipSelectionForUser(ctx, effect, 0, 0)
                  ctx = doEffect(ctx, effect, 0, 0)
                  ctx = removeEffect(ctx, effect.id) as GameState
                }
              }
              successCount++
            })
            if (successCount != cets.length) {
              throw new Error()
            }
            break
          }
          case "自動型": {
            if (testEnv.phase) {
              ctx = setPhase(ctx, testEnv.phase) as GameState
            }
            let ges = getGlobalEffects(ctx, null)
            switch (text.title[1]) {
              case "起動": {
                const card = testEnv.thisCard?.[2]
                if (card == null) {
                  throw new Error()
                }
                if (testEnv.eventTitle) {
                  const gameEvent: GameEvent = {
                    title: testEnv.eventTitle,
                    cardIds: [card.id]
                  }
                  ctx = doTriggerEvent(ctx, gameEvent, { ges: ges })
                } else if (testEnv.event) {
                  ctx = doTriggerEvent(ctx, testEnv.event, { ges: ges })
                } else {
                  throw new Error("must has event")
                }
                const effect: any = getImmediateEffects(ctx).find(eff => eff.text.id == text.id)
                if (effect == null) {
                  console.log(text.description)
                  throw new Error()
                }
                const cets = createCommandEffectTips(ctx, effect).filter(CommandEffecTipFn.filterNoError)
                if (cets.length == 0) {
                  console.log(createCommandEffectTips(ctx, effect).map(cet => cet.tipOrErrors))
                  throw new Error()
                }
                let successCount = 0
                cets.forEach(cet => {
                  ctx = setTipSelectionForUser(ctx, effect, cet.logicID, cet.logicSubID)
                  ctx = doEffect(ctx, effect, cet.logicID, cet.logicSubID)
                  for (let i = 0; i < 99; ++i) {
                    let effect = getTopEffect(ctx)
                    if (effect) {
                      ctx = doEffect(ctx, effect, 0, 0)
                      ctx = removeEffect(ctx, effect.id) as GameState
                    }
                  }
                  successCount++
                })
                if (successCount != cets.length) {
                  throw new Error()
                }
                break
              }
              case "常駐":
              case "恒常": {
                const currentGes = getGlobalEffects(ctx, null)
                if (currentGes.length == originGesLength) {
                  throw new Error()
                }
                ges = currentGes
                const hasThisCardInHand = getPlayerHandIds(ctx, PlayerA).find(itemId => getCard(ctx, itemId).protoID == proto.id)
                if (hasThisCardInHand) {
                  const effects = createPlayEffects(ctx, PlayerA, { ges: ges }).filter(eff => eff.reason[0] == "PlayCard" && eff.reason[3].isPlayG != true)
                  let successCount = 0
                  effects.forEach(effect => {
                    ctx = setTipSelectionForUser(ctx, effect, 0, 0)
                    ctx = doEffect(ctx, effect, 0, 0)
                    for (let i = 0; i < 99; ++i) {
                      let effect = getTopEffect(ctx)
                      if (effect) {
                        ctx = doEffect(ctx, effect, 0, 0)
                        ctx = removeEffect(ctx, effect.id) as GameState
                      }
                      effect = getImmediateEffects(ctx)[0]
                      if (effect) {
                        ctx = setTipSelectionForUser(ctx, effect, 0, 0)
                        ctx = doEffect(ctx, effect, 0, 0)
                        ctx = removeEffect(ctx, effect.id) as GameState
                      }
                    }
                    successCount++
                  })
                  if (successCount != effects.length) {
                    throw new Error()
                  }
                }
              }
            }
            break
          }
        }
        if(testEnv.checkFn){
          testEnv.checkFn(ctx, createBridge({ges: getGlobalEffects(ctx, null)}))
        }
        logCategory("testAllCardTextTestEnv", `TestEnv Pass: ${proto.id} ${text.description}`)
      } catch (e) {
        console.log(e)
        console.log(ctx.activePlayerID)
        console.log(ctx.phase)
        console.log(text.description)
        throw new Error()
      }
    })
  }
}

export function createDecks(): string[][] {
  const DECK_BLACK_T3 = ["179015_04B_O_BK010C_black", "179015_04B_O_BK010C_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK061C_black", "179015_04B_U_BK061C_black", "179016_04B_U_BK066C_black", "179016_04B_U_BK066C_black", "179019_02A_C_BK015S_black", "179019_02A_C_BK015S_black", "179020_05C_U_BK100U_black", "179020_05C_U_BK100U_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK049U_black", "179023_06C_C_BK049U_black", "179024_04B_C_BK027U_black", "179024_04B_C_BK027U_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK067C_black", "179024_04B_U_BK067C_black", "179024_B2B_C_BK054C_black", "179024_B2B_C_BK054C_black", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK129R_black", "179024_B2B_U_BK129R_black", "179027_09D_C_BK063R_black", "179027_09D_C_BK063R_black", "179027_09D_O_BK010N_black", "179027_09D_O_BK010N_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179029_06C_C_BK045U_black", "179029_06C_C_BK045U_black", "179029_B3C_C_BK071N_black", "179029_B3C_C_BK071N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK185N_black", "179029_B3C_U_BK185N_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179901_B2B_C_BK005P_black"]
  const DECK_WHITE_SPEED = ["179001_01A_CH_WT007R_white", "179004_01A_CH_WT009R_white", "179004_01A_CH_WT010C_white", "179007_02A_U_WT027U_white", "179007_02A_U_WT027U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179014_03B_CH_WT027R_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179019_01A_C_WT010C_white", "179019_01A_C_WT010C_white", "179019_02A_U_WT028R_white", "179019_02A_U_WT028R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179023_06C_CH_WT067C_white", "179024_03B_U_WT057U_white", "179024_03B_U_WT057U_white", "179025_07D_C_WT060U_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179027_09D_C_WT067R_white", "179027_09D_C_WT067R_white", "179029_B3C_CH_WT102R_white", "179029_B3C_CH_WT103N_white", "179029_B3C_U_WT196R_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_CH_WT108N_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_CG_C_WT001P_white", "179901_CG_C_WT001P_white", "179901_CG_CH_WT002P_white"]
  const DECK_BROWN_GOD = ["179003_01A_C_BN003C_brown", "179003_01A_C_BN003C_brown", "179003_01A_C_BN003C_brown", "179003_01A_U_BN006R_brown_02", "179003_01A_U_BN006R_brown_02", "179003_01A_U_BN006R_brown_02", "179004_01A_O_BN005U_brown", "179004_01A_O_BN005U_brown", "179014_03B_U_BN046R_brown_haku", "179014_03B_U_BN046R_brown_haku", "179014_03B_U_BN046R_brown_haku", "179015_04B_U_BN057C_brown", "179015_04B_U_BN057C_brown", "179015_04B_U_BN057C_brown", "179016_04B_U_BN066C_brown", "179018_05C_C_BN027C_brown", "179018_05C_C_BN027C_brown", "179018_05C_C_BN027C_brown", "179018_05C_C_BN029R_brown", "179018_05C_C_BN029R_brown", "179022_06C_C_BN036U_brown", "179022_06C_C_BN036U_brown", "179022_06C_C_BN036U_brown", "179022_06C_CH_BN052R_brown", "179022_06C_U_BN101R_brown", "179022_06C_U_BN101R_brown", "179022_06C_U_BN101R_brown", "179024_B2B_C_BN041C_brown", "179024_B2B_C_BN041C_brown", "179024_B2B_C_BN041C_brown", "179025_07D_CH_BN066R_brown", "179025_07D_U_BN138R_brown", "179025_07D_U_BN138R_brown", "179025_07D_U_BN138R_brown", "179028_10D_U_BN164N_brown", "179028_10D_U_BN164N_brown", "179028_10D_U_BN164N_brown", "179029_05C_U_BN077R_brown", "179029_05C_U_BN077R_brown", "179029_05C_U_BN077R_brown", "179029_06C_C_BN039R_brown", "179029_06C_C_BN039R_brown", "179029_06C_C_BN039R_brown", "179029_B3C_CH_BN088R_brown", "179030_11E_U_BN188N_brown", "179030_11E_U_BN188N_brown", "179030_11E_U_BN188N_brown", "179901_09D_C_BN007P_brown", "179901_09D_C_BN007P_brown", "179901_09D_C_BN007P_brown"]
  const DECK_W = ["179001_01A_U_WT007C_white", "179001_01A_U_WT007C_white", "179003_01A_U_WT001R_white_02", "179003_01A_U_WT005R_white_02", "179003_01A_U_WT005R_white_02", "179003_01A_U_WT005R_white_02", "179007_02A_CH_WT016C_white", "179009_03B_CH_WT020R_white", "179009_03B_CH_WT024C_white", "179011_03B_U_WT040C_white", "179011_03B_U_WT040C_white", "179011_03B_U_WT040C_white", "179015_04B_CH_WT030C_white", "179015_04B_U_WT065C_white", "179019_01A_CH_WT008U_white", "179019_01A_CH_WT008U_white", "179019_01A_CH_WT008U_white", "179019_01A_U_WT006R_white", "179019_01A_U_WT006R_white", "179019_01A_U_WT006R_white", "179020_05C_CH_WT054C_white", "179024_03B_U_WT042U_white", "179024_03B_U_WT042U_white", "179024_03B_U_WT042U_white", "179025_07D_C_WT061C_white", "179025_07D_C_WT061C_white", "179025_07D_C_WT061C_white", "179026_08D_U_WT158C_white", "179026_08D_U_WT158C_white", "179026_08D_U_WT159U_white", "179026_08D_U_WT162C_white", "179026_08D_U_WT162C_white", "179026_08D_U_WT162C_white", "179027_09D_C_WT067R_white", "179028_10D_C_WT073N_white", "179028_10D_C_WT073N_white", "179028_10D_C_WT073N_white", "179029_05C_C_WT047U_white", "179029_05C_CH_WT043U_white", "179029_05C_CH_WT043U_white", "179029_06C_U_WT112C_white", "179029_06C_U_WT112C_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT078R_white", "179901_CG_C_WT001P_white", "179901_CG_C_WT001P_white", "179901_CG_C_WT001P_white", "179901_CG_CH_WT002P_white", "179901_CG_U_WT009P_white", "179901_UN_WT003P_white"];
  const DECK_W_RANGE = ["179001_01A_CH_WT006C_white", "179003_01A_O_WT001C_white", "179003_01A_O_WT001C_white", "179003_01A_O_WT001C_white", "179003_01A_U_WT011C_white", "179003_01A_U_WT011C_white", "179003_01A_U_WT011C_white", "179009_03B_U_WT044U_white", "179009_03B_U_WT044U_white", "179009_03B_U_WT044U_white", "179009_03B_U_WT045U_white", "179009_03B_U_WT045U_white", "179009_03B_U_WT045U_white", "179015_04B_O_WT005U_white", "179015_04B_O_WT005U_white", "179015_04B_O_WT005U_white", "179019_01A_U_WT003C_white", "179019_01A_U_WT003C_white", "179019_01A_U_WT003C_white", "179019_02A_C_WT012U_white", "179019_02A_C_WT012U_white", "179019_02A_C_WT012U_white", "179019_02A_U_WT031C_white", "179019_02A_U_WT031C_white", "179019_02A_U_WT031C_white", "179023_06C_C_WT055C_white", "179023_06C_C_WT055C_white", "179023_06C_C_WT055C_white", "179024_03B_U_WT039R_white", "179024_03B_U_WT039R_white", "179024_03B_U_WT039R_white", "179024_03B_U_WT042U_white", "179024_03B_U_WT042U_white", "179024_03B_U_WT042U_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179027_09D_O_WT014N_white", "179027_09D_O_WT014N_white", "179027_09D_O_WT014N_white", "179028_10D_CH_WT095_white", "179028_10D_U_WT177R_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT078R_white", "179030_11E_C_WT078R_white", "179030_11E_C_WT078R_white", "179901_00_U_WT001P_white_02", "179901_00_U_WT001P_white_02", "179901_00_U_WT001P_white_02"]
  const DECK_GREEN_APU = ["179003_01A_C_GN003R_green", "179003_01A_CH_GN001R_green", "179003_01A_U_GN001R_green", "179003_01A_U_GN001R_green", "179003_01A_U_GN001R_green", "179003_01A_U_GN008R_green_02", "179003_01A_U_GN008R_green_02", "179003_01A_U_GN008R_green_02", "179007_02A_U_GN020R_green", "179009_03B_U_GN036U_green", "179009_03B_U_GN036U_green", "179009_03B_U_GN036U_green", "179009_03B_U_GN037C_green", "179009_03B_U_GN037C_green", "179009_03B_U_GN037C_green", "179009_03B_U_GN042R_green", "179009_03B_U_GN042R_green", "179009_03B_U_GN042R_green", "179015_04B_CH_GN030R_green", "179015_04B_U_GN053U_green", "179015_04B_U_GN055R_green_haku", "179015_04B_U_GN055R_green_haku", "179016_04B_CH_GN035R_green", "179016_04B_CH_GN036C_green", "179016_04B_CH_GN036C_green", "179018_05C_U_GN082U_green", "179019_02A_U_GN024U_green", "179019_02A_U_GN024U_green", "179019_02A_U_GN024U_green", "179024_B2B_C_GN052C_green", "179025_07D_C_GN056U_green", "179025_07D_CH_GN070C_green", "179029_05C_U_GN077R_green", "179030_11E_C_GN074R_green", "179030_11E_CH_GN093N_green", "179030_11E_CH_GN094R_green", "179030_11E_U_GN184N_green", "179030_11E_U_GN184N_green", "179030_11E_U_GN184N_green", "179031_12E_CH_GN096R_green", "179901_00_C_GN007P_green", "179901_00_C_GN007P_green", "179901_00_C_GN007P_green", "179901_00_U_GN001P_green_02", "179901_00_U_GN002P_green_02", "179901_CG_CH_GN001P_green", "179901_CG_U_GN003P_green", "179901_CG_U_GN003P_green", "179901_CG_U_GN008P_green", "179901_CG_U_GN008P_green"]
  const DECK_BLUE_ZZ = ["179003_01A_C_BL001R_blue", "179003_01A_C_BL004U_blue", "179005_02A_C_BL011C_blue", "179007_02A_O_BL006C_blue", "179007_02A_O_BL006C_blue", "179009_03B_CH_BL022R_blue", "179013_S1B_U_BL065C_blue", "179015_04B_CH_BL043C_blue", "179018_05C_CH_BL050U_blue", "179018_05C_U_BL101S_blue_haku", "179020_05C_C_BL046C_blue", "179020_05C_CH_BL057U_blue", "179020_05C_U_BL120U_blue", "179023_06C_C_BL054U_blue", "179023_06C_U_BL139C_blue", "179025_07D_CH_BL079C_blue", "179025_07D_CH_BL081U_blue", "179025_07D_CH_BL081U_blue", "179025_07D_CH_BL081U_blue", "179026_08D_CH_BL083R_blue", "179026_08D_CH_BL085U_blue", "179026_08D_U_BL178R_blue", "179027_09D_C_BL068N_blue", "179027_09D_CH_BL092N_blue", "179027_09D_O_BL024R_blue", "179027_09D_U_BL183N_blue", "179027_09D_U_BL188R_blue", "179027_09D_U_BL192N_blue", "179028_10D_C_BL070N_blue", "179028_10D_C_BL070N_blue", "179029_05C_U_BL102R_blue", "179029_05C_U_BL102R_blue", "179029_05C_U_BL102R_blue", "179029_05C_U_BL103C_blue", "179029_05C_U_BL103C_blue", "179029_05C_U_BL103C_blue", "179029_05C_U_BL104C_blue", "179029_05C_U_BL104C_blue", "179029_05C_U_BL104C_blue", "179029_05C_U_BL105C_blue", "179029_05C_U_BL105C_blue", "179029_05C_U_BL105C_blue", "179029_B3C_U_BL207N_blue", "179029_B3C_U_BL207N_blue", "179029_B3C_U_BL207N_blue", "179031_12E_U_BL219N_blue", "179901_00_U_BL012P_blue", "179901_00_U_BL021P_blue", "179901_00_U_BL021P_blue", "179901_00_U_BL021P_blue"]
  return [
    DECK_BLACK_T3, DECK_WHITE_SPEED, DECK_W_RANGE, DECK_GREEN_APU, DECK_BLUE_ZZ
  ]
}

export function setGameStateWithUseTiming(ctx: GameState, useTiming: SiYouTiming): GameState {
  const kw = useTiming[0]
  switch (kw) {
    case "自軍":
    case "敵軍": {
      ctx = setActivePlayerID(ctx, useTiming[0] == "自軍" ? PlayerA : PlayerB) as GameState
      const kw = useTiming[1]
      switch (kw) {
        case "リロールフェイズ":
        case "配備フェイズ":
        case "ドローフェイズ": {
          ctx = setPhase(ctx, [kw, "フリータイミング"]) as GameState
          break
        }
        case "戦闘フェイズ": {
          ctx = setPhase(ctx, ["戦闘フェイズ", "攻撃ステップ", "フリータイミング"]) as GameState
          break
        }
        case "攻撃ステップ":
        case "防御ステップ":
        case "ダメージ判定ステップ":
        case "帰還ステップ": {
          ctx = setPhase(ctx, ["戦闘フェイズ", kw, "フリータイミング"]) as GameState
          break
        }
        case "ターン":
          ctx = setPhase(ctx, ["戦闘フェイズ", "攻撃ステップ", "フリータイミング"]) as GameState
          break
      }
      break
    }
    case "リロールフェイズ":
    case "配備フェイズ":
    case "ドローフェイズ": {
      ctx = setPhase(ctx, [kw, "フリータイミング"]) as GameState
      break
    }
    case "戦闘フェイズ": {
      ctx = setPhase(ctx, ["戦闘フェイズ", "攻撃ステップ", "フリータイミング"]) as GameState
      break
    }
    case "攻撃ステップ":
    case "防御ステップ":
    case "ダメージ判定ステップ":
    case "帰還ステップ": {
      ctx = setPhase(ctx, ["戦闘フェイズ", kw, "フリータイミング"]) as GameState
      break
    }
    case "常時":
      ctx = setPhase(ctx, ["戦闘フェイズ", "攻撃ステップ", "フリータイミング"]) as GameState
      break
  }
  return ctx
}