const dataJson =
{
    "component": {
        "energy1": {
            "title": "能量夾",
            "desc": "增加{0}能量.",
            "value": [
                "80"
            ],
            "powerCost": 1,
            "action": ""
        },
        "energy2": {
            "title": "能量夾",
            "desc": "增加{0}能量.",
            "value": [
                "170"
            ],
            "powerCost": 2,
            "action": ""
        },
        "energy3": {
            "title": "能量夾",
            "desc": "增加{0}能量.",
            "value": [
                "260"
            ],
            "powerCost": 3,
            "action": ""
        },
        "armor1": {
            "title": "鐵板",
            "desc": "增加{0}裝甲.",
            "value": [
                "100"
            ],
            "powerCost": 2,
            "action": ""
        },
        "armor2": {
            "title": "鋼板",
            "desc": "增加{0}裝甲.",
            "value": [
                "170"
            ],
            "powerCost": 3,
            "action": ""
        },
        "armor3": {
            "title": "鋼彈合金",
            "desc": "增加{0}裝甲.",
            "value": [
                "240"
            ],
            "powerCost": 4,
            "action": ""
        }
    },
    "componentAction": {},
    "robot": {
        "gaite": {
            "title": "蓋特",
            "cost": 27040,
            "power": 26,
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
                1,
                1,
                1,
                1
            ],
            "transform": ["zgundam", "gundam"]
        },
        "zgundam": {
            "title": "z鋼彈",
            "cost": 16000,
            "power": 20,
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
                1,
                1,
                1
            ],
            "transform": ["gaite", "gundam"]
        },
        "gundam": {
            "title": "鋼彈",
            "cost": 9000,
            "power": 15,
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
                1,
                1,
                1
            ],
            "transform": ["zgundam", "gaite"]
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
            "energyCost": 50,
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
            "powerCost": 5
        },
        "beam_mega2": {
            "title": "粒子炮L2",
            "range": [
                5,
                2
            ],
            "energyCost": 100,
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
            "accuracy": 0.572,
            "damage": 4741,
            "powerCost": 6
        },
        "beam_mega3": {
            "title": "粒子炮L3",
            "range": [
                6,
                3
            ],
            "energyCost": 150,
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
            "accuracy": 0.544,
            "damage": 5451,
            "powerCost": 7
        },
        "beam_mega4": {
            "title": "粒子炮L4",
            "range": [
                6,
                3
            ],
            "energyCost": 200,
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
            "accuracy": 0.516,
            "damage": 6229,
            "powerCost": 8
        },
        "beam_mega5": {
            "title": "粒子炮L5",
            "range": [
                7,
                4
            ],
            "energyCost": 250,
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
            "accuracy": 0.488,
            "damage": 7077,
            "powerCost": 9
        },
        "beam_mega6": {
            "title": "粒子炮L6",
            "range": [
                7,
                4
            ],
            "energyCost": 300,
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
            "accuracy": 0.46,
            "damage": 8000,
            "powerCost": 10
        },
        "beam_mega7": {
            "title": "粒子炮L7",
            "range": [
                7,
                4
            ],
            "energyCost": 350,
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
            "accuracy": 0.432,
            "damage": 8998,
            "powerCost": 11
        },
        "beam_sniper1": {
            "title": "光束狙擊鎗L1",
            "range": [
                3,
                9
            ],
            "energyCost": 20,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "standAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 3375,
            "powerCost": 2
        },
        "beam_sniper2": {
            "title": "光束狙擊鎗L2",
            "range": [
                3,
                9
            ],
            "energyCost": 23,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "standAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 4173,
            "powerCost": 3
        },
        "beam_sniper3": {
            "title": "光束狙擊鎗L3",
            "range": [
                4,
                12
            ],
            "energyCost": 26,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "standAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 5088,
            "powerCost": 4
        },
        "beam_sniper4": {
            "title": "光束狙擊鎗L4",
            "range": [
                4,
                12
            ],
            "energyCost": 29,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "standAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 6128,
            "powerCost": 5
        },
        "beam_sniper5": {
            "title": "光束狙擊鎗L5",
            "range": [
                5,
                15
            ],
            "energyCost": 32,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "standAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 7301,
            "powerCost": 6
        },
        "beam_sniper6": {
            "title": "光束狙擊鎗L6",
            "range": [
                5,
                15
            ],
            "energyCost": 35,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "standAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 8615,
            "powerCost": 7
        },
        "beam_sniper7": {
            "title": "光束狙擊鎗L7",
            "range": [
                5,
                15
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
                "standAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 10077,
            "powerCost": 8
        },
        "beam_gun1": {
            "title": "輕型光束鎗",
            "range": [
                2,
                5
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
            "damage": 2000,
            "powerCost": 1
        },
        "beam_gun2": {
            "title": "中型光束鎗",
            "range": [
                2,
                5
            ],
            "energyCost": 15,
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
            "damage": 2500,
            "powerCost": 2
        },
        "beam_gun3": {
            "title": "重型光束鎗",
            "range": [
                2,
                6
            ],
            "energyCost": 20,
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
            "damage": 3000,
            "powerCost": 3
        },
        "beam_gatling1": {
            "title": "輕型光束衝鋒鎗",
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
            "damage": 1500,
            "powerCost": 1
        },
        "beam_gatling2": {
            "title": "中型光束衝鋒鎗",
            "range": [
                2,
                4
            ],
            "energyCost": 15,
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
            "damage": 2000,
            "powerCost": 2
        },
        "beam_gatling3": {
            "title": "重型光束衝鋒鎗",
            "range": [
                2,
                5
            ],
            "energyCost": 20,
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
            "damage": 2500,
            "powerCost": 3
        },
        "beam_sword1": {
            "title": "輕型光束劍",
            "range": [
                1,
                1
            ],
            "energyCost": 5,
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
            "damage": 2200,
            "powerCost": 1
        },
        "beam_sword2": {
            "title": "中型光束劍",
            "range": [
                1,
                1
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
                "moveAttack",
                "melee"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 2700,
            "powerCost": 2
        },
        "beam_sword3": {
            "title": "重型光束劍",
            "range": [
                1,
                2
            ],
            "energyCost": 15,
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
            "damage": 3200,
            "powerCost": 3
        },
        "gaite_handSword": {
            "title": "蓋特手刀",
            "range": [
                1,
                1
            ],
            "energyCost": 5,
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
            "accuracy": 1,
            "damage": 2200,
            "powerCost": 1
        },
        "gaite_axe": {
            "title": "蓋特巨斧",
            "range": [
                2,
                3
            ],
            "energyCost": 25,
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
            "damage": 4200,
            "powerCost": 3
        },
        "gaite_beam": {
            "title": "蓋特光線",
            "range": [
                1,
                3
            ],
            "energyCost": 50,
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
            "damage": 5000,
            "powerCost": 5
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
            "damage": 2500,
            "powerCost": 2
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
            "desc": "以格鬥值差距影響命中率",
            "values": []
        },
        "range": {
            "title": "射擊",
            "desc": "以射擊值差距影響命中率",
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