import { dropRepeats } from "ramda";
import { getPrototype } from "../../script";
import { choise, DSP, geneticAlgorithm, hillClimbing, optAlgByPSO, randInt, simulatedAnnealing } from "../../tool/optalg/basic";
import { IGene } from "../../tool/optalg/IGene";
import { AbsoluteBaSyouFn } from "../define/BaSyou";
import { BattleBonus } from "../define/CardText";
import { GameExtParams } from "../define/GameExtParams";
import { PlayerA, PlayerB, PlayerID, PlayerIDFn } from "../define/PlayerID";
import { getBattleGroupBattlePoint, isABattleGroup } from "../gameState/battleGroup";
import { getCardBattlePoint, getCardSpecialText, getCardTexts } from "../gameState/card";
import { addCards, createCardWithProtoIds } from "../gameState/CardTableComponent";
import { createDecks } from "../gameState/cardTextTestEnv";
import { createGameState, GameState } from "../gameState/GameState";
import { getItemIdsByBasyou } from "../gameState/ItemTableComponent";
import { doPlayerAttack, getPlayerUnitCanGoEarthIds, getPlayerUnitCanGoSpaceIds, getPlayerUnitIds } from "../gameState/player";
import { getSetGroupBattlePoint, isSetGroupHasA } from "../gameState/setGroup";

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


  throw new Error()
}

type BattleStageEncode = {
  area1: BattleGroupEncode
  area2: BattleGroupEncode
  area3: BattleGroupEncode
}

const BattleStageEncodeFn = {
  distance(left: BattleStageEncode, right: BattleStageEncode): number {
    return BattleGroupEncodeFn.distance(left.area1, right.area1) + BattleGroupEncodeFn.distance(left.area2, right.area2)
  },
  createEmpty(): BattleStageEncode {
    return {
      area1: BattleGroupEncodeFn.createEmpty(),
      area2: BattleGroupEncodeFn.createEmpty(),
      area3: BattleGroupEncodeFn.createEmpty(),
    }
  },
  fromAttackPlayer(ctx: GameState, playerId: PlayerID, ext: GameExtParams): BattleStageEncode {
    return {
      area1: BattleGroupEncodeFn.fromItemIds(ctx, getPlayerUnitIds(ctx, playerId), ext),
      area2: BattleGroupEncodeFn.fromItemIds(ctx, getPlayerUnitCanGoEarthIds(ctx, PlayerIDFn.getOpponent(playerId)), ext),
      area3: BattleGroupEncodeFn.fromItemIds(ctx, getPlayerUnitCanGoSpaceIds(ctx, PlayerIDFn.getOpponent(playerId)), ext)
    }
  },
  fromDefencePlayer(ctx: GameState, playerId: PlayerID, ext: GameExtParams): BattleStageEncode {
    return {
      area1: BattleGroupEncodeFn.fromItemIds(ctx, getPlayerUnitIds(ctx, playerId), ext),
      area2: BattleGroupEncodeFn.fromItemIds(ctx, getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerIDFn.getOpponent(playerId), "戦闘エリア1")), ext),
      area3: BattleGroupEncodeFn.fromItemIds(ctx, getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerIDFn.getOpponent(playerId), "戦闘エリア2")), ext)
    }
  },
  fromItemIds(ctx: GameState, itemIds: [string[], string[], string[]], ext: GameExtParams): BattleStageEncode {
    return {
      area1: BattleGroupEncodeFn.fromItemIds(ctx, itemIds[0], ext),
      area2: BattleGroupEncodeFn.fromItemIds(ctx, itemIds[1], ext),
      area3: BattleGroupEncodeFn.fromItemIds(ctx, itemIds[2], ext)
    }
  }
}

type BattleGroupGene = {
  ctx: GameState
  playerId: PlayerID
  score: number
  unitIds: [string[], string[]]
  env: BattleEnv,
  encode(ctx: GameState, ext: GameExtParams): BattleStageEncode;
} & IGene



function getScore(ctx: GameState, playerId: PlayerID) {
  return 0
}



function main() {
  const env: BattleEnv = {
    attackUnitIds: [[], []],
    guardUnitIds: [[], []],
  }
  let ctx = createGameState()
  let attackGene = createBattleGroupGene(ctx, PlayerA, env)
  let guardGene = createBattleGroupGene(ctx, PlayerB, env)

  attackGene = hillClimbing(10, 0, attackGene) as BattleGroupGene
  env.attackUnitIds = attackGene.unitIds
  const attackInput = BattleStageEncodeFn.fromAttackPlayer(ctx, PlayerA, {})

  for (let i = 0; i < 1000; ++i) {
    const defenceInput = BattleStageEncodeFn.fromDefencePlayer(ctx, PlayerB, {})
    guardGene = hillClimbing(10, 0, guardGene) as BattleGroupGene
    const defenceOutput = guardGene.encode(ctx, {})
    //saveTraningSet(defenceInput, defenceOutput)
    env.guardUnitIds = guardGene.unitIds

    attackGene = hillClimbing(10, 0, attackGene) as BattleGroupGene
    env.attackUnitIds = attackGene.unitIds
  }
  const attackOutput = attackGene.encode(ctx, {})
  //saveTraningSet(attackInput, attackOutput)
}

function createBattleGroupGene(ctx: GameState, playerId: PlayerID, env: BattleEnv): BattleGroupGene {
  return {
    ctx: ctx,
    playerId: playerId,
    score: 0,
    unitIds: [[], []],
    env: env,
    calcFitness() {
      // go earth
      // go space
      // 速度1
      ctx = doPlayerAttack(ctx, playerId, "戦闘エリア1", 1, {})
      ctx = doPlayerAttack(ctx, playerId, "戦闘エリア2", 1, {})
      // 速度2
      ctx = doPlayerAttack(ctx, playerId, "戦闘エリア1", 2, {})
      ctx = doPlayerAttack(ctx, playerId, "戦闘エリア2", 2, {})
      this.score = getScore(ctx, playerId)
      return this.score
    },
    getFitness() {
      return this.score
    },
    crossover(gene: BattleGroupGene): BattleGroupGene {
      // 同區中相同的機體留下來
      // 不同的機體隨機換區
      return {
        ...this,
        unitIds: [[], []]
      }
    },
    mutate(): BattleGroupGene {
      // 隨機修改出擊陣列，比如單機換區，換位等
      return {
        ...this
      }
    },
    encode(ctx: GameState, ext: GameExtParams): BattleStageEncode {
      return BattleStageEncodeFn.fromItemIds(ctx, [[], [], []], ext)
    }
  }
}