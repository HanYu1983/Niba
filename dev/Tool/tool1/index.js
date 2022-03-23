const { parse } = require("csv");
const fs = require("fs");

const table1 = `323	龍槍	3	刺擊-槍	7	3	近招	刺0	精準刺	刺-點打3	外功+0. 狀態機率+1.
324	龍槍	3	刺擊-槍	7	3	近招	刺0/1/2	貫通刺	刺-點打3	外功+0/2/4
325	龍槍	3	刺擊-槍	7	3	遠招	刺0/1/2	貫穿尖	刺-點打3	外功+0/2/4
326	龍槍	3	刺擊-槍	7	3	氣場	2	開膛槍	無	使用刺擊招式時, 外功+2.
333	龍槍	3	刺擊-槍	7	3	氣場	2	戰鬥連禱	無	非元素狀態的招式在機率判定時機率+1.
343	拳刃	1	刺擊-匕	3	1	近招	刺刺2	音速投擲	刺-點打3	外功+4. 額外1次狀態判定.
344	雜學書	1	防具-飾	0	4	氣場	1	爾雅	無	這張卡在場時，對方所有的防招氣+1支付。這個效果可以重複。
345	雜學書	1	防具-飾	0	4	氣場	2	鬼谷子	無	配置時可以1氣。這個回合的所有自己的交戰判定對抗值+2.
359	匣裏滅晨	3	刺擊-槍	6	4	近招	刺1	踏火止水	刺-點打3	外功+2.如果對方有火或水的狀態指示物在場時。外功額外+2.
334	龍槍	3	刺擊-槍	7	3	近招	刺0	龍牙龍爪	斬-出血7	外功+0. 打人判定成功時, 可以從本國抽出支付為2以下的氣場並且爆氣裝上.
208	武器大師裝束	1	防具-衣	2	0	防招	全全0/1/2	雙手格擋	無	外功+4/6/8
209	武器大師裝束	1	防具-衣	2	0	防招	全0/1/2	武器格擋	無	外功+4/6/8
353	喜多院十文字	3	刺擊-槍	7	3	近招	刺1	名士振舞	刺-點打3	外功+0.交戰或者打人成功時，自己氣+3。
145	原住民頭巾	1	防具-頭	1	2	氣功	1	水塊	水-冰凍5	宣告時指定1個招式類型. 那個時間點結束時若對方沒有從手牌展示指定類型的卡則解決下述效果. 執行這張卡的狀態判定, 機率+1. 這個能力1回合只能用1次.
150	原住民頭巾	1	防具-頭	1	2	氣功	1	鬼火	火-燒傷7	宣告時指定1個招式類型. 那個時間點結束時若對方沒有從手牌展示指定類型的卡則解決下述效果. 執行這張卡的狀態判定, 機率+1. 這個能力1回合只能用1次.
3	魔術帽	1	防具-頭	1	2	反應	2	魔力反彈	無	被內功傷害時宣告. 內功傷害-5. 對方-2血.`;

const table2 = `125	破壞大劍	4	斬擊-大	9	4	遠招	斬2	畫龍點睛	風-撕裂7	內功+6。造成傷害時，對象所有裝備幾率5脫手。所有防具機率5破壞
126	破壞大劍	4	斬擊-大	9	4	遠招	斬1	流星雨	火-燒傷7	內功+4.這個招式不能被回避之類的效果指定。
259	大劍	4	斬擊-大	8	5	反應	3	巨劍格擋	無	只有被近招外功傷害時宣告. 外功傷害減8. 選擇對方一個機率5武器脫手. 若選到的武器重量2以下時, 機率變成10. 
128	破壞大劍	4	斬擊-大	9	4	近招	斬0/1/2	兇斬	雷-麻痺5	外功+0/2/4
129	破壞大劍	4	斬擊-大	9	4	近招	斬0/1/2	狂斬	斬-出血7	外功+0/2/4。
130	破壞大劍	4	斬擊-大	9	4	近招	斬0/1/2	刀斬	刺-點打3	外功+0/2/4。對象沒有防具的時候，造成的傷害值+2.
131	破壞大劍	4	斬擊-大	9	4	防招	大0/1/2	巨劍防禦	無	外功+4/6/8.這次交戰回合結束前，自己相當於多裝備了一個2/2的防具。 
23	戰士靴	1	格鬥-腿	3	1	氣場	2	戰士架勢	無	自己回合可以有1點免費體力用來重置武器。
24	戰士靴	1	格鬥-腿	3	1	近招	腿0	膝破壞	無	外功+0.打人生效時，破壞指定腿或者褲裝備。
25	戰士靴	1	格鬥-腿	3	1	反應	2	提膝防禦	無	這次的外功傷害-4.回復1行動力。
35	腿甲	1	防具-褲	1	2	反應	2	受身	無	這次的外功傷害-4.幾率5回復2行動力。沒有行動力可以回復時則回血。
37	腿甲	1	防具-褲	1	2	反應	2	側步	無	傷害-3.幾率5回復2行動力。
38	腿甲	1	防具-褲	1	2	反應	2	側進步	無	傷害-3.幾率3回復3行動力。
237	功夫褲	1	防具-褲	1	2	氣功	2	聚力衝刺	無	自己配置步使用。得到衝刺+聚力效果。
207	武器大師裝束	1	防具-衣	2	0	氣功	2	武器活用	無	重置1個武器. 回復x氣. x為武器重量. 但那個武器這回合不能普攻出擊. 
255	工具箱	1	防具-飾	0	4	氣功	2	專注訓練	無	重置1個武器.`;

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
