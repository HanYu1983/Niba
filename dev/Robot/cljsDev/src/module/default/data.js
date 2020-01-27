const dataJson = 
{
    "component": {
        "energy1": {
            "title": "能量夾L1",
            "desc": "增加{0}能量.",
            "value": [
                "40"
            ],
            "powerCost": 2,
            "action": ""
        },
        "energy2": {
            "title": "能量夾L2",
            "desc": "增加{0}能量.",
            "value": [
                "65"
            ],
            "powerCost": 3,
            "action": ""
        },
        "energy3": {
            "title": "能量夾L3",
            "desc": "增加{0}能量.",
            "value": [
                "90"
            ],
            "powerCost": 4,
            "action": ""
        },
        "armor1": {
            "title": "裝甲L1",
            "desc": "增加{0}裝甲.",
            "value": [
                "600"
            ],
            "powerCost": 3,
            "action": ""
        },
        "armor2": {
            "title": "裝甲L2",
            "desc": "增加{0}裝甲.",
            "value": [
                "850"
            ],
            "powerCost": 4,
            "action": ""
        },
        "armor3": {
            "title": "裝甲L3",
            "desc": "增加{0}裝甲.",
            "value": [
                "1100"
            ],
            "powerCost": 5,
            "action": ""
        }
    },
    "componentAction": {},
    "config": {
        "default": {
            "powerCostForMove": 5
        }
    },
    "pilot": {},
    "robot": {
        "gaite": {
            "title": "真蓋特",
            "cost": 62500,
            "power": 125,
            "weapons": [
                "gaite_handSword",
                "gaite_axe",
                "gaite_beam",
                "gaite_cannon"
            ],
            "components": [
                "energy1",
                "energy2",
                "armor1",
                "armor2"
            ],
            "suitability": [
                0.75,
                0.5,
                1,
                0.75
            ],
            "transform": [
                "zgundam",
                "gundam"
            ]
        },
        "zgundam": {
            "title": "z鋼彈",
            "cost": 32400,
            "power": 90,
            "weapons": [
                "beam_sword2",
                "beam_gun1",
                "beam_mega2"
            ],
            "components": [
                "energy1",
                "energy1",
                "armor1",
                "armor1"
            ],
            "suitability": [
                1,
                0.5,
                0,
                1
            ],
            "transform": []
        },
        "gundam": {
            "title": "鋼彈",
            "cost": 16900,
            "power": 65,
            "weapons": [
                "beam_sword1",
                "beam_gun1"
            ],
            "components": [
                "energy1",
                "energy1",
                "armor1",
                "armor1"
            ],
            "suitability": [
                1,
                0.5,
                0,
                1
            ],
            "transform": []
        },
        "jimu": {
            "title": "吉姆",
            "cost": 9216,
            "power": 48,
            "weapons": [
                "beam_sword1",
                "beam_gatling1"
            ],
            "components": [
                "energy1",
                "armor1"
            ],
            "suitability": [
                1,
                0.5,
                0,
                1
            ],
            "transform": []
        },
        "BGD": {
            "title": "制式格鬥",
            "cost": 14400,
            "power": 60,
            "weapons": [
                "beam_sword2",
                "beam_gatling1"
            ],
            "components": [
                "energy1",
                "armor1"
            ],
            "suitability": [
                1,
                0.5,
                0,
                1
            ],
            "transform": []
        },
        "BYJ": {
            "title": "制式遊擊",
            "cost": 14400,
            "power": 60,
            "weapons": [
                "beam_sword1",
                "beam_gatling2"
            ],
            "components": [
                "energy1",
                "armor1"
            ],
            "suitability": [
                1,
                0.5,
                0,
                1
            ],
            "transform": []
        },
        "BJJ": {
            "title": "制式狙擊",
            "cost": 14400,
            "power": 60,
            "weapons": [
                "beam_sniper1",
                "beam_gatling1"
            ],
            "components": [
                "energy2",
                "armor1"
            ],
            "suitability": [
                1,
                0.5,
                0,
                1
            ],
            "transform": []
        },
        "BGR": {
            "title": "制式干擾",
            "cost": 14400,
            "power": 60,
            "weapons": [
                "beam_sword1",
                "beam_gatling1"
            ],
            "components": [
                "energy1",
                "armor2"
            ],
            "suitability": [
                1,
                0.5,
                0,
                1
            ],
            "transform": []
        }
    },
    "terrain": {
        "mountain": {
            "title": "mountain",
            "cost": 2,
            "hitRate": 1,
            "damage": 0.5
        },
        "plain": {
            "title": "plain",
            "cost": 0.5,
            "hitRate": 1,
            "damage": 1
        },
        "forest": {
            "title": "forest",
            "cost": 1.5,
            "hitRate": 0.5,
            "damage": 0.75
        },
        "road": {
            "title": "road",
            "cost": 0.1,
            "hitRate": 1,
            "damage": 1
        },
        "city": {
            "title": "city",
            "cost": 2,
            "hitRate": 0.9,
            "damage": 0.75
        },
        "beach": {
            "title": "beach",
            "cost": 0.75,
            "hitRate": 1,
            "damage": 1
        },
        "shallowSea": {
            "title": "shallowSea",
            "cost": 1.5,
            "hitRate": 1,
            "damage": 1
        },
        "deepSea": {
            "title": "deepSea",
            "cost": 3,
            "hitRate": 1,
            "damage": 1
        },
        "award": {
            "title": "award",
            "cost": 0.25,
            "hitRate": 1,
            "damage": 1
        }
    },
    "terrainMapping": {
        "0": {
            "terrain": "deepSea"
        },
        "1": {
            "terrain": "shallowSea"
        },
        "2": {
            "terrain": "beach"
        },
        "3": {
            "terrain": "plain"
        },
        "4": {
            "terrain": "city"
        },
        "5": {
            "terrain": "mountain"
        },
        "6": {
            "terrain": "forest"
        },
        "7": {
            "terrain": "award"
        },
        "8": {
            "terrain": "road"
        }
    },
    "weapon": {
        "beam_mega1": {
            "title": "粒子炮L1",
            "range": [
                5,
                2
            ],
            "energyCost": 32,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [],
            "energyType": "energy",
            "type": "line",
            "accuracy": 0.6,
            "damage": 4096,
            "powerCost": 20
        },
        "beam_mega2": {
            "title": "粒子炮L2",
            "range": [
                5,
                2
            ],
            "energyCost": 40,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [],
            "energyType": "energy",
            "type": "line",
            "accuracy": 0.588,
            "damage": 4475,
            "powerCost": 24
        },
        "beam_mega3": {
            "title": "粒子炮L3",
            "range": [
                6,
                3
            ],
            "energyCost": 72,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [],
            "energyType": "energy",
            "type": "line",
            "accuracy": 0.54,
            "damage": 6229,
            "powerCost": 40
        },
        "beam_mega4": {
            "title": "粒子炮L4",
            "range": [
                6,
                3
            ],
            "energyCost": 84,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [],
            "energyType": "energy",
            "type": "line",
            "accuracy": 0.522,
            "damage": 6989,
            "powerCost": 46
        },
        "beam_mega5": {
            "title": "粒子炮L5",
            "range": [
                7,
                4
            ],
            "energyCost": 112,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [],
            "energyType": "energy",
            "type": "line",
            "accuracy": 0.48,
            "damage": 8998,
            "powerCost": 60
        },
        "beam_mega6": {
            "title": "粒子炮L6",
            "range": [
                7,
                4
            ],
            "energyCost": 120,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [],
            "energyType": "energy",
            "type": "line",
            "accuracy": 0.46799999999999997,
            "damage": 9636,
            "powerCost": 64
        },
        "beam_mega7": {
            "title": "粒子炮L7",
            "range": [
                7,
                4
            ],
            "energyCost": 152,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [],
            "energyType": "energy",
            "type": "line",
            "accuracy": 0.42,
            "damage": 12487,
            "powerCost": 80
        },
        "beam_sniper1": {
            "title": "光束狙擊鎗L1",
            "range": [
                3,
                9
            ],
            "energyCost": 33,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.3,
            "damage": 4096,
            "powerCost": 20
        },
        "beam_sniper2": {
            "title": "光束狙擊鎗L2",
            "range": [
                3,
                9
            ],
            "energyCost": 37,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.3,
            "damage": 4640,
            "powerCost": 24
        },
        "beam_sniper3": {
            "title": "光束狙擊鎗L3",
            "range": [
                4,
                12
            ],
            "energyCost": 57,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.3,
            "damage": 7301,
            "powerCost": 40
        },
        "beam_sniper4": {
            "title": "光束狙擊鎗L4",
            "range": [
                4,
                12
            ],
            "energyCost": 64,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.3,
            "damage": 8514,
            "powerCost": 46
        },
        "beam_sniper5": {
            "title": "光束狙擊鎗L5",
            "range": [
                5,
                15
            ],
            "energyCost": 81,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.3,
            "damage": 11852,
            "powerCost": 60
        },
        "beam_sniper6": {
            "title": "光束狙擊鎗L6",
            "range": [
                5,
                15
            ],
            "energyCost": 85,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.3,
            "damage": 12944,
            "powerCost": 64
        },
        "beam_sniper7": {
            "title": "光束狙擊鎗L7",
            "range": [
                5,
                15
            ],
            "energyCost": 105,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.3,
            "damage": 17984,
            "powerCost": 80
        },
        "beam_gun1": {
            "title": "光束鎗L1",
            "range": [
                2,
                4
            ],
            "energyCost": 10,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 2744,
            "powerCost": 10
        },
        "beam_gun2": {
            "title": "光束鎗L2",
            "range": [
                2,
                4
            ],
            "energyCost": 12,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 3048,
            "powerCost": 12
        },
        "beam_gun3": {
            "title": "光束鎗L3",
            "range": [
                2,
                5
            ],
            "energyCost": 22,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 4492,
            "powerCost": 20
        },
        "beam_gun4": {
            "title": "光束鎗L4",
            "range": [
                2,
                5
            ],
            "energyCost": 25,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 5132,
            "powerCost": 23
        },
        "beam_gun5": {
            "title": "光束鎗L5",
            "range": [
                2,
                6
            ],
            "energyCost": 34,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 6859,
            "powerCost": 30
        },
        "beam_gun6": {
            "title": "光束鎗L6",
            "range": [
                2,
                6
            ],
            "energyCost": 38,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 8000,
            "powerCost": 34
        },
        "beam_gun7": {
            "title": "光束鎗L7",
            "range": [
                2,
                6
            ],
            "energyCost": 46,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 9938,
            "powerCost": 40
        },
        "beam_gatling1": {
            "title": "光束衝鋒鎗L1",
            "range": [
                2,
                4
            ],
            "energyCost": 10,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.5,
            "damage": 2197,
            "powerCost": 10
        },
        "beam_gatling2": {
            "title": "光束衝鋒鎗L2",
            "range": [
                2,
                4
            ],
            "energyCost": 12,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.5,
            "damage": 2406,
            "powerCost": 12
        },
        "beam_gatling3": {
            "title": "光束衝鋒鎗L3",
            "range": [
                2,
                5
            ],
            "energyCost": 22,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.5,
            "damage": 3375,
            "powerCost": 20
        },
        "beam_gatling4": {
            "title": "光束衝鋒鎗L4",
            "range": [
                2,
                5
            ],
            "energyCost": 25,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.5,
            "damage": 3796,
            "powerCost": 23
        },
        "beam_gatling5": {
            "title": "光束衝鋒鎗L5",
            "range": [
                2,
                6
            ],
            "energyCost": 34,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.5,
            "damage": 4913,
            "powerCost": 30
        },
        "beam_gatling6": {
            "title": "光束衝鋒鎗L6",
            "range": [
                2,
                6
            ],
            "energyCost": 38,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.5,
            "damage": 5639,
            "powerCost": 34
        },
        "beam_gatling7": {
            "title": "光束衝鋒鎗L7",
            "range": [
                2,
                6
            ],
            "energyCost": 46,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.5,
            "damage": 6859,
            "powerCost": 40
        },
        "beam_sword1": {
            "title": "光束劍L1",
            "range": [
                1,
                1
            ],
            "energyCost": 8,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack",
                "melee"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 3176,
            "powerCost": 10
        },
        "beam_sword2": {
            "title": "光束劍L2",
            "range": [
                1,
                1
            ],
            "energyCost": 14,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack",
                "melee"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 3581,
            "powerCost": 12
        },
        "beam_sword3": {
            "title": "光束劍L3",
            "range": [
                1,
                2
            ],
            "energyCost": 38,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack",
                "melee"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 5545,
            "powerCost": 20
        },
        "beam_sword4": {
            "title": "光束劍L4",
            "range": [
                1,
                2
            ],
            "energyCost": 47,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack",
                "melee"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 6434,
            "powerCost": 23
        },
        "beam_sword5": {
            "title": "光束劍L5",
            "range": [
                2,
                3
            ],
            "energyCost": 68,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack",
                "melee"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 8869,
            "powerCost": 30
        },
        "beam_sword6": {
            "title": "光束劍L6",
            "range": [
                2,
                3
            ],
            "energyCost": 80,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack",
                "melee"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 10503,
            "powerCost": 34
        },
        "beam_sword7": {
            "title": "光束劍L7",
            "range": [
                2,
                3
            ],
            "energyCost": 98,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack",
                "melee"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 13312,
            "powerCost": 40
        },
        "gaite_handSword": {
            "title": "蓋特手刀",
            "range": [
                1,
                1
            ],
            "energyCost": 10,
            "maxBulletCount": 0,
            "suitability": [
                1,
                1,
                1,
                1
            ],
            "ability": [
                "moveAttack",
                "melee"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 0.95,
            "damage": 3300,
            "powerCost": 12
        },
        "gaite_axe": {
            "title": "蓋特巨斧",
            "range": [
                2,
                3
            ],
            "energyCost": 75,
            "maxBulletCount": 0,
            "suitability": [
                1,
                1,
                1,
                1
            ],
            "ability": [
                "moveAttack",
                "melee"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 0.7,
            "damage": 10000,
            "powerCost": 30
        },
        "gaite_beam": {
            "title": "蓋特光線",
            "range": [
                1,
                3
            ],
            "energyCost": 70,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 9000,
            "powerCost": 30
        },
        "gaite_cannon": {
            "title": "蓋特加農",
            "range": [
                2,
                5
            ],
            "energyCost": 0,
            "maxBulletCount": 6,
            "suitability": [
                1,
                1,
                1,
                1
            ],
            "ability": [],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1,
            "damage": 3000,
            "powerCost": 12
        }
    },
    "weaponAbility": {
        "moveAttack": {
            "title": "移動可",
            "desc": "可移動使用",
            "values": []
        },
        "standAttack": {
            "title": "狙擊",
            "desc": "原地使用時。命中增加{0}。",
            "values": [
                "1"
            ]
        },
        "melee": {
            "title": "格鬥",
            "desc": "以格鬥值差距影響命中率. 沒有melee就代表以射擊值影響. ",
            "values": []
        },
        "beam": {
            "title": "光束",
            "desc": "",
            "values": []
        },
        "physic": {
            "title": "實彈",
            "desc": "",
            "values": []
        },
        "fire": {
            "title": "火焰",
            "desc": "無視裝甲值. 樹林中傷害x{0}",
            "values": []
        }
    },
    "weaponEnergyType": {
        "energy": {
            "title": "energy"
        },
        "bullet": {
            "title": "bullet"
        }
    },
    "weaponType": {
        "single": {
            "title": "single"
        },
        "line": {
            "title": "line"
        }
    }
}
module.exports = dataJson