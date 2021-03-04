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
            "powerCost": 10,
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
            "powerCost": 12,
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
            "powerCost": 14,
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
            "powerCost": 16,
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
            "powerCost": 18,
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
            "powerCost": 10,
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
            "powerCost": 12,
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
            "powerCost": 14,
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
            "powerCost": 16,
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
            "powerCost": 18,
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
            "powerCost": 10,
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
            "powerCost": 12,
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
            "powerCost": 14,
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
            "powerCost": 16,
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
            "powerCost": 18,
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
            "powerCost": 10,
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
            "powerCost": 10,
            "action": "equipment"
        },
        "engine1": {
            "id": "engine1",
            "title": "引擎L1",
            "cost": 1000,
            "desc": "增加{0}power",
            "value": [
                "20"
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
                "40"
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
                "60"
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
                "80"
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
                "100"
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
            "powerCost": 10,
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
            "powerCost": 10,
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
            "powerCost": 10,
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
            "powerCost": 10,
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
            "powerCost": 10,
            "action": "equipment"
        },
        "psArmor": {
            "id": "psArmor",
            "title": "ps裝甲",
            "cost": 3000,
            "desc": "被實彈傷害-{1}",
            "value": [
                "2000"
            ],
            "powerCost": 10,
            "action": "equipment"
        },
        "afterimage": {
            "id": "afterimage",
            "title": "殘像",
            "cost": 10000,
            "desc": "氣力{0}以上時, 機率{1}閃避攻擊",
            "value": [
                "130",
                "0.7"
            ],
            "powerCost": 30,
            "action": "equipment"
        },
        "defensiveWeapon": {
            "id": "defensiveWeapon",
            "title": "防禦兵器",
            "cost": 1000,
            "desc": "依技量有機率防禦[飛行兵器]",
            "value": [],
            "powerCost": 10,
            "action": "equipment"
        },
        "zeroSystem": {
            "id": "zeroSystem",
            "title": "零式系統",
            "cost": 1000,
            "desc": "武器的最終命中增加{0}%，自身的最終被命中率減少{1}%",
            "value": [
                "10",
                "15"
            ],
            "powerCost": 10,
            "action": "equipment"
        },
        "shejililiang": {
            "id": "shejililiang",
            "title": "射擊力量",
            "cost": 1000,
            "desc": "射擊系武器射程增加{0}",
            "value": [
                "1"
            ],
            "powerCost": 10,
            "action": "equipment"
        },
        "gedouliliang": {
            "id": "gedouliliang",
            "title": "格鬥力量",
            "cost": 1000,
            "desc": "格鬥系武器射程增加{0}",
            "value": [
                "1"
            ],
            "powerCost": 10,
            "action": "equipment"
        },
        "gushou": {
            "id": "gushou",
            "title": "固守",
            "cost": 1000,
            "desc": "這個回合沒有攻擊的話，下個合回開始前受傷害減少{0}",
            "value": [
                "1000"
            ],
            "powerCost": 10,
            "action": "equipment"
        },
        "gedouwang": {
            "id": "gedouwang",
            "title": "格鬥王",
            "cost": 1000,
            "desc": "若所有武器都是格鬥系，武器傷害*{0}%, 回避*{1}%",
            "value": [
                "1.2",
                "1.2"
            ],
            "powerCost": 10,
            "action": "equipment"
        },
        "shejiwang": {
            "id": "shejiwang",
            "title": "射擊王",
            "cost": 1000,
            "desc": "若所有武器都是射擊系，射擊傷害*{0}%, 受傷害減少{0}",
            "value": [
                "1.2",
                "500"
            ],
            "powerCost": 10,
            "action": "equipment"
        },
        "feixingwang": {
            "id": "feixingwang",
            "title": "飛行王",
            "cost": 1000,
            "desc": "飛行狀態時，移動力+{0}，回避+{1}%",
            "value": [
                "2",
                "1.2"
            ],
            "powerCost": 10,
            "action": "equipment"
        },
        "shengwuzhuangjia": {
            "id": "shengwuzhuangjia",
            "title": "生物裝甲",
            "cost": 1000,
            "desc": "增加{0}裝中. 每回合開始回復{1}%最大hp.",
            "value": [
                "300",
                "0.1"
            ],
            "powerCost": 10,
            "action": "equipment"
        },
        "feixingqi": {
            "id": "feixingqi",
            "title": "飛行器",
            "cost": 1000,
            "desc": "空中適性變成{0}",
            "value": [
                "0.8"
            ],
            "powerCost": 10,
            "action": "equipment"
        },
        "pensheqidian": {
            "id": "pensheqidian",
            "title": "噴射氣墊",
            "cost": 1000,
            "desc": "地面移動時出力*{0}",
            "value": [
                "1.5"
            ],
            "powerCost": 10,
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
            ],
            "robots": [
                "medium",
                "medium",
                "heavy"
            ],
            "weapons": [
                "beam_gun1",
                "beam_gun2",
                "beam_gun3",
                "beam_gatling1",
                "beam_gatling2",
                "beam_gatling3",
                "beam_sword1",
                "beam_sword2",
                "beam_sword3",
                "machinegun1",
                "machinegun2",
                "shotgun3"
            ],
            "components": [
                "energy1",
                "energy2",
                "energy3",
                "armor1",
                "armor2",
                "armor3",
                "beam_armor1",
                "beam_armor2",
                "beam_armor3"
            ],
            "pilots": [
                "engineer",
                "engineer",
                "engineer"
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
        "engineer": {
            "id": "engineer",
            "title": "工程師",
            "cost": 4400,
            "melee": 65,
            "range": 65,
            "atk": 70,
            "evade": 80,
            "guard": 70,
            "tech": 90,
            "ability": [],
            "total": 440
        },
        "boxer": {
            "id": "boxer",
            "title": "拳擊手",
            "cost": 4650,
            "melee": 90,
            "range": 65,
            "atk": 90,
            "evade": 50,
            "guard": 90,
            "tech": 80,
            "ability": [],
            "total": 465
        },
        "teacher": {
            "id": "teacher",
            "title": "教師",
            "cost": 4400,
            "melee": 50,
            "range": 80,
            "atk": 70,
            "evade": 80,
            "guard": 60,
            "tech": 100,
            "ability": [],
            "total": 440
        },
        "baseballPitcher": {
            "id": "baseballPitcher",
            "title": "棒球投手",
            "cost": 5150,
            "melee": 80,
            "range": 90,
            "atk": 90,
            "evade": 75,
            "guard": 90,
            "tech": 90,
            "ability": [],
            "total": 515
        },
        "amuro": {
            "id": "amuro",
            "title": "阿姆羅",
            "cost": 6050,
            "melee": 70,
            "range": 130,
            "atk": 100,
            "evade": 130,
            "guard": 70,
            "tech": 105,
            "ability": [],
            "total": 605
        },
        "liulongma": {
            "id": "liulongma",
            "title": "流龍馬",
            "cost": 6100,
            "melee": 130,
            "range": 70,
            "atk": 110,
            "evade": 65,
            "guard": 135,
            "tech": 100,
            "ability": [],
            "total": 610
        },
        "doujiaer": {
            "id": "doujiaer",
            "title": "兜甲兒",
            "cost": 6000,
            "melee": 125,
            "range": 70,
            "atk": 105,
            "evade": 60,
            "guard": 140,
            "tech": 100,
            "ability": [],
            "total": 600
        },
        "xibuke": {
            "id": "xibuke",
            "title": "西布克",
            "cost": 6050,
            "melee": 80,
            "range": 120,
            "atk": 100,
            "evade": 125,
            "guard": 75,
            "tech": 105,
            "ability": [],
            "total": 605
        }
    },
    "pilotAbility": {},
    "robot": {
        "gaite_sky": {
            "id": "gaite_sky",
            "title": "空蓋特",
            "cost": 83500,
            "power": 125,
            "hp": 10000,
            "en": 200,
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
            "cost": 83500,
            "power": 125,
            "hp": 10000,
            "en": 200,
            "weapons": [
                "gaite_missle",
                "gaite_drill",
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
            "cost": 83500,
            "power": 125,
            "hp": 10000,
            "en": 200,
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
            "cost": 69600,
            "power": 110,
            "hp": 12000,
            "en": 200,
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
            "cost": 53000,
            "power": 90,
            "hp": 6000,
            "en": 200,
            "weapons": [
                "machinegun1",
                "beam_sword1",
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
            "cost": 53000,
            "power": 90,
            "hp": 6000,
            "en": 200,
            "weapons": [
                "machinegun1",
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
            "cost": 37400,
            "power": 65,
            "hp": 5000,
            "en": 200,
            "weapons": [
                "machinegun1",
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
            "cost": 29616,
            "power": 48,
            "hp": 4000,
            "en": 200,
            "weapons": [
                "machinegun1",
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
            "cost": 34900,
            "power": 60,
            "hp": 5000,
            "en": 200,
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
            "cost": 34900,
            "power": 60,
            "hp": 5000,
            "en": 200,
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
            "cost": 34900,
            "power": 60,
            "hp": 5000,
            "en": 200,
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
            "cost": 34900,
            "power": 60,
            "hp": 5000,
            "en": 200,
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
            "cost": 34900,
            "power": 60,
            "hp": 5000,
            "en": 200,
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
            "cost": 99200,
            "power": 140,
            "hp": 8000,
            "en": 200,
            "weapons": [
                "machinegun2",
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
            "cost": 99200,
            "power": 140,
            "hp": 8000,
            "en": 200,
            "weapons": [
                "machinegun2",
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
            "cost": 56900,
            "power": 95,
            "hp": 8000,
            "en": 200,
            "weapons": [
                "machinegun1",
                "beam_sword3",
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
            "cost": 24100,
            "power": 30,
            "hp": 5000,
            "en": 200,
            "weapons": [],
            "components": [],
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
            "cost": 28600,
            "power": 45,
            "hp": 5000,
            "en": 200,
            "weapons": [],
            "components": [],
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
            "cost": 37400,
            "power": 65,
            "hp": 5000,
            "en": 200,
            "weapons": [],
            "components": [],
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
            "cost": 52900,
            "power": 90,
            "hp": 5000,
            "en": 200,
            "weapons": [],
            "components": [],
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
            "cost": 78100,
            "power": 120,
            "hp": 5000,
            "en": 200,
            "weapons": [],
            "components": [],
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
            "cost": 116600,
            "power": 155,
            "hp": 5000,
            "en": 200,
            "weapons": [],
            "components": [],
            "suitability": [
                1,
                0.5,
                0,
                1
            ],
            "transform": [],
            "unlockExp": 4
        },
        "f91": {
            "id": "f91",
            "title": "F91",
            "cost": 53000,
            "power": 90,
            "hp": 6000,
            "en": 200,
            "weapons": [
                "machinegun1",
                "beam_sword1",
                "beam_gun1",
                "beam_mega2"
            ],
            "components": [
                "beam_armor1",
                "beam_shield",
                "afterimage"
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
        "duankongka": {
            "id": "duankongka",
            "title": "斷空我",
            "cost": 48400,
            "power": 110,
            "hp": 12000,
            "en": 200,
            "weapons": [
                "duankong_fight",
                "duankong_laser",
                "duankong_sword",
                "duankong_shot"
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
        }
    },
    "terrain": {
        "mountain": {
            "id": "mountain",
            "title": "山脈",
            "cost": [
                0.5,
                0,
                0,
                0
            ],
            "hitRate": 0.75,
            "damage": 0.5
        },
        "plain": {
            "id": "plain",
            "title": "平原",
            "cost": [
                1,
                0,
                0,
                0
            ],
            "hitRate": 1,
            "damage": 1
        },
        "forest": {
            "id": "forest",
            "title": "森林",
            "cost": [
                0.75,
                0,
                0,
                0
            ],
            "hitRate": 0.5,
            "damage": 0.75
        },
        "road": {
            "id": "road",
            "title": "道路",
            "cost": [
                1.25,
                0,
                0,
                0
            ],
            "hitRate": 1,
            "damage": 1
        },
        "city": {
            "id": "city",
            "title": "城市",
            "cost": [
                1,
                0,
                0,
                0
            ],
            "hitRate": 0.9,
            "damage": 0.75
        },
        "beach": {
            "id": "beach",
            "title": "沿海",
            "cost": [
                0.5,
                0.5,
                0,
                0
            ],
            "hitRate": 1,
            "damage": 1
        },
        "shallowSea": {
            "id": "shallowSea",
            "title": "淺海",
            "cost": [
                0,
                1,
                0,
                0
            ],
            "hitRate": 0.75,
            "damage": 0.75
        },
        "deepSea": {
            "id": "deepSea",
            "title": "深海",
            "cost": [
                0,
                0.5,
                0,
                0
            ],
            "hitRate": 0.5,
            "damage": 0.5
        },
        "award": {
            "id": "award",
            "title": "能量點",
            "cost": [
                1,
                1,
                0,
                0
            ],
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
            "cost": 400,
            "range": [
                5,
                2
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
                "range",
                "beam",
                "standAttack"
            ],
            "energyType": "energy",
            "type": "line",
            "accuracy": 0.63,
            "damage": 3241,
            "curage": 110,
            "powerCost": 10,
            "unlockExp": 0
        },
        "beam_mega2": {
            "id": "beam_mega2",
            "title": "粒子炮L2",
            "cost": 676,
            "range": [
                5,
                2
            ],
            "energyCost": 16,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "range",
                "beam",
                "standAttack"
            ],
            "energyType": "energy",
            "type": "line",
            "accuracy": 0.621,
            "damage": 3484,
            "curage": 110,
            "powerCost": 13,
            "unlockExp": 0
        },
        "beam_mega3": {
            "id": "beam_mega3",
            "title": "粒子炮L3",
            "cost": 1024,
            "range": [
                6,
                3
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
                "range",
                "beam",
                "standAttack"
            ],
            "energyType": "energy",
            "type": "line",
            "accuracy": 0.612,
            "damage": 3738,
            "curage": 120,
            "powerCost": 16,
            "unlockExp": 0
        },
        "beam_mega4": {
            "id": "beam_mega4",
            "title": "粒子炮L4",
            "cost": 1444,
            "range": [
                6,
                3
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
                "range",
                "beam",
                "standAttack"
            ],
            "energyType": "energy",
            "type": "line",
            "accuracy": 0.603,
            "damage": 4004,
            "curage": 120,
            "powerCost": 19,
            "unlockExp": 0
        },
        "beam_mega5": {
            "id": "beam_mega5",
            "title": "粒子炮L5",
            "cost": 1936,
            "range": [
                7,
                4
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
                "range",
                "beam",
                "standAttack"
            ],
            "energyType": "energy",
            "type": "line",
            "accuracy": 0.594,
            "damage": 4283,
            "curage": 130,
            "powerCost": 22,
            "unlockExp": 0
        },
        "beam_mega6": {
            "id": "beam_mega6",
            "title": "粒子炮L6",
            "cost": 2500,
            "range": [
                7,
                4
            ],
            "energyCost": 43,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "range",
                "beam",
                "standAttack"
            ],
            "energyType": "energy",
            "type": "line",
            "accuracy": 0.585,
            "damage": 4574,
            "curage": 130,
            "powerCost": 25,
            "unlockExp": 0
        },
        "beam_mega7": {
            "id": "beam_mega7",
            "title": "粒子炮L7",
            "cost": 3136,
            "range": [
                7,
                4
            ],
            "energyCost": 49,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "range",
                "beam",
                "standAttack"
            ],
            "energyType": "energy",
            "type": "line",
            "accuracy": 0.576,
            "damage": 4878,
            "curage": 130,
            "powerCost": 28,
            "unlockExp": 0
        },
        "beam_sniper1": {
            "id": "beam_sniper1",
            "title": "光束狙擊鎗L1",
            "cost": 400,
            "range": [
                3,
                9
            ],
            "energyCost": 17,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "range",
                "beam",
                "standAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 0.7,
            "damage": 2924,
            "curage": 0,
            "powerCost": 10,
            "unlockExp": 0
        },
        "beam_sniper2": {
            "id": "beam_sniper2",
            "title": "光束狙擊鎗L2",
            "cost": 676,
            "range": [
                3,
                9
            ],
            "energyCost": 21,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "range",
                "beam",
                "standAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 0.7,
            "damage": 3248,
            "curage": 0,
            "powerCost": 13,
            "unlockExp": 0
        },
        "beam_sniper3": {
            "id": "beam_sniper3",
            "title": "光束狙擊鎗L3",
            "cost": 1024,
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
                "range",
                "beam",
                "standAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 0.7,
            "damage": 3595,
            "curage": 105,
            "powerCost": 16,
            "unlockExp": 0
        },
        "beam_sniper4": {
            "id": "beam_sniper4",
            "title": "光束狙擊鎗L4",
            "cost": 1444,
            "range": [
                4,
                12
            ],
            "energyCost": 31,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "range",
                "beam",
                "standAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 0.7,
            "damage": 3966,
            "curage": 105,
            "powerCost": 19,
            "unlockExp": 0
        },
        "beam_sniper5": {
            "id": "beam_sniper5",
            "title": "光束狙擊鎗L5",
            "cost": 1936,
            "range": [
                5,
                15
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
                "range",
                "beam",
                "standAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 0.7,
            "damage": 4362,
            "curage": 110,
            "powerCost": 22,
            "unlockExp": 0
        },
        "beam_sniper6": {
            "id": "beam_sniper6",
            "title": "光束狙擊鎗L6",
            "cost": 2500,
            "range": [
                5,
                15
            ],
            "energyCost": 41,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "range",
                "beam",
                "standAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 0.7,
            "damage": 4784,
            "curage": 120,
            "powerCost": 25,
            "unlockExp": 0
        },
        "beam_sniper7": {
            "id": "beam_sniper7",
            "title": "光束狙擊鎗L7",
            "cost": 3136,
            "range": [
                5,
                15
            ],
            "energyCost": 45,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "range",
                "beam",
                "standAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 0.7,
            "damage": 5231,
            "curage": 130,
            "powerCost": 28,
            "unlockExp": 0
        },
        "sniper1": {
            "id": "sniper1",
            "title": "狙擊炮L1",
            "cost": 400,
            "range": [
                3,
                9
            ],
            "energyCost": 0,
            "maxBulletCount": 6,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "range",
                "physic",
                "standAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 0.7,
            "damage": 2924,
            "curage": 0,
            "powerCost": 10,
            "unlockExp": 0
        },
        "sniper2": {
            "id": "sniper2",
            "title": "狙擊炮L2",
            "cost": 676,
            "range": [
                3,
                9
            ],
            "energyCost": 0,
            "maxBulletCount": 6,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "range",
                "physic",
                "standAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 0.7,
            "damage": 3248,
            "curage": 0,
            "powerCost": 13,
            "unlockExp": 0
        },
        "sniper3": {
            "id": "sniper3",
            "title": "狙擊炮L3",
            "cost": 1024,
            "range": [
                4,
                12
            ],
            "energyCost": 0,
            "maxBulletCount": 5,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "range",
                "physic",
                "standAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 0.7,
            "damage": 3595,
            "curage": 0,
            "powerCost": 16,
            "unlockExp": 0
        },
        "sniper4": {
            "id": "sniper4",
            "title": "狙擊炮L4",
            "cost": 1444,
            "range": [
                4,
                12
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
                "range",
                "physic",
                "standAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 0.7,
            "damage": 3966,
            "curage": 0,
            "powerCost": 19,
            "unlockExp": 0
        },
        "sniper5": {
            "id": "sniper5",
            "title": "狙擊炮L5",
            "cost": 1936,
            "range": [
                5,
                15
            ],
            "energyCost": 0,
            "maxBulletCount": 3,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "range",
                "physic",
                "standAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 0.7,
            "damage": 4362,
            "curage": 0,
            "powerCost": 22,
            "unlockExp": 0
        },
        "sniper6": {
            "id": "sniper6",
            "title": "狙擊炮L6",
            "cost": 2500,
            "range": [
                5,
                15
            ],
            "energyCost": 0,
            "maxBulletCount": 2,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "range",
                "physic",
                "standAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 0.7,
            "damage": 4784,
            "curage": 0,
            "powerCost": 25,
            "unlockExp": 0
        },
        "sniper7": {
            "id": "sniper7",
            "title": "狙擊炮L7",
            "cost": 3136,
            "range": [
                5,
                15
            ],
            "energyCost": 0,
            "maxBulletCount": 2,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "range",
                "physic",
                "standAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 0.7,
            "damage": 5231,
            "curage": 0,
            "powerCost": 28,
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
                "range",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 0.85,
            "damage": 2744,
            "curage": 0,
            "powerCost": 10,
            "unlockExp": 0
        },
        "beam_gun2": {
            "id": "beam_gun2",
            "title": "光束鎗L2",
            "cost": 676,
            "range": [
                2,
                4
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
                "range",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 0.85,
            "damage": 3209,
            "curage": 0,
            "powerCost": 13,
            "unlockExp": 0
        },
        "beam_gun3": {
            "id": "beam_gun3",
            "title": "光束鎗L3",
            "cost": 1024,
            "range": [
                2,
                5
            ],
            "energyCost": 18,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "range",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 0.85,
            "damage": 3723,
            "curage": 0,
            "powerCost": 16,
            "unlockExp": 0
        },
        "beam_gun4": {
            "id": "beam_gun4",
            "title": "光束鎗L4",
            "cost": 1444,
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
                "range",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 0.85,
            "damage": 4291,
            "curage": 0,
            "powerCost": 19,
            "unlockExp": 0
        },
        "beam_gun5": {
            "id": "beam_gun5",
            "title": "光束鎗L5",
            "cost": 1936,
            "range": [
                2,
                6
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
                "range",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 0.85,
            "damage": 4913,
            "curage": 0,
            "powerCost": 22,
            "unlockExp": 0
        },
        "beam_gun6": {
            "id": "beam_gun6",
            "title": "光束鎗L6",
            "cost": 2500,
            "range": [
                2,
                6
            ],
            "energyCost": 31,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "range",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 0.85,
            "damage": 5592,
            "curage": 0,
            "powerCost": 25,
            "unlockExp": 0
        },
        "beam_gun7": {
            "id": "beam_gun7",
            "title": "光束鎗L7",
            "cost": 3136,
            "range": [
                2,
                6
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
                "range",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 0.85,
            "damage": 6331,
            "curage": 0,
            "powerCost": 28,
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
                "range",
                "beam",
                "multi",
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.3,
            "damage": 2197,
            "curage": 0,
            "powerCost": 10,
            "unlockExp": 0
        },
        "beam_gatling2": {
            "id": "beam_gatling2",
            "title": "光束衝鋒鎗L2",
            "cost": 676,
            "range": [
                2,
                4
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
                "range",
                "beam",
                "multi",
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.3,
            "damage": 2515,
            "curage": 0,
            "powerCost": 13,
            "unlockExp": 0
        },
        "beam_gatling3": {
            "id": "beam_gatling3",
            "title": "光束衝鋒鎗L3",
            "cost": 1024,
            "range": [
                2,
                5
            ],
            "energyCost": 18,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "range",
                "beam",
                "multi",
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.3,
            "damage": 2863,
            "curage": 0,
            "powerCost": 16,
            "unlockExp": 0
        },
        "beam_gatling4": {
            "id": "beam_gatling4",
            "title": "光束衝鋒鎗L4",
            "cost": 1444,
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
                "range",
                "beam",
                "multi",
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.3,
            "damage": 3241,
            "curage": 0,
            "powerCost": 19,
            "unlockExp": 0
        },
        "beam_gatling5": {
            "id": "beam_gatling5",
            "title": "光束衝鋒鎗L5",
            "cost": 1936,
            "range": [
                2,
                6
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
                "range",
                "beam",
                "multi",
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.3,
            "damage": 3652,
            "curage": 0,
            "powerCost": 22,
            "unlockExp": 0
        },
        "beam_gatling6": {
            "id": "beam_gatling6",
            "title": "光束衝鋒鎗L6",
            "cost": 2500,
            "range": [
                2,
                6
            ],
            "energyCost": 31,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "range",
                "beam",
                "multi",
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.3,
            "damage": 4096,
            "curage": 0,
            "powerCost": 25,
            "unlockExp": 0
        },
        "beam_gatling7": {
            "id": "beam_gatling7",
            "title": "光束衝鋒鎗L7",
            "cost": 3136,
            "range": [
                2,
                6
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
                "range",
                "beam",
                "multi",
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1.3,
            "damage": 4574,
            "curage": 0,
            "powerCost": 28,
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
                0.75,
                1,
                1
            ],
            "ability": [
                "range",
                "physic",
                "multi",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1.3,
            "damage": 2197,
            "curage": 0,
            "powerCost": 10,
            "unlockExp": 0
        },
        "gatling2": {
            "id": "gatling2",
            "title": "衝鋒鎗L2",
            "cost": 676,
            "range": [
                2,
                4
            ],
            "energyCost": 0,
            "maxBulletCount": 8,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "range",
                "physic",
                "multi",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1.3,
            "damage": 2515,
            "curage": 0,
            "powerCost": 13,
            "unlockExp": 0
        },
        "gatling3": {
            "id": "gatling3",
            "title": "衝鋒鎗L3",
            "cost": 1024,
            "range": [
                2,
                5
            ],
            "energyCost": 0,
            "maxBulletCount": 7,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "range",
                "physic",
                "multi",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1.3,
            "damage": 2863,
            "curage": 0,
            "powerCost": 16,
            "unlockExp": 0
        },
        "gatling4": {
            "id": "gatling4",
            "title": "衝鋒鎗L4",
            "cost": 1444,
            "range": [
                2,
                5
            ],
            "energyCost": 0,
            "maxBulletCount": 7,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "range",
                "physic",
                "multi",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1.3,
            "damage": 3241,
            "curage": 0,
            "powerCost": 19,
            "unlockExp": 0
        },
        "gatling5": {
            "id": "gatling5",
            "title": "衝鋒鎗L5",
            "cost": 1936,
            "range": [
                2,
                6
            ],
            "energyCost": 0,
            "maxBulletCount": 6,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "range",
                "physic",
                "multi",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1.3,
            "damage": 3652,
            "curage": 0,
            "powerCost": 22,
            "unlockExp": 0
        },
        "gatling6": {
            "id": "gatling6",
            "title": "衝鋒鎗L6",
            "cost": 2500,
            "range": [
                2,
                6
            ],
            "energyCost": 0,
            "maxBulletCount": 6,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "range",
                "physic",
                "multi",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1.3,
            "damage": 4096,
            "curage": 0,
            "powerCost": 25,
            "unlockExp": 0
        },
        "gatling7": {
            "id": "gatling7",
            "title": "衝鋒鎗L7",
            "cost": 3136,
            "range": [
                2,
                6
            ],
            "energyCost": 0,
            "maxBulletCount": 6,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "range",
                "physic",
                "multi",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1.3,
            "damage": 4574,
            "curage": 0,
            "powerCost": 28,
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
                "melee",
                "beam",
                "moveAttack"
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
            "cost": 676,
            "range": [
                1,
                1
            ],
            "energyCost": 11,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "melee",
                "beam",
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 3796,
            "curage": 0,
            "powerCost": 13,
            "unlockExp": 0
        },
        "beam_sword3": {
            "id": "beam_sword3",
            "title": "光束劍L3",
            "cost": 1024,
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
                "melee",
                "beam",
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 4492,
            "curage": 105,
            "powerCost": 16,
            "unlockExp": 0
        },
        "beam_sword4": {
            "id": "beam_sword4",
            "title": "光束劍L4",
            "cost": 1444,
            "range": [
                1,
                2
            ],
            "energyCost": 18,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "melee",
                "beam",
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 5268,
            "curage": 110,
            "powerCost": 19,
            "unlockExp": 0
        },
        "beam_sword5": {
            "id": "beam_sword5",
            "title": "光束劍L5",
            "cost": 1936,
            "range": [
                2,
                3
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
                "melee",
                "beam",
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 6128,
            "curage": 120,
            "powerCost": 22,
            "unlockExp": 0
        },
        "beam_sword6": {
            "id": "beam_sword6",
            "title": "光束劍L6",
            "cost": 2500,
            "range": [
                2,
                3
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
                "melee",
                "beam",
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 7077,
            "curage": 125,
            "powerCost": 25,
            "unlockExp": 0
        },
        "beam_sword7": {
            "id": "beam_sword7",
            "title": "光束劍L7",
            "cost": 3136,
            "range": [
                2,
                3
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
                "melee",
                "beam",
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 8120,
            "curage": 130,
            "powerCost": 28,
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
                0.75,
                1,
                1
            ],
            "ability": [
                "melee",
                "physic",
                "moveAttack"
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
            "cost": 676,
            "range": [
                1,
                1
            ],
            "energyCost": 0,
            "maxBulletCount": 6,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "melee",
                "physic",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1,
            "damage": 3796,
            "curage": 0,
            "powerCost": 13,
            "unlockExp": 0
        },
        "sword3": {
            "id": "sword3",
            "title": "實體劍L3",
            "cost": 1024,
            "range": [
                1,
                2
            ],
            "energyCost": 0,
            "maxBulletCount": 5,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "melee",
                "physic",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1,
            "damage": 4492,
            "curage": 0,
            "powerCost": 16,
            "unlockExp": 0
        },
        "sword4": {
            "id": "sword4",
            "title": "實體劍L4",
            "cost": 1444,
            "range": [
                1,
                2
            ],
            "energyCost": 0,
            "maxBulletCount": 5,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "melee",
                "physic",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1,
            "damage": 5268,
            "curage": 0,
            "powerCost": 19,
            "unlockExp": 0
        },
        "sword5": {
            "id": "sword5",
            "title": "實體劍L5",
            "cost": 1936,
            "range": [
                2,
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
                "melee",
                "physic",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1,
            "damage": 6128,
            "curage": 0,
            "powerCost": 22,
            "unlockExp": 0
        },
        "sword6": {
            "id": "sword6",
            "title": "實體劍L6",
            "cost": 2500,
            "range": [
                2,
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
                "melee",
                "physic",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1,
            "damage": 7077,
            "curage": 0,
            "powerCost": 25,
            "unlockExp": 0
        },
        "sword7": {
            "id": "sword7",
            "title": "實體劍L7",
            "cost": 3136,
            "range": [
                2,
                3
            ],
            "energyCost": 0,
            "maxBulletCount": 3,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "melee",
                "physic",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1,
            "damage": 8120,
            "curage": 0,
            "powerCost": 28,
            "unlockExp": 0
        },
        "shotgun1": {
            "id": "shotgun1",
            "title": "霰彈槍L1",
            "cost": 400,
            "range": [
                2,
                4
            ],
            "energyCost": 0,
            "maxBulletCount": 8,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "range",
                "physic",
                "spray",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1.25,
            "damage": 2197,
            "curage": 0,
            "powerCost": 10,
            "unlockExp": 0
        },
        "shotgun2": {
            "id": "shotgun2",
            "title": "霰彈槍L2",
            "cost": 676,
            "range": [
                2,
                4
            ],
            "energyCost": 0,
            "maxBulletCount": 8,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "range",
                "physic",
                "spray",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1.25,
            "damage": 2515,
            "curage": 0,
            "powerCost": 13,
            "unlockExp": 0
        },
        "shotgun3": {
            "id": "shotgun3",
            "title": "霰彈槍L3",
            "cost": 1024,
            "range": [
                2,
                4
            ],
            "energyCost": 0,
            "maxBulletCount": 7,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "range",
                "physic",
                "spray",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1.25,
            "damage": 2863,
            "curage": 0,
            "powerCost": 16,
            "unlockExp": 0
        },
        "shotgun4": {
            "id": "shotgun4",
            "title": "霰彈槍L4",
            "cost": 1444,
            "range": [
                2,
                4
            ],
            "energyCost": 0,
            "maxBulletCount": 7,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "range",
                "physic",
                "spray",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1.25,
            "damage": 3241,
            "curage": 0,
            "powerCost": 19,
            "unlockExp": 0
        },
        "shotgun5": {
            "id": "shotgun5",
            "title": "霰彈槍L5",
            "cost": 1936,
            "range": [
                2,
                4
            ],
            "energyCost": 0,
            "maxBulletCount": 6,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "range",
                "physic",
                "spray",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1.25,
            "damage": 3652,
            "curage": 0,
            "powerCost": 22,
            "unlockExp": 0
        },
        "shotgun6": {
            "id": "shotgun6",
            "title": "霰彈槍L6",
            "cost": 2500,
            "range": [
                2,
                4
            ],
            "energyCost": 0,
            "maxBulletCount": 6,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "range",
                "physic",
                "spray",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1.25,
            "damage": 4096,
            "curage": 0,
            "powerCost": 25,
            "unlockExp": 0
        },
        "shotgun7": {
            "id": "shotgun7",
            "title": "霰彈槍L7",
            "cost": 3136,
            "range": [
                2,
                4
            ],
            "energyCost": 0,
            "maxBulletCount": 6,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "range",
                "physic",
                "spray",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1.25,
            "damage": 4574,
            "curage": 0,
            "powerCost": 28,
            "unlockExp": 0
        },
        "machinegun1": {
            "id": "machinegun1",
            "title": "機關砲L1",
            "cost": 400,
            "range": [
                1,
                2
            ],
            "energyCost": 0,
            "maxBulletCount": 8,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "range",
                "physic",
                "multi",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1.5,
            "damage": 2197,
            "curage": 0,
            "powerCost": 10,
            "unlockExp": 0
        },
        "machinegun2": {
            "id": "machinegun2",
            "title": "機關砲L2",
            "cost": 676,
            "range": [
                1,
                2
            ],
            "energyCost": 0,
            "maxBulletCount": 8,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "range",
                "physic",
                "multi",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1.5,
            "damage": 2515,
            "curage": 0,
            "powerCost": 13,
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
                0.75,
                1,
                1
            ],
            "ability": [
                "melee",
                "physic",
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 3800,
            "curage": 0,
            "powerCost": 10,
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
                0.75,
                1,
                1
            ],
            "ability": [
                "melee",
                "physic",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 0.7,
            "damage": 10000,
            "curage": 120,
            "powerCost": 10,
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
                1.1,
                1
            ],
            "ability": [
                "range",
                "beam",
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 0.95,
            "damage": 9000,
            "curage": 130,
            "powerCost": 10,
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
                0.5,
                1,
                1
            ],
            "ability": [
                "range",
                "physic",
                "multi"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 0.85,
            "damage": 3000,
            "curage": 0,
            "powerCost": 10,
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
                0.75,
                1,
                1
            ],
            "ability": [
                "melee",
                "physic",
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 3500,
            "curage": 0,
            "powerCost": 10,
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
                0.75,
                1,
                1
            ],
            "ability": [
                "melee",
                "physic",
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 0.95,
            "damage": 7000,
            "curage": 120,
            "powerCost": 10,
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
                "melee",
                "physic",
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
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
                "range",
                "missile"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 0.85,
            "damage": 3000,
            "curage": 0,
            "powerCost": 10,
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
                "melee",
                "physic",
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 0.9,
            "damage": 9500,
            "curage": 130,
            "powerCost": 10,
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
            "ability": [
                "range",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 0.85,
            "damage": 2500,
            "curage": 0,
            "powerCost": 10,
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
            "energyCost": 0,
            "maxBulletCount": 6,
            "suitability": [
                1,
                1,
                1,
                1
            ],
            "ability": [
                "melee",
                "physic",
                "moveAttack"
            ],
            "energyType": "bullet",
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
                "range",
                "physic",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 0.85,
            "damage": 4000,
            "curage": 0,
            "powerCost": 10,
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
            "energyCost": 22,
            "maxBulletCount": 0,
            "suitability": [
                1,
                1,
                1,
                1
            ],
            "ability": [
                "melee",
                "physic",
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 1,
            "damage": 6000,
            "curage": 120,
            "powerCost": 10,
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
            "energyCost": 45,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.75,
                1,
                1
            ],
            "ability": [
                "range",
                "fire",
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 0.9,
            "damage": 8500,
            "curage": 130,
            "powerCost": 10,
            "unlockExp": 0
        },
        "duankong_fight": {
            "id": "duankong_fight",
            "title": "格鬥",
            "cost": 0,
            "range": [
                1,
                1
            ],
            "energyCost": 0,
            "maxBulletCount": 6,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "melee",
                "physic",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1,
            "damage": 3000,
            "curage": 0,
            "powerCost": 9,
            "unlockExp": 0
        },
        "duankong_laser": {
            "id": "duankong_laser",
            "title": "四連炮",
            "cost": 0,
            "range": [
                2,
                3
            ],
            "energyCost": 0,
            "maxBulletCount": 6,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "melee",
                "beam",
                "multi",
                "moveAttack"
            ],
            "energyType": "bullet",
            "type": "single",
            "accuracy": 1.1,
            "damage": 2600,
            "curage": 0,
            "powerCost": 8,
            "unlockExp": 0
        },
        "duankong_sword": {
            "id": "duankong_sword",
            "title": "斷空劍",
            "cost": 0,
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
                "melee",
                "physic",
                "moveAttack"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 0.95,
            "damage": 6300,
            "curage": 115,
            "powerCost": 21,
            "unlockExp": 0
        },
        "duankong_shot": {
            "id": "duankong_shot",
            "title": "斷空炮",
            "cost": 0,
            "range": [
                2,
                5
            ],
            "energyCost": 43,
            "maxBulletCount": 0,
            "suitability": [
                1,
                0.5,
                1,
                1
            ],
            "ability": [
                "melee",
                "beam"
            ],
            "energyType": "energy",
            "type": "single",
            "accuracy": 0.8,
            "damage": 8000,
            "curage": 130,
            "powerCost": 28,
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
            "desc": "以格鬥值差距影響命中率與傷害",
            "values": []
        },
        "range": {
            "id": "range",
            "title": "射擊",
            "desc": "以射擊值差距影響命中率與傷害",
            "values": []
        },
        "beam": {
            "id": "beam",
            "title": "光束",
            "desc": "光束裝甲可以減輕傷害",
            "values": []
        },
        "physic": {
            "id": "physic",
            "title": "實彈",
            "desc": "裝甲可以減輕傷害",
            "values": []
        },
        "missile": {
            "id": "missile",
            "title": "飛行兵器",
            "desc": "命中率不受對象剩餘出力影響, 會被[防禦兵器]擊落",
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
            "desc": "一定命中, 傷害力另外*命中率",
            "values": []
        },
        "multi": {
            "id": "multi",
            "title": "連射",
            "desc": "命中*{0}, 傷害*{1}~{2}",
            "values": [
                "1.1",
                "0.7",
                "1.3"
            ]
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
