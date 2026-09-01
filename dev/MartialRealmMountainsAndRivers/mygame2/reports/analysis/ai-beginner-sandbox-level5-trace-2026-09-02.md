# AI Beginner Sandbox Level5 Trace

- AI turns: 291
- Final round: 62
- Game won: false
- Game over: false
- Remaining nests: 1

## Aggregate

- Action counts: move=174, hold=99, end-turn=61, practice-skill=59, attack=9, allocate-attribute=6, collect=4, learn-skill=3, build=3, equip=2, equip-inner-skill=1, use-item=1, use-facility=1
- Creatures spawned (total): 6
- Creatures defeated (total): 5
- Level-ups observed: 4
- Final player: level 5, experience 0, inner skill 烈陽戰體 (blazing-sun-inner) lv.5 damage 45
- Final attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9

## Efficiency (KPI)

- 行動產出率 (productive): ██·········· 18.9% (80/423)
- 擊殺效率 (kill/generate): ██████████·· 0.83 (5/6)
- 擊殺成本 (attack/kill): 1.80 (9 次攻擊 / 5 擊殺)
- 經驗效率 (XP/turn): 0.00 (0 XP / 291 turns)

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
      "createdAt": "2026-09-01T19:26:35.088Z"
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
      "createdAt": "2026-09-01T19:26:35.102Z"
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
      "createdAt": "2026-09-01T19:26:35.108Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 4 (round 1)
- Player: 陸小鳳 (player-2), level 1, experience 0, at (9, 1), health 24, stamina 1
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 6
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-1-player-2-4",
      "round": 1,
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
        "instanceId": "equipment-player-2-8ad0b810-9f40-47fe-b174-68092549afe2",
        "reason": "裝備：精鋼劍（weapon）"
      },
      "result": "succeeded",
      "reason": "裝備：精鋼劍（weapon）",
      "createdAt": "2026-09-01T19:26:35.112Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 5 (round 2)
- Player: 陸小鳳 (player-2), level 1, experience 2, at (9, 1), health 25.5, stamina 10
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 6
- Stored experience change: +2
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
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T19:26:35.118Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 6 (round 2)
- Player: 陸小鳳 (player-2), level 1, experience 2, at (8, 1), health 25.5, stamina 8
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 6
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
          "row": 8,
          "column": 1
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.127Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 7 (round 2)
- Player: 陸小鳳 (player-2), level 1, experience 2, at (7, 1), health 25.5, stamina 6
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 6
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
          "row": 7,
          "column": 1
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.135Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 8 (round 2)
- Player: 陸小鳳 (player-2), level 1, experience 2, at (6, 1), health 25.5, stamina 4
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 6
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
      "createdAt": "2026-09-01T19:26:35.141Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 9 (round 2)
- Player: 陸小鳳 (player-2), level 1, experience 2, at (6, 2), health 25.5, stamina 2
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 6
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.149Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 10 (round 2)
- Player: 陸小鳳 (player-2), level 1, experience 2, at (6, 1), health 25.5, stamina 0
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 6
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-2-player-2-10",
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
        "reason": "收集道具：移動到道具位置"
      },
      "result": "succeeded",
      "reason": "收集道具：移動到道具位置",
      "createdAt": "2026-09-01T19:26:35.155Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 11 (round 3)
- Player: 陸小鳳 (player-2), level 1, experience 2, at (6, 1), health 27, stamina 10
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 6
- Stored experience change: +0
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/132

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
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T19:26:35.156Z"
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

### Turn 12 (round 3)
- Player: 陸小鳳 (player-2), level 1, experience 2, at (5, 1), health 27, stamina 5
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 6
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

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
          "row": 5,
          "column": 1
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.162Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 13 (round 3)
- Player: 陸小鳳 (player-2), level 1, experience 2, at (4, 1), health 27, stamina 0
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 6
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

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
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 4,
          "column": 1
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.170Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 14 (round 4)
- Player: 陸小鳳 (player-2), level 1, experience 2, at (4, 1), health 28.5, stamina 10
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 6
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-3-nest-creature-1-14",
      "round": 3,
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
      "createdAt": "2026-09-01T19:26:35.181Z"
    },
    {
      "id": "action-4-player-2-15",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T19:26:35.181Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 15 (round 4)
- Player: 陸小鳳 (player-2), level 1, experience 2, at (3, 1), health 28.5, stamina 8
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 6
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
          "row": 3,
          "column": 1
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.188Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 16 (round 4)
- Player: 陸小鳳 (player-2), level 1, experience 2, at (2, 1), health 28.5, stamina 6
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 6
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
          "row": 2,
          "column": 1
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.195Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 17 (round 4)
- Player: 陸小鳳 (player-2), level 1, experience 2, at (1, 1), health 28.5, stamina 4
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 6
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
          "row": 1,
          "column": 1
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.203Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 18 (round 4)
- Player: 陸小鳳 (player-2), level 1, experience 2, at (1, 1), health 28.5, stamina 1
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 6
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-4-player-2-19",
      "round": 4,
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
      "createdAt": "2026-09-01T19:26:35.209Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 19 (round 4)
- Player: 陸小鳳 (player-2), level 1, experience 2, at (1, 1), health 28.5, stamina 1
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-4-player-2-20",
      "round": 4,
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
        "skillId": "blazing-sun-inner",
        "reason": "裝備功法：烈陽戰體"
      },
      "result": "succeeded",
      "reason": "裝備功法：烈陽戰體",
      "createdAt": "2026-09-01T19:26:35.213Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 20 (round 5)
- Player: 陸小鳳 (player-2), level 1, experience 4, at (1, 1), health 30.3, stamina 10.5
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-4-nest-creature-1-21",
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
        "reason": "移動接近 item-point-11。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-11。",
      "createdAt": "2026-09-01T19:26:35.217Z"
    },
    {
      "id": "action-5-player-2-22",
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
        "reason": "模糊策略：positioning 分數 0.67，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.67:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.67，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.67:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T19:26:35.217Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 21 (round 5)
- Player: 陸小鳳 (player-2), level 1, experience 4, at (2, 1), health 30, stamina 8.5
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-5-player-2-23",
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
          "row": 2,
          "column": 1
        },
        "reason": "定位：前往出口 (2,1)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (2,1)",
      "createdAt": "2026-09-01T19:26:35.226Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 22 (round 5)
- Player: 陸小鳳 (player-2), level 1, experience 4, at (2, 1), health 30, stamina 8.5
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-5-player-2-24",
      "round": 5,
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
      "createdAt": "2026-09-01T19:26:35.234Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 23 (round 5)
- Player: 陸小鳳 (player-2), level 1, experience 4, at (2, 2), health 30, stamina 6.5
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-5-player-2-25",
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
          "row": 2,
          "column": 2
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.241Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 24 (round 5)
- Player: 陸小鳳 (player-2), level 1, experience 4, at (2, 2), health 30, stamina 3.5
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-5-player-2-26",
      "round": 5,
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
      "createdAt": "2026-09-01T19:26:35.246Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 25 (round 5)
- Player: 陸小鳳 (player-2), level 1, experience 4, at (2, 3), health 30, stamina 1.5
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-5-player-2-27",
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
          "row": 2,
          "column": 3
        },
        "reason": "探索：移動到未探索格 (5,3)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (5,3)",
      "createdAt": "2026-09-01T19:26:35.252Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 26 (round 6)
- Player: 陸小鳳 (player-2), level 1, experience 7, at (2, 3), health 31.8, stamina 10.5
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-5-nest-creature-1-28",
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
      "createdAt": "2026-09-01T19:26:35.254Z"
    },
    {
      "id": "action-6-player-2-29",
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
      "createdAt": "2026-09-01T19:26:35.255Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 27 (round 6)
- Player: 陸小鳳 (player-2), level 1, experience 7, at (2, 4), health 30, stamina 8.5
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-6-player-2-30",
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
          "row": 2,
          "column": 4
        },
        "reason": "收集道具：移動到道具位置"
      },
      "result": "succeeded",
      "reason": "收集道具：移動到道具位置",
      "createdAt": "2026-09-01T19:26:35.261Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 28 (round 6)
- Player: 陸小鳳 (player-2), level 1, experience 7, at (2, 4), health 30, stamina 8.5
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-6-player-2-31",
      "round": 6,
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
      "createdAt": "2026-09-01T19:26:35.266Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 29 (round 6)
- Player: 陸小鳳 (player-2), level 1, experience 27, at (2, 4), health 30, stamina 3.5
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-6-player-2-32",
      "round": 6,
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
          "id": "ruin-5",
          "kind": "ruin",
          "position": {
            "row": 1,
            "column": 4
          }
        },
        "reason": "清障：清除廢墟 柳岸村"
      },
      "result": "succeeded",
      "reason": "清障：清除廢墟 柳岸村",
      "createdAt": "2026-09-01T19:26:35.270Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 30 (round 6)
- Player: 陸小鳳 (player-2), level 1, experience 27, at (2, 5), health 30, stamina 1.5
- Attributes: armStrength=12, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-6-player-2-33",
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
          "row": 2,
          "column": 5
        },
        "reason": "探索：移動到未探索格 (5,3)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (5,3)",
      "createdAt": "2026-09-01T19:26:35.278Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 31 (round 6)
- Player: 陸小鳳 (player-2), level 1, experience 27, at (2, 5), health 30, stamina 1.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-6-player-2-34",
      "round": 6,
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
        "instanceId": "equipment-player-2-efe90b59-34b9-47dc-a62e-791f80b09dde",
        "reason": "裝備：溫玉佩（accessory）"
      },
      "result": "succeeded",
      "reason": "裝備：溫玉佩（accessory）",
      "createdAt": "2026-09-01T19:26:35.282Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 32 (round 7)
- Player: 陸小鳳 (player-2), level 1, experience 30, at (2, 5), health 31.8, stamina 10.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-6-nest-creature-1-35",
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
      "createdAt": "2026-09-01T19:26:35.285Z"
    },
    {
      "id": "action-7-player-2-36",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T19:26:35.285Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 33 (round 7)
- Player: 陸小鳳 (player-2), level 1, experience 30, at (2, 6), health 31.8, stamina 8.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-7-player-2-37",
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
          "row": 2,
          "column": 6
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.292Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 34 (round 8)
- Player: 陸小鳳 (player-2), level 1, experience 47, at (2, 6), health 33.6, stamina 10.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: +17
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-7-nest-creature-1-38",
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
      "createdAt": "2026-09-01T19:26:35.297Z"
    },
    {
      "id": "action-8-player-2-39",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T19:26:35.297Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 35 (round 9)
- Player: 陸小鳳 (player-2), level 2, experience 18, at (2, 6), health 35.4, stamina 10.5
- Attributes: armStrength=13, constitution=12, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 12
- Stored experience change: -29 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-8-nest-creature-1-40",
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
      "createdAt": "2026-09-01T19:26:35.301Z"
    },
    {
      "id": "action-9-player-2-41",
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
      "createdAt": "2026-09-01T19:26:35.301Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 36 (round 9)
- Player: 陸小鳳 (player-2), level 2, experience 18, at (2, 6), health 35.4, stamina 10.5
- Attributes: armStrength=13, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-9-player-2-42",
      "round": 9,
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
      "createdAt": "2026-09-01T19:26:35.307Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 37 (round 9)
- Player: 陸小鳳 (player-2), level 2, experience 18, at (2, 6), health 35.4, stamina 10.5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-9-player-2-43",
      "round": 9,
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
      "createdAt": "2026-09-01T19:26:35.311Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 38 (round 9)
- Player: 陸小鳳 (player-2), level 2, experience 18, at (1, 6), health 35.4, stamina 8.5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-9-player-2-44",
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
          "row": 1,
          "column": 6
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:35.317Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 39 (round 9)
- Player: 陸小鳳 (player-2), level 2, experience 18, at (1, 5), health 35.4, stamina 3.5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-9-player-2-45",
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
          "row": 1,
          "column": 5
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.324Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 40 (round 9)
- Player: 陸小鳳 (player-2), level 2, experience 18, at (2, 5), health 35.4, stamina 1.5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-9-player-2-46",
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
        "reason": "探索：移動到未探索格 (5,3)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (5,3)",
      "createdAt": "2026-09-01T19:26:35.333Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 41 (round 10)
- Player: 陸小鳳 (player-2), level 2, experience 21, at (2, 5), health 37.35, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-9-nest-creature-1-47",
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
      "createdAt": "2026-09-01T19:26:35.336Z"
    },
    {
      "id": "action-10-player-2-48",
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
      "createdAt": "2026-09-01T19:26:35.336Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 42 (round 10)
- Player: 陸小鳳 (player-2), level 2, experience 21, at (3, 5), health 37.35, stamina 9
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
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
          "row": 3,
          "column": 5
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.344Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 43 (round 10)
- Player: 陸小鳳 (player-2), level 2, experience 21, at (3, 4), health 37.35, stamina 4
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
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
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 3,
          "column": 4
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:35.349Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 44 (round 10)
- Player: 陸小鳳 (player-2), level 2, experience 21, at (3, 3), health 37.35, stamina 2
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-10-player-2-51",
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
      "createdAt": "2026-09-01T19:26:35.356Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 45 (round 11)
- Player: 陸小鳳 (player-2), level 2, experience 25, at (3, 3), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
- Stored experience change: +4
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-10-nest-creature-1-52",
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
      "createdAt": "2026-09-01T19:26:35.358Z"
    },
    {
      "id": "action-11-player-2-53",
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
        "reason": "模糊策略：exploration 分數 0.03，但目前沒有可執行 action，結束回合。候選診斷：exploration=0.03:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：exploration 分數 0.03，但目前沒有可執行 action，結束回合。候選診斷：exploration=0.03:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T19:26:35.358Z"
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
- Player: 陸小鳳 (player-2), level 2, experience 25, at (4, 3), health 39, stamina 9
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
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
          "column": 3
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:26:35.365Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 47 (round 11)
- Player: 陸小鳳 (player-2), level 2, experience 25, at (4, 3), health 39, stamina 7
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
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
      "createdAt": "2026-09-01T19:26:35.369Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 48 (round 11)
- Player: 陸小鳳 (player-2), level 2, experience 25, at (4, 3), health 39, stamina 4
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
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
      "createdAt": "2026-09-01T19:26:35.372Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 49 (round 11)
- Player: 陸小鳳 (player-2), level 2, experience 25, at (4, 3), health 39, stamina 1
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
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
      "createdAt": "2026-09-01T19:26:35.375Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 50 (round 12)
- Player: 陸小鳳 (player-2), level 2, experience 27, at (4, 3), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
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
      "createdAt": "2026-09-01T19:26:35.377Z"
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
      "createdAt": "2026-09-01T19:26:35.378Z"
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
      "createdAt": "2026-09-01T19:26:35.378Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 51 (round 12)
- Player: 陸小鳳 (player-2), level 2, experience 27, at (4, 3), health 39, stamina 8
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
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
      "createdAt": "2026-09-01T19:26:35.381Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 52 (round 12)
- Player: 陸小鳳 (player-2), level 2, experience 27, at (4, 2), health 39, stamina 6
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
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
          "row": 4,
          "column": 2
        },
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:26:35.387Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 53 (round 12)
- Player: 陸小鳳 (player-2), level 2, experience 27, at (3, 2), health 39, stamina 4
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
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
          "column": 2
        },
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:26:35.392Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 54 (round 12)
- Player: 陸小鳳 (player-2), level 2, experience 27, at (2, 2), health 39, stamina 2
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
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
          "row": 2,
          "column": 2
        },
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:26:35.398Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 55 (round 12)
- Player: 陸小鳳 (player-2), level 2, experience 27, at (2, 2), health 39, stamina 0
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
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
      "createdAt": "2026-09-01T19:26:35.401Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 56 (round 13)
- Player: 陸小鳳 (player-2), level 2, experience 27, at (2, 2), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
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
      "createdAt": "2026-09-01T19:26:35.402Z"
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
      "createdAt": "2026-09-01T19:26:35.402Z"
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
      "createdAt": "2026-09-01T19:26:35.402Z"
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

### Turn 57 (round 13)
- Player: 陸小鳳 (player-2), level 2, experience 27, at (2, 2), health 39, stamina 8
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
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
      "createdAt": "2026-09-01T19:26:35.405Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 58 (round 13)
- Player: 陸小鳳 (player-2), level 2, experience 27, at (2, 2), health 39, stamina 5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
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
      "createdAt": "2026-09-01T19:26:35.409Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 59 (round 13)
- Player: 陸小鳳 (player-2), level 2, experience 27, at (2, 2), health 39, stamina 2
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
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
      "createdAt": "2026-09-01T19:26:35.412Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 60 (round 14)
- Player: 陸小鳳 (player-2), level 2, experience 31, at (2, 2), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
- Stored experience change: +4
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
      "createdAt": "2026-09-01T19:26:35.415Z"
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
      "createdAt": "2026-09-01T19:26:35.415Z"
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
      "createdAt": "2026-09-01T19:26:35.415Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 61 (round 14)
- Player: 陸小鳳 (player-2), level 2, experience 31, at (2, 2), health 39, stamina 8
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
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
      "createdAt": "2026-09-01T19:26:35.419Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 62 (round 14)
- Player: 陸小鳳 (player-2), level 2, experience 31, at (2, 2), health 39, stamina 5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
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
      "createdAt": "2026-09-01T19:26:35.423Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 63 (round 14)
- Player: 陸小鳳 (player-2), level 2, experience 31, at (2, 2), health 39, stamina 2
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
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
      "createdAt": "2026-09-01T19:26:35.426Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 64 (round 15)
- Player: 陸小鳳 (player-2), level 2, experience 35, at (2, 2), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
- Stored experience change: +4
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
      "createdAt": "2026-09-01T19:26:35.428Z"
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
      "createdAt": "2026-09-01T19:26:35.428Z"
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T19:26:35.428Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 65 (round 15)
- Player: 陸小鳳 (player-2), level 2, experience 35, at (2, 2), health 39, stamina 8
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
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
      "createdAt": "2026-09-01T19:26:35.433Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 66 (round 15)
- Player: 陸小鳳 (player-2), level 2, experience 35, at (2, 2), health 39, stamina 5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 1, damage 13
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
      "createdAt": "2026-09-01T19:26:35.436Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 67 (round 15)
- Player: 陸小鳳 (player-2), level 2, experience 35, at (2, 2), health 39, stamina 2
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
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
      "createdAt": "2026-09-01T19:26:35.440Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 68 (round 16)
- Player: 陸小鳳 (player-2), level 2, experience 39, at (2, 2), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +4
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
      "createdAt": "2026-09-01T19:26:35.442Z"
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
      "createdAt": "2026-09-01T19:26:35.442Z"
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
      "createdAt": "2026-09-01T19:26:35.442Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 69 (round 16)
- Player: 陸小鳳 (player-2), level 2, experience 39, at (2, 2), health 39, stamina 8
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
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
      "createdAt": "2026-09-01T19:26:35.445Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 70 (round 16)
- Player: 陸小鳳 (player-2), level 2, experience 39, at (2, 2), health 39, stamina 5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
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
      "createdAt": "2026-09-01T19:26:35.449Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 71 (round 16)
- Player: 陸小鳳 (player-2), level 2, experience 39, at (2, 2), health 39, stamina 2
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
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
      "createdAt": "2026-09-01T19:26:35.453Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 72 (round 17)
- Player: 陸小鳳 (player-2), level 2, experience 43, at (2, 2), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-16-nest-creature-1-90",
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
      "createdAt": "2026-09-01T19:26:35.455Z"
    },
    {
      "id": "action-16-nest-creature-2-91",
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
      "createdAt": "2026-09-01T19:26:35.455Z"
    },
    {
      "id": "action-17-player-2-92",
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
      "createdAt": "2026-09-01T19:26:35.456Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 73 (round 17)
- Player: 陸小鳳 (player-2), level 2, experience 43, at (2, 2), health 39, stamina 8
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-17-player-2-93",
      "round": 17,
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
      "createdAt": "2026-09-01T19:26:35.459Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 74 (round 17)
- Player: 陸小鳳 (player-2), level 2, experience 43, at (2, 2), health 39, stamina 5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-17-player-2-94",
      "round": 17,
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
      "createdAt": "2026-09-01T19:26:35.463Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 75 (round 17)
- Player: 陸小鳳 (player-2), level 2, experience 43, at (2, 2), health 39, stamina 2
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
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
      "createdAt": "2026-09-01T19:26:35.467Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 76 (round 18)
- Player: 陸小鳳 (player-2), level 2, experience 47, at (2, 2), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-17-nest-creature-1-96",
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
      "createdAt": "2026-09-01T19:26:35.469Z"
    },
    {
      "id": "action-17-nest-creature-2-97",
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
      "createdAt": "2026-09-01T19:26:35.469Z"
    },
    {
      "id": "action-18-player-2-98",
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
      "createdAt": "2026-09-01T19:26:35.469Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 77 (round 18)
- Player: 陸小鳳 (player-2), level 2, experience 47, at (2, 2), health 39, stamina 8
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-18-player-2-99",
      "round": 18,
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
      "createdAt": "2026-09-01T19:26:35.472Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 78 (round 18)
- Player: 陸小鳳 (player-2), level 2, experience 47, at (2, 2), health 39, stamina 5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-18-player-2-100",
      "round": 18,
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
      "createdAt": "2026-09-01T19:26:35.476Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 79 (round 18)
- Player: 陸小鳳 (player-2), level 2, experience 47, at (2, 2), health 39, stamina 2
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-18-player-2-101",
      "round": 18,
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
      "createdAt": "2026-09-01T19:26:35.479Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 80 (round 19)
- Player: 陸小鳳 (player-2), level 2, experience 51, at (2, 2), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +4
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-18-nest-creature-1-102",
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
      "createdAt": "2026-09-01T19:26:35.482Z"
    },
    {
      "id": "action-18-nest-creature-2-103",
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
      "createdAt": "2026-09-01T19:26:35.482Z"
    },
    {
      "id": "action-19-player-2-104",
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
      "createdAt": "2026-09-01T19:26:35.482Z"
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

### Turn 81 (round 19)
- Player: 陸小鳳 (player-2), level 2, experience 51, at (2, 2), health 39, stamina 8
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-19-player-2-105",
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
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T19:26:35.486Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 82 (round 19)
- Player: 陸小鳳 (player-2), level 2, experience 51, at (2, 2), health 39, stamina 5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-19-player-2-106",
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
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T19:26:35.490Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 83 (round 19)
- Player: 陸小鳳 (player-2), level 2, experience 51, at (2, 2), health 39, stamina 2
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-19-player-2-107",
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
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T19:26:35.493Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 84 (round 20)
- Player: 陸小鳳 (player-2), level 2, experience 55, at (2, 2), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-19-nest-creature-1-108",
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
      "createdAt": "2026-09-01T19:26:35.495Z"
    },
    {
      "id": "action-19-nest-creature-2-109",
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
      "createdAt": "2026-09-01T19:26:35.495Z"
    },
    {
      "id": "action-19-nest-creature-3-110",
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
      "createdAt": "2026-09-01T19:26:35.495Z"
    },
    {
      "id": "action-20-player-2-111",
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
      "createdAt": "2026-09-01T19:26:35.496Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 85 (round 20)
- Player: 陸小鳳 (player-2), level 2, experience 55, at (2, 2), health 39, stamina 8
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 2, damage 19
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-20-player-2-112",
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
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T19:26:35.501Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 86 (round 20)
- Player: 陸小鳳 (player-2), level 2, experience 55, at (2, 2), health 39, stamina 5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-20-player-2-113",
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
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T19:26:35.506Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 87 (round 20)
- Player: 陸小鳳 (player-2), level 2, experience 55, at (2, 2), health 39, stamina 2
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-20-player-2-114",
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
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T19:26:35.511Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 88 (round 21)
- Player: 陸小鳳 (player-2), level 2, experience 59, at (2, 2), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-20-nest-creature-1-115",
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
      "createdAt": "2026-09-01T19:26:35.513Z"
    },
    {
      "id": "action-20-nest-creature-2-116",
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
      "createdAt": "2026-09-01T19:26:35.513Z"
    },
    {
      "id": "action-20-nest-creature-3-117",
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
      "createdAt": "2026-09-01T19:26:35.513Z"
    },
    {
      "id": "action-21-player-2-118",
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
      "createdAt": "2026-09-01T19:26:35.513Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 89 (round 21)
- Player: 陸小鳳 (player-2), level 2, experience 59, at (2, 2), health 39, stamina 8
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-21-player-2-119",
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
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T19:26:35.519Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 90 (round 21)
- Player: 陸小鳳 (player-2), level 2, experience 59, at (2, 2), health 39, stamina 5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-21-player-2-120",
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
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T19:26:35.523Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 91 (round 21)
- Player: 陸小鳳 (player-2), level 2, experience 59, at (2, 2), health 39, stamina 2
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-21-player-2-121",
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
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T19:26:35.528Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 92 (round 22)
- Player: 陸小鳳 (player-2), level 2, experience 63, at (2, 2), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-21-nest-creature-1-122",
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
      "createdAt": "2026-09-01T19:26:35.530Z"
    },
    {
      "id": "action-21-nest-creature-2-123",
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
      "createdAt": "2026-09-01T19:26:35.530Z"
    },
    {
      "id": "action-21-nest-creature-3-124",
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
      "createdAt": "2026-09-01T19:26:35.530Z"
    },
    {
      "id": "action-22-player-2-125",
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
      "createdAt": "2026-09-01T19:26:35.530Z"
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

### Turn 93 (round 22)
- Player: 陸小鳳 (player-2), level 2, experience 63, at (2, 2), health 39, stamina 8
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-22-player-2-126",
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
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T19:26:35.535Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 94 (round 22)
- Player: 陸小鳳 (player-2), level 2, experience 63, at (2, 2), health 39, stamina 5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-22-player-2-127",
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
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T19:26:35.540Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 95 (round 22)
- Player: 陸小鳳 (player-2), level 2, experience 63, at (2, 2), health 39, stamina 2
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-22-player-2-128",
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
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T19:26:35.544Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 96 (round 23)
- Player: 陸小鳳 (player-2), level 2, experience 67, at (2, 2), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-22-nest-creature-1-129",
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
      "createdAt": "2026-09-01T19:26:35.546Z"
    },
    {
      "id": "action-22-nest-creature-2-130",
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
      "createdAt": "2026-09-01T19:26:35.546Z"
    },
    {
      "id": "action-22-nest-creature-3-131",
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
      "createdAt": "2026-09-01T19:26:35.546Z"
    },
    {
      "id": "action-23-player-2-132",
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
      "createdAt": "2026-09-01T19:26:35.546Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 97 (round 23)
- Player: 陸小鳳 (player-2), level 2, experience 67, at (2, 2), health 39, stamina 8
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-23-player-2-133",
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
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T19:26:35.551Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 98 (round 23)
- Player: 陸小鳳 (player-2), level 2, experience 67, at (2, 2), health 39, stamina 5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-23-player-2-134",
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
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T19:26:35.556Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 99 (round 23)
- Player: 陸小鳳 (player-2), level 2, experience 67, at (2, 2), health 39, stamina 2
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-23-player-2-135",
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
        "gateId": "sect-gate-1",
        "skillId": "blazing-sun-inner",
        "reason": "練功：練習功法 烈陽戰體"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 烈陽戰體",
      "createdAt": "2026-09-01T19:26:35.560Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 100 (round 24)
- Player: 陸小鳳 (player-2), level 2, experience 71, at (2, 2), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-23-nest-creature-1-136",
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
      "createdAt": "2026-09-01T19:26:35.562Z"
    },
    {
      "id": "action-23-nest-creature-2-137",
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
      "createdAt": "2026-09-01T19:26:35.562Z"
    },
    {
      "id": "action-23-nest-creature-3-138",
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
      "createdAt": "2026-09-01T19:26:35.562Z"
    },
    {
      "id": "action-24-player-2-139",
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
      "createdAt": "2026-09-01T19:26:35.562Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 101 (round 24)
- Player: 陸小鳳 (player-2), level 2, experience 71, at (2, 2), health 39, stamina 8
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-140",
      "round": 24,
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
      "createdAt": "2026-09-01T19:26:35.571Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 102 (round 24)
- Player: 陸小鳳 (player-2), level 2, experience 71, at (2, 2), health 39, stamina 5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-141",
      "round": 24,
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
      "createdAt": "2026-09-01T19:26:35.578Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 103 (round 24)
- Player: 陸小鳳 (player-2), level 2, experience 71, at (2, 3), health 39, stamina 3
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-142",
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
          "row": 2,
          "column": 3
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:35.586Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 104 (round 24)
- Player: 陸小鳳 (player-2), level 2, experience 71, at (2, 4), health 39, stamina 1
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-143",
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
          "row": 2,
          "column": 4
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:26:35.592Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 105 (round 25)
- Player: 陸小鳳 (player-2), level 2, experience 73, at (2, 4), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-24-nest-creature-1-144",
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
      "createdAt": "2026-09-01T19:26:35.596Z"
    },
    {
      "id": "action-24-nest-creature-2-145",
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
      "createdAt": "2026-09-01T19:26:35.596Z"
    },
    {
      "id": "action-24-nest-creature-3-146",
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
      "createdAt": "2026-09-01T19:26:35.596Z"
    },
    {
      "id": "action-25-player-2-147",
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
      "createdAt": "2026-09-01T19:26:35.596Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 106 (round 25)
- Player: 陸小鳳 (player-2), level 2, experience 73, at (2, 5), health 39, stamina 9
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-25-player-2-148",
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
          "row": 2,
          "column": 5
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:35.607Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 107 (round 25)
- Player: 陸小鳳 (player-2), level 2, experience 73, at (3, 5), health 39, stamina 7
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-25-player-2-149",
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
          "row": 3,
          "column": 5
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:35.618Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 108 (round 25)
- Player: 陸小鳳 (player-2), level 2, experience 73, at (3, 4), health 39, stamina 2
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-25-player-2-150",
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
          "row": 3,
          "column": 4
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:35.628Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 109 (round 25)
- Player: 陸小鳳 (player-2), level 2, experience 73, at (3, 3), health 39, stamina 0
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-25-player-2-151",
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
          "row": 3,
          "column": 3
        },
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:26:35.635Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 110 (round 26)
- Player: 陸小鳳 (player-2), level 2, experience 73, at (3, 3), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-25-nest-creature-1-152",
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
      "createdAt": "2026-09-01T19:26:35.635Z"
    },
    {
      "id": "action-25-nest-creature-2-153",
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
      "createdAt": "2026-09-01T19:26:35.635Z"
    },
    {
      "id": "action-25-nest-creature-3-154",
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
      "createdAt": "2026-09-01T19:26:35.636Z"
    },
    {
      "id": "action-26-player-2-155",
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
      "createdAt": "2026-09-01T19:26:35.636Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 111 (round 26)
- Player: 陸小鳳 (player-2), level 2, experience 73, at (4, 3), health 39, stamina 9
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-156",
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
          "column": 3
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.641Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 112 (round 26)
- Player: 陸小鳳 (player-2), level 2, experience 73, at (4, 2), health 39, stamina 7
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-157",
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
          "column": 2
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.645Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 113 (round 26)
- Player: 陸小鳳 (player-2), level 2, experience 73, at (3, 2), health 39, stamina 5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-158",
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
          "row": 3,
          "column": 2
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.651Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 114 (round 26)
- Player: 陸小鳳 (player-2), level 2, experience 73, at (2, 2), health 39, stamina 3
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-159",
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
          "row": 2,
          "column": 2
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.657Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 115 (round 26)
- Player: 陸小鳳 (player-2), level 2, experience 73, at (2, 3), health 39, stamina 1
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-160",
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
          "row": 2,
          "column": 3
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:26:35.661Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 116 (round 27)
- Player: 陸小鳳 (player-2), level 2, experience 75, at (2, 3), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-nest-creature-1-161",
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
      "createdAt": "2026-09-01T19:26:35.663Z"
    },
    {
      "id": "action-26-nest-creature-2-162",
      "round": 26,
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
      "createdAt": "2026-09-01T19:26:35.663Z"
    },
    {
      "id": "action-26-nest-creature-3-163",
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
      "createdAt": "2026-09-01T19:26:35.663Z"
    },
    {
      "id": "action-27-player-2-164",
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
      "createdAt": "2026-09-01T19:26:35.663Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 117 (round 27)
- Player: 陸小鳳 (player-2), level 2, experience 75, at (2, 4), health 39, stamina 9
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-27-player-2-165",
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
          "column": 4
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:35.674Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 118 (round 27)
- Player: 陸小鳳 (player-2), level 2, experience 75, at (2, 5), health 39, stamina 7
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-27-player-2-166",
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
          "column": 5
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:35.688Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 119 (round 27)
- Player: 陸小鳳 (player-2), level 2, experience 75, at (3, 5), health 39, stamina 5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-27-player-2-167",
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
          "column": 5
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:35.699Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 120 (round 27)
- Player: 陸小鳳 (player-2), level 2, experience 75, at (3, 4), health 39, stamina 0
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-27-player-2-168",
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
          "column": 4
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:35.708Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 121 (round 28)
- Player: 陸小鳳 (player-2), level 2, experience 75, at (3, 4), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-27-nest-creature-1-169",
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
      "createdAt": "2026-09-01T19:26:35.708Z"
    },
    {
      "id": "action-27-nest-creature-2-170",
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
          "row": 10,
          "column": 4
        },
        "reason": "移動接近 item-point-20。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-20。",
      "createdAt": "2026-09-01T19:26:35.709Z"
    },
    {
      "id": "action-27-nest-creature-3-171",
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
      "createdAt": "2026-09-01T19:26:35.709Z"
    },
    {
      "id": "action-28-player-2-172",
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
      "createdAt": "2026-09-01T19:26:35.709Z"
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

### Turn 122 (round 28)
- Player: 陸小鳳 (player-2), level 2, experience 75, at (3, 3), health 39, stamina 9
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-28-player-2-173",
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
          "row": 3,
          "column": 3
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.716Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 123 (round 28)
- Player: 陸小鳳 (player-2), level 2, experience 75, at (4, 3), health 39, stamina 7
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-28-player-2-174",
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
          "row": 4,
          "column": 3
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.722Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 124 (round 28)
- Player: 陸小鳳 (player-2), level 2, experience 75, at (4, 2), health 39, stamina 5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-28-player-2-175",
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
          "row": 4,
          "column": 2
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.725Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 125 (round 28)
- Player: 陸小鳳 (player-2), level 2, experience 75, at (3, 2), health 39, stamina 3
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-28-player-2-176",
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
          "row": 3,
          "column": 2
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.731Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 126 (round 28)
- Player: 陸小鳳 (player-2), level 2, experience 75, at (2, 2), health 39, stamina 1
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-28-player-2-177",
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
          "row": 2,
          "column": 2
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:26:35.735Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 127 (round 29)
- Player: 陸小鳳 (player-2), level 2, experience 77, at (2, 2), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-28-nest-creature-1-178",
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
      "createdAt": "2026-09-01T19:26:35.737Z"
    },
    {
      "id": "action-28-nest-creature-2-179",
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
          "row": 9,
          "column": 4
        },
        "reason": "移動接近 item-point-1。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-1。",
      "createdAt": "2026-09-01T19:26:35.737Z"
    },
    {
      "id": "action-28-nest-creature-3-180",
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
      "createdAt": "2026-09-01T19:26:35.737Z"
    },
    {
      "id": "action-29-player-2-181",
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
      "createdAt": "2026-09-01T19:26:35.737Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 128 (round 29)
- Player: 陸小鳳 (player-2), level 2, experience 77, at (2, 2), health 39, stamina 8
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-29-player-2-182",
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
      "createdAt": "2026-09-01T19:26:35.745Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 129 (round 29)
- Player: 陸小鳳 (player-2), level 2, experience 77, at (2, 2), health 39, stamina 5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-29-player-2-183",
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
      "createdAt": "2026-09-01T19:26:35.753Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 130 (round 29)
- Player: 陸小鳳 (player-2), level 2, experience 77, at (2, 3), health 39, stamina 3
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-29-player-2-184",
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
          "row": 2,
          "column": 3
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:35.761Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 131 (round 29)
- Player: 陸小鳳 (player-2), level 2, experience 77, at (2, 4), health 39, stamina 1
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-29-player-2-185",
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
          "row": 2,
          "column": 4
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:26:35.768Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 132 (round 30)
- Player: 陸小鳳 (player-2), level 2, experience 79, at (2, 4), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +2
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-29-nest-creature-1-186",
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
      "createdAt": "2026-09-01T19:26:35.772Z"
    },
    {
      "id": "action-29-nest-creature-2-187",
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
          "row": 8,
          "column": 2
        },
        "reason": "移動接近 item-point-15。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-15。",
      "createdAt": "2026-09-01T19:26:35.772Z"
    },
    {
      "id": "action-29-nest-creature-3-188",
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
      "createdAt": "2026-09-01T19:26:35.772Z"
    },
    {
      "id": "action-30-player-2-189",
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
      "createdAt": "2026-09-01T19:26:35.773Z"
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
      "spawnedRound": 30,
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

### Turn 133 (round 30)
- Player: 陸小鳳 (player-2), level 2, experience 79, at (2, 5), health 39, stamina 9
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-30-player-2-190",
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
          "row": 2,
          "column": 5
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:35.784Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 134 (round 30)
- Player: 陸小鳳 (player-2), level 2, experience 79, at (3, 5), health 39, stamina 7
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-30-player-2-191",
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
          "row": 3,
          "column": 5
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:35.795Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 135 (round 30)
- Player: 陸小鳳 (player-2), level 2, experience 79, at (3, 4), health 39, stamina 2
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-30-player-2-192",
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
          "row": 3,
          "column": 4
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:35.804Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 136 (round 30)
- Player: 陸小鳳 (player-2), level 2, experience 79, at (3, 3), health 39, stamina 0
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-30-player-2-193",
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
          "row": 3,
          "column": 3
        },
        "reason": "建設：移動到資源點"
      },
      "result": "succeeded",
      "reason": "建設：移動到資源點",
      "createdAt": "2026-09-01T19:26:35.810Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 137 (round 31)
- Player: 陸小鳳 (player-2), level 2, experience 79, at (3, 3), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-30-nest-creature-1-194",
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
      "createdAt": "2026-09-01T19:26:35.811Z"
    },
    {
      "id": "action-30-nest-creature-2-195",
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
          "row": 8,
          "column": 1
        },
        "reason": "移動接近 item-point-15。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-15。",
      "createdAt": "2026-09-01T19:26:35.811Z"
    },
    {
      "id": "action-30-nest-creature-3-196",
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
      "createdAt": "2026-09-01T19:26:35.811Z"
    },
    {
      "id": "action-30-nest-creature-4-197",
      "round": 30,
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
      "createdAt": "2026-09-01T19:26:35.811Z"
    },
    {
      "id": "action-31-player-2-198",
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
      "createdAt": "2026-09-01T19:26:35.811Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 138 (round 31)
- Player: 陸小鳳 (player-2), level 2, experience 79, at (4, 3), health 39, stamina 9
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-31-player-2-199",
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
          "row": 4,
          "column": 3
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:35.820Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 139 (round 31)
- Player: 陸小鳳 (player-2), level 2, experience 79, at (4, 2), health 39, stamina 7
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-31-player-2-200",
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
          "row": 4,
          "column": 2
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.825Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 140 (round 31)
- Player: 陸小鳳 (player-2), level 2, experience 79, at (3, 2), health 39, stamina 5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-31-player-2-201",
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
          "row": 3,
          "column": 2
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.833Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 141 (round 31)
- Player: 陸小鳳 (player-2), level 2, experience 79, at (2, 2), health 39, stamina 3
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-31-player-2-202",
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
          "row": 2,
          "column": 2
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.841Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 142 (round 31)
- Player: 陸小鳳 (player-2), level 2, experience 79, at (2, 3), health 39, stamina 1
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-31-player-2-203",
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
          "row": 2,
          "column": 3
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:26:35.848Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 143 (round 32)
- Player: 陸小鳳 (player-2), level 2, experience 81, at (2, 3), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-31-nest-creature-1-204",
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
      "createdAt": "2026-09-01T19:26:35.850Z"
    },
    {
      "id": "action-31-nest-creature-2-205",
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
          "row": 6,
          "column": 1
        },
        "reason": "移動接近 item-point-18。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-18。",
      "createdAt": "2026-09-01T19:26:35.850Z"
    },
    {
      "id": "action-31-nest-creature-3-206",
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
      "createdAt": "2026-09-01T19:26:35.851Z"
    },
    {
      "id": "action-31-nest-creature-4-207",
      "round": 31,
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
      "createdAt": "2026-09-01T19:26:35.851Z"
    },
    {
      "id": "action-32-player-2-208",
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
        "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T19:26:35.851Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 144 (round 32)
- Player: 陸小鳳 (player-2), level 2, experience 81, at (2, 4), health 39, stamina 9
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-32-player-2-209",
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
          "row": 2,
          "column": 4
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:35.860Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 145 (round 32)
- Player: 陸小鳳 (player-2), level 2, experience 81, at (2, 5), health 39, stamina 7
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-32-player-2-210",
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
          "row": 2,
          "column": 5
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:35.871Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 146 (round 32)
- Player: 陸小鳳 (player-2), level 2, experience 81, at (3, 5), health 39, stamina 5
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-32-player-2-211",
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
          "row": 3,
          "column": 5
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:35.883Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 147 (round 32)
- Player: 陸小鳳 (player-2), level 2, experience 81, at (3, 4), health 39, stamina 0
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-32-player-2-212",
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
          "row": 3,
          "column": 4
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:35.891Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 148 (round 33)
- Player: 陸小鳳 (player-2), level 2, experience 81, at (3, 4), health 39, stamina 11
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-32-nest-creature-1-213",
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
      "createdAt": "2026-09-01T19:26:35.892Z"
    },
    {
      "id": "action-32-nest-creature-2-214",
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
          "row": 5,
          "column": 1
        },
        "reason": "移動接近 平涼。"
      },
      "result": "succeeded",
      "reason": "移動接近 平涼。",
      "createdAt": "2026-09-01T19:26:35.892Z"
    },
    {
      "id": "action-32-nest-creature-3-215",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T19:26:35.892Z"
    },
    {
      "id": "action-32-nest-creature-4-216",
      "round": 32,
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
      "createdAt": "2026-09-01T19:26:35.892Z"
    },
    {
      "id": "action-33-player-2-217",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T19:26:35.892Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 149 (round 33)
- Player: 陸小鳳 (player-2), level 3, experience 41, at (3, 4), health 39, stamina 6
- Attributes: armStrength=14, constitution=13, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 26
- Stored experience change: -40 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: nest-creature-3
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-33-player-2-218",
      "round": 33,
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
            "row": 3,
            "column": 5
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.3"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.3",
      "createdAt": "2026-09-01T19:26:35.901Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 150 (round 33)
- Player: 陸小鳳 (player-2), level 3, experience 41, at (3, 4), health 39, stamina 6
- Attributes: armStrength=14, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-33-player-2-219",
      "round": 33,
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
      "createdAt": "2026-09-01T19:26:35.910Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 151 (round 33)
- Player: 陸小鳳 (player-2), level 3, experience 41, at (3, 4), health 39, stamina 6
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-33-player-2-220",
      "round": 33,
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
      "createdAt": "2026-09-01T19:26:35.921Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 152 (round 33)
- Player: 陸小鳳 (player-2), level 3, experience 41, at (3, 3), health 39, stamina 4
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-33-player-2-221",
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
          "row": 3,
          "column": 3
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:35.932Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 153 (round 33)
- Player: 陸小鳳 (player-2), level 3, experience 41, at (4, 3), health 39, stamina 2
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-33-player-2-222",
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
          "row": 4,
          "column": 3
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:35.940Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 154 (round 33)
- Player: 陸小鳳 (player-2), level 3, experience 41, at (3, 3), health 39, stamina 0
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-33-player-2-223",
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
          "row": 3,
          "column": 3
        },
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.2（hitsSurvivable=5.571428571428571）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.2（hitsSurvivable=5.571428571428571）",
      "createdAt": "2026-09-01T19:26:35.945Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 155 (round 34)
- Player: 陸小鳳 (player-2), level 3, experience 41, at (3, 3), health 41.1, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-33-nest-creature-1-224",
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
      "createdAt": "2026-09-01T19:26:35.945Z"
    },
    {
      "id": "action-33-nest-creature-2-225",
      "round": 33,
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
      "createdAt": "2026-09-01T19:26:35.945Z"
    },
    {
      "id": "action-33-nest-creature-4-226",
      "round": 33,
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
      "createdAt": "2026-09-01T19:26:35.946Z"
    },
    {
      "id": "action-34-player-2-227",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T19:26:35.946Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 156 (round 34)
- Player: 陸小鳳 (player-2), level 3, experience 81, at (3, 3), health 41.1, stamina 6.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +40
- Spawned creatures: 0
- Defeated creatures: nest-creature-2
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-34-player-2-228",
      "round": 34,
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
            "row": 3,
            "column": 2
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.2"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.2",
      "createdAt": "2026-09-01T19:26:35.954Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 157 (round 34)
- Player: 陸小鳳 (player-2), level 3, experience 81, at (3, 2), health 41.1, stamina 4.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-34-player-2-229",
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
          "row": 3,
          "column": 2
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.962Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 158 (round 34)
- Player: 陸小鳳 (player-2), level 3, experience 81, at (2, 2), health 41.1, stamina 2.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-34-player-2-230",
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
          "row": 2,
          "column": 2
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.972Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 159 (round 34)
- Player: 陸小鳳 (player-2), level 3, experience 81, at (2, 3), health 41.1, stamina 0.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
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
          "row": 2,
          "column": 3
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:26:35.977Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 160 (round 35)
- Player: 陸小鳳 (player-2), level 3, experience 82, at (2, 3), health 42, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-34-nest-creature-1-232",
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
      "createdAt": "2026-09-01T19:26:35.980Z"
    },
    {
      "id": "action-34-nest-creature-4-233",
      "round": 34,
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
      "createdAt": "2026-09-01T19:26:35.980Z"
    },
    {
      "id": "action-35-player-2-234",
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
      "createdAt": "2026-09-01T19:26:35.980Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 161 (round 35)
- Player: 陸小鳳 (player-2), level 3, experience 82, at (1, 3), health 42, stamina 6.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-35-player-2-235",
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
          "row": 1,
          "column": 3
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T19:26:35.990Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 162 (round 35)
- Player: 陸小鳳 (player-2), level 3, experience 82, at (1, 3), health 42, stamina 3.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-35-player-2-236",
      "round": 35,
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
        "skillType": "external",
        "skillId": "blazing-sun-external-damage",
        "reason": "學招：學習門派功法 烈陽轟"
      },
      "result": "succeeded",
      "reason": "學招：學習門派功法 烈陽轟",
      "createdAt": "2026-09-01T19:26:35.997Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 163 (round 35)
- Player: 陸小鳳 (player-2), level 3, experience 82, at (2, 3), health 42, stamina 1.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-35-player-2-237",
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
          "row": 2,
          "column": 3
        },
        "reason": "定位：前往出口 (2,3)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (2,3)",
      "createdAt": "2026-09-01T19:26:36.004Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 164 (round 36)
- Player: 陸小鳳 (player-2), level 3, experience 85, at (2, 3), health 42, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-35-nest-creature-1-238",
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
      "createdAt": "2026-09-01T19:26:36.006Z"
    },
    {
      "id": "action-35-nest-creature-4-239",
      "round": 35,
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
      "createdAt": "2026-09-01T19:26:36.006Z"
    },
    {
      "id": "action-36-player-2-240",
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
      "createdAt": "2026-09-01T19:26:36.006Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 165 (round 36)
- Player: 陸小鳳 (player-2), level 3, experience 85, at (2, 4), health 42, stamina 9.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-36-player-2-241",
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
          "column": 4
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:36.014Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 166 (round 36)
- Player: 陸小鳳 (player-2), level 3, experience 85, at (2, 5), health 42, stamina 7.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-36-player-2-242",
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
          "column": 5
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:36.022Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 167 (round 36)
- Player: 陸小鳳 (player-2), level 3, experience 85, at (2, 6), health 42, stamina 5.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-36-player-2-243",
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
          "column": 6
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:36.030Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 168 (round 36)
- Player: 陸小鳳 (player-2), level 3, experience 85, at (1, 6), health 42, stamina 3.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-36-player-2-244",
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
          "row": 1,
          "column": 6
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:36.037Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 169 (round 36)
- Player: 陸小鳳 (player-2), level 3, experience 85, at (2, 6), health 42, stamina 1.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-36-player-2-245",
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
          "column": 6
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:36.045Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 170 (round 37)
- Player: 陸小鳳 (player-2), level 3, experience 88, at (2, 6), health 42, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-36-nest-creature-1-246",
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T19:26:36.047Z"
    },
    {
      "id": "action-36-nest-creature-4-247",
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
      "createdAt": "2026-09-01T19:26:36.047Z"
    },
    {
      "id": "action-37-player-2-248",
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
      "createdAt": "2026-09-01T19:26:36.048Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 171 (round 37)
- Player: 陸小鳳 (player-2), level 3, experience 88, at (3, 6), health 42, stamina 6.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-37-player-2-249",
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
          "column": 6
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:36.054Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 172 (round 37)
- Player: 陸小鳳 (player-2), level 3, experience 88, at (3, 5), health 42, stamina 4.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-37-player-2-250",
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
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:36.060Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 173 (round 37)
- Player: 陸小鳳 (player-2), level 3, experience 88, at (2, 5), health 42, stamina 2.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-37-player-2-251",
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
          "row": 2,
          "column": 5
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:36.066Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 174 (round 37)
- Player: 陸小鳳 (player-2), level 3, experience 88, at (2, 4), health 42, stamina 0.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-37-player-2-252",
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
          "row": 2,
          "column": 4
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:26:36.071Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 175 (round 38)
- Player: 陸小鳳 (player-2), level 3, experience 89, at (2, 4), health 42, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-37-nest-creature-1-253",
      "round": 37,
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
      "createdAt": "2026-09-01T19:26:36.073Z"
    },
    {
      "id": "action-37-nest-creature-4-254",
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
      "createdAt": "2026-09-01T19:26:36.073Z"
    },
    {
      "id": "action-38-player-2-255",
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
      "createdAt": "2026-09-01T19:26:36.074Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 176 (round 38)
- Player: 陸小鳳 (player-2), level 3, experience 89, at (2, 3), health 42, stamina 9.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-38-player-2-256",
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
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:36.084Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 177 (round 38)
- Player: 陸小鳳 (player-2), level 3, experience 89, at (2, 2), health 42, stamina 7.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-38-player-2-257",
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
          "column": 2
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:36.091Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 178 (round 38)
- Player: 陸小鳳 (player-2), level 3, experience 89, at (2, 2), health 42, stamina 4.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 3, damage 28
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-38-player-2-258",
      "round": 38,
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
      "createdAt": "2026-09-01T19:26:36.096Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 179 (round 38)
- Player: 陸小鳳 (player-2), level 3, experience 89, at (2, 2), health 42, stamina 1.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-38-player-2-259",
      "round": 38,
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
      "createdAt": "2026-09-01T19:26:36.101Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 180 (round 39)
- Player: 陸小鳳 (player-2), level 3, experience 92, at (2, 2), health 42, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-38-nest-creature-1-260",
      "round": 38,
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
      "createdAt": "2026-09-01T19:26:36.103Z"
    },
    {
      "id": "action-38-nest-creature-4-261",
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
      "createdAt": "2026-09-01T19:26:36.103Z"
    },
    {
      "id": "action-39-player-2-262",
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
      "createdAt": "2026-09-01T19:26:36.103Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 181 (round 39)
- Player: 陸小鳳 (player-2), level 3, experience 92, at (2, 2), health 42, stamina 8.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-39-player-2-263",
      "round": 39,
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
      "createdAt": "2026-09-01T19:26:36.109Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 182 (round 39)
- Player: 陸小鳳 (player-2), level 3, experience 92, at (2, 2), health 42, stamina 5.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-39-player-2-264",
      "round": 39,
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
      "createdAt": "2026-09-01T19:26:36.114Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 183 (round 39)
- Player: 陸小鳳 (player-2), level 3, experience 92, at (2, 2), health 42, stamina 2.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-39-player-2-265",
      "round": 39,
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
      "createdAt": "2026-09-01T19:26:36.119Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 184 (round 39)
- Player: 陸小鳳 (player-2), level 3, experience 92, at (3, 2), health 42, stamina 0.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-39-player-2-266",
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
          "row": 3,
          "column": 2
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:26:36.123Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 185 (round 40)
- Player: 陸小鳳 (player-2), level 3, experience 93, at (3, 2), health 42, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-39-nest-creature-1-267",
      "round": 39,
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
      "createdAt": "2026-09-01T19:26:36.125Z"
    },
    {
      "id": "action-39-nest-creature-4-268",
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
      "createdAt": "2026-09-01T19:26:36.125Z"
    },
    {
      "id": "action-40-player-2-269",
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
      "createdAt": "2026-09-01T19:26:36.125Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 186 (round 40)
- Player: 陸小鳳 (player-2), level 3, experience 93, at (3, 1), health 42, stamina 9.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-40-player-2-270",
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
          "row": 3,
          "column": 1
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:36.131Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 187 (round 40)
- Player: 陸小鳳 (player-2), level 3, experience 93, at (2, 1), health 42, stamina 7.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-40-player-2-271",
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
          "row": 2,
          "column": 1
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:36.138Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 188 (round 40)
- Player: 陸小鳳 (player-2), level 3, experience 93, at (1, 1), health 42, stamina 5.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-40-player-2-272",
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
          "row": 1,
          "column": 1
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:36.144Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 189 (round 40)
- Player: 陸小鳳 (player-2), level 3, experience 93, at (2, 1), health 42, stamina 3.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-40-player-2-273",
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
          "row": 2,
          "column": 1
        },
        "reason": "定位：前往出口 (2,1)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (2,1)",
      "createdAt": "2026-09-01T19:26:36.152Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 190 (round 40)
- Player: 陸小鳳 (player-2), level 3, experience 93, at (2, 2), health 42, stamina 1.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-40-player-2-274",
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
          "row": 2,
          "column": 2
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:36.159Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 191 (round 41)
- Player: 陸小鳳 (player-2), level 3, experience 96, at (2, 2), health 42, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-40-nest-creature-1-275",
      "round": 40,
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
      "createdAt": "2026-09-01T19:26:36.161Z"
    },
    {
      "id": "action-40-nest-creature-4-276",
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
      "createdAt": "2026-09-01T19:26:36.161Z"
    },
    {
      "id": "action-41-player-2-277",
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
      "createdAt": "2026-09-01T19:26:36.161Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 192 (round 41)
- Player: 陸小鳳 (player-2), level 3, experience 96, at (2, 2), health 42, stamina 8.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-41-player-2-278",
      "round": 41,
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
      "createdAt": "2026-09-01T19:26:36.167Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 193 (round 41)
- Player: 陸小鳳 (player-2), level 3, experience 96, at (2, 2), health 42, stamina 5.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-41-player-2-279",
      "round": 41,
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
      "createdAt": "2026-09-01T19:26:36.172Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 194 (round 41)
- Player: 陸小鳳 (player-2), level 3, experience 96, at (2, 2), health 42, stamina 2.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-41-player-2-280",
      "round": 41,
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
      "createdAt": "2026-09-01T19:26:36.176Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 195 (round 41)
- Player: 陸小鳳 (player-2), level 3, experience 96, at (2, 3), health 42, stamina 0.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-41-player-2-281",
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
          "row": 2,
          "column": 3
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:26:36.181Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 196 (round 42)
- Player: 陸小鳳 (player-2), level 3, experience 97, at (2, 3), health 42, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-41-nest-creature-1-282",
      "round": 41,
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
      "createdAt": "2026-09-01T19:26:36.183Z"
    },
    {
      "id": "action-41-nest-creature-4-283",
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
      "createdAt": "2026-09-01T19:26:36.183Z"
    },
    {
      "id": "action-42-player-2-284",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T19:26:36.184Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 197 (round 42)
- Player: 陸小鳳 (player-2), level 3, experience 97, at (1, 3), health 42, stamina 6.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-42-player-2-285",
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
          "row": 1,
          "column": 3
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:36.190Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 198 (round 42)
- Player: 陸小鳳 (player-2), level 3, experience 97, at (1, 3), health 42, stamina 3.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-42-player-2-286",
      "round": 42,
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
      "createdAt": "2026-09-01T19:26:36.196Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 199 (round 42)
- Player: 陸小鳳 (player-2), level 3, experience 97, at (2, 3), health 42, stamina 1.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-42-player-2-287",
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
          "row": 2,
          "column": 3
        },
        "reason": "定位：前往出口 (2,3)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (2,3)",
      "createdAt": "2026-09-01T19:26:36.203Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 200 (round 43)
- Player: 陸小鳳 (player-2), level 3, experience 100, at (2, 3), health 42, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-42-nest-creature-1-288",
      "round": 42,
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
      "createdAt": "2026-09-01T19:26:36.205Z"
    },
    {
      "id": "action-42-nest-creature-4-289",
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
      "createdAt": "2026-09-01T19:26:36.205Z"
    },
    {
      "id": "action-43-player-2-290",
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
      "createdAt": "2026-09-01T19:26:36.206Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 201 (round 43)
- Player: 陸小鳳 (player-2), level 3, experience 100, at (2, 4), health 42, stamina 9.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-43-player-2-291",
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
          "row": 2,
          "column": 4
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:36.212Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 202 (round 43)
- Player: 陸小鳳 (player-2), level 3, experience 100, at (2, 5), health 42, stamina 7.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-43-player-2-292",
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
          "row": 2,
          "column": 5
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:36.221Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 203 (round 43)
- Player: 陸小鳳 (player-2), level 3, experience 100, at (2, 6), health 42, stamina 5.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-43-player-2-293",
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
          "row": 2,
          "column": 6
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:36.228Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 204 (round 43)
- Player: 陸小鳳 (player-2), level 3, experience 100, at (1, 6), health 42, stamina 3.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-43-player-2-294",
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
          "row": 1,
          "column": 6
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:36.234Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 205 (round 43)
- Player: 陸小鳳 (player-2), level 3, experience 100, at (2, 6), health 42, stamina 1.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-43-player-2-295",
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
          "row": 2,
          "column": 6
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:36.240Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 206 (round 44)
- Player: 陸小鳳 (player-2), level 3, experience 103, at (2, 6), health 42, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-43-nest-creature-1-296",
      "round": 43,
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
      "createdAt": "2026-09-01T19:26:36.242Z"
    },
    {
      "id": "action-43-nest-creature-4-297",
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
      "createdAt": "2026-09-01T19:26:36.242Z"
    },
    {
      "id": "action-44-player-2-298",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T19:26:36.243Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 207 (round 44)
- Player: 陸小鳳 (player-2), level 3, experience 103, at (3, 6), health 42, stamina 6.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-44-player-2-299",
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
          "row": 3,
          "column": 6
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:36.248Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 208 (round 44)
- Player: 陸小鳳 (player-2), level 3, experience 103, at (3, 5), health 42, stamina 4.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-44-player-2-300",
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
          "row": 3,
          "column": 5
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:36.253Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 209 (round 44)
- Player: 陸小鳳 (player-2), level 3, experience 103, at (2, 5), health 42, stamina 2.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-44-player-2-301",
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
          "row": 2,
          "column": 5
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:36.259Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 210 (round 44)
- Player: 陸小鳳 (player-2), level 3, experience 103, at (2, 4), health 42, stamina 0.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-44-player-2-302",
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
          "row": 2,
          "column": 4
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:26:36.264Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 211 (round 45)
- Player: 陸小鳳 (player-2), level 3, experience 104, at (2, 4), health 42, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-44-nest-creature-1-303",
      "round": 44,
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
      "createdAt": "2026-09-01T19:26:36.266Z"
    },
    {
      "id": "action-44-nest-creature-4-304",
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
      "createdAt": "2026-09-01T19:26:36.266Z"
    },
    {
      "id": "action-45-player-2-305",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T19:26:36.266Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 212 (round 45)
- Player: 陸小鳳 (player-2), level 3, experience 104, at (2, 3), health 42, stamina 9.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-45-player-2-306",
      "round": 45,
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
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:36.274Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 213 (round 45)
- Player: 陸小鳳 (player-2), level 3, experience 104, at (2, 2), health 42, stamina 7.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-45-player-2-307",
      "round": 45,
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
      "createdAt": "2026-09-01T19:26:36.281Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 214 (round 45)
- Player: 陸小鳳 (player-2), level 3, experience 104, at (2, 2), health 42, stamina 4.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-45-player-2-308",
      "round": 45,
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
      "createdAt": "2026-09-01T19:26:36.286Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 215 (round 45)
- Player: 陸小鳳 (player-2), level 3, experience 104, at (2, 2), health 42, stamina 1.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-45-player-2-309",
      "round": 45,
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
      "createdAt": "2026-09-01T19:26:36.291Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 216 (round 46)
- Player: 陸小鳳 (player-2), level 3, experience 107, at (2, 2), health 42, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +3
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-45-nest-creature-1-310",
      "round": 45,
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
      "createdAt": "2026-09-01T19:26:36.293Z"
    },
    {
      "id": "action-45-nest-creature-4-311",
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
      "createdAt": "2026-09-01T19:26:36.293Z"
    },
    {
      "id": "action-46-player-2-312",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T19:26:36.293Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "creature-nest-1",
      "creatureName": "生物巢穴 1",
      "message": "生物巢穴 1 生成了 Lv.5 怪物。"
    }
  ],
  "spawnedCreatures": [
    {
      "id": "nest-creature-2",
      "name": "生物巢穴 1的怪物 Lv.5",
      "innerSkillId": "golden-body-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 1,
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

### Turn 217 (round 46)
- Player: 陸小鳳 (player-2), level 3, experience 107, at (2, 2), health 42, stamina 8.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-46-player-2-313",
      "round": 46,
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
      "createdAt": "2026-09-01T19:26:36.299Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 218 (round 46)
- Player: 陸小鳳 (player-2), level 3, experience 107, at (2, 2), health 42, stamina 5.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-46-player-2-314",
      "round": 46,
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
      "createdAt": "2026-09-01T19:26:36.303Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 219 (round 46)
- Player: 陸小鳳 (player-2), level 3, experience 107, at (2, 2), health 42, stamina 2.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-46-player-2-315",
      "round": 46,
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
      "createdAt": "2026-09-01T19:26:36.308Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 220 (round 46)
- Player: 陸小鳳 (player-2), level 3, experience 107, at (3, 2), health 42, stamina 0.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-46-player-2-316",
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
          "column": 2
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T19:26:36.312Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 221 (round 47)
- Player: 陸小鳳 (player-2), level 3, experience 108, at (3, 2), health 42, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-46-nest-creature-1-317",
      "round": 46,
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
      "createdAt": "2026-09-01T19:26:36.314Z"
    },
    {
      "id": "action-46-nest-creature-4-318",
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
      "createdAt": "2026-09-01T19:26:36.314Z"
    },
    {
      "id": "action-46-nest-creature-2-319",
      "round": 46,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T19:26:36.314Z"
    },
    {
      "id": "action-47-player-2-320",
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
      "createdAt": "2026-09-01T19:26:36.315Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 222 (round 47)
- Player: 陸小鳳 (player-2), level 3, experience 108, at (3, 1), health 42, stamina 9.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-47-player-2-321",
      "round": 47,
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
      "createdAt": "2026-09-01T19:26:36.321Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 223 (round 47)
- Player: 陸小鳳 (player-2), level 3, experience 108, at (2, 1), health 42, stamina 7.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-47-player-2-322",
      "round": 47,
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
      "createdAt": "2026-09-01T19:26:36.327Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 224 (round 47)
- Player: 陸小鳳 (player-2), level 3, experience 108, at (1, 1), health 42, stamina 5.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-47-player-2-323",
      "round": 47,
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
      "createdAt": "2026-09-01T19:26:36.334Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 225 (round 47)
- Player: 陸小鳳 (player-2), level 3, experience 108, at (2, 1), health 42, stamina 3.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-47-player-2-324",
      "round": 47,
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
      "createdAt": "2026-09-01T19:26:36.342Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 226 (round 47)
- Player: 陸小鳳 (player-2), level 3, experience 108, at (2, 2), health 42, stamina 1.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-47-player-2-325",
      "round": 47,
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
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:36.349Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 227 (round 48)
- Player: 陸小鳳 (player-2), level 3, experience 111, at (2, 2), health 42, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-47-nest-creature-1-326",
      "round": 47,
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
      "createdAt": "2026-09-01T19:26:36.352Z"
    },
    {
      "id": "action-47-nest-creature-4-327",
      "round": 47,
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
      "createdAt": "2026-09-01T19:26:36.352Z"
    },
    {
      "id": "action-47-nest-creature-2-328",
      "round": 47,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T19:26:36.352Z"
    },
    {
      "id": "action-48-player-2-329",
      "round": 48,
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
      "createdAt": "2026-09-01T19:26:36.352Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 228 (round 48)
- Player: 陸小鳳 (player-2), level 3, experience 111, at (2, 2), health 42, stamina 8.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-48-player-2-330",
      "round": 48,
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
      "createdAt": "2026-09-01T19:26:36.357Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 229 (round 48)
- Player: 陸小鳳 (player-2), level 3, experience 111, at (2, 2), health 42, stamina 5.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-48-player-2-331",
      "round": 48,
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
      "createdAt": "2026-09-01T19:26:36.361Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 230 (round 48)
- Player: 陸小鳳 (player-2), level 3, experience 111, at (2, 2), health 42, stamina 2.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-48-player-2-332",
      "round": 48,
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
      "createdAt": "2026-09-01T19:26:36.367Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 231 (round 48)
- Player: 陸小鳳 (player-2), level 3, experience 111, at (2, 3), health 42, stamina 0.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-48-player-2-333",
      "round": 48,
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
      "createdAt": "2026-09-01T19:26:36.371Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 232 (round 49)
- Player: 陸小鳳 (player-2), level 3, experience 112, at (2, 3), health 42, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-48-nest-creature-1-334",
      "round": 48,
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
      "createdAt": "2026-09-01T19:26:36.373Z"
    },
    {
      "id": "action-48-nest-creature-4-335",
      "round": 48,
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
      "createdAt": "2026-09-01T19:26:36.373Z"
    },
    {
      "id": "action-48-nest-creature-2-336",
      "round": 48,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T19:26:36.373Z"
    },
    {
      "id": "action-49-player-2-337",
      "round": 49,
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
      "createdAt": "2026-09-01T19:26:36.373Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 233 (round 49)
- Player: 陸小鳳 (player-2), level 3, experience 112, at (1, 3), health 42, stamina 6.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-49-player-2-338",
      "round": 49,
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
          "column": 3
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:36.380Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 234 (round 49)
- Player: 陸小鳳 (player-2), level 3, experience 112, at (1, 3), health 42, stamina 3.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-49-player-2-339",
      "round": 49,
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
      "createdAt": "2026-09-01T19:26:36.386Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 235 (round 49)
- Player: 陸小鳳 (player-2), level 3, experience 112, at (2, 3), health 42, stamina 1.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-49-player-2-340",
      "round": 49,
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
        "reason": "定位：前往出口 (2,3)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (2,3)",
      "createdAt": "2026-09-01T19:26:36.392Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 236 (round 50)
- Player: 陸小鳳 (player-2), level 3, experience 115, at (2, 3), health 42, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-49-nest-creature-1-341",
      "round": 49,
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
      "createdAt": "2026-09-01T19:26:36.394Z"
    },
    {
      "id": "action-49-nest-creature-4-342",
      "round": 49,
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
      "createdAt": "2026-09-01T19:26:36.394Z"
    },
    {
      "id": "action-49-nest-creature-2-343",
      "round": 49,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T19:26:36.394Z"
    },
    {
      "id": "action-50-player-2-344",
      "round": 50,
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
      "createdAt": "2026-09-01T19:26:36.394Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 237 (round 50)
- Player: 陸小鳳 (player-2), level 3, experience 115, at (2, 4), health 42, stamina 9.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-50-player-2-345",
      "round": 50,
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
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T19:26:36.401Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 238 (round 50)
- Player: 陸小鳳 (player-2), level 3, experience 115, at (2, 5), health 42, stamina 7.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-50-player-2-346",
      "round": 50,
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
      "createdAt": "2026-09-01T19:26:36.409Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 239 (round 50)
- Player: 陸小鳳 (player-2), level 3, experience 115, at (2, 6), health 42, stamina 5.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-50-player-2-347",
      "round": 50,
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
      "createdAt": "2026-09-01T19:26:36.416Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 240 (round 50)
- Player: 陸小鳳 (player-2), level 3, experience 115, at (1, 6), health 42, stamina 3.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-50-player-2-348",
      "round": 50,
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
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:36.422Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 241 (round 50)
- Player: 陸小鳳 (player-2), level 3, experience 115, at (2, 6), health 42, stamina 1.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-50-player-2-349",
      "round": 50,
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
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:36.428Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 242 (round 51)
- Player: 陸小鳳 (player-2), level 3, experience 118, at (2, 6), health 42, stamina 11.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-50-nest-creature-1-350",
      "round": 50,
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
      "createdAt": "2026-09-01T19:26:36.431Z"
    },
    {
      "id": "action-50-nest-creature-4-351",
      "round": 50,
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T19:26:36.431Z"
    },
    {
      "id": "action-50-nest-creature-2-352",
      "round": 50,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T19:26:36.431Z"
    },
    {
      "id": "action-51-player-2-353",
      "round": 51,
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
      "createdAt": "2026-09-01T19:26:36.431Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 243 (round 51)
- Player: 陸小鳳 (player-2), level 3, experience 121, at (2, 6), health 42, stamina 6.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-51-player-2-354",
      "round": 51,
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
          "id": "nest-creature-4",
          "kind": "creature",
          "position": {
            "row": 2,
            "column": 7
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.4"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.4",
      "createdAt": "2026-09-01T19:26:36.438Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 244 (round 51)
- Player: 陸小鳳 (player-2), level 4, experience 51, at (2, 6), health 42, stamina 1.5
- Attributes: armStrength=15, constitution=14, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 35
- Stored experience change: -70 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: nest-creature-4
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-51-player-2-355",
      "round": 51,
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
          "id": "nest-creature-4",
          "kind": "creature",
          "position": {
            "row": 2,
            "column": 7
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.4"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.4",
      "createdAt": "2026-09-01T19:26:36.445Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 245 (round 51)
- Player: 陸小鳳 (player-2), level 4, experience 51, at (2, 6), health 42, stamina 1.5
- Attributes: armStrength=15, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-51-player-2-356",
      "round": 51,
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
      "createdAt": "2026-09-01T19:26:36.448Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 246 (round 51)
- Player: 陸小鳳 (player-2), level 4, experience 51, at (2, 6), health 42, stamina 1.5
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-51-player-2-357",
      "round": 51,
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
      "createdAt": "2026-09-01T19:26:36.451Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 247 (round 52)
- Player: 陸小鳳 (player-2), level 4, experience 54, at (2, 6), health 44.25, stamina 12
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-51-nest-creature-1-358",
      "round": 51,
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
      "createdAt": "2026-09-01T19:26:36.454Z"
    },
    {
      "id": "action-51-nest-creature-2-359",
      "round": 51,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T19:26:36.454Z"
    },
    {
      "id": "action-52-player-2-360",
      "round": 52,
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
      "createdAt": "2026-09-01T19:26:36.454Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 248 (round 52)
- Player: 陸小鳳 (player-2), level 4, experience 54, at (3, 6), health 44.25, stamina 7
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-52-player-2-361",
      "round": 52,
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T19:26:36.462Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 249 (round 52)
- Player: 陸小鳳 (player-2), level 4, experience 54, at (3, 5), health 44.25, stamina 5
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-52-player-2-362",
      "round": 52,
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T19:26:36.469Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 250 (round 52)
- Player: 陸小鳳 (player-2), level 4, experience 54, at (4, 5), health 44.25, stamina 0
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-52-player-2-363",
      "round": 52,
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T19:26:36.478Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 251 (round 53)
- Player: 陸小鳳 (player-2), level 4, experience 54, at (4, 5), health 45, stamina 12
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-52-nest-creature-1-364",
      "round": 52,
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
      "createdAt": "2026-09-01T19:26:36.478Z"
    },
    {
      "id": "action-52-nest-creature-2-365",
      "round": 52,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T19:26:36.478Z"
    },
    {
      "id": "action-53-player-2-366",
      "round": 53,
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
      "createdAt": "2026-09-01T19:26:36.478Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 252 (round 53)
- Player: 陸小鳳 (player-2), level 4, experience 54, at (5, 5), health 45, stamina 7
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-53-player-2-367",
      "round": 53,
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
      "createdAt": "2026-09-01T19:26:36.486Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 253 (round 53)
- Player: 陸小鳳 (player-2), level 4, experience 54, at (5, 5), health 45, stamina 4
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-53-player-2-368",
      "round": 53,
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
      "createdAt": "2026-09-01T19:26:36.491Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 254 (round 53)
- Player: 陸小鳳 (player-2), level 4, experience 54, at (6, 5), health 45, stamina 1
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-53-player-2-369",
      "round": 53,
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
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:36.497Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 255 (round 54)
- Player: 陸小鳳 (player-2), level 4, experience 56, at (6, 5), health 45, stamina 12
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-53-nest-creature-1-370",
      "round": 53,
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
      "createdAt": "2026-09-01T19:26:36.499Z"
    },
    {
      "id": "action-53-nest-creature-2-371",
      "round": 53,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T19:26:36.499Z"
    },
    {
      "id": "action-54-player-2-372",
      "round": 54,
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
      "createdAt": "2026-09-01T19:26:36.500Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 256 (round 54)
- Player: 陸小鳳 (player-2), level 4, experience 56, at (6, 6), health 45, stamina 7
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-54-player-2-373",
      "round": 54,
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
      "createdAt": "2026-09-01T19:26:36.507Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 257 (round 54)
- Player: 陸小鳳 (player-2), level 4, experience 56, at (6, 6), health 45, stamina 4
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-54-player-2-374",
      "round": 54,
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
      "createdAt": "2026-09-01T19:26:36.511Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 258 (round 54)
- Player: 陸小鳳 (player-2), level 4, experience 56, at (6, 7), health 45, stamina 2
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-54-player-2-375",
      "round": 54,
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
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:36.517Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 259 (round 55)
- Player: 陸小鳳 (player-2), level 4, experience 60, at (6, 7), health 45, stamina 12
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-54-nest-creature-1-376",
      "round": 54,
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
      "createdAt": "2026-09-01T19:26:36.519Z"
    },
    {
      "id": "action-54-nest-creature-2-377",
      "round": 54,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T19:26:36.519Z"
    },
    {
      "id": "action-55-player-2-378",
      "round": 55,
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
      "createdAt": "2026-09-01T19:26:36.519Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 260 (round 55)
- Player: 陸小鳳 (player-2), level 4, experience 60, at (6, 8), health 45, stamina 10
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-55-player-2-379",
      "round": 55,
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
      "createdAt": "2026-09-01T19:26:36.525Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 261 (round 55)
- Player: 陸小鳳 (player-2), level 4, experience 60, at (5, 8), health 45, stamina 8
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-55-player-2-380",
      "round": 55,
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
      "createdAt": "2026-09-01T19:26:36.530Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 262 (round 55)
- Player: 陸小鳳 (player-2), level 4, experience 60, at (4, 8), health 45, stamina 6
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-55-player-2-381",
      "round": 55,
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
      "createdAt": "2026-09-01T19:26:36.536Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 263 (round 55)
- Player: 陸小鳳 (player-2), level 4, experience 60, at (4, 7), health 45, stamina 4
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-55-player-2-382",
      "round": 55,
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
      "createdAt": "2026-09-01T19:26:36.541Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 264 (round 55)
- Player: 陸小鳳 (player-2), level 4, experience 60, at (3, 7), health 45, stamina 2
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-55-player-2-383",
      "round": 55,
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
      "createdAt": "2026-09-01T19:26:36.547Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 265 (round 56)
- Player: 陸小鳳 (player-2), level 4, experience 64, at (3, 7), health 45, stamina 12
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-55-nest-creature-1-384",
      "round": 55,
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
      "createdAt": "2026-09-01T19:26:36.549Z"
    },
    {
      "id": "action-55-nest-creature-2-385",
      "round": 55,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T19:26:36.549Z"
    },
    {
      "id": "action-56-player-2-386",
      "round": 56,
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
      "createdAt": "2026-09-01T19:26:36.549Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 266 (round 56)
- Player: 陸小鳳 (player-2), level 4, experience 64, at (3, 6), health 45, stamina 7
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-56-player-2-387",
      "round": 56,
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
      "createdAt": "2026-09-01T19:26:36.554Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 267 (round 56)
- Player: 陸小鳳 (player-2), level 4, experience 64, at (3, 5), health 45, stamina 5
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-56-player-2-388",
      "round": 56,
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
      "createdAt": "2026-09-01T19:26:36.560Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 268 (round 56)
- Player: 陸小鳳 (player-2), level 4, experience 64, at (4, 5), health 45, stamina 0
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-56-player-2-389",
      "round": 56,
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
      "createdAt": "2026-09-01T19:26:36.568Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 269 (round 57)
- Player: 陸小鳳 (player-2), level 4, experience 64, at (4, 5), health 45, stamina 12
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-56-nest-creature-1-390",
      "round": 56,
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
      "createdAt": "2026-09-01T19:26:36.569Z"
    },
    {
      "id": "action-56-nest-creature-2-391",
      "round": 56,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T19:26:36.569Z"
    },
    {
      "id": "action-57-player-2-392",
      "round": 57,
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
      "createdAt": "2026-09-01T19:26:36.569Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 270 (round 57)
- Player: 陸小鳳 (player-2), level 4, experience 64, at (5, 5), health 45, stamina 7
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-57-player-2-393",
      "round": 57,
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
      "createdAt": "2026-09-01T19:26:36.575Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 271 (round 57)
- Player: 陸小鳳 (player-2), level 4, experience 64, at (5, 5), health 45, stamina 4
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-57-player-2-394",
      "round": 57,
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
      "createdAt": "2026-09-01T19:26:36.579Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 272 (round 57)
- Player: 陸小鳳 (player-2), level 4, experience 64, at (6, 5), health 45, stamina 1
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-57-player-2-395",
      "round": 57,
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
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:36.584Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 273 (round 58)
- Player: 陸小鳳 (player-2), level 4, experience 66, at (6, 5), health 45, stamina 12
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-57-nest-creature-1-396",
      "round": 57,
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
      "createdAt": "2026-09-01T19:26:36.586Z"
    },
    {
      "id": "action-57-nest-creature-2-397",
      "round": 57,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T19:26:36.586Z"
    },
    {
      "id": "action-58-player-2-398",
      "round": 58,
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
      "createdAt": "2026-09-01T19:26:36.586Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 274 (round 58)
- Player: 陸小鳳 (player-2), level 4, experience 66, at (6, 6), health 45, stamina 7
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-58-player-2-399",
      "round": 58,
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
      "createdAt": "2026-09-01T19:26:36.592Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 275 (round 58)
- Player: 陸小鳳 (player-2), level 4, experience 66, at (6, 6), health 45, stamina 4
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-58-player-2-400",
      "round": 58,
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
      "createdAt": "2026-09-01T19:26:36.596Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 276 (round 58)
- Player: 陸小鳳 (player-2), level 4, experience 66, at (6, 7), health 45, stamina 2
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-58-player-2-401",
      "round": 58,
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
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T19:26:36.601Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 277 (round 59)
- Player: 陸小鳳 (player-2), level 4, experience 70, at (6, 7), health 45, stamina 12
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-58-nest-creature-1-402",
      "round": 58,
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
      "createdAt": "2026-09-01T19:26:36.603Z"
    },
    {
      "id": "action-58-nest-creature-2-403",
      "round": 58,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T19:26:36.603Z"
    },
    {
      "id": "action-59-player-2-404",
      "round": 59,
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
      "createdAt": "2026-09-01T19:26:36.603Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 278 (round 59)
- Player: 陸小鳳 (player-2), level 4, experience 70, at (6, 8), health 45, stamina 10
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-59-player-2-405",
      "round": 59,
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
      "createdAt": "2026-09-01T19:26:36.609Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 279 (round 59)
- Player: 陸小鳳 (player-2), level 4, experience 70, at (5, 8), health 45, stamina 8
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-59-player-2-406",
      "round": 59,
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
      "createdAt": "2026-09-01T19:26:36.614Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 280 (round 59)
- Player: 陸小鳳 (player-2), level 4, experience 70, at (4, 8), health 45, stamina 6
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-59-player-2-407",
      "round": 59,
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
      "createdAt": "2026-09-01T19:26:36.619Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 281 (round 59)
- Player: 陸小鳳 (player-2), level 4, experience 70, at (4, 7), health 45, stamina 4
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-59-player-2-408",
      "round": 59,
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
      "createdAt": "2026-09-01T19:26:36.625Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 282 (round 59)
- Player: 陸小鳳 (player-2), level 4, experience 70, at (3, 7), health 45, stamina 2
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-59-player-2-409",
      "round": 59,
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
      "createdAt": "2026-09-01T19:26:36.632Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 283 (round 59)
- Player: 陸小鳳 (player-2), level 4, experience 70, at (4, 7), health 45, stamina 0
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-59-player-2-410",
      "round": 59,
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
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.1（hitsSurvivable=9）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.1（hitsSurvivable=9）",
      "createdAt": "2026-09-01T19:26:36.636Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 284 (round 60)
- Player: 陸小鳳 (player-2), level 4, experience 70, at (4, 7), health 45, stamina 12
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-59-nest-creature-1-411",
      "round": 59,
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
      "createdAt": "2026-09-01T19:26:36.637Z"
    },
    {
      "id": "action-59-nest-creature-2-412",
      "round": 59,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T19:26:36.637Z"
    },
    {
      "id": "action-60-player-2-413",
      "round": 60,
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
      "createdAt": "2026-09-01T19:26:36.637Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "creature-nest-1",
      "creatureName": "生物巢穴 1",
      "message": "生物巢穴 1 生成了 Lv.6 怪物。"
    }
  ],
  "spawnedCreatures": [
    {
      "id": "nest-creature-3",
      "name": "生物巢穴 1的怪物 Lv.6",
      "innerSkillId": "golden-body-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 1,
        "column": 13
      },
      "attributes": {
        "armStrength": 20,
        "constitution": 19,
        "agility": 5,
        "innerEnergy": 11,
        "insight": 7
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 6,
      "behaviorType": "wanderer",
      "schoolId": "golden-body",
      "homePosition": {
        "row": 2,
        "column": 13
      },
      "homeNestId": "creature-nest-1",
      "spawnedRound": 60,
      "baseAttributes": {
        "armStrength": 18.2,
        "constitution": 18.2,
        "agility": 5,
        "innerEnergy": 11.2,
        "insight": 7.699999999999999
      },
      "health": 57,
      "maxHealth": 57,
      "stamina": 12.5,
      "maxStamina": 12.5,
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

### Turn 285 (round 60)
- Player: 陸小鳳 (player-2), level 4, experience 73, at (4, 7), health 45, stamina 7
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-60-player-2-414",
      "round": 60,
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
            "row": 4,
            "column": 8
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-01T19:26:36.643Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 286 (round 60)
- Player: 陸小鳳 (player-2), level 4, experience 93, at (4, 7), health 45, stamina 2
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: nest-creature-1
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-60-player-2-415",
      "round": 60,
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
            "row": 4,
            "column": 8
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-01T19:26:36.650Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 287 (round 60)
- Player: 陸小鳳 (player-2), level 4, experience 93, at (3, 7), health 45, stamina 0
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-60-player-2-416",
      "round": 60,
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
      "createdAt": "2026-09-01T19:26:36.654Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 288 (round 61)
- Player: 陸小鳳 (player-2), level 4, experience 93, at (3, 7), health 31.25, stamina 12
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-60-nest-creature-2-417",
      "round": 60,
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
            "row": 3,
            "column": 7
          }
        },
        "reason": "與 陸小鳳 交戰。"
      },
      "result": "succeeded",
      "reason": "與 陸小鳳 交戰。",
      "createdAt": "2026-09-01T19:26:36.655Z"
    },
    {
      "id": "action-60-nest-creature-3-418",
      "round": 60,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.6"
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
      "createdAt": "2026-09-01T19:26:36.655Z"
    },
    {
      "id": "action-61-player-2-419",
      "round": 61,
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
      "createdAt": "2026-09-01T19:26:36.655Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 289 (round 61)
- Player: 陸小鳳 (player-2), level 4, experience 96, at (3, 7), health 31.25, stamina 7
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 4, damage 37
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-61-player-2-420",
      "round": 61,
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
            "row": 3,
            "column": 8
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.5"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.5",
      "createdAt": "2026-09-01T19:26:36.660Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 290 (round 61)
- Player: 陸小鳳 (player-2), level 4, experience 196, at (3, 7), health 31.25, stamina 2
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 5, damage 45
- Stored experience change: +100
- Spawned creatures: 0
- Defeated creatures: nest-creature-2
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-61-player-2-421",
      "round": 61,
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
            "row": 3,
            "column": 8
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.5"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.5",
      "createdAt": "2026-09-01T19:26:36.666Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 291 (round 62)
- Player: 陸小鳳 (player-2), level 5, experience 0, at (3, 7), health 33.5, stamina 12
- Attributes: armStrength=16, constitution=15, agility=8, innerEnergy=9, insight=9
- Inner skill: 烈陽戰體 (blazing-sun-inner), level 5, damage 45
- Stored experience change: -196 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-61-nest-creature-3-422",
      "round": 61,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.6"
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
      "createdAt": "2026-09-01T19:26:36.669Z"
    },
    {
      "id": "action-62-player-2-423",
      "round": 62,
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
      "createdAt": "2026-09-01T19:26:36.669Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

