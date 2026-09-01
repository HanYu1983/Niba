# AI Beginner Sandbox Simple Trace

- AI turns: 187
- Final round: 51
- Game won: true
- Game over: false
- Remaining nests: 0

## Aggregate

- Action counts: move=118, attack=51, end-turn=50, hold=4, allocate-attribute=2
- Creatures spawned (total): 1
- Creatures defeated (total): 0
- Level-ups observed: 1
- Final player: level 2, experience 24, inner skill 吐納功 (tuna-gong) lv.2 damage 7
- Final attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Nest health (start → end): creature-nest-1=120→3

## Turn Trace

### Turn 1 (round 1)
- Player: 聶風 (player-2), level 1, experience 0, at (7, 11), health 24, stamina 6
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
      "id": "action-1-player-2-231",
      "round": 1,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 7,
          "column": 11
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:57.929Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 2 (round 1)
- Player: 聶風 (player-2), level 1, experience 0, at (7, 11), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=113/120

```json
{
  "actions": [
    {
      "id": "action-1-player-2-232",
      "round": 1,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
            "row": 8,
            "column": 11
          }
        },
        "reason": "打巢穴：攻擊 生物巢穴 1"
      },
      "result": "succeeded",
      "reason": "打巢穴：攻擊 生物巢穴 1",
      "createdAt": "2026-09-01T17:09:57.939Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 3 (round 2)
- Player: 聶風 (player-2), level 1, experience 2, at (7, 11), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=113/120

```json
{
  "actions": [
    {
      "id": "action-2-player-2-233",
      "round": 2,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:57.944Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 4 (round 2)
- Player: 聶風 (player-2), level 1, experience 2, at (7, 11), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=108/120

```json
{
  "actions": [
    {
      "id": "action-2-player-2-234",
      "round": 2,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
            "row": 8,
            "column": 11
          }
        },
        "reason": "打巢穴：攻擊 生物巢穴 1"
      },
      "result": "succeeded",
      "reason": "打巢穴：攻擊 生物巢穴 1",
      "createdAt": "2026-09-01T17:09:57.955Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 5 (round 2)
- Player: 聶風 (player-2), level 1, experience 2, at (7, 12), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=108/120

```json
{
  "actions": [
    {
      "id": "action-2-player-2-235",
      "round": 2,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 7,
          "column": 12
        },
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:57.968Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 6 (round 3)
- Player: 聶風 (player-2), level 1, experience 4, at (7, 12), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=108/120

```json
{
  "actions": [
    {
      "id": "action-3-player-2-236",
      "round": 3,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:57.973Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 7 (round 3)
- Player: 聶風 (player-2), level 1, experience 4, at (8, 12), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=108/120

```json
{
  "actions": [
    {
      "id": "action-3-player-2-237",
      "round": 3,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:57.987Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 8 (round 3)
- Player: 聶風 (player-2), level 1, experience 4, at (8, 12), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=103/120

```json
{
  "actions": [
    {
      "id": "action-3-player-2-238",
      "round": 3,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
            "row": 8,
            "column": 11
          }
        },
        "reason": "打巢穴：攻擊 生物巢穴 1"
      },
      "result": "succeeded",
      "reason": "打巢穴：攻擊 生物巢穴 1",
      "createdAt": "2026-09-01T17:09:57.998Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 9 (round 4)
- Player: 聶風 (player-2), level 1, experience 6, at (8, 12), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=103/120

```json
{
  "actions": [
    {
      "id": "action-4-player-2-239",
      "round": 4,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.002Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 10 (round 4)
- Player: 聶風 (player-2), level 1, experience 6, at (8, 12), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=98/120

```json
{
  "actions": [
    {
      "id": "action-4-player-2-240",
      "round": 4,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
            "row": 8,
            "column": 11
          }
        },
        "reason": "打巢穴：攻擊 生物巢穴 1"
      },
      "result": "succeeded",
      "reason": "打巢穴：攻擊 生物巢穴 1",
      "createdAt": "2026-09-01T17:09:58.013Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 11 (round 4)
- Player: 聶風 (player-2), level 1, experience 6, at (9, 12), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=98/120

```json
{
  "actions": [
    {
      "id": "action-4-player-2-241",
      "round": 4,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:58.026Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 12 (round 5)
- Player: 聶風 (player-2), level 1, experience 8, at (9, 12), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=98/120

```json
{
  "actions": [
    {
      "id": "action-5-player-2-242",
      "round": 5,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.031Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 13 (round 5)
- Player: 聶風 (player-2), level 1, experience 8, at (9, 11), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=98/120

```json
{
  "actions": [
    {
      "id": "action-5-player-2-243",
      "round": 5,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.045Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 14 (round 5)
- Player: 聶風 (player-2), level 1, experience 8, at (9, 11), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=91/120

```json
{
  "actions": [
    {
      "id": "action-5-player-2-244",
      "round": 5,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
            "row": 8,
            "column": 11
          }
        },
        "reason": "打巢穴：攻擊 生物巢穴 1"
      },
      "result": "succeeded",
      "reason": "打巢穴：攻擊 生物巢穴 1",
      "createdAt": "2026-09-01T17:09:58.055Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 15 (round 6)
- Player: 聶風 (player-2), level 1, experience 10, at (9, 11), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=91/120

```json
{
  "actions": [
    {
      "id": "action-6-player-2-245",
      "round": 6,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.059Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 16 (round 6)
- Player: 聶風 (player-2), level 1, experience 10, at (9, 11), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=86/120

```json
{
  "actions": [
    {
      "id": "action-6-player-2-246",
      "round": 6,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
            "row": 8,
            "column": 11
          }
        },
        "reason": "打巢穴：攻擊 生物巢穴 1"
      },
      "result": "succeeded",
      "reason": "打巢穴：攻擊 生物巢穴 1",
      "createdAt": "2026-09-01T17:09:58.070Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 17 (round 6)
- Player: 聶風 (player-2), level 1, experience 10, at (9, 10), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=86/120

```json
{
  "actions": [
    {
      "id": "action-6-player-2-247",
      "round": 6,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:58.081Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 18 (round 7)
- Player: 聶風 (player-2), level 1, experience 12, at (9, 10), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=86/120

```json
{
  "actions": [
    {
      "id": "action-7-player-2-248",
      "round": 7,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.086Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 19 (round 7)
- Player: 聶風 (player-2), level 1, experience 12, at (8, 10), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=86/120

```json
{
  "actions": [
    {
      "id": "action-7-player-2-249",
      "round": 7,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.099Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 20 (round 7)
- Player: 聶風 (player-2), level 1, experience 12, at (8, 10), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=81/120

```json
{
  "actions": [
    {
      "id": "action-7-player-2-250",
      "round": 7,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
            "row": 8,
            "column": 11
          }
        },
        "reason": "打巢穴：攻擊 生物巢穴 1"
      },
      "result": "succeeded",
      "reason": "打巢穴：攻擊 生物巢穴 1",
      "createdAt": "2026-09-01T17:09:58.109Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 21 (round 8)
- Player: 聶風 (player-2), level 1, experience 14, at (8, 10), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=81/120

```json
{
  "actions": [
    {
      "id": "action-8-player-2-251",
      "round": 8,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.113Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 22 (round 8)
- Player: 聶風 (player-2), level 1, experience 14, at (8, 10), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/120

```json
{
  "actions": [
    {
      "id": "action-8-player-2-252",
      "round": 8,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
            "row": 8,
            "column": 11
          }
        },
        "reason": "打巢穴：攻擊 生物巢穴 1"
      },
      "result": "succeeded",
      "reason": "打巢穴：攻擊 生物巢穴 1",
      "createdAt": "2026-09-01T17:09:58.123Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 23 (round 8)
- Player: 聶風 (player-2), level 1, experience 14, at (9, 10), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/120

```json
{
  "actions": [
    {
      "id": "action-8-player-2-253",
      "round": 8,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:58.134Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 24 (round 9)
- Player: 聶風 (player-2), level 1, experience 16, at (9, 10), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/120

```json
{
  "actions": [
    {
      "id": "action-9-player-2-254",
      "round": 9,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.140Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 25 (round 9)
- Player: 聶風 (player-2), level 1, experience 16, at (9, 9), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/120

```json
{
  "actions": [
    {
      "id": "action-9-player-2-255",
      "round": 9,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.152Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 26 (round 9)
- Player: 聶風 (player-2), level 1, experience 16, at (9, 8), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/120

```json
{
  "actions": [
    {
      "id": "action-9-player-2-256",
      "round": 9,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.168Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 27 (round 10)
- Player: 聶風 (player-2), level 1, experience 16, at (9, 8), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/120

```json
{
  "actions": [
    {
      "id": "action-10-player-2-257",
      "round": 10,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.169Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 28 (round 10)
- Player: 聶風 (player-2), level 1, experience 16, at (8, 8), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/120

```json
{
  "actions": [
    {
      "id": "action-10-player-2-258",
      "round": 10,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.183Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 29 (round 10)
- Player: 聶風 (player-2), level 1, experience 16, at (8, 7), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/120

```json
{
  "actions": [
    {
      "id": "action-10-player-2-259",
      "round": 10,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.198Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 30 (round 11)
- Player: 聶風 (player-2), level 1, experience 16, at (8, 7), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/120

```json
{
  "actions": [
    {
      "id": "action-11-player-2-260",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.198Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 31 (round 11)
- Player: 聶風 (player-2), level 1, experience 16, at (9, 7), health 24, stamina 5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/120

```json
{
  "actions": [
    {
      "id": "action-11-player-2-261",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.212Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 32 (round 11)
- Player: 聶風 (player-2), level 1, experience 16, at (9, 6), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/120

```json
{
  "actions": [
    {
      "id": "action-11-player-2-262",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.225Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 33 (round 12)
- Player: 聶風 (player-2), level 1, experience 20, at (9, 6), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/120

```json
{
  "actions": [
    {
      "id": "action-12-player-2-263",
      "round": 12,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.229Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 34 (round 12)
- Player: 聶風 (player-2), level 1, experience 20, at (8, 6), health 24, stamina 5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/120

```json
{
  "actions": [
    {
      "id": "action-12-player-2-264",
      "round": 12,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.240Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 35 (round 12)
- Player: 聶風 (player-2), level 1, experience 20, at (8, 5), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/120

```json
{
  "actions": [
    {
      "id": "action-12-player-2-265",
      "round": 12,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.252Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 36 (round 12)
- Player: 聶風 (player-2), level 1, experience 20, at (7, 5), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/120

```json
{
  "actions": [
    {
      "id": "action-12-player-2-266",
      "round": 12,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.269Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 37 (round 13)
- Player: 聶風 (player-2), level 1, experience 22, at (7, 5), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-13-player-2-267",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.276Z"
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
      "innerSkillId": "earth-mountain-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 7,
        "column": 11
      },
      "attributes": {
        "armStrength": 5,
        "constitution": 7,
        "agility": 5,
        "innerEnergy": 6,
        "insight": 5
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 1,
      "behaviorType": "scavenger",
      "schoolId": "earth-mountain",
      "homePosition": {
        "row": 8,
        "column": 11
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
      "health": 21,
      "maxHealth": 21,
      "stamina": 5,
      "maxStamina": 5,
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

### Turn 38 (round 13)
- Player: 聶風 (player-2), level 1, experience 22, at (7, 6), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-13-player-2-268",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.292Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 39 (round 13)
- Player: 聶風 (player-2), level 1, experience 22, at (6, 6), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-13-player-2-269",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.305Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 40 (round 14)
- Player: 聶風 (player-2), level 1, experience 24, at (6, 6), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-13-nest-creature-1-270",
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
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:58.309Z"
    },
    {
      "id": "action-14-player-2-271",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.309Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 41 (round 14)
- Player: 聶風 (player-2), level 1, experience 24, at (6, 7), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-14-player-2-272",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.324Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 42 (round 14)
- Player: 聶風 (player-2), level 1, experience 24, at (6, 8), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-14-player-2-273",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.344Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 43 (round 14)
- Player: 聶風 (player-2), level 1, experience 24, at (5, 8), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-14-player-2-274",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.363Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 44 (round 14)
- Player: 聶風 (player-2), level 1, experience 24, at (5, 9), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-14-player-2-275",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.379Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 45 (round 15)
- Player: 聶風 (player-2), level 1, experience 24, at (5, 9), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-14-nest-creature-1-276",
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
      "createdAt": "2026-09-01T17:09:58.379Z"
    },
    {
      "id": "action-15-player-2-277",
      "round": 15,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.379Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 46 (round 15)
- Player: 聶風 (player-2), level 1, experience 24, at (6, 9), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-15-player-2-278",
      "round": 15,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.401Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 47 (round 15)
- Player: 聶風 (player-2), level 1, experience 24, at (5, 9), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-15-player-2-279",
      "round": 15,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.417Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 48 (round 16)
- Player: 聶風 (player-2), level 1, experience 26, at (5, 9), health 19.2, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-15-nest-creature-1-280",
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
            "row": 5,
            "column": 9
          }
        },
        "reason": "與 聶風 交戰。"
      },
      "result": "succeeded",
      "reason": "與 聶風 交戰。",
      "createdAt": "2026-09-01T17:09:58.424Z"
    },
    {
      "id": "action-16-player-2-281",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.425Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-1",
      "creatureName": "生物巢穴 1的怪物 Lv.1",
      "message": "生物巢穴 1的怪物 Lv.1 攻擊 聶風，造成 6 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 49 (round 16)
- Player: 聶風 (player-2), level 1, experience 26, at (4, 9), health 19.2, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-16-player-2-282",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:58.444Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 50 (round 16)
- Player: 聶風 (player-2), level 1, experience 26, at (4, 8), health 19.2, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-16-player-2-283",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:58.464Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 51 (round 16)
- Player: 聶風 (player-2), level 1, experience 26, at (5, 8), health 19.2, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-16-player-2-284",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:58.478Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 52 (round 17)
- Player: 聶風 (player-2), level 1, experience 26, at (5, 8), health 20.4, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-16-nest-creature-1-285",
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
      "createdAt": "2026-09-01T17:09:58.478Z"
    },
    {
      "id": "action-17-player-2-286",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.479Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 53 (round 17)
- Player: 聶風 (player-2), level 1, experience 26, at (5, 7), health 20.4, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-17-player-2-287",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 5,
          "column": 7
        },
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:58.498Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 54 (round 17)
- Player: 聶風 (player-2), level 1, experience 26, at (5, 6), health 20.4, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-17-player-2-288",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:58.520Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 55 (round 17)
- Player: 聶風 (player-2), level 1, experience 26, at (5, 5), health 20.4, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-17-player-2-289",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:58.538Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 56 (round 17)
- Player: 聶風 (player-2), level 1, experience 26, at (5, 6), health 20.4, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-17-player-2-290",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.549Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 57 (round 18)
- Player: 聶風 (player-2), level 1, experience 26, at (5, 6), health 21.599999999999998, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-17-nest-creature-1-291",
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
      "createdAt": "2026-09-01T17:09:58.549Z"
    },
    {
      "id": "action-18-player-2-292",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.549Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 58 (round 18)
- Player: 聶風 (player-2), level 1, experience 26, at (6, 6), health 21.599999999999998, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-18-player-2-293",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.564Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 59 (round 18)
- Player: 聶風 (player-2), level 1, experience 26, at (6, 7), health 21.599999999999998, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-18-player-2-294",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.581Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 60 (round 18)
- Player: 聶風 (player-2), level 1, experience 26, at (6, 8), health 21.599999999999998, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-18-player-2-295",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.595Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 61 (round 18)
- Player: 聶風 (player-2), level 1, experience 26, at (5, 8), health 21.599999999999998, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-18-player-2-296",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.610Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 62 (round 19)
- Player: 聶風 (player-2), level 1, experience 26, at (5, 8), health 22.799999999999997, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-18-nest-creature-1-297",
      "round": 18,
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
          "column": 7
        },
        "reason": "移動接近 礦脈。"
      },
      "result": "succeeded",
      "reason": "移動接近 礦脈。",
      "createdAt": "2026-09-01T17:09:58.620Z"
    },
    {
      "id": "action-19-player-2-298",
      "round": 19,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.620Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 63 (round 19)
- Player: 聶風 (player-2), level 1, experience 26, at (5, 9), health 22.799999999999997, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-19-player-2-299",
      "round": 19,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.643Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 64 (round 19)
- Player: 聶風 (player-2), level 1, experience 26, at (5, 10), health 22.799999999999997, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-19-player-2-300",
      "round": 19,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.659Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 65 (round 19)
- Player: 聶風 (player-2), level 1, experience 26, at (5, 11), health 22.799999999999997, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-19-player-2-301",
      "round": 19,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.675Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 66 (round 19)
- Player: 聶風 (player-2), level 1, experience 26, at (5, 12), health 22.799999999999997, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-19-player-2-302",
      "round": 19,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.686Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 67 (round 20)
- Player: 聶風 (player-2), level 1, experience 26, at (5, 12), health 23.999999999999996, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-19-nest-creature-1-303",
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
          "id": "resource-point-17",
          "kind": "resource",
          "position": {
            "row": 9,
            "column": 7
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:58.687Z"
    },
    {
      "id": "action-20-player-2-304",
      "round": 20,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.687Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "nest-creature-1",
      "creatureName": "生物巢穴 1的怪物 Lv.1",
      "message": "生物巢穴 1的怪物 Lv.1 攻擊礦脈，造成 3 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 68 (round 20)
- Player: 聶風 (player-2), level 1, experience 26, at (6, 12), health 23.999999999999996, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-20-player-2-305",
      "round": 20,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.704Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 69 (round 20)
- Player: 聶風 (player-2), level 1, experience 26, at (7, 12), health 23.999999999999996, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-20-player-2-306",
      "round": 20,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 7,
          "column": 12
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.719Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 70 (round 20)
- Player: 聶風 (player-2), level 1, experience 26, at (7, 11), health 23.999999999999996, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-20-player-2-307",
      "round": 20,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 7,
          "column": 11
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.732Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 71 (round 20)
- Player: 聶風 (player-2), level 1, experience 26, at (7, 10), health 23.999999999999996, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-20-player-2-308",
      "round": 20,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:58.739Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 72 (round 21)
- Player: 聶風 (player-2), level 1, experience 26, at (7, 10), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-20-nest-creature-1-309",
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
          "id": "resource-point-17",
          "kind": "resource",
          "position": {
            "row": 9,
            "column": 7
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:58.740Z"
    },
    {
      "id": "action-21-player-2-310",
      "round": 21,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.740Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 73 (round 21)
- Player: 聶風 (player-2), level 1, experience 26, at (8, 10), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-21-player-2-311",
      "round": 21,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:58.751Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 74 (round 21)
- Player: 聶風 (player-2), level 1, experience 26, at (9, 10), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-21-player-2-312",
      "round": 21,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:58.764Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 75 (round 21)
- Player: 聶風 (player-2), level 1, experience 26, at (9, 11), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-21-player-2-313",
      "round": 21,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:58.776Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 76 (round 21)
- Player: 聶風 (player-2), level 1, experience 26, at (10, 11), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-21-player-2-314",
      "round": 21,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:58.782Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 77 (round 22)
- Player: 聶風 (player-2), level 1, experience 26, at (10, 11), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-21-nest-creature-1-315",
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
          "id": "resource-point-17",
          "kind": "resource",
          "position": {
            "row": 9,
            "column": 7
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:58.783Z"
    },
    {
      "id": "action-22-player-2-316",
      "round": 22,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.783Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 78 (round 22)
- Player: 聶風 (player-2), level 1, experience 26, at (11, 11), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-22-player-2-317",
      "round": 22,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:58.793Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 79 (round 22)
- Player: 聶風 (player-2), level 1, experience 26, at (11, 10), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-22-player-2-318",
      "round": 22,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:58.803Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 80 (round 23)
- Player: 聶風 (player-2), level 1, experience 28, at (11, 10), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-22-nest-creature-1-319",
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
          "id": "resource-point-17",
          "kind": "resource",
          "position": {
            "row": 9,
            "column": 7
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:58.808Z"
    },
    {
      "id": "action-23-player-2-320",
      "round": 23,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.808Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 81 (round 23)
- Player: 聶風 (player-2), level 1, experience 28, at (10, 10), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-23-player-2-321",
      "round": 23,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.819Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 82 (round 23)
- Player: 聶風 (player-2), level 1, experience 28, at (9, 10), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-23-player-2-322",
      "round": 23,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.830Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 83 (round 24)
- Player: 聶風 (player-2), level 1, experience 30, at (9, 10), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-23-nest-creature-1-323",
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
          "id": "resource-point-17",
          "kind": "resource",
          "position": {
            "row": 9,
            "column": 7
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:58.834Z"
    },
    {
      "id": "action-24-player-2-324",
      "round": 24,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.834Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 84 (round 24)
- Player: 聶風 (player-2), level 1, experience 30, at (9, 9), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-24-player-2-325",
      "round": 24,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.846Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 85 (round 24)
- Player: 聶風 (player-2), level 1, experience 30, at (9, 8), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-24-player-2-326",
      "round": 24,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.865Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 86 (round 25)
- Player: 聶風 (player-2), level 1, experience 30, at (9, 8), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-24-nest-creature-1-327",
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
          "id": "resource-point-17",
          "kind": "resource",
          "position": {
            "row": 9,
            "column": 7
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:58.866Z"
    },
    {
      "id": "action-25-player-2-328",
      "round": 25,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.866Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 87 (round 25)
- Player: 聶風 (player-2), level 1, experience 30, at (8, 8), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-25-player-2-329",
      "round": 25,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.883Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 88 (round 25)
- Player: 聶風 (player-2), level 1, experience 30, at (9, 8), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-25-player-2-330",
      "round": 25,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.897Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 89 (round 26)
- Player: 聶風 (player-2), level 1, experience 30, at (9, 8), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-25-nest-creature-1-331",
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
          "id": "resource-point-17",
          "kind": "resource",
          "position": {
            "row": 9,
            "column": 7
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:58.898Z"
    },
    {
      "id": "action-26-player-2-332",
      "round": 26,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.898Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 90 (round 26)
- Player: 聶風 (player-2), level 1, experience 30, at (9, 7), health 24, stamina 5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-26-player-2-333",
      "round": 26,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.915Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 91 (round 26)
- Player: 聶風 (player-2), level 1, experience 30, at (9, 6), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-26-player-2-334",
      "round": 26,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.928Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 92 (round 27)
- Player: 聶風 (player-2), level 1, experience 34, at (9, 6), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-26-nest-creature-1-335",
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
          "id": "resource-point-17",
          "kind": "resource",
          "position": {
            "row": 9,
            "column": 7
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:58.933Z"
    },
    {
      "id": "action-27-player-2-336",
      "round": 27,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.933Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 93 (round 27)
- Player: 聶風 (player-2), level 1, experience 34, at (8, 6), health 24, stamina 5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-27-player-2-337",
      "round": 27,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.947Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 94 (round 27)
- Player: 聶風 (player-2), level 1, experience 34, at (8, 5), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-27-player-2-338",
      "round": 27,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.960Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 95 (round 27)
- Player: 聶風 (player-2), level 1, experience 34, at (7, 5), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-27-player-2-339",
      "round": 27,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:58.979Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 96 (round 28)
- Player: 聶風 (player-2), level 1, experience 36, at (7, 5), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-27-nest-creature-1-340",
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
          "id": "resource-point-17",
          "kind": "resource",
          "position": {
            "row": 9,
            "column": 7
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:58.986Z"
    },
    {
      "id": "action-28-player-2-341",
      "round": 28,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:58.986Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 97 (round 28)
- Player: 聶風 (player-2), level 1, experience 36, at (7, 6), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-28-player-2-342",
      "round": 28,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.005Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 98 (round 28)
- Player: 聶風 (player-2), level 1, experience 36, at (6, 6), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-28-player-2-343",
      "round": 28,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.020Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 99 (round 29)
- Player: 聶風 (player-2), level 1, experience 38, at (6, 6), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-28-nest-creature-1-344",
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
          "id": "resource-point-17",
          "kind": "resource",
          "position": {
            "row": 9,
            "column": 7
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:59.025Z"
    },
    {
      "id": "action-29-player-2-345",
      "round": 29,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.025Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 100 (round 29)
- Player: 聶風 (player-2), level 1, experience 38, at (6, 7), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-29-player-2-346",
      "round": 29,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.043Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 101 (round 29)
- Player: 聶風 (player-2), level 1, experience 38, at (6, 8), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-29-player-2-347",
      "round": 29,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.065Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 102 (round 29)
- Player: 聶風 (player-2), level 1, experience 38, at (5, 8), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-29-player-2-348",
      "round": 29,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.085Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 103 (round 29)
- Player: 聶風 (player-2), level 1, experience 38, at (5, 9), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-29-player-2-349",
      "round": 29,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.096Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 104 (round 30)
- Player: 聶風 (player-2), level 1, experience 38, at (5, 9), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-29-nest-creature-1-350",
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
          "id": "resource-point-45",
          "kind": "resource",
          "position": {
            "row": 8,
            "column": 6
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:59.097Z"
    },
    {
      "id": "action-30-player-2-351",
      "round": 30,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.097Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 105 (round 30)
- Player: 聶風 (player-2), level 1, experience 38, at (5, 10), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-30-player-2-352",
      "round": 30,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.116Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 106 (round 30)
- Player: 聶風 (player-2), level 1, experience 38, at (5, 11), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-30-player-2-353",
      "round": 30,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.132Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 107 (round 30)
- Player: 聶風 (player-2), level 1, experience 38, at (5, 12), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-30-player-2-354",
      "round": 30,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.149Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 108 (round 30)
- Player: 聶風 (player-2), level 1, experience 38, at (6, 12), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-30-player-2-355",
      "round": 30,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.160Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 109 (round 31)
- Player: 聶風 (player-2), level 1, experience 38, at (6, 12), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-30-nest-creature-1-356",
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
          "id": "resource-point-45",
          "kind": "resource",
          "position": {
            "row": 8,
            "column": 6
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:59.160Z"
    },
    {
      "id": "action-31-player-2-357",
      "round": 31,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.161Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 110 (round 31)
- Player: 聶風 (player-2), level 1, experience 38, at (7, 12), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-31-player-2-358",
      "round": 31,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 7,
          "column": 12
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.177Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 111 (round 31)
- Player: 聶風 (player-2), level 1, experience 38, at (7, 11), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-31-player-2-359",
      "round": 31,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 7,
          "column": 11
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.190Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 112 (round 31)
- Player: 聶風 (player-2), level 1, experience 38, at (7, 10), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-31-player-2-360",
      "round": 31,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:59.202Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 113 (round 31)
- Player: 聶風 (player-2), level 1, experience 38, at (8, 10), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-31-player-2-361",
      "round": 31,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.212Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 114 (round 32)
- Player: 聶風 (player-2), level 1, experience 38, at (8, 10), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=76/132

```json
{
  "actions": [
    {
      "id": "action-31-nest-creature-1-362",
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
          "id": "resource-point-45",
          "kind": "resource",
          "position": {
            "row": 8,
            "column": 6
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:59.212Z"
    },
    {
      "id": "action-32-player-2-363",
      "round": 32,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.212Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 115 (round 32)
- Player: 聶風 (player-2), level 1, experience 38, at (8, 10), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=69/132

```json
{
  "actions": [
    {
      "id": "action-32-player-2-364",
      "round": 32,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
            "row": 8,
            "column": 11
          }
        },
        "reason": "打巢穴：攻擊 生物巢穴 1"
      },
      "result": "succeeded",
      "reason": "打巢穴：攻擊 生物巢穴 1",
      "createdAt": "2026-09-01T17:09:59.226Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 116 (round 32)
- Player: 聶風 (player-2), level 1, experience 38, at (9, 10), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=69/132

```json
{
  "actions": [
    {
      "id": "action-32-player-2-365",
      "round": 32,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:59.240Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 117 (round 33)
- Player: 聶風 (player-2), level 1, experience 40, at (9, 10), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=69/132

```json
{
  "actions": [
    {
      "id": "action-32-nest-creature-1-366",
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
          "id": "resource-point-45",
          "kind": "resource",
          "position": {
            "row": 8,
            "column": 6
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:59.244Z"
    },
    {
      "id": "action-33-player-2-367",
      "round": 33,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.244Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 118 (round 33)
- Player: 聶風 (player-2), level 1, experience 40, at (9, 11), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=69/132

```json
{
  "actions": [
    {
      "id": "action-33-player-2-368",
      "round": 33,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.256Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 119 (round 33)
- Player: 聶風 (player-2), level 1, experience 40, at (9, 11), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=64/132

```json
{
  "actions": [
    {
      "id": "action-33-player-2-369",
      "round": 33,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
            "row": 8,
            "column": 11
          }
        },
        "reason": "打巢穴：攻擊 生物巢穴 1"
      },
      "result": "succeeded",
      "reason": "打巢穴：攻擊 生物巢穴 1",
      "createdAt": "2026-09-01T17:09:59.265Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 120 (round 34)
- Player: 聶風 (player-2), level 1, experience 42, at (9, 11), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=64/132

```json
{
  "actions": [
    {
      "id": "action-33-nest-creature-1-370",
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
          "id": "resource-point-45",
          "kind": "resource",
          "position": {
            "row": 8,
            "column": 6
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:59.268Z"
    },
    {
      "id": "action-34-player-2-371",
      "round": 34,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.268Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 121 (round 34)
- Player: 聶風 (player-2), level 1, experience 42, at (9, 11), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-34-player-2-372",
      "round": 34,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
            "row": 8,
            "column": 11
          }
        },
        "reason": "打巢穴：攻擊 生物巢穴 1"
      },
      "result": "succeeded",
      "reason": "打巢穴：攻擊 生物巢穴 1",
      "createdAt": "2026-09-01T17:09:59.277Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 122 (round 34)
- Player: 聶風 (player-2), level 1, experience 42, at (10, 11), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-34-player-2-373",
      "round": 34,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:59.287Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 123 (round 35)
- Player: 聶風 (player-2), level 1, experience 44, at (10, 11), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-34-nest-creature-1-374",
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
          "id": "resource-point-45",
          "kind": "resource",
          "position": {
            "row": 8,
            "column": 6
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:59.290Z"
    },
    {
      "id": "action-35-player-2-375",
      "round": 35,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.291Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 124 (round 35)
- Player: 聶風 (player-2), level 1, experience 44, at (10, 12), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-35-player-2-376",
      "round": 35,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.301Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 125 (round 35)
- Player: 聶風 (player-2), level 1, experience 44, at (9, 12), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-35-player-2-377",
      "round": 35,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.313Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 126 (round 35)
- Player: 聶風 (player-2), level 1, experience 44, at (8, 12), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-35-player-2-378",
      "round": 35,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.325Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 127 (round 35)
- Player: 聶風 (player-2), level 1, experience 44, at (7, 12), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-35-player-2-379",
      "round": 35,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 7,
          "column": 12
        },
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:59.333Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 128 (round 36)
- Player: 聶風 (player-2), level 1, experience 44, at (7, 12), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-35-nest-creature-1-380",
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
          "id": "resource-point-45",
          "kind": "resource",
          "position": {
            "row": 8,
            "column": 6
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:59.333Z"
    },
    {
      "id": "action-36-player-2-381",
      "round": 36,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.333Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 129 (round 36)
- Player: 聶風 (player-2), level 1, experience 44, at (7, 11), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-36-player-2-382",
      "round": 36,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 7,
          "column": 11
        },
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:59.347Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 130 (round 36)
- Player: 聶風 (player-2), level 1, experience 44, at (7, 10), health 24, stamina 4
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-36-player-2-383",
      "round": 36,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:59.359Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 131 (round 36)
- Player: 聶風 (player-2), level 1, experience 44, at (8, 10), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-36-player-2-384",
      "round": 36,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:59.370Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 132 (round 36)
- Player: 聶風 (player-2), level 1, experience 44, at (9, 10), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-36-player-2-385",
      "round": 36,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:59.380Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 133 (round 37)
- Player: 聶風 (player-2), level 1, experience 44, at (9, 10), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-36-nest-creature-1-386",
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
          "id": "resource-point-45",
          "kind": "resource",
          "position": {
            "row": 8,
            "column": 6
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:59.381Z"
    },
    {
      "id": "action-37-player-2-387",
      "round": 37,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.381Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 134 (round 37)
- Player: 聶風 (player-2), level 1, experience 44, at (9, 9), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-37-player-2-388",
      "round": 37,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:59.393Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 135 (round 37)
- Player: 聶風 (player-2), level 1, experience 44, at (9, 8), health 24, stamina 0
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-37-player-2-389",
      "round": 37,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:59.412Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 136 (round 38)
- Player: 聶風 (player-2), level 1, experience 44, at (9, 8), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-37-nest-creature-1-390",
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
          "id": "resource-point-45",
          "kind": "resource",
          "position": {
            "row": 8,
            "column": 6
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:59.413Z"
    },
    {
      "id": "action-38-player-2-391",
      "round": 38,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.413Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 137 (round 38)
- Player: 聶風 (player-2), level 1, experience 44, at (9, 7), health 24, stamina 5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-38-player-2-392",
      "round": 38,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:59.430Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 138 (round 38)
- Player: 聶風 (player-2), level 1, experience 44, at (9, 6), health 24, stamina 2
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-38-player-2-393",
      "round": 38,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:59.443Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 139 (round 39)
- Player: 聶風 (player-2), level 1, experience 48, at (9, 6), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +4
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-38-nest-creature-1-394",
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
          "id": "resource-point-45",
          "kind": "resource",
          "position": {
            "row": 8,
            "column": 6
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:59.448Z"
    },
    {
      "id": "action-39-player-2-395",
      "round": 39,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.448Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 140 (round 39)
- Player: 聶風 (player-2), level 1, experience 48, at (8, 6), health 24, stamina 5
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-39-player-2-396",
      "round": 39,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.463Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 141 (round 39)
- Player: 聶風 (player-2), level 1, experience 48, at (8, 5), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-39-player-2-397",
      "round": 39,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.477Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 142 (round 39)
- Player: 聶風 (player-2), level 1, experience 48, at (7, 5), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-39-player-2-398",
      "round": 39,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.496Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 143 (round 40)
- Player: 聶風 (player-2), level 2, experience 0, at (7, 5), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: -48 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-39-nest-creature-1-399",
      "round": 39,
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
          "id": "resource-point-16",
          "kind": "resource",
          "position": {
            "row": 9,
            "column": 6
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:59.503Z"
    },
    {
      "id": "action-40-player-2-400",
      "round": 40,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.503Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 144 (round 40)
- Player: 聶風 (player-2), level 2, experience 0, at (7, 5), health 24, stamina 8
- Attributes: armStrength=8, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-40-player-2-401",
      "round": 40,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.516Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 145 (round 40)
- Player: 聶風 (player-2), level 2, experience 0, at (7, 5), health 24, stamina 8
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-40-player-2-402",
      "round": 40,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.530Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 146 (round 40)
- Player: 聶風 (player-2), level 2, experience 0, at (7, 6), health 24, stamina 3
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-40-player-2-403",
      "round": 40,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.544Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 147 (round 40)
- Player: 聶風 (player-2), level 2, experience 0, at (6, 6), health 24, stamina 1
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-40-player-2-404",
      "round": 40,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.559Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 148 (round 41)
- Player: 聶風 (player-2), level 2, experience 2, at (6, 6), health 25.35, stamina 8.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-40-nest-creature-1-405",
      "round": 40,
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
          "id": "resource-point-16",
          "kind": "resource",
          "position": {
            "row": 9,
            "column": 6
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:59.564Z"
    },
    {
      "id": "action-41-player-2-406",
      "round": 41,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.564Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 149 (round 41)
- Player: 聶風 (player-2), level 2, experience 2, at (6, 7), health 25.35, stamina 6.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-41-player-2-407",
      "round": 41,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.579Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 150 (round 41)
- Player: 聶風 (player-2), level 2, experience 2, at (6, 8), health 25.35, stamina 4.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-41-player-2-408",
      "round": 41,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.601Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 151 (round 41)
- Player: 聶風 (player-2), level 2, experience 2, at (5, 8), health 25.35, stamina 2.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-41-player-2-409",
      "round": 41,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.617Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 152 (round 41)
- Player: 聶風 (player-2), level 2, experience 2, at (5, 9), health 25.35, stamina 0.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-41-player-2-410",
      "round": 41,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.628Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 153 (round 42)
- Player: 聶風 (player-2), level 2, experience 3, at (5, 9), health 26.700000000000003, stamina 8.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-41-nest-creature-1-411",
      "round": 41,
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
          "id": "resource-point-16",
          "kind": "resource",
          "position": {
            "row": 9,
            "column": 6
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:59.635Z"
    },
    {
      "id": "action-42-player-2-412",
      "round": 42,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.635Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 154 (round 42)
- Player: 聶風 (player-2), level 2, experience 3, at (5, 10), health 26.700000000000003, stamina 6.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-42-player-2-413",
      "round": 42,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.656Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 155 (round 42)
- Player: 聶風 (player-2), level 2, experience 3, at (5, 11), health 26.700000000000003, stamina 4.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-42-player-2-414",
      "round": 42,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.673Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 156 (round 42)
- Player: 聶風 (player-2), level 2, experience 3, at (5, 12), health 26.700000000000003, stamina 2.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-42-player-2-415",
      "round": 42,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.691Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 157 (round 42)
- Player: 聶風 (player-2), level 2, experience 3, at (6, 12), health 26.700000000000003, stamina 0.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-42-player-2-416",
      "round": 42,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.701Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 158 (round 43)
- Player: 聶風 (player-2), level 2, experience 4, at (6, 12), health 27, stamina 8.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-42-nest-creature-1-417",
      "round": 42,
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
          "id": "resource-point-16",
          "kind": "resource",
          "position": {
            "row": 9,
            "column": 6
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:59.706Z"
    },
    {
      "id": "action-43-player-2-418",
      "round": 43,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.707Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 159 (round 43)
- Player: 聶風 (player-2), level 2, experience 4, at (7, 12), health 27, stamina 6.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-43-player-2-419",
      "round": 43,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 7,
          "column": 12
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.722Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 160 (round 43)
- Player: 聶風 (player-2), level 2, experience 4, at (7, 11), health 27, stamina 4.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-43-player-2-420",
      "round": 43,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 7,
          "column": 11
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.734Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 161 (round 43)
- Player: 聶風 (player-2), level 2, experience 4, at (7, 10), health 27, stamina 2.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-43-player-2-421",
      "round": 43,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:59.746Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 162 (round 43)
- Player: 聶風 (player-2), level 2, experience 4, at (8, 10), health 27, stamina 0.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-43-player-2-422",
      "round": 43,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.755Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 163 (round 44)
- Player: 聶風 (player-2), level 2, experience 5, at (8, 10), health 27, stamina 8.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=57/132

```json
{
  "actions": [
    {
      "id": "action-43-nest-creature-1-423",
      "round": 43,
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
          "id": "resource-point-16",
          "kind": "resource",
          "position": {
            "row": 9,
            "column": 6
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:59.758Z"
    },
    {
      "id": "action-44-player-2-424",
      "round": 44,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.759Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 164 (round 44)
- Player: 聶風 (player-2), level 2, experience 5, at (8, 10), health 27, stamina 3.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=47/132

```json
{
  "actions": [
    {
      "id": "action-44-player-2-425",
      "round": 44,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
            "row": 8,
            "column": 11
          }
        },
        "reason": "打巢穴：攻擊 生物巢穴 1"
      },
      "result": "succeeded",
      "reason": "打巢穴：攻擊 生物巢穴 1",
      "createdAt": "2026-09-01T17:09:59.770Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 165 (round 44)
- Player: 聶風 (player-2), level 2, experience 5, at (9, 10), health 27, stamina 1.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=47/132

```json
{
  "actions": [
    {
      "id": "action-44-player-2-426",
      "round": 44,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:59.780Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 166 (round 45)
- Player: 聶風 (player-2), level 2, experience 8, at (9, 10), health 27, stamina 8.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=47/132

```json
{
  "actions": [
    {
      "id": "action-44-nest-creature-1-427",
      "round": 44,
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
          "id": "resource-point-16",
          "kind": "resource",
          "position": {
            "row": 9,
            "column": 6
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:59.785Z"
    },
    {
      "id": "action-45-player-2-428",
      "round": 45,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.786Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 167 (round 45)
- Player: 聶風 (player-2), level 2, experience 8, at (9, 11), health 27, stamina 6.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=47/132

```json
{
  "actions": [
    {
      "id": "action-45-player-2-429",
      "round": 45,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.800Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 168 (round 45)
- Player: 聶風 (player-2), level 2, experience 8, at (9, 11), health 27, stamina 1.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=40/132

```json
{
  "actions": [
    {
      "id": "action-45-player-2-430",
      "round": 45,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
            "row": 8,
            "column": 11
          }
        },
        "reason": "打巢穴：攻擊 生物巢穴 1"
      },
      "result": "succeeded",
      "reason": "打巢穴：攻擊 生物巢穴 1",
      "createdAt": "2026-09-01T17:09:59.809Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 169 (round 46)
- Player: 聶風 (player-2), level 2, experience 11, at (9, 11), health 27, stamina 8.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=40/132

```json
{
  "actions": [
    {
      "id": "action-45-nest-creature-1-431",
      "round": 45,
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
          "id": "resource-point-16",
          "kind": "resource",
          "position": {
            "row": 9,
            "column": 6
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:59.812Z"
    },
    {
      "id": "action-46-player-2-432",
      "round": 46,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.812Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 170 (round 46)
- Player: 聶風 (player-2), level 2, experience 11, at (9, 11), health 27, stamina 3.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=33/132

```json
{
  "actions": [
    {
      "id": "action-46-player-2-433",
      "round": 46,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
            "row": 8,
            "column": 11
          }
        },
        "reason": "打巢穴：攻擊 生物巢穴 1"
      },
      "result": "succeeded",
      "reason": "打巢穴：攻擊 生物巢穴 1",
      "createdAt": "2026-09-01T17:09:59.821Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 171 (round 46)
- Player: 聶風 (player-2), level 2, experience 11, at (10, 11), health 27, stamina 1.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=33/132

```json
{
  "actions": [
    {
      "id": "action-46-player-2-434",
      "round": 46,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:59.830Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 172 (round 47)
- Player: 聶風 (player-2), level 2, experience 14, at (10, 11), health 27, stamina 8.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=33/132

```json
{
  "actions": [
    {
      "id": "action-46-nest-creature-1-435",
      "round": 46,
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
          "id": "resource-point-16",
          "kind": "resource",
          "position": {
            "row": 9,
            "column": 6
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:59.833Z"
    },
    {
      "id": "action-47-player-2-436",
      "round": 47,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.834Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 173 (round 47)
- Player: 聶風 (player-2), level 2, experience 14, at (10, 12), health 27, stamina 6.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=33/132

```json
{
  "actions": [
    {
      "id": "action-47-player-2-437",
      "round": 47,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.844Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 174 (round 47)
- Player: 聶風 (player-2), level 2, experience 14, at (9, 12), health 27, stamina 4.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=33/132

```json
{
  "actions": [
    {
      "id": "action-47-player-2-438",
      "round": 47,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.857Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 175 (round 47)
- Player: 聶風 (player-2), level 2, experience 14, at (8, 12), health 27, stamina 2.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=33/132

```json
{
  "actions": [
    {
      "id": "action-47-player-2-439",
      "round": 47,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.870Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 176 (round 47)
- Player: 聶風 (player-2), level 2, experience 14, at (7, 12), health 27, stamina 0.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=33/132

```json
{
  "actions": [
    {
      "id": "action-47-player-2-440",
      "round": 47,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 7,
          "column": 12
        },
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:59.877Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 177 (round 48)
- Player: 聶風 (player-2), level 2, experience 15, at (7, 12), health 27, stamina 8.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +1
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=33/132

```json
{
  "actions": [
    {
      "id": "action-47-nest-creature-1-441",
      "round": 47,
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
          "id": "resource-point-16",
          "kind": "resource",
          "position": {
            "row": 9,
            "column": 6
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:59.882Z"
    },
    {
      "id": "action-48-player-2-442",
      "round": 48,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.882Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 178 (round 48)
- Player: 聶風 (player-2), level 2, experience 15, at (7, 11), health 27, stamina 6.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=33/132

```json
{
  "actions": [
    {
      "id": "action-48-player-2-443",
      "round": 48,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "destination": {
          "row": 7,
          "column": 11
        },
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.894Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 179 (round 48)
- Player: 聶風 (player-2), level 2, experience 15, at (7, 11), health 27, stamina 1.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=23/132

```json
{
  "actions": [
    {
      "id": "action-48-player-2-444",
      "round": 48,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
            "row": 8,
            "column": 11
          }
        },
        "reason": "打巢穴：攻擊 生物巢穴 1"
      },
      "result": "succeeded",
      "reason": "打巢穴：攻擊 生物巢穴 1",
      "createdAt": "2026-09-01T17:09:59.905Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 180 (round 49)
- Player: 聶風 (player-2), level 2, experience 18, at (7, 11), health 27, stamina 8.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=23/132

```json
{
  "actions": [
    {
      "id": "action-48-nest-creature-1-445",
      "round": 48,
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
          "id": "resource-point-16",
          "kind": "resource",
          "position": {
            "row": 9,
            "column": 6
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:59.909Z"
    },
    {
      "id": "action-49-player-2-446",
      "round": 49,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.909Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 181 (round 49)
- Player: 聶風 (player-2), level 2, experience 18, at (7, 11), health 27, stamina 3.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=13/132

```json
{
  "actions": [
    {
      "id": "action-49-player-2-447",
      "round": 49,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
            "row": 8,
            "column": 11
          }
        },
        "reason": "打巢穴：攻擊 生物巢穴 1"
      },
      "result": "succeeded",
      "reason": "打巢穴：攻擊 生物巢穴 1",
      "createdAt": "2026-09-01T17:09:59.919Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 182 (round 49)
- Player: 聶風 (player-2), level 2, experience 18, at (7, 10), health 27, stamina 1.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=13/132

```json
{
  "actions": [
    {
      "id": "action-49-player-2-448",
      "round": 49,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "探索：移動到未探索格 (11,4)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (11,4)",
      "createdAt": "2026-09-01T17:09:59.930Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 183 (round 50)
- Player: 聶風 (player-2), level 2, experience 21, at (7, 10), health 27, stamina 8.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=13/132

```json
{
  "actions": [
    {
      "id": "action-49-nest-creature-1-449",
      "round": 49,
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
          "id": "resource-point-7",
          "kind": "resource",
          "position": {
            "row": 10,
            "column": 7
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:59.934Z"
    },
    {
      "id": "action-50-player-2-450",
      "round": 50,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.935Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 184 (round 50)
- Player: 聶風 (player-2), level 2, experience 21, at (8, 10), health 27, stamina 6.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=13/132

```json
{
  "actions": [
    {
      "id": "action-50-player-2-451",
      "round": 50,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
        "reason": "打巢穴：移動到 生物巢穴 1 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 1 附近",
      "createdAt": "2026-09-01T17:09:59.945Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 185 (round 50)
- Player: 聶風 (player-2), level 2, experience 21, at (8, 10), health 27, stamina 1.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=3/132

```json
{
  "actions": [
    {
      "id": "action-50-player-2-452",
      "round": 50,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
            "row": 8,
            "column": 11
          }
        },
        "reason": "打巢穴：攻擊 生物巢穴 1"
      },
      "result": "succeeded",
      "reason": "打巢穴：攻擊 生物巢穴 1",
      "createdAt": "2026-09-01T17:09:59.955Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 186 (round 51)
- Player: 聶風 (player-2), level 2, experience 24, at (8, 10), health 27, stamina 8.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=3/132

```json
{
  "actions": [
    {
      "id": "action-50-nest-creature-1-453",
      "round": 50,
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
          "id": "resource-point-7",
          "kind": "resource",
          "position": {
            "row": 10,
            "column": 7
          }
        },
        "reason": "與 礦脈 交戰。"
      },
      "result": "succeeded",
      "reason": "與 礦脈 交戰。",
      "createdAt": "2026-09-01T17:09:59.959Z"
    },
    {
      "id": "action-51-player-2-454",
      "round": 51,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
      "createdAt": "2026-09-01T17:09:59.959Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 187 (round 51)
- Player: 聶風 (player-2), level 2, experience 24, at (8, 10), health 27, stamina 3.5
- Attributes: armStrength=9, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: none

```json
{
  "actions": [
    {
      "id": "action-51-player-2-455",
      "round": 51,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "聶風"
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
            "row": 8,
            "column": 11
          }
        },
        "reason": "打巢穴：攻擊 生物巢穴 1"
      },
      "result": "succeeded",
      "reason": "打巢穴：攻擊 生物巢穴 1",
      "createdAt": "2026-09-01T17:09:59.970Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

