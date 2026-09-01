# AI Beginner Sandbox Level5 Trace

- AI turns: 200
- Final round: 47
- Game won: false
- Game over: false
- Remaining nests: 1

## Aggregate

- Action counts: move=122, hold=56, practice-skill=47, end-turn=46, attack=8, use-facility=5, collect=4, allocate-attribute=4, learn-skill=2, build=2, equip=2, equip-inner-skill=1
- Creatures spawned (total): 5
- Creatures defeated (total): 2
- Level-ups observed: 2
- Final player: level 3, experience 48, inner skill 百毒納氣 (hundred-poison-inner) lv.2 damage 18
- Final attributes: armStrength=15, constitution=11, agility=9, innerEnergy=8, insight=8

## Efficiency (KPI)

- 行動產出率 (productive): ███········· 23.1% (69/299)
- 擊殺效率 (kill/generate): █████······· 0.40 (2/5)
- 擊殺成本 (attack/kill): 4.00 (8 次攻擊 / 2 擊殺)
- 經驗效率 (XP/turn): 0.24 (48 XP / 200 turns)

- Nest health (start → end): creature-nest-1=120→120

## Turn Trace

### Turn 1 (round 1)
- Player: 陸小鳳 (player-2), level 1, experience 0, at (10, 1), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-1-player-2-1",
      "round": 1,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 10,
          "column": 1
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T18:53:25.809Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 2 (round 1)
- Player: 陸小鳳 (player-2), level 1, experience 0, at (9, 1), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-1-player-2-2",
      "round": 1,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 9,
          "column": 1
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T18:53:25.826Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 3 (round 1)
- Player: 陸小鳳 (player-2), level 1, experience 0, at (9, 1), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-1-player-2-3",
      "round": 1,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "collect",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "item-point-9",
          "kind": "item",
          "position": {
            "row": 9,
            "column": 1
          }
        },
        "reason": "收集道具：拾取"
      },
      "result": "succeeded",
      "reason": "收集道具：拾取",
      "createdAt": "2026-09-01T18:53:25.830Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 4 (round 2)
- Player: 陸小鳳 (player-2), level 1, experience 2, at (9, 1), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-2-player-2-4",
      "round": 2,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:25.838Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 5 (round 2)
- Player: 陸小鳳 (player-2), level 1, experience 2, at (8, 1), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-2-player-2-5",
      "round": 2,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 8,
          "column": 1
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T18:53:25.847Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 6 (round 2)
- Player: 陸小鳳 (player-2), level 1, experience 2, at (7, 1), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-2-player-2-6",
      "round": 2,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 7,
          "column": 1
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T18:53:25.855Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 7 (round 2)
- Player: 陸小鳳 (player-2), level 1, experience 2, at (6, 1), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-2-player-2-7",
      "round": 2,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 6,
          "column": 1
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T18:53:25.862Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 8 (round 2)
- Player: 陸小鳳 (player-2), level 1, experience 2, at (6, 1), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-2-player-2-8",
      "round": 2,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "collect",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "item-point-18",
          "kind": "item",
          "position": {
            "row": 6,
            "column": 1
          }
        },
        "reason": "收集道具：拾取"
      },
      "result": "succeeded",
      "reason": "收集道具：拾取",
      "createdAt": "2026-09-01T18:53:25.868Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 9 (round 2)
- Player: 陸小鳳 (player-2), level 1, experience 2, at (6, 2), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-2-player-2-9",
      "round": 2,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 6,
          "column": 2
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T18:53:25.874Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 10 (round 3)
- Player: 陸小鳳 (player-2), level 1, experience 2, at (6, 2), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-3-player-2-10",
      "round": 3,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:25.874Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 11 (round 3)
- Player: 陸小鳳 (player-2), level 1, experience 2, at (6, 3), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-3-player-2-11",
      "round": 3,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T18:53:25.882Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 12 (round 3)
- Player: 陸小鳳 (player-2), level 1, experience 2, at (6, 2), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-3-player-2-12",
      "round": 3,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 6,
          "column": 2
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T18:53:25.889Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 13 (round 4)
- Player: 陸小鳳 (player-2), level 1, experience 4, at (6, 2), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-4-player-2-13",
      "round": 4,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:25.891Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 14 (round 4)
- Player: 陸小鳳 (player-2), level 1, experience 4, at (7, 2), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-4-player-2-14",
      "round": 4,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 7,
          "column": 2
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T18:53:25.898Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 15 (round 4)
- Player: 陸小鳳 (player-2), level 1, experience 4, at (8, 2), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-4-player-2-15",
      "round": 4,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 8,
          "column": 2
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T18:53:25.906Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 16 (round 4)
- Player: 陸小鳳 (player-2), level 1, experience 4, at (8, 3), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-4-player-2-16",
      "round": 4,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T18:53:25.911Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 17 (round 4)
- Player: 陸小鳳 (player-2), level 1, experience 4, at (8, 4), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-4-player-2-17",
      "round": 4,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T18:53:25.916Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 18 (round 5)
- Player: 陸小鳳 (player-2), level 1, experience 4, at (8, 4), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-5-player-2-18",
      "round": 5,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:25.917Z"
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
      "id": "nest-creature-1",
      "name": "生物巢穴 1的怪物 Lv.1",
      "innerSkillId": "golden-body-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 1,
        "column": 12
      },
      "attributes": {
        "armStrength": 7,
        "constitution": 6,
        "agility": 5,
        "innerEnergy": 5,
        "insight": 5
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 1,
      "behaviorType": "wanderer",
      "schoolId": "golden-body",
      "homePosition": {
        "row": 2,
        "column": 13
      },
      "homeNestId": "creature-nest-1",
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
      "stamina": 6,
      "maxStamina": 6,
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

### Turn 19 (round 5)
- Player: 陸小鳳 (player-2), level 1, experience 4, at (7, 4), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-5-player-2-19",
      "round": 5,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 7,
          "column": 4
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T18:53:25.928Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 20 (round 5)
- Player: 陸小鳳 (player-2), level 1, experience 4, at (6, 4), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-5-player-2-20",
      "round": 5,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T18:53:25.935Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 21 (round 6)
- Player: 陸小鳳 (player-2), level 1, experience 6, at (6, 4), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-5-nest-creature-1-21",
      "round": 5,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 1,
          "column": 13
        },
        "reason": "移動接近 item-point-12。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-12。",
      "createdAt": "2026-09-01T18:53:25.949Z"
    },
    {
      "id": "action-6-player-2-22",
      "round": 6,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:25.950Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 22 (round 6)
- Player: 陸小鳳 (player-2), level 1, experience 6, at (6, 5), health 24, stamina 5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-6-player-2-23",
      "round": 6,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T18:53:25.957Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 23 (round 6)
- Player: 陸小鳳 (player-2), level 1, experience 6, at (5, 5), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-6-player-2-24",
      "round": 6,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 5
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T18:53:25.963Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 24 (round 7)
- Player: 陸小鳳 (player-2), level 1, experience 6, at (5, 5), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-6-nest-creature-1-25",
      "round": 6,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 1,
          "column": 13
        },
        "reason": "移動接近 item-point-11。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-11。",
      "createdAt": "2026-09-01T18:53:25.963Z"
    },
    {
      "id": "action-7-player-2-26",
      "round": 7,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:25.964Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 25 (round 7)
- Player: 陸小鳳 (player-2), level 1, experience 6, at (5, 5), health 24, stamina 5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-7-player-2-27",
      "round": 7,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "learn-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillType": "inner",
        "skillId": "hundred-poison-inner",
        "reason": "學招：學習門派功法 百毒納氣"
      },
      "result": "succeeded",
      "reason": "學招：學習門派功法 百毒納氣",
      "createdAt": "2026-09-01T18:53:25.970Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 26 (round 7)
- Player: 陸小鳳 (player-2), level 1, experience 6, at (5, 5), health 24, stamina 5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-7-player-2-28",
      "round": 7,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "equip-inner-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "skillId": "hundred-poison-inner",
        "reason": "裝備功法：百毒納氣"
      },
      "result": "succeeded",
      "reason": "裝備功法：百毒納氣",
      "createdAt": "2026-09-01T18:53:25.974Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 27 (round 7)
- Player: 陸小鳳 (player-2), level 1, experience 6, at (5, 4), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-7-player-2-29",
      "round": 7,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 4
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T18:53:25.978Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 28 (round 8)
- Player: 陸小鳳 (player-2), level 1, experience 6, at (5, 4), health 24, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-7-nest-creature-1-30",
      "round": 7,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 1,
          "column": 13
        },
        "reason": "移動接近 item-point-11。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-11。",
      "createdAt": "2026-09-01T18:53:25.978Z"
    },
    {
      "id": "action-8-player-2-31",
      "round": 8,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:25.978Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 29 (round 8)
- Player: 陸小鳳 (player-2), level 1, experience 6, at (5, 4), health 24, stamina 7.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-8-player-2-32",
      "round": 8,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:25.982Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 30 (round 8)
- Player: 陸小鳳 (player-2), level 1, experience 6, at (5, 4), health 24, stamina 4.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-8-player-2-33",
      "round": 8,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:25.986Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 31 (round 8)
- Player: 陸小鳳 (player-2), level 1, experience 6, at (5, 4), health 24, stamina 2.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-8-player-2-34",
      "round": 8,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:25.988Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 32 (round 8)
- Player: 陸小鳳 (player-2), level 1, experience 6, at (5, 4), health 24, stamina 0.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-8-player-2-35",
      "round": 8,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:25.990Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 33 (round 9)
- Player: 陸小鳳 (player-2), level 1, experience 7, at (5, 4), health 24, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-8-nest-creature-1-36",
      "round": 8,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 1,
          "column": 13
        },
        "reason": "移動接近 item-point-11。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-11。",
      "createdAt": "2026-09-01T18:53:25.992Z"
    },
    {
      "id": "action-9-player-2-37",
      "round": 9,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:25.993Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 34 (round 9)
- Player: 陸小鳳 (player-2), level 1, experience 7, at (4, 4), health 24, stamina 4.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-9-player-2-38",
      "round": 9,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 4,
          "column": 4
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T18:53:25.998Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 35 (round 9)
- Player: 陸小鳳 (player-2), level 1, experience 7, at (4, 3), health 24, stamina 2.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-9-player-2-39",
      "round": 9,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 4,
          "column": 3
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.004Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 36 (round 9)
- Player: 陸小鳳 (player-2), level 1, experience 7, at (4, 3), health 24, stamina 0.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-9-player-2-40",
      "round": 9,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.006Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 37 (round 10)
- Player: 陸小鳳 (player-2), level 1, experience 8, at (4, 3), health 24, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-9-nest-creature-1-41",
      "round": 9,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 1,
          "column": 13
        },
        "reason": "移動接近 item-point-11。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-11。",
      "createdAt": "2026-09-01T18:53:26.008Z"
    },
    {
      "id": "action-10-player-2-42",
      "round": 10,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.008Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 38 (round 10)
- Player: 陸小鳳 (player-2), level 1, experience 8, at (3, 3), health 24, stamina 7.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-10-player-2-43",
      "round": 10,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 3,
          "column": 3
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.013Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 39 (round 10)
- Player: 陸小鳳 (player-2), level 1, experience 8, at (2, 3), health 24, stamina 5.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-10-player-2-44",
      "round": 10,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 3
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.021Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 40 (round 10)
- Player: 陸小鳳 (player-2), level 1, experience 8, at (2, 2), health 24, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-10-player-2-45",
      "round": 10,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 2
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.028Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 41 (round 10)
- Player: 陸小鳳 (player-2), level 1, experience 8, at (2, 2), health 24, stamina 0.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-10-player-2-46",
      "round": 10,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "learn-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillType": "inner",
        "skillId": "blazing-sun-inner",
        "reason": "學招：學習門派功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "學招：學習門派功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.032Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 42 (round 11)
- Player: 陸小鳳 (player-2), level 1, experience 9, at (2, 2), health 24, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-10-nest-creature-1-47",
      "round": 10,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 1,
          "column": 13
        },
        "reason": "移動接近 item-point-11。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-11。",
      "createdAt": "2026-09-01T18:53:26.034Z"
    },
    {
      "id": "action-11-player-2-48",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.034Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 43 (round 11)
- Player: 陸小鳳 (player-2), level 1, experience 9, at (2, 2), health 24, stamina 6.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-11-player-2-49",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.040Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 44 (round 11)
- Player: 陸小鳳 (player-2), level 1, experience 9, at (2, 2), health 24, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-11-player-2-50",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.045Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 45 (round 11)
- Player: 陸小鳳 (player-2), level 1, experience 9, at (3, 2), health 24, stamina 1.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-11-player-2-51",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 3,
          "column": 2
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T18:53:26.049Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 46 (round 12)
- Player: 陸小鳳 (player-2), level 1, experience 12, at (3, 2), health 24, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-11-nest-creature-1-52",
      "round": 11,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 1,
          "column": 13
        },
        "reason": "移動接近 item-point-11。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-11。",
      "createdAt": "2026-09-01T18:53:26.051Z"
    },
    {
      "id": "action-12-player-2-53",
      "round": 12,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.052Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "creature-nest-1",
      "creatureName": "生物巢穴 1",
      "message": "生物巢穴 1 生成了 Lv.2 怪物。"
    }
  ],
  "spawnedCreatures": [
    {
      "id": "nest-creature-2",
      "name": "生物巢穴 1的怪物 Lv.2",
      "innerSkillId": "golden-body-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 1,
        "column": 12
      },
      "attributes": {
        "armStrength": 9,
        "constitution": 8,
        "agility": 5,
        "innerEnergy": 5,
        "insight": 5
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 2,
      "behaviorType": "wanderer",
      "schoolId": "golden-body",
      "homePosition": {
        "row": 2,
        "column": 13
      },
      "homeNestId": "creature-nest-1",
      "spawnedRound": 12,
      "baseAttributes": {
        "armStrength": 7,
        "constitution": 7,
        "agility": 5,
        "innerEnergy": 5.6,
        "insight": 5
      },
      "health": 24,
      "maxHealth": 24,
      "stamina": 7,
      "maxStamina": 7,
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

### Turn 47 (round 12)
- Player: 陸小鳳 (player-2), level 1, experience 12, at (3, 1), health 24, stamina 7.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-12-player-2-54",
      "round": 12,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 3,
          "column": 1
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.060Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 48 (round 12)
- Player: 陸小鳳 (player-2), level 1, experience 12, at (2, 1), health 24, stamina 5.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-12-player-2-55",
      "round": 12,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 1
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.064Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 49 (round 12)
- Player: 陸小鳳 (player-2), level 1, experience 12, at (1, 1), health 24, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-12-player-2-56",
      "round": 12,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 1,
          "column": 1
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.072Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 50 (round 12)
- Player: 陸小鳳 (player-2), level 1, experience 12, at (2, 1), health 24, stamina 1.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-12-player-2-57",
      "round": 12,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 1
        },
        "reason": "定位：前往出口 (2,1)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (2,1)",
      "createdAt": "2026-09-01T18:53:26.077Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 51 (round 13)
- Player: 陸小鳳 (player-2), level 1, experience 15, at (2, 1), health 24, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-12-nest-creature-1-58",
      "round": 12,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "reason": "體力不足，無法繼續移動。"
      },
      "result": "failed",
      "reason": "體力不足，無法繼續移動。",
      "createdAt": "2026-09-01T18:53:26.080Z"
    },
    {
      "id": "action-12-nest-creature-2-59",
      "round": 12,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 11
        },
        "reason": "移動接近 item-point-11。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-11。",
      "createdAt": "2026-09-01T18:53:26.080Z"
    },
    {
      "id": "action-13-player-2-60",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.080Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 52 (round 13)
- Player: 陸小鳳 (player-2), level 1, experience 15, at (1, 1), health 24, stamina 7.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-13-player-2-61",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 1,
          "column": 1
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.088Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 53 (round 13)
- Player: 陸小鳳 (player-2), level 1, experience 15, at (2, 1), health 24, stamina 5.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-13-player-2-62",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 1
        },
        "reason": "定位：前往出口 (2,1)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (2,1)",
      "createdAt": "2026-09-01T18:53:26.094Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 54 (round 13)
- Player: 陸小鳳 (player-2), level 1, experience 15, at (1, 1), health 24, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-13-player-2-63",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 1,
          "column": 1
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.100Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 55 (round 13)
- Player: 陸小鳳 (player-2), level 1, experience 15, at (2, 1), health 24, stamina 1.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-13-player-2-64",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 1
        },
        "reason": "定位：前往出口 (2,1)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (2,1)",
      "createdAt": "2026-09-01T18:53:26.107Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 56 (round 14)
- Player: 陸小鳳 (player-2), level 1, experience 18, at (2, 1), health 24, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-13-nest-creature-1-65",
      "round": 13,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 1,
          "column": 13
        },
        "reason": "移動接近 item-point-11。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-11。",
      "createdAt": "2026-09-01T18:53:26.110Z"
    },
    {
      "id": "action-13-nest-creature-2-66",
      "round": 13,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 4,
          "column": 11
        },
        "reason": "移動接近 item-point-8。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-8。",
      "createdAt": "2026-09-01T18:53:26.110Z"
    },
    {
      "id": "action-14-player-2-67",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.110Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-2",
      "creatureName": "生物巢穴 1的怪物 Lv.2",
      "message": "生物巢穴 1的怪物 Lv.2 吃掉了道具點。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 57 (round 14)
- Player: 陸小鳳 (player-2), level 1, experience 18, at (2, 2), health 24, stamina 7.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-14-player-2-68",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 2
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.118Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 58 (round 14)
- Player: 陸小鳳 (player-2), level 1, experience 18, at (2, 2), health 24, stamina 4.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-14-player-2-69",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.125Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 59 (round 14)
- Player: 陸小鳳 (player-2), level 1, experience 18, at (2, 2), health 24, stamina 1.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-14-player-2-70",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.130Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 60 (round 15)
- Player: 陸小鳳 (player-2), level 1, experience 21, at (2, 2), health 24, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-14-nest-creature-1-71",
      "round": 14,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 1,
          "column": 13
        },
        "reason": "移動接近 item-point-11。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-11。",
      "createdAt": "2026-09-01T18:53:26.133Z"
    },
    {
      "id": "action-14-nest-creature-2-72",
      "round": 14,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 4,
          "column": 10
        },
        "reason": "移動接近 item-point-10。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-10。",
      "createdAt": "2026-09-01T18:53:26.133Z"
    },
    {
      "id": "action-15-player-2-73",
      "round": 15,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.133Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 61 (round 15)
- Player: 陸小鳳 (player-2), level 1, experience 21, at (2, 2), health 24, stamina 6.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-15-player-2-74",
      "round": 15,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.139Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 62 (round 15)
- Player: 陸小鳳 (player-2), level 1, experience 21, at (2, 2), health 24, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-15-player-2-75",
      "round": 15,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.144Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 63 (round 15)
- Player: 陸小鳳 (player-2), level 1, experience 21, at (2, 3), health 24, stamina 1.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-15-player-2-76",
      "round": 15,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 3
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T18:53:26.149Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 64 (round 16)
- Player: 陸小鳳 (player-2), level 1, experience 24, at (2, 3), health 24, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-15-nest-creature-1-77",
      "round": 15,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 1,
          "column": 13
        },
        "reason": "移動接近 item-point-11。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-11。",
      "createdAt": "2026-09-01T18:53:26.151Z"
    },
    {
      "id": "action-15-nest-creature-2-78",
      "round": 15,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 4,
          "column": 13
        },
        "reason": "移動接近 item-point-4。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-4。",
      "createdAt": "2026-09-01T18:53:26.152Z"
    },
    {
      "id": "action-16-player-2-79",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.152Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 65 (round 16)
- Player: 陸小鳳 (player-2), level 1, experience 24, at (2, 4), health 24, stamina 7.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-80",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 4
        },
        "reason": "收集道具：移動到道具位置"
      },
      "result": "succeeded",
      "reason": "收集道具：移動到道具位置",
      "createdAt": "2026-09-01T18:53:26.162Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 66 (round 16)
- Player: 陸小鳳 (player-2), level 1, experience 24, at (2, 4), health 24, stamina 7.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-81",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "collect",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "item-point-16",
          "kind": "item",
          "position": {
            "row": 2,
            "column": 4
          }
        },
        "reason": "收集道具：拾取"
      },
      "result": "succeeded",
      "reason": "收集道具：拾取",
      "createdAt": "2026-09-01T18:53:26.170Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 67 (round 16)
- Player: 陸小鳳 (player-2), level 1, experience 24, at (2, 5), health 24, stamina 5.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-82",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 5
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.180Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 68 (round 16)
- Player: 陸小鳳 (player-2), level 1, experience 24, at (2, 6), health 24, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-83",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 6
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.188Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 69 (round 16)
- Player: 陸小鳳 (player-2), level 1, experience 24, at (2, 6), health 24, stamina 3.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-84",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "equip",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "instanceId": "equipment-player-2-fc24ef9e-347f-468c-861d-a4d1ef74fb23",
        "reason": "裝備：鐵指環（accessory）"
      },
      "result": "succeeded",
      "reason": "裝備：鐵指環（accessory）",
      "createdAt": "2026-09-01T18:53:26.196Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 70 (round 16)
- Player: 陸小鳳 (player-2), level 1, experience 24, at (1, 6), health 24, stamina 1.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-85",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 1,
          "column": 6
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T18:53:26.204Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 71 (round 17)
- Player: 陸小鳳 (player-2), level 1, experience 27, at (1, 6), health 24, stamina 10.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-16-nest-creature-1-86",
      "round": 16,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 1,
          "column": 13
        },
        "reason": "移動接近 item-point-11。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-11。",
      "createdAt": "2026-09-01T18:53:26.206Z"
    },
    {
      "id": "action-16-nest-creature-2-87",
      "round": 16,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 3,
          "column": 13
        },
        "reason": "移動接近 item-point-11。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-11。",
      "createdAt": "2026-09-01T18:53:26.206Z"
    },
    {
      "id": "action-17-player-2-88",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.206Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 72 (round 17)
- Player: 陸小鳳 (player-2), level 1, experience 27, at (1, 5), health 24, stamina 5.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-17-player-2-89",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 1,
          "column": 5
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.213Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 73 (round 17)
- Player: 陸小鳳 (player-2), level 1, experience 27, at (2, 5), health 24, stamina 3.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-17-player-2-90",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 5
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.224Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 74 (round 17)
- Player: 陸小鳳 (player-2), level 1, experience 27, at (3, 5), health 24, stamina 1.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-17-player-2-91",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T18:53:26.231Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 75 (round 18)
- Player: 陸小鳳 (player-2), level 1, experience 30, at (3, 5), health 24, stamina 10.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-17-nest-creature-1-92",
      "round": 17,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
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
      "createdAt": "2026-09-01T18:53:26.234Z"
    },
    {
      "id": "action-17-nest-creature-2-93",
      "round": 17,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
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
      "createdAt": "2026-09-01T18:53:26.234Z"
    },
    {
      "id": "action-18-player-2-94",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.234Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 76 (round 18)
- Player: 陸小鳳 (player-2), level 1, experience 30, at (4, 5), health 24, stamina 5.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-18-player-2-95",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.241Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 77 (round 18)
- Player: 陸小鳳 (player-2), level 1, experience 30, at (5, 5), health 24, stamina 0.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-18-player-2-96",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 5
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.247Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 78 (round 19)
- Player: 陸小鳳 (player-2), level 1, experience 31, at (5, 5), health 24, stamina 10.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-18-nest-creature-1-97",
      "round": 18,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
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
      "createdAt": "2026-09-01T18:53:26.249Z"
    },
    {
      "id": "action-18-nest-creature-2-98",
      "round": 18,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
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
      "createdAt": "2026-09-01T18:53:26.249Z"
    },
    {
      "id": "action-19-player-2-99",
      "round": 19,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.249Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 79 (round 19)
- Player: 陸小鳳 (player-2), level 1, experience 31, at (5, 5), health 24, stamina 7.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-19-player-2-100",
      "round": 19,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "hundred-poison-inner",
        "reason": "練功：練習功法 百毒納氣"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 百毒納氣",
      "createdAt": "2026-09-01T18:53:26.256Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 80 (round 19)
- Player: 陸小鳳 (player-2), level 1, experience 31, at (5, 5), health 24, stamina 4.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-19-player-2-101",
      "round": 19,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "hundred-poison-inner",
        "reason": "練功：練習功法 百毒納氣"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 百毒納氣",
      "createdAt": "2026-09-01T18:53:26.260Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 81 (round 19)
- Player: 陸小鳳 (player-2), level 1, experience 31, at (5, 5), health 24, stamina 1.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-19-player-2-102",
      "round": 19,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "hundred-poison-inner",
        "reason": "練功：練習功法 百毒納氣"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 百毒納氣",
      "createdAt": "2026-09-01T18:53:26.264Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 82 (round 20)
- Player: 陸小鳳 (player-2), level 1, experience 34, at (5, 5), health 24, stamina 10.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-19-nest-creature-1-103",
      "round": 19,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
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
      "createdAt": "2026-09-01T18:53:26.266Z"
    },
    {
      "id": "action-19-nest-creature-2-104",
      "round": 19,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
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
      "createdAt": "2026-09-01T18:53:26.266Z"
    },
    {
      "id": "action-20-player-2-105",
      "round": 20,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.266Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 83 (round 20)
- Player: 陸小鳳 (player-2), level 1, experience 34, at (5, 5), health 24, stamina 7.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-20-player-2-106",
      "round": 20,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "hundred-poison-inner",
        "reason": "練功：練習功法 百毒納氣"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 百毒納氣",
      "createdAt": "2026-09-01T18:53:26.272Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 84 (round 20)
- Player: 陸小鳳 (player-2), level 1, experience 34, at (5, 5), health 24, stamina 4.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-20-player-2-107",
      "round": 20,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "hundred-poison-inner",
        "reason": "練功：練習功法 百毒納氣"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 百毒納氣",
      "createdAt": "2026-09-01T18:53:26.276Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 85 (round 20)
- Player: 陸小鳳 (player-2), level 1, experience 34, at (5, 5), health 24, stamina 1.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-20-player-2-108",
      "round": 20,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "hundred-poison-inner",
        "reason": "練功：練習功法 百毒納氣"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 百毒納氣",
      "createdAt": "2026-09-01T18:53:26.281Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 86 (round 21)
- Player: 陸小鳳 (player-2), level 1, experience 37, at (5, 5), health 24, stamina 10.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-20-nest-creature-1-109",
      "round": 20,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
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
      "createdAt": "2026-09-01T18:53:26.282Z"
    },
    {
      "id": "action-20-nest-creature-2-110",
      "round": 20,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
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
      "createdAt": "2026-09-01T18:53:26.283Z"
    },
    {
      "id": "action-21-player-2-111",
      "round": 21,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.283Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 87 (round 21)
- Player: 陸小鳳 (player-2), level 1, experience 37, at (5, 5), health 24, stamina 7.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-21-player-2-112",
      "round": 21,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "hundred-poison-inner",
        "reason": "練功：練習功法 百毒納氣"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 百毒納氣",
      "createdAt": "2026-09-01T18:53:26.289Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 88 (round 21)
- Player: 陸小鳳 (player-2), level 1, experience 37, at (5, 5), health 24, stamina 4.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-21-player-2-113",
      "round": 21,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "hundred-poison-inner",
        "reason": "練功：練習功法 百毒納氣"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 百毒納氣",
      "createdAt": "2026-09-01T18:53:26.293Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 89 (round 21)
- Player: 陸小鳳 (player-2), level 1, experience 37, at (5, 5), health 24, stamina 1.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-21-player-2-114",
      "round": 21,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "hundred-poison-inner",
        "reason": "練功：練習功法 百毒納氣"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 百毒納氣",
      "createdAt": "2026-09-01T18:53:26.297Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 90 (round 22)
- Player: 陸小鳳 (player-2), level 1, experience 40, at (5, 5), health 24, stamina 10.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-21-nest-creature-1-115",
      "round": 21,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
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
      "createdAt": "2026-09-01T18:53:26.299Z"
    },
    {
      "id": "action-21-nest-creature-2-116",
      "round": 21,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
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
      "createdAt": "2026-09-01T18:53:26.299Z"
    },
    {
      "id": "action-22-player-2-117",
      "round": 22,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.299Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 91 (round 22)
- Player: 陸小鳳 (player-2), level 1, experience 40, at (5, 5), health 24, stamina 7.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-22-player-2-118",
      "round": 22,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "hundred-poison-inner",
        "reason": "練功：練習功法 百毒納氣"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 百毒納氣",
      "createdAt": "2026-09-01T18:53:26.305Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 92 (round 22)
- Player: 陸小鳳 (player-2), level 1, experience 40, at (5, 5), health 24, stamina 4.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-22-player-2-119",
      "round": 22,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "hundred-poison-inner",
        "reason": "練功：練習功法 百毒納氣"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 百毒納氣",
      "createdAt": "2026-09-01T18:53:26.309Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 93 (round 22)
- Player: 陸小鳳 (player-2), level 1, experience 40, at (5, 5), health 24, stamina 1.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-22-player-2-120",
      "round": 22,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "hundred-poison-inner",
        "reason": "練功：練習功法 百毒納氣"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 百毒納氣",
      "createdAt": "2026-09-01T18:53:26.313Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 94 (round 23)
- Player: 陸小鳳 (player-2), level 1, experience 43, at (5, 5), health 24, stamina 10.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 15
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-22-nest-creature-1-121",
      "round": 22,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
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
      "createdAt": "2026-09-01T18:53:26.315Z"
    },
    {
      "id": "action-22-nest-creature-2-122",
      "round": 22,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 8
        },
        "reason": "移動接近 item-point-5。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-5。",
      "createdAt": "2026-09-01T18:53:26.315Z"
    },
    {
      "id": "action-23-player-2-123",
      "round": 23,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.316Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-2",
      "creatureName": "生物巢穴 1的怪物 Lv.2",
      "message": "生物巢穴 1的怪物 Lv.2 吃掉了道具點。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 95 (round 23)
- Player: 陸小鳳 (player-2), level 1, experience 43, at (5, 5), health 24, stamina 7.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-23-player-2-124",
      "round": 23,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "hundred-poison-inner",
        "reason": "練功：練習功法 百毒納氣"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 百毒納氣",
      "createdAt": "2026-09-01T18:53:26.322Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 96 (round 23)
- Player: 陸小鳳 (player-2), level 1, experience 43, at (5, 5), health 24, stamina 4.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-23-player-2-125",
      "round": 23,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "hundred-poison-inner",
        "reason": "練功：練習功法 百毒納氣"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 百毒納氣",
      "createdAt": "2026-09-01T18:53:26.326Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 97 (round 23)
- Player: 陸小鳳 (player-2), level 1, experience 43, at (5, 5), health 24, stamina 1.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-23-player-2-126",
      "round": 23,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "hundred-poison-inner",
        "reason": "練功：練習功法 百毒納氣"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 百毒納氣",
      "createdAt": "2026-09-01T18:53:26.330Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 98 (round 24)
- Player: 陸小鳳 (player-2), level 1, experience 46, at (5, 5), health 24, stamina 10.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 15
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-23-nest-creature-1-127",
      "round": 23,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
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
      "createdAt": "2026-09-01T18:53:26.332Z"
    },
    {
      "id": "action-23-nest-creature-2-128",
      "round": 23,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 6
        },
        "reason": "移動接近 item-point-13。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-13。",
      "createdAt": "2026-09-01T18:53:26.332Z"
    },
    {
      "id": "action-24-player-2-129",
      "round": 24,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.333Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 99 (round 24)
- Player: 陸小鳳 (player-2), level 1, experience 46, at (5, 4), health 24, stamina 5.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-24-player-2-130",
      "round": 24,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 4
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T18:53:26.343Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 100 (round 24)
- Player: 陸小鳳 (player-2), level 1, experience 46, at (6, 4), health 24, stamina 0.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-24-player-2-131",
      "round": 24,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.349Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 101 (round 25)
- Player: 陸小鳳 (player-2), level 1, experience 47, at (6, 4), health 24, stamina 10.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 15
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-24-nest-creature-1-132",
      "round": 24,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
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
      "createdAt": "2026-09-01T18:53:26.352Z"
    },
    {
      "id": "action-24-nest-creature-2-133",
      "round": 24,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 7,
          "column": 6
        },
        "reason": "移動接近 item-point-6。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-6。",
      "createdAt": "2026-09-01T18:53:26.352Z"
    },
    {
      "id": "action-25-player-2-134",
      "round": 25,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.352Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 102 (round 25)
- Player: 陸小鳳 (player-2), level 1, experience 47, at (6, 3), health 24, stamina 5.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-25-player-2-135",
      "round": 25,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T18:53:26.361Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 103 (round 25)
- Player: 陸小鳳 (player-2), level 1, experience 47, at (6, 2), health 24, stamina 3.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-25-player-2-136",
      "round": 25,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 6,
          "column": 2
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.368Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 104 (round 25)
- Player: 陸小鳳 (player-2), level 1, experience 47, at (6, 1), health 24, stamina 1.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-25-player-2-137",
      "round": 25,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 6,
          "column": 1
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T18:53:26.377Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 105 (round 26)
- Player: 陸小鳳 (player-2), level 2, experience 0, at (6, 1), health 24, stamina 10.5
- Attributes: armStrength=12, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 15
- Stored experience change: -47 (level up; stored experience reset by game rules)
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-25-nest-creature-1-138",
      "round": 25,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
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
      "createdAt": "2026-09-01T18:53:26.379Z"
    },
    {
      "id": "action-25-nest-creature-2-139",
      "round": 25,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 7,
          "column": 7
        },
        "reason": "移動接近 item-point-7。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-7。",
      "createdAt": "2026-09-01T18:53:26.379Z"
    },
    {
      "id": "action-26-player-2-140",
      "round": 26,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.380Z"
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
      "id": "nest-creature-3",
      "name": "生物巢穴 1的怪物 Lv.3",
      "innerSkillId": "golden-body-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 3,
        "column": 13
      },
      "attributes": {
        "armStrength": 11,
        "constitution": 10,
        "agility": 5,
        "innerEnergy": 7,
        "insight": 5
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 3,
      "behaviorType": "wanderer",
      "schoolId": "golden-body",
      "homePosition": {
        "row": 2,
        "column": 13
      },
      "homeNestId": "creature-nest-1",
      "spawnedRound": 26,
      "baseAttributes": {
        "armStrength": 9.799999999999999,
        "constitution": 9.799999999999999,
        "agility": 5,
        "innerEnergy": 7,
        "insight": 5.6
      },
      "health": 30,
      "maxHealth": 30,
      "stamina": 8,
      "maxStamina": 8,
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

### Turn 106 (round 26)
- Player: 陸小鳳 (player-2), level 2, experience 0, at (6, 1), health 24, stamina 10.5
- Attributes: armStrength=13, constitution=8, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-141",
      "round": 26,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.386Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 107 (round 26)
- Player: 陸小鳳 (player-2), level 2, experience 0, at (6, 1), health 24, stamina 10.5
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-142",
      "round": 26,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.392Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 108 (round 26)
- Player: 陸小鳳 (player-2), level 2, experience 0, at (5, 1), health 24, stamina 5.5
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-143",
      "round": 26,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 1
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.398Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 109 (round 26)
- Player: 陸小鳳 (player-2), level 2, experience 0, at (4, 1), health 24, stamina 0.5
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-144",
      "round": 26,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 4,
          "column": 1
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.404Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 110 (round 27)
- Player: 陸小鳳 (player-2), level 2, experience 1, at (4, 1), health 25.35, stamina 11
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-nest-creature-1-145",
      "round": 26,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
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
      "createdAt": "2026-09-01T18:53:26.406Z"
    },
    {
      "id": "action-26-nest-creature-2-146",
      "round": 26,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
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
        "reason": "移動接近 item-point-14。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-14。",
      "createdAt": "2026-09-01T18:53:26.406Z"
    },
    {
      "id": "action-26-nest-creature-3-147",
      "round": 26,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-01T18:53:26.406Z"
    },
    {
      "id": "action-27-player-2-148",
      "round": 27,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.407Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 111 (round 27)
- Player: 陸小鳳 (player-2), level 2, experience 1, at (3, 1), health 25.35, stamina 9
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-27-player-2-149",
      "round": 27,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 3,
          "column": 1
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.414Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 112 (round 27)
- Player: 陸小鳳 (player-2), level 2, experience 1, at (2, 1), health 25.35, stamina 7
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-27-player-2-150",
      "round": 27,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 1
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.420Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 113 (round 27)
- Player: 陸小鳳 (player-2), level 2, experience 1, at (1, 1), health 25.35, stamina 5
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-27-player-2-151",
      "round": 27,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 1,
          "column": 1
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.428Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 114 (round 27)
- Player: 陸小鳳 (player-2), level 2, experience 1, at (2, 1), health 25.35, stamina 3
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-27-player-2-152",
      "round": 27,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 1
        },
        "reason": "定位：前往出口 (2,1)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (2,1)",
      "createdAt": "2026-09-01T18:53:26.434Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 115 (round 27)
- Player: 陸小鳳 (player-2), level 2, experience 1, at (2, 2), health 25.35, stamina 1
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-27-player-2-153",
      "round": 27,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 2
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T18:53:26.439Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 116 (round 28)
- Player: 陸小鳳 (player-2), level 2, experience 3, at (2, 2), health 26.700000000000003, stamina 11
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-27-nest-creature-1-154",
      "round": 27,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
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
      "createdAt": "2026-09-01T18:53:26.441Z"
    },
    {
      "id": "action-27-nest-creature-2-155",
      "round": 27,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 8,
          "column": 12
        },
        "reason": "移動接近 item-point-17。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-17。",
      "createdAt": "2026-09-01T18:53:26.441Z"
    },
    {
      "id": "action-27-nest-creature-3-156",
      "round": 27,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-01T18:53:26.441Z"
    },
    {
      "id": "action-28-player-2-157",
      "round": 28,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.442Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 117 (round 28)
- Player: 陸小鳳 (player-2), level 2, experience 3, at (2, 2), health 26.700000000000003, stamina 8
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-28-player-2-158",
      "round": 28,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.447Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 118 (round 28)
- Player: 陸小鳳 (player-2), level 2, experience 3, at (2, 2), health 26.700000000000003, stamina 5
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-28-player-2-159",
      "round": 28,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.452Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 119 (round 28)
- Player: 陸小鳳 (player-2), level 2, experience 3, at (2, 2), health 26.700000000000003, stamina 2
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-28-player-2-160",
      "round": 28,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.456Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 120 (round 29)
- Player: 陸小鳳 (player-2), level 2, experience 7, at (2, 2), health 27, stamina 11
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-28-nest-creature-1-161",
      "round": 28,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
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
      "createdAt": "2026-09-01T18:53:26.459Z"
    },
    {
      "id": "action-28-nest-creature-2-162",
      "round": 28,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 8,
          "column": 13
        },
        "reason": "移動接近 item-point-17。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-17。",
      "createdAt": "2026-09-01T18:53:26.459Z"
    },
    {
      "id": "action-28-nest-creature-3-163",
      "round": 28,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-01T18:53:26.459Z"
    },
    {
      "id": "action-29-player-2-164",
      "round": 29,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.459Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-2",
      "creatureName": "生物巢穴 1的怪物 Lv.2",
      "message": "生物巢穴 1的怪物 Lv.2 吃掉了道具點。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 121 (round 29)
- Player: 陸小鳳 (player-2), level 2, experience 7, at (2, 2), health 27, stamina 8
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-29-player-2-165",
      "round": 29,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.464Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 122 (round 29)
- Player: 陸小鳳 (player-2), level 2, experience 7, at (2, 2), health 27, stamina 5
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-29-player-2-166",
      "round": 29,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.469Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 123 (round 29)
- Player: 陸小鳳 (player-2), level 2, experience 7, at (2, 2), health 27, stamina 2
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-29-player-2-167",
      "round": 29,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.474Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 124 (round 30)
- Player: 陸小鳳 (player-2), level 2, experience 11, at (2, 2), health 27, stamina 11
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-29-nest-creature-1-168",
      "round": 29,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
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
      "createdAt": "2026-09-01T18:53:26.476Z"
    },
    {
      "id": "action-29-nest-creature-2-169",
      "round": 29,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 9,
          "column": 12
        },
        "reason": "移動接近 item-point-2。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-2。",
      "createdAt": "2026-09-01T18:53:26.476Z"
    },
    {
      "id": "action-29-nest-creature-3-170",
      "round": 29,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-01T18:53:26.476Z"
    },
    {
      "id": "action-30-player-2-171",
      "round": 30,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.476Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 125 (round 30)
- Player: 陸小鳳 (player-2), level 2, experience 11, at (2, 2), health 27, stamina 8
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-30-player-2-172",
      "round": 30,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.481Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 126 (round 30)
- Player: 陸小鳳 (player-2), level 2, experience 11, at (2, 2), health 27, stamina 5
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-30-player-2-173",
      "round": 30,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.486Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 127 (round 30)
- Player: 陸小鳳 (player-2), level 2, experience 11, at (2, 2), health 27, stamina 2
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-30-player-2-174",
      "round": 30,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.491Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 128 (round 31)
- Player: 陸小鳳 (player-2), level 2, experience 15, at (2, 2), health 27, stamina 11
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-30-nest-creature-1-175",
      "round": 30,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
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
      "createdAt": "2026-09-01T18:53:26.493Z"
    },
    {
      "id": "action-30-nest-creature-2-176",
      "round": 30,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 12,
          "column": 12
        },
        "reason": "移動接近 item-point-19。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-19。",
      "createdAt": "2026-09-01T18:53:26.494Z"
    },
    {
      "id": "action-30-nest-creature-3-177",
      "round": 30,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-01T18:53:26.494Z"
    },
    {
      "id": "action-31-player-2-178",
      "round": 31,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.494Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 129 (round 31)
- Player: 陸小鳳 (player-2), level 2, experience 15, at (2, 2), health 27, stamina 8
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-31-player-2-179",
      "round": 31,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.499Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 130 (round 31)
- Player: 陸小鳳 (player-2), level 2, experience 15, at (2, 2), health 27, stamina 5
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-31-player-2-180",
      "round": 31,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.505Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 131 (round 31)
- Player: 陸小鳳 (player-2), level 2, experience 15, at (2, 2), health 27, stamina 2
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-31-player-2-181",
      "round": 31,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.511Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 132 (round 32)
- Player: 陸小鳳 (player-2), level 2, experience 19, at (2, 2), health 27, stamina 11
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-31-nest-creature-1-182",
      "round": 31,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
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
      "createdAt": "2026-09-01T18:53:26.513Z"
    },
    {
      "id": "action-31-nest-creature-2-183",
      "round": 31,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 12,
          "column": 13
        },
        "reason": "移動接近 item-point-19。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-19。",
      "createdAt": "2026-09-01T18:53:26.513Z"
    },
    {
      "id": "action-31-nest-creature-3-184",
      "round": 31,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-01T18:53:26.513Z"
    },
    {
      "id": "action-32-player-2-185",
      "round": 32,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.513Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-2",
      "creatureName": "生物巢穴 1的怪物 Lv.2",
      "message": "生物巢穴 1的怪物 Lv.2 吃掉了道具點。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 133 (round 32)
- Player: 陸小鳳 (player-2), level 2, experience 19, at (2, 2), health 27, stamina 8
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-32-player-2-186",
      "round": 32,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.519Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 134 (round 32)
- Player: 陸小鳳 (player-2), level 2, experience 19, at (2, 2), health 27, stamina 5
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-32-player-2-187",
      "round": 32,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.525Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 135 (round 32)
- Player: 陸小鳳 (player-2), level 2, experience 19, at (2, 2), health 27, stamina 2
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-32-player-2-188",
      "round": 32,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.530Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 136 (round 33)
- Player: 陸小鳳 (player-2), level 2, experience 23, at (2, 2), health 27, stamina 11
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-32-nest-creature-1-189",
      "round": 32,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
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
      "createdAt": "2026-09-01T18:53:26.532Z"
    },
    {
      "id": "action-32-nest-creature-2-190",
      "round": 32,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 13,
          "column": 11
        },
        "reason": "移動接近 item-point-3。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-3。",
      "createdAt": "2026-09-01T18:53:26.532Z"
    },
    {
      "id": "action-32-nest-creature-3-191",
      "round": 32,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-01T18:53:26.532Z"
    },
    {
      "id": "action-33-player-2-192",
      "round": 33,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.532Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 137 (round 33)
- Player: 陸小鳳 (player-2), level 2, experience 23, at (2, 2), health 27, stamina 8
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-33-player-2-193",
      "round": 33,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.537Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 138 (round 33)
- Player: 陸小鳳 (player-2), level 2, experience 23, at (2, 2), health 27, stamina 5
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-33-player-2-194",
      "round": 33,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.542Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 139 (round 33)
- Player: 陸小鳳 (player-2), level 2, experience 23, at (2, 2), health 27, stamina 2
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-33-player-2-195",
      "round": 33,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.546Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 140 (round 34)
- Player: 陸小鳳 (player-2), level 2, experience 27, at (2, 2), health 27, stamina 11
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-33-nest-creature-1-196",
      "round": 33,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
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
      "createdAt": "2026-09-01T18:53:26.548Z"
    },
    {
      "id": "action-33-nest-creature-2-197",
      "round": 33,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 13,
          "column": 10
        },
        "reason": "移動接近 item-point-3。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-3。",
      "createdAt": "2026-09-01T18:53:26.548Z"
    },
    {
      "id": "action-33-nest-creature-3-198",
      "round": 33,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-01T18:53:26.548Z"
    },
    {
      "id": "action-34-player-2-199",
      "round": 34,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.549Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-2",
      "creatureName": "生物巢穴 1的怪物 Lv.2",
      "message": "生物巢穴 1的怪物 Lv.2 吃掉了道具點。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 141 (round 34)
- Player: 陸小鳳 (player-2), level 2, experience 27, at (2, 2), health 27, stamina 8
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-34-player-2-200",
      "round": 34,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.554Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 142 (round 34)
- Player: 陸小鳳 (player-2), level 2, experience 27, at (2, 2), health 27, stamina 5
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-34-player-2-201",
      "round": 34,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.558Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 143 (round 34)
- Player: 陸小鳳 (player-2), level 2, experience 27, at (2, 2), health 27, stamina 2
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-34-player-2-202",
      "round": 34,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.563Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 144 (round 35)
- Player: 陸小鳳 (player-2), level 2, experience 31, at (2, 2), health 27, stamina 11
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-34-nest-creature-1-203",
      "round": 34,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
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
      "createdAt": "2026-09-01T18:53:26.565Z"
    },
    {
      "id": "action-34-nest-creature-2-204",
      "round": 34,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
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
      "createdAt": "2026-09-01T18:53:26.565Z"
    },
    {
      "id": "action-34-nest-creature-3-205",
      "round": 34,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-01T18:53:26.565Z"
    },
    {
      "id": "action-35-player-2-206",
      "round": 35,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.566Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 145 (round 35)
- Player: 陸小鳳 (player-2), level 2, experience 31, at (2, 2), health 27, stamina 8
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-35-player-2-207",
      "round": 35,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.570Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 146 (round 35)
- Player: 陸小鳳 (player-2), level 2, experience 31, at (2, 2), health 27, stamina 5
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-35-player-2-208",
      "round": 35,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.575Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 147 (round 35)
- Player: 陸小鳳 (player-2), level 2, experience 31, at (2, 2), health 27, stamina 2
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-35-player-2-209",
      "round": 35,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.579Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 148 (round 36)
- Player: 陸小鳳 (player-2), level 2, experience 35, at (2, 2), health 27, stamina 11
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +4
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-35-nest-creature-1-210",
      "round": 35,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
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
      "createdAt": "2026-09-01T18:53:26.581Z"
    },
    {
      "id": "action-35-nest-creature-2-211",
      "round": 35,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 11,
          "column": 8
        },
        "reason": "移動接近 item-point-1。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-1。",
      "createdAt": "2026-09-01T18:53:26.581Z"
    },
    {
      "id": "action-35-nest-creature-3-212",
      "round": 35,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-01T18:53:26.581Z"
    },
    {
      "id": "action-36-player-2-213",
      "round": 36,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.582Z"
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
      "id": "nest-creature-4",
      "name": "生物巢穴 1的怪物 Lv.4",
      "innerSkillId": "golden-body-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 1,
        "column": 13
      },
      "attributes": {
        "armStrength": 14,
        "constitution": 13,
        "agility": 5,
        "innerEnergy": 8,
        "insight": 6
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 4,
      "behaviorType": "wanderer",
      "schoolId": "golden-body",
      "homePosition": {
        "row": 2,
        "column": 13
      },
      "homeNestId": "creature-nest-1",
      "spawnedRound": 36,
      "baseAttributes": {
        "armStrength": 12.6,
        "constitution": 12.6,
        "agility": 5,
        "innerEnergy": 8.399999999999999,
        "insight": 6.3
      },
      "health": 39,
      "maxHealth": 39,
      "stamina": 9.5,
      "maxStamina": 9.5,
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

### Turn 149 (round 36)
- Player: 陸小鳳 (player-2), level 2, experience 35, at (2, 2), health 27, stamina 8
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-36-player-2-214",
      "round": 36,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.589Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 150 (round 36)
- Player: 陸小鳳 (player-2), level 2, experience 35, at (2, 2), health 27, stamina 5
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-36-player-2-215",
      "round": 36,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T18:53:26.595Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 151 (round 36)
- Player: 陸小鳳 (player-2), level 2, experience 35, at (2, 3), health 27, stamina 3
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-36-player-2-216",
      "round": 36,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 3
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T18:53:26.603Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 152 (round 36)
- Player: 陸小鳳 (player-2), level 2, experience 35, at (3, 3), health 27, stamina 1
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-36-player-2-217",
      "round": 36,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 3,
          "column": 3
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T18:53:26.609Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 153 (round 37)
- Player: 陸小鳳 (player-2), level 2, experience 37, at (3, 3), health 27, stamina 11
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-36-nest-creature-1-218",
      "round": 36,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
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
      "createdAt": "2026-09-01T18:53:26.611Z"
    },
    {
      "id": "action-36-nest-creature-2-219",
      "round": 36,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 12,
          "column": 8
        },
        "reason": "移動接近 item-point-1。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-1。",
      "createdAt": "2026-09-01T18:53:26.611Z"
    },
    {
      "id": "action-36-nest-creature-3-220",
      "round": 36,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-01T18:53:26.611Z"
    },
    {
      "id": "action-36-nest-creature-4-221",
      "round": 36,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
      "createdAt": "2026-09-01T18:53:26.611Z"
    },
    {
      "id": "action-37-player-2-222",
      "round": 37,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.611Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 154 (round 37)
- Player: 陸小鳳 (player-2), level 2, experience 40, at (3, 3), health 27, stamina 6
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-37-player-2-223",
      "round": 37,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
            "row": 3,
            "column": 4
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-01T18:53:26.617Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 155 (round 37)
- Player: 陸小鳳 (player-2), level 2, experience 60, at (3, 3), health 27, stamina 1
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: nest-creature-1
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-37-player-2-224",
      "round": 37,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
            "row": 3,
            "column": 4
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-01T18:53:26.624Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 156 (round 38)
- Player: 陸小鳳 (player-2), level 2, experience 62, at (3, 3), health 27, stamina 11
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-37-nest-creature-2-225",
      "round": 37,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 11,
          "column": 8
        },
        "reason": "移動接近 item-point-1。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-1。",
      "createdAt": "2026-09-01T18:53:26.626Z"
    },
    {
      "id": "action-37-nest-creature-3-226",
      "round": 37,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-01T18:53:26.626Z"
    },
    {
      "id": "action-37-nest-creature-4-227",
      "round": 37,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
      "createdAt": "2026-09-01T18:53:26.626Z"
    },
    {
      "id": "action-38-player-2-228",
      "round": 38,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.626Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 157 (round 38)
- Player: 陸小鳳 (player-2), level 2, experience 62, at (3, 2), health 27, stamina 9
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-38-player-2-229",
      "round": 38,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 3,
          "column": 2
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.631Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 158 (round 38)
- Player: 陸小鳳 (player-2), level 2, experience 62, at (4, 2), health 27, stamina 7
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-38-player-2-230",
      "round": 38,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 4,
          "column": 2
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.637Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 159 (round 38)
- Player: 陸小鳳 (player-2), level 2, experience 62, at (4, 3), health 27, stamina 5
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-38-player-2-231",
      "round": 38,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 4,
          "column": 3
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.643Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 160 (round 38)
- Player: 陸小鳳 (player-2), level 2, experience 62, at (4, 3), health 27, stamina 2
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-38-player-2-232",
      "round": 38,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.646Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 161 (round 39)
- Player: 陸小鳳 (player-2), level 2, experience 66, at (4, 3), health 27, stamina 11
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-38-nest-creature-2-233",
      "round": 38,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 12,
          "column": 8
        },
        "reason": "移動接近 item-point-1。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-1。",
      "createdAt": "2026-09-01T18:53:26.648Z"
    },
    {
      "id": "action-38-nest-creature-3-234",
      "round": 38,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-01T18:53:26.648Z"
    },
    {
      "id": "action-38-nest-creature-4-235",
      "round": 38,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
      "createdAt": "2026-09-01T18:53:26.648Z"
    },
    {
      "id": "action-39-player-2-236",
      "round": 39,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.648Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 162 (round 39)
- Player: 陸小鳳 (player-2), level 2, experience 66, at (4, 4), health 27, stamina 6
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-39-player-2-237",
      "round": 39,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 4,
          "column": 4
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.655Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 163 (round 39)
- Player: 陸小鳳 (player-2), level 2, experience 66, at (5, 4), health 27, stamina 1
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-39-player-2-238",
      "round": 39,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 4
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T18:53:26.664Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 164 (round 40)
- Player: 陸小鳳 (player-2), level 2, experience 68, at (5, 4), health 27, stamina 11
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-39-nest-creature-2-239",
      "round": 39,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 11,
          "column": 8
        },
        "reason": "移動接近 item-point-1。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-1。",
      "createdAt": "2026-09-01T18:53:26.666Z"
    },
    {
      "id": "action-39-nest-creature-3-240",
      "round": 39,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-01T18:53:26.667Z"
    },
    {
      "id": "action-39-nest-creature-4-241",
      "round": 39,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
      "createdAt": "2026-09-01T18:53:26.667Z"
    },
    {
      "id": "action-40-player-2-242",
      "round": 40,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.667Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 165 (round 40)
- Player: 陸小鳳 (player-2), level 2, experience 68, at (6, 4), health 27, stamina 6
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-40-player-2-243",
      "round": 40,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.673Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 166 (round 40)
- Player: 陸小鳳 (player-2), level 2, experience 68, at (6, 5), health 27, stamina 3
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-40-player-2-244",
      "round": 40,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.680Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 167 (round 41)
- Player: 陸小鳳 (player-2), level 2, experience 74, at (6, 5), health 18.35, stamina 11
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +6
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-40-nest-creature-2-245",
      "round": 40,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 12,
          "column": 8
        },
        "reason": "移動接近 item-point-1。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-1。",
      "createdAt": "2026-09-01T18:53:26.682Z"
    },
    {
      "id": "action-40-nest-creature-3-246",
      "round": 40,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
            "row": 6,
            "column": 5
          }
        },
        "reason": "與 陸小鳳 交戰。"
      },
      "result": "succeeded",
      "reason": "與 陸小鳳 交戰。",
      "createdAt": "2026-09-01T18:53:26.683Z"
    },
    {
      "id": "action-40-nest-creature-4-247",
      "round": 40,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
      "createdAt": "2026-09-01T18:53:26.683Z"
    },
    {
      "id": "action-41-player-2-248",
      "round": 41,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.683Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-3",
      "creatureName": "生物巢穴 1的怪物 Lv.3",
      "message": "生物巢穴 1的怪物 Lv.3 攻擊 陸小鳳，造成 10 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 168 (round 41)
- Player: 陸小鳳 (player-2), level 2, experience 74, at (7, 5), health 18.35, stamina 6
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-41-player-2-249",
      "round": 41,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T18:53:26.692Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 169 (round 41)
- Player: 陸小鳳 (player-2), level 2, experience 74, at (7, 4), health 18.35, stamina 4
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-41-player-2-250",
      "round": 41,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 7,
          "column": 4
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T18:53:26.700Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 170 (round 41)
- Player: 陸小鳳 (player-2), level 2, experience 74, at (8, 4), health 18.35, stamina 2
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-41-player-2-251",
      "round": 41,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T18:53:26.709Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 171 (round 41)
- Player: 陸小鳳 (player-2), level 2, experience 74, at (8, 3), health 18.35, stamina 0
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-41-player-2-252",
      "round": 41,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T18:53:26.714Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 172 (round 42)
- Player: 陸小鳳 (player-2), level 2, experience 74, at (8, 3), health 19.700000000000003, stamina 11
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-41-nest-creature-2-253",
      "round": 41,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 11,
          "column": 8
        },
        "reason": "移動接近 item-point-1。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-1。",
      "createdAt": "2026-09-01T18:53:26.715Z"
    },
    {
      "id": "action-41-nest-creature-3-254",
      "round": 41,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "target": {
          "id": "base-1",
          "kind": "base",
          "position": {
            "row": 5,
            "column": 3
          }
        },
        "reason": "與 平涼 交戰。"
      },
      "result": "succeeded",
      "reason": "與 平涼 交戰。",
      "createdAt": "2026-09-01T18:53:26.715Z"
    },
    {
      "id": "action-41-nest-creature-4-255",
      "round": 41,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
      "createdAt": "2026-09-01T18:53:26.715Z"
    },
    {
      "id": "action-42-player-2-256",
      "round": 42,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.715Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 173 (round 42)
- Player: 陸小鳳 (player-2), level 2, experience 74, at (8, 2), health 19.700000000000003, stamina 9
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-42-player-2-257",
      "round": 42,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 8,
          "column": 2
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T18:53:26.724Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 174 (round 42)
- Player: 陸小鳳 (player-2), level 2, experience 74, at (8, 1), health 19.700000000000003, stamina 7
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-42-player-2-258",
      "round": 42,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 8,
          "column": 1
        },
        "reason": "收集道具：移動到道具位置"
      },
      "result": "succeeded",
      "reason": "收集道具：移動到道具位置",
      "createdAt": "2026-09-01T18:53:26.735Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 175 (round 42)
- Player: 陸小鳳 (player-2), level 2, experience 74, at (8, 1), health 19.700000000000003, stamina 7
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-42-player-2-259",
      "round": 42,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
            "column": 1
          }
        },
        "reason": "收集道具：拾取"
      },
      "result": "succeeded",
      "reason": "收集道具：拾取",
      "createdAt": "2026-09-01T18:53:26.743Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 176 (round 42)
- Player: 陸小鳳 (player-2), level 2, experience 74, at (7, 1), health 19.700000000000003, stamina 5
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-42-player-2-260",
      "round": 42,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 7,
          "column": 1
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T18:53:26.753Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 177 (round 42)
- Player: 陸小鳳 (player-2), level 2, experience 74, at (6, 1), health 19.700000000000003, stamina 3
- Attributes: armStrength=13, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-42-player-2-261",
      "round": 42,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 6,
          "column": 1
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T18:53:26.760Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 178 (round 42)
- Player: 陸小鳳 (player-2), level 2, experience 74, at (6, 1), health 19.700000000000003, stamina 3
- Attributes: armStrength=14, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-42-player-2-262",
      "round": 42,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "equip",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "instanceId": "equipment-player-2-42322dc5-e218-4a81-93da-ed551b1e7049",
        "reason": "裝備：青銅刀（weapon）"
      },
      "result": "succeeded",
      "reason": "裝備：青銅刀（weapon）",
      "createdAt": "2026-09-01T18:53:26.766Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 179 (round 42)
- Player: 陸小鳳 (player-2), level 2, experience 74, at (6, 2), health 19.700000000000003, stamina 1
- Attributes: armStrength=14, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-42-player-2-263",
      "round": 42,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 6,
          "column": 2
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T18:53:26.772Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 180 (round 43)
- Player: 陸小鳳 (player-2), level 2, experience 76, at (6, 2), health 21.200000000000003, stamina 11.5
- Attributes: armStrength=14, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-42-nest-creature-2-264",
      "round": 42,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 12,
          "column": 8
        },
        "reason": "移動接近 item-point-1。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-1。",
      "createdAt": "2026-09-01T18:53:26.774Z"
    },
    {
      "id": "action-42-nest-creature-3-265",
      "round": 42,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-01T18:53:26.774Z"
    },
    {
      "id": "action-42-nest-creature-4-266",
      "round": 42,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
      "createdAt": "2026-09-01T18:53:26.774Z"
    },
    {
      "id": "action-43-player-2-267",
      "round": 43,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.774Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 181 (round 43)
- Player: 陸小鳳 (player-2), level 2, experience 76, at (7, 2), health 21.200000000000003, stamina 9.5
- Attributes: armStrength=14, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-43-player-2-268",
      "round": 43,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 7,
          "column": 2
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T18:53:26.781Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 182 (round 43)
- Player: 陸小鳳 (player-2), level 2, experience 76, at (6, 2), health 21.200000000000003, stamina 7.5
- Attributes: armStrength=14, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-43-player-2-269",
      "round": 43,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 6,
          "column": 2
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T18:53:26.789Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 183 (round 43)
- Player: 陸小鳳 (player-2), level 2, experience 76, at (6, 1), health 21.200000000000003, stamina 5.5
- Attributes: armStrength=14, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-43-player-2-270",
      "round": 43,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 6,
          "column": 1
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T18:53:26.796Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 184 (round 43)
- Player: 陸小鳳 (player-2), level 2, experience 76, at (5, 1), health 21.200000000000003, stamina 0.5
- Attributes: armStrength=14, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-43-player-2-271",
      "round": 43,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 1
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T18:53:26.803Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 185 (round 44)
- Player: 陸小鳳 (player-2), level 2, experience 77, at (5, 1), health 22.700000000000003, stamina 11.5
- Attributes: armStrength=14, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-43-nest-creature-2-272",
      "round": 43,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 11,
          "column": 8
        },
        "reason": "移動接近 item-point-1。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-1。",
      "createdAt": "2026-09-01T18:53:26.805Z"
    },
    {
      "id": "action-43-nest-creature-3-273",
      "round": 43,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-01T18:53:26.805Z"
    },
    {
      "id": "action-43-nest-creature-4-274",
      "round": 43,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
      "createdAt": "2026-09-01T18:53:26.805Z"
    },
    {
      "id": "action-44-player-2-275",
      "round": 44,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.806Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 186 (round 44)
- Player: 陸小鳳 (player-2), level 2, experience 77, at (4, 1), health 22.700000000000003, stamina 6.5
- Attributes: armStrength=14, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-44-player-2-276",
      "round": 44,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 4,
          "column": 1
        },
        "reason": "定位：前往出口 (4,1)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (4,1)",
      "createdAt": "2026-09-01T18:53:26.812Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 187 (round 44)
- Player: 陸小鳳 (player-2), level 2, experience 77, at (4, 2), health 22.700000000000003, stamina 4.5
- Attributes: armStrength=14, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-44-player-2-277",
      "round": 44,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 4,
          "column": 2
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T18:53:26.820Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 188 (round 44)
- Player: 陸小鳳 (player-2), level 2, experience 77, at (4, 3), health 22.700000000000003, stamina 2.5
- Attributes: armStrength=14, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-44-player-2-278",
      "round": 44,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 4,
          "column": 3
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T18:53:26.827Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 189 (round 44)
- Player: 陸小鳳 (player-2), level 2, experience 77, at (4, 3), health 22.700000000000003, stamina 0.5
- Attributes: armStrength=14, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-44-player-2-279",
      "round": 44,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.830Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 190 (round 45)
- Player: 陸小鳳 (player-2), level 2, experience 78, at (4, 3), health 24.200000000000003, stamina 11.5
- Attributes: armStrength=14, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-44-nest-creature-2-280",
      "round": 44,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 12,
          "column": 8
        },
        "reason": "移動接近 item-point-1。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-1。",
      "createdAt": "2026-09-01T18:53:26.832Z"
    },
    {
      "id": "action-44-nest-creature-3-281",
      "round": 44,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-01T18:53:26.832Z"
    },
    {
      "id": "action-44-nest-creature-4-282",
      "round": 44,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
      "createdAt": "2026-09-01T18:53:26.832Z"
    },
    {
      "id": "action-45-player-2-283",
      "round": 45,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.832Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 191 (round 45)
- Player: 陸小鳳 (player-2), level 2, experience 81, at (4, 3), health 24.200000000000003, stamina 6.5
- Attributes: armStrength=14, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-45-player-2-284",
      "round": 45,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
            "row": 4,
            "column": 2
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.3"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.3",
      "createdAt": "2026-09-01T18:53:26.838Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 192 (round 45)
- Player: 陸小鳳 (player-2), level 2, experience 84, at (4, 3), health 24.200000000000003, stamina 1.5
- Attributes: armStrength=14, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-45-player-2-285",
      "round": 45,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
            "row": 4,
            "column": 2
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.3"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.3",
      "createdAt": "2026-09-01T18:53:26.843Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 193 (round 46)
- Player: 陸小鳳 (player-2), level 2, experience 87, at (4, 3), health 18.700000000000003, stamina 11.5
- Attributes: armStrength=14, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +3
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-45-nest-creature-2-286",
      "round": 45,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 11,
          "column": 8
        },
        "reason": "移動接近 item-point-1。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-1。",
      "createdAt": "2026-09-01T18:53:26.845Z"
    },
    {
      "id": "action-45-nest-creature-3-287",
      "round": 45,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
            "row": 4,
            "column": 3
          }
        },
        "reason": "與 陸小鳳 交戰。"
      },
      "result": "succeeded",
      "reason": "與 陸小鳳 交戰。",
      "createdAt": "2026-09-01T18:53:26.845Z"
    },
    {
      "id": "action-45-nest-creature-4-288",
      "round": 45,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
      "createdAt": "2026-09-01T18:53:26.845Z"
    },
    {
      "id": "action-46-player-2-289",
      "round": 46,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.845Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-3",
      "creatureName": "生物巢穴 1的怪物 Lv.3",
      "message": "生物巢穴 1的怪物 Lv.3 攻擊 陸小鳳，造成 7 點傷害（根骨減傷，暴擊）。"
    },
    {
      "creatureId": "creature-nest-1",
      "creatureName": "生物巢穴 1",
      "message": "生物巢穴 1 生成了 Lv.5 怪物。"
    }
  ],
  "spawnedCreatures": [
    {
      "id": "nest-creature-1",
      "name": "生物巢穴 1的怪物 Lv.5",
      "innerSkillId": "golden-body-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 3,
        "column": 13
      },
      "attributes": {
        "armStrength": 17,
        "constitution": 16,
        "agility": 5,
        "innerEnergy": 9,
        "insight": 7
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 5,
      "behaviorType": "wanderer",
      "schoolId": "golden-body",
      "homePosition": {
        "row": 2,
        "column": 13
      },
      "homeNestId": "creature-nest-1",
      "spawnedRound": 46,
      "baseAttributes": {
        "armStrength": 15.399999999999999,
        "constitution": 15.399999999999999,
        "agility": 5,
        "innerEnergy": 9.799999999999999,
        "insight": 7
      },
      "health": 48,
      "maxHealth": 48,
      "stamina": 11,
      "maxStamina": 11,
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

### Turn 194 (round 46)
- Player: 陸小鳳 (player-2), level 3, experience 47, at (4, 3), health 18.700000000000003, stamina 6.5
- Attributes: armStrength=14, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: -40 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: nest-creature-3
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-46-player-2-290",
      "round": 46,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
            "row": 4,
            "column": 2
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.3"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.3",
      "createdAt": "2026-09-01T18:53:26.850Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 195 (round 46)
- Player: 陸小鳳 (player-2), level 3, experience 47, at (4, 3), health 18.700000000000003, stamina 6.5
- Attributes: armStrength=14, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 16
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-46-player-2-291",
      "round": 46,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.855Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 196 (round 46)
- Player: 陸小鳳 (player-2), level 3, experience 47, at (4, 3), health 18.700000000000003, stamina 6.5
- Attributes: armStrength=15, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-46-player-2-292",
      "round": 46,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.859Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 197 (round 46)
- Player: 陸小鳳 (player-2), level 3, experience 47, at (3, 3), health 18.700000000000003, stamina 4.5
- Attributes: armStrength=15, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-46-player-2-293",
      "round": 46,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 3,
          "column": 3
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.863Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 198 (round 46)
- Player: 陸小鳳 (player-2), level 3, experience 47, at (2, 3), health 18.700000000000003, stamina 2.5
- Attributes: armStrength=15, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-46-player-2-294",
      "round": 46,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 3
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T18:53:26.870Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 199 (round 46)
- Player: 陸小鳳 (player-2), level 3, experience 47, at (2, 2), health 18.700000000000003, stamina 0.5
- Attributes: armStrength=15, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 18
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-46-player-2-295",
      "round": 46,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 2
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T18:53:26.874Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 200 (round 47)
- Player: 陸小鳳 (player-2), level 3, experience 48, at (2, 2), health 20.35, stamina 12
- Attributes: armStrength=15, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 百毒納氣 (hundred-poison-inner), level 2, damage 18
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-46-nest-creature-2-296",
      "round": 46,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 12,
          "column": 8
        },
        "reason": "移動接近 item-point-1。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-1。",
      "createdAt": "2026-09-01T18:53:26.876Z"
    },
    {
      "id": "action-46-nest-creature-4-297",
      "round": 46,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
      "createdAt": "2026-09-01T18:53:26.876Z"
    },
    {
      "id": "action-46-nest-creature-1-298",
      "round": 46,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.5"
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
      "createdAt": "2026-09-01T18:53:26.876Z"
    },
    {
      "id": "action-47-player-2-299",
      "round": 47,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T18:53:26.877Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

