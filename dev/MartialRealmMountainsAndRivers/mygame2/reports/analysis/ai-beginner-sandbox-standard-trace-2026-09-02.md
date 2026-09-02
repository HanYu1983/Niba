# AI Beginner Sandbox Standard Trace

- AI turns: 190
- Final round: 44
- Game won: false
- Game over: true
- Remaining nests: 3

## Aggregate

- Action counts: hold=411, move=164, attack=80, end-turn=43, collect=11, allocate-attribute=10, practice-skill=4, learn-skill=3, use-item=3, equip=2, equip-inner-skill=1, equip-external-skill=1
- Creatures spawned (total): 17
- Creatures defeated (total): 15
- Level-ups observed: 5
- Final player: level 6, experience 182, inner skill 烈陽戰體 (blazing-sun-inner) lv.3 damage 30
- Final attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9

## Efficiency (KPI)

- 行動產出率 (productive): ██·········· 14.2% (104/733)
- 擊殺效率 (kill/generate): ███████████· 0.88 (15/17)
- 擊殺成本 (attack/kill): 5.33 (80 次攻擊 / 15 擊殺)
- 經驗效率 (XP/turn): 0.96 (182 XP / 190 turns)

- Nest health (start → end): creature-nest-1=120→176.42999999999992, creature-nest-2=120→175, creature-nest-3=120→186.63000000000005

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
      "createdAt": "2026-09-02T15:47:51.086Z"
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
      "createdAt": "2026-09-02T15:47:51.100Z"
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
      "createdAt": "2026-09-02T15:47:51.113Z"
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
      "createdAt": "2026-09-02T15:47:51.121Z"
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
      "createdAt": "2026-09-02T15:47:51.123Z"
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
      "createdAt": "2026-09-02T15:47:51.124Z"
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
      "createdAt": "2026-09-02T15:47:51.124Z"
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
      "createdAt": "2026-09-02T15:47:51.124Z"
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
      "createdAt": "2026-09-02T15:47:51.124Z"
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
      "createdAt": "2026-09-02T15:47:51.125Z"
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
      "createdAt": "2026-09-02T15:47:51.125Z"
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
      "createdAt": "2026-09-02T15:47:51.125Z"
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
      "createdAt": "2026-09-02T15:47:51.125Z"
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
      "createdAt": "2026-09-02T15:47:51.125Z"
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
      "createdAt": "2026-09-02T15:47:51.128Z"
    }
  ],
  "creatureLogs": [],
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
      "createdAt": "2026-09-02T15:47:51.135Z"
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
      "createdAt": "2026-09-02T15:47:51.141Z"
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
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=120/120

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
      "createdAt": "2026-09-02T15:47:51.142Z"
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
      "createdAt": "2026-09-02T15:47:51.142Z"
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
      "createdAt": "2026-09-02T15:47:51.142Z"
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
      "createdAt": "2026-09-02T15:47:51.142Z"
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
      "createdAt": "2026-09-02T15:47:51.143Z"
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
      "createdAt": "2026-09-02T15:47:51.143Z"
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
      "createdAt": "2026-09-02T15:47:51.143Z"
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
      "createdAt": "2026-09-02T15:47:51.143Z"
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
      "createdAt": "2026-09-02T15:47:51.143Z"
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
      "createdAt": "2026-09-02T15:47:51.143Z"
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
      "createdAt": "2026-09-02T15:47:51.144Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "roamer-creature-3",
      "creatureName": "游蕩妖物",
      "message": "游蕩妖物 發現並摧毀了道具點。"
    }
  ],
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
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=120/120

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
      "createdAt": "2026-09-02T15:47:51.150Z"
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
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=120/120

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
      "createdAt": "2026-09-02T15:47:51.154Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 11 (round 4)
- Player: 胡斐 (player-2), level 1, experience 26, at (12, 5), health 25.5, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +6
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/132, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-3-roamer-creature-1-31",
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
      "createdAt": "2026-09-02T15:47:51.159Z"
    },
    {
      "id": "action-3-roamer-creature-2-32",
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
      "createdAt": "2026-09-02T15:47:51.159Z"
    },
    {
      "id": "action-3-roamer-creature-3-33",
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
      "createdAt": "2026-09-02T15:47:51.159Z"
    },
    {
      "id": "action-3-roamer-creature-4-34",
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
      "createdAt": "2026-09-02T15:47:51.159Z"
    },
    {
      "id": "action-3-roamer-creature-5-35",
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
      "createdAt": "2026-09-02T15:47:51.159Z"
    },
    {
      "id": "action-3-roamer-creature-6-36",
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
      "createdAt": "2026-09-02T15:47:51.159Z"
    },
    {
      "id": "action-3-roamer-creature-7-37",
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
      "createdAt": "2026-09-02T15:47:51.159Z"
    },
    {
      "id": "action-3-roamer-creature-8-38",
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
      "createdAt": "2026-09-02T15:47:51.159Z"
    },
    {
      "id": "action-3-roamer-creature-9-39",
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
      "createdAt": "2026-09-02T15:47:51.159Z"
    },
    {
      "id": "action-3-roamer-creature-10-40",
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
      "createdAt": "2026-09-02T15:47:51.159Z"
    },
    {
      "id": "action-4-player-2-41",
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
        "reason": "模糊策略：practiceSkill 分數 0.12，但目前沒有可執行 action，結束回合。候選診斷：practiceSkill=0.12:practice-skill, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：practiceSkill 分數 0.12，但目前沒有可執行 action，結束回合。候選診斷：practiceSkill=0.12:practice-skill, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T15:47:51.160Z"
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
      "spawnedRound": 4,
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

### Turn 12 (round 4)
- Player: 胡斐 (player-2), level 1, experience 26, at (12, 5), health 25.5, stamina 5.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/132, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-4-player-2-42",
      "round": 4,
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
      "createdAt": "2026-09-02T15:47:51.165Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 13 (round 4)
- Player: 胡斐 (player-2), level 1, experience 26, at (12, 5), health 25.5, stamina 2.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/132, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-4-player-2-43",
      "round": 4,
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
      "createdAt": "2026-09-02T15:47:51.169Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 14 (round 5)
- Player: 胡斐 (player-2), level 1, experience 31, at (12, 5), health 27, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +5
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=121.32/132, creature-nest-3=120/132

```json
{
  "actions": [
    {
      "id": "action-4-roamer-creature-1-44",
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
      "createdAt": "2026-09-02T15:47:51.173Z"
    },
    {
      "id": "action-4-roamer-creature-2-45",
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
      "createdAt": "2026-09-02T15:47:51.173Z"
    },
    {
      "id": "action-4-roamer-creature-3-46",
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
      "createdAt": "2026-09-02T15:47:51.174Z"
    },
    {
      "id": "action-4-roamer-creature-4-47",
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
      "createdAt": "2026-09-02T15:47:51.174Z"
    },
    {
      "id": "action-4-roamer-creature-5-48",
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
      "createdAt": "2026-09-02T15:47:51.174Z"
    },
    {
      "id": "action-4-roamer-creature-6-49",
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
      "createdAt": "2026-09-02T15:47:51.174Z"
    },
    {
      "id": "action-4-roamer-creature-7-50",
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
      "createdAt": "2026-09-02T15:47:51.174Z"
    },
    {
      "id": "action-4-roamer-creature-8-51",
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
      "createdAt": "2026-09-02T15:47:51.174Z"
    },
    {
      "id": "action-4-roamer-creature-9-52",
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
      "createdAt": "2026-09-02T15:47:51.174Z"
    },
    {
      "id": "action-4-roamer-creature-10-53",
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
      "createdAt": "2026-09-02T15:47:51.175Z"
    },
    {
      "id": "action-4-nest-creature-1-54",
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
      "createdAt": "2026-09-02T15:47:51.176Z"
    },
    {
      "id": "action-5-player-2-55",
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
      "createdAt": "2026-09-02T15:47:51.177Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "creature-nest-3",
      "creatureName": "生物巢穴 3",
      "message": "生物巢穴 3 生成了 Lv.1 怪物。"
    }
  ],
  "spawnedCreatures": [
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
      "spawnedRound": 5,
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

### Turn 15 (round 5)
- Player: 胡斐 (player-2), level 1, experience 31, at (12, 5), health 27, stamina 5.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=121.32/132, creature-nest-3=120/132

```json
{
  "actions": [
    {
      "id": "action-5-player-2-56",
      "round": 5,
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
      "createdAt": "2026-09-02T15:47:51.183Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 16 (round 5)
- Player: 胡斐 (player-2), level 1, experience 31, at (12, 5), health 27, stamina 2.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=121.32/132, creature-nest-3=120/132

```json
{
  "actions": [
    {
      "id": "action-5-player-2-57",
      "round": 5,
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
      "createdAt": "2026-09-02T15:47:51.188Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 17 (round 5)
- Player: 胡斐 (player-2), level 1, experience 31, at (13, 5), health 24, stamina 0.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=121.32/132, creature-nest-3=120/132

```json
{
  "actions": [
    {
      "id": "action-5-player-2-58",
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
          "row": 13,
          "column": 5
        },
        "reason": "保命：逃離 生物巢穴 3的怪物 Lv.1（hitsSurvivable=5.4）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 3的怪物 Lv.1（hitsSurvivable=5.4）",
      "createdAt": "2026-09-02T15:47:51.195Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 18 (round 6)
- Player: 胡斐 (player-2), level 1, experience 32, at (13, 5), health 25.5, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=122.63999999999999/132, creature-nest-3=121.32/132

```json
{
  "actions": [
    {
      "id": "action-5-roamer-creature-1-59",
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
      "createdAt": "2026-09-02T15:47:51.198Z"
    },
    {
      "id": "action-5-roamer-creature-2-60",
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
      "createdAt": "2026-09-02T15:47:51.198Z"
    },
    {
      "id": "action-5-roamer-creature-3-61",
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
      "createdAt": "2026-09-02T15:47:51.198Z"
    },
    {
      "id": "action-5-roamer-creature-4-62",
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
      "createdAt": "2026-09-02T15:47:51.198Z"
    },
    {
      "id": "action-5-roamer-creature-5-63",
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
      "createdAt": "2026-09-02T15:47:51.198Z"
    },
    {
      "id": "action-5-roamer-creature-6-64",
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
      "createdAt": "2026-09-02T15:47:51.198Z"
    },
    {
      "id": "action-5-roamer-creature-7-65",
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
      "createdAt": "2026-09-02T15:47:51.198Z"
    },
    {
      "id": "action-5-roamer-creature-8-66",
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
      "createdAt": "2026-09-02T15:47:51.198Z"
    },
    {
      "id": "action-5-roamer-creature-9-67",
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
      "createdAt": "2026-09-02T15:47:51.198Z"
    },
    {
      "id": "action-5-roamer-creature-10-68",
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
      "createdAt": "2026-09-02T15:47:51.199Z"
    },
    {
      "id": "action-5-nest-creature-1-69",
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
      "createdAt": "2026-09-02T15:47:51.199Z"
    },
    {
      "id": "action-5-nest-creature-2-70",
      "round": 5,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
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
      "createdAt": "2026-09-02T15:47:51.199Z"
    },
    {
      "id": "action-6-player-2-71",
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
      "createdAt": "2026-09-02T15:47:51.200Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 19 (round 6)
- Player: 胡斐 (player-2), level 1, experience 32, at (13, 4), health 24, stamina 6.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=122.63999999999999/132, creature-nest-3=121.32/132

```json
{
  "actions": [
    {
      "id": "action-6-player-2-72",
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
          "column": 4
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-02T15:47:51.213Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 20 (round 6)
- Player: 胡斐 (player-2), level 1, experience 32, at (13, 3), health 24, stamina 4.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=122.63999999999999/132, creature-nest-3=121.32/132

```json
{
  "actions": [
    {
      "id": "action-6-player-2-73",
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
      "createdAt": "2026-09-02T15:47:51.223Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 21 (round 6)
- Player: 胡斐 (player-2), level 1, experience 32, at (12, 3), health 24, stamina 2.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=122.63999999999999/132, creature-nest-3=121.32/132

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
      "createdAt": "2026-09-02T15:47:51.233Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 22 (round 6)
- Player: 胡斐 (player-2), level 1, experience 32, at (12, 2), health 24, stamina 0.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=122.63999999999999/132, creature-nest-3=121.32/132

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
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 12,
          "column": 2
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:51.239Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 23 (round 6)
- Player: 胡斐 (player-2), level 1, experience 32, at (12, 2), health 24, stamina 0.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=122.63999999999999/132, creature-nest-3=121.32/132

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
      "createdAt": "2026-09-02T15:47:51.247Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 24 (round 7)
- Player: 胡斐 (player-2), level 1, experience 33, at (12, 2), health 25.5, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=123.95999999999998/132, creature-nest-3=122.63999999999999/132

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
      "createdAt": "2026-09-02T15:47:51.250Z"
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
      "createdAt": "2026-09-02T15:47:51.250Z"
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
      "createdAt": "2026-09-02T15:47:51.250Z"
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
      "createdAt": "2026-09-02T15:47:51.250Z"
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
      "createdAt": "2026-09-02T15:47:51.250Z"
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
      "createdAt": "2026-09-02T15:47:51.250Z"
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
      "createdAt": "2026-09-02T15:47:51.250Z"
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
      "createdAt": "2026-09-02T15:47:51.250Z"
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
      "createdAt": "2026-09-02T15:47:51.250Z"
    },
    {
      "id": "action-6-roamer-creature-10-86",
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
      "createdAt": "2026-09-02T15:47:51.251Z"
    },
    {
      "id": "action-6-nest-creature-1-87",
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
      "createdAt": "2026-09-02T15:47:51.251Z"
    },
    {
      "id": "action-6-nest-creature-2-88",
      "round": 6,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.251Z"
    },
    {
      "id": "action-7-player-2-89",
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
      "createdAt": "2026-09-02T15:47:51.251Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 25 (round 7)
- Player: 胡斐 (player-2), level 1, experience 33, at (11, 2), health 24, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=123.95999999999998/132, creature-nest-3=122.63999999999999/132

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
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 11,
          "column": 2
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:51.260Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 26 (round 7)
- Player: 胡斐 (player-2), level 1, experience 33, at (10, 2), health 24, stamina 1.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=123.95999999999998/132, creature-nest-3=122.63999999999999/132

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
          "column": 2
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:51.267Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 27 (round 8)
- Player: 胡斐 (player-2), level 1, experience 36, at (10, 2), health 25.5, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=125.27999999999997/132, creature-nest-3=123.95999999999998/132

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
      "createdAt": "2026-09-02T15:47:51.269Z"
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
      "createdAt": "2026-09-02T15:47:51.269Z"
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
      "createdAt": "2026-09-02T15:47:51.269Z"
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
      "createdAt": "2026-09-02T15:47:51.269Z"
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
      "createdAt": "2026-09-02T15:47:51.269Z"
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
      "createdAt": "2026-09-02T15:47:51.269Z"
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
      "createdAt": "2026-09-02T15:47:51.269Z"
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
      "createdAt": "2026-09-02T15:47:51.269Z"
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
      "createdAt": "2026-09-02T15:47:51.270Z"
    },
    {
      "id": "action-7-roamer-creature-10-101",
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
      "createdAt": "2026-09-02T15:47:51.270Z"
    },
    {
      "id": "action-7-nest-creature-1-102",
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
      "createdAt": "2026-09-02T15:47:51.270Z"
    },
    {
      "id": "action-7-nest-creature-2-103",
      "round": 7,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.270Z"
    },
    {
      "id": "action-8-player-2-104",
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
      "createdAt": "2026-09-02T15:47:51.270Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 28 (round 8)
- Player: 胡斐 (player-2), level 1, experience 36, at (9, 2), health 24, stamina 6.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=125.27999999999997/132, creature-nest-3=123.95999999999998/132

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
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 9,
          "column": 2
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:51.282Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 29 (round 8)
- Player: 胡斐 (player-2), level 1, experience 36, at (9, 3), health 24, stamina 4.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=125.27999999999997/132, creature-nest-3=123.95999999999998/132

```json
{
  "actions": [
    {
      "id": "action-8-player-2-106",
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
          "row": 9,
          "column": 3
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:51.288Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 30 (round 8)
- Player: 胡斐 (player-2), level 1, experience 36, at (9, 4), health 24, stamina 2.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=125.27999999999997/132, creature-nest-3=123.95999999999998/132

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
      "createdAt": "2026-09-02T15:47:51.299Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 31 (round 8)
- Player: 胡斐 (player-2), level 1, experience 36, at (9, 5), health 24, stamina 0.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=125.27999999999997/132, creature-nest-3=123.95999999999998/132

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
          "row": 9,
          "column": 5
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:51.307Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 32 (round 9)
- Player: 胡斐 (player-2), level 1, experience 37, at (9, 5), health 20.5, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +1
- Spawned creatures: 2
- Defeated creatures: none
- Nests: creature-nest-1=120/132, creature-nest-2=126.59999999999997/132, creature-nest-3=125.27999999999997/145

```json
{
  "actions": [
    {
      "id": "action-8-roamer-creature-1-109",
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
      "createdAt": "2026-09-02T15:47:51.311Z"
    },
    {
      "id": "action-8-roamer-creature-2-110",
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
      "createdAt": "2026-09-02T15:47:51.311Z"
    },
    {
      "id": "action-8-roamer-creature-3-111",
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
      "createdAt": "2026-09-02T15:47:51.311Z"
    },
    {
      "id": "action-8-roamer-creature-4-112",
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
      "createdAt": "2026-09-02T15:47:51.311Z"
    },
    {
      "id": "action-8-roamer-creature-5-113",
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
      "createdAt": "2026-09-02T15:47:51.311Z"
    },
    {
      "id": "action-8-roamer-creature-6-114",
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
      "createdAt": "2026-09-02T15:47:51.311Z"
    },
    {
      "id": "action-8-roamer-creature-7-115",
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
      "createdAt": "2026-09-02T15:47:51.311Z"
    },
    {
      "id": "action-8-roamer-creature-8-116",
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
      "createdAt": "2026-09-02T15:47:51.311Z"
    },
    {
      "id": "action-8-roamer-creature-9-117",
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
      "createdAt": "2026-09-02T15:47:51.311Z"
    },
    {
      "id": "action-8-roamer-creature-10-118",
      "round": 8,
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
            "column": 5
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T15:47:51.312Z"
    },
    {
      "id": "action-8-nest-creature-1-119",
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
      "createdAt": "2026-09-02T15:47:51.313Z"
    },
    {
      "id": "action-8-nest-creature-2-120",
      "round": 8,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.313Z"
    },
    {
      "id": "action-9-player-2-121",
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
      "createdAt": "2026-09-02T15:47:51.314Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "roamer-creature-10",
      "creatureName": "游蕩妖物",
      "message": "游蕩妖物 攻擊 胡斐，造成 5 點傷害。"
    },
    {
      "creatureId": "creature-nest-1",
      "creatureName": "生物巢穴 1",
      "message": "生物巢穴 1 生成了 Lv.1 怪物。"
    },
    {
      "creatureId": "creature-nest-3",
      "creatureName": "生物巢穴 3",
      "message": "生物巢穴 3 生成了 Lv.2 怪物。"
    }
  ],
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
      "spawnedRound": 9,
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
    },
    {
      "id": "nest-creature-4",
      "name": "生物巢穴 3的怪物 Lv.2",
      "innerSkillId": "void-spirit-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 10,
        "column": 8
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
      "spawnedRound": 9,
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

### Turn 33 (round 9)
- Player: 胡斐 (player-2), level 1, experience 40, at (9, 5), health 20.5, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132, creature-nest-2=126.59999999999997/132, creature-nest-3=125.27999999999997/145

```json
{
  "actions": [
    {
      "id": "action-9-player-2-122",
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
          "id": "roamer-creature-10",
          "kind": "creature",
          "position": {
            "row": 8,
            "column": 5
          }
        },
        "reason": "交戰：攻擊 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 游蕩妖物",
      "createdAt": "2026-09-02T15:47:51.323Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 34 (round 9)
- Player: 胡斐 (player-2), level 1, experience 40, at (9, 6), health 20.5, stamina 1.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132, creature-nest-2=126.59999999999997/132, creature-nest-3=125.27999999999997/145

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
          "row": 9,
          "column": 6
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:51.331Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 35 (round 10)
- Player: 胡斐 (player-2), level 1, experience 43, at (9, 6), health 22, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=121.32/132, creature-nest-2=127.91999999999996/132, creature-nest-3=126.72999999999998/145

```json
{
  "actions": [
    {
      "id": "action-9-roamer-creature-1-124",
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
      "createdAt": "2026-09-02T15:47:51.334Z"
    },
    {
      "id": "action-9-roamer-creature-2-125",
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
      "createdAt": "2026-09-02T15:47:51.334Z"
    },
    {
      "id": "action-9-roamer-creature-3-126",
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
      "createdAt": "2026-09-02T15:47:51.334Z"
    },
    {
      "id": "action-9-roamer-creature-4-127",
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
      "createdAt": "2026-09-02T15:47:51.334Z"
    },
    {
      "id": "action-9-roamer-creature-5-128",
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
      "createdAt": "2026-09-02T15:47:51.334Z"
    },
    {
      "id": "action-9-roamer-creature-6-129",
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
      "createdAt": "2026-09-02T15:47:51.334Z"
    },
    {
      "id": "action-9-roamer-creature-7-130",
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
      "createdAt": "2026-09-02T15:47:51.334Z"
    },
    {
      "id": "action-9-roamer-creature-8-131",
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
      "createdAt": "2026-09-02T15:47:51.334Z"
    },
    {
      "id": "action-9-roamer-creature-9-132",
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
      "createdAt": "2026-09-02T15:47:51.335Z"
    },
    {
      "id": "action-9-roamer-creature-10-133",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.335Z"
    },
    {
      "id": "action-9-nest-creature-1-134",
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
      "createdAt": "2026-09-02T15:47:51.335Z"
    },
    {
      "id": "action-9-nest-creature-2-135",
      "round": 9,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.335Z"
    },
    {
      "id": "action-9-nest-creature-3-136",
      "round": 9,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
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
      "createdAt": "2026-09-02T15:47:51.335Z"
    },
    {
      "id": "action-9-nest-creature-4-137",
      "round": 9,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T15:47:51.335Z"
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
      "createdAt": "2026-09-02T15:47:51.336Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 36 (round 10)
- Player: 胡斐 (player-2), level 2, experience 13, at (9, 6), health 22, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 9
- Stored experience change: -30 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: roamer-creature-10
- Nests: creature-nest-1=121.32/132, creature-nest-2=127.91999999999996/132, creature-nest-3=126.72999999999998/145

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
            "column": 5
          }
        },
        "reason": "交戰：攻擊 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 游蕩妖物",
      "createdAt": "2026-09-02T15:47:51.343Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 37 (round 10)
- Player: 胡斐 (player-2), level 2, experience 13, at (9, 6), health 22, stamina 3.5
- Attributes: armStrength=10, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=121.32/132, creature-nest-2=127.91999999999996/132, creature-nest-3=126.72999999999998/145

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
      "createdAt": "2026-09-02T15:47:51.348Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 38 (round 10)
- Player: 胡斐 (player-2), level 2, experience 13, at (9, 6), health 22, stamina 3.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=121.32/132, creature-nest-2=127.91999999999996/132, creature-nest-3=126.72999999999998/145

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
      "createdAt": "2026-09-02T15:47:51.352Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 39 (round 10)
- Player: 胡斐 (player-2), level 2, experience 13, at (10, 6), health 22, stamina 1.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=121.32/132, creature-nest-2=127.91999999999996/132, creature-nest-3=126.72999999999998/145

```json
{
  "actions": [
    {
      "id": "action-10-player-2-142",
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
          "row": 10,
          "column": 6
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-02T15:47:51.357Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 40 (round 11)
- Player: 胡斐 (player-2), level 2, experience 16, at (10, 6), health 23.5, stamina 9.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=122.63999999999999/132, creature-nest-2=129.23999999999995/132, creature-nest-3=128.17999999999998/145

```json
{
  "actions": [
    {
      "id": "action-10-roamer-creature-1-143",
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
      "createdAt": "2026-09-02T15:47:51.360Z"
    },
    {
      "id": "action-10-roamer-creature-2-144",
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
      "createdAt": "2026-09-02T15:47:51.360Z"
    },
    {
      "id": "action-10-roamer-creature-3-145",
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
      "createdAt": "2026-09-02T15:47:51.360Z"
    },
    {
      "id": "action-10-roamer-creature-4-146",
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
      "createdAt": "2026-09-02T15:47:51.360Z"
    },
    {
      "id": "action-10-roamer-creature-5-147",
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
      "createdAt": "2026-09-02T15:47:51.360Z"
    },
    {
      "id": "action-10-roamer-creature-6-148",
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
      "createdAt": "2026-09-02T15:47:51.360Z"
    },
    {
      "id": "action-10-roamer-creature-7-149",
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
      "createdAt": "2026-09-02T15:47:51.360Z"
    },
    {
      "id": "action-10-roamer-creature-8-150",
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
      "createdAt": "2026-09-02T15:47:51.361Z"
    },
    {
      "id": "action-10-roamer-creature-9-151",
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
      "createdAt": "2026-09-02T15:47:51.361Z"
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
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 7,
          "column": 6
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.361Z"
    },
    {
      "id": "action-10-nest-creature-2-153",
      "round": 10,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 12,
          "column": 7
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.361Z"
    },
    {
      "id": "action-10-nest-creature-3-154",
      "round": 10,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "destination": {
          "row": 10,
          "column": 3
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.361Z"
    },
    {
      "id": "action-10-nest-creature-4-155",
      "round": 10,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T15:47:51.361Z"
    },
    {
      "id": "action-11-player-2-156",
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
      "createdAt": "2026-09-02T15:47:51.361Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 41 (round 11)
- Player: 胡斐 (player-2), level 2, experience 19, at (10, 6), health 23.5, stamina 4.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=122.63999999999999/132, creature-nest-2=129.23999999999995/132, creature-nest-3=128.17999999999998/145

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
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "nest-creature-4",
          "kind": "creature",
          "position": {
            "row": 10,
            "column": 7
          }
        },
        "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.2"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.2",
      "createdAt": "2026-09-02T15:47:51.368Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 42 (round 11)
- Player: 胡斐 (player-2), level 2, experience 19, at (9, 6), health 23.5, stamina 2.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=122.63999999999999/132, creature-nest-2=129.23999999999995/132, creature-nest-3=128.17999999999998/145

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
          "row": 9,
          "column": 6
        },
        "reason": "定位：前往出口 (9,6)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (9,6)",
      "createdAt": "2026-09-02T15:47:51.373Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 43 (round 11)
- Player: 胡斐 (player-2), level 2, experience 19, at (9, 5), health 23.5, stamina 0.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=122.63999999999999/132, creature-nest-2=129.23999999999995/132, creature-nest-3=128.17999999999998/145

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
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 9,
          "column": 5
        },
        "reason": "保命：逃離 生物巢穴 2的怪物 Lv.1（hitsSurvivable=3.9166666666666665）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 2的怪物 Lv.1（hitsSurvivable=3.9166666666666665）",
      "createdAt": "2026-09-02T15:47:51.379Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 44 (round 12)
- Player: 胡斐 (player-2), level 2, experience 20, at (9, 5), health 25, stamina 9.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=123.95999999999998/132, creature-nest-2=130.55999999999995/132, creature-nest-3=129.62999999999997/145

```json
{
  "actions": [
    {
      "id": "action-11-roamer-creature-1-160",
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
      "createdAt": "2026-09-02T15:47:51.383Z"
    },
    {
      "id": "action-11-roamer-creature-2-161",
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
      "createdAt": "2026-09-02T15:47:51.383Z"
    },
    {
      "id": "action-11-roamer-creature-3-162",
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
      "createdAt": "2026-09-02T15:47:51.383Z"
    },
    {
      "id": "action-11-roamer-creature-4-163",
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
      "createdAt": "2026-09-02T15:47:51.383Z"
    },
    {
      "id": "action-11-roamer-creature-5-164",
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
      "createdAt": "2026-09-02T15:47:51.383Z"
    },
    {
      "id": "action-11-roamer-creature-6-165",
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
      "createdAt": "2026-09-02T15:47:51.383Z"
    },
    {
      "id": "action-11-roamer-creature-7-166",
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
      "createdAt": "2026-09-02T15:47:51.383Z"
    },
    {
      "id": "action-11-roamer-creature-8-167",
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
      "createdAt": "2026-09-02T15:47:51.383Z"
    },
    {
      "id": "action-11-roamer-creature-9-168",
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
      "createdAt": "2026-09-02T15:47:51.383Z"
    },
    {
      "id": "action-11-nest-creature-1-169",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.383Z"
    },
    {
      "id": "action-11-nest-creature-2-170",
      "round": 11,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 12,
          "column": 7
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.384Z"
    },
    {
      "id": "action-11-nest-creature-3-171",
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
      "createdAt": "2026-09-02T15:47:51.384Z"
    },
    {
      "id": "action-11-nest-creature-4-172",
      "round": 11,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 10,
          "column": 7
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.384Z"
    },
    {
      "id": "action-12-player-2-173",
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
      "createdAt": "2026-09-02T15:47:51.384Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 45 (round 12)
- Player: 胡斐 (player-2), level 2, experience 20, at (8, 5), health 25, stamina 7.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=123.95999999999998/132, creature-nest-2=130.55999999999995/132, creature-nest-3=129.62999999999997/145

```json
{
  "actions": [
    {
      "id": "action-12-player-2-174",
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
          "row": 8,
          "column": 5
        },
        "reason": "定位：前往出口 (8,5)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (8,5)",
      "createdAt": "2026-09-02T15:47:51.392Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 46 (round 12)
- Player: 胡斐 (player-2), level 2, experience 20, at (8, 4), health 25, stamina 5.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=123.95999999999998/132, creature-nest-2=130.55999999999995/132, creature-nest-3=129.62999999999997/145

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
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 8,
          "column": 4
        },
        "reason": "交戰：移動到 生物巢穴 1的怪物 Lv.1 附近"
      },
      "result": "succeeded",
      "reason": "交戰：移動到 生物巢穴 1的怪物 Lv.1 附近",
      "createdAt": "2026-09-02T15:47:51.399Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 47 (round 12)
- Player: 胡斐 (player-2), level 2, experience 23, at (8, 4), health 25, stamina 0.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=123.95999999999998/132, creature-nest-2=130.55999999999995/132, creature-nest-3=129.62999999999997/145

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
          "id": "nest-creature-3",
          "kind": "creature",
          "position": {
            "row": 9,
            "column": 4
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-02T15:47:51.405Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 48 (round 13)
- Player: 胡斐 (player-2), level 2, experience 24, at (8, 4), health 21.5, stamina 9.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +1
- Spawned creatures: 2
- Defeated creatures: none
- Nests: creature-nest-1=125.27999999999997/132, creature-nest-2=131.87999999999994/145, creature-nest-3=131.07999999999996/159

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
      "createdAt": "2026-09-02T15:47:51.408Z"
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
      "createdAt": "2026-09-02T15:47:51.408Z"
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
      "createdAt": "2026-09-02T15:47:51.408Z"
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
      "createdAt": "2026-09-02T15:47:51.408Z"
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
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.408Z"
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
      "createdAt": "2026-09-02T15:47:51.408Z"
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
      "createdAt": "2026-09-02T15:47:51.408Z"
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
      "createdAt": "2026-09-02T15:47:51.408Z"
    },
    {
      "id": "action-12-roamer-creature-9-185",
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
      "createdAt": "2026-09-02T15:47:51.408Z"
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.408Z"
    },
    {
      "id": "action-12-nest-creature-2-187",
      "round": 12,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.409Z"
    },
    {
      "id": "action-12-nest-creature-3-188",
      "round": 12,
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
            "row": 8,
            "column": 4
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T15:47:51.409Z"
    },
    {
      "id": "action-12-nest-creature-4-189",
      "round": 12,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
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
      "createdAt": "2026-09-02T15:47:51.409Z"
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T15:47:51.410Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-3",
      "creatureName": "生物巢穴 1的怪物 Lv.1",
      "message": "生物巢穴 1的怪物 Lv.1 攻擊 胡斐，造成 5 點傷害。"
    },
    {
      "creatureId": "creature-nest-2",
      "creatureName": "生物巢穴 2",
      "message": "生物巢穴 2 生成了 Lv.2 怪物。"
    },
    {
      "creatureId": "creature-nest-3",
      "creatureName": "生物巢穴 3",
      "message": "生物巢穴 3 生成了 Lv.3 怪物。"
    }
  ],
  "spawnedCreatures": [
    {
      "id": "nest-creature-5",
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
      "spawnedRound": 13,
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
    },
    {
      "id": "nest-creature-6",
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
      "spawnedRound": 13,
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

### Turn 49 (round 13)
- Player: 胡斐 (player-2), level 2, experience 44, at (8, 4), health 21.5, stamina 4.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: nest-creature-3
- Nests: creature-nest-1=125.27999999999997/132, creature-nest-2=131.87999999999994/145, creature-nest-3=131.07999999999996/159

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
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "nest-creature-3",
          "kind": "creature",
          "position": {
            "row": 9,
            "column": 4
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-02T15:47:51.416Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 50 (round 13)
- Player: 胡斐 (player-2), level 2, experience 44, at (8, 3), health 21.5, stamina 2.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=125.27999999999997/132, creature-nest-2=131.87999999999994/145, creature-nest-3=131.07999999999996/159

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
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 8,
          "column": 3
        },
        "reason": "收集道具：移動到道具位置"
      },
      "result": "succeeded",
      "reason": "收集道具：移動到道具位置",
      "createdAt": "2026-09-02T15:47:51.423Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 51 (round 13)
- Player: 胡斐 (player-2), level 2, experience 44, at (8, 3), health 21.5, stamina 2.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=125.27999999999997/132, creature-nest-2=131.87999999999994/145, creature-nest-3=131.07999999999996/159

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
        "type": "collect",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "item-point-19",
          "kind": "item",
          "position": {
            "row": 8,
            "column": 3
          }
        },
        "reason": "收集道具：拾取"
      },
      "result": "succeeded",
      "reason": "收集道具：拾取",
      "createdAt": "2026-09-02T15:47:51.429Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 52 (round 13)
- Player: 胡斐 (player-2), level 2, experience 44, at (7, 3), health 21.5, stamina 0.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=125.27999999999997/132, creature-nest-2=131.87999999999994/145, creature-nest-3=131.07999999999996/159

```json
{
  "actions": [
    {
      "id": "action-13-player-2-194",
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
          "column": 3
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:51.436Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 53 (round 14)
- Player: 胡斐 (player-2), level 2, experience 45, at (7, 3), health 23, stamina 9.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +1
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=126.59999999999997/145, creature-nest-2=133.32999999999993/145, creature-nest-3=132.66999999999996/159

```json
{
  "actions": [
    {
      "id": "action-13-roamer-creature-1-195",
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
      "createdAt": "2026-09-02T15:47:51.438Z"
    },
    {
      "id": "action-13-roamer-creature-2-196",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.438Z"
    },
    {
      "id": "action-13-roamer-creature-3-197",
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
      "createdAt": "2026-09-02T15:47:51.438Z"
    },
    {
      "id": "action-13-roamer-creature-4-198",
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
      "createdAt": "2026-09-02T15:47:51.438Z"
    },
    {
      "id": "action-13-roamer-creature-5-199",
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
      "createdAt": "2026-09-02T15:47:51.438Z"
    },
    {
      "id": "action-13-roamer-creature-6-200",
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
      "createdAt": "2026-09-02T15:47:51.438Z"
    },
    {
      "id": "action-13-roamer-creature-7-201",
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
      "createdAt": "2026-09-02T15:47:51.439Z"
    },
    {
      "id": "action-13-roamer-creature-8-202",
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
      "createdAt": "2026-09-02T15:47:51.439Z"
    },
    {
      "id": "action-13-roamer-creature-9-203",
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
      "createdAt": "2026-09-02T15:47:51.439Z"
    },
    {
      "id": "action-13-nest-creature-1-204",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.439Z"
    },
    {
      "id": "action-13-nest-creature-2-205",
      "round": 13,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.439Z"
    },
    {
      "id": "action-13-nest-creature-4-206",
      "round": 13,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.439Z"
    },
    {
      "id": "action-13-nest-creature-5-207",
      "round": 13,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 3
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.439Z"
    },
    {
      "id": "action-13-nest-creature-6-208",
      "round": 13,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
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
      "createdAt": "2026-09-02T15:47:51.439Z"
    },
    {
      "id": "action-14-player-2-209",
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
      "createdAt": "2026-09-02T15:47:51.439Z"
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
    }
  ]
}
```

### Turn 54 (round 14)
- Player: 胡斐 (player-2), level 2, experience 45, at (6, 3), health 23, stamina 4.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=126.59999999999997/145, creature-nest-2=133.32999999999993/145, creature-nest-3=132.66999999999996/159

```json
{
  "actions": [
    {
      "id": "action-14-player-2-210",
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
          "row": 6,
          "column": 3
        },
        "reason": "定位：前往出口 (6,3)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (6,3)",
      "createdAt": "2026-09-02T15:47:51.448Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 55 (round 14)
- Player: 胡斐 (player-2), level 2, experience 45, at (6, 4), health 23, stamina 2.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=126.59999999999997/145, creature-nest-2=133.32999999999993/145, creature-nest-3=132.66999999999996/159

```json
{
  "actions": [
    {
      "id": "action-14-player-2-211",
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
          "row": 6,
          "column": 4
        },
        "reason": "保命：逃離 游蕩妖物（hitsSurvivable=2.875）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 游蕩妖物（hitsSurvivable=2.875）",
      "createdAt": "2026-09-02T15:47:51.453Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 56 (round 15)
- Player: 胡斐 (player-2), level 2, experience 50, at (6, 4), health 18.5, stamina 9.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +5
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=128.04999999999995/145, creature-nest-2=134.77999999999992/145, creature-nest-3=134.25999999999996/159

```json
{
  "actions": [
    {
      "id": "action-14-roamer-creature-1-212",
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
      "createdAt": "2026-09-02T15:47:51.456Z"
    },
    {
      "id": "action-14-roamer-creature-2-213",
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
      "createdAt": "2026-09-02T15:47:51.456Z"
    },
    {
      "id": "action-14-roamer-creature-3-214",
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
      "createdAt": "2026-09-02T15:47:51.456Z"
    },
    {
      "id": "action-14-roamer-creature-4-215",
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
      "createdAt": "2026-09-02T15:47:51.456Z"
    },
    {
      "id": "action-14-roamer-creature-5-216",
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
      "createdAt": "2026-09-02T15:47:51.456Z"
    },
    {
      "id": "action-14-roamer-creature-6-217",
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
      "createdAt": "2026-09-02T15:47:51.456Z"
    },
    {
      "id": "action-14-roamer-creature-7-218",
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
      "createdAt": "2026-09-02T15:47:51.456Z"
    },
    {
      "id": "action-14-roamer-creature-8-219",
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
      "createdAt": "2026-09-02T15:47:51.456Z"
    },
    {
      "id": "action-14-roamer-creature-9-220",
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
      "createdAt": "2026-09-02T15:47:51.456Z"
    },
    {
      "id": "action-14-nest-creature-1-221",
      "round": 14,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
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
            "row": 6,
            "column": 4
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T15:47:51.456Z"
    },
    {
      "id": "action-14-nest-creature-2-222",
      "round": 14,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.456Z"
    },
    {
      "id": "action-14-nest-creature-4-223",
      "round": 14,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 6
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.456Z"
    },
    {
      "id": "action-14-nest-creature-5-224",
      "round": 14,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.456Z"
    },
    {
      "id": "action-14-nest-creature-6-225",
      "round": 14,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-6",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T15:47:51.456Z"
    },
    {
      "id": "action-14-nest-creature-3-226",
      "round": 14,
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
      "createdAt": "2026-09-02T15:47:51.456Z"
    },
    {
      "id": "action-15-player-2-227",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T15:47:51.457Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-1",
      "creatureName": "生物巢穴 2的怪物 Lv.1",
      "message": "生物巢穴 2的怪物 Lv.1 攻擊 胡斐，造成 6 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 57 (round 15)
- Player: 胡斐 (player-2), level 2, experience 70, at (6, 4), health 18.5, stamina 4.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=128.04999999999995/145, creature-nest-2=134.77999999999992/145, creature-nest-3=134.25999999999996/159

```json
{
  "actions": [
    {
      "id": "action-15-player-2-228",
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
      "createdAt": "2026-09-02T15:47:51.463Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 58 (round 15)
- Player: 胡斐 (player-2), level 2, experience 70, at (6, 5), health 18.5, stamina 2.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=128.04999999999995/145, creature-nest-2=134.77999999999992/145, creature-nest-3=134.25999999999996/159

```json
{
  "actions": [
    {
      "id": "action-15-player-2-229",
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
          "row": 6,
          "column": 5
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:51.472Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 59 (round 15)
- Player: 胡斐 (player-2), level 2, experience 70, at (7, 5), health 18.5, stamina 0.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=128.04999999999995/145, creature-nest-2=134.77999999999992/145, creature-nest-3=134.25999999999996/159

```json
{
  "actions": [
    {
      "id": "action-15-player-2-230",
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
      "createdAt": "2026-09-02T15:47:51.479Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 60 (round 15)
- Player: 胡斐 (player-2), level 2, experience 70, at (7, 5), health 18.5, stamina 0.5
- Attributes: armStrength=11, constitution=10, agility=8, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=128.04999999999995/145, creature-nest-2=134.77999999999992/145, creature-nest-3=134.25999999999996/159

```json
{
  "actions": [
    {
      "id": "action-15-player-2-231",
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
      "createdAt": "2026-09-02T15:47:51.482Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 61 (round 15)
- Player: 胡斐 (player-2), level 2, experience 70, at (7, 5), health 18.5, stamina 0.5
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 11
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=128.04999999999995/145, creature-nest-2=134.77999999999992/145, creature-nest-3=134.25999999999996/159

```json
{
  "actions": [
    {
      "id": "action-15-player-2-232",
      "round": 15,
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
        "instanceId": "equipment-player-2-c37cbcfb-5abb-4b5b-835b-1e944e7c60b4",
        "reason": "裝備：行者護衣（armor）"
      },
      "result": "succeeded",
      "reason": "裝備：行者護衣（armor）",
      "createdAt": "2026-09-02T15:47:51.487Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 62 (round 16)
- Player: 胡斐 (player-2), level 2, experience 71, at (7, 5), health 14.15, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 11
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=129.49999999999994/145, creature-nest-2=136.2299999999999/145, creature-nest-3=135.84999999999997/159

```json
{
  "actions": [
    {
      "id": "action-15-roamer-creature-1-233",
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
      "createdAt": "2026-09-02T15:47:51.490Z"
    },
    {
      "id": "action-15-roamer-creature-2-234",
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
      "createdAt": "2026-09-02T15:47:51.490Z"
    },
    {
      "id": "action-15-roamer-creature-3-235",
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
      "createdAt": "2026-09-02T15:47:51.490Z"
    },
    {
      "id": "action-15-roamer-creature-4-236",
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
      "createdAt": "2026-09-02T15:47:51.490Z"
    },
    {
      "id": "action-15-roamer-creature-5-237",
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
      "createdAt": "2026-09-02T15:47:51.490Z"
    },
    {
      "id": "action-15-roamer-creature-6-238",
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
      "createdAt": "2026-09-02T15:47:51.490Z"
    },
    {
      "id": "action-15-roamer-creature-7-239",
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
      "createdAt": "2026-09-02T15:47:51.490Z"
    },
    {
      "id": "action-15-roamer-creature-8-240",
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
      "createdAt": "2026-09-02T15:47:51.490Z"
    },
    {
      "id": "action-15-roamer-creature-9-241",
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
      "createdAt": "2026-09-02T15:47:51.490Z"
    },
    {
      "id": "action-15-nest-creature-1-242",
      "round": 15,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
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
            "row": 7,
            "column": 5
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T15:47:51.490Z"
    },
    {
      "id": "action-15-nest-creature-2-243",
      "round": 15,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.490Z"
    },
    {
      "id": "action-15-nest-creature-4-244",
      "round": 15,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-02T15:47:51.490Z"
    },
    {
      "id": "action-15-nest-creature-5-245",
      "round": 15,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.490Z"
    },
    {
      "id": "action-15-nest-creature-6-246",
      "round": 15,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-6",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T15:47:51.490Z"
    },
    {
      "id": "action-15-nest-creature-3-247",
      "round": 15,
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
      "createdAt": "2026-09-02T15:47:51.490Z"
    },
    {
      "id": "action-16-player-2-248",
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
      "createdAt": "2026-09-02T15:47:51.491Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 63 (round 16)
- Player: 胡斐 (player-2), level 3, experience 11, at (7, 5), health 14.15, stamina 5
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: -60 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: nest-creature-4
- Nests: creature-nest-1=129.49999999999994/145, creature-nest-2=136.2299999999999/145, creature-nest-3=135.84999999999997/159

```json
{
  "actions": [
    {
      "id": "action-16-player-2-249",
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
          "id": "nest-creature-4",
          "kind": "creature",
          "position": {
            "row": 7,
            "column": 6
          }
        },
        "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.2"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.2",
      "createdAt": "2026-09-02T15:47:51.498Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 64 (round 16)
- Player: 胡斐 (player-2), level 3, experience 11, at (7, 5), health 14.15, stamina 5
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=129.49999999999994/145, creature-nest-2=136.2299999999999/145, creature-nest-3=135.84999999999997/159

```json
{
  "actions": [
    {
      "id": "action-16-player-2-250",
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
      "createdAt": "2026-09-02T15:47:51.504Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 65 (round 16)
- Player: 胡斐 (player-2), level 3, experience 11, at (7, 5), health 14.15, stamina 5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=129.49999999999994/145, creature-nest-2=136.2299999999999/145, creature-nest-3=135.84999999999997/159

```json
{
  "actions": [
    {
      "id": "action-16-player-2-251",
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
      "createdAt": "2026-09-02T15:47:51.511Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 66 (round 16)
- Player: 胡斐 (player-2), level 3, experience 14, at (7, 5), health 14.15, stamina 0
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=129.49999999999994/145, creature-nest-2=136.2299999999999/145, creature-nest-3=135.84999999999997/159

```json
{
  "actions": [
    {
      "id": "action-16-player-2-252",
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
          "id": "nest-creature-1",
          "kind": "creature",
          "position": {
            "row": 7,
            "column": 4
          }
        },
        "reason": "交戰：攻擊 生物巢穴 2的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 2的怪物 Lv.1",
      "createdAt": "2026-09-02T15:47:51.516Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 67 (round 17)
- Player: 胡斐 (player-2), level 3, experience 14, at (7, 5), health 9.950000000000001, stamina 10.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=130.94999999999993/145, creature-nest-2=137.6799999999999/159, creature-nest-3=137.43999999999997/159

```json
{
  "actions": [
    {
      "id": "action-16-roamer-creature-1-253",
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
      "createdAt": "2026-09-02T15:47:51.517Z"
    },
    {
      "id": "action-16-roamer-creature-2-254",
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
      "createdAt": "2026-09-02T15:47:51.517Z"
    },
    {
      "id": "action-16-roamer-creature-3-255",
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
      "createdAt": "2026-09-02T15:47:51.517Z"
    },
    {
      "id": "action-16-roamer-creature-4-256",
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
      "createdAt": "2026-09-02T15:47:51.517Z"
    },
    {
      "id": "action-16-roamer-creature-5-257",
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
      "createdAt": "2026-09-02T15:47:51.517Z"
    },
    {
      "id": "action-16-roamer-creature-6-258",
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
      "createdAt": "2026-09-02T15:47:51.517Z"
    },
    {
      "id": "action-16-roamer-creature-7-259",
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
      "createdAt": "2026-09-02T15:47:51.517Z"
    },
    {
      "id": "action-16-roamer-creature-8-260",
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
      "createdAt": "2026-09-02T15:47:51.517Z"
    },
    {
      "id": "action-16-roamer-creature-9-261",
      "round": 16,
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
      "createdAt": "2026-09-02T15:47:51.517Z"
    },
    {
      "id": "action-16-nest-creature-1-262",
      "round": 16,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
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
            "row": 7,
            "column": 5
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T15:47:51.517Z"
    },
    {
      "id": "action-16-nest-creature-2-263",
      "round": 16,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.517Z"
    },
    {
      "id": "action-16-nest-creature-5-264",
      "round": 16,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
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
            "row": 7,
            "column": 5
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T15:47:51.517Z"
    },
    {
      "id": "action-16-nest-creature-6-265",
      "round": 16,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-6",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T15:47:51.528Z"
    },
    {
      "id": "action-16-nest-creature-3-266",
      "round": 16,
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
      "createdAt": "2026-09-02T15:47:51.528Z"
    },
    {
      "id": "action-17-player-2-267",
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
      "createdAt": "2026-09-02T15:47:51.528Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-2",
      "creatureName": "生物巢穴 3的怪物 Lv.1",
      "message": "生物巢穴 3的怪物 Lv.1 發現並摧毀了道具點。"
    },
    {
      "creatureId": "nest-creature-5",
      "creatureName": "生物巢穴 2的怪物 Lv.2",
      "message": "生物巢穴 2的怪物 Lv.2 攻擊 胡斐，被閃避。"
    },
    {
      "creatureId": "creature-nest-2",
      "creatureName": "生物巢穴 2",
      "message": "生物巢穴 2 生成了 Lv.3 怪物。"
    }
  ],
  "spawnedCreatures": [
    {
      "id": "nest-creature-4",
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
      "spawnedRound": 17,
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

### Turn 68 (round 17)
- Player: 胡斐 (player-2), level 3, experience 14, at (7, 6), health 9.950000000000001, stamina 8.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=130.94999999999993/145, creature-nest-2=137.6799999999999/159, creature-nest-3=137.43999999999997/159

```json
{
  "actions": [
    {
      "id": "action-17-player-2-268",
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
          "row": 7,
          "column": 6
        },
        "reason": "保命：逃離 生物巢穴 2的怪物 Lv.1（hitsSurvivable=1.2437500000000001）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 2的怪物 Lv.1（hitsSurvivable=1.2437500000000001）",
      "createdAt": "2026-09-02T15:47:51.536Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 69 (round 17)
- Player: 胡斐 (player-2), level 3, experience 14, at (6, 6), health 9.950000000000001, stamina 6.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=130.94999999999993/145, creature-nest-2=137.6799999999999/159, creature-nest-3=137.43999999999997/159

```json
{
  "actions": [
    {
      "id": "action-17-player-2-269",
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
          "column": 6
        },
        "reason": "保命：逃離 生物巢穴 2的怪物 Lv.1（hitsSurvivable=1.2437500000000001）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 2的怪物 Lv.1（hitsSurvivable=1.2437500000000001）",
      "createdAt": "2026-09-02T15:47:51.544Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 70 (round 17)
- Player: 胡斐 (player-2), level 3, experience 14, at (5, 6), health 9.950000000000001, stamina 4.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=130.94999999999993/145, creature-nest-2=137.6799999999999/159, creature-nest-3=137.43999999999997/159

```json
{
  "actions": [
    {
      "id": "action-17-player-2-270",
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
          "column": 6
        },
        "reason": "保命：逃離 生物巢穴 2的怪物 Lv.2（hitsSurvivable=1.2437500000000001）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 2的怪物 Lv.2（hitsSurvivable=1.2437500000000001）",
      "createdAt": "2026-09-02T15:47:51.549Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 71 (round 17)
- Player: 胡斐 (player-2), level 3, experience 14, at (4, 6), health 9.950000000000001, stamina 2.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=130.94999999999993/145, creature-nest-2=137.6799999999999/159, creature-nest-3=137.43999999999997/159

```json
{
  "actions": [
    {
      "id": "action-17-player-2-271",
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
          "row": 4,
          "column": 6
        },
        "reason": "保命：逃離 游蕩妖物（hitsSurvivable=1.2437500000000001）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 游蕩妖物（hitsSurvivable=1.2437500000000001）",
      "createdAt": "2026-09-02T15:47:51.554Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 72 (round 17)
- Player: 胡斐 (player-2), level 3, experience 14, at (4, 7), health 9.950000000000001, stamina 0.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=130.94999999999993/145, creature-nest-2=137.6799999999999/159, creature-nest-3=137.43999999999997/159

```json
{
  "actions": [
    {
      "id": "action-17-player-2-272",
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
          "row": 4,
          "column": 7
        },
        "reason": "保命：逃離 游蕩妖物（hitsSurvivable=1.2437500000000001）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 游蕩妖物（hitsSurvivable=1.2437500000000001）",
      "createdAt": "2026-09-02T15:47:51.559Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 73 (round 17)
- Player: 胡斐 (player-2), level 3, experience 14, at (4, 7), health 29.950000000000003, stamina 0.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=130.94999999999993/145, creature-nest-2=137.6799999999999/159, creature-nest-3=137.43999999999997/159

```json
{
  "actions": [
    {
      "id": "action-17-player-2-273",
      "round": 17,
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
      "createdAt": "2026-09-02T15:47:51.562Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 74 (round 18)
- Player: 胡斐 (player-2), level 3, experience 15, at (4, 7), health 26.750000000000004, stamina 10.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132.39999999999992/145, creature-nest-2=139.2699999999999/159, creature-nest-3=139.02999999999997/159

```json
{
  "actions": [
    {
      "id": "action-17-roamer-creature-1-274",
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
      "createdAt": "2026-09-02T15:47:51.564Z"
    },
    {
      "id": "action-17-roamer-creature-2-275",
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
      "createdAt": "2026-09-02T15:47:51.565Z"
    },
    {
      "id": "action-17-roamer-creature-3-276",
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
      "createdAt": "2026-09-02T15:47:51.565Z"
    },
    {
      "id": "action-17-roamer-creature-4-277",
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
      "createdAt": "2026-09-02T15:47:51.565Z"
    },
    {
      "id": "action-17-roamer-creature-5-278",
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
      "createdAt": "2026-09-02T15:47:51.565Z"
    },
    {
      "id": "action-17-roamer-creature-6-279",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.565Z"
    },
    {
      "id": "action-17-roamer-creature-7-280",
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
      "createdAt": "2026-09-02T15:47:51.565Z"
    },
    {
      "id": "action-17-roamer-creature-8-281",
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
      "createdAt": "2026-09-02T15:47:51.565Z"
    },
    {
      "id": "action-17-roamer-creature-9-282",
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
            "row": 4,
            "column": 7
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T15:47:51.565Z"
    },
    {
      "id": "action-17-nest-creature-1-283",
      "round": 17,
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
      "createdAt": "2026-09-02T15:47:51.565Z"
    },
    {
      "id": "action-17-nest-creature-2-284",
      "round": 17,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.565Z"
    },
    {
      "id": "action-17-nest-creature-5-285",
      "round": 17,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 6
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.565Z"
    },
    {
      "id": "action-17-nest-creature-6-286",
      "round": 17,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-6",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T15:47:51.565Z"
    },
    {
      "id": "action-17-nest-creature-3-287",
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
      "createdAt": "2026-09-02T15:47:51.565Z"
    },
    {
      "id": "action-17-nest-creature-4-288",
      "round": 17,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 4,
          "column": 4
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.565Z"
    },
    {
      "id": "action-18-player-2-289",
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
      "createdAt": "2026-09-02T15:47:51.566Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 75 (round 18)
- Player: 胡斐 (player-2), level 3, experience 15, at (4, 6), health 26.750000000000004, stamina 8.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132.39999999999992/145, creature-nest-2=139.2699999999999/159, creature-nest-3=139.02999999999997/159

```json
{
  "actions": [
    {
      "id": "action-18-player-2-290",
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
          "row": 4,
          "column": 6
        },
        "reason": "定位：前往出口 (4,6)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (4,6)",
      "createdAt": "2026-09-02T15:47:51.572Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 76 (round 18)
- Player: 胡斐 (player-2), level 3, experience 35, at (4, 6), health 26.750000000000004, stamina 3.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132.39999999999992/145, creature-nest-2=139.2699999999999/159, creature-nest-3=139.02999999999997/159

```json
{
  "actions": [
    {
      "id": "action-18-player-2-291",
      "round": 18,
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
          "id": "ruin-15",
          "kind": "ruin",
          "position": {
            "row": 4,
            "column": 5
          }
        },
        "reason": "清障：清除廢墟 稻香村"
      },
      "result": "succeeded",
      "reason": "清障：清除廢墟 稻香村",
      "createdAt": "2026-09-02T15:47:51.579Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 77 (round 18)
- Player: 胡斐 (player-2), level 3, experience 35, at (4, 5), health 26.750000000000004, stamina 0.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=132.39999999999992/145, creature-nest-2=139.2699999999999/159, creature-nest-3=139.02999999999997/159

```json
{
  "actions": [
    {
      "id": "action-18-player-2-292",
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
          "row": 4,
          "column": 5
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:51.586Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 78 (round 19)
- Player: 胡斐 (player-2), level 3, experience 36, at (4, 5), health 24.550000000000004, stamina 10.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=133.8499999999999/145, creature-nest-2=140.8599999999999/159, creature-nest-3=140.61999999999998/159

```json
{
  "actions": [
    {
      "id": "action-18-roamer-creature-1-293",
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
      "createdAt": "2026-09-02T15:47:51.588Z"
    },
    {
      "id": "action-18-roamer-creature-2-294",
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
      "createdAt": "2026-09-02T15:47:51.588Z"
    },
    {
      "id": "action-18-roamer-creature-3-295",
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
      "createdAt": "2026-09-02T15:47:51.588Z"
    },
    {
      "id": "action-18-roamer-creature-4-296",
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
      "createdAt": "2026-09-02T15:47:51.588Z"
    },
    {
      "id": "action-18-roamer-creature-5-297",
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
      "createdAt": "2026-09-02T15:47:51.588Z"
    },
    {
      "id": "action-18-roamer-creature-6-298",
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
      "createdAt": "2026-09-02T15:47:51.588Z"
    },
    {
      "id": "action-18-roamer-creature-7-299",
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
      "createdAt": "2026-09-02T15:47:51.589Z"
    },
    {
      "id": "action-18-roamer-creature-8-300",
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
      "createdAt": "2026-09-02T15:47:51.589Z"
    },
    {
      "id": "action-18-roamer-creature-9-301",
      "round": 18,
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
      "createdAt": "2026-09-02T15:47:51.589Z"
    },
    {
      "id": "action-18-nest-creature-1-302",
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
          "row": 6,
          "column": 5
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.589Z"
    },
    {
      "id": "action-18-nest-creature-2-303",
      "round": 18,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.589Z"
    },
    {
      "id": "action-18-nest-creature-5-304",
      "round": 18,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.589Z"
    },
    {
      "id": "action-18-nest-creature-6-305",
      "round": 18,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-6",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T15:47:51.589Z"
    },
    {
      "id": "action-18-nest-creature-3-306",
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
      "createdAt": "2026-09-02T15:47:51.589Z"
    },
    {
      "id": "action-18-nest-creature-4-307",
      "round": 18,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
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
            "row": 4,
            "column": 5
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T15:47:51.589Z"
    },
    {
      "id": "action-19-player-2-308",
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
      "createdAt": "2026-09-02T15:47:51.589Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 79 (round 19)
- Player: 胡斐 (player-2), level 3, experience 36, at (3, 5), health 24.550000000000004, stamina 5.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=133.8499999999999/145, creature-nest-2=140.8599999999999/159, creature-nest-3=140.61999999999998/159

```json
{
  "actions": [
    {
      "id": "action-19-player-2-309",
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
          "row": 3,
          "column": 5
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:51.598Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 80 (round 19)
- Player: 胡斐 (player-2), level 3, experience 36, at (3, 6), health 24.550000000000004, stamina 0.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=133.8499999999999/145, creature-nest-2=140.8599999999999/159, creature-nest-3=140.61999999999998/159

```json
{
  "actions": [
    {
      "id": "action-19-player-2-310",
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
          "row": 3,
          "column": 6
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:51.606Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 81 (round 20)
- Player: 胡斐 (player-2), level 3, experience 37, at (3, 6), health 24.350000000000005, stamina 10.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=135.2999999999999/145, creature-nest-2=142.4499999999999/159, creature-nest-3=142.20999999999998/159

```json
{
  "actions": [
    {
      "id": "action-19-roamer-creature-1-311",
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
      "createdAt": "2026-09-02T15:47:51.610Z"
    },
    {
      "id": "action-19-roamer-creature-2-312",
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
      "createdAt": "2026-09-02T15:47:51.610Z"
    },
    {
      "id": "action-19-roamer-creature-3-313",
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
      "createdAt": "2026-09-02T15:47:51.610Z"
    },
    {
      "id": "action-19-roamer-creature-4-314",
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.610Z"
    },
    {
      "id": "action-19-roamer-creature-5-315",
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
      "createdAt": "2026-09-02T15:47:51.610Z"
    },
    {
      "id": "action-19-roamer-creature-6-316",
      "round": 19,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "target": {
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 3,
            "column": 6
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T15:47:51.611Z"
    },
    {
      "id": "action-19-roamer-creature-7-317",
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
      "createdAt": "2026-09-02T15:47:51.611Z"
    },
    {
      "id": "action-19-roamer-creature-8-318",
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
      "createdAt": "2026-09-02T15:47:51.611Z"
    },
    {
      "id": "action-19-roamer-creature-9-319",
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
      "createdAt": "2026-09-02T15:47:51.611Z"
    },
    {
      "id": "action-19-nest-creature-1-320",
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
          "row": 7,
          "column": 6
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.611Z"
    },
    {
      "id": "action-19-nest-creature-2-321",
      "round": 19,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.611Z"
    },
    {
      "id": "action-19-nest-creature-5-322",
      "round": 19,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.611Z"
    },
    {
      "id": "action-19-nest-creature-6-323",
      "round": 19,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-6",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T15:47:51.611Z"
    },
    {
      "id": "action-19-nest-creature-3-324",
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
      "createdAt": "2026-09-02T15:47:51.611Z"
    },
    {
      "id": "action-19-nest-creature-4-325",
      "round": 19,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 2,
          "column": 4
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.611Z"
    },
    {
      "id": "action-20-player-2-326",
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
      "createdAt": "2026-09-02T15:47:51.612Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 82 (round 20)
- Player: 胡斐 (player-2), level 3, experience 57, at (3, 6), health 24.350000000000005, stamina 5.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: roamer-creature-6
- Nests: creature-nest-1=135.2999999999999/145, creature-nest-2=142.4499999999999/159, creature-nest-3=142.20999999999998/159

```json
{
  "actions": [
    {
      "id": "action-20-player-2-327",
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
          "id": "roamer-creature-6",
          "kind": "creature",
          "position": {
            "row": 4,
            "column": 6
          }
        },
        "reason": "交戰：攻擊 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 游蕩妖物",
      "createdAt": "2026-09-02T15:47:51.618Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 83 (round 20)
- Player: 胡斐 (player-2), level 3, experience 57, at (3, 7), health 24.350000000000005, stamina 3.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=135.2999999999999/145, creature-nest-2=142.4499999999999/159, creature-nest-3=142.20999999999998/159

```json
{
  "actions": [
    {
      "id": "action-20-player-2-328",
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
          "row": 3,
          "column": 7
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:51.627Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 84 (round 20)
- Player: 胡斐 (player-2), level 3, experience 57, at (4, 7), health 24.350000000000005, stamina 1.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=135.2999999999999/145, creature-nest-2=142.4499999999999/159, creature-nest-3=142.20999999999998/159

```json
{
  "actions": [
    {
      "id": "action-20-player-2-329",
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
          "row": 4,
          "column": 7
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:51.637Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 85 (round 21)
- Player: 胡斐 (player-2), level 3, experience 60, at (4, 7), health 26.150000000000006, stamina 10.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=136.7499999999999/145, creature-nest-2=144.0399999999999/159, creature-nest-3=143.79999999999998/159

```json
{
  "actions": [
    {
      "id": "action-20-roamer-creature-1-330",
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
      "createdAt": "2026-09-02T15:47:51.640Z"
    },
    {
      "id": "action-20-roamer-creature-2-331",
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
      "createdAt": "2026-09-02T15:47:51.640Z"
    },
    {
      "id": "action-20-roamer-creature-3-332",
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
      "createdAt": "2026-09-02T15:47:51.640Z"
    },
    {
      "id": "action-20-roamer-creature-4-333",
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
      "createdAt": "2026-09-02T15:47:51.640Z"
    },
    {
      "id": "action-20-roamer-creature-5-334",
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
      "createdAt": "2026-09-02T15:47:51.640Z"
    },
    {
      "id": "action-20-roamer-creature-7-335",
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
      "createdAt": "2026-09-02T15:47:51.640Z"
    },
    {
      "id": "action-20-roamer-creature-8-336",
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
      "createdAt": "2026-09-02T15:47:51.640Z"
    },
    {
      "id": "action-20-roamer-creature-9-337",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.640Z"
    },
    {
      "id": "action-20-nest-creature-1-338",
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
          "row": 5,
          "column": 6
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.640Z"
    },
    {
      "id": "action-20-nest-creature-2-339",
      "round": 20,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.640Z"
    },
    {
      "id": "action-20-nest-creature-5-340",
      "round": 20,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 5
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.640Z"
    },
    {
      "id": "action-20-nest-creature-6-341",
      "round": 20,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-6",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T15:47:51.640Z"
    },
    {
      "id": "action-20-nest-creature-3-342",
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
      "createdAt": "2026-09-02T15:47:51.640Z"
    },
    {
      "id": "action-20-nest-creature-4-343",
      "round": 20,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 4,
          "column": 5
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.640Z"
    },
    {
      "id": "action-21-player-2-344",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T15:47:51.641Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 86 (round 21)
- Player: 胡斐 (player-2), level 3, experience 60, at (4, 8), health 26.150000000000006, stamina 5.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=136.7499999999999/145, creature-nest-2=144.0399999999999/159, creature-nest-3=143.79999999999998/159

```json
{
  "actions": [
    {
      "id": "action-21-player-2-345",
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
          "row": 4,
          "column": 8
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:51.650Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 87 (round 21)
- Player: 胡斐 (player-2), level 3, experience 80, at (4, 8), health 26.150000000000006, stamina 0.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=136.7499999999999/145, creature-nest-2=144.0399999999999/159, creature-nest-3=143.79999999999998/159

```json
{
  "actions": [
    {
      "id": "action-21-player-2-346",
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
          "id": "ruin-17",
          "kind": "ruin",
          "position": {
            "row": 4,
            "column": 9
          }
        },
        "reason": "清障：清除廢墟 隴頭村"
      },
      "result": "succeeded",
      "reason": "清障：清除廢墟 隴頭村",
      "createdAt": "2026-09-02T15:47:51.658Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 88 (round 22)
- Player: 胡斐 (player-2), level 3, experience 81, at (4, 8), health 27.950000000000006, stamina 10.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +1
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=138.19999999999987/145, creature-nest-2=145.6299999999999/159, creature-nest-3=145.39/175

```json
{
  "actions": [
    {
      "id": "action-21-roamer-creature-1-347",
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
      "createdAt": "2026-09-02T15:47:51.663Z"
    },
    {
      "id": "action-21-roamer-creature-2-348",
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
      "createdAt": "2026-09-02T15:47:51.663Z"
    },
    {
      "id": "action-21-roamer-creature-3-349",
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
      "createdAt": "2026-09-02T15:47:51.663Z"
    },
    {
      "id": "action-21-roamer-creature-4-350",
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
      "createdAt": "2026-09-02T15:47:51.663Z"
    },
    {
      "id": "action-21-roamer-creature-5-351",
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
      "createdAt": "2026-09-02T15:47:51.663Z"
    },
    {
      "id": "action-21-roamer-creature-7-352",
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
      "createdAt": "2026-09-02T15:47:51.663Z"
    },
    {
      "id": "action-21-roamer-creature-8-353",
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
      "createdAt": "2026-09-02T15:47:51.663Z"
    },
    {
      "id": "action-21-roamer-creature-9-354",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.663Z"
    },
    {
      "id": "action-21-nest-creature-1-355",
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
          "column": 6
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.663Z"
    },
    {
      "id": "action-21-nest-creature-2-356",
      "round": 21,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.663Z"
    },
    {
      "id": "action-21-nest-creature-5-357",
      "round": 21,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "destination": {
          "row": 2,
          "column": 5
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.663Z"
    },
    {
      "id": "action-21-nest-creature-6-358",
      "round": 21,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-6",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T15:47:51.663Z"
    },
    {
      "id": "action-21-nest-creature-3-359",
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
      "createdAt": "2026-09-02T15:47:51.663Z"
    },
    {
      "id": "action-21-nest-creature-4-360",
      "round": 21,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 6
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.663Z"
    },
    {
      "id": "action-22-player-2-361",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T15:47:51.665Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": [
    {
      "id": "nest-creature-7",
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
      "spawnedRound": 22,
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

### Turn 89 (round 22)
- Player: 胡斐 (player-2), level 3, experience 84, at (4, 8), health 27.950000000000006, stamina 5.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=138.19999999999987/145, creature-nest-2=145.6299999999999/159, creature-nest-3=145.39/175

```json
{
  "actions": [
    {
      "id": "action-22-player-2-362",
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
          "id": "roamer-creature-9",
          "kind": "creature",
          "position": {
            "row": 4,
            "column": 7
          }
        },
        "reason": "交戰：攻擊 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 游蕩妖物",
      "createdAt": "2026-09-02T15:47:51.673Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 90 (round 22)
- Player: 胡斐 (player-2), level 3, experience 87, at (4, 8), health 27.950000000000006, stamina 0.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=138.19999999999987/145, creature-nest-2=145.6299999999999/159, creature-nest-3=145.39/175

```json
{
  "actions": [
    {
      "id": "action-22-player-2-363",
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
          "id": "roamer-creature-9",
          "kind": "creature",
          "position": {
            "row": 4,
            "column": 7
          }
        },
        "reason": "交戰：攻擊 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 游蕩妖物",
      "createdAt": "2026-09-02T15:47:51.682Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 91 (round 23)
- Player: 胡斐 (player-2), level 3, experience 88, at (4, 8), health 24.750000000000007, stamina 10.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=139.64999999999986/145, creature-nest-2=147.2199999999999/159, creature-nest-3=147.14/175

```json
{
  "actions": [
    {
      "id": "action-22-roamer-creature-1-364",
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
      "createdAt": "2026-09-02T15:47:51.685Z"
    },
    {
      "id": "action-22-roamer-creature-2-365",
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
      "createdAt": "2026-09-02T15:47:51.685Z"
    },
    {
      "id": "action-22-roamer-creature-3-366",
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
      "createdAt": "2026-09-02T15:47:51.685Z"
    },
    {
      "id": "action-22-roamer-creature-4-367",
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
      "createdAt": "2026-09-02T15:47:51.685Z"
    },
    {
      "id": "action-22-roamer-creature-5-368",
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
      "createdAt": "2026-09-02T15:47:51.685Z"
    },
    {
      "id": "action-22-roamer-creature-7-369",
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
      "createdAt": "2026-09-02T15:47:51.685Z"
    },
    {
      "id": "action-22-roamer-creature-8-370",
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
      "createdAt": "2026-09-02T15:47:51.685Z"
    },
    {
      "id": "action-22-roamer-creature-9-371",
      "round": 22,
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
            "row": 4,
            "column": 8
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T15:47:51.685Z"
    },
    {
      "id": "action-22-nest-creature-1-372",
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
          "column": 6
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.685Z"
    },
    {
      "id": "action-22-nest-creature-2-373",
      "round": 22,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.685Z"
    },
    {
      "id": "action-22-nest-creature-5-374",
      "round": 22,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "destination": {
          "row": 4,
          "column": 5
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.686Z"
    },
    {
      "id": "action-22-nest-creature-6-375",
      "round": 22,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-6",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T15:47:51.686Z"
    },
    {
      "id": "action-22-nest-creature-3-376",
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
      "createdAt": "2026-09-02T15:47:51.686Z"
    },
    {
      "id": "action-22-nest-creature-4-377",
      "round": 22,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 6
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.686Z"
    },
    {
      "id": "action-22-nest-creature-7-378",
      "round": 22,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
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
      "createdAt": "2026-09-02T15:47:51.686Z"
    },
    {
      "id": "action-23-player-2-379",
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
      "createdAt": "2026-09-02T15:47:51.686Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 92 (round 23)
- Player: 胡斐 (player-2), level 3, experience 88, at (4, 9), health 24.750000000000007, stamina 8.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=139.64999999999986/145, creature-nest-2=147.2199999999999/159, creature-nest-3=147.14/175

```json
{
  "actions": [
    {
      "id": "action-23-player-2-380",
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
          "row": 4,
          "column": 9
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:51.696Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 93 (round 23)
- Player: 胡斐 (player-2), level 3, experience 88, at (3, 9), health 24.750000000000007, stamina 5.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=139.64999999999986/145, creature-nest-2=147.2199999999999/159, creature-nest-3=147.14/175

```json
{
  "actions": [
    {
      "id": "action-23-player-2-381",
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
          "column": 9
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:51.704Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 94 (round 23)
- Player: 胡斐 (player-2), level 3, experience 88, at (3, 9), health 24.750000000000007, stamina 2.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=139.64999999999986/145, creature-nest-2=147.2199999999999/159, creature-nest-3=147.14/175

```json
{
  "actions": [
    {
      "id": "action-23-player-2-382",
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
      "createdAt": "2026-09-02T15:47:51.711Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 95 (round 23)
- Player: 胡斐 (player-2), level 3, experience 88, at (4, 9), health 24.750000000000007, stamina 0.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=139.64999999999986/145, creature-nest-2=147.2199999999999/159, creature-nest-3=147.14/175

```json
{
  "actions": [
    {
      "id": "action-23-player-2-383",
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
          "row": 4,
          "column": 9
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:51.718Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 96 (round 24)
- Player: 胡斐 (player-2), level 3, experience 89, at (4, 9), health 26.550000000000008, stamina 10.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +1
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=141.09999999999985/159, creature-nest-2=148.80999999999992/159, creature-nest-3=148.89/175

```json
{
  "actions": [
    {
      "id": "action-23-roamer-creature-1-384",
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
      "createdAt": "2026-09-02T15:47:51.721Z"
    },
    {
      "id": "action-23-roamer-creature-2-385",
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
      "createdAt": "2026-09-02T15:47:51.721Z"
    },
    {
      "id": "action-23-roamer-creature-3-386",
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
      "createdAt": "2026-09-02T15:47:51.721Z"
    },
    {
      "id": "action-23-roamer-creature-4-387",
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
      "createdAt": "2026-09-02T15:47:51.721Z"
    },
    {
      "id": "action-23-roamer-creature-5-388",
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
      "createdAt": "2026-09-02T15:47:51.721Z"
    },
    {
      "id": "action-23-roamer-creature-7-389",
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
      "createdAt": "2026-09-02T15:47:51.721Z"
    },
    {
      "id": "action-23-roamer-creature-8-390",
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
      "createdAt": "2026-09-02T15:47:51.721Z"
    },
    {
      "id": "action-23-roamer-creature-9-391",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.721Z"
    },
    {
      "id": "action-23-nest-creature-1-392",
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
          "row": 4,
          "column": 7
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.721Z"
    },
    {
      "id": "action-23-nest-creature-2-393",
      "round": 23,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.721Z"
    },
    {
      "id": "action-23-nest-creature-5-394",
      "round": 23,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-5",
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
      "createdAt": "2026-09-02T15:47:51.721Z"
    },
    {
      "id": "action-23-nest-creature-6-395",
      "round": 23,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-6",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T15:47:51.721Z"
    },
    {
      "id": "action-23-nest-creature-3-396",
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
      "createdAt": "2026-09-02T15:47:51.721Z"
    },
    {
      "id": "action-23-nest-creature-4-397",
      "round": 23,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
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
      "createdAt": "2026-09-02T15:47:51.721Z"
    },
    {
      "id": "action-23-nest-creature-7-398",
      "round": 23,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
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
      "createdAt": "2026-09-02T15:47:51.721Z"
    },
    {
      "id": "action-24-player-2-399",
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
      "createdAt": "2026-09-02T15:47:51.722Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": [
    {
      "id": "nest-creature-8",
      "name": "生物巢穴 1的怪物 Lv.3",
      "innerSkillId": "void-spirit-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 12,
        "column": 2
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

### Turn 97 (round 24)
- Player: 胡斐 (player-2), level 3, experience 92, at (4, 9), health 26.550000000000008, stamina 5.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=141.09999999999985/159, creature-nest-2=148.80999999999992/159, creature-nest-3=148.89/175

```json
{
  "actions": [
    {
      "id": "action-24-player-2-400",
      "round": 24,
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
            "row": 4,
            "column": 8
          }
        },
        "reason": "交戰：攻擊 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 游蕩妖物",
      "createdAt": "2026-09-02T15:47:51.730Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 98 (round 24)
- Player: 胡斐 (player-2), level 3, experience 112, at (4, 9), health 26.550000000000008, stamina 0.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: roamer-creature-9
- Nests: creature-nest-1=141.09999999999985/159, creature-nest-2=148.80999999999992/159, creature-nest-3=148.89/175

```json
{
  "actions": [
    {
      "id": "action-24-player-2-401",
      "round": 24,
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
            "row": 4,
            "column": 8
          }
        },
        "reason": "交戰：攻擊 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 游蕩妖物",
      "createdAt": "2026-09-02T15:47:51.737Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 99 (round 25)
- Player: 胡斐 (player-2), level 3, experience 113, at (4, 9), health 28.35000000000001, stamina 10.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +1
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=142.68999999999986/159, creature-nest-2=150.39999999999992/175, creature-nest-3=150.64/175

```json
{
  "actions": [
    {
      "id": "action-24-roamer-creature-1-402",
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
      "createdAt": "2026-09-02T15:47:51.739Z"
    },
    {
      "id": "action-24-roamer-creature-2-403",
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
      "createdAt": "2026-09-02T15:47:51.740Z"
    },
    {
      "id": "action-24-roamer-creature-3-404",
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
      "createdAt": "2026-09-02T15:47:51.740Z"
    },
    {
      "id": "action-24-roamer-creature-4-405",
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
      "createdAt": "2026-09-02T15:47:51.740Z"
    },
    {
      "id": "action-24-roamer-creature-5-406",
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
      "createdAt": "2026-09-02T15:47:51.740Z"
    },
    {
      "id": "action-24-roamer-creature-7-407",
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
      "createdAt": "2026-09-02T15:47:51.740Z"
    },
    {
      "id": "action-24-roamer-creature-8-408",
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
      "createdAt": "2026-09-02T15:47:51.740Z"
    },
    {
      "id": "action-24-nest-creature-1-409",
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
          "column": 8
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T15:47:51.740Z"
    },
    {
      "id": "action-24-nest-creature-2-410",
      "round": 24,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.740Z"
    },
    {
      "id": "action-24-nest-creature-5-411",
      "round": 24,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.2"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.740Z"
    },
    {
      "id": "action-24-nest-creature-6-412",
      "round": 24,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-6",
          "kind": "creature"
        },
        "destination": {
          "row": 7,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T15:47:51.740Z"
    },
    {
      "id": "action-24-nest-creature-3-413",
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
      "createdAt": "2026-09-02T15:47:51.740Z"
    },
    {
      "id": "action-24-nest-creature-4-414",
      "round": 24,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T15:47:51.740Z"
    },
    {
      "id": "action-24-nest-creature-7-415",
      "round": 24,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
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
      "createdAt": "2026-09-02T15:47:51.740Z"
    },
    {
      "id": "action-24-nest-creature-8-416",
      "round": 24,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T15:47:51.740Z"
    },
    {
      "id": "action-25-player-2-417",
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
      "createdAt": "2026-09-02T15:47:51.742Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": [
    {
      "id": "nest-creature-9",
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
      "spawnedRound": 25,
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
    }
  ]
}
```

### Turn 100 (round 25)
- Player: 胡斐 (player-2), level 3, experience 116, at (4, 9), health 28.35000000000001, stamina 5.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=142.68999999999986/159, creature-nest-2=150.39999999999992/175, creature-nest-3=150.64/175

```json
{
  "actions": [
    {
      "id": "action-25-player-2-418",
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
            "row": 4,
            "column": 8
          }
        },
        "reason": "交戰：攻擊 生物巢穴 2的怪物 Lv.2"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 2的怪物 Lv.2",
      "createdAt": "2026-09-02T15:47:51.751Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 101 (round 25)
- Player: 胡斐 (player-2), level 4, experience 6, at (4, 9), health 28.35000000000001, stamina 0.5
- Attributes: armStrength=12, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: -110 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: nest-creature-5
- Nests: creature-nest-1=142.68999999999986/159, creature-nest-2=150.39999999999992/175, creature-nest-3=150.64/175

```json
{
  "actions": [
    {
      "id": "action-25-player-2-419",
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
            "row": 4,
            "column": 8
          }
        },
        "reason": "交戰：攻擊 生物巢穴 2的怪物 Lv.2"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 2的怪物 Lv.2",
      "createdAt": "2026-09-02T15:47:51.760Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 102 (round 25)
- Player: 胡斐 (player-2), level 4, experience 6, at (4, 9), health 28.35000000000001, stamina 0.5
- Attributes: armStrength=13, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=142.68999999999986/159, creature-nest-2=150.39999999999992/175, creature-nest-3=150.64/175

```json
{
  "actions": [
    {
      "id": "action-25-player-2-420",
      "round": 25,
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
      "createdAt": "2026-09-02T15:47:51.765Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 103 (round 25)
- Player: 胡斐 (player-2), level 4, experience 6, at (4, 9), health 28.35000000000001, stamina 0.5
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=142.68999999999986/159, creature-nest-2=150.39999999999992/175, creature-nest-3=150.64/175

```json
{
  "actions": [
    {
      "id": "action-25-player-2-421",
      "round": 25,
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
      "createdAt": "2026-09-02T15:47:51.770Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 104 (round 26)
- Player: 胡斐 (player-2), level 4, experience 7, at (4, 9), health 30.300000000000008, stamina 11
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=144.27999999999986/159, creature-nest-2=152.14999999999992/175, creature-nest-3=152.39/175

```json
{
  "actions": [
    {
      "id": "action-25-roamer-creature-1-422",
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
      "createdAt": "2026-09-02T15:47:51.775Z"
    },
    {
      "id": "action-25-roamer-creature-2-423",
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
      "createdAt": "2026-09-02T15:47:51.775Z"
    },
    {
      "id": "action-25-roamer-creature-3-424",
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
      "createdAt": "2026-09-02T15:47:51.775Z"
    },
    {
      "id": "action-25-roamer-creature-4-425",
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
      "createdAt": "2026-09-02T15:47:51.775Z"
    },
    {
      "id": "action-25-roamer-creature-5-426",
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
      "createdAt": "2026-09-02T15:47:51.775Z"
    },
    {
      "id": "action-25-roamer-creature-7-427",
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
      "createdAt": "2026-09-02T15:47:51.775Z"
    },
    {
      "id": "action-25-roamer-creature-8-428",
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
      "createdAt": "2026-09-02T15:47:51.775Z"
    },
    {
      "id": "action-25-nest-creature-1-429",
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
          "column": 8
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T15:47:51.775Z"
    },
    {
      "id": "action-25-nest-creature-2-430",
      "round": 25,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.775Z"
    },
    {
      "id": "action-25-nest-creature-6-431",
      "round": 25,
      "actor": {
        "id": "nest-creature-6",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-6",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T15:47:51.775Z"
    },
    {
      "id": "action-25-nest-creature-3-432",
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
      "createdAt": "2026-09-02T15:47:51.775Z"
    },
    {
      "id": "action-25-nest-creature-4-433",
      "round": 25,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-4",
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
      "createdAt": "2026-09-02T15:47:51.776Z"
    },
    {
      "id": "action-25-nest-creature-7-434",
      "round": 25,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-7",
          "kind": "creature"
        },
        "destination": {
          "row": 9,
          "column": 11
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T15:47:51.776Z"
    },
    {
      "id": "action-25-nest-creature-8-435",
      "round": 25,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T15:47:51.776Z"
    },
    {
      "id": "action-25-nest-creature-9-436",
      "round": 25,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
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
      "createdAt": "2026-09-02T15:47:51.776Z"
    },
    {
      "id": "action-26-player-2-437",
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
      "createdAt": "2026-09-02T15:47:51.776Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-4",
      "creatureName": "生物巢穴 2的怪物 Lv.3",
      "message": "生物巢穴 2的怪物 Lv.3 攻擊耕田，造成 6 點傷害。"
    },
    {
      "creatureId": "nest-creature-7",
      "creatureName": "生物巢穴 3的怪物 Lv.4",
      "message": "生物巢穴 3的怪物 Lv.4 發現並摧毀了道具點。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 105 (round 26)
- Player: 胡斐 (player-2), level 4, experience 7, at (5, 10), health 30.300000000000008, stamina 7
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=144.27999999999986/159, creature-nest-2=152.14999999999992/175, creature-nest-3=152.39/175

```json
{
  "actions": [
    {
      "id": "action-26-player-2-438",
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
          "row": 5,
          "column": 10
        },
        "reason": "清障：移動到廢墟 柳岸村 附近"
      },
      "result": "succeeded",
      "reason": "清障：移動到廢墟 柳岸村 附近",
      "createdAt": "2026-09-02T15:47:51.784Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 106 (round 26)
- Player: 胡斐 (player-2), level 4, experience 7, at (5, 9), health 30.300000000000008, stamina 5
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=144.27999999999986/159, creature-nest-2=152.14999999999992/175, creature-nest-3=152.39/175

```json
{
  "actions": [
    {
      "id": "action-26-player-2-439",
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
          "row": 5,
          "column": 9
        },
        "reason": "交戰：移動到 生物巢穴 3的怪物 Lv.3 附近"
      },
      "result": "succeeded",
      "reason": "交戰：移動到 生物巢穴 3的怪物 Lv.3 附近",
      "createdAt": "2026-09-02T15:47:51.795Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 107 (round 26)
- Player: 胡斐 (player-2), level 4, experience 67, at (5, 9), health 30.300000000000008, stamina 0
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +60
- Spawned creatures: 0
- Defeated creatures: nest-creature-6
- Nests: creature-nest-1=144.27999999999986/159, creature-nest-2=152.14999999999992/175, creature-nest-3=152.39/175

```json
{
  "actions": [
    {
      "id": "action-26-player-2-440",
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
          "id": "nest-creature-6",
          "kind": "creature",
          "position": {
            "row": 6,
            "column": 9
          }
        },
        "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.3"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.3",
      "createdAt": "2026-09-02T15:47:51.802Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 108 (round 27)
- Player: 胡斐 (player-2), level 4, experience 67, at (5, 9), health 32.25000000000001, stamina 11
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=145.86999999999986/159, creature-nest-2=153.89999999999992/175, creature-nest-3=154.14/175

```json
{
  "actions": [
    {
      "id": "action-26-roamer-creature-1-441",
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
      "createdAt": "2026-09-02T15:47:51.802Z"
    },
    {
      "id": "action-26-roamer-creature-2-442",
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
      "createdAt": "2026-09-02T15:47:51.802Z"
    },
    {
      "id": "action-26-roamer-creature-3-443",
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
      "createdAt": "2026-09-02T15:47:51.802Z"
    },
    {
      "id": "action-26-roamer-creature-4-444",
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
      "createdAt": "2026-09-02T15:47:51.802Z"
    },
    {
      "id": "action-26-roamer-creature-5-445",
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
      "createdAt": "2026-09-02T15:47:51.802Z"
    },
    {
      "id": "action-26-roamer-creature-7-446",
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
      "createdAt": "2026-09-02T15:47:51.802Z"
    },
    {
      "id": "action-26-roamer-creature-8-447",
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
      "createdAt": "2026-09-02T15:47:51.802Z"
    },
    {
      "id": "action-26-nest-creature-1-448",
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
          "row": 4,
          "column": 9
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T15:47:51.802Z"
    },
    {
      "id": "action-26-nest-creature-2-449",
      "round": 26,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.802Z"
    },
    {
      "id": "action-26-nest-creature-3-450",
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
      "createdAt": "2026-09-02T15:47:51.802Z"
    },
    {
      "id": "action-26-nest-creature-4-451",
      "round": 26,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-4",
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
      "createdAt": "2026-09-02T15:47:51.802Z"
    },
    {
      "id": "action-26-nest-creature-7-452",
      "round": 26,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-7",
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
      "createdAt": "2026-09-02T15:47:51.802Z"
    },
    {
      "id": "action-26-nest-creature-8-453",
      "round": 26,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T15:47:51.803Z"
    },
    {
      "id": "action-26-nest-creature-9-454",
      "round": 26,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
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
      "createdAt": "2026-09-02T15:47:51.803Z"
    },
    {
      "id": "action-27-player-2-455",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-02T15:47:51.803Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 109 (round 27)
- Player: 胡斐 (player-2), level 4, experience 70, at (5, 9), health 32.25000000000001, stamina 6
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=145.86999999999986/159, creature-nest-2=153.89999999999992/175, creature-nest-3=154.14/175

```json
{
  "actions": [
    {
      "id": "action-27-player-2-456",
      "round": 27,
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
            "row": 4,
            "column": 9
          }
        },
        "reason": "交戰：攻擊 生物巢穴 2的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 2的怪物 Lv.1",
      "createdAt": "2026-09-02T15:47:51.812Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 110 (round 27)
- Player: 胡斐 (player-2), level 4, experience 73, at (5, 9), health 32.25000000000001, stamina 1
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=145.86999999999986/159, creature-nest-2=153.89999999999992/175, creature-nest-3=154.14/175

```json
{
  "actions": [
    {
      "id": "action-27-player-2-457",
      "round": 27,
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
            "row": 4,
            "column": 9
          }
        },
        "reason": "交戰：攻擊 生物巢穴 2的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 2的怪物 Lv.1",
      "createdAt": "2026-09-02T15:47:51.819Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 111 (round 28)
- Player: 胡斐 (player-2), level 4, experience 75, at (5, 9), health 34.20000000000001, stamina 11
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=147.45999999999987/159, creature-nest-2=155.64999999999992/175, creature-nest-3=155.89/175

```json
{
  "actions": [
    {
      "id": "action-27-roamer-creature-1-458",
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
      "createdAt": "2026-09-02T15:47:51.822Z"
    },
    {
      "id": "action-27-roamer-creature-2-459",
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
      "createdAt": "2026-09-02T15:47:51.822Z"
    },
    {
      "id": "action-27-roamer-creature-3-460",
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
      "createdAt": "2026-09-02T15:47:51.822Z"
    },
    {
      "id": "action-27-roamer-creature-4-461",
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
      "createdAt": "2026-09-02T15:47:51.822Z"
    },
    {
      "id": "action-27-roamer-creature-5-462",
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
      "createdAt": "2026-09-02T15:47:51.822Z"
    },
    {
      "id": "action-27-roamer-creature-7-463",
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
      "createdAt": "2026-09-02T15:47:51.822Z"
    },
    {
      "id": "action-27-roamer-creature-8-464",
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
      "createdAt": "2026-09-02T15:47:51.822Z"
    },
    {
      "id": "action-27-nest-creature-1-465",
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
          "row": 5,
          "column": 10
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T15:47:51.822Z"
    },
    {
      "id": "action-27-nest-creature-2-466",
      "round": 27,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 8,
          "column": 9
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.822Z"
    },
    {
      "id": "action-27-nest-creature-3-467",
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
      "createdAt": "2026-09-02T15:47:51.822Z"
    },
    {
      "id": "action-27-nest-creature-4-468",
      "round": 27,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-4",
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
      "createdAt": "2026-09-02T15:47:51.822Z"
    },
    {
      "id": "action-27-nest-creature-7-469",
      "round": 27,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-7",
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
      "createdAt": "2026-09-02T15:47:51.822Z"
    },
    {
      "id": "action-27-nest-creature-8-470",
      "round": 27,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T15:47:51.822Z"
    },
    {
      "id": "action-27-nest-creature-9-471",
      "round": 27,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
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
      "createdAt": "2026-09-02T15:47:51.822Z"
    },
    {
      "id": "action-28-player-2-472",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T15:47:51.823Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 112 (round 28)
- Player: 胡斐 (player-2), level 4, experience 95, at (5, 9), health 34.20000000000001, stamina 6
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: nest-creature-1
- Nests: creature-nest-1=147.45999999999987/159, creature-nest-2=155.64999999999992/175, creature-nest-3=155.89/175

```json
{
  "actions": [
    {
      "id": "action-28-player-2-473",
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
          "id": "nest-creature-1",
          "kind": "creature",
          "position": {
            "row": 5,
            "column": 10
          }
        },
        "reason": "交戰：攻擊 生物巢穴 2的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 2的怪物 Lv.1",
      "createdAt": "2026-09-02T15:47:51.831Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 113 (round 28)
- Player: 胡斐 (player-2), level 4, experience 95, at (6, 9), health 34.20000000000001, stamina 4
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=147.45999999999987/159, creature-nest-2=155.64999999999992/175, creature-nest-3=155.89/175

```json
{
  "actions": [
    {
      "id": "action-28-player-2-474",
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
          "row": 6,
          "column": 9
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:51.839Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 114 (round 28)
- Player: 胡斐 (player-2), level 4, experience 95, at (7, 9), health 34.20000000000001, stamina 2
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=147.45999999999987/159, creature-nest-2=155.64999999999992/175, creature-nest-3=155.89/175

```json
{
  "actions": [
    {
      "id": "action-28-player-2-475",
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
          "row": 7,
          "column": 9
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:51.847Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 115 (round 28)
- Player: 胡斐 (player-2), level 4, experience 95, at (6, 9), health 34.20000000000001, stamina 0
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=147.45999999999987/159, creature-nest-2=155.64999999999992/175, creature-nest-3=155.89/175

```json
{
  "actions": [
    {
      "id": "action-28-player-2-476",
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
          "row": 6,
          "column": 9
        },
        "reason": "保命：逃離 生物巢穴 3的怪物 Lv.1（hitsSurvivable=4.275000000000001）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 3的怪物 Lv.1（hitsSurvivable=4.275000000000001）",
      "createdAt": "2026-09-02T15:47:51.852Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 116 (round 29)
- Player: 胡斐 (player-2), level 4, experience 95, at (6, 9), health 36.15000000000001, stamina 11
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=149.04999999999987/159, creature-nest-2=157.39999999999992/175, creature-nest-3=157.64/175

```json
{
  "actions": [
    {
      "id": "action-28-roamer-creature-1-477",
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
      "createdAt": "2026-09-02T15:47:51.853Z"
    },
    {
      "id": "action-28-roamer-creature-2-478",
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
      "createdAt": "2026-09-02T15:47:51.853Z"
    },
    {
      "id": "action-28-roamer-creature-3-479",
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
      "createdAt": "2026-09-02T15:47:51.853Z"
    },
    {
      "id": "action-28-roamer-creature-4-480",
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
      "createdAt": "2026-09-02T15:47:51.853Z"
    },
    {
      "id": "action-28-roamer-creature-5-481",
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
      "createdAt": "2026-09-02T15:47:51.853Z"
    },
    {
      "id": "action-28-roamer-creature-7-482",
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
      "createdAt": "2026-09-02T15:47:51.853Z"
    },
    {
      "id": "action-28-roamer-creature-8-483",
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
      "createdAt": "2026-09-02T15:47:51.853Z"
    },
    {
      "id": "action-28-nest-creature-2-484",
      "round": 28,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 7,
          "column": 10
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T15:47:51.853Z"
    },
    {
      "id": "action-28-nest-creature-3-485",
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
      "createdAt": "2026-09-02T15:47:51.853Z"
    },
    {
      "id": "action-28-nest-creature-4-486",
      "round": 28,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-4",
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
      "createdAt": "2026-09-02T15:47:51.853Z"
    },
    {
      "id": "action-28-nest-creature-7-487",
      "round": 28,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-7",
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
      "createdAt": "2026-09-02T15:47:51.853Z"
    },
    {
      "id": "action-28-nest-creature-8-488",
      "round": 28,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T15:47:51.853Z"
    },
    {
      "id": "action-28-nest-creature-9-489",
      "round": 28,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
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
      "createdAt": "2026-09-02T15:47:51.853Z"
    },
    {
      "id": "action-29-player-2-490",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-02T15:47:51.853Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 117 (round 29)
- Player: 胡斐 (player-2), level 4, experience 95, at (7, 9), health 36.15000000000001, stamina 9
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=149.04999999999987/159, creature-nest-2=157.39999999999992/175, creature-nest-3=157.64/175

```json
{
  "actions": [
    {
      "id": "action-29-player-2-491",
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
          "row": 7,
          "column": 9
        },
        "reason": "交戰：移動到 生物巢穴 3的怪物 Lv.1 附近"
      },
      "result": "succeeded",
      "reason": "交戰：移動到 生物巢穴 3的怪物 Lv.1 附近",
      "createdAt": "2026-09-02T15:47:51.863Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 118 (round 29)
- Player: 胡斐 (player-2), level 4, experience 115, at (7, 9), health 36.15000000000001, stamina 4
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: nest-creature-2
- Nests: creature-nest-1=149.04999999999987/159, creature-nest-2=157.39999999999992/175, creature-nest-3=157.64/175

```json
{
  "actions": [
    {
      "id": "action-29-player-2-492",
      "round": 29,
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
            "column": 10
          }
        },
        "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.1",
      "createdAt": "2026-09-02T15:47:51.869Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 119 (round 29)
- Player: 胡斐 (player-2), level 4, experience 115, at (7, 10), health 36.15000000000001, stamina 2
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=149.04999999999987/159, creature-nest-2=157.39999999999992/175, creature-nest-3=157.64/175

```json
{
  "actions": [
    {
      "id": "action-29-player-2-493",
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
          "row": 7,
          "column": 10
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:51.879Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 120 (round 29)
- Player: 胡斐 (player-2), level 4, experience 115, at (8, 10), health 36.15000000000001, stamina 0
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=149.04999999999987/159, creature-nest-2=157.39999999999992/175, creature-nest-3=157.64/175

```json
{
  "actions": [
    {
      "id": "action-29-player-2-494",
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
          "row": 8,
          "column": 10
        },
        "reason": "收集道具：移動到道具位置"
      },
      "result": "succeeded",
      "reason": "收集道具：移動到道具位置",
      "createdAt": "2026-09-02T15:47:51.884Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 121 (round 30)
- Player: 胡斐 (player-2), level 4, experience 115, at (8, 10), health 38.100000000000016, stamina 11
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=150.63999999999987/159, creature-nest-2=159.14999999999992/175, creature-nest-3=159.39/175

```json
{
  "actions": [
    {
      "id": "action-29-roamer-creature-1-495",
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
      "createdAt": "2026-09-02T15:47:51.884Z"
    },
    {
      "id": "action-29-roamer-creature-2-496",
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
      "createdAt": "2026-09-02T15:47:51.884Z"
    },
    {
      "id": "action-29-roamer-creature-3-497",
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
      "createdAt": "2026-09-02T15:47:51.884Z"
    },
    {
      "id": "action-29-roamer-creature-4-498",
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
      "createdAt": "2026-09-02T15:47:51.884Z"
    },
    {
      "id": "action-29-roamer-creature-5-499",
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
      "createdAt": "2026-09-02T15:47:51.884Z"
    },
    {
      "id": "action-29-roamer-creature-7-500",
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
      "createdAt": "2026-09-02T15:47:51.884Z"
    },
    {
      "id": "action-29-roamer-creature-8-501",
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
      "createdAt": "2026-09-02T15:47:51.884Z"
    },
    {
      "id": "action-29-nest-creature-3-502",
      "round": 29,
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
          "row": 8,
          "column": 6
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.884Z"
    },
    {
      "id": "action-29-nest-creature-4-503",
      "round": 29,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-4",
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
      "createdAt": "2026-09-02T15:47:51.884Z"
    },
    {
      "id": "action-29-nest-creature-7-504",
      "round": 29,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-7",
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
      "createdAt": "2026-09-02T15:47:51.884Z"
    },
    {
      "id": "action-29-nest-creature-8-505",
      "round": 29,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T15:47:51.884Z"
    },
    {
      "id": "action-29-nest-creature-9-506",
      "round": 29,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-9",
          "kind": "creature"
        },
        "destination": {
          "row": 4,
          "column": 10
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T15:47:51.885Z"
    },
    {
      "id": "action-30-player-2-507",
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
      "createdAt": "2026-09-02T15:47:51.885Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 122 (round 30)
- Player: 胡斐 (player-2), level 4, experience 115, at (8, 10), health 38.100000000000016, stamina 11
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=150.63999999999987/159, creature-nest-2=159.14999999999992/175, creature-nest-3=159.39/175

```json
{
  "actions": [
    {
      "id": "action-30-player-2-508",
      "round": 30,
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
          "id": "item-point-15",
          "kind": "item",
          "position": {
            "row": 8,
            "column": 10
          }
        },
        "reason": "收集道具：拾取"
      },
      "result": "succeeded",
      "reason": "收集道具：拾取",
      "createdAt": "2026-09-02T15:47:51.894Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 123 (round 30)
- Player: 胡斐 (player-2), level 4, experience 115, at (8, 9), health 38.100000000000016, stamina 9
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=150.63999999999987/159, creature-nest-2=159.14999999999992/175, creature-nest-3=159.39/175

```json
{
  "actions": [
    {
      "id": "action-30-player-2-509",
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
          "row": 8,
          "column": 9
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:51.903Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 124 (round 30)
- Player: 胡斐 (player-2), level 4, experience 135, at (8, 9), health 38.100000000000016, stamina 4
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=150.63999999999987/159, creature-nest-2=159.14999999999992/175, creature-nest-3=159.39/175

```json
{
  "actions": [
    {
      "id": "action-30-player-2-510",
      "round": 30,
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
      "createdAt": "2026-09-02T15:47:51.910Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 125 (round 30)
- Player: 胡斐 (player-2), level 4, experience 135, at (8, 8), health 38.100000000000016, stamina 2
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=150.63999999999987/159, creature-nest-2=159.14999999999992/175, creature-nest-3=159.39/175

```json
{
  "actions": [
    {
      "id": "action-30-player-2-511",
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
          "row": 8,
          "column": 8
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:51.917Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 126 (round 30)
- Player: 胡斐 (player-2), level 4, experience 135, at (9, 8), health 38.100000000000016, stamina 0
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=150.63999999999987/159, creature-nest-2=159.14999999999992/175, creature-nest-3=159.39/175

```json
{
  "actions": [
    {
      "id": "action-30-player-2-512",
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
          "row": 9,
          "column": 8
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:51.925Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 127 (round 31)
- Player: 胡斐 (player-2), level 4, experience 135, at (9, 8), health 39, stamina 11
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=152.22999999999988/175, creature-nest-2=160.89999999999992/175, creature-nest-3=161.14/175

```json
{
  "actions": [
    {
      "id": "action-30-roamer-creature-1-513",
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
      "createdAt": "2026-09-02T15:47:51.925Z"
    },
    {
      "id": "action-30-roamer-creature-2-514",
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
      "createdAt": "2026-09-02T15:47:51.925Z"
    },
    {
      "id": "action-30-roamer-creature-3-515",
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
      "createdAt": "2026-09-02T15:47:51.925Z"
    },
    {
      "id": "action-30-roamer-creature-4-516",
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
      "createdAt": "2026-09-02T15:47:51.925Z"
    },
    {
      "id": "action-30-roamer-creature-5-517",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T15:47:51.926Z"
    },
    {
      "id": "action-30-roamer-creature-7-518",
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
      "createdAt": "2026-09-02T15:47:51.926Z"
    },
    {
      "id": "action-30-roamer-creature-8-519",
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
      "createdAt": "2026-09-02T15:47:51.926Z"
    },
    {
      "id": "action-30-nest-creature-3-520",
      "round": 30,
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
          "row": 8,
          "column": 6
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.926Z"
    },
    {
      "id": "action-30-nest-creature-4-521",
      "round": 30,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-4",
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
      "createdAt": "2026-09-02T15:47:51.926Z"
    },
    {
      "id": "action-30-nest-creature-7-522",
      "round": 30,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-7",
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
      "createdAt": "2026-09-02T15:47:51.926Z"
    },
    {
      "id": "action-30-nest-creature-8-523",
      "round": 30,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-8",
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
      "createdAt": "2026-09-02T15:47:51.926Z"
    },
    {
      "id": "action-30-nest-creature-9-524",
      "round": 30,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-9",
          "kind": "creature"
        },
        "destination": {
          "row": 4,
          "column": 10
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T15:47:51.926Z"
    },
    {
      "id": "action-31-player-2-525",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-02T15:47:51.926Z"
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
      "id": "nest-creature-1",
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
      "spawnedRound": 31,
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

### Turn 128 (round 31)
- Player: 胡斐 (player-2), level 4, experience 155, at (9, 8), health 39, stamina 6
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: roamer-creature-5
- Nests: creature-nest-1=152.22999999999988/175, creature-nest-2=160.89999999999992/175, creature-nest-3=161.14/175

```json
{
  "actions": [
    {
      "id": "action-31-player-2-526",
      "round": 31,
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
          "id": "roamer-creature-5",
          "kind": "creature",
          "position": {
            "row": 9,
            "column": 7
          }
        },
        "reason": "交戰：攻擊 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 游蕩妖物",
      "createdAt": "2026-09-02T15:47:51.934Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 129 (round 31)
- Player: 胡斐 (player-2), level 4, experience 155, at (9, 7), health 39, stamina 4
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=152.22999999999988/175, creature-nest-2=160.89999999999992/175, creature-nest-3=161.14/175

```json
{
  "actions": [
    {
      "id": "action-31-player-2-527",
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
          "row": 9,
          "column": 7
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:51.943Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 130 (round 31)
- Player: 胡斐 (player-2), level 4, experience 155, at (10, 7), health 39, stamina 2
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=152.22999999999988/175, creature-nest-2=160.89999999999992/175, creature-nest-3=161.14/175

```json
{
  "actions": [
    {
      "id": "action-31-player-2-528",
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
          "row": 10,
          "column": 7
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:51.953Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 131 (round 31)
- Player: 胡斐 (player-2), level 4, experience 155, at (10, 7), health 39, stamina 2
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=152.22999999999988/175, creature-nest-2=160.89999999999992/175, creature-nest-3=161.14/175

```json
{
  "actions": [
    {
      "id": "action-31-player-2-529",
      "round": 31,
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
        "instanceId": "equipment-player-2-0cf2f656-8d71-40ba-9c4c-47c75d19cb76",
        "reason": "裝備：溫玉佩（accessory）"
      },
      "result": "succeeded",
      "reason": "裝備：溫玉佩（accessory）",
      "createdAt": "2026-09-02T15:47:51.960Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 132 (round 31)
- Player: 胡斐 (player-2), level 4, experience 155, at (10, 8), health 39, stamina 0
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=152.22999999999988/175, creature-nest-2=160.89999999999992/175, creature-nest-3=161.14/175

```json
{
  "actions": [
    {
      "id": "action-31-player-2-530",
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
          "row": 10,
          "column": 8
        },
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.2（hitsSurvivable=7.8）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.2（hitsSurvivable=7.8）",
      "createdAt": "2026-09-02T15:47:51.966Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 133 (round 32)
- Player: 胡斐 (player-2), level 4, experience 155, at (10, 8), health 39, stamina 11
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=153.97999999999988/175, creature-nest-2=162.64999999999992/175, creature-nest-3=162.89/175

```json
{
  "actions": [
    {
      "id": "action-31-roamer-creature-1-531",
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
      "createdAt": "2026-09-02T15:47:51.966Z"
    },
    {
      "id": "action-31-roamer-creature-2-532",
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
      "createdAt": "2026-09-02T15:47:51.966Z"
    },
    {
      "id": "action-31-roamer-creature-3-533",
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
      "createdAt": "2026-09-02T15:47:51.966Z"
    },
    {
      "id": "action-31-roamer-creature-4-534",
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
      "createdAt": "2026-09-02T15:47:51.966Z"
    },
    {
      "id": "action-31-roamer-creature-7-535",
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
      "createdAt": "2026-09-02T15:47:51.966Z"
    },
    {
      "id": "action-31-roamer-creature-8-536",
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
      "createdAt": "2026-09-02T15:47:51.966Z"
    },
    {
      "id": "action-31-nest-creature-3-537",
      "round": 31,
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
          "row": 10,
          "column": 6
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:51.966Z"
    },
    {
      "id": "action-31-nest-creature-4-538",
      "round": 31,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-4",
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
      "createdAt": "2026-09-02T15:47:51.966Z"
    },
    {
      "id": "action-31-nest-creature-7-539",
      "round": 31,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-7",
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
      "createdAt": "2026-09-02T15:47:51.966Z"
    },
    {
      "id": "action-31-nest-creature-8-540",
      "round": 31,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-8",
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
      "createdAt": "2026-09-02T15:47:51.967Z"
    },
    {
      "id": "action-31-nest-creature-9-541",
      "round": 31,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-9",
          "kind": "creature"
        },
        "destination": {
          "row": 4,
          "column": 10
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T15:47:51.967Z"
    },
    {
      "id": "action-31-nest-creature-1-542",
      "round": 31,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
      "createdAt": "2026-09-02T15:47:51.967Z"
    },
    {
      "id": "action-32-player-2-543",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-02T15:47:51.967Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 134 (round 32)
- Player: 胡斐 (player-2), level 4, experience 155, at (10, 9), health 39, stamina 9
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=153.97999999999988/175, creature-nest-2=162.64999999999992/175, creature-nest-3=162.89/175

```json
{
  "actions": [
    {
      "id": "action-32-player-2-544",
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
          "row": 10,
          "column": 9
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:51.982Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 135 (round 32)
- Player: 胡斐 (player-2), level 4, experience 155, at (11, 9), health 39, stamina 4
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=153.97999999999988/175, creature-nest-2=162.64999999999992/175, creature-nest-3=162.89/175

```json
{
  "actions": [
    {
      "id": "action-32-player-2-545",
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
          "row": 11,
          "column": 9
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:51.993Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 136 (round 32)
- Player: 胡斐 (player-2), level 4, experience 155, at (12, 9), health 39, stamina 2
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=153.97999999999988/175, creature-nest-2=162.64999999999992/175, creature-nest-3=162.89/175

```json
{
  "actions": [
    {
      "id": "action-32-player-2-546",
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
          "row": 12,
          "column": 9
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:52.001Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 137 (round 33)
- Player: 胡斐 (player-2), level 4, experience 159, at (12, 9), health 39, stamina 11
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +4
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=155.72999999999988/175, creature-nest-2=164.39999999999992/175, creature-nest-3=164.64/193

```json
{
  "actions": [
    {
      "id": "action-32-roamer-creature-1-547",
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
      "createdAt": "2026-09-02T15:47:52.003Z"
    },
    {
      "id": "action-32-roamer-creature-2-548",
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
      "createdAt": "2026-09-02T15:47:52.003Z"
    },
    {
      "id": "action-32-roamer-creature-3-549",
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
      "createdAt": "2026-09-02T15:47:52.003Z"
    },
    {
      "id": "action-32-roamer-creature-4-550",
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
      "createdAt": "2026-09-02T15:47:52.003Z"
    },
    {
      "id": "action-32-roamer-creature-7-551",
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
      "createdAt": "2026-09-02T15:47:52.003Z"
    },
    {
      "id": "action-32-roamer-creature-8-552",
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
      "createdAt": "2026-09-02T15:47:52.003Z"
    },
    {
      "id": "action-32-nest-creature-3-553",
      "round": 32,
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
          "column": 7
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:52.003Z"
    },
    {
      "id": "action-32-nest-creature-4-554",
      "round": 32,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-4",
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
      "createdAt": "2026-09-02T15:47:52.004Z"
    },
    {
      "id": "action-32-nest-creature-7-555",
      "round": 32,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-7",
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
      "createdAt": "2026-09-02T15:47:52.004Z"
    },
    {
      "id": "action-32-nest-creature-8-556",
      "round": 32,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T15:47:52.004Z"
    },
    {
      "id": "action-32-nest-creature-9-557",
      "round": 32,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-9",
          "kind": "creature"
        },
        "destination": {
          "row": 4,
          "column": 10
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-02T15:47:52.004Z"
    },
    {
      "id": "action-32-nest-creature-1-558",
      "round": 32,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
      "createdAt": "2026-09-02T15:47:52.004Z"
    },
    {
      "id": "action-33-player-2-559",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T15:47:52.004Z"
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
      "id": "nest-creature-2",
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
      "spawnedRound": 33,
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

### Turn 138 (round 33)
- Player: 胡斐 (player-2), level 4, experience 179, at (12, 9), health 39, stamina 6
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=155.72999999999988/175, creature-nest-2=164.39999999999992/175, creature-nest-3=164.64/193

```json
{
  "actions": [
    {
      "id": "action-33-player-2-560",
      "round": 33,
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
          "id": "ruin-6",
          "kind": "ruin",
          "position": {
            "row": 12,
            "column": 10
          }
        },
        "reason": "清障：清除廢墟 白鷺村"
      },
      "result": "succeeded",
      "reason": "清障：清除廢墟 白鷺村",
      "createdAt": "2026-09-02T15:47:52.012Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 139 (round 33)
- Player: 胡斐 (player-2), level 4, experience 179, at (12, 8), health 39, stamina 4
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=155.72999999999988/175, creature-nest-2=164.39999999999992/175, creature-nest-3=164.64/193

```json
{
  "actions": [
    {
      "id": "action-33-player-2-561",
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
          "row": 12,
          "column": 8
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:52.019Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 140 (round 33)
- Player: 胡斐 (player-2), level 4, experience 179, at (12, 7), health 39, stamina 2
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=155.72999999999988/175, creature-nest-2=164.39999999999992/175, creature-nest-3=164.64/193

```json
{
  "actions": [
    {
      "id": "action-33-player-2-562",
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
          "row": 12,
          "column": 7
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:52.029Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 141 (round 33)
- Player: 胡斐 (player-2), level 4, experience 179, at (12, 6), health 39, stamina 0
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=155.72999999999988/175, creature-nest-2=164.39999999999992/175, creature-nest-3=164.64/193

```json
{
  "actions": [
    {
      "id": "action-33-player-2-563",
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
          "row": 12,
          "column": 6
        },
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.2（hitsSurvivable=4.333333333333333）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.2（hitsSurvivable=4.333333333333333）",
      "createdAt": "2026-09-02T15:47:52.033Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 142 (round 34)
- Player: 胡斐 (player-2), level 4, experience 179, at (12, 6), health 39, stamina 11
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=157.47999999999988/175, creature-nest-2=166.14999999999992/175, creature-nest-3=166.57/193

```json
{
  "actions": [
    {
      "id": "action-33-roamer-creature-1-564",
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
      "createdAt": "2026-09-02T15:47:52.033Z"
    },
    {
      "id": "action-33-roamer-creature-2-565",
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
      "createdAt": "2026-09-02T15:47:52.033Z"
    },
    {
      "id": "action-33-roamer-creature-3-566",
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
      "createdAt": "2026-09-02T15:47:52.033Z"
    },
    {
      "id": "action-33-roamer-creature-4-567",
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
      "createdAt": "2026-09-02T15:47:52.033Z"
    },
    {
      "id": "action-33-roamer-creature-7-568",
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
      "createdAt": "2026-09-02T15:47:52.033Z"
    },
    {
      "id": "action-33-roamer-creature-8-569",
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
      "createdAt": "2026-09-02T15:47:52.033Z"
    },
    {
      "id": "action-33-nest-creature-3-570",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T15:47:52.034Z"
    },
    {
      "id": "action-33-nest-creature-4-571",
      "round": 33,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-4",
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
      "createdAt": "2026-09-02T15:47:52.034Z"
    },
    {
      "id": "action-33-nest-creature-7-572",
      "round": 33,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-7",
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
      "createdAt": "2026-09-02T15:47:52.034Z"
    },
    {
      "id": "action-33-nest-creature-8-573",
      "round": 33,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-8",
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
      "createdAt": "2026-09-02T15:47:52.034Z"
    },
    {
      "id": "action-33-nest-creature-9-574",
      "round": 33,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
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
        "reason": "移動接近 襄陽。"
      },
      "result": "succeeded",
      "reason": "移動接近 襄陽。",
      "createdAt": "2026-09-02T15:47:52.034Z"
    },
    {
      "id": "action-33-nest-creature-1-575",
      "round": 33,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 12,
          "column": 2
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:52.034Z"
    },
    {
      "id": "action-33-nest-creature-2-576",
      "round": 33,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.5"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 11,
          "column": 7
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:52.034Z"
    },
    {
      "id": "action-34-player-2-577",
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
      "createdAt": "2026-09-02T15:47:52.035Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 143 (round 34)
- Player: 胡斐 (player-2), level 4, experience 199, at (12, 6), health 39, stamina 6
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=157.47999999999988/175, creature-nest-2=166.14999999999992/175, creature-nest-3=166.57/193

```json
{
  "actions": [
    {
      "id": "action-34-player-2-578",
      "round": 34,
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
      "createdAt": "2026-09-02T15:47:52.042Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 144 (round 34)
- Player: 胡斐 (player-2), level 4, experience 199, at (11, 6), health 39, stamina 4
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=157.47999999999988/175, creature-nest-2=166.14999999999992/175, creature-nest-3=166.57/193

```json
{
  "actions": [
    {
      "id": "action-34-player-2-579",
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
          "row": 11,
          "column": 6
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:52.052Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 145 (round 34)
- Player: 胡斐 (player-2), level 4, experience 199, at (10, 6), health 39, stamina 2
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=157.47999999999988/175, creature-nest-2=166.14999999999992/175, creature-nest-3=166.57/193

```json
{
  "actions": [
    {
      "id": "action-34-player-2-580",
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
          "row": 10,
          "column": 6
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:52.061Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 146 (round 34)
- Player: 胡斐 (player-2), level 4, experience 199, at (10, 7), health 39, stamina 0
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=157.47999999999988/175, creature-nest-2=166.14999999999992/175, creature-nest-3=166.57/193

```json
{
  "actions": [
    {
      "id": "action-34-player-2-581",
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
          "row": 10,
          "column": 7
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:52.067Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 147 (round 35)
- Player: 胡斐 (player-2), level 4, experience 199, at (10, 7), health 29.95, stamina 11
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=159.22999999999988/175, creature-nest-2=167.89999999999992/175, creature-nest-3=168.5/193

```json
{
  "actions": [
    {
      "id": "action-34-roamer-creature-1-582",
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
      "createdAt": "2026-09-02T15:47:52.067Z"
    },
    {
      "id": "action-34-roamer-creature-2-583",
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
      "createdAt": "2026-09-02T15:47:52.067Z"
    },
    {
      "id": "action-34-roamer-creature-3-584",
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
      "createdAt": "2026-09-02T15:47:52.067Z"
    },
    {
      "id": "action-34-roamer-creature-4-585",
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
      "createdAt": "2026-09-02T15:47:52.067Z"
    },
    {
      "id": "action-34-roamer-creature-7-586",
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
      "createdAt": "2026-09-02T15:47:52.067Z"
    },
    {
      "id": "action-34-roamer-creature-8-587",
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
      "createdAt": "2026-09-02T15:47:52.067Z"
    },
    {
      "id": "action-34-nest-creature-3-588",
      "round": 34,
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
          "column": 7
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:52.067Z"
    },
    {
      "id": "action-34-nest-creature-4-589",
      "round": 34,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-4",
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
      "createdAt": "2026-09-02T15:47:52.068Z"
    },
    {
      "id": "action-34-nest-creature-7-590",
      "round": 34,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-7",
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
      "createdAt": "2026-09-02T15:47:52.068Z"
    },
    {
      "id": "action-34-nest-creature-8-591",
      "round": 34,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-8",
          "kind": "creature"
        },
        "target": {
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 10,
            "column": 7
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T15:47:52.068Z"
    },
    {
      "id": "action-34-nest-creature-9-592",
      "round": 34,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
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
        "reason": "移動接近 襄陽。"
      },
      "result": "succeeded",
      "reason": "移動接近 襄陽。",
      "createdAt": "2026-09-02T15:47:52.068Z"
    },
    {
      "id": "action-34-nest-creature-1-593",
      "round": 34,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 10,
          "column": 2
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:52.068Z"
    },
    {
      "id": "action-34-nest-creature-2-594",
      "round": 34,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.5"
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
            "row": 10,
            "column": 7
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T15:47:52.068Z"
    },
    {
      "id": "action-35-player-2-595",
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
      "createdAt": "2026-09-02T15:47:52.069Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-8",
      "creatureName": "生物巢穴 1的怪物 Lv.3",
      "message": "生物巢穴 1的怪物 Lv.3 攻擊 胡斐，造成 5 點傷害（根骨減傷，暴擊）。"
    },
    {
      "creatureId": "nest-creature-2",
      "creatureName": "生物巢穴 3的怪物 Lv.5",
      "message": "生物巢穴 3的怪物 Lv.5 攻擊 胡斐，造成 6 點傷害（根骨減傷，暴擊）。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 148 (round 35)
- Player: 胡斐 (player-2), level 5, experience 2, at (10, 7), health 29.95, stamina 6
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: -197 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=159.22999999999988/175, creature-nest-2=167.89999999999992/175, creature-nest-3=168.5/193

```json
{
  "actions": [
    {
      "id": "action-35-player-2-596",
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
            "row": 11,
            "column": 7
          }
        },
        "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.5"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.5",
      "createdAt": "2026-09-02T15:47:52.080Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 149 (round 35)
- Player: 胡斐 (player-2), level 5, experience 102, at (10, 7), health 29.95, stamina 1
- Attributes: armStrength=13, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +100
- Spawned creatures: 0
- Defeated creatures: nest-creature-2
- Nests: creature-nest-1=159.22999999999988/175, creature-nest-2=167.89999999999992/175, creature-nest-3=168.5/193

```json
{
  "actions": [
    {
      "id": "action-35-player-2-597",
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
            "row": 11,
            "column": 7
          }
        },
        "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.5"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.5",
      "createdAt": "2026-09-02T15:47:52.092Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 150 (round 35)
- Player: 胡斐 (player-2), level 5, experience 102, at (10, 7), health 29.95, stamina 1
- Attributes: armStrength=14, constitution=13, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=159.22999999999988/175, creature-nest-2=167.89999999999992/175, creature-nest-3=168.5/193

```json
{
  "actions": [
    {
      "id": "action-35-player-2-598",
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
      "createdAt": "2026-09-02T15:47:52.096Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 151 (round 35)
- Player: 胡斐 (player-2), level 5, experience 102, at (10, 7), health 29.95, stamina 1
- Attributes: armStrength=14, constitution=14, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=159.22999999999988/175, creature-nest-2=167.89999999999992/175, creature-nest-3=168.5/193

```json
{
  "actions": [
    {
      "id": "action-35-player-2-599",
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
      "createdAt": "2026-09-02T15:47:52.100Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 152 (round 36)
- Player: 胡斐 (player-2), level 5, experience 104, at (10, 7), health 25.05, stamina 11.5
- Attributes: armStrength=14, constitution=14, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=160.97999999999988/175, creature-nest-2=169.64999999999992/175, creature-nest-3=170.43/193

```json
{
  "actions": [
    {
      "id": "action-35-roamer-creature-1-600",
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
      "createdAt": "2026-09-02T15:47:52.104Z"
    },
    {
      "id": "action-35-roamer-creature-2-601",
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
      "createdAt": "2026-09-02T15:47:52.104Z"
    },
    {
      "id": "action-35-roamer-creature-3-602",
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
      "createdAt": "2026-09-02T15:47:52.104Z"
    },
    {
      "id": "action-35-roamer-creature-4-603",
      "round": 35,
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
      "createdAt": "2026-09-02T15:47:52.104Z"
    },
    {
      "id": "action-35-roamer-creature-7-604",
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
      "createdAt": "2026-09-02T15:47:52.104Z"
    },
    {
      "id": "action-35-roamer-creature-8-605",
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
      "createdAt": "2026-09-02T15:47:52.104Z"
    },
    {
      "id": "action-35-nest-creature-3-606",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T15:47:52.104Z"
    },
    {
      "id": "action-35-nest-creature-4-607",
      "round": 35,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-4",
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
      "createdAt": "2026-09-02T15:47:52.104Z"
    },
    {
      "id": "action-35-nest-creature-7-608",
      "round": 35,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-7",
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
      "createdAt": "2026-09-02T15:47:52.104Z"
    },
    {
      "id": "action-35-nest-creature-8-609",
      "round": 35,
      "actor": {
        "id": "nest-creature-8",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-8",
          "kind": "creature"
        },
        "target": {
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 10,
            "column": 7
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T15:47:52.104Z"
    },
    {
      "id": "action-35-nest-creature-9-610",
      "round": 35,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
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
        "reason": "移動接近 襄陽。"
      },
      "result": "succeeded",
      "reason": "移動接近 襄陽。",
      "createdAt": "2026-09-02T15:47:52.104Z"
    },
    {
      "id": "action-35-nest-creature-1-611",
      "round": 35,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 10,
          "column": 4
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:52.104Z"
    },
    {
      "id": "action-36-player-2-612",
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
      "createdAt": "2026-09-02T15:47:52.105Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 153 (round 36)
- Player: 胡斐 (player-2), level 5, experience 144, at (10, 7), health 25.05, stamina 6.5
- Attributes: armStrength=14, constitution=14, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +40
- Spawned creatures: 0
- Defeated creatures: nest-creature-3
- Nests: creature-nest-1=160.97999999999988/175, creature-nest-2=169.64999999999992/175, creature-nest-3=170.43/193

```json
{
  "actions": [
    {
      "id": "action-36-player-2-613",
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
          "id": "nest-creature-3",
          "kind": "creature",
          "position": {
            "row": 11,
            "column": 7
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.2"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.2",
      "createdAt": "2026-09-02T15:47:52.116Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 154 (round 36)
- Player: 胡斐 (player-2), level 5, experience 204, at (10, 7), health 25.05, stamina 1.5
- Attributes: armStrength=14, constitution=14, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +60
- Spawned creatures: 0
- Defeated creatures: nest-creature-8
- Nests: creature-nest-1=160.97999999999988/175, creature-nest-2=169.64999999999992/175, creature-nest-3=170.43/193

```json
{
  "actions": [
    {
      "id": "action-36-player-2-614",
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
          "id": "nest-creature-8",
          "kind": "creature",
          "position": {
            "row": 10,
            "column": 6
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.3"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.3",
      "createdAt": "2026-09-02T15:47:52.127Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 155 (round 36)
- Player: 胡斐 (player-2), level 5, experience 204, at (10, 7), health 25.05, stamina 1.5
- Attributes: armStrength=14, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=160.97999999999988/175, creature-nest-2=169.64999999999992/175, creature-nest-3=170.43/193

```json
{
  "actions": [
    {
      "id": "action-36-player-2-615",
      "round": 36,
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
        "itemId": "extend-life-pill",
        "reason": "使用道具：續命丹"
      },
      "result": "succeeded",
      "reason": "使用道具：續命丹",
      "createdAt": "2026-09-02T15:47:52.131Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 156 (round 37)
- Player: 胡斐 (player-2), level 5, experience 207, at (10, 7), health 27.3, stamina 11.5
- Attributes: armStrength=14, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +3
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=162.72999999999988/193, creature-nest-2=171.39999999999992/175, creature-nest-3=172.36/193

```json
{
  "actions": [
    {
      "id": "action-36-roamer-creature-1-616",
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
      "createdAt": "2026-09-02T15:47:52.135Z"
    },
    {
      "id": "action-36-roamer-creature-2-617",
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
      "createdAt": "2026-09-02T15:47:52.135Z"
    },
    {
      "id": "action-36-roamer-creature-3-618",
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
      "createdAt": "2026-09-02T15:47:52.135Z"
    },
    {
      "id": "action-36-roamer-creature-4-619",
      "round": 36,
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
      "createdAt": "2026-09-02T15:47:52.135Z"
    },
    {
      "id": "action-36-roamer-creature-7-620",
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
      "createdAt": "2026-09-02T15:47:52.135Z"
    },
    {
      "id": "action-36-roamer-creature-8-621",
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
      "createdAt": "2026-09-02T15:47:52.135Z"
    },
    {
      "id": "action-36-nest-creature-4-622",
      "round": 36,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-4",
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
      "createdAt": "2026-09-02T15:47:52.135Z"
    },
    {
      "id": "action-36-nest-creature-7-623",
      "round": 36,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-7",
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
      "createdAt": "2026-09-02T15:47:52.135Z"
    },
    {
      "id": "action-36-nest-creature-9-624",
      "round": 36,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
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
        "reason": "移動接近 襄陽。"
      },
      "result": "succeeded",
      "reason": "移動接近 襄陽。",
      "createdAt": "2026-09-02T15:47:52.135Z"
    },
    {
      "id": "action-36-nest-creature-1-625",
      "round": 36,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
      "createdAt": "2026-09-02T15:47:52.135Z"
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T15:47:52.136Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": [
    {
      "id": "nest-creature-2",
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
      "spawnedRound": 37,
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

### Turn 157 (round 37)
- Player: 胡斐 (player-2), level 5, experience 210, at (10, 7), health 27.3, stamina 6.5
- Attributes: armStrength=14, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=162.72999999999988/193, creature-nest-2=171.39999999999992/175, creature-nest-3=172.36/193

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
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "nest-creature-1",
          "kind": "creature",
          "position": {
            "row": 10,
            "column": 6
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.4"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.4",
      "createdAt": "2026-09-02T15:47:52.146Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 158 (round 37)
- Player: 胡斐 (player-2), level 6, experience 40, at (10, 7), health 27.3, stamina 1.5
- Attributes: armStrength=14, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: -170 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: nest-creature-1
- Nests: creature-nest-1=162.72999999999988/193, creature-nest-2=171.39999999999992/175, creature-nest-3=172.36/193

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
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "nest-creature-1",
          "kind": "creature",
          "position": {
            "row": 10,
            "column": 6
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.4"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.4",
      "createdAt": "2026-09-02T15:47:52.157Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 159 (round 37)
- Player: 胡斐 (player-2), level 6, experience 40, at (10, 7), health 27.3, stamina 1.5
- Attributes: armStrength=15, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=162.72999999999988/193, creature-nest-2=171.39999999999992/175, creature-nest-3=172.36/193

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
      "createdAt": "2026-09-02T15:47:52.161Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 160 (round 37)
- Player: 胡斐 (player-2), level 6, experience 40, at (10, 7), health 27.3, stamina 1.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=162.72999999999988/193, creature-nest-2=171.39999999999992/175, creature-nest-3=172.36/193

```json
{
  "actions": [
    {
      "id": "action-37-player-2-630",
      "round": 37,
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
      "createdAt": "2026-09-02T15:47:52.165Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 161 (round 38)
- Player: 胡斐 (player-2), level 6, experience 43, at (10, 7), health 29.55, stamina 12.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=164.65999999999988/193, creature-nest-2=173.14999999999992/175, creature-nest-3=174.29000000000002/193

```json
{
  "actions": [
    {
      "id": "action-37-roamer-creature-1-631",
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
      "createdAt": "2026-09-02T15:47:52.168Z"
    },
    {
      "id": "action-37-roamer-creature-2-632",
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
      "createdAt": "2026-09-02T15:47:52.168Z"
    },
    {
      "id": "action-37-roamer-creature-3-633",
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
      "createdAt": "2026-09-02T15:47:52.168Z"
    },
    {
      "id": "action-37-roamer-creature-4-634",
      "round": 37,
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
      "createdAt": "2026-09-02T15:47:52.168Z"
    },
    {
      "id": "action-37-roamer-creature-7-635",
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
      "createdAt": "2026-09-02T15:47:52.168Z"
    },
    {
      "id": "action-37-roamer-creature-8-636",
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
      "createdAt": "2026-09-02T15:47:52.168Z"
    },
    {
      "id": "action-37-nest-creature-4-637",
      "round": 37,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-4",
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
      "createdAt": "2026-09-02T15:47:52.168Z"
    },
    {
      "id": "action-37-nest-creature-7-638",
      "round": 37,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-7",
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
      "createdAt": "2026-09-02T15:47:52.169Z"
    },
    {
      "id": "action-37-nest-creature-9-639",
      "round": 37,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
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
        "reason": "移動接近 襄陽。"
      },
      "result": "succeeded",
      "reason": "移動接近 襄陽。",
      "createdAt": "2026-09-02T15:47:52.169Z"
    },
    {
      "id": "action-37-nest-creature-2-640",
      "round": 37,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.5"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 10,
          "column": 3
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-02T15:47:52.169Z"
    },
    {
      "id": "action-38-player-2-641",
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
      "createdAt": "2026-09-02T15:47:52.169Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 162 (round 38)
- Player: 胡斐 (player-2), level 6, experience 43, at (11, 7), health 29.55, stamina 10.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=164.65999999999988/193, creature-nest-2=173.14999999999992/175, creature-nest-3=174.29000000000002/193

```json
{
  "actions": [
    {
      "id": "action-38-player-2-642",
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
          "row": 11,
          "column": 7
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:52.180Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 163 (round 38)
- Player: 胡斐 (player-2), level 6, experience 43, at (11, 6), health 29.55, stamina 8.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=164.65999999999988/193, creature-nest-2=173.14999999999992/175, creature-nest-3=174.29000000000002/193

```json
{
  "actions": [
    {
      "id": "action-38-player-2-643",
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
          "row": 11,
          "column": 6
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:52.188Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 164 (round 38)
- Player: 胡斐 (player-2), level 6, experience 43, at (11, 5), health 29.55, stamina 3.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=164.65999999999988/193, creature-nest-2=173.14999999999992/175, creature-nest-3=174.29000000000002/193

```json
{
  "actions": [
    {
      "id": "action-38-player-2-644",
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
          "row": 11,
          "column": 5
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:52.196Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 165 (round 38)
- Player: 胡斐 (player-2), level 6, experience 43, at (11, 6), health 29.55, stamina 1.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=164.65999999999988/193, creature-nest-2=173.14999999999992/175, creature-nest-3=174.29000000000002/193

```json
{
  "actions": [
    {
      "id": "action-38-player-2-645",
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
          "row": 11,
          "column": 6
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:52.204Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 166 (round 39)
- Player: 胡斐 (player-2), level 6, experience 46, at (11, 6), health 31.8, stamina 12.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=166.5899999999999/193, creature-nest-2=174.89999999999992/175, creature-nest-3=176.22000000000003/193

```json
{
  "actions": [
    {
      "id": "action-38-roamer-creature-1-646",
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
      "createdAt": "2026-09-02T15:47:52.206Z"
    },
    {
      "id": "action-38-roamer-creature-2-647",
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
      "createdAt": "2026-09-02T15:47:52.206Z"
    },
    {
      "id": "action-38-roamer-creature-3-648",
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
      "createdAt": "2026-09-02T15:47:52.206Z"
    },
    {
      "id": "action-38-roamer-creature-4-649",
      "round": 38,
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
      "createdAt": "2026-09-02T15:47:52.206Z"
    },
    {
      "id": "action-38-roamer-creature-7-650",
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
      "createdAt": "2026-09-02T15:47:52.206Z"
    },
    {
      "id": "action-38-roamer-creature-8-651",
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
      "createdAt": "2026-09-02T15:47:52.206Z"
    },
    {
      "id": "action-38-nest-creature-4-652",
      "round": 38,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-4",
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
      "createdAt": "2026-09-02T15:47:52.206Z"
    },
    {
      "id": "action-38-nest-creature-7-653",
      "round": 38,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-7",
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
      "createdAt": "2026-09-02T15:47:52.206Z"
    },
    {
      "id": "action-38-nest-creature-9-654",
      "round": 38,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
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
        "reason": "移動接近 襄陽。"
      },
      "result": "succeeded",
      "reason": "移動接近 襄陽。",
      "createdAt": "2026-09-02T15:47:52.206Z"
    },
    {
      "id": "action-38-nest-creature-2-655",
      "round": 38,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.5"
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
      "createdAt": "2026-09-02T15:47:52.206Z"
    },
    {
      "id": "action-39-player-2-656",
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
      "createdAt": "2026-09-02T15:47:52.207Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 167 (round 39)
- Player: 胡斐 (player-2), level 6, experience 46, at (12, 6), health 31.8, stamina 10.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=166.5899999999999/193, creature-nest-2=174.89999999999992/175, creature-nest-3=176.22000000000003/193

```json
{
  "actions": [
    {
      "id": "action-39-player-2-657",
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
          "row": 12,
          "column": 6
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:52.214Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 168 (round 39)
- Player: 胡斐 (player-2), level 6, experience 46, at (12, 5), health 31.8, stamina 5.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=166.5899999999999/193, creature-nest-2=174.89999999999992/175, creature-nest-3=176.22000000000003/193

```json
{
  "actions": [
    {
      "id": "action-39-player-2-658",
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
          "row": 12,
          "column": 5
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:52.220Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 169 (round 39)
- Player: 胡斐 (player-2), level 6, experience 46, at (12, 5), health 31.8, stamina 2.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=166.5899999999999/193, creature-nest-2=174.89999999999992/175, creature-nest-3=176.22000000000003/193

```json
{
  "actions": [
    {
      "id": "action-39-player-2-659",
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
        "gateId": "sect-gate-4",
        "skillType": "external",
        "skillId": "blazing-sun-external-damage",
        "reason": "學招：學習門派功法 烈陽轟"
      },
      "result": "succeeded",
      "reason": "學招：學習門派功法 烈陽轟",
      "createdAt": "2026-09-02T15:47:52.227Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 170 (round 39)
- Player: 胡斐 (player-2), level 6, experience 46, at (12, 5), health 31.8, stamina 2.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=166.5899999999999/193, creature-nest-2=174.89999999999992/175, creature-nest-3=176.22000000000003/193

```json
{
  "actions": [
    {
      "id": "action-39-player-2-660",
      "round": 39,
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
        "skillId": "blazing-sun-external-damage",
        "reason": "啟用外功：烈陽轟"
      },
      "result": "succeeded",
      "reason": "啟用外功：烈陽轟",
      "createdAt": "2026-09-02T15:47:52.234Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 171 (round 39)
- Player: 胡斐 (player-2), level 6, experience 46, at (13, 5), health 31.8, stamina 0.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=166.5899999999999/193, creature-nest-2=174.89999999999992/175, creature-nest-3=176.22000000000003/193

```json
{
  "actions": [
    {
      "id": "action-39-player-2-661",
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
          "row": 13,
          "column": 5
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-02T15:47:52.242Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 172 (round 40)
- Player: 胡斐 (player-2), level 6, experience 47, at (13, 5), health 34.05, stamina 12.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +1
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=168.5199999999999/193, creature-nest-2=175/175, creature-nest-3=178.15000000000003/212

```json
{
  "actions": [
    {
      "id": "action-39-roamer-creature-1-662",
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
      "createdAt": "2026-09-02T15:47:52.246Z"
    },
    {
      "id": "action-39-roamer-creature-2-663",
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
      "createdAt": "2026-09-02T15:47:52.246Z"
    },
    {
      "id": "action-39-roamer-creature-3-664",
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
      "createdAt": "2026-09-02T15:47:52.246Z"
    },
    {
      "id": "action-39-roamer-creature-4-665",
      "round": 39,
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
      "createdAt": "2026-09-02T15:47:52.246Z"
    },
    {
      "id": "action-39-roamer-creature-7-666",
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
      "createdAt": "2026-09-02T15:47:52.246Z"
    },
    {
      "id": "action-39-roamer-creature-8-667",
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
      "createdAt": "2026-09-02T15:47:52.246Z"
    },
    {
      "id": "action-39-nest-creature-4-668",
      "round": 39,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-4",
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
      "createdAt": "2026-09-02T15:47:52.246Z"
    },
    {
      "id": "action-39-nest-creature-7-669",
      "round": 39,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-7",
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
      "createdAt": "2026-09-02T15:47:52.247Z"
    },
    {
      "id": "action-39-nest-creature-9-670",
      "round": 39,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
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
        "reason": "移動接近 襄陽。"
      },
      "result": "succeeded",
      "reason": "移動接近 襄陽。",
      "createdAt": "2026-09-02T15:47:52.247Z"
    },
    {
      "id": "action-39-nest-creature-2-671",
      "round": 39,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.5"
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
      "createdAt": "2026-09-02T15:47:52.247Z"
    },
    {
      "id": "action-40-player-2-672",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T15:47:52.248Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "creature-nest-3",
      "creatureName": "生物巢穴 3",
      "message": "生物巢穴 3 生成了 Lv.6 怪物。"
    }
  ],
  "spawnedCreatures": [
    {
      "id": "nest-creature-1",
      "name": "生物巢穴 3的怪物 Lv.6",
      "innerSkillId": "void-spirit-inner",
      "externalSkillIds": [
        "void-spirit-external-functional",
        "void-spirit-external-functional-2"
      ],
      "equippedExternalSkillIds": [
        "void-spirit-external-functional",
        "void-spirit-external-functional-2"
      ],
      "position": {
        "row": 10,
        "column": 8
      },
      "attributes": {
        "armStrength": 12,
        "constitution": 12,
        "agility": 11,
        "innerEnergy": 11,
        "insight": 12
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 6,
      "behaviorType": "scavenger",
      "schoolId": "void-spirit",
      "homePosition": {
        "row": 11,
        "column": 8
      },
      "homeNestId": "creature-nest-3",
      "spawnedRound": 40,
      "baseAttributes": {
        "armStrength": 11.2,
        "constitution": 11.2,
        "agility": 11.2,
        "innerEnergy": 11.2,
        "insight": 11.2
      },
      "health": 36,
      "maxHealth": 36,
      "stamina": 11.5,
      "maxStamina": 11.5,
      "innerPower": 33,
      "maxInnerPower": 33,
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

### Turn 173 (round 40)
- Player: 胡斐 (player-2), level 6, experience 47, at (13, 6), health 34.05, stamina 7.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=168.5199999999999/193, creature-nest-2=175/175, creature-nest-3=178.15000000000003/212

```json
{
  "actions": [
    {
      "id": "action-40-player-2-673",
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
          "row": 13,
          "column": 6
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:52.261Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 174 (round 40)
- Player: 胡斐 (player-2), level 6, experience 47, at (13, 7), health 34.05, stamina 5.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=168.5199999999999/193, creature-nest-2=175/175, creature-nest-3=178.15000000000003/212

```json
{
  "actions": [
    {
      "id": "action-40-player-2-674",
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
          "row": 13,
          "column": 7
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:52.268Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 175 (round 40)
- Player: 胡斐 (player-2), level 6, experience 47, at (12, 7), health 34.05, stamina 3.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=168.5199999999999/193, creature-nest-2=175/175, creature-nest-3=178.15000000000003/212

```json
{
  "actions": [
    {
      "id": "action-40-player-2-675",
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
          "row": 12,
          "column": 7
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:52.279Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 176 (round 40)
- Player: 胡斐 (player-2), level 6, experience 47, at (11, 7), health 34.05, stamina 1.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=168.5199999999999/193, creature-nest-2=175/175, creature-nest-3=178.15000000000003/212

```json
{
  "actions": [
    {
      "id": "action-40-player-2-676",
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
          "row": 11,
          "column": 7
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:52.288Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 177 (round 41)
- Player: 胡斐 (player-2), level 6, experience 50, at (11, 7), health 9.299999999999997, stamina 12.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=170.4499999999999/193, creature-nest-2=175/175, creature-nest-3=180.27000000000004/212

```json
{
  "actions": [
    {
      "id": "action-40-roamer-creature-1-677",
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
      "createdAt": "2026-09-02T15:47:52.293Z"
    },
    {
      "id": "action-40-roamer-creature-2-678",
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
      "createdAt": "2026-09-02T15:47:52.293Z"
    },
    {
      "id": "action-40-roamer-creature-3-679",
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
      "createdAt": "2026-09-02T15:47:52.293Z"
    },
    {
      "id": "action-40-roamer-creature-4-680",
      "round": 40,
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
      "createdAt": "2026-09-02T15:47:52.293Z"
    },
    {
      "id": "action-40-roamer-creature-7-681",
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
      "createdAt": "2026-09-02T15:47:52.293Z"
    },
    {
      "id": "action-40-roamer-creature-8-682",
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
      "createdAt": "2026-09-02T15:47:52.293Z"
    },
    {
      "id": "action-40-nest-creature-4-683",
      "round": 40,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-4",
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
      "createdAt": "2026-09-02T15:47:52.293Z"
    },
    {
      "id": "action-40-nest-creature-7-684",
      "round": 40,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-7",
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
      "createdAt": "2026-09-02T15:47:52.293Z"
    },
    {
      "id": "action-40-nest-creature-9-685",
      "round": 40,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
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
        "reason": "移動接近 襄陽。"
      },
      "result": "succeeded",
      "reason": "移動接近 襄陽。",
      "createdAt": "2026-09-02T15:47:52.294Z"
    },
    {
      "id": "action-40-nest-creature-2-686",
      "round": 40,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.5"
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
      "createdAt": "2026-09-02T15:47:52.294Z"
    },
    {
      "id": "action-40-nest-creature-1-687",
      "round": 40,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.6"
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
            "row": 11,
            "column": 7
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T15:47:52.294Z"
    },
    {
      "id": "action-41-player-2-688",
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
      "createdAt": "2026-09-02T15:47:52.295Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-1",
      "creatureName": "生物巢穴 3的怪物 Lv.6",
      "message": "生物巢穴 3的怪物 Lv.6 攻擊 胡斐，造成 11 點傷害。"
    },
    {
      "creatureId": "nest-creature-1",
      "creatureName": "生物巢穴 3的怪物 Lv.6",
      "message": "生物巢穴 3的怪物 Lv.6 連續攻擊 胡斐 2 次。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 178 (round 41)
- Player: 胡斐 (player-2), level 6, experience 50, at (11, 6), health 9.299999999999997, stamina 10.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=170.4499999999999/193, creature-nest-2=175/175, creature-nest-3=180.27000000000004/212

```json
{
  "actions": [
    {
      "id": "action-41-player-2-689",
      "round": 41,
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
        "reason": "保命：逃離 生物巢穴 3的怪物 Lv.6（hitsSurvivable=0.9299999999999997）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 3的怪物 Lv.6（hitsSurvivable=0.9299999999999997）",
      "createdAt": "2026-09-02T15:47:52.302Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 179 (round 41)
- Player: 胡斐 (player-2), level 6, experience 50, at (11, 5), health 9.299999999999997, stamina 5.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=170.4499999999999/193, creature-nest-2=175/175, creature-nest-3=180.27000000000004/212

```json
{
  "actions": [
    {
      "id": "action-41-player-2-690",
      "round": 41,
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
        "reason": "保命：逃離 生物巢穴 3的怪物 Lv.6（hitsSurvivable=0.9299999999999997）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 3的怪物 Lv.6（hitsSurvivable=0.9299999999999997）",
      "createdAt": "2026-09-02T15:47:52.311Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 180 (round 41)
- Player: 胡斐 (player-2), level 6, experience 50, at (11, 4), health 9.299999999999997, stamina 0.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=170.4499999999999/193, creature-nest-2=175/175, creature-nest-3=180.27000000000004/212

```json
{
  "actions": [
    {
      "id": "action-41-player-2-691",
      "round": 41,
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
          "column": 4
        },
        "reason": "保命：逃離 生物巢穴 3的怪物 Lv.6（hitsSurvivable=0.9299999999999997）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 3的怪物 Lv.6（hitsSurvivable=0.9299999999999997）",
      "createdAt": "2026-09-02T15:47:52.320Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 181 (round 41)
- Player: 胡斐 (player-2), level 6, experience 50, at (11, 4), health 29.299999999999997, stamina 0.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=170.4499999999999/193, creature-nest-2=175/175, creature-nest-3=180.27000000000004/212

```json
{
  "actions": [
    {
      "id": "action-41-player-2-692",
      "round": 41,
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
      "createdAt": "2026-09-02T15:47:52.324Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 182 (round 42)
- Player: 胡斐 (player-2), level 6, experience 51, at (11, 4), health 31.549999999999997, stamina 12.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=172.3799999999999/193, creature-nest-2=175/175, creature-nest-3=182.39000000000004/212

```json
{
  "actions": [
    {
      "id": "action-41-roamer-creature-1-693",
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
      "createdAt": "2026-09-02T15:47:52.329Z"
    },
    {
      "id": "action-41-roamer-creature-2-694",
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
      "createdAt": "2026-09-02T15:47:52.329Z"
    },
    {
      "id": "action-41-roamer-creature-3-695",
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
      "createdAt": "2026-09-02T15:47:52.329Z"
    },
    {
      "id": "action-41-roamer-creature-4-696",
      "round": 41,
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
      "createdAt": "2026-09-02T15:47:52.329Z"
    },
    {
      "id": "action-41-roamer-creature-7-697",
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
      "createdAt": "2026-09-02T15:47:52.329Z"
    },
    {
      "id": "action-41-roamer-creature-8-698",
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
      "createdAt": "2026-09-02T15:47:52.329Z"
    },
    {
      "id": "action-41-nest-creature-4-699",
      "round": 41,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-4",
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
      "createdAt": "2026-09-02T15:47:52.329Z"
    },
    {
      "id": "action-41-nest-creature-7-700",
      "round": 41,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-7",
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
      "createdAt": "2026-09-02T15:47:52.329Z"
    },
    {
      "id": "action-41-nest-creature-9-701",
      "round": 41,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
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
        "reason": "移動接近 襄陽。"
      },
      "result": "succeeded",
      "reason": "移動接近 襄陽。",
      "createdAt": "2026-09-02T15:47:52.329Z"
    },
    {
      "id": "action-41-nest-creature-2-702",
      "round": 41,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.5"
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
      "createdAt": "2026-09-02T15:47:52.329Z"
    },
    {
      "id": "action-41-nest-creature-1-703",
      "round": 41,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.6"
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
      "createdAt": "2026-09-02T15:47:52.329Z"
    },
    {
      "id": "action-42-player-2-704",
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
      "createdAt": "2026-09-02T15:47:52.330Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 183 (round 42)
- Player: 胡斐 (player-2), level 6, experience 54, at (11, 4), health 31.549999999999997, stamina 7.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=172.3799999999999/193, creature-nest-2=175/175, creature-nest-3=182.39000000000004/212

```json
{
  "actions": [
    {
      "id": "action-42-player-2-705",
      "round": 42,
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
            "row": 11,
            "column": 5
          }
        },
        "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.6"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.6",
      "createdAt": "2026-09-02T15:47:52.337Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 184 (round 42)
- Player: 胡斐 (player-2), level 6, experience 174, at (11, 4), health 31.549999999999997, stamina 2.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +120
- Spawned creatures: 0
- Defeated creatures: nest-creature-1
- Nests: creature-nest-1=172.3799999999999/193, creature-nest-2=175/175, creature-nest-3=182.39000000000004/212

```json
{
  "actions": [
    {
      "id": "action-42-player-2-706",
      "round": 42,
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
            "row": 11,
            "column": 5
          }
        },
        "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.6"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 3的怪物 Lv.6",
      "createdAt": "2026-09-02T15:47:52.345Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 185 (round 43)
- Player: 胡斐 (player-2), level 6, experience 179, at (11, 4), health 24.799999999999997, stamina 12.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +5
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=174.30999999999992/212, creature-nest-2=175/175, creature-nest-3=184.51000000000005/212

```json
{
  "actions": [
    {
      "id": "action-42-roamer-creature-1-707",
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
      "createdAt": "2026-09-02T15:47:52.349Z"
    },
    {
      "id": "action-42-roamer-creature-2-708",
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
      "createdAt": "2026-09-02T15:47:52.349Z"
    },
    {
      "id": "action-42-roamer-creature-3-709",
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
      "createdAt": "2026-09-02T15:47:52.349Z"
    },
    {
      "id": "action-42-roamer-creature-4-710",
      "round": 42,
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
      "createdAt": "2026-09-02T15:47:52.349Z"
    },
    {
      "id": "action-42-roamer-creature-7-711",
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
      "createdAt": "2026-09-02T15:47:52.349Z"
    },
    {
      "id": "action-42-roamer-creature-8-712",
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
      "createdAt": "2026-09-02T15:47:52.349Z"
    },
    {
      "id": "action-42-nest-creature-4-713",
      "round": 42,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-4",
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
      "createdAt": "2026-09-02T15:47:52.349Z"
    },
    {
      "id": "action-42-nest-creature-7-714",
      "round": 42,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-7",
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
      "createdAt": "2026-09-02T15:47:52.349Z"
    },
    {
      "id": "action-42-nest-creature-9-715",
      "round": 42,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
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
        "reason": "移動接近 襄陽。"
      },
      "result": "succeeded",
      "reason": "移動接近 襄陽。",
      "createdAt": "2026-09-02T15:47:52.349Z"
    },
    {
      "id": "action-42-nest-creature-2-716",
      "round": 42,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.5"
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
            "row": 11,
            "column": 4
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-02T15:47:52.349Z"
    },
    {
      "id": "action-43-player-2-717",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T15:47:52.350Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-2",
      "creatureName": "生物巢穴 1的怪物 Lv.5",
      "message": "生物巢穴 1的怪物 Lv.5 攻擊 胡斐，造成 9 點傷害。"
    },
    {
      "creatureId": "creature-nest-1",
      "creatureName": "生物巢穴 1",
      "message": "生物巢穴 1 生成了 Lv.6 怪物。"
    }
  ],
  "spawnedCreatures": [
    {
      "id": "nest-creature-1",
      "name": "生物巢穴 1的怪物 Lv.6",
      "innerSkillId": "void-spirit-inner",
      "externalSkillIds": [
        "void-spirit-external-functional",
        "void-spirit-external-functional-2"
      ],
      "equippedExternalSkillIds": [
        "void-spirit-external-functional",
        "void-spirit-external-functional-2"
      ],
      "position": {
        "row": 12,
        "column": 2
      },
      "attributes": {
        "armStrength": 12,
        "constitution": 12,
        "agility": 11,
        "innerEnergy": 11,
        "insight": 12
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 6,
      "behaviorType": "sieger",
      "schoolId": "void-spirit",
      "homePosition": {
        "row": 13,
        "column": 2
      },
      "homeNestId": "creature-nest-1",
      "spawnedRound": 43,
      "baseAttributes": {
        "armStrength": 11.2,
        "constitution": 11.2,
        "agility": 11.2,
        "innerEnergy": 11.2,
        "insight": 11.2
      },
      "health": 36,
      "maxHealth": 36,
      "stamina": 11.5,
      "maxStamina": 11.5,
      "innerPower": 33,
      "maxInnerPower": 33,
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

### Turn 186 (round 43)
- Player: 胡斐 (player-2), level 6, experience 179, at (10, 4), health 24.799999999999997, stamina 7.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=174.30999999999992/212, creature-nest-2=175/175, creature-nest-3=184.51000000000005/212

```json
{
  "actions": [
    {
      "id": "action-43-player-2-718",
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
          "row": 10,
          "column": 4
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:52.360Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 187 (round 43)
- Player: 胡斐 (player-2), level 6, experience 179, at (9, 4), health 24.799999999999997, stamina 5.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=174.30999999999992/212, creature-nest-2=175/175, creature-nest-3=184.51000000000005/212

```json
{
  "actions": [
    {
      "id": "action-43-player-2-719",
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
          "row": 9,
          "column": 4
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:52.371Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 188 (round 43)
- Player: 胡斐 (player-2), level 6, experience 179, at (9, 5), health 24.799999999999997, stamina 3.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=174.30999999999992/212, creature-nest-2=175/175, creature-nest-3=184.51000000000005/212

```json
{
  "actions": [
    {
      "id": "action-43-player-2-720",
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
          "row": 9,
          "column": 5
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:52.384Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 189 (round 43)
- Player: 胡斐 (player-2), level 6, experience 179, at (9, 6), health 24.799999999999997, stamina 1.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=174.30999999999992/212, creature-nest-2=175/175, creature-nest-3=184.51000000000005/212

```json
{
  "actions": [
    {
      "id": "action-43-player-2-721",
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
          "row": 9,
          "column": 6
        },
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-02T15:47:52.390Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 190 (round 44)
- Player: 胡斐 (player-2), level 6, experience 182, at (9, 6), health 27.049999999999997, stamina 12.5
- Attributes: armStrength=16, constitution=15, agility=9, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 30
- Stored experience change: +3
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=176.42999999999992/212, creature-nest-2=175/175, creature-nest-3=186.63000000000005/233

```json
{
  "actions": [
    {
      "id": "action-43-roamer-creature-1-722",
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
      "createdAt": "2026-09-02T15:47:52.393Z"
    },
    {
      "id": "action-43-roamer-creature-2-723",
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
      "createdAt": "2026-09-02T15:47:52.394Z"
    },
    {
      "id": "action-43-roamer-creature-3-724",
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
      "createdAt": "2026-09-02T15:47:52.394Z"
    },
    {
      "id": "action-43-roamer-creature-4-725",
      "round": 43,
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
      "createdAt": "2026-09-02T15:47:52.394Z"
    },
    {
      "id": "action-43-roamer-creature-7-726",
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
      "createdAt": "2026-09-02T15:47:52.394Z"
    },
    {
      "id": "action-43-roamer-creature-8-727",
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
      "createdAt": "2026-09-02T15:47:52.394Z"
    },
    {
      "id": "action-43-nest-creature-4-728",
      "round": 43,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-4",
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
      "createdAt": "2026-09-02T15:47:52.394Z"
    },
    {
      "id": "action-43-nest-creature-7-729",
      "round": 43,
      "actor": {
        "id": "nest-creature-7",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.4"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-7",
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
      "createdAt": "2026-09-02T15:47:52.394Z"
    },
    {
      "id": "action-43-nest-creature-9-730",
      "round": 43,
      "actor": {
        "id": "nest-creature-9",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.4"
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
        "reason": "移動接近 襄陽。"
      },
      "result": "succeeded",
      "reason": "移動接近 襄陽。",
      "createdAt": "2026-09-02T15:47:52.394Z"
    },
    {
      "id": "action-43-nest-creature-2-731",
      "round": 43,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.5"
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
      "createdAt": "2026-09-02T15:47:52.394Z"
    },
    {
      "id": "action-43-nest-creature-1-732",
      "round": 43,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.6"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
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
      "createdAt": "2026-09-02T15:47:52.394Z"
    },
    {
      "id": "action-44-player-2-733",
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
      "createdAt": "2026-09-02T15:47:52.395Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": [
    {
      "id": "nest-creature-3",
      "name": "生物巢穴 3的怪物 Lv.7",
      "innerSkillId": "void-spirit-inner",
      "externalSkillIds": [
        "void-spirit-external-functional",
        "void-spirit-external-functional-2"
      ],
      "equippedExternalSkillIds": [
        "void-spirit-external-functional",
        "void-spirit-external-functional-2"
      ],
      "position": {
        "row": 10,
        "column": 8
      },
      "attributes": {
        "armStrength": 13,
        "constitution": 13,
        "agility": 12,
        "innerEnergy": 12,
        "insight": 13
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 7,
      "behaviorType": "scavenger",
      "schoolId": "void-spirit",
      "homePosition": {
        "row": 11,
        "column": 8
      },
      "homeNestId": "creature-nest-3",
      "spawnedRound": 44,
      "baseAttributes": {
        "armStrength": 12.6,
        "constitution": 12.6,
        "agility": 12.6,
        "innerEnergy": 12.6,
        "insight": 12.6
      },
      "health": 39,
      "maxHealth": 39,
      "stamina": 12.5,
      "maxStamina": 12.5,
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

