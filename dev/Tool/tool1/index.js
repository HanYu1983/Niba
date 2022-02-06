const { parse } = require("csv");
const fs = require('fs')

const table1 = `30	鬼劍	2	斬擊-刀	4	3	近招	斬x	鬼斬	暗-暗闇6	內攻+6/8/10.
31	鬼劍	2	斬擊-刀	4	3	近招	斬斬x	三日月斬	暗-暗闇6	內攻+6/8/10.
33	鬼劍	2	斬擊-刀	4	3	氣場	斬1	血之宿命	暗-暗闇6	移除這張卡。回復X血。X為這回合造成的傷害。X最多為10.
35	鬼劍	2	斬擊-刀	4	3	氣場	斬1	闇擊氣場	暗-暗闇6	敵軍反應步時可以宣告。支付2血。機率4: 造成的傷害+X。X為本來造成的傷害。X為多為6.
37	鬼劍	2	斬擊-刀	4	3	氣功	2	覇體	無	下次的攻擊在對抗外攻時一定生效。對方的對抗值改為對對抗對象的傷害。
47	鬼劍	2	斬擊-刀	4	3	近招	斬斬x	十字鬼斬	暗-暗闇6	內攻+6/8/10
49	大手裡劍	2	斬擊-刀	5	2	遠招	2	風投擲	風-撕裂5	外功4
51	大手裡劍	2	斬擊-刀	5	2	遠招	2	火投擲	火-燒傷5	外功4
52	大手裡劍	2	斬擊-刀	5	2	遠招	2	水投擲	水-冰凍5	外功4
53	忍刀	2	斬擊-刀	5	2	氣場	斬斬0	二刀流	無	在交戰判定時，2條攻擊路線都只有1個自己非招式武器的時候，那2條線的所有自己武器外功+2. 出擊時若達成2路線各1個武器的情況下，氣+1.
54	忍刀	2	斬擊-刀	5	2	近招	斬2	鬼魅術	無	可以將憑依武器移到另一個路線。若原路線上不存在自己武器時，那條路線的敵方武器在交戰判定時失效。
55	忍刀	2	斬擊-刀	5	2	近招	斬0	背刺	無	外功+0. 回1氣。造成傷害時，機率5那個傷害+4.
56	忍刀	2	斬擊-刀	5	2	近招	斬0	偷襲	無	外功+0. 回1氣。造成傷害時，那個傷害+2.`;

const table2 = `9	破壞大劍	4	斬擊-大	9	4	近招	斬x	狂斬	無	外功+3/5/7
10	破壞大劍	4	斬擊-大	9	4	近招	斬x	刀斬	無	外功+2/4/6。對象沒有防具的時候，造成的傷害值+2.
11	破壞大劍	4	斬擊-大	9	4	遠招	斬x	流星雨	地-昏眩2	内功+6/8/10.這個招式不能被回避之類的效果指定。
12	破壞大劍	4	斬擊-大	9	4	遠招	斬x	畫龍點睛	風-撕裂5	内功+6/8/10。造成傷害時，對象所有裝備幾率5脫手。
13	破壞大劍	4	斬擊-大	9	4	近招	斬x	超究武神霸斬	無	外功+5/7/9.
14	神羅裝束	1	防具-衣	2	2	氣場	2	架勢	無	敵軍配置時可以支付這張卡上的1氣，重置自己重量3以上的武器。
15	火魔石	1	防具-飾	1	3	氣場	2	火球術	火-燒傷5	自己招式階段可以支付這張卡上的1氣，造成内力2的遠招。
16	治療魔石	1	防具-飾	1	3	氣場	2	治療術	光-封印3	自己配置階段可以支付這張卡上的1氣，回復3點血量。
17	神羅裝束	1	防具-衣	2	2	氣場	4	元士兵	無	自己回合開始時氣+3.連技時不需要橫置武器。
18	粗布麻褲	1	防具-褲	2	2	氣場	1	還神	光-封印3	這張卡廢棄時，回復2
19	粗布麻衣	1	防具-衣	2	2	氣功	1	調息	光-封印3	配置步使用，回復5。
20	破壞大劍	4	斬擊-大	9	4	防招	斬x	巨劍防禦	無	外功+6/8/10.
36	毒魔石	1	防具-飾	1	3	氣場	2	中毒術	毒-中毒7	自己招式階段可以支付這張卡上的1氣，造成内力2的遠招。`


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
