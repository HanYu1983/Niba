# AI Beginner Sandbox Simple Trace

- AI turns: 173
- Final round: 39
- Game won: false
- Game over: true
- Remaining nests: 1

## Aggregate

- Action counts: move=89, use-facility=77, attack=45, end-turn=38, hold=23, use-item=1
- Creatures spawned (total): 5
- Creatures defeated (total): 0
- Level-ups observed: 0
- Final player: level 1, experience 12, inner skill 吐納功 (tuna-gong) lv.1 damage 5
- Final attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13

## Efficiency (KPI)

- 行動產出率 (productive): █████······· 45.1% (123/273)
- 擊殺效率 (kill/generate): ············ 0.00 (0/5)
- 擊殺成本 (attack/kill): n/a (45 次攻擊 / 0 擊殺)
- 經驗效率 (XP/turn): 0.07 (12 XP / 173 turns)

- Nest health (start → end): creature-nest-1=120→120

## Turn Trace

### Turn 1 (round 1)
- Player: 韓信 (player-2), level 1, experience 0, at (13, 11), health 24, stamina 6
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
      "id": "action-1-player-2-889",
      "round": 1,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:27.948Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 2 (round 1)
- Player: 韓信 (player-2), level 1, experience 0, at (13, 10), health 24, stamina 4
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
      "id": "action-1-player-2-890",
      "round": 1,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:27.973Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 3 (round 1)
- Player: 韓信 (player-2), level 1, experience 0, at (12, 10), health 24, stamina 2
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
      "id": "action-1-player-2-891",
      "round": 1,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:27.996Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 4 (round 1)
- Player: 韓信 (player-2), level 1, experience 0, at (12, 11), health 24, stamina 0
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
      "id": "action-1-player-2-892",
      "round": 1,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-02T15:47:28.010Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 5 (round 2)
- Player: 韓信 (player-2), level 1, experience 0, at (12, 11), health 24, stamina 8
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
      "id": "action-2-player-2-893",
      "round": 2,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.011Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 6 (round 2)
- Player: 韓信 (player-2), level 1, experience 0, at (12, 12), health 24, stamina 6
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
      "id": "action-2-player-2-894",
      "round": 2,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 12,
          "column": 12
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-02T15:47:28.034Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 7 (round 2)
- Player: 韓信 (player-2), level 1, experience 0, at (12, 13), health 24, stamina 2
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
      "id": "action-2-player-2-895",
      "round": 2,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 12,
          "column": 13
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-02T15:47:28.053Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 8 (round 2)
- Player: 韓信 (player-2), level 1, experience 0, at (11, 13), health 24, stamina 0
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
      "id": "action-2-player-2-896",
      "round": 2,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-02T15:47:28.064Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 9 (round 3)
- Player: 韓信 (player-2), level 1, experience 0, at (11, 13), health 24, stamina 8
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
      "id": "action-3-player-2-897",
      "round": 3,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.064Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 10 (round 3)
- Player: 韓信 (player-2), level 1, experience 0, at (10, 13), health 24, stamina 6
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
      "id": "action-3-player-2-898",
      "round": 3,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-02T15:47:28.080Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 11 (round 3)
- Player: 韓信 (player-2), level 1, experience 0, at (10, 12), health 24, stamina 4
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
      "id": "action-3-player-2-899",
      "round": 3,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 10,
          "column": 12
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-02T15:47:28.093Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 12 (round 3)
- Player: 韓信 (player-2), level 1, experience 0, at (11, 12), health 24, stamina 2
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
      "id": "action-3-player-2-900",
      "round": 3,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-02T15:47:28.107Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 13 (round 3)
- Player: 韓信 (player-2), level 1, experience 0, at (11, 13), health 24, stamina 0
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
      "id": "action-3-player-2-901",
      "round": 3,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-02T15:47:28.117Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 14 (round 4)
- Player: 韓信 (player-2), level 1, experience 0, at (11, 13), health 24, stamina 8
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
      "id": "action-4-player-2-902",
      "round": 4,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.117Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 15 (round 4)
- Player: 韓信 (player-2), level 1, experience 0, at (12, 13), health 24, stamina 4
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
      "id": "action-4-player-2-903",
      "round": 4,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 12,
          "column": 13
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-02T15:47:28.133Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 16 (round 4)
- Player: 韓信 (player-2), level 1, experience 0, at (11, 13), health 24, stamina 2
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
      "id": "action-4-player-2-904",
      "round": 4,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-02T15:47:28.146Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 17 (round 4)
- Player: 韓信 (player-2), level 1, experience 0, at (10, 13), health 24, stamina 0
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
      "id": "action-4-player-2-905",
      "round": 4,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-02T15:47:28.157Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 18 (round 5)
- Player: 韓信 (player-2), level 1, experience 0, at (10, 13), health 24, stamina 8
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
      "id": "action-5-player-2-906",
      "round": 5,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.158Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 19 (round 5)
- Player: 韓信 (player-2), level 1, experience 0, at (9, 13), health 24, stamina 3
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
      "id": "action-5-player-2-907",
      "round": 5,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-02T15:47:28.171Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 20 (round 5)
- Player: 韓信 (player-2), level 1, experience 0, at (9, 12), health 24, stamina 1
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
      "id": "action-5-player-2-908",
      "round": 5,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 9,
          "column": 12
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-02T15:47:28.184Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 21 (round 6)
- Player: 韓信 (player-2), level 1, experience 2, at (9, 12), health 24, stamina 8
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
      "id": "action-6-player-2-909",
      "round": 6,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.187Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 22 (round 6)
- Player: 韓信 (player-2), level 1, experience 2, at (8, 12), health 24, stamina 6
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
      "id": "action-6-player-2-910",
      "round": 6,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.201Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 23 (round 6)
- Player: 韓信 (player-2), level 1, experience 2, at (8, 13), health 24, stamina 4
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
      "id": "action-6-player-2-911",
      "round": 6,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:28.212Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 24 (round 6)
- Player: 韓信 (player-2), level 1, experience 2, at (7, 13), health 24, stamina 2
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
      "id": "action-6-player-2-912",
      "round": 6,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 7,
          "column": 13
        },
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:28.225Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 25 (round 6)
- Player: 韓信 (player-2), level 1, experience 2, at (6, 13), health 24, stamina 0
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
      "id": "action-6-player-2-913",
      "round": 6,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 6,
          "column": 13
        },
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-02T15:47:28.232Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 26 (round 7)
- Player: 韓信 (player-2), level 1, experience 2, at (6, 13), health 24, stamina 8
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
      "id": "action-7-player-2-914",
      "round": 7,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.232Z"
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
      "innerSkillId": "yellow-earth-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 12,
        "column": 9
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
      "behaviorType": "wanderer",
      "schoolId": "yellow-earth",
      "homePosition": {
        "row": 13,
        "column": 9
      },
      "homeNestId": "creature-nest-1",
      "spawnedRound": 7,
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

### Turn 27 (round 7)
- Player: 韓信 (player-2), level 1, experience 2, at (6, 12), health 24, stamina 3
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
      "id": "action-7-player-2-915",
      "round": 7,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-02T15:47:28.244Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 28 (round 7)
- Player: 韓信 (player-2), level 1, experience 2, at (5, 12), health 24, stamina 1
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
      "id": "action-7-player-2-916",
      "round": 7,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-02T15:47:28.253Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 29 (round 8)
- Player: 韓信 (player-2), level 1, experience 4, at (5, 12), health 24, stamina 8
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
      "id": "action-7-nest-creature-1-917",
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-02T15:47:28.256Z"
    },
    {
      "id": "action-8-player-2-918",
      "round": 8,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.256Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 30 (round 8)
- Player: 韓信 (player-2), level 1, experience 4, at (5, 13), health 24, stamina 6
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
      "id": "action-8-player-2-919",
      "round": 8,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:28.267Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 31 (round 8)
- Player: 韓信 (player-2), level 1, experience 4, at (4, 13), health 24, stamina 4
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
      "id": "action-8-player-2-920",
      "round": 8,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:28.278Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 32 (round 8)
- Player: 韓信 (player-2), level 1, experience 4, at (4, 12), health 24, stamina 2
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
      "id": "action-8-player-2-921",
      "round": 8,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.289Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 33 (round 8)
- Player: 韓信 (player-2), level 1, experience 4, at (4, 11), health 24, stamina 0
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
      "id": "action-8-player-2-922",
      "round": 8,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 4,
          "column": 11
        },
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-02T15:47:28.297Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 34 (round 9)
- Player: 韓信 (player-2), level 1, experience 4, at (4, 11), health 24, stamina 8
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
      "id": "action-8-nest-creature-1-923",
      "round": 8,
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
      "createdAt": "2026-09-02T15:47:28.298Z"
    },
    {
      "id": "action-9-player-2-924",
      "round": 9,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.298Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 35 (round 9)
- Player: 韓信 (player-2), level 1, experience 4, at (5, 11), health 24, stamina 6
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
      "id": "action-9-player-2-925",
      "round": 9,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-02T15:47:28.309Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 36 (round 9)
- Player: 韓信 (player-2), level 1, experience 4, at (5, 10), health 24, stamina 1
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
      "id": "action-9-player-2-926",
      "round": 9,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-02T15:47:28.320Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 37 (round 10)
- Player: 韓信 (player-2), level 1, experience 6, at (5, 10), health 24, stamina 8
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
      "id": "action-9-nest-creature-1-927",
      "round": 9,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:28.324Z"
    },
    {
      "id": "action-10-player-2-928",
      "round": 10,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.324Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-1",
      "creatureName": "生物巢穴 1的怪物 Lv.1",
      "message": "生物巢穴 1的怪物 Lv.1 攻擊AI 補給據點，造成 3 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 38 (round 10)
- Player: 韓信 (player-2), level 1, experience 6, at (5, 9), health 24, stamina 3
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
      "id": "action-10-player-2-929",
      "round": 10,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:28.335Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 39 (round 10)
- Player: 韓信 (player-2), level 1, experience 6, at (6, 9), health 24, stamina 1
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
      "id": "action-10-player-2-930",
      "round": 10,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.345Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 40 (round 11)
- Player: 韓信 (player-2), level 1, experience 8, at (6, 9), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-10-nest-creature-1-931",
      "round": 10,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:28.348Z"
    },
    {
      "id": "action-11-player-2-932",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.348Z"
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
      "innerSkillId": "yellow-earth-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 12,
        "column": 9
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
      "behaviorType": "wanderer",
      "schoolId": "yellow-earth",
      "homePosition": {
        "row": 13,
        "column": 9
      },
      "homeNestId": "creature-nest-1",
      "spawnedRound": 11,
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

### Turn 41 (round 11)
- Player: 韓信 (player-2), level 1, experience 8, at (7, 9), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-11-player-2-933",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.359Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 42 (round 11)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 9), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-11-player-2-934",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.368Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 43 (round 11)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-11-player-2-935",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.380Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 44 (round 11)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-11-player-2-936",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.387Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 45 (round 12)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-11-nest-creature-1-937",
      "round": 11,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:28.387Z"
    },
    {
      "id": "action-11-nest-creature-2-938",
      "round": 11,
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
      "createdAt": "2026-09-02T15:47:28.387Z"
    },
    {
      "id": "action-12-player-2-939",
      "round": 12,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.387Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 46 (round 12)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-12-player-2-940",
      "round": 12,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.396Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 47 (round 12)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-12-player-2-941",
      "round": 12,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.403Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 48 (round 12)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-12-player-2-942",
      "round": 12,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.413Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 49 (round 12)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-12-player-2-943",
      "round": 12,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.418Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 50 (round 13)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-12-nest-creature-1-944",
      "round": 12,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:28.419Z"
    },
    {
      "id": "action-12-nest-creature-2-945",
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
          "row": 12,
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:28.419Z"
    },
    {
      "id": "action-13-player-2-946",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.419Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 51 (round 13)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-13-player-2-947",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.428Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 52 (round 13)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-13-player-2-948",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.436Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 53 (round 13)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-13-player-2-949",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.445Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 54 (round 13)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-13-player-2-950",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.451Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 55 (round 14)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-13-nest-creature-1-951",
      "round": 13,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:28.451Z"
    },
    {
      "id": "action-13-nest-creature-2-952",
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
          "row": 13,
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:28.451Z"
    },
    {
      "id": "action-14-player-2-953",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.451Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 56 (round 14)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-14-player-2-954",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.460Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 57 (round 14)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-14-player-2-955",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.469Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 58 (round 14)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-14-player-2-956",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.478Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 59 (round 14)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-14-player-2-957",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.483Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 60 (round 15)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-14-nest-creature-1-958",
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:28.484Z"
    },
    {
      "id": "action-14-nest-creature-2-959",
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
          "row": 12,
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:28.484Z"
    },
    {
      "id": "action-15-player-2-960",
      "round": 15,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.484Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 61 (round 15)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-15-player-2-961",
      "round": 15,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.492Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 62 (round 15)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-15-player-2-962",
      "round": 15,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.500Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 63 (round 15)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-15-player-2-963",
      "round": 15,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.509Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 64 (round 15)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-15-player-2-964",
      "round": 15,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.514Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 65 (round 16)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-15-nest-creature-1-965",
      "round": 15,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:28.515Z"
    },
    {
      "id": "action-15-nest-creature-2-966",
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
          "row": 13,
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:28.515Z"
    },
    {
      "id": "action-16-player-2-967",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.515Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 66 (round 16)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-968",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.524Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 67 (round 16)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-969",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.533Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 68 (round 16)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-970",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.542Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 69 (round 16)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-971",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.547Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 70 (round 17)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-16-nest-creature-1-972",
      "round": 16,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:28.547Z"
    },
    {
      "id": "action-16-nest-creature-2-973",
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
          "row": 12,
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:28.547Z"
    },
    {
      "id": "action-17-player-2-974",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.548Z"
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
      "innerSkillId": "yellow-earth-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 12,
        "column": 9
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
      "behaviorType": "wanderer",
      "schoolId": "yellow-earth",
      "homePosition": {
        "row": 13,
        "column": 9
      },
      "homeNestId": "creature-nest-1",
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

### Turn 71 (round 17)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-17-player-2-975",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.556Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 72 (round 17)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-17-player-2-976",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.564Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 73 (round 17)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-17-player-2-977",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.572Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 74 (round 17)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-17-player-2-978",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.578Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 75 (round 18)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-17-nest-creature-1-979",
      "round": 17,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:28.578Z"
    },
    {
      "id": "action-17-nest-creature-2-980",
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
          "row": 13,
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:28.579Z"
    },
    {
      "id": "action-17-nest-creature-3-981",
      "round": 17,
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
      "createdAt": "2026-09-02T15:47:28.579Z"
    },
    {
      "id": "action-18-player-2-982",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.579Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 76 (round 18)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-18-player-2-983",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.587Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 77 (round 18)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-18-player-2-984",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.595Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 78 (round 18)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-18-player-2-985",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.604Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 79 (round 18)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-18-player-2-986",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.610Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 80 (round 19)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-18-nest-creature-1-987",
      "round": 18,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:28.611Z"
    },
    {
      "id": "action-18-nest-creature-2-988",
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
          "row": 12,
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:28.611Z"
    },
    {
      "id": "action-18-nest-creature-3-989",
      "round": 18,
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
          "row": 13,
          "column": 4
        },
        "reason": "移動接近 item-point-1。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-1。",
      "createdAt": "2026-09-02T15:47:28.611Z"
    },
    {
      "id": "action-19-player-2-990",
      "round": 19,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.611Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-3",
      "creatureName": "生物巢穴 1的怪物 Lv.3",
      "message": "生物巢穴 1的怪物 Lv.3 吃掉了道具點。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 81 (round 19)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-19-player-2-991",
      "round": 19,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.620Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 82 (round 19)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-19-player-2-992",
      "round": 19,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.628Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 83 (round 19)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-19-player-2-993",
      "round": 19,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.636Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 84 (round 19)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-19-player-2-994",
      "round": 19,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.643Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 85 (round 20)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-19-nest-creature-1-995",
      "round": 19,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:28.643Z"
    },
    {
      "id": "action-19-nest-creature-2-996",
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
          "row": 13,
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:28.644Z"
    },
    {
      "id": "action-19-nest-creature-3-997",
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
      "createdAt": "2026-09-02T15:47:28.644Z"
    },
    {
      "id": "action-20-player-2-998",
      "round": 20,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.644Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 86 (round 20)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-20-player-2-999",
      "round": 20,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.653Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 87 (round 20)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-20-player-2-1000",
      "round": 20,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.663Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 88 (round 20)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-20-player-2-1001",
      "round": 20,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.673Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 89 (round 20)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-20-player-2-1002",
      "round": 20,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.685Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 90 (round 21)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-20-nest-creature-1-1003",
      "round": 20,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:28.685Z"
    },
    {
      "id": "action-20-nest-creature-2-1004",
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
          "row": 12,
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:28.685Z"
    },
    {
      "id": "action-20-nest-creature-3-1005",
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
      "createdAt": "2026-09-02T15:47:28.685Z"
    },
    {
      "id": "action-21-player-2-1006",
      "round": 21,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.686Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 91 (round 21)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-21-player-2-1007",
      "round": 21,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.697Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 92 (round 21)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-21-player-2-1008",
      "round": 21,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.705Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 93 (round 21)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-21-player-2-1009",
      "round": 21,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.714Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 94 (round 21)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-21-player-2-1010",
      "round": 21,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.720Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 95 (round 22)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-21-nest-creature-1-1011",
      "round": 21,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:28.720Z"
    },
    {
      "id": "action-21-nest-creature-2-1012",
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
          "row": 13,
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:28.720Z"
    },
    {
      "id": "action-21-nest-creature-3-1013",
      "round": 21,
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
          "row": 11,
          "column": 1
        },
        "reason": "移動接近 item-point-2。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-2。",
      "createdAt": "2026-09-02T15:47:28.720Z"
    },
    {
      "id": "action-22-player-2-1014",
      "round": 22,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.720Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-3",
      "creatureName": "生物巢穴 1的怪物 Lv.3",
      "message": "生物巢穴 1的怪物 Lv.3 吃掉了道具點。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 96 (round 22)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-22-player-2-1015",
      "round": 22,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.729Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 97 (round 22)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-22-player-2-1016",
      "round": 22,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.737Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 98 (round 22)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-22-player-2-1017",
      "round": 22,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.747Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 99 (round 22)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-22-player-2-1018",
      "round": 22,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.754Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 100 (round 23)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-22-nest-creature-1-1019",
      "round": 22,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:28.755Z"
    },
    {
      "id": "action-22-nest-creature-2-1020",
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
          "row": 12,
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:28.755Z"
    },
    {
      "id": "action-22-nest-creature-3-1021",
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
      "createdAt": "2026-09-02T15:47:28.755Z"
    },
    {
      "id": "action-23-player-2-1022",
      "round": 23,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.755Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 101 (round 23)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-23-player-2-1023",
      "round": 23,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.767Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 102 (round 23)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-23-player-2-1024",
      "round": 23,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.776Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 103 (round 23)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-23-player-2-1025",
      "round": 23,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.785Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 104 (round 23)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-23-player-2-1026",
      "round": 23,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.791Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 105 (round 24)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-23-nest-creature-1-1027",
      "round": 23,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:28.791Z"
    },
    {
      "id": "action-23-nest-creature-2-1028",
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
          "row": 13,
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:28.791Z"
    },
    {
      "id": "action-23-nest-creature-3-1029",
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
      "createdAt": "2026-09-02T15:47:28.792Z"
    },
    {
      "id": "action-24-player-2-1030",
      "round": 24,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.792Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 106 (round 24)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-1031",
      "round": 24,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.800Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 107 (round 24)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-1032",
      "round": 24,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.808Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 108 (round 24)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-1033",
      "round": 24,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.816Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 109 (round 24)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-24-player-2-1034",
      "round": 24,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.822Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 110 (round 25)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-24-nest-creature-1-1035",
      "round": 24,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:28.822Z"
    },
    {
      "id": "action-24-nest-creature-2-1036",
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
          "row": 12,
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:28.822Z"
    },
    {
      "id": "action-24-nest-creature-3-1037",
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
      "createdAt": "2026-09-02T15:47:28.822Z"
    },
    {
      "id": "action-25-player-2-1038",
      "round": 25,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.823Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 111 (round 25)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-25-player-2-1039",
      "round": 25,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.831Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 112 (round 25)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-25-player-2-1040",
      "round": 25,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.839Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 113 (round 25)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-25-player-2-1041",
      "round": 25,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.847Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 114 (round 25)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-25-player-2-1042",
      "round": 25,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.853Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 115 (round 26)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-25-nest-creature-1-1043",
      "round": 25,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:28.853Z"
    },
    {
      "id": "action-25-nest-creature-2-1044",
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
          "row": 13,
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:28.853Z"
    },
    {
      "id": "action-25-nest-creature-3-1045",
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
      "createdAt": "2026-09-02T15:47:28.853Z"
    },
    {
      "id": "action-26-player-2-1046",
      "round": 26,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.853Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 116 (round 26)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-1047",
      "round": 26,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.862Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 117 (round 26)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-1048",
      "round": 26,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.870Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 118 (round 26)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-1049",
      "round": 26,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.881Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 119 (round 26)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/159

```json
{
  "actions": [
    {
      "id": "action-26-player-2-1050",
      "round": 26,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.887Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 120 (round 27)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-26-nest-creature-1-1051",
      "round": 26,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:28.887Z"
    },
    {
      "id": "action-26-nest-creature-2-1052",
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
          "row": 12,
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:28.888Z"
    },
    {
      "id": "action-26-nest-creature-3-1053",
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
      "createdAt": "2026-09-02T15:47:28.888Z"
    },
    {
      "id": "action-27-player-2-1054",
      "round": 27,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.888Z"
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
      "innerSkillId": "yellow-earth-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 12,
        "column": 9
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
      "behaviorType": "wanderer",
      "schoolId": "yellow-earth",
      "homePosition": {
        "row": 13,
        "column": 9
      },
      "homeNestId": "creature-nest-1",
      "spawnedRound": 27,
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

### Turn 121 (round 27)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-27-player-2-1055",
      "round": 27,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.899Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 122 (round 27)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-27-player-2-1056",
      "round": 27,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.906Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 123 (round 27)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-27-player-2-1057",
      "round": 27,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.916Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 124 (round 27)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-27-player-2-1058",
      "round": 27,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.922Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 125 (round 28)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-27-nest-creature-1-1059",
      "round": 27,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:28.923Z"
    },
    {
      "id": "action-27-nest-creature-2-1060",
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
          "row": 13,
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:28.923Z"
    },
    {
      "id": "action-27-nest-creature-3-1061",
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
      "createdAt": "2026-09-02T15:47:28.923Z"
    },
    {
      "id": "action-27-nest-creature-4-1062",
      "round": 27,
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
      "createdAt": "2026-09-02T15:47:28.923Z"
    },
    {
      "id": "action-28-player-2-1063",
      "round": 28,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.923Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 126 (round 28)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-28-player-2-1064",
      "round": 28,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.937Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 127 (round 28)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-28-player-2-1065",
      "round": 28,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.950Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 128 (round 28)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-28-player-2-1066",
      "round": 28,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.964Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 129 (round 28)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-28-player-2-1067",
      "round": 28,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.973Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 130 (round 29)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 20.2, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-28-nest-creature-1-1068",
      "round": 28,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:28.973Z"
    },
    {
      "id": "action-28-nest-creature-2-1069",
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
          "row": 12,
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:28.973Z"
    },
    {
      "id": "action-28-nest-creature-3-1070",
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
      "createdAt": "2026-09-02T15:47:28.973Z"
    },
    {
      "id": "action-28-nest-creature-4-1071",
      "round": 28,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
            "row": 8,
            "column": 8
          }
        },
        "reason": "與 韓信 交戰。"
      },
      "result": "succeeded",
      "reason": "與 韓信 交戰。",
      "createdAt": "2026-09-02T15:47:28.974Z"
    },
    {
      "id": "action-29-player-2-1072",
      "round": 29,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.975Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-4",
      "creatureName": "生物巢穴 1的怪物 Lv.4",
      "message": "生物巢穴 1的怪物 Lv.4 攻擊 韓信，造成 5 點傷害（根骨減傷）。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 131 (round 29)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 20.2, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-29-player-2-1073",
      "round": 29,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:28.988Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 132 (round 29)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 20.2, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-29-player-2-1074",
      "round": 29,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:29.009Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 133 (round 29)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 20.2, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-29-player-2-1075",
      "round": 29,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:29.037Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 134 (round 29)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 20.2, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-29-player-2-1076",
      "round": 29,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:29.055Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 135 (round 30)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 16.4, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-29-nest-creature-1-1077",
      "round": 29,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:29.056Z"
    },
    {
      "id": "action-29-nest-creature-2-1078",
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
          "row": 13,
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:29.056Z"
    },
    {
      "id": "action-29-nest-creature-3-1079",
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
      "createdAt": "2026-09-02T15:47:29.056Z"
    },
    {
      "id": "action-29-nest-creature-4-1080",
      "round": 29,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
            "row": 8,
            "column": 8
          }
        },
        "reason": "與 韓信 交戰。"
      },
      "result": "succeeded",
      "reason": "與 韓信 交戰。",
      "createdAt": "2026-09-02T15:47:29.056Z"
    },
    {
      "id": "action-30-player-2-1081",
      "round": 30,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:29.056Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 136 (round 30)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 16.4, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-30-player-2-1082",
      "round": 30,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:29.072Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 137 (round 30)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 16.4, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-30-player-2-1083",
      "round": 30,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:29.086Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 138 (round 30)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 16.4, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-30-player-2-1084",
      "round": 30,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:29.101Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 139 (round 30)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 16.4, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-30-player-2-1085",
      "round": 30,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:29.112Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 140 (round 31)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 6.599999999999999, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-30-nest-creature-1-1086",
      "round": 30,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:29.112Z"
    },
    {
      "id": "action-30-nest-creature-2-1087",
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
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:29.112Z"
    },
    {
      "id": "action-30-nest-creature-3-1088",
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
      "createdAt": "2026-09-02T15:47:29.112Z"
    },
    {
      "id": "action-30-nest-creature-4-1089",
      "round": 30,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
            "row": 8,
            "column": 8
          }
        },
        "reason": "與 韓信 交戰。"
      },
      "result": "succeeded",
      "reason": "與 韓信 交戰。",
      "createdAt": "2026-09-02T15:47:29.112Z"
    },
    {
      "id": "action-31-player-2-1090",
      "round": 31,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:29.112Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 141 (round 31)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 7), health 6.599999999999999, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-31-player-2-1091",
      "round": 31,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.4（hitsSurvivable=0.5499999999999999）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.4（hitsSurvivable=0.5499999999999999）",
      "createdAt": "2026-09-02T15:47:29.128Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 142 (round 31)
- Player: 韓信 (player-2), level 1, experience 8, at (7, 7), health 6.599999999999999, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-31-player-2-1092",
      "round": 31,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.4（hitsSurvivable=0.5499999999999999）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.4（hitsSurvivable=0.5499999999999999）",
      "createdAt": "2026-09-02T15:47:29.143Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 143 (round 31)
- Player: 韓信 (player-2), level 1, experience 8, at (7, 6), health 6.599999999999999, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-31-player-2-1093",
      "round": 31,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.4（hitsSurvivable=0.5499999999999999）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.4（hitsSurvivable=0.5499999999999999）",
      "createdAt": "2026-09-02T15:47:29.152Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 144 (round 32)
- Player: 韓信 (player-2), level 1, experience 8, at (7, 6), health 7.799999999999999, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-31-nest-creature-1-1094",
      "round": 31,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:29.152Z"
    },
    {
      "id": "action-31-nest-creature-2-1095",
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
          "row": 13,
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:29.152Z"
    },
    {
      "id": "action-31-nest-creature-3-1096",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T15:47:29.152Z"
    },
    {
      "id": "action-31-nest-creature-4-1097",
      "round": 31,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 9
        },
        "reason": "移動接近 韓信。"
      },
      "result": "succeeded",
      "reason": "移動接近 韓信。",
      "createdAt": "2026-09-02T15:47:29.153Z"
    },
    {
      "id": "action-32-player-2-1098",
      "round": 32,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:29.153Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 145 (round 32)
- Player: 韓信 (player-2), level 1, experience 8, at (6, 6), health 7.799999999999999, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-32-player-2-1099",
      "round": 32,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.6499999999999999）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.6499999999999999）",
      "createdAt": "2026-09-02T15:47:29.165Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 146 (round 32)
- Player: 韓信 (player-2), level 1, experience 8, at (5, 6), health 7.799999999999999, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-32-player-2-1100",
      "round": 32,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.6499999999999999）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.6499999999999999）",
      "createdAt": "2026-09-02T15:47:29.180Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 147 (round 32)
- Player: 韓信 (player-2), level 1, experience 8, at (5, 5), health 7.799999999999999, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-32-player-2-1101",
      "round": 32,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.6499999999999999）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.6499999999999999）",
      "createdAt": "2026-09-02T15:47:29.194Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 148 (round 32)
- Player: 韓信 (player-2), level 1, experience 8, at (4, 5), health 7.799999999999999, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/175

```json
{
  "actions": [
    {
      "id": "action-32-player-2-1102",
      "round": 32,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.6499999999999999）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.6499999999999999）",
      "createdAt": "2026-09-02T15:47:29.204Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 149 (round 33)
- Player: 韓信 (player-2), level 1, experience 8, at (4, 5), health 9, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-32-nest-creature-1-1103",
      "round": 32,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:29.204Z"
    },
    {
      "id": "action-32-nest-creature-2-1104",
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
          "row": 12,
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:29.204Z"
    },
    {
      "id": "action-32-nest-creature-3-1105",
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
      "createdAt": "2026-09-02T15:47:29.204Z"
    },
    {
      "id": "action-32-nest-creature-4-1106",
      "round": 32,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
            "row": 7,
            "column": 8
          }
        },
        "reason": "與 長春 交戰。"
      },
      "result": "succeeded",
      "reason": "與 長春 交戰。",
      "createdAt": "2026-09-02T15:47:29.204Z"
    },
    {
      "id": "action-33-player-2-1107",
      "round": 33,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:29.205Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-4",
      "creatureName": "生物巢穴 1的怪物 Lv.4",
      "message": "生物巢穴 1的怪物 Lv.4 攻擊長春，造成 8 點傷害。"
    },
    {
      "creatureId": "creature-nest-1",
      "creatureName": "生物巢穴 1",
      "message": "生物巢穴 1 生成了 Lv.5 怪物。"
    }
  ],
  "spawnedCreatures": [
    {
      "id": "nest-creature-5",
      "name": "生物巢穴 1的怪物 Lv.5",
      "innerSkillId": "yellow-earth-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 12,
        "column": 9
      },
      "attributes": {
        "armStrength": 12,
        "constitution": 17,
        "agility": 10,
        "innerEnergy": 12,
        "insight": 7
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 5,
      "behaviorType": "wanderer",
      "schoolId": "yellow-earth",
      "homePosition": {
        "row": 13,
        "column": 9
      },
      "homeNestId": "creature-nest-1",
      "spawnedRound": 33,
      "baseAttributes": {
        "armStrength": 12.6,
        "constitution": 15.399999999999999,
        "agility": 9.799999999999999,
        "innerEnergy": 12.6,
        "insight": 7
      },
      "health": 51,
      "maxHealth": 51,
      "stamina": 11,
      "maxStamina": 11,
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

### Turn 150 (round 33)
- Player: 韓信 (player-2), level 1, experience 8, at (3, 5), health 9, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-33-player-2-1108",
      "round": 33,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.75）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.75）",
      "createdAt": "2026-09-02T15:47:29.216Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 151 (round 33)
- Player: 韓信 (player-2), level 1, experience 8, at (2, 5), health 9, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-33-player-2-1109",
      "round": 33,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.75）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.75）",
      "createdAt": "2026-09-02T15:47:29.228Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 152 (round 33)
- Player: 韓信 (player-2), level 1, experience 8, at (2, 4), health 9, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-33-player-2-1110",
      "round": 33,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.75）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.75）",
      "createdAt": "2026-09-02T15:47:29.240Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 153 (round 33)
- Player: 韓信 (player-2), level 1, experience 8, at (2, 3), health 9, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-33-player-2-1111",
      "round": 33,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.75）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.75）",
      "createdAt": "2026-09-02T15:47:29.250Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 154 (round 34)
- Player: 韓信 (player-2), level 1, experience 8, at (2, 3), health 10.2, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-33-nest-creature-1-1112",
      "round": 33,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:29.250Z"
    },
    {
      "id": "action-33-nest-creature-2-1113",
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
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:29.250Z"
    },
    {
      "id": "action-33-nest-creature-3-1114",
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
      "createdAt": "2026-09-02T15:47:29.251Z"
    },
    {
      "id": "action-33-nest-creature-4-1115",
      "round": 33,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
            "row": 7,
            "column": 8
          }
        },
        "reason": "與 長春 交戰。"
      },
      "result": "succeeded",
      "reason": "與 長春 交戰。",
      "createdAt": "2026-09-02T15:47:29.251Z"
    },
    {
      "id": "action-33-nest-creature-5-1116",
      "round": 33,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.5"
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
      "createdAt": "2026-09-02T15:47:29.251Z"
    },
    {
      "id": "action-34-player-2-1117",
      "round": 34,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:29.251Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 155 (round 34)
- Player: 韓信 (player-2), level 1, experience 8, at (1, 3), health 10.2, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-34-player-2-1118",
      "round": 34,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.6799999999999999）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.6799999999999999）",
      "createdAt": "2026-09-02T15:47:29.269Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 156 (round 34)
- Player: 韓信 (player-2), level 1, experience 8, at (1, 2), health 10.2, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-34-player-2-1119",
      "round": 34,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.6799999999999999）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.6799999999999999）",
      "createdAt": "2026-09-02T15:47:29.286Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 157 (round 34)
- Player: 韓信 (player-2), level 1, experience 8, at (1, 2), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-34-player-2-1120",
      "round": 34,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:29.294Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 158 (round 35)
- Player: 韓信 (player-2), level 1, experience 10, at (1, 2), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-34-nest-creature-1-1121",
      "round": 34,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:29.301Z"
    },
    {
      "id": "action-34-nest-creature-2-1122",
      "round": 34,
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
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:29.301Z"
    },
    {
      "id": "action-34-nest-creature-3-1123",
      "round": 34,
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
            "row": 7,
            "column": 8
          }
        },
        "reason": "與 長春 交戰。"
      },
      "result": "succeeded",
      "reason": "與 長春 交戰。",
      "createdAt": "2026-09-02T15:47:29.301Z"
    },
    {
      "id": "action-34-nest-creature-4-1124",
      "round": 34,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
            "row": 7,
            "column": 8
          }
        },
        "reason": "與 長春 交戰。"
      },
      "result": "succeeded",
      "reason": "與 長春 交戰。",
      "createdAt": "2026-09-02T15:47:29.301Z"
    },
    {
      "id": "action-34-nest-creature-5-1125",
      "round": 34,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.5"
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
      "createdAt": "2026-09-02T15:47:29.301Z"
    },
    {
      "id": "action-35-player-2-1126",
      "round": 35,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:29.301Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-4",
      "creatureName": "生物巢穴 1的怪物 Lv.4",
      "message": "生物巢穴 1的怪物 Lv.4 攻擊長春，造成 8 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 159 (round 35)
- Player: 韓信 (player-2), level 1, experience 10, at (2, 2), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-35-player-2-1127",
      "round": 35,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:29.326Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 160 (round 35)
- Player: 韓信 (player-2), level 1, experience 10, at (3, 2), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-35-player-2-1128",
      "round": 35,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:29.350Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 161 (round 36)
- Player: 韓信 (player-2), level 1, experience 10, at (3, 2), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-35-nest-creature-1-1129",
      "round": 35,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:29.350Z"
    },
    {
      "id": "action-35-nest-creature-2-1130",
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
          "row": 13,
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:29.350Z"
    },
    {
      "id": "action-35-nest-creature-3-1131",
      "round": 35,
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
            "row": 7,
            "column": 8
          }
        },
        "reason": "與 長春 交戰。"
      },
      "result": "succeeded",
      "reason": "與 長春 交戰。",
      "createdAt": "2026-09-02T15:47:29.350Z"
    },
    {
      "id": "action-35-nest-creature-4-1132",
      "round": 35,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
            "row": 7,
            "column": 8
          }
        },
        "reason": "與 長春 交戰。"
      },
      "result": "succeeded",
      "reason": "與 長春 交戰。",
      "createdAt": "2026-09-02T15:47:29.350Z"
    },
    {
      "id": "action-35-nest-creature-5-1133",
      "round": 35,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.5"
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
      "createdAt": "2026-09-02T15:47:29.350Z"
    },
    {
      "id": "action-36-player-2-1134",
      "round": 36,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:29.350Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 162 (round 36)
- Player: 韓信 (player-2), level 1, experience 10, at (3, 3), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-36-player-2-1135",
      "round": 36,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:29.369Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 163 (round 36)
- Player: 韓信 (player-2), level 1, experience 10, at (3, 4), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-36-player-2-1136",
      "round": 36,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-02T15:47:29.383Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 164 (round 36)
- Player: 韓信 (player-2), level 1, experience 10, at (3, 5), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-36-player-2-1137",
      "round": 36,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-02T15:47:29.392Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 165 (round 37)
- Player: 韓信 (player-2), level 1, experience 10, at (3, 5), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-36-nest-creature-1-1138",
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:29.393Z"
    },
    {
      "id": "action-36-nest-creature-2-1139",
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
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:29.393Z"
    },
    {
      "id": "action-36-nest-creature-3-1140",
      "round": 36,
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
            "row": 7,
            "column": 8
          }
        },
        "reason": "與 長春 交戰。"
      },
      "result": "succeeded",
      "reason": "與 長春 交戰。",
      "createdAt": "2026-09-02T15:47:29.393Z"
    },
    {
      "id": "action-36-nest-creature-4-1141",
      "round": 36,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
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
            "row": 7,
            "column": 8
          }
        },
        "reason": "與 長春 交戰。"
      },
      "result": "succeeded",
      "reason": "與 長春 交戰。",
      "createdAt": "2026-09-02T15:47:29.393Z"
    },
    {
      "id": "action-36-nest-creature-5-1142",
      "round": 36,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.5"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-5",
          "kind": "creature"
        },
        "target": {
          "id": "base-1",
          "kind": "base",
          "position": {
            "row": 7,
            "column": 8
          }
        },
        "reason": "與 長春 交戰。"
      },
      "result": "succeeded",
      "reason": "與 長春 交戰。",
      "createdAt": "2026-09-02T15:47:29.393Z"
    },
    {
      "id": "action-37-player-2-1143",
      "round": 37,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:29.393Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-5",
      "creatureName": "生物巢穴 1的怪物 Lv.5",
      "message": "生物巢穴 1的怪物 Lv.5 攻擊長春，造成 10 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 166 (round 37)
- Player: 韓信 (player-2), level 1, experience 10, at (4, 5), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-37-player-2-1144",
      "round": 37,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-02T15:47:29.407Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 167 (round 37)
- Player: 韓信 (player-2), level 1, experience 10, at (5, 5), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-37-player-2-1145",
      "round": 37,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-02T15:47:29.421Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 168 (round 37)
- Player: 韓信 (player-2), level 1, experience 10, at (5, 6), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-37-player-2-1146",
      "round": 37,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-02T15:47:29.434Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 169 (round 37)
- Player: 韓信 (player-2), level 1, experience 10, at (6, 6), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-37-player-2-1147",
      "round": 37,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-02T15:47:29.443Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 170 (round 38)
- Player: 韓信 (player-2), level 1, experience 10, at (6, 6), health 16.2, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-37-nest-creature-1-1148",
      "round": 37,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:29.444Z"
    },
    {
      "id": "action-37-nest-creature-2-1149",
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
          "row": 13,
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:29.444Z"
    },
    {
      "id": "action-37-nest-creature-3-1150",
      "round": 37,
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
            "column": 6
          }
        },
        "reason": "與 韓信 交戰。"
      },
      "result": "succeeded",
      "reason": "與 韓信 交戰。",
      "createdAt": "2026-09-02T15:47:29.444Z"
    },
    {
      "id": "action-37-nest-creature-4-1151",
      "round": 37,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 8
        },
        "reason": "移動接近 韓信。"
      },
      "result": "succeeded",
      "reason": "移動接近 韓信。",
      "createdAt": "2026-09-02T15:47:29.444Z"
    },
    {
      "id": "action-37-nest-creature-5-1152",
      "round": 37,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.5"
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
      "createdAt": "2026-09-02T15:47:29.444Z"
    },
    {
      "id": "action-38-player-2-1153",
      "round": 38,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-02T15:47:29.444Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 171 (round 38)
- Player: 韓信 (player-2), level 1, experience 10, at (6, 5), health 16.2, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-38-player-2-1154",
      "round": 38,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-02T15:47:29.455Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 172 (round 38)
- Player: 韓信 (player-2), level 1, experience 10, at (6, 6), health 16.2, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-38-player-2-1155",
      "round": 38,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-02T15:47:29.466Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 173 (round 39)
- Player: 韓信 (player-2), level 1, experience 12, at (6, 6), health 0, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/193

```json
{
  "actions": [
    {
      "id": "action-38-nest-creature-1-1156",
      "round": 38,
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
          "id": "ai-support-base",
          "kind": "base",
          "position": {
            "row": 13,
            "column": 13
          }
        },
        "reason": "與 AI 補給據點 交戰。"
      },
      "result": "succeeded",
      "reason": "與 AI 補給據點 交戰。",
      "createdAt": "2026-09-02T15:47:29.470Z"
    },
    {
      "id": "action-38-nest-creature-2-1157",
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
          "column": 11
        },
        "reason": "移動接近 AI 補給據點。"
      },
      "result": "succeeded",
      "reason": "移動接近 AI 補給據點。",
      "createdAt": "2026-09-02T15:47:29.470Z"
    },
    {
      "id": "action-38-nest-creature-3-1158",
      "round": 38,
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
            "column": 6
          }
        },
        "reason": "與 韓信 交戰。"
      },
      "result": "succeeded",
      "reason": "與 韓信 交戰。",
      "createdAt": "2026-09-02T15:47:29.470Z"
    },
    {
      "id": "action-38-nest-creature-4-1159",
      "round": 38,
      "actor": {
        "id": "nest-creature-4",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.4"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-4",
          "kind": "creature"
        },
        "destination": {
          "row": 6,
          "column": 8
        },
        "reason": "移動接近 韓信。"
      },
      "result": "succeeded",
      "reason": "移動接近 韓信。",
      "createdAt": "2026-09-02T15:47:29.470Z"
    },
    {
      "id": "action-38-nest-creature-5-1160",
      "round": 38,
      "actor": {
        "id": "nest-creature-5",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.5"
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
            "row": 6,
            "column": 6
          }
        },
        "reason": "與 韓信 交戰。"
      },
      "result": "succeeded",
      "reason": "與 韓信 交戰。",
      "createdAt": "2026-09-02T15:47:29.470Z"
    },
    {
      "id": "action-39-player-2-1161",
      "round": 39,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
      },
      "action": {
        "type": "end-turn",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "reason": "模糊策略：selfPreservation 分數 0.92，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.92:hold, positioning=0.33:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.92，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.92:hold, positioning=0.33:hold",
      "createdAt": "2026-09-02T15:47:29.470Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-5",
      "creatureName": "生物巢穴 1的怪物 Lv.5",
      "message": "生物巢穴 1的怪物 Lv.5 攻擊 韓信，造成 13 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

