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
            "cost": 16000,
            "power": 20,
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
            ]
        },
        "zgundam": {
            "title": "z鋼彈",
            "cost": 6760,
            "power": 13,
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
            ]
        },
        "gundam": {
            "title": "鋼彈",
            "cost": 3240,
            "power": 9,
            "weapons": [
                "beam_sword1",
                "beam_gun1"
            ],
            "components": [
                "energy1",
                "energy1",
                "armor1",
                "armor1"
            ]
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
            "title": "deepSea"
        },
        "1": {
            "title": "shallowSea"
        },
        "2": {
            "title": "beach"
        },
        "3": {
            "title": "plain"
        },
        "4": {
            "title": "city"
        },
        "5": {
            "title": "mountain"
        },
        "6": {
            "title": "forest"
        },
        "7": {
            "title": "award"
        },
        "8": {
            "title": "road"
        }
    },
    "weapon": {
        "beam_mega1": {
            "title": "輕型粒子炮",
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
            "ablitity": [],
            "energyType": "energy",
            "type": "line",
            "accuracy": 0.5,
            "damage": 3500,
            "powerCost": 5
        },
        "beam_mega2": {
            "title": "中型粒子炮",
            "range": [
                6,
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
            "ablitity": [],
            "energyType": "energy",
            "type": "line",
            "accuracy": 0.5,
            "damage": 4200,
            "powerCost": 6
        },
        "beam_mega3": {
            "title": "重型粒子炮",
            "range": [
                7,
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
            "ablitity": [],
            "energyType": "energy",
            "type": "line",
            "accuracy": 0.5,
            "damage": 5000,
            "powerCost": 7
        },
        "beam_sniper1": {
            "title": "輕型光束狙擊鎗",
            "range": [
                3,
                10
            ],
            "energyCost": 20,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ablitity": [
                "standAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 3200,
            "powerCost": 2
        },
        "beam_sniper2": {
            "title": "中型光束狙擊鎗",
            "range": [
                3,
                11
            ],
            "energyCost": 30,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ablitity": [
                "standAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 4000,
            "powerCost": 3
        },
        "beam_sniper3": {
            "title": "重型光束狙擊鎗",
            "range": [
                4,
                12
            ],
            "energyCost": 40,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ablitity": [
                "standAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 4800,
            "powerCost": 4
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
            "ablitity": [
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
            "ablitity": [
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
            "ablitity": [
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
            "ablitity": [
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
            "ablitity": [
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
            "ablitity": [
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
            "ablitity": [
                "moveAttack"
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
            "ablitity": [
                "moveAttack"
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
            "ablitity": [
                "moveAttack"
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
            "ablitity": [
                "moveAttack"
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
            "ablitity": [
                "moveAttack"
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
            "ablitity": [
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
            "ablitity": [],
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