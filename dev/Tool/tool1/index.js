const { parse } = require("csv");
const fs = require("fs");

const table1 = `1	巨鎚	4	打擊-鎚	9	4	近招	打0/1/2	大地擊	打-昏眩5	有2個以上的直立行動力時才能使用. 外功+2/4/6
1	巨鎚	4	打擊-鎚	9	4	防招	打0/1/2	回轉攻擊	無	有2個以上的直立行動力時才能使用. 外功+8/10/12
1	巨鎚	4	打擊-鎚	9	4	近招	打2	踏步大地擊	打-昏眩5	有2個以上的直立行動力時才能使用. 外功+6. 打人判定成功時, 對方所有重量2以下武器脫手.
1	巨鎚	4	打擊-鎚	9	4	氣功	1	天地大衝撞	無	這回合在使用招式時當成有2個直立行動力.
1	巨鎚	4	打擊-鎚	9	4	氣功	3	蓄力滑行	無	有合計重量4的直立武器在場時可以使用, 回復到4個直立行動力.
1	道具	1	防具-飾	0	3	氣場	1	以太	無	廢棄這張卡，那個時候回2氣。剛出場回合不能使用。這個氣場可以重復。這張卡可以從手牌廢棄並抽1張.
1	道具	1	防具-飾	0	3	氣場	2	速度瓶	無	廢棄這張卡, 回復2行動力。剛出場回合不能使用。這個氣場可以重復。這張卡可以從手牌廢棄並抽1張.
1	忍刀	2	斬擊-單	5	2	氣場	斬斬0	二刀流	無	在交戰判定時，2條攻擊路線都只有1個自己武器的時候，那2條線的所有自己武器外功+2. 出擊時若達成2路線各1個武器的情況下，氣+1.
1	忍刀	2	斬擊-單	5	2	氣場	1	水上移動	無	抽牌時, 如果是氣場時, 展示它, 這回合你使用了衝刺.
1	忍刀	2	斬擊-單	5	2	反應	3	濳伏	無	這回合剩下的所有敵人的打人判定都失效. 自己得到[潛伏][2回合結束時移除. 自己不能成為出擊的對象. 出擊時移除]狀態指示物.
1	忍刀	2	斬擊-單	5	2	遠招	人0	投擲	斬-出血7	外功+0
1	大手裡劍	2	斬擊-單	5	2	遠招	人0	風投擲	風-撕裂7	外功+0.
1	大手裡劍	2	斬擊-單	5	2	遠招	人0	水投擲	水-冰凍5	外功+0.
1	背包	2	打擊-包	4	3	氣功	2	裝備變更	無	無條件將自己手上合計重量為x的武器直立放到配置區，那個時候, 收回自己場上所有武器。x為自己場上所有武器的重量合計加1或減1.
1	羽毛帽	1	防具-頭	1	2	氣場	4	精神統一	無	對方無法使用閃避.
1	羽毛帽	1	防具-頭	1	2	反應	2	速度儲蓄	無	對方為外功時可以使用. 回復最多3行動力.`;

const table2 = `1	練甲	1	防具-衣	2	0	反應	3	不動如山	打-昏眩5	本次傷害-6。免疫本次的狀態攻擊。如果傷害減少至0，攻擊方不能繼續連招。
1	鉄劍	2	刺擊-劍	5	2	近招	格刺0/1/2	聚力刺劍	刺-點打3	外功+0/2/4
1	鉄劍	2	刺擊-劍	5	2	近招	格格刺2	湛沪劍法	刺-點打3	外功+4。交戰勝利時。指定一個玩家機率5丟棄一張手牌。這個效果執行兩次。
1	鉄劍	2	刺擊-劍	5	2	防招	刺0/1/2	挑劍	無	外功+6/8/10.
1	鉄劍	2	刺擊-劍	5	2	防招	格刺0/1/2	圈劍	無	外功+6/8/10.
1	鉄劍	2	刺擊-劍	5	2	近招	格刺0/1/2	劈劍	無	外功+0/1/3。宣告時機率5外功+2. 
1	鉄劍	2	刺擊-劍	5	2	近招	格格刺0/1/2	工布獨一劍	刺-點打3	外功+0/2/4。打人生效時，如果對方沒有防具，狀態機率+1.
1	鉄劍	2	刺擊-劍	5	2	近招	格刺0/1/2	來去劍法	刺-點打3	外功+0/2/4。宣告時機率5規則内自己行動+1.否則-1.
1	功夫鞋	1	格鬥-腿	3	1	氣場	3	步法	無	自己配置步時可以支付1氣, 這回合出擊的武器總重量-2, 抽1張. 這個能一回合只能用1次.
1	功夫鞋	1	格鬥-腿	3	1	近招	腿腿0/1/2	二起腳	無	外功+0/2/4
1	功夫鞋	1	格鬥-腿	3	1	近招	腿0/1/2	斧刃腳	無	外功+0/2/4
1	功夫鞋	1	格鬥-腿	3	1	防招	腿0/1/2	前掃腿	無	外功+6/8/10
1	功夫鞋	1	格鬥-腿	3	1	防招	腿腿0/1/2	後掃腿	無	外功+6/8/10
1	飛沙走石	1	防具-飾	0	3	遠招	人1	飛沙走石	打-昏眩5	外功4。
1	木針匣	1	防具-飾	0	3	遠招	人1	木針	刺-點打3	外功4。
1	練甲	1	防具-衣	2	0	防招	全0/1/2	侵略如火	火-燒傷7	外功+4/6/8。這個交戰下一次自己的非防守招式少2氣支付。`;

genJson(table1, "table1.json", (err) => {
  if (err) {
    throw err;
  }
  console.log("table1 ok");
});
genJson(table2, "table2.json", (err) => {
  if (err) {
    throw err;
  }
  console.log("table2 ok");
});

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
          近招: "red",
          遠招: "yellow",
          氣功: "white",
          氣場: "LightGray",
          防招: "green",
          反應: "Fuchsia",
        };
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
    fs.writeFile(output, JSON.stringify(cards, null, 2), (err) => {
      cb(err);
    });
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
