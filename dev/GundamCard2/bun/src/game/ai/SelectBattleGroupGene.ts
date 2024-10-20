import { dropRepeats, repeat } from "ramda";
import { getPrototype } from "../../script";
import { choise, DSP, geneticAlgorithm, hillClimbing, optAlgByPSO, randInt, simulatedAnnealing } from "../../tool/optalg/basic";
import { IGene } from "../../tool/optalg/IGene";
import { AbsoluteBaSyouFn } from "../define/BaSyou";
import { BattleBonus } from "../define/CardText";
import { GameExtParams } from "../define/GameExtParams";
import { PlayerA, PlayerB, PlayerID, PlayerIDFn } from "../define/PlayerID";
import { getBattleGroup, getBattleGroupBattlePoint, isABattleGroup } from "../gameState/battleGroup";
import { getCardBattlePoint, getCardSpecialText, getCardTexts } from "../gameState/card";
import { addCards, createCardWithProtoIds } from "../gameState/CardTableComponent";
import { createDecks } from "../gameState/cardTextTestEnv";
import { createGameState, GameState } from "../gameState/GameState";
import { createStrBaSyouPair, getItemIdsByBasyou, getItemPrototype } from "../gameState/ItemTableComponent";
import { doPlayerAttack, getPlayerUnitCanGoEarthIds, getPlayerUnitCanGoSpaceIds, getPlayerUnitIds } from "../gameState/player";
import { getSetGroupBattlePoint, isSetGroupHasA } from "../gameState/setGroup";
import { doItemMove } from "../gameState/doItemMove";
import { getSetGroupRoot } from "../gameState/SetGroupComponent";
import { setActivePlayerID } from "../gameState/ActivePlayerComponent";
import { logCategory } from "../../tool/logger";
import { getItemState } from "../gameState/ItemStateComponent";
import { checkIsBattle } from "../gameState/IsBattleComponent";

export type SelectBattleGroupGene = {
  ctx: GameState,
  score: number | null,
} & IGene

export const SelectBattleGroupGeneFn = {
  createBasic(ctx: GameState, playerId: PlayerID, options: GameExtParams): SelectBattleGroupGene {
    const gene: SelectBattleGroupGene = {
      ctx: ctx,
      score: null,
      getStateKey(): string {
        const area1 = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア1"))
        const area2 = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア2"))
        return JSON.stringify([...area1, ...area2])
      },
      calcFitness(): number {
        throw new Error()
      },
      getFitness(): number {
        if (this.score == null) {
          throw new Error()
        }
        return this.score
      },
      mutate(): SelectBattleGroupGene {
        let ctx = this.ctx
        const cmd = choise([2, 2, 3])
        switch (cmd) {
          case 0: {
            const earthIds = getPlayerUnitCanGoEarthIds(ctx, playerId, options)
            const spaceIds = getPlayerUnitCanGoSpaceIds(ctx, playerId, options)
            // 地球或宇宙其中出擊一機就跳出
            for (let i = 0; i < 10; ++i) {
              const cmd2 = randInt() % 2
              if (cmd2 == 0) {
                if (earthIds.length) {
                  const id = earthIds[randInt() % earthIds.length]
                  if (id == null) {
                    throw new Error()
                  }
                  ctx = doItemMove(ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア1"), createStrBaSyouPair(ctx, id), options) as GameState
                  break
                }
              } else if (cmd2 == 1) {
                if (spaceIds.length) {
                  const id = spaceIds[randInt() % spaceIds.length]
                  if (id == null) {
                    throw new Error()
                  }
                  ctx = doItemMove(ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア2"), createStrBaSyouPair(ctx, id), options) as GameState
                  break
                }
              } else {
                throw new Error()
              }
            }
            break
          }
          case 1: {
            // 地球或宇宙其中一機收回就跳出
            const area1 = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア1")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
            const area2 = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア2")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
            for (let i = 0; i < 10; ++i) {
              const cmd2 = randInt() % 2
              if (cmd2 == 0) {
                if (area1.length) {
                  const id = area1[randInt() % area1.length]
                  if (id == null) {
                    throw new Error()
                  }
                  ctx = doItemMove(ctx, AbsoluteBaSyouFn.of(playerId, "配備エリア"), createStrBaSyouPair(ctx, id), options) as GameState
                  break
                }
              } else if (cmd2 == 1) {
                if (area2.length) {
                  const id = area2[randInt() % area2.length]
                  if (id == null) {
                    throw new Error()
                  }
                  ctx = doItemMove(ctx, AbsoluteBaSyouFn.of(playerId, "配備エリア"), createStrBaSyouPair(ctx, id), options) as GameState
                  break
                }
              } else {
                throw new Error()
              }
            }
            break
          }
          case 2: {
            // 地球或宇宙其中一個順序交換就跳出
            const area1 = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア1")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
            const area2 = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア2")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
            for (let i = 0; i < 10; ++i) {
              const cmd2 = randInt() % 2
              if (cmd2 == 0) {
                if (area1.length >= 2) {
                  const id = randInt() % area1.length
                  const id2 = randInt() % area1.length
                  if (id != id2) {
                    const key = AbsoluteBaSyouFn.toString(AbsoluteBaSyouFn.of(playerId, "戦闘エリア1"))
                    const list = ctx.table.cardStack[key]
                    list[id], list[id2] = list[id2], list[id]
                    ctx = {
                      ...ctx,
                      table: {
                        ...ctx.table,
                        cardStack: {
                          ...ctx.table.cardStack,
                          [key]: list
                        }
                      }
                    }
                    break
                  }
                }
              } else if (cmd2 == 1) {
                if (area2.length >= 2) {
                  const id = randInt() % area2.length
                  const id2 = randInt() % area2.length
                  if (id != id2) {
                    const key = AbsoluteBaSyouFn.toString(AbsoluteBaSyouFn.of(playerId, "戦闘エリア2"))
                    const list = ctx.table.cardStack[key]
                    list[id], list[id2] = list[id2], list[id]
                    ctx = {
                      ...ctx,
                      table: {
                        ...ctx.table,
                        cardStack: {
                          ...ctx.table.cardStack,
                          [key]: list
                        }
                      }
                    }
                    break
                  }
                }
              } else {
                throw new Error()
              }
            }
            {
              const area1 = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア1")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
              const area2 = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア2")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
              area1.forEach(eid => {
                if (area2.includes(eid)) {
                  console.log(area1, area2)
                  throw new Error()
                }
              })
            }
            break
          }
          default:
            throw new Error()
        }
        return {
          ...gene,
          ctx: ctx,
          score: null,
        }
      },
      crossover(gene: SelectBattleGroupGene): SelectBattleGroupGene {
        return randInt() % 2 == 0 ? { ...this } : { ...gene }
      },
    }
    return gene
  },
  createBasicForAttackCountry(ctx: GameState, playerId: PlayerID, options: GameExtParams): SelectBattleGroupGene {
    const gene = SelectBattleGroupGeneFn.createBasic(ctx, playerId, options)
    gene.calcFitness = function () {
      const ctx = this.ctx
      const area1 = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア1"))
      const area2 = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア2"))
      const area1Power = getBattleGroupBattlePoint(ctx, area1, { ...options, isPredict: true })
      const area1LostPower = area1.map((v, i) => {
        if (i == 0) {
          return 0
        }
        return getSetGroupBattlePoint(ctx, v, options)[0]
      }).reduce((a, b) => a + b, 0)
      const area2Power = getBattleGroupBattlePoint(ctx, area2, { ...options, isPredict: true })
      const area2LostPower = area2.map((v, i) => {
        if (i == 0) {
          return 0
        }
        return getSetGroupBattlePoint(ctx, v, options)[0]
      }).reduce((a, b) => a + b, 0)
      this.score = (area1Power + area2Power) * 2 - area1LostPower - area2LostPower
      return this.score
    }
    return gene
  },
  createBasicForDefenceBattle(originCtx: GameState, playerId: PlayerID, options: GameExtParams): SelectBattleGroupGene {
    const defencePlayerId = playerId
    const attackPlayerId = PlayerIDFn.getOpponent(defencePlayerId)
    // 先計算原始分數
    const originDefenceScore = getScore(originCtx, defencePlayerId)
    const originAttackScore = getScore(originCtx, attackPlayerId)
    const gene = SelectBattleGroupGeneFn.createBasic(originCtx, playerId, options)
    gene.calcFitness = function () {
      logCategory("createBasicForBattle", "==== calcFitness ====")
      let ctx = this.ctx
      logCategory("createBasicForBattle", "originDefenceScore", originDefenceScore)
      logCategory("createBasicForBattle", "originAttackScore", originAttackScore)
      ctx = checkIsBattle(ctx) as GameState
      // 速度1
      ctx = doPlayerAttack(ctx, attackPlayerId, "戦闘エリア1", 1, {})
      ctx = doPlayerAttack(ctx, attackPlayerId, "戦闘エリア2", 1, {})
      // 速度2
      ctx = doPlayerAttack(ctx, attackPlayerId, "戦闘エリア1", 2, {})
      ctx = doPlayerAttack(ctx, attackPlayerId, "戦闘エリア2", 2, {})
      const defenceScore = getScore(ctx, defencePlayerId)
      const attackScore = getScore(ctx, attackPlayerId)
      logCategory("createBasicForBattle", "defenceScore", defenceScore)
      logCategory("createBasicForBattle", "attackScore", attackScore)
      const defenceLost = originDefenceScore - defenceScore
      const attackLost = originAttackScore - attackScore
      logCategory("createBasicForBattle", "defenceLost", defenceLost)
      logCategory("createBasicForBattle", "attackLost", attackLost)
      this.score = attackLost - defenceLost
      logCategory("createBasicForBattle", "score", attackLost - defenceLost)
      return this.score
    }
    function getScore(ctx: GameState, currentPlayerId: string) {
      const area1 = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(currentPlayerId, "戦闘エリア1"))
      const area2 = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(currentPlayerId, "戦闘エリア2"))
      const area1Power = getBattleGroupBattlePoint(ctx, area1, { ...options, isPredict: true })
      const area2Power = getBattleGroupBattlePoint(ctx, area2, { ...options, isPredict: true })
      const scorePart1 = (area1Power + area2Power) * 2
      // 攻擊方只計算部隊損失
      if (currentPlayerId == attackPlayerId) {
        return scorePart1
      }
      // 防守方額外計算出擊橫置和本國的損失
      const live = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(currentPlayerId, "本国")).length
      // 在家戰力也要計算
      const homeLength = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(currentPlayerId, "配備エリア")).length
      // 
      const area1Op = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerIDFn.getOpponent(currentPlayerId), "戦闘エリア1"))
      const area2Op = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerIDFn.getOpponent(currentPlayerId), "戦闘エリア2"))
      let goEmptyLost = 0
      if (area1Op.length == 0 && area1.length > 0) {
        goEmptyLost += 10
      }
      if (area2Op.length == 0 && area2.length > 0) {
        goEmptyLost += 10
      }
      return scorePart1 + live * 2 + homeLength * 6 - goEmptyLost
    }
    return gene
  },
  createBasicForAttackBattle(originCtx: GameState, playerId: PlayerID, options: GameExtParams): SelectBattleGroupGene {
    const attackPlayerId = playerId
    const defencePlayerId = PlayerIDFn.getOpponent(attackPlayerId)
    // 先計算原始分數
    const originDefenceScore = getScore(originCtx, defencePlayerId)
    const originAttackScore = getScore(originCtx, attackPlayerId)
    const gene = SelectBattleGroupGeneFn.createBasic(originCtx, attackPlayerId, options)
    gene.mutate = function (): SelectBattleGroupGene {
      let ctx = originCtx
      {
        let attackCountryGene = SelectBattleGroupGeneFn.createBasicForAttackCountry(ctx, attackPlayerId, options)
        attackCountryGene = optAlgByPSO(10, 10, 0, 1, attackCountryGene) as SelectBattleGroupGene
        const earthIds = getItemIdsByBasyou(attackCountryGene.ctx, AbsoluteBaSyouFn.of(attackPlayerId, "戦闘エリア1")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
        const spaceIds = getItemIdsByBasyou(attackCountryGene.ctx, AbsoluteBaSyouFn.of(attackPlayerId, "戦闘エリア2")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
        //const [earthIds, spaceIds] = createBattleGroupForAttackCountry(ctx, attackPlayerId, ext)
        logCategory("createBasicForAttackBattle", "earthIds", earthIds)
        logCategory("createBasicForAttackBattle", "spaceIds", spaceIds)
        for (let id of earthIds) {
          ctx = doItemMove(ctx, AbsoluteBaSyouFn.of(attackPlayerId, "戦闘エリア1"), createStrBaSyouPair(ctx, id), options)
        }
        for (let id of spaceIds) {
          ctx = doItemMove(ctx, AbsoluteBaSyouFn.of(attackPlayerId, "戦闘エリア2"), createStrBaSyouPair(ctx, id), options)
        }
      }
      {
        const [earthIds, spaceIds] = createBattleGroupForDefenceBattle(ctx, defencePlayerId, options)
        for (let id of earthIds) {
          ctx = doItemMove(ctx, AbsoluteBaSyouFn.of(defencePlayerId, "戦闘エリア1"), createStrBaSyouPair(ctx, id), options)
        }
        for (let id of spaceIds) {
          ctx = doItemMove(ctx, AbsoluteBaSyouFn.of(defencePlayerId, "戦闘エリア2"), createStrBaSyouPair(ctx, id), options)
        }
      }
      ctx = checkIsBattle(ctx) as GameState
      // 速度1
      ctx = doPlayerAttack(ctx, attackPlayerId, "戦闘エリア1", 1, {})
      ctx = doPlayerAttack(ctx, attackPlayerId, "戦闘エリア2", 1, {})
      // 速度2
      ctx = doPlayerAttack(ctx, attackPlayerId, "戦闘エリア1", 2, {})
      ctx = doPlayerAttack(ctx, attackPlayerId, "戦闘エリア2", 2, {})
      return {
        ...this,
        ctx: ctx,
        score: null,
      }
    }
    gene.calcFitness = function () {
      let ctx = this.ctx
      const defenceScore = getScore(ctx, defencePlayerId)
      const attackScore = getScore(ctx, attackPlayerId)
      logCategory("createBasicForAttackBattle", "originDefenceScore", originDefenceScore)
      logCategory("createBasicForAttackBattle", "originAttackScore", originAttackScore)
      logCategory("createBasicForAttackBattle", "defenceScore", defenceScore)
      logCategory("createBasicForAttackBattle", "attackScore", attackScore)
      const defenceLost = originDefenceScore - defenceScore
      const attackLost = originAttackScore - attackScore
      logCategory("createBasicForAttackBattle", "defenceLost", defenceLost)
      logCategory("createBasicForAttackBattle", "attackLost", attackLost)
      this.score = defenceLost - attackLost
      logCategory("createBasicForAttackBattle", "score", this.score)
      return this.score
    }
    function getScore(ctx: GameState, currentPlayerId: string) {
      const power = getPlayerUnitIds(ctx, currentPlayerId).filter(id => getItemState(ctx, id).destroyReason == null).map(itemId => {
        const bp = getSetGroupBattlePoint(ctx, itemId, options)
        return bp[0] + bp[1] + bp[2]
      }).reduce((a, b) => a + b, 0)
      const scorePart1 = power * 2
      if (currentPlayerId == defencePlayerId) {
        return scorePart1
      }
      // 在家戰力也要計算
      const homeLength = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(currentPlayerId, "配備エリア")).length
      // 攻擊方額外計算敵本國的損失
      const live = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerIDFn.getOpponent(currentPlayerId), "本国")).length
      return scorePart1 + homeLength * 2 - live * 4
    }
    return gene
  }
}

export function createBattleGroupForAttackCountry(ctx: GameState, playerId: PlayerID, options: GameExtParams): [string[], string[], string[]] {
  const goEarthIds = getPlayerUnitCanGoEarthIds(ctx, playerId, options)
  const goSpaceIds = getPlayerUnitCanGoSpaceIds(ctx, playerId, options)
  if (goEarthIds.length == 0 && goSpaceIds.length == 0) {
    return [[], [], []]
  }
  let gene = SelectBattleGroupGeneFn.createBasicForAttackCountry(ctx, playerId, options)
  gene = simulatedAnnealing(100, 50, 1000, 0.7, gene) as SelectBattleGroupGene
  //gene = DSP(2, 2, 50, gene) as SelectBattleGroupGene
  //gene = geneticAlgorithm(5, 100, 20, 0.7, gene) as SelectBattleGroupGene
  //gene = optAlgByPSO(2, 100, 20, 0.7, gene) as SelectBattleGroupGene
  const area1 = getItemIdsByBasyou(gene.ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア1")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
  const area2 = getItemIdsByBasyou(gene.ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア2")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
  const homeIds = getItemIdsByBasyou(gene.ctx, AbsoluteBaSyouFn.of(playerId, "配備エリア")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
  {
    area1.forEach(eid => {
      if (area2.includes(eid)) {
        console.log(area1, area2)
        throw new Error()
      }
    })
  }
  return [area1, area2, homeIds]
}

export function createBattleGroupForDefenceBattle(ctx: GameState, playerId: PlayerID, options: GameExtParams): [string[], string[], string[]] {
  const goEarthIds = getPlayerUnitCanGoEarthIds(ctx, playerId, options)
  const goSpaceIds = getPlayerUnitCanGoSpaceIds(ctx, playerId, options)
  if (goEarthIds.length == 0 && goSpaceIds.length == 0) {
    return [[], [], []]
  }
  let gene = SelectBattleGroupGeneFn.createBasicForDefenceBattle(ctx, playerId, options)
  //gene = simulatedAnnealing(100, 50, 1000, 0.8, gene) as SelectBattleGroupGene
  //gene = DSP(2, 2, 50, gene) as SelectBattleGroupGene
  //gene = geneticAlgorithm(5, 100, 20, 0.7, gene) as SelectBattleGroupGene
  gene = optAlgByPSO(3, 30, 20, 0.7, gene) as SelectBattleGroupGene
  const area1 = getItemIdsByBasyou(gene.ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア1")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
  const area2 = getItemIdsByBasyou(gene.ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア2")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
  const homeIds = getItemIdsByBasyou(gene.ctx, AbsoluteBaSyouFn.of(playerId, "配備エリア")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
  {
    area1.forEach(eid => {
      if (area2.includes(eid)) {
        console.log(area1, area2)
        throw new Error()
      }
    })
  }
  return [area1, area2, homeIds]
}

export function createBattleGroupForAttackBattle(ctx: GameState, playerId: PlayerID, options: GameExtParams): [string[], string[], string[], string[], string[], string[]] {
  const goEarthIds = getPlayerUnitCanGoEarthIds(ctx, playerId, options)
  const goSpaceIds = getPlayerUnitCanGoSpaceIds(ctx, playerId, options)
  if (goEarthIds.length == 0 && goSpaceIds.length == 0) {
    return [[], [], [], [], [], []]
  }
  let gene = SelectBattleGroupGeneFn.createBasicForAttackBattle(ctx, playerId, options)
  gene = optAlgByPSO(0, 2, 1, 0, gene) as SelectBattleGroupGene
  if (gene.getFitness() < 0) {
    return [[], [], [], [], [], []]
  }
  const area1 = getItemIdsByBasyou(gene.ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア1")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
  const area2 = getItemIdsByBasyou(gene.ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア2")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
  const homeIds = getItemIdsByBasyou(gene.ctx, AbsoluteBaSyouFn.of(playerId, "配備エリア")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
  {
    area1.forEach(eid => {
      if (area2.includes(eid)) {
        console.log(area1, area2)
        throw new Error()
      }
    })
  }
  const defencePlayerId = PlayerIDFn.getOpponent(playerId)
  const area1b = getItemIdsByBasyou(gene.ctx, AbsoluteBaSyouFn.of(defencePlayerId, "戦闘エリア1")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
  const area2b = getItemIdsByBasyou(gene.ctx, AbsoluteBaSyouFn.of(defencePlayerId, "戦闘エリア2")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
  const homeIdsb = getItemIdsByBasyou(gene.ctx, AbsoluteBaSyouFn.of(defencePlayerId, "配備エリア")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
  return [area1, area2, homeIds, area1b, area2b, homeIdsb]
}

export function testOptAlgAttackCounty2() {
  const decks = createDecks()
  const allProtoIds = dropRepeats(decks.flatMap(v => v))
  if (allProtoIds == null) {
    throw new Error()
  }
  const allUnitProtos = allProtoIds.filter(cardId => {
    const proto = getPrototype(cardId)
    return proto.category == "ユニット"
  })
  const allUnitProtosHasHigh = allUnitProtos.filter(cardId => {
    const proto = getPrototype(cardId)
    return proto.texts?.find(text => text.title[0] == "特殊型"
      && (false
        || text.title[1][0] == "高機動"
        //|| text.title[1][0] == "強襲"
        //|| text.title[1][0] == "速攻"
        // || text.title[1][0] == "範囲兵器"
        //|| text.title[1][0] == "サイコミュ"
      ))
  })
  //allUnitProtos.sort((a, b) => Math.random() < 0.5 ? -1 : 1)
  const unitIds = allUnitProtos.slice(30, 40)
  //const unitIds = allUnitProtosHasHigh.slice(0, 5)
  const enemyIds = allUnitProtos.slice(0, 5)

  let ctx = createGameState()
  ctx = setActivePlayerID(ctx, PlayerB) as GameState
  ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), unitIds.map(protoId => {
    return {
      id: protoId,
      protoID: protoId
    }
  })) as GameState
  ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国"), repeat("unit", 50)) as GameState
  ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "本国"), repeat("unit", 50)) as GameState

  ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア1"), enemyIds) as GameState
  ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア2"), enemyIds) as GameState

  const [area1, area2, homeIds] = createBattleGroupForDefenceBattle(ctx, PlayerA, {})

  console.log("enemy====")
  console.log(getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア1")).map(id => getItemPrototype(ctx, id).battlePoint))
  console.log(getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア2")).map(id => getItemPrototype(ctx, id).battlePoint))

  console.log("player====")
  console.log(area1.map(id => getPrototype(id).battlePoint))
  console.log(area2.map(id => getPrototype(id).battlePoint))
  console.log(homeIds.map(id => getPrototype(id).battlePoint))
  //throw new Error()
}

export function testOptAlgAttackCounty3() {
  const decks = createDecks()
  const allProtoIds = dropRepeats(decks.flatMap(v => v))
  if (allProtoIds == null) {
    throw new Error()
  }
  const allUnitProtos = allProtoIds.filter(cardId => {
    const proto = getPrototype(cardId)
    return proto.category == "ユニット"
  })
  const allUnitProtosHasHigh = allUnitProtos.filter(cardId => {
    const proto = getPrototype(cardId)
    return proto.texts?.find(text => text.title[0] == "特殊型"
      && (false
        || text.title[1][0] == "高機動"
        //|| text.title[1][0] == "強襲"
        //|| text.title[1][0] == "速攻"
        // || text.title[1][0] == "範囲兵器"
        //|| text.title[1][0] == "サイコミュ"
      ))
  })
  const allUnitProtosHasStrong = allUnitProtos.filter(cardId => {
    const proto = getPrototype(cardId)
    return proto.texts?.find(text => text.title[0] == "特殊型"
      && (false
        //|| text.title[1][0] == "高機動"
        || text.title[1][0] == "強襲"
        //|| text.title[1][0] == "速攻"
        // || text.title[1][0] == "範囲兵器"
        //|| text.title[1][0] == "サイコミュ"
      ))
  })
  //allUnitProtos.sort((a, b) => Math.random() < 0.5 ? -1 : 1)
  const unitIds = allUnitProtos.slice(10, 20)
  //const unitIds = allUnitProtosHasHigh.slice(0, 5)
  const enemyIds = allUnitProtos.slice(10, 12)

  let ctx = createGameState()
  ctx = setActivePlayerID(ctx, PlayerA) as GameState
  ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), unitIds.map(protoId => {
    return {
      id: protoId,
      protoID: protoId
    }
  })) as GameState

  ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerB, "配備エリア"), enemyIds.map(protoId => {
    return {
      id: protoId,
      protoID: protoId
    }
  })) as GameState
  ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国"), repeat("unit", 50)) as GameState
  ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "本国"), repeat("unit", 50)) as GameState
  const [area1, area2, homeIds, area1b, area2b, homeIdsb] = createBattleGroupForAttackBattle(ctx, PlayerA, {})
  console.log("player====")
  console.log(area1.map(id => getPrototype(id).battlePoint))
  console.log(area2.map(id => getPrototype(id).battlePoint))
  console.log(homeIds.map(id => getPrototype(id).battlePoint))
  console.log("enemy====")
  console.log(area1b.map(id => getPrototype(id).battlePoint))
  console.log(area2b.map(id => getPrototype(id).battlePoint))
  console.log(homeIdsb.map(id => getPrototype(id).battlePoint))
  //throw new Error()
}
