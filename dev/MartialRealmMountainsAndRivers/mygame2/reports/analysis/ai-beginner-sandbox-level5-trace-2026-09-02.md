# AI Beginner Sandbox Level5 Trace

- AI turns: 217
- Final round: 54
- Game won: false
- Game over: true
- Remaining nests: 1

## Aggregate

- Action counts: move=122, hold=69, end-turn=53, attack=21, use-facility=12, allocate-attribute=6, learn-skill=5, collect=5, equip-inner-skill=2, use-item=2, equip-external-skill=1
- Creatures spawned (total): 7
- Creatures defeated (total): 4
- Level-ups observed: 3
- Final player: level 4, experience 184, inner skill 銳鋒淬芒 (sharp-edge-inner) lv.1 damage 13
- Final attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8

## Efficiency (KPI)

- 行動產出率 (productive): ██·········· 15.8% (47/298)
- 擊殺效率 (kill/generate): ███████····· 0.57 (4/7)
- 擊殺成本 (attack/kill): 5.25 (21 次攻擊 / 4 擊殺)
- 經驗效率 (XP/turn): 0.85 (184 XP / 217 turns)
- 目標切換次數 (goal switches): 177
- 無效行動率 (ineffective): ████████···· 63.4% (189/298)

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
      "createdAt": "2026-09-02T16:33:52.490Z"
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
      "createdAt": "2026-09-02T16:33:52.503Z"
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
      "createdAt": "2026-09-02T16:33:52.507Z"
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
      "createdAt": "2026-09-02T16:33:52.523Z"
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
      "createdAt": "2026-09-02T16:33:52.538Z"
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
      "createdAt": "2026-09-02T16:33:52.544Z"
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
      "createdAt": "2026-09-02T16:33:52.557Z"
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
      "createdAt": "2026-09-02T16:33:52.566Z"
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
      "createdAt": "2026-09-02T16:33:52.573Z"
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
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/132

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
      "createdAt": "2026-09-02T16:33:52.579Z"
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
      "spawnedRound": 4,
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

### Turn 11 (round 4)
- Player: 花滿樓 (player-2), level 1, experience 8, at (5, 1), health 24, stamina 3.5
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
      "createdAt": "2026-09-02T16:33:52.590Z"
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
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 2
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-02T16:33:52.598Z"
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
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-4-nest-creature-1-13",
      "round": 4,
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
      "createdAt": "2026-09-02T16:33:52.608Z"
    },
    {
      "id": "action-5-player-2-14",
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
      "createdAt": "2026-09-02T16:33:52.609Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 14 (round 5)
- Player: 花滿樓 (player-2), level 1, experience 14, at (5, 2), health 25.5, stamina 3.5
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
      "id": "action-5-player-2-15",
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
            "row": 5,
            "column": 3
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-02T16:33:52.623Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 15 (round 5)
- Player: 花滿樓 (player-2), level 1, experience 14, at (4, 2), health 24, stamina 1.5
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
      "id": "action-5-player-2-16",
      "round": 5,
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
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.1（hitsSurvivable=6.375）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.1（hitsSurvivable=6.375）",
      "createdAt": "2026-09-02T16:33:52.629Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 16 (round 6)
- Player: 花滿樓 (player-2), level 1, experience 17, at (4, 2), health 25.5, stamina 8.5
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
      "id": "action-5-nest-creature-1-17",
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
      "createdAt": "2026-09-02T16:33:52.637Z"
    },
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:33:52.638Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 17 (round 6)
- Player: 花滿樓 (player-2), level 1, experience 37, at (4, 2), health 25.5, stamina 3.5
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
      "id": "action-6-player-2-19",
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
            "row": 4,
            "column": 3
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-02T16:33:52.647Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 18 (round 7)
- Player: 花滿樓 (player-2), level 1, experience 44, at (4, 2), health 27, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: +7
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
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:33:52.654Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 19 (round 7)
- Player: 花滿樓 (player-2), level 1, experience 44, at (3, 2), health 24, stamina 4.5
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
          "row": 3,
          "column": 2
        },
        "reason": "收集道具：移動到道具位置"
      },
      "result": "succeeded",
      "reason": "收集道具：移動到道具位置",
      "createdAt": "2026-09-02T16:33:52.661Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 20 (round 7)
- Player: 花滿樓 (player-2), level 1, experience 44, at (3, 2), health 24, stamina 4.5
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
      "createdAt": "2026-09-02T16:33:52.664Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 21 (round 8)
- Player: 花滿樓 (player-2), level 2, experience 3, at (3, 2), health 25.5, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: -41 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
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
      "createdAt": "2026-09-02T16:33:52.669Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 22 (round 8)
- Player: 花滿樓 (player-2), level 2, experience 3, at (3, 2), health 25.5, stamina 8.5
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
      "id": "action-8-player-2-24",
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
      "createdAt": "2026-09-02T16:33:52.672Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 23 (round 8)
- Player: 花滿樓 (player-2), level 2, experience 3, at (3, 2), health 25.5, stamina 8.5
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
        "attribute": "armStrength",
        "reason": "屬性分配：提升 armStrength"
      },
      "result": "succeeded",
      "reason": "屬性分配：提升 armStrength",
      "createdAt": "2026-09-02T16:33:52.676Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 24 (round 9)
- Player: 花滿樓 (player-2), level 2, experience 20, at (3, 2), health 27.15, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +17
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-9-player-2-26",
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
      "createdAt": "2026-09-02T16:33:52.679Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 25 (round 10)
- Player: 花滿樓 (player-2), level 2, experience 38, at (3, 2), health 28.799999999999997, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +18
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-10-player-2-27",
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
      "createdAt": "2026-09-02T16:33:52.685Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 26 (round 11)
- Player: 花滿樓 (player-2), level 2, experience 56, at (3, 2), health 30.449999999999996, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +18
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-11-player-2-28",
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
      "createdAt": "2026-09-02T16:33:52.689Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 27 (round 12)
- Player: 花滿樓 (player-2), level 2, experience 74, at (3, 2), health 32.099999999999994, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +18
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-12-player-2-29",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:33:52.692Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 28 (round 12)
- Player: 花滿樓 (player-2), level 2, experience 74, at (3, 3), health 32.099999999999994, stamina 7
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
      "id": "action-12-player-2-30",
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
      "createdAt": "2026-09-02T16:33:52.697Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 29 (round 12)
- Player: 花滿樓 (player-2), level 2, experience 74, at (4, 3), health 32.099999999999994, stamina 5
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
      "id": "action-12-player-2-31",
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
          "row": 4,
          "column": 3
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:33:52.704Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 30 (round 12)
- Player: 花滿樓 (player-2), level 2, experience 74, at (4, 4), health 32.099999999999994, stamina 0
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
      "id": "action-12-player-2-32",
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
          "row": 4,
          "column": 4
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:33:52.709Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 31 (round 13)
- Player: 花滿樓 (player-2), level 2, experience 74, at (4, 4), health 33, stamina 9
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
      "id": "action-13-player-2-33",
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
      "createdAt": "2026-09-02T16:33:52.709Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 32 (round 13)
- Player: 花滿樓 (player-2), level 2, experience 74, at (4, 5), health 33, stamina 7
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
      "id": "action-13-player-2-34",
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
          "row": 4,
          "column": 5
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:33:52.717Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 33 (round 13)
- Player: 花滿樓 (player-2), level 2, experience 74, at (4, 6), health 33, stamina 2
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
      "id": "action-13-player-2-35",
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
          "row": 4,
          "column": 6
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:33:52.724Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 34 (round 14)
- Player: 花滿樓 (player-2), level 2, experience 78, at (4, 6), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-14-player-2-36",
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
      "createdAt": "2026-09-02T16:33:52.727Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 35 (round 14)
- Player: 花滿樓 (player-2), level 2, experience 78, at (3, 6), health 33, stamina 4
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
      "id": "action-14-player-2-37",
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
          "column": 6
        },
        "reason": "收集道具：移動到道具位置"
      },
      "result": "succeeded",
      "reason": "收集道具：移動到道具位置",
      "createdAt": "2026-09-02T16:33:52.737Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 36 (round 14)
- Player: 花滿樓 (player-2), level 2, experience 78, at (3, 6), health 33, stamina 4
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
      "id": "action-14-player-2-38",
      "round": 14,
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
          "id": "item-point-2",
          "kind": "item",
          "position": {
            "row": 3,
            "column": 6
          }
        },
        "reason": "收集道具：拾取"
      },
      "result": "succeeded",
      "reason": "收集道具：拾取",
      "createdAt": "2026-09-02T16:33:52.745Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 37 (round 14)
- Player: 花滿樓 (player-2), level 2, experience 78, at (11, 12), health 33, stamina 4
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
      "id": "action-14-player-2-39",
      "round": 14,
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
        "itemId": "recall-base-talisman",
        "reason": "使用道具：回營符"
      },
      "result": "succeeded",
      "reason": "使用道具：回營符",
      "createdAt": "2026-09-02T16:33:52.754Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 38 (round 14)
- Player: 花滿樓 (player-2), level 2, experience 78, at (11, 12), health 33, stamina 4
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
      "id": "action-14-player-2-40",
      "round": 14,
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
          "id": "item-point-16",
          "kind": "item",
          "position": {
            "row": 11,
            "column": 12
          }
        },
        "reason": "收集道具：拾取"
      },
      "result": "succeeded",
      "reason": "收集道具：拾取",
      "createdAt": "2026-09-02T16:33:52.767Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 39 (round 14)
- Player: 花滿樓 (player-2), level 2, experience 78, at (11, 12), health 33, stamina 2
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
      "id": "action-14-player-2-41",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-02T16:33:52.773Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 40 (round 14)
- Player: 花滿樓 (player-2), level 2, experience 78, at (11, 12), health 33, stamina 0
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
      "id": "action-14-player-2-42",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-02T16:33:52.778Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 41 (round 15)
- Player: 花滿樓 (player-2), level 2, experience 78, at (11, 12), health 33, stamina 9
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
      "id": "action-15-player-2-43",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-02T16:33:52.778Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 42 (round 15)
- Player: 花滿樓 (player-2), level 2, experience 78, at (11, 12), health 33, stamina 7
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
      "id": "action-15-player-2-44",
      "round": 15,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-02T16:33:52.785Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 43 (round 15)
- Player: 花滿樓 (player-2), level 2, experience 78, at (11, 11), health 33, stamina 5
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
      "id": "action-15-player-2-45",
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
          "row": 11,
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:52.793Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 44 (round 15)
- Player: 花滿樓 (player-2), level 2, experience 78, at (10, 11), health 33, stamina 1
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
      "id": "action-15-player-2-46",
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
          "row": 10,
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:52.804Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 45 (round 16)
- Player: 花滿樓 (player-2), level 2, experience 80, at (10, 11), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-16-player-2-47",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:33:52.807Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 46 (round 16)
- Player: 花滿樓 (player-2), level 2, experience 80, at (9, 11), health 33, stamina 5
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
      "id": "action-16-player-2-48",
      "round": 16,
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
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:52.820Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 47 (round 16)
- Player: 花滿樓 (player-2), level 2, experience 80, at (9, 11), health 33, stamina 2
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
      "id": "action-16-player-2-49",
      "round": 16,
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
        "gateId": "sect-gate-2",
        "skillType": "inner",
        "skillId": "sharp-edge-inner",
        "reason": "學招：學習門派功法 銳鋒淬芒"
      },
      "result": "succeeded",
      "reason": "學招：學習門派功法 銳鋒淬芒",
      "createdAt": "2026-09-02T16:33:52.826Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 48 (round 16)
- Player: 花滿樓 (player-2), level 2, experience 80, at (9, 10), health 33, stamina 0
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
      "id": "action-16-player-2-50",
      "round": 16,
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
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:52.831Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 49 (round 17)
- Player: 花滿樓 (player-2), level 2, experience 80, at (9, 10), health 33, stamina 9
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
      "id": "action-17-player-2-51",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-02T16:33:52.832Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 50 (round 17)
- Player: 花滿樓 (player-2), level 2, experience 80, at (10, 10), health 33, stamina 7
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
      "id": "action-17-player-2-52",
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
          "row": 10,
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:52.841Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 51 (round 17)
- Player: 花滿樓 (player-2), level 2, experience 80, at (11, 10), health 33, stamina 5
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
      "id": "action-17-player-2-53",
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
          "row": 11,
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:52.848Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 52 (round 17)
- Player: 花滿樓 (player-2), level 2, experience 80, at (12, 10), health 33, stamina 0
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
      "id": "action-17-player-2-54",
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
          "row": 12,
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:52.856Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 53 (round 18)
- Player: 花滿樓 (player-2), level 2, experience 80, at (12, 10), health 33, stamina 9
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
      "id": "action-18-player-2-55",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-02T16:33:52.856Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 54 (round 18)
- Player: 花滿樓 (player-2), level 2, experience 80, at (12, 11), health 33, stamina 7
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
      "id": "action-18-player-2-56",
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
          "row": 12,
          "column": 11
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:52.864Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 55 (round 18)
- Player: 花滿樓 (player-2), level 2, experience 80, at (12, 11), health 33, stamina 5
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
      "id": "action-18-player-2-57",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-02T16:33:52.873Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 56 (round 18)
- Player: 花滿樓 (player-2), level 2, experience 80, at (12, 11), health 33, stamina 3
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
      "id": "action-18-player-2-58",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-02T16:33:52.879Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 57 (round 18)
- Player: 花滿樓 (player-2), level 2, experience 80, at (12, 11), health 33, stamina 1
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
      "id": "action-18-player-2-59",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-02T16:33:52.887Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 58 (round 19)
- Player: 花滿樓 (player-2), level 2, experience 82, at (12, 11), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-19-player-2-60",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:33:52.891Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 59 (round 19)
- Player: 花滿樓 (player-2), level 2, experience 82, at (13, 11), health 33, stamina 5
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
      "id": "action-19-player-2-61",
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
          "row": 13,
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:52.902Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 60 (round 19)
- Player: 花滿樓 (player-2), level 2, experience 82, at (13, 10), health 33, stamina 3
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
      "id": "action-19-player-2-62",
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
          "row": 13,
          "column": 10
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:52.913Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 61 (round 19)
- Player: 花滿樓 (player-2), level 2, experience 82, at (13, 9), health 33, stamina 1
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
      "id": "action-19-player-2-63",
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
          "row": 13,
          "column": 9
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:52.923Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 62 (round 20)
- Player: 花滿樓 (player-2), level 2, experience 84, at (13, 9), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-20-player-2-64",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:33:52.925Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 63 (round 20)
- Player: 花滿樓 (player-2), level 2, experience 84, at (12, 9), health 33, stamina 7
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
      "id": "action-20-player-2-65",
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
          "row": 12,
          "column": 9
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:52.937Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 64 (round 20)
- Player: 花滿樓 (player-2), level 2, experience 84, at (12, 8), health 33, stamina 2
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
      "id": "action-20-player-2-66",
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
          "row": 12,
          "column": 8
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:52.944Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 65 (round 20)
- Player: 花滿樓 (player-2), level 2, experience 84, at (13, 8), health 33, stamina 0
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
      "id": "action-20-player-2-67",
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
          "row": 13,
          "column": 8
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:52.952Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 66 (round 21)
- Player: 花滿樓 (player-2), level 2, experience 84, at (13, 8), health 33, stamina 9
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
      "id": "action-21-player-2-68",
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
      "createdAt": "2026-09-02T16:33:52.953Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 67 (round 21)
- Player: 花滿樓 (player-2), level 2, experience 84, at (13, 7), health 33, stamina 7
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
      "id": "action-21-player-2-69",
      "round": 21,
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
          "row": 13,
          "column": 7
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:52.969Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 68 (round 21)
- Player: 花滿樓 (player-2), level 2, experience 84, at (12, 7), health 33, stamina 4
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
      "id": "action-21-player-2-70",
      "round": 21,
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
          "column": 7
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:52.988Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 69 (round 21)
- Player: 花滿樓 (player-2), level 2, experience 84, at (13, 7), health 33, stamina 2
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
      "id": "action-21-player-2-71",
      "round": 21,
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
          "row": 13,
          "column": 7
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:52.997Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 70 (round 21)
- Player: 花滿樓 (player-2), level 2, experience 84, at (13, 8), health 33, stamina 0
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
      "id": "action-21-player-2-72",
      "round": 21,
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
          "row": 13,
          "column": 8
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.005Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 71 (round 22)
- Player: 花滿樓 (player-2), level 2, experience 84, at (13, 8), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-22-player-2-73",
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
      "createdAt": "2026-09-02T16:33:53.006Z"
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
      "spawnedRound": 22,
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

### Turn 72 (round 22)
- Player: 花滿樓 (player-2), level 2, experience 84, at (13, 9), health 33, stamina 7
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
      "id": "action-22-player-2-74",
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
          "row": 13,
          "column": 9
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.029Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 73 (round 22)
- Player: 花滿樓 (player-2), level 2, experience 84, at (13, 10), health 33, stamina 5
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
      "id": "action-22-player-2-75",
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
          "row": 13,
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.042Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 74 (round 22)
- Player: 花滿樓 (player-2), level 2, experience 84, at (13, 11), health 33, stamina 1
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
      "id": "action-22-player-2-76",
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
          "row": 13,
          "column": 11
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.052Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 75 (round 22)
- Player: 花滿樓 (player-2), level 2, experience 84, at (13, 11), health 33, stamina 1
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
      "id": "action-22-player-2-77",
      "round": 22,
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
          "id": "item-point-19",
          "kind": "item",
          "position": {
            "row": 13,
            "column": 11
          }
        },
        "reason": "收集道具：拾取"
      },
      "result": "succeeded",
      "reason": "收集道具：拾取",
      "createdAt": "2026-09-02T16:33:53.056Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 76 (round 23)
- Player: 花滿樓 (player-2), level 2, experience 86, at (13, 11), health 33, stamina 9
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
      "id": "action-22-nest-creature-1-78",
      "round": 22,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.059Z"
    },
    {
      "id": "action-23-player-2-79",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:33:53.059Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 77 (round 23)
- Player: 花滿樓 (player-2), level 2, experience 86, at (12, 11), health 33, stamina 7
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
      "id": "action-23-player-2-80",
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
          "row": 12,
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:53.073Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 78 (round 23)
- Player: 花滿樓 (player-2), level 2, experience 86, at (11, 11), health 33, stamina 5
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
      "id": "action-23-player-2-81",
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
          "row": 11,
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:53.085Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 79 (round 23)
- Player: 花滿樓 (player-2), level 2, experience 86, at (10, 11), health 33, stamina 1
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
      "id": "action-23-player-2-82",
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
          "row": 10,
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:53.106Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 80 (round 24)
- Player: 花滿樓 (player-2), level 2, experience 88, at (10, 11), health 33, stamina 9
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
      "id": "action-23-nest-creature-1-83",
      "round": 23,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.108Z"
    },
    {
      "id": "action-24-player-2-84",
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
      "createdAt": "2026-09-02T16:33:53.109Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 81 (round 24)
- Player: 花滿樓 (player-2), level 2, experience 88, at (9, 11), health 33, stamina 5
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
      "id": "action-24-player-2-85",
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
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:53.121Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 82 (round 24)
- Player: 花滿樓 (player-2), level 2, experience 88, at (9, 11), health 33, stamina 2
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
      "id": "action-24-player-2-86",
      "round": 24,
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
        "gateId": "sect-gate-2",
        "skillType": "external",
        "skillId": "sharp-edge-external-damage",
        "reason": "學招：學習門派功法 銳鋒斬"
      },
      "result": "succeeded",
      "reason": "學招：學習門派功法 銳鋒斬",
      "createdAt": "2026-09-02T16:33:53.127Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 83 (round 24)
- Player: 花滿樓 (player-2), level 2, experience 88, at (9, 11), health 33, stamina 2
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
      "id": "action-24-player-2-87",
      "round": 24,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
      },
      "action": {
        "type": "equip-external-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "skillId": "sharp-edge-external-damage",
        "reason": "啟用外功：銳鋒斬"
      },
      "result": "succeeded",
      "reason": "啟用外功：銳鋒斬",
      "createdAt": "2026-09-02T16:33:53.132Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 84 (round 24)
- Player: 花滿樓 (player-2), level 2, experience 88, at (9, 10), health 33, stamina 0
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
      "id": "action-24-player-2-88",
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
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.138Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 85 (round 25)
- Player: 花滿樓 (player-2), level 2, experience 88, at (9, 10), health 33, stamina 9
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
      "id": "action-24-nest-creature-1-89",
      "round": 24,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.139Z"
    },
    {
      "id": "action-25-player-2-90",
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
      "createdAt": "2026-09-02T16:33:53.139Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 86 (round 25)
- Player: 花滿樓 (player-2), level 2, experience 88, at (10, 10), health 33, stamina 7
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
      "id": "action-25-player-2-91",
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
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.146Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 87 (round 25)
- Player: 花滿樓 (player-2), level 2, experience 88, at (11, 10), health 33, stamina 5
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
      "id": "action-25-player-2-92",
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
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.155Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 88 (round 25)
- Player: 花滿樓 (player-2), level 2, experience 88, at (12, 10), health 33, stamina 0
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
      "id": "action-25-player-2-93",
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
          "row": 12,
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.162Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 89 (round 26)
- Player: 花滿樓 (player-2), level 2, experience 88, at (12, 10), health 33, stamina 9
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
      "id": "action-25-nest-creature-1-94",
      "round": 25,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.162Z"
    },
    {
      "id": "action-26-player-2-95",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-02T16:33:53.162Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 90 (round 26)
- Player: 花滿樓 (player-2), level 2, experience 88, at (13, 10), health 33, stamina 7
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
      "id": "action-26-player-2-96",
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
          "row": 13,
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.170Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 91 (round 26)
- Player: 花滿樓 (player-2), level 2, experience 88, at (13, 11), health 33, stamina 3
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
      "id": "action-26-player-2-97",
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
          "row": 13,
          "column": 11
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.176Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 92 (round 26)
- Player: 花滿樓 (player-2), level 2, experience 88, at (12, 11), health 33, stamina 1
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
          "column": 11
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.187Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 93 (round 27)
- Player: 花滿樓 (player-2), level 2, experience 90, at (12, 11), health 33, stamina 9
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
      "id": "action-26-nest-creature-1-99",
      "round": 26,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.191Z"
    },
    {
      "id": "action-27-player-2-100",
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
      "createdAt": "2026-09-02T16:33:53.191Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 94 (round 27)
- Player: 花滿樓 (player-2), level 2, experience 90, at (12, 11), health 33, stamina 7
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
      "id": "action-27-player-2-101",
      "round": 27,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-02T16:33:53.196Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 95 (round 27)
- Player: 花滿樓 (player-2), level 2, experience 90, at (12, 11), health 33, stamina 5
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
      "id": "action-27-player-2-102",
      "round": 27,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-02T16:33:53.209Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 96 (round 27)
- Player: 花滿樓 (player-2), level 2, experience 90, at (12, 11), health 33, stamina 3
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
      "id": "action-27-player-2-103",
      "round": 27,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-02T16:33:53.214Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 97 (round 27)
- Player: 花滿樓 (player-2), level 2, experience 90, at (11, 11), health 33, stamina 1
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
      "id": "action-27-player-2-104",
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
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:53.227Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 98 (round 28)
- Player: 花滿樓 (player-2), level 2, experience 92, at (11, 11), health 33, stamina 9
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
      "id": "action-27-nest-creature-1-105",
      "round": 27,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.231Z"
    },
    {
      "id": "action-28-player-2-106",
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
      "createdAt": "2026-09-02T16:33:53.231Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 99 (round 28)
- Player: 花滿樓 (player-2), level 2, experience 92, at (10, 11), health 33, stamina 5
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
      "id": "action-28-player-2-107",
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
          "row": 10,
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:53.244Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 100 (round 28)
- Player: 花滿樓 (player-2), level 2, experience 92, at (9, 11), health 33, stamina 1
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
      "id": "action-28-player-2-108",
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
          "row": 9,
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:53.257Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 101 (round 29)
- Player: 花滿樓 (player-2), level 2, experience 94, at (9, 11), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-28-nest-creature-1-109",
      "round": 28,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.259Z"
    },
    {
      "id": "action-29-player-2-110",
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
      "createdAt": "2026-09-02T16:33:53.260Z"
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
      "id": "nest-creature-2",
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
      "spawnedRound": 29,
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

### Turn 102 (round 29)
- Player: 花滿樓 (player-2), level 2, experience 94, at (9, 11), health 33, stamina 6
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-29-player-2-111",
      "round": 29,
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
        "gateId": "sect-gate-2",
        "skillType": "external",
        "skillId": "sharp-edge-external-functional",
        "reason": "學招：學習門派功法 劍心明鑑"
      },
      "result": "succeeded",
      "reason": "學招：學習門派功法 劍心明鑑",
      "createdAt": "2026-09-02T16:33:53.270Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 103 (round 29)
- Player: 花滿樓 (player-2), level 2, experience 94, at (9, 10), health 33, stamina 4
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-29-player-2-112",
      "round": 29,
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
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.277Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 104 (round 29)
- Player: 花滿樓 (player-2), level 2, experience 94, at (10, 10), health 33, stamina 2
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-29-player-2-113",
      "round": 29,
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
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.286Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 105 (round 29)
- Player: 花滿樓 (player-2), level 2, experience 94, at (11, 10), health 33, stamina 0
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-29-player-2-114",
      "round": 29,
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
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.290Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 106 (round 30)
- Player: 花滿樓 (player-2), level 2, experience 94, at (11, 10), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-29-nest-creature-1-115",
      "round": 29,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.291Z"
    },
    {
      "id": "action-29-nest-creature-2-116",
      "round": 29,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:33:53.291Z"
    },
    {
      "id": "action-30-player-2-117",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-02T16:33:53.291Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 107 (round 30)
- Player: 花滿樓 (player-2), level 2, experience 94, at (12, 10), health 33, stamina 4
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-30-player-2-118",
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
          "row": 12,
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.298Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 108 (round 30)
- Player: 花滿樓 (player-2), level 2, experience 94, at (13, 10), health 33, stamina 2
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-30-player-2-119",
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
          "row": 13,
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.308Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 109 (round 30)
- Player: 花滿樓 (player-2), level 2, experience 94, at (13, 9), health 33, stamina 0
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-30-player-2-120",
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
          "row": 13,
          "column": 9
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.312Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 110 (round 31)
- Player: 花滿樓 (player-2), level 2, experience 94, at (13, 9), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-30-nest-creature-1-121",
      "round": 30,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.312Z"
    },
    {
      "id": "action-30-nest-creature-2-122",
      "round": 30,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:33:53.312Z"
    },
    {
      "id": "action-31-player-2-123",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-02T16:33:53.313Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 111 (round 31)
- Player: 花滿樓 (player-2), level 2, experience 94, at (12, 9), health 33, stamina 7
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-31-player-2-124",
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
          "row": 12,
          "column": 9
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.322Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 112 (round 31)
- Player: 花滿樓 (player-2), level 2, experience 94, at (12, 8), health 33, stamina 2
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-31-player-2-125",
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
          "row": 12,
          "column": 8
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.328Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 113 (round 31)
- Player: 花滿樓 (player-2), level 2, experience 94, at (13, 8), health 33, stamina 0
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-31-player-2-126",
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
          "row": 13,
          "column": 8
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.334Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 114 (round 32)
- Player: 花滿樓 (player-2), level 2, experience 94, at (13, 8), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-31-nest-creature-1-127",
      "round": 31,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.335Z"
    },
    {
      "id": "action-31-nest-creature-2-128",
      "round": 31,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:33:53.335Z"
    },
    {
      "id": "action-32-player-2-129",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-02T16:33:53.335Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 115 (round 32)
- Player: 花滿樓 (player-2), level 2, experience 94, at (13, 7), health 33, stamina 7
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-32-player-2-130",
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
          "row": 13,
          "column": 7
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.345Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 116 (round 32)
- Player: 花滿樓 (player-2), level 2, experience 94, at (12, 7), health 33, stamina 4
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-32-player-2-131",
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
          "row": 12,
          "column": 7
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.354Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 117 (round 32)
- Player: 花滿樓 (player-2), level 2, experience 94, at (13, 7), health 33, stamina 2
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-32-player-2-132",
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
          "row": 13,
          "column": 7
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.362Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 118 (round 32)
- Player: 花滿樓 (player-2), level 2, experience 94, at (13, 8), health 33, stamina 0
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-32-player-2-133",
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
          "row": 13,
          "column": 8
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.377Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 119 (round 33)
- Player: 花滿樓 (player-2), level 2, experience 94, at (13, 8), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-32-nest-creature-1-134",
      "round": 32,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.377Z"
    },
    {
      "id": "action-32-nest-creature-2-135",
      "round": 32,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:33:53.377Z"
    },
    {
      "id": "action-33-player-2-136",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-02T16:33:53.377Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 120 (round 33)
- Player: 花滿樓 (player-2), level 2, experience 94, at (13, 9), health 33, stamina 7
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-33-player-2-137",
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
          "row": 13,
          "column": 9
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.389Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 121 (round 33)
- Player: 花滿樓 (player-2), level 2, experience 94, at (13, 10), health 33, stamina 5
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-33-player-2-138",
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
          "row": 13,
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.396Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 122 (round 33)
- Player: 花滿樓 (player-2), level 2, experience 94, at (13, 11), health 33, stamina 1
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-33-player-2-139",
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
          "row": 13,
          "column": 11
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.404Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 123 (round 34)
- Player: 花滿樓 (player-2), level 2, experience 96, at (13, 11), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-33-nest-creature-1-140",
      "round": 33,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.407Z"
    },
    {
      "id": "action-33-nest-creature-2-141",
      "round": 33,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:33:53.407Z"
    },
    {
      "id": "action-34-player-2-142",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:33:53.408Z"
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
      "id": "nest-creature-3",
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
      "spawnedRound": 34,
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

### Turn 124 (round 34)
- Player: 花滿樓 (player-2), level 2, experience 96, at (12, 11), health 33, stamina 7
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-34-player-2-143",
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
          "row": 12,
          "column": 11
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.419Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 125 (round 34)
- Player: 花滿樓 (player-2), level 2, experience 96, at (12, 11), health 33, stamina 5
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-34-player-2-144",
      "round": 34,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-02T16:33:53.424Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 126 (round 34)
- Player: 花滿樓 (player-2), level 2, experience 96, at (12, 11), health 33, stamina 3
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-34-player-2-145",
      "round": 34,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-02T16:33:53.429Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 127 (round 34)
- Player: 花滿樓 (player-2), level 2, experience 96, at (12, 11), health 33, stamina 1
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-34-player-2-146",
      "round": 34,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "花滿樓"
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
      "createdAt": "2026-09-02T16:33:53.436Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 128 (round 35)
- Player: 花滿樓 (player-2), level 2, experience 98, at (12, 11), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-34-nest-creature-1-147",
      "round": 34,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.439Z"
    },
    {
      "id": "action-34-nest-creature-2-148",
      "round": 34,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:33:53.439Z"
    },
    {
      "id": "action-34-nest-creature-3-149",
      "round": 34,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
      "createdAt": "2026-09-02T16:33:53.440Z"
    },
    {
      "id": "action-35-player-2-150",
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
      "createdAt": "2026-09-02T16:33:53.440Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 129 (round 35)
- Player: 花滿樓 (player-2), level 2, experience 98, at (11, 11), health 33, stamina 7
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-35-player-2-151",
      "round": 35,
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
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:53.447Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 130 (round 35)
- Player: 花滿樓 (player-2), level 2, experience 98, at (10, 11), health 33, stamina 3
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-35-player-2-152",
      "round": 35,
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
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:53.459Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 131 (round 35)
- Player: 花滿樓 (player-2), level 2, experience 98, at (10, 10), health 33, stamina 1
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-35-player-2-153",
      "round": 35,
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
          "column": 10
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:53.471Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 132 (round 36)
- Player: 花滿樓 (player-2), level 3, experience 0, at (10, 10), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: -98 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-35-nest-creature-1-154",
      "round": 35,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.473Z"
    },
    {
      "id": "action-35-nest-creature-2-155",
      "round": 35,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:33:53.473Z"
    },
    {
      "id": "action-35-nest-creature-3-156",
      "round": 35,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "destination": {
          "row": 10,
          "column": 7
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-02T16:33:53.473Z"
    },
    {
      "id": "action-36-player-2-157",
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
      "createdAt": "2026-09-02T16:33:53.474Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 133 (round 36)
- Player: 花滿樓 (player-2), level 3, experience 0, at (10, 10), health 33, stamina 9
- Attributes: armStrength=10, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-36-player-2-158",
      "round": 36,
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
      "createdAt": "2026-09-02T16:33:53.485Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 134 (round 36)
- Player: 花滿樓 (player-2), level 3, experience 0, at (10, 10), health 33, stamina 9
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-36-player-2-159",
      "round": 36,
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
      "createdAt": "2026-09-02T16:33:53.494Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 135 (round 36)
- Player: 花滿樓 (player-2), level 3, experience 0, at (11, 10), health 33, stamina 7
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-36-player-2-160",
      "round": 36,
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
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.505Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 136 (round 36)
- Player: 花滿樓 (player-2), level 3, experience 0, at (12, 10), health 33, stamina 2
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-36-player-2-161",
      "round": 36,
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
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.512Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 137 (round 36)
- Player: 花滿樓 (player-2), level 3, experience 0, at (12, 9), health 33, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-36-player-2-162",
      "round": 36,
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
          "column": 9
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.518Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 138 (round 37)
- Player: 花滿樓 (player-2), level 3, experience 0, at (12, 9), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-36-nest-creature-1-163",
      "round": 36,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.518Z"
    },
    {
      "id": "action-36-nest-creature-2-164",
      "round": 36,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:33:53.518Z"
    },
    {
      "id": "action-36-nest-creature-3-165",
      "round": 36,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "destination": {
          "row": 13,
          "column": 8
        },
        "reason": "移動接近 橫塘。"
      },
      "result": "succeeded",
      "reason": "移動接近 橫塘。",
      "createdAt": "2026-09-02T16:33:53.519Z"
    },
    {
      "id": "action-37-player-2-166",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-02T16:33:53.519Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 139 (round 37)
- Player: 花滿樓 (player-2), level 3, experience 0, at (13, 9), health 33, stamina 8
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-37-player-2-167",
      "round": 37,
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
          "row": 13,
          "column": 9
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.532Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 140 (round 37)
- Player: 花滿樓 (player-2), level 3, experience 3, at (13, 9), health 33, stamina 3
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-37-player-2-168",
      "round": 37,
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
          "id": "nest-creature-3",
          "kind": "creature",
          "position": {
            "row": 13,
            "column": 8
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.4"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.4",
      "createdAt": "2026-09-02T16:33:53.542Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 141 (round 37)
- Player: 花滿樓 (player-2), level 3, experience 3, at (13, 10), health 33, stamina 1
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-37-player-2-169",
      "round": 37,
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
          "row": 13,
          "column": 10
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:33:53.550Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 142 (round 38)
- Player: 花滿樓 (player-2), level 3, experience 5, at (13, 10), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-37-nest-creature-1-170",
      "round": 37,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.553Z"
    },
    {
      "id": "action-37-nest-creature-2-171",
      "round": 37,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:33:53.553Z"
    },
    {
      "id": "action-37-nest-creature-3-172",
      "round": 37,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
            "row": 12,
            "column": 12
          }
        },
        "reason": "與 橫塘 交戰。"
      },
      "result": "succeeded",
      "reason": "與 橫塘 交戰。",
      "createdAt": "2026-09-02T16:33:53.554Z"
    },
    {
      "id": "action-38-player-2-173",
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
        "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:33:53.554Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-1",
      "creatureName": "生物巢穴 1的怪物 Lv.2",
      "message": "生物巢穴 1的怪物 Lv.2 發現並摧毀了道具點。"
    },
    {
      "creatureId": "nest-creature-3",
      "creatureName": "生物巢穴 1的怪物 Lv.4",
      "message": "生物巢穴 1的怪物 Lv.4 攻擊橫塘，造成 14 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 143 (round 38)
- Player: 花滿樓 (player-2), level 3, experience 5, at (13, 11), health 33, stamina 6
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-38-player-2-174",
      "round": 38,
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
          "row": 13,
          "column": 11
        },
        "reason": "交戰：移動到 生物巢穴 1的怪物 Lv.4 附近"
      },
      "result": "succeeded",
      "reason": "交戰：移動到 生物巢穴 1的怪物 Lv.4 附近",
      "createdAt": "2026-09-02T16:33:53.563Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 144 (round 38)
- Player: 花滿樓 (player-2), level 3, experience 85, at (13, 11), health 33, stamina 1
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +80
- Spawned creatures: 0
- Defeated creatures: nest-creature-3
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-38-player-2-175",
      "round": 38,
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
          "id": "nest-creature-3",
          "kind": "creature",
          "position": {
            "row": 12,
            "column": 11
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.4"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.4",
      "createdAt": "2026-09-02T16:33:53.574Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 145 (round 39)
- Player: 花滿樓 (player-2), level 3, experience 87, at (13, 11), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-38-nest-creature-1-176",
      "round": 38,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.576Z"
    },
    {
      "id": "action-38-nest-creature-2-177",
      "round": 38,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:33:53.576Z"
    },
    {
      "id": "action-39-player-2-178",
      "round": 39,
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
      "createdAt": "2026-09-02T16:33:53.577Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 146 (round 39)
- Player: 花滿樓 (player-2), level 3, experience 87, at (12, 11), health 33, stamina 8
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-39-player-2-179",
      "round": 39,
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
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:53.588Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 147 (round 39)
- Player: 花滿樓 (player-2), level 3, experience 87, at (11, 11), health 33, stamina 6
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-39-player-2-180",
      "round": 39,
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
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:53.594Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 148 (round 39)
- Player: 花滿樓 (player-2), level 3, experience 87, at (10, 11), health 33, stamina 2
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-39-player-2-181",
      "round": 39,
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
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:53.605Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 149 (round 39)
- Player: 花滿樓 (player-2), level 3, experience 87, at (10, 10), health 33, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-39-player-2-182",
      "round": 39,
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
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.610Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 150 (round 40)
- Player: 花滿樓 (player-2), level 3, experience 87, at (10, 10), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-39-nest-creature-1-183",
      "round": 39,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.610Z"
    },
    {
      "id": "action-39-nest-creature-2-184",
      "round": 39,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:33:53.610Z"
    },
    {
      "id": "action-40-player-2-185",
      "round": 40,
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
      "createdAt": "2026-09-02T16:33:53.610Z"
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
      "id": "nest-creature-3",
      "name": "生物巢穴 1的怪物 Lv.5",
      "innerSkillId": "sharp-edge-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 8,
        "column": 3
      },
      "attributes": {
        "armStrength": 20,
        "constitution": 7,
        "agility": 16,
        "innerEnergy": 7,
        "insight": 7
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 5,
      "behaviorType": "sieger",
      "schoolId": "sharp-edge",
      "homePosition": {
        "row": 9,
        "column": 3
      },
      "homeNestId": "creature-nest-1",
      "spawnedRound": 40,
      "baseAttributes": {
        "armStrength": 18.2,
        "constitution": 7,
        "agility": 15.399999999999999,
        "innerEnergy": 7,
        "insight": 7
      },
      "health": 21,
      "maxHealth": 21,
      "stamina": 18,
      "maxStamina": 18,
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

### Turn 151 (round 40)
- Player: 花滿樓 (player-2), level 3, experience 87, at (11, 10), health 33, stamina 8
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-40-player-2-186",
      "round": 40,
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
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.618Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 152 (round 40)
- Player: 花滿樓 (player-2), level 3, experience 87, at (12, 10), health 33, stamina 3
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-40-player-2-187",
      "round": 40,
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
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.625Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 153 (round 40)
- Player: 花滿樓 (player-2), level 3, experience 87, at (12, 9), health 33, stamina 1
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-40-player-2-188",
      "round": 40,
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
          "column": 9
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.631Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 154 (round 41)
- Player: 花滿樓 (player-2), level 3, experience 89, at (12, 9), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-40-nest-creature-1-189",
      "round": 40,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.635Z"
    },
    {
      "id": "action-40-nest-creature-2-190",
      "round": 40,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:33:53.636Z"
    },
    {
      "id": "action-40-nest-creature-3-191",
      "round": 40,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.5"
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
      "createdAt": "2026-09-02T16:33:53.636Z"
    },
    {
      "id": "action-41-player-2-192",
      "round": 41,
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
      "createdAt": "2026-09-02T16:33:53.636Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 155 (round 41)
- Player: 花滿樓 (player-2), level 3, experience 89, at (13, 9), health 33, stamina 8
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-41-player-2-193",
      "round": 41,
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
          "row": 13,
          "column": 9
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:53.643Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 156 (round 41)
- Player: 花滿樓 (player-2), level 3, experience 89, at (13, 10), health 33, stamina 6
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-41-player-2-194",
      "round": 41,
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
          "row": 13,
          "column": 10
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:53.651Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 157 (round 41)
- Player: 花滿樓 (player-2), level 3, experience 89, at (13, 11), health 33, stamina 2
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-41-player-2-195",
      "round": 41,
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
          "row": 13,
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:53.658Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 158 (round 41)
- Player: 花滿樓 (player-2), level 3, experience 89, at (12, 11), health 33, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-41-player-2-196",
      "round": 41,
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
          "column": 11
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.663Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 159 (round 42)
- Player: 花滿樓 (player-2), level 3, experience 89, at (12, 11), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-41-nest-creature-1-197",
      "round": 41,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.663Z"
    },
    {
      "id": "action-41-nest-creature-2-198",
      "round": 41,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:33:53.663Z"
    },
    {
      "id": "action-41-nest-creature-3-199",
      "round": 41,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.5"
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
      "createdAt": "2026-09-02T16:33:53.663Z"
    },
    {
      "id": "action-42-player-2-200",
      "round": 42,
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
      "createdAt": "2026-09-02T16:33:53.663Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 160 (round 42)
- Player: 花滿樓 (player-2), level 3, experience 89, at (11, 11), health 33, stamina 8
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-42-player-2-201",
      "round": 42,
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
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:53.671Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 161 (round 42)
- Player: 花滿樓 (player-2), level 3, experience 89, at (10, 11), health 33, stamina 4
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-42-player-2-202",
      "round": 42,
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
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:53.681Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 162 (round 42)
- Player: 花滿樓 (player-2), level 3, experience 89, at (9, 11), health 33, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-42-player-2-203",
      "round": 42,
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
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:33:53.691Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 163 (round 43)
- Player: 花滿樓 (player-2), level 3, experience 89, at (9, 11), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-42-nest-creature-1-204",
      "round": 42,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.691Z"
    },
    {
      "id": "action-42-nest-creature-2-205",
      "round": 42,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:33:53.691Z"
    },
    {
      "id": "action-42-nest-creature-3-206",
      "round": 42,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.5"
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
      "createdAt": "2026-09-02T16:33:53.691Z"
    },
    {
      "id": "action-43-player-2-207",
      "round": 43,
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
      "createdAt": "2026-09-02T16:33:53.691Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 164 (round 43)
- Player: 花滿樓 (player-2), level 3, experience 92, at (9, 11), health 33, stamina 5
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-43-player-2-208",
      "round": 43,
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
          "id": "nest-creature-3",
          "kind": "creature",
          "position": {
            "row": 9,
            "column": 10
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.5"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.5",
      "createdAt": "2026-09-02T16:33:53.700Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 165 (round 43)
- Player: 花滿樓 (player-2), level 3, experience 95, at (9, 11), health 33, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-43-player-2-209",
      "round": 43,
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
          "id": "nest-creature-3",
          "kind": "creature",
          "position": {
            "row": 9,
            "column": 10
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.5"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.5",
      "createdAt": "2026-09-02T16:33:53.707Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 166 (round 44)
- Player: 花滿樓 (player-2), level 3, experience 95, at (9, 11), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-43-nest-creature-1-210",
      "round": 43,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.707Z"
    },
    {
      "id": "action-43-nest-creature-2-211",
      "round": 43,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:33:53.708Z"
    },
    {
      "id": "action-43-nest-creature-3-212",
      "round": 43,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.5"
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
            "row": 12,
            "column": 12
          }
        },
        "reason": "與 橫塘 交戰。"
      },
      "result": "succeeded",
      "reason": "與 橫塘 交戰。",
      "createdAt": "2026-09-02T16:33:53.708Z"
    },
    {
      "id": "action-44-player-2-213",
      "round": 44,
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
      "createdAt": "2026-09-02T16:33:53.708Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-3",
      "creatureName": "生物巢穴 1的怪物 Lv.5",
      "message": "生物巢穴 1的怪物 Lv.5 攻擊橫塘，造成 18 點傷害。"
    },
    {
      "creatureId": "creature-nest-1",
      "creatureName": "生物巢穴 1",
      "message": "生物巢穴 1 生成了 Lv.6 怪物。"
    }
  ],
  "spawnedCreatures": [
    {
      "id": "nest-creature-4",
      "name": "生物巢穴 1的怪物 Lv.6",
      "innerSkillId": "sharp-edge-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 8,
        "column": 3
      },
      "attributes": {
        "armStrength": 23,
        "constitution": 7,
        "agility": 19,
        "innerEnergy": 7,
        "insight": 7
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 6,
      "behaviorType": "sieger",
      "schoolId": "sharp-edge",
      "homePosition": {
        "row": 9,
        "column": 3
      },
      "homeNestId": "creature-nest-1",
      "spawnedRound": 44,
      "baseAttributes": {
        "armStrength": 21.7,
        "constitution": 7.699999999999999,
        "agility": 18.2,
        "innerEnergy": 7.699999999999999,
        "insight": 7.699999999999999
      },
      "health": 21,
      "maxHealth": 21,
      "stamina": 21,
      "maxStamina": 21,
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

### Turn 167 (round 44)
- Player: 花滿樓 (player-2), level 3, experience 95, at (9, 11), health 33, stamina 7
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-44-player-2-214",
      "round": 44,
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
        "gateId": "sect-gate-2",
        "skillType": "external",
        "skillId": "sharp-edge-external-functional-2",
        "reason": "學招：學習門派功法 凌厲劍勢"
      },
      "result": "succeeded",
      "reason": "學招：學習門派功法 凌厲劍勢",
      "createdAt": "2026-09-02T16:33:53.717Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 168 (round 44)
- Player: 花滿樓 (player-2), level 3, experience 95, at (9, 10), health 33, stamina 5
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-44-player-2-215",
      "round": 44,
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
          "column": 10
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:33:53.725Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 169 (round 44)
- Player: 花滿樓 (player-2), level 3, experience 95, at (10, 10), health 33, stamina 3
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-44-player-2-216",
      "round": 44,
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
          "column": 10
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:33:53.734Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 170 (round 44)
- Player: 花滿樓 (player-2), level 3, experience 95, at (11, 10), health 33, stamina 1
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-44-player-2-217",
      "round": 44,
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
          "column": 10
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:33:53.742Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 171 (round 45)
- Player: 花滿樓 (player-2), level 3, experience 97, at (11, 10), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-44-nest-creature-1-218",
      "round": 44,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.744Z"
    },
    {
      "id": "action-44-nest-creature-2-219",
      "round": 44,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:33:53.744Z"
    },
    {
      "id": "action-44-nest-creature-3-220",
      "round": 44,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.5"
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
            "row": 12,
            "column": 12
          }
        },
        "reason": "與 橫塘 交戰。"
      },
      "result": "succeeded",
      "reason": "與 橫塘 交戰。",
      "createdAt": "2026-09-02T16:33:53.744Z"
    },
    {
      "id": "action-44-nest-creature-4-221",
      "round": 44,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.6"
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
      "createdAt": "2026-09-02T16:33:53.745Z"
    },
    {
      "id": "action-45-player-2-222",
      "round": 45,
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
        "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:33:53.745Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 172 (round 45)
- Player: 花滿樓 (player-2), level 3, experience 97, at (12, 10), health 33, stamina 5
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-45-player-2-223",
      "round": 45,
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
          "column": 10
        },
        "reason": "交戰：移動到 生物巢穴 1的怪物 Lv.5 附近"
      },
      "result": "succeeded",
      "reason": "交戰：移動到 生物巢穴 1的怪物 Lv.5 附近",
      "createdAt": "2026-09-02T16:33:53.752Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 173 (round 45)
- Player: 花滿樓 (player-2), level 3, experience 100, at (12, 10), health 33, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-45-player-2-224",
      "round": 45,
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
          "id": "nest-creature-3",
          "kind": "creature",
          "position": {
            "row": 12,
            "column": 11
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.5"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.5",
      "createdAt": "2026-09-02T16:33:53.758Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 174 (round 46)
- Player: 花滿樓 (player-2), level 3, experience 100, at (12, 10), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-45-nest-creature-1-225",
      "round": 45,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.758Z"
    },
    {
      "id": "action-45-nest-creature-2-226",
      "round": 45,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:33:53.758Z"
    },
    {
      "id": "action-45-nest-creature-3-227",
      "round": 45,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.5"
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
            "row": 12,
            "column": 12
          }
        },
        "reason": "與 橫塘 交戰。"
      },
      "result": "succeeded",
      "reason": "與 橫塘 交戰。",
      "createdAt": "2026-09-02T16:33:53.758Z"
    },
    {
      "id": "action-45-nest-creature-4-228",
      "round": 45,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.6"
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
      "createdAt": "2026-09-02T16:33:53.758Z"
    },
    {
      "id": "action-46-player-2-229",
      "round": 46,
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
      "createdAt": "2026-09-02T16:33:53.759Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 175 (round 46)
- Player: 花滿樓 (player-2), level 4, experience 50, at (12, 10), health 33, stamina 5
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: -50 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: nest-creature-3
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-46-player-2-230",
      "round": 46,
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
          "id": "nest-creature-3",
          "kind": "creature",
          "position": {
            "row": 12,
            "column": 11
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.5"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.5",
      "createdAt": "2026-09-02T16:33:53.767Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 176 (round 46)
- Player: 花滿樓 (player-2), level 4, experience 50, at (12, 10), health 33, stamina 5
- Attributes: armStrength=12, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-46-player-2-231",
      "round": 46,
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
      "createdAt": "2026-09-02T16:33:53.773Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 177 (round 46)
- Player: 花滿樓 (player-2), level 4, experience 50, at (12, 10), health 33, stamina 5
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-46-player-2-232",
      "round": 46,
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
      "createdAt": "2026-09-02T16:33:53.778Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 178 (round 46)
- Player: 花滿樓 (player-2), level 4, experience 50, at (12, 10), health 33, stamina 5
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-46-player-2-233",
      "round": 46,
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
        "skillId": "sharp-edge-inner",
        "reason": "裝備功法：銳鋒淬芒"
      },
      "result": "succeeded",
      "reason": "裝備功法：銳鋒淬芒",
      "createdAt": "2026-09-02T16:33:53.784Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 179 (round 46)
- Player: 花滿樓 (player-2), level 4, experience 50, at (13, 10), health 33, stamina 3
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-46-player-2-234",
      "round": 46,
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
          "row": 13,
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.789Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 180 (round 46)
- Player: 花滿樓 (player-2), level 4, experience 50, at (13, 9), health 33, stamina 1
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-46-player-2-235",
      "round": 46,
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
          "row": 13,
          "column": 9
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.794Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 181 (round 47)
- Player: 花滿樓 (player-2), level 4, experience 52, at (13, 9), health 27, stamina 12
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-46-nest-creature-1-236",
      "round": 46,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.796Z"
    },
    {
      "id": "action-46-nest-creature-2-237",
      "round": 46,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:33:53.796Z"
    },
    {
      "id": "action-46-nest-creature-4-238",
      "round": 46,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.6"
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
      "createdAt": "2026-09-02T16:33:53.796Z"
    },
    {
      "id": "action-47-player-2-239",
      "round": 47,
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
      "createdAt": "2026-09-02T16:33:53.796Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 182 (round 47)
- Player: 花滿樓 (player-2), level 4, experience 52, at (12, 9), health 27, stamina 10
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-47-player-2-240",
      "round": 47,
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
          "column": 9
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.803Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 183 (round 47)
- Player: 花滿樓 (player-2), level 4, experience 52, at (12, 8), health 27, stamina 5
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-47-player-2-241",
      "round": 47,
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
          "column": 8
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.809Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 184 (round 47)
- Player: 花滿樓 (player-2), level 4, experience 52, at (13, 8), health 27, stamina 3
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-47-player-2-242",
      "round": 47,
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
          "row": 13,
          "column": 8
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.818Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 185 (round 47)
- Player: 花滿樓 (player-2), level 4, experience 52, at (13, 7), health 27, stamina 1
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-47-player-2-243",
      "round": 47,
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
          "row": 13,
          "column": 7
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.824Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 186 (round 48)
- Player: 花滿樓 (player-2), level 4, experience 54, at (13, 7), health 7.35, stamina 12
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +2
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-47-nest-creature-1-244",
      "round": 47,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.826Z"
    },
    {
      "id": "action-47-nest-creature-2-245",
      "round": 47,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:33:53.826Z"
    },
    {
      "id": "action-47-nest-creature-4-246",
      "round": 47,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.6"
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
            "row": 13,
            "column": 7
          }
        },
        "reason": "與 花滿樓 交戰。"
      },
      "result": "succeeded",
      "reason": "與 花滿樓 交戰。",
      "createdAt": "2026-09-02T16:33:53.827Z"
    },
    {
      "id": "action-48-player-2-247",
      "round": 48,
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
      "createdAt": "2026-09-02T16:33:53.828Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "creature-nest-1",
      "creatureName": "生物巢穴 1",
      "message": "生物巢穴 1 生成了 Lv.7 怪物。"
    }
  ],
  "spawnedCreatures": [
    {
      "id": "nest-creature-3",
      "name": "生物巢穴 1的怪物 Lv.7",
      "innerSkillId": "sharp-edge-inner",
      "externalSkillIds": [
        "sharp-edge-external-functional"
      ],
      "equippedExternalSkillIds": [
        "sharp-edge-external-functional"
      ],
      "position": {
        "row": 8,
        "column": 3
      },
      "attributes": {
        "armStrength": 27,
        "constitution": 8,
        "agility": 22,
        "innerEnergy": 8,
        "insight": 8
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 7,
      "behaviorType": "sieger",
      "schoolId": "sharp-edge",
      "homePosition": {
        "row": 9,
        "column": 3
      },
      "homeNestId": "creature-nest-1",
      "spawnedRound": 48,
      "baseAttributes": {
        "armStrength": 25.2,
        "constitution": 8.399999999999999,
        "agility": 21,
        "innerEnergy": 8.399999999999999,
        "insight": 8.399999999999999
      },
      "health": 24,
      "maxHealth": 24,
      "stamina": 24.5,
      "maxStamina": 24.5,
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

### Turn 187 (round 48)
- Player: 花滿樓 (player-2), level 4, experience 57, at (13, 7), health 7.35, stamina 7
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-48-player-2-248",
      "round": 48,
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
          "id": "nest-creature-4",
          "kind": "creature",
          "position": {
            "row": 13,
            "column": 6
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.6"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.6",
      "createdAt": "2026-09-02T16:33:53.838Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 188 (round 48)
- Player: 花滿樓 (player-2), level 4, experience 60, at (13, 7), health 7.35, stamina 2
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-48-player-2-249",
      "round": 48,
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
          "id": "nest-creature-4",
          "kind": "creature",
          "position": {
            "row": 13,
            "column": 6
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.6"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.6",
      "createdAt": "2026-09-02T16:33:53.847Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 189 (round 48)
- Player: 花滿樓 (player-2), level 4, experience 60, at (13, 8), health 7.35, stamina 0
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-48-player-2-250",
      "round": 48,
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
          "row": 13,
          "column": 8
        },
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.6（hitsSurvivable=1.2249999999999999）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.6（hitsSurvivable=1.2249999999999999）",
      "createdAt": "2026-09-02T16:33:53.853Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 190 (round 49)
- Player: 花滿樓 (player-2), level 4, experience 60, at (13, 8), health 8.7, stamina 12
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-48-nest-creature-1-251",
      "round": 48,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.853Z"
    },
    {
      "id": "action-48-nest-creature-2-252",
      "round": 48,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:33:53.853Z"
    },
    {
      "id": "action-48-nest-creature-4-253",
      "round": 48,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.6"
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
            "row": 12,
            "column": 12
          }
        },
        "reason": "與 橫塘 交戰。"
      },
      "result": "succeeded",
      "reason": "與 橫塘 交戰。",
      "createdAt": "2026-09-02T16:33:53.853Z"
    },
    {
      "id": "action-48-nest-creature-3-254",
      "round": 48,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.7"
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
      "createdAt": "2026-09-02T16:33:53.854Z"
    },
    {
      "id": "action-49-player-2-255",
      "round": 49,
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
      "createdAt": "2026-09-02T16:33:53.854Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 191 (round 49)
- Player: 花滿樓 (player-2), level 4, experience 60, at (13, 9), health 8.7, stamina 10
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-49-player-2-256",
      "round": 49,
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
          "row": 13,
          "column": 9
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.867Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 192 (round 49)
- Player: 花滿樓 (player-2), level 4, experience 60, at (13, 10), health 8.7, stamina 8
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-49-player-2-257",
      "round": 49,
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
          "row": 13,
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.875Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 193 (round 49)
- Player: 花滿樓 (player-2), level 4, experience 60, at (13, 11), health 8.7, stamina 4
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-49-player-2-258",
      "round": 49,
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
          "row": 13,
          "column": 11
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.884Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 194 (round 49)
- Player: 花滿樓 (player-2), level 4, experience 60, at (13, 10), health 8.7, stamina 2
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-49-player-2-259",
      "round": 49,
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
          "row": 13,
          "column": 10
        },
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.6（hitsSurvivable=1.45）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.6（hitsSurvivable=1.45）",
      "createdAt": "2026-09-02T16:33:53.892Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 195 (round 49)
- Player: 花滿樓 (player-2), level 4, experience 60, at (13, 9), health 8.7, stamina 0
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-49-player-2-260",
      "round": 49,
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
          "row": 13,
          "column": 9
        },
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.6（hitsSurvivable=1.45）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.6（hitsSurvivable=1.45）",
      "createdAt": "2026-09-02T16:33:53.897Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 196 (round 50)
- Player: 花滿樓 (player-2), level 4, experience 60, at (13, 9), health 10.049999999999999, stamina 12
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-49-nest-creature-1-261",
      "round": 49,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.897Z"
    },
    {
      "id": "action-49-nest-creature-2-262",
      "round": 49,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:33:53.897Z"
    },
    {
      "id": "action-49-nest-creature-4-263",
      "round": 49,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.6"
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
            "row": 12,
            "column": 12
          }
        },
        "reason": "與 橫塘 交戰。"
      },
      "result": "succeeded",
      "reason": "與 橫塘 交戰。",
      "createdAt": "2026-09-02T16:33:53.897Z"
    },
    {
      "id": "action-49-nest-creature-3-264",
      "round": 49,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.7"
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
      "createdAt": "2026-09-02T16:33:53.898Z"
    },
    {
      "id": "action-50-player-2-265",
      "round": 50,
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
      "createdAt": "2026-09-02T16:33:53.898Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 197 (round 50)
- Player: 花滿樓 (player-2), level 4, experience 60, at (12, 9), health 10.049999999999999, stamina 10
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-50-player-2-266",
      "round": 50,
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
          "column": 9
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.907Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 198 (round 50)
- Player: 花滿樓 (player-2), level 4, experience 60, at (12, 10), health 10.049999999999999, stamina 5
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-50-player-2-267",
      "round": 50,
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
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-02T16:33:53.914Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 199 (round 50)
- Player: 花滿樓 (player-2), level 4, experience 180, at (12, 10), health 10.049999999999999, stamina 0
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +120
- Spawned creatures: 0
- Defeated creatures: nest-creature-4
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-50-player-2-268",
      "round": 50,
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
          "id": "nest-creature-4",
          "kind": "creature",
          "position": {
            "row": 12,
            "column": 11
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.6"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.6",
      "createdAt": "2026-09-02T16:33:53.921Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 200 (round 51)
- Player: 花滿樓 (player-2), level 4, experience 180, at (12, 10), health 11.399999999999999, stamina 12
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-50-nest-creature-1-269",
      "round": 50,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.921Z"
    },
    {
      "id": "action-50-nest-creature-2-270",
      "round": 50,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:33:53.921Z"
    },
    {
      "id": "action-50-nest-creature-3-271",
      "round": 50,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.7"
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
      "createdAt": "2026-09-02T16:33:53.922Z"
    },
    {
      "id": "action-51-player-2-272",
      "round": 51,
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
      "createdAt": "2026-09-02T16:33:53.922Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 201 (round 51)
- Player: 花滿樓 (player-2), level 4, experience 180, at (12, 10), health 27, stamina 12
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-51-player-2-273",
      "round": 51,
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
        "itemId": "heal-wound-medicine",
        "reason": "使用道具：療傷藥"
      },
      "result": "succeeded",
      "reason": "使用道具：療傷藥",
      "createdAt": "2026-09-02T16:33:53.927Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 202 (round 51)
- Player: 花滿樓 (player-2), level 4, experience 180, at (11, 10), health 27, stamina 10
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-51-player-2-274",
      "round": 51,
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
          "column": 10
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-02T16:33:53.934Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 203 (round 51)
- Player: 花滿樓 (player-2), level 4, experience 180, at (10, 10), health 27, stamina 8
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-51-player-2-275",
      "round": 51,
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
          "column": 10
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-02T16:33:53.940Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 204 (round 51)
- Player: 花滿樓 (player-2), level 4, experience 180, at (9, 10), health 27, stamina 6
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-51-player-2-276",
      "round": 51,
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
          "column": 10
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-02T16:33:53.946Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 205 (round 51)
- Player: 花滿樓 (player-2), level 4, experience 180, at (9, 11), health 27, stamina 2
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-51-player-2-277",
      "round": 51,
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
          "column": 11
        },
        "reason": "練功：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "練功：移動到門派據點",
      "createdAt": "2026-09-02T16:33:53.953Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 206 (round 52)
- Player: 花滿樓 (player-2), level 4, experience 184, at (9, 11), health 3.35, stamina 12
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-51-nest-creature-1-278",
      "round": 51,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:53.956Z"
    },
    {
      "id": "action-51-nest-creature-2-279",
      "round": 51,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:33:53.956Z"
    },
    {
      "id": "action-51-nest-creature-3-280",
      "round": 51,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.7"
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
            "row": 9,
            "column": 11
          }
        },
        "reason": "與 花滿樓 交戰。"
      },
      "result": "succeeded",
      "reason": "與 花滿樓 交戰。",
      "createdAt": "2026-09-02T16:33:53.956Z"
    },
    {
      "id": "action-52-player-2-281",
      "round": 52,
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
      "createdAt": "2026-09-02T16:33:53.957Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-3",
      "creatureName": "生物巢穴 1的怪物 Lv.7",
      "message": "生物巢穴 1的怪物 Lv.7 攻擊 花滿樓，造成 25 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 207 (round 52)
- Player: 花滿樓 (player-2), level 4, experience 184, at (8, 11), health 3.35, stamina 10
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-52-player-2-282",
      "round": 52,
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
          "column": 11
        },
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.7（hitsSurvivable=0.4785714285714286）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.7（hitsSurvivable=0.4785714285714286）",
      "createdAt": "2026-09-02T16:33:53.965Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 208 (round 52)
- Player: 花滿樓 (player-2), level 4, experience 184, at (8, 12), health 3.35, stamina 8
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-52-player-2-283",
      "round": 52,
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
          "column": 12
        },
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.7（hitsSurvivable=0.4785714285714286）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.7（hitsSurvivable=0.4785714285714286）",
      "createdAt": "2026-09-02T16:33:53.975Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 209 (round 52)
- Player: 花滿樓 (player-2), level 4, experience 184, at (8, 13), health 3.35, stamina 6
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-52-player-2-284",
      "round": 52,
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
          "column": 13
        },
        "reason": "收集道具：移動到道具位置"
      },
      "result": "succeeded",
      "reason": "收集道具：移動到道具位置",
      "createdAt": "2026-09-02T16:33:53.984Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 210 (round 52)
- Player: 花滿樓 (player-2), level 4, experience 184, at (8, 13), health 3.35, stamina 6
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-52-player-2-285",
      "round": 52,
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
          "id": "item-point-6",
          "kind": "item",
          "position": {
            "row": 8,
            "column": 13
          }
        },
        "reason": "收集道具：拾取"
      },
      "result": "succeeded",
      "reason": "收集道具：拾取",
      "createdAt": "2026-09-02T16:33:53.993Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 211 (round 52)
- Player: 花滿樓 (player-2), level 4, experience 184, at (9, 13), health 3.35, stamina 4
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-52-player-2-286",
      "round": 52,
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
          "column": 13
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:33:54.004Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 212 (round 52)
- Player: 花滿樓 (player-2), level 4, experience 184, at (10, 13), health 3.35, stamina 0
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-52-player-2-287",
      "round": 52,
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
          "column": 13
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:33:54.012Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 213 (round 53)
- Player: 花滿樓 (player-2), level 4, experience 184, at (10, 13), health 4.7, stamina 12
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-52-nest-creature-1-288",
      "round": 52,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:54.012Z"
    },
    {
      "id": "action-52-nest-creature-2-289",
      "round": 52,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:33:54.012Z"
    },
    {
      "id": "action-52-nest-creature-3-290",
      "round": 52,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.7"
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
            "row": 12,
            "column": 12
          }
        },
        "reason": "與 橫塘 交戰。"
      },
      "result": "succeeded",
      "reason": "與 橫塘 交戰。",
      "createdAt": "2026-09-02T16:33:54.013Z"
    },
    {
      "id": "action-53-player-2-291",
      "round": 53,
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
      "createdAt": "2026-09-02T16:33:54.013Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 214 (round 53)
- Player: 花滿樓 (player-2), level 4, experience 184, at (11, 13), health 4.7, stamina 8
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-53-player-2-292",
      "round": 53,
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
          "column": 13
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:33:54.021Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 215 (round 53)
- Player: 花滿樓 (player-2), level 4, experience 184, at (11, 12), health 4.7, stamina 4
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-53-player-2-293",
      "round": 53,
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
          "column": 12
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:33:54.030Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 216 (round 53)
- Player: 花滿樓 (player-2), level 4, experience 184, at (11, 13), health 4.7, stamina 0
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-53-player-2-294",
      "round": 53,
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
          "column": 13
        },
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.7（hitsSurvivable=0.6714285714285715）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.7（hitsSurvivable=0.6714285714285715）",
      "createdAt": "2026-09-02T16:33:54.039Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 217 (round 54)
- Player: 花滿樓 (player-2), level 4, experience 184, at (11, 13), health 6.050000000000001, stamina 12
- Attributes: armStrength=13, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/233

```json
{
  "actions": [
    {
      "id": "action-53-nest-creature-1-295",
      "round": 53,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T16:33:54.040Z"
    },
    {
      "id": "action-53-nest-creature-2-296",
      "round": 53,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:33:54.040Z"
    },
    {
      "id": "action-53-nest-creature-3-297",
      "round": 53,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.7"
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
            "row": 12,
            "column": 12
          }
        },
        "reason": "與 橫塘 交戰。"
      },
      "result": "succeeded",
      "reason": "與 橫塘 交戰。",
      "createdAt": "2026-09-02T16:33:54.040Z"
    },
    {
      "id": "action-54-player-2-298",
      "round": 54,
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
      "createdAt": "2026-09-02T16:33:54.040Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

