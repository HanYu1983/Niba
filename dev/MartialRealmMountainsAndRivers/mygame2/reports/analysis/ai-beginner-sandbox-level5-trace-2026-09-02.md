# AI Beginner Sandbox Level5 Trace

- AI turns: 138
- Final round: 41
- Game won: false
- Game over: true
- Remaining nests: 1

## Aggregate

- Action counts: move=100, end-turn=40, attack=11, hold=7, allocate-attribute=6, learn-skill=3, collect=3, equip-inner-skill=1, use-item=1, equip-external-skill=1
- Creatures spawned (total): 6
- Creatures defeated (total): 4
- Level-ups observed: 3
- Final player: level 4, experience 68, inner skill 黃土紮根 (yellow-earth-inner) lv.1 damage 11
- Final attributes: armStrength=12, constitution=13, agility=9, innerEnergy=8, insight=8

## Efficiency (KPI)

- 行動產出率 (productive): █··········· 11.0% (19/173)
- 擊殺效率 (kill/generate): ████████···· 0.67 (4/6)
- 擊殺成本 (attack/kill): 2.75 (11 次攻擊 / 4 擊殺)
- 經驗效率 (XP/turn): 0.49 (68 XP / 138 turns)
- 目標切換次數 (goal switches): 133
- 無效行動率 (ineffective): ██████······ 48.0% (83/173)

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
      "createdAt": "2026-09-02T16:25:27.413Z"
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
      "createdAt": "2026-09-02T16:25:27.426Z"
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
      "createdAt": "2026-09-02T16:25:27.430Z"
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
      "createdAt": "2026-09-02T16:25:27.446Z"
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
      "createdAt": "2026-09-02T16:25:27.460Z"
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
      "createdAt": "2026-09-02T16:25:27.466Z"
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
      "createdAt": "2026-09-02T16:25:27.478Z"
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
      "createdAt": "2026-09-02T16:25:27.487Z"
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
      "createdAt": "2026-09-02T16:25:27.493Z"
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
      "createdAt": "2026-09-02T16:25:27.500Z"
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.12:practice-skill, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.12:practice-skill, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:25:27.501Z"
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
      "createdAt": "2026-09-02T16:25:27.515Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 12 (round 5)
- Player: 花滿樓 (player-2), level 1, experience 18, at (6, 1), health 24, stamina 8.5
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
      "id": "action-4-nest-creature-1-13",
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
      "createdAt": "2026-09-02T16:25:27.522Z"
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
        "reason": "模糊策略：positioning 分數 0.67，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.67:hold, practiceSkill=0.19:practice-skill, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.67，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.67:hold, practiceSkill=0.19:practice-skill, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:25:27.523Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-1",
      "creatureName": "生物巢穴 1的怪物 Lv.1",
      "message": "生物巢穴 1的怪物 Lv.1 攻擊 花滿樓，造成 3 點傷害（根骨減傷）。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 13 (round 5)
- Player: 花滿樓 (player-2), level 1, experience 38, at (6, 1), health 24, stamina 3.5
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
            "row": 6,
            "column": 2
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-02T16:25:27.533Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 14 (round 6)
- Player: 花滿樓 (player-2), level 1, experience 45, at (6, 1), health 25.5, stamina 8.5
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
      "id": "action-6-player-2-16",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.19:practice-skill, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.19:practice-skill, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:25:27.538Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 15 (round 6)
- Player: 花滿樓 (player-2), level 1, experience 45, at (5, 1), health 24, stamina 3.5
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
          "row": 5,
          "column": 1
        },
        "reason": "定位：前往出口 (5,1)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (5,1)",
      "createdAt": "2026-09-02T16:25:27.544Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 16 (round 6)
- Player: 花滿樓 (player-2), level 1, experience 45, at (5, 2), health 24, stamina 1.5
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
      "id": "action-6-player-2-18",
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
          "row": 5,
          "column": 2
        },
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-02T16:25:27.553Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 17 (round 7)
- Player: 花滿樓 (player-2), level 1, experience 48, at (5, 2), health 25.5, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
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
      "createdAt": "2026-09-02T16:25:27.558Z"
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
      "spawnedRound": 7,
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

### Turn 18 (round 8)
- Player: 花滿樓 (player-2), level 2, experience 15, at (5, 2), health 27, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: -33 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-7-nest-creature-1-20",
      "round": 7,
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
      "createdAt": "2026-09-02T16:25:27.563Z"
    },
    {
      "id": "action-8-player-2-21",
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
      "createdAt": "2026-09-02T16:25:27.564Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 19 (round 8)
- Player: 花滿樓 (player-2), level 2, experience 15, at (5, 2), health 27, stamina 8.5
- Attributes: armStrength=8, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-8-player-2-22",
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
      "createdAt": "2026-09-02T16:25:27.572Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 20 (round 8)
- Player: 花滿樓 (player-2), level 2, experience 15, at (5, 2), health 27, stamina 8.5
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
      "id": "action-8-player-2-23",
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
      "createdAt": "2026-09-02T16:25:27.579Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 21 (round 8)
- Player: 花滿樓 (player-2), level 2, experience 18, at (5, 2), health 27, stamina 3.5
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
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.2"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.2",
      "createdAt": "2026-09-02T16:25:27.589Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 22 (round 8)
- Player: 花滿樓 (player-2), level 2, experience 18, at (4, 2), health 27, stamina 1.5
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
      "id": "action-8-player-2-25",
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
      "createdAt": "2026-09-02T16:25:27.597Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 23 (round 9)
- Player: 花滿樓 (player-2), level 2, experience 21, at (4, 2), health 20.65, stamina 9
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
      "id": "action-8-nest-creature-1-26",
      "round": 8,
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
            "row": 4,
            "column": 2
          }
        },
        "reason": "與 花滿樓 交戰。"
      },
      "result": "succeeded",
      "reason": "與 花滿樓 交戰。",
      "createdAt": "2026-09-02T16:25:27.602Z"
    },
    {
      "id": "action-9-player-2-27",
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
      "createdAt": "2026-09-02T16:25:27.603Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-1",
      "creatureName": "生物巢穴 1的怪物 Lv.2",
      "message": "生物巢穴 1的怪物 Lv.2 發現並摧毀了道具點。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 24 (round 9)
- Player: 花滿樓 (player-2), level 2, experience 61, at (4, 2), health 20.65, stamina 4
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
      "id": "action-9-player-2-28",
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
            "row": 4,
            "column": 3
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.2"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.2",
      "createdAt": "2026-09-02T16:25:27.610Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 25 (round 9)
- Player: 花滿樓 (player-2), level 2, experience 61, at (3, 2), health 20.65, stamina 0
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
      "createdAt": "2026-09-02T16:25:27.616Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 26 (round 10)
- Player: 花滿樓 (player-2), level 2, experience 61, at (3, 2), health 22.299999999999997, stamina 9
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
      "id": "action-10-player-2-30",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-02T16:25:27.617Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 27 (round 10)
- Player: 花滿樓 (player-2), level 2, experience 61, at (3, 2), health 22.299999999999997, stamina 9
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
      "id": "action-10-player-2-31",
      "round": 10,
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
      "createdAt": "2026-09-02T16:25:27.622Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 28 (round 11)
- Player: 花滿樓 (player-2), level 2, experience 79, at (3, 2), health 23.949999999999996, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +18
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-11-player-2-32",
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
      "createdAt": "2026-09-02T16:25:27.626Z"
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
      "spawnedRound": 11,
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

### Turn 29 (round 12)
- Player: 花滿樓 (player-2), level 2, experience 97, at (3, 2), health 25.599999999999994, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +18
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-11-nest-creature-1-33",
      "round": 11,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
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
      "createdAt": "2026-09-02T16:25:27.630Z"
    },
    {
      "id": "action-12-player-2-34",
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
      "createdAt": "2026-09-02T16:25:27.630Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 30 (round 12)
- Player: 花滿樓 (player-2), level 3, experience 0, at (3, 2), health 25.599999999999994, stamina 4
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: -97 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-12-player-2-35",
      "round": 12,
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
            "row": 3,
            "column": 3
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.3"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.3",
      "createdAt": "2026-09-02T16:25:27.637Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 31 (round 12)
- Player: 花滿樓 (player-2), level 3, experience 0, at (3, 2), health 25.599999999999994, stamina 4
- Attributes: armStrength=10, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-12-player-2-36",
      "round": 12,
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
      "createdAt": "2026-09-02T16:25:27.645Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 32 (round 12)
- Player: 花滿樓 (player-2), level 3, experience 0, at (3, 2), health 25.599999999999994, stamina 4
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
      "id": "action-12-player-2-37",
      "round": 12,
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
      "createdAt": "2026-09-02T16:25:27.653Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 33 (round 12)
- Player: 花滿樓 (player-2), level 3, experience 0, at (2, 2), health 25.599999999999994, stamina 0
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
      "id": "action-12-player-2-38",
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
          "column": 2
        },
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-02T16:25:27.662Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 34 (round 13)
- Player: 花滿樓 (player-2), level 3, experience 0, at (2, 2), health 21.249999999999993, stamina 10
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
      "id": "action-12-nest-creature-1-39",
      "round": 12,
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
            "row": 2,
            "column": 2
          }
        },
        "reason": "與 花滿樓 交戰。"
      },
      "result": "succeeded",
      "reason": "與 花滿樓 交戰。",
      "createdAt": "2026-09-02T16:25:27.662Z"
    },
    {
      "id": "action-13-player-2-40",
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
      "createdAt": "2026-09-02T16:25:27.662Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-1",
      "creatureName": "生物巢穴 1的怪物 Lv.3",
      "message": "生物巢穴 1的怪物 Lv.3 攻擊 花滿樓，造成 6 點傷害（根骨減傷）。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 35 (round 13)
- Player: 花滿樓 (player-2), level 3, experience 60, at (2, 2), health 21.249999999999993, stamina 5
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +60
- Spawned creatures: 0
- Defeated creatures: nest-creature-1
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-13-player-2-41",
      "round": 13,
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
            "row": 2,
            "column": 3
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.3"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.3",
      "createdAt": "2026-09-02T16:25:27.670Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 36 (round 13)
- Player: 花滿樓 (player-2), level 3, experience 60, at (2, 3), health 21.249999999999993, stamina 3
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
      "id": "action-13-player-2-42",
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
          "column": 3
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:27.679Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 37 (round 13)
- Player: 花滿樓 (player-2), level 3, experience 60, at (3, 3), health 21.249999999999993, stamina 1
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
      "id": "action-13-player-2-43",
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
          "row": 3,
          "column": 3
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:25:27.685Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 38 (round 14)
- Player: 花滿樓 (player-2), level 3, experience 62, at (3, 3), health 22.89999999999999, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-14-player-2-44",
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
      "createdAt": "2026-09-02T16:25:27.688Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 39 (round 14)
- Player: 花滿樓 (player-2), level 3, experience 62, at (4, 3), health 22.89999999999999, stamina 8
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
      "id": "action-14-player-2-45",
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:27.695Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 40 (round 14)
- Player: 花滿樓 (player-2), level 3, experience 62, at (4, 4), health 22.89999999999999, stamina 3
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
      "id": "action-14-player-2-46",
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
          "column": 4
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:27.701Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 41 (round 14)
- Player: 花滿樓 (player-2), level 3, experience 62, at (4, 5), health 22.89999999999999, stamina 1
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
      "id": "action-14-player-2-47",
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
          "column": 5
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:25:27.707Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 42 (round 15)
- Player: 花滿樓 (player-2), level 3, experience 64, at (4, 5), health 24.54999999999999, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-15-player-2-48",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:25:27.710Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 43 (round 15)
- Player: 花滿樓 (player-2), level 3, experience 64, at (4, 6), health 24.54999999999999, stamina 5
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
      "id": "action-15-player-2-49",
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
          "column": 6
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:27.719Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 44 (round 15)
- Player: 花滿樓 (player-2), level 3, experience 64, at (3, 6), health 24.54999999999999, stamina 0
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
      "id": "action-15-player-2-50",
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
          "row": 3,
          "column": 6
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:27.726Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 45 (round 16)
- Player: 花滿樓 (player-2), level 3, experience 64, at (3, 6), health 26.19999999999999, stamina 10
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
      "id": "action-16-player-2-51",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-02T16:25:27.727Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 46 (round 16)
- Player: 花滿樓 (player-2), level 3, experience 64, at (2, 6), health 26.19999999999999, stamina 7
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
      "id": "action-16-player-2-52",
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
          "row": 2,
          "column": 6
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:27.733Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 47 (round 16)
- Player: 花滿樓 (player-2), level 3, experience 64, at (2, 5), health 26.19999999999999, stamina 2
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
      "id": "action-16-player-2-53",
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
          "row": 2,
          "column": 5
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:27.742Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 48 (round 16)
- Player: 花滿樓 (player-2), level 3, experience 64, at (2, 5), health 26.19999999999999, stamina 2
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
      "id": "action-16-player-2-54",
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
          "id": "item-point-14",
          "kind": "item",
          "position": {
            "row": 2,
            "column": 5
          }
        },
        "reason": "收集道具：拾取"
      },
      "result": "succeeded",
      "reason": "收集道具：拾取",
      "createdAt": "2026-09-02T16:25:27.745Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 49 (round 16)
- Player: 花滿樓 (player-2), level 3, experience 64, at (2, 5), health 26.19999999999999, stamina 2
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-16-player-2-55",
      "round": 16,
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
        "itemId": "extend-life-pill",
        "reason": "使用道具：續命丹"
      },
      "result": "succeeded",
      "reason": "使用道具：續命丹",
      "createdAt": "2026-09-02T16:25:27.748Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 50 (round 17)
- Player: 花滿樓 (player-2), level 3, experience 68, at (2, 5), health 27.99999999999999, stamina 10
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-17-player-2-56",
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
      "createdAt": "2026-09-02T16:25:27.751Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 51 (round 17)
- Player: 花滿樓 (player-2), level 3, experience 68, at (2, 4), health 27.99999999999999, stamina 5
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-17-player-2-57",
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
          "row": 2,
          "column": 4
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:27.758Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 52 (round 17)
- Player: 花滿樓 (player-2), level 3, experience 68, at (2, 3), health 27.99999999999999, stamina 3
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-17-player-2-58",
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
          "row": 2,
          "column": 3
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:27.765Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 53 (round 17)
- Player: 花滿樓 (player-2), level 3, experience 68, at (3, 3), health 27.99999999999999, stamina 1
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-17-player-2-59",
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
          "row": 3,
          "column": 3
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:25:27.771Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 54 (round 18)
- Player: 花滿樓 (player-2), level 3, experience 70, at (3, 3), health 29.79999999999999, stamina 10
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-18-player-2-60",
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
      "createdAt": "2026-09-02T16:25:27.774Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 55 (round 18)
- Player: 花滿樓 (player-2), level 3, experience 70, at (4, 3), health 29.79999999999999, stamina 8
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-18-player-2-61",
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
          "row": 4,
          "column": 3
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:27.780Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 56 (round 18)
- Player: 花滿樓 (player-2), level 3, experience 70, at (4, 4), health 29.79999999999999, stamina 3
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-18-player-2-62",
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
          "row": 4,
          "column": 4
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:27.788Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 57 (round 18)
- Player: 花滿樓 (player-2), level 3, experience 70, at (4, 5), health 29.79999999999999, stamina 1
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-18-player-2-63",
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
          "row": 4,
          "column": 5
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:25:27.793Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 58 (round 19)
- Player: 花滿樓 (player-2), level 3, experience 72, at (4, 5), health 31.59999999999999, stamina 10
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-19-player-2-64",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:25:27.796Z"
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
      "spawnedRound": 19,
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

### Turn 59 (round 19)
- Player: 花滿樓 (player-2), level 3, experience 72, at (4, 6), health 31.59999999999999, stamina 5
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-19-player-2-65",
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
          "row": 4,
          "column": 6
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:27.805Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 60 (round 19)
- Player: 花滿樓 (player-2), level 3, experience 72, at (3, 6), health 31.59999999999999, stamina 0
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-19-player-2-66",
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
          "row": 3,
          "column": 6
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:27.812Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 61 (round 20)
- Player: 花滿樓 (player-2), level 3, experience 72, at (3, 6), health 33.39999999999999, stamina 10
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-19-nest-creature-1-67",
      "round": 19,
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
      "createdAt": "2026-09-02T16:25:27.813Z"
    },
    {
      "id": "action-20-player-2-68",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-02T16:25:27.813Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 62 (round 20)
- Player: 花滿樓 (player-2), level 3, experience 72, at (2, 6), health 33.39999999999999, stamina 7
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-20-player-2-69",
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
          "row": 2,
          "column": 6
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:27.821Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 63 (round 20)
- Player: 花滿樓 (player-2), level 3, experience 72, at (2, 5), health 33.39999999999999, stamina 2
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-20-player-2-70",
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
          "row": 2,
          "column": 5
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:27.830Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 64 (round 21)
- Player: 花滿樓 (player-2), level 3, experience 76, at (2, 5), health 35.19999999999999, stamina 10
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-20-nest-creature-1-71",
      "round": 20,
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
          "row": 6,
          "column": 6
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-02T16:25:27.833Z"
    },
    {
      "id": "action-21-player-2-72",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:25:27.833Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 65 (round 21)
- Player: 花滿樓 (player-2), level 3, experience 76, at (2, 4), health 35.19999999999999, stamina 5
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-21-player-2-73",
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
          "row": 2,
          "column": 4
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:27.841Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 66 (round 21)
- Player: 花滿樓 (player-2), level 3, experience 76, at (2, 3), health 35.19999999999999, stamina 3
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

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
      "createdAt": "2026-09-02T16:25:27.847Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 67 (round 21)
- Player: 花滿樓 (player-2), level 3, experience 76, at (3, 3), health 35.19999999999999, stamina 1
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

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
      "createdAt": "2026-09-02T16:25:27.854Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 68 (round 22)
- Player: 花滿樓 (player-2), level 3, experience 78, at (3, 3), health 36, stamina 10
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-21-nest-creature-1-76",
      "round": 21,
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
          "row": 6,
          "column": 6
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-02T16:25:27.857Z"
    },
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:25:27.857Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 69 (round 22)
- Player: 花滿樓 (player-2), level 3, experience 78, at (4, 3), health 36, stamina 8
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

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
      "createdAt": "2026-09-02T16:25:27.863Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 70 (round 22)
- Player: 花滿樓 (player-2), level 3, experience 78, at (4, 4), health 36, stamina 3
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

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
      "createdAt": "2026-09-02T16:25:27.871Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 71 (round 22)
- Player: 花滿樓 (player-2), level 3, experience 78, at (4, 5), health 36, stamina 1
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

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
          "row": 4,
          "column": 5
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:25:27.876Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 72 (round 23)
- Player: 花滿樓 (player-2), level 3, experience 80, at (4, 5), health 36, stamina 10
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-22-nest-creature-1-81",
      "round": 22,
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
          "row": 6,
          "column": 6
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-02T16:25:27.879Z"
    },
    {
      "id": "action-23-player-2-82",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:25:27.879Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 73 (round 23)
- Player: 花滿樓 (player-2), level 3, experience 80, at (4, 6), health 36, stamina 5
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

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
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 4,
          "column": 6
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:27.891Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 74 (round 23)
- Player: 花滿樓 (player-2), level 3, experience 80, at (3, 6), health 36, stamina 0
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

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
      "createdAt": "2026-09-02T16:25:27.902Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 75 (round 24)
- Player: 花滿樓 (player-2), level 3, experience 80, at (3, 6), health 36, stamina 10
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-23-nest-creature-1-85",
      "round": 23,
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
          "row": 7,
          "column": 6
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-02T16:25:27.902Z"
    },
    {
      "id": "action-24-player-2-86",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-02T16:25:27.902Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 76 (round 24)
- Player: 花滿樓 (player-2), level 3, experience 80, at (2, 6), health 36, stamina 7
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

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
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 6
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:27.909Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 77 (round 24)
- Player: 花滿樓 (player-2), level 3, experience 80, at (2, 5), health 36, stamina 2
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

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
          "row": 2,
          "column": 5
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:27.918Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 78 (round 25)
- Player: 花滿樓 (player-2), level 3, experience 84, at (2, 5), health 36, stamina 10
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-24-nest-creature-1-89",
      "round": 24,
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
          "row": 6,
          "column": 5
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-02T16:25:27.920Z"
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:25:27.921Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 79 (round 25)
- Player: 花滿樓 (player-2), level 3, experience 84, at (2, 4), health 36, stamina 5
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

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
          "row": 2,
          "column": 4
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:27.929Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 80 (round 25)
- Player: 花滿樓 (player-2), level 3, experience 84, at (2, 3), health 36, stamina 3
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

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
          "row": 2,
          "column": 3
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:27.936Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 81 (round 25)
- Player: 花滿樓 (player-2), level 3, experience 84, at (3, 3), health 36, stamina 1
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

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
          "row": 3,
          "column": 3
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:25:27.942Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 82 (round 26)
- Player: 花滿樓 (player-2), level 3, experience 86, at (3, 3), health 36, stamina 10
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-25-nest-creature-1-94",
      "round": 25,
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
          "row": 7,
          "column": 5
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-02T16:25:27.945Z"
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:25:27.945Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 83 (round 26)
- Player: 花滿樓 (player-2), level 3, experience 86, at (4, 3), health 36, stamina 8
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

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
          "row": 4,
          "column": 3
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:27.951Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 84 (round 26)
- Player: 花滿樓 (player-2), level 3, experience 86, at (4, 4), health 36, stamina 3
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

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
          "row": 4,
          "column": 4
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:27.958Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 85 (round 26)
- Player: 花滿樓 (player-2), level 3, experience 86, at (4, 5), health 36, stamina 1
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

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
          "row": 4,
          "column": 5
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:25:27.963Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 86 (round 27)
- Player: 花滿樓 (player-2), level 3, experience 88, at (4, 5), health 36, stamina 10
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-26-nest-creature-1-99",
      "round": 26,
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
          "row": 6,
          "column": 6
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-02T16:25:27.966Z"
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:25:27.967Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 87 (round 27)
- Player: 花滿樓 (player-2), level 3, experience 88, at (4, 6), health 36, stamina 5
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

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
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 4,
          "column": 6
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:27.979Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 88 (round 27)
- Player: 花滿樓 (player-2), level 3, experience 88, at (3, 6), health 36, stamina 0
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

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
      "createdAt": "2026-09-02T16:25:27.990Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 89 (round 28)
- Player: 花滿樓 (player-2), level 3, experience 88, at (3, 6), health 36, stamina 10
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-27-nest-creature-1-103",
      "round": 27,
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
          "row": 7,
          "column": 6
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-02T16:25:27.991Z"
    },
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-02T16:25:27.991Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 90 (round 28)
- Player: 花滿樓 (player-2), level 3, experience 88, at (2, 6), health 36, stamina 7
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
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
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 6
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:27.997Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 91 (round 28)
- Player: 花滿樓 (player-2), level 3, experience 88, at (2, 5), health 36, stamina 2
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
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
          "row": 2,
          "column": 5
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:28.007Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 92 (round 29)
- Player: 花滿樓 (player-2), level 3, experience 92, at (2, 5), health 36, stamina 10
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +4
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
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 5
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-02T16:25:28.010Z"
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
      "createdAt": "2026-09-02T16:25:28.010Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 93 (round 29)
- Player: 花滿樓 (player-2), level 3, experience 92, at (2, 4), health 36, stamina 5
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
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
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 2,
          "column": 4
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:28.017Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 94 (round 29)
- Player: 花滿樓 (player-2), level 3, experience 92, at (2, 3), health 36, stamina 3
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
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
      "createdAt": "2026-09-02T16:25:28.025Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 95 (round 29)
- Player: 花滿樓 (player-2), level 3, experience 92, at (3, 3), health 36, stamina 1
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

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
      "createdAt": "2026-09-02T16:25:28.031Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 96 (round 30)
- Player: 花滿樓 (player-2), level 3, experience 94, at (3, 3), health 36, stamina 10
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-29-nest-creature-1-112",
      "round": 29,
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
          "row": 7,
          "column": 5
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-02T16:25:28.034Z"
    },
    {
      "id": "action-30-player-2-113",
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
      "createdAt": "2026-09-02T16:25:28.035Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 97 (round 30)
- Player: 花滿樓 (player-2), level 3, experience 94, at (4, 3), health 36, stamina 8
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
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
      "createdAt": "2026-09-02T16:25:28.041Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 98 (round 30)
- Player: 花滿樓 (player-2), level 3, experience 94, at (4, 4), health 36, stamina 3
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-30-player-2-115",
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
          "row": 4,
          "column": 4
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:28.048Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 99 (round 30)
- Player: 花滿樓 (player-2), level 3, experience 94, at (4, 5), health 36, stamina 1
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-30-player-2-116",
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
          "row": 4,
          "column": 5
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:25:28.054Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 100 (round 31)
- Player: 花滿樓 (player-2), level 3, experience 96, at (4, 5), health 36, stamina 10
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-30-nest-creature-1-117",
      "round": 30,
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
          "row": 6,
          "column": 6
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-02T16:25:28.058Z"
    },
    {
      "id": "action-31-player-2-118",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:25:28.058Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 101 (round 31)
- Player: 花滿樓 (player-2), level 3, experience 96, at (4, 6), health 36, stamina 5
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-31-player-2-119",
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
          "row": 4,
          "column": 6
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:28.070Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 102 (round 31)
- Player: 花滿樓 (player-2), level 3, experience 96, at (3, 6), health 36, stamina 0
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-31-player-2-120",
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
          "row": 3,
          "column": 6
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:28.080Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 103 (round 32)
- Player: 花滿樓 (player-2), level 3, experience 96, at (3, 6), health 36, stamina 10
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-31-nest-creature-1-121",
      "round": 31,
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
          "row": 7,
          "column": 6
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-02T16:25:28.080Z"
    },
    {
      "id": "action-32-player-2-122",
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
      "createdAt": "2026-09-02T16:25:28.080Z"
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
      "spawnedRound": 32,
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

### Turn 104 (round 32)
- Player: 花滿樓 (player-2), level 3, experience 96, at (2, 6), health 36, stamina 7
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-32-player-2-123",
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
          "row": 2,
          "column": 6
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:28.088Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 105 (round 32)
- Player: 花滿樓 (player-2), level 3, experience 96, at (2, 5), health 36, stamina 2
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-32-player-2-124",
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
          "row": 2,
          "column": 5
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:28.097Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 106 (round 33)
- Player: 花滿樓 (player-2), level 3, experience 100, at (2, 5), health 36, stamina 10
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-32-nest-creature-1-125",
      "round": 32,
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
          "row": 6,
          "column": 5
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-02T16:25:28.100Z"
    },
    {
      "id": "action-32-nest-creature-2-126",
      "round": 32,
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
      "createdAt": "2026-09-02T16:25:28.101Z"
    },
    {
      "id": "action-33-player-2-127",
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
      "createdAt": "2026-09-02T16:25:28.101Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 107 (round 33)
- Player: 花滿樓 (player-2), level 3, experience 100, at (2, 4), health 36, stamina 5
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-33-player-2-128",
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
          "row": 2,
          "column": 4
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:28.110Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 108 (round 33)
- Player: 花滿樓 (player-2), level 3, experience 100, at (2, 3), health 36, stamina 3
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-33-player-2-129",
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
          "row": 2,
          "column": 3
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:28.119Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 109 (round 33)
- Player: 花滿樓 (player-2), level 3, experience 100, at (3, 3), health 36, stamina 1
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-33-player-2-130",
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
          "row": 3,
          "column": 3
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:25:28.125Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 110 (round 34)
- Player: 花滿樓 (player-2), level 3, experience 102, at (3, 3), health 36, stamina 10
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-33-nest-creature-1-131",
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
          "row": 7,
          "column": 5
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-02T16:25:28.128Z"
    },
    {
      "id": "action-33-nest-creature-2-132",
      "round": 33,
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
      "createdAt": "2026-09-02T16:25:28.128Z"
    },
    {
      "id": "action-34-player-2-133",
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
      "createdAt": "2026-09-02T16:25:28.129Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 111 (round 34)
- Player: 花滿樓 (player-2), level 3, experience 102, at (4, 3), health 36, stamina 8
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-34-player-2-134",
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
          "row": 4,
          "column": 3
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:28.140Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 112 (round 34)
- Player: 花滿樓 (player-2), level 3, experience 102, at (4, 4), health 36, stamina 3
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-34-player-2-135",
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
          "row": 4,
          "column": 4
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:28.155Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 113 (round 34)
- Player: 花滿樓 (player-2), level 3, experience 102, at (4, 5), health 36, stamina 1
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-34-player-2-136",
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
          "row": 4,
          "column": 5
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:25:28.160Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 114 (round 35)
- Player: 花滿樓 (player-2), level 3, experience 104, at (4, 5), health 36, stamina 10
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-34-nest-creature-1-137",
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
          "row": 6,
          "column": 6
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-02T16:25:28.167Z"
    },
    {
      "id": "action-34-nest-creature-2-138",
      "round": 34,
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
          "row": 6,
          "column": 5
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-02T16:25:28.167Z"
    },
    {
      "id": "action-35-player-2-139",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:25:28.168Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 115 (round 35)
- Player: 花滿樓 (player-2), level 3, experience 104, at (4, 6), health 36, stamina 5
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-35-player-2-140",
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
          "row": 4,
          "column": 6
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:28.197Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 116 (round 35)
- Player: 花滿樓 (player-2), level 3, experience 104, at (3, 6), health 36, stamina 0
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-35-player-2-141",
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
          "row": 3,
          "column": 6
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:28.208Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 117 (round 36)
- Player: 花滿樓 (player-2), level 3, experience 104, at (3, 6), health 36, stamina 10
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-35-nest-creature-1-142",
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
          "row": 7,
          "column": 6
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-02T16:25:28.208Z"
    },
    {
      "id": "action-35-nest-creature-2-143",
      "round": 35,
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
          "row": 6,
          "column": 6
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-02T16:25:28.209Z"
    },
    {
      "id": "action-36-player-2-144",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-02T16:25:28.209Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 118 (round 36)
- Player: 花滿樓 (player-2), level 3, experience 104, at (2, 6), health 36, stamina 7
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-36-player-2-145",
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
          "row": 2,
          "column": 6
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:28.218Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 119 (round 36)
- Player: 花滿樓 (player-2), level 3, experience 104, at (2, 5), health 36, stamina 2
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-36-player-2-146",
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
          "row": 2,
          "column": 5
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:28.228Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 120 (round 37)
- Player: 花滿樓 (player-2), level 3, experience 108, at (2, 5), health 36, stamina 10
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-36-nest-creature-1-147",
      "round": 36,
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
          "row": 7,
          "column": 5
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-02T16:25:28.230Z"
    },
    {
      "id": "action-36-nest-creature-2-148",
      "round": 36,
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
          "row": 6,
          "column": 5
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-02T16:25:28.231Z"
    },
    {
      "id": "action-37-player-2-149",
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
      "createdAt": "2026-09-02T16:25:28.231Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 121 (round 37)
- Player: 花滿樓 (player-2), level 3, experience 108, at (2, 4), health 36, stamina 5
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-37-player-2-150",
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
          "row": 2,
          "column": 4
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:28.240Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 122 (round 37)
- Player: 花滿樓 (player-2), level 3, experience 108, at (2, 3), health 36, stamina 3
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-37-player-2-151",
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
          "row": 2,
          "column": 3
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:28.246Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 123 (round 37)
- Player: 花滿樓 (player-2), level 3, experience 108, at (3, 3), health 36, stamina 1
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-37-player-2-152",
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
          "row": 3,
          "column": 3
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-02T16:25:28.253Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 124 (round 38)
- Player: 花滿樓 (player-2), level 3, experience 110, at (3, 3), health 36, stamina 10
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-37-nest-creature-1-153",
      "round": 37,
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
      "createdAt": "2026-09-02T16:25:28.256Z"
    },
    {
      "id": "action-37-nest-creature-2-154",
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
          "row": 7,
          "column": 5
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-02T16:25:28.256Z"
    },
    {
      "id": "action-38-player-2-155",
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
      "createdAt": "2026-09-02T16:25:28.256Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 125 (round 38)
- Player: 花滿樓 (player-2), level 4, experience 40, at (3, 3), health 36, stamina 5
- Attributes: armStrength=11, constitution=12, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 10
- Stored experience change: -70 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: nest-creature-1
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-38-player-2-156",
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
          "id": "nest-creature-1",
          "kind": "creature",
          "position": {
            "row": 4,
            "column": 3
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.4"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.4",
      "createdAt": "2026-09-02T16:25:28.264Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 126 (round 38)
- Player: 花滿樓 (player-2), level 4, experience 40, at (3, 3), health 36, stamina 5
- Attributes: armStrength=11, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 11
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-38-player-2-157",
      "round": 38,
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
      "createdAt": "2026-09-02T16:25:28.271Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 127 (round 38)
- Player: 花滿樓 (player-2), level 4, experience 40, at (3, 3), health 36, stamina 5
- Attributes: armStrength=12, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 11
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-38-player-2-158",
      "round": 38,
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
      "createdAt": "2026-09-02T16:25:28.277Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 128 (round 38)
- Player: 花滿樓 (player-2), level 4, experience 40, at (4, 3), health 36, stamina 3
- Attributes: armStrength=12, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 11
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-38-player-2-159",
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
          "row": 4,
          "column": 3
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:28.282Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 129 (round 39)
- Player: 花滿樓 (player-2), level 4, experience 46, at (4, 3), health 37.95, stamina 10.5
- Attributes: armStrength=12, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 11
- Stored experience change: +6
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-38-nest-creature-2-160",
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
          "row": 6,
          "column": 5
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-02T16:25:28.287Z"
    },
    {
      "id": "action-39-player-2-161",
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
      "createdAt": "2026-09-02T16:25:28.287Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 130 (round 39)
- Player: 花滿樓 (player-2), level 4, experience 46, at (4, 4), health 37.95, stamina 5.5
- Attributes: armStrength=12, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 11
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-39-player-2-162",
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
          "row": 4,
          "column": 4
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:28.295Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 131 (round 39)
- Player: 花滿樓 (player-2), level 4, experience 46, at (5, 4), health 37.95, stamina 3.5
- Attributes: armStrength=12, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 11
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-39-player-2-163",
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
          "row": 5,
          "column": 4
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T16:25:28.305Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 132 (round 39)
- Player: 花滿樓 (player-2), level 4, experience 46, at (5, 4), health 37.95, stamina 0.5
- Attributes: armStrength=12, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 11
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-39-player-2-164",
      "round": 39,
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
      "createdAt": "2026-09-02T16:25:28.309Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 133 (round 40)
- Player: 花滿樓 (player-2), level 4, experience 47, at (5, 4), health 39, stamina 10.5
- Attributes: armStrength=12, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 11
- Stored experience change: +1
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-39-nest-creature-2-165",
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
          "row": 7,
          "column": 5
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-02T16:25:28.313Z"
    },
    {
      "id": "action-40-player-2-166",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-02T16:25:28.314Z"
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
      "id": "nest-creature-1",
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
      "spawnedRound": 40,
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

### Turn 134 (round 40)
- Player: 花滿樓 (player-2), level 4, experience 47, at (5, 4), health 39, stamina 7.5
- Attributes: armStrength=12, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 11
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-40-player-2-167",
      "round": 40,
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
      "createdAt": "2026-09-02T16:25:28.323Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 135 (round 40)
- Player: 花滿樓 (player-2), level 4, experience 47, at (5, 4), health 39, stamina 7.5
- Attributes: armStrength=12, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 11
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-40-player-2-168",
      "round": 40,
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
        "skillId": "ghost-shadow-external-damage",
        "reason": "啟用外功：影襲"
      },
      "result": "succeeded",
      "reason": "啟用外功：影襲",
      "createdAt": "2026-09-02T16:25:28.331Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 136 (round 40)
- Player: 花滿樓 (player-2), level 4, experience 67, at (5, 4), health 39, stamina 2.5
- Attributes: armStrength=12, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 11
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-40-player-2-169",
      "round": 40,
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
      "createdAt": "2026-09-02T16:25:28.341Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 137 (round 40)
- Player: 花滿樓 (player-2), level 4, experience 67, at (5, 5), health 39, stamina 0.5
- Attributes: armStrength=12, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 11
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-40-player-2-170",
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
          "row": 5,
          "column": 5
        },
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.5（hitsSurvivable=6.5）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.5（hitsSurvivable=6.5）",
      "createdAt": "2026-09-02T16:25:28.347Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 138 (round 41)
- Player: 花滿樓 (player-2), level 4, experience 68, at (5, 5), health 0, stamina 0
- Attributes: armStrength=12, constitution=13, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 11
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/212

```json
{
  "actions": [
    {
      "id": "action-40-nest-creature-2-171",
      "round": 40,
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
            "row": 5,
            "column": 5
          }
        },
        "reason": "與 花滿樓 交戰。"
      },
      "result": "succeeded",
      "reason": "與 花滿樓 交戰。",
      "createdAt": "2026-09-02T16:25:28.350Z"
    },
    {
      "id": "action-40-nest-creature-1-172",
      "round": 40,
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
          "row": 5,
          "column": 4
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-02T16:25:28.351Z"
    },
    {
      "id": "action-41-player-2-173",
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
      "createdAt": "2026-09-02T16:25:28.351Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-2",
      "creatureName": "生物巢穴 1的怪物 Lv.5",
      "message": "生物巢穴 1的怪物 Lv.5 攻擊 花滿樓，造成 27 點傷害（暴擊）。"
    },
    {
      "creatureId": "nest-creature-2",
      "creatureName": "生物巢穴 1的怪物 Lv.5",
      "message": "生物巢穴 1的怪物 Lv.5 連續攻擊 花滿樓 2 次。"
    }
  ],
  "spawnedCreatures": []
}
```

