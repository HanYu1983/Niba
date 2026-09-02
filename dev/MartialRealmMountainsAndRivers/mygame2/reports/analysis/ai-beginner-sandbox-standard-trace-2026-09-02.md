# AI Beginner Sandbox Standard Trace

- AI turns: 200
- Final round: 43
- Game won: false
- Game over: false
- Remaining nests: 3

## Aggregate

- Action counts: hold=474, move=130, attack=48, end-turn=42, use-facility=30, allocate-attribute=6, learn-skill=5, collect=4, use-item=4, build=3, buy-equipment=3, equip=3, practice-skill=2, buy-item=2, equip-inner-skill=1, equip-external-skill=1, upgrade=1
- Creatures spawned (total): 13
- Creatures defeated (total): 8
- Level-ups observed: 3
- Final player: level 4, experience 174, inner skill 烈陽戰體 (blazing-sun-inner) lv.2 damage 21
- Final attributes: armStrength=16, constitution=13, agility=9, innerEnergy=9, insight=9

## Efficiency (KPI)

- 行動產出率 (productive): ██·········· 13.0% (99/759)
- 擊殺效率 (kill/generate): ███████····· 0.62 (8/13)
- 擊殺成本 (attack/kill): 6.00 (48 次攻擊 / 8 擊殺)
- 經驗效率 (XP/turn): 0.87 (174 XP / 200 turns)
- 目標切換次數 (goal switches): 294
- 無效行動率 (ineffective): █████████··· 72.2% (548/759)

- Nest health (start → end): creature-nest-1=120→176.22999999999993, creature-nest-2=120→151.36, creature-nest-3=120→186.58000000000004

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
      "createdAt": "2026-09-02T16:10:20.922Z"
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
      "createdAt": "2026-09-02T16:10:20.935Z"
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
      "createdAt": "2026-09-02T16:10:20.947Z"
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
      "createdAt": "2026-09-02T16:10:20.955Z"
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
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=120/120

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
      "createdAt": "2026-09-02T16:10:20.958Z"
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
      "createdAt": "2026-09-02T16:10:20.958Z"
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
      "createdAt": "2026-09-02T16:10:20.958Z"
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
      "createdAt": "2026-09-02T16:10:20.958Z"
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
      "createdAt": "2026-09-02T16:10:20.958Z"
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
      "createdAt": "2026-09-02T16:10:20.958Z"
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
      "createdAt": "2026-09-02T16:10:20.958Z"
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
      "createdAt": "2026-09-02T16:10:20.958Z"
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
      "createdAt": "2026-09-02T16:10:20.959Z"
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
      "createdAt": "2026-09-02T16:10:20.959Z"
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
      "createdAt": "2026-09-02T16:10:20.962Z"
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

### Turn 6 (round 2)
- Player: 胡斐 (player-2), level 1, experience 0, at (12, 5), health 24, stamina 3
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
      "createdAt": "2026-09-02T16:10:20.968Z"
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
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=120/120

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
      "createdAt": "2026-09-02T16:10:20.974Z"
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
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=120/132

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
      "createdAt": "2026-09-02T16:10:20.974Z"
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
      "createdAt": "2026-09-02T16:10:20.974Z"
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
      "createdAt": "2026-09-02T16:10:20.974Z"
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
      "createdAt": "2026-09-02T16:10:20.974Z"
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
      "createdAt": "2026-09-02T16:10:20.974Z"
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
      "createdAt": "2026-09-02T16:10:20.975Z"
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
      "createdAt": "2026-09-02T16:10:20.975Z"
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
      "createdAt": "2026-09-02T16:10:20.975Z"
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
      "createdAt": "2026-09-02T16:10:20.975Z"
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
      "createdAt": "2026-09-02T16:10:20.975Z"
    },
    {
      "id": "action-3-player-2-28",
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
      "createdAt": "2026-09-02T16:10:20.976Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": [
    {
      "id": "nest-creature-1",
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
      "spawnedRound": 3,
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

### Turn 9 (round 3)
- Player: 胡斐 (player-2), level 1, experience 0, at (12, 5), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=120/132

```json
{
  "actions": [
    {
      "id": "action-3-player-2-29",
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
      "createdAt": "2026-09-02T16:10:20.984Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 10 (round 3)
- Player: 胡斐 (player-2), level 1, experience 20, at (12, 5), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=120/132

```json
{
  "actions": [
    {
      "id": "action-3-player-2-30",
      "round": 3,
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
      "createdAt": "2026-09-02T16:10:20.992Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 11 (round 3)
- Player: 胡斐 (player-2), level 1, experience 20, at (13, 5), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=120/132

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
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 13,
          "column": 5
        },
        "reason": "保命：逃離 生物巢穴 3的怪物 Lv.1（hitsSurvivable=4.8）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 3的怪物 Lv.1（hitsSurvivable=4.8）",
      "createdAt": "2026-09-02T16:10:20.998Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 12 (round 4)
- Player: 胡斐 (player-2), level 1, experience 22, at (13, 5), health 25.5, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=121.32/132

```json
{
  "actions": [
    {
      "id": "action-3-roamer-creature-1-32",
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
      "createdAt": "2026-09-02T16:10:21.002Z"
    },
    {
      "id": "action-3-roamer-creature-2-33",
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
      "createdAt": "2026-09-02T16:10:21.002Z"
    },
    {
      "id": "action-3-roamer-creature-3-34",
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
      "createdAt": "2026-09-02T16:10:21.002Z"
    },
    {
      "id": "action-3-roamer-creature-4-35",
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
      "createdAt": "2026-09-02T16:10:21.002Z"
    },
    {
      "id": "action-3-roamer-creature-5-36",
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
      "createdAt": "2026-09-02T16:10:21.002Z"
    },
    {
      "id": "action-3-roamer-creature-6-37",
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
      "createdAt": "2026-09-02T16:10:21.002Z"
    },
    {
      "id": "action-3-roamer-creature-7-38",
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
      "createdAt": "2026-09-02T16:10:21.002Z"
    },
    {
      "id": "action-3-roamer-creature-8-39",
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
      "createdAt": "2026-09-02T16:10:21.002Z"
    },
    {
      "id": "action-3-roamer-creature-9-40",
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
      "createdAt": "2026-09-02T16:10:21.002Z"
    },
    {
      "id": "action-3-roamer-creature-10-41",
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
      "createdAt": "2026-09-02T16:10:21.002Z"
    },
    {
      "id": "action-3-nest-creature-1-42",
      "round": 3,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 13,
          "column": 7
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.002Z"
    },
    {
      "id": "action-4-player-2-43",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.003Z"
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

### Turn 13 (round 4)
- Player: 胡斐 (player-2), level 1, experience 22, at (13, 4), health 24, stamina 6.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=121.32/132

```json
{
  "actions": [
    {
      "id": "action-4-player-2-44",
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
          "row": 13,
          "column": 4
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-02T16:10:21.018Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 14 (round 4)
- Player: 胡斐 (player-2), level 1, experience 22, at (13, 3), health 24, stamina 4.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=121.32/132

```json
{
  "actions": [
    {
      "id": "action-4-player-2-45",
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
          "row": 13,
          "column": 3
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T16:10:21.033Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 15 (round 4)
- Player: 胡斐 (player-2), level 1, experience 22, at (12, 3), health 24, stamina 2.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=121.32/132

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
      "createdAt": "2026-09-02T16:10:21.043Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 16 (round 4)
- Player: 胡斐 (player-2), level 1, experience 22, at (12, 2), health 24, stamina 0.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=121.32/132

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
          "column": 2
        },
        "reason": "收集道具：移動到道具位置"
      },
      "result": "succeeded",
      "reason": "收集道具：移動到道具位置",
      "createdAt": "2026-09-02T16:10:21.055Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 17 (round 4)
- Player: 胡斐 (player-2), level 1, experience 22, at (12, 2), health 24, stamina 0.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=121.32/132

```json
{
  "actions": [
    {
      "id": "action-4-player-2-48",
      "round": 4,
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
          "id": "item-point-10",
          "kind": "item",
          "position": {
            "row": 12,
            "column": 2
          }
        },
        "reason": "收集道具：拾取"
      },
      "result": "succeeded",
      "reason": "收集道具：拾取",
      "createdAt": "2026-09-02T16:10:21.059Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 18 (round 5)
- Player: 胡斐 (player-2), level 1, experience 23, at (12, 2), health 25.5, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=122.63999999999999/132

```json
{
  "actions": [
    {
      "id": "action-4-roamer-creature-1-49",
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
      "createdAt": "2026-09-02T16:10:21.062Z"
    },
    {
      "id": "action-4-roamer-creature-2-50",
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
      "createdAt": "2026-09-02T16:10:21.062Z"
    },
    {
      "id": "action-4-roamer-creature-3-51",
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
      "createdAt": "2026-09-02T16:10:21.062Z"
    },
    {
      "id": "action-4-roamer-creature-4-52",
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
      "createdAt": "2026-09-02T16:10:21.062Z"
    },
    {
      "id": "action-4-roamer-creature-5-53",
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
      "createdAt": "2026-09-02T16:10:21.062Z"
    },
    {
      "id": "action-4-roamer-creature-6-54",
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
      "createdAt": "2026-09-02T16:10:21.062Z"
    },
    {
      "id": "action-4-roamer-creature-7-55",
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
      "createdAt": "2026-09-02T16:10:21.062Z"
    },
    {
      "id": "action-4-roamer-creature-8-56",
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
      "createdAt": "2026-09-02T16:10:21.062Z"
    },
    {
      "id": "action-4-roamer-creature-9-57",
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
      "createdAt": "2026-09-02T16:10:21.062Z"
    },
    {
      "id": "action-4-roamer-creature-10-58",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T16:10:21.063Z"
    },
    {
      "id": "action-4-nest-creature-1-59",
      "round": 4,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.1"
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
      "createdAt": "2026-09-02T16:10:21.063Z"
    },
    {
      "id": "action-5-player-2-60",
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
      "createdAt": "2026-09-02T16:10:21.063Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 19 (round 5)
- Player: 胡斐 (player-2), level 1, experience 26, at (12, 2), health 25.5, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=122.63999999999999/132

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
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "roamer-creature-10",
          "kind": "creature",
          "position": {
            "row": 12,
            "column": 1
          }
        },
        "reason": "交戰：攻擊 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 游蕩妖物",
      "createdAt": "2026-09-02T16:10:21.074Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 20 (round 5)
- Player: 胡斐 (player-2), level 1, experience 26, at (12, 3), health 24, stamina 1.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=122.63999999999999/132

```json
{
  "actions": [
    {
      "id": "action-5-player-2-62",
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
          "row": 12,
          "column": 3
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T16:10:21.082Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 21 (round 6)
- Player: 胡斐 (player-2), level 1, experience 29, at (12, 3), health 25.5, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=123.95999999999998/132

```json
{
  "actions": [
    {
      "id": "action-5-roamer-creature-1-63",
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
      "createdAt": "2026-09-02T16:10:21.086Z"
    },
    {
      "id": "action-5-roamer-creature-2-64",
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
      "createdAt": "2026-09-02T16:10:21.086Z"
    },
    {
      "id": "action-5-roamer-creature-3-65",
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
      "createdAt": "2026-09-02T16:10:21.086Z"
    },
    {
      "id": "action-5-roamer-creature-4-66",
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
      "createdAt": "2026-09-02T16:10:21.086Z"
    },
    {
      "id": "action-5-roamer-creature-5-67",
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
      "createdAt": "2026-09-02T16:10:21.086Z"
    },
    {
      "id": "action-5-roamer-creature-6-68",
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
      "createdAt": "2026-09-02T16:10:21.086Z"
    },
    {
      "id": "action-5-roamer-creature-7-69",
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
      "createdAt": "2026-09-02T16:10:21.086Z"
    },
    {
      "id": "action-5-roamer-creature-8-70",
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
      "createdAt": "2026-09-02T16:10:21.086Z"
    },
    {
      "id": "action-5-roamer-creature-9-71",
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
      "createdAt": "2026-09-02T16:10:21.086Z"
    },
    {
      "id": "action-5-roamer-creature-10-72",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T16:10:21.086Z"
    },
    {
      "id": "action-5-nest-creature-1-73",
      "round": 5,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 12,
          "column": 5
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.087Z"
    },
    {
      "id": "action-6-player-2-74",
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
      "createdAt": "2026-09-02T16:10:21.087Z"
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

### Turn 22 (round 6)
- Player: 胡斐 (player-2), level 1, experience 49, at (12, 3), health 25.5, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: roamer-creature-10
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=123.95999999999998/132

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
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "roamer-creature-10",
          "kind": "creature",
          "position": {
            "row": 12,
            "column": 2
          }
        },
        "reason": "交戰：攻擊 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 游蕩妖物",
      "createdAt": "2026-09-02T16:10:21.096Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 23 (round 6)
- Player: 胡斐 (player-2), level 1, experience 49, at (13, 3), health 24, stamina 1.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=123.95999999999998/132

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
      "createdAt": "2026-09-02T16:10:21.102Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 24 (round 7)
- Player: 胡斐 (player-2), level 2, experience 2, at (13, 3), health 25.5, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: -47 (level up; stored experience reset by game rules)
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=125.27999999999997/145

```json
{
  "actions": [
    {
      "id": "action-6-roamer-creature-1-77",
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
      "createdAt": "2026-09-02T16:10:21.107Z"
    },
    {
      "id": "action-6-roamer-creature-2-78",
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
      "createdAt": "2026-09-02T16:10:21.107Z"
    },
    {
      "id": "action-6-roamer-creature-3-79",
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
      "createdAt": "2026-09-02T16:10:21.107Z"
    },
    {
      "id": "action-6-roamer-creature-4-80",
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
      "createdAt": "2026-09-02T16:10:21.107Z"
    },
    {
      "id": "action-6-roamer-creature-5-81",
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
      "createdAt": "2026-09-02T16:10:21.107Z"
    },
    {
      "id": "action-6-roamer-creature-6-82",
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
      "createdAt": "2026-09-02T16:10:21.107Z"
    },
    {
      "id": "action-6-roamer-creature-7-83",
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
      "createdAt": "2026-09-02T16:10:21.107Z"
    },
    {
      "id": "action-6-roamer-creature-8-84",
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
      "createdAt": "2026-09-02T16:10:21.107Z"
    },
    {
      "id": "action-6-roamer-creature-9-85",
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
      "createdAt": "2026-09-02T16:10:21.107Z"
    },
    {
      "id": "action-6-nest-creature-1-86",
      "round": 6,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.1"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T16:10:21.107Z"
    },
    {
      "id": "action-7-player-2-87",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.108Z"
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
      "id": "nest-creature-2",
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
      "spawnedRound": 7,
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

### Turn 25 (round 7)
- Player: 胡斐 (player-2), level 2, experience 2, at (13, 3), health 25.5, stamina 8.5
- Attributes: armStrength=10, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=125.27999999999997/145

```json
{
  "actions": [
    {
      "id": "action-7-player-2-88",
      "round": 7,
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
      "createdAt": "2026-09-02T16:10:21.115Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 26 (round 7)
- Player: 胡斐 (player-2), level 2, experience 2, at (13, 3), health 25.5, stamina 8.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=125.27999999999997/145

```json
{
  "actions": [
    {
      "id": "action-7-player-2-89",
      "round": 7,
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
      "createdAt": "2026-09-02T16:10:21.123Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 27 (round 7)
- Player: 胡斐 (player-2), level 2, experience 5, at (13, 3), health 25.5, stamina 3.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=125.27999999999997/145

```json
{
  "actions": [
    {
      "id": "action-7-player-2-90",
      "round": 7,
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
          "id": "nest-creature-1",
          "kind": "creature",
          "position": {
            "row": 13,
            "column": 4
          }
        },
        "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.1",
      "createdAt": "2026-09-02T16:10:21.131Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 28 (round 7)
- Player: 胡斐 (player-2), level 2, experience 5, at (12, 3), health 25.5, stamina 1.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=125.27999999999997/145

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
          "row": 12,
          "column": 3
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T16:10:21.139Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 29 (round 8)
- Player: 胡斐 (player-2), level 2, experience 8, at (12, 3), health 27, stamina 9.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/132, creature-nest-2=120/120, creature-nest-3=126.72999999999998/145

```json
{
  "actions": [
    {
      "id": "action-7-roamer-creature-1-92",
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
      "createdAt": "2026-09-02T16:10:21.142Z"
    },
    {
      "id": "action-7-roamer-creature-2-93",
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
      "createdAt": "2026-09-02T16:10:21.142Z"
    },
    {
      "id": "action-7-roamer-creature-3-94",
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
      "createdAt": "2026-09-02T16:10:21.142Z"
    },
    {
      "id": "action-7-roamer-creature-4-95",
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:10:21.142Z"
    },
    {
      "id": "action-7-roamer-creature-5-96",
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
      "createdAt": "2026-09-02T16:10:21.142Z"
    },
    {
      "id": "action-7-roamer-creature-6-97",
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
      "createdAt": "2026-09-02T16:10:21.142Z"
    },
    {
      "id": "action-7-roamer-creature-7-98",
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
      "createdAt": "2026-09-02T16:10:21.142Z"
    },
    {
      "id": "action-7-roamer-creature-8-99",
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
      "createdAt": "2026-09-02T16:10:21.142Z"
    },
    {
      "id": "action-7-roamer-creature-9-100",
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
      "createdAt": "2026-09-02T16:10:21.143Z"
    },
    {
      "id": "action-7-nest-creature-1-101",
      "round": 7,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.1"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T16:10:21.143Z"
    },
    {
      "id": "action-7-nest-creature-2-102",
      "round": 7,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 12,
          "column": 6
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.143Z"
    },
    {
      "id": "action-8-player-2-103",
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
      "createdAt": "2026-09-02T16:10:21.143Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": [
    {
      "id": "nest-creature-3",
      "name": "生物巢穴 1的怪物 Lv.1",
      "innerSkillId": "void-spirit-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 12,
        "column": 2
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

### Turn 30 (round 8)
- Player: 胡斐 (player-2), level 2, experience 11, at (12, 3), health 27, stamina 4.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132, creature-nest-2=120/120, creature-nest-3=126.72999999999998/145

```json
{
  "actions": [
    {
      "id": "action-8-player-2-104",
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
          "id": "nest-creature-1",
          "kind": "creature",
          "position": {
            "row": 13,
            "column": 3
          }
        },
        "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.1",
      "createdAt": "2026-09-02T16:10:21.149Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 31 (round 8)
- Player: 胡斐 (player-2), level 2, experience 11, at (12, 3), health 27, stamina 1.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132, creature-nest-2=120/120, creature-nest-3=126.72999999999998/145

```json
{
  "actions": [
    {
      "id": "action-8-player-2-105",
      "round": 8,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-4",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-02T16:10:21.153Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 32 (round 9)
- Player: 胡斐 (player-2), level 2, experience 14, at (12, 3), health 19.5, stamina 9.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=121.32/132, creature-nest-2=120/120, creature-nest-3=128.17999999999998/145

```json
{
  "actions": [
    {
      "id": "action-8-roamer-creature-1-106",
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
      "createdAt": "2026-09-02T16:10:21.156Z"
    },
    {
      "id": "action-8-roamer-creature-2-107",
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
      "createdAt": "2026-09-02T16:10:21.156Z"
    },
    {
      "id": "action-8-roamer-creature-3-108",
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
      "createdAt": "2026-09-02T16:10:21.156Z"
    },
    {
      "id": "action-8-roamer-creature-4-109",
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
      "createdAt": "2026-09-02T16:10:21.156Z"
    },
    {
      "id": "action-8-roamer-creature-5-110",
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
      "createdAt": "2026-09-02T16:10:21.156Z"
    },
    {
      "id": "action-8-roamer-creature-6-111",
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
      "createdAt": "2026-09-02T16:10:21.156Z"
    },
    {
      "id": "action-8-roamer-creature-7-112",
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
      "createdAt": "2026-09-02T16:10:21.156Z"
    },
    {
      "id": "action-8-roamer-creature-8-113",
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
      "createdAt": "2026-09-02T16:10:21.156Z"
    },
    {
      "id": "action-8-roamer-creature-9-114",
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
      "createdAt": "2026-09-02T16:10:21.156Z"
    },
    {
      "id": "action-8-nest-creature-1-115",
      "round": 8,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.1"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "target": {
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 12,
            "column": 3
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T16:10:21.157Z"
    },
    {
      "id": "action-8-nest-creature-2-116",
      "round": 8,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 12,
          "column": 5
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.157Z"
    },
    {
      "id": "action-8-nest-creature-3-117",
      "round": 8,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "target": {
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 12,
            "column": 3
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T16:10:21.157Z"
    },
    {
      "id": "action-9-player-2-118",
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
        "reason": "模糊策略：positioning 分數 0.67，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.67:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.67，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.67:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.158Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 33 (round 9)
- Player: 胡斐 (player-2), level 2, experience 17, at (12, 3), health 19.5, stamina 4.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=121.32/132, creature-nest-2=120/120, creature-nest-3=128.17999999999998/145

```json
{
  "actions": [
    {
      "id": "action-9-player-2-119",
      "round": 9,
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
          "id": "nest-creature-1",
          "kind": "creature",
          "position": {
            "row": 13,
            "column": 3
          }
        },
        "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.1",
      "createdAt": "2026-09-02T16:10:21.164Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 34 (round 9)
- Player: 胡斐 (player-2), level 2, experience 17, at (12, 3), health 19.5, stamina 1.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=121.32/132, creature-nest-2=120/120, creature-nest-3=128.17999999999998/145

```json
{
  "actions": [
    {
      "id": "action-9-player-2-120",
      "round": 9,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-4",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-02T16:10:21.167Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 35 (round 10)
- Player: 胡斐 (player-2), level 2, experience 20, at (12, 3), health 11, stamina 9.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=122.63999999999999/132, creature-nest-2=120/120, creature-nest-3=129.62999999999997/145

```json
{
  "actions": [
    {
      "id": "action-9-roamer-creature-1-121",
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
      "createdAt": "2026-09-02T16:10:21.170Z"
    },
    {
      "id": "action-9-roamer-creature-2-122",
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
      "createdAt": "2026-09-02T16:10:21.170Z"
    },
    {
      "id": "action-9-roamer-creature-3-123",
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
      "createdAt": "2026-09-02T16:10:21.170Z"
    },
    {
      "id": "action-9-roamer-creature-4-124",
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
      "createdAt": "2026-09-02T16:10:21.170Z"
    },
    {
      "id": "action-9-roamer-creature-5-125",
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
      "createdAt": "2026-09-02T16:10:21.170Z"
    },
    {
      "id": "action-9-roamer-creature-6-126",
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
      "createdAt": "2026-09-02T16:10:21.170Z"
    },
    {
      "id": "action-9-roamer-creature-7-127",
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
      "createdAt": "2026-09-02T16:10:21.170Z"
    },
    {
      "id": "action-9-roamer-creature-8-128",
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
      "createdAt": "2026-09-02T16:10:21.170Z"
    },
    {
      "id": "action-9-roamer-creature-9-129",
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
      "createdAt": "2026-09-02T16:10:21.170Z"
    },
    {
      "id": "action-9-nest-creature-1-130",
      "round": 9,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.1"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "target": {
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 12,
            "column": 3
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T16:10:21.170Z"
    },
    {
      "id": "action-9-nest-creature-2-131",
      "round": 9,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 11,
          "column": 5
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.171Z"
    },
    {
      "id": "action-9-nest-creature-3-132",
      "round": 9,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "target": {
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 12,
            "column": 3
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T16:10:21.171Z"
    },
    {
      "id": "action-10-player-2-133",
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
        "reason": "模糊策略：positioning 分數 0.67，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.67:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.67，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.67:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.171Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 36 (round 10)
- Player: 胡斐 (player-2), level 2, experience 40, at (12, 3), health 11, stamina 4.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: nest-creature-1
- Nests: creature-nest-1=122.63999999999999/132, creature-nest-2=120/120, creature-nest-3=129.62999999999997/145

```json
{
  "actions": [
    {
      "id": "action-10-player-2-134",
      "round": 10,
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
          "id": "nest-creature-1",
          "kind": "creature",
          "position": {
            "row": 13,
            "column": 3
          }
        },
        "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.1",
      "createdAt": "2026-09-02T16:10:21.178Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 37 (round 10)
- Player: 胡斐 (player-2), level 2, experience 40, at (13, 3), health 11, stamina 2.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=122.63999999999999/132, creature-nest-2=120/120, creature-nest-3=129.62999999999997/145

```json
{
  "actions": [
    {
      "id": "action-10-player-2-135",
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
          "row": 13,
          "column": 3
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T16:10:21.183Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 38 (round 10)
- Player: 胡斐 (player-2), level 2, experience 40, at (12, 3), health 11, stamina 0.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=122.63999999999999/132, creature-nest-2=120/120, creature-nest-3=129.62999999999997/145

```json
{
  "actions": [
    {
      "id": "action-10-player-2-136",
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
          "row": 12,
          "column": 3
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T16:10:21.190Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 39 (round 10)
- Player: 胡斐 (player-2), level 2, experience 40, at (12, 3), health 30, stamina 0.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=122.63999999999999/132, creature-nest-2=120/120, creature-nest-3=129.62999999999997/145

```json
{
  "actions": [
    {
      "id": "action-10-player-2-137",
      "round": 10,
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
        "itemId": "heal-wound-medicine",
        "reason": "使用道具：療傷藥"
      },
      "result": "succeeded",
      "reason": "使用道具：療傷藥",
      "createdAt": "2026-09-02T16:10:21.193Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 40 (round 11)
- Player: 胡斐 (player-2), level 2, experience 41, at (12, 3), health 26.5, stamina 9.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=123.95999999999998/132, creature-nest-2=120/120, creature-nest-3=131.07999999999996/145

```json
{
  "actions": [
    {
      "id": "action-10-roamer-creature-1-138",
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
      "createdAt": "2026-09-02T16:10:21.195Z"
    },
    {
      "id": "action-10-roamer-creature-2-139",
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
      "createdAt": "2026-09-02T16:10:21.196Z"
    },
    {
      "id": "action-10-roamer-creature-3-140",
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
      "createdAt": "2026-09-02T16:10:21.196Z"
    },
    {
      "id": "action-10-roamer-creature-4-141",
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
      "createdAt": "2026-09-02T16:10:21.196Z"
    },
    {
      "id": "action-10-roamer-creature-5-142",
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
      "createdAt": "2026-09-02T16:10:21.196Z"
    },
    {
      "id": "action-10-roamer-creature-6-143",
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
      "createdAt": "2026-09-02T16:10:21.196Z"
    },
    {
      "id": "action-10-roamer-creature-7-144",
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
      "createdAt": "2026-09-02T16:10:21.196Z"
    },
    {
      "id": "action-10-roamer-creature-8-145",
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
      "createdAt": "2026-09-02T16:10:21.196Z"
    },
    {
      "id": "action-10-roamer-creature-9-146",
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
      "createdAt": "2026-09-02T16:10:21.196Z"
    },
    {
      "id": "action-10-nest-creature-2-147",
      "round": 10,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 12,
          "column": 5
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.196Z"
    },
    {
      "id": "action-10-nest-creature-3-148",
      "round": 10,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "target": {
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 12,
            "column": 3
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T16:10:21.196Z"
    },
    {
      "id": "action-11-player-2-149",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.196Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 41 (round 11)
- Player: 胡斐 (player-2), level 2, experience 44, at (12, 3), health 26.5, stamina 4.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=123.95999999999998/132, creature-nest-2=120/120, creature-nest-3=131.07999999999996/145

```json
{
  "actions": [
    {
      "id": "action-11-player-2-150",
      "round": 11,
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
            "row": 12,
            "column": 2
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-02T16:10:21.202Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 42 (round 11)
- Player: 胡斐 (player-2), level 2, experience 44, at (13, 3), health 26.5, stamina 2.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=123.95999999999998/132, creature-nest-2=120/120, creature-nest-3=131.07999999999996/145

```json
{
  "actions": [
    {
      "id": "action-11-player-2-151",
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
          "row": 13,
          "column": 3
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T16:10:21.209Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 43 (round 11)
- Player: 胡斐 (player-2), level 2, experience 44, at (13, 4), health 26.5, stamina 0.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=123.95999999999998/132, creature-nest-2=120/120, creature-nest-3=131.07999999999996/145

```json
{
  "actions": [
    {
      "id": "action-11-player-2-152",
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
          "row": 13,
          "column": 4
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T16:10:21.216Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 44 (round 12)
- Player: 胡斐 (player-2), level 2, experience 45, at (13, 4), health 28, stamina 9.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +1
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=125.27999999999997/132, creature-nest-2=120/132, creature-nest-3=132.52999999999994/145

```json
{
  "actions": [
    {
      "id": "action-11-roamer-creature-1-153",
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
      "createdAt": "2026-09-02T16:10:21.221Z"
    },
    {
      "id": "action-11-roamer-creature-2-154",
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
      "createdAt": "2026-09-02T16:10:21.221Z"
    },
    {
      "id": "action-11-roamer-creature-3-155",
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
      "createdAt": "2026-09-02T16:10:21.221Z"
    },
    {
      "id": "action-11-roamer-creature-4-156",
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
      "createdAt": "2026-09-02T16:10:21.221Z"
    },
    {
      "id": "action-11-roamer-creature-5-157",
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
      "createdAt": "2026-09-02T16:10:21.221Z"
    },
    {
      "id": "action-11-roamer-creature-6-158",
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
      "createdAt": "2026-09-02T16:10:21.221Z"
    },
    {
      "id": "action-11-roamer-creature-7-159",
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
      "createdAt": "2026-09-02T16:10:21.221Z"
    },
    {
      "id": "action-11-roamer-creature-8-160",
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
      "createdAt": "2026-09-02T16:10:21.221Z"
    },
    {
      "id": "action-11-roamer-creature-9-161",
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:10:21.221Z"
    },
    {
      "id": "action-11-nest-creature-2-162",
      "round": 11,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.221Z"
    },
    {
      "id": "action-11-nest-creature-3-163",
      "round": 11,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
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
      "createdAt": "2026-09-02T16:10:21.221Z"
    },
    {
      "id": "action-12-player-2-164",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.222Z"
    }
  ],
  "creatureLogs": [],
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
      "spawnedRound": 12,
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
    }
  ]
}
```

### Turn 45 (round 12)
- Player: 胡斐 (player-2), level 2, experience 65, at (13, 4), health 28, stamina 4.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 15
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: nest-creature-3
- Nests: creature-nest-1=125.27999999999997/132, creature-nest-2=120/132, creature-nest-3=132.52999999999994/145

```json
{
  "actions": [
    {
      "id": "action-12-player-2-165",
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
          "id": "nest-creature-3",
          "kind": "creature",
          "position": {
            "row": 13,
            "column": 3
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-02T16:10:21.225Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 46 (round 12)
- Player: 胡斐 (player-2), level 2, experience 65, at (13, 3), health 28, stamina 2.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=125.27999999999997/132, creature-nest-2=120/132, creature-nest-3=132.52999999999994/145

```json
{
  "actions": [
    {
      "id": "action-12-player-2-166",
      "round": 12,
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
      "createdAt": "2026-09-02T16:10:21.231Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 47 (round 12)
- Player: 胡斐 (player-2), level 2, experience 65, at (12, 3), health 28, stamina 0.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=125.27999999999997/132, creature-nest-2=120/132, creature-nest-3=132.52999999999994/145

```json
{
  "actions": [
    {
      "id": "action-12-player-2-167",
      "round": 12,
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
      "createdAt": "2026-09-02T16:10:21.240Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 48 (round 13)
- Player: 胡斐 (player-2), level 2, experience 66, at (12, 3), health 29.5, stamina 9.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 15
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=126.59999999999997/132, creature-nest-2=121.32/132, creature-nest-3=133.97999999999993/145

```json
{
  "actions": [
    {
      "id": "action-12-roamer-creature-1-168",
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
      "createdAt": "2026-09-02T16:10:21.243Z"
    },
    {
      "id": "action-12-roamer-creature-2-169",
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
      "createdAt": "2026-09-02T16:10:21.243Z"
    },
    {
      "id": "action-12-roamer-creature-3-170",
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
      "createdAt": "2026-09-02T16:10:21.243Z"
    },
    {
      "id": "action-12-roamer-creature-4-171",
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
      "createdAt": "2026-09-02T16:10:21.243Z"
    },
    {
      "id": "action-12-roamer-creature-5-172",
      "round": 12,
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
      "createdAt": "2026-09-02T16:10:21.243Z"
    },
    {
      "id": "action-12-roamer-creature-6-173",
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
      "createdAt": "2026-09-02T16:10:21.243Z"
    },
    {
      "id": "action-12-roamer-creature-7-174",
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
      "createdAt": "2026-09-02T16:10:21.243Z"
    },
    {
      "id": "action-12-roamer-creature-8-175",
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
      "createdAt": "2026-09-02T16:10:21.243Z"
    },
    {
      "id": "action-12-roamer-creature-9-176",
      "round": 12,
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
      "createdAt": "2026-09-02T16:10:21.243Z"
    },
    {
      "id": "action-12-nest-creature-2-177",
      "round": 12,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 12,
          "column": 5
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.243Z"
    },
    {
      "id": "action-12-nest-creature-1-178",
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
      "createdAt": "2026-09-02T16:10:21.243Z"
    },
    {
      "id": "action-13-player-2-179",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.244Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "roamer-creature-8",
      "creatureName": "游蕩妖物",
      "message": "游蕩妖物 發現並摧毀了道具點。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 49 (round 13)
- Player: 胡斐 (player-2), level 2, experience 66, at (11, 3), health 29.5, stamina 4.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=126.59999999999997/132, creature-nest-2=121.32/132, creature-nest-3=133.97999999999993/145

```json
{
  "actions": [
    {
      "id": "action-13-player-2-180",
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
          "row": 11,
          "column": 3
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T16:10:21.252Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 50 (round 13)
- Player: 胡斐 (player-2), level 2, experience 66, at (10, 3), health 29.5, stamina 2.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=126.59999999999997/132, creature-nest-2=121.32/132, creature-nest-3=133.97999999999993/145

```json
{
  "actions": [
    {
      "id": "action-13-player-2-181",
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
          "row": 10,
          "column": 3
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T16:10:21.260Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 51 (round 13)
- Player: 胡斐 (player-2), level 2, experience 66, at (9, 3), health 29.5, stamina 0.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=126.59999999999997/132, creature-nest-2=121.32/132, creature-nest-3=133.97999999999993/145

```json
{
  "actions": [
    {
      "id": "action-13-player-2-182",
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
          "row": 9,
          "column": 3
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T16:10:21.266Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 52 (round 14)
- Player: 胡斐 (player-2), level 2, experience 67, at (9, 3), health 26, stamina 9.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 15
- Stored experience change: +1
- Spawned creatures: 2
- Defeated creatures: none
- Nests: creature-nest-1=127.91999999999996/145, creature-nest-2=122.63999999999999/132, creature-nest-3=135.42999999999992/159

```json
{
  "actions": [
    {
      "id": "action-13-roamer-creature-1-183",
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
      "createdAt": "2026-09-02T16:10:21.269Z"
    },
    {
      "id": "action-13-roamer-creature-2-184",
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
      "createdAt": "2026-09-02T16:10:21.269Z"
    },
    {
      "id": "action-13-roamer-creature-3-185",
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
      "createdAt": "2026-09-02T16:10:21.269Z"
    },
    {
      "id": "action-13-roamer-creature-4-186",
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
      "createdAt": "2026-09-02T16:10:21.269Z"
    },
    {
      "id": "action-13-roamer-creature-5-187",
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
      "createdAt": "2026-09-02T16:10:21.269Z"
    },
    {
      "id": "action-13-roamer-creature-6-188",
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
      "createdAt": "2026-09-02T16:10:21.269Z"
    },
    {
      "id": "action-13-roamer-creature-7-189",
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
      "createdAt": "2026-09-02T16:10:21.270Z"
    },
    {
      "id": "action-13-roamer-creature-8-190",
      "round": 13,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "target": {
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 9,
            "column": 3
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T16:10:21.270Z"
    },
    {
      "id": "action-13-roamer-creature-9-191",
      "round": 13,
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
      "createdAt": "2026-09-02T16:10:21.270Z"
    },
    {
      "id": "action-13-nest-creature-2-192",
      "round": 13,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 11,
          "column": 5
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.270Z"
    },
    {
      "id": "action-13-nest-creature-1-193",
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
      "createdAt": "2026-09-02T16:10:21.270Z"
    },
    {
      "id": "action-14-player-2-194",
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
      "createdAt": "2026-09-02T16:10:21.270Z"
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
      "id": "nest-creature-3",
      "name": "生物巢穴 1的怪物 Lv.2",
      "innerSkillId": "void-spirit-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 12,
        "column": 2
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
      "spawnedRound": 14,
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
    },
    {
      "id": "nest-creature-4",
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
      "spawnedRound": 14,
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

### Turn 53 (round 14)
- Player: 胡斐 (player-2), level 2, experience 70, at (9, 3), health 26, stamina 4.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 15
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=127.91999999999996/145, creature-nest-2=122.63999999999999/132, creature-nest-3=135.42999999999992/159

```json
{
  "actions": [
    {
      "id": "action-14-player-2-195",
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
          "id": "roamer-creature-2",
          "kind": "creature",
          "position": {
            "row": 10,
            "column": 3
          }
        },
        "reason": "交戰：攻擊 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 游蕩妖物",
      "createdAt": "2026-09-02T16:10:21.281Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 54 (round 14)
- Player: 胡斐 (player-2), level 2, experience 70, at (9, 4), health 26, stamina 2.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=127.91999999999996/145, creature-nest-2=122.63999999999999/132, creature-nest-3=135.42999999999992/159

```json
{
  "actions": [
    {
      "id": "action-14-player-2-196",
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
          "row": 9,
          "column": 4
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T16:10:21.289Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 55 (round 14)
- Player: 胡斐 (player-2), level 2, experience 70, at (9, 5), health 26, stamina 0.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=127.91999999999996/145, creature-nest-2=122.63999999999999/132, creature-nest-3=135.42999999999992/159

```json
{
  "actions": [
    {
      "id": "action-14-player-2-197",
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
          "row": 9,
          "column": 5
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T16:10:21.296Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 56 (round 15)
- Player: 胡斐 (player-2), level 2, experience 71, at (9, 5), health 27.5, stamina 9.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 15
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=129.36999999999995/145, creature-nest-2=123.95999999999998/132, creature-nest-3=137.01999999999992/159

```json
{
  "actions": [
    {
      "id": "action-14-roamer-creature-1-198",
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
      "createdAt": "2026-09-02T16:10:21.299Z"
    },
    {
      "id": "action-14-roamer-creature-2-199",
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
      "createdAt": "2026-09-02T16:10:21.299Z"
    },
    {
      "id": "action-14-roamer-creature-3-200",
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
      "createdAt": "2026-09-02T16:10:21.300Z"
    },
    {
      "id": "action-14-roamer-creature-4-201",
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:10:21.300Z"
    },
    {
      "id": "action-14-roamer-creature-5-202",
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
      "createdAt": "2026-09-02T16:10:21.300Z"
    },
    {
      "id": "action-14-roamer-creature-6-203",
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
      "createdAt": "2026-09-02T16:10:21.300Z"
    },
    {
      "id": "action-14-roamer-creature-7-204",
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
      "createdAt": "2026-09-02T16:10:21.300Z"
    },
    {
      "id": "action-14-roamer-creature-8-205",
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
      "createdAt": "2026-09-02T16:10:21.300Z"
    },
    {
      "id": "action-14-roamer-creature-9-206",
      "round": 14,
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
      "createdAt": "2026-09-02T16:10:21.300Z"
    },
    {
      "id": "action-14-nest-creature-2-207",
      "round": 14,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.300Z"
    },
    {
      "id": "action-14-nest-creature-1-208",
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
      "createdAt": "2026-09-02T16:10:21.300Z"
    },
    {
      "id": "action-14-nest-creature-3-209",
      "round": 14,
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
          "row": 11,
          "column": 2
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.300Z"
    },
    {
      "id": "action-14-nest-creature-4-210",
      "round": 14,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:21.300Z"
    },
    {
      "id": "action-15-player-2-211",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.300Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 57 (round 15)
- Player: 胡斐 (player-2), level 2, experience 74, at (9, 5), health 27.5, stamina 4.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 15
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=129.36999999999995/145, creature-nest-2=123.95999999999998/132, creature-nest-3=137.01999999999992/159

```json
{
  "actions": [
    {
      "id": "action-15-player-2-212",
      "round": 15,
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
            "row": 10,
            "column": 5
          }
        },
        "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.2"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.2",
      "createdAt": "2026-09-02T16:10:21.309Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 58 (round 15)
- Player: 胡斐 (player-2), level 2, experience 74, at (8, 5), health 27.5, stamina 2.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=129.36999999999995/145, creature-nest-2=123.95999999999998/132, creature-nest-3=137.01999999999992/159

```json
{
  "actions": [
    {
      "id": "action-15-player-2-213",
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
          "column": 5
        },
        "reason": "定位：前往出口 (8,5)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (8,5)",
      "createdAt": "2026-09-02T16:10:21.316Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 59 (round 15)
- Player: 胡斐 (player-2), level 2, experience 74, at (7, 5), health 27.5, stamina 0.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=129.36999999999995/145, creature-nest-2=123.95999999999998/132, creature-nest-3=137.01999999999992/159

```json
{
  "actions": [
    {
      "id": "action-15-player-2-214",
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
          "row": 7,
          "column": 5
        },
        "reason": "收集道具：移動到道具位置"
      },
      "result": "succeeded",
      "reason": "收集道具：移動到道具位置",
      "createdAt": "2026-09-02T16:10:21.321Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 60 (round 15)
- Player: 胡斐 (player-2), level 2, experience 74, at (7, 5), health 27.5, stamina 0.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=129.36999999999995/145, creature-nest-2=123.95999999999998/132, creature-nest-3=137.01999999999992/159

```json
{
  "actions": [
    {
      "id": "action-15-player-2-215",
      "round": 15,
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
          "id": "item-point-6",
          "kind": "item",
          "position": {
            "row": 7,
            "column": 5
          }
        },
        "reason": "收集道具：拾取"
      },
      "result": "succeeded",
      "reason": "收集道具：拾取",
      "createdAt": "2026-09-02T16:10:21.324Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 61 (round 16)
- Player: 胡斐 (player-2), level 2, experience 75, at (7, 5), health 29, stamina 9.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 15
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=130.81999999999994/145, creature-nest-2=125.27999999999997/132, creature-nest-3=138.60999999999993/159

```json
{
  "actions": [
    {
      "id": "action-15-roamer-creature-1-216",
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
      "createdAt": "2026-09-02T16:10:21.327Z"
    },
    {
      "id": "action-15-roamer-creature-2-217",
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
      "createdAt": "2026-09-02T16:10:21.327Z"
    },
    {
      "id": "action-15-roamer-creature-3-218",
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
      "createdAt": "2026-09-02T16:10:21.327Z"
    },
    {
      "id": "action-15-roamer-creature-4-219",
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:10:21.327Z"
    },
    {
      "id": "action-15-roamer-creature-5-220",
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
      "createdAt": "2026-09-02T16:10:21.327Z"
    },
    {
      "id": "action-15-roamer-creature-6-221",
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
      "createdAt": "2026-09-02T16:10:21.327Z"
    },
    {
      "id": "action-15-roamer-creature-7-222",
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
      "createdAt": "2026-09-02T16:10:21.327Z"
    },
    {
      "id": "action-15-roamer-creature-8-223",
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
      "createdAt": "2026-09-02T16:10:21.327Z"
    },
    {
      "id": "action-15-roamer-creature-9-224",
      "round": 15,
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
      "createdAt": "2026-09-02T16:10:21.327Z"
    },
    {
      "id": "action-15-nest-creature-2-225",
      "round": 15,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 9,
          "column": 4
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.327Z"
    },
    {
      "id": "action-15-nest-creature-1-226",
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
      "createdAt": "2026-09-02T16:10:21.327Z"
    },
    {
      "id": "action-15-nest-creature-3-227",
      "round": 15,
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
          "row": 11,
          "column": 3
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.327Z"
    },
    {
      "id": "action-15-nest-creature-4-228",
      "round": 15,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:21.327Z"
    },
    {
      "id": "action-16-player-2-229",
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
      "createdAt": "2026-09-02T16:10:21.327Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 62 (round 16)
- Player: 胡斐 (player-2), level 2, experience 95, at (7, 5), health 29, stamina 4.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 15
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=130.81999999999994/145, creature-nest-2=125.27999999999997/132, creature-nest-3=138.60999999999993/159

```json
{
  "actions": [
    {
      "id": "action-16-player-2-230",
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
          "id": "ruin-3",
          "kind": "ruin",
          "position": {
            "row": 6,
            "column": 5
          }
        },
        "reason": "清障：清除廢墟 燈火村"
      },
      "result": "succeeded",
      "reason": "清障：清除廢墟 燈火村",
      "createdAt": "2026-09-02T16:10:21.334Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 63 (round 16)
- Player: 胡斐 (player-2), level 2, experience 95, at (6, 5), health 29, stamina 2.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=130.81999999999994/145, creature-nest-2=125.27999999999997/132, creature-nest-3=138.60999999999993/159

```json
{
  "actions": [
    {
      "id": "action-16-player-2-231",
      "round": 16,
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
          "column": 5
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T16:10:21.342Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 64 (round 16)
- Player: 胡斐 (player-2), level 2, experience 95, at (6, 6), health 29, stamina 0.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=130.81999999999994/145, creature-nest-2=125.27999999999997/132, creature-nest-3=138.60999999999993/159

```json
{
  "actions": [
    {
      "id": "action-16-player-2-232",
      "round": 16,
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
          "column": 6
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T16:10:21.347Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 65 (round 17)
- Player: 胡斐 (player-2), level 2, experience 96, at (6, 6), health 21.5, stamina 9.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 15
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132.26999999999992/145, creature-nest-2=126.59999999999997/132, creature-nest-3=140.19999999999993/159

```json
{
  "actions": [
    {
      "id": "action-16-roamer-creature-1-233",
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
      "createdAt": "2026-09-02T16:10:21.350Z"
    },
    {
      "id": "action-16-roamer-creature-2-234",
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
      "createdAt": "2026-09-02T16:10:21.350Z"
    },
    {
      "id": "action-16-roamer-creature-3-235",
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
      "createdAt": "2026-09-02T16:10:21.350Z"
    },
    {
      "id": "action-16-roamer-creature-4-236",
      "round": 16,
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
      "createdAt": "2026-09-02T16:10:21.350Z"
    },
    {
      "id": "action-16-roamer-creature-5-237",
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
      "createdAt": "2026-09-02T16:10:21.350Z"
    },
    {
      "id": "action-16-roamer-creature-6-238",
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
      "createdAt": "2026-09-02T16:10:21.350Z"
    },
    {
      "id": "action-16-roamer-creature-7-239",
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
      "createdAt": "2026-09-02T16:10:21.350Z"
    },
    {
      "id": "action-16-roamer-creature-8-240",
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
      "createdAt": "2026-09-02T16:10:21.350Z"
    },
    {
      "id": "action-16-roamer-creature-9-241",
      "round": 16,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "target": {
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 6,
            "column": 6
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T16:10:21.350Z"
    },
    {
      "id": "action-16-nest-creature-2-242",
      "round": 16,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 7,
          "column": 4
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.350Z"
    },
    {
      "id": "action-16-nest-creature-1-243",
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
          "row": 4,
          "column": 6
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.350Z"
    },
    {
      "id": "action-16-nest-creature-3-244",
      "round": 16,
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
      "createdAt": "2026-09-02T16:10:21.350Z"
    },
    {
      "id": "action-16-nest-creature-4-245",
      "round": 16,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "target": {
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 6,
            "column": 6
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T16:10:21.350Z"
    },
    {
      "id": "action-17-player-2-246",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.350Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "roamer-creature-9",
      "creatureName": "游蕩妖物",
      "message": "游蕩妖物 攻擊 胡斐，造成 2 點傷害（根骨減傷）。"
    },
    {
      "creatureId": "nest-creature-4",
      "creatureName": "生物巢穴 3的怪物 Lv.3",
      "message": "生物巢穴 3的怪物 Lv.3 攻擊 胡斐，造成 7 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 66 (round 17)
- Player: 胡斐 (player-2), level 2, experience 96, at (6, 7), health 21.5, stamina 4.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132.26999999999992/145, creature-nest-2=126.59999999999997/132, creature-nest-3=140.19999999999993/159

```json
{
  "actions": [
    {
      "id": "action-17-player-2-247",
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
          "row": 6,
          "column": 7
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:10:21.357Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 67 (round 17)
- Player: 胡斐 (player-2), level 2, experience 96, at (5, 7), health 21.5, stamina 2.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132.26999999999992/145, creature-nest-2=126.59999999999997/132, creature-nest-3=140.19999999999993/159

```json
{
  "actions": [
    {
      "id": "action-17-player-2-248",
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
          "row": 5,
          "column": 7
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:10:21.362Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 68 (round 18)
- Player: 胡斐 (player-2), level 3, experience 1, at (5, 7), health 11, stamina 9.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 15
- Stored experience change: -95 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=133.7199999999999/145, creature-nest-2=127.91999999999996/132, creature-nest-3=141.78999999999994/159

```json
{
  "actions": [
    {
      "id": "action-17-roamer-creature-1-249",
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
      "createdAt": "2026-09-02T16:10:21.365Z"
    },
    {
      "id": "action-17-roamer-creature-2-250",
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
      "createdAt": "2026-09-02T16:10:21.365Z"
    },
    {
      "id": "action-17-roamer-creature-3-251",
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
      "createdAt": "2026-09-02T16:10:21.365Z"
    },
    {
      "id": "action-17-roamer-creature-4-252",
      "round": 17,
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
      "createdAt": "2026-09-02T16:10:21.365Z"
    },
    {
      "id": "action-17-roamer-creature-5-253",
      "round": 17,
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
            "row": 5,
            "column": 7
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T16:10:21.365Z"
    },
    {
      "id": "action-17-roamer-creature-6-254",
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
      "createdAt": "2026-09-02T16:10:21.365Z"
    },
    {
      "id": "action-17-roamer-creature-7-255",
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
      "createdAt": "2026-09-02T16:10:21.366Z"
    },
    {
      "id": "action-17-roamer-creature-8-256",
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
      "createdAt": "2026-09-02T16:10:21.366Z"
    },
    {
      "id": "action-17-roamer-creature-9-257",
      "round": 17,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "target": {
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 5,
            "column": 7
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T16:10:21.366Z"
    },
    {
      "id": "action-17-nest-creature-2-258",
      "round": 17,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 5
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.366Z"
    },
    {
      "id": "action-17-nest-creature-1-259",
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
          "row": 4,
          "column": 6
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.366Z"
    },
    {
      "id": "action-17-nest-creature-3-260",
      "round": 17,
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
      "createdAt": "2026-09-02T16:10:21.366Z"
    },
    {
      "id": "action-17-nest-creature-4-261",
      "round": 17,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:21.366Z"
    },
    {
      "id": "action-18-player-2-262",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.366Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 69 (round 18)
- Player: 胡斐 (player-2), level 3, experience 1, at (5, 7), health 11, stamina 9.5
- Attributes: armStrength=11, constitution=11, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=133.7199999999999/145, creature-nest-2=127.91999999999996/132, creature-nest-3=141.78999999999994/159

```json
{
  "actions": [
    {
      "id": "action-18-player-2-263",
      "round": 18,
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
      "createdAt": "2026-09-02T16:10:21.375Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 70 (round 18)
- Player: 胡斐 (player-2), level 3, experience 1, at (5, 7), health 11, stamina 9.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=133.7199999999999/145, creature-nest-2=127.91999999999996/132, creature-nest-3=141.78999999999994/159

```json
{
  "actions": [
    {
      "id": "action-18-player-2-264",
      "round": 18,
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
      "createdAt": "2026-09-02T16:10:21.383Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 71 (round 18)
- Player: 胡斐 (player-2), level 3, experience 1, at (5, 8), health 11, stamina 4.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=133.7199999999999/145, creature-nest-2=127.91999999999996/132, creature-nest-3=141.78999999999994/159

```json
{
  "actions": [
    {
      "id": "action-18-player-2-265",
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
          "row": 5,
          "column": 8
        },
        "reason": "保命：逃離 游蕩妖物（hitsSurvivable=1.5714285714285714）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 游蕩妖物（hitsSurvivable=1.5714285714285714）",
      "createdAt": "2026-09-02T16:10:21.392Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 72 (round 18)
- Player: 胡斐 (player-2), level 3, experience 1, at (5, 7), health 11, stamina 2.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=133.7199999999999/145, creature-nest-2=127.91999999999996/132, creature-nest-3=141.78999999999994/159

```json
{
  "actions": [
    {
      "id": "action-18-player-2-266",
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
          "row": 5,
          "column": 7
        },
        "reason": "保命：逃離 游蕩妖物（hitsSurvivable=1.5714285714285714）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 游蕩妖物（hitsSurvivable=1.5714285714285714）",
      "createdAt": "2026-09-02T16:10:21.399Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 73 (round 18)
- Player: 胡斐 (player-2), level 3, experience 1, at (5, 7), health 31, stamina 2.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=133.7199999999999/145, creature-nest-2=127.91999999999996/132, creature-nest-3=141.78999999999994/159

```json
{
  "actions": [
    {
      "id": "action-18-player-2-267",
      "round": 18,
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
        "itemId": "heal-wound-medicine",
        "reason": "使用道具：療傷藥"
      },
      "result": "succeeded",
      "reason": "使用道具：療傷藥",
      "createdAt": "2026-09-02T16:10:21.403Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 74 (round 19)
- Player: 胡斐 (player-2), level 3, experience 6, at (5, 7), health 25.8, stamina 9.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +5
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=135.1699999999999/159, creature-nest-2=129.23999999999995/132, creature-nest-3=143.37999999999994/159

```json
{
  "actions": [
    {
      "id": "action-18-roamer-creature-1-268",
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
      "createdAt": "2026-09-02T16:10:21.406Z"
    },
    {
      "id": "action-18-roamer-creature-2-269",
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
      "createdAt": "2026-09-02T16:10:21.407Z"
    },
    {
      "id": "action-18-roamer-creature-3-270",
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
      "createdAt": "2026-09-02T16:10:21.407Z"
    },
    {
      "id": "action-18-roamer-creature-4-271",
      "round": 18,
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
      "createdAt": "2026-09-02T16:10:21.407Z"
    },
    {
      "id": "action-18-roamer-creature-5-272",
      "round": 18,
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
            "row": 5,
            "column": 7
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T16:10:21.407Z"
    },
    {
      "id": "action-18-roamer-creature-6-273",
      "round": 18,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "destination": {
          "row": 2,
          "column": 7
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.407Z"
    },
    {
      "id": "action-18-roamer-creature-7-274",
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
      "createdAt": "2026-09-02T16:10:21.407Z"
    },
    {
      "id": "action-18-roamer-creature-8-275",
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
      "createdAt": "2026-09-02T16:10:21.407Z"
    },
    {
      "id": "action-18-roamer-creature-9-276",
      "round": 18,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "target": {
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 5,
            "column": 7
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T16:10:21.407Z"
    },
    {
      "id": "action-18-nest-creature-2-277",
      "round": 18,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 5
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.407Z"
    },
    {
      "id": "action-18-nest-creature-1-278",
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
          "row": 4,
          "column": 6
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.407Z"
    },
    {
      "id": "action-18-nest-creature-3-279",
      "round": 18,
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
      "createdAt": "2026-09-02T16:10:21.407Z"
    },
    {
      "id": "action-18-nest-creature-4-280",
      "round": 18,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 7,
          "column": 6
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T16:10:21.407Z"
    },
    {
      "id": "action-19-player-2-281",
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
        "reason": "模糊策略：positioning 分數 0.67，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.67:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.67，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.67:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.408Z"
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
      "spawnedRound": 19,
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

### Turn 75 (round 19)
- Player: 胡斐 (player-2), level 3, experience 6, at (5, 8), health 25.8, stamina 4.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=135.1699999999999/159, creature-nest-2=129.23999999999995/132, creature-nest-3=143.37999999999994/159

```json
{
  "actions": [
    {
      "id": "action-19-player-2-282",
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
          "row": 5,
          "column": 8
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:10:21.414Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 76 (round 19)
- Player: 胡斐 (player-2), level 3, experience 6, at (5, 9), health 25.8, stamina 2.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=135.1699999999999/159, creature-nest-2=129.23999999999995/132, creature-nest-3=143.37999999999994/159

```json
{
  "actions": [
    {
      "id": "action-19-player-2-283",
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
          "row": 5,
          "column": 9
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:10:21.419Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 77 (round 19)
- Player: 胡斐 (player-2), level 3, experience 6, at (5, 10), health 25.8, stamina 0.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=135.1699999999999/159, creature-nest-2=129.23999999999995/132, creature-nest-3=143.37999999999994/159

```json
{
  "actions": [
    {
      "id": "action-19-player-2-284",
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
          "row": 5,
          "column": 10
        },
        "reason": "定位：前往出口 (5,8)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (5,8)",
      "createdAt": "2026-09-02T16:10:21.424Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 78 (round 20)
- Player: 胡斐 (player-2), level 3, experience 7, at (5, 10), health 27.6, stamina 9.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=136.7599999999999/159, creature-nest-2=130.55999999999995/132, creature-nest-3=144.96999999999994/159

```json
{
  "actions": [
    {
      "id": "action-19-roamer-creature-1-285",
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
      "createdAt": "2026-09-02T16:10:21.426Z"
    },
    {
      "id": "action-19-roamer-creature-2-286",
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
      "createdAt": "2026-09-02T16:10:21.426Z"
    },
    {
      "id": "action-19-roamer-creature-3-287",
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
      "createdAt": "2026-09-02T16:10:21.426Z"
    },
    {
      "id": "action-19-roamer-creature-4-288",
      "round": 19,
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
      "createdAt": "2026-09-02T16:10:21.426Z"
    },
    {
      "id": "action-19-roamer-creature-5-289",
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
      "createdAt": "2026-09-02T16:10:21.426Z"
    },
    {
      "id": "action-19-roamer-creature-6-290",
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
      "createdAt": "2026-09-02T16:10:21.426Z"
    },
    {
      "id": "action-19-roamer-creature-7-291",
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
      "createdAt": "2026-09-02T16:10:21.426Z"
    },
    {
      "id": "action-19-roamer-creature-8-292",
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
      "createdAt": "2026-09-02T16:10:21.427Z"
    },
    {
      "id": "action-19-roamer-creature-9-293",
      "round": 19,
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
      "createdAt": "2026-09-02T16:10:21.427Z"
    },
    {
      "id": "action-19-nest-creature-2-294",
      "round": 19,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.427Z"
    },
    {
      "id": "action-19-nest-creature-1-295",
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
          "row": 4,
          "column": 6
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.427Z"
    },
    {
      "id": "action-19-nest-creature-3-296",
      "round": 19,
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
      "createdAt": "2026-09-02T16:10:21.427Z"
    },
    {
      "id": "action-19-nest-creature-4-297",
      "round": 19,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:21.427Z"
    },
    {
      "id": "action-19-nest-creature-5-298",
      "round": 19,
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
      "createdAt": "2026-09-02T16:10:21.427Z"
    },
    {
      "id": "action-20-player-2-299",
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
      "createdAt": "2026-09-02T16:10:21.427Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 79 (round 20)
- Player: 胡斐 (player-2), level 3, experience 10, at (5, 10), health 27.6, stamina 4.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=136.7599999999999/159, creature-nest-2=130.55999999999995/132, creature-nest-3=144.96999999999994/159

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
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "roamer-creature-4",
          "kind": "creature",
          "position": {
            "row": 5,
            "column": 9
          }
        },
        "reason": "交戰：攻擊 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 游蕩妖物",
      "createdAt": "2026-09-02T16:10:21.433Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 80 (round 20)
- Player: 胡斐 (player-2), level 3, experience 10, at (5, 11), health 27.6, stamina 2.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=136.7599999999999/159, creature-nest-2=130.55999999999995/132, creature-nest-3=144.96999999999994/159

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
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 11
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:10:21.439Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 81 (round 20)
- Player: 胡斐 (player-2), level 3, experience 10, at (5, 12), health 27.6, stamina 0.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=136.7599999999999/159, creature-nest-2=130.55999999999995/132, creature-nest-3=144.96999999999994/159

```json
{
  "actions": [
    {
      "id": "action-20-player-2-302",
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
          "row": 5,
          "column": 12
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:10:21.446Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 82 (round 21)
- Player: 胡斐 (player-2), level 3, experience 11, at (5, 12), health 29.400000000000002, stamina 9.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=138.3499999999999/159, creature-nest-2=131.87999999999994/132, creature-nest-3=146.55999999999995/159

```json
{
  "actions": [
    {
      "id": "action-20-roamer-creature-1-303",
      "round": 20,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "target": {
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 5,
            "column": 12
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T16:10:21.448Z"
    },
    {
      "id": "action-20-roamer-creature-2-304",
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
      "createdAt": "2026-09-02T16:10:21.448Z"
    },
    {
      "id": "action-20-roamer-creature-3-305",
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
      "createdAt": "2026-09-02T16:10:21.448Z"
    },
    {
      "id": "action-20-roamer-creature-4-306",
      "round": 20,
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
      "createdAt": "2026-09-02T16:10:21.448Z"
    },
    {
      "id": "action-20-roamer-creature-5-307",
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
      "createdAt": "2026-09-02T16:10:21.449Z"
    },
    {
      "id": "action-20-roamer-creature-6-308",
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
      "createdAt": "2026-09-02T16:10:21.449Z"
    },
    {
      "id": "action-20-roamer-creature-7-309",
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
      "createdAt": "2026-09-02T16:10:21.449Z"
    },
    {
      "id": "action-20-roamer-creature-8-310",
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
      "createdAt": "2026-09-02T16:10:21.449Z"
    },
    {
      "id": "action-20-roamer-creature-9-311",
      "round": 20,
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
      "createdAt": "2026-09-02T16:10:21.449Z"
    },
    {
      "id": "action-20-nest-creature-2-312",
      "round": 20,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.449Z"
    },
    {
      "id": "action-20-nest-creature-1-313",
      "round": 20,
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
      "createdAt": "2026-09-02T16:10:21.449Z"
    },
    {
      "id": "action-20-nest-creature-3-314",
      "round": 20,
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
      "createdAt": "2026-09-02T16:10:21.449Z"
    },
    {
      "id": "action-20-nest-creature-4-315",
      "round": 20,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:21.449Z"
    },
    {
      "id": "action-20-nest-creature-5-316",
      "round": 20,
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
      "createdAt": "2026-09-02T16:10:21.449Z"
    },
    {
      "id": "action-21-player-2-317",
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
        "reason": "模糊策略：exploration 分數 0.03，但目前沒有可執行 action，結束回合。候選診斷：exploration=0.03:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：exploration 分數 0.03，但目前沒有可執行 action，結束回合。候選診斷：exploration=0.03:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.449Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "roamer-creature-1",
      "creatureName": "游蕩妖物",
      "message": "游蕩妖物 攻擊 胡斐，被閃避。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 83 (round 21)
- Player: 胡斐 (player-2), level 3, experience 14, at (5, 12), health 29.400000000000002, stamina 4.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=138.3499999999999/159, creature-nest-2=131.87999999999994/132, creature-nest-3=146.55999999999995/159

```json
{
  "actions": [
    {
      "id": "action-21-player-2-318",
      "round": 21,
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
          "id": "roamer-creature-1",
          "kind": "creature",
          "position": {
            "row": 4,
            "column": 12
          }
        },
        "reason": "交戰：攻擊 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 游蕩妖物",
      "createdAt": "2026-09-02T16:10:21.454Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 84 (round 21)
- Player: 胡斐 (player-2), level 3, experience 14, at (5, 13), health 29.400000000000002, stamina 2.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=138.3499999999999/159, creature-nest-2=131.87999999999994/132, creature-nest-3=146.55999999999995/159

```json
{
  "actions": [
    {
      "id": "action-21-player-2-319",
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
          "row": 5,
          "column": 13
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:10:21.460Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 85 (round 21)
- Player: 胡斐 (player-2), level 3, experience 14, at (5, 13), health 29.400000000000002, stamina 0.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=138.3499999999999/159, creature-nest-2=131.87999999999994/132, creature-nest-3=146.55999999999995/159

```json
{
  "actions": [
    {
      "id": "action-21-player-2-320",
      "round": 21,
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
      "createdAt": "2026-09-02T16:10:21.466Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 86 (round 22)
- Player: 胡斐 (player-2), level 3, experience 15, at (5, 13), health 31.200000000000003, stamina 9.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=139.9399999999999/159, creature-nest-2=132/132, creature-nest-3=148.14999999999995/159

```json
{
  "actions": [
    {
      "id": "action-21-roamer-creature-1-321",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T16:10:21.469Z"
    },
    {
      "id": "action-21-roamer-creature-2-322",
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
      "createdAt": "2026-09-02T16:10:21.469Z"
    },
    {
      "id": "action-21-roamer-creature-3-323",
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
      "createdAt": "2026-09-02T16:10:21.469Z"
    },
    {
      "id": "action-21-roamer-creature-4-324",
      "round": 21,
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
      "createdAt": "2026-09-02T16:10:21.469Z"
    },
    {
      "id": "action-21-roamer-creature-5-325",
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
      "createdAt": "2026-09-02T16:10:21.469Z"
    },
    {
      "id": "action-21-roamer-creature-6-326",
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
      "createdAt": "2026-09-02T16:10:21.469Z"
    },
    {
      "id": "action-21-roamer-creature-7-327",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T16:10:21.469Z"
    },
    {
      "id": "action-21-roamer-creature-8-328",
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
      "createdAt": "2026-09-02T16:10:21.469Z"
    },
    {
      "id": "action-21-roamer-creature-9-329",
      "round": 21,
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
      "createdAt": "2026-09-02T16:10:21.469Z"
    },
    {
      "id": "action-21-nest-creature-2-330",
      "round": 21,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.469Z"
    },
    {
      "id": "action-21-nest-creature-1-331",
      "round": 21,
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
      "createdAt": "2026-09-02T16:10:21.469Z"
    },
    {
      "id": "action-21-nest-creature-3-332",
      "round": 21,
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
      "createdAt": "2026-09-02T16:10:21.469Z"
    },
    {
      "id": "action-21-nest-creature-4-333",
      "round": 21,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:21.469Z"
    },
    {
      "id": "action-21-nest-creature-5-334",
      "round": 21,
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
      "createdAt": "2026-09-02T16:10:21.470Z"
    },
    {
      "id": "action-22-player-2-335",
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
      "createdAt": "2026-09-02T16:10:21.470Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 87 (round 22)
- Player: 胡斐 (player-2), level 3, experience 35, at (5, 13), health 31.200000000000003, stamina 4.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: roamer-creature-1
- Nests: creature-nest-1=139.9399999999999/159, creature-nest-2=132/132, creature-nest-3=148.14999999999995/159

```json
{
  "actions": [
    {
      "id": "action-22-player-2-336",
      "round": 22,
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
          "id": "roamer-creature-1",
          "kind": "creature",
          "position": {
            "row": 5,
            "column": 12
          }
        },
        "reason": "交戰：攻擊 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 游蕩妖物",
      "createdAt": "2026-09-02T16:10:21.473Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 88 (round 22)
- Player: 胡斐 (player-2), level 3, experience 35, at (5, 12), health 31.200000000000003, stamina 2.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=139.9399999999999/159, creature-nest-2=132/132, creature-nest-3=148.14999999999995/159

```json
{
  "actions": [
    {
      "id": "action-22-player-2-337",
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
          "row": 5,
          "column": 12
        },
        "reason": "定位：前往出口 (5,12)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (5,12)",
      "createdAt": "2026-09-02T16:10:21.480Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 89 (round 22)
- Player: 胡斐 (player-2), level 3, experience 35, at (4, 12), health 31.200000000000003, stamina 0.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=139.9399999999999/159, creature-nest-2=132/132, creature-nest-3=148.14999999999995/159

```json
{
  "actions": [
    {
      "id": "action-22-player-2-338",
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
          "row": 4,
          "column": 12
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:10:21.486Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 90 (round 23)
- Player: 胡斐 (player-2), level 3, experience 36, at (4, 12), health 28.000000000000004, stamina 9.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=141.52999999999992/159, creature-nest-2=132/132, creature-nest-3=149.73999999999995/159

```json
{
  "actions": [
    {
      "id": "action-22-roamer-creature-2-339",
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
      "createdAt": "2026-09-02T16:10:21.489Z"
    },
    {
      "id": "action-22-roamer-creature-3-340",
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
      "createdAt": "2026-09-02T16:10:21.489Z"
    },
    {
      "id": "action-22-roamer-creature-4-341",
      "round": 22,
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
      "createdAt": "2026-09-02T16:10:21.489Z"
    },
    {
      "id": "action-22-roamer-creature-5-342",
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
      "createdAt": "2026-09-02T16:10:21.489Z"
    },
    {
      "id": "action-22-roamer-creature-6-343",
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
      "createdAt": "2026-09-02T16:10:21.489Z"
    },
    {
      "id": "action-22-roamer-creature-7-344",
      "round": 22,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "target": {
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 4,
            "column": 12
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T16:10:21.489Z"
    },
    {
      "id": "action-22-roamer-creature-8-345",
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
      "createdAt": "2026-09-02T16:10:21.489Z"
    },
    {
      "id": "action-22-roamer-creature-9-346",
      "round": 22,
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
      "createdAt": "2026-09-02T16:10:21.489Z"
    },
    {
      "id": "action-22-nest-creature-2-347",
      "round": 22,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.489Z"
    },
    {
      "id": "action-22-nest-creature-1-348",
      "round": 22,
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
      "createdAt": "2026-09-02T16:10:21.489Z"
    },
    {
      "id": "action-22-nest-creature-3-349",
      "round": 22,
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
      "createdAt": "2026-09-02T16:10:21.489Z"
    },
    {
      "id": "action-22-nest-creature-4-350",
      "round": 22,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:21.489Z"
    },
    {
      "id": "action-22-nest-creature-5-351",
      "round": 22,
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
      "createdAt": "2026-09-02T16:10:21.489Z"
    },
    {
      "id": "action-23-player-2-352",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.490Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "roamer-creature-7",
      "creatureName": "游蕩妖物",
      "message": "游蕩妖物 攻擊 胡斐，造成 5 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 91 (round 23)
- Player: 胡斐 (player-2), level 3, experience 36, at (3, 12), health 28.000000000000004, stamina 7.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=141.52999999999992/159, creature-nest-2=132/132, creature-nest-3=149.73999999999995/159

```json
{
  "actions": [
    {
      "id": "action-23-player-2-353",
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
          "row": 3,
          "column": 12
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:10:21.499Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 92 (round 23)
- Player: 胡斐 (player-2), level 3, experience 36, at (3, 11), health 28.000000000000004, stamina 5.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=141.52999999999992/159, creature-nest-2=132/132, creature-nest-3=149.73999999999995/159

```json
{
  "actions": [
    {
      "id": "action-23-player-2-354",
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
          "row": 3,
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:10:21.507Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 93 (round 23)
- Player: 胡斐 (player-2), level 3, experience 36, at (3, 11), health 28.000000000000004, stamina 2.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=141.52999999999992/159, creature-nest-2=132/132, creature-nest-3=149.73999999999995/159

```json
{
  "actions": [
    {
      "id": "action-23-player-2-355",
      "round": 23,
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
      "createdAt": "2026-09-02T16:10:21.515Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 94 (round 23)
- Player: 胡斐 (player-2), level 3, experience 36, at (2, 11), health 28.000000000000004, stamina 0.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=141.52999999999992/159, creature-nest-2=132/132, creature-nest-3=149.73999999999995/159

```json
{
  "actions": [
    {
      "id": "action-23-player-2-356",
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
          "row": 2,
          "column": 11
        },
        "reason": "定位：前往出口 (2,11)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (2,11)",
      "createdAt": "2026-09-02T16:10:21.522Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 95 (round 24)
- Player: 胡斐 (player-2), level 3, experience 37, at (2, 11), health 29.800000000000004, stamina 9.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=143.11999999999992/159, creature-nest-2=132/132, creature-nest-3=151.32999999999996/159

```json
{
  "actions": [
    {
      "id": "action-23-roamer-creature-2-357",
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
      "createdAt": "2026-09-02T16:10:21.526Z"
    },
    {
      "id": "action-23-roamer-creature-3-358",
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
      "createdAt": "2026-09-02T16:10:21.526Z"
    },
    {
      "id": "action-23-roamer-creature-4-359",
      "round": 23,
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
      "createdAt": "2026-09-02T16:10:21.526Z"
    },
    {
      "id": "action-23-roamer-creature-5-360",
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
      "createdAt": "2026-09-02T16:10:21.526Z"
    },
    {
      "id": "action-23-roamer-creature-6-361",
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
      "createdAt": "2026-09-02T16:10:21.526Z"
    },
    {
      "id": "action-23-roamer-creature-7-362",
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
      "createdAt": "2026-09-02T16:10:21.526Z"
    },
    {
      "id": "action-23-roamer-creature-8-363",
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
      "createdAt": "2026-09-02T16:10:21.526Z"
    },
    {
      "id": "action-23-roamer-creature-9-364",
      "round": 23,
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
      "createdAt": "2026-09-02T16:10:21.526Z"
    },
    {
      "id": "action-23-nest-creature-2-365",
      "round": 23,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.526Z"
    },
    {
      "id": "action-23-nest-creature-1-366",
      "round": 23,
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
      "createdAt": "2026-09-02T16:10:21.526Z"
    },
    {
      "id": "action-23-nest-creature-3-367",
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
      "createdAt": "2026-09-02T16:10:21.526Z"
    },
    {
      "id": "action-23-nest-creature-4-368",
      "round": 23,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:21.526Z"
    },
    {
      "id": "action-23-nest-creature-5-369",
      "round": 23,
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
      "createdAt": "2026-09-02T16:10:21.526Z"
    },
    {
      "id": "action-24-player-2-370",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.526Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 96 (round 24)
- Player: 胡斐 (player-2), level 3, experience 37, at (2, 12), health 29.800000000000004, stamina 7.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=143.11999999999992/159, creature-nest-2=132/132, creature-nest-3=151.32999999999996/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-371",
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
          "row": 2,
          "column": 12
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:10:21.532Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 97 (round 24)
- Player: 胡斐 (player-2), level 3, experience 37, at (2, 13), health 29.800000000000004, stamina 5.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=143.11999999999992/159, creature-nest-2=132/132, creature-nest-3=151.32999999999996/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-372",
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
          "row": 2,
          "column": 13
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:10:21.537Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 98 (round 24)
- Player: 胡斐 (player-2), level 3, experience 37, at (3, 13), health 29.800000000000004, stamina 3.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=143.11999999999992/159, creature-nest-2=132/132, creature-nest-3=151.32999999999996/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-373",
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
          "row": 3,
          "column": 13
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:10:21.542Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 99 (round 24)
- Player: 胡斐 (player-2), level 3, experience 37, at (4, 13), health 29.800000000000004, stamina 1.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=143.11999999999992/159, creature-nest-2=132/132, creature-nest-3=151.32999999999996/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-374",
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
          "row": 4,
          "column": 13
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:10:21.547Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 100 (round 25)
- Player: 胡斐 (player-2), level 3, experience 40, at (4, 13), health 31.600000000000005, stamina 9.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +3
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=144.70999999999992/159, creature-nest-2=132/132, creature-nest-3=152.91999999999996/175

```json
{
  "actions": [
    {
      "id": "action-24-roamer-creature-2-375",
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
      "createdAt": "2026-09-02T16:10:21.548Z"
    },
    {
      "id": "action-24-roamer-creature-3-376",
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
      "createdAt": "2026-09-02T16:10:21.548Z"
    },
    {
      "id": "action-24-roamer-creature-4-377",
      "round": 24,
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
      "createdAt": "2026-09-02T16:10:21.548Z"
    },
    {
      "id": "action-24-roamer-creature-5-378",
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
      "createdAt": "2026-09-02T16:10:21.548Z"
    },
    {
      "id": "action-24-roamer-creature-6-379",
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
      "createdAt": "2026-09-02T16:10:21.548Z"
    },
    {
      "id": "action-24-roamer-creature-7-380",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T16:10:21.548Z"
    },
    {
      "id": "action-24-roamer-creature-8-381",
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
      "createdAt": "2026-09-02T16:10:21.549Z"
    },
    {
      "id": "action-24-roamer-creature-9-382",
      "round": 24,
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
      "createdAt": "2026-09-02T16:10:21.549Z"
    },
    {
      "id": "action-24-nest-creature-2-383",
      "round": 24,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.549Z"
    },
    {
      "id": "action-24-nest-creature-1-384",
      "round": 24,
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
      "createdAt": "2026-09-02T16:10:21.549Z"
    },
    {
      "id": "action-24-nest-creature-3-385",
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
      "createdAt": "2026-09-02T16:10:21.549Z"
    },
    {
      "id": "action-24-nest-creature-4-386",
      "round": 24,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:21.549Z"
    },
    {
      "id": "action-24-nest-creature-5-387",
      "round": 24,
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
      "createdAt": "2026-09-02T16:10:21.549Z"
    },
    {
      "id": "action-25-player-2-388",
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
      "createdAt": "2026-09-02T16:10:21.550Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "creature-nest-3",
      "creatureName": "生物巢穴 3",
      "message": "生物巢穴 3 生成了 Lv.4 怪物。"
    }
  ],
  "spawnedCreatures": [
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
      "spawnedRound": 25,
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

### Turn 101 (round 25)
- Player: 胡斐 (player-2), level 3, experience 60, at (4, 13), health 31.600000000000005, stamina 4.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: roamer-creature-7
- Nests: creature-nest-1=144.70999999999992/159, creature-nest-2=132/132, creature-nest-3=152.91999999999996/175

```json
{
  "actions": [
    {
      "id": "action-25-player-2-389",
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
          "id": "roamer-creature-7",
          "kind": "creature",
          "position": {
            "row": 4,
            "column": 12
          }
        },
        "reason": "交戰：攻擊 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 游蕩妖物",
      "createdAt": "2026-09-02T16:10:21.559Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 102 (round 25)
- Player: 胡斐 (player-2), level 3, experience 60, at (5, 13), health 31.600000000000005, stamina 2.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=144.70999999999992/159, creature-nest-2=132/132, creature-nest-3=152.91999999999996/175

```json
{
  "actions": [
    {
      "id": "action-25-player-2-390",
      "round": 25,
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
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-02T16:10:21.566Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 103 (round 25)
- Player: 胡斐 (player-2), level 3, experience 60, at (5, 13), health 31.600000000000005, stamina 0.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=144.70999999999992/159, creature-nest-2=132/132, creature-nest-3=152.91999999999996/175

```json
{
  "actions": [
    {
      "id": "action-25-player-2-391",
      "round": 25,
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
      "createdAt": "2026-09-02T16:10:21.569Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 104 (round 26)
- Player: 胡斐 (player-2), level 3, experience 61, at (5, 13), health 33.400000000000006, stamina 9.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +1
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=146.29999999999993/175, creature-nest-2=132/132, creature-nest-3=154.66999999999996/175

```json
{
  "actions": [
    {
      "id": "action-25-roamer-creature-2-392",
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
      "createdAt": "2026-09-02T16:10:21.571Z"
    },
    {
      "id": "action-25-roamer-creature-3-393",
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
      "createdAt": "2026-09-02T16:10:21.571Z"
    },
    {
      "id": "action-25-roamer-creature-4-394",
      "round": 25,
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
      "createdAt": "2026-09-02T16:10:21.571Z"
    },
    {
      "id": "action-25-roamer-creature-5-395",
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
      "createdAt": "2026-09-02T16:10:21.571Z"
    },
    {
      "id": "action-25-roamer-creature-6-396",
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
      "createdAt": "2026-09-02T16:10:21.571Z"
    },
    {
      "id": "action-25-roamer-creature-8-397",
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
      "createdAt": "2026-09-02T16:10:21.571Z"
    },
    {
      "id": "action-25-roamer-creature-9-398",
      "round": 25,
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
      "createdAt": "2026-09-02T16:10:21.571Z"
    },
    {
      "id": "action-25-nest-creature-2-399",
      "round": 25,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.572Z"
    },
    {
      "id": "action-25-nest-creature-1-400",
      "round": 25,
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
      "createdAt": "2026-09-02T16:10:21.572Z"
    },
    {
      "id": "action-25-nest-creature-3-401",
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
      "createdAt": "2026-09-02T16:10:21.572Z"
    },
    {
      "id": "action-25-nest-creature-4-402",
      "round": 25,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:21.572Z"
    },
    {
      "id": "action-25-nest-creature-5-403",
      "round": 25,
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
      "createdAt": "2026-09-02T16:10:21.572Z"
    },
    {
      "id": "action-25-nest-creature-6-404",
      "round": 25,
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
      "createdAt": "2026-09-02T16:10:21.572Z"
    },
    {
      "id": "action-26-player-2-405",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.573Z"
    }
  ],
  "creatureLogs": [],
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
      "spawnedRound": 26,
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

### Turn 105 (round 26)
- Player: 胡斐 (player-2), level 3, experience 61, at (5, 13), health 33.400000000000006, stamina 7.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=146.29999999999993/175, creature-nest-2=132/132, creature-nest-3=154.66999999999996/175

```json
{
  "actions": [
    {
      "id": "action-26-player-2-406",
      "round": 26,
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
      "createdAt": "2026-09-02T16:10:21.579Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 106 (round 26)
- Player: 胡斐 (player-2), level 3, experience 61, at (5, 13), health 33.400000000000006, stamina 5.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=146.29999999999993/175, creature-nest-2=132/132, creature-nest-3=154.66999999999996/175

```json
{
  "actions": [
    {
      "id": "action-26-player-2-407",
      "round": 26,
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
      "createdAt": "2026-09-02T16:10:21.586Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 107 (round 26)
- Player: 胡斐 (player-2), level 3, experience 61, at (5, 13), health 33.400000000000006, stamina 3.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=146.29999999999993/175, creature-nest-2=132/132, creature-nest-3=154.66999999999996/175

```json
{
  "actions": [
    {
      "id": "action-26-player-2-408",
      "round": 26,
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
      "createdAt": "2026-09-02T16:10:21.593Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 108 (round 26)
- Player: 胡斐 (player-2), level 3, experience 61, at (5, 13), health 33.400000000000006, stamina 1.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=146.29999999999993/175, creature-nest-2=132/132, creature-nest-3=154.66999999999996/175

```json
{
  "actions": [
    {
      "id": "action-26-player-2-409",
      "round": 26,
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
      "createdAt": "2026-09-02T16:10:21.600Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 109 (round 27)
- Player: 胡斐 (player-2), level 3, experience 64, at (5, 13), health 35.2, stamina 9.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=148.04999999999993/175, creature-nest-2=132/132, creature-nest-3=156.41999999999996/175

```json
{
  "actions": [
    {
      "id": "action-26-roamer-creature-2-410",
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
      "createdAt": "2026-09-02T16:10:21.602Z"
    },
    {
      "id": "action-26-roamer-creature-3-411",
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
      "createdAt": "2026-09-02T16:10:21.602Z"
    },
    {
      "id": "action-26-roamer-creature-4-412",
      "round": 26,
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
      "createdAt": "2026-09-02T16:10:21.602Z"
    },
    {
      "id": "action-26-roamer-creature-5-413",
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
      "createdAt": "2026-09-02T16:10:21.602Z"
    },
    {
      "id": "action-26-roamer-creature-6-414",
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
      "createdAt": "2026-09-02T16:10:21.602Z"
    },
    {
      "id": "action-26-roamer-creature-8-415",
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
      "createdAt": "2026-09-02T16:10:21.602Z"
    },
    {
      "id": "action-26-roamer-creature-9-416",
      "round": 26,
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
      "createdAt": "2026-09-02T16:10:21.602Z"
    },
    {
      "id": "action-26-nest-creature-2-417",
      "round": 26,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.603Z"
    },
    {
      "id": "action-26-nest-creature-1-418",
      "round": 26,
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
      "createdAt": "2026-09-02T16:10:21.603Z"
    },
    {
      "id": "action-26-nest-creature-3-419",
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
      "createdAt": "2026-09-02T16:10:21.603Z"
    },
    {
      "id": "action-26-nest-creature-4-420",
      "round": 26,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:21.603Z"
    },
    {
      "id": "action-26-nest-creature-5-421",
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
      "createdAt": "2026-09-02T16:10:21.603Z"
    },
    {
      "id": "action-26-nest-creature-6-422",
      "round": 26,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-6",
          "kind": "creature"
        },
        "destination": {
          "row": 8,
          "column": 10
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T16:10:21.603Z"
    },
    {
      "id": "action-26-nest-creature-7-423",
      "round": 26,
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
      "createdAt": "2026-09-02T16:10:21.603Z"
    },
    {
      "id": "action-27-player-2-424",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.604Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 110 (round 27)
- Player: 胡斐 (player-2), level 3, experience 64, at (5, 13), health 35.2, stamina 7.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=148.04999999999993/175, creature-nest-2=132/132, creature-nest-3=156.41999999999996/175

```json
{
  "actions": [
    {
      "id": "action-27-player-2-425",
      "round": 27,
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
      "createdAt": "2026-09-02T16:10:21.611Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 111 (round 27)
- Player: 胡斐 (player-2), level 3, experience 64, at (5, 13), health 35.2, stamina 5.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=148.04999999999993/175, creature-nest-2=132/132, creature-nest-3=156.41999999999996/175

```json
{
  "actions": [
    {
      "id": "action-27-player-2-426",
      "round": 27,
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
      "createdAt": "2026-09-02T16:10:21.618Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 112 (round 27)
- Player: 胡斐 (player-2), level 3, experience 64, at (5, 13), health 35.2, stamina 3.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=148.04999999999993/175, creature-nest-2=132/132, creature-nest-3=156.41999999999996/175

```json
{
  "actions": [
    {
      "id": "action-27-player-2-427",
      "round": 27,
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
      "createdAt": "2026-09-02T16:10:21.624Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 113 (round 27)
- Player: 胡斐 (player-2), level 3, experience 64, at (5, 13), health 35.2, stamina 1.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=148.04999999999993/175, creature-nest-2=132/132, creature-nest-3=156.41999999999996/175

```json
{
  "actions": [
    {
      "id": "action-27-player-2-428",
      "round": 27,
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
      "createdAt": "2026-09-02T16:10:21.631Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 114 (round 28)
- Player: 胡斐 (player-2), level 3, experience 67, at (5, 13), health 36, stamina 9.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +3
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=149.79999999999993/175, creature-nest-2=132/145, creature-nest-3=158.16999999999996/175

```json
{
  "actions": [
    {
      "id": "action-27-roamer-creature-2-429",
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
      "createdAt": "2026-09-02T16:10:21.634Z"
    },
    {
      "id": "action-27-roamer-creature-3-430",
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
      "createdAt": "2026-09-02T16:10:21.634Z"
    },
    {
      "id": "action-27-roamer-creature-4-431",
      "round": 27,
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
      "createdAt": "2026-09-02T16:10:21.634Z"
    },
    {
      "id": "action-27-roamer-creature-5-432",
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
      "createdAt": "2026-09-02T16:10:21.634Z"
    },
    {
      "id": "action-27-roamer-creature-6-433",
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
      "createdAt": "2026-09-02T16:10:21.634Z"
    },
    {
      "id": "action-27-roamer-creature-8-434",
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
      "createdAt": "2026-09-02T16:10:21.634Z"
    },
    {
      "id": "action-27-roamer-creature-9-435",
      "round": 27,
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
      "createdAt": "2026-09-02T16:10:21.634Z"
    },
    {
      "id": "action-27-nest-creature-2-436",
      "round": 27,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.634Z"
    },
    {
      "id": "action-27-nest-creature-1-437",
      "round": 27,
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
      "createdAt": "2026-09-02T16:10:21.634Z"
    },
    {
      "id": "action-27-nest-creature-3-438",
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
      "createdAt": "2026-09-02T16:10:21.634Z"
    },
    {
      "id": "action-27-nest-creature-4-439",
      "round": 27,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:21.634Z"
    },
    {
      "id": "action-27-nest-creature-5-440",
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
      "createdAt": "2026-09-02T16:10:21.634Z"
    },
    {
      "id": "action-27-nest-creature-6-441",
      "round": 27,
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
      "createdAt": "2026-09-02T16:10:21.634Z"
    },
    {
      "id": "action-27-nest-creature-7-442",
      "round": 27,
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
      "createdAt": "2026-09-02T16:10:21.634Z"
    },
    {
      "id": "action-28-player-2-443",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.635Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-6",
      "creatureName": "生物巢穴 3的怪物 Lv.4",
      "message": "生物巢穴 3的怪物 Lv.4 攻擊耕田，造成 7 點傷害。"
    },
    {
      "creatureId": "creature-nest-2",
      "creatureName": "生物巢穴 2",
      "message": "生物巢穴 2 生成了 Lv.2 怪物。"
    }
  ],
  "spawnedCreatures": [
    {
      "id": "nest-creature-8",
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
      "spawnedRound": 28,
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

### Turn 115 (round 28)
- Player: 胡斐 (player-2), level 3, experience 67, at (5, 12), health 36, stamina 7.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=149.79999999999993/175, creature-nest-2=132/145, creature-nest-3=158.16999999999996/175

```json
{
  "actions": [
    {
      "id": "action-28-player-2-444",
      "round": 28,
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
      "createdAt": "2026-09-02T16:10:21.642Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 116 (round 28)
- Player: 胡斐 (player-2), level 3, experience 67, at (4, 12), health 36, stamina 5.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=149.79999999999993/175, creature-nest-2=132/145, creature-nest-3=158.16999999999996/175

```json
{
  "actions": [
    {
      "id": "action-28-player-2-445",
      "round": 28,
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
      "createdAt": "2026-09-02T16:10:21.651Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 117 (round 28)
- Player: 胡斐 (player-2), level 3, experience 67, at (3, 12), health 36, stamina 3.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=149.79999999999993/175, creature-nest-2=132/145, creature-nest-3=158.16999999999996/175

```json
{
  "actions": [
    {
      "id": "action-28-player-2-446",
      "round": 28,
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
      "createdAt": "2026-09-02T16:10:21.659Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 118 (round 28)
- Player: 胡斐 (player-2), level 3, experience 67, at (3, 11), health 36, stamina 1.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=149.79999999999993/175, creature-nest-2=132/145, creature-nest-3=158.16999999999996/175

```json
{
  "actions": [
    {
      "id": "action-28-player-2-447",
      "round": 28,
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
      "createdAt": "2026-09-02T16:10:21.668Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 119 (round 29)
- Player: 胡斐 (player-2), level 3, experience 70, at (3, 11), health 36, stamina 9.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=151.54999999999993/175, creature-nest-2=133.45/145, creature-nest-3=159.91999999999996/175

```json
{
  "actions": [
    {
      "id": "action-28-roamer-creature-2-448",
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
      "createdAt": "2026-09-02T16:10:21.671Z"
    },
    {
      "id": "action-28-roamer-creature-3-449",
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
      "createdAt": "2026-09-02T16:10:21.671Z"
    },
    {
      "id": "action-28-roamer-creature-4-450",
      "round": 28,
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
      "createdAt": "2026-09-02T16:10:21.672Z"
    },
    {
      "id": "action-28-roamer-creature-5-451",
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
      "createdAt": "2026-09-02T16:10:21.672Z"
    },
    {
      "id": "action-28-roamer-creature-6-452",
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
      "createdAt": "2026-09-02T16:10:21.672Z"
    },
    {
      "id": "action-28-roamer-creature-8-453",
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
      "createdAt": "2026-09-02T16:10:21.672Z"
    },
    {
      "id": "action-28-roamer-creature-9-454",
      "round": 28,
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
      "createdAt": "2026-09-02T16:10:21.672Z"
    },
    {
      "id": "action-28-nest-creature-2-455",
      "round": 28,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.672Z"
    },
    {
      "id": "action-28-nest-creature-1-456",
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
          "row": 2,
          "column": 8
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.672Z"
    },
    {
      "id": "action-28-nest-creature-3-457",
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
      "createdAt": "2026-09-02T16:10:21.672Z"
    },
    {
      "id": "action-28-nest-creature-4-458",
      "round": 28,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:21.672Z"
    },
    {
      "id": "action-28-nest-creature-5-459",
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
      "createdAt": "2026-09-02T16:10:21.672Z"
    },
    {
      "id": "action-28-nest-creature-6-460",
      "round": 28,
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
      "createdAt": "2026-09-02T16:10:21.672Z"
    },
    {
      "id": "action-28-nest-creature-7-461",
      "round": 28,
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
      "createdAt": "2026-09-02T16:10:21.672Z"
    },
    {
      "id": "action-28-nest-creature-8-462",
      "round": 28,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.672Z"
    },
    {
      "id": "action-29-player-2-463",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.673Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 120 (round 29)
- Player: 胡斐 (player-2), level 3, experience 70, at (3, 11), health 36, stamina 6.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=151.54999999999993/175, creature-nest-2=133.45/145, creature-nest-3=159.91999999999996/175

```json
{
  "actions": [
    {
      "id": "action-29-player-2-464",
      "round": 29,
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
      "createdAt": "2026-09-02T16:10:21.680Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 121 (round 29)
- Player: 胡斐 (player-2), level 3, experience 70, at (3, 11), health 36, stamina 6.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=151.54999999999993/175, creature-nest-2=133.45/145, creature-nest-3=159.91999999999996/175

```json
{
  "actions": [
    {
      "id": "action-29-player-2-465",
      "round": 29,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "equip-external-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "skillId": "swift-wind-external-damage",
        "reason": "啟用外功：追風腿"
      },
      "result": "succeeded",
      "reason": "啟用外功：追風腿",
      "createdAt": "2026-09-02T16:10:21.686Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 122 (round 29)
- Player: 胡斐 (player-2), level 3, experience 70, at (3, 11), health 36, stamina 3.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=151.54999999999993/175, creature-nest-2=133.45/145, creature-nest-3=159.91999999999996/175

```json
{
  "actions": [
    {
      "id": "action-29-player-2-466",
      "round": 29,
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
      "createdAt": "2026-09-02T16:10:21.693Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 123 (round 29)
- Player: 胡斐 (player-2), level 3, experience 70, at (3, 11), health 36, stamina 0.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=151.54999999999993/175, creature-nest-2=133.45/145, creature-nest-3=159.91999999999996/175

```json
{
  "actions": [
    {
      "id": "action-29-player-2-467",
      "round": 29,
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
      "createdAt": "2026-09-02T16:10:21.700Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 124 (round 30)
- Player: 胡斐 (player-2), level 3, experience 71, at (3, 11), health 36, stamina 9.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=153.29999999999993/175, creature-nest-2=134.89999999999998/145, creature-nest-3=161.66999999999996/175

```json
{
  "actions": [
    {
      "id": "action-29-roamer-creature-2-468",
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
      "createdAt": "2026-09-02T16:10:21.703Z"
    },
    {
      "id": "action-29-roamer-creature-3-469",
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
      "createdAt": "2026-09-02T16:10:21.703Z"
    },
    {
      "id": "action-29-roamer-creature-4-470",
      "round": 29,
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
      "createdAt": "2026-09-02T16:10:21.703Z"
    },
    {
      "id": "action-29-roamer-creature-5-471",
      "round": 29,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "destination": {
          "row": 2,
          "column": 9
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.703Z"
    },
    {
      "id": "action-29-roamer-creature-6-472",
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
      "createdAt": "2026-09-02T16:10:21.703Z"
    },
    {
      "id": "action-29-roamer-creature-8-473",
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
      "createdAt": "2026-09-02T16:10:21.703Z"
    },
    {
      "id": "action-29-roamer-creature-9-474",
      "round": 29,
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
      "createdAt": "2026-09-02T16:10:21.703Z"
    },
    {
      "id": "action-29-nest-creature-2-475",
      "round": 29,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.703Z"
    },
    {
      "id": "action-29-nest-creature-1-476",
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
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.703Z"
    },
    {
      "id": "action-29-nest-creature-3-477",
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
      "createdAt": "2026-09-02T16:10:21.703Z"
    },
    {
      "id": "action-29-nest-creature-4-478",
      "round": 29,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:21.703Z"
    },
    {
      "id": "action-29-nest-creature-5-479",
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
      "createdAt": "2026-09-02T16:10:21.703Z"
    },
    {
      "id": "action-29-nest-creature-6-480",
      "round": 29,
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
      "createdAt": "2026-09-02T16:10:21.703Z"
    },
    {
      "id": "action-29-nest-creature-7-481",
      "round": 29,
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
      "createdAt": "2026-09-02T16:10:21.703Z"
    },
    {
      "id": "action-29-nest-creature-8-482",
      "round": 29,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.703Z"
    },
    {
      "id": "action-30-player-2-483",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.704Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-6",
      "creatureName": "生物巢穴 3的怪物 Lv.4",
      "message": "生物巢穴 3的怪物 Lv.4 攻擊耕田，造成 7 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 125 (round 30)
- Player: 胡斐 (player-2), level 3, experience 71, at (2, 11), health 36, stamina 7.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=153.29999999999993/175, creature-nest-2=134.89999999999998/145, creature-nest-3=161.66999999999996/175

```json
{
  "actions": [
    {
      "id": "action-30-player-2-484",
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
          "row": 2,
          "column": 11
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:10:21.712Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 126 (round 30)
- Player: 胡斐 (player-2), level 3, experience 71, at (2, 12), health 36, stamina 5.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=153.29999999999993/175, creature-nest-2=134.89999999999998/145, creature-nest-3=161.66999999999996/175

```json
{
  "actions": [
    {
      "id": "action-30-player-2-485",
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
          "row": 2,
          "column": 12
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:10:21.720Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 127 (round 30)
- Player: 胡斐 (player-2), level 3, experience 71, at (2, 13), health 36, stamina 3.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=153.29999999999993/175, creature-nest-2=134.89999999999998/145, creature-nest-3=161.66999999999996/175

```json
{
  "actions": [
    {
      "id": "action-30-player-2-486",
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
          "row": 2,
          "column": 13
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:10:21.727Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 128 (round 30)
- Player: 胡斐 (player-2), level 3, experience 71, at (3, 13), health 36, stamina 1.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=153.29999999999993/175, creature-nest-2=134.89999999999998/145, creature-nest-3=161.66999999999996/175

```json
{
  "actions": [
    {
      "id": "action-30-player-2-487",
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
      "createdAt": "2026-09-02T16:10:21.734Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 129 (round 31)
- Player: 胡斐 (player-2), level 3, experience 74, at (3, 13), health 36, stamina 9.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +3
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=155.04999999999993/175, creature-nest-2=136.34999999999997/145, creature-nest-3=163.41999999999996/193

```json
{
  "actions": [
    {
      "id": "action-30-roamer-creature-2-488",
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
      "createdAt": "2026-09-02T16:10:21.736Z"
    },
    {
      "id": "action-30-roamer-creature-3-489",
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
      "createdAt": "2026-09-02T16:10:21.736Z"
    },
    {
      "id": "action-30-roamer-creature-4-490",
      "round": 30,
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
      "createdAt": "2026-09-02T16:10:21.736Z"
    },
    {
      "id": "action-30-roamer-creature-5-491",
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
      "createdAt": "2026-09-02T16:10:21.736Z"
    },
    {
      "id": "action-30-roamer-creature-6-492",
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
      "createdAt": "2026-09-02T16:10:21.736Z"
    },
    {
      "id": "action-30-roamer-creature-8-493",
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
      "createdAt": "2026-09-02T16:10:21.736Z"
    },
    {
      "id": "action-30-roamer-creature-9-494",
      "round": 30,
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
      "createdAt": "2026-09-02T16:10:21.737Z"
    },
    {
      "id": "action-30-nest-creature-2-495",
      "round": 30,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.737Z"
    },
    {
      "id": "action-30-nest-creature-1-496",
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
      "createdAt": "2026-09-02T16:10:21.737Z"
    },
    {
      "id": "action-30-nest-creature-3-497",
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
      "createdAt": "2026-09-02T16:10:21.737Z"
    },
    {
      "id": "action-30-nest-creature-4-498",
      "round": 30,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:21.737Z"
    },
    {
      "id": "action-30-nest-creature-5-499",
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
      "createdAt": "2026-09-02T16:10:21.737Z"
    },
    {
      "id": "action-30-nest-creature-6-500",
      "round": 30,
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
      "createdAt": "2026-09-02T16:10:21.737Z"
    },
    {
      "id": "action-30-nest-creature-7-501",
      "round": 30,
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
      "createdAt": "2026-09-02T16:10:21.737Z"
    },
    {
      "id": "action-30-nest-creature-8-502",
      "round": 30,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.737Z"
    },
    {
      "id": "action-31-player-2-503",
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
      "createdAt": "2026-09-02T16:10:21.738Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": [
    {
      "id": "nest-creature-9",
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
      "spawnedRound": 31,
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

### Turn 130 (round 31)
- Player: 胡斐 (player-2), level 3, experience 74, at (4, 13), health 36, stamina 7.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=155.04999999999993/175, creature-nest-2=136.34999999999997/145, creature-nest-3=163.41999999999996/193

```json
{
  "actions": [
    {
      "id": "action-31-player-2-504",
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
      "createdAt": "2026-09-02T16:10:21.746Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 131 (round 31)
- Player: 胡斐 (player-2), level 3, experience 74, at (5, 13), health 36, stamina 5.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=155.04999999999993/175, creature-nest-2=136.34999999999997/145, creature-nest-3=163.41999999999996/193

```json
{
  "actions": [
    {
      "id": "action-31-player-2-505",
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
          "row": 5,
          "column": 13
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:10:21.753Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 132 (round 31)
- Player: 胡斐 (player-2), level 3, experience 74, at (5, 13), health 36, stamina 3.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=155.04999999999993/175, creature-nest-2=136.34999999999997/145, creature-nest-3=163.41999999999996/193

```json
{
  "actions": [
    {
      "id": "action-31-player-2-506",
      "round": 31,
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
      "createdAt": "2026-09-02T16:10:21.759Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 133 (round 31)
- Player: 胡斐 (player-2), level 3, experience 74, at (5, 13), health 36, stamina 1.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=155.04999999999993/175, creature-nest-2=136.34999999999997/145, creature-nest-3=163.41999999999996/193

```json
{
  "actions": [
    {
      "id": "action-31-player-2-507",
      "round": 31,
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
      "createdAt": "2026-09-02T16:10:21.765Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 134 (round 32)
- Player: 胡斐 (player-2), level 3, experience 77, at (5, 13), health 36, stamina 9.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=156.79999999999993/175, creature-nest-2=137.79999999999995/145, creature-nest-3=165.34999999999997/193

```json
{
  "actions": [
    {
      "id": "action-31-roamer-creature-2-508",
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
      "createdAt": "2026-09-02T16:10:21.768Z"
    },
    {
      "id": "action-31-roamer-creature-3-509",
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
      "createdAt": "2026-09-02T16:10:21.768Z"
    },
    {
      "id": "action-31-roamer-creature-4-510",
      "round": 31,
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
      "createdAt": "2026-09-02T16:10:21.768Z"
    },
    {
      "id": "action-31-roamer-creature-5-511",
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
      "createdAt": "2026-09-02T16:10:21.768Z"
    },
    {
      "id": "action-31-roamer-creature-6-512",
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
      "createdAt": "2026-09-02T16:10:21.768Z"
    },
    {
      "id": "action-31-roamer-creature-8-513",
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
      "createdAt": "2026-09-02T16:10:21.768Z"
    },
    {
      "id": "action-31-roamer-creature-9-514",
      "round": 31,
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
      "createdAt": "2026-09-02T16:10:21.768Z"
    },
    {
      "id": "action-31-nest-creature-2-515",
      "round": 31,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.768Z"
    },
    {
      "id": "action-31-nest-creature-1-516",
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
          "row": 4,
          "column": 8
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T16:10:21.768Z"
    },
    {
      "id": "action-31-nest-creature-3-517",
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
      "createdAt": "2026-09-02T16:10:21.768Z"
    },
    {
      "id": "action-31-nest-creature-4-518",
      "round": 31,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:21.768Z"
    },
    {
      "id": "action-31-nest-creature-5-519",
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
      "createdAt": "2026-09-02T16:10:21.768Z"
    },
    {
      "id": "action-31-nest-creature-6-520",
      "round": 31,
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
      "createdAt": "2026-09-02T16:10:21.768Z"
    },
    {
      "id": "action-31-nest-creature-7-521",
      "round": 31,
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
      "createdAt": "2026-09-02T16:10:21.768Z"
    },
    {
      "id": "action-31-nest-creature-8-522",
      "round": 31,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.768Z"
    },
    {
      "id": "action-31-nest-creature-9-523",
      "round": 31,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.5"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:10:21.768Z"
    },
    {
      "id": "action-32-player-2-524",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.769Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 135 (round 32)
- Player: 胡斐 (player-2), level 3, experience 77, at (5, 13), health 36, stamina 7.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=156.79999999999993/175, creature-nest-2=137.79999999999995/145, creature-nest-3=165.34999999999997/193

```json
{
  "actions": [
    {
      "id": "action-32-player-2-525",
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
      "createdAt": "2026-09-02T16:10:21.775Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 136 (round 32)
- Player: 胡斐 (player-2), level 3, experience 77, at (5, 13), health 36, stamina 5.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=156.79999999999993/175, creature-nest-2=137.79999999999995/145, creature-nest-3=165.34999999999997/193

```json
{
  "actions": [
    {
      "id": "action-32-player-2-526",
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
      "createdAt": "2026-09-02T16:10:21.780Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 137 (round 32)
- Player: 胡斐 (player-2), level 3, experience 77, at (5, 13), health 36, stamina 3.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=156.79999999999993/175, creature-nest-2=137.79999999999995/145, creature-nest-3=165.34999999999997/193

```json
{
  "actions": [
    {
      "id": "action-32-player-2-527",
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
      "createdAt": "2026-09-02T16:10:21.786Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 138 (round 32)
- Player: 胡斐 (player-2), level 3, experience 77, at (5, 13), health 36, stamina 1.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=156.79999999999993/175, creature-nest-2=137.79999999999995/145, creature-nest-3=165.34999999999997/193

```json
{
  "actions": [
    {
      "id": "action-32-player-2-528",
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
      "createdAt": "2026-09-02T16:10:21.792Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 139 (round 33)
- Player: 胡斐 (player-2), level 3, experience 80, at (5, 13), health 36, stamina 9.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=158.54999999999993/175, creature-nest-2=139.24999999999994/145, creature-nest-3=167.27999999999997/193

```json
{
  "actions": [
    {
      "id": "action-32-roamer-creature-2-529",
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
      "createdAt": "2026-09-02T16:10:21.795Z"
    },
    {
      "id": "action-32-roamer-creature-3-530",
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
      "createdAt": "2026-09-02T16:10:21.795Z"
    },
    {
      "id": "action-32-roamer-creature-4-531",
      "round": 32,
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
      "createdAt": "2026-09-02T16:10:21.795Z"
    },
    {
      "id": "action-32-roamer-creature-5-532",
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
      "createdAt": "2026-09-02T16:10:21.795Z"
    },
    {
      "id": "action-32-roamer-creature-6-533",
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
      "createdAt": "2026-09-02T16:10:21.795Z"
    },
    {
      "id": "action-32-roamer-creature-8-534",
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
      "createdAt": "2026-09-02T16:10:21.795Z"
    },
    {
      "id": "action-32-roamer-creature-9-535",
      "round": 32,
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
      "createdAt": "2026-09-02T16:10:21.795Z"
    },
    {
      "id": "action-32-nest-creature-2-536",
      "round": 32,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.795Z"
    },
    {
      "id": "action-32-nest-creature-1-537",
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
          "row": 4,
          "column": 8
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T16:10:21.795Z"
    },
    {
      "id": "action-32-nest-creature-3-538",
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
      "createdAt": "2026-09-02T16:10:21.795Z"
    },
    {
      "id": "action-32-nest-creature-4-539",
      "round": 32,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:21.795Z"
    },
    {
      "id": "action-32-nest-creature-5-540",
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
      "createdAt": "2026-09-02T16:10:21.795Z"
    },
    {
      "id": "action-32-nest-creature-6-541",
      "round": 32,
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
      "createdAt": "2026-09-02T16:10:21.795Z"
    },
    {
      "id": "action-32-nest-creature-7-542",
      "round": 32,
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
      "createdAt": "2026-09-02T16:10:21.795Z"
    },
    {
      "id": "action-32-nest-creature-8-543",
      "round": 32,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.795Z"
    },
    {
      "id": "action-32-nest-creature-9-544",
      "round": 32,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.5"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:10:21.795Z"
    },
    {
      "id": "action-33-player-2-545",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.796Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-6",
      "creatureName": "生物巢穴 3的怪物 Lv.4",
      "message": "生物巢穴 3的怪物 Lv.4 攻擊耕田，造成 7 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 140 (round 33)
- Player: 胡斐 (player-2), level 3, experience 80, at (5, 13), health 36, stamina 7.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=158.54999999999993/175, creature-nest-2=139.24999999999994/145, creature-nest-3=167.27999999999997/193

```json
{
  "actions": [
    {
      "id": "action-33-player-2-546",
      "round": 33,
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
      "createdAt": "2026-09-02T16:10:21.803Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 141 (round 33)
- Player: 胡斐 (player-2), level 3, experience 80, at (5, 13), health 36, stamina 5.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=158.54999999999993/175, creature-nest-2=139.24999999999994/145, creature-nest-3=167.27999999999997/193

```json
{
  "actions": [
    {
      "id": "action-33-player-2-547",
      "round": 33,
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
      "createdAt": "2026-09-02T16:10:21.809Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 142 (round 33)
- Player: 胡斐 (player-2), level 3, experience 80, at (5, 13), health 36, stamina 3.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=158.54999999999993/175, creature-nest-2=139.24999999999994/145, creature-nest-3=167.27999999999997/193

```json
{
  "actions": [
    {
      "id": "action-33-player-2-548",
      "round": 33,
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
      "createdAt": "2026-09-02T16:10:21.815Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 143 (round 33)
- Player: 胡斐 (player-2), level 3, experience 80, at (4, 13), health 36, stamina 1.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=158.54999999999993/175, creature-nest-2=139.24999999999994/145, creature-nest-3=167.27999999999997/193

```json
{
  "actions": [
    {
      "id": "action-33-player-2-549",
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
          "row": 4,
          "column": 13
        },
        "reason": "定位：前往出口 (4,13)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (4,13)",
      "createdAt": "2026-09-02T16:10:21.821Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 144 (round 34)
- Player: 胡斐 (player-2), level 3, experience 83, at (4, 13), health 36, stamina 9.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=160.29999999999993/175, creature-nest-2=140.69999999999993/145, creature-nest-3=169.20999999999998/193

```json
{
  "actions": [
    {
      "id": "action-33-roamer-creature-2-550",
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
      "createdAt": "2026-09-02T16:10:21.824Z"
    },
    {
      "id": "action-33-roamer-creature-3-551",
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
      "createdAt": "2026-09-02T16:10:21.824Z"
    },
    {
      "id": "action-33-roamer-creature-4-552",
      "round": 33,
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
      "createdAt": "2026-09-02T16:10:21.824Z"
    },
    {
      "id": "action-33-roamer-creature-5-553",
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
      "createdAt": "2026-09-02T16:10:21.824Z"
    },
    {
      "id": "action-33-roamer-creature-6-554",
      "round": 33,
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
      "createdAt": "2026-09-02T16:10:21.824Z"
    },
    {
      "id": "action-33-roamer-creature-8-555",
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
      "createdAt": "2026-09-02T16:10:21.824Z"
    },
    {
      "id": "action-33-roamer-creature-9-556",
      "round": 33,
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
      "createdAt": "2026-09-02T16:10:21.824Z"
    },
    {
      "id": "action-33-nest-creature-2-557",
      "round": 33,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.824Z"
    },
    {
      "id": "action-33-nest-creature-1-558",
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
          "row": 4,
          "column": 8
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T16:10:21.824Z"
    },
    {
      "id": "action-33-nest-creature-3-559",
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
      "createdAt": "2026-09-02T16:10:21.824Z"
    },
    {
      "id": "action-33-nest-creature-4-560",
      "round": 33,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:21.824Z"
    },
    {
      "id": "action-33-nest-creature-5-561",
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
      "createdAt": "2026-09-02T16:10:21.824Z"
    },
    {
      "id": "action-33-nest-creature-6-562",
      "round": 33,
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
      "createdAt": "2026-09-02T16:10:21.824Z"
    },
    {
      "id": "action-33-nest-creature-7-563",
      "round": 33,
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
      "createdAt": "2026-09-02T16:10:21.824Z"
    },
    {
      "id": "action-33-nest-creature-8-564",
      "round": 33,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.824Z"
    },
    {
      "id": "action-33-nest-creature-9-565",
      "round": 33,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.5"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:10:21.824Z"
    },
    {
      "id": "action-34-player-2-566",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.825Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 145 (round 34)
- Player: 胡斐 (player-2), level 3, experience 83, at (4, 12), health 36, stamina 7.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=160.29999999999993/175, creature-nest-2=140.69999999999993/145, creature-nest-3=169.20999999999998/193

```json
{
  "actions": [
    {
      "id": "action-34-player-2-567",
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
          "row": 4,
          "column": 12
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:10:21.834Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 146 (round 34)
- Player: 胡斐 (player-2), level 3, experience 83, at (5, 12), health 36, stamina 5.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=160.29999999999993/175, creature-nest-2=140.69999999999993/145, creature-nest-3=169.20999999999998/193

```json
{
  "actions": [
    {
      "id": "action-34-player-2-568",
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
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:10:21.843Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 147 (round 34)
- Player: 胡斐 (player-2), level 3, experience 83, at (6, 12), health 36, stamina 1.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=160.29999999999993/175, creature-nest-2=140.69999999999993/145, creature-nest-3=169.20999999999998/193

```json
{
  "actions": [
    {
      "id": "action-34-player-2-569",
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
          "column": 12
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:10:21.852Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 148 (round 35)
- Player: 胡斐 (player-2), level 3, experience 86, at (6, 12), health 36, stamina 9.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=162.04999999999993/175, creature-nest-2=142.14999999999992/145, creature-nest-3=171.14/193

```json
{
  "actions": [
    {
      "id": "action-34-roamer-creature-2-570",
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
      "createdAt": "2026-09-02T16:10:21.855Z"
    },
    {
      "id": "action-34-roamer-creature-3-571",
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
      "createdAt": "2026-09-02T16:10:21.855Z"
    },
    {
      "id": "action-34-roamer-creature-4-572",
      "round": 34,
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
      "createdAt": "2026-09-02T16:10:21.855Z"
    },
    {
      "id": "action-34-roamer-creature-5-573",
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
      "createdAt": "2026-09-02T16:10:21.855Z"
    },
    {
      "id": "action-34-roamer-creature-6-574",
      "round": 34,
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
      "createdAt": "2026-09-02T16:10:21.855Z"
    },
    {
      "id": "action-34-roamer-creature-8-575",
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
      "createdAt": "2026-09-02T16:10:21.855Z"
    },
    {
      "id": "action-34-roamer-creature-9-576",
      "round": 34,
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
      "createdAt": "2026-09-02T16:10:21.855Z"
    },
    {
      "id": "action-34-nest-creature-2-577",
      "round": 34,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.855Z"
    },
    {
      "id": "action-34-nest-creature-1-578",
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
          "row": 4,
          "column": 8
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T16:10:21.855Z"
    },
    {
      "id": "action-34-nest-creature-3-579",
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
      "createdAt": "2026-09-02T16:10:21.855Z"
    },
    {
      "id": "action-34-nest-creature-4-580",
      "round": 34,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:21.855Z"
    },
    {
      "id": "action-34-nest-creature-5-581",
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
      "createdAt": "2026-09-02T16:10:21.855Z"
    },
    {
      "id": "action-34-nest-creature-6-582",
      "round": 34,
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
      "createdAt": "2026-09-02T16:10:21.855Z"
    },
    {
      "id": "action-34-nest-creature-7-583",
      "round": 34,
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
      "createdAt": "2026-09-02T16:10:21.855Z"
    },
    {
      "id": "action-34-nest-creature-8-584",
      "round": 34,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.855Z"
    },
    {
      "id": "action-34-nest-creature-9-585",
      "round": 34,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.5"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:10:21.855Z"
    },
    {
      "id": "action-35-player-2-586",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.856Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 149 (round 35)
- Player: 胡斐 (player-2), level 3, experience 86, at (6, 11), health 36, stamina 7.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=162.04999999999993/175, creature-nest-2=142.14999999999992/145, creature-nest-3=171.14/193

```json
{
  "actions": [
    {
      "id": "action-35-player-2-587",
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
          "column": 11
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-02T16:10:21.862Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 150 (round 35)
- Player: 胡斐 (player-2), level 3, experience 86, at (5, 11), health 36, stamina 5.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=162.04999999999993/175, creature-nest-2=142.14999999999992/145, creature-nest-3=171.14/193

```json
{
  "actions": [
    {
      "id": "action-35-player-2-588",
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
          "row": 5,
          "column": 11
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:10:21.870Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 151 (round 35)
- Player: 胡斐 (player-2), level 3, experience 86, at (5, 10), health 36, stamina 3.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=162.04999999999993/175, creature-nest-2=142.14999999999992/145, creature-nest-3=171.14/193

```json
{
  "actions": [
    {
      "id": "action-35-player-2-589",
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
          "row": 5,
          "column": 10
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:10:21.879Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 152 (round 35)
- Player: 胡斐 (player-2), level 3, experience 86, at (5, 9), health 36, stamina 1.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=162.04999999999993/175, creature-nest-2=142.14999999999992/145, creature-nest-3=171.14/193

```json
{
  "actions": [
    {
      "id": "action-35-player-2-590",
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
          "row": 5,
          "column": 9
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:10:21.886Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 153 (round 36)
- Player: 胡斐 (player-2), level 3, experience 89, at (5, 9), health 32.8, stamina 9.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=163.79999999999993/175, creature-nest-2=143.5999999999999/145, creature-nest-3=173.07/193

```json
{
  "actions": [
    {
      "id": "action-35-roamer-creature-2-591",
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
      "createdAt": "2026-09-02T16:10:21.889Z"
    },
    {
      "id": "action-35-roamer-creature-3-592",
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
      "createdAt": "2026-09-02T16:10:21.889Z"
    },
    {
      "id": "action-35-roamer-creature-4-593",
      "round": 35,
      "actor": {
        "id": "roamer-creature-4",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "roamer-creature-4",
          "kind": "creature"
        },
        "target": {
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 5,
            "column": 9
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T16:10:21.889Z"
    },
    {
      "id": "action-35-roamer-creature-5-594",
      "round": 35,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "destination": {
          "row": 2,
          "column": 9
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.889Z"
    },
    {
      "id": "action-35-roamer-creature-6-595",
      "round": 35,
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
      "createdAt": "2026-09-02T16:10:21.889Z"
    },
    {
      "id": "action-35-roamer-creature-8-596",
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
      "createdAt": "2026-09-02T16:10:21.889Z"
    },
    {
      "id": "action-35-roamer-creature-9-597",
      "round": 35,
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
      "createdAt": "2026-09-02T16:10:21.889Z"
    },
    {
      "id": "action-35-nest-creature-2-598",
      "round": 35,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.889Z"
    },
    {
      "id": "action-35-nest-creature-1-599",
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
          "row": 4,
          "column": 8
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T16:10:21.889Z"
    },
    {
      "id": "action-35-nest-creature-3-600",
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
      "createdAt": "2026-09-02T16:10:21.889Z"
    },
    {
      "id": "action-35-nest-creature-4-601",
      "round": 35,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:21.889Z"
    },
    {
      "id": "action-35-nest-creature-5-602",
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
      "createdAt": "2026-09-02T16:10:21.889Z"
    },
    {
      "id": "action-35-nest-creature-6-603",
      "round": 35,
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
      "createdAt": "2026-09-02T16:10:21.889Z"
    },
    {
      "id": "action-35-nest-creature-7-604",
      "round": 35,
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
      "createdAt": "2026-09-02T16:10:21.889Z"
    },
    {
      "id": "action-35-nest-creature-8-605",
      "round": 35,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-8",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 9
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.889Z"
    },
    {
      "id": "action-35-nest-creature-9-606",
      "round": 35,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.5"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-9",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T16:10:21.889Z"
    },
    {
      "id": "action-36-player-2-607",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.890Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-6",
      "creatureName": "生物巢穴 3的怪物 Lv.4",
      "message": "生物巢穴 3的怪物 Lv.4 攻擊耕田，造成 7 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 154 (round 36)
- Player: 胡斐 (player-2), level 3, experience 129, at (5, 9), health 32.8, stamina 4.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +40
- Spawned creatures: 0
- Defeated creatures: roamer-creature-4
- Nests: creature-nest-1=163.79999999999993/175, creature-nest-2=143.5999999999999/145, creature-nest-3=173.07/193

```json
{
  "actions": [
    {
      "id": "action-36-player-2-608",
      "round": 36,
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
            "row": 6,
            "column": 9
          }
        },
        "reason": "交戰：攻擊 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 游蕩妖物",
      "createdAt": "2026-09-02T16:10:21.897Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 155 (round 36)
- Player: 胡斐 (player-2), level 3, experience 129, at (6, 9), health 32.8, stamina 2.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=163.79999999999993/175, creature-nest-2=143.5999999999999/145, creature-nest-3=173.07/193

```json
{
  "actions": [
    {
      "id": "action-36-player-2-609",
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
          "column": 9
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:10:21.903Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 156 (round 36)
- Player: 胡斐 (player-2), level 3, experience 129, at (5, 9), health 32.8, stamina 0.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=163.79999999999993/175, creature-nest-2=143.5999999999999/145, creature-nest-3=173.07/193

```json
{
  "actions": [
    {
      "id": "action-36-player-2-610",
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
          "row": 5,
          "column": 9
        },
        "reason": "定位：前往出口 (5,9)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (5,9)",
      "createdAt": "2026-09-02T16:10:21.909Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 157 (round 37)
- Player: 胡斐 (player-2), level 3, experience 130, at (5, 9), health 34.599999999999994, stamina 9.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=165.54999999999993/175, creature-nest-2=145/145, creature-nest-3=175/193

```json
{
  "actions": [
    {
      "id": "action-36-roamer-creature-2-611",
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
      "createdAt": "2026-09-02T16:10:21.911Z"
    },
    {
      "id": "action-36-roamer-creature-3-612",
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
      "createdAt": "2026-09-02T16:10:21.911Z"
    },
    {
      "id": "action-36-roamer-creature-5-613",
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
      "createdAt": "2026-09-02T16:10:21.911Z"
    },
    {
      "id": "action-36-roamer-creature-6-614",
      "round": 36,
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
      "createdAt": "2026-09-02T16:10:21.911Z"
    },
    {
      "id": "action-36-roamer-creature-8-615",
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
      "createdAt": "2026-09-02T16:10:21.911Z"
    },
    {
      "id": "action-36-roamer-creature-9-616",
      "round": 36,
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
      "createdAt": "2026-09-02T16:10:21.911Z"
    },
    {
      "id": "action-36-nest-creature-2-617",
      "round": 36,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.911Z"
    },
    {
      "id": "action-36-nest-creature-1-618",
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
          "row": 4,
          "column": 8
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T16:10:21.911Z"
    },
    {
      "id": "action-36-nest-creature-3-619",
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
      "createdAt": "2026-09-02T16:10:21.911Z"
    },
    {
      "id": "action-36-nest-creature-4-620",
      "round": 36,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:21.911Z"
    },
    {
      "id": "action-36-nest-creature-5-621",
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
      "createdAt": "2026-09-02T16:10:21.911Z"
    },
    {
      "id": "action-36-nest-creature-6-622",
      "round": 36,
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
      "createdAt": "2026-09-02T16:10:21.911Z"
    },
    {
      "id": "action-36-nest-creature-7-623",
      "round": 36,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-7",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 5
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.911Z"
    },
    {
      "id": "action-36-nest-creature-8-624",
      "round": 36,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-8",
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
      "createdAt": "2026-09-02T16:10:21.912Z"
    },
    {
      "id": "action-36-nest-creature-9-625",
      "round": 36,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.5"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-9",
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
      "createdAt": "2026-09-02T16:10:21.912Z"
    },
    {
      "id": "action-37-player-2-626",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.912Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 158 (round 37)
- Player: 胡斐 (player-2), level 3, experience 130, at (5, 8), health 34.599999999999994, stamina 4.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=165.54999999999993/175, creature-nest-2=145/145, creature-nest-3=175/193

```json
{
  "actions": [
    {
      "id": "action-37-player-2-627",
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
          "column": 8
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:10:21.918Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 159 (round 37)
- Player: 胡斐 (player-2), level 3, experience 130, at (5, 9), health 34.599999999999994, stamina 2.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=165.54999999999993/175, creature-nest-2=145/145, creature-nest-3=175/193

```json
{
  "actions": [
    {
      "id": "action-37-player-2-628",
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
          "column": 9
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:10:21.926Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 160 (round 37)
- Player: 胡斐 (player-2), level 3, experience 130, at (5, 10), health 34.599999999999994, stamina 0.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=165.54999999999993/175, creature-nest-2=145/145, creature-nest-3=175/193

```json
{
  "actions": [
    {
      "id": "action-37-player-2-629",
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
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:10:21.932Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 161 (round 38)
- Player: 胡斐 (player-2), level 3, experience 131, at (5, 10), health 36, stamina 9.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=167.29999999999993/175, creature-nest-2=145/145, creature-nest-3=176.93/193

```json
{
  "actions": [
    {
      "id": "action-37-roamer-creature-2-630",
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
      "createdAt": "2026-09-02T16:10:21.934Z"
    },
    {
      "id": "action-37-roamer-creature-3-631",
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
      "createdAt": "2026-09-02T16:10:21.934Z"
    },
    {
      "id": "action-37-roamer-creature-5-632",
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
      "createdAt": "2026-09-02T16:10:21.934Z"
    },
    {
      "id": "action-37-roamer-creature-6-633",
      "round": 37,
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
      "createdAt": "2026-09-02T16:10:21.934Z"
    },
    {
      "id": "action-37-roamer-creature-8-634",
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
      "createdAt": "2026-09-02T16:10:21.934Z"
    },
    {
      "id": "action-37-roamer-creature-9-635",
      "round": 37,
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
      "createdAt": "2026-09-02T16:10:21.934Z"
    },
    {
      "id": "action-37-nest-creature-2-636",
      "round": 37,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.934Z"
    },
    {
      "id": "action-37-nest-creature-1-637",
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
          "row": 4,
          "column": 8
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T16:10:21.934Z"
    },
    {
      "id": "action-37-nest-creature-3-638",
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
      "createdAt": "2026-09-02T16:10:21.934Z"
    },
    {
      "id": "action-37-nest-creature-4-639",
      "round": 37,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:21.934Z"
    },
    {
      "id": "action-37-nest-creature-5-640",
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
      "createdAt": "2026-09-02T16:10:21.934Z"
    },
    {
      "id": "action-37-nest-creature-6-641",
      "round": 37,
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
          "id": "resource-point-2",
          "kind": "resource",
          "position": {
            "row": 4,
            "column": 12
          }
        },
        "reason": "與 耕田 交戰。"
      },
      "result": "succeeded",
      "reason": "與 耕田 交戰。",
      "createdAt": "2026-09-02T16:10:21.934Z"
    },
    {
      "id": "action-37-nest-creature-7-642",
      "round": 37,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-7",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 5
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T16:10:21.934Z"
    },
    {
      "id": "action-37-nest-creature-8-643",
      "round": 37,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-8",
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
      "createdAt": "2026-09-02T16:10:21.934Z"
    },
    {
      "id": "action-37-nest-creature-9-644",
      "round": 37,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.5"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-9",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T16:10:21.934Z"
    },
    {
      "id": "action-38-player-2-645",
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
      "createdAt": "2026-09-02T16:10:21.935Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 162 (round 38)
- Player: 胡斐 (player-2), level 3, experience 134, at (5, 10), health 36, stamina 4.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=167.29999999999993/175, creature-nest-2=145/145, creature-nest-3=176.93/193

```json
{
  "actions": [
    {
      "id": "action-38-player-2-646",
      "round": 38,
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
          "id": "nest-creature-9",
          "kind": "creature",
          "position": {
            "row": 5,
            "column": 9
          }
        },
        "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.5"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.5",
      "createdAt": "2026-09-02T16:10:21.942Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 163 (round 38)
- Player: 胡斐 (player-2), level 3, experience 134, at (5, 11), health 36, stamina 2.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=167.29999999999993/175, creature-nest-2=145/145, creature-nest-3=176.93/193

```json
{
  "actions": [
    {
      "id": "action-38-player-2-647",
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
          "column": 11
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:10:21.949Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 164 (round 38)
- Player: 胡斐 (player-2), level 3, experience 134, at (6, 11), health 36, stamina 0.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=167.29999999999993/175, creature-nest-2=145/145, creature-nest-3=176.93/193

```json
{
  "actions": [
    {
      "id": "action-38-player-2-648",
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
          "row": 6,
          "column": 11
        },
        "reason": "定位：前往出口 (6,11)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (6,11)",
      "createdAt": "2026-09-02T16:10:21.955Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 165 (round 39)
- Player: 胡斐 (player-2), level 3, experience 135, at (6, 11), health 36, stamina 9.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +1
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=169.04999999999993/175, creature-nest-2=145/159, creature-nest-3=178.86/193

```json
{
  "actions": [
    {
      "id": "action-38-roamer-creature-2-649",
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
      "createdAt": "2026-09-02T16:10:21.958Z"
    },
    {
      "id": "action-38-roamer-creature-3-650",
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
      "createdAt": "2026-09-02T16:10:21.958Z"
    },
    {
      "id": "action-38-roamer-creature-5-651",
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
      "createdAt": "2026-09-02T16:10:21.958Z"
    },
    {
      "id": "action-38-roamer-creature-6-652",
      "round": 38,
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
      "createdAt": "2026-09-02T16:10:21.958Z"
    },
    {
      "id": "action-38-roamer-creature-8-653",
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
      "createdAt": "2026-09-02T16:10:21.958Z"
    },
    {
      "id": "action-38-roamer-creature-9-654",
      "round": 38,
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
      "createdAt": "2026-09-02T16:10:21.958Z"
    },
    {
      "id": "action-38-nest-creature-2-655",
      "round": 38,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.958Z"
    },
    {
      "id": "action-38-nest-creature-1-656",
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
          "row": 4,
          "column": 8
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T16:10:21.958Z"
    },
    {
      "id": "action-38-nest-creature-3-657",
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
      "createdAt": "2026-09-02T16:10:21.958Z"
    },
    {
      "id": "action-38-nest-creature-4-658",
      "round": 38,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:21.958Z"
    },
    {
      "id": "action-38-nest-creature-5-659",
      "round": 38,
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
      "createdAt": "2026-09-02T16:10:21.958Z"
    },
    {
      "id": "action-38-nest-creature-6-660",
      "round": 38,
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
          "id": "resource-point-2",
          "kind": "resource",
          "position": {
            "row": 4,
            "column": 12
          }
        },
        "reason": "與 耕田 交戰。"
      },
      "result": "succeeded",
      "reason": "與 耕田 交戰。",
      "createdAt": "2026-09-02T16:10:21.958Z"
    },
    {
      "id": "action-38-nest-creature-7-661",
      "round": 38,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-7",
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
      "createdAt": "2026-09-02T16:10:21.958Z"
    },
    {
      "id": "action-38-nest-creature-8-662",
      "round": 38,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-8",
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
      "createdAt": "2026-09-02T16:10:21.958Z"
    },
    {
      "id": "action-38-nest-creature-9-663",
      "round": 38,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.5"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-9",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 10
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T16:10:21.958Z"
    },
    {
      "id": "action-39-player-2-664",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.959Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "creature-nest-2",
      "creatureName": "生物巢穴 2",
      "message": "生物巢穴 2 生成了 Lv.3 怪物。"
    }
  ],
  "spawnedCreatures": [
    {
      "id": "nest-creature-10",
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
      "spawnedRound": 39,
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

### Turn 166 (round 39)
- Player: 胡斐 (player-2), level 3, experience 135, at (6, 12), health 36, stamina 5.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=169.04999999999993/175, creature-nest-2=145/159, creature-nest-3=178.86/193

```json
{
  "actions": [
    {
      "id": "action-39-player-2-665",
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
          "row": 6,
          "column": 12
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:10:21.966Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 167 (round 39)
- Player: 胡斐 (player-2), level 3, experience 138, at (6, 12), health 36, stamina 0.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=169.04999999999993/175, creature-nest-2=145/159, creature-nest-3=178.86/193

```json
{
  "actions": [
    {
      "id": "action-39-player-2-666",
      "round": 39,
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
          "id": "nest-creature-6",
          "kind": "creature",
          "position": {
            "row": 5,
            "column": 12
          }
        },
        "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.4"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.4",
      "createdAt": "2026-09-02T16:10:21.971Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 168 (round 40)
- Player: 胡斐 (player-2), level 3, experience 139, at (6, 12), health 36, stamina 9.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=170.79999999999993/175, creature-nest-2=146.59/159, creature-nest-3=180.79000000000002/193

```json
{
  "actions": [
    {
      "id": "action-39-roamer-creature-2-667",
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
      "createdAt": "2026-09-02T16:10:21.973Z"
    },
    {
      "id": "action-39-roamer-creature-3-668",
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
      "createdAt": "2026-09-02T16:10:21.973Z"
    },
    {
      "id": "action-39-roamer-creature-5-669",
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
      "createdAt": "2026-09-02T16:10:21.973Z"
    },
    {
      "id": "action-39-roamer-creature-6-670",
      "round": 39,
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
      "createdAt": "2026-09-02T16:10:21.973Z"
    },
    {
      "id": "action-39-roamer-creature-8-671",
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
      "createdAt": "2026-09-02T16:10:21.973Z"
    },
    {
      "id": "action-39-roamer-creature-9-672",
      "round": 39,
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
      "createdAt": "2026-09-02T16:10:21.973Z"
    },
    {
      "id": "action-39-nest-creature-2-673",
      "round": 39,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.973Z"
    },
    {
      "id": "action-39-nest-creature-1-674",
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
          "row": 4,
          "column": 8
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T16:10:21.973Z"
    },
    {
      "id": "action-39-nest-creature-3-675",
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
      "createdAt": "2026-09-02T16:10:21.973Z"
    },
    {
      "id": "action-39-nest-creature-4-676",
      "round": 39,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:21.973Z"
    },
    {
      "id": "action-39-nest-creature-5-677",
      "round": 39,
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
      "createdAt": "2026-09-02T16:10:21.973Z"
    },
    {
      "id": "action-39-nest-creature-6-678",
      "round": 39,
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
          "id": "resource-point-2",
          "kind": "resource",
          "position": {
            "row": 4,
            "column": 12
          }
        },
        "reason": "與 耕田 交戰。"
      },
      "result": "succeeded",
      "reason": "與 耕田 交戰。",
      "createdAt": "2026-09-02T16:10:21.974Z"
    },
    {
      "id": "action-39-nest-creature-7-679",
      "round": 39,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-7",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 7
        },
        "reason": "移動接近 襄陽。"
      },
      "result": "succeeded",
      "reason": "移動接近 襄陽。",
      "createdAt": "2026-09-02T16:10:21.974Z"
    },
    {
      "id": "action-39-nest-creature-8-680",
      "round": 39,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-8",
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
      "createdAt": "2026-09-02T16:10:21.974Z"
    },
    {
      "id": "action-39-nest-creature-9-681",
      "round": 39,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.5"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-9",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 11
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T16:10:21.974Z"
    },
    {
      "id": "action-39-nest-creature-10-682",
      "round": 39,
      "actor": {
        "id": "nest-creature-10",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:10:21.974Z"
    },
    {
      "id": "action-40-player-2-683",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.974Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 169 (round 40)
- Player: 胡斐 (player-2), level 4, experience 69, at (6, 12), health 36, stamina 4.5
- Attributes: armStrength=11, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: -70 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: nest-creature-6
- Nests: creature-nest-1=170.79999999999993/175, creature-nest-2=146.59/159, creature-nest-3=180.79000000000002/193

```json
{
  "actions": [
    {
      "id": "action-40-player-2-684",
      "round": 40,
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
          "id": "nest-creature-6",
          "kind": "creature",
          "position": {
            "row": 5,
            "column": 12
          }
        },
        "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.4"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.4",
      "createdAt": "2026-09-02T16:10:21.979Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 170 (round 40)
- Player: 胡斐 (player-2), level 4, experience 69, at (6, 12), health 36, stamina 4.5
- Attributes: armStrength=12, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=170.79999999999993/175, creature-nest-2=146.59/159, creature-nest-3=180.79000000000002/193

```json
{
  "actions": [
    {
      "id": "action-40-player-2-685",
      "round": 40,
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
      "createdAt": "2026-09-02T16:10:21.983Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 171 (round 40)
- Player: 胡斐 (player-2), level 4, experience 69, at (6, 12), health 36, stamina 4.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=170.79999999999993/175, creature-nest-2=146.59/159, creature-nest-3=180.79000000000002/193

```json
{
  "actions": [
    {
      "id": "action-40-player-2-686",
      "round": 40,
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
      "createdAt": "2026-09-02T16:10:21.988Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 172 (round 40)
- Player: 胡斐 (player-2), level 4, experience 69, at (6, 12), health 36, stamina 2.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=170.79999999999993/175, creature-nest-2=146.59/159, creature-nest-3=180.79000000000002/193

```json
{
  "actions": [
    {
      "id": "action-40-player-2-687",
      "round": 40,
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
      "createdAt": "2026-09-02T16:10:21.992Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 173 (round 40)
- Player: 胡斐 (player-2), level 4, experience 69, at (6, 12), health 36, stamina 0.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=170.79999999999993/175, creature-nest-2=146.59/159, creature-nest-3=180.79000000000002/193

```json
{
  "actions": [
    {
      "id": "action-40-player-2-688",
      "round": 40,
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
      "createdAt": "2026-09-02T16:10:21.996Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 174 (round 41)
- Player: 胡斐 (player-2), level 4, experience 70, at (6, 12), health 36, stamina 10.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=172.54999999999993/175, creature-nest-2=148.18/159, creature-nest-3=182.72000000000003/193

```json
{
  "actions": [
    {
      "id": "action-40-roamer-creature-2-689",
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
      "createdAt": "2026-09-02T16:10:21.998Z"
    },
    {
      "id": "action-40-roamer-creature-3-690",
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
      "createdAt": "2026-09-02T16:10:21.998Z"
    },
    {
      "id": "action-40-roamer-creature-5-691",
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
      "createdAt": "2026-09-02T16:10:21.998Z"
    },
    {
      "id": "action-40-roamer-creature-6-692",
      "round": 40,
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
      "createdAt": "2026-09-02T16:10:21.998Z"
    },
    {
      "id": "action-40-roamer-creature-8-693",
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
      "createdAt": "2026-09-02T16:10:21.998Z"
    },
    {
      "id": "action-40-roamer-creature-9-694",
      "round": 40,
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
      "createdAt": "2026-09-02T16:10:21.998Z"
    },
    {
      "id": "action-40-nest-creature-2-695",
      "round": 40,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:21.998Z"
    },
    {
      "id": "action-40-nest-creature-1-696",
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
          "row": 4,
          "column": 8
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T16:10:21.998Z"
    },
    {
      "id": "action-40-nest-creature-3-697",
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
      "createdAt": "2026-09-02T16:10:21.998Z"
    },
    {
      "id": "action-40-nest-creature-4-698",
      "round": 40,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:21.998Z"
    },
    {
      "id": "action-40-nest-creature-5-699",
      "round": 40,
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
      "createdAt": "2026-09-02T16:10:21.998Z"
    },
    {
      "id": "action-40-nest-creature-7-700",
      "round": 40,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-7",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 7
        },
        "reason": "移動接近 襄陽。"
      },
      "result": "succeeded",
      "reason": "移動接近 襄陽。",
      "createdAt": "2026-09-02T16:10:21.998Z"
    },
    {
      "id": "action-40-nest-creature-8-701",
      "round": 40,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-8",
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
      "createdAt": "2026-09-02T16:10:21.998Z"
    },
    {
      "id": "action-40-nest-creature-9-702",
      "round": 40,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.5"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-9",
          "kind": "creature"
        },
        "target": {
          "id": "resource-point-2",
          "kind": "resource",
          "position": {
            "row": 4,
            "column": 12
          }
        },
        "reason": "與 耕田 交戰。"
      },
      "result": "succeeded",
      "reason": "與 耕田 交戰。",
      "createdAt": "2026-09-02T16:10:21.998Z"
    },
    {
      "id": "action-40-nest-creature-10-703",
      "round": 40,
      "actor": {
        "id": "nest-creature-10",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:10:21.998Z"
    },
    {
      "id": "action-41-player-2-704",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:21.999Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 175 (round 41)
- Player: 胡斐 (player-2), level 4, experience 170, at (6, 12), health 36, stamina 5.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +100
- Spawned creatures: 0
- Defeated creatures: nest-creature-9
- Nests: creature-nest-1=172.54999999999993/175, creature-nest-2=148.18/159, creature-nest-3=182.72000000000003/193

```json
{
  "actions": [
    {
      "id": "action-41-player-2-705",
      "round": 41,
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
          "id": "nest-creature-9",
          "kind": "creature",
          "position": {
            "row": 5,
            "column": 12
          }
        },
        "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.5"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.5",
      "createdAt": "2026-09-02T16:10:22.005Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 176 (round 41)
- Player: 胡斐 (player-2), level 4, experience 170, at (6, 12), health 36, stamina 2.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=172.54999999999993/175, creature-nest-2=148.18/159, creature-nest-3=182.72000000000003/193

```json
{
  "actions": [
    {
      "id": "action-41-player-2-706",
      "round": 41,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "build",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "baseId": "base-1",
        "buildingType": "building-type-equipment-shop",
        "reason": "建設：建造 裝備商店"
      },
      "result": "succeeded",
      "reason": "建設：建造 裝備商店",
      "createdAt": "2026-09-02T16:10:22.008Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 177 (round 41)
- Player: 胡斐 (player-2), level 4, experience 170, at (6, 12), health 36, stamina 0.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=172.54999999999993/175, creature-nest-2=148.18/159, creature-nest-3=182.72000000000003/193

```json
{
  "actions": [
    {
      "id": "action-41-player-2-707",
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
      "createdAt": "2026-09-02T16:10:22.011Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 178 (round 42)
- Player: 胡斐 (player-2), level 4, experience 171, at (6, 12), health 36, stamina 10.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +1
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=174.29999999999993/193, creature-nest-2=149.77/159, creature-nest-3=184.65000000000003/193

```json
{
  "actions": [
    {
      "id": "action-41-roamer-creature-2-708",
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
      "createdAt": "2026-09-02T16:10:22.012Z"
    },
    {
      "id": "action-41-roamer-creature-3-709",
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
      "createdAt": "2026-09-02T16:10:22.013Z"
    },
    {
      "id": "action-41-roamer-creature-5-710",
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
      "createdAt": "2026-09-02T16:10:22.013Z"
    },
    {
      "id": "action-41-roamer-creature-6-711",
      "round": 41,
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
      "createdAt": "2026-09-02T16:10:22.013Z"
    },
    {
      "id": "action-41-roamer-creature-8-712",
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
      "createdAt": "2026-09-02T16:10:22.013Z"
    },
    {
      "id": "action-41-roamer-creature-9-713",
      "round": 41,
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
      "createdAt": "2026-09-02T16:10:22.013Z"
    },
    {
      "id": "action-41-nest-creature-2-714",
      "round": 41,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:22.013Z"
    },
    {
      "id": "action-41-nest-creature-1-715",
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
          "row": 4,
          "column": 8
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T16:10:22.013Z"
    },
    {
      "id": "action-41-nest-creature-3-716",
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
      "createdAt": "2026-09-02T16:10:22.013Z"
    },
    {
      "id": "action-41-nest-creature-4-717",
      "round": 41,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:22.013Z"
    },
    {
      "id": "action-41-nest-creature-5-718",
      "round": 41,
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
      "createdAt": "2026-09-02T16:10:22.013Z"
    },
    {
      "id": "action-41-nest-creature-7-719",
      "round": 41,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-7",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 7
        },
        "reason": "移動接近 襄陽。"
      },
      "result": "succeeded",
      "reason": "移動接近 襄陽。",
      "createdAt": "2026-09-02T16:10:22.013Z"
    },
    {
      "id": "action-41-nest-creature-8-720",
      "round": 41,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-8",
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
      "createdAt": "2026-09-02T16:10:22.013Z"
    },
    {
      "id": "action-41-nest-creature-10-721",
      "round": 41,
      "actor": {
        "id": "nest-creature-10",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:10:22.013Z"
    },
    {
      "id": "action-42-player-2-722",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:22.014Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": [
    {
      "id": "nest-creature-6",
      "name": "生物巢穴 1的怪物 Lv.5",
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
      "behaviorType": "sieger",
      "schoolId": "void-spirit",
      "homePosition": {
        "row": 13,
        "column": 2
      },
      "homeNestId": "creature-nest-1",
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

### Turn 179 (round 42)
- Player: 胡斐 (player-2), level 4, experience 171, at (6, 12), health 36, stamina 7.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=174.29999999999993/193, creature-nest-2=149.77/159, creature-nest-3=184.65000000000003/193

```json
{
  "actions": [
    {
      "id": "action-42-player-2-723",
      "round": 42,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "upgrade",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "baseId": "base-1",
        "buildingId": "base-1-equipment-shop-2",
        "reason": "建設：升級 裝備商店 至 Lv.2"
      },
      "result": "succeeded",
      "reason": "建設：升級 裝備商店 至 Lv.2",
      "createdAt": "2026-09-02T16:10:22.018Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 180 (round 42)
- Player: 胡斐 (player-2), level 4, experience 171, at (6, 12), health 36, stamina 7.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=174.29999999999993/193, creature-nest-2=149.77/159, creature-nest-3=184.65000000000003/193

```json
{
  "actions": [
    {
      "id": "action-42-player-2-724",
      "round": 42,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "buy-equipment",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "baseId": "base-1",
        "equipmentId": "iron-sword",
        "reason": "購買裝備：購買 精鐵劍"
      },
      "result": "succeeded",
      "reason": "購買裝備：購買 精鐵劍",
      "createdAt": "2026-09-02T16:10:22.021Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 181 (round 42)
- Player: 胡斐 (player-2), level 4, experience 171, at (6, 12), health 36, stamina 7.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=174.29999999999993/193, creature-nest-2=149.77/159, creature-nest-3=184.65000000000003/193

```json
{
  "actions": [
    {
      "id": "action-42-player-2-725",
      "round": 42,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "buy-equipment",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "baseId": "base-1",
        "equipmentId": "traveling-robe",
        "reason": "購買裝備：購買 行者護衣"
      },
      "result": "succeeded",
      "reason": "購買裝備：購買 行者護衣",
      "createdAt": "2026-09-02T16:10:22.025Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 182 (round 42)
- Player: 胡斐 (player-2), level 4, experience 171, at (6, 12), health 36, stamina 7.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=174.29999999999993/193, creature-nest-2=149.77/159, creature-nest-3=184.65000000000003/193

```json
{
  "actions": [
    {
      "id": "action-42-player-2-726",
      "round": 42,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "buy-equipment",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "baseId": "base-1",
        "equipmentId": "jade-pendant",
        "reason": "購買裝備：購買 溫玉佩"
      },
      "result": "succeeded",
      "reason": "購買裝備：購買 溫玉佩",
      "createdAt": "2026-09-02T16:10:22.028Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 183 (round 42)
- Player: 胡斐 (player-2), level 4, experience 171, at (6, 12), health 36, stamina 4.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=174.29999999999993/193, creature-nest-2=149.77/159, creature-nest-3=184.65000000000003/193

```json
{
  "actions": [
    {
      "id": "action-42-player-2-727",
      "round": 42,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "build",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "baseId": "base-1",
        "buildingType": "building-type-waystation",
        "reason": "建設：建造 驛站"
      },
      "result": "succeeded",
      "reason": "建設：建造 驛站",
      "createdAt": "2026-09-02T16:10:22.031Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 184 (round 42)
- Player: 胡斐 (player-2), level 4, experience 171, at (6, 12), health 36, stamina 1.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=174.29999999999993/193, creature-nest-2=149.77/159, creature-nest-3=184.65000000000003/193

```json
{
  "actions": [
    {
      "id": "action-42-player-2-728",
      "round": 42,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "build",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "baseId": "base-1",
        "buildingType": "building-type-item-shop",
        "reason": "建設：建造 道具商店"
      },
      "result": "succeeded",
      "reason": "建設：建造 道具商店",
      "createdAt": "2026-09-02T16:10:22.033Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 185 (round 42)
- Player: 胡斐 (player-2), level 4, experience 171, at (6, 12), health 36, stamina 1.5
- Attributes: armStrength=15, constitution=12, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=174.29999999999993/193, creature-nest-2=149.77/159, creature-nest-3=184.65000000000003/193

```json
{
  "actions": [
    {
      "id": "action-42-player-2-729",
      "round": 42,
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
        "instanceId": "player-2-iron-sword-1788365422021",
        "reason": "裝備：精鐵劍（weapon）"
      },
      "result": "succeeded",
      "reason": "裝備：精鐵劍（weapon）",
      "createdAt": "2026-09-02T16:10:22.036Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 186 (round 42)
- Player: 胡斐 (player-2), level 4, experience 171, at (6, 12), health 36, stamina 1.5
- Attributes: armStrength=15, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=174.29999999999993/193, creature-nest-2=149.77/159, creature-nest-3=184.65000000000003/193

```json
{
  "actions": [
    {
      "id": "action-42-player-2-730",
      "round": 42,
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
        "instanceId": "player-2-traveling-robe-1788365422025",
        "reason": "裝備：行者護衣（armor）"
      },
      "result": "succeeded",
      "reason": "裝備：行者護衣（armor）",
      "createdAt": "2026-09-02T16:10:22.039Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 187 (round 42)
- Player: 胡斐 (player-2), level 4, experience 171, at (6, 12), health 36, stamina 1.5
- Attributes: armStrength=15, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=174.29999999999993/193, creature-nest-2=149.77/159, creature-nest-3=184.65000000000003/193

```json
{
  "actions": [
    {
      "id": "action-42-player-2-731",
      "round": 42,
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
        "instanceId": "player-2-jade-pendant-1788365422028",
        "reason": "裝備：溫玉佩（accessory）"
      },
      "result": "succeeded",
      "reason": "裝備：溫玉佩（accessory）",
      "createdAt": "2026-09-02T16:10:22.041Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 188 (round 43)
- Player: 胡斐 (player-2), level 4, experience 174, at (6, 12), health 37.95, stamina 12
- Attributes: armStrength=15, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=176.22999999999993/193, creature-nest-2=151.36/159, creature-nest-3=186.58000000000004/193

```json
{
  "actions": [
    {
      "id": "action-42-roamer-creature-2-732",
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
      "createdAt": "2026-09-02T16:10:22.043Z"
    },
    {
      "id": "action-42-roamer-creature-3-733",
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
      "createdAt": "2026-09-02T16:10:22.043Z"
    },
    {
      "id": "action-42-roamer-creature-5-734",
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
      "createdAt": "2026-09-02T16:10:22.043Z"
    },
    {
      "id": "action-42-roamer-creature-6-735",
      "round": 42,
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
      "createdAt": "2026-09-02T16:10:22.043Z"
    },
    {
      "id": "action-42-roamer-creature-8-736",
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
      "createdAt": "2026-09-02T16:10:22.043Z"
    },
    {
      "id": "action-42-roamer-creature-9-737",
      "round": 42,
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
      "createdAt": "2026-09-02T16:10:22.043Z"
    },
    {
      "id": "action-42-nest-creature-2-738",
      "round": 42,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T16:10:22.043Z"
    },
    {
      "id": "action-42-nest-creature-1-739",
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
          "row": 4,
          "column": 8
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T16:10:22.043Z"
    },
    {
      "id": "action-42-nest-creature-3-740",
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
      "createdAt": "2026-09-02T16:10:22.043Z"
    },
    {
      "id": "action-42-nest-creature-4-741",
      "round": 42,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:10:22.043Z"
    },
    {
      "id": "action-42-nest-creature-5-742",
      "round": 42,
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
      "createdAt": "2026-09-02T16:10:22.043Z"
    },
    {
      "id": "action-42-nest-creature-7-743",
      "round": 42,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-7",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 7
        },
        "reason": "移動接近 襄陽。"
      },
      "result": "succeeded",
      "reason": "移動接近 襄陽。",
      "createdAt": "2026-09-02T16:10:22.043Z"
    },
    {
      "id": "action-42-nest-creature-8-744",
      "round": 42,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-8",
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
      "createdAt": "2026-09-02T16:10:22.043Z"
    },
    {
      "id": "action-42-nest-creature-10-745",
      "round": 42,
      "actor": {
        "id": "nest-creature-10",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:10:22.043Z"
    },
    {
      "id": "action-42-nest-creature-6-746",
      "round": 42,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.5"
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
      "createdAt": "2026-09-02T16:10:22.044Z"
    },
    {
      "id": "action-43-player-2-747",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:10:22.044Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 189 (round 43)
- Player: 胡斐 (player-2), level 4, experience 174, at (6, 12), health 37.95, stamina 12
- Attributes: armStrength=15, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=176.22999999999993/193, creature-nest-2=151.36/159, creature-nest-3=186.58000000000004/193

```json
{
  "actions": [
    {
      "id": "action-43-player-2-748",
      "round": 43,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "buy-item",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "baseId": "base-1",
        "itemId": "recover-qi-pill",
        "reason": "購買道具：購買 回氣丹"
      },
      "result": "succeeded",
      "reason": "購買道具：購買 回氣丹",
      "createdAt": "2026-09-02T16:10:22.049Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 190 (round 43)
- Player: 胡斐 (player-2), level 4, experience 174, at (6, 12), health 37.95, stamina 12
- Attributes: armStrength=15, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=176.22999999999993/193, creature-nest-2=151.36/159, creature-nest-3=186.58000000000004/193

```json
{
  "actions": [
    {
      "id": "action-43-player-2-749",
      "round": 43,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "buy-item",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "baseId": "base-1",
        "itemId": "great-strength-pill",
        "reason": "購買道具：購買 大力丸"
      },
      "result": "succeeded",
      "reason": "購買道具：購買 大力丸",
      "createdAt": "2026-09-02T16:10:22.054Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 191 (round 43)
- Player: 胡斐 (player-2), level 4, experience 174, at (6, 12), health 37.95, stamina 10
- Attributes: armStrength=15, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=176.22999999999993/193, creature-nest-2=151.36/159, creature-nest-3=186.58000000000004/193

```json
{
  "actions": [
    {
      "id": "action-43-player-2-750",
      "round": 43,
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
      "createdAt": "2026-09-02T16:10:22.058Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 192 (round 43)
- Player: 胡斐 (player-2), level 4, experience 174, at (6, 12), health 37.95, stamina 8
- Attributes: armStrength=15, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=176.22999999999993/193, creature-nest-2=151.36/159, creature-nest-3=186.58000000000004/193

```json
{
  "actions": [
    {
      "id": "action-43-player-2-751",
      "round": 43,
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
      "createdAt": "2026-09-02T16:10:22.061Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 193 (round 43)
- Player: 胡斐 (player-2), level 4, experience 174, at (6, 12), health 37.95, stamina 6
- Attributes: armStrength=15, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=176.22999999999993/193, creature-nest-2=151.36/159, creature-nest-3=186.58000000000004/193

```json
{
  "actions": [
    {
      "id": "action-43-player-2-752",
      "round": 43,
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
      "createdAt": "2026-09-02T16:10:22.064Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 194 (round 43)
- Player: 胡斐 (player-2), level 4, experience 174, at (6, 12), health 37.95, stamina 4
- Attributes: armStrength=15, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=176.22999999999993/193, creature-nest-2=151.36/159, creature-nest-3=186.58000000000004/193

```json
{
  "actions": [
    {
      "id": "action-43-player-2-753",
      "round": 43,
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
      "createdAt": "2026-09-02T16:10:22.067Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 195 (round 43)
- Player: 胡斐 (player-2), level 4, experience 174, at (6, 12), health 37.95, stamina 2
- Attributes: armStrength=15, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=176.22999999999993/193, creature-nest-2=151.36/159, creature-nest-3=186.58000000000004/193

```json
{
  "actions": [
    {
      "id": "action-43-player-2-754",
      "round": 43,
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
      "createdAt": "2026-09-02T16:10:22.070Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 196 (round 43)
- Player: 胡斐 (player-2), level 4, experience 174, at (6, 12), health 37.95, stamina 8
- Attributes: armStrength=15, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=176.22999999999993/193, creature-nest-2=151.36/159, creature-nest-3=186.58000000000004/193

```json
{
  "actions": [
    {
      "id": "action-43-player-2-755",
      "round": 43,
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
        "itemId": "recover-qi-pill",
        "reason": "使用道具：回氣丹"
      },
      "result": "succeeded",
      "reason": "使用道具：回氣丹",
      "createdAt": "2026-09-02T16:10:22.072Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 197 (round 43)
- Player: 胡斐 (player-2), level 4, experience 174, at (6, 12), health 37.95, stamina 6
- Attributes: armStrength=15, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=176.22999999999993/193, creature-nest-2=151.36/159, creature-nest-3=186.58000000000004/193

```json
{
  "actions": [
    {
      "id": "action-43-player-2-756",
      "round": 43,
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
      "createdAt": "2026-09-02T16:10:22.075Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 198 (round 43)
- Player: 胡斐 (player-2), level 4, experience 174, at (6, 12), health 37.95, stamina 4
- Attributes: armStrength=15, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=176.22999999999993/193, creature-nest-2=151.36/159, creature-nest-3=186.58000000000004/193

```json
{
  "actions": [
    {
      "id": "action-43-player-2-757",
      "round": 43,
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
      "createdAt": "2026-09-02T16:10:22.078Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 199 (round 43)
- Player: 胡斐 (player-2), level 4, experience 174, at (6, 12), health 37.95, stamina 2
- Attributes: armStrength=15, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=176.22999999999993/193, creature-nest-2=151.36/159, creature-nest-3=186.58000000000004/193

```json
{
  "actions": [
    {
      "id": "action-43-player-2-758",
      "round": 43,
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
      "createdAt": "2026-09-02T16:10:22.082Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 200 (round 43)
- Player: 胡斐 (player-2), level 4, experience 174, at (6, 12), health 37.95, stamina 2
- Attributes: armStrength=16, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 21
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=176.22999999999993/193, creature-nest-2=151.36/159, creature-nest-3=186.58000000000004/193

```json
{
  "actions": [
    {
      "id": "action-43-player-2-759",
      "round": 43,
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
        "itemId": "great-strength-pill",
        "reason": "使用道具：大力丸"
      },
      "result": "succeeded",
      "reason": "使用道具：大力丸",
      "createdAt": "2026-09-02T16:10:22.084Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

