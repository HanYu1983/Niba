const { parse } = require("csv");
const fs = require("fs");

const table1 = `389	引出刀	3	斬擊-刀	6	4	近招	斬0	村正	打-昏眩5	內功+2. 只能在打人時使用. 機率5這張卡回手.
390	引出刀	3	斬擊-刀	6	4	遠招	斬0	菊一文字		內功+2. 只能在打人時使用. 機率5這張卡回手.
392	引出刀	3	斬擊-刀	6	4	近招	斬2	塵地螺細飾劍		內功+6. 只能在打人時使用. 機率5這張卡回手.
393	引出刀	3	斬擊-刀	6	4	反應	全0	肉斬骨斷		頻死時使用. 對方扣x血. x為暫存區的傷害數量. x最高為憑依武器重量*3.
394	引出刀	3	斬擊-刀	6	4	氣場	3	空手入白刃		對方偷防具或破壞方具成功時, 這張卡移除並那個效果失效. 對方普攻或變招外功或遠招外功時, 針對那個武器使用機率10的閃避, 這張卡移除.
108	鬼劍	3	斬擊-刀	6	4	近招	斬0/1/2	鬼斬	暗-暗闇6	內攻+2/4/6.
382	引出刀	3	斬擊-刀	6	4	氣場	3	雙手持		自己回合時重量3以上的武器外功+2.
17	騎士胸甲	1	防具-衣	2	0	氣場	2	強防禦	無	自己武器在判定時對抗值+4，直到變招為止。自回合結束時1氣。
13	鐮刀	3	斬擊-刀	7	3	氣功	1	消音	無	這個回合的下一次交戰判定時對抗值+4.
14	鐮刀	3	斬擊-刀	7	3	近招	斬0/1/2	死神索命斬	斬-出血7	外功+0/2/4. 這回合中憑依武器的對抗值有加減的情況下，不能對這招宣告反應。
27	練甲	1	防具-衣	2	0	氣場	3	迅如雷	雷-麻痺5	使用回避動作消耗-1。
31	練甲	1	防具-衣	2	0	防招	全0	侵略如火	無	外功+4。這個交戰下一次自己的非防守招式少2氣支付。
87	無限刃	3	斬擊-刀	7	3	氣場	1	炎靈	無	自軍打人判定時, 當成有火-燒傷7的攻擊, 若判定後造成狀態時. 這張卡移除. 這個氣場可以多張在場. 但每回合只能解決1次.
89	無限刃	3	斬擊-刀	7	3	近招	斬0/1/2	火產靈神	火-燒傷7	外功+0/2/4. 宣告時, 若對方有燒傷狀態時, 外功+2. 
66	道具	1	防具-飾	0	4	氣場	2	速度瓶	無	廢棄這張卡, 回復2行動力。剛出場回合不能使用。這個氣場可以重復。這張卡可以從手牌廢棄並抽1張.
68	道具	1	防具-飾	0	4	氣場	1	以太	無	廢棄這張卡，那個時候回2氣。剛出場回合不能使用。這個氣場可以重復。這張卡可以從手牌廢棄並抽1張.`;

const table2 = `293	鉄刀	2	斬擊-單	5	2	近招	斬0/1/2	劈砍	斬-出血7	外功+0/2/4。
294	鉄刀	2	斬擊-單	5	2	防招	斬0/1/2	架刀		外功+4/6/8。
225	忍刀	2	斬擊-單	5	2	近招	斬0	偷襲	斬-出血7	外功+0. 打人判定成功時，那個傷害+2.
296	鉄刀	2	斬擊-單	5	2	近招	斬格0/1/2	强力劈砍	斬-出血7	外功+0/2/4。
224	忍刀	2	斬擊-單	5	2	近招	斬0	背刺	刺-點打3	外功+0. 打人判定成功時，機率5那個傷害+4.
281	青龍刀	2	斬擊-單	5	2	近招	單格0/1/2	龍牙四斬	斬-出血7	外功+0/2/4.新增一個【斬：這場游戲中，自己宣告單或斬的近招時，可以廢棄。那個時候。那個招式外功+1】的指示物。
241	功夫鞋	1	格鬥-腿	3	1	近招	腿腿0/1/2	二起腳	打-昏眩5	外功+0/2/4.交戰成功時，對手-1氣。
242	功夫鞋	1	格鬥-腿	3	1	近招	腿0/1/2	斧刃腳	斬-出血7	外功+0/2/4
247	功夫鞋	1	格鬥-腿	3	1	防招	腿0/1/2	前掃腿	無	外功+4/6/8
300	鍛造書	1	防具-飾	0	4	氣功	1	鼎書	無	移除自己一個武器上的指示物。效果生效時，+2氣。這張卡可以從手裏廢棄。抽一張卡。
298	品鑒書	1	防具-飾	0	4	氣功	2	煮泉小品	無	指定一個自己重量二以下武器。機率7放一個良品指示物。否則放一個劣品指示物。【良品：外功+1】【劣品：外功-1】.這系列指示物只能存在一個在一個武器上。可以覆蓋。
288	佛學書	1	防具-飾	0	4	氣功	_1/2	心經	無	回復1/2體力.
17	騎士胸甲	1	防具-衣	2	0	氣場	2	強防禦	無	自己武器在判定時對抗值+4，直到變招為止。自回合結束時1氣。
54	道服	1	防具-衣	2	0	氣功	3	運氣	無	回復6氣.
237	功夫褲	1	防具-褲	1	2	氣功	2	聚力衝刺	無	自己配置步使用。得到衝刺+聚力效果。
85	黑風衣	1	防具-衣	2	0	反應	2	快速反應	無	這次的傷害-3。使自己重置重量為對方出擊武器以下的武器`;

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
