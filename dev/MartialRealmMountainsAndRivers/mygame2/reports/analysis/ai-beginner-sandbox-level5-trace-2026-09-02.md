# AI Beginner Sandbox Level5 Trace

- AI turns: 200
- Final round: 39
- Game won: false
- Game over: false
- Remaining nests: 1

## Aggregate

- Action counts: move=157, hold=42, end-turn=38, collect=8, attack=8, build=6, use-facility=5, use-item=2, learn-skill=2, equip=2, allocate-attribute=2, practice-skill=2, equip-inner-skill=1
- Creatures spawned (total): 4
- Creatures defeated (total): 2
- Level-ups observed: 1
- Final player: level 2, experience 81, inner skill 百毒納氣 (hundred-poison-inner) lv.1 damage 15
- Final attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13

## Efficiency (KPI)

- 行動產出率 (productive): █··········· 10.9% (30/275)
- 擊殺效率 (kill/generate): ██████······ 0.50 (2/4)
- 擊殺成本 (attack/kill): 4.00 (8 次攻擊 / 2 擊殺)
- 經驗效率 (XP/turn): 0.41 (81 XP / 200 turns)

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
      "createdAt": "2026-09-01T19:14:31.093Z"
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
      "createdAt": "2026-09-01T19:14:31.106Z"
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
      "createdAt": "2026-09-01T19:14:31.110Z"
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
      "createdAt": "2026-09-01T19:14:31.117Z"
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
      "createdAt": "2026-09-01T19:14:31.126Z"
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
      "createdAt": "2026-09-01T19:14:31.136Z"
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
      "createdAt": "2026-09-01T19:14:31.143Z"
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
      "createdAt": "2026-09-01T19:14:31.148Z"
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
      "createdAt": "2026-09-01T19:14:31.154Z"
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
      "createdAt": "2026-09-01T19:14:31.155Z"
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
      "createdAt": "2026-09-01T19:14:31.162Z"
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
      "createdAt": "2026-09-01T19:14:31.168Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 13 (round 3)
- Player: 陸小鳳 (player-2), level 1, experience 2, at (6, 2), health 24, stamina 1
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-3-player-2-13",
      "round": 3,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "陸小鳳"
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
      "createdAt": "2026-09-01T19:14:31.171Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 14 (round 4)
- Player: 陸小鳳 (player-2), level 1, experience 4, at (6, 2), health 24, stamina 8.5
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/132

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
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：exploration 分數 0.03，但目前沒有可執行 action，結束回合。候選診斷：exploration=0.03:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：exploration 分數 0.03，但目前沒有可執行 action，結束回合。候選診斷：exploration=0.03:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T19:14:31.174Z"
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
      "spawnedRound": 4,
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

### Turn 15 (round 4)
- Player: 陸小鳳 (player-2), level 1, experience 4, at (7, 2), health 24, stamina 6.5
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

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
          "row": 7,
          "column": 2
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T19:14:31.181Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 16 (round 4)
- Player: 陸小鳳 (player-2), level 1, experience 4, at (8, 2), health 24, stamina 4.5
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

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
          "column": 2
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T19:14:31.189Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 17 (round 4)
- Player: 陸小鳳 (player-2), level 1, experience 4, at (8, 3), health 24, stamina 2.5
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

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
          "column": 3
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T19:14:31.194Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 18 (round 4)
- Player: 陸小鳳 (player-2), level 1, experience 4, at (8, 4), health 24, stamina 0.5
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-4-player-2-18",
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
      "createdAt": "2026-09-01T19:14:31.199Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 19 (round 5)
- Player: 陸小鳳 (player-2), level 1, experience 5, at (8, 4), health 24, stamina 8.5
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-4-nest-creature-1-19",
      "round": 4,
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
      "createdAt": "2026-09-01T19:14:31.212Z"
    },
    {
      "id": "action-5-player-2-20",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T19:14:31.213Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 20 (round 5)
- Player: 陸小鳳 (player-2), level 1, experience 5, at (7, 4), health 24, stamina 6.5
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-5-player-2-21",
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
      "createdAt": "2026-09-01T19:14:31.221Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 21 (round 5)
- Player: 陸小鳳 (player-2), level 1, experience 5, at (6, 4), health 24, stamina 1.5
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-5-player-2-22",
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
      "createdAt": "2026-09-01T19:14:31.227Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 22 (round 6)
- Player: 陸小鳳 (player-2), level 1, experience 8, at (6, 4), health 24, stamina 8.5
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-5-nest-creature-1-23",
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
        "reason": "移動接近 item-point-11。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-11。",
      "createdAt": "2026-09-01T19:14:31.229Z"
    },
    {
      "id": "action-6-player-2-24",
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
      "createdAt": "2026-09-01T19:14:31.229Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 23 (round 6)
- Player: 陸小鳳 (player-2), level 1, experience 8, at (6, 5), health 24, stamina 5.5
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-6-player-2-25",
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
      "createdAt": "2026-09-01T19:14:31.235Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 24 (round 6)
- Player: 陸小鳳 (player-2), level 1, experience 8, at (5, 5), health 24, stamina 0.5
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-6-player-2-26",
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
      "createdAt": "2026-09-01T19:14:31.241Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 25 (round 7)
- Player: 陸小鳳 (player-2), level 1, experience 9, at (5, 5), health 24, stamina 8.5
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-6-nest-creature-1-27",
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
      "createdAt": "2026-09-01T19:14:31.244Z"
    },
    {
      "id": "action-7-player-2-28",
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
        "reason": "模糊策略：exploration 分數 0.03，但目前沒有可執行 action，結束回合。候選診斷：exploration=0.03:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：exploration 分數 0.03，但目前沒有可執行 action，結束回合。候選診斷：exploration=0.03:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T19:14:31.244Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 26 (round 7)
- Player: 陸小鳳 (player-2), level 1, experience 9, at (5, 5), health 24, stamina 5.5
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
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
      "createdAt": "2026-09-01T19:14:31.249Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 27 (round 7)
- Player: 陸小鳳 (player-2), level 1, experience 9, at (5, 5), health 24, stamina 5.5
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-7-player-2-30",
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
      "createdAt": "2026-09-01T19:14:31.253Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 28 (round 7)
- Player: 陸小鳳 (player-2), level 1, experience 9, at (5, 4), health 24, stamina 0.5
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-7-player-2-31",
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
      "createdAt": "2026-09-01T19:14:31.257Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 29 (round 8)
- Player: 陸小鳳 (player-2), level 1, experience 10, at (5, 4), health 24, stamina 10
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-7-nest-creature-1-32",
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
      "createdAt": "2026-09-01T19:14:31.259Z"
    },
    {
      "id": "action-8-player-2-33",
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
        "reason": "模糊策略：exploration 分數 0.03，但目前沒有可執行 action，結束回合。候選診斷：exploration=0.03:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：exploration 分數 0.03，但目前沒有可執行 action，結束回合。候選診斷：exploration=0.03:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T19:14:31.259Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 30 (round 8)
- Player: 陸小鳳 (player-2), level 1, experience 10, at (5, 4), health 24, stamina 8
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
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
      "createdAt": "2026-09-01T19:14:31.263Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 31 (round 8)
- Player: 陸小鳳 (player-2), level 1, experience 10, at (5, 4), health 24, stamina 5
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
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
      "createdAt": "2026-09-01T19:14:31.266Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 32 (round 8)
- Player: 陸小鳳 (player-2), level 1, experience 10, at (4, 4), health 24, stamina 0
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-8-player-2-36",
      "round": 8,
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
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:14:31.271Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 33 (round 9)
- Player: 陸小鳳 (player-2), level 1, experience 10, at (4, 4), health 24, stamina 10
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-8-nest-creature-1-37",
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
      "createdAt": "2026-09-01T19:14:31.272Z"
    },
    {
      "id": "action-9-player-2-38",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T19:14:31.272Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 34 (round 9)
- Player: 陸小鳳 (player-2), level 1, experience 10, at (4, 5), health 24, stamina 5
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
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
          "column": 5
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:14:31.277Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 35 (round 9)
- Player: 陸小鳳 (player-2), level 1, experience 10, at (3, 5), health 24, stamina 3
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
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
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 3,
          "column": 5
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:14:31.282Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 36 (round 9)
- Player: 陸小鳳 (player-2), level 1, experience 10, at (2, 5), health 24, stamina 1
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-9-player-2-41",
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
          "row": 2,
          "column": 5
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.288Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 37 (round 10)
- Player: 陸小鳳 (player-2), level 1, experience 12, at (2, 5), health 24, stamina 10
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-9-nest-creature-1-42",
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
      "createdAt": "2026-09-01T19:14:31.291Z"
    },
    {
      "id": "action-10-player-2-43",
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
      "createdAt": "2026-09-01T19:14:31.291Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 38 (round 10)
- Player: 陸小鳳 (player-2), level 1, experience 12, at (2, 4), health 24, stamina 8
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
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
          "column": 4
        },
        "reason": "收集道具：移動到道具位置"
      },
      "result": "succeeded",
      "reason": "收集道具：移動到道具位置",
      "createdAt": "2026-09-01T19:14:31.298Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 39 (round 10)
- Player: 陸小鳳 (player-2), level 1, experience 12, at (2, 4), health 24, stamina 8
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
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
      "createdAt": "2026-09-01T19:14:31.303Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 40 (round 10)
- Player: 陸小鳳 (player-2), level 1, experience 12, at (2, 4), health 24, stamina 8
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
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
      "createdAt": "2026-09-01T19:14:31.308Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 41 (round 10)
- Player: 陸小鳳 (player-2), level 1, experience 12, at (2, 3), health 24, stamina 6
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-10-player-2-47",
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
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.313Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 42 (round 10)
- Player: 陸小鳳 (player-2), level 1, experience 12, at (3, 3), health 24, stamina 4
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-10-player-2-48",
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
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.317Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 43 (round 10)
- Player: 陸小鳳 (player-2), level 1, experience 12, at (4, 3), health 24, stamina 2
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-10-player-2-49",
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
          "row": 4,
          "column": 3
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.321Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 44 (round 10)
- Player: 陸小鳳 (player-2), level 1, experience 12, at (4, 3), health 24, stamina 0
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-10-player-2-50",
      "round": 10,
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
      "createdAt": "2026-09-01T19:14:31.323Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 45 (round 11)
- Player: 陸小鳳 (player-2), level 1, experience 12, at (4, 3), health 24, stamina 10
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-10-nest-creature-1-51",
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
      "createdAt": "2026-09-01T19:14:31.323Z"
    },
    {
      "id": "action-11-player-2-52",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T19:14:31.324Z"
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
      "spawnedRound": 11,
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

### Turn 46 (round 11)
- Player: 陸小鳳 (player-2), level 1, experience 12, at (4, 3), health 24, stamina 7
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-11-player-2-53",
      "round": 11,
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
      "createdAt": "2026-09-01T19:14:31.326Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 47 (round 11)
- Player: 陸小鳳 (player-2), level 1, experience 12, at (4, 2), health 24, stamina 5
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-11-player-2-54",
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
          "row": 4,
          "column": 2
        },
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:14:31.330Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 48 (round 11)
- Player: 陸小鳳 (player-2), level 1, experience 12, at (3, 2), health 24, stamina 3
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-11-player-2-55",
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
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:14:31.334Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 49 (round 11)
- Player: 陸小鳳 (player-2), level 1, experience 12, at (2, 2), health 24, stamina 1
- Attributes: armStrength=9, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-11-player-2-56",
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
          "row": 2,
          "column": 2
        },
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:14:31.339Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 50 (round 11)
- Player: 陸小鳳 (player-2), level 1, experience 12, at (2, 2), health 24, stamina 1
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-11-player-2-57",
      "round": 11,
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
        "instanceId": "equipment-player-2-f49dea52-4065-40c3-82de-b226f4d5c16b",
        "reason": "裝備：溫玉佩（accessory）"
      },
      "result": "succeeded",
      "reason": "裝備：溫玉佩（accessory）",
      "createdAt": "2026-09-01T19:14:31.342Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 51 (round 12)
- Player: 陸小鳳 (player-2), level 1, experience 14, at (2, 2), health 24, stamina 10
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-11-nest-creature-1-58",
      "round": 11,
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
      "createdAt": "2026-09-01T19:14:31.344Z"
    },
    {
      "id": "action-11-nest-creature-2-59",
      "round": 11,
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
      "createdAt": "2026-09-01T19:14:31.344Z"
    },
    {
      "id": "action-12-player-2-60",
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
      "createdAt": "2026-09-01T19:14:31.344Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 52 (round 12)
- Player: 陸小鳳 (player-2), level 1, experience 14, at (2, 2), health 24, stamina 8
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-12-player-2-61",
      "round": 12,
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
          "id": "resource-point-3",
          "kind": "resource",
          "position": {
            "row": 2,
            "column": 3
          }
        },
        "reason": "建設：採集建料"
      },
      "result": "succeeded",
      "reason": "建設：採集建料",
      "createdAt": "2026-09-01T19:14:31.349Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 53 (round 12)
- Player: 陸小鳳 (player-2), level 1, experience 14, at (2, 1), health 24, stamina 6
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-12-player-2-62",
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
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.354Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 54 (round 12)
- Player: 陸小鳳 (player-2), level 1, experience 14, at (3, 1), health 24, stamina 4
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-12-player-2-63",
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
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.359Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 55 (round 12)
- Player: 陸小鳳 (player-2), level 1, experience 14, at (3, 2), health 24, stamina 2
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-12-player-2-64",
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
          "column": 2
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.363Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 56 (round 12)
- Player: 陸小鳳 (player-2), level 1, experience 14, at (3, 3), health 24, stamina 0
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-12-player-2-65",
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
          "column": 3
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.367Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 57 (round 13)
- Player: 陸小鳳 (player-2), level 1, experience 14, at (3, 3), health 24, stamina 10
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-12-nest-creature-1-66",
      "round": 12,
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
      "createdAt": "2026-09-01T19:14:31.367Z"
    },
    {
      "id": "action-12-nest-creature-2-67",
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
          "row": 4,
          "column": 11
        },
        "reason": "移動接近 item-point-8。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-8。",
      "createdAt": "2026-09-01T19:14:31.367Z"
    },
    {
      "id": "action-13-player-2-68",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T19:14:31.367Z"
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

### Turn 58 (round 13)
- Player: 陸小鳳 (player-2), level 1, experience 14, at (2, 3), health 24, stamina 8
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-13-player-2-69",
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
          "column": 3
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.371Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 59 (round 13)
- Player: 陸小鳳 (player-2), level 1, experience 14, at (2, 4), health 24, stamina 6
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-13-player-2-70",
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
          "column": 4
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.376Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 60 (round 13)
- Player: 陸小鳳 (player-2), level 1, experience 14, at (3, 4), health 24, stamina 1
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-13-player-2-71",
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
          "row": 3,
          "column": 4
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.381Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 61 (round 14)
- Player: 陸小鳳 (player-2), level 1, experience 16, at (3, 4), health 24, stamina 10
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-13-nest-creature-1-72",
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
      "createdAt": "2026-09-01T19:14:31.384Z"
    },
    {
      "id": "action-13-nest-creature-2-73",
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
          "column": 10
        },
        "reason": "移動接近 item-point-10。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-10。",
      "createdAt": "2026-09-01T19:14:31.384Z"
    },
    {
      "id": "action-14-player-2-74",
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
      "createdAt": "2026-09-01T19:14:31.384Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 62 (round 14)
- Player: 陸小鳳 (player-2), level 1, experience 16, at (4, 4), health 24, stamina 5
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-14-player-2-75",
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
          "row": 4,
          "column": 4
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.389Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 63 (round 14)
- Player: 陸小鳳 (player-2), level 1, experience 16, at (4, 3), health 24, stamina 3
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-14-player-2-76",
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
          "row": 4,
          "column": 3
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.393Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 64 (round 14)
- Player: 陸小鳳 (player-2), level 1, experience 16, at (4, 3), health 24, stamina 0
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-14-player-2-77",
      "round": 14,
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
        "buildingType": "building-type-item-shop",
        "reason": "建設：建造 道具商店"
      },
      "result": "succeeded",
      "reason": "建設：建造 道具商店",
      "createdAt": "2026-09-01T19:14:31.395Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 65 (round 15)
- Player: 陸小鳳 (player-2), level 1, experience 16, at (4, 3), health 24, stamina 10
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-14-nest-creature-1-78",
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
      "createdAt": "2026-09-01T19:14:31.395Z"
    },
    {
      "id": "action-14-nest-creature-2-79",
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
          "column": 13
        },
        "reason": "移動接近 item-point-4。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-4。",
      "createdAt": "2026-09-01T19:14:31.395Z"
    },
    {
      "id": "action-15-player-2-80",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T19:14:31.396Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 66 (round 15)
- Player: 陸小鳳 (player-2), level 1, experience 16, at (4, 2), health 24, stamina 8
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-15-player-2-81",
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
          "row": 4,
          "column": 2
        },
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:14:31.402Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 67 (round 15)
- Player: 陸小鳳 (player-2), level 1, experience 16, at (4, 1), health 24, stamina 3
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-15-player-2-82",
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
          "row": 4,
          "column": 1
        },
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:14:31.407Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 68 (round 15)
- Player: 陸小鳳 (player-2), level 1, experience 16, at (3, 1), health 24, stamina 1
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-15-player-2-83",
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
          "row": 3,
          "column": 1
        },
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:14:31.413Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 69 (round 16)
- Player: 陸小鳳 (player-2), level 1, experience 18, at (3, 1), health 24, stamina 10
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-15-nest-creature-1-84",
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
      "createdAt": "2026-09-01T19:14:31.416Z"
    },
    {
      "id": "action-15-nest-creature-2-85",
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
          "row": 3,
          "column": 13
        },
        "reason": "移動接近 item-point-11。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-11。",
      "createdAt": "2026-09-01T19:14:31.416Z"
    },
    {
      "id": "action-16-player-2-86",
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
      "createdAt": "2026-09-01T19:14:31.416Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 70 (round 16)
- Player: 陸小鳳 (player-2), level 1, experience 18, at (3, 2), health 24, stamina 8
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-87",
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
          "row": 3,
          "column": 2
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.422Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 71 (round 16)
- Player: 陸小鳳 (player-2), level 1, experience 18, at (3, 3), health 24, stamina 6
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-88",
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
          "row": 3,
          "column": 3
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.427Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 72 (round 16)
- Player: 陸小鳳 (player-2), level 1, experience 18, at (2, 3), health 24, stamina 4
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-89",
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
          "column": 3
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.432Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 73 (round 16)
- Player: 陸小鳳 (player-2), level 1, experience 18, at (2, 2), health 24, stamina 2
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-90",
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
          "column": 2
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.439Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 74 (round 16)
- Player: 陸小鳳 (player-2), level 1, experience 18, at (2, 1), health 24, stamina 0
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-91",
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
          "column": 1
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.445Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 75 (round 17)
- Player: 陸小鳳 (player-2), level 1, experience 18, at (2, 1), health 24, stamina 10
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-16-nest-creature-1-92",
      "round": 16,
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
      "createdAt": "2026-09-01T19:14:31.446Z"
    },
    {
      "id": "action-16-nest-creature-2-93",
      "round": 16,
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
      "createdAt": "2026-09-01T19:14:31.446Z"
    },
    {
      "id": "action-17-player-2-94",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T19:14:31.446Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 76 (round 17)
- Player: 陸小鳳 (player-2), level 1, experience 18, at (1, 1), health 24, stamina 8
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-17-player-2-95",
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
          "column": 1
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.453Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 77 (round 17)
- Player: 陸小鳳 (player-2), level 1, experience 18, at (2, 1), health 24, stamina 6
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-17-player-2-96",
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
          "column": 1
        },
        "reason": "定位：前往出口 (2,1)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (2,1)",
      "createdAt": "2026-09-01T19:14:31.461Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 78 (round 17)
- Player: 陸小鳳 (player-2), level 1, experience 18, at (2, 2), health 24, stamina 4
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-17-player-2-97",
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
          "column": 2
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.467Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 79 (round 17)
- Player: 陸小鳳 (player-2), level 1, experience 18, at (2, 3), health 24, stamina 2
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-17-player-2-98",
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
          "column": 3
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.472Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 80 (round 17)
- Player: 陸小鳳 (player-2), level 1, experience 18, at (2, 4), health 24, stamina 0
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-17-player-2-99",
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
          "column": 4
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.478Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 81 (round 18)
- Player: 陸小鳳 (player-2), level 1, experience 18, at (2, 4), health 24, stamina 10
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-17-nest-creature-1-100",
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
      "createdAt": "2026-09-01T19:14:31.478Z"
    },
    {
      "id": "action-17-nest-creature-2-101",
      "round": 17,
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
          "column": 13
        },
        "reason": "移動接近 item-point-17。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-17。",
      "createdAt": "2026-09-01T19:14:31.478Z"
    },
    {
      "id": "action-18-player-2-102",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T19:14:31.478Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 82 (round 18)
- Player: 陸小鳳 (player-2), level 1, experience 18, at (3, 4), health 24, stamina 5
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-18-player-2-103",
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
          "row": 3,
          "column": 4
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.485Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 83 (round 18)
- Player: 陸小鳳 (player-2), level 1, experience 18, at (3, 3), health 24, stamina 3
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-18-player-2-104",
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
          "row": 3,
          "column": 3
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.490Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 84 (round 18)
- Player: 陸小鳳 (player-2), level 1, experience 18, at (4, 3), health 24, stamina 1
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-18-player-2-105",
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
          "column": 3
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.494Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 85 (round 19)
- Player: 陸小鳳 (player-2), level 1, experience 20, at (4, 3), health 24, stamina 10
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-18-nest-creature-1-106",
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
      "createdAt": "2026-09-01T19:14:31.496Z"
    },
    {
      "id": "action-18-nest-creature-2-107",
      "round": 18,
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
      "createdAt": "2026-09-01T19:14:31.496Z"
    },
    {
      "id": "action-19-player-2-108",
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
      "createdAt": "2026-09-01T19:14:31.497Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-2",
      "creatureName": "生物巢穴 1的怪物 Lv.2",
      "message": "生物巢穴 1的怪物 Lv.2 吃掉了道具點。"
    },
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
        "row": 1,
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
      "spawnedRound": 19,
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

### Turn 86 (round 19)
- Player: 陸小鳳 (player-2), level 1, experience 20, at (4, 3), health 24, stamina 7
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-19-player-2-109",
      "round": 19,
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
        "buildingType": "building-type-infirmary",
        "reason": "建設：建造 醫療室"
      },
      "result": "succeeded",
      "reason": "建設：建造 醫療室",
      "createdAt": "2026-09-01T19:14:31.499Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 87 (round 19)
- Player: 陸小鳳 (player-2), level 1, experience 20, at (4, 2), health 24, stamina 5
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-19-player-2-110",
      "round": 19,
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
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:14:31.503Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 88 (round 19)
- Player: 陸小鳳 (player-2), level 1, experience 20, at (3, 2), health 24, stamina 3
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-19-player-2-111",
      "round": 19,
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
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:14:31.508Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 89 (round 19)
- Player: 陸小鳳 (player-2), level 1, experience 20, at (3, 1), health 24, stamina 1
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-19-player-2-112",
      "round": 19,
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
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:14:31.514Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 90 (round 20)
- Player: 陸小鳳 (player-2), level 1, experience 22, at (3, 1), health 24, stamina 10
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-19-nest-creature-1-113",
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
      "createdAt": "2026-09-01T19:14:31.517Z"
    },
    {
      "id": "action-19-nest-creature-2-114",
      "round": 19,
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
      "createdAt": "2026-09-01T19:14:31.517Z"
    },
    {
      "id": "action-19-nest-creature-3-115",
      "round": 19,
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
      "createdAt": "2026-09-01T19:14:31.517Z"
    },
    {
      "id": "action-20-player-2-116",
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
      "createdAt": "2026-09-01T19:14:31.517Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 91 (round 20)
- Player: 陸小鳳 (player-2), level 1, experience 22, at (4, 1), health 24, stamina 5
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-20-player-2-117",
      "round": 20,
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
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.522Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 92 (round 20)
- Player: 陸小鳳 (player-2), level 1, experience 22, at (5, 1), health 24, stamina 0
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-20-player-2-118",
      "round": 20,
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
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.526Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 93 (round 21)
- Player: 陸小鳳 (player-2), level 1, experience 22, at (5, 1), health 24, stamina 10
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-20-nest-creature-1-119",
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
      "createdAt": "2026-09-01T19:14:31.526Z"
    },
    {
      "id": "action-20-nest-creature-2-120",
      "round": 20,
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
          "column": 10
        },
        "reason": "移動接近 item-point-14。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-14。",
      "createdAt": "2026-09-01T19:14:31.527Z"
    },
    {
      "id": "action-20-nest-creature-3-121",
      "round": 20,
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
      "createdAt": "2026-09-01T19:14:31.527Z"
    },
    {
      "id": "action-21-player-2-122",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T19:14:31.527Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 94 (round 21)
- Player: 陸小鳳 (player-2), level 1, experience 22, at (6, 1), health 24, stamina 8
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-21-player-2-123",
      "round": 21,
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
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.532Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 95 (round 21)
- Player: 陸小鳳 (player-2), level 1, experience 22, at (6, 2), health 24, stamina 6
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-21-player-2-124",
      "round": 21,
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
      "createdAt": "2026-09-01T19:14:31.538Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 96 (round 21)
- Player: 陸小鳳 (player-2), level 1, experience 22, at (6, 3), health 24, stamina 1
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-21-player-2-125",
      "round": 21,
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
      "createdAt": "2026-09-01T19:14:31.543Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 97 (round 22)
- Player: 陸小鳳 (player-2), level 1, experience 24, at (6, 3), health 24, stamina 10
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-21-nest-creature-1-126",
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
      "createdAt": "2026-09-01T19:14:31.545Z"
    },
    {
      "id": "action-21-nest-creature-2-127",
      "round": 21,
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
      "createdAt": "2026-09-01T19:14:31.545Z"
    },
    {
      "id": "action-21-nest-creature-3-128",
      "round": 21,
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
      "createdAt": "2026-09-01T19:14:31.545Z"
    },
    {
      "id": "action-22-player-2-129",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T19:14:31.545Z"
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

### Turn 98 (round 22)
- Player: 陸小鳳 (player-2), level 1, experience 24, at (6, 4), health 24, stamina 5
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-22-player-2-130",
      "round": 22,
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
      "createdAt": "2026-09-01T19:14:31.551Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 99 (round 22)
- Player: 陸小鳳 (player-2), level 1, experience 24, at (6, 5), health 24, stamina 2
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-22-player-2-131",
      "round": 22,
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
      "createdAt": "2026-09-01T19:14:31.557Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 100 (round 23)
- Player: 陸小鳳 (player-2), level 1, experience 28, at (6, 5), health 24, stamina 10
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-22-nest-creature-1-132",
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
      "createdAt": "2026-09-01T19:14:31.559Z"
    },
    {
      "id": "action-22-nest-creature-2-133",
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
      "createdAt": "2026-09-01T19:14:31.559Z"
    },
    {
      "id": "action-22-nest-creature-3-134",
      "round": 22,
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
      "createdAt": "2026-09-01T19:14:31.559Z"
    },
    {
      "id": "action-23-player-2-135",
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
      "createdAt": "2026-09-01T19:14:31.559Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 101 (round 23)
- Player: 陸小鳳 (player-2), level 1, experience 28, at (6, 6), health 24, stamina 5
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-23-player-2-136",
      "round": 23,
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
          "column": 6
        },
        "reason": "收集道具：移動到道具位置"
      },
      "result": "succeeded",
      "reason": "收集道具：移動到道具位置",
      "createdAt": "2026-09-01T19:14:31.571Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 102 (round 23)
- Player: 陸小鳳 (player-2), level 1, experience 28, at (6, 6), health 24, stamina 5
- Attributes: armStrength=11, constitution=8, agility=9, innerEnergy=9, insight=9
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-23-player-2-137",
      "round": 23,
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
          "id": "item-point-13",
          "kind": "item",
          "position": {
            "row": 6,
            "column": 6
          }
        },
        "reason": "收集道具：拾取"
      },
      "result": "succeeded",
      "reason": "收集道具：拾取",
      "createdAt": "2026-09-01T19:14:31.579Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 103 (round 23)
- Player: 陸小鳳 (player-2), level 1, experience 28, at (6, 6), health 24, stamina 5
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-23-player-2-138",
      "round": 23,
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
        "instanceId": "equipment-player-2-49b36dea-7a05-4522-bef8-ab175c7aae89",
        "reason": "裝備：神兵天劍（weapon）"
      },
      "result": "succeeded",
      "reason": "裝備：神兵天劍（weapon）",
      "createdAt": "2026-09-01T19:14:31.590Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 104 (round 23)
- Player: 陸小鳳 (player-2), level 1, experience 28, at (6, 7), health 24, stamina 3
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-23-player-2-139",
      "round": 23,
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
          "column": 7
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.601Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 105 (round 23)
- Player: 陸小鳳 (player-2), level 1, experience 28, at (7, 7), health 24, stamina 1
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-23-player-2-140",
      "round": 23,
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
          "column": 7
        },
        "reason": "收集道具：移動到道具位置"
      },
      "result": "succeeded",
      "reason": "收集道具：移動到道具位置",
      "createdAt": "2026-09-01T19:14:31.610Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 106 (round 23)
- Player: 陸小鳳 (player-2), level 1, experience 28, at (7, 7), health 24, stamina 1
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-23-player-2-141",
      "round": 23,
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
          "id": "item-point-7",
          "kind": "item",
          "position": {
            "row": 7,
            "column": 7
          }
        },
        "reason": "收集道具：拾取"
      },
      "result": "succeeded",
      "reason": "收集道具：拾取",
      "createdAt": "2026-09-01T19:14:31.613Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 107 (round 24)
- Player: 陸小鳳 (player-2), level 1, experience 30, at (7, 7), health 24, stamina 14
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-23-nest-creature-1-142",
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
      "createdAt": "2026-09-01T19:14:31.617Z"
    },
    {
      "id": "action-23-nest-creature-2-143",
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
          "row": 7,
          "column": 8
        },
        "reason": "移動接近 item-point-6。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-6。",
      "createdAt": "2026-09-01T19:14:31.617Z"
    },
    {
      "id": "action-23-nest-creature-3-144",
      "round": 23,
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
      "createdAt": "2026-09-01T19:14:31.617Z"
    },
    {
      "id": "action-24-player-2-145",
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
      "createdAt": "2026-09-01T19:14:31.617Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 108 (round 24)
- Player: 陸小鳳 (player-2), level 1, experience 30, at (7, 6), health 24, stamina 9
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-146",
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
          "row": 7,
          "column": 6
        },
        "reason": "收集道具：移動到道具位置"
      },
      "result": "succeeded",
      "reason": "收集道具：移動到道具位置",
      "createdAt": "2026-09-01T19:14:31.627Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 109 (round 24)
- Player: 陸小鳳 (player-2), level 1, experience 30, at (7, 6), health 24, stamina 9
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-147",
      "round": 24,
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
          "id": "item-point-6",
          "kind": "item",
          "position": {
            "row": 7,
            "column": 6
          }
        },
        "reason": "收集道具：拾取"
      },
      "result": "succeeded",
      "reason": "收集道具：拾取",
      "createdAt": "2026-09-01T19:14:31.635Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 110 (round 24)
- Player: 陸小鳳 (player-2), level 1, experience 30, at (7, 5), health 24, stamina 4
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-148",
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
          "row": 7,
          "column": 5
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:14:31.643Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 111 (round 24)
- Player: 陸小鳳 (player-2), level 1, experience 30, at (7, 4), health 24, stamina 2
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-149",
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
          "row": 7,
          "column": 4
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.650Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 112 (round 25)
- Player: 陸小鳳 (player-2), level 1, experience 34, at (7, 4), health 24, stamina 14
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-24-nest-creature-1-150",
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
      "createdAt": "2026-09-01T19:14:31.653Z"
    },
    {
      "id": "action-24-nest-creature-2-151",
      "round": 24,
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T19:14:31.653Z"
    },
    {
      "id": "action-24-nest-creature-3-152",
      "round": 24,
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
      "createdAt": "2026-09-01T19:14:31.653Z"
    },
    {
      "id": "action-25-player-2-153",
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
      "createdAt": "2026-09-01T19:14:31.654Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 113 (round 25)
- Player: 陸小鳳 (player-2), level 1, experience 37, at (7, 4), health 24, stamina 9
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-25-player-2-154",
      "round": 25,
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
          "id": "nest-creature-2",
          "kind": "creature",
          "position": {
            "row": 7,
            "column": 5
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.2"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.2",
      "createdAt": "2026-09-01T19:14:31.663Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 114 (round 25)
- Player: 陸小鳳 (player-2), level 1, experience 40, at (7, 4), health 24, stamina 4
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-25-player-2-155",
      "round": 25,
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
          "id": "nest-creature-2",
          "kind": "creature",
          "position": {
            "row": 7,
            "column": 5
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.2"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.2",
      "createdAt": "2026-09-01T19:14:31.673Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 115 (round 25)
- Player: 陸小鳳 (player-2), level 1, experience 40, at (8, 4), health 24, stamina 2
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-25-player-2-156",
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
          "row": 8,
          "column": 4
        },
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:14:31.680Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 116 (round 25)
- Player: 陸小鳳 (player-2), level 1, experience 40, at (8, 3), health 24, stamina 0
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-25-player-2-157",
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
          "row": 8,
          "column": 3
        },
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:14:31.688Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 117 (round 26)
- Player: 陸小鳳 (player-2), level 1, experience 40, at (8, 3), health 24, stamina 14
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-25-nest-creature-1-158",
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
      "createdAt": "2026-09-01T19:14:31.688Z"
    },
    {
      "id": "action-25-nest-creature-2-159",
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
          "row": 9,
          "column": 4
        },
        "reason": "移動接近 item-point-20。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-20。",
      "createdAt": "2026-09-01T19:14:31.688Z"
    },
    {
      "id": "action-25-nest-creature-3-160",
      "round": 25,
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
      "createdAt": "2026-09-01T19:14:31.688Z"
    },
    {
      "id": "action-26-player-2-161",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T19:14:31.688Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 118 (round 26)
- Player: 陸小鳳 (player-2), level 1, experience 40, at (8, 2), health 24, stamina 12
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-162",
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
          "row": 8,
          "column": 2
        },
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:14:31.698Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 119 (round 26)
- Player: 陸小鳳 (player-2), level 1, experience 40, at (8, 1), health 24, stamina 10
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-163",
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
          "row": 8,
          "column": 1
        },
        "reason": "收集道具：移動到道具位置"
      },
      "result": "succeeded",
      "reason": "收集道具：移動到道具位置",
      "createdAt": "2026-09-01T19:14:31.708Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 120 (round 26)
- Player: 陸小鳳 (player-2), level 1, experience 40, at (8, 1), health 24, stamina 10
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-164",
      "round": 26,
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
      "createdAt": "2026-09-01T19:14:31.715Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 121 (round 26)
- Player: 陸小鳳 (player-2), level 1, experience 40, at (7, 1), health 24, stamina 8
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-165",
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
          "row": 7,
          "column": 1
        },
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:14:31.723Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 122 (round 26)
- Player: 陸小鳳 (player-2), level 1, experience 40, at (6, 1), health 24, stamina 6
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-166",
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
          "row": 6,
          "column": 1
        },
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:14:31.730Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 123 (round 26)
- Player: 陸小鳳 (player-2), level 1, experience 40, at (6, 2), health 24, stamina 4
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-167",
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
          "row": 6,
          "column": 2
        },
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:14:31.737Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 124 (round 26)
- Player: 陸小鳳 (player-2), level 1, experience 40, at (7, 2), health 24, stamina 2
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-168",
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
          "row": 7,
          "column": 2
        },
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:14:31.744Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 125 (round 26)
- Player: 陸小鳳 (player-2), level 1, experience 40, at (6, 2), health 24, stamina 0
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-169",
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
          "row": 6,
          "column": 2
        },
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:14:31.751Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 126 (round 27)
- Player: 陸小鳳 (player-2), level 1, experience 40, at (6, 2), health 24, stamina 14
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-nest-creature-1-170",
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
      "createdAt": "2026-09-01T19:14:31.752Z"
    },
    {
      "id": "action-26-nest-creature-2-171",
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
          "row": 10,
          "column": 4
        },
        "reason": "移動接近 item-point-20。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-20。",
      "createdAt": "2026-09-01T19:14:31.752Z"
    },
    {
      "id": "action-26-nest-creature-3-172",
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
      "createdAt": "2026-09-01T19:14:31.752Z"
    },
    {
      "id": "action-27-player-2-173",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T19:14:31.752Z"
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

### Turn 127 (round 27)
- Player: 陸小鳳 (player-2), level 1, experience 40, at (6, 3), health 24, stamina 9
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-27-player-2-174",
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
          "row": 6,
          "column": 3
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.757Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 128 (round 27)
- Player: 陸小鳳 (player-2), level 1, experience 40, at (6, 4), health 24, stamina 4
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-27-player-2-175",
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
          "row": 6,
          "column": 4
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:14:31.762Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 129 (round 27)
- Player: 陸小鳳 (player-2), level 1, experience 40, at (7, 4), health 24, stamina 2
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-27-player-2-176",
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
          "row": 7,
          "column": 4
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.767Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 130 (round 27)
- Player: 陸小鳳 (player-2), level 1, experience 40, at (8, 4), health 24, stamina 0
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-27-player-2-177",
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
          "row": 8,
          "column": 4
        },
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.2（hitsSurvivable=3.4285714285714284）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.2（hitsSurvivable=3.4285714285714284）",
      "createdAt": "2026-09-01T19:14:31.772Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 131 (round 28)
- Player: 陸小鳳 (player-2), level 1, experience 40, at (8, 4), health 24, stamina 14
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-27-nest-creature-1-178",
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
      "createdAt": "2026-09-01T19:14:31.773Z"
    },
    {
      "id": "action-27-nest-creature-2-179",
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
          "row": 9,
          "column": 4
        },
        "reason": "移動接近 item-point-1。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-1。",
      "createdAt": "2026-09-01T19:14:31.773Z"
    },
    {
      "id": "action-27-nest-creature-3-180",
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
      "createdAt": "2026-09-01T19:14:31.773Z"
    },
    {
      "id": "action-28-player-2-181",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T19:14:31.773Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 132 (round 28)
- Player: 陸小鳳 (player-2), level 2, experience 30, at (8, 4), health 24, stamina 9
- Attributes: armStrength=19, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: -10 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: nest-creature-2
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-28-player-2-182",
      "round": 28,
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
          "id": "nest-creature-2",
          "kind": "creature",
          "position": {
            "row": 9,
            "column": 4
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.2"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.2",
      "createdAt": "2026-09-01T19:14:31.783Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 133 (round 28)
- Player: 陸小鳳 (player-2), level 2, experience 30, at (8, 4), health 24, stamina 9
- Attributes: armStrength=20, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 14
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-28-player-2-183",
      "round": 28,
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
      "createdAt": "2026-09-01T19:14:31.795Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 134 (round 28)
- Player: 陸小鳳 (player-2), level 2, experience 30, at (8, 4), health 24, stamina 9
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-28-player-2-184",
      "round": 28,
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
      "createdAt": "2026-09-01T19:14:31.806Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 135 (round 28)
- Player: 陸小鳳 (player-2), level 2, experience 30, at (8, 5), health 24, stamina 4
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-28-player-2-185",
      "round": 28,
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
          "column": 5
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T19:14:31.818Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 136 (round 28)
- Player: 陸小鳳 (player-2), level 2, experience 30, at (9, 5), health 24, stamina 2
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-28-player-2-186",
      "round": 28,
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
          "column": 5
        },
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:14:31.826Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 137 (round 28)
- Player: 陸小鳳 (player-2), level 2, experience 30, at (9, 4), health 24, stamina 0
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-28-player-2-187",
      "round": 28,
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
          "column": 4
        },
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:14:31.834Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 138 (round 29)
- Player: 陸小鳳 (player-2), level 2, experience 30, at (9, 4), health 24, stamina 15
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-28-nest-creature-1-188",
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
      "createdAt": "2026-09-01T19:14:31.834Z"
    },
    {
      "id": "action-28-nest-creature-3-189",
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
      "createdAt": "2026-09-01T19:14:31.834Z"
    },
    {
      "id": "action-29-player-2-190",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T19:14:31.834Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 139 (round 29)
- Player: 陸小鳳 (player-2), level 2, experience 30, at (9, 3), health 24, stamina 13
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-29-player-2-191",
      "round": 29,
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
          "column": 3
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T19:14:31.845Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 140 (round 29)
- Player: 陸小鳳 (player-2), level 2, experience 30, at (8, 3), health 24, stamina 11
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-29-player-2-192",
      "round": 29,
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
      "createdAt": "2026-09-01T19:14:31.854Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 141 (round 29)
- Player: 陸小鳳 (player-2), level 2, experience 30, at (8, 2), health 24, stamina 9
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-29-player-2-193",
      "round": 29,
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
      "createdAt": "2026-09-01T19:14:31.862Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 142 (round 29)
- Player: 陸小鳳 (player-2), level 2, experience 30, at (7, 2), health 24, stamina 7
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-29-player-2-194",
      "round": 29,
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
      "createdAt": "2026-09-01T19:14:31.870Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 143 (round 29)
- Player: 陸小鳳 (player-2), level 2, experience 30, at (6, 2), health 24, stamina 5
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-29-player-2-195",
      "round": 29,
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
      "createdAt": "2026-09-01T19:14:31.877Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 144 (round 29)
- Player: 陸小鳳 (player-2), level 2, experience 30, at (6, 1), health 24, stamina 3
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-29-player-2-196",
      "round": 29,
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
      "createdAt": "2026-09-01T19:14:31.884Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 145 (round 29)
- Player: 陸小鳳 (player-2), level 2, experience 30, at (7, 1), health 24, stamina 1
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-29-player-2-197",
      "round": 29,
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
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.888Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 146 (round 30)
- Player: 陸小鳳 (player-2), level 2, experience 32, at (7, 1), health 24, stamina 15
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-29-nest-creature-1-198",
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
      "createdAt": "2026-09-01T19:14:31.890Z"
    },
    {
      "id": "action-29-nest-creature-3-199",
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
      "createdAt": "2026-09-01T19:14:31.890Z"
    },
    {
      "id": "action-30-player-2-200",
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
      "createdAt": "2026-09-01T19:14:31.890Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 147 (round 30)
- Player: 陸小鳳 (player-2), level 2, experience 32, at (8, 1), health 24, stamina 13
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-30-player-2-201",
      "round": 30,
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
      "createdAt": "2026-09-01T19:14:31.900Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 148 (round 30)
- Player: 陸小鳳 (player-2), level 2, experience 32, at (9, 1), health 24, stamina 8
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-30-player-2-202",
      "round": 30,
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
      "createdAt": "2026-09-01T19:14:31.911Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 149 (round 30)
- Player: 陸小鳳 (player-2), level 2, experience 32, at (10, 1), health 24, stamina 6
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-30-player-2-203",
      "round": 30,
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
      "createdAt": "2026-09-01T19:14:31.922Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 150 (round 30)
- Player: 陸小鳳 (player-2), level 2, experience 32, at (11, 1), health 24, stamina 4
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-30-player-2-204",
      "round": 30,
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
          "row": 11,
          "column": 1
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T19:14:31.933Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 151 (round 30)
- Player: 陸小鳳 (player-2), level 2, experience 32, at (10, 1), health 24, stamina 2
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-30-player-2-205",
      "round": 30,
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
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:31.941Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 152 (round 30)
- Player: 陸小鳳 (player-2), level 2, experience 32, at (11, 1), health 24, stamina 0
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-30-player-2-206",
      "round": 30,
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
          "row": 11,
          "column": 1
        },
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:14:31.949Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 153 (round 31)
- Player: 陸小鳳 (player-2), level 2, experience 32, at (11, 1), health 24, stamina 15
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-30-nest-creature-1-207",
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
      "createdAt": "2026-09-01T19:14:31.950Z"
    },
    {
      "id": "action-30-nest-creature-3-208",
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
      "createdAt": "2026-09-01T19:14:31.950Z"
    },
    {
      "id": "action-31-player-2-209",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T19:14:31.950Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 154 (round 31)
- Player: 陸小鳳 (player-2), level 2, experience 32, at (11, 2), health 24, stamina 10
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-31-player-2-210",
      "round": 31,
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
          "row": 11,
          "column": 2
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T19:14:31.958Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 155 (round 31)
- Player: 陸小鳳 (player-2), level 2, experience 32, at (10, 2), health 24, stamina 7
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-31-player-2-211",
      "round": 31,
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
          "column": 2
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T19:14:31.968Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 156 (round 31)
- Player: 陸小鳳 (player-2), level 2, experience 32, at (10, 3), health 24, stamina 2
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-31-player-2-212",
      "round": 31,
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
          "column": 3
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T19:14:31.975Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 157 (round 32)
- Player: 陸小鳳 (player-2), level 2, experience 36, at (10, 3), health 24, stamina 15
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-31-nest-creature-1-213",
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
      "createdAt": "2026-09-01T19:14:31.978Z"
    },
    {
      "id": "action-31-nest-creature-3-214",
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
      "createdAt": "2026-09-01T19:14:31.978Z"
    },
    {
      "id": "action-32-player-2-215",
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
      "createdAt": "2026-09-01T19:14:31.978Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 158 (round 32)
- Player: 陸小鳳 (player-2), level 2, experience 36, at (9, 3), health 24, stamina 13
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-32-player-2-216",
      "round": 32,
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
          "column": 3
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T19:14:31.988Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 159 (round 32)
- Player: 陸小鳳 (player-2), level 2, experience 36, at (8, 3), health 24, stamina 11
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-32-player-2-217",
      "round": 32,
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
      "createdAt": "2026-09-01T19:14:31.997Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 160 (round 32)
- Player: 陸小鳳 (player-2), level 2, experience 36, at (8, 4), health 24, stamina 9
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-32-player-2-218",
      "round": 32,
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T19:14:32.007Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 161 (round 32)
- Player: 陸小鳳 (player-2), level 2, experience 36, at (7, 4), health 24, stamina 7
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-32-player-2-219",
      "round": 32,
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
      "createdAt": "2026-09-01T19:14:32.015Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 162 (round 32)
- Player: 陸小鳳 (player-2), level 2, experience 36, at (6, 4), health 24, stamina 2
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-32-player-2-220",
      "round": 32,
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
      "createdAt": "2026-09-01T19:14:32.025Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 163 (round 33)
- Player: 陸小鳳 (player-2), level 2, experience 40, at (6, 4), health 24, stamina 15
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-32-nest-creature-1-221",
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
      "createdAt": "2026-09-01T19:14:32.028Z"
    },
    {
      "id": "action-32-nest-creature-3-222",
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
      "createdAt": "2026-09-01T19:14:32.028Z"
    },
    {
      "id": "action-33-player-2-223",
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
      "createdAt": "2026-09-01T19:14:32.028Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 164 (round 33)
- Player: 陸小鳳 (player-2), level 2, experience 40, at (6, 5), health 24, stamina 12
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-33-player-2-224",
      "round": 33,
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
      "createdAt": "2026-09-01T19:14:32.037Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 165 (round 33)
- Player: 陸小鳳 (player-2), level 2, experience 40, at (5, 5), health 24, stamina 7
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-33-player-2-225",
      "round": 33,
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
      "createdAt": "2026-09-01T19:14:32.045Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 166 (round 33)
- Player: 陸小鳳 (player-2), level 2, experience 40, at (5, 5), health 24, stamina 4
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-33-player-2-226",
      "round": 33,
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
        "skillType": "external",
        "skillId": "hundred-poison-external-damage",
        "reason": "學招：學習門派功法 腐骨爪"
      },
      "result": "succeeded",
      "reason": "學招：學習門派功法 腐骨爪",
      "createdAt": "2026-09-01T19:14:32.051Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 167 (round 33)
- Player: 陸小鳳 (player-2), level 2, experience 40, at (6, 5), health 24, stamina 1
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-33-player-2-227",
      "round": 33,
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
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:32.055Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 168 (round 34)
- Player: 陸小鳳 (player-2), level 2, experience 42, at (6, 5), health 24, stamina 15
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +2
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-33-nest-creature-1-228",
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
      "createdAt": "2026-09-01T19:14:32.057Z"
    },
    {
      "id": "action-33-nest-creature-3-229",
      "round": 33,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "destination": {
          "row": 8,
          "column": 13
        },
        "reason": "移動接近 item-point-19。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-19。",
      "createdAt": "2026-09-01T19:14:32.057Z"
    },
    {
      "id": "action-34-player-2-230",
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
      "createdAt": "2026-09-01T19:14:32.058Z"
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
      "id": "nest-creature-2",
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
      "spawnedRound": 34,
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

### Turn 169 (round 34)
- Player: 陸小鳳 (player-2), level 2, experience 42, at (6, 6), health 24, stamina 10
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-34-player-2-231",
      "round": 34,
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
          "column": 6
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:14:32.063Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 170 (round 34)
- Player: 陸小鳳 (player-2), level 2, experience 42, at (6, 6), health 24, stamina 7
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-34-player-2-232",
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
        "gateId": "sect-gate-3",
        "skillId": "hundred-poison-inner",
        "reason": "練功：練習功法 百毒納氣"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 百毒納氣",
      "createdAt": "2026-09-01T19:14:32.068Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 171 (round 34)
- Player: 陸小鳳 (player-2), level 2, experience 42, at (6, 6), health 24, stamina 4
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-34-player-2-233",
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
        "gateId": "sect-gate-3",
        "skillId": "hundred-poison-inner",
        "reason": "練功：練習功法 百毒納氣"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 百毒納氣",
      "createdAt": "2026-09-01T19:14:32.072Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 172 (round 34)
- Player: 陸小鳳 (player-2), level 2, experience 42, at (6, 7), health 24, stamina 2
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-34-player-2-234",
      "round": 34,
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
          "column": 7
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:32.076Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 173 (round 35)
- Player: 陸小鳳 (player-2), level 2, experience 46, at (6, 7), health 24, stamina 15
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-34-nest-creature-1-235",
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
      "createdAt": "2026-09-01T19:14:32.078Z"
    },
    {
      "id": "action-34-nest-creature-3-236",
      "round": 34,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "destination": {
          "row": 8,
          "column": 13
        },
        "reason": "移動接近 item-point-19。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-19。",
      "createdAt": "2026-09-01T19:14:32.078Z"
    },
    {
      "id": "action-34-nest-creature-2-237",
      "round": 34,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
      "createdAt": "2026-09-01T19:14:32.078Z"
    },
    {
      "id": "action-35-player-2-238",
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
      "createdAt": "2026-09-01T19:14:32.078Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 174 (round 35)
- Player: 陸小鳳 (player-2), level 2, experience 46, at (6, 8), health 24, stamina 13
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-35-player-2-239",
      "round": 35,
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
          "column": 8
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:14:32.084Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 175 (round 35)
- Player: 陸小鳳 (player-2), level 2, experience 46, at (5, 8), health 24, stamina 11
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-35-player-2-240",
      "round": 35,
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
          "column": 8
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:14:32.089Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 176 (round 35)
- Player: 陸小鳳 (player-2), level 2, experience 46, at (4, 8), health 24, stamina 9
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-35-player-2-241",
      "round": 35,
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
          "column": 8
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:14:32.094Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 177 (round 35)
- Player: 陸小鳳 (player-2), level 2, experience 46, at (4, 7), health 24, stamina 7
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-35-player-2-242",
      "round": 35,
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
          "column": 7
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:14:32.099Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 178 (round 35)
- Player: 陸小鳳 (player-2), level 2, experience 46, at (3, 7), health 24, stamina 5
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-35-player-2-243",
      "round": 35,
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
          "column": 7
        },
        "reason": "定位：前往出口 (3,7)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (3,7)",
      "createdAt": "2026-09-01T19:14:32.107Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 179 (round 35)
- Player: 陸小鳳 (player-2), level 2, experience 46, at (3, 6), health 24, stamina 0
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-35-player-2-244",
      "round": 35,
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
          "column": 6
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:14:32.114Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 180 (round 36)
- Player: 陸小鳳 (player-2), level 2, experience 46, at (3, 6), health 24, stamina 15
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-35-nest-creature-1-245",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T19:14:32.114Z"
    },
    {
      "id": "action-35-nest-creature-3-246",
      "round": 35,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "destination": {
          "row": 8,
          "column": 13
        },
        "reason": "移動接近 item-point-19。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-19。",
      "createdAt": "2026-09-01T19:14:32.114Z"
    },
    {
      "id": "action-35-nest-creature-2-247",
      "round": 35,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
      "createdAt": "2026-09-01T19:14:32.114Z"
    },
    {
      "id": "action-36-player-2-248",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T19:14:32.114Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 181 (round 36)
- Player: 陸小鳳 (player-2), level 2, experience 49, at (3, 6), health 24, stamina 10
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-36-player-2-249",
      "round": 36,
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
            "column": 7
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-01T19:14:32.122Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 182 (round 36)
- Player: 陸小鳳 (player-2), level 2, experience 52, at (3, 6), health 24, stamina 5
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-36-player-2-250",
      "round": 36,
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
            "column": 7
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-01T19:14:32.129Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 183 (round 36)
- Player: 陸小鳳 (player-2), level 2, experience 55, at (3, 6), health 24, stamina 0
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-36-player-2-251",
      "round": 36,
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
            "column": 7
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-01T19:14:32.137Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 184 (round 37)
- Player: 陸小鳳 (player-2), level 2, experience 55, at (3, 6), health 19.2, stamina 15
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-36-nest-creature-1-252",
      "round": 36,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.1"
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
            "row": 3,
            "column": 6
          }
        },
        "reason": "與 陸小鳳 交戰。"
      },
      "result": "succeeded",
      "reason": "與 陸小鳳 交戰。",
      "createdAt": "2026-09-01T19:14:32.137Z"
    },
    {
      "id": "action-36-nest-creature-3-253",
      "round": 36,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "destination": {
          "row": 8,
          "column": 13
        },
        "reason": "移動接近 item-point-19。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-19。",
      "createdAt": "2026-09-01T19:14:32.137Z"
    },
    {
      "id": "action-36-nest-creature-2-254",
      "round": 36,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
      "createdAt": "2026-09-01T19:14:32.137Z"
    },
    {
      "id": "action-37-player-2-255",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T19:14:32.138Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-1",
      "creatureName": "生物巢穴 1的怪物 Lv.1",
      "message": "生物巢穴 1的怪物 Lv.1 攻擊 陸小鳳，造成 6 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 185 (round 37)
- Player: 陸小鳳 (player-2), level 2, experience 75, at (3, 6), health 19.2, stamina 10
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: nest-creature-1
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-37-player-2-256",
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
            "column": 7
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-01T19:14:32.146Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 186 (round 37)
- Player: 陸小鳳 (player-2), level 2, experience 75, at (3, 5), health 19.2, stamina 8
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-37-player-2-257",
      "round": 37,
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
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:14:32.153Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 187 (round 37)
- Player: 陸小鳳 (player-2), level 2, experience 75, at (4, 5), health 19.2, stamina 3
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-37-player-2-258",
      "round": 37,
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
      "createdAt": "2026-09-01T19:14:32.160Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 188 (round 37)
- Player: 陸小鳳 (player-2), level 2, experience 75, at (3, 5), health 19.2, stamina 1
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-37-player-2-259",
      "round": 37,
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
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:14:32.164Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 189 (round 38)
- Player: 陸小鳳 (player-2), level 2, experience 77, at (3, 5), health 20.4, stamina 15
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-37-nest-creature-3-260",
      "round": 37,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "destination": {
          "row": 8,
          "column": 13
        },
        "reason": "移動接近 item-point-19。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-19。",
      "createdAt": "2026-09-01T19:14:32.167Z"
    },
    {
      "id": "action-37-nest-creature-2-261",
      "round": 37,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
      "createdAt": "2026-09-01T19:14:32.167Z"
    },
    {
      "id": "action-38-player-2-262",
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
      "createdAt": "2026-09-01T19:14:32.168Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 190 (round 38)
- Player: 陸小鳳 (player-2), level 2, experience 77, at (2, 5), health 20.4, stamina 13
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-38-player-2-263",
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
          "row": 2,
          "column": 5
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:14:32.174Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 191 (round 38)
- Player: 陸小鳳 (player-2), level 2, experience 77, at (2, 4), health 20.4, stamina 11
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-38-player-2-264",
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
          "row": 2,
          "column": 4
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:14:32.180Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 192 (round 38)
- Player: 陸小鳳 (player-2), level 2, experience 77, at (2, 3), health 20.4, stamina 9
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-38-player-2-265",
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
          "row": 2,
          "column": 3
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:14:32.187Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 193 (round 38)
- Player: 陸小鳳 (player-2), level 2, experience 77, at (3, 3), health 20.4, stamina 7
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-38-player-2-266",
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
          "column": 3
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:14:32.192Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 194 (round 38)
- Player: 陸小鳳 (player-2), level 2, experience 77, at (4, 3), health 20.4, stamina 5
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-38-player-2-267",
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
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:14:32.197Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 195 (round 38)
- Player: 陸小鳳 (player-2), level 2, experience 77, at (4, 3), health 20.4, stamina 2
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-38-player-2-268",
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
        "buildingType": "building-type-warehouse",
        "reason": "建設：建造 建料倉庫"
      },
      "result": "succeeded",
      "reason": "建設：建造 建料倉庫",
      "createdAt": "2026-09-01T19:14:32.199Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 196 (round 39)
- Player: 陸小鳳 (player-2), level 2, experience 81, at (4, 3), health 21.599999999999998, stamina 15
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-38-nest-creature-3-269",
      "round": 38,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "destination": {
          "row": 8,
          "column": 13
        },
        "reason": "移動接近 item-point-19。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-19。",
      "createdAt": "2026-09-01T19:14:32.202Z"
    },
    {
      "id": "action-38-nest-creature-2-270",
      "round": 38,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
      "createdAt": "2026-09-01T19:14:32.202Z"
    },
    {
      "id": "action-39-player-2-271",
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
      "createdAt": "2026-09-01T19:14:32.202Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 197 (round 39)
- Player: 陸小鳳 (player-2), level 2, experience 81, at (4, 3), health 21.599999999999998, stamina 12
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-39-player-2-272",
      "round": 39,
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
        "buildingType": "building-type-martial-hall-misty-rain",
        "reason": "建設：建造 煙雨武館"
      },
      "result": "succeeded",
      "reason": "建設：建造 煙雨武館",
      "createdAt": "2026-09-01T19:14:32.204Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 198 (round 39)
- Player: 陸小鳳 (player-2), level 2, experience 81, at (4, 3), health 21.599999999999998, stamina 10
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-39-player-2-273",
      "round": 39,
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
      "createdAt": "2026-09-01T19:14:32.206Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 199 (round 39)
- Player: 陸小鳳 (player-2), level 2, experience 81, at (4, 3), health 21.599999999999998, stamina 8
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-39-player-2-274",
      "round": 39,
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
      "createdAt": "2026-09-01T19:14:32.208Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 200 (round 39)
- Player: 陸小鳳 (player-2), level 2, experience 81, at (4, 3), health 21.599999999999998, stamina 6
- Attributes: armStrength=21, constitution=8, agility=9, innerEnergy=9, insight=13
- Inner skill: 百毒納氣 (hundred-poison-inner), level 1, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-39-player-2-275",
      "round": 39,
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
      "createdAt": "2026-09-01T19:14:32.210Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

