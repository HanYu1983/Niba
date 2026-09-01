# AI Beginner Sandbox Level5 Trace

- AI turns: 221
- Final round: 57
- Game won: false
- Game over: true
- Remaining nests: 1

## Aggregate

- Action counts: move=93, end-turn=56, practice-skill=46, attack=19, use-facility=15, collect=8, hold=7, allocate-attribute=4, learn-skill=3, use-item=2, equip-inner-skill=1
- Creatures spawned (total): 4
- Creatures defeated (total): 2
- Level-ups observed: 2
- Final player: level 3, experience 147, inner skill 黃土紮根 (yellow-earth-inner) lv.4 damage 25
- Final attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8

## Efficiency (KPI)

- 行動產出率 (productive): ████········ 37.0% (94/254)
- 擊殺效率 (kill/generate): ██████······ 0.50 (2/4)
- 擊殺成本 (attack/kill): 9.50 (19 次攻擊 / 2 擊殺)
- 經驗效率 (XP/turn): 0.67 (147 XP / 221 turns)

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
      "createdAt": "2026-09-01T20:19:40.869Z"
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
      "createdAt": "2026-09-01T20:19:40.881Z"
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
      "createdAt": "2026-09-01T20:19:40.885Z"
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
      "createdAt": "2026-09-01T20:19:40.899Z"
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
      "createdAt": "2026-09-01T20:19:40.911Z"
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
      "createdAt": "2026-09-01T20:19:40.917Z"
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
      "createdAt": "2026-09-01T20:19:40.927Z"
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
      "createdAt": "2026-09-01T20:19:40.934Z"
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
      "createdAt": "2026-09-01T20:19:40.939Z"
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.14:practice-skill, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.14:practice-skill, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:19:40.944Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 11 (round 4)
- Player: 花滿樓 (player-2), level 1, experience 8, at (6, 1), health 25.5, stamina 5.5
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
      "createdAt": "2026-09-01T20:19:40.951Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 12 (round 4)
- Player: 花滿樓 (player-2), level 1, experience 8, at (6, 1), health 25.5, stamina 2.5
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
      "createdAt": "2026-09-01T20:19:40.957Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 13 (round 5)
- Player: 花滿樓 (player-2), level 1, experience 13, at (6, 1), health 27, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: +5
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:19:40.962Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 14 (round 5)
- Player: 花滿樓 (player-2), level 1, experience 13, at (6, 1), health 27, stamina 5.5
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
      "id": "action-5-player-2-14",
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
      "createdAt": "2026-09-01T20:19:40.969Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 15 (round 5)
- Player: 花滿樓 (player-2), level 1, experience 13, at (6, 1), health 27, stamina 2.5
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
      "id": "action-5-player-2-15",
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
      "createdAt": "2026-09-01T20:19:40.975Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 16 (round 6)
- Player: 花滿樓 (player-2), level 1, experience 18, at (6, 1), health 28.5, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: +5
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:19:40.979Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 17 (round 6)
- Player: 花滿樓 (player-2), level 1, experience 18, at (6, 1), health 28.5, stamina 5.5
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
      "id": "action-6-player-2-17",
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
      "createdAt": "2026-09-01T20:19:40.984Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 18 (round 6)
- Player: 花滿樓 (player-2), level 1, experience 18, at (6, 1), health 28.5, stamina 2.5
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
      "id": "action-6-player-2-18",
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
      "createdAt": "2026-09-01T20:19:40.989Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 19 (round 7)
- Player: 花滿樓 (player-2), level 1, experience 23, at (6, 1), health 30, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: +5
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:19:40.992Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 20 (round 7)
- Player: 花滿樓 (player-2), level 1, experience 23, at (6, 1), health 30, stamina 5.5
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
      "id": "action-7-player-2-20",
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
      "createdAt": "2026-09-01T20:19:40.997Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 21 (round 7)
- Player: 花滿樓 (player-2), level 1, experience 23, at (6, 1), health 30, stamina 2.5
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
      "id": "action-7-player-2-21",
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
      "createdAt": "2026-09-01T20:19:41.002Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 22 (round 8)
- Player: 花滿樓 (player-2), level 1, experience 28, at (6, 1), health 30, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 1, damage 9
- Stored experience change: +5
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

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
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:19:41.005Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 23 (round 8)
- Player: 花滿樓 (player-2), level 1, experience 28, at (6, 1), health 30, stamina 5.5
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
      "id": "action-8-player-2-23",
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
      "createdAt": "2026-09-01T20:19:41.011Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 24 (round 8)
- Player: 花滿樓 (player-2), level 1, experience 28, at (6, 1), health 30, stamina 2.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

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
      "createdAt": "2026-09-01T20:19:41.015Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 25 (round 9)
- Player: 花滿樓 (player-2), level 1, experience 33, at (6, 1), health 30, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 13
- Stored experience change: +5
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-9-player-2-25",
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
      "createdAt": "2026-09-01T20:19:41.019Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 26 (round 9)
- Player: 花滿樓 (player-2), level 1, experience 33, at (6, 1), health 30, stamina 5.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

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
      "createdAt": "2026-09-01T20:19:41.024Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 27 (round 9)
- Player: 花滿樓 (player-2), level 1, experience 33, at (6, 1), health 30, stamina 2.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-9-player-2-27",
      "round": 9,
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
      "createdAt": "2026-09-01T20:19:41.029Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 28 (round 10)
- Player: 花滿樓 (player-2), level 1, experience 38, at (6, 1), health 30, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 13
- Stored experience change: +5
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-10-player-2-28",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:19:41.033Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 29 (round 10)
- Player: 花滿樓 (player-2), level 1, experience 38, at (6, 1), health 30, stamina 5.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-10-player-2-29",
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
      "createdAt": "2026-09-01T20:19:41.037Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 30 (round 10)
- Player: 花滿樓 (player-2), level 1, experience 38, at (6, 1), health 30, stamina 2.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

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
      "createdAt": "2026-09-01T20:19:41.043Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 31 (round 11)
- Player: 花滿樓 (player-2), level 1, experience 43, at (6, 1), health 30, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 13
- Stored experience change: +5
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-11-player-2-31",
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
      "createdAt": "2026-09-01T20:19:41.046Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 32 (round 11)
- Player: 花滿樓 (player-2), level 1, experience 43, at (6, 1), health 30, stamina 5.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

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
      "createdAt": "2026-09-01T20:19:41.051Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 33 (round 11)
- Player: 花滿樓 (player-2), level 1, experience 43, at (6, 1), health 30, stamina 2.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-11-player-2-33",
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
      "createdAt": "2026-09-01T20:19:41.055Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 34 (round 12)
- Player: 花滿樓 (player-2), level 1, experience 48, at (6, 1), health 30, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 13
- Stored experience change: +5
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:19:41.059Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 35 (round 12)
- Player: 花滿樓 (player-2), level 1, experience 48, at (6, 1), health 30, stamina 5.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

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
      "createdAt": "2026-09-01T20:19:41.066Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 36 (round 12)
- Player: 花滿樓 (player-2), level 1, experience 48, at (6, 1), health 30, stamina 2.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 13
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

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
      "createdAt": "2026-09-01T20:19:41.072Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 37 (round 13)
- Player: 花滿樓 (player-2), level 2, experience 3, at (6, 1), health 30, stamina 8.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 13
- Stored experience change: -45 (level up; stored experience reset by game rules)
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-13-player-2-37",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:19:41.077Z"
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
      "spawnedRound": 13,
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

### Turn 38 (round 13)
- Player: 花滿樓 (player-2), level 2, experience 3, at (6, 1), health 30, stamina 8.5
- Attributes: armStrength=8, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-13-player-2-38",
      "round": 13,
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
      "createdAt": "2026-09-01T20:19:41.085Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 39 (round 13)
- Player: 花滿樓 (player-2), level 2, experience 3, at (6, 1), health 30, stamina 8.5
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-13-player-2-39",
      "round": 13,
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
      "createdAt": "2026-09-01T20:19:41.092Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 40 (round 13)
- Player: 花滿樓 (player-2), level 2, experience 3, at (6, 1), health 30, stamina 5.5
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-13-player-2-40",
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
      "createdAt": "2026-09-01T20:19:41.098Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 41 (round 13)
- Player: 花滿樓 (player-2), level 2, experience 3, at (6, 1), health 30, stamina 2.5
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

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
      "createdAt": "2026-09-01T20:19:41.105Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 42 (round 14)
- Player: 花滿樓 (player-2), level 2, experience 8, at (6, 1), health 31.65, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
- Stored experience change: +5
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-13-nest-creature-1-42",
      "round": 13,
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
      "createdAt": "2026-09-01T20:19:41.110Z"
    },
    {
      "id": "action-14-player-2-43",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:19:41.111Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 43 (round 14)
- Player: 花滿樓 (player-2), level 2, experience 11, at (6, 1), health 31.65, stamina 4
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

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
      "createdAt": "2026-09-01T20:19:41.122Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 44 (round 14)
- Player: 花滿樓 (player-2), level 2, experience 11, at (6, 1), health 31.65, stamina 1
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

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
      "createdAt": "2026-09-01T20:19:41.127Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 45 (round 15)
- Player: 花滿樓 (player-2), level 2, experience 13, at (6, 1), health 27.299999999999997, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-14-nest-creature-1-46",
      "round": 14,
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
      "createdAt": "2026-09-01T20:19:41.131Z"
    },
    {
      "id": "action-15-player-2-47",
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
      "createdAt": "2026-09-01T20:19:41.132Z"
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

### Turn 46 (round 15)
- Player: 花滿樓 (player-2), level 2, experience 33, at (6, 1), health 27.299999999999997, stamina 4
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 2, damage 15
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: nest-creature-1
- Nests: creature-nest-1=120/132

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
      "createdAt": "2026-09-01T20:19:41.141Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 47 (round 15)
- Player: 花滿樓 (player-2), level 2, experience 33, at (6, 1), health 27.299999999999997, stamina 1
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

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
      "createdAt": "2026-09-01T20:19:41.146Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 48 (round 16)
- Player: 花滿樓 (player-2), level 2, experience 35, at (6, 1), health 28.949999999999996, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
- Stored experience change: +2
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
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:19:41.149Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 49 (round 16)
- Player: 花滿樓 (player-2), level 2, experience 35, at (6, 1), health 28.949999999999996, stamina 6
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

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
      "createdAt": "2026-09-01T20:19:41.155Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 50 (round 16)
- Player: 花滿樓 (player-2), level 2, experience 35, at (6, 1), health 28.949999999999996, stamina 3
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

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
      "createdAt": "2026-09-01T20:19:41.162Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 51 (round 17)
- Player: 花滿樓 (player-2), level 2, experience 41, at (6, 1), health 30.599999999999994, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
- Stored experience change: +6
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
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.09:practice-skill, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.09:practice-skill, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:19:41.166Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 52 (round 17)
- Player: 花滿樓 (player-2), level 2, experience 41, at (6, 1), health 30.599999999999994, stamina 6
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
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
      "createdAt": "2026-09-01T20:19:41.173Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 53 (round 17)
- Player: 花滿樓 (player-2), level 2, experience 41, at (6, 1), health 30.599999999999994, stamina 3
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-17-player-2-55",
      "round": 17,
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
      "createdAt": "2026-09-01T20:19:41.179Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 54 (round 18)
- Player: 花滿樓 (player-2), level 2, experience 47, at (6, 1), health 32.24999999999999, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
- Stored experience change: +6
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
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.09:practice-skill, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.09:practice-skill, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:19:41.183Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 55 (round 18)
- Player: 花滿樓 (player-2), level 2, experience 47, at (6, 1), health 32.24999999999999, stamina 6
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
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
      "createdAt": "2026-09-01T20:19:41.189Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 56 (round 18)
- Player: 花滿樓 (player-2), level 2, experience 47, at (6, 1), health 32.24999999999999, stamina 3
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
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
      "createdAt": "2026-09-01T20:19:41.197Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 57 (round 19)
- Player: 花滿樓 (player-2), level 2, experience 53, at (6, 1), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
- Stored experience change: +6
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-19-player-2-59",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.09:practice-skill, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.09:practice-skill, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:19:41.200Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 58 (round 19)
- Player: 花滿樓 (player-2), level 2, experience 53, at (6, 1), health 33, stamina 6
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
- Stored experience change: +0
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
      "createdAt": "2026-09-01T20:19:41.206Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 59 (round 19)
- Player: 花滿樓 (player-2), level 2, experience 53, at (6, 1), health 33, stamina 3
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
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
      "createdAt": "2026-09-01T20:19:41.213Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 60 (round 20)
- Player: 花滿樓 (player-2), level 2, experience 59, at (6, 1), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
- Stored experience change: +6
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-20-player-2-62",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.09:practice-skill, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.09:practice-skill, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:19:41.217Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 61 (round 20)
- Player: 花滿樓 (player-2), level 2, experience 59, at (6, 1), health 33, stamina 6
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-20-player-2-63",
      "round": 20,
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
      "createdAt": "2026-09-01T20:19:41.223Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 62 (round 20)
- Player: 花滿樓 (player-2), level 2, experience 59, at (6, 1), health 33, stamina 3
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
- Stored experience change: +0
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
      "createdAt": "2026-09-01T20:19:41.230Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 63 (round 21)
- Player: 花滿樓 (player-2), level 2, experience 65, at (6, 1), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
- Stored experience change: +6
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-21-player-2-65",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.09:practice-skill, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.09:practice-skill, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:19:41.233Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 64 (round 21)
- Player: 花滿樓 (player-2), level 2, experience 65, at (6, 1), health 33, stamina 6
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-21-player-2-66",
      "round": 21,
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
      "createdAt": "2026-09-01T20:19:41.239Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 65 (round 21)
- Player: 花滿樓 (player-2), level 2, experience 65, at (6, 1), health 33, stamina 3
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-21-player-2-67",
      "round": 21,
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
      "createdAt": "2026-09-01T20:19:41.247Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 66 (round 22)
- Player: 花滿樓 (player-2), level 2, experience 71, at (6, 1), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
- Stored experience change: +6
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-22-player-2-68",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.09:practice-skill, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.09:practice-skill, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:19:41.250Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 67 (round 22)
- Player: 花滿樓 (player-2), level 2, experience 71, at (6, 1), health 33, stamina 6
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-22-player-2-69",
      "round": 22,
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
      "createdAt": "2026-09-01T20:19:41.256Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 68 (round 22)
- Player: 花滿樓 (player-2), level 2, experience 71, at (6, 1), health 33, stamina 3
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-22-player-2-70",
      "round": 22,
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
      "createdAt": "2026-09-01T20:19:41.263Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 69 (round 23)
- Player: 花滿樓 (player-2), level 2, experience 77, at (6, 1), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
- Stored experience change: +6
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-23-player-2-71",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.09:practice-skill, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.09:practice-skill, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:19:41.267Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 70 (round 23)
- Player: 花滿樓 (player-2), level 2, experience 77, at (6, 1), health 33, stamina 6
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-23-player-2-72",
      "round": 23,
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
      "createdAt": "2026-09-01T20:19:41.272Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 71 (round 23)
- Player: 花滿樓 (player-2), level 2, experience 77, at (6, 1), health 33, stamina 3
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-23-player-2-73",
      "round": 23,
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
      "createdAt": "2026-09-01T20:19:41.279Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 72 (round 24)
- Player: 花滿樓 (player-2), level 2, experience 83, at (6, 1), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
- Stored experience change: +6
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-24-player-2-74",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.09:practice-skill, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.09:practice-skill, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:19:41.283Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 73 (round 24)
- Player: 花滿樓 (player-2), level 2, experience 83, at (6, 1), health 33, stamina 6
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 3, damage 20
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-24-player-2-75",
      "round": 24,
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
      "createdAt": "2026-09-01T20:19:41.289Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 74 (round 24)
- Player: 花滿樓 (player-2), level 2, experience 83, at (6, 1), health 33, stamina 3
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-24-player-2-76",
      "round": 24,
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
      "createdAt": "2026-09-01T20:19:41.295Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 75 (round 25)
- Player: 花滿樓 (player-2), level 2, experience 89, at (6, 1), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +6
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-25-player-2-77",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.09:practice-skill, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.09:practice-skill, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:19:41.299Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 76 (round 25)
- Player: 花滿樓 (player-2), level 2, experience 89, at (6, 1), health 33, stamina 6
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-25-player-2-78",
      "round": 25,
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
      "createdAt": "2026-09-01T20:19:41.305Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 77 (round 25)
- Player: 花滿樓 (player-2), level 2, experience 89, at (6, 1), health 33, stamina 3
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-25-player-2-79",
      "round": 25,
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
      "createdAt": "2026-09-01T20:19:41.312Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 78 (round 26)
- Player: 花滿樓 (player-2), level 2, experience 95, at (6, 1), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +6
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-26-player-2-80",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.09:practice-skill, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.09:practice-skill, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:19:41.316Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 79 (round 26)
- Player: 花滿樓 (player-2), level 2, experience 95, at (6, 1), health 33, stamina 6
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-26-player-2-81",
      "round": 26,
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
      "createdAt": "2026-09-01T20:19:41.322Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 80 (round 26)
- Player: 花滿樓 (player-2), level 2, experience 95, at (6, 1), health 33, stamina 3
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-26-player-2-82",
      "round": 26,
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
      "createdAt": "2026-09-01T20:19:41.329Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 81 (round 27)
- Player: 花滿樓 (player-2), level 3, experience 1, at (6, 1), health 33, stamina 9
- Attributes: armStrength=9, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: -94 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-27-player-2-83",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.09:practice-skill, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, practiceSkill=0.09:practice-skill, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:19:41.333Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 82 (round 27)
- Player: 花滿樓 (player-2), level 3, experience 1, at (6, 1), health 33, stamina 9
- Attributes: armStrength=10, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-27-player-2-84",
      "round": 27,
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
      "createdAt": "2026-09-01T20:19:41.339Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 83 (round 27)
- Player: 花滿樓 (player-2), level 3, experience 1, at (6, 1), health 33, stamina 9
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-27-player-2-85",
      "round": 27,
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
      "createdAt": "2026-09-01T20:19:41.346Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 84 (round 27)
- Player: 花滿樓 (player-2), level 3, experience 1, at (6, 1), health 33, stamina 6
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-27-player-2-86",
      "round": 27,
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
      "createdAt": "2026-09-01T20:19:41.352Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 85 (round 27)
- Player: 花滿樓 (player-2), level 3, experience 1, at (6, 1), health 33, stamina 3
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-27-player-2-87",
      "round": 27,
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
      "createdAt": "2026-09-01T20:19:41.358Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 86 (round 28)
- Player: 花滿樓 (player-2), level 3, experience 7, at (6, 1), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +6
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-28-player-2-88",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold, practiceSkill=0.00:practice-skill"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.00:hold, practiceSkill=0.00:practice-skill",
      "createdAt": "2026-09-01T20:19:41.362Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 87 (round 28)
- Player: 花滿樓 (player-2), level 3, experience 7, at (6, 2), health 33, stamina 5
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-28-player-2-89",
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
          "row": 6,
          "column": 2
        },
        "reason": "清障：移動到廢墟 蘆葦村 附近"
      },
      "result": "succeeded",
      "reason": "清障：移動到廢墟 蘆葦村 附近",
      "createdAt": "2026-09-01T20:19:41.369Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 88 (round 28)
- Player: 花滿樓 (player-2), level 3, experience 27, at (6, 2), health 33, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-28-player-2-90",
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
      "createdAt": "2026-09-01T20:19:41.373Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 89 (round 29)
- Player: 花滿樓 (player-2), level 3, experience 27, at (6, 2), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-29-player-2-91",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T20:19:41.374Z"
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
      "spawnedRound": 29,
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

### Turn 90 (round 29)
- Player: 花滿樓 (player-2), level 3, experience 27, at (7, 2), health 33, stamina 6
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-29-player-2-92",
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
          "row": 7,
          "column": 2
        },
        "reason": "清障：移動到廢墟 雲嶺莊 附近"
      },
      "result": "succeeded",
      "reason": "清障：移動到廢墟 雲嶺莊 附近",
      "createdAt": "2026-09-01T20:19:41.385Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 91 (round 29)
- Player: 花滿樓 (player-2), level 3, experience 47, at (7, 2), health 33, stamina 1
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-29-player-2-93",
      "round": 29,
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
      "createdAt": "2026-09-01T20:19:41.393Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 92 (round 30)
- Player: 花滿樓 (player-2), level 3, experience 49, at (7, 2), health 26.65, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-29-nest-creature-1-94",
      "round": 29,
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
            "row": 7,
            "column": 2
          }
        },
        "reason": "與 花滿樓 交戰。"
      },
      "result": "succeeded",
      "reason": "與 花滿樓 交戰。",
      "createdAt": "2026-09-01T20:19:41.397Z"
    },
    {
      "id": "action-30-player-2-95",
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
      "createdAt": "2026-09-01T20:19:41.397Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 93 (round 30)
- Player: 花滿樓 (player-2), level 3, experience 89, at (7, 2), health 26.65, stamina 5
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +40
- Spawned creatures: 0
- Defeated creatures: nest-creature-1
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-30-player-2-96",
      "round": 30,
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
            "row": 7,
            "column": 3
          }
        },
        "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.2"
      },
      "result": "succeeded",
      "reason": "交戰：攻擊 生物巢穴 1的怪物 Lv.2",
      "createdAt": "2026-09-01T20:19:41.405Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 94 (round 30)
- Player: 花滿樓 (player-2), level 3, experience 89, at (7, 3), health 26.65, stamina 3
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-30-player-2-97",
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
          "row": 7,
          "column": 3
        },
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:19:41.414Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 95 (round 30)
- Player: 花滿樓 (player-2), level 3, experience 89, at (8, 3), health 26.65, stamina 1
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-30-player-2-98",
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
          "row": 8,
          "column": 3
        },
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:19:41.421Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 96 (round 31)
- Player: 花滿樓 (player-2), level 3, experience 91, at (8, 3), health 28.299999999999997, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-31-player-2-99",
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
      "createdAt": "2026-09-01T20:19:41.424Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 97 (round 31)
- Player: 花滿樓 (player-2), level 3, experience 91, at (8, 4), health 28.299999999999997, stamina 5
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-31-player-2-100",
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
        "reason": "清障：移動到廢墟 石橋村 附近"
      },
      "result": "succeeded",
      "reason": "清障：移動到廢墟 石橋村 附近",
      "createdAt": "2026-09-01T20:19:41.430Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 98 (round 31)
- Player: 花滿樓 (player-2), level 3, experience 111, at (8, 4), health 28.299999999999997, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-31-player-2-101",
      "round": 31,
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
      "createdAt": "2026-09-01T20:19:41.434Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 99 (round 32)
- Player: 花滿樓 (player-2), level 3, experience 111, at (8, 4), health 29.949999999999996, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-32-player-2-102",
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
      "createdAt": "2026-09-01T20:19:41.435Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 100 (round 32)
- Player: 花滿樓 (player-2), level 3, experience 111, at (8, 5), health 29.949999999999996, stamina 7
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-32-player-2-103",
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
          "row": 8,
          "column": 5
        },
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:19:41.446Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 101 (round 32)
- Player: 花滿樓 (player-2), level 3, experience 111, at (8, 6), health 29.949999999999996, stamina 4
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-32-player-2-104",
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
          "row": 8,
          "column": 6
        },
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:19:41.455Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 102 (round 32)
- Player: 花滿樓 (player-2), level 3, experience 111, at (8, 7), health 29.949999999999996, stamina 1
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-32-player-2-105",
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
          "row": 8,
          "column": 7
        },
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:19:41.466Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 103 (round 33)
- Player: 花滿樓 (player-2), level 3, experience 113, at (8, 7), health 31.599999999999994, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-33-player-2-106",
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
      "createdAt": "2026-09-01T20:19:41.469Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 104 (round 33)
- Player: 花滿樓 (player-2), level 3, experience 113, at (8, 6), health 31.599999999999994, stamina 7
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-33-player-2-107",
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
          "row": 8,
          "column": 6
        },
        "reason": "收集道具：移動到道具位置"
      },
      "result": "succeeded",
      "reason": "收集道具：移動到道具位置",
      "createdAt": "2026-09-01T20:19:41.476Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 105 (round 33)
- Player: 花滿樓 (player-2), level 3, experience 113, at (8, 6), health 31.599999999999994, stamina 7
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-33-player-2-108",
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
          "id": "item-point-13",
          "kind": "item",
          "position": {
            "row": 8,
            "column": 6
          }
        },
        "reason": "收集道具：拾取"
      },
      "result": "succeeded",
      "reason": "收集道具：拾取",
      "createdAt": "2026-09-01T20:19:41.484Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 106 (round 33)
- Player: 花滿樓 (player-2), level 3, experience 113, at (9, 6), health 31.599999999999994, stamina 4
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-33-player-2-109",
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
          "row": 9,
          "column": 6
        },
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:19:41.494Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 107 (round 33)
- Player: 花滿樓 (player-2), level 3, experience 113, at (9, 7), health 31.599999999999994, stamina 1
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-33-player-2-110",
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
          "row": 9,
          "column": 7
        },
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:19:41.502Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 108 (round 34)
- Player: 花滿樓 (player-2), level 3, experience 115, at (9, 7), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-34-player-2-111",
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
      "createdAt": "2026-09-01T20:19:41.505Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 109 (round 34)
- Player: 花滿樓 (player-2), level 3, experience 115, at (9, 8), health 33, stamina 5
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-34-player-2-112",
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
          "row": 9,
          "column": 8
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T20:19:41.512Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 110 (round 34)
- Player: 花滿樓 (player-2), level 3, experience 135, at (9, 8), health 33, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-34-player-2-113",
      "round": 34,
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
          "id": "ruin-4",
          "kind": "ruin",
          "position": {
            "row": 10,
            "column": 8
          }
        },
        "reason": "清障：清除廢墟 破落村"
      },
      "result": "succeeded",
      "reason": "清障：清除廢墟 破落村",
      "createdAt": "2026-09-01T20:19:41.517Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 111 (round 35)
- Player: 花滿樓 (player-2), level 3, experience 135, at (9, 8), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-35-player-2-114",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T20:19:41.517Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 112 (round 35)
- Player: 花滿樓 (player-2), level 3, experience 135, at (9, 9), health 33, stamina 5
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-35-player-2-115",
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
          "row": 9,
          "column": 9
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T20:19:41.526Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 113 (round 35)
- Player: 花滿樓 (player-2), level 3, experience 135, at (9, 10), health 33, stamina 3
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-35-player-2-116",
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
          "row": 9,
          "column": 10
        },
        "reason": "防禦建設：移動到據點"
      },
      "result": "succeeded",
      "reason": "防禦建設：移動到據點",
      "createdAt": "2026-09-01T20:19:41.530Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 114 (round 35)
- Player: 花滿樓 (player-2), level 3, experience 135, at (10, 10), health 33, stamina 1
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-35-player-2-117",
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
        "reason": "探索：移動到未探索格 (12,12)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (12,12)",
      "createdAt": "2026-09-01T20:19:41.537Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 115 (round 36)
- Player: 花滿樓 (player-2), level 3, experience 137, at (10, 10), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-36-player-2-118",
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
      "createdAt": "2026-09-01T20:19:41.539Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 116 (round 36)
- Player: 花滿樓 (player-2), level 3, experience 137, at (11, 10), health 33, stamina 8
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-36-player-2-119",
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
        "reason": "清障：移動到廢墟 青山村 附近"
      },
      "result": "succeeded",
      "reason": "清障：移動到廢墟 青山村 附近",
      "createdAt": "2026-09-01T20:19:41.545Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 117 (round 36)
- Player: 花滿樓 (player-2), level 3, experience 137, at (11, 11), health 33, stamina 6
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-36-player-2-120",
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
          "column": 11
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.552Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 118 (round 36)
- Player: 花滿樓 (player-2), level 3, experience 137, at (12, 11), health 33, stamina 4
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-36-player-2-121",
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
          "column": 11
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.561Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 119 (round 36)
- Player: 花滿樓 (player-2), level 3, experience 137, at (12, 11), health 33, stamina 2
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-36-player-2-122",
      "round": 36,
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
      "createdAt": "2026-09-01T20:19:41.566Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 120 (round 36)
- Player: 花滿樓 (player-2), level 3, experience 137, at (12, 11), health 33, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-36-player-2-123",
      "round": 36,
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
      "createdAt": "2026-09-01T20:19:41.569Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 121 (round 37)
- Player: 花滿樓 (player-2), level 3, experience 137, at (12, 11), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-37-player-2-124",
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
      "createdAt": "2026-09-01T20:19:41.570Z"
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
      "spawnedRound": 37,
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

### Turn 122 (round 37)
- Player: 花滿樓 (player-2), level 3, experience 137, at (12, 10), health 33, stamina 5
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-37-player-2-125",
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
          "row": 12,
          "column": 10
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:19:41.578Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 123 (round 37)
- Player: 花滿樓 (player-2), level 3, experience 137, at (12, 9), health 33, stamina 3
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-37-player-2-126",
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
          "row": 12,
          "column": 9
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:19:41.584Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 124 (round 37)
- Player: 花滿樓 (player-2), level 3, experience 137, at (13, 9), health 33, stamina 1
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-37-player-2-127",
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
      "createdAt": "2026-09-01T20:19:41.589Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 125 (round 38)
- Player: 花滿樓 (player-2), level 3, experience 139, at (13, 9), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-37-nest-creature-1-128",
      "round": 37,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:19:41.591Z"
    },
    {
      "id": "action-38-player-2-129",
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
      "createdAt": "2026-09-01T20:19:41.591Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 126 (round 38)
- Player: 花滿樓 (player-2), level 3, experience 139, at (13, 10), health 33, stamina 8
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-38-player-2-130",
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
          "column": 10
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:19:41.600Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 127 (round 38)
- Player: 花滿樓 (player-2), level 3, experience 139, at (13, 11), health 33, stamina 4
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-38-player-2-131",
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:19:41.608Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 128 (round 38)
- Player: 花滿樓 (player-2), level 3, experience 139, at (13, 12), health 33, stamina 2
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-38-player-2-132",
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
          "column": 12
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:19:41.618Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 129 (round 38)
- Player: 花滿樓 (player-2), level 3, experience 139, at (13, 12), health 33, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-38-player-2-133",
      "round": 38,
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
      "createdAt": "2026-09-01T20:19:41.622Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 130 (round 39)
- Player: 花滿樓 (player-2), level 3, experience 139, at (13, 12), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-38-nest-creature-1-134",
      "round": 38,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:19:41.622Z"
    },
    {
      "id": "action-39-player-2-135",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T20:19:41.622Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 131 (round 39)
- Player: 花滿樓 (player-2), level 3, experience 139, at (13, 13), health 33, stamina 8
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-39-player-2-136",
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
          "row": 13,
          "column": 13
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:19:41.631Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 132 (round 39)
- Player: 花滿樓 (player-2), level 3, experience 139, at (13, 12), health 33, stamina 6
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-39-player-2-137",
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
          "row": 13,
          "column": 12
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:19:41.644Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 133 (round 39)
- Player: 花滿樓 (player-2), level 3, experience 139, at (13, 11), health 33, stamina 2
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-39-player-2-138",
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
          "row": 13,
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:19:41.653Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 134 (round 39)
- Player: 花滿樓 (player-2), level 3, experience 139, at (13, 11), health 33, stamina 2
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-39-player-2-139",
      "round": 39,
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
      "createdAt": "2026-09-01T20:19:41.657Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 135 (round 39)
- Player: 花滿樓 (player-2), level 3, experience 139, at (12, 11), health 33, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-39-player-2-140",
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
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.664Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 136 (round 40)
- Player: 花滿樓 (player-2), level 3, experience 139, at (12, 11), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-39-nest-creature-1-141",
      "round": 39,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:19:41.665Z"
    },
    {
      "id": "action-40-player-2-142",
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
      "createdAt": "2026-09-01T20:19:41.665Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 137 (round 40)
- Player: 花滿樓 (player-2), level 3, experience 139, at (11, 11), health 33, stamina 8
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-40-player-2-143",
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
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:19:41.673Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 138 (round 40)
- Player: 花滿樓 (player-2), level 3, experience 139, at (10, 11), health 33, stamina 4
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-40-player-2-144",
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
          "row": 10,
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:19:41.683Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 139 (round 40)
- Player: 花滿樓 (player-2), level 3, experience 139, at (9, 11), health 33, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-40-player-2-145",
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
          "row": 9,
          "column": 11
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:19:41.690Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 140 (round 41)
- Player: 花滿樓 (player-2), level 3, experience 139, at (9, 11), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-40-nest-creature-1-146",
      "round": 40,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:19:41.691Z"
    },
    {
      "id": "action-41-player-2-147",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T20:19:41.691Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 141 (round 41)
- Player: 花滿樓 (player-2), level 3, experience 139, at (9, 11), health 33, stamina 7
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-41-player-2-148",
      "round": 41,
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
      "createdAt": "2026-09-01T20:19:41.698Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 142 (round 41)
- Player: 花滿樓 (player-2), level 3, experience 139, at (9, 10), health 33, stamina 5
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-41-player-2-149",
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
          "row": 9,
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.704Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 143 (round 41)
- Player: 花滿樓 (player-2), level 3, experience 139, at (10, 10), health 33, stamina 3
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-41-player-2-150",
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
          "row": 10,
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.711Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 144 (round 41)
- Player: 花滿樓 (player-2), level 3, experience 139, at (11, 10), health 33, stamina 1
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-41-player-2-151",
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
          "row": 11,
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.717Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 145 (round 41)
- Player: 花滿樓 (player-2), level 3, experience 139, at (11, 10), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-41-player-2-152",
      "round": 41,
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
        "itemId": "true-qi-return-yuan-pill",
        "reason": "使用道具：真氣回元丹"
      },
      "result": "succeeded",
      "reason": "使用道具：真氣回元丹",
      "createdAt": "2026-09-01T20:19:41.719Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 146 (round 41)
- Player: 花滿樓 (player-2), level 3, experience 139, at (12, 10), health 33, stamina 5
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-41-player-2-153",
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
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.726Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 147 (round 41)
- Player: 花滿樓 (player-2), level 3, experience 139, at (13, 10), health 33, stamina 3
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-41-player-2-154",
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
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.732Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 148 (round 41)
- Player: 花滿樓 (player-2), level 3, experience 139, at (13, 9), health 33, stamina 1
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-41-player-2-155",
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
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.738Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 149 (round 42)
- Player: 花滿樓 (player-2), level 3, experience 141, at (13, 9), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-41-nest-creature-1-156",
      "round": 41,
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T20:19:41.740Z"
    },
    {
      "id": "action-42-player-2-157",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:19:41.741Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-1",
      "creatureName": "生物巢穴 1的怪物 Lv.3",
      "message": "生物巢穴 1的怪物 Lv.3 發現並摧毀了道具點。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 150 (round 42)
- Player: 花滿樓 (player-2), level 3, experience 141, at (12, 9), health 33, stamina 8
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-42-player-2-158",
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
          "row": 12,
          "column": 9
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.748Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 151 (round 42)
- Player: 花滿樓 (player-2), level 3, experience 141, at (12, 8), health 33, stamina 3
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-42-player-2-159",
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
          "row": 12,
          "column": 8
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.754Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 152 (round 42)
- Player: 花滿樓 (player-2), level 3, experience 141, at (13, 8), health 33, stamina 1
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-42-player-2-160",
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
          "row": 13,
          "column": 8
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.762Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 153 (round 43)
- Player: 花滿樓 (player-2), level 3, experience 143, at (13, 8), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-42-nest-creature-1-161",
      "round": 42,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 13,
          "column": 6
        },
        "reason": "移動接近 花滿樓。"
      },
      "result": "succeeded",
      "reason": "移動接近 花滿樓。",
      "createdAt": "2026-09-01T20:19:41.766Z"
    },
    {
      "id": "action-43-player-2-162",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:19:41.766Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 154 (round 43)
- Player: 花滿樓 (player-2), level 3, experience 143, at (13, 7), health 33, stamina 8
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-43-player-2-163",
      "round": 43,
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
      "createdAt": "2026-09-01T20:19:41.782Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 155 (round 43)
- Player: 花滿樓 (player-2), level 3, experience 143, at (12, 7), health 33, stamina 5
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-43-player-2-164",
      "round": 43,
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
      "createdAt": "2026-09-01T20:19:41.793Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 156 (round 43)
- Player: 花滿樓 (player-2), level 3, experience 143, at (11, 7), health 33, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-43-player-2-165",
      "round": 43,
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
          "column": 7
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.802Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 157 (round 44)
- Player: 花滿樓 (player-2), level 3, experience 143, at (11, 7), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-43-nest-creature-1-166",
      "round": 43,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.3"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 12,
          "column": 10
        },
        "reason": "移動接近 橫塘。"
      },
      "result": "succeeded",
      "reason": "移動接近 橫塘。",
      "createdAt": "2026-09-01T20:19:41.803Z"
    },
    {
      "id": "action-44-player-2-167",
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
      "createdAt": "2026-09-01T20:19:41.803Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 158 (round 44)
- Player: 花滿樓 (player-2), level 3, experience 143, at (10, 7), health 33, stamina 5
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-44-player-2-168",
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
          "column": 7
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.815Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 159 (round 44)
- Player: 花滿樓 (player-2), level 3, experience 143, at (10, 8), health 33, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-44-player-2-169",
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
          "column": 8
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.826Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 160 (round 45)
- Player: 花滿樓 (player-2), level 3, experience 143, at (10, 8), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-44-nest-creature-1-170",
      "round": 44,
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
      "createdAt": "2026-09-01T20:19:41.827Z"
    },
    {
      "id": "action-45-player-2-171",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T20:19:41.827Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-1",
      "creatureName": "生物巢穴 1的怪物 Lv.3",
      "message": "生物巢穴 1的怪物 Lv.3 攻擊橫塘，造成 11 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 161 (round 45)
- Player: 花滿樓 (player-2), level 3, experience 143, at (10, 9), health 33, stamina 8
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-45-player-2-172",
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
          "row": 10,
          "column": 9
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.841Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 162 (round 45)
- Player: 花滿樓 (player-2), level 3, experience 143, at (10, 10), health 33, stamina 6
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-45-player-2-173",
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
          "row": 10,
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.849Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 163 (round 45)
- Player: 花滿樓 (player-2), level 3, experience 143, at (11, 10), health 33, stamina 4
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-45-player-2-174",
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
          "row": 11,
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.857Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 164 (round 45)
- Player: 花滿樓 (player-2), level 3, experience 143, at (11, 11), health 33, stamina 2
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-45-player-2-175",
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
          "row": 11,
          "column": 11
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.865Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 165 (round 45)
- Player: 花滿樓 (player-2), level 3, experience 143, at (11, 10), health 33, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-45-player-2-176",
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
          "row": 11,
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.872Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 166 (round 46)
- Player: 花滿樓 (player-2), level 3, experience 143, at (11, 10), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-45-nest-creature-1-177",
      "round": 45,
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
      "createdAt": "2026-09-01T20:19:41.872Z"
    },
    {
      "id": "action-46-player-2-178",
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
      "createdAt": "2026-09-01T20:19:41.872Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 167 (round 46)
- Player: 花滿樓 (player-2), level 3, experience 143, at (12, 10), health 33, stamina 5
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-46-player-2-179",
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
          "row": 12,
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.881Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 168 (round 46)
- Player: 花滿樓 (player-2), level 3, experience 143, at (13, 10), health 33, stamina 3
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-46-player-2-180",
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
      "createdAt": "2026-09-01T20:19:41.887Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 169 (round 46)
- Player: 花滿樓 (player-2), level 3, experience 143, at (13, 9), health 33, stamina 1
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-46-player-2-181",
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
      "createdAt": "2026-09-01T20:19:41.896Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 170 (round 47)
- Player: 花滿樓 (player-2), level 3, experience 145, at (13, 9), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +2
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-46-nest-creature-1-182",
      "round": 46,
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
      "createdAt": "2026-09-01T20:19:41.898Z"
    },
    {
      "id": "action-47-player-2-183",
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
      "createdAt": "2026-09-01T20:19:41.899Z"
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
      "spawnedRound": 47,
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

### Turn 171 (round 47)
- Player: 花滿樓 (player-2), level 3, experience 145, at (12, 9), health 33, stamina 8
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-47-player-2-184",
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
      "createdAt": "2026-09-01T20:19:41.907Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 172 (round 47)
- Player: 花滿樓 (player-2), level 3, experience 145, at (12, 8), health 33, stamina 3
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-47-player-2-185",
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
      "createdAt": "2026-09-01T20:19:41.915Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 173 (round 47)
- Player: 花滿樓 (player-2), level 3, experience 145, at (13, 8), health 33, stamina 1
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-47-player-2-186",
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
      "createdAt": "2026-09-01T20:19:41.924Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 174 (round 48)
- Player: 花滿樓 (player-2), level 3, experience 147, at (13, 8), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-47-nest-creature-1-187",
      "round": 47,
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
      "createdAt": "2026-09-01T20:19:41.929Z"
    },
    {
      "id": "action-47-nest-creature-2-188",
      "round": 47,
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
      "createdAt": "2026-09-01T20:19:41.929Z"
    },
    {
      "id": "action-48-player-2-189",
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
        "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T20:19:41.929Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 175 (round 48)
- Player: 花滿樓 (player-2), level 3, experience 147, at (13, 7), health 33, stamina 8
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-48-player-2-190",
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
          "column": 7
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.943Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 176 (round 48)
- Player: 花滿樓 (player-2), level 3, experience 147, at (12, 7), health 33, stamina 5
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-48-player-2-191",
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
          "row": 12,
          "column": 7
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.953Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 177 (round 48)
- Player: 花滿樓 (player-2), level 3, experience 147, at (11, 7), health 33, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-48-player-2-192",
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
          "row": 11,
          "column": 7
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.962Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 178 (round 49)
- Player: 花滿樓 (player-2), level 3, experience 147, at (11, 7), health 23.65, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-48-nest-creature-1-193",
      "round": 48,
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
      "createdAt": "2026-09-01T20:19:41.963Z"
    },
    {
      "id": "action-48-nest-creature-2-194",
      "round": 48,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
            "column": 7
          }
        },
        "reason": "與 花滿樓 交戰。"
      },
      "result": "succeeded",
      "reason": "與 花滿樓 交戰。",
      "createdAt": "2026-09-01T20:19:41.963Z"
    },
    {
      "id": "action-49-player-2-195",
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
      "createdAt": "2026-09-01T20:19:41.963Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-2",
      "creatureName": "生物巢穴 1的怪物 Lv.4",
      "message": "生物巢穴 1的怪物 Lv.4 攻擊 花滿樓，造成 11 點傷害（根骨減傷，暴擊）。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 179 (round 49)
- Player: 花滿樓 (player-2), level 3, experience 147, at (10, 7), health 23.65, stamina 5
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-49-player-2-196",
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
          "row": 10,
          "column": 7
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.973Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 180 (round 49)
- Player: 花滿樓 (player-2), level 3, experience 147, at (10, 8), health 23.65, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-49-player-2-197",
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
          "row": 10,
          "column": 8
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.983Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 181 (round 50)
- Player: 花滿樓 (player-2), level 3, experience 147, at (10, 8), health 25.299999999999997, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-49-nest-creature-1-198",
      "round": 49,
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
      "createdAt": "2026-09-01T20:19:41.983Z"
    },
    {
      "id": "action-49-nest-creature-2-199",
      "round": 49,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 11,
          "column": 10
        },
        "reason": "移動接近 橫塘。"
      },
      "result": "succeeded",
      "reason": "移動接近 橫塘。",
      "createdAt": "2026-09-01T20:19:41.983Z"
    },
    {
      "id": "action-50-player-2-200",
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
      "createdAt": "2026-09-01T20:19:41.983Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 182 (round 50)
- Player: 花滿樓 (player-2), level 3, experience 147, at (10, 9), health 25.299999999999997, stamina 8
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-50-player-2-201",
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
          "row": 10,
          "column": 9
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:41.996Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 183 (round 50)
- Player: 花滿樓 (player-2), level 3, experience 147, at (10, 10), health 25.299999999999997, stamina 6
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-50-player-2-202",
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
          "row": 10,
          "column": 10
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:42.003Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 184 (round 50)
- Player: 花滿樓 (player-2), level 3, experience 147, at (10, 11), health 25.299999999999997, stamina 2
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-50-player-2-203",
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
          "row": 10,
          "column": 11
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:42.010Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 185 (round 50)
- Player: 花滿樓 (player-2), level 3, experience 147, at (11, 11), health 25.299999999999997, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-50-player-2-204",
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
          "row": 11,
          "column": 11
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:42.016Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 186 (round 51)
- Player: 花滿樓 (player-2), level 3, experience 147, at (11, 11), health 26.949999999999996, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-50-nest-creature-1-205",
      "round": 50,
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
      "createdAt": "2026-09-01T20:19:42.016Z"
    },
    {
      "id": "action-50-nest-creature-2-206",
      "round": 50,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 12,
          "column": 10
        },
        "reason": "移動接近 橫塘。"
      },
      "result": "succeeded",
      "reason": "移動接近 橫塘。",
      "createdAt": "2026-09-01T20:19:42.017Z"
    },
    {
      "id": "action-51-player-2-207",
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
      "createdAt": "2026-09-01T20:19:42.017Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 187 (round 51)
- Player: 花滿樓 (player-2), level 3, experience 147, at (11, 12), health 26.949999999999996, stamina 6
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-51-player-2-208",
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
          "column": 12
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:42.029Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 188 (round 51)
- Player: 花滿樓 (player-2), level 3, experience 147, at (11, 12), health 26.949999999999996, stamina 6
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-51-player-2-209",
      "round": 51,
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
      "createdAt": "2026-09-01T20:19:42.037Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 189 (round 51)
- Player: 花滿樓 (player-2), level 3, experience 147, at (11, 12), health 26.949999999999996, stamina 4
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-51-player-2-210",
      "round": 51,
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
      "createdAt": "2026-09-01T20:19:42.046Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 190 (round 51)
- Player: 花滿樓 (player-2), level 3, experience 147, at (11, 12), health 26.949999999999996, stamina 2
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-51-player-2-211",
      "round": 51,
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
      "createdAt": "2026-09-01T20:19:42.054Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 191 (round 51)
- Player: 花滿樓 (player-2), level 3, experience 147, at (11, 12), health 26.949999999999996, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-51-player-2-212",
      "round": 51,
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
      "createdAt": "2026-09-01T20:19:42.061Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 192 (round 52)
- Player: 花滿樓 (player-2), level 3, experience 147, at (11, 12), health 28.599999999999994, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-51-nest-creature-1-213",
      "round": 51,
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
      "createdAt": "2026-09-01T20:19:42.062Z"
    },
    {
      "id": "action-51-nest-creature-2-214",
      "round": 51,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 11,
          "column": 10
        },
        "reason": "移動接近 橫塘。"
      },
      "result": "succeeded",
      "reason": "移動接近 橫塘。",
      "createdAt": "2026-09-01T20:19:42.062Z"
    },
    {
      "id": "action-52-player-2-215",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T20:19:42.062Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 193 (round 52)
- Player: 花滿樓 (player-2), level 3, experience 147, at (11, 12), health 28.599999999999994, stamina 8
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-52-player-2-216",
      "round": 52,
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
      "createdAt": "2026-09-01T20:19:42.070Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 194 (round 52)
- Player: 花滿樓 (player-2), level 3, experience 147, at (11, 12), health 28.599999999999994, stamina 6
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-52-player-2-217",
      "round": 52,
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
      "createdAt": "2026-09-01T20:19:42.077Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 195 (round 52)
- Player: 花滿樓 (player-2), level 3, experience 147, at (11, 12), health 28.599999999999994, stamina 4
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-52-player-2-218",
      "round": 52,
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
      "createdAt": "2026-09-01T20:19:42.085Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 196 (round 52)
- Player: 花滿樓 (player-2), level 3, experience 147, at (11, 12), health 28.599999999999994, stamina 2
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-52-player-2-219",
      "round": 52,
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
      "createdAt": "2026-09-01T20:19:42.094Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 197 (round 52)
- Player: 花滿樓 (player-2), level 3, experience 147, at (11, 12), health 28.599999999999994, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-52-player-2-220",
      "round": 52,
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
      "createdAt": "2026-09-01T20:19:42.099Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 198 (round 53)
- Player: 花滿樓 (player-2), level 3, experience 147, at (11, 12), health 30.249999999999993, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-52-nest-creature-1-221",
      "round": 52,
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
      "createdAt": "2026-09-01T20:19:42.099Z"
    },
    {
      "id": "action-52-nest-creature-2-222",
      "round": 52,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 12,
          "column": 10
        },
        "reason": "移動接近 橫塘。"
      },
      "result": "succeeded",
      "reason": "移動接近 橫塘。",
      "createdAt": "2026-09-01T20:19:42.099Z"
    },
    {
      "id": "action-53-player-2-223",
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
      "createdAt": "2026-09-01T20:19:42.100Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 199 (round 53)
- Player: 花滿樓 (player-2), level 3, experience 147, at (11, 12), health 30.249999999999993, stamina 8
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-53-player-2-224",
      "round": 53,
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
      "createdAt": "2026-09-01T20:19:42.110Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 200 (round 53)
- Player: 花滿樓 (player-2), level 3, experience 147, at (11, 13), health 30.249999999999993, stamina 4
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-53-player-2-225",
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:19:42.120Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 201 (round 53)
- Player: 花滿樓 (player-2), level 3, experience 147, at (10, 13), health 30.249999999999993, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-53-player-2-226",
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
          "row": 10,
          "column": 13
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:19:42.131Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 202 (round 54)
- Player: 花滿樓 (player-2), level 3, experience 147, at (10, 13), health 31.89999999999999, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-53-nest-creature-1-227",
      "round": 53,
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
      "createdAt": "2026-09-01T20:19:42.131Z"
    },
    {
      "id": "action-53-nest-creature-2-228",
      "round": 53,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 11,
          "column": 10
        },
        "reason": "移動接近 橫塘。"
      },
      "result": "succeeded",
      "reason": "移動接近 橫塘。",
      "createdAt": "2026-09-01T20:19:42.131Z"
    },
    {
      "id": "action-54-player-2-229",
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
      "createdAt": "2026-09-01T20:19:42.131Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 203 (round 54)
- Player: 花滿樓 (player-2), level 3, experience 147, at (9, 13), health 31.89999999999999, stamina 8
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-54-player-2-230",
      "round": 54,
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:19:42.141Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 204 (round 54)
- Player: 花滿樓 (player-2), level 3, experience 147, at (8, 13), health 31.89999999999999, stamina 6
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-54-player-2-231",
      "round": 54,
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
      "createdAt": "2026-09-01T20:19:42.151Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 205 (round 54)
- Player: 花滿樓 (player-2), level 3, experience 147, at (8, 13), health 31.89999999999999, stamina 6
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-54-player-2-232",
      "round": 54,
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
      "createdAt": "2026-09-01T20:19:42.161Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 206 (round 54)
- Player: 花滿樓 (player-2), level 3, experience 147, at (8, 12), health 31.89999999999999, stamina 4
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-54-player-2-233",
      "round": 54,
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:19:42.172Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 207 (round 54)
- Player: 花滿樓 (player-2), level 3, experience 147, at (8, 12), health 31.89999999999999, stamina 1
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-54-player-2-234",
      "round": 54,
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
      "createdAt": "2026-09-01T20:19:42.179Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 208 (round 54)
- Player: 花滿樓 (player-2), level 3, experience 147, at (8, 12), health 31.89999999999999, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-54-player-2-235",
      "round": 54,
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
        "itemId": "true-qi-return-yuan-pill",
        "reason": "使用道具：真氣回元丹"
      },
      "result": "succeeded",
      "reason": "使用道具：真氣回元丹",
      "createdAt": "2026-09-01T20:19:42.182Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 209 (round 54)
- Player: 花滿樓 (player-2), level 3, experience 147, at (8, 11), health 31.89999999999999, stamina 8
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-54-player-2-236",
      "round": 54,
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
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:42.189Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 210 (round 54)
- Player: 花滿樓 (player-2), level 3, experience 147, at (9, 11), health 31.89999999999999, stamina 4
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-54-player-2-237",
      "round": 54,
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
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:42.200Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 211 (round 54)
- Player: 花滿樓 (player-2), level 3, experience 147, at (10, 11), health 31.89999999999999, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-54-player-2-238",
      "round": 54,
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
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:42.206Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 212 (round 55)
- Player: 花滿樓 (player-2), level 3, experience 147, at (10, 11), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-54-nest-creature-1-239",
      "round": 54,
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
      "createdAt": "2026-09-01T20:19:42.207Z"
    },
    {
      "id": "action-54-nest-creature-2-240",
      "round": 54,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 12,
          "column": 10
        },
        "reason": "移動接近 橫塘。"
      },
      "result": "succeeded",
      "reason": "移動接近 橫塘。",
      "createdAt": "2026-09-01T20:19:42.207Z"
    },
    {
      "id": "action-55-player-2-241",
      "round": 55,
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
      "createdAt": "2026-09-01T20:19:42.207Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 213 (round 55)
- Player: 花滿樓 (player-2), level 3, experience 147, at (11, 11), health 33, stamina 8
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-55-player-2-242",
      "round": 55,
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
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:42.219Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 214 (round 55)
- Player: 花滿樓 (player-2), level 3, experience 147, at (11, 12), health 33, stamina 4
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-55-player-2-243",
      "round": 55,
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
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T20:19:42.231Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 215 (round 55)
- Player: 花滿樓 (player-2), level 3, experience 147, at (11, 12), health 33, stamina 2
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-55-player-2-244",
      "round": 55,
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
      "createdAt": "2026-09-01T20:19:42.241Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 216 (round 55)
- Player: 花滿樓 (player-2), level 3, experience 147, at (11, 12), health 33, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-55-player-2-245",
      "round": 55,
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
      "createdAt": "2026-09-01T20:19:42.248Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 217 (round 56)
- Player: 花滿樓 (player-2), level 3, experience 147, at (11, 12), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-55-nest-creature-1-246",
      "round": 55,
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
      "createdAt": "2026-09-01T20:19:42.249Z"
    },
    {
      "id": "action-55-nest-creature-2-247",
      "round": 55,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 11,
          "column": 10
        },
        "reason": "移動接近 橫塘。"
      },
      "result": "succeeded",
      "reason": "移動接近 橫塘。",
      "createdAt": "2026-09-01T20:19:42.249Z"
    },
    {
      "id": "action-56-player-2-248",
      "round": 56,
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
      "createdAt": "2026-09-01T20:19:42.249Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 218 (round 56)
- Player: 花滿樓 (player-2), level 3, experience 147, at (11, 12), health 33, stamina 8
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-56-player-2-249",
      "round": 56,
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
      "createdAt": "2026-09-01T20:19:42.257Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 219 (round 56)
- Player: 花滿樓 (player-2), level 3, experience 147, at (11, 13), health 33, stamina 4
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-56-player-2-250",
      "round": 56,
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:19:42.266Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 220 (round 56)
- Player: 花滿樓 (player-2), level 3, experience 147, at (10, 13), health 33, stamina 0
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-56-player-2-251",
      "round": 56,
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T20:19:42.275Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 221 (round 57)
- Player: 花滿樓 (player-2), level 3, experience 147, at (10, 13), health 33, stamina 10
- Attributes: armStrength=11, constitution=11, agility=9, innerEnergy=8, insight=8
- Inner skill: 黃土紮根 (yellow-earth-inner), level 4, damage 25
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-56-nest-creature-1-252",
      "round": 56,
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
      "createdAt": "2026-09-01T20:19:42.275Z"
    },
    {
      "id": "action-56-nest-creature-2-253",
      "round": 56,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 12,
          "column": 10
        },
        "reason": "移動接近 橫塘。"
      },
      "result": "succeeded",
      "reason": "移動接近 橫塘。",
      "createdAt": "2026-09-01T20:19:42.275Z"
    },
    {
      "id": "action-57-player-2-254",
      "round": 57,
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
      "createdAt": "2026-09-01T20:19:42.276Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

