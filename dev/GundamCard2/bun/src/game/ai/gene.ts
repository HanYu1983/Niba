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

type BattleEnv = {
  attackUnitIds: [string[], string[]],
  guardUnitIds: [string[], string[]],
}

type SetGroupEncode = {
  itemId: string,
  bp: BattleBonus
  hasHigh: boolean,
  hasStrong: boolean,
  hasSpeed: boolean,
  phyDamage: number,
  maxRange: number,
}

function createSetGroupEncode(ctx: GameState, itemId: string, ext: GameExtParams): SetGroupEncode {
  const bp = getSetGroupBattlePoint(ctx, itemId, ext)
  const hasHigh = isSetGroupHasA(ctx, ["高機動"], itemId, ext)
  const hasStrong = isSetGroupHasA(ctx, ["強襲"], itemId, ext)
  const hasSpeed = isSetGroupHasA(ctx, ["速攻"], itemId, ext)
  const phyDamage = getCardTexts(ctx, itemId, ext).map(text => {
    text = getCardSpecialText(text, { ...ext, cardId: itemId })
    if (text.title[0] == "特殊型" && text.title[1][0] == "サイコミュ") {
      return text.title[1][1]
    }
    return 0
  }).reduce((a, b) => a + b, 0)
  const maxRange = getCardTexts(ctx, itemId, ext).map(text => {
    text = getCardSpecialText(text, { ...ext, cardId: itemId })
    if (text.title[0] == "特殊型" && text.title[1][0] == "範囲兵器") {
      return text.title[1][1]
    }
    return 0
  }).reduce((a, b) => Math.max(a, b), 0)
  return { itemId, bp, hasHigh, hasStrong, hasSpeed, phyDamage, maxRange }
}

type BattleGroupEncode = {
  itemIds: string[],
  bps: BattleBonus[],
  power: number,
  lostPower: number,
  hp: number,
  hasHigh: number,
  hasStrong: number,
  hasSpeed: number,
  phyDamage: number,
  maxRange: number,
  setGroupLength: number,
}

function createBattleGroupEncode(setGroupEncodes: SetGroupEncode[]): BattleGroupEncode {
  const power = setGroupEncodes.map((v, i) => {
    if (i == 0) {
      return v.bp[0]
    }
    return v.bp[1]
  }).reduce((a, b) => a + b, 0)
  const lostPower = setGroupEncodes.map((v, i) => {
    if (i == 0) {
      return 0
    }
    return v.bp[0]
  }).reduce((a, b) => a + b, 0)
  const hp = setGroupEncodes.map(v => v.bp[2]).reduce((a, b) => a + b, 0)
  const hasHigh = setGroupEncodes.filter(v => v.hasHigh).length
  const hasStrong = setGroupEncodes.filter(v => v.hasStrong).length
  const hasSpeed = setGroupEncodes.filter(v => v.hasSpeed).length
  const bps = setGroupEncodes.map(v => v.bp)
  const phyDamage = setGroupEncodes.map(v => v.phyDamage).reduce((a, b) => a + b, 0)
  const maxRange = setGroupEncodes.map(v => v.maxRange).reduce((a, b) => Math.max(a, b), 0)
  return {
    itemIds: setGroupEncodes.map(s => s.itemId),
    power, lostPower, hp, bps, phyDamage, maxRange,
    hasHigh, hasStrong, hasSpeed,
    setGroupLength: setGroupEncodes.length
  }
}



const BattleGroupEncodeFn = {
  createEmpty(): BattleGroupEncode {
    return {
      itemIds: [],
      bps: [],
      power: 0,
      lostPower: 0,
      hp: 0,
      hasHigh: 0,
      hasStrong: 0,
      hasSpeed: 0,
      phyDamage: 0,
      maxRange: 0,
      setGroupLength: 0,
    }
  },
  distance(left: BattleGroupEncode, right: BattleGroupEncode, options?: { isShapeSpStrong?: boolean, isShapeBp?: boolean, isShapeLength?: boolean, isShapeHp?: boolean }): number {
    const LVMIN = 5
    const LV0 = 10
    const LV1 = 200
    const LV2 = 500
    const LV3 = 1000
    let dist = 0
    if (left.hasHigh != right.hasHigh) {
      dist += Math.abs(left.hasHigh - right.hasHigh) * LV1
    }
    if (options?.isShapeSpStrong) {
      if (left.hasStrong != right.hasStrong) {
        dist += Math.abs(left.hasStrong - right.hasStrong) * LV1
      }
    }
    if (left.hasSpeed != right.hasSpeed) {
      dist += Math.abs(left.hasSpeed - right.hasSpeed) * LV1
    }
    if (left.setGroupLength > 0 && right.setGroupLength > 0) {
      if ((left.hasHigh == left.setGroupLength) != (right.hasHigh == right.setGroupLength)) {
        dist += LV3
      }
      if (options?.isShapeSpStrong) {
        if ((left.hasStrong == left.setGroupLength) != (right.hasStrong == right.setGroupLength)) {
          dist += LV2
        }
      }
      if ((left.hasSpeed == left.setGroupLength) != (right.hasSpeed == right.setGroupLength)) {
        dist += LV3
      }
    }
    dist += LV1 * Math.abs(left.phyDamage - right.phyDamage)
    dist += LV1 * Math.abs(left.maxRange - right.maxRange)
    // 以下只能使用LV0，主要特徵要先對上
    dist += LV0 * Math.abs(left.power - right.power)
    if (options?.isShapeBp) {
      for (let i = 0; i < Math.min(left.bps.length, right.bps.length); ++i) {
        const leftBp = left.bps[i]
        const rightBp = right.bps[i]
        dist += LV0 * Math.sqrt(Math.pow(leftBp[0] - rightBp[0], 2) + Math.pow(leftBp[1] - rightBp[1], 2) + Math.pow(leftBp[2] - rightBp[2], 2))
      }
    }
    if (options?.isShapeHp) {
      dist += LVMIN * Math.abs(left.hp - right.hp)
    }
    if (options?.isShapeLength) {
      dist += LV0 * Math.abs(left.setGroupLength - right.setGroupLength)
    }
    return dist
  },
  fromItemIds(ctx: GameState, itemIds: string[], ext: GameExtParams): BattleGroupEncode {
    return createBattleGroupEncode(itemIds.map(itemId => createSetGroupEncode(ctx, itemId, ext)))
  },

}

export function testOptCreateBattleGroup() {
  const decks = createDecks()
  const allProtoIds = decks.flatMap(v => v)
  if (allProtoIds == null) {
    throw new Error()
  }
  const allUnitProtos = allProtoIds.filter(cardId => {
    const proto = getPrototype(cardId)
    return proto.category == "ユニット"
  })
  let ctx = createGameState()
  ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), allUnitProtos.map(protoId => {
    return {
      id: protoId,
      protoID: protoId
    }
  })) as GameState
  const allUnitProtosHasSp = allUnitProtos.filter(cardId => {
    const proto = getPrototype(cardId)
    return proto.texts?.find(text => text.title[0] == "特殊型"
      && (false
        || text.title[1][0] == "高機動"
        || text.title[1][0] == "強襲"
        || text.title[1][0] == "速攻"
        || text.title[1][0] == "範囲兵器"
        || text.title[1][0] == "サイコミュ"
      ))
  })
  const unitIdsHasHigh: string[] = []
  for (let i = 0; i < 4; ++i) {
    const pool = allUnitProtosHasSp
    unitIdsHasHigh.push(pool[Math.floor(Math.random() * 1000) % pool.length])
  }
  const encodeUnitHasHigh = BattleGroupEncodeFn.fromItemIds(ctx, unitIdsHasHigh, {})
  const unitIds = createBattleGroupFromBattleGroupEncode(ctx, allUnitProtos, encodeUnitHasHigh, { isShapeSpStrong: true, isShapeLostPower: false })
  const resultEncode = BattleGroupEncodeFn.fromItemIds(ctx, unitIds, {})
  const dist = BattleGroupEncodeFn.distance(encodeUnitHasHigh, resultEncode)
  console.log(dist)
  console.log(encodeUnitHasHigh.itemIds.map((itemId: any) => getCardBattlePoint(ctx, itemId, {})))
  console.log(unitIds.map((itemId: any) => getCardBattlePoint(ctx, itemId, {})))
  console.log(encodeUnitHasHigh)
  console.log(resultEncode)
  if (dist > 1000) {
    throw new Error()
  }

  function createBattleGroupFromBattleGroupEncode(ctx: GameState, itemIdPool: string[], targetEncode: BattleGroupEncode, options?: { isShapeSpStrong?: boolean, isShapeLostPower?: boolean }): string[] {
    type SelectBattleGroupGene = {
      unitIds: string[],
      score: number,
    } & IGene
    let gene: SelectBattleGroupGene = {
      unitIds: [],
      score: 0,
      getStateKey(): string {
        return JSON.stringify(this.unitIds)
      },
      calcFitness(): number {
        const encodeBG = BattleGroupEncodeFn.fromItemIds(ctx, this.unitIds, {})
        // 達成目標群組的距離分，距離越近越高分
        const unitScore = 1.0 / BattleGroupEncodeFn.distance(
          encodeBG, targetEncode, { isShapeSpStrong: options?.isShapeSpStrong }
        )
        this.score = unitScore
        // 優化部隊組成，損失的格鬥力越少越高分
        if (options?.isShapeLostPower) {
          const lostPowerScore = Math.pow(Math.max(0, 20 - encodeBG.lostPower), 2)
          this.score += lostPowerScore
        }
        return this.score
      },
      getFitness(): number {
        return this.score
      },
      mutate(): SelectBattleGroupGene {
        let unitIds = [...this.unitIds]
        const rand = Math.random()
        if (rand < 0.33) {
          const pool = itemIdPool
          if (unitIds.length == pool.length) {
            const id1 = randInt() % unitIds.length
            unitIds = unitIds.filter(id => id != unitIds[id1])
          } else {
            for (let i = 0; i < 10; ++i) {
              let selectId = 0
              selectId = randInt() % pool.length
              if (unitIds.includes(pool[selectId])) {
                continue
              }
              unitIds.push(pool[selectId])
              break
            }
          }
        } else if (rand < 0.66) {
          const id1 = randInt() % unitIds.length
          unitIds = unitIds.filter(id => id != unitIds[id1])
        } else {
          if (unitIds.length >= 2) {
            const id1 = randInt() % unitIds.length
            const id2 = randInt() % unitIds.length
            if (id1 != id2) {
              unitIds[id1], unitIds[id2] = unitIds[id2], unitIds[id1]
            }
          }
        }
        return {
          ...this,
          unitIds: unitIds
        }
      },
      crossover(gene: SelectBattleGroupGene): SelectBattleGroupGene {
        return randInt() % 2 == 0 ? { ...this } : { ...gene }
      },
    }
    gene = simulatedAnnealing(200, 10, 1000, 0.7, gene) as SelectBattleGroupGene
    //gene = DSP(3, 3, 50, gene) as SelectBattleGroupGene
    //gene = geneticAlgorithm(20, 100, 20, 0.7, gene) as SelectBattleGroupGene
    //gene = optAlgByPSO(20, 100, 20, 0.7, gene) as SelectBattleGroupGene
    return gene.unitIds
  }
}

export function testOptAlgAttackCounty() {
  const decks = createDecks()
  const allProtoIds = dropRepeats(decks.flatMap(v => v))
  if (allProtoIds == null) {
    throw new Error()
  }
  const allUnitProtos = allProtoIds.filter(cardId => {
    const proto = getPrototype(cardId)
    return proto.category == "ユニット"
  })

  allUnitProtos.sort((a, b) => Math.random() < 0.5 ? -1 : 1)
  const unitIds = allUnitProtos.slice(30, 40)
  console.log(unitIds)

  type SelectBattleGroupGene = {
    unitIds: string[],
    area1: string[],
    area2: string[],
    score: number,
  } & IGene

  let gene: SelectBattleGroupGene = {
    unitIds: unitIds,
    area1: [],
    area2: [],
    score: 0,
    getStateKey(): string {
      return JSON.stringify(this.unitIds)
    },
    calcFitness(): number {
      let ctx = createGameState()
      ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), this.unitIds.map(protoId => {
        return {
          id: protoId,
          protoID: protoId
        }
      })) as GameState
      ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"), this.area1.map(protoId => {
        return {
          id: protoId,
          protoID: protoId
        }
      })) as GameState
      ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア2"), this.area2.map(protoId => {
        return {
          id: protoId,
          protoID: protoId
        }
      })) as GameState

      const area1Power = this.area1.map((v, i) => {
        if (i == 0) {
          return getSetGroupBattlePoint(ctx, v, {})[0]
        }
        return getSetGroupBattlePoint(ctx, v, {})[1]
      }).reduce((a, b) => a + b, 0)
      const area1LostPower = this.area1.map((v, i) => {
        if (i == 0) {
          return 0
        }
        return getSetGroupBattlePoint(ctx, v, {})[0]
      }).reduce((a, b) => a + b, 0)

      const area2Power = this.area2.map((v, i) => {
        if (i == 0) {
          return getSetGroupBattlePoint(ctx, v, {})[0]
        }
        return getSetGroupBattlePoint(ctx, v, {})[1]
      }).reduce((a, b) => a + b, 0)
      const area2LostPower = this.area2.map((v, i) => {
        if (i == 0) {
          return 0
        }
        return getSetGroupBattlePoint(ctx, v, {})[0]
      }).reduce((a, b) => a + b, 0)

      this.score = (area1Power + area2Power) * 2 - area1LostPower - area2LostPower
      return this.score
    },
    getFitness(): number {
      return this.score
    },
    mutate(): SelectBattleGroupGene {
      const gene = { ...this }
      const cmd = choise([2, 2, 3])
      switch (cmd) {
        case 0: {
          const earthIds = gene.unitIds.filter(id => getPrototype(id).battleArea?.includes("地球エリア"))
          const spaceIds = gene.unitIds.filter(id => getPrototype(id).battleArea?.includes("宇宙エリア"))
          for (let i = 0; i < 10; ++i) {
            const cmd2 = randInt() % 2
            if (cmd2 == 0) {
              if (earthIds.length) {
                const id = earthIds[randInt() % earthIds.length]
                if (id == null) {
                  throw new Error()
                }
                gene.area1 = [...gene.area1, id]
                gene.unitIds = gene.unitIds.filter(id2 => id2 != id)
                break
              }
            } else if (cmd2 == 1) {
              if (spaceIds.length) {
                const id = spaceIds[randInt() % spaceIds.length]
                if (id == null) {
                  throw new Error()
                }
                gene.area2 = [...gene.area2, id]
                gene.unitIds = gene.unitIds.filter(id2 => id2 != id)
                break
              }
            } else {
              throw new Error()
            }
          }
          // if (gene.area1.length + gene.area2.length + gene.unitIds.length != 10) {
          //   console.log(gene.area1, gene.area2, gene.unitIds)
          //   throw new Error()
          // }
          break
        }
        case 1: {
          for (let i = 0; i < 10; ++i) {
            const cmd2 = randInt() % 2
            if (cmd2 == 0) {
              if (gene.area1.length) {
                const id = gene.area1[randInt() % gene.area1.length]
                if (id == null) {
                  throw new Error()
                }
                gene.area1 = gene.area1.filter(id2 => id2 != id)
                gene.unitIds = [...gene.unitIds, id]
                break
              }
            } else if (cmd2 == 1) {
              if (gene.area2.length) {
                const id = gene.area2[randInt() % gene.area2.length]
                if (id == null) {
                  throw new Error()
                }
                gene.area2 = gene.area2.filter(id2 => id2 != id)
                gene.unitIds = [...gene.unitIds, id]
                break
              }
            } else {
              throw new Error()
            }
          }
          // if (gene.area1.length + gene.area2.length + gene.unitIds.length != 10) {
          //   throw new Error()
          // }
          break
        }
        case 2: {
          for (let i = 0; i < 10; ++i) {
            const cmd2 = randInt() % 2
            if (cmd2 == 0) {
              if (gene.area1.length >= 2) {
                const id = randInt() % gene.area1.length
                const id2 = randInt() % gene.area1.length
                if (id != id2) {
                  gene.area1 = gene.area1.slice()
                  gene.area1[id], gene.area1[id2] = gene.area1[id2], gene.area1[id]
                  break
                }
              }
            } else if (cmd2 == 1) {
              if (gene.area2.length >= 2) {
                const id = randInt() % gene.area2.length
                const id2 = randInt() % gene.area2.length
                if (id != id2) {
                  gene.area2 = gene.area2.slice()
                  gene.area2[id], gene.area2[id2] = gene.area2[id2], gene.area2[id]
                  break
                }
              }
            } else {
              throw new Error()
            }
            // if (gene.area1.length + gene.area2.length + gene.unitIds.length != 10) {
            //   throw new Error()
            // }
          }
          break
        }
        default:
          throw new Error()
      }
      return gene
    },
    crossover(gene: SelectBattleGroupGene): SelectBattleGroupGene {
      return randInt() % 2 == 0 ? { ...this } : { ...gene }
    },
  }
  gene = simulatedAnnealing(100, 50, 1000, 0.7, gene) as SelectBattleGroupGene
  //gene = DSP(2, 2, 50, gene) as SelectBattleGroupGene
  //gene = geneticAlgorithm(5, 100, 20, 0.7, gene) as SelectBattleGroupGene
  //gene = optAlgByPSO(2, 100, 20, 0.7, gene) as SelectBattleGroupGene
  console.log(gene.getFitness())
  console.log(gene.area1.map(id => getPrototype(id).battlePoint))
  console.log(gene.area2.map(id => getPrototype(id).battlePoint))
  console.log(gene.unitIds.map(id => getPrototype(id).battlePoint))
}

export type SelectBattleGroupGene = {
  ctx: GameState,
  score: number,
} & IGene

export const SelectBattleGroupGeneFn = {
  createBasic(ctx: GameState, playerId: PlayerID, ext: GameExtParams): SelectBattleGroupGene {
    const gene: SelectBattleGroupGene = {
      ctx: ctx,
      score: 0,
      getStateKey(): string {
        const area1 = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア1"))
        const area2 = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア2"))
        return JSON.stringify([...area1, ...area2])
      },
      calcFitness(): number {
        throw new Error()
      },
      getFitness(): number {
        return this.score
      },
      mutate(): SelectBattleGroupGene {
        let ctx = this.ctx
        const cmd = choise([2, 2, 3])
        switch (cmd) {
          case 0: {
            const earthIds = getPlayerUnitCanGoEarthIds(ctx, playerId, ext)
            const spaceIds = getPlayerUnitCanGoSpaceIds(ctx, playerId, ext)
            // 地球或宇宙其中出擊一機就跳出
            for (let i = 0; i < 10; ++i) {
              const cmd2 = randInt() % 2
              if (cmd2 == 0) {
                if (earthIds.length) {
                  const id = earthIds[randInt() % earthIds.length]
                  if (id == null) {
                    throw new Error()
                  }
                  ctx = doItemMove(ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア1"), createStrBaSyouPair(ctx, id)) as GameState
                  break
                }
              } else if (cmd2 == 1) {
                if (spaceIds.length) {
                  const id = spaceIds[randInt() % spaceIds.length]
                  if (id == null) {
                    throw new Error()
                  }
                  ctx = doItemMove(ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア2"), createStrBaSyouPair(ctx, id)) as GameState
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
                  ctx = doItemMove(ctx, AbsoluteBaSyouFn.of(playerId, "配備エリア"), createStrBaSyouPair(ctx, id)) as GameState
                  break
                }
              } else if (cmd2 == 1) {
                if (area2.length) {
                  const id = area2[randInt() % area2.length]
                  if (id == null) {
                    throw new Error()
                  }
                  ctx = doItemMove(ctx, AbsoluteBaSyouFn.of(playerId, "配備エリア"), createStrBaSyouPair(ctx, id)) as GameState
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
            break
          }
          default:
            throw new Error()
        }
        return {
          ...gene,
          ctx: ctx
        }
      },
      crossover(gene: SelectBattleGroupGene): SelectBattleGroupGene {
        return randInt() % 2 == 0 ? { ...this } : { ...gene }
      },
    }
    return gene
  },
  createBasicForAttackCountry(ctx: GameState, playerId: PlayerID, ext: GameExtParams): SelectBattleGroupGene {
    const gene = SelectBattleGroupGeneFn.createBasic(ctx, playerId, ext)
    gene.calcFitness = function () {
      const ctx = this.ctx
      const area1 = getBattleGroup(ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア1"))
      const area2 = getBattleGroup(ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア2"))
      const area1Power = getBattleGroupBattlePoint(ctx, area1, ext)
      const area1LostPower = area1.map((v, i) => {
        if (i == 0) {
          return 0
        }
        return getSetGroupBattlePoint(ctx, v, ext)[0]
      }).reduce((a, b) => a + b, 0)
      const area2Power = getBattleGroupBattlePoint(ctx, area2, ext)
      const area2LostPower = area2.map((v, i) => {
        if (i == 0) {
          return 0
        }
        return getSetGroupBattlePoint(ctx, v, ext)[0]
      }).reduce((a, b) => a + b, 0)
      this.score = (area1Power + area2Power) * 2 - area1LostPower - area2LostPower
      return this.score
    }
    return gene
  },
  createBasicForDefenceBattle(originCtx: GameState, playerId: PlayerID, ext: GameExtParams): SelectBattleGroupGene {
    const defencePlayerId = playerId
    const attackPlayerId = PlayerIDFn.getOpponent(defencePlayerId)
    // 先計算原始分數
    const originDefenceScore = getScore(originCtx, defencePlayerId)
    const originAttackScore = getScore(originCtx, attackPlayerId)
    const gene = SelectBattleGroupGeneFn.createBasic(originCtx, playerId, ext)
    gene.calcFitness = function () {
      logCategory("createBasicForBattle", "==== calcFitness ====")
      let ctx = this.ctx
      logCategory("createBasicForBattle", "originDefenceScore", originDefenceScore)
      logCategory("createBasicForBattle", "originAttackScore", originAttackScore)
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
      const area1 = getBattleGroup(ctx, AbsoluteBaSyouFn.of(currentPlayerId, "戦闘エリア1"))
      const area2 = getBattleGroup(ctx, AbsoluteBaSyouFn.of(currentPlayerId, "戦闘エリア2"))
      const area1Power = getBattleGroupBattlePoint(ctx, area1, ext)
      const area2Power = getBattleGroupBattlePoint(ctx, area2, ext)
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
      const area1Op = getBattleGroup(ctx, AbsoluteBaSyouFn.of(PlayerIDFn.getOpponent(currentPlayerId), "戦闘エリア1"))
      const area2Op = getBattleGroup(ctx, AbsoluteBaSyouFn.of(PlayerIDFn.getOpponent(currentPlayerId), "戦闘エリア2"))
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
  createBasicForAttackBattle(originCtx: GameState, playerId: PlayerID, ext: GameExtParams): SelectBattleGroupGene {
    const attackPlayerId = playerId
    const defencePlayerId = PlayerIDFn.getOpponent(attackPlayerId)
    // 先計算原始分數
    const originDefenceScore = getScore(originCtx, defencePlayerId)
    const originAttackScore = getScore(originCtx, attackPlayerId)
    const gene = SelectBattleGroupGeneFn.createBasic(originCtx, attackPlayerId, ext)
    gene.mutate = function (): SelectBattleGroupGene {
      let ctx = originCtx
      {
        let attackCountryGene = SelectBattleGroupGeneFn.createBasicForAttackCountry(ctx, attackPlayerId, ext)
        attackCountryGene = optAlgByPSO(10, 10, 0, 1, attackCountryGene) as SelectBattleGroupGene
        const earthIds = getItemIdsByBasyou(attackCountryGene.ctx, AbsoluteBaSyouFn.of(attackPlayerId, "戦闘エリア1")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
        const spaceIds = getItemIdsByBasyou(attackCountryGene.ctx, AbsoluteBaSyouFn.of(attackPlayerId, "戦闘エリア2")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)

        //const [earthIds, spaceIds] = createBattleGroupForAttackCountry(ctx, attackPlayerId, ext)
        console.log(earthIds, spaceIds)
        for (let id of earthIds) {
          ctx = doItemMove(ctx, AbsoluteBaSyouFn.of(attackPlayerId, "戦闘エリア1"), createStrBaSyouPair(ctx, id))
        }
        for (let id of spaceIds) {
          ctx = doItemMove(ctx, AbsoluteBaSyouFn.of(attackPlayerId, "戦闘エリア2"), createStrBaSyouPair(ctx, id))
        }
      }
      {
        const [earthIds, spaceIds] = createBattleGroupForDefenceBattle(ctx, defencePlayerId, ext)
        for (let id of earthIds) {
          ctx = doItemMove(ctx, AbsoluteBaSyouFn.of(defencePlayerId, "戦闘エリア1"), createStrBaSyouPair(ctx, id))
        }
        for (let id of spaceIds) {
          ctx = doItemMove(ctx, AbsoluteBaSyouFn.of(defencePlayerId, "戦闘エリア2"), createStrBaSyouPair(ctx, id))
        }
      }
      // 速度1
      ctx = doPlayerAttack(ctx, attackPlayerId, "戦闘エリア1", 1, {})
      ctx = doPlayerAttack(ctx, attackPlayerId, "戦闘エリア2", 1, {})
      // 速度2
      ctx = doPlayerAttack(ctx, attackPlayerId, "戦闘エリア1", 2, {})
      ctx = doPlayerAttack(ctx, attackPlayerId, "戦闘エリア2", 2, {})
      return {
        ...this,
        ctx: ctx
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
        const bp = getSetGroupBattlePoint(ctx, itemId, ext)
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

export function createBattleGroupForAttackCountry(ctx: GameState, playerId: PlayerID, ext: GameExtParams): [string[], string[], string[]] {
  let gene = SelectBattleGroupGeneFn.createBasicForAttackCountry(ctx, playerId, ext)
  gene = simulatedAnnealing(100, 50, 1000, 0.7, gene) as SelectBattleGroupGene
  //gene = DSP(2, 2, 50, gene) as SelectBattleGroupGene
  //gene = geneticAlgorithm(5, 100, 20, 0.7, gene) as SelectBattleGroupGene
  //gene = optAlgByPSO(2, 100, 20, 0.7, gene) as SelectBattleGroupGene
  const area1 = getItemIdsByBasyou(gene.ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア1")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
  const area2 = getItemIdsByBasyou(gene.ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア2")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
  const homeIds = getItemIdsByBasyou(gene.ctx, AbsoluteBaSyouFn.of(playerId, "配備エリア")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
  return [area1, area2, homeIds]
}

export function createBattleGroupForDefenceBattle(ctx: GameState, playerId: PlayerID, ext: GameExtParams): [string[], string[], string[]] {
  let gene = SelectBattleGroupGeneFn.createBasicForDefenceBattle(ctx, playerId, ext)
  //gene = simulatedAnnealing(100, 50, 1000, 0.8, gene) as SelectBattleGroupGene
  //gene = DSP(2, 2, 50, gene) as SelectBattleGroupGene
  //gene = geneticAlgorithm(5, 100, 20, 0.7, gene) as SelectBattleGroupGene
  gene = optAlgByPSO(3, 30, 20, 0.7, gene) as SelectBattleGroupGene
  const area1 = getItemIdsByBasyou(gene.ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア1")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
  const area2 = getItemIdsByBasyou(gene.ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア2")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
  const homeIds = getItemIdsByBasyou(gene.ctx, AbsoluteBaSyouFn.of(playerId, "配備エリア")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
  return [area1, area2, homeIds]
}

export function createBattleGroupForAttackBattle(ctx: GameState, playerId: PlayerID, ext: GameExtParams): [string[], string[], string[], string[], string[], string[]] {
  let gene = SelectBattleGroupGeneFn.createBasicForAttackBattle(ctx, playerId, ext)
  gene = optAlgByPSO(0, 5, 1, 0, gene) as SelectBattleGroupGene
  if (gene.getFitness() < 0) {
    return [[], [], [], [], [], []]
  }
  const area1 = getItemIdsByBasyou(gene.ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア1")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
  const area2 = getItemIdsByBasyou(gene.ctx, AbsoluteBaSyouFn.of(playerId, "戦闘エリア2")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)
  const homeIds = getItemIdsByBasyou(gene.ctx, AbsoluteBaSyouFn.of(playerId, "配備エリア")).filter(itemId => getSetGroupRoot(ctx, itemId) == itemId)

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
