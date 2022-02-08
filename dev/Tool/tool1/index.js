const { parse } = require("csv");
const fs = require('fs')

const table1 = `1	大手裡劍	2	刺擊-劍	4	3	遠招	2	火投擲	火-燒傷5	外功3
1	大手裡劍	2	刺擊-劍	4	3	遠招	2	水投擲	水-冰凍5	外功3
1	忍具	1	防具-飾	2	2	遠招	1	吹箭	雷-麻痺2	外功1.
1	忍具	1	防具-飾	2	2	反應	3	替身術	無	對方外功攻擊時可以使用, 廢棄1個防具. 對方的攻擊失效.
1	忍具	1	防具-飾	2	2	氣場	2	投擲大師	無	使用名稱中有投擲的遠招時, 那個遠招的外功+1.
1	神羅裝束	1	防具-衣	2	2	氣場	2	架勢	無	敵軍配置時可以支付這張卡上的1氣，重置自己重量3以上的武器。
1	神羅裝束	1	防具-衣	2	2	氣場	4	元士兵	無	自己回合開始時氣+3.連技時不需要橫置武器。
1	鬼劍	3	斬擊-刀	5	5	近招	斬0/1/2	鬼斬	暗-暗闇6	內攻+6/8/10.
1	鬼劍	3	斬擊-刀	5	5	遠招	斬0/1/2	三日月斬	暗-暗闇6	內攻+6/8/10.
1	鬼劍	3	斬擊-刀	5	5	氣場	斬1	血之宿命	暗-暗闇6	移除這張卡。回復X血。X為這回合造成的傷害。X最多為10.
1	鬼劍	3	斬擊-刀	5	5	氣場	斬1	闇擊氣場	暗-暗闇6	敵軍反應步時可以宣告。支付2血。機率4: 造成的傷害+X。X為本來造成的傷害。X為多為6.
1	鬼劍	3	斬擊-刀	5	5	氣功	2	覇體	無	下次的攻擊在對抗外攻時一定生效。對方的對抗值改為對對抗對象的傷害。
1	鬼劍	3	斬擊-刀	5	5	防招	斬0/1/2	擋劈	無	外功+4/6/8. 宣告時氣+1.
1	鬼劍	3	斬擊-刀	5	5	近招	斬2	靈魂鬼斬	暗-暗闇6	內攻10. 宣告對象有暗闇時, 這招的氣費用變成0. 對象因為這招的效果產生暗闇狀態的話, 使用這招的人回2氣.
1	魔術帽	1	防具-頭	1	3	氣場	2	魔消	無	對方內功攻擊的反應宣告時可以當成反應使用. 進攻方內功傷害變成0. 這張卡廢棄. 
1	魔術帽	1	防具-頭	1	3	氣場	4	魔反	無	對方內功攻擊的反應宣告時可以當成反應使用. 進攻方內功傷害變成0. 這張卡廢棄. 進攻方-x血, x為進攻方的內攻值. x最多不超過6.`;

const table2 = `1	練甲	1	防具-衣	3	1	防招	全0/1/2	侵略如火	火-燒傷5	外功+4/6/8。下一次自己的變招少2氣支付。
1	練甲	1	防具-衣	3	1	氣功	2	徐如風	風-撕裂5	自配置步使用。回復1行動力。3血。
1	練甲	1	防具-衣	3	1	氣場	2	迅如雷	雷-麻痺2	使用回避時可以1氣。回避機率+1。動作消耗-1。
1	練甲	1	防具-衣	3	1	反應	3	不動如山	地-昏眩2	本次傷害-6。免疫本次的狀態攻擊。
1	練甲	1	防具-衣	3	1	氣場	3	俠客行	無	出擊時1氣，指定一把自己重量2的武器，他可以跟任意一重量爲1的武器聯合。這個效果一次出擊可以最多用到2氣。
1	鉄劍	2	刺擊-劍	5	2	近招	刺0/1/2	刺劍	無	外功+2/4/6
1	鉄劍	2	刺擊-劍	5	2	防招	刺0/1/2	挑劍	無	外功+6/8/10.
1	黑風拳套	1	格鬥-拳	2	2	近招	格0/1/2	闇擊掌	暗-暗闇6	外功+2/4/6.
1	黑風拳套	1	格鬥-拳	2	2	遠招	格格0/1/2	炎魔天爆地熱	火-燒傷5	外功+2/4/6 對方行動力-1. 氣-2.
1	黑風拳套	1	格鬥-拳	2	2	近招	格0/1/2	九宮連環手	無	內功+6/8/10.
1	黑風拳套	1	格鬥-拳	2	2	氣場	格格0	紫霞諸滅	無	自己回合的第一擊外功+2.
1	黑風拳套	1	格鬥-拳	2	2	防招	格格0/1/2	防禦氣功	光-封印3	外功+6/8/10.
1	黑風拳套	1	格鬥-拳	2	2	反應	格格0	閃避	無	閃躲7.
1	大手裡劍	2	刺擊-劍	4	3	遠招	2	風投擲	風-撕裂5	外功3
1	大手裡劍	2	刺擊-劍	4	3	遠招	2	火投擲	火-燒傷5	外功3
1	大手裡劍	2	刺擊-劍	4	3	遠招	2	水投擲	水-冰凍5	外功3`


genJson(table1, "table1.json", (err) => {
    if (err) {
        throw err
    }
    console.log("table1 ok")
})
genJson(table2, "table2.json", (err) => {
    if (err) {
        throw err
    }
    console.log("table2 ok")
})

function genJson(table, output, cb) {
    parse(table, { delimiter: "\t" }, (err, data) => {
        if (err) {
            throw err;
        }
        const cards = data.map(
            ([
                id,
                title,
                weight,
                attackType,
                outsidePower,
                insidePower,
                skillType,
                skillCost,
                skillName,
                skillMana,
                skillText,
            ]) => {
                const colorMapping = {
                    "近招": "red",
                    "遠招": "FloralWhite",
                    "氣功": "gainsboro",
                    "氣場": "grey",
                    "防招": "green",
                    "反應": "yellow"
                }
                return getCardJson({
                    id,
                    title,
                    weight,
                    attackType,
                    outsidePower,
                    insidePower,
                    skillType,
                    skillCost,
                    skillName,
                    skillText,
                    skillMana,
                    color: colorMapping[skillType],
                });
            }
        );
        fs.writeFile(output, JSON.stringify(cards, null, 2), err => {
            cb(err)
        })
    });
}



function getCardJson(info) {
    return {
        type: "data",
        width: 50,
        height: 75,
        pos: [100, 100],
        back: true,
        lock: false,
        count: 3,
        extra: [
            `<div style='overflow:hidden;background-color:${info.color}; width:100%; height:100%; left:0; top:0; text-align:right'>${info.title}<br>重${info.weight}<br>${info.attackType} ${info.outsidePower} ${info.insidePower}<br>${info.skillName}<br>${info.skillMana} ${info.skillType} ${info.skillCost}</div>`,
            info.skillText,
        ],
    };
}
