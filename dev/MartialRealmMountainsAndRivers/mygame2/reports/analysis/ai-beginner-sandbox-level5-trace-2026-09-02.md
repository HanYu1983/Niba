# AI Beginner Sandbox Level5 Trace

- AI turns: 44
- Final round: 15
- Game won: false
- Game over: true
- Remaining nests: 1

## Aggregate

- Action counts: practice-skill=16, end-turn=14, attack=9, move=5, hold=2, allocate-attribute=2, learn-skill=1, equip-inner-skill=1
- Creatures spawned (total): 3
- Creatures defeated (total): 2
- Level-ups observed: 1
- Final player: level 2, experience 73, inner skill 黃土紮根 (yellow-earth-inner) lv.2 damage 15
- Final attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8

## Efficiency (KPI)

- 行動產出率 (productive): ██████······ 54.0% (27/50)
- 擊殺效率 (kill/generate): ████████···· 0.67 (2/3)
- 擊殺成本 (attack/kill): 4.50 (9 次攻擊 / 2 擊殺)
- 經驗效率 (XP/turn): 1.66 (73 XP / 44 turns)

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
      "createdAt": "2026-09-01T20:24:05.303Z"
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
      "createdAt": "2026-09-01T20:24:05.314Z"
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
      "createdAt": "2026-09-01T20:24:05.318Z"
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
      "createdAt": "2026-09-01T20:24:05.333Z"
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
      "createdAt": "2026-09-01T20:24:05.346Z"
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
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/132

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
      "createdAt": "2026-09-01T20:24:05.351Z"
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
      "spawnedRound": 3,
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

### Turn 7 (round 3)
- Player: 花滿樓 (player-2), level 1, experience 2, at (6, 1), health 24, stamina 6
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
      "createdAt": "2026-09-01T20:24:05.363Z"
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
- Nests: creature-nest-1=120/132

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
      "createdAt": "2026-09-01T20:24:05.369Z"
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
- Nests: creature-nest-1=120/132

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
      "createdAt": "2026-09-01T20:24:05.376Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-3-nest-creature-1-10",
      "round": 3,
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
      "createdAt": "2026-09-01T20:24:05.383Z"
    },
    {
      "id": "action-4-player-2-11",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.14:practice-skill, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.14:practice-skill, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:24:05.383Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 11 (round 4)
- Player: 花滿樓 (player-2), level 1, experience 11, at (6, 1), health 25.5, stamina 3.5
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
      "id": "action-4-player-2-12",
      "round": 4,
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
            "row": 6,
            "column": 2
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-01T20:24:05.397Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 12 (round 4)
- Player: 花滿樓 (player-2), level 1, experience 11, at (6, 1), health 25.5, stamina 0.5
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
      "id": "action-4-player-2-13",
      "round": 4,
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
        "gateId": "sect-gate-4",
        "skillId": "yellow-earth-inner",
        "reason": "練功：練習功法 黃土紮根"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 黃土紮根",
      "createdAt": "2026-09-01T20:24:05.402Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 13 (round 5)
- Player: 花滿樓 (player-2), level 1, experience 12, at (6, 1), health 21, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-4-nest-creature-1-14",
      "round": 4,
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
            "row": 6,
            "column": 1
          }
        },
        "reason": "與 花滿樓 交戰。"
      },
      "result": "succeeded",
      "reason": "與 花滿樓 交戰。",
      "createdAt": "2026-09-01T20:24:05.408Z"
    },
    {
      "id": "action-5-player-2-15",
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
        "reason": "模糊策略：positioning 分數 0.67，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.67:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.67，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.67:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:24:05.408Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-1",
      "creatureName": "生物巢穴 1的怪物 Lv.1",
      "message": "生物巢穴 1的怪物 Lv.1 攻擊 花滿樓，造成 6 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 14 (round 5)
- Player: 花滿樓 (player-2), level 1, experience 32, at (6, 1), health 21, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: nest-creature-1
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-5-player-2-16",
      "round": 5,
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
            "row": 6,
            "column": 2
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-01T20:24:05.418Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 15 (round 5)
- Player: 花滿樓 (player-2), level 1, experience 32, at (6, 1), health 21, stamina 0.5
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
      "id": "action-5-player-2-17",
      "round": 5,
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
        "gateId": "sect-gate-4",
        "skillId": "yellow-earth-inner",
        "reason": "練功：練習功法 黃土紮根"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 黃土紮根",
      "createdAt": "2026-09-01T20:24:05.423Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 16 (round 6)
- Player: 花滿樓 (player-2), level 1, experience 33, at (6, 1), health 22.5, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-6-player-2-18",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:24:05.426Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 17 (round 6)
- Player: 花滿樓 (player-2), level 1, experience 33, at (6, 1), health 22.5, stamina 5.5
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
      "id": "action-6-player-2-19",
      "round": 6,
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
        "gateId": "sect-gate-4",
        "skillId": "yellow-earth-inner",
        "reason": "練功：練習功法 黃土紮根"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 黃土紮根",
      "createdAt": "2026-09-01T20:24:05.431Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 18 (round 6)
- Player: 花滿樓 (player-2), level 1, experience 33, at (6, 1), health 22.5, stamina 2.5
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
      "id": "action-6-player-2-20",
      "round": 6,
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
        "gateId": "sect-gate-4",
        "skillId": "yellow-earth-inner",
        "reason": "練功：練習功法 黃土紮根"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 黃土紮根",
      "createdAt": "2026-09-01T20:24:05.436Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 19 (round 7)
- Player: 花滿樓 (player-2), level 1, experience 38, at (6, 1), health 24, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: +5
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
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:24:05.439Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 20 (round 7)
- Player: 花滿樓 (player-2), level 1, experience 38, at (6, 1), health 24, stamina 5.5
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
      "id": "action-7-player-2-22",
      "round": 7,
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
        "gateId": "sect-gate-4",
        "skillId": "yellow-earth-inner",
        "reason": "練功：練習功法 黃土紮根"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 黃土紮根",
      "createdAt": "2026-09-01T20:24:05.445Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 21 (round 7)
- Player: 花滿樓 (player-2), level 1, experience 38, at (6, 1), health 24, stamina 2.5
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
      "id": "action-7-player-2-23",
      "round": 7,
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
        "gateId": "sect-gate-4",
        "skillId": "yellow-earth-inner",
        "reason": "練功：練習功法 黃土紮根"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 黃土紮根",
      "createdAt": "2026-09-01T20:24:05.449Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 22 (round 8)
- Player: 花滿樓 (player-2), level 1, experience 43, at (6, 1), health 25.5, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: +5
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/145

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
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:24:05.453Z"
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
      "spawnedRound": 8,
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

### Turn 23 (round 8)
- Player: 花滿樓 (player-2), level 1, experience 43, at (6, 1), health 25.5, stamina 5.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

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
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-4",
        "skillId": "yellow-earth-inner",
        "reason": "練功：練習功法 黃土紮根"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 黃土紮根",
      "createdAt": "2026-09-01T20:24:05.459Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 24 (round 8)
- Player: 花滿樓 (player-2), level 1, experience 43, at (6, 1), health 25.5, stamina 2.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

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
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-4",
        "skillId": "yellow-earth-inner",
        "reason": "練功：練習功法 黃土紮根"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 黃土紮根",
      "createdAt": "2026-09-01T20:24:05.464Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 25 (round 9)
- Player: 花滿樓 (player-2), level 1, experience 48, at (6, 1), health 27, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 13
- Stored experience change: +5
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-8-nest-creature-1-27",
      "round": 8,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
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
      "createdAt": "2026-09-01T20:24:05.467Z"
    },
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:24:05.467Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 26 (round 9)
- Player: 花滿樓 (player-2), level 2, experience 1, at (6, 1), health 27, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 13
- Stored experience change: -47 (level up; stored experience reset by game rules)
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
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "nest-creature-1",
          "kind": "creature",
          "position": {
            "row": 6,
            "column": 2
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.2"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.2",
      "createdAt": "2026-09-01T20:24:05.477Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 27 (round 9)
- Player: 花滿樓 (player-2), level 2, experience 1, at (6, 1), health 27, stamina 3.5
- Attributes: armStrength=8, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
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
      "createdAt": "2026-09-01T20:24:05.481Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 28 (round 9)
- Player: 花滿樓 (player-2), level 2, experience 1, at (6, 1), health 27, stamina 3.5
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-9-player-2-31",
      "round": 9,
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
      "createdAt": "2026-09-01T20:24:05.485Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 29 (round 10)
- Player: 花滿樓 (player-2), level 2, experience 8, at (6, 1), health 16.65, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
- Stored experience change: +7
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-9-nest-creature-1-32",
      "round": 9,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
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
            "column": 1
          }
        },
        "reason": "與 花滿樓 交戰。"
      },
      "result": "succeeded",
      "reason": "與 花滿樓 交戰。",
      "createdAt": "2026-09-01T20:24:05.489Z"
    },
    {
      "id": "action-10-player-2-33",
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
        "reason": "模糊策略：positioning 分數 0.67，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.67:hold, practiceSkill=0.17:practice-skill, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.67，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.67:hold, practiceSkill=0.17:practice-skill, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:24:05.490Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-1",
      "creatureName": "生物巢穴 1的怪物 Lv.2",
      "message": "生物巢穴 1的怪物 Lv.2 攻擊 花滿樓，造成 12 點傷害（暴擊）。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 30 (round 10)
- Player: 花滿樓 (player-2), level 2, experience 48, at (6, 1), health 16.65, stamina 4
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
- Stored experience change: +40
- Spawned creatures: 0
- Defeated creatures: nest-creature-1
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
            "row": 6,
            "column": 2
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.2"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.2",
      "createdAt": "2026-09-01T20:24:05.497Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 31 (round 10)
- Player: 花滿樓 (player-2), level 2, experience 48, at (6, 1), health 16.65, stamina 1
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
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
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-4",
        "skillId": "yellow-earth-inner",
        "reason": "練功：練習功法 黃土紮根"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 黃土紮根",
      "createdAt": "2026-09-01T20:24:05.501Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 32 (round 11)
- Player: 花滿樓 (player-2), level 2, experience 50, at (6, 1), health 18.299999999999997, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-11-player-2-36",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:24:05.505Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 33 (round 11)
- Player: 花滿樓 (player-2), level 2, experience 50, at (6, 1), health 18.299999999999997, stamina 6
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
- Stored experience change: +0
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
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-4",
        "skillId": "yellow-earth-inner",
        "reason": "練功：練習功法 黃土紮根"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 黃土紮根",
      "createdAt": "2026-09-01T20:24:05.509Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 34 (round 11)
- Player: 花滿樓 (player-2), level 2, experience 50, at (6, 1), health 18.299999999999997, stamina 3
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
- Stored experience change: +0
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
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-4",
        "skillId": "yellow-earth-inner",
        "reason": "練功：練習功法 黃土紮根"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 黃土紮根",
      "createdAt": "2026-09-01T20:24:05.514Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 35 (round 12)
- Player: 花滿樓 (player-2), level 2, experience 56, at (6, 1), health 19.949999999999996, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
- Stored experience change: +6
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-12-player-2-39",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.06:practice-skill, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.06:practice-skill, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:24:05.517Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 36 (round 12)
- Player: 花滿樓 (player-2), level 2, experience 56, at (6, 1), health 19.949999999999996, stamina 6
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-12-player-2-40",
      "round": 12,
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
        "gateId": "sect-gate-4",
        "skillId": "yellow-earth-inner",
        "reason": "練功：練習功法 黃土紮根"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 黃土紮根",
      "createdAt": "2026-09-01T20:24:05.524Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 37 (round 12)
- Player: 花滿樓 (player-2), level 2, experience 56, at (6, 1), health 19.949999999999996, stamina 3
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
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
        "type": "practice-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-4",
        "skillId": "yellow-earth-inner",
        "reason": "練功：練習功法 黃土紮根"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 黃土紮根",
      "createdAt": "2026-09-01T20:24:05.530Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 38 (round 13)
- Player: 花滿樓 (player-2), level 2, experience 62, at (6, 1), health 21.599999999999994, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
- Stored experience change: +6
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-13-player-2-42",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.06:practice-skill, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.06:practice-skill, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:24:05.534Z"
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
      "spawnedRound": 13,
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

### Turn 39 (round 13)
- Player: 花滿樓 (player-2), level 2, experience 62, at (6, 1), health 21.599999999999994, stamina 6
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-13-player-2-43",
      "round": 13,
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
        "gateId": "sect-gate-4",
        "skillId": "yellow-earth-inner",
        "reason": "練功：練習功法 黃土紮根"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 黃土紮根",
      "createdAt": "2026-09-01T20:24:05.541Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 40 (round 13)
- Player: 花滿樓 (player-2), level 2, experience 62, at (6, 1), health 21.599999999999994, stamina 3
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-13-player-2-44",
      "round": 13,
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
        "gateId": "sect-gate-4",
        "skillId": "yellow-earth-inner",
        "reason": "練功：練習功法 黃土紮根"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 黃土紮根",
      "createdAt": "2026-09-01T20:24:05.548Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 41 (round 14)
- Player: 花滿樓 (player-2), level 2, experience 68, at (6, 1), health 23.249999999999993, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
- Stored experience change: +6
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-13-nest-creature-1-45",
      "round": 13,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
            "column": 1
          }
        },
        "reason": "與 花滿樓 交戰。"
      },
      "result": "succeeded",
      "reason": "與 花滿樓 交戰。",
      "createdAt": "2026-09-01T20:24:05.551Z"
    },
    {
      "id": "action-14-player-2-46",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.06:practice-skill, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.06:practice-skill, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:24:05.551Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 42 (round 14)
- Player: 花滿樓 (player-2), level 2, experience 71, at (6, 1), health 23.249999999999993, stamina 4
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-14-player-2-47",
      "round": 14,
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
            "row": 6,
            "column": 2
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.3"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.3",
      "createdAt": "2026-09-01T20:24:05.561Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 43 (round 14)
- Player: 花滿樓 (player-2), level 2, experience 71, at (6, 1), health 23.249999999999993, stamina 1
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-14-player-2-48",
      "round": 14,
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
        "gateId": "sect-gate-4",
        "skillId": "yellow-earth-inner",
        "reason": "練功：練習功法 黃土紮根"
      },
      "result": "succeeded",
      "reason": "練功：練習功法 黃土紮根",
      "createdAt": "2026-09-01T20:24:05.566Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 44 (round 15)
- Player: 花滿樓 (player-2), level 2, experience 73, at (6, 1), health 0, stamina 0
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-14-nest-creature-1-49",
      "round": 14,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
            "column": 1
          }
        },
        "reason": "與 花滿樓 交戰。"
      },
      "result": "succeeded",
      "reason": "與 花滿樓 交戰。",
      "createdAt": "2026-09-01T20:24:05.569Z"
    },
    {
      "id": "action-15-player-2-50",
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
        "reason": "模糊策略：positioning 分數 0.67，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.67:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.67，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.67:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:24:05.569Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-1",
      "creatureName": "生物巢穴 1的怪物 Lv.3",
      "message": "生物巢穴 1的怪物 Lv.3 攻擊 花滿樓，造成 9 點傷害（根骨減傷，暴擊）。"
    },
    {
      "creatureId": "nest-creature-1",
      "creatureName": "生物巢穴 1的怪物 Lv.3",
      "message": "生物巢穴 1的怪物 Lv.3 連續攻擊 花滿樓 2 次。"
    }
  ],
  "spawnedCreatures": []
}
```

