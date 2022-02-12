const { parse } = require("csv");
const fs = require("fs");

const table1 = `1	法杖	2	打擊-短	2	5	遠招	打0/1/2	火球術	火-燒傷7	内功*1/2/3
1	法杖	2	打擊-短	2	5	遠招	打0/1/2	雷電術	雷-麻痺5	内功*1/2/3
1	法杖	2	打擊-短	2	5	遠招	打0/1/2	颶風術	風-撕裂7	内功*1/2/3
1	法杖	2	打擊-短	2	5	遠招	打0/1/2	地震術	地-石化5	内功*1/2/3
1	法杖	2	打擊-短	2	5	遠招	打0/1/2	猛毒術	毒-中毒8	内功*1/2/3
1	法杖	2	打擊-短	2	5	遠招	打0/1/2	聖光束	光-封印5	内功*1/2/3
1	法杖	2	打擊-短	2	5	遠招	打0/1/2	冰凍術	水-冰凍5	内功*1/2/3
1	道具	1	防具-飾	2	2	氣場	3	超級回復藥	無	廢棄這張卡，那個時候回9血。剛出場回合的配置步不能使用。這個氣場可以重復。這張卡可以從手牌廢棄並抽1張.
1	道具	1	防具-飾	2	2	氣場	2	高級以太	無	廢棄這張卡，那個時候回4氣。剛出場回合的配置步不能使用。這個氣場可以重復。這張卡可以從手牌廢棄並抽1張.
1	道具	1	防具-飾	2	2	氣場	4	聖靈藥	無	廢棄這張卡，那個時候回9血, 回2氣。剛出場回合的配置步不能使用。這個氣場可以重復。這張卡可以從手牌廢棄並抽1張.
1	道具	1	防具-飾	2	2	氣場	1	不死鳥之尾	無	頻死時才能使用。回復3血。剛出場回合的配置步不能使用。這個氣場可以重復。這張卡可以從手牌廢棄並抽1張.
1	背包	2	打擊-包	4	3	反應	1	自動回復藥	無	展示一張手牌中名稱為道具的卡，那張卡回到本國洗牌, 並直接解決那張卡的內文。解決完後抽1張.
1	背包	2	打擊-包	4	3	氣功	3	道具投擲	無	展示一張手牌中名稱為道具的卡，那張卡回到本國洗牌, 並直接解決那張卡的內文。解決完後抽1張.
1	道具	1	防具-飾	2	2	氣場	3	萬能藥	無	自己有狀態時才能使用。廢棄這張卡，移除一個狀態並抽1張。剛出場的回合不能使用, 出場時抽1張。這個氣場可以重復。
1	白帶	1	防具-飾	2	2	反應	2	衝擊反擊	無	自己有穿防具時可以使用。機率x對方一個武器脫手。x為自己防具外功值的總合的2倍。
1	背包	2	打擊-包	4	3	氣場	1	發現道具移動	無	抽牌時, 如果是防具卡, 展示它並抽1張. `;

const table2 = `1	寒月	2	刺擊-劍	4	3	遠招	刺0/1/2	劍氣	無	內功*1/2/3。
1	寒月	2	刺擊-劍	4	3	遠招	格刺0/1/2	重劍氣	無	內功*1/2/3。
1	寒月	2	刺擊-劍	4	3	防招	刺0/1/2	鬼婆婆劍	無	外功+6/8/10。這個招式交戰勝利時。對方-1氣。否則自己扣1氣。
1	寒月	2	刺擊-劍	4	3	氣場	3	亂情瘴	無	配置步開始時。1氣。指定敵方一個交戰武器內功-3。
1	寒月	2	刺擊-劍	4	3	近招	刺0/1/2	前刺	刺-點打3	外功+0/2/4。
1	寒月	2	刺擊-劍	4	3	近招	格刺0/1/2	勾鎌劍法	刺-點打3	外功+0/2/4。自己每有一個氣場在場時。外功+2。這個效果最多+4。
1	寒月	2	刺擊-劍	4	3	近招	格刺0/1/2	兩段刺	刺-點打3	外功+0/2/4。
1	麻腦串	1	防具-飾	1	3	氣場	1	醒神	無	自軍回合開始時，氣+1。這個效果不能重復。
1	麻腦串	1	防具-飾	1	3	氣場	2	聞香	無	自配置步可以1氣。機率6回復3。這個效果一回合一次。
1	練甲	1	防具-衣	3	1	反應	3	不動如山	打-昏眩5	本次傷害-6。免疫本次的狀態攻擊。如果傷害減少至0，攻擊方不能繼續連招。
1	練甲	1	防具-衣	3	1	氣功	2	徐如風	風-撕裂7	自配置步使用。回復1行動力。3血。
1	練甲	1	防具-衣	3	1	氣場	2	迅如雷	雷-麻痺5	使用回避時可以1氣。動作消耗-1。
1	拳套	1	格鬥-拳	2	2	反應	1	頻死HP回復	無	頻死時才能使用. 機率x回10血. x為現在的自己直立氣量. 
1	練甲	1	防具-衣	3	1	氣場	3	俠客行	無	出擊時1氣，指定一把自己包含重量3以下的武器，他可以跟任意一重量爲1的武器聯合。這個效果一次出擊可以最多用到2氣。
1	拳套	1	格鬥-拳	2	2	氣功	2	氣愈	無	回2血, 回4氣。
1	拳套	1	格鬥-拳	2	2	氣場	1	HP回復移動	無	抽牌時, 如果是氣場時, 展示它並回復3血. `;

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
