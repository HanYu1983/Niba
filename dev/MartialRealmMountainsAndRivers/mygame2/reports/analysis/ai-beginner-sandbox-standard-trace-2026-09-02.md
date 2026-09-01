# AI Beginner Sandbox Standard Trace

- AI turns: 54
- Final round: 18
- Game won: false
- Game over: true
- Remaining nests: 3

## Aggregate

- Action counts: hold=153, move=31, attack=25, end-turn=17, allocate-attribute=2, collect=1, use-item=1
- Creatures spawned (total): 3
- Creatures defeated (total): 2
- Level-ups observed: 2
- Final player: level 3, experience 0, inner skill 吐納功 (tuna-gong) lv.2 damage 7
- Final attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Nest health (start → end): creature-nest-1=120→120, creature-nest-2=120→132, creature-nest-3=120→132.52999999999994

## Turn Trace

### Turn 1 (round 1)
- Player: 胡斐 (player-2), level 1, experience 0, at (12, 9), health 24, stamina 6
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-1-player-2-1",
      "round": 1,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
        "reason": "打巢穴：移動到 生物巢穴 3 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 3 附近",
      "createdAt": "2026-09-01T17:09:57.530Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 2 (round 1)
- Player: 胡斐 (player-2), level 1, experience 0, at (11, 9), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-1-player-2-2",
      "round": 1,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
        "reason": "打巢穴：先接近巢穴附近生物 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "打巢穴：先接近巢穴附近生物 游蕩妖物",
      "createdAt": "2026-09-01T17:09:57.545Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 3 (round 2)
- Player: 胡斐 (player-2), level 1, experience 2, at (11, 9), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-1-roamer-creature-1-3",
      "round": 1,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.553Z"
    },
    {
      "id": "action-1-roamer-creature-2-4",
      "round": 1,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.553Z"
    },
    {
      "id": "action-1-roamer-creature-3-5",
      "round": 1,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.553Z"
    },
    {
      "id": "action-1-roamer-creature-4-6",
      "round": 1,
      "actor": {
        "id": "roamer-creature-4",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-4",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.554Z"
    },
    {
      "id": "action-1-roamer-creature-5-7",
      "round": 1,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.554Z"
    },
    {
      "id": "action-1-roamer-creature-6-8",
      "round": 1,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.554Z"
    },
    {
      "id": "action-1-roamer-creature-7-9",
      "round": 1,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.554Z"
    },
    {
      "id": "action-1-roamer-creature-8-10",
      "round": 1,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.554Z"
    },
    {
      "id": "action-1-roamer-creature-9-11",
      "round": 1,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.554Z"
    },
    {
      "id": "action-1-roamer-creature-10-12",
      "round": 1,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.554Z"
    },
    {
      "id": "action-2-player-2-13",
      "round": 2,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
      "createdAt": "2026-09-01T17:09:57.558Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 4 (round 2)
- Player: 胡斐 (player-2), level 1, experience 5, at (11, 9), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-2-player-2-14",
      "round": 2,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "roamer-creature-4",
          "kind": "creature",
          "position": {
            "row": 10,
            "column": 9
          }
        },
        "reason": "打巢穴：先清除巢穴附近生物 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "打巢穴：先清除巢穴附近生物 游蕩妖物",
      "createdAt": "2026-09-01T17:09:57.570Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 5 (round 2)
- Player: 胡斐 (player-2), level 1, experience 5, at (12, 9), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-2-player-2-15",
      "round": 2,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
      "createdAt": "2026-09-01T17:09:57.578Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 6 (round 3)
- Player: 胡斐 (player-2), level 1, experience 7, at (12, 9), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-2-roamer-creature-1-16",
      "round": 2,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.581Z"
    },
    {
      "id": "action-2-roamer-creature-2-17",
      "round": 2,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.581Z"
    },
    {
      "id": "action-2-roamer-creature-3-18",
      "round": 2,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.581Z"
    },
    {
      "id": "action-2-roamer-creature-4-19",
      "round": 2,
      "actor": {
        "id": "roamer-creature-4",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-4",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.581Z"
    },
    {
      "id": "action-2-roamer-creature-5-20",
      "round": 2,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.581Z"
    },
    {
      "id": "action-2-roamer-creature-6-21",
      "round": 2,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.581Z"
    },
    {
      "id": "action-2-roamer-creature-7-22",
      "round": 2,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.581Z"
    },
    {
      "id": "action-2-roamer-creature-8-23",
      "round": 2,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.581Z"
    },
    {
      "id": "action-2-roamer-creature-9-24",
      "round": 2,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.581Z"
    },
    {
      "id": "action-2-roamer-creature-10-25",
      "round": 2,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.581Z"
    },
    {
      "id": "action-3-player-2-26",
      "round": 3,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
      "createdAt": "2026-09-01T17:09:57.582Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 7 (round 3)
- Player: 胡斐 (player-2), level 1, experience 10, at (12, 9), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-3-player-2-27",
      "round": 3,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "roamer-creature-4",
          "kind": "creature",
          "position": {
            "row": 11,
            "column": 9
          }
        },
        "reason": "打巢穴：先清除巢穴附近生物 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "打巢穴：先清除巢穴附近生物 游蕩妖物",
      "createdAt": "2026-09-01T17:09:57.589Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 8 (round 3)
- Player: 胡斐 (player-2), level 1, experience 10, at (12, 8), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-3-player-2-28",
      "round": 3,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
      "createdAt": "2026-09-01T17:09:57.594Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 9 (round 4)
- Player: 胡斐 (player-2), level 1, experience 12, at (12, 8), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-3-roamer-creature-1-29",
      "round": 3,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.599Z"
    },
    {
      "id": "action-3-roamer-creature-2-30",
      "round": 3,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.599Z"
    },
    {
      "id": "action-3-roamer-creature-3-31",
      "round": 3,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.599Z"
    },
    {
      "id": "action-3-roamer-creature-4-32",
      "round": 3,
      "actor": {
        "id": "roamer-creature-4",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-4",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.599Z"
    },
    {
      "id": "action-3-roamer-creature-5-33",
      "round": 3,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.599Z"
    },
    {
      "id": "action-3-roamer-creature-6-34",
      "round": 3,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.599Z"
    },
    {
      "id": "action-3-roamer-creature-7-35",
      "round": 3,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.599Z"
    },
    {
      "id": "action-3-roamer-creature-8-36",
      "round": 3,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.599Z"
    },
    {
      "id": "action-3-roamer-creature-9-37",
      "round": 3,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.599Z"
    },
    {
      "id": "action-3-roamer-creature-10-38",
      "round": 3,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.599Z"
    },
    {
      "id": "action-4-player-2-39",
      "round": 4,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
      "createdAt": "2026-09-01T17:09:57.599Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 10 (round 4)
- Player: 胡斐 (player-2), level 1, experience 15, at (12, 8), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-4-player-2-40",
      "round": 4,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "roamer-creature-4",
          "kind": "creature",
          "position": {
            "row": 12,
            "column": 9
          }
        },
        "reason": "打巢穴：先清除巢穴附近生物 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "打巢穴：先清除巢穴附近生物 游蕩妖物",
      "createdAt": "2026-09-01T17:09:57.611Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 11 (round 4)
- Player: 胡斐 (player-2), level 1, experience 15, at (12, 7), health 24, stamina 1
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/120, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-4-player-2-41",
      "round": 4,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T17:09:57.619Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 12 (round 5)
- Player: 胡斐 (player-2), level 1, experience 17, at (12, 7), health 24, stamina 8
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/132, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-4-roamer-creature-1-42",
      "round": 4,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.624Z"
    },
    {
      "id": "action-4-roamer-creature-2-43",
      "round": 4,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.624Z"
    },
    {
      "id": "action-4-roamer-creature-3-44",
      "round": 4,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.624Z"
    },
    {
      "id": "action-4-roamer-creature-4-45",
      "round": 4,
      "actor": {
        "id": "roamer-creature-4",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-4",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.624Z"
    },
    {
      "id": "action-4-roamer-creature-5-46",
      "round": 4,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.624Z"
    },
    {
      "id": "action-4-roamer-creature-6-47",
      "round": 4,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.624Z"
    },
    {
      "id": "action-4-roamer-creature-7-48",
      "round": 4,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.624Z"
    },
    {
      "id": "action-4-roamer-creature-8-49",
      "round": 4,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.624Z"
    },
    {
      "id": "action-4-roamer-creature-9-50",
      "round": 4,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.624Z"
    },
    {
      "id": "action-4-roamer-creature-10-51",
      "round": 4,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.624Z"
    },
    {
      "id": "action-5-player-2-52",
      "round": 5,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
      "createdAt": "2026-09-01T17:09:57.626Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "creature-nest-2",
      "creatureName": "生物巢穴 2",
      "message": "生物巢穴 2 生成了 Lv.1 怪物。"
    }
  ],
  "spawnedCreatures": [
    {
      "id": "nest-creature-1",
      "name": "生物巢穴 2的怪物 Lv.1",
      "innerSkillId": "yellow-earth-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 3,
        "column": 3
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
      "behaviorType": "scavenger",
      "schoolId": "yellow-earth",
      "homePosition": {
        "row": 4,
        "column": 3
      },
      "homeNestId": "creature-nest-2",
      "spawnedRound": 5,
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

### Turn 13 (round 5)
- Player: 胡斐 (player-2), level 2, experience 7, at (12, 7), health 24, stamina 3
- Attributes: armStrength=8, constitution=8, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: -10 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: roamer-creature-4
- Nests: creature-nest-1=120/120, creature-nest-2=120/132, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-5-player-2-53",
      "round": 5,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "roamer-creature-4",
          "kind": "creature",
          "position": {
            "row": 12,
            "column": 8
          }
        },
        "reason": "打巢穴：先清除巢穴附近生物 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "打巢穴：先清除巢穴附近生物 游蕩妖物",
      "createdAt": "2026-09-01T17:09:57.632Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 14 (round 5)
- Player: 胡斐 (player-2), level 2, experience 7, at (12, 7), health 24, stamina 3
- Attributes: armStrength=8, constitution=9, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/132, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-5-player-2-54",
      "round": 5,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
      "createdAt": "2026-09-01T17:09:57.642Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 15 (round 5)
- Player: 胡斐 (player-2), level 2, experience 7, at (12, 7), health 24, stamina 3
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/132, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-5-player-2-55",
      "round": 5,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
      "createdAt": "2026-09-01T17:09:57.649Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 16 (round 5)
- Player: 胡斐 (player-2), level 2, experience 7, at (11, 7), health 24, stamina 1
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=120/132, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-5-player-2-56",
      "round": 5,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
        "reason": "打巢穴：先接近巢穴附近生物 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "打巢穴：先接近巢穴附近生物 游蕩妖物",
      "createdAt": "2026-09-01T17:09:57.658Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 17 (round 6)
- Player: 胡斐 (player-2), level 2, experience 9, at (11, 7), health 20.5, stamina 8
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=121.32/132, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-5-roamer-creature-1-57",
      "round": 5,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.661Z"
    },
    {
      "id": "action-5-roamer-creature-2-58",
      "round": 5,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.661Z"
    },
    {
      "id": "action-5-roamer-creature-3-59",
      "round": 5,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.661Z"
    },
    {
      "id": "action-5-roamer-creature-5-60",
      "round": 5,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "roamer-creature-5",
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
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-01T17:09:57.662Z"
    },
    {
      "id": "action-5-roamer-creature-6-61",
      "round": 5,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.662Z"
    },
    {
      "id": "action-5-roamer-creature-7-62",
      "round": 5,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.662Z"
    },
    {
      "id": "action-5-roamer-creature-8-63",
      "round": 5,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.662Z"
    },
    {
      "id": "action-5-roamer-creature-9-64",
      "round": 5,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.662Z"
    },
    {
      "id": "action-5-roamer-creature-10-65",
      "round": 5,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.662Z"
    },
    {
      "id": "action-5-nest-creature-1-66",
      "round": 5,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
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
      "createdAt": "2026-09-01T17:09:57.662Z"
    },
    {
      "id": "action-6-player-2-67",
      "round": 6,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
      "createdAt": "2026-09-01T17:09:57.663Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 18 (round 6)
- Player: 胡斐 (player-2), level 2, experience 12, at (11, 7), health 20.5, stamina 3
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=121.32/132, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-6-player-2-68",
      "round": 6,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "roamer-creature-5",
          "kind": "creature",
          "position": {
            "row": 10,
            "column": 7
          }
        },
        "reason": "打巢穴：先清除巢穴附近生物 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "打巢穴：先清除巢穴附近生物 游蕩妖物",
      "createdAt": "2026-09-01T17:09:57.670Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 19 (round 6)
- Player: 胡斐 (player-2), level 2, experience 12, at (12, 7), health 20.5, stamina 1
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=121.32/132, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-6-player-2-69",
      "round": 6,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
        "reason": "定位：前往出口 (12,7)"
      },
      "result": "succeeded",
      "reason": "定位：前往出口 (12,7)",
      "createdAt": "2026-09-01T17:09:57.676Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 20 (round 7)
- Player: 胡斐 (player-2), level 2, experience 14, at (12, 7), health 22, stamina 8
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=122.63999999999999/132, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-6-roamer-creature-1-70",
      "round": 6,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.681Z"
    },
    {
      "id": "action-6-roamer-creature-2-71",
      "round": 6,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.681Z"
    },
    {
      "id": "action-6-roamer-creature-3-72",
      "round": 6,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.681Z"
    },
    {
      "id": "action-6-roamer-creature-5-73",
      "round": 6,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.681Z"
    },
    {
      "id": "action-6-roamer-creature-6-74",
      "round": 6,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.681Z"
    },
    {
      "id": "action-6-roamer-creature-7-75",
      "round": 6,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.681Z"
    },
    {
      "id": "action-6-roamer-creature-8-76",
      "round": 6,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.681Z"
    },
    {
      "id": "action-6-roamer-creature-9-77",
      "round": 6,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.682Z"
    },
    {
      "id": "action-6-roamer-creature-10-78",
      "round": 6,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.682Z"
    },
    {
      "id": "action-6-nest-creature-1-79",
      "round": 6,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
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
      "createdAt": "2026-09-01T17:09:57.682Z"
    },
    {
      "id": "action-7-player-2-80",
      "round": 7,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
      "createdAt": "2026-09-01T17:09:57.682Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 21 (round 7)
- Player: 胡斐 (player-2), level 2, experience 17, at (12, 7), health 22, stamina 3
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=122.63999999999999/132, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-7-player-2-81",
      "round": 7,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "roamer-creature-5",
          "kind": "creature",
          "position": {
            "row": 11,
            "column": 7
          }
        },
        "reason": "打巢穴：先清除巢穴附近生物 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "打巢穴：先清除巢穴附近生物 游蕩妖物",
      "createdAt": "2026-09-01T17:09:57.689Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 22 (round 7)
- Player: 胡斐 (player-2), level 2, experience 17, at (12, 6), health 22, stamina 1
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=122.63999999999999/132, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-7-player-2-82",
      "round": 7,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T17:09:57.695Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 23 (round 8)
- Player: 胡斐 (player-2), level 2, experience 19, at (12, 6), health 23.5, stamina 8
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=123.95999999999998/132, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-7-roamer-creature-1-83",
      "round": 7,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.698Z"
    },
    {
      "id": "action-7-roamer-creature-2-84",
      "round": 7,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.698Z"
    },
    {
      "id": "action-7-roamer-creature-3-85",
      "round": 7,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.698Z"
    },
    {
      "id": "action-7-roamer-creature-5-86",
      "round": 7,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.698Z"
    },
    {
      "id": "action-7-roamer-creature-6-87",
      "round": 7,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.698Z"
    },
    {
      "id": "action-7-roamer-creature-7-88",
      "round": 7,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.698Z"
    },
    {
      "id": "action-7-roamer-creature-8-89",
      "round": 7,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.698Z"
    },
    {
      "id": "action-7-roamer-creature-9-90",
      "round": 7,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.698Z"
    },
    {
      "id": "action-7-roamer-creature-10-91",
      "round": 7,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.698Z"
    },
    {
      "id": "action-7-nest-creature-1-92",
      "round": 7,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
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
      "createdAt": "2026-09-01T17:09:57.698Z"
    },
    {
      "id": "action-8-player-2-93",
      "round": 8,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
      "createdAt": "2026-09-01T17:09:57.699Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 24 (round 8)
- Player: 胡斐 (player-2), level 2, experience 22, at (12, 6), health 23.5, stamina 3
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=123.95999999999998/132, creature-nest-3=120/120

```json
{
  "actions": [
    {
      "id": "action-8-player-2-94",
      "round": 8,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "roamer-creature-5",
          "kind": "creature",
          "position": {
            "row": 12,
            "column": 7
          }
        },
        "reason": "打巢穴：先清除巢穴附近生物 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "打巢穴：先清除巢穴附近生物 游蕩妖物",
      "createdAt": "2026-09-01T17:09:57.704Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 25 (round 9)
- Player: 胡斐 (player-2), level 2, experience 28, at (12, 6), health 25, stamina 8
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +6
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=125.27999999999997/132, creature-nest-3=120/132

```json
{
  "actions": [
    {
      "id": "action-8-roamer-creature-1-95",
      "round": 8,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.707Z"
    },
    {
      "id": "action-8-roamer-creature-2-96",
      "round": 8,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.707Z"
    },
    {
      "id": "action-8-roamer-creature-3-97",
      "round": 8,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.707Z"
    },
    {
      "id": "action-8-roamer-creature-5-98",
      "round": 8,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "target": {
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 12,
            "column": 6
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-01T17:09:57.707Z"
    },
    {
      "id": "action-8-roamer-creature-6-99",
      "round": 8,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.707Z"
    },
    {
      "id": "action-8-roamer-creature-7-100",
      "round": 8,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.707Z"
    },
    {
      "id": "action-8-roamer-creature-8-101",
      "round": 8,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.707Z"
    },
    {
      "id": "action-8-roamer-creature-9-102",
      "round": 8,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.707Z"
    },
    {
      "id": "action-8-roamer-creature-10-103",
      "round": 8,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.707Z"
    },
    {
      "id": "action-8-nest-creature-1-104",
      "round": 8,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
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
      "createdAt": "2026-09-01T17:09:57.708Z"
    },
    {
      "id": "action-9-player-2-105",
      "round": 9,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
      "createdAt": "2026-09-01T17:09:57.708Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "roamer-creature-5",
      "creatureName": "游蕩妖物",
      "message": "游蕩妖物 攻擊 胡斐，被閃避。"
    },
    {
      "creatureId": "creature-nest-3",
      "creatureName": "生物巢穴 3",
      "message": "生物巢穴 3 生成了 Lv.1 怪物。"
    }
  ],
  "spawnedCreatures": [
    {
      "id": "nest-creature-2",
      "name": "生物巢穴 3的怪物 Lv.1",
      "innerSkillId": "void-spirit-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 10,
        "column": 8
      },
      "attributes": {
        "armStrength": 6,
        "constitution": 6,
        "agility": 5,
        "innerEnergy": 5,
        "insight": 6
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 1,
      "behaviorType": "scavenger",
      "schoolId": "void-spirit",
      "homePosition": {
        "row": 11,
        "column": 8
      },
      "homeNestId": "creature-nest-3",
      "spawnedRound": 9,
      "baseAttributes": {
        "armStrength": 5,
        "constitution": 5,
        "agility": 5,
        "innerEnergy": 5,
        "insight": 5
      },
      "health": 18,
      "maxHealth": 18,
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

### Turn 26 (round 9)
- Player: 胡斐 (player-2), level 2, experience 31, at (12, 6), health 25, stamina 3
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=125.27999999999997/132, creature-nest-3=120/132

```json
{
  "actions": [
    {
      "id": "action-9-player-2-106",
      "round": 9,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "roamer-creature-5",
          "kind": "creature",
          "position": {
            "row": 12,
            "column": 7
          }
        },
        "reason": "打巢穴：先清除巢穴附近生物 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "打巢穴：先清除巢穴附近生物 游蕩妖物",
      "createdAt": "2026-09-01T17:09:57.713Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 27 (round 10)
- Player: 胡斐 (player-2), level 2, experience 37, at (12, 6), health 21.5, stamina 8
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +6
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=126.59999999999997/132, creature-nest-3=121.32/132

```json
{
  "actions": [
    {
      "id": "action-9-roamer-creature-1-107",
      "round": 9,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.715Z"
    },
    {
      "id": "action-9-roamer-creature-2-108",
      "round": 9,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.715Z"
    },
    {
      "id": "action-9-roamer-creature-3-109",
      "round": 9,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.715Z"
    },
    {
      "id": "action-9-roamer-creature-5-110",
      "round": 9,
      "actor": {
        "id": "roamer-creature-5",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "roamer-creature-5",
          "kind": "creature"
        },
        "target": {
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 12,
            "column": 6
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-01T17:09:57.715Z"
    },
    {
      "id": "action-9-roamer-creature-6-111",
      "round": 9,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.715Z"
    },
    {
      "id": "action-9-roamer-creature-7-112",
      "round": 9,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.715Z"
    },
    {
      "id": "action-9-roamer-creature-8-113",
      "round": 9,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.715Z"
    },
    {
      "id": "action-9-roamer-creature-9-114",
      "round": 9,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.715Z"
    },
    {
      "id": "action-9-roamer-creature-10-115",
      "round": 9,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.715Z"
    },
    {
      "id": "action-9-nest-creature-1-116",
      "round": 9,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
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
      "createdAt": "2026-09-01T17:09:57.715Z"
    },
    {
      "id": "action-9-nest-creature-2-117",
      "round": 9,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-2",
          "kind": "creature"
        },
        "destination": {
          "row": 11,
          "column": 7
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-01T17:09:57.716Z"
    },
    {
      "id": "action-10-player-2-118",
      "round": 10,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
      "createdAt": "2026-09-01T17:09:57.716Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 28 (round 10)
- Player: 胡斐 (player-2), level 2, experience 57, at (12, 6), health 21.5, stamina 3
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: roamer-creature-5
- Nests: creature-nest-1=120/120, creature-nest-2=126.59999999999997/132, creature-nest-3=121.32/132

```json
{
  "actions": [
    {
      "id": "action-10-player-2-119",
      "round": 10,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "player-2",
          "kind": "player"
        },
        "target": {
          "id": "roamer-creature-5",
          "kind": "creature",
          "position": {
            "row": 12,
            "column": 7
          }
        },
        "reason": "打巢穴：先清除巢穴附近生物 游蕩妖物"
      },
      "result": "succeeded",
      "reason": "打巢穴：先清除巢穴附近生物 游蕩妖物",
      "createdAt": "2026-09-01T17:09:57.723Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 29 (round 10)
- Player: 胡斐 (player-2), level 2, experience 57, at (12, 7), health 21.5, stamina 1
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=126.59999999999997/132, creature-nest-3=121.32/132

```json
{
  "actions": [
    {
      "id": "action-10-player-2-120",
      "round": 10,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
        "reason": "打巢穴：先接近巢穴附近生物 生物巢穴 3的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "打巢穴：先接近巢穴附近生物 生物巢穴 3的怪物 Lv.1",
      "createdAt": "2026-09-01T17:09:57.729Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 30 (round 11)
- Player: 胡斐 (player-2), level 2, experience 59, at (12, 7), health 21, stamina 8
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 1, damage 5
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=127.91999999999996/132, creature-nest-3=122.63999999999999/132

```json
{
  "actions": [
    {
      "id": "action-10-roamer-creature-1-121",
      "round": 10,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.732Z"
    },
    {
      "id": "action-10-roamer-creature-2-122",
      "round": 10,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.733Z"
    },
    {
      "id": "action-10-roamer-creature-3-123",
      "round": 10,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.733Z"
    },
    {
      "id": "action-10-roamer-creature-6-124",
      "round": 10,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.733Z"
    },
    {
      "id": "action-10-roamer-creature-7-125",
      "round": 10,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.733Z"
    },
    {
      "id": "action-10-roamer-creature-8-126",
      "round": 10,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.733Z"
    },
    {
      "id": "action-10-roamer-creature-9-127",
      "round": 10,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.733Z"
    },
    {
      "id": "action-10-roamer-creature-10-128",
      "round": 10,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.733Z"
    },
    {
      "id": "action-10-nest-creature-1-129",
      "round": 10,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 7
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T17:09:57.733Z"
    },
    {
      "id": "action-10-nest-creature-2-130",
      "round": 10,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.1"
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
            "column": 7
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-01T17:09:57.733Z"
    },
    {
      "id": "action-11-player-2-131",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
      "createdAt": "2026-09-01T17:09:57.734Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "roamer-creature-2",
      "creatureName": "游蕩妖物",
      "message": "游蕩妖物 發現並摧毀了道具點。"
    },
    {
      "creatureId": "nest-creature-2",
      "creatureName": "生物巢穴 3的怪物 Lv.1",
      "message": "生物巢穴 3的怪物 Lv.1 攻擊 胡斐，造成 2 點傷害（根骨減傷）。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 31 (round 11)
- Player: 胡斐 (player-2), level 2, experience 62, at (12, 7), health 21, stamina 3
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=127.91999999999996/132, creature-nest-3=122.63999999999999/132

```json
{
  "actions": [
    {
      "id": "action-11-player-2-132",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
            "row": 11,
            "column": 7
          }
        },
        "reason": "打巢穴：先清除巢穴附近生物 生物巢穴 3的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "打巢穴：先清除巢穴附近生物 生物巢穴 3的怪物 Lv.1",
      "createdAt": "2026-09-01T17:09:57.741Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 32 (round 11)
- Player: 胡斐 (player-2), level 2, experience 62, at (13, 7), health 21, stamina 1
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=127.91999999999996/132, creature-nest-3=122.63999999999999/132

```json
{
  "actions": [
    {
      "id": "action-11-player-2-133",
      "round": 11,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T17:09:57.747Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 33 (round 12)
- Player: 胡斐 (player-2), level 2, experience 64, at (13, 7), health 22.5, stamina 8
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=129.23999999999995/132, creature-nest-3=123.95999999999998/132

```json
{
  "actions": [
    {
      "id": "action-11-roamer-creature-1-134",
      "round": 11,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.751Z"
    },
    {
      "id": "action-11-roamer-creature-2-135",
      "round": 11,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.751Z"
    },
    {
      "id": "action-11-roamer-creature-3-136",
      "round": 11,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.751Z"
    },
    {
      "id": "action-11-roamer-creature-6-137",
      "round": 11,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.751Z"
    },
    {
      "id": "action-11-roamer-creature-7-138",
      "round": 11,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.751Z"
    },
    {
      "id": "action-11-roamer-creature-8-139",
      "round": 11,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.751Z"
    },
    {
      "id": "action-11-roamer-creature-9-140",
      "round": 11,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.751Z"
    },
    {
      "id": "action-11-roamer-creature-10-141",
      "round": 11,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.751Z"
    },
    {
      "id": "action-11-nest-creature-1-142",
      "round": 11,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 7
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T17:09:57.751Z"
    },
    {
      "id": "action-11-nest-creature-2-143",
      "round": 11,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.1"
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
      "createdAt": "2026-09-01T17:09:57.751Z"
    },
    {
      "id": "action-12-player-2-144",
      "round": 12,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
      "createdAt": "2026-09-01T17:09:57.752Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 34 (round 12)
- Player: 胡斐 (player-2), level 2, experience 67, at (13, 7), health 22.5, stamina 3
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=129.23999999999995/132, creature-nest-3=123.95999999999998/132

```json
{
  "actions": [
    {
      "id": "action-12-player-2-145",
      "round": 12,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
            "row": 12,
            "column": 7
          }
        },
        "reason": "打巢穴：先清除巢穴附近生物 生物巢穴 3的怪物 Lv.1"
      },
      "result": "succeeded",
      "reason": "打巢穴：先清除巢穴附近生物 生物巢穴 3的怪物 Lv.1",
      "createdAt": "2026-09-01T17:09:57.762Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 35 (round 12)
- Player: 胡斐 (player-2), level 2, experience 67, at (13, 8), health 22.5, stamina 1
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=129.23999999999995/132, creature-nest-3=123.95999999999998/132

```json
{
  "actions": [
    {
      "id": "action-12-player-2-146",
      "round": 12,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T17:09:57.772Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 36 (round 13)
- Player: 胡斐 (player-2), level 2, experience 69, at (13, 8), health 24, stamina 8
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +2
- Spawned creatures: 1
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=130.55999999999995/132, creature-nest-3=125.27999999999997/145

```json
{
  "actions": [
    {
      "id": "action-12-roamer-creature-1-147",
      "round": 12,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.776Z"
    },
    {
      "id": "action-12-roamer-creature-2-148",
      "round": 12,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.776Z"
    },
    {
      "id": "action-12-roamer-creature-3-149",
      "round": 12,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.776Z"
    },
    {
      "id": "action-12-roamer-creature-6-150",
      "round": 12,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.776Z"
    },
    {
      "id": "action-12-roamer-creature-7-151",
      "round": 12,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.776Z"
    },
    {
      "id": "action-12-roamer-creature-8-152",
      "round": 12,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.776Z"
    },
    {
      "id": "action-12-roamer-creature-9-153",
      "round": 12,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.776Z"
    },
    {
      "id": "action-12-roamer-creature-10-154",
      "round": 12,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.776Z"
    },
    {
      "id": "action-12-nest-creature-1-155",
      "round": 12,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 7
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T17:09:57.776Z"
    },
    {
      "id": "action-12-nest-creature-2-156",
      "round": 12,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.1"
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
      "createdAt": "2026-09-01T17:09:57.776Z"
    },
    {
      "id": "action-13-player-2-157",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
      "createdAt": "2026-09-01T17:09:57.777Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "creature-nest-3",
      "creatureName": "生物巢穴 3",
      "message": "生物巢穴 3 生成了 Lv.2 怪物。"
    }
  ],
  "spawnedCreatures": [
    {
      "id": "nest-creature-3",
      "name": "生物巢穴 3的怪物 Lv.2",
      "innerSkillId": "void-spirit-inner",
      "externalSkillIds": [],
      "equippedExternalSkillIds": [],
      "position": {
        "row": 10,
        "column": 8
      },
      "attributes": {
        "armStrength": 6,
        "constitution": 6,
        "agility": 5,
        "innerEnergy": 5,
        "insight": 6
      },
      "prestige": 0,
      "money": 0,
      "experience": 0,
      "turnEnded": false,
      "level": 2,
      "behaviorType": "scavenger",
      "schoolId": "void-spirit",
      "homePosition": {
        "row": 11,
        "column": 8
      },
      "homeNestId": "creature-nest-3",
      "spawnedRound": 13,
      "baseAttributes": {
        "armStrength": 5.6,
        "constitution": 5.6,
        "agility": 5.6,
        "innerEnergy": 5.6,
        "insight": 5.6
      },
      "health": 18,
      "maxHealth": 18,
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

### Turn 37 (round 13)
- Player: 胡斐 (player-2), level 2, experience 69, at (13, 9), health 24, stamina 6
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=130.55999999999995/132, creature-nest-3=125.27999999999997/145

```json
{
  "actions": [
    {
      "id": "action-13-player-2-158",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
        "reason": "打巢穴：先接近巢穴附近生物 生物巢穴 3的怪物 Lv.2"
      },
      "result": "succeeded",
      "reason": "打巢穴：先接近巢穴附近生物 生物巢穴 3的怪物 Lv.2",
      "createdAt": "2026-09-01T17:09:57.788Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 38 (round 13)
- Player: 胡斐 (player-2), level 2, experience 69, at (12, 9), health 24, stamina 4
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=130.55999999999995/132, creature-nest-3=125.27999999999997/145

```json
{
  "actions": [
    {
      "id": "action-13-player-2-159",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
        "reason": "打巢穴：移動到 生物巢穴 3 附近"
      },
      "result": "succeeded",
      "reason": "打巢穴：移動到 生物巢穴 3 附近",
      "createdAt": "2026-09-01T17:09:57.799Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 39 (round 13)
- Player: 胡斐 (player-2), level 2, experience 69, at (12, 8), health 24, stamina 2
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=130.55999999999995/132, creature-nest-3=125.27999999999997/145

```json
{
  "actions": [
    {
      "id": "action-13-player-2-160",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
        "reason": "打巢穴：先接近巢穴附近生物 生物巢穴 3的怪物 Lv.2"
      },
      "result": "succeeded",
      "reason": "打巢穴：先接近巢穴附近生物 生物巢穴 3的怪物 Lv.2",
      "createdAt": "2026-09-01T17:09:57.807Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 40 (round 13)
- Player: 胡斐 (player-2), level 2, experience 69, at (12, 7), health 24, stamina 0
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=130.55999999999995/132, creature-nest-3=125.27999999999997/145

```json
{
  "actions": [
    {
      "id": "action-13-player-2-161",
      "round": 13,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
        "reason": "打巢穴：先接近巢穴附近生物 生物巢穴 3的怪物 Lv.2"
      },
      "result": "succeeded",
      "reason": "打巢穴：先接近巢穴附近生物 生物巢穴 3的怪物 Lv.2",
      "createdAt": "2026-09-01T17:09:57.815Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 41 (round 14)
- Player: 胡斐 (player-2), level 2, experience 69, at (12, 7), health 22.5, stamina 8
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=131.87999999999994/132, creature-nest-3=126.72999999999998/145

```json
{
  "actions": [
    {
      "id": "action-13-roamer-creature-1-162",
      "round": 13,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.815Z"
    },
    {
      "id": "action-13-roamer-creature-2-163",
      "round": 13,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.815Z"
    },
    {
      "id": "action-13-roamer-creature-3-164",
      "round": 13,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.815Z"
    },
    {
      "id": "action-13-roamer-creature-6-165",
      "round": 13,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.815Z"
    },
    {
      "id": "action-13-roamer-creature-7-166",
      "round": 13,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.815Z"
    },
    {
      "id": "action-13-roamer-creature-8-167",
      "round": 13,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.815Z"
    },
    {
      "id": "action-13-roamer-creature-9-168",
      "round": 13,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.815Z"
    },
    {
      "id": "action-13-roamer-creature-10-169",
      "round": 13,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.815Z"
    },
    {
      "id": "action-13-nest-creature-1-170",
      "round": 13,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 7
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T17:09:57.815Z"
    },
    {
      "id": "action-13-nest-creature-2-171",
      "round": 13,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.1"
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
            "column": 7
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-01T17:09:57.816Z"
    },
    {
      "id": "action-13-nest-creature-3-172",
      "round": 13,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
      "createdAt": "2026-09-01T17:09:57.816Z"
    },
    {
      "id": "action-14-player-2-173",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
      "createdAt": "2026-09-01T17:09:57.816Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 42 (round 14)
- Player: 胡斐 (player-2), level 2, experience 72, at (12, 7), health 22.5, stamina 3
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +3
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=131.87999999999994/132, creature-nest-3=126.72999999999998/145

```json
{
  "actions": [
    {
      "id": "action-14-player-2-174",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
            "row": 11,
            "column": 7
          }
        },
        "reason": "打巢穴：先清除巢穴附近生物 生物巢穴 3的怪物 Lv.2"
      },
      "result": "succeeded",
      "reason": "打巢穴：先清除巢穴附近生物 生物巢穴 3的怪物 Lv.2",
      "createdAt": "2026-09-01T17:09:57.825Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 43 (round 14)
- Player: 胡斐 (player-2), level 2, experience 72, at (12, 6), health 22.5, stamina 1
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=131.87999999999994/132, creature-nest-3=126.72999999999998/145

```json
{
  "actions": [
    {
      "id": "action-14-player-2-175",
      "round": 14,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
        "reason": "學招：移動到門派據點"
      },
      "result": "succeeded",
      "reason": "學招：移動到門派據點",
      "createdAt": "2026-09-01T17:09:57.833Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 44 (round 15)
- Player: 胡斐 (player-2), level 2, experience 74, at (12, 6), health 24, stamina 8
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=132/132, creature-nest-3=128.17999999999998/145

```json
{
  "actions": [
    {
      "id": "action-14-roamer-creature-1-176",
      "round": 14,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.836Z"
    },
    {
      "id": "action-14-roamer-creature-2-177",
      "round": 14,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.837Z"
    },
    {
      "id": "action-14-roamer-creature-3-178",
      "round": 14,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.837Z"
    },
    {
      "id": "action-14-roamer-creature-6-179",
      "round": 14,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.837Z"
    },
    {
      "id": "action-14-roamer-creature-7-180",
      "round": 14,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.837Z"
    },
    {
      "id": "action-14-roamer-creature-8-181",
      "round": 14,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.837Z"
    },
    {
      "id": "action-14-roamer-creature-9-182",
      "round": 14,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.837Z"
    },
    {
      "id": "action-14-roamer-creature-10-183",
      "round": 14,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.837Z"
    },
    {
      "id": "action-14-nest-creature-1-184",
      "round": 14,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 7
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T17:09:57.837Z"
    },
    {
      "id": "action-14-nest-creature-2-185",
      "round": 14,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.1"
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
      "createdAt": "2026-09-01T17:09:57.837Z"
    },
    {
      "id": "action-14-nest-creature-3-186",
      "round": 14,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-3",
          "kind": "creature"
        },
        "destination": {
          "row": 11,
          "column": 7
        },
        "reason": "移動接近 胡斐。"
      },
      "result": "succeeded",
      "reason": "移動接近 胡斐。",
      "createdAt": "2026-09-01T17:09:57.837Z"
    },
    {
      "id": "action-15-player-2-187",
      "round": 15,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
      "createdAt": "2026-09-01T17:09:57.838Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 45 (round 15)
- Player: 胡斐 (player-2), level 2, experience 94, at (12, 6), health 24, stamina 3
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +20
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=132/132, creature-nest-3=128.17999999999998/145

```json
{
  "actions": [
    {
      "id": "action-15-player-2-188",
      "round": 15,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
            "row": 11,
            "column": 6
          }
        },
        "reason": "清障：清除廢墟 青石村"
      },
      "result": "succeeded",
      "reason": "清障：清除廢墟 青石村",
      "createdAt": "2026-09-01T17:09:57.843Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 46 (round 15)
- Player: 胡斐 (player-2), level 2, experience 94, at (11, 6), health 24, stamina 1
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=132/132, creature-nest-3=128.17999999999998/145

```json
{
  "actions": [
    {
      "id": "action-15-player-2-189",
      "round": 15,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T17:09:57.850Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 47 (round 16)
- Player: 胡斐 (player-2), level 2, experience 96, at (11, 6), health 13.5, stamina 8
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=132/132, creature-nest-3=129.62999999999997/145

```json
{
  "actions": [
    {
      "id": "action-15-roamer-creature-1-190",
      "round": 15,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.854Z"
    },
    {
      "id": "action-15-roamer-creature-2-191",
      "round": 15,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "target": {
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 11,
            "column": 6
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-01T17:09:57.854Z"
    },
    {
      "id": "action-15-roamer-creature-3-192",
      "round": 15,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.854Z"
    },
    {
      "id": "action-15-roamer-creature-6-193",
      "round": 15,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.854Z"
    },
    {
      "id": "action-15-roamer-creature-7-194",
      "round": 15,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.854Z"
    },
    {
      "id": "action-15-roamer-creature-8-195",
      "round": 15,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.854Z"
    },
    {
      "id": "action-15-roamer-creature-9-196",
      "round": 15,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.854Z"
    },
    {
      "id": "action-15-roamer-creature-10-197",
      "round": 15,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.854Z"
    },
    {
      "id": "action-15-nest-creature-1-198",
      "round": 15,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 7
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T17:09:57.854Z"
    },
    {
      "id": "action-15-nest-creature-2-199",
      "round": 15,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.1"
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
      "createdAt": "2026-09-01T17:09:57.854Z"
    },
    {
      "id": "action-15-nest-creature-3-200",
      "round": 15,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
            "row": 11,
            "column": 6
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-01T17:09:57.855Z"
    },
    {
      "id": "action-16-player-2-201",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
      "createdAt": "2026-09-01T17:09:57.855Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "roamer-creature-2",
      "creatureName": "游蕩妖物",
      "message": "游蕩妖物 攻擊 胡斐，造成 7 點傷害。"
    },
    {
      "creatureId": "nest-creature-3",
      "creatureName": "生物巢穴 3的怪物 Lv.2",
      "message": "生物巢穴 3的怪物 Lv.2 攻擊 胡斐，造成 5 點傷害。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 48 (round 16)
- Player: 胡斐 (player-2), level 2, experience 96, at (11, 5), health 13.5, stamina 3
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=132/132, creature-nest-3=129.62999999999997/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-202",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T17:09:57.862Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 49 (round 16)
- Player: 胡斐 (player-2), level 2, experience 96, at (11, 6), health 13.5, stamina 1
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=132/132, creature-nest-3=129.62999999999997/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-203",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T17:09:57.871Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 50 (round 16)
- Player: 胡斐 (player-2), level 2, experience 96, at (11, 6), health 30, stamina 1
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=132/132, creature-nest-3=129.62999999999997/145

```json
{
  "actions": [
    {
      "id": "action-16-player-2-204",
      "round": 16,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
      "createdAt": "2026-09-01T17:09:57.874Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 51 (round 17)
- Player: 胡斐 (player-2), level 2, experience 98, at (11, 6), health 16.5, stamina 8
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +2
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=132/132, creature-nest-3=131.07999999999996/145

```json
{
  "actions": [
    {
      "id": "action-16-roamer-creature-1-205",
      "round": 16,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.878Z"
    },
    {
      "id": "action-16-roamer-creature-2-206",
      "round": 16,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "target": {
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 11,
            "column": 6
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-01T17:09:57.878Z"
    },
    {
      "id": "action-16-roamer-creature-3-207",
      "round": 16,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.878Z"
    },
    {
      "id": "action-16-roamer-creature-6-208",
      "round": 16,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.878Z"
    },
    {
      "id": "action-16-roamer-creature-7-209",
      "round": 16,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.878Z"
    },
    {
      "id": "action-16-roamer-creature-8-210",
      "round": 16,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.878Z"
    },
    {
      "id": "action-16-roamer-creature-9-211",
      "round": 16,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.878Z"
    },
    {
      "id": "action-16-roamer-creature-10-212",
      "round": 16,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.878Z"
    },
    {
      "id": "action-16-nest-creature-1-213",
      "round": 16,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 7
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T17:09:57.878Z"
    },
    {
      "id": "action-16-nest-creature-2-214",
      "round": 16,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.1"
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
            "column": 6
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-01T17:09:57.878Z"
    },
    {
      "id": "action-16-nest-creature-3-215",
      "round": 16,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
            "row": 11,
            "column": 6
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-01T17:09:57.878Z"
    },
    {
      "id": "action-17-player-2-216",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
      "createdAt": "2026-09-01T17:09:57.879Z"
    }
  ],
  "creatureLogs": [
    {
      "creatureId": "roamer-creature-10",
      "creatureName": "游蕩妖物",
      "message": "游蕩妖物 發現並摧毀了道具點。"
    },
    {
      "creatureId": "nest-creature-2",
      "creatureName": "生物巢穴 3的怪物 Lv.1",
      "message": "生物巢穴 3的怪物 Lv.1 攻擊 胡斐，造成 5 點傷害。"
    },
    {
      "creatureId": "nest-creature-3",
      "creatureName": "生物巢穴 3的怪物 Lv.2",
      "message": "生物巢穴 3的怪物 Lv.2 攻擊 胡斐，被閃避。"
    }
  ],
  "spawnedCreatures": []
}
```

### Turn 52 (round 17)
- Player: 胡斐 (player-2), level 2, experience 98, at (11, 5), health 16.5, stamina 3
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=132/132, creature-nest-3=131.07999999999996/145

```json
{
  "actions": [
    {
      "id": "action-17-player-2-217",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T17:09:57.887Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 53 (round 17)
- Player: 胡斐 (player-2), level 2, experience 98, at (11, 6), health 16.5, stamina 1
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: +0
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=132/132, creature-nest-3=131.07999999999996/145

```json
{
  "actions": [
    {
      "id": "action-17-player-2-218",
      "round": 17,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
        "reason": "探索：移動到未探索格 (6,13)"
      },
      "result": "succeeded",
      "reason": "探索：移動到未探索格 (6,13)",
      "createdAt": "2026-09-01T17:09:57.896Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

### Turn 54 (round 18)
- Player: 胡斐 (player-2), level 3, experience 0, at (11, 6), health 0, stamina 0
- Attributes: armStrength=8, constitution=10, agility=8, innerEnergy=8, insight=13
- Inner skill: 吐納功 (tuna-gong), level 2, damage 7
- Stored experience change: -98 (level up; stored experience reset by game rules)
- Spawned creatures: 0
- Defeated creatures: none
- Nests: creature-nest-1=120/120, creature-nest-2=132/132, creature-nest-3=132.52999999999994/145

```json
{
  "actions": [
    {
      "id": "action-17-roamer-creature-1-219",
      "round": 17,
      "actor": {
        "id": "roamer-creature-1",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-1",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.899Z"
    },
    {
      "id": "action-17-roamer-creature-2-220",
      "round": 17,
      "actor": {
        "id": "roamer-creature-2",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "attack",
        "actor": {
          "id": "roamer-creature-2",
          "kind": "creature"
        },
        "target": {
          "id": "player-2",
          "kind": "player",
          "position": {
            "row": 11,
            "column": 6
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-01T17:09:57.899Z"
    },
    {
      "id": "action-17-roamer-creature-3-221",
      "round": 17,
      "actor": {
        "id": "roamer-creature-3",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-3",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.899Z"
    },
    {
      "id": "action-17-roamer-creature-6-222",
      "round": 17,
      "actor": {
        "id": "roamer-creature-6",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-6",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.899Z"
    },
    {
      "id": "action-17-roamer-creature-7-223",
      "round": 17,
      "actor": {
        "id": "roamer-creature-7",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-7",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.899Z"
    },
    {
      "id": "action-17-roamer-creature-8-224",
      "round": 17,
      "actor": {
        "id": "roamer-creature-8",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-8",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.899Z"
    },
    {
      "id": "action-17-roamer-creature-9-225",
      "round": 17,
      "actor": {
        "id": "roamer-creature-9",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-9",
          "kind": "creature"
        },
        "reason": "沒有可執行的目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "沒有可執行的目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.899Z"
    },
    {
      "id": "action-17-roamer-creature-10-226",
      "round": 17,
      "actor": {
        "id": "roamer-creature-10",
        "kind": "creature",
        "name": "游蕩妖物"
      },
      "action": {
        "type": "hold",
        "actor": {
          "id": "roamer-creature-10",
          "kind": "creature"
        },
        "reason": "未能接近目標，原地待命。"
      },
      "result": "succeeded",
      "reason": "未能接近目標，原地待命。",
      "createdAt": "2026-09-01T17:09:57.900Z"
    },
    {
      "id": "action-17-nest-creature-1-227",
      "round": 17,
      "actor": {
        "id": "nest-creature-1",
        "kind": "creature",
        "name": "生物巢穴 2的怪物 Lv.1"
      },
      "action": {
        "type": "move",
        "actor": {
          "id": "nest-creature-1",
          "kind": "creature"
        },
        "destination": {
          "row": 5,
          "column": 7
        },
        "reason": "移動接近 耕田。"
      },
      "result": "succeeded",
      "reason": "移動接近 耕田。",
      "createdAt": "2026-09-01T17:09:57.900Z"
    },
    {
      "id": "action-17-nest-creature-2-228",
      "round": 17,
      "actor": {
        "id": "nest-creature-2",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.1"
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
            "column": 6
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-01T17:09:57.900Z"
    },
    {
      "id": "action-17-nest-creature-3-229",
      "round": 17,
      "actor": {
        "id": "nest-creature-3",
        "kind": "creature",
        "name": "生物巢穴 3的怪物 Lv.2"
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
            "row": 11,
            "column": 6
          }
        },
        "reason": "與 胡斐 交戰。"
      },
      "result": "succeeded",
      "reason": "與 胡斐 交戰。",
      "createdAt": "2026-09-01T17:09:57.900Z"
    },
    {
      "id": "action-18-player-2-230",
      "round": 18,
      "actor": {
        "id": "player-2",
        "kind": "player",
        "name": "胡斐"
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
      "createdAt": "2026-09-01T17:09:57.900Z"
    }
  ],
  "creatureLogs": [],
  "spawnedCreatures": []
}
```

