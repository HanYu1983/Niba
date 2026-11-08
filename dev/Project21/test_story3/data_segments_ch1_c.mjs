/**
 * Chapter 1, part C: the grounded trawler → the flooded decks → the captain's cabin → the girl.
 *
 * Same anchor contract as parts A and B. The three boat locations are kept separate on purpose:
 * H3 is sensitive to spatial continuity, and one plate per space is more reliable than asking the
 * text to invent a new deck every shot.
 */

export const segmentsC = [
  {
    anchor: "這艘大型漁船看來廢棄已久",
    kind: "narration",
    reason: "location_change",
    loc: "loc_fishing_boat_exterior",
    chars: ["char_taylor_wounded"],
    props: ["prop_steel_rod"],
    voice: "narrator",
    spoken: "這艘大型漁船看來廢棄已久，藤壺爬滿了底部。",
    context: "擱淺的漁船廢棄已久，船底爬滿藤壺。",
    visual: "低角度拍傾斜的船身：鏽蝕的欄杆、乾裂的漆、船底一圈白灰色的藤壺。",
    continuity: "把船建立成一個封閉的獵場。",
    sceneNote: "low angle on the tilted hull, barnacles along the waterline"
  },
  {
    anchor: "船艙分為上中下三層",
    kind: "narration",
    reason: "location_change",
    loc: "loc_fishing_boat_deck",
    chars: ["char_taylor_wounded"],
    props: ["prop_steel_rod"],
    voice: "narrator",
    spoken:
      "船艙分為上中下三層，渾濁的河水正不停往底層艙室湧進。當泰洛伊彎腰踏入封閉的空間時，細小的水聲、金屬的顫動與遠處的嚎叫在艙內交織迴盪。",
    context: "船艙分三層，濁水湧進底層；她彎腰踏入封閉空間，水聲、金屬顫動與嚎叫迴盪。",
    visual: "她低頭鑽進船艙口；鏡頭跟著進入昏暗走道，水在木板上反光，灰塵在光柱裡浮動。",
    continuity: "聲音成為她在船裡的第二雙眼。",
    sceneNote: "she ducks through the hatch, flooded corridor beyond"
  },
  {
    anchor: "她的聽覺在此刻發揮了聲納般的奇效",
    kind: "narration",
    reason: "focus_change",
    loc: "loc_fishing_boat_deck",
    chars: ["char_taylor_wounded"],
    props: ["prop_steel_rod"],
    voice: "narrator",
    spoken:
      "她的聽覺在此刻發揮了聲納般的奇效，甚至能藉由河水在地面流動的頻率，在腦海中勾勒出整艘船的內部結構。",
    context: "她靠水流的頻率在腦中勾勒出整艘船的結構。",
    visual: "特寫水面漣漪與她的耳側；鏡頭沿走道緩慢推進，像在描繪看不見的樓層線。",
    continuity: "異常聽覺第一次變成優勢。",
    sceneNote: "ripples on the flooded floor, her ear in close-up, slow dolly"
  },
  {
    anchor: "「很好……一個都別想逃。」",
    kind: "dialogue",
    reason: "voice_change",
    loc: "loc_fishing_boat_deck",
    chars: ["char_taylor_wounded"],
    props: ["prop_steel_rod"],
    voice: "spoken_on_screen",
    speaker: "char_taylor_wounded",
    spoken: "很好……一個都別想逃。",
    context: "她低聲說，一個都別想逃。",
    visual: "她站在走道中央，鐵棍垂在腿側；背後的艙口光把她的影子拉長。",
    continuity: "她已經把船裡所有東西當成目標。",
    sceneNote: "her silhouette in the corridor, rod hanging at her side"
  },
  {
    anchor: "她循著那只有她聽得到的微小聲響",
    kind: "action",
    reason: "focus_change",
    loc: "loc_fishing_boat_deck",
    chars: ["char_taylor_wounded"],
    props: ["prop_steel_rod"],
    sec: 7,
    context: "她循著只有她聽得到的微小聲響，一步步往最上層船艙移動；靴子踩在潮濕木板上，最後停在一扇白門前。",
    visual: "她踩過積水，靴底與木板發出黏響；鏡頭跟著她上樓梯，最後停在一扇寫著「船長室」的白門前。",
    continuity: "門後就是她選定的第一個目標。",
    voice: "none",
    sceneNote: "boots on wet boards, stairs, then the white cabin door"
  },
  {
    anchor: "「來吧！老娘來超渡你啦！」",
    kind: "dialogue",
    reason: "voice_change",
    loc: "loc_boat_captain_cabin",
    chars: ["char_taylor_wounded"],
    props: ["prop_steel_rod"],
    voice: "spoken_on_screen",
    speaker: "char_taylor_wounded",
    intense: true,
    spoken: "來吧！老娘來超渡你啦！",
    context: "她低吼，抬腳猛踹腐朽的木門；門板應聲碎裂。",
    visual: "她後退半步、抬靴踹門；木屑與灰塵爆開，門板向內倒。",
    continuity: "她主動把戰鬥帶進門後。",
    sceneNote: "boot slams the white door, wood splintering inward"
  },
  {
    anchor: "木門應聲碎裂",
    kind: "action",
    reason: "focus_change",
    loc: "loc_boat_captain_cabin",
    chars: ["char_taylor_wounded", "char_boat_girl"],
    props: ["prop_dino_backpack"],
    sec: 7,
    context: "門後，一個背著巨大鮮綠色暴龍背包的少女蹲在船長屍體旁，雙手灰白，正急促翻動。",
    visual: "門板倒下，灰塵散開：少女蹲在屍體旁，巨大的綠色暴龍背包幾乎蓋住她的背；她的雙手死白。",
    continuity: "她以為這是一頭正在進食的幼年怪物。",
    voice: "none",
    sceneNote: "door falls, girl crouched over the corpse, huge green T-rex backpack"
  },
  {
    anchor: "「午餐結束啦！小妞！看棒————！！」",
    kind: "dialogue",
    reason: "voice_change",
    loc: "loc_boat_captain_cabin",
    chars: ["char_taylor_wounded", "char_boat_girl"],
    props: ["prop_steel_rod", "prop_dino_backpack"],
    voice: "spoken_on_screen",
    speaker: "char_taylor_wounded",
    intense: true,
    spoken: "午餐結束啦！小妞！看棒————！！",
    context: "她不等少女回頭，舉起鐵棍衝過去，對準少女後腦。",
    visual: "她踏碎木板衝進艙房，鐵棍化成殘影；少女的背與暴龍背包塞滿畫面。",
    continuity: "她的視角裡，這就是一頭幼年怪物。",
    sceneNote: "she charges through the broken door, rod blurred, girl in the foreground"
  },
  {
    anchor: "———加入，或是死亡———",
    kind: "action",
    reason: "focus_change",
    loc: "loc_prologue_title",
    chars: [],
    props: [],
    sec: 5,
    context: "第一話片尾字卡：加入，或是死亡。",
    visual: "黑底字卡浮現，底片顆粒與刮痕緩慢流動；字卡文字後製疊加，參考板保持無字。",
    continuity: "把問題丟給觀眾：她會成為哪一種怪物？",
    voice: "none",
    sceneNote: "full-frame black slate texture, dust drifting"
  }
];
