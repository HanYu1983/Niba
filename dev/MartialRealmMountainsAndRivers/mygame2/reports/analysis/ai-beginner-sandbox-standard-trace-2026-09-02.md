# AI Beginner Sandbox Standard Trace

- AI turns: 200
- Final round: 44
- Game won: false
- Game over: false
- Remaining nests: 3

## Aggregate

- Action counts: hold=424, move=165, end-turn=43, attack=36, use-facility=15, allocate-attribute=8, learn-skill=6, collect=6, equip-inner-skill=1, use-item=1, equip=1
- Creatures spawned (total): 14
- Creatures defeated (total): 10
- Level-ups observed: 4
- Final player: level 5, experience 40, inner skill 烈陽戰體 (blazing-sun-inner) lv.2 damage 21
- Final attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8

## Efficiency (KPI)

- 行動產出率 (productive): █··········· 9.3% (66/706)
- 擊殺效率 (kill/generate): █████████··· 0.71 (10/14)
- 擊殺成本 (attack/kill): 3.60 (36 次攻擊 / 10 擊殺)
- 經驗效率 (XP/turn): 0.20 (40 XP / 200 turns)

- Nest health (start → end): creature-nest-1=120→167.22, creature-nest-2=120→181.26000000000005, creature-nest-3=120→178.86

## Turn Trace

### Turn 1 (round 1)
- Player: 胡斐 (player-2), level 1, experience 0, at (12, 9), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-1-player-2-1",
      "round": 1,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 12,
          "column": 9
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.355Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 2 (round 1)
- Player: 胡斐 (player-2), level 1, experience 0, at (12, 8), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-1-player-2-2",
      "round": 1,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 12,
          "column": 8
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.370Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 3 (round 1)
- Player: 胡斐 (player-2), level 1, experience 0, at (12, 7), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-1-player-2-3",
      "round": 1,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 12,
          "column": 7
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.379Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 4 (round 1)
- Player: 胡斐 (player-2), level 1, experience 0, at (12, 6), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-1-player-2-4",
      "round": 1,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 12,
          "column": 6
        },
        "reason": "保命：逃離 游蕩妖物（hitsSurvivable=4.8）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 游蕩妖物（hitsSurvivable=4.8）",
      "createdAt": "2026-09-01T20:31:45.388Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 5 (round 2)
- Player: 胡斐 (player-2), level 1, experience 0, at (12, 6), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 2
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/132, creature-nest-3=120/132

```json
{
  "actions": [
    {
      "id": "action-1-roamer-creature-1-5",
      "round": 1,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.391Z"
    },
    {
      "id": "action-1-roamer-creature-2-6",
      "round": 1,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.391Z"
    },
    {
      "id": "action-1-roamer-creature-3-7",
      "round": 1,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.391Z"
    },
    {
      "id": "action-1-roamer-creature-4-8",
      "round": 1,
      "actor": {
        "id": "roamer-creature-4",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-4",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.391Z"
    },
    {
      "id": "action-1-roamer-creature-5-9",
      "round": 1,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.392Z"
    },
    {
      "id": "action-1-roamer-creature-6-10",
      "round": 1,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.392Z"
    },
    {
      "id": "action-1-roamer-creature-7-11",
      "round": 1,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.392Z"
    },
    {
      "id": "action-1-roamer-creature-8-12",
      "round": 1,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.392Z"
    },
    {
      "id": "action-1-roamer-creature-9-13",
      "round": 1,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.392Z"
    },
    {
      "id": "action-1-roamer-creature-10-14",
      "round": 1,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.392Z"
    },
    {
      "id": "action-2-player-2-15",
      "round": 2,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T20:31:45.395Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "creature-nest-2",
      "creatureName": "生物巢穴 2",
      "message": "生物巢穴 2 生成了 Lv.1 怪物。"
    },
    {
      "creatureId": "creature-nest-3",
      "creatureName": "生物巢穴 3",
      "message": "生物巢穴 3 生成了 Lv.1 怪物。"
    }
  ],
  "spawnedCreatures": [
    {
      "id": "nest-creature-1",
      "name": "生物巢穴 2的怪物 Lv.1",
      "innerSkillId": "yellow-earth-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 3,
        "column": 3
      },
      "attributes": {
        "armStrength": 5,
        "constitution": 7,
        "agility": 6,
        "innerEnergy": 5,
        "insight": 5
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 1,
      "behaviorType": "scavenger",
      "schoolId": "yellow-earth",
      "homePosition": {
        "row": 4,
        "column": 3
      },
      "homeNestId": "creature-nest-2",
      "spawnedRound": 2,
      "baseAttributes": {
        "armStrength": 5,
        "constitution": 5,
        "agility": 5,
        "innerEnergy": 5,
        "insight": 5
      },
      "health": 21,
      "maxHealth": 21,
      "stamina": 5.5,
      "maxStamina": 5.5,
      "innerPower": 15,
      "maxInnerPower": 15,
      "availableAttributePoints": 0,
      "governanceRank": 1,
      "unlockedPolicyIds": [
        "basic"
      ],
      "inventory": [],
      "unlockedEquipmentDropIds": [],
      "equipmentInventory": [],
      "equipmentLoadout": {
        "weaponInstanceId": null,
        "armorInstanceId": null,
        "accessoryInstanceId": null
      },
      "innerSkillIds": [
        "tuna-gong"
      ],
      "skillProgression": {},
      "buffs": []
    },
    {
      "id": "nest-creature-2",
      "name": "生物巢穴 3的怪物 Lv.1",
      "innerSkillId": "void-spirit-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 11,
        "column": 7
      },
      "attributes": {
        "armStrength": 6,
        "constitution": 6,
        "agility": 5,
        "innerEnergy": 5,
        "insight": 6
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 1,
      "behaviorType": "scavenger",
      "schoolId": "void-spirit",
      "homePosition": {
        "row": 11,
        "column": 8
      },
      "homeNestId": "creature-nest-3",
      "spawnedRound": 2,
      "baseAttributes": {
        "armStrength": 5,
        "constitution": 5,
        "agility": 5,
        "innerEnergy": 5,
        "insight": 5
      },
      "health": 18,
      "maxHealth": 18,
      "stamina": 5.5,
      "maxStamina": 5.5,
      "innerPower": 15,
      "maxInnerPower": 15,
      "availableAttributePoints": 0,
      "governanceRank": 1,
      "unlockedPolicyIds": [
        "basic"
      ],
      "inventory": [],
      "unlockedEquipmentDropIds": [],
      "equipmentInventory": [],
      "equipmentLoadout": {
        "weaponInstanceId": null,
        "armorInstanceId": null,
        "accessoryInstanceId": null
      },
      "innerSkillIds": [
        "tuna-gong"
      ],
      "skillProgression": {},
      "buffs": []
    }
  ]
}
```

### Turn 6 (round 2)
- Player: 胡斐 (player-2), level 1, experience 0, at (12, 5), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/132, creature-nest-3=120/132

```json
{
  "actions": [
    {
      "id": "action-2-player-2-16",
      "round": 2,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 12,
          "column": 5
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.403Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 7 (round 2)
- Player: 胡斐 (player-2), level 1, experience 0, at (12, 5), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/132, creature-nest-3=120/132

```json
{
  "actions": [
    {
      "id": "action-2-player-2-17",
      "round": 2,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "learn-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-4",
        "skillType": "inner",
        "skillId": "blazing-sun-inner",
        "reason": "學招：學習門派功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "學招：學習門派功法 烈陽戰體",
      "createdAt": "2026-09-01T20:31:45.410Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 8 (round 3)
- Player: 胡斐 (player-2), level 1, experience 0, at (12, 5), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=121.32/132, creature-nest-3=121.32/132

```json
{
  "actions": [
    {
      "id": "action-2-roamer-creature-1-18",
      "round": 2,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.411Z"
    },
    {
      "id": "action-2-roamer-creature-2-19",
      "round": 2,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.411Z"
    },
    {
      "id": "action-2-roamer-creature-3-20",
      "round": 2,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.411Z"
    },
    {
      "id": "action-2-roamer-creature-4-21",
      "round": 2,
      "actor": {
        "id": "roamer-creature-4",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-4",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.411Z"
    },
    {
      "id": "action-2-roamer-creature-5-22",
      "round": 2,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.411Z"
    },
    {
      "id": "action-2-roamer-creature-6-23",
      "round": 2,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.411Z"
    },
    {
      "id": "action-2-roamer-creature-7-24",
      "round": 2,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.411Z"
    },
    {
      "id": "action-2-roamer-creature-8-25",
      "round": 2,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.411Z"
    },
    {
      "id": "action-2-roamer-creature-9-26",
      "round": 2,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.411Z"
    },
    {
      "id": "action-2-roamer-creature-10-27",
      "round": 2,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.411Z"
    },
    {
      "id": "action-2-nest-creature-1-28",
      "round": 2,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.411Z"
    },
    {
      "id": "action-2-nest-creature-2-29",
      "round": 2,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.1"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.412Z"
    },
    {
      "id": "action-3-player-2-30",
      "round": 3,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T20:31:45.412Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 9 (round 3)
- Player: 胡斐 (player-2), level 1, experience 0, at (12, 5), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=121.32/132, creature-nest-3=121.32/132

```json
{
  "actions": [
    {
      "id": "action-3-player-2-31",
      "round": 3,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "equip-inner-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "skillId": "blazing-sun-inner",
        "reason": "裝備功法：烈陽戰體"
      },
      "result": "succeeded",
      "reason": "裝備功法：烈陽戰體",
      "createdAt": "2026-09-01T20:31:45.421Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 10 (round 3)
- Player: 胡斐 (player-2), level 1, experience 3, at (12, 5), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=121.32/132, creature-nest-3=121.32/132

```json
{
  "actions": [
    {
      "id": "action-3-player-2-32",
      "round": 3,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "nest-creature-2",
          "kind": "creature",
          "position": {
            "row": 12,
            "column": 6
          }
        },
        "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.1",
      "createdAt": "2026-09-01T20:31:45.426Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 11 (round 4)
- Player: 胡斐 (player-2), level 1, experience 9, at (12, 5), health 20.5, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +6
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=122.63999999999999/132, creature-nest-3=122.63999999999999/132

```json
{
  "actions": [
    {
      "id": "action-3-roamer-creature-1-33",
      "round": 3,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.429Z"
    },
    {
      "id": "action-3-roamer-creature-2-34",
      "round": 3,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.429Z"
    },
    {
      "id": "action-3-roamer-creature-3-35",
      "round": 3,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.429Z"
    },
    {
      "id": "action-3-roamer-creature-4-36",
      "round": 3,
      "actor": {
        "id": "roamer-creature-4",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-4",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.429Z"
    },
    {
      "id": "action-3-roamer-creature-5-37",
      "round": 3,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.430Z"
    },
    {
      "id": "action-3-roamer-creature-6-38",
      "round": 3,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.430Z"
    },
    {
      "id": "action-3-roamer-creature-7-39",
      "round": 3,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.430Z"
    },
    {
      "id": "action-3-roamer-creature-8-40",
      "round": 3,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.430Z"
    },
    {
      "id": "action-3-roamer-creature-9-41",
      "round": 3,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.430Z"
    },
    {
      "id": "action-3-roamer-creature-10-42",
      "round": 3,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.430Z"
    },
    {
      "id": "action-3-nest-creature-1-43",
      "round": 3,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.430Z"
    },
    {
      "id": "action-3-nest-creature-2-44",
      "round": 3,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.1"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "target": {
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 12,
            "column": 5
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-01T20:31:45.431Z"
    },
    {
      "id": "action-4-player-2-45",
      "round": 4,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：positioning 分數 0.67，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.67:hold, practiceSkill=0.14:practice-skill, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.67，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.67:hold, practiceSkill=0.14:practice-skill, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:45.432Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-2",
      "creatureName": "生物巢穴 3的怪物 Lv.1",
      "message": "生物巢穴 3的怪物 Lv.1 攻擊 胡斐，造成 5 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 12 (round 4)
- Player: 胡斐 (player-2), level 1, experience 29, at (12, 5), health 20.5, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: nest-creature-2
- Nests: creature-nest-1=120/120, creature-nest-2=122.63999999999999/132, creature-nest-3=122.63999999999999/132

```json
{
  "actions": [
    {
      "id": "action-4-player-2-46",
      "round": 4,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "nest-creature-2",
          "kind": "creature",
          "position": {
            "row": 12,
            "column": 6
          }
        },
        "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.1",
      "createdAt": "2026-09-01T20:31:45.438Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 13 (round 4)
- Player: 胡斐 (player-2), level 1, experience 29, at (12, 6), health 20.5, stamina 1.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=122.63999999999999/132, creature-nest-3=122.63999999999999/132

```json
{
  "actions": [
    {
      "id": "action-4-player-2-47",
      "round": 4,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 12,
          "column": 6
        },
        "reason": "定位：前往出口 (11,5)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (11,5)",
      "createdAt": "2026-09-01T20:31:45.443Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 14 (round 5)
- Player: 胡斐 (player-2), level 1, experience 32, at (12, 6), health 22, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=123.95999999999998/132, creature-nest-3=123.95999999999998/132

```json
{
  "actions": [
    {
      "id": "action-4-roamer-creature-1-48",
      "round": 4,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.445Z"
    },
    {
      "id": "action-4-roamer-creature-2-49",
      "round": 4,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.445Z"
    },
    {
      "id": "action-4-roamer-creature-3-50",
      "round": 4,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.445Z"
    },
    {
      "id": "action-4-roamer-creature-4-51",
      "round": 4,
      "actor": {
        "id": "roamer-creature-4",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-4",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.445Z"
    },
    {
      "id": "action-4-roamer-creature-5-52",
      "round": 4,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.445Z"
    },
    {
      "id": "action-4-roamer-creature-6-53",
      "round": 4,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.445Z"
    },
    {
      "id": "action-4-roamer-creature-7-54",
      "round": 4,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.445Z"
    },
    {
      "id": "action-4-roamer-creature-8-55",
      "round": 4,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.445Z"
    },
    {
      "id": "action-4-roamer-creature-9-56",
      "round": 4,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.445Z"
    },
    {
      "id": "action-4-roamer-creature-10-57",
      "round": 4,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.445Z"
    },
    {
      "id": "action-4-nest-creature-1-58",
      "round": 4,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.446Z"
    },
    {
      "id": "action-5-player-2-59",
      "round": 5,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:45.446Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-1",
      "creatureName": "生物巢穴 2的怪物 Lv.1",
      "message": "生物巢穴 2的怪物 Lv.1 發現並摧毀了道具點。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 15 (round 5)
- Player: 胡斐 (player-2), level 1, experience 52, at (12, 6), health 22, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=123.95999999999998/132, creature-nest-3=123.95999999999998/132

```json
{
  "actions": [
    {
      "id": "action-5-player-2-60",
      "round": 5,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "collect",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "ruin-9",
          "kind": "ruin",
          "position": {
            "row": 11,
            "column": 6
          }
        },
        "reason": "清障：清除廢墟 青石村"
      },
      "result": "succeeded",
      "reason": "清障：清除廢墟 青石村",
      "createdAt": "2026-09-01T20:31:45.450Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 16 (round 5)
- Player: 胡斐 (player-2), level 1, experience 52, at (11, 6), health 22, stamina 1.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=123.95999999999998/132, creature-nest-3=123.95999999999998/132

```json
{
  "actions": [
    {
      "id": "action-5-player-2-61",
      "round": 5,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 11,
          "column": 6
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T20:31:45.456Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 17 (round 6)
- Player: 胡斐 (player-2), level 2, experience 5, at (11, 6), health 23.5, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: -47 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=125.27999999999997/132, creature-nest-3=125.27999999999997/132

```json
{
  "actions": [
    {
      "id": "action-5-roamer-creature-1-62",
      "round": 5,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.458Z"
    },
    {
      "id": "action-5-roamer-creature-2-63",
      "round": 5,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.458Z"
    },
    {
      "id": "action-5-roamer-creature-3-64",
      "round": 5,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.458Z"
    },
    {
      "id": "action-5-roamer-creature-4-65",
      "round": 5,
      "actor": {
        "id": "roamer-creature-4",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-4",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.458Z"
    },
    {
      "id": "action-5-roamer-creature-5-66",
      "round": 5,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.458Z"
    },
    {
      "id": "action-5-roamer-creature-6-67",
      "round": 5,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.458Z"
    },
    {
      "id": "action-5-roamer-creature-7-68",
      "round": 5,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.458Z"
    },
    {
      "id": "action-5-roamer-creature-8-69",
      "round": 5,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.458Z"
    },
    {
      "id": "action-5-roamer-creature-9-70",
      "round": 5,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.458Z"
    },
    {
      "id": "action-5-roamer-creature-10-71",
      "round": 5,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.459Z"
    },
    {
      "id": "action-5-nest-creature-1-72",
      "round": 5,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.459Z"
    },
    {
      "id": "action-6-player-2-73",
      "round": 6,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:45.459Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 18 (round 6)
- Player: 胡斐 (player-2), level 2, experience 5, at (11, 6), health 23.5, stamina 8.5
- Attributes: armStrength=10, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=125.27999999999997/132, creature-nest-3=125.27999999999997/132

```json
{
  "actions": [
    {
      "id": "action-6-player-2-74",
      "round": 6,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "allocate-attribute",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "attribute": "armStrength",
        "reason": "屬性分配：提升 armStrength"
      },
      "result": "succeeded",
      "reason": "屬性分配：提升 armStrength",
      "createdAt": "2026-09-01T20:31:45.466Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 19 (round 6)
- Player: 胡斐 (player-2), level 2, experience 5, at (11, 6), health 23.5, stamina 8.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=125.27999999999997/132, creature-nest-3=125.27999999999997/132

```json
{
  "actions": [
    {
      "id": "action-6-player-2-75",
      "round": 6,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "allocate-attribute",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "attribute": "armStrength",
        "reason": "屬性分配：提升 armStrength"
      },
      "result": "succeeded",
      "reason": "屬性分配：提升 armStrength",
      "createdAt": "2026-09-01T20:31:45.472Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 20 (round 6)
- Player: 胡斐 (player-2), level 2, experience 5, at (11, 6), health 23.5, stamina 8.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=125.27999999999997/132, creature-nest-3=125.27999999999997/132

```json
{
  "actions": [
    {
      "id": "action-6-player-2-76",
      "round": 6,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "use-item",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "itemId": "scout-talisman",
        "reason": "使用道具：探地符"
      },
      "result": "succeeded",
      "reason": "使用道具：探地符",
      "createdAt": "2026-09-01T20:31:45.477Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 21 (round 6)
- Player: 胡斐 (player-2), level 2, experience 5, at (11, 5), health 23.5, stamina 3.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=125.27999999999997/132, creature-nest-3=125.27999999999997/132

```json
{
  "actions": [
    {
      "id": "action-6-player-2-77",
      "round": 6,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 11,
          "column": 5
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.482Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 22 (round 6)
- Player: 胡斐 (player-2), level 2, experience 5, at (11, 6), health 23.5, stamina 1.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=125.27999999999997/132, creature-nest-3=125.27999999999997/132

```json
{
  "actions": [
    {
      "id": "action-6-player-2-78",
      "round": 6,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 11,
          "column": 6
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T20:31:45.489Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 23 (round 7)
- Player: 胡斐 (player-2), level 2, experience 8, at (11, 6), health 25, stamina 9.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=126.59999999999997/132, creature-nest-3=126.59999999999997/132

```json
{
  "actions": [
    {
      "id": "action-6-roamer-creature-1-79",
      "round": 6,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.491Z"
    },
    {
      "id": "action-6-roamer-creature-2-80",
      "round": 6,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.491Z"
    },
    {
      "id": "action-6-roamer-creature-3-81",
      "round": 6,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.491Z"
    },
    {
      "id": "action-6-roamer-creature-4-82",
      "round": 6,
      "actor": {
        "id": "roamer-creature-4",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-4",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.491Z"
    },
    {
      "id": "action-6-roamer-creature-5-83",
      "round": 6,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.491Z"
    },
    {
      "id": "action-6-roamer-creature-6-84",
      "round": 6,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.491Z"
    },
    {
      "id": "action-6-roamer-creature-7-85",
      "round": 6,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.491Z"
    },
    {
      "id": "action-6-roamer-creature-8-86",
      "round": 6,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.491Z"
    },
    {
      "id": "action-6-roamer-creature-9-87",
      "round": 6,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.491Z"
    },
    {
      "id": "action-6-roamer-creature-10-88",
      "round": 6,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.491Z"
    },
    {
      "id": "action-6-nest-creature-1-89",
      "round": 6,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.491Z"
    },
    {
      "id": "action-7-player-2-90",
      "round": 7,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:45.492Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "roamer-creature-4",
      "creatureName": "游蕩妖物",
      "message": "游蕩妖物 發現並摧毀了道具點。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 24 (round 7)
- Player: 胡斐 (player-2), level 2, experience 8, at (10, 6), health 25, stamina 7.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=126.59999999999997/132, creature-nest-3=126.59999999999997/132

```json
{
  "actions": [
    {
      "id": "action-7-player-2-91",
      "round": 7,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 10,
          "column": 6
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.499Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 25 (round 7)
- Player: 胡斐 (player-2), level 2, experience 8, at (9, 6), health 25, stamina 5.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=126.59999999999997/132, creature-nest-3=126.59999999999997/132

```json
{
  "actions": [
    {
      "id": "action-7-player-2-92",
      "round": 7,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 9,
          "column": 6
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.506Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 26 (round 7)
- Player: 胡斐 (player-2), level 2, experience 8, at (9, 7), health 25, stamina 3.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=126.59999999999997/132, creature-nest-3=126.59999999999997/132

```json
{
  "actions": [
    {
      "id": "action-7-player-2-93",
      "round": 7,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 9,
          "column": 7
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T20:31:45.515Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 27 (round 7)
- Player: 胡斐 (player-2), level 2, experience 8, at (10, 7), health 25, stamina 1.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=126.59999999999997/132, creature-nest-3=126.59999999999997/132

```json
{
  "actions": [
    {
      "id": "action-7-player-2-94",
      "round": 7,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 10,
          "column": 7
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T20:31:45.523Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 28 (round 8)
- Player: 胡斐 (player-2), level 2, experience 11, at (10, 7), health 26.5, stamina 9.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/132, creature-nest-2=127.91999999999996/132, creature-nest-3=127.91999999999996/132

```json
{
  "actions": [
    {
      "id": "action-7-roamer-creature-1-95",
      "round": 7,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.527Z"
    },
    {
      "id": "action-7-roamer-creature-2-96",
      "round": 7,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.527Z"
    },
    {
      "id": "action-7-roamer-creature-3-97",
      "round": 7,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.527Z"
    },
    {
      "id": "action-7-roamer-creature-4-98",
      "round": 7,
      "actor": {
        "id": "roamer-creature-4",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-4",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.527Z"
    },
    {
      "id": "action-7-roamer-creature-5-99",
      "round": 7,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.527Z"
    },
    {
      "id": "action-7-roamer-creature-6-100",
      "round": 7,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.527Z"
    },
    {
      "id": "action-7-roamer-creature-7-101",
      "round": 7,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.527Z"
    },
    {
      "id": "action-7-roamer-creature-8-102",
      "round": 7,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.528Z"
    },
    {
      "id": "action-7-roamer-creature-9-103",
      "round": 7,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.528Z"
    },
    {
      "id": "action-7-roamer-creature-10-104",
      "round": 7,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.528Z"
    },
    {
      "id": "action-7-nest-creature-1-105",
      "round": 7,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.528Z"
    },
    {
      "id": "action-8-player-2-106",
      "round": 8,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:45.528Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "creature-nest-1",
      "creatureName": "生物巢穴 1",
      "message": "生物巢穴 1 生成了 Lv.1 怪物。"
    }
  ],
  "spawnedCreatures": [
    {
      "id": "nest-creature-2",
      "name": "生物巢穴 1的怪物 Lv.1",
      "innerSkillId": "void-spirit-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 13,
        "column": 1
      },
      "attributes": {
        "armStrength": 6,
        "constitution": 6,
        "agility": 5,
        "innerEnergy": 5,
        "insight": 6
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 1,
      "behaviorType": "sieger",
      "schoolId": "void-spirit",
      "homePosition": {
        "row": 13,
        "column": 2
      },
      "homeNestId": "creature-nest-1",
      "spawnedRound": 8,
      "baseAttributes": {
        "armStrength": 5,
        "constitution": 5,
        "agility": 5,
        "innerEnergy": 5,
        "insight": 5
      },
      "health": 18,
      "maxHealth": 18,
      "stamina": 5.5,
      "maxStamina": 5.5,
      "innerPower": 15,
      "maxInnerPower": 15,
      "availableAttributePoints": 0,
      "governanceRank": 1,
      "unlockedPolicyIds": [
        "basic"
      ],
      "inventory": [],
      "unlockedEquipmentDropIds": [],
      "equipmentInventory": [],
      "equipmentLoadout": {
        "weaponInstanceId": null,
        "armorInstanceId": null,
        "accessoryInstanceId": null
      },
      "innerSkillIds": [
        "tuna-gong"
      ],
      "skillProgression": {},
      "buffs": []
    }
  ]
}
```

### Turn 29 (round 8)
- Player: 胡斐 (player-2), level 2, experience 14, at (10, 7), health 26.5, stamina 4.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132, creature-nest-2=127.91999999999996/132, creature-nest-3=127.91999999999996/132

```json
{
  "actions": [
    {
      "id": "action-8-player-2-107",
      "round": 8,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "roamer-creature-4",
          "kind": "creature",
          "position": {
            "row": 10,
            "column": 8
          }
        },
        "reason": "交戰：攻擊 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 游蕩妖物",
      "createdAt": "2026-09-01T20:31:45.537Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 30 (round 8)
- Player: 胡斐 (player-2), level 2, experience 14, at (11, 7), health 26.5, stamina 2.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132, creature-nest-2=127.91999999999996/132, creature-nest-3=127.91999999999996/132

```json
{
  "actions": [
    {
      "id": "action-8-player-2-108",
      "round": 8,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 11,
          "column": 7
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.544Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 31 (round 8)
- Player: 胡斐 (player-2), level 2, experience 14, at (12, 7), health 26.5, stamina 0.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132, creature-nest-2=127.91999999999996/132, creature-nest-3=127.91999999999996/132

```json
{
  "actions": [
    {
      "id": "action-8-player-2-109",
      "round": 8,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 12,
          "column": 7
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T20:31:45.552Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 32 (round 9)
- Player: 胡斐 (player-2), level 2, experience 15, at (12, 7), health 28, stamina 9.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=121.32/132, creature-nest-2=129.23999999999995/132, creature-nest-3=129.23999999999995/132

```json
{
  "actions": [
    {
      "id": "action-8-roamer-creature-1-110",
      "round": 8,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.556Z"
    },
    {
      "id": "action-8-roamer-creature-2-111",
      "round": 8,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.556Z"
    },
    {
      "id": "action-8-roamer-creature-3-112",
      "round": 8,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.556Z"
    },
    {
      "id": "action-8-roamer-creature-4-113",
      "round": 8,
      "actor": {
        "id": "roamer-creature-4",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-4",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.556Z"
    },
    {
      "id": "action-8-roamer-creature-5-114",
      "round": 8,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.556Z"
    },
    {
      "id": "action-8-roamer-creature-6-115",
      "round": 8,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.556Z"
    },
    {
      "id": "action-8-roamer-creature-7-116",
      "round": 8,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.556Z"
    },
    {
      "id": "action-8-roamer-creature-8-117",
      "round": 8,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.556Z"
    },
    {
      "id": "action-8-roamer-creature-9-118",
      "round": 8,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.556Z"
    },
    {
      "id": "action-8-roamer-creature-10-119",
      "round": 8,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.556Z"
    },
    {
      "id": "action-8-nest-creature-1-120",
      "round": 8,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.556Z"
    },
    {
      "id": "action-8-nest-creature-2-121",
      "round": 8,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 12,
          "column": 1
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-01T20:31:45.556Z"
    },
    {
      "id": "action-9-player-2-122",
      "round": 9,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:45.557Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 33 (round 9)
- Player: 胡斐 (player-2), level 2, experience 15, at (12, 6), health 28, stamina 7.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=121.32/132, creature-nest-2=129.23999999999995/132, creature-nest-3=129.23999999999995/132

```json
{
  "actions": [
    {
      "id": "action-9-player-2-123",
      "round": 9,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 12,
          "column": 6
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.566Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 34 (round 9)
- Player: 胡斐 (player-2), level 2, experience 15, at (12, 5), health 28, stamina 2.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=121.32/132, creature-nest-2=129.23999999999995/132, creature-nest-3=129.23999999999995/132

```json
{
  "actions": [
    {
      "id": "action-9-player-2-124",
      "round": 9,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 12,
          "column": 5
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.572Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 35 (round 9)
- Player: 胡斐 (player-2), level 2, experience 15, at (12, 6), health 28, stamina 0.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=121.32/132, creature-nest-2=129.23999999999995/132, creature-nest-3=129.23999999999995/132

```json
{
  "actions": [
    {
      "id": "action-9-player-2-125",
      "round": 9,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 12,
          "column": 6
        },
        "reason": "定位：前往出口 (11,5)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (11,5)",
      "createdAt": "2026-09-01T20:31:45.579Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 36 (round 10)
- Player: 胡斐 (player-2), level 2, experience 16, at (12, 6), health 29.5, stamina 9.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=122.63999999999999/132, creature-nest-2=130.55999999999995/132, creature-nest-3=130.55999999999995/132

```json
{
  "actions": [
    {
      "id": "action-9-roamer-creature-1-126",
      "round": 9,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.582Z"
    },
    {
      "id": "action-9-roamer-creature-2-127",
      "round": 9,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.582Z"
    },
    {
      "id": "action-9-roamer-creature-3-128",
      "round": 9,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.582Z"
    },
    {
      "id": "action-9-roamer-creature-4-129",
      "round": 9,
      "actor": {
        "id": "roamer-creature-4",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-4",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.582Z"
    },
    {
      "id": "action-9-roamer-creature-5-130",
      "round": 9,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.582Z"
    },
    {
      "id": "action-9-roamer-creature-6-131",
      "round": 9,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.582Z"
    },
    {
      "id": "action-9-roamer-creature-7-132",
      "round": 9,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.582Z"
    },
    {
      "id": "action-9-roamer-creature-8-133",
      "round": 9,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.582Z"
    },
    {
      "id": "action-9-roamer-creature-9-134",
      "round": 9,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.582Z"
    },
    {
      "id": "action-9-roamer-creature-10-135",
      "round": 9,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.582Z"
    },
    {
      "id": "action-9-nest-creature-1-136",
      "round": 9,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.582Z"
    },
    {
      "id": "action-9-nest-creature-2-137",
      "round": 9,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 12,
          "column": 3
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-01T20:31:45.582Z"
    },
    {
      "id": "action-10-player-2-138",
      "round": 10,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:45.583Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "roamer-creature-10",
      "creatureName": "游蕩妖物",
      "message": "游蕩妖物 發現並摧毀了道具點。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 37 (round 10)
- Player: 胡斐 (player-2), level 2, experience 16, at (11, 6), health 29.5, stamina 7.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=122.63999999999999/132, creature-nest-2=130.55999999999995/132, creature-nest-3=130.55999999999995/132

```json
{
  "actions": [
    {
      "id": "action-10-player-2-139",
      "round": 10,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 11,
          "column": 6
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.590Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 38 (round 10)
- Player: 胡斐 (player-2), level 2, experience 16, at (11, 5), health 29.5, stamina 2.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=122.63999999999999/132, creature-nest-2=130.55999999999995/132, creature-nest-3=130.55999999999995/132

```json
{
  "actions": [
    {
      "id": "action-10-player-2-140",
      "round": 10,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 11,
          "column": 5
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.596Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 39 (round 10)
- Player: 胡斐 (player-2), level 2, experience 16, at (11, 6), health 29.5, stamina 0.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=122.63999999999999/132, creature-nest-2=130.55999999999995/132, creature-nest-3=130.55999999999995/132

```json
{
  "actions": [
    {
      "id": "action-10-player-2-141",
      "round": 10,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 11,
          "column": 6
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T20:31:45.603Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 40 (round 11)
- Player: 胡斐 (player-2), level 2, experience 17, at (11, 6), health 30, stamina 9.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +1
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=123.95999999999998/132, creature-nest-2=131.87999999999994/132, creature-nest-3=131.87999999999994/145

```json
{
  "actions": [
    {
      "id": "action-10-roamer-creature-1-142",
      "round": 10,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.605Z"
    },
    {
      "id": "action-10-roamer-creature-2-143",
      "round": 10,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.605Z"
    },
    {
      "id": "action-10-roamer-creature-3-144",
      "round": 10,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.605Z"
    },
    {
      "id": "action-10-roamer-creature-4-145",
      "round": 10,
      "actor": {
        "id": "roamer-creature-4",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-4",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.605Z"
    },
    {
      "id": "action-10-roamer-creature-5-146",
      "round": 10,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.605Z"
    },
    {
      "id": "action-10-roamer-creature-6-147",
      "round": 10,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.605Z"
    },
    {
      "id": "action-10-roamer-creature-7-148",
      "round": 10,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.605Z"
    },
    {
      "id": "action-10-roamer-creature-8-149",
      "round": 10,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.606Z"
    },
    {
      "id": "action-10-roamer-creature-9-150",
      "round": 10,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.606Z"
    },
    {
      "id": "action-10-roamer-creature-10-151",
      "round": 10,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.606Z"
    },
    {
      "id": "action-10-nest-creature-1-152",
      "round": 10,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.606Z"
    },
    {
      "id": "action-10-nest-creature-2-153",
      "round": 10,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 11,
          "column": 3
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-01T20:31:45.606Z"
    },
    {
      "id": "action-11-player-2-154",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:45.606Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "creature-nest-3",
      "creatureName": "生物巢穴 3",
      "message": "生物巢穴 3 生成了 Lv.2 怪物。"
    }
  ],
  "spawnedCreatures": [
    {
      "id": "nest-creature-3",
      "name": "生物巢穴 3的怪物 Lv.2",
      "innerSkillId": "void-spirit-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 11,
        "column": 7
      },
      "attributes": {
        "armStrength": 6,
        "constitution": 6,
        "agility": 5,
        "innerEnergy": 5,
        "insight": 6
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 2,
      "behaviorType": "scavenger",
      "schoolId": "void-spirit",
      "homePosition": {
        "row": 11,
        "column": 8
      },
      "homeNestId": "creature-nest-3",
      "spawnedRound": 11,
      "baseAttributes": {
        "armStrength": 5.6,
        "constitution": 5.6,
        "agility": 5.6,
        "innerEnergy": 5.6,
        "insight": 5.6
      },
      "health": 18,
      "maxHealth": 18,
      "stamina": 5.5,
      "maxStamina": 5.5,
      "innerPower": 15,
      "maxInnerPower": 15,
      "availableAttributePoints": 0,
      "governanceRank": 1,
      "unlockedPolicyIds": [
        "basic"
      ],
      "inventory": [],
      "unlockedEquipmentDropIds": [],
      "equipmentInventory": [],
      "equipmentLoadout": {
        "weaponInstanceId": null,
        "armorInstanceId": null,
        "accessoryInstanceId": null
      },
      "innerSkillIds": [
        "tuna-gong"
      ],
      "skillProgression": {},
      "buffs": []
    }
  ]
}
```

### Turn 41 (round 11)
- Player: 胡斐 (player-2), level 2, experience 17, at (10, 6), health 30, stamina 7.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=123.95999999999998/132, creature-nest-2=131.87999999999994/132, creature-nest-3=131.87999999999994/145

```json
{
  "actions": [
    {
      "id": "action-11-player-2-155",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 10,
          "column": 6
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.613Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 42 (round 11)
- Player: 胡斐 (player-2), level 2, experience 17, at (9, 6), health 30, stamina 5.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=123.95999999999998/132, creature-nest-2=131.87999999999994/132, creature-nest-3=131.87999999999994/145

```json
{
  "actions": [
    {
      "id": "action-11-player-2-156",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 9,
          "column": 6
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.621Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 43 (round 11)
- Player: 胡斐 (player-2), level 2, experience 17, at (9, 5), health 30, stamina 3.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=123.95999999999998/132, creature-nest-2=131.87999999999994/132, creature-nest-3=131.87999999999994/145

```json
{
  "actions": [
    {
      "id": "action-11-player-2-157",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 9,
          "column": 5
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.628Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 44 (round 11)
- Player: 胡斐 (player-2), level 2, experience 17, at (8, 5), health 30, stamina 1.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=123.95999999999998/132, creature-nest-2=131.87999999999994/132, creature-nest-3=131.87999999999994/145

```json
{
  "actions": [
    {
      "id": "action-11-player-2-158",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 8,
          "column": 5
        },
        "reason": "收集道具：移動到道具位置"
      },
      "result": "succeeded",
      "reason": "收集道具：移動到道具位置",
      "createdAt": "2026-09-01T20:31:45.637Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 45 (round 11)
- Player: 胡斐 (player-2), level 2, experience 17, at (8, 5), health 30, stamina 1.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=123.95999999999998/132, creature-nest-2=131.87999999999994/132, creature-nest-3=131.87999999999994/145

```json
{
  "actions": [
    {
      "id": "action-11-player-2-159",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "collect",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "item-point-14",
          "kind": "item",
          "position": {
            "row": 8,
            "column": 5
          }
        },
        "reason": "收集道具：拾取"
      },
      "result": "succeeded",
      "reason": "收集道具：拾取",
      "createdAt": "2026-09-01T20:31:45.642Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 46 (round 11)
- Player: 胡斐 (player-2), level 2, experience 17, at (8, 5), health 30, stamina 1.5
- Attributes: armStrength=12, constitution=11, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 11
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=123.95999999999998/132, creature-nest-2=131.87999999999994/132, creature-nest-3=131.87999999999994/145

```json
{
  "actions": [
    {
      "id": "action-11-player-2-160",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "equip",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "instanceId": "equipment-player-2-677b102f-a6ee-49c3-a05f-e0cc7b72970e",
        "reason": "裝備：青銅刀（weapon）"
      },
      "result": "succeeded",
      "reason": "裝備：青銅刀（weapon）",
      "createdAt": "2026-09-01T20:31:45.646Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 47 (round 12)
- Player: 胡斐 (player-2), level 2, experience 20, at (8, 5), health 31.65, stamina 10
- Attributes: armStrength=12, constitution=11, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 11
- Stored experience change: +3
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=125.27999999999997/132, creature-nest-2=132/145, creature-nest-3=133.32999999999993/145

```json
{
  "actions": [
    {
      "id": "action-11-roamer-creature-1-161",
      "round": 11,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.650Z"
    },
    {
      "id": "action-11-roamer-creature-2-162",
      "round": 11,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.650Z"
    },
    {
      "id": "action-11-roamer-creature-3-163",
      "round": 11,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.650Z"
    },
    {
      "id": "action-11-roamer-creature-4-164",
      "round": 11,
      "actor": {
        "id": "roamer-creature-4",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-4",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.650Z"
    },
    {
      "id": "action-11-roamer-creature-5-165",
      "round": 11,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.650Z"
    },
    {
      "id": "action-11-roamer-creature-6-166",
      "round": 11,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.650Z"
    },
    {
      "id": "action-11-roamer-creature-7-167",
      "round": 11,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.650Z"
    },
    {
      "id": "action-11-roamer-creature-8-168",
      "round": 11,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.650Z"
    },
    {
      "id": "action-11-roamer-creature-9-169",
      "round": 11,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.650Z"
    },
    {
      "id": "action-11-roamer-creature-10-170",
      "round": 11,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.650Z"
    },
    {
      "id": "action-11-nest-creature-1-171",
      "round": 11,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.650Z"
    },
    {
      "id": "action-11-nest-creature-2-172",
      "round": 11,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 9,
          "column": 3
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-01T20:31:45.650Z"
    },
    {
      "id": "action-11-nest-creature-3-173",
      "round": 11,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "destination": {
          "row": 9,
          "column": 7
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-01T20:31:45.650Z"
    },
    {
      "id": "action-12-player-2-174",
      "round": 12,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:45.651Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": [
    {
      "id": "nest-creature-4",
      "name": "生物巢穴 2的怪物 Lv.2",
      "innerSkillId": "yellow-earth-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 3,
        "column": 3
      },
      "attributes": {
        "armStrength": 6,
        "constitution": 9,
        "agility": 6,
        "innerEnergy": 6,
        "insight": 5
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 2,
      "behaviorType": "scavenger",
      "schoolId": "yellow-earth",
      "homePosition": {
        "row": 4,
        "column": 3
      },
      "homeNestId": "creature-nest-2",
      "spawnedRound": 12,
      "baseAttributes": {
        "armStrength": 6.3,
        "constitution": 7,
        "agility": 5.6,
        "innerEnergy": 6.3,
        "insight": 5
      },
      "health": 27,
      "maxHealth": 27,
      "stamina": 6,
      "maxStamina": 6,
      "innerPower": 18,
      "maxInnerPower": 18,
      "availableAttributePoints": 0,
      "governanceRank": 1,
      "unlockedPolicyIds": [
        "basic"
      ],
      "inventory": [],
      "unlockedEquipmentDropIds": [],
      "equipmentInventory": [],
      "equipmentLoadout": {
        "weaponInstanceId": null,
        "armorInstanceId": null,
        "accessoryInstanceId": null
      },
      "innerSkillIds": [
        "tuna-gong"
      ],
      "skillProgression": {},
      "buffs": []
    }
  ]
}
```

### Turn 48 (round 12)
- Player: 胡斐 (player-2), level 2, experience 23, at (8, 5), health 31.65, stamina 5
- Attributes: armStrength=12, constitution=11, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 11
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=125.27999999999997/132, creature-nest-2=132/145, creature-nest-3=133.32999999999993/145

```json
{
  "actions": [
    {
      "id": "action-12-player-2-175",
      "round": 12,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "roamer-creature-9",
          "kind": "creature",
          "position": {
            "row": 8,
            "column": 6
          }
        },
        "reason": "交戰：攻擊 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 游蕩妖物",
      "createdAt": "2026-09-01T20:31:45.659Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 49 (round 12)
- Player: 胡斐 (player-2), level 2, experience 43, at (8, 5), health 31.65, stamina 0
- Attributes: armStrength=12, constitution=11, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 11
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: roamer-creature-9
- Nests: creature-nest-1=125.27999999999997/132, creature-nest-2=132/145, creature-nest-3=133.32999999999993/145

```json
{
  "actions": [
    {
      "id": "action-12-player-2-176",
      "round": 12,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "roamer-creature-9",
          "kind": "creature",
          "position": {
            "row": 8,
            "column": 6
          }
        },
        "reason": "交戰：攻擊 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 游蕩妖物",
      "createdAt": "2026-09-01T20:31:45.667Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 50 (round 13)
- Player: 胡斐 (player-2), level 2, experience 43, at (8, 5), health 26.299999999999997, stamina 10
- Attributes: armStrength=12, constitution=11, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 11
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=126.59999999999997/132, creature-nest-2=133.45/145, creature-nest-3=134.77999999999992/145

```json
{
  "actions": [
    {
      "id": "action-12-roamer-creature-1-177",
      "round": 12,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.667Z"
    },
    {
      "id": "action-12-roamer-creature-2-178",
      "round": 12,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.667Z"
    },
    {
      "id": "action-12-roamer-creature-3-179",
      "round": 12,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.667Z"
    },
    {
      "id": "action-12-roamer-creature-4-180",
      "round": 12,
      "actor": {
        "id": "roamer-creature-4",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-4",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.667Z"
    },
    {
      "id": "action-12-roamer-creature-5-181",
      "round": 12,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "target": {
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 8,
            "column": 5
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-01T20:31:45.668Z"
    },
    {
      "id": "action-12-roamer-creature-6-182",
      "round": 12,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.668Z"
    },
    {
      "id": "action-12-roamer-creature-7-183",
      "round": 12,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.668Z"
    },
    {
      "id": "action-12-roamer-creature-8-184",
      "round": 12,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.668Z"
    },
    {
      "id": "action-12-roamer-creature-10-185",
      "round": 12,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.668Z"
    },
    {
      "id": "action-12-nest-creature-1-186",
      "round": 12,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.668Z"
    },
    {
      "id": "action-12-nest-creature-2-187",
      "round": 12,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 7,
          "column": 3
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-01T20:31:45.668Z"
    },
    {
      "id": "action-12-nest-creature-3-188",
      "round": 12,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "destination": {
          "row": 8,
          "column": 7
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-01T20:31:45.668Z"
    },
    {
      "id": "action-12-nest-creature-4-189",
      "round": 12,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.668Z"
    },
    {
      "id": "action-13-player-2-190",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T20:31:45.669Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 51 (round 13)
- Player: 胡斐 (player-2), level 2, experience 43, at (8, 6), health 26.299999999999997, stamina 8
- Attributes: armStrength=12, constitution=11, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 11
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=126.59999999999997/132, creature-nest-2=133.45/145, creature-nest-3=134.77999999999992/145

```json
{
  "actions": [
    {
      "id": "action-13-player-2-191",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 8,
          "column": 6
        },
        "reason": "交戰：移動到 生物巢穴 3的怪物 Lv.2 附近"
      },
      "result": "succeeded",
      "reason": "交戰：移動到 生物巢穴 3的怪物 Lv.2 附近",
      "createdAt": "2026-09-01T20:31:45.678Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 52 (round 13)
- Player: 胡斐 (player-2), level 2, experience 46, at (8, 6), health 26.299999999999997, stamina 3
- Attributes: armStrength=12, constitution=11, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 11
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=126.59999999999997/132, creature-nest-2=133.45/145, creature-nest-3=134.77999999999992/145

```json
{
  "actions": [
    {
      "id": "action-13-player-2-192",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "nest-creature-3",
          "kind": "creature",
          "position": {
            "row": 8,
            "column": 7
          }
        },
        "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.2"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.2",
      "createdAt": "2026-09-01T20:31:45.686Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 53 (round 13)
- Player: 胡斐 (player-2), level 2, experience 46, at (7, 6), health 26.299999999999997, stamina 1
- Attributes: armStrength=12, constitution=11, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 11
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=126.59999999999997/132, creature-nest-2=133.45/145, creature-nest-3=134.77999999999992/145

```json
{
  "actions": [
    {
      "id": "action-13-player-2-193",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 7,
          "column": 6
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T20:31:45.692Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 54 (round 14)
- Player: 胡斐 (player-2), level 2, experience 48, at (7, 6), health 27.949999999999996, stamina 10
- Attributes: armStrength=12, constitution=11, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 11
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=127.91999999999996/132, creature-nest-2=134.89999999999998/145, creature-nest-3=136.2299999999999/145

```json
{
  "actions": [
    {
      "id": "action-13-roamer-creature-1-194",
      "round": 13,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.695Z"
    },
    {
      "id": "action-13-roamer-creature-2-195",
      "round": 13,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.695Z"
    },
    {
      "id": "action-13-roamer-creature-3-196",
      "round": 13,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.695Z"
    },
    {
      "id": "action-13-roamer-creature-4-197",
      "round": 13,
      "actor": {
        "id": "roamer-creature-4",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-4",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.695Z"
    },
    {
      "id": "action-13-roamer-creature-5-198",
      "round": 13,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.695Z"
    },
    {
      "id": "action-13-roamer-creature-6-199",
      "round": 13,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.695Z"
    },
    {
      "id": "action-13-roamer-creature-7-200",
      "round": 13,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.695Z"
    },
    {
      "id": "action-13-roamer-creature-8-201",
      "round": 13,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.695Z"
    },
    {
      "id": "action-13-roamer-creature-10-202",
      "round": 13,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.695Z"
    },
    {
      "id": "action-13-nest-creature-1-203",
      "round": 13,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.695Z"
    },
    {
      "id": "action-13-nest-creature-2-204",
      "round": 13,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.695Z"
    },
    {
      "id": "action-13-nest-creature-3-205",
      "round": 13,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.695Z"
    },
    {
      "id": "action-13-nest-creature-4-206",
      "round": 13,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.695Z"
    },
    {
      "id": "action-14-player-2-207",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:45.695Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 55 (round 14)
- Player: 胡斐 (player-2), level 2, experience 88, at (7, 6), health 27.949999999999996, stamina 5
- Attributes: armStrength=12, constitution=11, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 11
- Stored experience change: +40
- Spawned creatures: 0
- Defeated creatures: nest-creature-3
- Nests: creature-nest-1=127.91999999999996/132, creature-nest-2=134.89999999999998/145, creature-nest-3=136.2299999999999/145

```json
{
  "actions": [
    {
      "id": "action-14-player-2-208",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "nest-creature-3",
          "kind": "creature",
          "position": {
            "row": 7,
            "column": 7
          }
        },
        "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.2"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.2",
      "createdAt": "2026-09-01T20:31:45.701Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 56 (round 14)
- Player: 胡斐 (player-2), level 2, experience 88, at (7, 7), health 27.949999999999996, stamina 0
- Attributes: armStrength=12, constitution=11, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 11
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=127.91999999999996/132, creature-nest-2=134.89999999999998/145, creature-nest-3=136.2299999999999/145

```json
{
  "actions": [
    {
      "id": "action-14-player-2-209",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 7,
          "column": 7
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T20:31:45.708Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 57 (round 15)
- Player: 胡斐 (player-2), level 2, experience 88, at (7, 7), health 29.599999999999994, stamina 10
- Attributes: armStrength=12, constitution=11, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 11
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=129.23999999999995/132, creature-nest-2=136.34999999999997/145, creature-nest-3=137.6799999999999/145

```json
{
  "actions": [
    {
      "id": "action-14-roamer-creature-1-210",
      "round": 14,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.708Z"
    },
    {
      "id": "action-14-roamer-creature-2-211",
      "round": 14,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.708Z"
    },
    {
      "id": "action-14-roamer-creature-3-212",
      "round": 14,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.708Z"
    },
    {
      "id": "action-14-roamer-creature-4-213",
      "round": 14,
      "actor": {
        "id": "roamer-creature-4",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-4",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.708Z"
    },
    {
      "id": "action-14-roamer-creature-5-214",
      "round": 14,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.708Z"
    },
    {
      "id": "action-14-roamer-creature-6-215",
      "round": 14,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.708Z"
    },
    {
      "id": "action-14-roamer-creature-7-216",
      "round": 14,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.708Z"
    },
    {
      "id": "action-14-roamer-creature-8-217",
      "round": 14,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.708Z"
    },
    {
      "id": "action-14-roamer-creature-10-218",
      "round": 14,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.708Z"
    },
    {
      "id": "action-14-nest-creature-1-219",
      "round": 14,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.708Z"
    },
    {
      "id": "action-14-nest-creature-2-220",
      "round": 14,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.708Z"
    },
    {
      "id": "action-14-nest-creature-4-221",
      "round": 14,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 7
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:45.708Z"
    },
    {
      "id": "action-15-player-2-222",
      "round": 15,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T20:31:45.709Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 58 (round 15)
- Player: 胡斐 (player-2), level 2, experience 88, at (8, 7), health 29.599999999999994, stamina 5
- Attributes: armStrength=12, constitution=11, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 11
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=129.23999999999995/132, creature-nest-2=136.34999999999997/145, creature-nest-3=137.6799999999999/145

```json
{
  "actions": [
    {
      "id": "action-15-player-2-223",
      "round": 15,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 8,
          "column": 7
        },
        "reason": "定位：前往出口 (8,7)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (8,7)",
      "createdAt": "2026-09-01T20:31:45.714Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 59 (round 15)
- Player: 胡斐 (player-2), level 2, experience 88, at (9, 7), health 29.599999999999994, stamina 3
- Attributes: armStrength=12, constitution=11, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 11
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=129.23999999999995/132, creature-nest-2=136.34999999999997/145, creature-nest-3=137.6799999999999/145

```json
{
  "actions": [
    {
      "id": "action-15-player-2-224",
      "round": 15,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 9,
          "column": 7
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.721Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 60 (round 15)
- Player: 胡斐 (player-2), level 2, experience 88, at (9, 8), health 29.599999999999994, stamina 1
- Attributes: armStrength=12, constitution=11, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 11
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=129.23999999999995/132, creature-nest-2=136.34999999999997/145, creature-nest-3=137.6799999999999/145

```json
{
  "actions": [
    {
      "id": "action-15-player-2-225",
      "round": 15,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 9,
          "column": 8
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T20:31:45.729Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 61 (round 16)
- Player: 胡斐 (player-2), level 2, experience 90, at (9, 8), health 31.249999999999993, stamina 10
- Attributes: armStrength=12, constitution=11, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 11
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=130.55999999999995/132, creature-nest-2=137.79999999999995/145, creature-nest-3=139.12999999999988/145

```json
{
  "actions": [
    {
      "id": "action-15-roamer-creature-1-226",
      "round": 15,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.732Z"
    },
    {
      "id": "action-15-roamer-creature-2-227",
      "round": 15,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.732Z"
    },
    {
      "id": "action-15-roamer-creature-3-228",
      "round": 15,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.732Z"
    },
    {
      "id": "action-15-roamer-creature-4-229",
      "round": 15,
      "actor": {
        "id": "roamer-creature-4",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-4",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.732Z"
    },
    {
      "id": "action-15-roamer-creature-5-230",
      "round": 15,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.732Z"
    },
    {
      "id": "action-15-roamer-creature-6-231",
      "round": 15,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.732Z"
    },
    {
      "id": "action-15-roamer-creature-7-232",
      "round": 15,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.732Z"
    },
    {
      "id": "action-15-roamer-creature-8-233",
      "round": 15,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.732Z"
    },
    {
      "id": "action-15-roamer-creature-10-234",
      "round": 15,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.732Z"
    },
    {
      "id": "action-15-nest-creature-1-235",
      "round": 15,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.732Z"
    },
    {
      "id": "action-15-nest-creature-2-236",
      "round": 15,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 9,
          "column": 6
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-01T20:31:45.732Z"
    },
    {
      "id": "action-15-nest-creature-4-237",
      "round": 15,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 7
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:45.732Z"
    },
    {
      "id": "action-16-player-2-238",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:45.733Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 62 (round 16)
- Player: 胡斐 (player-2), level 3, experience 10, at (9, 8), health 31.249999999999993, stamina 5
- Attributes: armStrength=12, constitution=11, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 11
- Stored experience change: -80 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: roamer-creature-4
- Nests: creature-nest-1=130.55999999999995/132, creature-nest-2=137.79999999999995/145, creature-nest-3=139.12999999999988/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-239",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "roamer-creature-4",
          "kind": "creature",
          "position": {
            "row": 8,
            "column": 8
          }
        },
        "reason": "交戰：攻擊 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 游蕩妖物",
      "createdAt": "2026-09-01T20:31:45.741Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 63 (round 16)
- Player: 胡斐 (player-2), level 3, experience 10, at (9, 8), health 31.249999999999993, stamina 5
- Attributes: armStrength=12, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=130.55999999999995/132, creature-nest-2=137.79999999999995/145, creature-nest-3=139.12999999999988/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-240",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "allocate-attribute",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "attribute": "constitution",
        "reason": "屬性分配：提升 constitution"
      },
      "result": "succeeded",
      "reason": "屬性分配：提升 constitution",
      "createdAt": "2026-09-01T20:31:45.748Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 64 (round 16)
- Player: 胡斐 (player-2), level 3, experience 10, at (9, 8), health 31.249999999999993, stamina 5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=130.55999999999995/132, creature-nest-2=137.79999999999995/145, creature-nest-3=139.12999999999988/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-241",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "allocate-attribute",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "attribute": "armStrength",
        "reason": "屬性分配：提升 armStrength"
      },
      "result": "succeeded",
      "reason": "屬性分配：提升 armStrength",
      "createdAt": "2026-09-01T20:31:45.756Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 65 (round 16)
- Player: 胡斐 (player-2), level 3, experience 30, at (9, 8), health 31.249999999999993, stamina 0
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=130.55999999999995/132, creature-nest-2=137.79999999999995/145, creature-nest-3=139.12999999999988/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-242",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "collect",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "ruin-18",
          "kind": "ruin",
          "position": {
            "row": 9,
            "column": 9
          }
        },
        "reason": "清障：清除廢墟 忘憂谷村"
      },
      "result": "succeeded",
      "reason": "清障：清除廢墟 忘憂谷村",
      "createdAt": "2026-09-01T20:31:45.764Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 66 (round 17)
- Player: 胡斐 (player-2), level 3, experience 30, at (9, 8), health 33.04999999999999, stamina 10.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=131.87999999999994/132, creature-nest-2=139.24999999999994/145, creature-nest-3=140.57999999999987/145

```json
{
  "actions": [
    {
      "id": "action-16-roamer-creature-1-243",
      "round": 16,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.764Z"
    },
    {
      "id": "action-16-roamer-creature-2-244",
      "round": 16,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.764Z"
    },
    {
      "id": "action-16-roamer-creature-3-245",
      "round": 16,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.765Z"
    },
    {
      "id": "action-16-roamer-creature-5-246",
      "round": 16,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.765Z"
    },
    {
      "id": "action-16-roamer-creature-6-247",
      "round": 16,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.765Z"
    },
    {
      "id": "action-16-roamer-creature-7-248",
      "round": 16,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.765Z"
    },
    {
      "id": "action-16-roamer-creature-8-249",
      "round": 16,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.765Z"
    },
    {
      "id": "action-16-roamer-creature-10-250",
      "round": 16,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.765Z"
    },
    {
      "id": "action-16-nest-creature-1-251",
      "round": 16,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:45.765Z"
    },
    {
      "id": "action-16-nest-creature-2-252",
      "round": 16,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.765Z"
    },
    {
      "id": "action-16-nest-creature-4-253",
      "round": 16,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 7
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:45.765Z"
    },
    {
      "id": "action-17-player-2-254",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T20:31:45.766Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 67 (round 17)
- Player: 胡斐 (player-2), level 3, experience 50, at (9, 8), health 33.04999999999999, stamina 5.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: nest-creature-2
- Nests: creature-nest-1=131.87999999999994/132, creature-nest-2=139.24999999999994/145, creature-nest-3=140.57999999999987/145

```json
{
  "actions": [
    {
      "id": "action-17-player-2-255",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "nest-creature-2",
          "kind": "creature",
          "position": {
            "row": 9,
            "column": 7
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-01T20:31:45.775Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 68 (round 17)
- Player: 胡斐 (player-2), level 3, experience 50, at (10, 8), health 33.04999999999999, stamina 3.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=131.87999999999994/132, creature-nest-2=139.24999999999994/145, creature-nest-3=140.57999999999987/145

```json
{
  "actions": [
    {
      "id": "action-17-player-2-256",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 10,
          "column": 8
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.784Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 69 (round 17)
- Player: 胡斐 (player-2), level 3, experience 50, at (10, 7), health 33.04999999999999, stamina 1.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=131.87999999999994/132, creature-nest-2=139.24999999999994/145, creature-nest-3=140.57999999999987/145

```json
{
  "actions": [
    {
      "id": "action-17-player-2-257",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 10,
          "column": 7
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.792Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 70 (round 18)
- Player: 胡斐 (player-2), level 3, experience 53, at (10, 7), health 34.84999999999999, stamina 10.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132/132, creature-nest-2=140.69999999999993/145, creature-nest-3=142.02999999999986/145

```json
{
  "actions": [
    {
      "id": "action-17-roamer-creature-1-258",
      "round": 17,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.795Z"
    },
    {
      "id": "action-17-roamer-creature-2-259",
      "round": 17,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.795Z"
    },
    {
      "id": "action-17-roamer-creature-3-260",
      "round": 17,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.795Z"
    },
    {
      "id": "action-17-roamer-creature-5-261",
      "round": 17,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.795Z"
    },
    {
      "id": "action-17-roamer-creature-6-262",
      "round": 17,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.795Z"
    },
    {
      "id": "action-17-roamer-creature-7-263",
      "round": 17,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.796Z"
    },
    {
      "id": "action-17-roamer-creature-8-264",
      "round": 17,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.796Z"
    },
    {
      "id": "action-17-roamer-creature-10-265",
      "round": 17,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.796Z"
    },
    {
      "id": "action-17-nest-creature-1-266",
      "round": 17,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:45.796Z"
    },
    {
      "id": "action-17-nest-creature-4-267",
      "round": 17,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 7
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:45.796Z"
    },
    {
      "id": "action-18-player-2-268",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:45.796Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 71 (round 18)
- Player: 胡斐 (player-2), level 3, experience 53, at (10, 6), health 34.84999999999999, stamina 8.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132/132, creature-nest-2=140.69999999999993/145, creature-nest-3=142.02999999999986/145

```json
{
  "actions": [
    {
      "id": "action-18-player-2-269",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 10,
          "column": 6
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.809Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 72 (round 18)
- Player: 胡斐 (player-2), level 3, experience 53, at (11, 6), health 34.84999999999999, stamina 6.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132/132, creature-nest-2=140.69999999999993/145, creature-nest-3=142.02999999999986/145

```json
{
  "actions": [
    {
      "id": "action-18-player-2-270",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 11,
          "column": 6
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.817Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 73 (round 18)
- Player: 胡斐 (player-2), level 3, experience 53, at (12, 6), health 34.84999999999999, stamina 4.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132/132, creature-nest-2=140.69999999999993/145, creature-nest-3=142.02999999999986/145

```json
{
  "actions": [
    {
      "id": "action-18-player-2-271",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 12,
          "column": 6
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.826Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 74 (round 18)
- Player: 胡斐 (player-2), level 3, experience 53, at (12, 7), health 34.84999999999999, stamina 2.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132/132, creature-nest-2=140.69999999999993/145, creature-nest-3=142.02999999999986/145

```json
{
  "actions": [
    {
      "id": "action-18-player-2-272",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 12,
          "column": 7
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.834Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 75 (round 18)
- Player: 胡斐 (player-2), level 3, experience 53, at (11, 7), health 34.84999999999999, stamina 0.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132/132, creature-nest-2=140.69999999999993/145, creature-nest-3=142.02999999999986/145

```json
{
  "actions": [
    {
      "id": "action-18-player-2-273",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 11,
          "column": 7
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T20:31:45.840Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 76 (round 19)
- Player: 胡斐 (player-2), level 3, experience 54, at (11, 7), health 36, stamina 10.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132/132, creature-nest-2=142.14999999999992/145, creature-nest-3=143.47999999999985/145

```json
{
  "actions": [
    {
      "id": "action-18-roamer-creature-1-274",
      "round": 18,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.843Z"
    },
    {
      "id": "action-18-roamer-creature-2-275",
      "round": 18,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.843Z"
    },
    {
      "id": "action-18-roamer-creature-3-276",
      "round": 18,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.843Z"
    },
    {
      "id": "action-18-roamer-creature-5-277",
      "round": 18,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.843Z"
    },
    {
      "id": "action-18-roamer-creature-6-278",
      "round": 18,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.843Z"
    },
    {
      "id": "action-18-roamer-creature-7-279",
      "round": 18,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.843Z"
    },
    {
      "id": "action-18-roamer-creature-8-280",
      "round": 18,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.843Z"
    },
    {
      "id": "action-18-roamer-creature-10-281",
      "round": 18,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.843Z"
    },
    {
      "id": "action-18-nest-creature-1-282",
      "round": 18,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:45.843Z"
    },
    {
      "id": "action-18-nest-creature-4-283",
      "round": 18,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 7
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:45.843Z"
    },
    {
      "id": "action-19-player-2-284",
      "round": 19,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:45.843Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 77 (round 19)
- Player: 胡斐 (player-2), level 3, experience 54, at (11, 6), health 36, stamina 8.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132/132, creature-nest-2=142.14999999999992/145, creature-nest-3=143.47999999999985/145

```json
{
  "actions": [
    {
      "id": "action-19-player-2-285",
      "round": 19,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 11,
          "column": 6
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.853Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 78 (round 19)
- Player: 胡斐 (player-2), level 3, experience 54, at (11, 5), health 36, stamina 3.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132/132, creature-nest-2=142.14999999999992/145, creature-nest-3=143.47999999999985/145

```json
{
  "actions": [
    {
      "id": "action-19-player-2-286",
      "round": 19,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 11,
          "column": 5
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.859Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 79 (round 19)
- Player: 胡斐 (player-2), level 3, experience 54, at (11, 6), health 36, stamina 1.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132/132, creature-nest-2=142.14999999999992/145, creature-nest-3=143.47999999999985/145

```json
{
  "actions": [
    {
      "id": "action-19-player-2-287",
      "round": 19,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 11,
          "column": 6
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.868Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 80 (round 20)
- Player: 胡斐 (player-2), level 3, experience 57, at (11, 6), health 36, stamina 10.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132/132, creature-nest-2=143.5999999999999/145, creature-nest-3=144.92999999999984/145

```json
{
  "actions": [
    {
      "id": "action-19-roamer-creature-1-288",
      "round": 19,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.870Z"
    },
    {
      "id": "action-19-roamer-creature-2-289",
      "round": 19,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.870Z"
    },
    {
      "id": "action-19-roamer-creature-3-290",
      "round": 19,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.871Z"
    },
    {
      "id": "action-19-roamer-creature-5-291",
      "round": 19,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.871Z"
    },
    {
      "id": "action-19-roamer-creature-6-292",
      "round": 19,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.871Z"
    },
    {
      "id": "action-19-roamer-creature-7-293",
      "round": 19,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.871Z"
    },
    {
      "id": "action-19-roamer-creature-8-294",
      "round": 19,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.871Z"
    },
    {
      "id": "action-19-roamer-creature-10-295",
      "round": 19,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.871Z"
    },
    {
      "id": "action-19-nest-creature-1-296",
      "round": 19,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:45.871Z"
    },
    {
      "id": "action-19-nest-creature-4-297",
      "round": 19,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 7
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:45.871Z"
    },
    {
      "id": "action-20-player-2-298",
      "round": 20,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:45.871Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "roamer-creature-5",
      "creatureName": "游蕩妖物",
      "message": "游蕩妖物 發現並摧毀了道具點。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 81 (round 20)
- Player: 胡斐 (player-2), level 3, experience 57, at (12, 6), health 36, stamina 8.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132/132, creature-nest-2=143.5999999999999/145, creature-nest-3=144.92999999999984/145

```json
{
  "actions": [
    {
      "id": "action-20-player-2-299",
      "round": 20,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 12,
          "column": 6
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.877Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 82 (round 20)
- Player: 胡斐 (player-2), level 3, experience 57, at (12, 5), health 36, stamina 3.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132/132, creature-nest-2=143.5999999999999/145, creature-nest-3=144.92999999999984/145

```json
{
  "actions": [
    {
      "id": "action-20-player-2-300",
      "round": 20,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 12,
          "column": 5
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:45.885Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 83 (round 20)
- Player: 胡斐 (player-2), level 3, experience 57, at (12, 5), health 36, stamina 0.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132/132, creature-nest-2=143.5999999999999/145, creature-nest-3=144.92999999999984/145

```json
{
  "actions": [
    {
      "id": "action-20-player-2-301",
      "round": 20,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "learn-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-4",
        "skillType": "external",
        "skillId": "blazing-sun-external-damage",
        "reason": "學招：學習門派功法 烈陽轟"
      },
      "result": "succeeded",
      "reason": "學招：學習門派功法 烈陽轟",
      "createdAt": "2026-09-01T20:31:45.890Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 84 (round 21)
- Player: 胡斐 (player-2), level 3, experience 58, at (12, 5), health 36, stamina 10.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +1
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=132/132, creature-nest-2=145/159, creature-nest-3=145/145

```json
{
  "actions": [
    {
      "id": "action-20-roamer-creature-1-302",
      "round": 20,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.893Z"
    },
    {
      "id": "action-20-roamer-creature-2-303",
      "round": 20,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.893Z"
    },
    {
      "id": "action-20-roamer-creature-3-304",
      "round": 20,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.893Z"
    },
    {
      "id": "action-20-roamer-creature-5-305",
      "round": 20,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.893Z"
    },
    {
      "id": "action-20-roamer-creature-6-306",
      "round": 20,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.893Z"
    },
    {
      "id": "action-20-roamer-creature-7-307",
      "round": 20,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.894Z"
    },
    {
      "id": "action-20-roamer-creature-8-308",
      "round": 20,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.894Z"
    },
    {
      "id": "action-20-roamer-creature-10-309",
      "round": 20,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.894Z"
    },
    {
      "id": "action-20-nest-creature-1-310",
      "round": 20,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:45.894Z"
    },
    {
      "id": "action-20-nest-creature-4-311",
      "round": 20,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 7
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:45.894Z"
    },
    {
      "id": "action-21-player-2-312",
      "round": 21,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:45.894Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": [
    {
      "id": "nest-creature-2",
      "name": "生物巢穴 2的怪物 Lv.3",
      "innerSkillId": "yellow-earth-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 3,
        "column": 3
      },
      "attributes": {
        "armStrength": 8,
        "constitution": 11,
        "agility": 8,
        "innerEnergy": 8,
        "insight": 5
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 3,
      "behaviorType": "scavenger",
      "schoolId": "yellow-earth",
      "homePosition": {
        "row": 4,
        "column": 3
      },
      "homeNestId": "creature-nest-2",
      "spawnedRound": 21,
      "baseAttributes": {
        "armStrength": 8.399999999999999,
        "constitution": 9.799999999999999,
        "agility": 7,
        "innerEnergy": 8.399999999999999,
        "insight": 5.6
      },
      "health": 33,
      "maxHealth": 33,
      "stamina": 8,
      "maxStamina": 8,
      "innerPower": 24,
      "maxInnerPower": 24,
      "availableAttributePoints": 0,
      "governanceRank": 1,
      "unlockedPolicyIds": [
        "basic"
      ],
      "inventory": [],
      "unlockedEquipmentDropIds": [],
      "equipmentInventory": [],
      "equipmentLoadout": {
        "weaponInstanceId": null,
        "armorInstanceId": null,
        "accessoryInstanceId": null
      },
      "innerSkillIds": [
        "tuna-gong"
      ],
      "skillProgression": {},
      "buffs": []
    }
  ]
}
```

### Turn 85 (round 21)
- Player: 胡斐 (player-2), level 3, experience 78, at (12, 5), health 36, stamina 5.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132/132, creature-nest-2=145/159, creature-nest-3=145/145

```json
{
  "actions": [
    {
      "id": "action-21-player-2-313",
      "round": 21,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "collect",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "ruin-2",
          "kind": "ruin",
          "position": {
            "row": 13,
            "column": 5
          }
        },
        "reason": "清障：清除廢墟 長亭村"
      },
      "result": "succeeded",
      "reason": "清障：清除廢墟 長亭村",
      "createdAt": "2026-09-01T20:31:45.902Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 86 (round 21)
- Player: 胡斐 (player-2), level 3, experience 78, at (13, 5), health 36, stamina 3.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132/132, creature-nest-2=145/159, creature-nest-3=145/145

```json
{
  "actions": [
    {
      "id": "action-21-player-2-314",
      "round": 21,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 13,
          "column": 5
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T20:31:45.912Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 87 (round 21)
- Player: 胡斐 (player-2), level 3, experience 78, at (13, 4), health 36, stamina 1.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132/132, creature-nest-2=145/159, creature-nest-3=145/145

```json
{
  "actions": [
    {
      "id": "action-21-player-2-315",
      "round": 21,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 13,
          "column": 4
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T20:31:45.920Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 88 (round 22)
- Player: 胡斐 (player-2), level 3, experience 81, at (13, 4), health 36, stamina 10.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +3
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=132/145, creature-nest-2=146.59/159, creature-nest-3=145/145

```json
{
  "actions": [
    {
      "id": "action-21-roamer-creature-1-316",
      "round": 21,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.924Z"
    },
    {
      "id": "action-21-roamer-creature-2-317",
      "round": 21,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.924Z"
    },
    {
      "id": "action-21-roamer-creature-3-318",
      "round": 21,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.924Z"
    },
    {
      "id": "action-21-roamer-creature-5-319",
      "round": 21,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.924Z"
    },
    {
      "id": "action-21-roamer-creature-6-320",
      "round": 21,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.924Z"
    },
    {
      "id": "action-21-roamer-creature-7-321",
      "round": 21,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.924Z"
    },
    {
      "id": "action-21-roamer-creature-8-322",
      "round": 21,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.924Z"
    },
    {
      "id": "action-21-roamer-creature-10-323",
      "round": 21,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.924Z"
    },
    {
      "id": "action-21-nest-creature-1-324",
      "round": 21,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:45.924Z"
    },
    {
      "id": "action-21-nest-creature-4-325",
      "round": 21,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 7
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:45.924Z"
    },
    {
      "id": "action-21-nest-creature-2-326",
      "round": 21,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.924Z"
    },
    {
      "id": "action-22-player-2-327",
      "round": 22,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:45.925Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": [
    {
      "id": "nest-creature-3",
      "name": "生物巢穴 1的怪物 Lv.2",
      "innerSkillId": "void-spirit-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 13,
        "column": 1
      },
      "attributes": {
        "armStrength": 6,
        "constitution": 6,
        "agility": 5,
        "innerEnergy": 5,
        "insight": 6
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 2,
      "behaviorType": "sieger",
      "schoolId": "void-spirit",
      "homePosition": {
        "row": 13,
        "column": 2
      },
      "homeNestId": "creature-nest-1",
      "spawnedRound": 22,
      "baseAttributes": {
        "armStrength": 5.6,
        "constitution": 5.6,
        "agility": 5.6,
        "innerEnergy": 5.6,
        "insight": 5.6
      },
      "health": 18,
      "maxHealth": 18,
      "stamina": 5.5,
      "maxStamina": 5.5,
      "innerPower": 15,
      "maxInnerPower": 15,
      "availableAttributePoints": 0,
      "governanceRank": 1,
      "unlockedPolicyIds": [
        "basic"
      ],
      "inventory": [],
      "unlockedEquipmentDropIds": [],
      "equipmentInventory": [],
      "equipmentLoadout": {
        "weaponInstanceId": null,
        "armorInstanceId": null,
        "accessoryInstanceId": null
      },
      "innerSkillIds": [
        "tuna-gong"
      ],
      "skillProgression": {},
      "buffs": []
    }
  ]
}
```

### Turn 89 (round 22)
- Player: 胡斐 (player-2), level 3, experience 81, at (13, 3), health 36, stamina 8.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132/145, creature-nest-2=146.59/159, creature-nest-3=145/145

```json
{
  "actions": [
    {
      "id": "action-22-player-2-328",
      "round": 22,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 13,
          "column": 3
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T20:31:45.936Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 90 (round 22)
- Player: 胡斐 (player-2), level 3, experience 81, at (12, 3), health 36, stamina 6.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132/145, creature-nest-2=146.59/159, creature-nest-3=145/145

```json
{
  "actions": [
    {
      "id": "action-22-player-2-329",
      "round": 22,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 12,
          "column": 3
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T20:31:45.946Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 91 (round 22)
- Player: 胡斐 (player-2), level 3, experience 81, at (11, 3), health 36, stamina 1.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132/145, creature-nest-2=146.59/159, creature-nest-3=145/145

```json
{
  "actions": [
    {
      "id": "action-22-player-2-330",
      "round": 22,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 11,
          "column": 3
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T20:31:45.956Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 92 (round 23)
- Player: 胡斐 (player-2), level 3, experience 84, at (11, 3), health 36, stamina 10.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=133.45/145, creature-nest-2=148.18/159, creature-nest-3=145/145

```json
{
  "actions": [
    {
      "id": "action-22-roamer-creature-1-331",
      "round": 22,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.958Z"
    },
    {
      "id": "action-22-roamer-creature-2-332",
      "round": 22,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.958Z"
    },
    {
      "id": "action-22-roamer-creature-3-333",
      "round": 22,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.958Z"
    },
    {
      "id": "action-22-roamer-creature-5-334",
      "round": 22,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.958Z"
    },
    {
      "id": "action-22-roamer-creature-6-335",
      "round": 22,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.958Z"
    },
    {
      "id": "action-22-roamer-creature-7-336",
      "round": 22,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.958Z"
    },
    {
      "id": "action-22-roamer-creature-8-337",
      "round": 22,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.958Z"
    },
    {
      "id": "action-22-roamer-creature-10-338",
      "round": 22,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.958Z"
    },
    {
      "id": "action-22-nest-creature-1-339",
      "round": 22,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:45.958Z"
    },
    {
      "id": "action-22-nest-creature-4-340",
      "round": 22,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 7
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:45.958Z"
    },
    {
      "id": "action-22-nest-creature-2-341",
      "round": 22,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:45.959Z"
    },
    {
      "id": "action-22-nest-creature-3-342",
      "round": 22,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "destination": {
          "row": 12,
          "column": 1
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-01T20:31:45.959Z"
    },
    {
      "id": "action-23-player-2-343",
      "round": 23,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:45.959Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 93 (round 23)
- Player: 胡斐 (player-2), level 3, experience 84, at (10, 3), health 36, stamina 8.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=133.45/145, creature-nest-2=148.18/159, creature-nest-3=145/145

```json
{
  "actions": [
    {
      "id": "action-23-player-2-344",
      "round": 23,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 10,
          "column": 3
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T20:31:45.969Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 94 (round 23)
- Player: 胡斐 (player-2), level 3, experience 84, at (9, 3), health 36, stamina 6.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=133.45/145, creature-nest-2=148.18/159, creature-nest-3=145/145

```json
{
  "actions": [
    {
      "id": "action-23-player-2-345",
      "round": 23,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 9,
          "column": 3
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T20:31:45.978Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 95 (round 23)
- Player: 胡斐 (player-2), level 3, experience 84, at (9, 4), health 36, stamina 4.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=133.45/145, creature-nest-2=148.18/159, creature-nest-3=145/145

```json
{
  "actions": [
    {
      "id": "action-23-player-2-346",
      "round": 23,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 9,
          "column": 4
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T20:31:45.987Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 96 (round 23)
- Player: 胡斐 (player-2), level 3, experience 84, at (9, 5), health 36, stamina 2.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=133.45/145, creature-nest-2=148.18/159, creature-nest-3=145/145

```json
{
  "actions": [
    {
      "id": "action-23-player-2-347",
      "round": 23,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 9,
          "column": 5
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T20:31:45.996Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 97 (round 23)
- Player: 胡斐 (player-2), level 3, experience 84, at (9, 6), health 36, stamina 0.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=133.45/145, creature-nest-2=148.18/159, creature-nest-3=145/145

```json
{
  "actions": [
    {
      "id": "action-23-player-2-348",
      "round": 23,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 9,
          "column": 6
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T20:31:46.002Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 98 (round 24)
- Player: 胡斐 (player-2), level 3, experience 85, at (9, 6), health 36, stamina 10.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +1
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=134.89999999999998/145, creature-nest-2=149.77/159, creature-nest-3=145/159

```json
{
  "actions": [
    {
      "id": "action-23-roamer-creature-1-349",
      "round": 23,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.005Z"
    },
    {
      "id": "action-23-roamer-creature-2-350",
      "round": 23,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.005Z"
    },
    {
      "id": "action-23-roamer-creature-3-351",
      "round": 23,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.005Z"
    },
    {
      "id": "action-23-roamer-creature-5-352",
      "round": 23,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.005Z"
    },
    {
      "id": "action-23-roamer-creature-6-353",
      "round": 23,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.005Z"
    },
    {
      "id": "action-23-roamer-creature-7-354",
      "round": 23,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.005Z"
    },
    {
      "id": "action-23-roamer-creature-8-355",
      "round": 23,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.005Z"
    },
    {
      "id": "action-23-roamer-creature-10-356",
      "round": 23,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.005Z"
    },
    {
      "id": "action-23-nest-creature-1-357",
      "round": 23,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.005Z"
    },
    {
      "id": "action-23-nest-creature-4-358",
      "round": 23,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 7
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.005Z"
    },
    {
      "id": "action-23-nest-creature-2-359",
      "round": 23,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 8,
          "column": 4
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-01T20:31:46.005Z"
    },
    {
      "id": "action-23-nest-creature-3-360",
      "round": 23,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.005Z"
    },
    {
      "id": "action-24-player-2-361",
      "round": 24,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:46.006Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "creature-nest-3",
      "creatureName": "生物巢穴 3",
      "message": "生物巢穴 3 生成了 Lv.3 怪物。"
    }
  ],
  "spawnedCreatures": [
    {
      "id": "nest-creature-5",
      "name": "生物巢穴 3的怪物 Lv.3",
      "innerSkillId": "void-spirit-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 10,
        "column": 8
      },
      "attributes": {
        "armStrength": 8,
        "constitution": 8,
        "agility": 7,
        "innerEnergy": 7,
        "insight": 8
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 3,
      "behaviorType": "scavenger",
      "schoolId": "void-spirit",
      "homePosition": {
        "row": 11,
        "column": 8
      },
      "homeNestId": "creature-nest-3",
      "spawnedRound": 24,
      "baseAttributes": {
        "armStrength": 7,
        "constitution": 7,
        "agility": 7,
        "innerEnergy": 7,
        "insight": 7
      },
      "health": 24,
      "maxHealth": 24,
      "stamina": 7.5,
      "maxStamina": 7.5,
      "innerPower": 21,
      "maxInnerPower": 21,
      "availableAttributePoints": 0,
      "governanceRank": 1,
      "unlockedPolicyIds": [
        "basic"
      ],
      "inventory": [],
      "unlockedEquipmentDropIds": [],
      "equipmentInventory": [],
      "equipmentLoadout": {
        "weaponInstanceId": null,
        "armorInstanceId": null,
        "accessoryInstanceId": null
      },
      "innerSkillIds": [
        "tuna-gong"
      ],
      "skillProgression": {},
      "buffs": []
    }
  ]
}
```

### Turn 99 (round 24)
- Player: 胡斐 (player-2), level 3, experience 85, at (10, 6), health 36, stamina 8.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=134.89999999999998/145, creature-nest-2=149.77/159, creature-nest-3=145/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-362",
      "round": 24,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 10,
          "column": 6
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T20:31:46.014Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 100 (round 24)
- Player: 胡斐 (player-2), level 3, experience 85, at (11, 6), health 36, stamina 6.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=134.89999999999998/145, creature-nest-2=149.77/159, creature-nest-3=145/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-363",
      "round": 24,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 11,
          "column": 6
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T20:31:46.021Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 101 (round 24)
- Player: 胡斐 (player-2), level 3, experience 85, at (11, 7), health 36, stamina 4.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=134.89999999999998/145, creature-nest-2=149.77/159, creature-nest-3=145/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-364",
      "round": 24,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 11,
          "column": 7
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T20:31:46.029Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 102 (round 24)
- Player: 胡斐 (player-2), level 3, experience 85, at (10, 7), health 36, stamina 2.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=134.89999999999998/145, creature-nest-2=149.77/159, creature-nest-3=145/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-365",
      "round": 24,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 10,
          "column": 7
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T20:31:46.040Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 103 (round 24)
- Player: 胡斐 (player-2), level 3, experience 85, at (9, 7), health 36, stamina 0.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=134.89999999999998/145, creature-nest-2=149.77/159, creature-nest-3=145/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-366",
      "round": 24,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 9,
          "column": 7
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T20:31:46.047Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 104 (round 25)
- Player: 胡斐 (player-2), level 3, experience 86, at (9, 7), health 32.8, stamina 10.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=136.34999999999997/145, creature-nest-2=151.36/159, creature-nest-3=146.59/159

```json
{
  "actions": [
    {
      "id": "action-24-roamer-creature-1-367",
      "round": 24,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.051Z"
    },
    {
      "id": "action-24-roamer-creature-2-368",
      "round": 24,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.051Z"
    },
    {
      "id": "action-24-roamer-creature-3-369",
      "round": 24,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.051Z"
    },
    {
      "id": "action-24-roamer-creature-5-370",
      "round": 24,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.051Z"
    },
    {
      "id": "action-24-roamer-creature-6-371",
      "round": 24,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.052Z"
    },
    {
      "id": "action-24-roamer-creature-7-372",
      "round": 24,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.052Z"
    },
    {
      "id": "action-24-roamer-creature-8-373",
      "round": 24,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.052Z"
    },
    {
      "id": "action-24-roamer-creature-10-374",
      "round": 24,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.052Z"
    },
    {
      "id": "action-24-nest-creature-1-375",
      "round": 24,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.052Z"
    },
    {
      "id": "action-24-nest-creature-4-376",
      "round": 24,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 7
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.052Z"
    },
    {
      "id": "action-24-nest-creature-2-377",
      "round": 24,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 9,
          "column": 5
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-01T20:31:46.052Z"
    },
    {
      "id": "action-24-nest-creature-3-378",
      "round": 24,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.052Z"
    },
    {
      "id": "action-24-nest-creature-5-379",
      "round": 24,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "target": {
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 9,
            "column": 7
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-01T20:31:46.052Z"
    },
    {
      "id": "action-25-player-2-380",
      "round": 25,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:46.052Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 105 (round 25)
- Player: 胡斐 (player-2), level 3, experience 89, at (9, 7), health 32.8, stamina 5.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=136.34999999999997/145, creature-nest-2=151.36/159, creature-nest-3=146.59/159

```json
{
  "actions": [
    {
      "id": "action-25-player-2-381",
      "round": 25,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "nest-creature-5",
          "kind": "creature",
          "position": {
            "row": 9,
            "column": 8
          }
        },
        "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.3"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.3",
      "createdAt": "2026-09-01T20:31:46.059Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 106 (round 25)
- Player: 胡斐 (player-2), level 3, experience 149, at (9, 7), health 32.8, stamina 0.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +60
- Spawned creatures: 0
- Defeated creatures: nest-creature-5
- Nests: creature-nest-1=136.34999999999997/145, creature-nest-2=151.36/159, creature-nest-3=146.59/159

```json
{
  "actions": [
    {
      "id": "action-25-player-2-382",
      "round": 25,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "nest-creature-5",
          "kind": "creature",
          "position": {
            "row": 9,
            "column": 8
          }
        },
        "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.3"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.3",
      "createdAt": "2026-09-01T20:31:46.068Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 107 (round 26)
- Player: 胡斐 (player-2), level 4, experience 0, at (9, 7), health 29.599999999999998, stamina 10.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: -149 (level up; stored experience reset by game rules)
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=137.79999999999995/159, creature-nest-2=152.95000000000002/159, creature-nest-3=148.18/159

```json
{
  "actions": [
    {
      "id": "action-25-roamer-creature-1-383",
      "round": 25,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.071Z"
    },
    {
      "id": "action-25-roamer-creature-2-384",
      "round": 25,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.071Z"
    },
    {
      "id": "action-25-roamer-creature-3-385",
      "round": 25,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.071Z"
    },
    {
      "id": "action-25-roamer-creature-5-386",
      "round": 25,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.071Z"
    },
    {
      "id": "action-25-roamer-creature-6-387",
      "round": 25,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.071Z"
    },
    {
      "id": "action-25-roamer-creature-7-388",
      "round": 25,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.071Z"
    },
    {
      "id": "action-25-roamer-creature-8-389",
      "round": 25,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.071Z"
    },
    {
      "id": "action-25-roamer-creature-10-390",
      "round": 25,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "target": {
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 9,
            "column": 7
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-01T20:31:46.071Z"
    },
    {
      "id": "action-25-nest-creature-1-391",
      "round": 25,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.071Z"
    },
    {
      "id": "action-25-nest-creature-4-392",
      "round": 25,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 7
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.071Z"
    },
    {
      "id": "action-25-nest-creature-2-393",
      "round": 25,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 9,
          "column": 5
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-01T20:31:46.071Z"
    },
    {
      "id": "action-25-nest-creature-3-394",
      "round": 25,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.071Z"
    },
    {
      "id": "action-26-player-2-395",
      "round": 26,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:46.072Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "creature-nest-1",
      "creatureName": "生物巢穴 1",
      "message": "生物巢穴 1 生成了 Lv.3 怪物。"
    }
  ],
  "spawnedCreatures": [
    {
      "id": "nest-creature-5",
      "name": "生物巢穴 1的怪物 Lv.3",
      "innerSkillId": "void-spirit-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 13,
        "column": 1
      },
      "attributes": {
        "armStrength": 8,
        "constitution": 8,
        "agility": 7,
        "innerEnergy": 7,
        "insight": 8
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 3,
      "behaviorType": "sieger",
      "schoolId": "void-spirit",
      "homePosition": {
        "row": 13,
        "column": 2
      },
      "homeNestId": "creature-nest-1",
      "spawnedRound": 26,
      "baseAttributes": {
        "armStrength": 7,
        "constitution": 7,
        "agility": 7,
        "innerEnergy": 7,
        "insight": 7
      },
      "health": 24,
      "maxHealth": 24,
      "stamina": 7.5,
      "maxStamina": 7.5,
      "innerPower": 21,
      "maxInnerPower": 21,
      "availableAttributePoints": 0,
      "governanceRank": 1,
      "unlockedPolicyIds": [
        "basic"
      ],
      "inventory": [],
      "unlockedEquipmentDropIds": [],
      "equipmentInventory": [],
      "equipmentLoadout": {
        "weaponInstanceId": null,
        "armorInstanceId": null,
        "accessoryInstanceId": null
      },
      "innerSkillIds": [
        "tuna-gong"
      ],
      "skillProgression": {},
      "buffs": []
    }
  ]
}
```

### Turn 108 (round 26)
- Player: 胡斐 (player-2), level 4, experience 0, at (9, 7), health 29.599999999999998, stamina 10.5
- Attributes: armStrength=13, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=137.79999999999995/159, creature-nest-2=152.95000000000002/159, creature-nest-3=148.18/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-396",
      "round": 26,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "allocate-attribute",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "attribute": "constitution",
        "reason": "屬性分配：提升 constitution"
      },
      "result": "succeeded",
      "reason": "屬性分配：提升 constitution",
      "createdAt": "2026-09-01T20:31:46.079Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 109 (round 26)
- Player: 胡斐 (player-2), level 4, experience 0, at (9, 7), health 29.599999999999998, stamina 10.5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=137.79999999999995/159, creature-nest-2=152.95000000000002/159, creature-nest-3=148.18/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-397",
      "round": 26,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "allocate-attribute",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "attribute": "armStrength",
        "reason": "屬性分配：提升 armStrength"
      },
      "result": "succeeded",
      "reason": "屬性分配：提升 armStrength",
      "createdAt": "2026-09-01T20:31:46.087Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 110 (round 26)
- Player: 胡斐 (player-2), level 4, experience 40, at (9, 7), health 29.599999999999998, stamina 5.5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +40
- Spawned creatures: 0
- Defeated creatures: roamer-creature-10
- Nests: creature-nest-1=137.79999999999995/159, creature-nest-2=152.95000000000002/159, creature-nest-3=148.18/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-398",
      "round": 26,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "roamer-creature-10",
          "kind": "creature",
          "position": {
            "row": 9,
            "column": 6
          }
        },
        "reason": "交戰：攻擊 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 游蕩妖物",
      "createdAt": "2026-09-01T20:31:46.093Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 111 (round 26)
- Player: 胡斐 (player-2), level 4, experience 40, at (9, 8), health 29.599999999999998, stamina 3.5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=137.79999999999995/159, creature-nest-2=152.95000000000002/159, creature-nest-3=148.18/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-399",
      "round": 26,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 9,
          "column": 8
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T20:31:46.107Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 112 (round 26)
- Player: 胡斐 (player-2), level 4, experience 40, at (8, 8), health 29.599999999999998, stamina 1.5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=137.79999999999995/159, creature-nest-2=152.95000000000002/159, creature-nest-3=148.18/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-400",
      "round": 26,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 8,
          "column": 8
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T20:31:46.117Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 113 (round 27)
- Player: 胡斐 (player-2), level 4, experience 43, at (8, 8), health 31.549999999999997, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=139.38999999999996/159, creature-nest-2=154.54000000000002/159, creature-nest-3=149.77/159

```json
{
  "actions": [
    {
      "id": "action-26-roamer-creature-1-401",
      "round": 26,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.121Z"
    },
    {
      "id": "action-26-roamer-creature-2-402",
      "round": 26,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.121Z"
    },
    {
      "id": "action-26-roamer-creature-3-403",
      "round": 26,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.121Z"
    },
    {
      "id": "action-26-roamer-creature-5-404",
      "round": 26,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.121Z"
    },
    {
      "id": "action-26-roamer-creature-6-405",
      "round": 26,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.121Z"
    },
    {
      "id": "action-26-roamer-creature-7-406",
      "round": 26,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.121Z"
    },
    {
      "id": "action-26-roamer-creature-8-407",
      "round": 26,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.121Z"
    },
    {
      "id": "action-26-nest-creature-1-408",
      "round": 26,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.121Z"
    },
    {
      "id": "action-26-nest-creature-4-409",
      "round": 26,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 7
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.121Z"
    },
    {
      "id": "action-26-nest-creature-2-410",
      "round": 26,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.121Z"
    },
    {
      "id": "action-26-nest-creature-3-411",
      "round": 26,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.121Z"
    },
    {
      "id": "action-26-nest-creature-5-412",
      "round": 26,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.121Z"
    },
    {
      "id": "action-27-player-2-413",
      "round": 27,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:46.122Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 114 (round 27)
- Player: 胡斐 (player-2), level 4, experience 43, at (6, 9), health 31.549999999999997, stamina 5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=139.38999999999996/159, creature-nest-2=154.54000000000002/159, creature-nest-3=149.77/159

```json
{
  "actions": [
    {
      "id": "action-27-player-2-414",
      "round": 27,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 6,
          "column": 9
        },
        "reason": "清障：移動到廢墟 斷橋莊 附近"
      },
      "result": "succeeded",
      "reason": "清障：移動到廢墟 斷橋莊 附近",
      "createdAt": "2026-09-01T20:31:46.132Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 115 (round 27)
- Player: 胡斐 (player-2), level 4, experience 63, at (6, 9), health 31.549999999999997, stamina 0
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=139.38999999999996/159, creature-nest-2=154.54000000000002/159, creature-nest-3=149.77/159

```json
{
  "actions": [
    {
      "id": "action-27-player-2-415",
      "round": 27,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "collect",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "ruin-5",
          "kind": "ruin",
          "position": {
            "row": 6,
            "column": 8
          }
        },
        "reason": "清障：清除廢墟 斷橋莊"
      },
      "result": "succeeded",
      "reason": "清障：清除廢墟 斷橋莊",
      "createdAt": "2026-09-01T20:31:46.138Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 116 (round 28)
- Player: 胡斐 (player-2), level 4, experience 63, at (6, 9), health 33.5, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=140.97999999999996/159, creature-nest-2=156.13000000000002/159, creature-nest-3=151.36/159

```json
{
  "actions": [
    {
      "id": "action-27-roamer-creature-1-416",
      "round": 27,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.139Z"
    },
    {
      "id": "action-27-roamer-creature-2-417",
      "round": 27,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.139Z"
    },
    {
      "id": "action-27-roamer-creature-3-418",
      "round": 27,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.139Z"
    },
    {
      "id": "action-27-roamer-creature-5-419",
      "round": 27,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.139Z"
    },
    {
      "id": "action-27-roamer-creature-6-420",
      "round": 27,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.139Z"
    },
    {
      "id": "action-27-roamer-creature-7-421",
      "round": 27,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.139Z"
    },
    {
      "id": "action-27-roamer-creature-8-422",
      "round": 27,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.139Z"
    },
    {
      "id": "action-27-nest-creature-1-423",
      "round": 27,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.139Z"
    },
    {
      "id": "action-27-nest-creature-4-424",
      "round": 27,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 8
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.139Z"
    },
    {
      "id": "action-27-nest-creature-2-425",
      "round": 27,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 7
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-01T20:31:46.139Z"
    },
    {
      "id": "action-27-nest-creature-3-426",
      "round": 27,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.139Z"
    },
    {
      "id": "action-27-nest-creature-5-427",
      "round": 27,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.139Z"
    },
    {
      "id": "action-28-player-2-428",
      "round": 28,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T20:31:46.140Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 117 (round 28)
- Player: 胡斐 (player-2), level 4, experience 66, at (6, 9), health 33.5, stamina 6
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=140.97999999999996/159, creature-nest-2=156.13000000000002/159, creature-nest-3=151.36/159

```json
{
  "actions": [
    {
      "id": "action-28-player-2-429",
      "round": 28,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "nest-creature-4",
          "kind": "creature",
          "position": {
            "row": 6,
            "column": 8
          }
        },
        "reason": "交戰：攻擊 生物巢穴 2的怪物 Lv.2"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 2的怪物 Lv.2",
      "createdAt": "2026-09-01T20:31:46.147Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 118 (round 28)
- Player: 胡斐 (player-2), level 4, experience 106, at (6, 9), health 33.5, stamina 1
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +40
- Spawned creatures: 0
- Defeated creatures: nest-creature-4
- Nests: creature-nest-1=140.97999999999996/159, creature-nest-2=156.13000000000002/159, creature-nest-3=151.36/159

```json
{
  "actions": [
    {
      "id": "action-28-player-2-430",
      "round": 28,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "nest-creature-4",
          "kind": "creature",
          "position": {
            "row": 6,
            "column": 8
          }
        },
        "reason": "交戰：攻擊 生物巢穴 2的怪物 Lv.2"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 2的怪物 Lv.2",
      "createdAt": "2026-09-01T20:31:46.154Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 119 (round 29)
- Player: 胡斐 (player-2), level 4, experience 108, at (6, 9), health 35.45, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=142.56999999999996/159, creature-nest-2=157.72000000000003/159, creature-nest-3=152.95000000000002/159

```json
{
  "actions": [
    {
      "id": "action-28-roamer-creature-1-431",
      "round": 28,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.156Z"
    },
    {
      "id": "action-28-roamer-creature-2-432",
      "round": 28,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.156Z"
    },
    {
      "id": "action-28-roamer-creature-3-433",
      "round": 28,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.156Z"
    },
    {
      "id": "action-28-roamer-creature-5-434",
      "round": 28,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.156Z"
    },
    {
      "id": "action-28-roamer-creature-6-435",
      "round": 28,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.156Z"
    },
    {
      "id": "action-28-roamer-creature-7-436",
      "round": 28,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.156Z"
    },
    {
      "id": "action-28-roamer-creature-8-437",
      "round": 28,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.156Z"
    },
    {
      "id": "action-28-nest-creature-1-438",
      "round": 28,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.156Z"
    },
    {
      "id": "action-28-nest-creature-2-439",
      "round": 28,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 8
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.156Z"
    },
    {
      "id": "action-28-nest-creature-3-440",
      "round": 28,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.156Z"
    },
    {
      "id": "action-28-nest-creature-5-441",
      "round": 28,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.156Z"
    },
    {
      "id": "action-29-player-2-442",
      "round": 29,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:46.157Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 120 (round 29)
- Player: 胡斐 (player-2), level 4, experience 128, at (6, 9), health 35.45, stamina 6
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=142.56999999999996/159, creature-nest-2=157.72000000000003/159, creature-nest-3=152.95000000000002/159

```json
{
  "actions": [
    {
      "id": "action-29-player-2-443",
      "round": 29,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "collect",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "ruin-7",
          "kind": "ruin",
          "position": {
            "row": 6,
            "column": 10
          }
        },
        "reason": "清障：清除廢墟 柳岸村"
      },
      "result": "succeeded",
      "reason": "清障：清除廢墟 柳岸村",
      "createdAt": "2026-09-01T20:31:46.162Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 121 (round 29)
- Player: 胡斐 (player-2), level 4, experience 128, at (5, 9), health 35.45, stamina 4
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=142.56999999999996/159, creature-nest-2=157.72000000000003/159, creature-nest-3=152.95000000000002/159

```json
{
  "actions": [
    {
      "id": "action-29-player-2-444",
      "round": 29,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 9
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:46.169Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 122 (round 29)
- Player: 胡斐 (player-2), level 4, experience 128, at (5, 10), health 35.45, stamina 2
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=142.56999999999996/159, creature-nest-2=157.72000000000003/159, creature-nest-3=152.95000000000002/159

```json
{
  "actions": [
    {
      "id": "action-29-player-2-445",
      "round": 29,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 10
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:46.175Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 123 (round 29)
- Player: 胡斐 (player-2), level 4, experience 128, at (5, 11), health 35.45, stamina 0
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=142.56999999999996/159, creature-nest-2=157.72000000000003/159, creature-nest-3=152.95000000000002/159

```json
{
  "actions": [
    {
      "id": "action-29-player-2-446",
      "round": 29,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 11
        },
        "reason": "保命：逃離 生物巢穴 2的怪物 Lv.3（hitsSurvivable=3.938888888888889）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 2的怪物 Lv.3（hitsSurvivable=3.938888888888889）",
      "createdAt": "2026-09-01T20:31:46.179Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 124 (round 30)
- Player: 胡斐 (player-2), level 4, experience 128, at (5, 11), health 37.400000000000006, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=144.15999999999997/159, creature-nest-2=159/159, creature-nest-3=154.54000000000002/159

```json
{
  "actions": [
    {
      "id": "action-29-roamer-creature-1-447",
      "round": 29,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.180Z"
    },
    {
      "id": "action-29-roamer-creature-2-448",
      "round": 29,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.180Z"
    },
    {
      "id": "action-29-roamer-creature-3-449",
      "round": 29,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.180Z"
    },
    {
      "id": "action-29-roamer-creature-5-450",
      "round": 29,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.180Z"
    },
    {
      "id": "action-29-roamer-creature-6-451",
      "round": 29,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.180Z"
    },
    {
      "id": "action-29-roamer-creature-7-452",
      "round": 29,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.180Z"
    },
    {
      "id": "action-29-roamer-creature-8-453",
      "round": 29,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.180Z"
    },
    {
      "id": "action-29-nest-creature-1-454",
      "round": 29,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.180Z"
    },
    {
      "id": "action-29-nest-creature-2-455",
      "round": 29,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "target": {
          "id": "resource-point-3",
          "kind": "resource",
          "position": {
            "row": 6,
            "column": 11
          }
        },
        "reason": "與 耕田 交戰。"
      },
      "result": "succeeded",
      "reason": "與 耕田 交戰。",
      "createdAt": "2026-09-01T20:31:46.180Z"
    },
    {
      "id": "action-29-nest-creature-3-456",
      "round": 29,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.180Z"
    },
    {
      "id": "action-29-nest-creature-5-457",
      "round": 29,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.181Z"
    },
    {
      "id": "action-30-player-2-458",
      "round": 30,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T20:31:46.181Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-2",
      "creatureName": "生物巢穴 2的怪物 Lv.3",
      "message": "生物巢穴 2的怪物 Lv.3 攻擊耕田，造成 6 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 125 (round 30)
- Player: 胡斐 (player-2), level 4, experience 128, at (5, 12), health 37.400000000000006, stamina 9
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=144.15999999999997/159, creature-nest-2=159/159, creature-nest-3=154.54000000000002/159

```json
{
  "actions": [
    {
      "id": "action-30-player-2-459",
      "round": 30,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 12
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:31:46.190Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 126 (round 30)
- Player: 胡斐 (player-2), level 4, experience 128, at (5, 13), health 37.400000000000006, stamina 7
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=144.15999999999997/159, creature-nest-2=159/159, creature-nest-3=154.54000000000002/159

```json
{
  "actions": [
    {
      "id": "action-30-player-2-460",
      "round": 30,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 13
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:31:46.201Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 127 (round 30)
- Player: 胡斐 (player-2), level 4, experience 128, at (5, 13), health 37.400000000000006, stamina 5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=144.15999999999997/159, creature-nest-2=159/159, creature-nest-3=154.54000000000002/159

```json
{
  "actions": [
    {
      "id": "action-30-player-2-461",
      "round": 30,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "use-facility",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "baseId": "base-1",
        "facilityType": "mission",
        "reason": "任務：執行告示牌任務"
      },
      "result": "succeeded",
      "reason": "任務：執行告示牌任務",
      "createdAt": "2026-09-01T20:31:46.208Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 128 (round 30)
- Player: 胡斐 (player-2), level 4, experience 128, at (4, 13), health 37.400000000000006, stamina 3
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=144.15999999999997/159, creature-nest-2=159/159, creature-nest-3=154.54000000000002/159

```json
{
  "actions": [
    {
      "id": "action-30-player-2-462",
      "round": 30,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 4,
          "column": 13
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:46.217Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 129 (round 30)
- Player: 胡斐 (player-2), level 4, experience 128, at (3, 13), health 37.400000000000006, stamina 1
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=144.15999999999997/159, creature-nest-2=159/159, creature-nest-3=154.54000000000002/159

```json
{
  "actions": [
    {
      "id": "action-30-player-2-463",
      "round": 30,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 3,
          "column": 13
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:31:46.224Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 130 (round 31)
- Player: 胡斐 (player-2), level 4, experience 130, at (3, 13), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=145.74999999999997/159, creature-nest-2=159/159, creature-nest-3=156.13000000000002/159

```json
{
  "actions": [
    {
      "id": "action-30-roamer-creature-1-464",
      "round": 30,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.227Z"
    },
    {
      "id": "action-30-roamer-creature-2-465",
      "round": 30,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.227Z"
    },
    {
      "id": "action-30-roamer-creature-3-466",
      "round": 30,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.227Z"
    },
    {
      "id": "action-30-roamer-creature-5-467",
      "round": 30,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.227Z"
    },
    {
      "id": "action-30-roamer-creature-6-468",
      "round": 30,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.227Z"
    },
    {
      "id": "action-30-roamer-creature-7-469",
      "round": 30,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.227Z"
    },
    {
      "id": "action-30-roamer-creature-8-470",
      "round": 30,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.227Z"
    },
    {
      "id": "action-30-nest-creature-1-471",
      "round": 30,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.227Z"
    },
    {
      "id": "action-30-nest-creature-2-472",
      "round": 30,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "target": {
          "id": "resource-point-3",
          "kind": "resource",
          "position": {
            "row": 6,
            "column": 11
          }
        },
        "reason": "與 耕田 交戰。"
      },
      "result": "succeeded",
      "reason": "與 耕田 交戰。",
      "createdAt": "2026-09-01T20:31:46.237Z"
    },
    {
      "id": "action-30-nest-creature-3-473",
      "round": 30,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.237Z"
    },
    {
      "id": "action-30-nest-creature-5-474",
      "round": 30,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.237Z"
    },
    {
      "id": "action-31-player-2-475",
      "round": 31,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:46.237Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 131 (round 31)
- Player: 胡斐 (player-2), level 4, experience 130, at (2, 13), health 39, stamina 9
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=145.74999999999997/159, creature-nest-2=159/159, creature-nest-3=156.13000000000002/159

```json
{
  "actions": [
    {
      "id": "action-31-player-2-476",
      "round": 31,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 13
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:31:46.246Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 132 (round 31)
- Player: 胡斐 (player-2), level 4, experience 130, at (2, 12), health 39, stamina 7
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=145.74999999999997/159, creature-nest-2=159/159, creature-nest-3=156.13000000000002/159

```json
{
  "actions": [
    {
      "id": "action-31-player-2-477",
      "round": 31,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 12
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:31:46.255Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 133 (round 31)
- Player: 胡斐 (player-2), level 4, experience 130, at (3, 12), health 39, stamina 5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=145.74999999999997/159, creature-nest-2=159/159, creature-nest-3=156.13000000000002/159

```json
{
  "actions": [
    {
      "id": "action-31-player-2-478",
      "round": 31,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 3,
          "column": 12
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:31:46.262Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 134 (round 31)
- Player: 胡斐 (player-2), level 4, experience 130, at (4, 12), health 39, stamina 3
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=145.74999999999997/159, creature-nest-2=159/159, creature-nest-3=156.13000000000002/159

```json
{
  "actions": [
    {
      "id": "action-31-player-2-479",
      "round": 31,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 4,
          "column": 12
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:31:46.271Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 135 (round 31)
- Player: 胡斐 (player-2), level 4, experience 130, at (4, 13), health 39, stamina 1
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=145.74999999999997/159, creature-nest-2=159/159, creature-nest-3=156.13000000000002/159

```json
{
  "actions": [
    {
      "id": "action-31-player-2-480",
      "round": 31,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 4,
          "column": 13
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:31:46.276Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 136 (round 32)
- Player: 胡斐 (player-2), level 4, experience 132, at (4, 13), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +2
- Spawned creatures: 2
- Defeated creatures: none
- Nests: creature-nest-1=147.33999999999997/159, creature-nest-2=159/175, creature-nest-3=157.72000000000003/175

```json
{
  "actions": [
    {
      "id": "action-31-roamer-creature-1-481",
      "round": 31,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.279Z"
    },
    {
      "id": "action-31-roamer-creature-2-482",
      "round": 31,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.279Z"
    },
    {
      "id": "action-31-roamer-creature-3-483",
      "round": 31,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.279Z"
    },
    {
      "id": "action-31-roamer-creature-5-484",
      "round": 31,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.279Z"
    },
    {
      "id": "action-31-roamer-creature-6-485",
      "round": 31,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.279Z"
    },
    {
      "id": "action-31-roamer-creature-7-486",
      "round": 31,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.279Z"
    },
    {
      "id": "action-31-roamer-creature-8-487",
      "round": 31,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.279Z"
    },
    {
      "id": "action-31-nest-creature-1-488",
      "round": 31,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.279Z"
    },
    {
      "id": "action-31-nest-creature-2-489",
      "round": 31,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "target": {
          "id": "resource-point-3",
          "kind": "resource",
          "position": {
            "row": 6,
            "column": 11
          }
        },
        "reason": "與 耕田 交戰。"
      },
      "result": "succeeded",
      "reason": "與 耕田 交戰。",
      "createdAt": "2026-09-01T20:31:46.279Z"
    },
    {
      "id": "action-31-nest-creature-3-490",
      "round": 31,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.279Z"
    },
    {
      "id": "action-31-nest-creature-5-491",
      "round": 31,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.279Z"
    },
    {
      "id": "action-32-player-2-492",
      "round": 32,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:46.281Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "creature-nest-2",
      "creatureName": "生物巢穴 2",
      "message": "生物巢穴 2 生成了 Lv.4 怪物。"
    },
    {
      "creatureId": "creature-nest-3",
      "creatureName": "生物巢穴 3",
      "message": "生物巢穴 3 生成了 Lv.4 怪物。"
    }
  ],
  "spawnedCreatures": [
    {
      "id": "nest-creature-4",
      "name": "生物巢穴 2的怪物 Lv.4",
      "innerSkillId": "yellow-earth-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 3,
        "column": 3
      },
      "attributes": {
        "armStrength": 10,
        "constitution": 14,
        "agility": 9,
        "innerEnergy": 10,
        "insight": 6
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 4,
      "behaviorType": "scavenger",
      "schoolId": "yellow-earth",
      "homePosition": {
        "row": 4,
        "column": 3
      },
      "homeNestId": "creature-nest-2",
      "spawnedRound": 32,
      "baseAttributes": {
        "armStrength": 10.5,
        "constitution": 12.6,
        "agility": 8.399999999999999,
        "innerEnergy": 10.5,
        "insight": 6.3
      },
      "health": 42,
      "maxHealth": 42,
      "stamina": 9.5,
      "maxStamina": 9.5,
      "innerPower": 30,
      "maxInnerPower": 30,
      "availableAttributePoints": 0,
      "governanceRank": 1,
      "unlockedPolicyIds": [
        "basic"
      ],
      "inventory": [],
      "unlockedEquipmentDropIds": [],
      "equipmentInventory": [],
      "equipmentLoadout": {
        "weaponInstanceId": null,
        "armorInstanceId": null,
        "accessoryInstanceId": null
      },
      "innerSkillIds": [
        "tuna-gong"
      ],
      "skillProgression": {},
      "buffs": []
    },
    {
      "id": "nest-creature-6",
      "name": "生物巢穴 3的怪物 Lv.4",
      "innerSkillId": "void-spirit-inner",
      "externalSkillIds": [
        "void-spirit-external-functional"
      ],
      "equippedExternalSkillIds": [
        "void-spirit-external-functional"
      ],
      "position": {
        "row": 10,
        "column": 8
      },
      "attributes": {
        "armStrength": 9,
        "constitution": 9,
        "agility": 8,
        "innerEnergy": 8,
        "insight": 9
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 4,
      "behaviorType": "scavenger",
      "schoolId": "void-spirit",
      "homePosition": {
        "row": 11,
        "column": 8
      },
      "homeNestId": "creature-nest-3",
      "spawnedRound": 32,
      "baseAttributes": {
        "armStrength": 8.399999999999999,
        "constitution": 8.399999999999999,
        "agility": 8.399999999999999,
        "innerEnergy": 8.399999999999999,
        "insight": 8.399999999999999
      },
      "health": 27,
      "maxHealth": 27,
      "stamina": 8.5,
      "maxStamina": 8.5,
      "innerPower": 24,
      "maxInnerPower": 24,
      "availableAttributePoints": 0,
      "governanceRank": 1,
      "unlockedPolicyIds": [
        "basic"
      ],
      "inventory": [],
      "unlockedEquipmentDropIds": [],
      "equipmentInventory": [],
      "equipmentLoadout": {
        "weaponInstanceId": null,
        "armorInstanceId": null,
        "accessoryInstanceId": null
      },
      "innerSkillIds": [
        "tuna-gong"
      ],
      "skillProgression": {},
      "buffs": []
    }
  ]
}
```

### Turn 137 (round 32)
- Player: 胡斐 (player-2), level 4, experience 132, at (5, 13), health 39, stamina 9
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=147.33999999999997/159, creature-nest-2=159/175, creature-nest-3=157.72000000000003/175

```json
{
  "actions": [
    {
      "id": "action-32-player-2-493",
      "round": 32,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 13
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:31:46.291Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 138 (round 32)
- Player: 胡斐 (player-2), level 4, experience 132, at (5, 13), health 39, stamina 7
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=147.33999999999997/159, creature-nest-2=159/175, creature-nest-3=157.72000000000003/175

```json
{
  "actions": [
    {
      "id": "action-32-player-2-494",
      "round": 32,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "use-facility",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "baseId": "base-1",
        "facilityType": "mission",
        "reason": "任務：執行告示牌任務"
      },
      "result": "succeeded",
      "reason": "任務：執行告示牌任務",
      "createdAt": "2026-09-01T20:31:46.299Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 139 (round 32)
- Player: 胡斐 (player-2), level 4, experience 132, at (5, 13), health 39, stamina 5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=147.33999999999997/159, creature-nest-2=159/175, creature-nest-3=157.72000000000003/175

```json
{
  "actions": [
    {
      "id": "action-32-player-2-495",
      "round": 32,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "use-facility",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "baseId": "base-1",
        "facilityType": "mission",
        "reason": "任務：執行告示牌任務"
      },
      "result": "succeeded",
      "reason": "任務：執行告示牌任務",
      "createdAt": "2026-09-01T20:31:46.307Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 140 (round 32)
- Player: 胡斐 (player-2), level 4, experience 132, at (5, 13), health 39, stamina 3
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=147.33999999999997/159, creature-nest-2=159/175, creature-nest-3=157.72000000000003/175

```json
{
  "actions": [
    {
      "id": "action-32-player-2-496",
      "round": 32,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "use-facility",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "baseId": "base-1",
        "facilityType": "mission",
        "reason": "任務：執行告示牌任務"
      },
      "result": "succeeded",
      "reason": "任務：執行告示牌任務",
      "createdAt": "2026-09-01T20:31:46.315Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 141 (round 32)
- Player: 胡斐 (player-2), level 4, experience 132, at (5, 13), health 39, stamina 1
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=147.33999999999997/159, creature-nest-2=159/175, creature-nest-3=157.72000000000003/175

```json
{
  "actions": [
    {
      "id": "action-32-player-2-497",
      "round": 32,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "use-facility",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "baseId": "base-1",
        "facilityType": "mission",
        "reason": "任務：執行告示牌任務"
      },
      "result": "succeeded",
      "reason": "任務：執行告示牌任務",
      "createdAt": "2026-09-01T20:31:46.322Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 142 (round 33)
- Player: 胡斐 (player-2), level 4, experience 134, at (5, 13), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=148.92999999999998/159, creature-nest-2=160.75/175, creature-nest-3=159.47000000000003/175

```json
{
  "actions": [
    {
      "id": "action-32-roamer-creature-1-498",
      "round": 32,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.325Z"
    },
    {
      "id": "action-32-roamer-creature-2-499",
      "round": 32,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.325Z"
    },
    {
      "id": "action-32-roamer-creature-3-500",
      "round": 32,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.325Z"
    },
    {
      "id": "action-32-roamer-creature-5-501",
      "round": 32,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.325Z"
    },
    {
      "id": "action-32-roamer-creature-6-502",
      "round": 32,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.325Z"
    },
    {
      "id": "action-32-roamer-creature-7-503",
      "round": 32,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.325Z"
    },
    {
      "id": "action-32-roamer-creature-8-504",
      "round": 32,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.325Z"
    },
    {
      "id": "action-32-nest-creature-1-505",
      "round": 32,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.325Z"
    },
    {
      "id": "action-32-nest-creature-2-506",
      "round": 32,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "target": {
          "id": "resource-point-3",
          "kind": "resource",
          "position": {
            "row": 6,
            "column": 11
          }
        },
        "reason": "與 耕田 交戰。"
      },
      "result": "succeeded",
      "reason": "與 耕田 交戰。",
      "createdAt": "2026-09-01T20:31:46.325Z"
    },
    {
      "id": "action-32-nest-creature-3-507",
      "round": 32,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.325Z"
    },
    {
      "id": "action-32-nest-creature-5-508",
      "round": 32,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.325Z"
    },
    {
      "id": "action-32-nest-creature-4-509",
      "round": 32,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.325Z"
    },
    {
      "id": "action-32-nest-creature-6-510",
      "round": 32,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.326Z"
    },
    {
      "id": "action-33-player-2-511",
      "round": 33,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:46.326Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 143 (round 33)
- Player: 胡斐 (player-2), level 4, experience 134, at (5, 12), health 39, stamina 9
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=148.92999999999998/159, creature-nest-2=160.75/175, creature-nest-3=159.47000000000003/175

```json
{
  "actions": [
    {
      "id": "action-33-player-2-512",
      "round": 33,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 12
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:46.334Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 144 (round 33)
- Player: 胡斐 (player-2), level 4, experience 134, at (6, 12), health 39, stamina 5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=148.92999999999998/159, creature-nest-2=160.75/175, creature-nest-3=159.47000000000003/175

```json
{
  "actions": [
    {
      "id": "action-33-player-2-513",
      "round": 33,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 6,
          "column": 12
        },
        "reason": "交戰：移動到 游蕩妖物 附近"
      },
      "result": "succeeded",
      "reason": "交戰：移動到 游蕩妖物 附近",
      "createdAt": "2026-09-01T20:31:46.343Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 145 (round 33)
- Player: 胡斐 (player-2), level 4, experience 154, at (6, 12), health 39, stamina 0
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: roamer-creature-6
- Nests: creature-nest-1=148.92999999999998/159, creature-nest-2=160.75/175, creature-nest-3=159.47000000000003/175

```json
{
  "actions": [
    {
      "id": "action-33-player-2-514",
      "round": 33,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "roamer-creature-6",
          "kind": "creature",
          "position": {
            "row": 7,
            "column": 12
          }
        },
        "reason": "交戰：攻擊 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 游蕩妖物",
      "createdAt": "2026-09-01T20:31:46.347Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 146 (round 34)
- Player: 胡斐 (player-2), level 4, experience 154, at (6, 12), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=150.51999999999998/159, creature-nest-2=162.5/175, creature-nest-3=161.22000000000003/175

```json
{
  "actions": [
    {
      "id": "action-33-roamer-creature-1-515",
      "round": 33,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.347Z"
    },
    {
      "id": "action-33-roamer-creature-2-516",
      "round": 33,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.347Z"
    },
    {
      "id": "action-33-roamer-creature-3-517",
      "round": 33,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.347Z"
    },
    {
      "id": "action-33-roamer-creature-5-518",
      "round": 33,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.348Z"
    },
    {
      "id": "action-33-roamer-creature-7-519",
      "round": 33,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.348Z"
    },
    {
      "id": "action-33-roamer-creature-8-520",
      "round": 33,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.348Z"
    },
    {
      "id": "action-33-nest-creature-1-521",
      "round": 33,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.348Z"
    },
    {
      "id": "action-33-nest-creature-2-522",
      "round": 33,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "target": {
          "id": "resource-point-3",
          "kind": "resource",
          "position": {
            "row": 6,
            "column": 11
          }
        },
        "reason": "與 耕田 交戰。"
      },
      "result": "succeeded",
      "reason": "與 耕田 交戰。",
      "createdAt": "2026-09-01T20:31:46.348Z"
    },
    {
      "id": "action-33-nest-creature-3-523",
      "round": 33,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.348Z"
    },
    {
      "id": "action-33-nest-creature-5-524",
      "round": 33,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.348Z"
    },
    {
      "id": "action-33-nest-creature-4-525",
      "round": 33,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.348Z"
    },
    {
      "id": "action-33-nest-creature-6-526",
      "round": 33,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.348Z"
    },
    {
      "id": "action-34-player-2-527",
      "round": 34,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T20:31:46.349Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 147 (round 34)
- Player: 胡斐 (player-2), level 4, experience 154, at (6, 11), health 39, stamina 9
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=150.51999999999998/159, creature-nest-2=162.5/175, creature-nest-3=161.22000000000003/175

```json
{
  "actions": [
    {
      "id": "action-34-player-2-528",
      "round": 34,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 6,
          "column": 11
        },
        "reason": "交戰：移動到 生物巢穴 2的怪物 Lv.3 附近"
      },
      "result": "succeeded",
      "reason": "交戰：移動到 生物巢穴 2的怪物 Lv.3 附近",
      "createdAt": "2026-09-01T20:31:46.355Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 148 (round 34)
- Player: 胡斐 (player-2), level 4, experience 157, at (6, 11), health 39, stamina 4
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=150.51999999999998/159, creature-nest-2=162.5/175, creature-nest-3=161.22000000000003/175

```json
{
  "actions": [
    {
      "id": "action-34-player-2-529",
      "round": 34,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "nest-creature-2",
          "kind": "creature",
          "position": {
            "row": 6,
            "column": 10
          }
        },
        "reason": "交戰：攻擊 生物巢穴 2的怪物 Lv.3"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 2的怪物 Lv.3",
      "createdAt": "2026-09-01T20:31:46.362Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 149 (round 34)
- Player: 胡斐 (player-2), level 4, experience 157, at (5, 11), health 39, stamina 2
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=150.51999999999998/159, creature-nest-2=162.5/175, creature-nest-3=161.22000000000003/175

```json
{
  "actions": [
    {
      "id": "action-34-player-2-530",
      "round": 34,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:46.370Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 150 (round 34)
- Player: 胡斐 (player-2), level 4, experience 157, at (5, 12), health 39, stamina 0
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=150.51999999999998/159, creature-nest-2=162.5/175, creature-nest-3=161.22000000000003/175

```json
{
  "actions": [
    {
      "id": "action-34-player-2-531",
      "round": 34,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 12
        },
        "reason": "保命：逃離 生物巢穴 2的怪物 Lv.3（hitsSurvivable=4.333333333333333）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 2的怪物 Lv.3（hitsSurvivable=4.333333333333333）",
      "createdAt": "2026-09-01T20:31:46.374Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 151 (round 35)
- Player: 胡斐 (player-2), level 4, experience 157, at (5, 12), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=152.10999999999999/159, creature-nest-2=164.25/175, creature-nest-3=162.97000000000003/175

```json
{
  "actions": [
    {
      "id": "action-34-roamer-creature-1-532",
      "round": 34,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.375Z"
    },
    {
      "id": "action-34-roamer-creature-2-533",
      "round": 34,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.375Z"
    },
    {
      "id": "action-34-roamer-creature-3-534",
      "round": 34,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.375Z"
    },
    {
      "id": "action-34-roamer-creature-5-535",
      "round": 34,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.375Z"
    },
    {
      "id": "action-34-roamer-creature-7-536",
      "round": 34,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.375Z"
    },
    {
      "id": "action-34-roamer-creature-8-537",
      "round": 34,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.375Z"
    },
    {
      "id": "action-34-nest-creature-1-538",
      "round": 34,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.375Z"
    },
    {
      "id": "action-34-nest-creature-2-539",
      "round": 34,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "target": {
          "id": "resource-point-1",
          "kind": "resource",
          "position": {
            "row": 7,
            "column": 13
          }
        },
        "reason": "與 耕田 交戰。"
      },
      "result": "succeeded",
      "reason": "與 耕田 交戰。",
      "createdAt": "2026-09-01T20:31:46.375Z"
    },
    {
      "id": "action-34-nest-creature-3-540",
      "round": 34,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.375Z"
    },
    {
      "id": "action-34-nest-creature-5-541",
      "round": 34,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.375Z"
    },
    {
      "id": "action-34-nest-creature-4-542",
      "round": 34,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.375Z"
    },
    {
      "id": "action-34-nest-creature-6-543",
      "round": 34,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.375Z"
    },
    {
      "id": "action-35-player-2-544",
      "round": 35,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T20:31:46.376Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 152 (round 35)
- Player: 胡斐 (player-2), level 4, experience 157, at (6, 12), health 39, stamina 7
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=152.10999999999999/159, creature-nest-2=164.25/175, creature-nest-3=162.97000000000003/175

```json
{
  "actions": [
    {
      "id": "action-35-player-2-545",
      "round": 35,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 6,
          "column": 12
        },
        "reason": "交戰：移動到 生物巢穴 2的怪物 Lv.3 附近"
      },
      "result": "succeeded",
      "reason": "交戰：移動到 生物巢穴 2的怪物 Lv.3 附近",
      "createdAt": "2026-09-01T20:31:46.386Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 153 (round 35)
- Player: 胡斐 (player-2), level 5, experience 17, at (6, 12), health 39, stamina 2
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: -140 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: nest-creature-2
- Nests: creature-nest-1=152.10999999999999/159, creature-nest-2=164.25/175, creature-nest-3=162.97000000000003/175

```json
{
  "actions": [
    {
      "id": "action-35-player-2-546",
      "round": 35,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "nest-creature-2",
          "kind": "creature",
          "position": {
            "row": 7,
            "column": 12
          }
        },
        "reason": "交戰：攻擊 生物巢穴 2的怪物 Lv.3"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 2的怪物 Lv.3",
      "createdAt": "2026-09-01T20:31:46.391Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 154 (round 35)
- Player: 胡斐 (player-2), level 5, experience 17, at (6, 12), health 39, stamina 2
- Attributes: armStrength=14, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=152.10999999999999/159, creature-nest-2=164.25/175, creature-nest-3=162.97000000000003/175

```json
{
  "actions": [
    {
      "id": "action-35-player-2-547",
      "round": 35,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "allocate-attribute",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "attribute": "constitution",
        "reason": "屬性分配：提升 constitution"
      },
      "result": "succeeded",
      "reason": "屬性分配：提升 constitution",
      "createdAt": "2026-09-01T20:31:46.393Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 155 (round 35)
- Player: 胡斐 (player-2), level 5, experience 17, at (6, 12), health 39, stamina 2
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=152.10999999999999/159, creature-nest-2=164.25/175, creature-nest-3=162.97000000000003/175

```json
{
  "actions": [
    {
      "id": "action-35-player-2-548",
      "round": 35,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "allocate-attribute",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "attribute": "armStrength",
        "reason": "屬性分配：提升 armStrength"
      },
      "result": "succeeded",
      "reason": "屬性分配：提升 armStrength",
      "createdAt": "2026-09-01T20:31:46.395Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 156 (round 36)
- Player: 胡斐 (player-2), level 5, experience 21, at (6, 12), health 41.1, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=153.7/159, creature-nest-2=166/175, creature-nest-3=164.72000000000003/175

```json
{
  "actions": [
    {
      "id": "action-35-roamer-creature-1-549",
      "round": 35,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.397Z"
    },
    {
      "id": "action-35-roamer-creature-2-550",
      "round": 35,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.397Z"
    },
    {
      "id": "action-35-roamer-creature-3-551",
      "round": 35,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.397Z"
    },
    {
      "id": "action-35-roamer-creature-5-552",
      "round": 35,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.397Z"
    },
    {
      "id": "action-35-roamer-creature-7-553",
      "round": 35,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.397Z"
    },
    {
      "id": "action-35-roamer-creature-8-554",
      "round": 35,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.397Z"
    },
    {
      "id": "action-35-nest-creature-1-555",
      "round": 35,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.397Z"
    },
    {
      "id": "action-35-nest-creature-3-556",
      "round": 35,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.397Z"
    },
    {
      "id": "action-35-nest-creature-5-557",
      "round": 35,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.397Z"
    },
    {
      "id": "action-35-nest-creature-4-558",
      "round": 35,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.397Z"
    },
    {
      "id": "action-35-nest-creature-6-559",
      "round": 35,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.398Z"
    },
    {
      "id": "action-36-player-2-560",
      "round": 36,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:46.398Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 157 (round 36)
- Player: 胡斐 (player-2), level 5, experience 21, at (7, 12), health 41.1, stamina 9.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=153.7/159, creature-nest-2=166/175, creature-nest-3=164.72000000000003/175

```json
{
  "actions": [
    {
      "id": "action-36-player-2-561",
      "round": 36,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 7,
          "column": 12
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:46.404Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 158 (round 36)
- Player: 胡斐 (player-2), level 5, experience 21, at (7, 11), health 41.1, stamina 5.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=153.7/159, creature-nest-2=166/175, creature-nest-3=164.72000000000003/175

```json
{
  "actions": [
    {
      "id": "action-36-player-2-562",
      "round": 36,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 7,
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:46.409Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 159 (round 36)
- Player: 胡斐 (player-2), level 5, experience 21, at (7, 10), health 41.1, stamina 3.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=153.7/159, creature-nest-2=166/175, creature-nest-3=164.72000000000003/175

```json
{
  "actions": [
    {
      "id": "action-36-player-2-563",
      "round": 36,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 7,
          "column": 10
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:46.417Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 160 (round 36)
- Player: 胡斐 (player-2), level 5, experience 21, at (6, 10), health 41.1, stamina 1.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=153.7/159, creature-nest-2=166/175, creature-nest-3=164.72000000000003/175

```json
{
  "actions": [
    {
      "id": "action-36-player-2-564",
      "round": 36,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 6,
          "column": 10
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:46.424Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 161 (round 37)
- Player: 胡斐 (player-2), level 5, experience 24, at (6, 10), health 42, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +3
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=155.29/159, creature-nest-2=167.75/193, creature-nest-3=166.47000000000003/175

```json
{
  "actions": [
    {
      "id": "action-36-roamer-creature-1-565",
      "round": 36,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.426Z"
    },
    {
      "id": "action-36-roamer-creature-2-566",
      "round": 36,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.426Z"
    },
    {
      "id": "action-36-roamer-creature-3-567",
      "round": 36,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.426Z"
    },
    {
      "id": "action-36-roamer-creature-5-568",
      "round": 36,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.426Z"
    },
    {
      "id": "action-36-roamer-creature-7-569",
      "round": 36,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.426Z"
    },
    {
      "id": "action-36-roamer-creature-8-570",
      "round": 36,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.426Z"
    },
    {
      "id": "action-36-nest-creature-1-571",
      "round": 36,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.426Z"
    },
    {
      "id": "action-36-nest-creature-3-572",
      "round": 36,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.426Z"
    },
    {
      "id": "action-36-nest-creature-5-573",
      "round": 36,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.426Z"
    },
    {
      "id": "action-36-nest-creature-4-574",
      "round": 36,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.426Z"
    },
    {
      "id": "action-36-nest-creature-6-575",
      "round": 36,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.426Z"
    },
    {
      "id": "action-37-player-2-576",
      "round": 37,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:46.427Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "creature-nest-2",
      "creatureName": "生物巢穴 2",
      "message": "生物巢穴 2 生成了 Lv.5 怪物。"
    }
  ],
  "spawnedCreatures": [
    {
      "id": "nest-creature-2",
      "name": "生物巢穴 2的怪物 Lv.5",
      "innerSkillId": "yellow-earth-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 4,
        "column": 4
      },
      "attributes": {
        "armStrength": 12,
        "constitution": 17,
        "agility": 10,
        "innerEnergy": 12,
        "insight": 7
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 5,
      "behaviorType": "scavenger",
      "schoolId": "yellow-earth",
      "homePosition": {
        "row": 4,
        "column": 3
      },
      "homeNestId": "creature-nest-2",
      "spawnedRound": 37,
      "baseAttributes": {
        "armStrength": 12.6,
        "constitution": 15.399999999999999,
        "agility": 9.799999999999999,
        "innerEnergy": 12.6,
        "insight": 7
      },
      "health": 51,
      "maxHealth": 51,
      "stamina": 11,
      "maxStamina": 11,
      "innerPower": 36,
      "maxInnerPower": 36,
      "availableAttributePoints": 0,
      "governanceRank": 1,
      "unlockedPolicyIds": [
        "basic"
      ],
      "inventory": [],
      "unlockedEquipmentDropIds": [],
      "equipmentInventory": [],
      "equipmentLoadout": {
        "weaponInstanceId": null,
        "armorInstanceId": null,
        "accessoryInstanceId": null
      },
      "innerSkillIds": [
        "tuna-gong"
      ],
      "skillProgression": {},
      "buffs": []
    }
  ]
}
```

### Turn 162 (round 37)
- Player: 胡斐 (player-2), level 5, experience 24, at (5, 10), health 42, stamina 9.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=155.29/159, creature-nest-2=167.75/193, creature-nest-3=166.47000000000003/175

```json
{
  "actions": [
    {
      "id": "action-37-player-2-577",
      "round": 37,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 10
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:46.435Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 163 (round 37)
- Player: 胡斐 (player-2), level 5, experience 24, at (4, 10), health 42, stamina 4.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=155.29/159, creature-nest-2=167.75/193, creature-nest-3=166.47000000000003/175

```json
{
  "actions": [
    {
      "id": "action-37-player-2-578",
      "round": 37,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 4,
          "column": 10
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:46.441Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 164 (round 37)
- Player: 胡斐 (player-2), level 5, experience 24, at (5, 10), health 42, stamina 2.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=155.29/159, creature-nest-2=167.75/193, creature-nest-3=166.47000000000003/175

```json
{
  "actions": [
    {
      "id": "action-37-player-2-579",
      "round": 37,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 10
        },
        "reason": "定位：前往出口 (5,10)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (5,10)",
      "createdAt": "2026-09-01T20:31:46.449Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 165 (round 37)
- Player: 胡斐 (player-2), level 5, experience 24, at (5, 11), health 42, stamina 0.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=155.29/159, creature-nest-2=167.75/193, creature-nest-3=166.47000000000003/175

```json
{
  "actions": [
    {
      "id": "action-37-player-2-580",
      "round": 37,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 11
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:31:46.454Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 166 (round 38)
- Player: 胡斐 (player-2), level 5, experience 25, at (5, 11), health 42, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=156.88/159, creature-nest-2=169.68/193, creature-nest-3=168.22000000000003/175

```json
{
  "actions": [
    {
      "id": "action-37-roamer-creature-1-581",
      "round": 37,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.456Z"
    },
    {
      "id": "action-37-roamer-creature-2-582",
      "round": 37,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.456Z"
    },
    {
      "id": "action-37-roamer-creature-3-583",
      "round": 37,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.456Z"
    },
    {
      "id": "action-37-roamer-creature-5-584",
      "round": 37,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.456Z"
    },
    {
      "id": "action-37-roamer-creature-7-585",
      "round": 37,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.456Z"
    },
    {
      "id": "action-37-roamer-creature-8-586",
      "round": 37,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.456Z"
    },
    {
      "id": "action-37-nest-creature-1-587",
      "round": 37,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.456Z"
    },
    {
      "id": "action-37-nest-creature-3-588",
      "round": 37,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.456Z"
    },
    {
      "id": "action-37-nest-creature-5-589",
      "round": 37,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.456Z"
    },
    {
      "id": "action-37-nest-creature-4-590",
      "round": 37,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.456Z"
    },
    {
      "id": "action-37-nest-creature-6-591",
      "round": 37,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.456Z"
    },
    {
      "id": "action-37-nest-creature-2-592",
      "round": 37,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.5"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.456Z"
    },
    {
      "id": "action-38-player-2-593",
      "round": 38,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:46.457Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 167 (round 38)
- Player: 胡斐 (player-2), level 5, experience 25, at (5, 12), health 42, stamina 9.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=156.88/159, creature-nest-2=169.68/193, creature-nest-3=168.22000000000003/175

```json
{
  "actions": [
    {
      "id": "action-38-player-2-594",
      "round": 38,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 12
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:46.462Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 168 (round 38)
- Player: 胡斐 (player-2), level 5, experience 25, at (4, 12), health 42, stamina 7.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=156.88/159, creature-nest-2=169.68/193, creature-nest-3=168.22000000000003/175

```json
{
  "actions": [
    {
      "id": "action-38-player-2-595",
      "round": 38,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 4,
          "column": 12
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:46.469Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 169 (round 38)
- Player: 胡斐 (player-2), level 5, experience 25, at (3, 12), health 42, stamina 5.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=156.88/159, creature-nest-2=169.68/193, creature-nest-3=168.22000000000003/175

```json
{
  "actions": [
    {
      "id": "action-38-player-2-596",
      "round": 38,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 3,
          "column": 12
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:46.475Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 170 (round 38)
- Player: 胡斐 (player-2), level 5, experience 25, at (3, 11), health 42, stamina 3.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=156.88/159, creature-nest-2=169.68/193, creature-nest-3=168.22000000000003/175

```json
{
  "actions": [
    {
      "id": "action-38-player-2-597",
      "round": 38,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 3,
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:31:46.483Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 171 (round 38)
- Player: 胡斐 (player-2), level 5, experience 25, at (3, 11), health 42, stamina 0.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=156.88/159, creature-nest-2=169.68/193, creature-nest-3=168.22000000000003/175

```json
{
  "actions": [
    {
      "id": "action-38-player-2-598",
      "round": 38,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "learn-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-2",
        "skillType": "inner",
        "skillId": "swift-wind-inner",
        "reason": "學招：學習門派功法 追風吐納"
      },
      "result": "succeeded",
      "reason": "學招：學習門派功法 追風吐納",
      "createdAt": "2026-09-01T20:31:46.491Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 172 (round 39)
- Player: 胡斐 (player-2), level 5, experience 26, at (3, 11), health 42, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +1
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=158.47/175, creature-nest-2=171.61/193, creature-nest-3=169.97000000000003/175

```json
{
  "actions": [
    {
      "id": "action-38-roamer-creature-1-599",
      "round": 38,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.494Z"
    },
    {
      "id": "action-38-roamer-creature-2-600",
      "round": 38,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.494Z"
    },
    {
      "id": "action-38-roamer-creature-3-601",
      "round": 38,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.494Z"
    },
    {
      "id": "action-38-roamer-creature-5-602",
      "round": 38,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.494Z"
    },
    {
      "id": "action-38-roamer-creature-7-603",
      "round": 38,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.494Z"
    },
    {
      "id": "action-38-roamer-creature-8-604",
      "round": 38,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.494Z"
    },
    {
      "id": "action-38-nest-creature-1-605",
      "round": 38,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.494Z"
    },
    {
      "id": "action-38-nest-creature-3-606",
      "round": 38,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.494Z"
    },
    {
      "id": "action-38-nest-creature-5-607",
      "round": 38,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "destination": {
          "row": 7,
          "column": 10
        },
        "reason": "移動接近 襄陽。"
      },
      "result": "succeeded",
      "reason": "移動接近 襄陽。",
      "createdAt": "2026-09-01T20:31:46.494Z"
    },
    {
      "id": "action-38-nest-creature-4-608",
      "round": 38,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.494Z"
    },
    {
      "id": "action-38-nest-creature-6-609",
      "round": 38,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.494Z"
    },
    {
      "id": "action-38-nest-creature-2-610",
      "round": 38,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.5"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 4,
          "column": 8
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-01T20:31:46.494Z"
    },
    {
      "id": "action-39-player-2-611",
      "round": 39,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:46.495Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "creature-nest-1",
      "creatureName": "生物巢穴 1",
      "message": "生物巢穴 1 生成了 Lv.4 怪物。"
    }
  ],
  "spawnedCreatures": [
    {
      "id": "nest-creature-7",
      "name": "生物巢穴 1的怪物 Lv.4",
      "innerSkillId": "void-spirit-inner",
      "externalSkillIds": [
        "void-spirit-external-functional"
      ],
      "equippedExternalSkillIds": [
        "void-spirit-external-functional"
      ],
      "position": {
        "row": 12,
        "column": 2
      },
      "attributes": {
        "armStrength": 9,
        "constitution": 9,
        "agility": 8,
        "innerEnergy": 8,
        "insight": 9
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 4,
      "behaviorType": "sieger",
      "schoolId": "void-spirit",
      "homePosition": {
        "row": 13,
        "column": 2
      },
      "homeNestId": "creature-nest-1",
      "spawnedRound": 39,
      "baseAttributes": {
        "armStrength": 8.399999999999999,
        "constitution": 8.399999999999999,
        "agility": 8.399999999999999,
        "innerEnergy": 8.399999999999999,
        "insight": 8.399999999999999
      },
      "health": 27,
      "maxHealth": 27,
      "stamina": 8.5,
      "maxStamina": 8.5,
      "innerPower": 24,
      "maxInnerPower": 24,
      "availableAttributePoints": 0,
      "governanceRank": 1,
      "unlockedPolicyIds": [
        "basic"
      ],
      "inventory": [],
      "unlockedEquipmentDropIds": [],
      "equipmentInventory": [],
      "equipmentLoadout": {
        "weaponInstanceId": null,
        "armorInstanceId": null,
        "accessoryInstanceId": null
      },
      "innerSkillIds": [
        "tuna-gong"
      ],
      "skillProgression": {},
      "buffs": []
    }
  ]
}
```

### Turn 173 (round 39)
- Player: 胡斐 (player-2), level 5, experience 26, at (3, 11), health 42, stamina 8.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=158.47/175, creature-nest-2=171.61/193, creature-nest-3=169.97000000000003/175

```json
{
  "actions": [
    {
      "id": "action-39-player-2-612",
      "round": 39,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "learn-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-2",
        "skillType": "external",
        "skillId": "swift-wind-external-damage",
        "reason": "學招：學習門派功法 追風腿"
      },
      "result": "succeeded",
      "reason": "學招：學習門派功法 追風腿",
      "createdAt": "2026-09-01T20:31:46.502Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 174 (round 39)
- Player: 胡斐 (player-2), level 5, experience 26, at (3, 11), health 42, stamina 5.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=158.47/175, creature-nest-2=171.61/193, creature-nest-3=169.97000000000003/175

```json
{
  "actions": [
    {
      "id": "action-39-player-2-613",
      "round": 39,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "learn-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-2",
        "skillType": "external",
        "skillId": "swift-wind-external-functional",
        "reason": "學招：學習門派功法 疾行"
      },
      "result": "succeeded",
      "reason": "學招：學習門派功法 疾行",
      "createdAt": "2026-09-01T20:31:46.510Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 175 (round 39)
- Player: 胡斐 (player-2), level 5, experience 26, at (3, 11), health 42, stamina 2.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=158.47/175, creature-nest-2=171.61/193, creature-nest-3=169.97000000000003/175

```json
{
  "actions": [
    {
      "id": "action-39-player-2-614",
      "round": 39,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "learn-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-2",
        "skillType": "external",
        "skillId": "swift-wind-external-functional-2",
        "reason": "學招：學習門派功法 林間步"
      },
      "result": "succeeded",
      "reason": "學招：學習門派功法 林間步",
      "createdAt": "2026-09-01T20:31:46.517Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 176 (round 39)
- Player: 胡斐 (player-2), level 5, experience 26, at (2, 11), health 42, stamina 0.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=158.47/175, creature-nest-2=171.61/193, creature-nest-3=169.97000000000003/175

```json
{
  "actions": [
    {
      "id": "action-39-player-2-615",
      "round": 39,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 11
        },
        "reason": "定位：前往出口 (2,11)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (2,11)",
      "createdAt": "2026-09-01T20:31:46.524Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 177 (round 40)
- Player: 胡斐 (player-2), level 5, experience 27, at (2, 11), health 42, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=160.22/175, creature-nest-2=173.54000000000002/193, creature-nest-3=171.72000000000003/175

```json
{
  "actions": [
    {
      "id": "action-39-roamer-creature-1-616",
      "round": 39,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.527Z"
    },
    {
      "id": "action-39-roamer-creature-2-617",
      "round": 39,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.527Z"
    },
    {
      "id": "action-39-roamer-creature-3-618",
      "round": 39,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.527Z"
    },
    {
      "id": "action-39-roamer-creature-5-619",
      "round": 39,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.527Z"
    },
    {
      "id": "action-39-roamer-creature-7-620",
      "round": 39,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.527Z"
    },
    {
      "id": "action-39-roamer-creature-8-621",
      "round": 39,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.527Z"
    },
    {
      "id": "action-39-nest-creature-1-622",
      "round": 39,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.527Z"
    },
    {
      "id": "action-39-nest-creature-3-623",
      "round": 39,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.527Z"
    },
    {
      "id": "action-39-nest-creature-5-624",
      "round": 39,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 11
        },
        "reason": "移動接近 襄陽。"
      },
      "result": "succeeded",
      "reason": "移動接近 襄陽。",
      "createdAt": "2026-09-01T20:31:46.527Z"
    },
    {
      "id": "action-39-nest-creature-4-625",
      "round": 39,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.528Z"
    },
    {
      "id": "action-39-nest-creature-6-626",
      "round": 39,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.528Z"
    },
    {
      "id": "action-39-nest-creature-2-627",
      "round": 39,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.5"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 8
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.528Z"
    },
    {
      "id": "action-39-nest-creature-7-628",
      "round": 39,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.528Z"
    },
    {
      "id": "action-40-player-2-629",
      "round": 40,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:46.528Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 178 (round 40)
- Player: 胡斐 (player-2), level 5, experience 27, at (2, 12), health 42, stamina 9.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=160.22/175, creature-nest-2=173.54000000000002/193, creature-nest-3=171.72000000000003/175

```json
{
  "actions": [
    {
      "id": "action-40-player-2-630",
      "round": 40,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 12
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:31:46.536Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 179 (round 40)
- Player: 胡斐 (player-2), level 5, experience 27, at (2, 13), health 42, stamina 7.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=160.22/175, creature-nest-2=173.54000000000002/193, creature-nest-3=171.72000000000003/175

```json
{
  "actions": [
    {
      "id": "action-40-player-2-631",
      "round": 40,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 13
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:31:46.542Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 180 (round 40)
- Player: 胡斐 (player-2), level 5, experience 27, at (3, 13), health 42, stamina 5.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=160.22/175, creature-nest-2=173.54000000000002/193, creature-nest-3=171.72000000000003/175

```json
{
  "actions": [
    {
      "id": "action-40-player-2-632",
      "round": 40,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 3,
          "column": 13
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:31:46.549Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 181 (round 40)
- Player: 胡斐 (player-2), level 5, experience 27, at (4, 13), health 42, stamina 3.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=160.22/175, creature-nest-2=173.54000000000002/193, creature-nest-3=171.72000000000003/175

```json
{
  "actions": [
    {
      "id": "action-40-player-2-633",
      "round": 40,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 4,
          "column": 13
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:31:46.556Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 182 (round 40)
- Player: 胡斐 (player-2), level 5, experience 27, at (5, 13), health 42, stamina 1.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=160.22/175, creature-nest-2=173.54000000000002/193, creature-nest-3=171.72000000000003/175

```json
{
  "actions": [
    {
      "id": "action-40-player-2-634",
      "round": 40,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 13
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:31:46.563Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 183 (round 41)
- Player: 胡斐 (player-2), level 5, experience 30, at (5, 13), health 42, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=161.97/175, creature-nest-2=175.47000000000003/193, creature-nest-3=173.47000000000003/175

```json
{
  "actions": [
    {
      "id": "action-40-roamer-creature-1-635",
      "round": 40,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.566Z"
    },
    {
      "id": "action-40-roamer-creature-2-636",
      "round": 40,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.566Z"
    },
    {
      "id": "action-40-roamer-creature-3-637",
      "round": 40,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.566Z"
    },
    {
      "id": "action-40-roamer-creature-5-638",
      "round": 40,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.566Z"
    },
    {
      "id": "action-40-roamer-creature-7-639",
      "round": 40,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.566Z"
    },
    {
      "id": "action-40-roamer-creature-8-640",
      "round": 40,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.567Z"
    },
    {
      "id": "action-40-nest-creature-1-641",
      "round": 40,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.567Z"
    },
    {
      "id": "action-40-nest-creature-3-642",
      "round": 40,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.567Z"
    },
    {
      "id": "action-40-nest-creature-5-643",
      "round": 40,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "target": {
          "id": "base-1",
          "kind": "base",
          "position": {
            "row": 6,
            "column": 13
          }
        },
        "reason": "與 襄陽 交戰。"
      },
      "result": "succeeded",
      "reason": "與 襄陽 交戰。",
      "createdAt": "2026-09-01T20:31:46.567Z"
    },
    {
      "id": "action-40-nest-creature-4-644",
      "round": 40,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.567Z"
    },
    {
      "id": "action-40-nest-creature-6-645",
      "round": 40,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-6",
          "kind": "creature"
        },
        "target": {
          "id": "resource-point-1",
          "kind": "resource",
          "position": {
            "row": 7,
            "column": 13
          }
        },
        "reason": "與 耕田 交戰。"
      },
      "result": "succeeded",
      "reason": "與 耕田 交戰。",
      "createdAt": "2026-09-01T20:31:46.567Z"
    },
    {
      "id": "action-40-nest-creature-2-646",
      "round": 40,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.5"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 4,
          "column": 8
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.567Z"
    },
    {
      "id": "action-40-nest-creature-7-647",
      "round": 40,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.567Z"
    },
    {
      "id": "action-41-player-2-648",
      "round": 41,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:46.567Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-5",
      "creatureName": "生物巢穴 1的怪物 Lv.3",
      "message": "生物巢穴 1的怪物 Lv.3 攻擊襄陽，造成 6 點傷害。"
    },
    {
      "creatureId": "nest-creature-6",
      "creatureName": "生物巢穴 3的怪物 Lv.4",
      "message": "生物巢穴 3的怪物 Lv.4 攻擊耕田，造成 7 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 184 (round 41)
- Player: 胡斐 (player-2), level 5, experience 30, at (5, 13), health 42, stamina 9.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=161.97/175, creature-nest-2=175.47000000000003/193, creature-nest-3=173.47000000000003/175

```json
{
  "actions": [
    {
      "id": "action-41-player-2-649",
      "round": 41,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "use-facility",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "baseId": "base-1",
        "facilityType": "mission",
        "reason": "任務：執行告示牌任務"
      },
      "result": "succeeded",
      "reason": "任務：執行告示牌任務",
      "createdAt": "2026-09-01T20:31:46.574Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 185 (round 41)
- Player: 胡斐 (player-2), level 5, experience 30, at (5, 13), health 42, stamina 7.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=161.97/175, creature-nest-2=175.47000000000003/193, creature-nest-3=173.47000000000003/175

```json
{
  "actions": [
    {
      "id": "action-41-player-2-650",
      "round": 41,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "use-facility",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "baseId": "base-1",
        "facilityType": "mission",
        "reason": "任務：執行告示牌任務"
      },
      "result": "succeeded",
      "reason": "任務：執行告示牌任務",
      "createdAt": "2026-09-01T20:31:46.580Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 186 (round 41)
- Player: 胡斐 (player-2), level 5, experience 30, at (5, 13), health 42, stamina 5.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=161.97/175, creature-nest-2=175.47000000000003/193, creature-nest-3=173.47000000000003/175

```json
{
  "actions": [
    {
      "id": "action-41-player-2-651",
      "round": 41,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "use-facility",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "baseId": "base-1",
        "facilityType": "mission",
        "reason": "任務：執行告示牌任務"
      },
      "result": "succeeded",
      "reason": "任務：執行告示牌任務",
      "createdAt": "2026-09-01T20:31:46.587Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 187 (round 41)
- Player: 胡斐 (player-2), level 5, experience 30, at (5, 13), health 42, stamina 3.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=161.97/175, creature-nest-2=175.47000000000003/193, creature-nest-3=173.47000000000003/175

```json
{
  "actions": [
    {
      "id": "action-41-player-2-652",
      "round": 41,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "use-facility",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "baseId": "base-1",
        "facilityType": "mission",
        "reason": "任務：執行告示牌任務"
      },
      "result": "succeeded",
      "reason": "任務：執行告示牌任務",
      "createdAt": "2026-09-01T20:31:46.594Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 188 (round 41)
- Player: 胡斐 (player-2), level 5, experience 30, at (5, 13), health 42, stamina 1.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=161.97/175, creature-nest-2=175.47000000000003/193, creature-nest-3=173.47000000000003/175

```json
{
  "actions": [
    {
      "id": "action-41-player-2-653",
      "round": 41,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "use-facility",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "baseId": "base-1",
        "facilityType": "mission",
        "reason": "任務：執行告示牌任務"
      },
      "result": "succeeded",
      "reason": "任務：執行告示牌任務",
      "createdAt": "2026-09-01T20:31:46.600Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 189 (round 42)
- Player: 胡斐 (player-2), level 5, experience 33, at (5, 13), health 42, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +3
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=163.72/175, creature-nest-2=177.40000000000003/193, creature-nest-3=175/193

```json
{
  "actions": [
    {
      "id": "action-41-roamer-creature-1-654",
      "round": 41,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.603Z"
    },
    {
      "id": "action-41-roamer-creature-2-655",
      "round": 41,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.603Z"
    },
    {
      "id": "action-41-roamer-creature-3-656",
      "round": 41,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.603Z"
    },
    {
      "id": "action-41-roamer-creature-5-657",
      "round": 41,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.603Z"
    },
    {
      "id": "action-41-roamer-creature-7-658",
      "round": 41,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.603Z"
    },
    {
      "id": "action-41-roamer-creature-8-659",
      "round": 41,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.603Z"
    },
    {
      "id": "action-41-nest-creature-1-660",
      "round": 41,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.603Z"
    },
    {
      "id": "action-41-nest-creature-3-661",
      "round": 41,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.603Z"
    },
    {
      "id": "action-41-nest-creature-5-662",
      "round": 41,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "target": {
          "id": "base-1",
          "kind": "base",
          "position": {
            "row": 6,
            "column": 13
          }
        },
        "reason": "與 襄陽 交戰。"
      },
      "result": "succeeded",
      "reason": "與 襄陽 交戰。",
      "createdAt": "2026-09-01T20:31:46.603Z"
    },
    {
      "id": "action-41-nest-creature-4-663",
      "round": 41,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.603Z"
    },
    {
      "id": "action-41-nest-creature-6-664",
      "round": 41,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-6",
          "kind": "creature"
        },
        "target": {
          "id": "resource-point-1",
          "kind": "resource",
          "position": {
            "row": 7,
            "column": 13
          }
        },
        "reason": "與 耕田 交戰。"
      },
      "result": "succeeded",
      "reason": "與 耕田 交戰。",
      "createdAt": "2026-09-01T20:31:46.603Z"
    },
    {
      "id": "action-41-nest-creature-2-665",
      "round": 41,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.5"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 8
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.603Z"
    },
    {
      "id": "action-41-nest-creature-7-666",
      "round": 41,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.604Z"
    },
    {
      "id": "action-42-player-2-667",
      "round": 42,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:46.604Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "creature-nest-3",
      "creatureName": "生物巢穴 3",
      "message": "生物巢穴 3 生成了 Lv.5 怪物。"
    }
  ],
  "spawnedCreatures": [
    {
      "id": "nest-creature-8",
      "name": "生物巢穴 3的怪物 Lv.5",
      "innerSkillId": "void-spirit-inner",
      "externalSkillIds": [
        "void-spirit-external-functional"
      ],
      "equippedExternalSkillIds": [
        "void-spirit-external-functional"
      ],
      "position": {
        "row": 10,
        "column": 8
      },
      "attributes": {
        "armStrength": 10,
        "constitution": 10,
        "agility": 9,
        "innerEnergy": 9,
        "insight": 10
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 5,
      "behaviorType": "scavenger",
      "schoolId": "void-spirit",
      "homePosition": {
        "row": 11,
        "column": 8
      },
      "homeNestId": "creature-nest-3",
      "spawnedRound": 42,
      "baseAttributes": {
        "armStrength": 9.799999999999999,
        "constitution": 9.799999999999999,
        "agility": 9.799999999999999,
        "innerEnergy": 9.799999999999999,
        "insight": 9.799999999999999
      },
      "health": 30,
      "maxHealth": 30,
      "stamina": 9.5,
      "maxStamina": 9.5,
      "innerPower": 27,
      "maxInnerPower": 27,
      "availableAttributePoints": 0,
      "governanceRank": 1,
      "unlockedPolicyIds": [
        "basic"
      ],
      "inventory": [],
      "unlockedEquipmentDropIds": [],
      "equipmentInventory": [],
      "equipmentLoadout": {
        "weaponInstanceId": null,
        "armorInstanceId": null,
        "accessoryInstanceId": null
      },
      "innerSkillIds": [
        "tuna-gong"
      ],
      "skillProgression": {},
      "buffs": []
    }
  ]
}
```

### Turn 190 (round 42)
- Player: 胡斐 (player-2), level 5, experience 33, at (5, 13), health 42, stamina 9.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=163.72/175, creature-nest-2=177.40000000000003/193, creature-nest-3=175/193

```json
{
  "actions": [
    {
      "id": "action-42-player-2-668",
      "round": 42,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "use-facility",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "baseId": "base-1",
        "facilityType": "mission",
        "reason": "任務：執行告示牌任務"
      },
      "result": "succeeded",
      "reason": "任務：執行告示牌任務",
      "createdAt": "2026-09-01T20:31:46.610Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 191 (round 42)
- Player: 胡斐 (player-2), level 5, experience 33, at (5, 13), health 42, stamina 7.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=163.72/175, creature-nest-2=177.40000000000003/193, creature-nest-3=175/193

```json
{
  "actions": [
    {
      "id": "action-42-player-2-669",
      "round": 42,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "use-facility",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "baseId": "base-1",
        "facilityType": "mission",
        "reason": "任務：執行告示牌任務"
      },
      "result": "succeeded",
      "reason": "任務：執行告示牌任務",
      "createdAt": "2026-09-01T20:31:46.617Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 192 (round 42)
- Player: 胡斐 (player-2), level 5, experience 33, at (5, 13), health 42, stamina 5.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=163.72/175, creature-nest-2=177.40000000000003/193, creature-nest-3=175/193

```json
{
  "actions": [
    {
      "id": "action-42-player-2-670",
      "round": 42,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "use-facility",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "baseId": "base-1",
        "facilityType": "mission",
        "reason": "任務：執行告示牌任務"
      },
      "result": "succeeded",
      "reason": "任務：執行告示牌任務",
      "createdAt": "2026-09-01T20:31:46.624Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 193 (round 42)
- Player: 胡斐 (player-2), level 5, experience 33, at (5, 13), health 42, stamina 3.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=163.72/175, creature-nest-2=177.40000000000003/193, creature-nest-3=175/193

```json
{
  "actions": [
    {
      "id": "action-42-player-2-671",
      "round": 42,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "use-facility",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "baseId": "base-1",
        "facilityType": "mission",
        "reason": "任務：執行告示牌任務"
      },
      "result": "succeeded",
      "reason": "任務：執行告示牌任務",
      "createdAt": "2026-09-01T20:31:46.630Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 194 (round 42)
- Player: 胡斐 (player-2), level 5, experience 33, at (5, 13), health 42, stamina 1.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=163.72/175, creature-nest-2=177.40000000000003/193, creature-nest-3=175/193

```json
{
  "actions": [
    {
      "id": "action-42-player-2-672",
      "round": 42,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "use-facility",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "baseId": "base-1",
        "facilityType": "mission",
        "reason": "任務：執行告示牌任務"
      },
      "result": "succeeded",
      "reason": "任務：執行告示牌任務",
      "createdAt": "2026-09-01T20:31:46.637Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 195 (round 43)
- Player: 胡斐 (player-2), level 5, experience 36, at (5, 13), health 42, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=165.47/175, creature-nest-2=179.33000000000004/193, creature-nest-3=176.93/193

```json
{
  "actions": [
    {
      "id": "action-42-roamer-creature-1-673",
      "round": 42,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.640Z"
    },
    {
      "id": "action-42-roamer-creature-2-674",
      "round": 42,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.640Z"
    },
    {
      "id": "action-42-roamer-creature-3-675",
      "round": 42,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.640Z"
    },
    {
      "id": "action-42-roamer-creature-5-676",
      "round": 42,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.640Z"
    },
    {
      "id": "action-42-roamer-creature-7-677",
      "round": 42,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.640Z"
    },
    {
      "id": "action-42-roamer-creature-8-678",
      "round": 42,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.640Z"
    },
    {
      "id": "action-42-nest-creature-1-679",
      "round": 42,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.640Z"
    },
    {
      "id": "action-42-nest-creature-3-680",
      "round": 42,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.640Z"
    },
    {
      "id": "action-42-nest-creature-5-681",
      "round": 42,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "target": {
          "id": "base-1",
          "kind": "base",
          "position": {
            "row": 6,
            "column": 13
          }
        },
        "reason": "與 襄陽 交戰。"
      },
      "result": "succeeded",
      "reason": "與 襄陽 交戰。",
      "createdAt": "2026-09-01T20:31:46.640Z"
    },
    {
      "id": "action-42-nest-creature-4-682",
      "round": 42,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.640Z"
    },
    {
      "id": "action-42-nest-creature-6-683",
      "round": 42,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-6",
          "kind": "creature"
        },
        "target": {
          "id": "resource-point-1",
          "kind": "resource",
          "position": {
            "row": 7,
            "column": 13
          }
        },
        "reason": "與 耕田 交戰。"
      },
      "result": "succeeded",
      "reason": "與 耕田 交戰。",
      "createdAt": "2026-09-01T20:31:46.640Z"
    },
    {
      "id": "action-42-nest-creature-2-684",
      "round": 42,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.5"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 4,
          "column": 8
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.640Z"
    },
    {
      "id": "action-42-nest-creature-7-685",
      "round": 42,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.640Z"
    },
    {
      "id": "action-42-nest-creature-8-686",
      "round": 42,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.5"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.641Z"
    },
    {
      "id": "action-43-player-2-687",
      "round": 43,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:46.641Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 196 (round 43)
- Player: 胡斐 (player-2), level 5, experience 36, at (5, 12), health 42, stamina 9.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=165.47/175, creature-nest-2=179.33000000000004/193, creature-nest-3=176.93/193

```json
{
  "actions": [
    {
      "id": "action-43-player-2-688",
      "round": 43,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 12
        },
        "reason": "交戰：移動到 生物巢穴 1的怪物 Lv.3 附近"
      },
      "result": "succeeded",
      "reason": "交戰：移動到 生物巢穴 1的怪物 Lv.3 附近",
      "createdAt": "2026-09-01T20:31:46.648Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 197 (round 43)
- Player: 胡斐 (player-2), level 5, experience 39, at (5, 12), health 42, stamina 4.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=165.47/175, creature-nest-2=179.33000000000004/193, creature-nest-3=176.93/193

```json
{
  "actions": [
    {
      "id": "action-43-player-2-689",
      "round": 43,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "nest-creature-5",
          "kind": "creature",
          "position": {
            "row": 6,
            "column": 12
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.3"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.3",
      "createdAt": "2026-09-01T20:31:46.655Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 198 (round 43)
- Player: 胡斐 (player-2), level 5, experience 39, at (4, 12), health 42, stamina 2.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=165.47/175, creature-nest-2=179.33000000000004/193, creature-nest-3=176.93/193

```json
{
  "actions": [
    {
      "id": "action-43-player-2-690",
      "round": 43,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 4,
          "column": 12
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T20:31:46.661Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 199 (round 43)
- Player: 胡斐 (player-2), level 5, experience 39, at (3, 12), health 42, stamina 0.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=165.47/175, creature-nest-2=179.33000000000004/193, creature-nest-3=176.93/193

```json
{
  "actions": [
    {
      "id": "action-43-player-2-691",
      "round": 43,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 3,
          "column": 12
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:31:46.667Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 200 (round 44)
- Player: 胡斐 (player-2), level 5, experience 40, at (3, 12), health 42, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=167.22/175, creature-nest-2=181.26000000000005/193, creature-nest-3=178.86/193

```json
{
  "actions": [
    {
      "id": "action-43-roamer-creature-1-692",
      "round": 43,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.670Z"
    },
    {
      "id": "action-43-roamer-creature-2-693",
      "round": 43,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.670Z"
    },
    {
      "id": "action-43-roamer-creature-3-694",
      "round": 43,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.670Z"
    },
    {
      "id": "action-43-roamer-creature-5-695",
      "round": 43,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.670Z"
    },
    {
      "id": "action-43-roamer-creature-7-696",
      "round": 43,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.670Z"
    },
    {
      "id": "action-43-roamer-creature-8-697",
      "round": 43,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.670Z"
    },
    {
      "id": "action-43-nest-creature-1-698",
      "round": 43,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.670Z"
    },
    {
      "id": "action-43-nest-creature-3-699",
      "round": 43,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.670Z"
    },
    {
      "id": "action-43-nest-creature-5-700",
      "round": 43,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "target": {
          "id": "base-1",
          "kind": "base",
          "position": {
            "row": 6,
            "column": 13
          }
        },
        "reason": "與 襄陽 交戰。"
      },
      "result": "succeeded",
      "reason": "與 襄陽 交戰。",
      "createdAt": "2026-09-01T20:31:46.670Z"
    },
    {
      "id": "action-43-nest-creature-4-701",
      "round": 43,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.670Z"
    },
    {
      "id": "action-43-nest-creature-6-702",
      "round": 43,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-6",
          "kind": "creature"
        },
        "target": {
          "id": "resource-point-1",
          "kind": "resource",
          "position": {
            "row": 7,
            "column": 13
          }
        },
        "reason": "與 耕田 交戰。"
      },
      "result": "succeeded",
      "reason": "與 耕田 交戰。",
      "createdAt": "2026-09-01T20:31:46.670Z"
    },
    {
      "id": "action-43-nest-creature-2-703",
      "round": 43,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.5"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 8
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T20:31:46.670Z"
    },
    {
      "id": "action-43-nest-creature-7-704",
      "round": 43,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.670Z"
    },
    {
      "id": "action-43-nest-creature-8-705",
      "round": 43,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.5"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:31:46.670Z"
    },
    {
      "id": "action-44-player-2-706",
      "round": 44,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:31:46.671Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

