package data

const (
	dataJsonString = `{
    "component": {
        "energy1": {
            "id": "energy1",
            "title": "能量夾L1",
            "cost": 1000,
            "desc": "增加{0}能量.",
            "value": [
                "25"
            ],
            "powerCost": 2,
            "action": "equipment"
        },
        "energy2": {
            "id": "energy2",
            "title": "能量夾L2",
            "cost": 2000,
            "desc": "增加{0}能量.",
            "value": [
                "50"
            ],
            "powerCost": 3,
            "action": "equipment"
        },
        "energy3": {
            "id": "energy3",
            "title": "能量夾L3",
            "cost": 3000,
            "desc": "增加{0}能量.",
            "value": [
                "75"
            ],
            "powerCost": 4,
            "action": "equipment"
        },
        "energy4": {
            "id": "energy4",
            "title": "能量夾L4",
            "cost": 4000,
            "desc": "增加{0}能量.",
            "value": [
                "100"
            ],
            "powerCost": 5,
            "action": "equipment"
        },
        "energy5": {
            "id": "energy5",
            "title": "能量夾L5",
            "cost": 5000,
            "desc": "增加{0}能量.",
            "value": [
                "125"
            ],
            "powerCost": 6,
            "action": "equipment"
        },
        "armor1": {
            "id": "armor1",
            "title": "裝甲L1",
            "cost": 1000,
            "desc": "增加{0}耐久. 被實彈傷害-{1}",
            "value": [
                "500.0",
                "100.0"
            ],
            "powerCost": 2,
            "action": "equipment"
        },
        "armor2": {
            "id": "armor2",
            "title": "裝甲L2",
            "cost": 2000,
            "desc": "增加{0}耐久. 被實彈傷害-{1}",
            "value": [
                "1000.0",
                "200.0"
            ],
            "powerCost": 3,
            "action": "equipment"
        },
        "armor3": {
            "id": "armor3",
            "title": "裝甲L3",
            "cost": 3000,
            "desc": "增加{0}耐久. 被實彈傷害-{1}",
            "value": [
                "1500.0",
                "300.0"
            ],
            "powerCost": 4,
            "action": "equipment"
        },
        "armor4": {
            "id": "armor4",
            "title": "裝甲L4",
            "cost": 4000,
            "desc": "增加{0}耐久. 被實彈傷害-{1}",
            "value": [
                "2000.0",
                "400.0"
            ],
            "powerCost": 5,
            "action": "equipment"
        },
        "armor5": {
            "id": "armor5",
            "title": "裝甲L5",
            "cost": 5000,
            "desc": "增加{0}耐久. 被實彈傷害-{1}",
            "value": [
                "2500.0",
                "500.0"
            ],
            "powerCost": 6,
            "action": "equipment"
        },
        "beam_armor1": {
            "id": "beam_armor1",
            "title": "光束裝甲L1",
            "cost": 1000,
            "desc": "增加{0}耐久. 被光束傷害-{1}",
            "value": [
                "500.0",
                "100.0"
            ],
            "powerCost": 2,
            "action": "equipment"
        },
        "beam_armor2": {
            "id": "beam_armor2",
            "title": "光束裝甲L2",
            "cost": 2000,
            "desc": "增加{0}耐久. 被光束傷害-{1}",
            "value": [
                "1000.0",
                "200.0"
            ],
            "powerCost": 3,
            "action": "equipment"
        },
        "beam_armor3": {
            "id": "beam_armor3",
            "title": "光束裝甲L3",
            "cost": 3000,
            "desc": "增加{0}耐久. 被光束傷害-{1}",
            "value": [
                "1500.0",
                "300.0"
            ],
            "powerCost": 4,
            "action": "equipment"
        },
        "beam_armor4": {
            "id": "beam_armor4",
            "title": "光束裝甲L4",
            "cost": 4000,
            "desc": "增加{0}耐久. 被光束傷害-{1}",
            "value": [
                "2000.0",
                "400.0"
            ],
            "powerCost": 5,
            "action": "equipment"
        },
        "beam_armor5": {
            "id": "beam_armor5",
            "title": "光束裝甲L5",
            "cost": 5000,
            "desc": "增加{0}耐久. 被光束傷害-{1}",
            "value": [
                "2500.0",
                "500.0"
            ],
            "powerCost": 6,
            "action": "equipment"
        },
        "fire_armor": {
            "id": "fire_armor",
            "title": "防火裝甲",
            "cost": 2000,
            "desc": "增加{0}耐久. 不受火焰武器影響. 被火焰傷害-{1}",
            "value": [
                "500.0",
                "1000.0"
            ],
            "powerCost": 2,
            "action": "equipment"
        },
        "lighting_armor": {
            "id": "lighting_armor",
            "title": "防電裝甲",
            "cost": 2000,
            "desc": "增加{0}耐久. 不受雷電武器影響. 被雷電傷害-{1}",
            "value": [
                "500.0",
                "1000.0"
            ],
            "powerCost": 2,
            "action": "equipment"
        },
        "engine1": {
            "id": "engine1",
            "title": "引擎L1",
            "cost": 1000,
            "desc": "增加{0}power",
            "value": [
                "5"
            ],
            "powerCost": 0,
            "action": "equipment"
        },
        "engine2": {
            "id": "engine2",
            "title": "引擎L2",
            "cost": 2000,
            "desc": "增加{0}power",
            "value": [
                "10"
            ],
            "powerCost": 0,
            "action": "equipment"
        },
        "engine3": {
            "id": "engine3",
            "title": "引擎L3",
            "cost": 3000,
            "desc": "增加{0}power",
            "value": [
                "15"
            ],
            "powerCost": 0,
            "action": "equipment"
        },
        "engine4": {
            "id": "engine4",
            "title": "引擎L4",
            "cost": 4000,
            "desc": "增加{0}power",
            "value": [
                "20"
            ],
            "powerCost": 0,
            "action": "equipment"
        },
        "engine5": {
            "id": "engine5",
            "title": "引擎L5",
            "cost": 5000,
            "desc": "增加{0}power",
            "value": [
                "25"
            ],
            "powerCost": 0,
            "action": "equipment"
        },
        "fixPack": {
            "id": "fixPack",
            "title": "修復包",
            "cost": 1000,
            "desc": "回復{0}HP",
            "value": [
                "3000"
            ],
            "powerCost": 1,
            "action": "item"
        },
        "energyPack": {
            "id": "energyPack",
            "title": "能量包",
            "cost": 1000,
            "desc": "回復{0}EN",
            "value": [
                "80"
            ],
            "powerCost": 1,
            "action": "item"
        },
        "bulletPack": {
            "id": "bulletPack",
            "title": "彈夾",
            "cost": 1000,
            "desc": "所有彈藥類武器彈數補充{0}",
            "value": [
                "3"
            ],
            "powerCost": 1,
            "action": "item"
        },
        "shield": {
            "id": "shield",
            "title": "盾",
            "cost": 1000,
            "desc": "機率{0}被實彈傷害-{1}.",
            "value": [
                "0.2",
                "3000"
            ],
            "powerCost": 5,
            "action": "equipment"
        },
        "beam_shield": {
            "id": "beam_shield",
            "title": "光束盾",
            "cost": 1000,
            "desc": "機率{0}被光束傷害-{1}.",
            "value": [
                "0.2",
                "3000"
            ],
            "powerCost": 5,
            "action": "equipment"
        },
        "psArmor": {
            "id": "psArmor",
            "title": "ps裝甲",
            "cost": 3000,
            "desc": "被實彈傷害-{1}",
            "value": [
                "1000"
            ],
            "powerCost": 2,
            "action": "equipment"
        },
        "zeroSystem": {
            "id": "zeroSystem",
            "title": "零式系統",
            "cost": 2000,
            "desc": "武器的最終命中增加{0}%，自身的最終被命中率減少{1}%",
            "value": [
                "10",
                "15"
            ],
            "powerCost": 20,
            "action": "equipment"
        },
        "shejililiang": {
            "id": "shejililiang",
            "title": "射擊力量",
            "cost": 200,
            "desc": "射擊系武器射程增加{0}",
            "value": [
                "1"
            ],
            "powerCost": 2,
            "action": "equipment"
        },
        "gedouliliang": {
            "id": "gedouliliang",
            "title": "格鬥力量",
            "cost": 200,
            "desc": "格鬥系武器射程增加{0}",
            "value": [
                "1"
            ],
            "powerCost": 2,
            "action": "equipment"
        },
        "shoucigongjihongli": {
            "id": "shoucigongjihongli",
            "title": "首次攻擊紅利",
            "cost": 200,
            "desc": "自軍第一次發動的攻擊，基本值*{0}",
            "value": [
                "3"
            ],
            "powerCost": 2,
            "action": "equipment"
        },
        "gushou": {
            "id": "gushou",
            "title": "固守",
            "cost": 200,
            "desc": "這個回合沒有攻擊的話，下個合回開始前受傷害減少{0}",
            "value": [
                "3000"
            ],
            "powerCost": 2,
            "action": "equipment"
        },
        "gedouwang": {
            "id": "gedouwang",
            "title": "格鬥王",
            "cost": 200,
            "desc": "若所有武器都是格鬥系，武器傷害+{0}%, 回避+{1}%",
            "value": [
                "1.2",
                "1.2"
            ],
            "powerCost": 2,
            "action": "equipment"
        },
        "shejiwang": {
            "id": "shejiwang",
            "title": "射擊王",
            "cost": 200,
            "desc": "若所有武器都是射擊系，射擊傷害+{0}%, 受傷害減少{0}",
            "value": [
                "1.2",
                "1000"
            ],
            "powerCost": 2,
            "action": "equipment"
        },
        "feixingwang": {
            "id": "feixingwang",
            "title": "飛行王",
            "cost": 200,
            "desc": "飛行狀態時，移動力+{0}，回避+{1}%",
            "value": [
                "2",
                "1.2"
            ],
            "powerCost": 2,
            "action": "equipment"
        },
        "shengwuzhuangjia": {
            "id": "shengwuzhuangjia",
            "title": "生物裝甲",
            "cost": 200,
            "desc": "增加{0}裝中. 每回合開始回復{1}%最大hp.",
            "value": [
                "300",
                "0.1"
            ],
            "powerCost": 2,
            "action": "equipment"
        },
        "feixingqi": {
            "id": "feixingqi",
            "title": "飛行器",
            "cost": 200,
            "desc": "空中適性變成{0}",
            "value": [
                "0.8"
            ],
            "powerCost": 2,
            "action": "equipment"
        },
        "pensheqidian": {
            "id": "pensheqidian",
            "title": "噴射氣墊",
            "cost": 200,
            "desc": "地面移動時出力*{0}",
            "value": [
                "1.5"
            ],
            "powerCost": 2,
            "action": "equipment"
        }
    },
    "componentAction": {
        "equipment": {
            "id": "equipment",
            "title": "裝備"
        },
        "item": {
            "id": "item",
            "title": "使用"
        },
        "itemForSelf": {
            "id": "itemForSelf",
            "title": "使用自身"
        }
    },
    "config": {
        "default": {
            "id": "default",
            "powerCostForMove": 5,
            "award": [
                1.2,
                1.2
            ]
        }
    },
    "level": {
        "ground1": {
            "id": "ground1",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 5,
            "groupCount": 1,
            "boss": [
                "moshen"
            ]
        },
        "ground2": {
            "id": "ground2",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 8,
            "groupCount": 2,
            "boss": []
        },
        "ground3": {
            "id": "ground3",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 11,
            "groupCount": 2,
            "boss": []
        },
        "ground4": {
            "id": "ground4",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 14,
            "groupCount": 2,
            "boss": []
        },
        "ground5": {
            "id": "ground5",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 17,
            "groupCount": 3,
            "boss": []
        },
        "ground6": {
            "id": "ground6",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 20,
            "groupCount": 3,
            "boss": []
        },
        "ground7": {
            "id": "ground7",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 23,
            "groupCount": 3,
            "boss": []
        },
        "ground8": {
            "id": "ground8",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 26,
            "groupCount": 4,
            "boss": []
        },
        "ground9": {
            "id": "ground9",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 29,
            "groupCount": 5,
            "boss": []
        },
        "ground10": {
            "id": "ground10",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 32,
            "groupCount": 6,
            "boss": []
        },
        "sea1": {
            "id": "sea1",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 5,
            "groupCount": 1,
            "boss": []
        },
        "sea2": {
            "id": "sea2",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 8,
            "groupCount": 2,
            "boss": []
        },
        "sea3": {
            "id": "sea3",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 11,
            "groupCount": 2,
            "boss": []
        },
        "sea4": {
            "id": "sea4",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 14,
            "groupCount": 2,
            "boss": []
        },
        "sea5": {
            "id": "sea5",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 17,
            "groupCount": 3,
            "boss": []
        },
        "sea6": {
            "id": "sea6",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 20,
            "groupCount": 3,
            "boss": []
        },
        "sea7": {
            "id": "sea7",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 23,
            "groupCount": 3,
            "boss": []
        },
        "sea8": {
            "id": "sea8",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 26,
            "groupCount": 4,
            "boss": []
        },
        "sea9": {
            "id": "sea9",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 29,
            "groupCount": 5,
            "boss": []
        },
        "sea10": {
            "id": "sea10",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 32,
            "groupCount": 6,
            "boss": []
        },
        "sky1": {
            "id": "sky1",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 5,
            "groupCount": 1,
            "boss": []
        },
        "sky2": {
            "id": "sky2",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 8,
            "groupCount": 2,
            "boss": []
        },
        "sky3": {
            "id": "sky3",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 11,
            "groupCount": 2,
            "boss": []
        },
        "sky4": {
            "id": "sky4",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 14,
            "groupCount": 2,
            "boss": []
        },
        "sky5": {
            "id": "sky5",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 17,
            "groupCount": 3,
            "boss": []
        },
        "sky6": {
            "id": "sky6",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 20,
            "groupCount": 3,
            "boss": []
        },
        "sky7": {
            "id": "sky7",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 23,
            "groupCount": 3,
            "boss": []
        },
        "sky8": {
            "id": "sky8",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 26,
            "groupCount": 4,
            "boss": []
        },
        "sky9": {
            "id": "sky9",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 29,
            "groupCount": 5,
            "boss": []
        },
        "sky10": {
            "id": "sky10",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 32,
            "groupCount": 6,
            "boss": []
        },
        "common1": {
            "id": "common1",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 5,
            "groupCount": 1,
            "boss": []
        },
        "common2": {
            "id": "common2",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 8,
            "groupCount": 2,
            "boss": []
        },
        "common3": {
            "id": "common3",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 11,
            "groupCount": 2,
            "boss": []
        },
        "common4": {
            "id": "common4",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 14,
            "groupCount": 2,
            "boss": []
        },
        "common5": {
            "id": "common5",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 17,
            "groupCount": 3,
            "boss": []
        },
        "common6": {
            "id": "common6",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 20,
            "groupCount": 3,
            "boss": []
        },
        "common7": {
            "id": "common7",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 23,
            "groupCount": 3,
            "boss": []
        },
        "common8": {
            "id": "common8",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 26,
            "groupCount": 4,
            "boss": []
        },
        "common9": {
            "id": "common9",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 29,
            "groupCount": 5,
            "boss": []
        },
        "common10": {
            "id": "common10",
            "robots": [
                "BGD",
                "BGD",
                "BGD",
                "BYJ",
                "BYJ",
                "BYJ"
            ],
            "count": 32,
            "groupCount": 6,
            "boss": []
        }
    },
    "pilot": {
        "amuro": {
            "id": "amuro",
            "title": "阿姆羅",
            "cost": 2000,
            "melee": 0.75,
            "range": 1.25,
            "evade": 1,
            "guard": 1,
            "expMelee": 80,
            "expRange": 100,
            "expEvade": 100,
            "expGuard": 50,
            "exp": 100
        },
        "normal": {
            "id": "normal",
            "title": "駕駛",
            "cost": 600,
            "melee": 0.5,
            "range": 0.5,
            "evade": 0.5,
            "guard": 0.5,
            "expMelee": 10,
            "expRange": 10,
            "expEvade": 10,
            "expGuard": 10,
            "exp": 10
        }
    },
    "pilotAbility": {},
    "robot": {
        "gaite_sky": {
            "id": "gaite_sky",
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
            ],
            "unlockExp": 10
        },
        "gaite_land": {
            "id": "gaite_land",
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
            ],
            "unlockExp": 10
        },
        "gaite_sea": {
            "id": "gaite_sea",
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
            ],
            "unlockExp": 10
        },
        "moshen": {
            "id": "moshen",
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
            "transform": [],
            "unlockExp": 10
        },
        "zgundam": {
            "id": "zgundam",
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
            ],
            "unlockExp": 10
        },
        "zgundam_sky": {
            "id": "zgundam_sky",
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
            ],
            "unlockExp": 10
        },
        "gundam": {
            "id": "gundam",
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
            "transform": [],
            "unlockExp": 10
        },
        "jimu": {
            "id": "jimu",
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
            "transform": [],
            "unlockExp": 10
        },
        "BGD": {
            "id": "BGD",
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
            "transform": [],
            "unlockExp": 10
        },
        "BYJ": {
            "id": "BYJ",
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
            "transform": [],
            "unlockExp": 10
        },
        "BJJ": {
            "id": "BJJ",
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
            "transform": [],
            "unlockExp": 10
        },
        "BGR": {
            "id": "BGR",
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
            "transform": [],
            "unlockExp": 10
        },
        "BFD": {
            "id": "BFD",
            "title": "制式防盾",
            "cost": 14400,
            "power": 60,
            "weapons": [
                "beam_gun1"
            ],
            "components": [
                "energy1",
                "armor2",
                "shield"
            ],
            "suitability": [
                1,
                0.5,
                0,
                2
            ],
            "transform": [],
            "unlockExp": 10
        },
        "windgundam": {
            "id": "windgundam",
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
            ],
            "unlockExp": 10
        },
        "windgundam_sky": {
            "id": "windgundam_sky",
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
            ],
            "unlockExp": 10
        },
        "strikegundam": {
            "id": "strikegundam",
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
            "transform": [],
            "unlockExp": 10
        },
        "exlight": {
            "id": "exlight",
            "title": "特輕型機甲",
            "cost": 3600,
            "power": 30,
            "weapons": [],
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
            "transform": [],
            "unlockExp": 2
        },
        "light": {
            "id": "light",
            "title": "輕型機甲",
            "cost": 8100,
            "power": 45,
            "weapons": [],
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
            "transform": [],
            "unlockExp": 1
        },
        "normal": {
            "id": "normal",
            "title": "制式機甲",
            "cost": 16900,
            "power": 65,
            "weapons": [],
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
            "transform": [],
            "unlockExp": 0
        },
        "medium": {
            "id": "medium",
            "title": "中型機甲",
            "cost": 32400,
            "power": 90,
            "weapons": [],
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
            "transform": [],
            "unlockExp": 1
        },
        "heavy": {
            "id": "heavy",
            "title": "重型機甲",
            "cost": 57600,
            "power": 120,
            "weapons": [],
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
            "transform": [],
            "unlockExp": 3
        },
        "exheavy": {
            "id": "exheavy",
            "title": "特重型機甲",
            "cost": 96100,
            "power": 155,
            "weapons": [],
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
            "transform": [],
            "unlockExp": 4
        }
    },
    "terrain": {
        "mountain": {
            "id": "mountain",
            "title": "mountain",
            "cost": 2,
            "hitRate": 1,
            "damage": 0.5
        },
        "plain": {
            "id": "plain",
            "title": "plain",
            "cost": 0.5,
            "hitRate": 1,
            "damage": 1
        },
        "forest": {
            "id": "forest",
            "title": "forest",
            "cost": 1.5,
            "hitRate": 0.5,
            "damage": 0.75
        },
        "road": {
            "id": "road",
            "title": "road",
            "cost": 0.1,
            "hitRate": 1,
            "damage": 1
        },
        "city": {
            "id": "city",
            "title": "city",
            "cost": 2,
            "hitRate": 0.9,
            "damage": 0.75
        },
        "beach": {
            "id": "beach",
            "title": "beach",
            "cost": 0.75,
            "hitRate": 1,
            "damage": 1
        },
        "shallowSea": {
            "id": "shallowSea",
            "title": "shallowSea",
            "cost": 1.5,
            "hitRate": 1,
            "damage": 1
        },
        "deepSea": {
            "id": "deepSea",
            "title": "deepSea",
            "cost": 3,
            "hitRate": 1,
            "damage": 1
        },
        "award": {
            "id": "award",
            "title": "award",
            "cost": 0.25,
            "hitRate": 1,
            "damage": 1
        }
    },
    "terrainMapping": {
        "0": {
            "id": "0",
            "terrain": "deepSea"
        },
        "1": {
            "id": "1",
            "terrain": "shallowSea"
        },
        "2": {
            "id": "2",
            "terrain": "beach"
        },
        "3": {
            "id": "3",
            "terrain": "plain"
        },
        "4": {
            "id": "4",
            "terrain": "city"
        },
        "5": {
            "id": "5",
            "terrain": "mountain"
        },
        "6": {
            "id": "6",
            "terrain": "forest"
        },
        "7": {
            "id": "7",
            "terrain": "award"
        },
        "8": {
            "id": "8",
            "terrain": "road"
        }
    },
    "weapon": {
        "beam_mega1": {
            "id": "beam_mega1",
            "title": "粒子炮L1",
            "cost": 1600,
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
            "powerCost": 20,
            "unlockExp": 0
        },
        "beam_mega2": {
            "id": "beam_mega2",
            "title": "粒子炮L2",
            "cost": 2304,
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
            "powerCost": 24,
            "unlockExp": 0
        },
        "beam_mega3": {
            "id": "beam_mega3",
            "title": "粒子炮L3",
            "cost": 6400,
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
            "powerCost": 40,
            "unlockExp": 0
        },
        "beam_mega4": {
            "id": "beam_mega4",
            "title": "粒子炮L4",
            "cost": 8464,
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
            "powerCost": 46,
            "unlockExp": 0
        },
        "beam_mega5": {
            "id": "beam_mega5",
            "title": "粒子炮L5",
            "cost": 14400,
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
            "powerCost": 60,
            "unlockExp": 0
        },
        "beam_mega6": {
            "id": "beam_mega6",
            "title": "粒子炮L6",
            "cost": 16384,
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
            "accuracy": 0.46799999999999997,
            "damage": 9636,
            "curage": 130,
            "powerCost": 64,
            "unlockExp": 0
        },
        "beam_mega7": {
            "id": "beam_mega7",
            "title": "粒子炮L7",
            "cost": 25600,
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
            "powerCost": 80,
            "unlockExp": 0
        },
        "beam_sniper1": {
            "id": "beam_sniper1",
            "title": "光束狙擊鎗L1",
            "cost": 1600,
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
            "powerCost": 20,
            "unlockExp": 0
        },
        "beam_sniper2": {
            "id": "beam_sniper2",
            "title": "光束狙擊鎗L2",
            "cost": 2304,
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
            "powerCost": 24,
            "unlockExp": 0
        },
        "beam_sniper3": {
            "id": "beam_sniper3",
            "title": "光束狙擊鎗L3",
            "cost": 6400,
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
            "powerCost": 40,
            "unlockExp": 0
        },
        "beam_sniper4": {
            "id": "beam_sniper4",
            "title": "光束狙擊鎗L4",
            "cost": 8464,
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
            "powerCost": 46,
            "unlockExp": 0
        },
        "beam_sniper5": {
            "id": "beam_sniper5",
            "title": "光束狙擊鎗L5",
            "cost": 14400,
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
            "powerCost": 60,
            "unlockExp": 0
        },
        "beam_sniper6": {
            "id": "beam_sniper6",
            "title": "光束狙擊鎗L6",
            "cost": 16384,
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
            "powerCost": 64,
            "unlockExp": 0
        },
        "beam_sniper7": {
            "id": "beam_sniper7",
            "title": "光束狙擊鎗L7",
            "cost": 25600,
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
            "powerCost": 80,
            "unlockExp": 0
        },
        "sniper1": {
            "id": "sniper1",
            "title": "狙擊炮L1",
            "cost": 1600,
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
            "powerCost": 20,
            "unlockExp": 0
        },
        "sniper2": {
            "id": "sniper2",
            "title": "狙擊炮L2",
            "cost": 2304,
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
            "powerCost": 24,
            "unlockExp": 0
        },
        "sniper3": {
            "id": "sniper3",
            "title": "狙擊炮L3",
            "cost": 6400,
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
            "powerCost": 40,
            "unlockExp": 0
        },
        "sniper4": {
            "id": "sniper4",
            "title": "狙擊炮L4",
            "cost": 8464,
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
            "powerCost": 46,
            "unlockExp": 0
        },
        "sniper5": {
            "id": "sniper5",
            "title": "狙擊炮L5",
            "cost": 14400,
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
            "powerCost": 60,
            "unlockExp": 0
        },
        "sniper6": {
            "id": "sniper6",
            "title": "狙擊炮L6",
            "cost": 16384,
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
            "powerCost": 64,
            "unlockExp": 0
        },
        "sniper7": {
            "id": "sniper7",
            "title": "狙擊炮L7",
            "cost": 25600,
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
            "damage": 17984,
            "curage": 0,
            "powerCost": 80,
            "unlockExp": 0
        },
        "beam_gun1": {
            "id": "beam_gun1",
            "title": "光束鎗L1",
            "cost": 400,
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
            "powerCost": 10,
            "unlockExp": 0
        },
        "beam_gun2": {
            "id": "beam_gun2",
            "title": "光束鎗L2",
            "cost": 576,
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
            "powerCost": 12,
            "unlockExp": 0
        },
        "beam_gun3": {
            "id": "beam_gun3",
            "title": "光束鎗L3",
            "cost": 1600,
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
            "powerCost": 20,
            "unlockExp": 0
        },
        "beam_gun4": {
            "id": "beam_gun4",
            "title": "光束鎗L4",
            "cost": 2116,
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
            "powerCost": 23,
            "unlockExp": 0
        },
        "beam_gun5": {
            "id": "beam_gun5",
            "title": "光束鎗L5",
            "cost": 3600,
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
            "powerCost": 30,
            "unlockExp": 0
        },
        "beam_gun6": {
            "id": "beam_gun6",
            "title": "光束鎗L6",
            "cost": 4624,
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
            "powerCost": 34,
            "unlockExp": 0
        },
        "beam_gun7": {
            "id": "beam_gun7",
            "title": "光束鎗L7",
            "cost": 6400,
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
            "powerCost": 40,
            "unlockExp": 0
        },
        "beam_gatling1": {
            "id": "beam_gatling1",
            "title": "光束衝鋒鎗L1",
            "cost": 400,
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
            "powerCost": 10,
            "unlockExp": 0
        },
        "beam_gatling2": {
            "id": "beam_gatling2",
            "title": "光束衝鋒鎗L2",
            "cost": 576,
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
            "powerCost": 12,
            "unlockExp": 0
        },
        "beam_gatling3": {
            "id": "beam_gatling3",
            "title": "光束衝鋒鎗L3",
            "cost": 1600,
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
            "powerCost": 20,
            "unlockExp": 0
        },
        "beam_gatling4": {
            "id": "beam_gatling4",
            "title": "光束衝鋒鎗L4",
            "cost": 2116,
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
            "powerCost": 23,
            "unlockExp": 0
        },
        "beam_gatling5": {
            "id": "beam_gatling5",
            "title": "光束衝鋒鎗L5",
            "cost": 3600,
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
            "powerCost": 30,
            "unlockExp": 0
        },
        "beam_gatling6": {
            "id": "beam_gatling6",
            "title": "光束衝鋒鎗L6",
            "cost": 4624,
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
            "powerCost": 34,
            "unlockExp": 0
        },
        "beam_gatling7": {
            "id": "beam_gatling7",
            "title": "光束衝鋒鎗L7",
            "cost": 6400,
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
            "powerCost": 40,
            "unlockExp": 0
        },
        "gatling1": {
            "id": "gatling1",
            "title": "衝鋒鎗L1",
            "cost": 400,
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
            "powerCost": 10,
            "unlockExp": 0
        },
        "gatling2": {
            "id": "gatling2",
            "title": "衝鋒鎗L2",
            "cost": 576,
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
            "powerCost": 12,
            "unlockExp": 0
        },
        "gatling3": {
            "id": "gatling3",
            "title": "衝鋒鎗L3",
            "cost": 1600,
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
            "powerCost": 20,
            "unlockExp": 0
        },
        "gatling4": {
            "id": "gatling4",
            "title": "衝鋒鎗L4",
            "cost": 2116,
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
            "powerCost": 23,
            "unlockExp": 0
        },
        "gatling5": {
            "id": "gatling5",
            "title": "衝鋒鎗L5",
            "cost": 3600,
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
            "powerCost": 30,
            "unlockExp": 0
        },
        "gatling6": {
            "id": "gatling6",
            "title": "衝鋒鎗L6",
            "cost": 4624,
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
            "powerCost": 34,
            "unlockExp": 0
        },
        "gatling7": {
            "id": "gatling7",
            "title": "衝鋒鎗L7",
            "cost": 6400,
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
            "powerCost": 40,
            "unlockExp": 0
        },
        "beam_sword1": {
            "id": "beam_sword1",
            "title": "光束劍L1",
            "cost": 400,
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
            "powerCost": 10,
            "unlockExp": 0
        },
        "beam_sword2": {
            "id": "beam_sword2",
            "title": "光束劍L2",
            "cost": 576,
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
            "powerCost": 12,
            "unlockExp": 0
        },
        "beam_sword3": {
            "id": "beam_sword3",
            "title": "光束劍L3",
            "cost": 1600,
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
            "powerCost": 20,
            "unlockExp": 0
        },
        "beam_sword4": {
            "id": "beam_sword4",
            "title": "光束劍L4",
            "cost": 2116,
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
            "powerCost": 23,
            "unlockExp": 0
        },
        "beam_sword5": {
            "id": "beam_sword5",
            "title": "光束劍L5",
            "cost": 3600,
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
            "powerCost": 30,
            "unlockExp": 0
        },
        "beam_sword6": {
            "id": "beam_sword6",
            "title": "光束劍L6",
            "cost": 4624,
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
            "powerCost": 34,
            "unlockExp": 0
        },
        "beam_sword7": {
            "id": "beam_sword7",
            "title": "光束劍L7",
            "cost": 6400,
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
            "powerCost": 40,
            "unlockExp": 0
        },
        "sword1": {
            "id": "sword1",
            "title": "實體劍L1",
            "cost": 400,
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
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1,
            "damage": 3176,
            "curage": 0,
            "powerCost": 10,
            "unlockExp": 0
        },
        "sword2": {
            "id": "sword2",
            "title": "實體劍L2",
            "cost": 576,
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
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1,
            "damage": 3581,
            "curage": 0,
            "powerCost": 12,
            "unlockExp": 0
        },
        "sword3": {
            "id": "sword3",
            "title": "實體劍L3",
            "cost": 1600,
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
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1,
            "damage": 5545,
            "curage": 0,
            "powerCost": 20,
            "unlockExp": 0
        },
        "sword4": {
            "id": "sword4",
            "title": "實體劍L4",
            "cost": 2116,
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
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1,
            "damage": 6434,
            "curage": 0,
            "powerCost": 23,
            "unlockExp": 0
        },
        "sword5": {
            "id": "sword5",
            "title": "實體劍L5",
            "cost": 3600,
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
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1,
            "damage": 8869,
            "curage": 0,
            "powerCost": 30,
            "unlockExp": 0
        },
        "sword6": {
            "id": "sword6",
            "title": "實體劍L6",
            "cost": 4624,
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
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1,
            "damage": 10503,
            "curage": 0,
            "powerCost": 34,
            "unlockExp": 0
        },
        "sword7": {
            "id": "sword7",
            "title": "實體劍L7",
            "cost": 6400,
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
            "accuracy": 1,
            "damage": 13312,
            "curage": 0,
            "powerCost": 40,
            "unlockExp": 0
        },
        "gaite_handSword": {
            "id": "gaite_handSword",
            "title": "蓋特手刀",
            "cost": 0,
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
            "powerCost": 12,
            "unlockExp": 0
        },
        "gaite_axe": {
            "id": "gaite_axe",
            "title": "蓋特巨斧",
            "cost": 0,
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
            "powerCost": 30,
            "unlockExp": 0
        },
        "gaite_beam": {
            "id": "gaite_beam",
            "title": "蓋特光線",
            "cost": 0,
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
            "powerCost": 30,
            "unlockExp": 0
        },
        "gaite_cannon": {
            "id": "gaite_cannon",
            "title": "蓋特加農",
            "cost": 0,
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
            "powerCost": 12,
            "unlockExp": 0
        },
        "gaite_drill": {
            "id": "gaite_drill",
            "title": "蓋特電鑽",
            "cost": 0,
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
            "powerCost": 12,
            "unlockExp": 0
        },
        "gaite_powerDrill": {
            "id": "gaite_powerDrill",
            "title": "蓋特强力電鉆",
            "cost": 0,
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
            "powerCost": 26,
            "unlockExp": 0
        },
        "gaite_punch": {
            "id": "gaite_punch",
            "title": "蓋特重拳",
            "cost": 0,
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
            "powerCost": 10,
            "unlockExp": 0
        },
        "gaite_missle": {
            "id": "gaite_missle",
            "title": "蓋特飛彈",
            "cost": 0,
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
                "missile"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1,
            "damage": 3000,
            "curage": 0,
            "powerCost": 12,
            "unlockExp": 0
        },
        "gaite_shan": {
            "id": "gaite_shan",
            "title": "蓋特大雪山",
            "cost": 0,
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
            "powerCost": 30,
            "unlockExp": 0
        },
        "moshen_ray": {
            "id": "moshen_ray",
            "title": "光子力射綫",
            "cost": 0,
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
            "powerCost": 8,
            "unlockExp": 0
        },
        "moshen_punch": {
            "id": "moshen_punch",
            "title": "金剛重拳",
            "cost": 0,
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
            "powerCost": 10,
            "unlockExp": 0
        },
        "moshen_flypunch": {
            "id": "moshen_flypunch",
            "title": "金剛飛拳",
            "cost": 0,
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
            "powerCost": 25,
            "unlockExp": 0
        },
        "moshen_jian": {
            "id": "moshen_jian",
            "title": "金剛神劍",
            "cost": 0,
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
            "powerCost": 20,
            "unlockExp": 0
        },
        "moshen_fire": {
            "id": "moshen_fire",
            "title": "魔神火焰",
            "cost": 0,
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
            "powerCost": 30,
            "unlockExp": 0
        }
    },
    "weaponAbility": {
        "moveAttack": {
            "id": "moveAttack",
            "title": "移動可",
            "desc": "可移動使用",
            "values": []
        },
        "standAttack": {
            "id": "standAttack",
            "title": "狙擊",
            "desc": "原地使用時。命中增加{0}。不可反擊。",
            "values": [
                "1"
            ]
        },
        "melee": {
            "id": "melee",
            "title": "格鬥",
            "desc": "以格鬥值差距影響命中率. 沒有melee就代表以射擊值影響. ",
            "values": []
        },
        "beam": {
            "id": "beam",
            "title": "光束",
            "desc": "裝甲的防禦效果減半",
            "values": []
        },
        "physic": {
            "id": "physic",
            "title": "實彈",
            "desc": "",
            "values": []
        },
        "fire": {
            "id": "fire",
            "title": "火焰",
            "desc": "對象不受樹林地型補正.",
            "values": []
        },
        "lighting": {
            "id": "lighting",
            "title": "電擊",
            "desc": "對象不受水域地型補正.",
            "values": []
        },
        "spray": {
            "id": "spray",
            "title": "擴散",
            "desc": "命中x{0}, 傷害x{1}",
            "values": [
                "1.3",
                "0.8"
            ]
        },
        "multi": {
            "id": "multi",
            "title": "連射",
            "desc": "命中x{0}, 傷害x{1}~{2}",
            "values": [
                "1.1",
                "0.7",
                "1.3"
            ]
        },
        "missile": {
            "id": "missile",
            "title": "飛彈",
            "desc": "命中率不受對象移動率影響, 會被防禦兵器擊落",
            "values": []
        }
    },
    "weaponEnergyType": {
        "energy": {
            "id": "energy",
            "title": "energy"
        },
        "bullet": {
            "id": "bullet",
            "title": "bullet"
        }
    },
    "weaponType": {
        "single": {
            "id": "single",
            "title": "single"
        },
        "line": {
            "id": "line",
            "title": "line"
        }
    }
}`
)
