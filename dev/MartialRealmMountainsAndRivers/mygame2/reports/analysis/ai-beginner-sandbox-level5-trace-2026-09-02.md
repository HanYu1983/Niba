# AI Beginner Sandbox Level5 Trace

- AI turns: 135
- Final round: 38
- Game won: false
- Game over: false
- Remaining nests: 1

## Aggregate

- Action counts: move=56, end-turn=37, collect=11, practice-skill=11, attack=10, allocate-attribute=6, learn-skill=3, hold=3, use-item=2, equip-inner-skill=1
- Creatures spawned (total): 4
- Creatures defeated (total): 4
- Level-ups observed: 4
- Final player: level 5, experience 2, inner skill 黃土紮根 (yellow-earth-inner) lv.1 damage 10
- Final attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8

## Efficiency (KPI)

- 行動產出率 (productive): ███········· 27.1% (38/140)
- 擊殺效率 (kill/generate): ████████████ 1.00 (4/4)
- 擊殺成本 (attack/kill): 2.50 (10 次攻擊 / 4 擊殺)
- 經驗效率 (XP/turn): 0.01 (2 XP / 135 turns)

- Nest health (start → end): creature-nest-1=120→120

## Turn Trace

### Turn 1 (round 1)
- Player: 花滿樓 (player-2), level 1, experience 0, at (2, 1), health 24, stamina 4
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
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:33.867Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 2 (round 1)
- Player: 花滿樓 (player-2), level 1, experience 0, at (3, 1), health 24, stamina 0
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
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:33.880Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 3 (round 2)
- Player: 花滿樓 (player-2), level 1, experience 0, at (3, 1), health 24, stamina 8
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
      "id": "action-2-player-2-3",
      "round": 2,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:33.884Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 4 (round 2)
- Player: 花滿樓 (player-2), level 1, experience 0, at (4, 1), health 24, stamina 6
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
      "id": "action-2-player-2-4",
      "round": 2,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:33.899Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 5 (round 2)
- Player: 花滿樓 (player-2), level 1, experience 0, at (5, 1), health 24, stamina 1
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
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:33.911Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 6 (round 3)
- Player: 花滿樓 (player-2), level 1, experience 2, at (5, 1), health 24, stamina 8
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
      "id": "action-3-player-2-6",
      "round": 3,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:33.916Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 7 (round 3)
- Player: 花滿樓 (player-2), level 1, experience 2, at (6, 1), health 24, stamina 6
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
      "id": "action-3-player-2-7",
      "round": 3,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:33.930Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 8 (round 3)
- Player: 花滿樓 (player-2), level 1, experience 2, at (6, 1), health 24, stamina 3
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
      "id": "action-3-player-2-8",
      "round": 3,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "learn-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-4",
        "skillType": "inner",
        "skillId": "yellow-earth-inner",
        "reason": "學招：學習門派功法 黃土紮根"
      },
      "result": "succeeded",
      "reason": "學招：學習門派功法 黃土紮根",
      "createdAt": "2026-09-01T20:55:33.937Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 9 (round 3)
- Player: 花滿樓 (player-2), level 1, experience 2, at (6, 1), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-3-player-2-9",
      "round": 3,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "equip-inner-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "skillId": "yellow-earth-inner",
        "reason": "裝備功法：黃土紮根"
      },
      "result": "succeeded",
      "reason": "裝備功法：黃土紮根",
      "createdAt": "2026-09-01T20:55:33.943Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 10 (round 4)
- Player: 花滿樓 (player-2), level 1, experience 8, at (6, 1), health 25.5, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: +6
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-4-player-2-10",
      "round": 4,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.12:practice-skill, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.12:practice-skill, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:55:33.948Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 11 (round 4)
- Player: 花滿樓 (player-2), level 1, experience 8, at (5, 1), health 24, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-4-player-2-11",
      "round": 4,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "定位：前往出口 (5,1)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (5,1)",
      "createdAt": "2026-09-01T20:55:33.956Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 12 (round 4)
- Player: 花滿樓 (player-2), level 1, experience 8, at (5, 2), health 24, stamina 1.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-4-player-2-12",
      "round": 4,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 2
        },
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:55:33.966Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 13 (round 5)
- Player: 花滿樓 (player-2), level 1, experience 11, at (5, 2), health 25.5, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-5-player-2-13",
      "round": 5,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:33.971Z"
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
      "innerSkillId": "sharp-edge-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 8,
        "column": 3
      },
      "attributes": {
        "armStrength": 7,
        "constitution": 5,
        "agility": 6,
        "innerEnergy": 5,
        "insight": 5
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 1,
      "behaviorType": "sieger",
      "schoolId": "sharp-edge",
      "homePosition": {
        "row": 9,
        "column": 3
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
      "health": 15,
      "maxHealth": 15,
      "stamina": 6.5,
      "maxStamina": 6.5,
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

### Turn 14 (round 6)
- Player: 花滿樓 (player-2), level 1, experience 28, at (5, 2), health 27, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: +17
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-5-nest-creature-1-14",
      "round": 5,
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
      "createdAt": "2026-09-01T20:55:33.980Z"
    },
    {
      "id": "action-6-player-2-15",
      "round": 6,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:33.981Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 15 (round 6)
- Player: 花滿樓 (player-2), level 1, experience 31, at (5, 2), health 27, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-6-player-2-16",
      "round": 6,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
            "column": 3
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-01T20:55:33.992Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 16 (round 6)
- Player: 花滿樓 (player-2), level 1, experience 31, at (4, 2), health 24, stamina 1.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-6-player-2-17",
      "round": 6,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:55:34.000Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 17 (round 7)
- Player: 花滿樓 (player-2), level 1, experience 34, at (4, 2), health 25.5, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-6-nest-creature-1-18",
      "round": 6,
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
      "createdAt": "2026-09-01T20:55:34.004Z"
    },
    {
      "id": "action-7-player-2-19",
      "round": 7,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.005Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 18 (round 7)
- Player: 花滿樓 (player-2), level 1, experience 37, at (4, 2), health 25.5, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-7-player-2-20",
      "round": 7,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
            "column": 3
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-01T20:55:34.011Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 19 (round 7)
- Player: 花滿樓 (player-2), level 1, experience 37, at (5, 2), health 24, stamina 1.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-7-player-2-21",
      "round": 7,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 2
        },
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:55:34.019Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 20 (round 8)
- Player: 花滿樓 (player-2), level 1, experience 40, at (5, 2), health 25.5, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-7-nest-creature-1-22",
      "round": 7,
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
      "createdAt": "2026-09-01T20:55:34.023Z"
    },
    {
      "id": "action-8-player-2-23",
      "round": 8,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.023Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 21 (round 8)
- Player: 花滿樓 (player-2), level 2, experience 10, at (5, 2), health 25.5, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: -30 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: nest-creature-1
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-8-player-2-24",
      "round": 8,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
            "column": 3
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-01T20:55:34.030Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 22 (round 8)
- Player: 花滿樓 (player-2), level 2, experience 10, at (5, 2), health 25.5, stamina 3.5
- Attributes: armStrength=8, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-8-player-2-25",
      "round": 8,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.037Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 23 (round 8)
- Player: 花滿樓 (player-2), level 2, experience 10, at (5, 2), health 25.5, stamina 3.5
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-8-player-2-26",
      "round": 8,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.042Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 24 (round 8)
- Player: 花滿樓 (player-2), level 2, experience 10, at (4, 2), health 25.5, stamina 1.5
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-8-player-2-27",
      "round": 8,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:55:34.049Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 25 (round 9)
- Player: 花滿樓 (player-2), level 2, experience 13, at (4, 2), health 27.15, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-9-player-2-28",
      "round": 9,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.053Z"
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
      "id": "nest-creature-1",
      "name": "生物巢穴 1的怪物 Lv.2",
      "innerSkillId": "sharp-edge-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 8,
        "column": 3
      },
      "attributes": {
        "armStrength": 9,
        "constitution": 5,
        "agility": 8,
        "innerEnergy": 5,
        "insight": 5
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 2,
      "behaviorType": "sieger",
      "schoolId": "sharp-edge",
      "homePosition": {
        "row": 9,
        "column": 3
      },
      "homeNestId": "creature-nest-1",
      "spawnedRound": 9,
      "baseAttributes": {
        "armStrength": 7.699999999999999,
        "constitution": 5,
        "agility": 7,
        "innerEnergy": 5,
        "insight": 5
      },
      "health": 15,
      "maxHealth": 15,
      "stamina": 8.5,
      "maxStamina": 8.5,
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

### Turn 26 (round 9)
- Player: 花滿樓 (player-2), level 2, experience 13, at (3, 2), health 27.15, stamina 5
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-9-player-2-29",
      "round": 9,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "收集道具：移動到道具位置"
      },
      "result": "succeeded",
      "reason": "收集道具：移動到道具位置",
      "createdAt": "2026-09-01T20:55:34.059Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 27 (round 9)
- Player: 花滿樓 (player-2), level 2, experience 13, at (3, 2), health 27.15, stamina 5
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-9-player-2-30",
      "round": 9,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "collect",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "item-point-8",
          "kind": "item",
          "position": {
            "row": 3,
            "column": 2
          }
        },
        "reason": "收集道具：拾取"
      },
      "result": "succeeded",
      "reason": "收集道具：拾取",
      "createdAt": "2026-09-01T20:55:34.064Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 28 (round 10)
- Player: 花滿樓 (player-2), level 2, experience 23, at (3, 2), health 28.799999999999997, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +10
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-9-nest-creature-1-31",
      "round": 9,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 4,
          "column": 3
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-01T20:55:34.068Z"
    },
    {
      "id": "action-10-player-2-32",
      "round": 10,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.069Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 29 (round 10)
- Player: 花滿樓 (player-2), level 2, experience 23, at (3, 3), health 28.799999999999997, stamina 7
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-10-player-2-33",
      "round": 10,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "交戰：移動到 生物巢穴 1的怪物 Lv.2 附近"
      },
      "result": "succeeded",
      "reason": "交戰：移動到 生物巢穴 1的怪物 Lv.2 附近",
      "createdAt": "2026-09-01T20:55:34.076Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 30 (round 10)
- Player: 花滿樓 (player-2), level 2, experience 26, at (3, 3), health 28.799999999999997, stamina 2
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-10-player-2-34",
      "round": 10,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
            "column": 3
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.2"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.2",
      "createdAt": "2026-09-01T20:55:34.082Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 31 (round 10)
- Player: 花滿樓 (player-2), level 2, experience 26, at (3, 3), health 28.799999999999997, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-10-player-2-35",
      "round": 10,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "use-item",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "itemId": "gather-qi-talisman",
        "reason": "使用道具：聚氣符"
      },
      "result": "succeeded",
      "reason": "使用道具：聚氣符",
      "createdAt": "2026-09-01T20:55:34.088Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 32 (round 10)
- Player: 花滿樓 (player-2), level 2, experience 66, at (3, 3), health 28.799999999999997, stamina 4
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +40
- Spawned creatures: 0
- Defeated creatures: nest-creature-1
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-10-player-2-36",
      "round": 10,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
            "column": 3
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.2"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.2",
      "createdAt": "2026-09-01T20:55:34.094Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 33 (round 11)
- Player: 花滿樓 (player-2), level 2, experience 74, at (3, 3), health 30.449999999999996, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +8
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-11-player-2-37",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.096Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 34 (round 11)
- Player: 花滿樓 (player-2), level 2, experience 94, at (3, 3), health 30.449999999999996, stamina 4
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-11-player-2-38",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
            "row": 3,
            "column": 4
          }
        },
        "reason": "清障：清除廢墟 竹溪村"
      },
      "result": "succeeded",
      "reason": "清障：清除廢墟 竹溪村",
      "createdAt": "2026-09-01T20:55:34.100Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 35 (round 11)
- Player: 花滿樓 (player-2), level 2, experience 94, at (4, 3), health 30.449999999999996, stamina 2
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-11-player-2-39",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:55:34.108Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 36 (round 11)
- Player: 花滿樓 (player-2), level 2, experience 94, at (3, 3), health 30.449999999999996, stamina 0
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-11-player-2-40",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:55:34.115Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 37 (round 12)
- Player: 花滿樓 (player-2), level 2, experience 94, at (3, 3), health 32.099999999999994, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-12-player-2-41",
      "round": 12,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.116Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 38 (round 12)
- Player: 花滿樓 (player-2), level 2, experience 94, at (3, 4), health 32.099999999999994, stamina 4
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-12-player-2-42",
      "round": 12,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.123Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 39 (round 12)
- Player: 花滿樓 (player-2), level 2, experience 94, at (3, 3), health 32.099999999999994, stamina 2
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-12-player-2-43",
      "round": 12,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.129Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 40 (round 12)
- Player: 花滿樓 (player-2), level 2, experience 94, at (2, 3), health 32.099999999999994, stamina 0
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-12-player-2-44",
      "round": 12,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:55:34.135Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 41 (round 13)
- Player: 花滿樓 (player-2), level 2, experience 94, at (2, 3), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-13-player-2-45",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.135Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 42 (round 13)
- Player: 花滿樓 (player-2), level 2, experience 94, at (1, 3), health 33, stamina 7
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-13-player-2-46",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T20:55:34.141Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 43 (round 13)
- Player: 花滿樓 (player-2), level 2, experience 94, at (1, 2), health 33, stamina 5
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-13-player-2-47",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 1,
          "column": 2
        },
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:55:34.149Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 44 (round 13)
- Player: 花滿樓 (player-2), level 2, experience 94, at (2, 2), health 33, stamina 1
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-13-player-2-48",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:55:34.161Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 45 (round 14)
- Player: 花滿樓 (player-2), level 2, experience 96, at (2, 2), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-14-player-2-49",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.165Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 46 (round 14)
- Player: 花滿樓 (player-2), level 2, experience 96, at (3, 2), health 33, stamina 5
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-14-player-2-50",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T20:55:34.172Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 47 (round 14)
- Player: 花滿樓 (player-2), level 2, experience 96, at (4, 2), health 33, stamina 3
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-14-player-2-51",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:55:34.180Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 48 (round 14)
- Player: 花滿樓 (player-2), level 2, experience 96, at (4, 3), health 33, stamina 1
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-14-player-2-52",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:55:34.188Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 49 (round 15)
- Player: 花滿樓 (player-2), level 2, experience 98, at (4, 3), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-15-player-2-53",
      "round": 15,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.191Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 50 (round 15)
- Player: 花滿樓 (player-2), level 2, experience 98, at (4, 4), health 33, stamina 4
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-15-player-2-54",
      "round": 15,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T20:55:34.197Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 51 (round 15)
- Player: 花滿樓 (player-2), level 2, experience 98, at (4, 5), health 33, stamina 2
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-15-player-2-55",
      "round": 15,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T20:55:34.204Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 52 (round 16)
- Player: 花滿樓 (player-2), level 3, experience 2, at (4, 5), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: -96 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-56",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.207Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 53 (round 16)
- Player: 花滿樓 (player-2), level 3, experience 2, at (4, 5), health 33, stamina 9
- Attributes: armStrength=10, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-57",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.212Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 54 (round 16)
- Player: 花滿樓 (player-2), level 3, experience 2, at (4, 5), health 33, stamina 9
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-58",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.218Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 55 (round 16)
- Player: 花滿樓 (player-2), level 3, experience 22, at (4, 5), health 33, stamina 4
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-59",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "collect",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "ruin-11",
          "kind": "ruin",
          "position": {
            "row": 3,
            "column": 5
          }
        },
        "reason": "清障：清除廢墟 土城村"
      },
      "result": "succeeded",
      "reason": "清障：清除廢墟 土城村",
      "createdAt": "2026-09-01T20:55:34.223Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 56 (round 17)
- Player: 花滿樓 (player-2), level 3, experience 30, at (4, 5), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +8
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-17-player-2-60",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.226Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 57 (round 17)
- Player: 花滿樓 (player-2), level 3, experience 50, at (4, 5), health 33, stamina 5
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-17-player-2-61",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "collect",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "ruin-20",
          "kind": "ruin",
          "position": {
            "row": 5,
            "column": 5
          }
        },
        "reason": "清障：清除廢墟 寒山村"
      },
      "result": "succeeded",
      "reason": "清障：清除廢墟 寒山村",
      "createdAt": "2026-09-01T20:55:34.231Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 58 (round 17)
- Player: 花滿樓 (player-2), level 3, experience 50, at (5, 5), health 33, stamina 3
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-17-player-2-62",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T20:55:34.237Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 59 (round 17)
- Player: 花滿樓 (player-2), level 3, experience 50, at (5, 4), health 33, stamina 1
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-17-player-2-63",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.241Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 60 (round 18)
- Player: 花滿樓 (player-2), level 3, experience 52, at (5, 4), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-18-player-2-64",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.245Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 61 (round 18)
- Player: 花滿樓 (player-2), level 3, experience 52, at (5, 3), health 33, stamina 5
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-18-player-2-65",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 3
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T20:55:34.252Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 62 (round 18)
- Player: 花滿樓 (player-2), level 3, experience 52, at (6, 3), health 33, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-18-player-2-66",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.258Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 63 (round 19)
- Player: 花滿樓 (player-2), level 3, experience 52, at (6, 3), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-19-player-2-67",
      "round": 19,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.258Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 64 (round 19)
- Player: 花滿樓 (player-2), level 3, experience 52, at (7, 3), health 33, stamina 8
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-19-player-2-68",
      "round": 19,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T20:55:34.264Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 65 (round 19)
- Player: 花滿樓 (player-2), level 3, experience 72, at (7, 3), health 33, stamina 3
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-19-player-2-69",
      "round": 19,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "collect",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "ruin-1",
          "kind": "ruin",
          "position": {
            "row": 7,
            "column": 2
          }
        },
        "reason": "清障：清除廢墟 蘆葦村"
      },
      "result": "succeeded",
      "reason": "清障：清除廢墟 蘆葦村",
      "createdAt": "2026-09-01T20:55:34.268Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 66 (round 19)
- Player: 花滿樓 (player-2), level 3, experience 72, at (8, 3), health 33, stamina 1
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-19-player-2-70",
      "round": 19,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T20:55:34.274Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 67 (round 20)
- Player: 花滿樓 (player-2), level 3, experience 74, at (8, 3), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-20-player-2-71",
      "round": 20,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.276Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 68 (round 20)
- Player: 花滿樓 (player-2), level 3, experience 94, at (8, 3), health 33, stamina 5
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-20-player-2-72",
      "round": 20,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "collect",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "ruin-16",
          "kind": "ruin",
          "position": {
            "row": 8,
            "column": 2
          }
        },
        "reason": "清障：清除廢墟 雲嶺莊"
      },
      "result": "succeeded",
      "reason": "清障：清除廢墟 雲嶺莊",
      "createdAt": "2026-09-01T20:55:34.281Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 69 (round 20)
- Player: 花滿樓 (player-2), level 3, experience 94, at (8, 4), health 33, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-20-player-2-73",
      "round": 20,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.287Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 70 (round 21)
- Player: 花滿樓 (player-2), level 3, experience 94, at (8, 4), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-21-player-2-74",
      "round": 21,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.288Z"
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
      "id": "nest-creature-1",
      "name": "生物巢穴 1的怪物 Lv.3",
      "innerSkillId": "sharp-edge-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 8,
        "column": 3
      },
      "attributes": {
        "armStrength": 13,
        "constitution": 5,
        "agility": 10,
        "innerEnergy": 5,
        "insight": 5
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 3,
      "behaviorType": "sieger",
      "schoolId": "sharp-edge",
      "homePosition": {
        "row": 9,
        "column": 3
      },
      "homeNestId": "creature-nest-1",
      "spawnedRound": 21,
      "baseAttributes": {
        "armStrength": 11.2,
        "constitution": 5.6,
        "agility": 9.799999999999999,
        "innerEnergy": 5.6,
        "insight": 5.6
      },
      "health": 15,
      "maxHealth": 15,
      "stamina": 11.5,
      "maxStamina": 11.5,
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

### Turn 71 (round 21)
- Player: 花滿樓 (player-2), level 3, experience 97, at (8, 4), health 33, stamina 5
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-21-player-2-75",
      "round": 21,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
            "row": 8,
            "column": 3
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.3"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.3",
      "createdAt": "2026-09-01T20:55:34.295Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 72 (round 21)
- Player: 花滿樓 (player-2), level 4, experience 7, at (8, 4), health 33, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: -90 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: nest-creature-1
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-21-player-2-76",
      "round": 21,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
            "row": 8,
            "column": 3
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.3"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.3",
      "createdAt": "2026-09-01T20:55:34.301Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 73 (round 22)
- Player: 花滿樓 (player-2), level 4, experience 7, at (8, 4), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-22-player-2-77",
      "round": 22,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.302Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 74 (round 22)
- Player: 花滿樓 (player-2), level 4, experience 7, at (8, 4), health 33, stamina 10
- Attributes: armStrength=12, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-22-player-2-78",
      "round": 22,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.309Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 75 (round 22)
- Player: 花滿樓 (player-2), level 4, experience 7, at (8, 4), health 33, stamina 10
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-22-player-2-79",
      "round": 22,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.318Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 76 (round 22)
- Player: 花滿樓 (player-2), level 4, experience 7, at (7, 4), health 33, stamina 5
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-22-player-2-80",
      "round": 22,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.326Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 77 (round 22)
- Player: 花滿樓 (player-2), level 4, experience 7, at (7, 4), health 33, stamina 2
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-22-player-2-81",
      "round": 22,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "learn-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillType": "inner",
        "skillId": "ghost-shadow-inner",
        "reason": "學招：學習門派功法 幽影藏形"
      },
      "result": "succeeded",
      "reason": "學招：學習門派功法 幽影藏形",
      "createdAt": "2026-09-01T20:55:34.331Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 78 (round 22)
- Player: 花滿樓 (player-2), level 4, experience 7, at (7, 3), health 33, stamina 0
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-22-player-2-82",
      "round": 22,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:55:34.339Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 79 (round 23)
- Player: 花滿樓 (player-2), level 4, experience 7, at (7, 3), health 33, stamina 11
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-23-player-2-83",
      "round": 23,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.339Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 80 (round 23)
- Player: 花滿樓 (player-2), level 4, experience 7, at (7, 3), health 33, stamina 11
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-23-player-2-84",
      "round": 23,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.347Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 81 (round 23)
- Player: 花滿樓 (player-2), level 4, experience 7, at (7, 2), health 33, stamina 7
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-23-player-2-85",
      "round": 23,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T20:55:34.355Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 82 (round 23)
- Player: 花滿樓 (player-2), level 4, experience 7, at (8, 2), health 33, stamina 5
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-23-player-2-86",
      "round": 23,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:55:34.365Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 83 (round 23)
- Player: 花滿樓 (player-2), level 4, experience 7, at (9, 2), health 33, stamina 3
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-23-player-2-87",
      "round": 23,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:55:34.376Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 84 (round 23)
- Player: 花滿樓 (player-2), level 4, experience 7, at (9, 1), health 33, stamina 1
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-23-player-2-88",
      "round": 23,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:55:34.382Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 85 (round 24)
- Player: 花滿樓 (player-2), level 4, experience 9, at (9, 1), health 33, stamina 11
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-89",
      "round": 24,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.385Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 86 (round 24)
- Player: 花滿樓 (player-2), level 4, experience 9, at (8, 1), health 33, stamina 9
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-90",
      "round": 24,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T20:55:34.393Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 87 (round 24)
- Player: 花滿樓 (player-2), level 4, experience 9, at (9, 1), health 33, stamina 7
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-91",
      "round": 24,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "定位：前往出口 (9,1)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (9,1)",
      "createdAt": "2026-09-01T20:55:34.401Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 88 (round 24)
- Player: 花滿樓 (player-2), level 4, experience 9, at (10, 1), health 33, stamina 5
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-92",
      "round": 24,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:55:34.411Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 89 (round 24)
- Player: 花滿樓 (player-2), level 4, experience 9, at (10, 2), health 33, stamina 0
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-93",
      "round": 24,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:55:34.420Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 90 (round 25)
- Player: 花滿樓 (player-2), level 4, experience 9, at (10, 2), health 33, stamina 11
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-25-player-2-94",
      "round": 25,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.421Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 91 (round 25)
- Player: 花滿樓 (player-2), level 4, experience 9, at (10, 3), health 33, stamina 6
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-25-player-2-95",
      "round": 25,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T20:55:34.428Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 92 (round 25)
- Player: 花滿樓 (player-2), level 4, experience 9, at (11, 3), health 33, stamina 3
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-25-player-2-96",
      "round": 25,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:55:34.437Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 93 (round 26)
- Player: 花滿樓 (player-2), level 4, experience 15, at (11, 3), health 33, stamina 11
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +6
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-97",
      "round": 26,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.440Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 94 (round 26)
- Player: 花滿樓 (player-2), level 4, experience 15, at (12, 3), health 33, stamina 6
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-98",
      "round": 26,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "收集道具：移動到道具位置"
      },
      "result": "succeeded",
      "reason": "收集道具：移動到道具位置",
      "createdAt": "2026-09-01T20:55:34.450Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 95 (round 26)
- Player: 花滿樓 (player-2), level 4, experience 15, at (12, 3), health 33, stamina 6
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-99",
      "round": 26,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
            "row": 12,
            "column": 3
          }
        },
        "reason": "收集道具：拾取"
      },
      "result": "succeeded",
      "reason": "收集道具：拾取",
      "createdAt": "2026-09-01T20:55:34.458Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 96 (round 26)
- Player: 花滿樓 (player-2), level 4, experience 15, at (12, 4), health 33, stamina 3
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-100",
      "round": 26,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 12,
          "column": 4
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T20:55:34.466Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 97 (round 27)
- Player: 花滿樓 (player-2), level 4, experience 21, at (12, 4), health 33, stamina 11
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +6
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-27-player-2-101",
      "round": 27,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.469Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 98 (round 27)
- Player: 花滿樓 (player-2), level 4, experience 41, at (12, 4), health 33, stamina 6
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-27-player-2-102",
      "round": 27,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "collect",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "ruin-10",
          "kind": "ruin",
          "position": {
            "row": 12,
            "column": 5
          }
        },
        "reason": "清障：清除廢墟 魚米村"
      },
      "result": "succeeded",
      "reason": "清障：清除廢墟 魚米村",
      "createdAt": "2026-09-01T20:55:34.475Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 99 (round 27)
- Player: 花滿樓 (player-2), level 4, experience 41, at (11, 4), health 33, stamina 1
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-27-player-2-103",
      "round": 27,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-01T20:55:34.483Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 100 (round 28)
- Player: 花滿樓 (player-2), level 4, experience 43, at (11, 4), health 33, stamina 11
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-28-player-2-104",
      "round": 28,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.485Z"
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
      "innerSkillId": "sharp-edge-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 8,
        "column": 3
      },
      "attributes": {
        "armStrength": 16,
        "constitution": 6,
        "agility": 13,
        "innerEnergy": 6,
        "insight": 6
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 4,
      "behaviorType": "sieger",
      "schoolId": "sharp-edge",
      "homePosition": {
        "row": 9,
        "column": 3
      },
      "homeNestId": "creature-nest-1",
      "spawnedRound": 28,
      "baseAttributes": {
        "armStrength": 14.7,
        "constitution": 6.3,
        "agility": 12.6,
        "innerEnergy": 6.3,
        "insight": 6.3
      },
      "health": 18,
      "maxHealth": 18,
      "stamina": 14.5,
      "maxStamina": 14.5,
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

### Turn 101 (round 28)
- Player: 花滿樓 (player-2), level 4, experience 63, at (11, 4), health 33, stamina 6
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-28-player-2-105",
      "round": 28,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
            "row": 11,
            "column": 5
          }
        },
        "reason": "清障：清除廢墟 稻香村"
      },
      "result": "succeeded",
      "reason": "清障：清除廢墟 稻香村",
      "createdAt": "2026-09-01T20:55:34.492Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 102 (round 28)
- Player: 花滿樓 (player-2), level 4, experience 63, at (11, 5), health 33, stamina 1
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-28-player-2-106",
      "round": 28,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:55:34.502Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 103 (round 29)
- Player: 花滿樓 (player-2), level 4, experience 65, at (11, 5), health 19.65, stamina 11
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-28-nest-creature-1-107",
      "round": 28,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
            "column": 5
          }
        },
        "reason": "與 花滿樓 交戰。"
      },
      "result": "succeeded",
      "reason": "與 花滿樓 交戰。",
      "createdAt": "2026-09-01T20:55:34.506Z"
    },
    {
      "id": "action-29-player-2-108",
      "round": 29,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.506Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 104 (round 29)
- Player: 花滿樓 (player-2), level 4, experience 68, at (11, 5), health 19.65, stamina 6
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-29-player-2-109",
      "round": 29,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
            "column": 4
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.4"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.4",
      "createdAt": "2026-09-01T20:55:34.514Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 105 (round 29)
- Player: 花滿樓 (player-2), level 4, experience 148, at (11, 5), health 19.65, stamina 1
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +80
- Spawned creatures: 0
- Defeated creatures: nest-creature-1
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-29-player-2-110",
      "round": 29,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
            "column": 4
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.4"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.4",
      "createdAt": "2026-09-01T20:55:34.525Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 106 (round 30)
- Player: 花滿樓 (player-2), level 4, experience 150, at (11, 5), health 21.299999999999997, stamina 11
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-30-player-2-111",
      "round": 30,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.528Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 107 (round 30)
- Player: 花滿樓 (player-2), level 4, experience 150, at (10, 5), health 21.299999999999997, stamina 6
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-30-player-2-112",
      "round": 30,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 10,
          "column": 5
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:55:34.537Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 108 (round 30)
- Player: 花滿樓 (player-2), level 4, experience 150, at (9, 5), health 21.299999999999997, stamina 3
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-30-player-2-113",
      "round": 30,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:55:34.546Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 109 (round 30)
- Player: 花滿樓 (player-2), level 4, experience 150, at (9, 5), health 21.299999999999997, stamina 3
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-30-player-2-114",
      "round": 30,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "collect",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "item-point-3",
          "kind": "item",
          "position": {
            "row": 9,
            "column": 5
          }
        },
        "reason": "收集道具：拾取"
      },
      "result": "succeeded",
      "reason": "收集道具：拾取",
      "createdAt": "2026-09-01T20:55:34.548Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 110 (round 31)
- Player: 花滿樓 (player-2), level 4, experience 156, at (9, 5), health 22.949999999999996, stamina 11
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +6
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-31-player-2-115",
      "round": 31,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.550Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 111 (round 31)
- Player: 花滿樓 (player-2), level 4, experience 156, at (9, 4), health 22.949999999999996, stamina 6
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-31-player-2-116",
      "round": 31,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:55:34.559Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 112 (round 31)
- Player: 花滿樓 (player-2), level 4, experience 156, at (8, 4), health 22.949999999999996, stamina 1
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-31-player-2-117",
      "round": 31,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.569Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 113 (round 32)
- Player: 花滿樓 (player-2), level 4, experience 158, at (8, 4), health 24.599999999999994, stamina 11
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-32-player-2-118",
      "round": 32,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.572Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 114 (round 32)
- Player: 花滿樓 (player-2), level 4, experience 158, at (7, 4), health 24.599999999999994, stamina 6
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-32-player-2-119",
      "round": 32,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.580Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 115 (round 32)
- Player: 花滿樓 (player-2), level 4, experience 158, at (7, 4), health 24.599999999999994, stamina 3
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-32-player-2-120",
      "round": 32,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "learn-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillType": "external",
        "skillId": "ghost-shadow-external-damage",
        "reason": "學招：學習門派功法 影襲"
      },
      "result": "succeeded",
      "reason": "學招：學習門派功法 影襲",
      "createdAt": "2026-09-01T20:55:34.586Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 116 (round 33)
- Player: 花滿樓 (player-2), level 4, experience 164, at (7, 4), health 26.249999999999993, stamina 11
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +6
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-33-player-2-121",
      "round": 33,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.590Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 117 (round 33)
- Player: 花滿樓 (player-2), level 4, experience 164, at (7, 4), health 26.249999999999993, stamina 8
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-33-player-2-122",
      "round": 33,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "ghost-shadow-inner",
        "reason": "練功：練習功法 幽影藏形"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 幽影藏形",
      "createdAt": "2026-09-01T20:55:34.597Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 118 (round 33)
- Player: 花滿樓 (player-2), level 4, experience 164, at (7, 5), health 26.249999999999993, stamina 5
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-33-player-2-123",
      "round": 33,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
        "reason": "清障：移動到廢墟 石橋村 附近"
      },
      "result": "succeeded",
      "reason": "清障：移動到廢墟 石橋村 附近",
      "createdAt": "2026-09-01T20:55:34.604Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 119 (round 33)
- Player: 花滿樓 (player-2), level 4, experience 184, at (7, 5), health 26.249999999999993, stamina 0
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-33-player-2-124",
      "round": 33,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
            "row": 8,
            "column": 5
          }
        },
        "reason": "清障：清除廢墟 石橋村"
      },
      "result": "succeeded",
      "reason": "清障：清除廢墟 石橋村",
      "createdAt": "2026-09-01T20:55:34.610Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 120 (round 34)
- Player: 花滿樓 (player-2), level 4, experience 184, at (7, 5), health 27.89999999999999, stamina 11
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-34-player-2-125",
      "round": 34,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.610Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 121 (round 34)
- Player: 花滿樓 (player-2), level 4, experience 184, at (6, 5), health 27.89999999999999, stamina 6
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-34-player-2-126",
      "round": 34,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.620Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 122 (round 34)
- Player: 花滿樓 (player-2), level 4, experience 184, at (6, 5), health 27.89999999999999, stamina 3
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-34-player-2-127",
      "round": 34,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "ghost-shadow-inner",
        "reason": "練功：練習功法 幽影藏形"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 幽影藏形",
      "createdAt": "2026-09-01T20:55:34.626Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 123 (round 35)
- Player: 花滿樓 (player-2), level 4, experience 190, at (6, 5), health 29.54999999999999, stamina 11
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +6
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-35-player-2-128",
      "round": 35,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.629Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 124 (round 35)
- Player: 花滿樓 (player-2), level 4, experience 190, at (6, 5), health 29.54999999999999, stamina 8
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-35-player-2-129",
      "round": 35,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "ghost-shadow-inner",
        "reason": "練功：練習功法 幽影藏形"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 幽影藏形",
      "createdAt": "2026-09-01T20:55:34.637Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 125 (round 35)
- Player: 花滿樓 (player-2), level 4, experience 190, at (6, 5), health 29.54999999999999, stamina 5
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-35-player-2-130",
      "round": 35,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "ghost-shadow-inner",
        "reason": "練功：練習功法 幽影藏形"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 幽影藏形",
      "createdAt": "2026-09-01T20:55:34.642Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 126 (round 35)
- Player: 花滿樓 (player-2), level 4, experience 190, at (6, 5), health 29.54999999999999, stamina 2
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-35-player-2-131",
      "round": 35,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "ghost-shadow-inner",
        "reason": "練功：練習功法 幽影藏形"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 幽影藏形",
      "createdAt": "2026-09-01T20:55:34.648Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 127 (round 36)
- Player: 花滿樓 (player-2), level 4, experience 194, at (6, 5), health 31.19999999999999, stamina 11
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-36-player-2-132",
      "round": 36,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.651Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 128 (round 36)
- Player: 花滿樓 (player-2), level 4, experience 194, at (6, 5), health 31.19999999999999, stamina 8
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-36-player-2-133",
      "round": 36,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "ghost-shadow-inner",
        "reason": "練功：練習功法 幽影藏形"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 幽影藏形",
      "createdAt": "2026-09-01T20:55:34.658Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 129 (round 36)
- Player: 花滿樓 (player-2), level 4, experience 194, at (6, 5), health 31.19999999999999, stamina 5
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-36-player-2-134",
      "round": 36,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "ghost-shadow-inner",
        "reason": "練功：練習功法 幽影藏形"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 幽影藏形",
      "createdAt": "2026-09-01T20:55:34.663Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 130 (round 36)
- Player: 花滿樓 (player-2), level 4, experience 194, at (6, 5), health 31.19999999999999, stamina 2
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-36-player-2-135",
      "round": 36,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "ghost-shadow-inner",
        "reason": "練功：練習功法 幽影藏形"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 幽影藏形",
      "createdAt": "2026-09-01T20:55:34.669Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 131 (round 37)
- Player: 花滿樓 (player-2), level 4, experience 198, at (6, 5), health 32.84999999999999, stamina 11
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-37-player-2-136",
      "round": 37,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.672Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 132 (round 37)
- Player: 花滿樓 (player-2), level 4, experience 198, at (6, 5), health 32.84999999999999, stamina 8
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-37-player-2-137",
      "round": 37,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "ghost-shadow-inner",
        "reason": "練功：練習功法 幽影藏形"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 幽影藏形",
      "createdAt": "2026-09-01T20:55:34.678Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 133 (round 37)
- Player: 花滿樓 (player-2), level 4, experience 198, at (6, 5), health 32.84999999999999, stamina 5
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-37-player-2-138",
      "round": 37,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "ghost-shadow-inner",
        "reason": "練功：練習功法 幽影藏形"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 幽影藏形",
      "createdAt": "2026-09-01T20:55:34.683Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 134 (round 37)
- Player: 花滿樓 (player-2), level 4, experience 198, at (6, 5), health 32.84999999999999, stamina 2
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-37-player-2-139",
      "round": 37,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-3",
        "skillId": "ghost-shadow-inner",
        "reason": "練功：練習功法 幽影藏形"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 幽影藏形",
      "createdAt": "2026-09-01T20:55:34.687Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 135 (round 38)
- Player: 花滿樓 (player-2), level 5, experience 2, at (6, 5), health 33, stamina 11
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: -196 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-38-player-2-140",
      "round": 38,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-01T20:55:34.690Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

