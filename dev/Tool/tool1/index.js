const { parse } = require("csv");
const fs = require("fs");

const table1 = `1	雙頭鋼棍	3	打擊-棍	7	3	近招	打0/1/2	重力棍擊	打-昏眩2	外功+2/4/6
1	雙頭鋼棍	3	打擊-棍	7	3	近招	打腿0/1/2	猛力揮擊	打-昏眩2	外功+2/4/6
1	雙頭鋼棍	3	打擊-棍	7	3	氣場	2	雙頭連擊	無	接招步可以1氣。使出外功4的招式。
1	雙頭鋼棍	3	打擊-棍	7	3	氣場	2	爆裂棍擊	打-昏眩2	對方受傷時可以1氣。對方-3血。
1	雙頭鋼棍	3	打擊-棍	7	3	防招	打腿0/1/2	震地擊	打-昏眩2	外功+4/6/8。這張卡成功打贏交戰時，對方行動力-1.
1	猛士披挂	1	防具-衣	2	2	氣功	2	猛烈撞擊	無	敵人抽牌階段可以使用。敵人-2體力。
1	猛士披挂	1	防具-衣	2	2	氣場	1	蓄力	無	這張卡在招式宣告步可以當成【腿 2 2】來支付招式。
1	練甲	1	防具-衣	3	1	氣場	3	迅如雷	雷-麻痺2	使用回避時可以1氣。動作消耗-1。
1	練甲	1	防具-衣	3	1	氣功	2	徐如風	風-撕裂7	自配置步使用。回復1行動力。3血。
1	法杖	2	打擊-棍	2	5	氣功	打	治療術	光-封印3	指定玩家回復憑依武器内功+2的血量
1	法杖	2	打擊-棍	2	5	遠招	打0/1/2	火球術	火-燒傷7	内功+6/8/10
1	法杖	2	打擊-棍	2	5	遠招	打0/1/2	冰凍術	水-冰凍7	内功+6/8/10
1	法杖	2	打擊-棍	2	5	氣功	4	活化術	無	重置1個武器. 回復x氣. x為武器重量. 但那個武器這回合不能出擊. 
1	柔術道服	1	防具-衣	2	2	氣功	1	進攻心法	無	本國看4張, 抽出1張近招或遠招展示後回手. 其餘回本國洗牌.
1	柔術道服	1	防具-衣	2	2	氣功	1	回避心法	無	本國看4張, 抽出1張防招或反應展示後回手. 其餘回本國洗牌.
1	武器大師裝束	1	防具-衣	3	1	防招	全0/1/2	武器格擋	無	外功+6/8/10`;

const table2 = `1	法杖	2	打擊-短	2	5	遠招	打0/1/2	火球術	火-燒傷7	内功+6/8/10
1	法杖	2	打擊-短	2	5	遠招	打0/1/2	雷電術	雷-麻痺3	内功+6/8/10
1	法杖	2	打擊-短	2	5	遠招	打0/1/2	颶風術	風-撕裂7	内功+6/8/10
1	法杖	2	打擊-短	2	5	遠招	打0/1/2	地震術	地-石化2	内功+6/8/10
1	法杖	2	打擊-短	2	5	遠招	打0/1/2	猛毒術	毒-中毒8	内功+6/8/10
1	法杖	2	打擊-短	2	5	遠招	打0/1/2	聖光束	光-封印3	内功+6/8/10
1	法杖	2	打擊-短	2	5	遠招	打0/1/2	冰凍術	水-冰凍5	内功+6/8/10
1	道具	1	防具-飾	2	2	氣場	3	超級回復藥	無	廢棄這張卡，那個時候回9血。剛出場回合的配置步不能使用, 出場時抽1張。這個氣場可以重復。
1	道具	1	防具-飾	2	2	氣場	2	高級以太	無	廢棄這張卡，那個時候回4氣。剛出場回合的配置步不能使用, 出場時抽1張。這個氣場可以重復。
1	道具	1	防具-飾	2	2	氣場	4	聖靈藥	無	廢棄這張卡，那個時候回9血, 回2氣。剛出場回合的配置步不能使用, 出場時抽1張。這個氣場可以重復。
1	道具	1	防具-飾	2	2	氣場	1	不死鳥之尾	無	頻死時才能使用。回復9血。剛出場回合的配置步不能使用, 出場時抽1張。這個氣場可以重復。
1	背包	2	打擊-包	4	3	反應	1	自動回復藥	無	展示一張手牌中名稱為道具的卡，那張卡回到本國洗牌, 並直接解決那張卡的內文。解決完後抽1張.
1	背包	2	打擊-包	4	3	氣功	3	道具投擲	無	展示一張手牌中名稱為道具的卡，那張卡回到本國洗牌, 並直接解決那張卡的內文。解決完後抽1張.
1	道具	1	防具-飾	2	2	氣場	3	萬能藥	無	自己有狀態時才能使用。廢棄這張卡，移除一個狀態並抽1張。剛出場的回合不能使用, 出場時抽1張。這個氣場可以重復。
1	白帶	1	防具-飾	2	2	反應	2	衝擊反擊	無	自己有穿防具時可以使用。機率x對方一個武器脫手。x為自己防具外功值的總合的2倍。
1	背包	2	打擊-包	4	3	氣場	3	發現道具移動	無	抽牌階段時可以支付1氣. 抽1張. 如果那個是道具時, 可以再抽1張.`;

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
