# AI Beginner Sandbox Simple Trace

- AI turns: 197
- Final round: 46
- Game won: false
- Game over: true
- Remaining nests: 1

## Aggregate

- Action counts: move=149, end-turn=45, attack=44, hold=44, learn-skill=2, allocate-attribute=2, use-item=2, equip-inner-skill=1, use-facility=1
- Creatures spawned (total): 5
- Creatures defeated (total): 0
- Level-ups observed: 1
- Final player: level 2, experience 23, inner skill 銳鋒淬芒 (sharp-edge-inner) lv.1 damage 9
- Final attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Nest health (start → end): creature-nest-1=120→110

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
      "id": "action-1-player-2-101",
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:52.683Z"
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
      "id": "action-1-player-2-102",
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:52.713Z"
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
      "id": "action-1-player-2-103",
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
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:52.738Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 4 (round 1)
- Player: 韓信 (player-2), level 1, experience 0, at (12, 9), health 24, stamina 0
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
      "id": "action-1-player-2-104",
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
          "column": 9
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:52.755Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 5 (round 2)
- Player: 韓信 (player-2), level 1, experience 0, at (12, 9), health 24, stamina 8
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
      "id": "action-2-player-2-105",
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
      "createdAt": "2026-09-01T17:40:52.756Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 6 (round 2)
- Player: 韓信 (player-2), level 1, experience 0, at (12, 9), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-2-player-2-106",
      "round": 2,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "creature-nest-1",
          "kind": "nest",
          "position": {
            "row": 13,
            "column": 9
          }
        },
        "reason": "打巢穴：攻擊 生物巢穴 1"
      },
      "result": "succeeded",
      "reason": "打巢穴：攻擊 生物巢穴 1",
      "createdAt": "2026-09-01T17:40:52.767Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 7 (round 2)
- Player: 韓信 (player-2), level 1, experience 0, at (11, 9), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-2-player-2-107",
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
          "column": 9
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:52.781Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 8 (round 3)
- Player: 韓信 (player-2), level 1, experience 2, at (11, 9), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-3-player-2-108",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:52.787Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 9 (round 3)
- Player: 韓信 (player-2), level 1, experience 2, at (10, 9), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-3-player-2-109",
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
          "column": 9
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:52.804Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 10 (round 3)
- Player: 韓信 (player-2), level 1, experience 2, at (10, 10), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-3-player-2-110",
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
          "column": 10
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:52.819Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 11 (round 3)
- Player: 韓信 (player-2), level 1, experience 2, at (11, 10), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-3-player-2-111",
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
          "column": 10
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:52.838Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 12 (round 3)
- Player: 韓信 (player-2), level 1, experience 2, at (11, 9), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-3-player-2-112",
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
          "column": 9
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:52.854Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 13 (round 4)
- Player: 韓信 (player-2), level 1, experience 2, at (11, 9), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-4-player-2-113",
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
      "createdAt": "2026-09-01T17:40:52.855Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 14 (round 4)
- Player: 韓信 (player-2), level 1, experience 2, at (11, 8), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-4-player-2-114",
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
          "column": 8
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:52.868Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 15 (round 4)
- Player: 韓信 (player-2), level 1, experience 2, at (12, 8), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-4-player-2-115",
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
          "column": 8
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:52.885Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 16 (round 4)
- Player: 韓信 (player-2), level 1, experience 2, at (12, 7), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-4-player-2-116",
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
          "column": 7
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:52.900Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 17 (round 4)
- Player: 韓信 (player-2), level 1, experience 2, at (13, 7), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-4-player-2-117",
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
          "row": 13,
          "column": 7
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:52.909Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 18 (round 5)
- Player: 韓信 (player-2), level 1, experience 2, at (13, 7), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-5-player-2-118",
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
      "createdAt": "2026-09-01T17:40:52.910Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 19 (round 5)
- Player: 韓信 (player-2), level 1, experience 2, at (13, 6), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-5-player-2-119",
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
          "row": 13,
          "column": 6
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:52.923Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 20 (round 5)
- Player: 韓信 (player-2), level 1, experience 2, at (12, 6), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-5-player-2-120",
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
          "row": 12,
          "column": 6
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:52.937Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 21 (round 5)
- Player: 韓信 (player-2), level 1, experience 2, at (12, 5), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-5-player-2-121",
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
          "row": 12,
          "column": 5
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:52.952Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 22 (round 5)
- Player: 韓信 (player-2), level 1, experience 2, at (12, 6), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-5-player-2-122",
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
          "row": 12,
          "column": 6
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:52.961Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 23 (round 6)
- Player: 韓信 (player-2), level 1, experience 2, at (12, 6), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-6-player-2-123",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T17:40:52.961Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 24 (round 6)
- Player: 韓信 (player-2), level 1, experience 2, at (11, 6), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-6-player-2-124",
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
          "row": 11,
          "column": 6
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:52.976Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 25 (round 6)
- Player: 韓信 (player-2), level 1, experience 2, at (11, 7), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-6-player-2-125",
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
          "row": 11,
          "column": 7
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:52.988Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 26 (round 7)
- Player: 韓信 (player-2), level 1, experience 4, at (11, 7), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-7-player-2-126",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:52.993Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 27 (round 7)
- Player: 韓信 (player-2), level 1, experience 4, at (11, 8), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-7-player-2-127",
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
          "row": 11,
          "column": 8
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:53.007Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 28 (round 7)
- Player: 韓信 (player-2), level 1, experience 4, at (11, 9), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-7-player-2-128",
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
          "row": 11,
          "column": 9
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:53.037Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 29 (round 7)
- Player: 韓信 (player-2), level 1, experience 4, at (12, 9), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-7-player-2-129",
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
          "row": 12,
          "column": 9
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:53.052Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 30 (round 7)
- Player: 韓信 (player-2), level 1, experience 4, at (12, 10), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-7-player-2-130",
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
          "row": 12,
          "column": 10
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:53.064Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 31 (round 8)
- Player: 韓信 (player-2), level 1, experience 4, at (12, 10), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-8-player-2-131",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-01T17:40:53.064Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 32 (round 8)
- Player: 韓信 (player-2), level 1, experience 4, at (12, 11), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-8-player-2-132",
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
          "row": 12,
          "column": 11
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:53.083Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 33 (round 8)
- Player: 韓信 (player-2), level 1, experience 4, at (12, 12), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-8-player-2-133",
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
          "row": 12,
          "column": 12
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:53.111Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 34 (round 8)
- Player: 韓信 (player-2), level 1, experience 4, at (13, 12), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-8-player-2-134",
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
          "row": 13,
          "column": 12
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:53.128Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 35 (round 8)
- Player: 韓信 (player-2), level 1, experience 4, at (13, 11), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-8-player-2-135",
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
          "row": 13,
          "column": 11
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:53.141Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 36 (round 9)
- Player: 韓信 (player-2), level 1, experience 4, at (13, 11), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-9-player-2-136",
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
      "createdAt": "2026-09-01T17:40:53.142Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 37 (round 9)
- Player: 韓信 (player-2), level 1, experience 4, at (13, 10), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=115/120

```json
{
  "actions": [
    {
      "id": "action-9-player-2-137",
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
          "row": 13,
          "column": 10
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:53.167Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 38 (round 9)
- Player: 韓信 (player-2), level 1, experience 4, at (13, 10), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/120

```json
{
  "actions": [
    {
      "id": "action-9-player-2-138",
      "round": 9,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "creature-nest-1",
          "kind": "nest",
          "position": {
            "row": 13,
            "column": 9
          }
        },
        "reason": "打巢穴：攻擊 生物巢穴 1"
      },
      "result": "succeeded",
      "reason": "打巢穴：攻擊 生物巢穴 1",
      "createdAt": "2026-09-01T17:40:53.183Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 39 (round 10)
- Player: 韓信 (player-2), level 1, experience 6, at (13, 10), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-10-player-2-139",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:53.191Z"
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
      "spawnedRound": 10,
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

### Turn 40 (round 10)
- Player: 韓信 (player-2), level 1, experience 6, at (12, 10), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-10-player-2-140",
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
          "row": 12,
          "column": 10
        },
        "reason": "打巢穴：先接近巢穴附近生物 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "打巢穴：先接近巢穴附近生物 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-01T17:40:53.219Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 41 (round 10)
- Player: 韓信 (player-2), level 1, experience 9, at (12, 10), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-10-player-2-141",
      "round": 10,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
            "row": 12,
            "column": 9
          }
        },
        "reason": "打巢穴：先清除巢穴附近生物 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "打巢穴：先清除巢穴附近生物 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-01T17:40:53.235Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 42 (round 11)
- Player: 韓信 (player-2), level 1, experience 11, at (12, 10), health 19.2, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-10-nest-creature-1-142",
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
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 12,
            "column": 10
          }
        },
        "reason": "與 韓信 交戰。"
      },
      "result": "succeeded",
      "reason": "與 韓信 交戰。",
      "createdAt": "2026-09-01T17:40:53.244Z"
    },
    {
      "id": "action-11-player-2-143",
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
      "createdAt": "2026-09-01T17:40:53.244Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 43 (round 11)
- Player: 韓信 (player-2), level 1, experience 11, at (11, 10), health 19.2, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-11-player-2-144",
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
          "row": 11,
          "column": 10
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:53.265Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 44 (round 11)
- Player: 韓信 (player-2), level 1, experience 11, at (11, 11), health 19.2, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-11-player-2-145",
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
          "row": 11,
          "column": 11
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:53.288Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 45 (round 12)
- Player: 韓信 (player-2), level 1, experience 13, at (11, 11), health 20.4, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-11-nest-creature-1-146",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T17:40:53.299Z"
    },
    {
      "id": "action-12-player-2-147",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:53.299Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 46 (round 12)
- Player: 韓信 (player-2), level 1, experience 13, at (11, 12), health 20.4, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-12-player-2-148",
      "round": 12,
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
      "createdAt": "2026-09-01T17:40:53.320Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 47 (round 12)
- Player: 韓信 (player-2), level 1, experience 13, at (11, 13), health 20.4, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-12-player-2-149",
      "round": 12,
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
      "createdAt": "2026-09-01T17:40:53.338Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 48 (round 12)
- Player: 韓信 (player-2), level 1, experience 13, at (12, 13), health 20.4, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-12-player-2-150",
      "round": 12,
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
      "createdAt": "2026-09-01T17:40:53.357Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 49 (round 13)
- Player: 韓信 (player-2), level 1, experience 13, at (12, 13), health 21.599999999999998, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-12-nest-creature-1-151",
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
          "row": 12,
          "column": 11
        },
        "reason": "移動接近 韓信。"
      },
      "result": "succeeded",
      "reason": "移動接近 韓信。",
      "createdAt": "2026-09-01T17:40:53.357Z"
    },
    {
      "id": "action-13-player-2-152",
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
      "createdAt": "2026-09-01T17:40:53.357Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 50 (round 13)
- Player: 韓信 (player-2), level 1, experience 13, at (12, 12), health 21.599999999999998, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-13-player-2-153",
      "round": 13,
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
      "createdAt": "2026-09-01T17:40:53.377Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 51 (round 13)
- Player: 韓信 (player-2), level 1, experience 13, at (13, 12), health 21.599999999999998, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-13-player-2-154",
      "round": 13,
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
          "column": 12
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:53.394Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 52 (round 13)
- Player: 韓信 (player-2), level 1, experience 13, at (13, 11), health 21.599999999999998, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-13-player-2-155",
      "round": 13,
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
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:53.417Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 53 (round 13)
- Player: 韓信 (player-2), level 1, experience 13, at (13, 10), health 21.599999999999998, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-13-player-2-156",
      "round": 13,
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:53.439Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 54 (round 14)
- Player: 韓信 (player-2), level 1, experience 13, at (13, 10), health 22.799999999999997, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-13-nest-creature-1-157",
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
      "createdAt": "2026-09-01T17:40:53.439Z"
    },
    {
      "id": "action-14-player-2-158",
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
      "createdAt": "2026-09-01T17:40:53.439Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 55 (round 14)
- Player: 韓信 (player-2), level 1, experience 13, at (12, 10), health 22.799999999999997, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-14-player-2-159",
      "round": 14,
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
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:53.460Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 56 (round 14)
- Player: 韓信 (player-2), level 1, experience 13, at (12, 11), health 22.799999999999997, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-14-player-2-160",
      "round": 14,
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
      "createdAt": "2026-09-01T17:40:53.485Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 57 (round 14)
- Player: 韓信 (player-2), level 1, experience 13, at (12, 12), health 22.799999999999997, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-14-player-2-161",
      "round": 14,
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
      "createdAt": "2026-09-01T17:40:53.507Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 58 (round 14)
- Player: 韓信 (player-2), level 1, experience 13, at (11, 12), health 22.799999999999997, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-14-player-2-162",
      "round": 14,
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
        "reason": "打巢穴：先接近巢穴附近生物 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "打巢穴：先接近巢穴附近生物 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-01T17:40:53.526Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 59 (round 15)
- Player: 韓信 (player-2), level 1, experience 13, at (11, 12), health 23.999999999999996, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-14-nest-creature-1-163",
      "round": 14,
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
      "createdAt": "2026-09-01T17:40:53.527Z"
    },
    {
      "id": "action-15-player-2-164",
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
      "createdAt": "2026-09-01T17:40:53.527Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 60 (round 15)
- Player: 韓信 (player-2), level 1, experience 13, at (10, 12), health 23.999999999999996, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-15-player-2-165",
      "round": 15,
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:53.543Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 61 (round 15)
- Player: 韓信 (player-2), level 1, experience 13, at (10, 11), health 23.999999999999996, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-15-player-2-166",
      "round": 15,
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
          "column": 11
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:53.560Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 62 (round 16)
- Player: 韓信 (player-2), level 1, experience 15, at (10, 11), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-15-nest-creature-1-167",
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
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 10,
            "column": 11
          }
        },
        "reason": "與 韓信 交戰。"
      },
      "result": "succeeded",
      "reason": "與 韓信 交戰。",
      "createdAt": "2026-09-01T17:40:53.569Z"
    },
    {
      "id": "action-16-player-2-168",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:53.570Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-1",
      "creatureName": "生物巢穴 1的怪物 Lv.1",
      "message": "生物巢穴 1的怪物 Lv.1 攻擊 韓信，被閃避。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 63 (round 16)
- Player: 韓信 (player-2), level 1, experience 15, at (10, 10), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-16-player-2-169",
      "round": 16,
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
          "column": 10
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:53.590Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 64 (round 16)
- Player: 韓信 (player-2), level 1, experience 15, at (10, 9), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-16-player-2-170",
      "round": 16,
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
          "column": 9
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:53.612Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 65 (round 16)
- Player: 韓信 (player-2), level 1, experience 15, at (11, 9), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-16-player-2-171",
      "round": 16,
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
          "column": 9
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:53.628Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 66 (round 16)
- Player: 韓信 (player-2), level 1, experience 15, at (12, 9), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-16-player-2-172",
      "round": 16,
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
          "column": 9
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:53.642Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 67 (round 17)
- Player: 韓信 (player-2), level 1, experience 15, at (12, 9), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-16-nest-creature-1-173",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T17:40:53.642Z"
    },
    {
      "id": "action-17-player-2-174",
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
      "createdAt": "2026-09-01T17:40:53.642Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 68 (round 17)
- Player: 韓信 (player-2), level 1, experience 18, at (12, 9), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-17-player-2-175",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
            "row": 12,
            "column": 10
          }
        },
        "reason": "打巢穴：先清除巢穴附近生物 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "打巢穴：先清除巢穴附近生物 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-01T17:40:53.658Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 69 (round 17)
- Player: 韓信 (player-2), level 1, experience 18, at (12, 8), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-17-player-2-176",
      "round": 17,
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
          "column": 8
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:53.674Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 70 (round 18)
- Player: 韓信 (player-2), level 1, experience 20, at (12, 8), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-17-nest-creature-1-177",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T17:40:53.683Z"
    },
    {
      "id": "action-18-player-2-178",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:53.684Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 71 (round 18)
- Player: 韓信 (player-2), level 1, experience 20, at (12, 8), health 24, stamina 5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-18-player-2-179",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
      },
      "action": {
        "type": "learn-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillType": "inner",
        "skillId": "sharp-edge-inner",
        "reason": "學招：學習門派功法 銳鋒淬芒"
      },
      "result": "succeeded",
      "reason": "學招：學習門派功法 銳鋒淬芒",
      "createdAt": "2026-09-01T17:40:53.700Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 72 (round 18)
- Player: 韓信 (player-2), level 1, experience 20, at (12, 8), health 24, stamina 5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-18-player-2-180",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-01T17:40:53.717Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 73 (round 18)
- Player: 韓信 (player-2), level 1, experience 20, at (12, 8), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-18-player-2-181",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
      },
      "action": {
        "type": "learn-skill",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "gateId": "sect-gate-1",
        "skillType": "external",
        "skillId": "sharp-edge-external-damage",
        "reason": "學招：學習門派功法 銳鋒斬"
      },
      "result": "succeeded",
      "reason": "學招：學習門派功法 銳鋒斬",
      "createdAt": "2026-09-01T17:40:53.735Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 74 (round 18)
- Player: 韓信 (player-2), level 1, experience 20, at (11, 8), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/132

```json
{
  "actions": [
    {
      "id": "action-18-player-2-182",
      "round": 18,
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
          "column": 8
        },
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-01T17:40:53.748Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 75 (round 19)
- Player: 韓信 (player-2), level 1, experience 20, at (11, 8), health 24, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-18-nest-creature-1-183",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T17:40:53.748Z"
    },
    {
      "id": "action-19-player-2-184",
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
      "createdAt": "2026-09-01T17:40:53.748Z"
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
        "row": 13,
        "column": 10
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
      "spawnedRound": 19,
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

### Turn 76 (round 19)
- Player: 韓信 (player-2), level 1, experience 20, at (11, 7), health 24, stamina 7.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-19-player-2-185",
      "round": 19,
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
          "column": 7
        },
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-01T17:40:53.767Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 77 (round 19)
- Player: 韓信 (player-2), level 1, experience 20, at (10, 7), health 24, stamina 5.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-19-player-2-186",
      "round": 19,
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
          "column": 7
        },
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-01T17:40:53.786Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 78 (round 19)
- Player: 韓信 (player-2), level 1, experience 20, at (9, 7), health 24, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-19-player-2-187",
      "round": 19,
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
          "column": 7
        },
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-01T17:40:53.805Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 79 (round 19)
- Player: 韓信 (player-2), level 1, experience 20, at (8, 7), health 24, stamina 1.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-19-player-2-188",
      "round": 19,
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
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-01T17:40:53.824Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 80 (round 20)
- Player: 韓信 (player-2), level 1, experience 23, at (8, 7), health 24, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-19-nest-creature-1-189",
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
      "createdAt": "2026-09-01T17:40:53.829Z"
    },
    {
      "id": "action-19-nest-creature-2-190",
      "round": 19,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-2",
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
      "createdAt": "2026-09-01T17:40:53.830Z"
    },
    {
      "id": "action-20-player-2-191",
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
        "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:53.830Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 81 (round 20)
- Player: 韓信 (player-2), level 1, experience 23, at (8, 8), health 24, stamina 7.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-20-player-2-192",
      "round": 20,
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:53.848Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 82 (round 20)
- Player: 韓信 (player-2), level 1, experience 23, at (9, 8), health 24, stamina 2.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-20-player-2-193",
      "round": 20,
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
          "column": 8
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:53.862Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 83 (round 20)
- Player: 韓信 (player-2), level 1, experience 23, at (9, 7), health 24, stamina 0.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-20-player-2-194",
      "round": 20,
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
          "column": 7
        },
        "reason": "打巢穴：先接近巢穴附近生物 生物巢穴 1的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "打巢穴：先接近巢穴附近生物 生物巢穴 1的怪物 Lv.1",
      "createdAt": "2026-09-01T17:40:53.875Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 84 (round 21)
- Player: 韓信 (player-2), level 1, experience 24, at (9, 7), health 24, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-20-nest-creature-1-195",
      "round": 20,
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
          "row": 9,
          "column": 9
        },
        "reason": "移動接近 韓信。"
      },
      "result": "succeeded",
      "reason": "移動接近 韓信。",
      "createdAt": "2026-09-01T17:40:53.880Z"
    },
    {
      "id": "action-20-nest-creature-2-196",
      "round": 20,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-2",
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
      "createdAt": "2026-09-01T17:40:53.880Z"
    },
    {
      "id": "action-21-player-2-197",
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
        "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:53.881Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 85 (round 21)
- Player: 韓信 (player-2), level 1, experience 24, at (9, 6), health 24, stamina 4.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-21-player-2-198",
      "round": 21,
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
          "column": 6
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:53.901Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 86 (round 21)
- Player: 韓信 (player-2), level 1, experience 24, at (10, 6), health 24, stamina 2.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-21-player-2-199",
      "round": 21,
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
          "column": 6
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:53.915Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 87 (round 21)
- Player: 韓信 (player-2), level 1, experience 24, at (10, 5), health 24, stamina 0.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-21-player-2-200",
      "round": 21,
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
          "column": 5
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:53.924Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 88 (round 22)
- Player: 韓信 (player-2), level 1, experience 25, at (10, 5), health 24, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-21-nest-creature-1-201",
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
      "createdAt": "2026-09-01T17:40:53.927Z"
    },
    {
      "id": "action-21-nest-creature-2-202",
      "round": 21,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-2",
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
      "createdAt": "2026-09-01T17:40:53.927Z"
    },
    {
      "id": "action-22-player-2-203",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:53.928Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-2",
      "creatureName": "生物巢穴 1的怪物 Lv.2",
      "message": "生物巢穴 1的怪物 Lv.2 攻擊AI 補給據點，造成 4 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 89 (round 22)
- Player: 韓信 (player-2), level 1, experience 25, at (11, 5), health 24, stamina 4.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-22-player-2-204",
      "round": 22,
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
          "column": 5
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:53.942Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 90 (round 22)
- Player: 韓信 (player-2), level 1, experience 25, at (12, 5), health 24, stamina 2.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-22-player-2-205",
      "round": 22,
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
          "column": 5
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:53.954Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 91 (round 22)
- Player: 韓信 (player-2), level 1, experience 25, at (12, 6), health 24, stamina 0.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-22-player-2-206",
      "round": 22,
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
          "column": 6
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:53.964Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 92 (round 23)
- Player: 韓信 (player-2), level 1, experience 26, at (12, 6), health 24, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-22-nest-creature-1-207",
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
      "createdAt": "2026-09-01T17:40:53.969Z"
    },
    {
      "id": "action-22-nest-creature-2-208",
      "round": 22,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-2",
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
      "createdAt": "2026-09-01T17:40:53.969Z"
    },
    {
      "id": "action-23-player-2-209",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:53.969Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 93 (round 23)
- Player: 韓信 (player-2), level 1, experience 26, at (12, 7), health 24, stamina 7.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-23-player-2-210",
      "round": 23,
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
          "column": 7
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:53.988Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 94 (round 23)
- Player: 韓信 (player-2), level 1, experience 26, at (12, 8), health 24, stamina 5.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-23-player-2-211",
      "round": 23,
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
          "column": 8
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:54.004Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 95 (round 23)
- Player: 韓信 (player-2), level 1, experience 26, at (12, 9), health 24, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-23-player-2-212",
      "round": 23,
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
          "column": 9
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:54.019Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 96 (round 23)
- Player: 韓信 (player-2), level 1, experience 26, at (12, 10), health 24, stamina 1.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-23-player-2-213",
      "round": 23,
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
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:54.035Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 97 (round 24)
- Player: 韓信 (player-2), level 1, experience 29, at (12, 10), health 24, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-23-nest-creature-1-214",
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
      "createdAt": "2026-09-01T17:40:54.044Z"
    },
    {
      "id": "action-23-nest-creature-2-215",
      "round": 23,
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
      "createdAt": "2026-09-01T17:40:54.044Z"
    },
    {
      "id": "action-24-player-2-216",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:54.044Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 98 (round 24)
- Player: 韓信 (player-2), level 1, experience 29, at (13, 10), health 24, stamina 7.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-24-player-2-217",
      "round": 24,
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
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:54.067Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 99 (round 24)
- Player: 韓信 (player-2), level 1, experience 29, at (13, 11), health 24, stamina 5.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-24-player-2-218",
      "round": 24,
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
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:54.093Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 100 (round 24)
- Player: 韓信 (player-2), level 1, experience 29, at (13, 12), health 24, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-24-player-2-219",
      "round": 24,
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
          "column": 12
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:54.118Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 101 (round 24)
- Player: 韓信 (player-2), level 1, experience 29, at (12, 12), health 24, stamina 1.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-24-player-2-220",
      "round": 24,
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
      "createdAt": "2026-09-01T17:40:54.141Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 102 (round 25)
- Player: 韓信 (player-2), level 1, experience 32, at (12, 12), health 18.2, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-24-nest-creature-1-221",
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
      "createdAt": "2026-09-01T17:40:54.147Z"
    },
    {
      "id": "action-24-nest-creature-2-222",
      "round": 24,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
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
            "row": 12,
            "column": 12
          }
        },
        "reason": "與 韓信 交戰。"
      },
      "result": "succeeded",
      "reason": "與 韓信 交戰。",
      "createdAt": "2026-09-01T17:40:54.147Z"
    },
    {
      "id": "action-25-player-2-223",
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
        "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:54.148Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-2",
      "creatureName": "生物巢穴 1的怪物 Lv.2",
      "message": "生物巢穴 1的怪物 Lv.2 攻擊 韓信，造成 7 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 103 (round 25)
- Player: 韓信 (player-2), level 1, experience 32, at (12, 13), health 18.2, stamina 5.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-25-player-2-224",
      "round": 25,
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
      "createdAt": "2026-09-01T17:40:54.167Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 104 (round 25)
- Player: 韓信 (player-2), level 1, experience 32, at (11, 13), health 18.2, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-25-player-2-225",
      "round": 25,
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
      "createdAt": "2026-09-01T17:40:54.188Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 105 (round 25)
- Player: 韓信 (player-2), level 1, experience 32, at (10, 13), health 18.2, stamina 1.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-25-player-2-226",
      "round": 25,
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
      "createdAt": "2026-09-01T17:40:54.208Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 106 (round 26)
- Player: 韓信 (player-2), level 1, experience 35, at (10, 13), health 19.4, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-25-nest-creature-1-227",
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
      "createdAt": "2026-09-01T17:40:54.214Z"
    },
    {
      "id": "action-25-nest-creature-2-228",
      "round": 25,
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
      "createdAt": "2026-09-01T17:40:54.214Z"
    },
    {
      "id": "action-26-player-2-229",
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
        "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:54.214Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 107 (round 26)
- Player: 韓信 (player-2), level 1, experience 35, at (9, 13), health 19.4, stamina 4.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-26-player-2-230",
      "round": 26,
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
      "createdAt": "2026-09-01T17:40:54.234Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 108 (round 26)
- Player: 韓信 (player-2), level 1, experience 35, at (8, 13), health 19.4, stamina 2.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-26-player-2-231",
      "round": 26,
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
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:54.251Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 109 (round 26)
- Player: 韓信 (player-2), level 1, experience 35, at (7, 13), health 19.4, stamina 0.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-26-player-2-232",
      "round": 26,
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
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:54.265Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 110 (round 27)
- Player: 韓信 (player-2), level 1, experience 36, at (7, 13), health 20.599999999999998, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-26-nest-creature-1-233",
      "round": 26,
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
          "row": 7,
          "column": 11
        },
        "reason": "移動接近 韓信。"
      },
      "result": "succeeded",
      "reason": "移動接近 韓信。",
      "createdAt": "2026-09-01T17:40:54.270Z"
    },
    {
      "id": "action-26-nest-creature-2-234",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T17:40:54.270Z"
    },
    {
      "id": "action-27-player-2-235",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:54.270Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 111 (round 27)
- Player: 韓信 (player-2), level 1, experience 36, at (6, 13), health 20.599999999999998, stamina 7.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-27-player-2-236",
      "round": 27,
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
      "createdAt": "2026-09-01T17:40:54.291Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 112 (round 27)
- Player: 韓信 (player-2), level 1, experience 36, at (6, 12), health 20.599999999999998, stamina 2.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-27-player-2-237",
      "round": 27,
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
      "createdAt": "2026-09-01T17:40:54.308Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 113 (round 27)
- Player: 韓信 (player-2), level 1, experience 36, at (5, 12), health 20.599999999999998, stamina 0.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/145

```json
{
  "actions": [
    {
      "id": "action-27-player-2-238",
      "round": 27,
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
      "createdAt": "2026-09-01T17:40:54.321Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 114 (round 28)
- Player: 韓信 (player-2), level 1, experience 37, at (5, 12), health 21.799999999999997, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +1
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-27-nest-creature-1-239",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T17:40:54.327Z"
    },
    {
      "id": "action-27-nest-creature-2-240",
      "round": 27,
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
      "createdAt": "2026-09-01T17:40:54.327Z"
    },
    {
      "id": "action-28-player-2-241",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:54.328Z"
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
      "spawnedRound": 28,
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

### Turn 115 (round 28)
- Player: 韓信 (player-2), level 1, experience 37, at (4, 12), health 21.799999999999997, stamina 7.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-28-player-2-242",
      "round": 28,
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
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-01T17:40:54.348Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 116 (round 28)
- Player: 韓信 (player-2), level 1, experience 37, at (4, 11), health 21.799999999999997, stamina 5.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-28-player-2-243",
      "round": 28,
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
      "createdAt": "2026-09-01T17:40:54.367Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 117 (round 28)
- Player: 韓信 (player-2), level 1, experience 37, at (4, 10), health 21.799999999999997, stamina 0.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-28-player-2-244",
      "round": 28,
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
          "column": 10
        },
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-01T17:40:54.384Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 118 (round 29)
- Player: 韓信 (player-2), level 1, experience 38, at (4, 10), health 22.999999999999996, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-28-nest-creature-1-245",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T17:40:54.389Z"
    },
    {
      "id": "action-28-nest-creature-2-246",
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
          "row": 3,
          "column": 12
        },
        "reason": "移動接近 韓信。"
      },
      "result": "succeeded",
      "reason": "移動接近 韓信。",
      "createdAt": "2026-09-01T17:40:54.389Z"
    },
    {
      "id": "action-28-nest-creature-3-247",
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
      "createdAt": "2026-09-01T17:40:54.389Z"
    },
    {
      "id": "action-29-player-2-248",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:54.389Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 119 (round 29)
- Player: 韓信 (player-2), level 1, experience 38, at (4, 9), health 22.999999999999996, stamina 4.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-29-player-2-249",
      "round": 29,
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
          "column": 9
        },
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-01T17:40:54.405Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 120 (round 29)
- Player: 韓信 (player-2), level 1, experience 38, at (3, 9), health 22.999999999999996, stamina 2.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-29-player-2-250",
      "round": 29,
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
          "column": 9
        },
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-01T17:40:54.418Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 121 (round 29)
- Player: 韓信 (player-2), level 1, experience 38, at (2, 9), health 22.999999999999996, stamina 0.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-29-player-2-251",
      "round": 29,
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
          "column": 9
        },
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-01T17:40:54.428Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 122 (round 30)
- Player: 韓信 (player-2), level 1, experience 39, at (2, 9), health 24, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-29-nest-creature-1-252",
      "round": 29,
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
          "row": 2,
          "column": 11
        },
        "reason": "移動接近 韓信。"
      },
      "result": "succeeded",
      "reason": "移動接近 韓信。",
      "createdAt": "2026-09-01T17:40:54.432Z"
    },
    {
      "id": "action-29-nest-creature-2-253",
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
          "row": 1,
          "column": 12
        },
        "reason": "移動接近 item-point-3。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-3。",
      "createdAt": "2026-09-01T17:40:54.432Z"
    },
    {
      "id": "action-29-nest-creature-3-254",
      "round": 29,
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
      "createdAt": "2026-09-01T17:40:54.432Z"
    },
    {
      "id": "action-30-player-2-255",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:54.432Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-3",
      "creatureName": "生物巢穴 1的怪物 Lv.3",
      "message": "生物巢穴 1的怪物 Lv.3 攻擊長春，造成 6 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 123 (round 30)
- Player: 韓信 (player-2), level 1, experience 39, at (1, 9), health 24, stamina 7.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-30-player-2-256",
      "round": 30,
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
          "column": 9
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:54.450Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 124 (round 30)
- Player: 韓信 (player-2), level 1, experience 39, at (1, 8), health 24, stamina 5.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-30-player-2-257",
      "round": 30,
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
          "column": 8
        },
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-01T17:40:54.468Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 125 (round 30)
- Player: 韓信 (player-2), level 1, experience 39, at (2, 8), health 24, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-30-player-2-258",
      "round": 30,
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
          "column": 8
        },
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-01T17:40:54.484Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 126 (round 30)
- Player: 韓信 (player-2), level 1, experience 39, at (2, 7), health 24, stamina 1.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-30-player-2-259",
      "round": 30,
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
          "column": 7
        },
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-01T17:40:54.504Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 127 (round 31)
- Player: 韓信 (player-2), level 1, experience 42, at (2, 7), health 24, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-30-nest-creature-1-260",
      "round": 30,
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
          "column": 11
        },
        "reason": "移動接近 item-point-3。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-3。",
      "createdAt": "2026-09-01T17:40:54.509Z"
    },
    {
      "id": "action-30-nest-creature-2-261",
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
          "row": 1,
          "column": 13
        },
        "reason": "移動接近 item-point-3。"
      },
      "result": "succeeded",
      "reason": "移動接近 item-point-3。",
      "createdAt": "2026-09-01T17:40:54.509Z"
    },
    {
      "id": "action-30-nest-creature-3-262",
      "round": 30,
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
      "createdAt": "2026-09-01T17:40:54.510Z"
    },
    {
      "id": "action-31-player-2-263",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:54.510Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-3",
      "creatureName": "生物巢穴 1的怪物 Lv.3",
      "message": "生物巢穴 1的怪物 Lv.3 攻擊長春，造成 6 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 128 (round 31)
- Player: 韓信 (player-2), level 1, experience 42, at (3, 7), health 24, stamina 4.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-31-player-2-264",
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
          "row": 3,
          "column": 7
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:54.527Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 129 (round 31)
- Player: 韓信 (player-2), level 1, experience 42, at (3, 6), health 24, stamina 2.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-31-player-2-265",
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
          "row": 3,
          "column": 6
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:54.543Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 130 (round 31)
- Player: 韓信 (player-2), level 1, experience 42, at (3, 5), health 24, stamina 0.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-31-player-2-266",
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
          "row": 3,
          "column": 5
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:54.551Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 131 (round 32)
- Player: 韓信 (player-2), level 1, experience 43, at (3, 5), health 24, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-31-nest-creature-1-267",
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
      "createdAt": "2026-09-01T17:40:54.555Z"
    },
    {
      "id": "action-31-nest-creature-2-268",
      "round": 31,
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
      "createdAt": "2026-09-01T17:40:54.555Z"
    },
    {
      "id": "action-31-nest-creature-3-269",
      "round": 31,
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
      "createdAt": "2026-09-01T17:40:54.555Z"
    },
    {
      "id": "action-32-player-2-270",
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
        "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:54.555Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 132 (round 32)
- Player: 韓信 (player-2), level 1, experience 43, at (4, 5), health 24, stamina 7.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-32-player-2-271",
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:54.568Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 133 (round 32)
- Player: 韓信 (player-2), level 1, experience 43, at (5, 5), health 24, stamina 5.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-32-player-2-272",
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:54.582Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 134 (round 32)
- Player: 韓信 (player-2), level 1, experience 43, at (5, 6), health 24, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-32-player-2-273",
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:54.594Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 135 (round 32)
- Player: 韓信 (player-2), level 1, experience 43, at (6, 6), health 24, stamina 1.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-32-player-2-274",
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:40:54.606Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 136 (round 33)
- Player: 韓信 (player-2), level 1, experience 46, at (6, 6), health 24, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-32-nest-creature-1-275",
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
      "createdAt": "2026-09-01T17:40:54.610Z"
    },
    {
      "id": "action-32-nest-creature-2-276",
      "round": 32,
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
      "createdAt": "2026-09-01T17:40:54.610Z"
    },
    {
      "id": "action-32-nest-creature-3-277",
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
      "createdAt": "2026-09-01T17:40:54.610Z"
    },
    {
      "id": "action-33-player-2-278",
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
        "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:54.610Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 137 (round 33)
- Player: 韓信 (player-2), level 1, experience 46, at (7, 6), health 24, stamina 7.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-33-player-2-279",
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
          "row": 7,
          "column": 6
        },
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-01T17:40:54.625Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 138 (round 33)
- Player: 韓信 (player-2), level 1, experience 46, at (7, 7), health 24, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-33-player-2-280",
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
          "row": 7,
          "column": 7
        },
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-01T17:40:54.641Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 139 (round 33)
- Player: 韓信 (player-2), level 1, experience 46, at (8, 7), health 24, stamina 1.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-33-player-2-281",
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
          "row": 8,
          "column": 7
        },
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-01T17:40:54.652Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 140 (round 34)
- Player: 韓信 (player-2), level 1, experience 49, at (8, 7), health 24, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-33-nest-creature-1-282",
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
      "createdAt": "2026-09-01T17:40:54.657Z"
    },
    {
      "id": "action-33-nest-creature-2-283",
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:40:54.657Z"
    },
    {
      "id": "action-33-nest-creature-3-284",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T17:40:54.657Z"
    },
    {
      "id": "action-34-player-2-285",
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
        "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:54.657Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 141 (round 34)
- Player: 韓信 (player-2), level 1, experience 49, at (8, 8), health 24, stamina 7.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-34-player-2-286",
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
          "row": 8,
          "column": 8
        },
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-01T17:40:54.670Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 142 (round 34)
- Player: 韓信 (player-2), level 1, experience 49, at (8, 9), health 24, stamina 5.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-34-player-2-287",
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
          "row": 8,
          "column": 9
        },
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-01T17:40:54.684Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 143 (round 34)
- Player: 韓信 (player-2), level 1, experience 49, at (7, 9), health 24, stamina 3.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-34-player-2-288",
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
          "row": 7,
          "column": 9
        },
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-01T17:40:54.701Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 144 (round 34)
- Player: 韓信 (player-2), level 1, experience 49, at (6, 9), health 24, stamina 1.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-34-player-2-289",
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
          "row": 6,
          "column": 9
        },
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-01T17:40:54.714Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 145 (round 35)
- Player: 韓信 (player-2), level 2, experience 2, at (6, 9), health 24, stamina 9.5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: -47 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-34-nest-creature-1-290",
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
      "createdAt": "2026-09-01T17:40:54.718Z"
    },
    {
      "id": "action-34-nest-creature-2-291",
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
      "createdAt": "2026-09-01T17:40:54.718Z"
    },
    {
      "id": "action-34-nest-creature-3-292",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T17:40:54.718Z"
    },
    {
      "id": "action-35-player-2-293",
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
        "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:54.718Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 146 (round 35)
- Player: 韓信 (player-2), level 2, experience 2, at (6, 9), health 24, stamina 9.5
- Attributes: armStrength=10, constitution=9, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-35-player-2-294",
      "round": 35,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-01T17:40:54.733Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 147 (round 35)
- Player: 韓信 (player-2), level 2, experience 2, at (6, 9), health 24, stamina 9.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-35-player-2-295",
      "round": 35,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "韓信"
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
      "createdAt": "2026-09-01T17:40:54.748Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 148 (round 35)
- Player: 韓信 (player-2), level 2, experience 2, at (5, 9), health 24, stamina 4.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-35-player-2-296",
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
          "row": 5,
          "column": 9
        },
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-01T17:40:54.763Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 149 (round 35)
- Player: 韓信 (player-2), level 2, experience 2, at (6, 9), health 24, stamina 2.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-35-player-2-297",
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
          "row": 6,
          "column": 9
        },
        "reason": "探索：移動到未探索格 (7,8)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (7,8)",
      "createdAt": "2026-09-01T17:40:54.778Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 150 (round 35)
- Player: 韓信 (player-2), level 2, experience 2, at (7, 9), health 24, stamina 0.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-35-player-2-298",
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
          "row": 7,
          "column": 9
        },
        "reason": "任務：移動到告示牌據點"
      },
      "result": "succeeded",
      "reason": "任務：移動到告示牌據點",
      "createdAt": "2026-09-01T17:40:54.788Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 151 (round 36)
- Player: 韓信 (player-2), level 2, experience 3, at (7, 9), health 16.5, stamina 9.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-35-nest-creature-1-299",
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
      "createdAt": "2026-09-01T17:40:54.792Z"
    },
    {
      "id": "action-35-nest-creature-2-300",
      "round": 35,
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
      "createdAt": "2026-09-01T17:40:54.792Z"
    },
    {
      "id": "action-35-nest-creature-3-301",
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
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 7,
            "column": 9
          }
        },
        "reason": "與 韓信 交戰。"
      },
      "result": "succeeded",
      "reason": "與 韓信 交戰。",
      "createdAt": "2026-09-01T17:40:54.792Z"
    },
    {
      "id": "action-36-player-2-302",
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
        "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:54.793Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-3",
      "creatureName": "生物巢穴 1的怪物 Lv.3",
      "message": "生物巢穴 1的怪物 Lv.3 攻擊 韓信，造成 9 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 152 (round 36)
- Player: 韓信 (player-2), level 2, experience 3, at (7, 9), health 16.5, stamina 7.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-36-player-2-303",
      "round": 36,
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
      "createdAt": "2026-09-01T17:40:54.806Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 153 (round 36)
- Player: 韓信 (player-2), level 2, experience 3, at (7, 10), health 16.5, stamina 2.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-36-player-2-304",
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
          "row": 7,
          "column": 10
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:54.819Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 154 (round 36)
- Player: 韓信 (player-2), level 2, experience 3, at (7, 9), health 16.5, stamina 0.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/159

```json
{
  "actions": [
    {
      "id": "action-36-player-2-305",
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
          "row": 7,
          "column": 9
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:54.832Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 155 (round 37)
- Player: 韓信 (player-2), level 2, experience 4, at (7, 9), health 9, stamina 9.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +1
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-36-nest-creature-1-306",
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
      "createdAt": "2026-09-01T17:40:54.837Z"
    },
    {
      "id": "action-36-nest-creature-2-307",
      "round": 36,
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
      "createdAt": "2026-09-01T17:40:54.837Z"
    },
    {
      "id": "action-36-nest-creature-3-308",
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
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 7,
            "column": 9
          }
        },
        "reason": "與 韓信 交戰。"
      },
      "result": "succeeded",
      "reason": "與 韓信 交戰。",
      "createdAt": "2026-09-01T17:40:54.837Z"
    },
    {
      "id": "action-37-player-2-309",
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
        "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.17:hold, construction=0.11:none"
      },
      "result": "succeeded",
      "reason": "模糊策略：positioning 分數 0.33，但目前沒有可執行 action，結束回合。候選診斷：positioning=0.33:hold, selfPreservation=0.17:hold, construction=0.11:none",
      "createdAt": "2026-09-01T17:40:54.837Z"
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
      "spawnedRound": 37,
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

### Turn 156 (round 37)
- Player: 韓信 (player-2), level 2, experience 4, at (7, 10), health 9, stamina 4.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-37-player-2-310",
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
          "row": 7,
          "column": 10
        },
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=1）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=1）",
      "createdAt": "2026-09-01T17:40:54.851Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 157 (round 37)
- Player: 韓信 (player-2), level 2, experience 4, at (7, 9), health 9, stamina 2.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-37-player-2-311",
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
          "row": 7,
          "column": 9
        },
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=1）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=1）",
      "createdAt": "2026-09-01T17:40:54.870Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 158 (round 37)
- Player: 韓信 (player-2), level 2, experience 4, at (8, 9), health 9, stamina 0.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-37-player-2-312",
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
          "row": 8,
          "column": 9
        },
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=1）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=1）",
      "createdAt": "2026-09-01T17:40:54.879Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 159 (round 37)
- Player: 韓信 (player-2), level 2, experience 4, at (8, 9), health 29, stamina 0.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-37-player-2-313",
      "round": 37,
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
      "createdAt": "2026-09-01T17:40:54.884Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 160 (round 38)
- Player: 韓信 (player-2), level 2, experience 5, at (8, 9), health 30, stamina 9.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-37-nest-creature-1-314",
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
      "createdAt": "2026-09-01T17:40:54.889Z"
    },
    {
      "id": "action-37-nest-creature-2-315",
      "round": 37,
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
      "createdAt": "2026-09-01T17:40:54.889Z"
    },
    {
      "id": "action-37-nest-creature-3-316",
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
            "row": 8,
            "column": 9
          }
        },
        "reason": "與 韓信 交戰。"
      },
      "result": "succeeded",
      "reason": "與 韓信 交戰。",
      "createdAt": "2026-09-01T17:40:54.889Z"
    },
    {
      "id": "action-37-nest-creature-4-317",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T17:40:54.890Z"
    },
    {
      "id": "action-38-player-2-318",
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
        "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:54.890Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 161 (round 38)
- Player: 韓信 (player-2), level 2, experience 5, at (8, 10), health 30, stamina 4.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-38-player-2-319",
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
          "row": 8,
          "column": 10
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:54.910Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 162 (round 38)
- Player: 韓信 (player-2), level 2, experience 5, at (8, 9), health 30, stamina 2.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-38-player-2-320",
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
          "row": 8,
          "column": 9
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:54.932Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 163 (round 38)
- Player: 韓信 (player-2), level 2, experience 5, at (8, 8), health 30, stamina 0.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-38-player-2-321",
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
          "row": 8,
          "column": 8
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:54.946Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 164 (round 39)
- Player: 韓信 (player-2), level 2, experience 6, at (8, 8), health 10.5, stamina 9.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-38-nest-creature-1-322",
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
      "createdAt": "2026-09-01T17:40:54.952Z"
    },
    {
      "id": "action-38-nest-creature-2-323",
      "round": 38,
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
      "createdAt": "2026-09-01T17:40:54.953Z"
    },
    {
      "id": "action-38-nest-creature-3-324",
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
            "row": 8,
            "column": 8
          }
        },
        "reason": "與 韓信 交戰。"
      },
      "result": "succeeded",
      "reason": "與 韓信 交戰。",
      "createdAt": "2026-09-01T17:40:54.953Z"
    },
    {
      "id": "action-38-nest-creature-4-325",
      "round": 38,
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
      "createdAt": "2026-09-01T17:40:54.953Z"
    },
    {
      "id": "action-39-player-2-326",
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
        "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:54.953Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-4",
      "creatureName": "生物巢穴 1的怪物 Lv.4",
      "message": "生物巢穴 1的怪物 Lv.4 攻擊 韓信，造成 8 點傷害（根骨減傷，暴擊）。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 165 (round 39)
- Player: 韓信 (player-2), level 2, experience 6, at (8, 7), health 10.5, stamina 7.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-39-player-2-327",
      "round": 39,
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
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.875）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.875）",
      "createdAt": "2026-09-01T17:40:54.967Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 166 (round 39)
- Player: 韓信 (player-2), level 2, experience 6, at (7, 7), health 10.5, stamina 3.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-39-player-2-328",
      "round": 39,
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
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.875）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.875）",
      "createdAt": "2026-09-01T17:40:54.985Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 167 (round 39)
- Player: 韓信 (player-2), level 2, experience 6, at (7, 6), health 10.5, stamina 1.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-39-player-2-329",
      "round": 39,
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
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.875）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.3（hitsSurvivable=0.875）",
      "createdAt": "2026-09-01T17:40:54.997Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 168 (round 39)
- Player: 韓信 (player-2), level 2, experience 6, at (7, 6), health 30, stamina 1.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-39-player-2-330",
      "round": 39,
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
      "createdAt": "2026-09-01T17:40:55.002Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 169 (round 40)
- Player: 韓信 (player-2), level 2, experience 9, at (7, 6), health 30, stamina 9.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-39-nest-creature-1-331",
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
      "createdAt": "2026-09-01T17:40:55.006Z"
    },
    {
      "id": "action-39-nest-creature-2-332",
      "round": 39,
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
      "createdAt": "2026-09-01T17:40:55.006Z"
    },
    {
      "id": "action-39-nest-creature-3-333",
      "round": 39,
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
          "row": 6,
          "column": 9
        },
        "reason": "移動接近 韓信。"
      },
      "result": "succeeded",
      "reason": "移動接近 韓信。",
      "createdAt": "2026-09-01T17:40:55.006Z"
    },
    {
      "id": "action-39-nest-creature-4-334",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T17:40:55.006Z"
    },
    {
      "id": "action-40-player-2-335",
      "round": 40,
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
        "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:55.007Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 170 (round 40)
- Player: 韓信 (player-2), level 2, experience 9, at (8, 6), health 30, stamina 7.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-40-player-2-336",
      "round": 40,
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
          "column": 6
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:55.023Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 171 (round 40)
- Player: 韓信 (player-2), level 2, experience 9, at (9, 6), health 30, stamina 2.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-40-player-2-337",
      "round": 40,
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
          "column": 6
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:55.038Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 172 (round 40)
- Player: 韓信 (player-2), level 2, experience 9, at (9, 7), health 30, stamina 0.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-40-player-2-338",
      "round": 40,
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
          "column": 7
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:55.049Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 173 (round 41)
- Player: 韓信 (player-2), level 2, experience 10, at (9, 7), health 30, stamina 9.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-40-nest-creature-1-339",
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
      "createdAt": "2026-09-01T17:40:55.053Z"
    },
    {
      "id": "action-40-nest-creature-2-340",
      "round": 40,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-2",
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
      "createdAt": "2026-09-01T17:40:55.053Z"
    },
    {
      "id": "action-40-nest-creature-3-341",
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
      "createdAt": "2026-09-01T17:40:55.053Z"
    },
    {
      "id": "action-40-nest-creature-4-342",
      "round": 40,
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
            "row": 9,
            "column": 7
          }
        },
        "reason": "與 韓信 交戰。"
      },
      "result": "succeeded",
      "reason": "與 韓信 交戰。",
      "createdAt": "2026-09-01T17:40:55.053Z"
    },
    {
      "id": "action-41-player-2-343",
      "round": 41,
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
        "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:55.053Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-2",
      "creatureName": "生物巢穴 1的怪物 Lv.2",
      "message": "生物巢穴 1的怪物 Lv.2 攻擊長春，造成 4 點傷害。"
    },
    {
      "creatureId": "nest-creature-3",
      "creatureName": "生物巢穴 1的怪物 Lv.3",
      "message": "生物巢穴 1的怪物 Lv.3 攻擊長春，造成 6 點傷害。"
    },
    {
      "creatureId": "nest-creature-4",
      "creatureName": "生物巢穴 1的怪物 Lv.4",
      "message": "生物巢穴 1的怪物 Lv.4 攻擊 韓信，被閃避。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 174 (round 41)
- Player: 韓信 (player-2), level 2, experience 10, at (10, 7), health 30, stamina 7.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-41-player-2-344",
      "round": 41,
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
          "column": 7
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:55.068Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 175 (round 41)
- Player: 韓信 (player-2), level 2, experience 10, at (11, 7), health 30, stamina 5.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-41-player-2-345",
      "round": 41,
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
          "column": 7
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:55.084Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 176 (round 41)
- Player: 韓信 (player-2), level 2, experience 10, at (11, 8), health 30, stamina 3.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-41-player-2-346",
      "round": 41,
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
          "column": 8
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:55.100Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 177 (round 41)
- Player: 韓信 (player-2), level 2, experience 10, at (11, 9), health 30, stamina 1.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-41-player-2-347",
      "round": 41,
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
          "column": 9
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:55.122Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 178 (round 42)
- Player: 韓信 (player-2), level 2, experience 13, at (11, 9), health 30, stamina 9.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-41-nest-creature-1-348",
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
      "createdAt": "2026-09-01T17:40:55.128Z"
    },
    {
      "id": "action-41-nest-creature-2-349",
      "round": 41,
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
      "createdAt": "2026-09-01T17:40:55.128Z"
    },
    {
      "id": "action-41-nest-creature-3-350",
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
            "row": 7,
            "column": 8
          }
        },
        "reason": "與 長春 交戰。"
      },
      "result": "succeeded",
      "reason": "與 長春 交戰。",
      "createdAt": "2026-09-01T17:40:55.128Z"
    },
    {
      "id": "action-41-nest-creature-4-351",
      "round": 41,
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
      "createdAt": "2026-09-01T17:40:55.128Z"
    },
    {
      "id": "action-42-player-2-352",
      "round": 42,
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
        "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:55.128Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 179 (round 42)
- Player: 韓信 (player-2), level 2, experience 13, at (11, 10), health 30, stamina 7.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-42-player-2-353",
      "round": 42,
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
          "column": 10
        },
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:55.148Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 180 (round 42)
- Player: 韓信 (player-2), level 2, experience 13, at (12, 10), health 30, stamina 5.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-42-player-2-354",
      "round": 42,
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
        "reason": "探索：移動到未探索格 (13,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (13,13)",
      "createdAt": "2026-09-01T17:40:55.170Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 181 (round 42)
- Player: 韓信 (player-2), level 2, experience 13, at (12, 11), health 30, stamina 3.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-42-player-2-355",
      "round": 42,
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
      "createdAt": "2026-09-01T17:40:55.192Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 182 (round 42)
- Player: 韓信 (player-2), level 2, experience 13, at (13, 11), health 30, stamina 1.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/175

```json
{
  "actions": [
    {
      "id": "action-42-player-2-356",
      "round": 42,
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
      "createdAt": "2026-09-01T17:40:55.215Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 183 (round 43)
- Player: 韓信 (player-2), level 2, experience 16, at (13, 11), health 30, stamina 9.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=110/193

```json
{
  "actions": [
    {
      "id": "action-42-nest-creature-1-357",
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
      "createdAt": "2026-09-01T17:40:55.222Z"
    },
    {
      "id": "action-42-nest-creature-2-358",
      "round": 42,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-2",
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
      "createdAt": "2026-09-01T17:40:55.222Z"
    },
    {
      "id": "action-42-nest-creature-3-359",
      "round": 42,
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
      "createdAt": "2026-09-01T17:40:55.222Z"
    },
    {
      "id": "action-42-nest-creature-4-360",
      "round": 42,
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
      "createdAt": "2026-09-01T17:40:55.222Z"
    },
    {
      "id": "action-43-player-2-361",
      "round": 43,
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
        "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, exploration=0.10:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, exploration=0.10:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:55.222Z"
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
      "spawnedRound": 43,
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

### Turn 184 (round 43)
- Player: 韓信 (player-2), level 2, experience 16, at (13, 10), health 30, stamina 7.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/193

```json
{
  "actions": [
    {
      "id": "action-43-player-2-362",
      "round": 43,
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
      "createdAt": "2026-09-01T17:40:55.241Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 185 (round 43)
- Player: 韓信 (player-2), level 2, experience 16, at (12, 10), health 30, stamina 5.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/193

```json
{
  "actions": [
    {
      "id": "action-43-player-2-363",
      "round": 43,
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
      "createdAt": "2026-09-01T17:40:55.258Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 186 (round 43)
- Player: 韓信 (player-2), level 2, experience 16, at (12, 11), health 30, stamina 3.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/193

```json
{
  "actions": [
    {
      "id": "action-43-player-2-364",
      "round": 43,
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
      "createdAt": "2026-09-01T17:40:55.275Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 187 (round 43)
- Player: 韓信 (player-2), level 2, experience 16, at (12, 12), health 30, stamina 1.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/193

```json
{
  "actions": [
    {
      "id": "action-43-player-2-365",
      "round": 43,
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T17:40:55.294Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 188 (round 44)
- Player: 韓信 (player-2), level 2, experience 19, at (12, 12), health 18.5, stamina 9.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/193

```json
{
  "actions": [
    {
      "id": "action-43-nest-creature-1-366",
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
      "createdAt": "2026-09-01T17:40:55.299Z"
    },
    {
      "id": "action-43-nest-creature-2-367",
      "round": 43,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-2",
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
      "createdAt": "2026-09-01T17:40:55.299Z"
    },
    {
      "id": "action-43-nest-creature-3-368",
      "round": 43,
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
      "createdAt": "2026-09-01T17:40:55.299Z"
    },
    {
      "id": "action-43-nest-creature-4-369",
      "round": 43,
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
      "createdAt": "2026-09-01T17:40:55.299Z"
    },
    {
      "id": "action-43-nest-creature-5-370",
      "round": 43,
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
            "row": 12,
            "column": 12
          }
        },
        "reason": "與 韓信 交戰。"
      },
      "result": "succeeded",
      "reason": "與 韓信 交戰。",
      "createdAt": "2026-09-01T17:40:55.299Z"
    },
    {
      "id": "action-44-player-2-371",
      "round": 44,
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
        "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, exploration=0.10:none, selfPreservation=0.00:hold"
      },
      "result": "succeeded",
      "reason": "模糊策略：construction 分數 0.11，但目前沒有可執行 action，結束回合。候選診斷：construction=0.11:none, exploration=0.10:none, selfPreservation=0.00:hold",
      "createdAt": "2026-09-01T17:40:55.299Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 189 (round 44)
- Player: 韓信 (player-2), level 2, experience 19, at (11, 12), health 18.5, stamina 7.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/193

```json
{
  "actions": [
    {
      "id": "action-44-player-2-372",
      "round": 44,
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
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.5（hitsSurvivable=1.2333333333333334）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.5（hitsSurvivable=1.2333333333333334）",
      "createdAt": "2026-09-01T17:40:55.311Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 190 (round 44)
- Player: 韓信 (player-2), level 2, experience 19, at (10, 12), health 18.5, stamina 5.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/193

```json
{
  "actions": [
    {
      "id": "action-44-player-2-373",
      "round": 44,
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
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.5（hitsSurvivable=1.2333333333333334）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.5（hitsSurvivable=1.2333333333333334）",
      "createdAt": "2026-09-01T17:40:55.323Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 191 (round 44)
- Player: 韓信 (player-2), level 2, experience 19, at (10, 13), health 18.5, stamina 3.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/193

```json
{
  "actions": [
    {
      "id": "action-44-player-2-374",
      "round": 44,
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
      "createdAt": "2026-09-01T17:40:55.337Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 192 (round 44)
- Player: 韓信 (player-2), level 2, experience 19, at (11, 13), health 18.5, stamina 1.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/193

```json
{
  "actions": [
    {
      "id": "action-44-player-2-375",
      "round": 44,
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
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.2（hitsSurvivable=1.5416666666666667）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.2（hitsSurvivable=1.5416666666666667）",
      "createdAt": "2026-09-01T17:40:55.348Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 193 (round 45)
- Player: 韓信 (player-2), level 2, experience 22, at (11, 13), health 7, stamina 9.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/193

```json
{
  "actions": [
    {
      "id": "action-44-nest-creature-1-376",
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
      "createdAt": "2026-09-01T17:40:55.351Z"
    },
    {
      "id": "action-44-nest-creature-2-377",
      "round": 44,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-2",
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
      "createdAt": "2026-09-01T17:40:55.351Z"
    },
    {
      "id": "action-44-nest-creature-3-378",
      "round": 44,
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
      "createdAt": "2026-09-01T17:40:55.351Z"
    },
    {
      "id": "action-44-nest-creature-4-379",
      "round": 44,
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
      "createdAt": "2026-09-01T17:40:55.351Z"
    },
    {
      "id": "action-44-nest-creature-5-380",
      "round": 44,
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
            "row": 11,
            "column": 13
          }
        },
        "reason": "與 韓信 交戰。"
      },
      "result": "succeeded",
      "reason": "與 韓信 交戰。",
      "createdAt": "2026-09-01T17:40:55.351Z"
    },
    {
      "id": "action-45-player-2-381",
      "round": 45,
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
        "reason": "模糊策略：selfPreservation 分數 0.61，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.61:hold, construction=0.11:none, exploration=0.10:none"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 0.61，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=0.61:hold, construction=0.11:none, exploration=0.10:none",
      "createdAt": "2026-09-01T17:40:55.352Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 194 (round 45)
- Player: 韓信 (player-2), level 2, experience 22, at (10, 13), health 7, stamina 7.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/193

```json
{
  "actions": [
    {
      "id": "action-45-player-2-382",
      "round": 45,
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
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.5（hitsSurvivable=0.4666666666666667）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.5（hitsSurvivable=0.4666666666666667）",
      "createdAt": "2026-09-01T17:40:55.364Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 195 (round 45)
- Player: 韓信 (player-2), level 2, experience 22, at (9, 13), health 7, stamina 2.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/193

```json
{
  "actions": [
    {
      "id": "action-45-player-2-383",
      "round": 45,
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
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.5（hitsSurvivable=0.4666666666666667）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.5（hitsSurvivable=0.4666666666666667）",
      "createdAt": "2026-09-01T17:40:55.375Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 196 (round 45)
- Player: 韓信 (player-2), level 2, experience 22, at (8, 13), health 7, stamina 0.5
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/193

```json
{
  "actions": [
    {
      "id": "action-45-player-2-384",
      "round": 45,
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
        "reason": "保命：逃離 生物巢穴 1的怪物 Lv.5（hitsSurvivable=0.4666666666666667）"
      },
      "result": "succeeded",
      "reason": "保命：逃離 生物巢穴 1的怪物 Lv.5（hitsSurvivable=0.4666666666666667）",
      "createdAt": "2026-09-01T17:40:55.384Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 197 (round 46)
- Player: 韓信 (player-2), level 2, experience 23, at (8, 13), health 0, stamina 0
- Attributes: armStrength=10, constitution=10, agility=9, innerEnergy=8, insight=8
- Inner skill: 銳鋒淬芒 (sharp-edge-inner), level 1, damage 9
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=110/193

```json
{
  "actions": [
    {
      "id": "action-45-nest-creature-1-385",
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
      "createdAt": "2026-09-01T17:40:55.389Z"
    },
    {
      "id": "action-45-nest-creature-2-386",
      "round": 45,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 1的怪物 Lv.2"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "nest-creature-2",
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
      "createdAt": "2026-09-01T17:40:55.389Z"
    },
    {
      "id": "action-45-nest-creature-3-387",
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
      "createdAt": "2026-09-01T17:40:55.389Z"
    },
    {
      "id": "action-45-nest-creature-4-388",
      "round": 45,
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
      "createdAt": "2026-09-01T17:40:55.389Z"
    },
    {
      "id": "action-45-nest-creature-5-389",
      "round": 45,
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
            "row": 8,
            "column": 13
          }
        },
        "reason": "與 韓信 交戰。"
      },
      "result": "succeeded",
      "reason": "與 韓信 交戰。",
      "createdAt": "2026-09-01T17:40:55.389Z"
    },
    {
      "id": "action-46-player-2-390",
      "round": 46,
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
        "reason": "模糊策略：selfPreservation 分數 1.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=1.00:hold, construction=0.11:none"
      },
      "result": "succeeded",
      "reason": "模糊策略：selfPreservation 分數 1.00，但目前沒有可執行 action，結束回合。候選診斷：selfPreservation=1.00:hold, construction=0.11:none",
      "createdAt": "2026-09-01T17:40:55.389Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

