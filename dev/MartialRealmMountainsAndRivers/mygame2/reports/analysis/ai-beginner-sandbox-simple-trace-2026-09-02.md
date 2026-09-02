# AI Beginner Sandbox Simple Trace

- AI turns: 180
- Final round: 39
- Game won: false
- Game over: true
- Remaining nests: 1

## Aggregate

- Action counts: use-facility=109, end-turn=38, move=33, attack=20, hold=4
- Creatures spawned (total): 2
- Creatures defeated (total): 0
- Level-ups observed: 0
- Final player: level 1, experience 8, inner skill 吐納功 (tuna-gong) lv.1 damage 5
- Final attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13

## Efficiency (KPI)

- 行動產出率 (productive): ████████···· 63.2% (129/204)
- 擊殺效率 (kill/generate): ············ 0.00 (0/2)
- 擊殺成本 (attack/kill): n/a (20 次攻擊 / 0 擊殺)
- 經驗效率 (XP/turn): 0.04 (8 XP / 180 turns)
- 目標切換次數 (goal switches): 99
- 無效行動率 (ineffective): ██·········· 18.1% (37/204)

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
      "id": "action-1-player-2-1014",
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
      "createdAt": "2026-09-02T16:10:24.343Z"
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
      "id": "action-1-player-2-1015",
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
      "createdAt": "2026-09-02T16:10:24.366Z"
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
      "id": "action-1-player-2-1016",
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
      "createdAt": "2026-09-02T16:10:24.386Z"
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
      "id": "action-1-player-2-1017",
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
      "createdAt": "2026-09-02T16:10:24.399Z"
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
      "id": "action-2-player-2-1018",
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
      "createdAt": "2026-09-02T16:10:24.399Z"
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
      "id": "action-2-player-2-1019",
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
      "createdAt": "2026-09-02T16:10:24.422Z"
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
      "id": "action-2-player-2-1020",
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
      "createdAt": "2026-09-02T16:10:24.438Z"
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
      "id": "action-2-player-2-1021",
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
      "createdAt": "2026-09-02T16:10:24.448Z"
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
      "id": "action-3-player-2-1022",
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
      "createdAt": "2026-09-02T16:10:24.448Z"
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
      "id": "action-3-player-2-1023",
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
      "createdAt": "2026-09-02T16:10:24.463Z"
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
      "id": "action-3-player-2-1024",
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
      "createdAt": "2026-09-02T16:10:24.476Z"
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
      "id": "action-3-player-2-1025",
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
      "createdAt": "2026-09-02T16:10:24.489Z"
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
      "id": "action-3-player-2-1026",
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
      "createdAt": "2026-09-02T16:10:24.498Z"
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
      "id": "action-4-player-2-1027",
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
      "createdAt": "2026-09-02T16:10:24.498Z"
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
      "id": "action-4-player-2-1028",
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
      "createdAt": "2026-09-02T16:10:24.513Z"
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
      "id": "action-4-player-2-1029",
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
      "createdAt": "2026-09-02T16:10:24.526Z"
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
      "id": "action-4-player-2-1030",
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
      "createdAt": "2026-09-02T16:10:24.535Z"
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
      "id": "action-5-player-2-1031",
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
      "createdAt": "2026-09-02T16:10:24.535Z"
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
      "id": "action-5-player-2-1032",
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
      "createdAt": "2026-09-02T16:10:24.548Z"
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
      "id": "action-5-player-2-1033",
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
      "createdAt": "2026-09-02T16:10:24.560Z"
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
      "id": "action-6-player-2-1034",
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
      "createdAt": "2026-09-02T16:10:24.564Z"
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
      "id": "action-6-player-2-1035",
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
      "createdAt": "2026-09-02T16:10:24.576Z"
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
      "id": "action-6-player-2-1036",
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
      "createdAt": "2026-09-02T16:10:24.586Z"
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
      "id": "action-6-player-2-1037",
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
      "createdAt": "2026-09-02T16:10:24.599Z"
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
      "id": "action-6-player-2-1038",
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
      "createdAt": "2026-09-02T16:10:24.605Z"
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
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-7-player-2-1039",
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
      "createdAt": "2026-09-02T16:10:24.606Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 27 (round 7)
- Player: 韓信 (player-2), level 1, experience 2, at (6, 12), health 24, stamina 3
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
      "id": "action-7-player-2-1040",
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
      "createdAt": "2026-09-02T16:10:24.615Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-7-player-2-1041",
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
      "createdAt": "2026-09-02T16:10:24.624Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-8-player-2-1042",
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
      "createdAt": "2026-09-02T16:10:24.627Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-8-player-2-1043",
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
      "createdAt": "2026-09-02T16:10:24.636Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-8-player-2-1044",
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
      "createdAt": "2026-09-02T16:10:24.646Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-8-player-2-1045",
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
      "createdAt": "2026-09-02T16:10:24.657Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-8-player-2-1046",
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
      "createdAt": "2026-09-02T16:10:24.663Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-9-player-2-1047",
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
      "createdAt": "2026-09-02T16:10:24.663Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-9-player-2-1048",
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
      "createdAt": "2026-09-02T16:10:24.674Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-9-player-2-1049",
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
      "createdAt": "2026-09-02T16:10:24.685Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-10-player-2-1050",
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
      "createdAt": "2026-09-02T16:10:24.688Z"
    }
  ],
  "creatureLogs": [],
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-10-player-2-1051",
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
      "createdAt": "2026-09-02T16:10:24.699Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-10-player-2-1052",
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
      "createdAt": "2026-09-02T16:10:24.708Z"
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
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-11-player-2-1053",
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
      "createdAt": "2026-09-02T16:10:24.710Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 41 (round 11)
- Player: 韓信 (player-2), level 1, experience 8, at (7, 9), health 24, stamina 6
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
      "id": "action-11-player-2-1054",
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
      "createdAt": "2026-09-02T16:10:24.721Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-11-player-2-1055",
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
      "createdAt": "2026-09-02T16:10:24.728Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-11-player-2-1056",
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
      "createdAt": "2026-09-02T16:10:24.740Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-11-player-2-1057",
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
      "createdAt": "2026-09-02T16:10:24.745Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-12-player-2-1058",
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
      "createdAt": "2026-09-02T16:10:24.745Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-12-player-2-1059",
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
      "createdAt": "2026-09-02T16:10:24.754Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-12-player-2-1060",
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
      "createdAt": "2026-09-02T16:10:24.761Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-12-player-2-1061",
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
      "createdAt": "2026-09-02T16:10:24.769Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-12-player-2-1062",
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
      "createdAt": "2026-09-02T16:10:24.776Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-13-player-2-1063",
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
      "createdAt": "2026-09-02T16:10:24.777Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-13-player-2-1064",
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
      "createdAt": "2026-09-02T16:10:24.784Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-13-player-2-1065",
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
      "createdAt": "2026-09-02T16:10:24.792Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-13-player-2-1066",
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
      "createdAt": "2026-09-02T16:10:24.801Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-13-player-2-1067",
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
      "createdAt": "2026-09-02T16:10:24.809Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-14-player-2-1068",
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
      "createdAt": "2026-09-02T16:10:24.810Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-14-player-2-1069",
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
      "createdAt": "2026-09-02T16:10:24.819Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-14-player-2-1070",
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
      "createdAt": "2026-09-02T16:10:24.827Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-14-player-2-1071",
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
      "createdAt": "2026-09-02T16:10:24.834Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-14-player-2-1072",
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
      "createdAt": "2026-09-02T16:10:24.843Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-15-player-2-1073",
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
      "createdAt": "2026-09-02T16:10:24.843Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-15-player-2-1074",
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
      "createdAt": "2026-09-02T16:10:24.851Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-15-player-2-1075",
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
      "createdAt": "2026-09-02T16:10:24.860Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-15-player-2-1076",
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
      "createdAt": "2026-09-02T16:10:24.868Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-15-player-2-1077",
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
      "createdAt": "2026-09-02T16:10:24.873Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-16-player-2-1078",
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
      "createdAt": "2026-09-02T16:10:24.874Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-16-player-2-1079",
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
      "createdAt": "2026-09-02T16:10:24.881Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-16-player-2-1080",
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
      "createdAt": "2026-09-02T16:10:24.889Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-16-player-2-1081",
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
      "createdAt": "2026-09-02T16:10:24.897Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-16-player-2-1082",
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
      "createdAt": "2026-09-02T16:10:24.902Z"
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
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-17-player-2-1083",
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
      "createdAt": "2026-09-02T16:10:24.903Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 71 (round 17)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 6
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
      "id": "action-17-player-2-1084",
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
      "createdAt": "2026-09-02T16:10:24.910Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-17-player-2-1085",
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
      "createdAt": "2026-09-02T16:10:24.918Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-17-player-2-1086",
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
      "createdAt": "2026-09-02T16:10:24.926Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-17-player-2-1087",
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
      "createdAt": "2026-09-02T16:10:24.931Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-18-player-2-1088",
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
      "createdAt": "2026-09-02T16:10:24.932Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-18-player-2-1089",
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
      "createdAt": "2026-09-02T16:10:24.939Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-18-player-2-1090",
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
      "createdAt": "2026-09-02T16:10:24.947Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-18-player-2-1091",
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
      "createdAt": "2026-09-02T16:10:24.955Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-18-player-2-1092",
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
      "createdAt": "2026-09-02T16:10:24.961Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-19-player-2-1093",
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
      "createdAt": "2026-09-02T16:10:24.961Z"
    }
  ],
  "creatureLogs": [],
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-19-player-2-1094",
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
      "createdAt": "2026-09-02T16:10:24.969Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-19-player-2-1095",
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
      "createdAt": "2026-09-02T16:10:24.977Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-19-player-2-1096",
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
      "createdAt": "2026-09-02T16:10:24.985Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-19-player-2-1097",
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
      "createdAt": "2026-09-02T16:10:24.990Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-20-player-2-1098",
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
      "createdAt": "2026-09-02T16:10:24.991Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-20-player-2-1099",
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
      "createdAt": "2026-09-02T16:10:24.998Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-20-player-2-1100",
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
      "createdAt": "2026-09-02T16:10:25.006Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-20-player-2-1101",
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
      "createdAt": "2026-09-02T16:10:25.013Z"
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
- Nests: creature-nest-1=120/120

```json
{
  "actions": [
    {
      "id": "action-20-player-2-1102",
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
      "createdAt": "2026-09-02T16:10:25.019Z"
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
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-21-player-2-1103",
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
      "createdAt": "2026-09-02T16:10:25.020Z"
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
      "spawnedRound": 21,
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

### Turn 91 (round 21)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 6
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
      "id": "action-21-player-2-1104",
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
      "createdAt": "2026-09-02T16:10:25.028Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-21-player-2-1105",
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
      "createdAt": "2026-09-02T16:10:25.035Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-21-player-2-1106",
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
      "createdAt": "2026-09-02T16:10:25.043Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-21-player-2-1107",
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
      "createdAt": "2026-09-02T16:10:25.049Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-21-nest-creature-1-1108",
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
      "createdAt": "2026-09-02T16:10:25.049Z"
    },
    {
      "id": "action-22-player-2-1109",
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
      "createdAt": "2026-09-02T16:10:25.049Z"
    }
  ],
  "creatureLogs": [],
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-22-player-2-1110",
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
      "createdAt": "2026-09-02T16:10:25.057Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-22-player-2-1111",
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
      "createdAt": "2026-09-02T16:10:25.064Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-22-player-2-1112",
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
      "createdAt": "2026-09-02T16:10:25.072Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-22-player-2-1113",
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
      "createdAt": "2026-09-02T16:10:25.078Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-22-nest-creature-1-1114",
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
      "createdAt": "2026-09-02T16:10:25.078Z"
    },
    {
      "id": "action-23-player-2-1115",
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
      "createdAt": "2026-09-02T16:10:25.078Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-23-player-2-1116",
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
      "createdAt": "2026-09-02T16:10:25.086Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-23-player-2-1117",
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
      "createdAt": "2026-09-02T16:10:25.094Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-23-player-2-1118",
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
      "createdAt": "2026-09-02T16:10:25.101Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-23-player-2-1119",
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
      "createdAt": "2026-09-02T16:10:25.107Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-23-nest-creature-1-1120",
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
      "createdAt": "2026-09-02T16:10:25.108Z"
    },
    {
      "id": "action-24-player-2-1121",
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
      "createdAt": "2026-09-02T16:10:25.108Z"
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

### Turn 106 (round 24)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 6
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
      "id": "action-24-player-2-1122",
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
      "createdAt": "2026-09-02T16:10:25.115Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-24-player-2-1123",
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
      "createdAt": "2026-09-02T16:10:25.124Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-24-player-2-1124",
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
      "createdAt": "2026-09-02T16:10:25.131Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-24-player-2-1125",
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
      "createdAt": "2026-09-02T16:10:25.136Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-24-nest-creature-1-1126",
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
      "createdAt": "2026-09-02T16:10:25.137Z"
    },
    {
      "id": "action-25-player-2-1127",
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
      "createdAt": "2026-09-02T16:10:25.137Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-25-player-2-1128",
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
      "createdAt": "2026-09-02T16:10:25.145Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-25-player-2-1129",
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
      "createdAt": "2026-09-02T16:10:25.152Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-25-player-2-1130",
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
      "createdAt": "2026-09-02T16:10:25.160Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-25-player-2-1131",
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
      "createdAt": "2026-09-02T16:10:25.166Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-25-nest-creature-1-1132",
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
      "createdAt": "2026-09-02T16:10:25.166Z"
    },
    {
      "id": "action-26-player-2-1133",
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
      "createdAt": "2026-09-02T16:10:25.166Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-26-player-2-1134",
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
      "createdAt": "2026-09-02T16:10:25.174Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-26-player-2-1135",
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
      "createdAt": "2026-09-02T16:10:25.181Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-26-player-2-1136",
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
      "createdAt": "2026-09-02T16:10:25.189Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-26-player-2-1137",
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
      "createdAt": "2026-09-02T16:10:25.195Z"
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
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-26-nest-creature-1-1138",
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
      "createdAt": "2026-09-02T16:10:25.195Z"
    },
    {
      "id": "action-27-player-2-1139",
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
      "createdAt": "2026-09-02T16:10:25.195Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 121 (round 27)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 6
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
      "id": "action-27-player-2-1140",
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
      "createdAt": "2026-09-02T16:10:25.203Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-27-player-2-1141",
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
      "createdAt": "2026-09-02T16:10:25.211Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-27-player-2-1142",
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
      "createdAt": "2026-09-02T16:10:25.219Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-27-player-2-1143",
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
      "createdAt": "2026-09-02T16:10:25.225Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-27-nest-creature-1-1144",
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
      "createdAt": "2026-09-02T16:10:25.225Z"
    },
    {
      "id": "action-28-player-2-1145",
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
      "createdAt": "2026-09-02T16:10:25.225Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-28-player-2-1146",
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
      "createdAt": "2026-09-02T16:10:25.233Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-28-player-2-1147",
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
      "createdAt": "2026-09-02T16:10:25.241Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-28-player-2-1148",
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
      "createdAt": "2026-09-02T16:10:25.248Z"
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
- Nests: creature-nest-1=120/132

```json
{
  "actions": [
    {
      "id": "action-28-player-2-1149",
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
      "createdAt": "2026-09-02T16:10:25.253Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 130 (round 29)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 8
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
      "id": "action-28-nest-creature-1-1150",
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
      "createdAt": "2026-09-02T16:10:25.254Z"
    },
    {
      "id": "action-29-player-2-1151",
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
      "createdAt": "2026-09-02T16:10:25.254Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 131 (round 29)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 6
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
      "id": "action-29-player-2-1152",
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
      "createdAt": "2026-09-02T16:10:25.262Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 132 (round 29)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 4
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
      "id": "action-29-player-2-1153",
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
      "createdAt": "2026-09-02T16:10:25.270Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 133 (round 29)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 2
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
      "id": "action-29-player-2-1154",
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
      "createdAt": "2026-09-02T16:10:25.278Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 134 (round 29)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 0
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
      "id": "action-29-player-2-1155",
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
      "createdAt": "2026-09-02T16:10:25.283Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 135 (round 30)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 8
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
      "id": "action-29-nest-creature-1-1156",
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
      "createdAt": "2026-09-02T16:10:25.284Z"
    },
    {
      "id": "action-30-player-2-1157",
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
      "createdAt": "2026-09-02T16:10:25.284Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 136 (round 30)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 6
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
      "id": "action-30-player-2-1158",
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
      "createdAt": "2026-09-02T16:10:25.292Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 137 (round 30)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 4
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
      "id": "action-30-player-2-1159",
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
      "createdAt": "2026-09-02T16:10:25.300Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 138 (round 30)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 2
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
      "id": "action-30-player-2-1160",
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
      "createdAt": "2026-09-02T16:10:25.308Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 139 (round 30)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 0
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
      "id": "action-30-player-2-1161",
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
      "createdAt": "2026-09-02T16:10:25.313Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 140 (round 31)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 8
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
      "id": "action-30-nest-creature-1-1162",
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
      "createdAt": "2026-09-02T16:10:25.313Z"
    },
    {
      "id": "action-31-player-2-1163",
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
      "createdAt": "2026-09-02T16:10:25.313Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 141 (round 31)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 6
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
      "id": "action-31-player-2-1164",
      "round": 31,
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
      "createdAt": "2026-09-02T16:10:25.321Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 142 (round 31)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 4
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
      "id": "action-31-player-2-1165",
      "round": 31,
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
      "createdAt": "2026-09-02T16:10:25.329Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 143 (round 31)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 2
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
      "id": "action-31-player-2-1166",
      "round": 31,
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
      "createdAt": "2026-09-02T16:10:25.337Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 144 (round 31)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 0
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
      "id": "action-31-player-2-1167",
      "round": 31,
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
      "createdAt": "2026-09-02T16:10:25.343Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 145 (round 32)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 8
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
      "id": "action-31-nest-creature-1-1168",
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
      "createdAt": "2026-09-02T16:10:25.343Z"
    },
    {
      "id": "action-32-player-2-1169",
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
      "createdAt": "2026-09-02T16:10:25.343Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 146 (round 32)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 6
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
      "id": "action-32-player-2-1170",
      "round": 32,
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
      "createdAt": "2026-09-02T16:10:25.351Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 147 (round 32)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 4
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
      "id": "action-32-player-2-1171",
      "round": 32,
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
      "createdAt": "2026-09-02T16:10:25.359Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 148 (round 32)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 2
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
      "id": "action-32-player-2-1172",
      "round": 32,
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
      "createdAt": "2026-09-02T16:10:25.366Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 149 (round 32)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 0
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
      "id": "action-32-player-2-1173",
      "round": 32,
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
      "createdAt": "2026-09-02T16:10:25.372Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 150 (round 33)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/145

```json
{
  "actions": [
    {
      "id": "action-32-nest-creature-1-1174",
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
      "createdAt": "2026-09-02T16:10:25.372Z"
    },
    {
      "id": "action-33-player-2-1175",
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
      "createdAt": "2026-09-02T16:10:25.373Z"
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
      "spawnedRound": 33,
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

### Turn 151 (round 33)
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
      "id": "action-33-player-2-1176",
      "round": 33,
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
      "createdAt": "2026-09-02T16:10:25.381Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 152 (round 33)
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
      "id": "action-33-player-2-1177",
      "round": 33,
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
      "createdAt": "2026-09-02T16:10:25.389Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 153 (round 33)
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
      "id": "action-33-player-2-1178",
      "round": 33,
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
      "createdAt": "2026-09-02T16:10:25.396Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 154 (round 33)
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
      "id": "action-33-player-2-1179",
      "round": 33,
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
      "createdAt": "2026-09-02T16:10:25.403Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 155 (round 34)
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
      "id": "action-33-nest-creature-1-1180",
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
      "createdAt": "2026-09-02T16:10:25.403Z"
    },
    {
      "id": "action-33-nest-creature-2-1181",
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
      "createdAt": "2026-09-02T16:10:25.403Z"
    },
    {
      "id": "action-34-player-2-1182",
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
      "createdAt": "2026-09-02T16:10:25.403Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 156 (round 34)
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
      "id": "action-34-player-2-1183",
      "round": 34,
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
      "createdAt": "2026-09-02T16:10:25.414Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 157 (round 34)
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
      "id": "action-34-player-2-1184",
      "round": 34,
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
      "createdAt": "2026-09-02T16:10:25.425Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 158 (round 34)
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
      "id": "action-34-player-2-1185",
      "round": 34,
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
      "createdAt": "2026-09-02T16:10:25.436Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 159 (round 34)
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
      "id": "action-34-player-2-1186",
      "round": 34,
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
      "createdAt": "2026-09-02T16:10:25.444Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 160 (round 35)
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
      "id": "action-34-nest-creature-1-1187",
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
      "createdAt": "2026-09-02T16:10:25.445Z"
    },
    {
      "id": "action-34-nest-creature-2-1188",
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
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-02T16:10:25.445Z"
    },
    {
      "id": "action-35-player-2-1189",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-02T16:10:25.445Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 161 (round 35)
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
      "id": "action-35-player-2-1190",
      "round": 35,
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
      "createdAt": "2026-09-02T16:10:25.453Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 162 (round 35)
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
      "id": "action-35-player-2-1191",
      "round": 35,
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
      "createdAt": "2026-09-02T16:10:25.462Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 163 (round 35)
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
      "id": "action-35-player-2-1192",
      "round": 35,
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
      "createdAt": "2026-09-02T16:10:25.470Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 164 (round 35)
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
      "id": "action-35-player-2-1193",
      "round": 35,
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
      "createdAt": "2026-09-02T16:10:25.477Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 165 (round 36)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 15.2, stamina 8
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
      "id": "action-35-nest-creature-1-1194",
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
      "createdAt": "2026-09-02T16:10:25.477Z"
    },
    {
      "id": "action-35-nest-creature-2-1195",
      "round": 35,
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
            "row": 8,
            "column": 8
          }
        },
        "reason": "與 韓信 交戰。"
      },
      "result": "succeeded",
      "reason": "與 韓信 交戰。",
      "createdAt": "2026-09-02T16:10:25.478Z"
    },
    {
      "id": "action-36-player-2-1196",
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
      "createdAt": "2026-09-02T16:10:25.478Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-2",
      "creatureName": "生物巢穴 1的怪物 Lv.2",
      "message": "生物巢穴 1的怪物 Lv.2 攻擊 韓信，造成 10 點傷害（暴擊）。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 166 (round 36)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 15.2, stamina 6
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
      "id": "action-36-player-2-1197",
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
      "createdAt": "2026-09-02T16:10:25.486Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 167 (round 36)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 15.2, stamina 4
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
      "id": "action-36-player-2-1198",
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
      "createdAt": "2026-09-02T16:10:25.495Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 168 (round 36)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 15.2, stamina 2
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
      "id": "action-36-player-2-1199",
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
      "createdAt": "2026-09-02T16:10:25.503Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 169 (round 36)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 15.2, stamina 0
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
      "id": "action-36-player-2-1200",
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
      "createdAt": "2026-09-02T16:10:25.510Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 170 (round 37)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 9.399999999999999, stamina 8
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
      "id": "action-36-nest-creature-1-1201",
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
      "createdAt": "2026-09-02T16:10:25.511Z"
    },
    {
      "id": "action-36-nest-creature-2-1202",
      "round": 36,
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
            "row": 8,
            "column": 8
          }
        },
        "reason": "與 韓信 交戰。"
      },
      "result": "succeeded",
      "reason": "與 韓信 交戰。",
      "createdAt": "2026-09-02T16:10:25.511Z"
    },
    {
      "id": "action-37-player-2-1203",
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
      "createdAt": "2026-09-02T16:10:25.511Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 171 (round 37)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 9.399999999999999, stamina 6
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
      "id": "action-37-player-2-1204",
      "round": 37,
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
      "createdAt": "2026-09-02T16:10:25.521Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 172 (round 37)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 9.399999999999999, stamina 4
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
      "id": "action-37-player-2-1205",
      "round": 37,
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
      "createdAt": "2026-09-02T16:10:25.530Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 173 (round 37)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 9.399999999999999, stamina 2
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
      "id": "action-37-player-2-1206",
      "round": 37,
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
      "createdAt": "2026-09-02T16:10:25.538Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 174 (round 37)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 9.399999999999999, stamina 0
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
      "id": "action-37-player-2-1207",
      "round": 37,
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
      "createdAt": "2026-09-02T16:10:25.546Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 175 (round 38)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 3.5999999999999988, stamina 8
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
      "id": "action-37-nest-creature-1-1208",
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
      "createdAt": "2026-09-02T16:10:25.546Z"
    },
    {
      "id": "action-37-nest-creature-2-1209",
      "round": 37,
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
            "row": 8,
            "column": 8
          }
        },
        "reason": "與 韓信 交戰。"
      },
      "result": "succeeded",
      "reason": "與 韓信 交戰。",
      "createdAt": "2026-09-02T16:10:25.546Z"
    },
    {
      "id": "action-38-player-2-1210",
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
      "createdAt": "2026-09-02T16:10:25.546Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 176 (round 38)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 3.5999999999999988, stamina 6
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
      "id": "action-38-player-2-1211",
      "round": 38,
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
      "createdAt": "2026-09-02T16:10:25.554Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 177 (round 38)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 3.5999999999999988, stamina 4
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
      "id": "action-38-player-2-1212",
      "round": 38,
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
      "createdAt": "2026-09-02T16:10:25.563Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 178 (round 38)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 3.5999999999999988, stamina 2
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
      "id": "action-38-player-2-1213",
      "round": 38,
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
      "createdAt": "2026-09-02T16:10:25.572Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 179 (round 38)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 3.5999999999999988, stamina 0
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
      "id": "action-38-player-2-1214",
      "round": 38,
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
      "createdAt": "2026-09-02T16:10:25.579Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 180 (round 39)
- Player: 韓信 (player-2), level 1, experience 8, at (8, 8), health 0, stamina 0
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
      "id": "action-38-nest-creature-1-1215",
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
      "createdAt": "2026-09-02T16:10:25.580Z"
    },
    {
      "id": "action-38-nest-creature-2-1216",
      "round": 38,
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
            "row": 8,
            "column": 8
          }
        },
        "reason": "與 韓信 交戰。"
      },
      "result": "succeeded",
      "reason": "與 韓信 交戰。",
      "createdAt": "2026-09-02T16:10:25.580Z"
    },
    {
      "id": "action-39-player-2-1217",
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
        "reason": "模糊策略迴圈結束（0 步）"
      },
      "result": "succeeded",
      "reason": "模糊策略迴圈結束（0 步）",
      "createdAt": "2026-09-02T16:10:25.580Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

