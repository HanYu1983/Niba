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
  // ── 番外篇「玄冥遺禍」三部曲：非教學關卡，難度以巢穴數與怪物數階梯遞增（1→2 巢、3→5→7 隻）──
  'extra-1-blackstone-road': {
    version: '1.0.0',
    id: 'extra-1-blackstone-road',
    title: '番外一：黑潮初現',
    description: '玄冥封印十年，黑石驛道上卻再現妖影。追查失蹤行商的下落，斬殺妖物頭目「影牙」。',
    chapterIndex: 100,
    mapSize: { rows: 12, columns: 12 },
    cells: (() => {
      const rows = 12
      const columns = 12
      const cells: ScenarioDefinition['cells'] = []
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const isBorder = row === 0 || column === 0 || row === rows - 1 || column === columns - 1
          const isRoad = !isBorder && row === 6
          const isForestA = !isBorder && !isRoad && row <= 4 && column >= 7 && column <= 10
          const isForestB = !isBorder && !isRoad && row >= 8 && row <= 10 && column >= 5 && column <= 7
          cells.push({
            row,
            column,
            terrain: isBorder ? 'wall' : isRoad ? 'road' : isForestA || isForestB ? 'forest' : 'plain',
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
          name: '凌淵',
          money: 80,
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
        id: 'base-waystation-inn',
        kind: 'base',
        position: { row: 10, column: 3 },
        data: {
          name: '驛站小棧',
          buildingMaterials: 70,
          maxBuildingMaterials: 110,
          health: 100,
          maxHealth: 100,
          discovered: true,
          presetBuildings: [
            { type: 'infirmary', level: 1 },
            { type: 'board', level: 1 },
          ],
        },
      },
      {
        id: 'nest-ex1',
        kind: 'nest',
        position: { row: 2, column: 9 },
        data: {
          name: '黑影妖窟',
          health: 45,
          maxHealth: 45,
          spawnChance: 0.12,
          cooldownRounds: 0,
          spawnLevel: 1,
          behaviorType: 'hunter',
          schoolId: 'void-spirit',
        },
      },
      {
        id: 'elite-shadow-fang',
        kind: 'creature',
        position: { row: 4, column: 7 },
        data: {
          name: '影牙',
          isBoss: false,
          level: 2,
          schoolId: 'void-spirit',
          behaviorType: 'hunter',
          homeNestId: 'nest-ex1',
          attributes: { armStrength: 7, constitution: 6, agility: 9, innerEnergy: 6, insight: 7 },
          aggroRange: 4,
        },
      },
      {
        id: 'patrol-ex1-a',
        kind: 'creature',
        position: { row: 5, column: 8 },
        data: {
          name: '巡影·甲',
          level: 1,
          schoolId: 'void-spirit',
          behaviorType: 'roamer',
          homeNestId: 'nest-ex1',
          attributes: { armStrength: 6, constitution: 5, agility: 7, innerEnergy: 5, insight: 5 },
          aggroRange: 2,
        },
      },
      {
        id: 'patrol-ex1-b',
        kind: 'creature',
        position: { row: 8, column: 7 },
        data: {
          name: '巡影·乙',
          level: 1,
          schoolId: 'void-spirit',
          behaviorType: 'hunter',
          homeNestId: 'nest-ex1',
          attributes: { armStrength: 6, constitution: 5, agility: 8, innerEnergy: 5, insight: 5 },
          aggroRange: 3,
        },
      },
    ],
    quests: {
      victoryObjectives: [
        {
          id: 'obj-ex1-defeat-fang',
          title: '誅殺妖物頭目影牙',
          type: 'defeat-creature',
          targetId: 'elite-shadow-fang',
          targetValue: 1,
        },
        {
          id: 'obj-ex1-survive',
          title: '守住驛站小棧十二回合',
          type: 'survive-rounds',
          targetValue: 12,
          isOptional: true,
        },
      ],
      failConditions: {
        baseMustSurvive: true,
        playerMustSurvive: true,
        maxRounds: 22,
      },
    },
    dialogues: {
      'group-ex1-start': {
        name: '番外一開局對話',
        steps: [
          {
            id: 'ex1-start-1',
            speakerName: '白衣',
            speakerIcon: '🤍',
            content: '凌少俠，黑石驛道夜有黑影出沒，行商屢屢失蹤——那氣息……與玄冥爪牙同源。',
          },
          {
            id: 'ex1-start-2',
            speakerName: '凌淵',
            speakerIcon: '🗡️',
            content: '師父封印玄冥已十載，莫非封印有變？且先斬了這些探子。',
          },
        ],
      },
      'group-ex1-warn': {
        name: '番外一第六回合警告對話',
        steps: [
          {
            id: 'ex1-warn-1',
            speakerName: '白衣',
            speakerIcon: '🤍',
            content: '影動愈密——巢穴裡的東西察覺我們了，速戰速決。',
          },
        ],
      },
      'group-ex1-victory': {
        name: '番外一勝利對話',
        steps: [
          {
            id: 'ex1-victory-1',
            speakerName: '凌淵',
            speakerIcon: '🗡️',
            content: '影牙已誅，可這信物……不是尋常妖物該有的東西。',
          },
          {
            id: 'ex1-victory-2',
            speakerName: '白衣',
            speakerIcon: '🤍',
            content: '霜林渡方向妖氣更盛。看來，這只是前哨。',
          },
        ],
      },
    },
    triggers: [
      { id: 'trigger-ex1-start', condition: 'on-start', action: 'start-dialogue', actionParam: 'group-ex1-start' },
      { id: 'trigger-ex1-round6', condition: 'on-round-reached', conditionParam: '6', action: 'start-dialogue', actionParam: 'group-ex1-warn' },
      { id: 'trigger-ex1-victory', condition: 'on-victory', action: 'start-dialogue', actionParam: 'group-ex1-victory' },
    ],
  },
  'extra-2-frost-ford': {
    version: '1.0.0',
    id: 'extra-2-frost-ford',
    title: '番外二：霜林夜襲',
    description: '蠱面判官率妖眾夜渡霜林渡口，北岸三鎮命懸一線。守住渡口客棧，反擊妖潮。',
    chapterIndex: 101,
    mapSize: { rows: 13, columns: 13 },
    cells: (() => {
      const rows = 13
      const columns = 13
      const cells: ScenarioDefinition['cells'] = []
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const isBorder = row === 0 || column === 0 || row === rows - 1 || column === columns - 1
          const isBridge = !isBorder && column === 6 && (row === 6 || row === 7)
          const isRiver = !isBorder && column === 6 && !isBridge
          const isForestW = !isBorder && column >= 2 && column <= 4 && row >= 1 && row <= 4
          const isForestE = !isBorder && column >= 8 && column <= 11 && row >= 8 && row <= 11
          cells.push({
            row,
            column,
            terrain: isBorder ? 'wall' : isBridge ? 'road' : isRiver ? 'water' : isForestW || isForestE ? 'forest' : 'plain',
          })
        }
      }
      return cells
    })(),
    entities: [
      {
        id: 'player-1',
        kind: 'player',
        position: { row: 11, column: 2 },
        data: {
          name: '凌淵',
          money: 100,
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
        id: 'base-ford-inn',
        kind: 'base',
        position: { row: 11, column: 3 },
        data: {
          name: '渡口客棧',
          buildingMaterials: 90,
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
        id: 'nest-ex2-w',
        kind: 'nest',
        position: { row: 2, column: 3 },
        data: {
          name: '霧林妖窟·西',
          health: 50,
          maxHealth: 50,
          spawnChance: 0.15,
          cooldownRounds: 0,
          spawnLevel: 2,
          behaviorType: 'hunter',
          schoolId: 'hundred-poison',
        },
      },
      {
        id: 'nest-ex2-e',
        kind: 'nest',
        position: { row: 2, column: 9 },
        data: {
          name: '霧林妖窟·東',
          health: 50,
          maxHealth: 50,
          spawnChance: 0.15,
          cooldownRounds: 0,
          spawnLevel: 2,
          behaviorType: 'roamer',
          schoolId: 'void-spirit',
        },
      },
      {
        id: 'boss-poison-judge',
        kind: 'creature',
        position: { row: 5, column: 4 },
        data: {
          name: '蠱面判官',
          isBoss: true,
          level: 3,
          schoolId: 'hundred-poison',
          behaviorType: 'sieger',
          homeNestId: 'nest-ex2-w',
          attributes: { armStrength: 9, constitution: 9, agility: 10, innerEnergy: 9, insight: 10 },
          maxHealthOverride: 60,
          aggroRange: 4,
        },
      },
      {
        id: 'venom-ex2-a',
        kind: 'creature',
        position: { row: 4, column: 9 },
        data: {
          name: '毒卒·甲',
          level: 1,
          schoolId: 'hundred-poison',
          behaviorType: 'hunter',
          homeNestId: 'nest-ex2-w',
          attributes: { armStrength: 6, constitution: 5, agility: 7, innerEnergy: 5, insight: 6 },
          aggroRange: 3,
        },
      },
      {
        id: 'venom-ex2-b',
        kind: 'creature',
        position: { row: 8, column: 3 },
        data: {
          name: '毒卒·乙',
          level: 1,
          schoolId: 'hundred-poison',
          behaviorType: 'roamer',
          homeNestId: 'nest-ex2-w',
          attributes: { armStrength: 5, constitution: 6, agility: 7, innerEnergy: 6, insight: 5 },
          aggroRange: 2,
        },
      },
      {
        id: 'night-fiend-ex2',
        kind: 'creature',
        position: { row: 7, column: 8 },
        data: {
          name: '夜行妖',
          level: 1,
          schoolId: 'void-spirit',
          behaviorType: 'hunter',
          homeNestId: 'nest-ex2-e',
          attributes: { armStrength: 6, constitution: 5, agility: 8, innerEnergy: 5, insight: 5 },
          aggroRange: 3,
        },
      },
      {
        id: 'river-rover-ex2',
        kind: 'creature',
        position: { row: 9, column: 9 },
        data: {
          name: '巡河妖',
          level: 1,
          schoolId: 'void-spirit',
          behaviorType: 'roamer',
          homeNestId: 'nest-ex2-e',
          attributes: { armStrength: 5, constitution: 6, agility: 7, innerEnergy: 5, insight: 6 },
          aggroRange: 2,
        },
      },
    ],
    quests: {
      victoryObjectives: [
        {
          id: 'obj-ex2-defeat-judge',
          title: '擊敗蠱面判官',
          type: 'defeat-creature',
          targetId: 'boss-poison-judge',
          targetValue: 1,
        },
        {
          id: 'obj-ex2-survive',
          title: '守住渡口客棧十五回合',
          type: 'survive-rounds',
          targetValue: 15,
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
      'group-ex2-start': {
        name: '番外二開局對話',
        steps: [
          {
            id: 'ex2-start-1',
            speakerName: '白衣',
            speakerIcon: '🤍',
            content: '蠱面判官率眾夜襲霜林渡——渡口一失，北岸三鎮皆成孤島。',
          },
          {
            id: 'ex2-start-2',
            speakerName: '凌淵',
            speakerIcon: '🗡️',
            content: '守住宿頭，一個也不放它們過橋。',
          },
        ],
      },
      'group-ex2-warn': {
        name: '番外二第八回合警告對話',
        steps: [
          {
            id: 'ex2-warn-1',
            speakerName: '凌淵',
            speakerIcon: '🗡️',
            content: '第二波妖物上來了——穩住陣腳，橋面狹窄，正好逐一擊破！',
          },
        ],
      },
      'group-ex2-victory': {
        name: '番外二勝利對話',
        steps: [
          {
            id: 'ex2-victory-1',
            speakerName: '凌淵',
            speakerIcon: '🗡️',
            content: '判官伏誅。從他隨身的蠱囊裡搜出了地圖——玄岩妖窟。',
          },
          {
            id: 'ex2-victory-2',
            speakerName: '白衣',
            speakerIcon: '🤍',
            content: '直搗巢穴，絕其根源。此去兇險，少俠珍重。',
          },
        ],
      },
    },
    triggers: [
      { id: 'trigger-ex2-start', condition: 'on-start', action: 'start-dialogue', actionParam: 'group-ex2-start' },
      { id: 'trigger-ex2-round8', condition: 'on-round-reached', conditionParam: '8', action: 'start-dialogue', actionParam: 'group-ex2-warn' },
      { id: 'trigger-ex2-victory', condition: 'on-victory', action: 'start-dialogue', actionParam: 'group-ex2-victory' },
    ],
  },
  'extra-3-darkrock-lair': {
    version: '1.0.0',
    id: 'extra-3-darkrock-lair',
    title: '番外三：玄岩妖窟',
    description: '玄冥首徒幽淵盤踞玄岩深處，三座妖窟遙相呼應。深入絕地，剷平妖窟，了結十年前的血債。',
    chapterIndex: 102,
    mapSize: { rows: 14, columns: 14 },
    cells: (() => {
      const rows = 14
      const columns = 14
      const cells: ScenarioDefinition['cells'] = []
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const isBorder = row === 0 || column === 0 || row === rows - 1 || column === columns - 1
          const isMountain = !isBorder && row <= 6 && column >= 4 && column <= 11
          const isWater = !isBorder && row === 9 && column >= 10
          cells.push({
            row,
            column,
            terrain: isBorder ? 'wall' : isMountain ? 'mountain' : isWater ? 'water' : 'plain',
          })
        }
      }
      return cells
    })(),
    entities: [
      {
        id: 'player-1',
        kind: 'player',
        position: { row: 12, column: 2 },
        data: {
          name: '凌淵',
          money: 120,
          innerSkillId: 'tuna-gong',
          innerSkillIds: ['tuna-gong'],
          externalSkillIds: ['sky-breaking-palm'],
          equippedExternalSkillIds: ['sky-breaking-palm'],
          inventory: [
            { itemId: 'heal-wound-medicine', quantity: 3 },
            { itemId: 'gather-qi-pill', quantity: 3 },
          ],
        },
      },
      {
        id: 'base-forward-camp',
        kind: 'base',
        position: { row: 12, column: 3 },
        data: {
          name: '北征前哨營',
          buildingMaterials: 100,
          maxBuildingMaterials: 130,
          health: 100,
          maxHealth: 100,
          discovered: true,
          presetBuildings: [
            { type: 'infirmary', level: 2 },
            { type: 'board', level: 1 },
            { type: 'warehouse', level: 1 },
          ],
        },
      },
      {
        id: 'nest-ex3-w',
        kind: 'nest',
        position: { row: 3, column: 4 },
        data: {
          name: '玄岩妖窟·西',
          health: 55,
          maxHealth: 55,
          spawnChance: 0.15,
          cooldownRounds: 0,
          spawnLevel: 2,
          behaviorType: 'hunter',
          schoolId: 'void-spirit',
        },
      },
      {
        id: 'nest-ex3-m',
        kind: 'nest',
        position: { row: 5, column: 7 },
        data: {
          name: '玄岩妖窟·中',
          health: 55,
          maxHealth: 55,
          spawnChance: 0.18,
          cooldownRounds: 0,
          spawnLevel: 2,
          behaviorType: 'roamer',
          schoolId: 'ghost-shadow',
        },
      },
      {
        id: 'nest-ex3-e',
        kind: 'nest',
        position: { row: 2, column: 10 },
        data: {
          name: '玄岩妖窟·東',
          health: 55,
          maxHealth: 55,
          spawnChance: 0.15,
          cooldownRounds: 0,
          spawnLevel: 2,
          behaviorType: 'hunter',
          schoolId: 'void-spirit',
        },
      },
      {
        id: 'boss-youyuan',
        kind: 'creature',
        position: { row: 2, column: 8 },
        data: {
          name: '玄冥首徒·幽淵',
          isBoss: true,
          level: 4,
          schoolId: 'void-spirit',
          behaviorType: 'sieger',
          homeNestId: 'nest-ex3-m',
          attributes: { armStrength: 11, constitution: 11, agility: 13, innerEnergy: 11, insight: 11 },
          maxHealthOverride: 85,
          aggroRange: 5,
        },
      },
      {
        id: 'assassin-ex3-a',
        kind: 'creature',
        position: { row: 4, column: 6 },
        data: {
          name: '幽影殺手·甲',
          level: 2,
          schoolId: 'ghost-shadow',
          behaviorType: 'hunter',
          homeNestId: 'nest-ex3-m',
          attributes: { armStrength: 8, constitution: 7, agility: 11, innerEnergy: 7, insight: 8 },
          aggroRange: 4,
        },
      },
      {
        id: 'assassin-ex3-b',
        kind: 'creature',
        position: { row: 4, column: 9 },
        data: {
          name: '幽影殺手·乙',
          level: 2,
          schoolId: 'ghost-shadow',
          behaviorType: 'hunter',
          homeNestId: 'nest-ex3-e',
          attributes: { armStrength: 8, constitution: 7, agility: 11, innerEnergy: 7, insight: 8 },
          aggroRange: 4,
        },
      },
      {
        id: 'fiend-ex3-a',
        kind: 'creature',
        position: { row: 6, column: 4 },
        data: {
          name: '妖卒·甲',
          level: 1,
          schoolId: 'void-spirit',
          behaviorType: 'roamer',
          homeNestId: 'nest-ex3-w',
          attributes: { armStrength: 6, constitution: 5, agility: 7, innerEnergy: 5, insight: 5 },
          aggroRange: 2,
        },
      },
      {
        id: 'fiend-ex3-b',
        kind: 'creature',
        position: { row: 6, column: 10 },
        data: {
          name: '妖卒·乙',
          level: 1,
          schoolId: 'void-spirit',
          behaviorType: 'hunter',
          homeNestId: 'nest-ex3-e',
          attributes: { armStrength: 6, constitution: 5, agility: 8, innerEnergy: 5, insight: 5 },
          aggroRange: 3,
        },
      },
      {
        id: 'fiend-ex3-c',
        kind: 'creature',
        position: { row: 8, column: 7 },
        data: {
          name: '妖卒·丙',
          level: 1,
          schoolId: 'void-spirit',
          behaviorType: 'roamer',
          homeNestId: 'nest-ex3-m',
          attributes: { armStrength: 5, constitution: 6, agility: 7, innerEnergy: 5, insight: 6 },
          aggroRange: 2,
        },
      },
      {
        id: 'fiend-ex3-d',
        kind: 'creature',
        position: { row: 10, column: 9 },
        data: {
          name: '妖卒·丁',
          level: 1,
          schoolId: 'void-spirit',
          behaviorType: 'hunter',
          homeNestId: 'nest-ex3-e',
          attributes: { armStrength: 6, constitution: 5, agility: 8, innerEnergy: 5, insight: 5 },
          aggroRange: 3,
        },
      },
    ],
    quests: {
      victoryObjectives: [
        {
          id: 'obj-ex3-defeat-youyuan',
          title: '誅殺玄冥首徒幽淵',
          type: 'defeat-creature',
          targetId: 'boss-youyuan',
          targetValue: 1,
        },
        {
          id: 'obj-ex3-raze-nests',
          title: '剷平三座妖窟',
          type: 'destroy-nest',
          targetValue: 3,
          isOptional: true,
        },
      ],
      failConditions: {
        baseMustSurvive: true,
        playerMustSurvive: true,
        maxRounds: 28,
      },
    },
    dialogues: {
      'group-ex3-start': {
        name: '番外三開局對話',
        steps: [
          {
            id: 'ex3-start-1',
            speakerName: '白衣',
            speakerIcon: '🤍',
            content: '妖窟深處氣息駭人。幽淵乃玄冥首徒——十年前圍殺你師父的人中，便有他一份。',
          },
          {
            id: 'ex3-start-2',
            speakerName: '凌淵',
            speakerIcon: '🗡️',
            content: '今日，便以他的血祭奠師父在天之靈。',
          },
        ],
      },
      'group-ex3-warn': {
        name: '番外三第十回合警告對話',
        steps: [
          {
            id: 'ex3-warn-1',
            speakerName: '白衣',
            speakerIcon: '🤍',
            content: '三座妖窟同時震動——它們要傾巢而出，掩護幽淵了！',
          },
        ],
      },
      'group-ex3-victory': {
        name: '番外三勝利對話',
        steps: [
          {
            id: 'ex3-victory-1',
            speakerName: '凌淵',
            speakerIcon: '🗡️',
            content: '幽淵授首。可他臨死前說……「封印將破，吾王將醒」。',
          },
          {
            id: 'ex3-victory-2',
            speakerName: '白衣',
            speakerIcon: '🤍',
            content: '看來這只是開端。少俠，江湖與山河，都需要你繼續走下去。',
          },
        ],
      },
    },
    triggers: [
      { id: 'trigger-ex3-start', condition: 'on-start', action: 'start-dialogue', actionParam: 'group-ex3-start' },
      { id: 'trigger-ex3-round10', condition: 'on-round-reached', conditionParam: '10', action: 'start-dialogue', actionParam: 'group-ex3-warn' },
      { id: 'trigger-ex3-victory', condition: 'on-victory', action: 'start-dialogue', actionParam: 'group-ex3-victory' },
    ],
  },
  // ── 番外四：純敘事章節——零戰鬥，全由三個踩點事件構成，每個事件 5~10 句對白 ──
  'extra-4-guardian-trail': {
    version: '1.0.0',
    id: 'extra-4-guardian-trail',
    title: '番外四：故地拾遺',
    description: '白衣引路，重訪師父當年的守護者舊徑。斷劍石、枯靈泉、無字碑——三處舊地，三段被封存的往事。',
    chapterIndex: 103,
    mapSize: { rows: 12, columns: 12 },
    cells: (() => {
      const rows = 12
      const columns = 12
      const cells: ScenarioDefinition['cells'] = []
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const isBorder = row === 0 || column === 0 || row === rows - 1 || column === columns - 1
          const isMountain = !isBorder && row <= 3 && column >= 4 && column <= 8
          const isStream = !isBorder && column === 10 && row >= 4 && row <= 8
          const isForest = !isBorder && !isMountain && !isStream && row <= 5 && column <= 3
          cells.push({
            row,
            column,
            terrain: isBorder ? 'wall' : isMountain ? 'mountain' : isStream ? 'water' : isForest ? 'forest' : 'plain',
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
          name: '凌淵',
          money: 60,
          innerSkillId: 'tuna-gong',
          innerSkillIds: ['tuna-gong'],
          externalSkillIds: ['sky-breaking-palm'],
          equippedExternalSkillIds: [],
          inventory: [
            { itemId: 'heal-wound-medicine', quantity: 1 },
          ],
        },
      },
      {
        id: 'event-broken-sword',
        kind: 'event',
        position: { row: 8, column: 3 },
        data: {
          type: 'custom',
          name: '斷劍石',
          description: '林間一塊青石上斜插著半截斷劍，劍身斑駁，斷口卻平滑如鏡。',
          icon: '⚔️',
          choices: [
            {
              id: 'recall-broken-sword',
              label: '憑弔舊事',
              description: '細看這柄斷劍，想起兒時在此練功的往事。',
              endsPlayerTurn: false,
              requirements: [
                { type: 'active-player' },
                { type: 'player-alive' },
              ],
              effects: [
                { type: 'start-dialogue', dialogueId: 'group-ex4-story-sword' },
              ],
              resultMessage: '凌淵駐足良久，往事如潮湧上心頭。',
            },
          ],
        },
      },
      {
        id: 'event-withered-spring',
        kind: 'event',
        position: { row: 6, column: 9 },
        data: {
          type: 'custom',
          name: '枯靈泉',
          description: '泉眼早已龜裂見底，僅餘一縷細流向東南蜿蜒。泥底沉著幾片鱗狀碎屑。',
          icon: '💧',
          choices: [
            {
              id: 'inspect-withered-spring',
              label: '探看泉眼',
              description: '俯身查看乾涸的泉底與那些鱗狀碎屑。',
              endsPlayerTurn: false,
              requirements: [
                { type: 'active-player' },
                { type: 'player-alive' },
              ],
              effects: [
                { type: 'start-dialogue', dialogueId: 'group-ex4-story-spring' },
              ],
              resultMessage: '泥底的鱗片在日光下泛著微光——那是靈獸蛻下的鱗。',
            },
          ],
        },
      },
      {
        id: 'event-wordless-stele',
        kind: 'event',
        position: { row: 2, column: 6 },
        data: {
          type: 'custom',
          name: '無字碑',
          description: '封印崖頂孤零零立著一塊石碑，通體無一字刻痕，碑前香灰卻是新近的。',
          icon: '🗿',
          choices: [
            {
              id: 'read-wordless-stele',
              label: '佇立碑前',
              description: '撫去碑面塵土，靜立默思。',
              endsPlayerTurn: false,
              requirements: [
                { type: 'active-player' },
                { type: 'player-alive' },
              ],
              effects: [
                { type: 'start-dialogue', dialogueId: 'group-ex4-story-stele' },
              ],
              resultMessage: '山風掠過崖頂，碑影斜長，彷彿有人無聲佇立。',
            },
          ],
        },
      },
    ],
    quests: {
      victoryObjectives: [
        {
          id: 'obj-ex4-hear-sword',
          title: '在斷劍石憑弔舊事',
          type: 'interact-object',
          targetId: 'event-broken-sword',
          targetValue: 1,
        },
        {
          id: 'obj-ex4-hear-spring',
          title: '探看枯竭的靈泉',
          type: 'interact-object',
          targetId: 'event-withered-spring',
          targetValue: 1,
        },
        {
          id: 'obj-ex4-hear-stele',
          title: '在無字碑前靜思',
          type: 'interact-object',
          targetId: 'event-wordless-stele',
          targetValue: 1,
        },
      ],
      failConditions: {
        playerMustSurvive: true,
      },
    },
    dialogues: {
      'group-ex4-start': {
        name: '番外四開局對話',
        steps: [
          {
            id: 'ex4-start-1',
            speakerName: '白衣',
            speakerIcon: '🤍',
            content: '此地外人止步——從前，你的師父這麼說。今日，我帶你進來。',
          },
          {
            id: 'ex4-start-2',
            speakerName: '凌淵',
            speakerIcon: '🗡️',
            content: '師父筆記裡反覆提到的守護者舊徑……原來入口就藏在黑石驛道之後。',
          },
        ],
      },
      'group-ex4-story-sword': {
        name: '番外四故事·斷劍石',
        steps: [
          {
            id: 'ex4-sword-1',
            speakerName: '白衣',
            speakerIcon: '🤍',
            content: '這半截斷劍，是你師父年輕時的佩劍。他親手折斷的。',
          },
          {
            id: 'ex4-sword-2',
            speakerName: '凌淵',
            speakerIcon: '🗡️',
            content: '折斷？師父的劍術冠絕江湖，為何自折兵刃？',
          },
          {
            id: 'ex4-sword-3',
            speakerName: '白衣',
            speakerIcon: '🤍',
            content: '他說：劍鋒所向，敵意所生。守護者若終身執利刃，總有一天，會忘了自己守的究竟是什麼。',
          },
          {
            id: 'ex4-sword-4',
            speakerName: '凌淵',
            speakerIcon: '🗡️',
            content: '（伸手拂過平滑的斷口）所以後來師父改拄木杖……我一直以為，只是他老了。',
          },
          {
            id: 'ex4-sword-5',
            speakerName: '白衣',
            speakerIcon: '🤍',
            content: '他在這塊石上教你扎馬步時，你可曾問過，為何先學站，再學打？',
          },
          {
            id: 'ex4-sword-6',
            speakerName: '凌淵',
            speakerIcon: '🗡️',
            content: '站得穩，才接得住別人的跌倒。——這是我八歲那年，師父在這裡說的。',
          },
          {
            id: 'ex4-sword-7',
            speakerName: '白衣',
            speakerIcon: '🤍',
            content: '記住這句話。往後的日子裡，它比任何劍招都要難練。',
          },
        ],
      },
      'group-ex4-story-spring': {
        name: '番外四故事·枯靈泉',
        steps: [
          {
            id: 'ex4-spring-1',
            speakerName: '凌淵',
            speakerIcon: '🗡️',
            content: '這就是靈泉？師父筆記裡寫它「映月則生輝」……如今只剩龜裂的泥底。',
          },
          {
            id: 'ex4-spring-2',
            speakerName: '白衣',
            speakerIcon: '🤍',
            content: '十年前不是這樣的。那時泉水清得能數出雲影。',
          },
          {
            id: 'ex4-spring-3',
            speakerName: '白衣',
            speakerIcon: '🤍',
            content: '玄冥原本是看守這眼泉的靈獸——山河靈氣在此匯聚，由牠日夜梳理。',
          },
          {
            id: 'ex4-spring-4',
            speakerName: '凌淵',
            speakerIcon: '🗡️',
            content: '靈獸？可師父封印的，是禍亂山河的妖王……',
          },
          {
            id: 'ex4-spring-5',
            speakerName: '白衣',
            speakerIcon: '🤍',
            content: '上游的人伐林開田，靈脈日漸枯竭；泉乾了，牠的性子也變了。妖氣趁虛而入，把守望者熬成了怨獸。',
          },
          {
            id: 'ex4-spring-6',
            speakerName: '凌淵',
            speakerIcon: '🗡️',
            content: '所以妖氣不是源頭……是人先負了五行？',
          },
          {
            id: 'ex4-spring-7',
            speakerName: '白衣',
            speakerIcon: '🤍',
            content: '金木水火土，缺一行則傾。玄冥不是第一隻被熬成的怨獸，也不會是最後一隻。',
          },
          {
            id: 'ex4-spring-8',
            speakerName: '凌淵',
            speakerIcon: '🗡️',
            content: '（沉默良久）若只知誅妖而不修山河，師父的封印，也不過是把問題埋進了土裡。',
          },
        ],
      },
      'group-ex4-story-stele': {
        name: '番外四故事·無字碑',
        steps: [
          {
            id: 'ex4-stele-1',
            speakerName: '白衣',
            speakerIcon: '🤍',
            content: '到了。這塊碑，是你師父臨終前三天立的。',
          },
          {
            id: 'ex4-stele-2',
            speakerName: '凌淵',
            speakerIcon: '🗡️',
            content: '無字？立碑卻不著一字……師父想留給誰看？',
          },
          {
            id: 'ex4-stele-3',
            speakerName: '白衣',
            speakerIcon: '🤍',
            content: '留給願意爬上來的人。碑文不在石上，在一路的三個地方——你都走完了。',
          },
          {
            id: 'ex4-stele-4',
            speakerName: '凌淵',
            speakerIcon: '🗡️',
            content: '斷劍教我「守」的本分，枯泉讓我看清妖的來處……',
          },
          {
            id: 'ex4-stele-5',
            speakerName: '白衣',
            speakerIcon: '🤍',
            content: '還有第三課，在你自己心裡。說說看，你看到了什麼？',
          },
          {
            id: 'ex4-stele-6',
            speakerName: '凌淵',
            speakerIcon: '🗡️',
            content: '我看到師父不是在封印一頭妖獸——他是在替所有人，償還欠山河的債。',
          },
          {
            id: 'ex4-stele-7',
            speakerName: '白衣',
            speakerIcon: '🤍',
            content: '……十年了，總算有人把這句話說完整。',
          },
          {
            id: 'ex4-stele-8',
            speakerName: '凌淵',
            speakerIcon: '🗡️',
            content: '（抬頭直視）你到底是誰？為何對師父的事，知道得這麼清楚？',
          },
          {
            id: 'ex4-stele-9',
            speakerName: '白衣',
            speakerIcon: '🤍',
            content: '等封印之事了結，我自然告訴你。眼下——山那一邊的風，又帶著妖氣了。',
          },
        ],
      },
      'group-ex4-victory': {
        name: '番外四勝利對話',
        steps: [
          {
            id: 'ex4-victory-1',
            speakerName: '凌淵',
            speakerIcon: '🗡️',
            content: '下山吧。這一次，我要做的不再是復仇。',
          },
          {
            id: 'ex4-victory-2',
            speakerName: '白衣',
            speakerIcon: '🤍',
            content: '哦？',
          },
          {
            id: 'ex4-victory-3',
            speakerName: '凌淵',
            speakerIcon: '🗡️',
            content: '還債。替師父，也替所有人。',
          },
        ],
      },
    },
    triggers: [
      { id: 'trigger-ex4-start', condition: 'on-start', action: 'start-dialogue', actionParam: 'group-ex4-start' },
      { id: 'trigger-ex4-victory', condition: 'on-victory', action: 'start-dialogue', actionParam: 'group-ex4-victory' },
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
