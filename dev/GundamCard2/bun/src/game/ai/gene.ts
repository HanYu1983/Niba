import { getPrototype } from "../../script";
import { hillClimbing, simulatedAnnealing } from "../../tool/optalg/basic";
import { IGene } from "../../tool/optalg/IGene";
import { AbsoluteBaSyouFn } from "../define/BaSyou";
import { BattleBonus } from "../define/CardText";
import { GameExtParams } from "../define/GameExtParams";
import { PlayerA, PlayerB, PlayerID } from "../define/PlayerID";
import { isABattleGroup } from "../gameState/battleGroup";
import { getCardBattlePoint } from "../gameState/card";
import { addCards, createCardWithProtoIds } from "../gameState/CardTableComponent";
import { createDecks } from "../gameState/cardTextTestEnv";
import { createGameState, GameState } from "../gameState/GameState";
import { getItemIdsByBasyou } from "../gameState/ItemTableComponent";
import { doPlayerAttack, getPlayerUnitIds } from "../gameState/player";
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
  hasSpeed: boolean
}

function encodeSetGroup(ctx: GameState, itemId: string, ext: GameExtParams): SetGroupEncode {
  const bp = getSetGroupBattlePoint(ctx, itemId, ext)
  const hasHigh = isSetGroupHasA(ctx, ["高機動"], itemId, ext)
  const hasStrong = isSetGroupHasA(ctx, ["強襲"], itemId, ext)
  const hasSpeed = isSetGroupHasA(ctx, ["速攻"], itemId, ext)
  return { itemId, bp, hasHigh, hasStrong, hasSpeed }
}

type BattleGroupEncode = {
  itemIds: string[],
  bps: BattleBonus[],
  power: number,
  hp: number,
  hasHigh: number,
  hasStrong: number,
  hasSpeed: number,
  setGroupLength: number,
}

function encodeBattleGroup(setGroupEncodes: SetGroupEncode[]): BattleGroupEncode {
  const power = setGroupEncodes.map((v, i) => {
    if (i == 0) {
      return v.bp[0]
    }
    return v.bp[1]
  }).reduce((a, b) => a + b, 0)
  const hp = setGroupEncodes.map(v => v.bp[2]).reduce((a, b) => a + b, 0)
  const hasHigh = setGroupEncodes.filter(v => v.hasHigh).length
  const hasStrong = setGroupEncodes.filter(v => v.hasStrong).length
  const hasSpeed = setGroupEncodes.filter(v => v.hasSpeed).length
  const bps = setGroupEncodes.map(v => v.bp)
  return {
    itemIds: setGroupEncodes.map(s => s.itemId), bps, power, hp, hasHigh, hasStrong, hasSpeed, setGroupLength: setGroupEncodes.length
  }
}

const BattleGroupEncodeFn = {
  distance(left: BattleGroupEncode, right: BattleGroupEncode, options?: { isAttackSide: boolean }): number {
    const LV0 = 10
    const LV1 = 200
    const LV2 = 500
    const LV3 = 1000
    let dist = 0
    if (left.hasHigh != right.hasHigh) {
      dist += Math.abs(left.hasHigh - right.hasHigh) * LV1
    }
    if (options?.isAttackSide) {
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
      if (options?.isAttackSide) {
        if ((left.hasStrong == left.setGroupLength) != (right.hasStrong == right.setGroupLength)) {
          dist += LV2
        }
      }
      if ((left.hasSpeed == left.setGroupLength) != (right.hasSpeed == right.setGroupLength)) {
        dist += LV3
      }
    }
    dist += LV0 * Math.abs(left.power - right.power)
    for (let i = 0; i < Math.min(left.bps.length, right.bps.length); ++i) {
      const leftBp = left.bps[i]
      const rightBp = right.bps[i]
      dist += LV0 * Math.sqrt(Math.pow(leftBp[0] - rightBp[0], 2) + Math.pow(leftBp[1] - rightBp[1], 2) + Math.pow(leftBp[2] - rightBp[2], 2))
    }
    dist += LV0 * Math.abs(left.hp - right.hp)
    dist += LV0 * Math.abs(left.setGroupLength - right.setGroupLength)
    return dist
  },
  fromItemIds(ctx: GameState, itemIds: string[], ext: GameExtParams): BattleGroupEncode {
    return encodeBattleGroup(itemIds.map(itemId => encodeSetGroup(ctx, itemId, ext)))
  }
}

type BattleGroupBothEncode = {
  area1: BattleGroupEncode
  area2: BattleGroupEncode
}

const BattleGroupBothEncodeFn = {
  distance(left: BattleGroupBothEncode, right: BattleGroupBothEncode): number {
    return BattleGroupEncodeFn.distance(left.area1, right.area1) + BattleGroupEncodeFn.distance(left.area2, right.area2)
  },
  fromItemIds(ctx: GameState, itemIds: [string[], string[]], ext: GameExtParams): BattleGroupBothEncode {
    return {
      area1: BattleGroupEncodeFn.fromItemIds(ctx, itemIds[0], ext),
      area2: BattleGroupEncodeFn.fromItemIds(ctx, itemIds[1], ext)
    }
  }
}

type BattleGroupGene = {
  ctx: GameState
  playerId: PlayerID
  score: number
  unitIds: [string[], string[]]
  env: BattleEnv,
  encode(ctx: GameState, ext: GameExtParams): BattleGroupBothEncode;
} & IGene

export function testSetGroupEncode() {
  const decks = createDecks()
  const allProtoIds = decks.flatMap(v => v)
  if (allProtoIds == null) {
    throw new Error()
  }
  let ctx = createGameState()
  ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"), allProtoIds.map(protoId => {
    return {
      id: protoId,
      protoID: protoId
    }
  })) as GameState
  const allUnitProtos = allProtoIds.filter(cardId => {
    const proto = getPrototype(cardId)
    return proto.category == "ユニット"
  })
  const allUnitProtosHasSp = allUnitProtos.filter(cardId => {
    const proto = getPrototype(cardId)
    return proto.texts?.find(text => text.title[0] == "特殊型" && (text.title[1][0] == "高機動" /*|| text.title[1][0] == "強襲" ||  text.title[1][0] == "速攻"*/))
  })
  const unitIdsHasHigh: string[] = []
  for (let i = 0; i < 2; ++i) {
    const pool = allUnitProtosHasSp
    unitIdsHasHigh.push(pool[Math.floor(Math.random() * 1000) % pool.length])
  }
  const encodeUnitHasHigh = BattleGroupEncodeFn.fromItemIds(ctx, unitIdsHasHigh, {})

  {
    let gene: IGene & any = {
      unitIds: [],
      score: 0,
      calcFitness(): number {
        this.score = 100000 - BattleGroupEncodeFn.distance(
          BattleGroupEncodeFn.fromItemIds(ctx, this.unitIds, {}),
          encodeUnitHasHigh,
          { isAttackSide: true }
        )
        return this.score
      },
      getFitness(): number {
        return this.score
      },
      mutate(): IGene {
        let unitIds = [...this.unitIds]
        const rand = Math.random()
        if (rand < 0.33) {
          const pool = allUnitProtos.slice()
          let selectId = 0
          for (let i = 0; i < 10; ++i) {
            selectId = Math.floor(Math.random() * 1000) % pool.length
            if (unitIds.includes(pool[selectId])) {
              continue
            }
            break
          }
          if (unitIds.includes(pool[selectId]) == false) {
            unitIds.push(pool[selectId])
          }
        } else if (rand < 0.66) {
          const id1 = Math.floor(Math.random() * 1000) % unitIds.length
          unitIds = unitIds.filter(id => id != unitIds[id1])
        } else {
          const id1 = Math.floor(Math.random() * 1000) % unitIds.length
          const id2 = Math.floor(Math.random() * 1000) % unitIds.length
          unitIds[id1], unitIds[id2] = unitIds[id2], unitIds[id1]
        }
        return {
          ...this,
          unitIds: unitIds
        } as any
      },
      crossover(gene: IGene): IGene {
        return this
      }
    }
    gene = simulatedAnnealing(500, 1000, 0.99, gene)
    const result = BattleGroupEncodeFn.fromItemIds(ctx, gene.unitIds, {})
    console.log(encodeUnitHasHigh.itemIds.map((itemId: any) => getCardBattlePoint(ctx, itemId, {})))
    console.log(gene.unitIds.map((itemId: any) => getCardBattlePoint(ctx, itemId, {})))
    console.log(encodeUnitHasHigh)
    console.log(result)
    console.log(BattleGroupEncodeFn.distance(encodeUnitHasHigh, result))

    // const unitProtoIds2 = allProtoIds.filter(cardId => getPrototype(cardId).category == "ユニット").slice(3, 6)
    // ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア2"), unitProtoIds2) as GameState
    // const encode = BattleGroupBothEncodeFn.fromItemIds(
    //   ctx,
    //   [
    //     getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1")),
    //     getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア2"))
    //   ],
    //   {}
    // )
    // console.log(encode)
    // console.log(BattleGroupEncodeFn.distance(encode.area1, encode.area2))
  }

  throw new Error()
}







function getScore(ctx: GameState, playerId: PlayerID) {
  return 0
}

type Stage = {

}

function encodeAttackStage(ctx: GameState): Stage {
  return {}
}

function encodeDefenceStage(ctx: GameState, attackUnitIds: [string[], string[]]): Stage {
  return {}
}

function main() {
  const env: BattleEnv = {
    attackUnitIds: [[], []],
    guardUnitIds: [[], []],
  }
  let ctx = createGameState()
  let attackGene = createBattleGroupGene(ctx, PlayerA, env)
  let guardGene = createBattleGroupGene(ctx, PlayerB, env)

  attackGene = hillClimbing(10, attackGene) as BattleGroupGene
  env.attackUnitIds = attackGene.unitIds
  const attackInput = encodeAttackStage(ctx)

  for (let i = 0; i < 1000; ++i) {
    const defenceInput = encodeDefenceStage(ctx, attackGene.unitIds)
    guardGene = hillClimbing(10, guardGene) as BattleGroupGene
    const defenceOutput = guardGene.encode(ctx, {})
    //saveTraningSet(defenceInput, defenceOutput)
    env.guardUnitIds = guardGene.unitIds

    attackGene = hillClimbing(10, attackGene) as BattleGroupGene
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
    encode(ctx: GameState, ext: GameExtParams): BattleGroupBothEncode {
      return BattleGroupBothEncodeFn.fromItemIds(ctx, this.unitIds, ext)
    }
  }
}