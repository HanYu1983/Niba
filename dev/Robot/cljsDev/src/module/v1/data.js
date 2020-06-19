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
            "action": "equipment"
        },
        "energy2": {
            "title": "能量夾L2",
            "desc": "增加{0}能量.",
            "value": [
                "65"
            ],
            "powerCost": 3,
            "action": "equipment"
        },
        "energy3": {
            "title": "能量夾L3",
            "desc": "增加{0}能量.",
            "value": [
                "90"
            ],
            "powerCost": 4,
            "action": "equipment"
        },
        "armor1": {
            "title": "裝甲L1",
            "desc": "增加{0}裝甲.",
            "value": [
                "600"
            ],
            "powerCost": 3,
            "action": "equipment"
        },
        "armor2": {
            "title": "裝甲L2",
            "desc": "增加{0}裝甲.",
            "value": [
                "850"
            ],
            "powerCost": 4,
            "action": "equipment"
        },
        "armor3": {
            "title": "裝甲L3",
            "desc": "增加{0}裝甲.",
            "value": [
                "1100"
            ],
            "powerCost": 5,
            "action": "equipment"
        },
        "fixPack": {
            "title": "修復包",
            "desc": "回復{0}HP",
            "value": [
                "3000"
            ],
            "powerCost": 1,
            "action": "item"
        },
        "energyPack": {
            "title": "能量包",
            "desc": "回復{0}EN",
            "value": [
                "60"
            ],
            "powerCost": 1,
            "action": "item"
        },
        "beamCoating": {
            "title": "光束鍍層",
            "desc": "吸收光束{0}",
            "value": [
                "2000"
            ],
            "powerCost": 5,
            "action": "equipment"
        },
        "shield": {
            "title": "盾",
            "desc": "機率{0}自動防禦",
            "value": [
                "0.3"
            ],
            "powerCost": 5,
            "action": "equipment"
        },
        "engine": {
            "title": "引擎",
            "desc": "增加{0}power",
            "value": [
                "6"
            ],
            "powerCost": 2,
            "action": "equipment"
        },
        "psArmor": {
            "title": "ps裝甲",
            "desc": "實彈系傷害減少{0}",
            "value": [
                "3000"
            ],
            "powerCost": 5,
            "action": "equipment"
        },
        "zeroSystem": {
            "title": "零式系統",
            "desc": "武器的最終命中增加{0}%，自身的最終被命中率減少{1}%",
            "value": [
                "10",
                "15"
            ],
            "powerCost": 20,
            "action": "equipment"
        }
    },
    "componentAction": {
        "equipment": {
            "title": "裝備"
        },
        "item": {
            "title": "使用"
        },
        "itemForSelf": {
            "title": "使用自身"
        }
    },
    "config": {
        "default": {
            "powerCostForMove": 5
        }
    },
    "pilot": {
        "amuro": {
            "title": "amuro",
            "melee": 0.75,
            "range": 1.25,
            "dex": 1,
            "agi": 1,
            "tech": 1,
            "exp": 10
        }
    },
    "pilotAbility": {},
    "robot": {
        "gaite_sky": {
            "title": "空蓋特",
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
                1
            ],
            "transform": [
                "gaite_land",
                "gaite_sea"
            ]
        },
        "gaite_land": {
            "title": "地蓋特",
            "cost": 62500,
            "power": 125,
            "weapons": [
                "gaite_drill",
                "gaite_missle",
                "gaite_powerDrill"
            ],
            "components": [
                "energy1",
                "energy2",
                "armor1",
                "armor1"
            ],
            "suitability": [
                1,
                0.75,
                0,
                1
            ],
            "transform": [
                "gaite_sky",
                "gaite_sea"
            ]
        },
        "gaite_sea": {
            "title": "海蓋特",
            "cost": 62500,
            "power": 125,
            "weapons": [
                "gaite_punch",
                "gaite_missle",
                "gaite_shan"
            ],
            "components": [
                "energy1",
                "energy2",
                "armor2",
                "armor2"
            ],
            "suitability": [
                0.75,
                1,
                0,
                1
            ],
            "transform": [
                "gaite_sky",
                "gaite_land"
            ]
        },
        "moshen": {
            "title": "魔神z",
            "cost": 48400,
            "power": 110,
            "weapons": [
                "moshen_ray",
                "moshen_punch",
                "moshen_flypunch",
                "moshen_jian",
                "moshen_fire"
            ],
            "components": [
                "energy1",
                "energy2",
                "armor2",
                "armor2"
            ],
            "suitability": [
                1,
                0.5,
                0,
                1
            ],
            "transform": []
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
            "transform": [
                "zgundam_sky"
            ]
        },
        "zgundam_sky": {
            "title": "z鋼彈飛翼",
            "cost": 32400,
            "power": 90,
            "weapons": [
                "beam_gun1"
            ],
            "components": [
                "energy1",
                "energy1",
                "armor1",
                "armor1"
            ],
            "suitability": [
                0,
                0,
                1,
                1
            ],
            "transform": [
                "zgundam"
            ]
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
        },
        "windgundam": {
            "title": "零式鋼彈",
            "cost": 78400,
            "power": 140,
            "weapons": [
                "beam_sword1",
                "beam_sniper4",
                "beam_mega4"
            ],
            "components": [
                "energy2",
                "energy2",
                "armor1",
                "armor1",
                "zeroSystem"
            ],
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "transform": [
                "windgundam_sky"
            ]
        },
        "windgundam_sky": {
            "title": "零式鋼彈飛翼",
            "cost": 78400,
            "power": 140,
            "weapons": [
                "beam_sniper4"
            ],
            "components": [
                "energy2",
                "energy2",
                "armor1",
                "armor1",
                "zeroSystem"
            ],
            "suitability": [
                0,
                0,
                1,
                1
            ],
            "transform": [
                "windgundam"
            ]
        },
        "strikegundam": {
            "title": "攻擊鋼彈",
            "cost": 36100,
            "power": 95,
            "weapons": [
                "sword1",
                "sword3",
                "beam_gun1"
            ],
            "components": [
                "energy1",
                "energy1",
                "armor1",
                "armor1",
                "psArmor"
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
            "ability": [
                "standAttack",
                "beam"
            ],
            "energyType": "energy",
            "type": "line",
            "accuracy": 0.6,
            "damage": 4096,
            "curage": 110,
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
            "ability": [
                "standAttack",
                "beam"
            ],
            "energyType": "energy",
            "type": "line",
            "accuracy": 0.588,
            "damage": 4475,
            "curage": 110,
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
            "ability": [
                "standAttack",
                "beam"
            ],
            "energyType": "energy",
            "type": "line",
            "accuracy": 0.54,
            "damage": 6229,
            "curage": 120,
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
            "ability": [
                "standAttack",
                "beam"
            ],
            "energyType": "energy",
            "type": "line",
            "accuracy": 0.522,
            "damage": 6989,
            "curage": 120,
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
            "ability": [
                "standAttack",
                "beam"
            ],
            "energyType": "energy",
            "type": "line",
            "accuracy": 0.48,
            "damage": 8998,
            "curage": 130,
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
            "ability": [
                "standAttack",
                "beam"
            ],
            "energyType": "energy",
            "type": "line",
            "accuracy": 0.468,
            "damage": 9636,
            "curage": 130,
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
            "ability": [
                "standAttack",
                "beam"
            ],
            "energyType": "energy",
            "type": "line",
            "accuracy": 0.42,
            "damage": 12487,
            "curage": 130,
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
            "ability": [
                "standAttack",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 4096,
            "curage": 0,
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
            "ability": [
                "standAttack",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 4640,
            "curage": 0,
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
            "ability": [
                "standAttack",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 7301,
            "curage": 105,
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
            "ability": [
                "standAttack",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 8514,
            "curage": 105,
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
            "ability": [
                "standAttack",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 11852,
            "curage": 110,
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
            "ability": [
                "standAttack",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 12944,
            "curage": 120,
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
            "ability": [
                "standAttack",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 17984,
            "curage": 130,
            "powerCost": 80
        },
        "sniper1": {
            "title": "狙擊炮L1",
            "range": [
                3,
                9
            ],
            "energyCost": 0,
            "maxBulletCount": 6,
            "suitability": [
                1,
                1,
                1,
                1
            ],
            "ability": [
                "standAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1,
            "damage": 4096,
            "curage": 0,
            "powerCost": 20
        },
        "sniper2": {
            "title": "狙擊炮L2",
            "range": [
                3,
                9
            ],
            "energyCost": 0,
            "maxBulletCount": 6,
            "suitability": [
                1,
                1,
                1,
                1
            ],
            "ability": [
                "standAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1,
            "damage": 4640,
            "curage": 0,
            "powerCost": 24
        },
        "sniper3": {
            "title": "狙擊炮L3",
            "range": [
                4,
                12
            ],
            "energyCost": 0,
            "maxBulletCount": 5,
            "suitability": [
                1,
                1,
                1,
                1
            ],
            "ability": [
                "standAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1,
            "damage": 7301,
            "curage": 0,
            "powerCost": 40
        },
        "sniper4": {
            "title": "狙擊炮L4",
            "range": [
                4,
                12
            ],
            "energyCost": 0,
            "maxBulletCount": 4,
            "suitability": [
                1,
                1,
                1,
                1
            ],
            "ability": [
                "standAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1,
            "damage": 8514,
            "curage": 0,
            "powerCost": 46
        },
        "sniper5": {
            "title": "狙擊炮L5",
            "range": [
                5,
                15
            ],
            "energyCost": 0,
            "maxBulletCount": 3,
            "suitability": [
                1,
                1,
                1,
                1
            ],
            "ability": [
                "standAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1,
            "damage": 11852,
            "curage": 0,
            "powerCost": 60
        },
        "sniper6": {
            "title": "狙擊炮L6",
            "range": [
                5,
                15
            ],
            "energyCost": 0,
            "maxBulletCount": 2,
            "suitability": [
                1,
                1,
                1,
                1
            ],
            "ability": [
                "standAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1,
            "damage": 12944,
            "curage": 0,
            "powerCost": 64
        },
        "sniper7": {
            "title": "狙擊炮L7",
            "range": [
                5,
                15
            ],
            "energyCost": 0,
            "maxBulletCount": 1,
            "suitability": [
                1,
                1,
                1,
                1
            ],
            "ability": [
                "standAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1,
            "damage": 17984,
            "curage": 0,
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
                "moveAttack",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 2744,
            "curage": 0,
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
                "moveAttack",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 3048,
            "curage": 0,
            "powerCost": 12
        },
        "beam_gun3": {
            "title": "光束鎗L3",
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
                "moveAttack",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 4492,
            "curage": 0,
            "powerCost": 20
        },
        "beam_gun4": {
            "title": "光束鎗L4",
            "range": [
                2,
                5
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
                "moveAttack",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 5132,
            "curage": 0,
            "powerCost": 23
        },
        "beam_gun5": {
            "title": "光束鎗L5",
            "range": [
                2,
                6
            ],
            "energyCost": 30,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 6859,
            "curage": 0,
            "powerCost": 30
        },
        "beam_gun6": {
            "title": "光束鎗L6",
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
                "moveAttack",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 8000,
            "curage": 0,
            "powerCost": 34
        },
        "beam_gun7": {
            "title": "光束鎗L7",
            "range": [
                2,
                6
            ],
            "energyCost": 40,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 9938,
            "curage": 0,
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
                "moveAttack",
                "beam",
                "multi"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.5,
            "damage": 2197,
            "curage": 0,
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
                "moveAttack",
                "beam",
                "multi"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.5,
            "damage": 2406,
            "curage": 0,
            "powerCost": 12
        },
        "beam_gatling3": {
            "title": "光束衝鋒鎗L3",
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
                "moveAttack",
                "beam",
                "multi"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.5,
            "damage": 3375,
            "curage": 0,
            "powerCost": 20
        },
        "beam_gatling4": {
            "title": "光束衝鋒鎗L4",
            "range": [
                2,
                5
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
                "moveAttack",
                "beam",
                "multi"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.5,
            "damage": 3796,
            "curage": 0,
            "powerCost": 23
        },
        "beam_gatling5": {
            "title": "光束衝鋒鎗L5",
            "range": [
                2,
                6
            ],
            "energyCost": 30,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack",
                "beam",
                "multi"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.5,
            "damage": 4913,
            "curage": 0,
            "powerCost": 30
        },
        "beam_gatling6": {
            "title": "光束衝鋒鎗L6",
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
                "moveAttack",
                "beam",
                "multi"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.5,
            "damage": 5639,
            "curage": 0,
            "powerCost": 34
        },
        "beam_gatling7": {
            "title": "光束衝鋒鎗L7",
            "range": [
                2,
                6
            ],
            "energyCost": 40,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack",
                "beam",
                "multi"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.5,
            "damage": 6859,
            "curage": 0,
            "powerCost": 40
        },
        "gatling1": {
            "title": "衝鋒鎗L1",
            "range": [
                2,
                4
            ],
            "energyCost": 0,
            "maxBulletCount": 8,
            "suitability": [
                1,
                1,
                1,
                1
            ],
            "ability": [
                "moveAttack",
                "multi"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1.5,
            "damage": 2197,
            "curage": 0,
            "powerCost": 10
        },
        "gatling2": {
            "title": "衝鋒鎗L2",
            "range": [
                2,
                4
            ],
            "energyCost": 0,
            "maxBulletCount": 8,
            "suitability": [
                1,
                1,
                1,
                1
            ],
            "ability": [
                "moveAttack",
                "multi"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1.5,
            "damage": 2406,
            "curage": 0,
            "powerCost": 12
        },
        "gatling3": {
            "title": "衝鋒鎗L3",
            "range": [
                2,
                5
            ],
            "energyCost": 0,
            "maxBulletCount": 7,
            "suitability": [
                1,
                1,
                1,
                1
            ],
            "ability": [
                "moveAttack",
                "multi"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1.5,
            "damage": 3375,
            "curage": 0,
            "powerCost": 20
        },
        "gatling4": {
            "title": "衝鋒鎗L4",
            "range": [
                2,
                5
            ],
            "energyCost": 0,
            "maxBulletCount": 7,
            "suitability": [
                1,
                1,
                1,
                1
            ],
            "ability": [
                "moveAttack",
                "multi"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1.5,
            "damage": 3796,
            "curage": 0,
            "powerCost": 23
        },
        "gatling5": {
            "title": "衝鋒鎗L5",
            "range": [
                2,
                6
            ],
            "energyCost": 0,
            "maxBulletCount": 6,
            "suitability": [
                1,
                1,
                1,
                1
            ],
            "ability": [
                "moveAttack",
                "multi"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1.5,
            "damage": 4913,
            "curage": 0,
            "powerCost": 30
        },
        "gatling6": {
            "title": "衝鋒鎗L6",
            "range": [
                2,
                6
            ],
            "energyCost": 0,
            "maxBulletCount": 6,
            "suitability": [
                1,
                1,
                1,
                1
            ],
            "ability": [
                "moveAttack",
                "multi"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1.5,
            "damage": 5639,
            "curage": 0,
            "powerCost": 34
        },
        "gatling7": {
            "title": "衝鋒鎗L7",
            "range": [
                2,
                6
            ],
            "energyCost": 0,
            "maxBulletCount": 6,
            "suitability": [
                1,
                1,
                1,
                1
            ],
            "ability": [
                "moveAttack",
                "multi"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1.5,
            "damage": 6859,
            "curage": 0,
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
                "melee",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 3176,
            "curage": 0,
            "powerCost": 10
        },
        "beam_sword2": {
            "title": "光束劍L2",
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
                "melee",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 3581,
            "curage": 0,
            "powerCost": 12
        },
        "beam_sword3": {
            "title": "光束劍L3",
            "range": [
                1,
                2
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
                "moveAttack",
                "melee",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 5545,
            "curage": 105,
            "powerCost": 20
        },
        "beam_sword4": {
            "title": "光束劍L4",
            "range": [
                1,
                2
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
                "moveAttack",
                "melee",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 6434,
            "curage": 110,
            "powerCost": 23
        },
        "beam_sword5": {
            "title": "光束劍L5",
            "range": [
                2,
                3
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
                "moveAttack",
                "melee",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 8869,
            "curage": 120,
            "powerCost": 30
        },
        "beam_sword6": {
            "title": "光束劍L6",
            "range": [
                2,
                3
            ],
            "energyCost": 36,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack",
                "melee",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 10503,
            "curage": 125,
            "powerCost": 34
        },
        "beam_sword7": {
            "title": "光束劍L7",
            "range": [
                2,
                3
            ],
            "energyCost": 44,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack",
                "melee",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 13312,
            "curage": 130,
            "powerCost": 40
        },
        "sword1": {
            "title": "實體劍L1",
            "range": [
                1,
                1
            ],
            "energyCost": 0,
            "maxBulletCount": 6,
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
            "damage": 3176,
            "curage": 0,
            "powerCost": 10
        },
        "sword2": {
            "title": "實體劍L2",
            "range": [
                1,
                1
            ],
            "energyCost": 0,
            "maxBulletCount": 6,
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
            "damage": 3581,
            "curage": 0,
            "powerCost": 12
        },
        "sword3": {
            "title": "實體劍L3",
            "range": [
                1,
                2
            ],
            "energyCost": 0,
            "maxBulletCount": 5,
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
            "damage": 5545,
            "curage": 0,
            "powerCost": 20
        },
        "sword4": {
            "title": "實體劍L4",
            "range": [
                1,
                2
            ],
            "energyCost": 0,
            "maxBulletCount": 5,
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
            "damage": 6434,
            "curage": 0,
            "powerCost": 23
        },
        "sword5": {
            "title": "實體劍L5",
            "range": [
                2,
                3
            ],
            "energyCost": 0,
            "maxBulletCount": 4,
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
            "damage": 8869,
            "curage": 0,
            "powerCost": 30
        },
        "sword6": {
            "title": "實體劍L6",
            "range": [
                2,
                3
            ],
            "energyCost": 0,
            "maxBulletCount": 4,
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
            "damage": 10503,
            "curage": 0,
            "powerCost": 34
        },
        "sword7": {
            "title": "實體劍L7",
            "range": [
                2,
                3
            ],
            "energyCost": 0,
            "maxBulletCount": 3,
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
            "damage": 13312,
            "curage": 0,
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
            "accuracy": 0.9,
            "damage": 3800,
            "curage": 0,
            "powerCost": 12
        },
        "gaite_axe": {
            "title": "蓋特巨斧",
            "range": [
                2,
                3
            ],
            "energyCost": 0,
            "maxBulletCount": 3,
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
            "energyType": "bullet",
            "type": "single",
            "accuracy": 0.7,
            "damage": 10000,
            "curage": 110,
            "powerCost": 30
        },
        "gaite_beam": {
            "title": "蓋特光線",
            "range": [
                1,
                3
            ],
            "energyCost": 30,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "moveAttack",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 9000,
            "curage": 120,
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
            "ability": [
                "multi"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1,
            "damage": 3000,
            "curage": 0,
            "powerCost": 12
        },
        "gaite_drill": {
            "title": "蓋特電鑽",
            "range": [
                1,
                1
            ],
            "energyCost": 9,
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
            "damage": 3500,
            "curage": 0,
            "powerCost": 12
        },
        "gaite_powerDrill": {
            "title": "蓋特强力電鉆",
            "range": [
                1,
                2
            ],
            "energyCost": 20,
            "maxBulletCount": 0,
            "suitability": [
                1.2,
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
            "damage": 7000,
            "curage": 110,
            "powerCost": 26
        },
        "gaite_punch": {
            "title": "蓋特重拳",
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
            "accuracy": 1.1,
            "damage": 3200,
            "curage": 0,
            "powerCost": 10
        },
        "gaite_missle": {
            "title": "蓋特飛彈",
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
            "ability": [
                "missle"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1,
            "damage": 3000,
            "curage": 0,
            "powerCost": 12
        },
        "gaite_shan": {
            "title": "蓋特大雪山",
            "range": [
                1,
                1
            ],
            "energyCost": 20,
            "maxBulletCount": 0,
            "suitability": [
                1,
                1.3,
                0.75,
                1
            ],
            "ability": [
                "moveAttack",
                "melee"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 9500,
            "curage": 120,
            "powerCost": 30
        },
        "moshen_ray": {
            "title": "光子力射綫",
            "range": [
                1,
                4
            ],
            "energyCost": 3,
            "maxBulletCount": 0,
            "suitability": [
                1,
                2,
                1,
                1
            ],
            "ability": [],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 2500,
            "curage": 0,
            "powerCost": 8
        },
        "moshen_punch": {
            "title": "金剛重拳",
            "range": [
                1,
                1
            ],
            "energyCost": 8,
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
            "damage": 3300,
            "curage": 0,
            "powerCost": 10
        },
        "moshen_flypunch": {
            "title": "金剛飛拳",
            "range": [
                1,
                3
            ],
            "energyCost": 0,
            "maxBulletCount": 4,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1,
            "damage": 4000,
            "curage": 0,
            "powerCost": 25
        },
        "moshen_jian": {
            "title": "金剛神劍",
            "range": [
                1,
                1
            ],
            "energyCost": 15,
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
            "damage": 6000,
            "curage": 110,
            "powerCost": 20
        },
        "moshen_fire": {
            "title": "魔神火焰",
            "range": [
                1,
                2
            ],
            "energyCost": 23,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 8500,
            "curage": 120,
            "powerCost": 30
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
            "desc": "原地使用時。命中增加{0}。不可反擊。",
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
            "values": [
                "1.5"
            ]
        },
        "lighting": {
            "title": "電擊",
            "desc": "無視裝甲值. 水中傷害x{0}",
            "values": [
                "1.2"
            ]
        },
        "spray": {
            "title": "擴散",
            "desc": "命中x{0}, 傷害x{1}",
            "values": [
                "1.3",
                "0.8"
            ]
        },
        "multi": {
            "title": "連射",
            "desc": "命中x{0}, 傷害x{1}~{2}",
            "values": [
                "1.1",
                "0.7",
                "1.3"
            ]
        },
        "missle": {
            "title": "飛彈",
            "desc": "命中x{0}, 會被防禦兵器擊落",
            "values": [
                "1.3"
            ]
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