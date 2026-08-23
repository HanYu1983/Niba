import type { ScenarioDefinition } from '../../editor/editorTypes'

/**
 * 官方劇本章節 Catalog。
 *
 * 每個章節以 ScenarioDefinition 定義（地圖、實體、任務、對話），
 * 可透過 gameStore.loadScenario 載入為 GameState。
 *
 * 章節 id 同時作為 storyDialogueCatalog 的索引鍵（chapterKey），
 * 因此對話觸發條件能正確對應到章節。
 */
export const campaignScenarioCatalog: Record<string, ScenarioDefinition> = {
  'prologue-village': {
    version: '1.0.0',
    id: 'prologue-village',
    title: '序章：青石遺恨',
    description: '青石村妖氣頻生，村長委託主角討伐盤踞村外的妖物。',
    chapterIndex: 0,
    mapSize: { rows: 10, columns: 10 },
    cells: (() => {
      const rows = 10
      const columns = 10
      const cells: ScenarioDefinition['cells'] = []
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const isBorder = row === 0 || column === 0 || row === rows - 1 || column === columns - 1
          const isForest = !isBorder && row >= 4 && row <= 5 && column >= 2 && column <= 7
          const isMountain = !isBorder && row >= 1 && row <= 3 && column >= 6 && column <= 8
          cells.push({
            row,
            column,
            terrain: isBorder ? 'wall' : isMountain ? 'mountain' : isForest ? 'forest' : 'plain',
          })
        }
      }
      return cells
    })(),
    entities: [
      {
        id: 'player-1',
        kind: 'player',
        position: { row: 8, column: 2 },
        data: {
          name: '主角',
          money: 50,
          innerSkillId: 'tuna-gong',
          innerSkillIds: ['tuna-gong'],
          externalSkillIds: ['sky-breaking-palm'],
          equippedExternalSkillIds: ['sky-breaking-palm'],
          inventory: [
            { itemId: 'heal-wound-medicine', quantity: 2 },
            { itemId: 'gather-qi-pill', quantity: 1 },
          ],
        },
      },
      {
        id: 'base-qingshi',
        kind: 'base',
        position: { row: 8, column: 3 },
        data: {
          name: '青石村',
          buildingMaterials: 60,
          maxBuildingMaterials: 100,
          health: 100,
          maxHealth: 100,
          discovered: true,
          presetBuildings: [
            { type: 'infirmary', level: 1 },
            { type: 'board', level: 1 },
            { type: 'warehouse', level: 1 },
          ],
        },
      },
      {
        id: 'nest-prologue',
        kind: 'nest',
        position: { row: 2, column: 8 },
        data: {
          name: '妖物巢穴',
          health: 40,
          maxHealth: 40,
          spawnChance: 0.1,
          cooldownRounds: 0,
          spawnLevel: 1,
          behaviorType: 'sieger',
          schoolId: 'swift-wind',
        },
      },
      {
        id: 'boss-prologue',
        kind: 'creature',
        position: { row: 2, column: 7 },
        data: {
          name: '青石妖王',
          isBoss: true,
          level: 3,
          schoolId: 'swift-wind',
          behaviorType: 'sieger',
          homeNestId: 'nest-prologue',
          attributes: { armStrength: 10, constitution: 10, agility: 9, innerEnergy: 8, insight: 8 },
        },
      },
    ],
    quests: {
      victoryObjectives: [
        {
          id: 'obj-defeat-boss',
          title: '擊敗青石妖王',
          type: 'defeat-creature',
          targetId: 'boss-prologue',
          targetValue: 1,
        },
      ],
      failConditions: {
        baseMustSurvive: true,
        playerMustSurvive: true,
        maxRounds: 20,
      },
    },
    dialogues: {
      'group-prologue-start': {
        name: '序章開局對話',
        steps: [
          {
            id: 'prologue-start-1',
            speakerName: '村長 趙無極',
            speakerIcon: '👴',
            content: '少俠，青石村近來妖氣頻生，村外還出現了作祟的妖物。煩請你助我一臂之力。',
          },
          {
            id: 'prologue-start-2',
            speakerName: '主角',
            speakerIcon: '🥋',
            content: '妖患不除，村中難安。我這便去打探一番。',
          },
        ],
      },
      'group-prologue-victory': {
        name: '序章勝利對話',
        steps: [
          {
            id: 'prologue-boss-victory-1',
            speakerName: '村長 趙無極',
            speakerIcon: '👴',
            content: '那妖物終於伏誅！青石村得救矣——少俠大恩，老夫此生不忘。',
          },
        ],
      },
    },
    triggers: [
      { id: 'trigger-start', condition: 'on-start', action: 'start-dialogue', actionParam: 'group-prologue-start' },
      { id: 'trigger-victory', condition: 'on-victory', action: 'start-dialogue', actionParam: 'group-prologue-victory' },
    ],
  },
  'chapter1-shadow-temple': {
    version: '1.0.0',
    id: 'chapter1-shadow-temple',
    title: '第一章：荒廟影禍',
    description: '青石妖王伏誅後，殘黨遁入北嶺古道的荒廢山神廟。幽影妖盤踞其間，夜襲往來商旅——追蹤而上，剷除影巢。',
    chapterIndex: 1,
    mapSize: { rows: 12, columns: 12 },
    cells: (() => {
      const rows = 12
      const columns = 12
      const cells: ScenarioDefinition['cells'] = []
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const isBorder = row === 0 || column === 0 || row === rows - 1 || column === columns - 1
          const isMountain = !isBorder && row <= 4 && column >= 6 && column <= 10
          const isWater = !isBorder && row >= 6 && row <= 7 && column === 10
          const isForest = !isBorder && row >= 5 && row <= 7 && column >= 3 && column <= 8
          cells.push({
            row,
            column,
            terrain: isBorder ? 'wall' : isMountain ? 'mountain' : isWater ? 'water' : isForest ? 'forest' : 'plain',
          })
        }
      }
      return cells
    })(),
    entities: [
      {
        id: 'player-1',
        kind: 'player',
        position: { row: 10, column: 2 },
        data: {
          name: '主角',
          money: 80,
          innerSkillId: 'tuna-gong',
          innerSkillIds: ['tuna-gong'],
          externalSkillIds: ['sky-breaking-palm'],
          equippedExternalSkillIds: ['sky-breaking-palm'],
          inventory: [
            { itemId: 'heal-wound-medicine', quantity: 3 },
            { itemId: 'gather-qi-pill', quantity: 2 },
          ],
        },
      },
      {
        id: 'base-mountain-inn',
        kind: 'base',
        position: { row: 10, column: 3 },
        data: {
          name: '山間客棧',
          buildingMaterials: 80,
          maxBuildingMaterials: 120,
          health: 100,
          maxHealth: 100,
          discovered: true,
          presetBuildings: [
            { type: 'infirmary', level: 1 },
            { type: 'board', level: 1 },
            { type: 'warehouse', level: 1 },
          ],
        },
      },
      {
        id: 'nest-shadow',
        kind: 'nest',
        position: { row: 2, column: 9 },
        data: {
          name: '幽影巢穴',
          health: 50,
          maxHealth: 50,
          spawnChance: 0.15,
          cooldownRounds: 0,
          spawnLevel: 2,
          behaviorType: 'roamer',
          schoolId: 'ghost-shadow',
        },
      },
      {
        id: 'boss-shadow-master',
        kind: 'creature',
        position: { row: 2, column: 8 },
        data: {
          name: '影魅護法',
          isBoss: true,
          level: 3,
          schoolId: 'ghost-shadow',
          behaviorType: 'sieger',
          homeNestId: 'nest-shadow',
          attributes: { armStrength: 8, constitution: 9, agility: 12, innerEnergy: 9, insight: 9 },
          maxHealthOverride: 65,
        },
      },
      {
        id: 'scout-shadow-a',
        kind: 'creature',
        position: { row: 5, column: 5 },
        data: {
          name: '影卒·甲',
          level: 1,
          schoolId: 'ghost-shadow',
          behaviorType: 'hunter',
          homeNestId: 'nest-shadow',
          attributes: { armStrength: 6, constitution: 5, agility: 9, innerEnergy: 5, insight: 5 },
        },
      },
      {
        id: 'scout-shadow-b',
        kind: 'creature',
        position: { row: 8, column: 9 },
        data: {
          name: '影卒·乙',
          level: 1,
          schoolId: 'ghost-shadow',
          behaviorType: 'roamer',
          homeNestId: 'nest-shadow',
          attributes: { armStrength: 5, constitution: 6, agility: 8, innerEnergy: 5, insight: 6 },
        },
      },
    ],
    quests: {
      victoryObjectives: [
        {
          id: 'obj-defeat-shadow-boss',
          title: '擊敗影魅護法',
          type: 'defeat-creature',
          targetId: 'boss-shadow-master',
          targetValue: 1,
        },
        {
          id: 'obj-hold-inn',
          title: '守住山間客棧十回合',
          type: 'survive-rounds',
          targetValue: 10,
          isOptional: true,
        },
      ],
      failConditions: {
        baseMustSurvive: true,
        playerMustSurvive: true,
        maxRounds: 25,
      },
    },
    dialogues: {
      'group-c1-start': {
        name: '第一章開局對話',
        steps: [
          {
            id: 'c1-start-1',
            speakerName: '村長 趙無極',
            speakerIcon: '👴',
            content: '少俠，青石妖王雖除，然其黨羽已遁入北嶺古道。據聞荒廟之中有「影魅」盤踞，連番夜襲行旅。',
          },
          {
            id: 'c1-start-2',
            speakerName: '主角',
            speakerIcon: '🥋',
            content: '斬草須除根。此番北上，必叫群邪無所遁形。',
          },
        ],
      },
      'group-c1-warn': {
        name: '第一章第五回合警告對話',
        steps: [
          {
            id: 'c1-warn-1',
            speakerName: '主角',
            speakerIcon: '🥋',
            content: '夜色漸深，林間影動愈頻——它們按捺不住，要傾巢而出了。',
          },
        ],
      },
      'group-c1-victory': {
        name: '第一章勝利對話',
        steps: [
          {
            id: 'c1-victory-1',
            speakerName: '主角',
            speakerIcon: '🥋',
            content: '影巢已平，北嶺古道重見天日。',
          },
          {
            id: 'c1-victory-2',
            speakerName: '村長 趙無極',
            speakerIcon: '👴',
            content: '好！有少俠在，江湖宵小不足為懼。',
          },
        ],
      },
    },
    triggers: [
      { id: 'trigger-start', condition: 'on-start', action: 'start-dialogue', actionParam: 'group-c1-start' },
      { id: 'trigger-round5-warn', condition: 'on-round-reached', conditionParam: '5', action: 'start-dialogue', actionParam: 'group-c1-warn' },
      { id: 'trigger-victory', condition: 'on-victory', action: 'start-dialogue', actionParam: 'group-c1-victory' },
    ],
  },
}

/** 取得所有章節的簡介清單（供章節選擇 UI 使用）。 */
export function getCampaignChapterList(): Array<{ id: string; title: string; description: string; chapterIndex: number }> {
  return Object.values(campaignScenarioCatalog)
    .sort((a, b) => a.chapterIndex - b.chapterIndex)
    .map((scenario) => ({
      id: scenario.id,
      title: scenario.title,
      description: scenario.description,
      chapterIndex: scenario.chapterIndex,
    }))
}
