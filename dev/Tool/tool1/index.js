const { parse } = require("csv");
const fs = require("fs");

const table1 = `1	道具	1	防具-飾	2	2	氣場	1	以太	無	廢棄這張卡，那個時候回2氣。剛出場回合不能使用。這個氣場可以重復。這張卡可以從手牌廢棄並抽1張.
1	道服	1	防具-衣	2	2	反應	2	衝擊反擊	無	自己有穿防具時可以使用。機率x對方一個武器脫手。x為自己防具外功值的總合的2倍。
1	羽毛帽	1	防具-頭	2	2	反應	2	速度儲蓄	無	回復最多3行動力.
1	羽毛帽	1	防具-頭	2	2	反應	2	警戒	無	只能在敵軍回合用. 這回合剩下的所有敵人的打人判定都機率6失效.
1	道服	1	防具-衣	2	2	近招	1	衝擊	打-昏眩5	打人判定時並自己有穿防具時可以使用。判定成功時，機率x對方一個武器脫手。x為自己防具外功值的總合的2倍。
1	神羅裝束	1	防具-衣	2	2	氣場	2	架勢	無	敵軍配置時可以支付這張卡上的1氣，重置自己重量3以上的武器。
1	神羅裝束	1	防具-衣	2	2	氣場	4	元士兵	無	自己回合開始時氣+3.連技時不需要橫置武器。
1	鬼劍	3	斬擊-刀	5	5	近招	斬0/1/2	鬼斬	暗-暗闇6	內攻*1/2/3.
1	鬼劍	3	斬擊-刀	5	5	遠招	斬0/1/2	三日月斬	暗-暗闇6	內攻*1/2/3.
1	鬼劍	3	斬擊-刀	5	5	氣場	2	血之宿命	暗-暗闇6	移除這張卡。回復X血。X為這回合造成的傷害。X最多為6.
1	鬼劍	3	斬擊-刀	5	5	氣場	3	闇擊氣場	暗-暗闇6	敵軍反應步時可以宣告。支付2血。機率5: 造成的傷害+X。X為本來造成的傷害。X為多為6.
1	鬼劍	3	斬擊-刀	5	5	防招	斬0/1/2	擋劈	無	外功+4/6/8. 宣告時氣+1.
1	鬼劍	3	斬擊-刀	5	5	近招	斬2	靈魂鬼斬	暗-暗闇6	內攻10. 宣告對象有暗闇時, 這招的氣費用變成0. 對象因為這招的效果產生暗闇狀態的話, 使用這招的人回2氣.
1	無限刃	3	斬擊-刀	7	3	氣場	1	炎靈	無	自軍打人判定時, 當成有火-燒傷78的攻擊, 若判定後造成狀態時. 這張卡移除. 這個氣場可以多張在場. 但每回合只能解決1次.
1	無限刃	3	斬擊-刀	7	3	近招	斬0/1/2	火產靈神	火-燒傷7	外功+0/2/4. 宣告時, 若對方有燒傷狀態時, 外功+2. 
1	道具	1	防具-飾	2	2	氣場	1	不死鳥之尾	無	頻死時才能使用。回復3血。剛出場回合不能使用。這個氣場可以重復。這張卡可以從手牌廢棄並抽1張.`;

const table2 = `1	寒月	2	刺擊-劍	4	3	遠招	刺0/1/2	劍氣	無	內功*1/2/3。
1	寒月	2	刺擊-劍	4	3	遠招	格刺0/1/2	重劍氣	無	內功*1/2/3。
1	寒月	2	刺擊-劍	4	3	防招	刺0/1/2	鬼婆婆劍	無	外功+6/8/10。這個招式交戰勝利時。對方-1氣。否則自己扣1氣。
1	寒月	2	刺擊-劍	4	3	氣場	3	亂情瘴	無	回合結束時1氣。敵方第一個內功招交戰判定內功-6。
1	寒月	2	刺擊-劍	4	3	近招	刺0/1/2	前刺	刺-點打3	外功+0/2/4。
1	寒月	2	刺擊-劍	4	3	近招	格刺0/1/2	勾鎌劍法	刺-點打3	外功+0/2/4。自己每有一個氣場在場時。外功+2。這個效果最多+4。
1	鉄劍	2	刺擊-劍	5	2	近招	刺0/1/2	刺劍	刺-點打3	外功+0/2/4
1	麻腦串	1	防具-飾	1	3	氣場	1	醒神	無	自軍回合開始時，氣+1。這個效果不能重復。
1	鉄劍	2	刺擊-劍	5	2	近招	刺0/1/2	刺劍	刺-點打3	外功+0/2/4
1	練甲	1	防具-衣	3	1	反應	3	不動如山	打-昏眩5	本次傷害-6。免疫本次的狀態攻擊。如果傷害減少至0，攻擊方不能繼續連招。
1	練甲	1	防具-衣	3	1	氣功	2	徐如風	風-撕裂7	自配置步使用。回復1行動力。3血。
1	練甲	1	防具-衣	3	1	氣場	2	迅如雷	雷-麻痺5	使用回避時可以1氣。動作消耗-1。
1	華山派道服	1	防具-衣	2	2	氣場	4/6	紫霞神功	無	回合結束時支付2氣。判定時外功+1，內功+3.
1	練甲	1	防具-衣	3	1	氣場	3	俠客行	無	出擊時1氣，指定一把自己包含重量3以下的武器，他可以跟任意一重量爲1的武器聯合。這個效果一次出擊可以最多用到2氣。
1	拳套	1	格鬥-拳	2	2	氣功	2	氣愈	無	回2血, 回4氣。
1	拳套	1	格鬥-拳	2	2	氣場	1	HP回復移動	無	抽牌時, 如果是氣場時, 展示它並回復2血. `;

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
