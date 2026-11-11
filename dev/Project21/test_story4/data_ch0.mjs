/**
 * Chapter 0 beats: 序章 → 場七（frame01–frame17，止於換衣完成）.
 *
 * The builder turns each scene into readable source lines in story_ch0.txt and each beat
 * into one plan segment. A beat is one voice: dialogue, inner monologue, or a silent shot.
 * Never mix two speakers in one beat — TTS voices are per segment.
 *
 * Helpers:
 *   d(who, line, extra)   on-screen dialogue
 *   i(who, line, extra)   inner voice / voice-over, bound to the POV character
 *   s(stage, sec, extra)  silent beat, no <d> in the prompt
 */

const d = (who, line, extra = {}) => ({ voice: "dialogue", who, line, ...extra });
const i = (who, line, extra = {}) => ({ voice: "inner", who, line, ...extra });
const s = (stage, sec = 5, extra = {}) => ({ voice: "scene", stage, sec, ...extra });

export const chapter = {
  key: "ch0",
  title: "相遇與換命",
  frames: "frame01–frame17",
  scenes: [
    /* ------------------------------------------------------------------ 序章 */
    {
      key: "prologue",
      title: "序章：一張臉，兩段人生",
      loc: "loc_poster_split",
      chars: ["char_anian", "char_zhaoning", "char_cat"],
      props: [],
      context:
        "封面海報與並置畫面：紅金與灰藍各佔一半，兩個女人背靠背，貓在正中央。阿念與昭寧各有一段第一人稱心聲。",
      visual:
        "平面式海報構圖：紅金與灰藍各佔一半，兩個女人背靠背坐著，貓在中央繡墩上，胸前掛牌。切到同一張椅子，昭寧坐著、阿念坐在旁邊石欄，菜籃放膝頭，兩人看著鏡頭外的不同方向。",
      continuity:
        "全片命題：一張臉，兩段人生；貓是見證者。兩段『旁白』其實是各角色的第一人稱心聲，拍不到，plan 標 inner，不用中性旁白唸。",
      sceneNote: "split poster, cat on the seam, then a still two-shot on the chair and railing"
    },
    {
      key: "mirror_morning",
      title: "場一：金籠（鏡台）",
      loc: "loc_mirror_room",
      chars: ["char_zhaoning", "char_qinghe", "char_cat"],
      props: [],
      context:
        "清晨的公主寢殿鏡台前；昭寧回頭，鏡中是另一個她；青禾催她上朝。",
      visual:
        "鏡台與銅鏡佔畫面右半，昭寧在左側回頭，紅紗從肩上滑下，鏡中倒影與本人同時入鏡；青禾立於門邊，貓趴在軟墊上，尾巴壓著珍珠盒。",
      continuity:
        "她認得自己的臉，卻不認得自己的日子——第一次種下『另一個她』。",
      sceneNote: "bronze mirror right, red gauze slipping, maid at the door, cat on the cushion"
    },
    {
      key: "throne_hall",
      title: "場一：金籠（金殿）",
      loc: "loc_palace_hall",
      chars: ["char_zhaoning", "char_cui", "char_cat"],
      props: ["prop_fan_cat", "prop_cat_ear_crown"],
      context:
        "金殿深處，龍椅旁；崔內侍稟報婚期，昭寧以扇代言。",
      visual:
        "十二折紅金裙襬鋪在丹陛上，昭寧執貓扇立在龍椅旁；崔內侍躬身於階下，袖口整齊；貓坐在龍椅下首錦墊上，像另一個座位的主人。",
      continuity:
        "婚期被決定，刺殺的風聲藏在崔內侍的袖口；貓第一次聞到鐵味。",
      sceneNote: "throne hall wide, princess standing beside the throne, eunuch below the dais"
    },
    {
      key: "balcony_night",
      title: "場一：金籠（夜欄）",
      loc: "loc_balcony_night",
      chars: ["char_zhaoning", "char_cat"],
      props: ["prop_cat_ear_crown"],
      context:
        "深夜宮中高樓欄杆，月亮很大，城市在腳下發光。",
      visual:
        "昭寧倚欄，廣袖與長髮被夜風吹動，月亮壓在畫面右上；城市燈火在下方鋪開。貓趴在欄杆上，與她並排看同一個方向。",
      continuity:
        "她第一次承認寂寞；貓的旁觀開始帶立場。",
      sceneNote: "high balcony at night, railing in the foreground, moon and city lights behind"
    },

    /* ------------------------------------------------------------------ 場二 */
    {
      key: "market_morning",
      title: "場二：市井（清晨市集）",
      loc: "loc_market_day",
      chars: ["char_anian", "char_vendor", "char_cat"],
      props: ["prop_basket_greens"],
      context:
        "清晨市集，阿念提著滿籃青菜；王伯留了最嫩也最貴的一把。",
      visual:
        "長街兩側菜攤與蒸氣，青菜堆成小山；阿念提籃穿過人群，貓穿小披風、繫蝴蝶結走在她右腳邊。王伯在攤後探身，手上還沾著水。",
      continuity:
        "市井的日常與溫度；她說謊時手會捏籃子。",
      sceneNote: "market wide, stalls both sides, cat at her right foot, vendor leaning out"
    },
    {
      key: "embroidery_letter",
      title: "場二：市井（繡坊召信）",
      loc: "loc_embroidery",
      chars: ["char_anian", "char_cat"],
      props: ["prop_letter_summon"],
      context:
        "午後繡坊，阿念讀宮中召信：為長公主繡嫁衣，附太醫院令牌。",
      visual:
        "斜光從窗格落在長桌，剪刀、線軸、茶與一籃布頭排開；阿念站在桌前讀信，朱紅火漆在指間發亮。貓坐在桌上正對她，尾巴圈住腳。",
      continuity:
        "進宮的理由不是命令，是周嬤的藥只剩七天。",
      sceneNote: "lattice light across the table, letter and red wax in her hands, cat facing her"
    },

    /* ------------------------------------------------------------------ 場三 */
    {
      key: "palace_steps",
      title: "場三：金階之下（相遇）",
      loc: "loc_palace_steps",
      chars: ["char_zhaoning", "char_anian", "char_qinghe", "char_guard", "char_cat"],
      props: ["prop_basket_greens", "prop_cat_ear_crown"],
      context:
        "宮階，櫻花與花瓣；阿念被當成刺客按跪，昭寧自階上命她抬頭。",
      visual:
        "白石宮階層層向上，兩側禁軍按刀、侍女捧盤；昭寧站在高處，紅金裙襬壓住台階；阿念跪在低處，灰藍補丁衣與菜籃並排。貓坐在階梯轉角的錦墊上。花瓣在兩人之間飛。",
      continuity:
        "權力的高低差先立起來，後面的『叫大人』才有重量。",
      sceneNote: "wide stairs from below, princess high on the steps, kneeling woman low, petals crossing"
    },
    {
      key: "palace_steps_close",
      title: "場三：金階之下（認親）",
      loc: "loc_palace_steps",
      chars: ["char_zhaoning", "char_anian", "char_cat"],
      props: ["prop_jade_half", "prop_cat_ear_crown"],
      context:
        "兩人近距離對坐，昭寧問名，兩塊半玉併合。",
      visual:
        "昭寧單手支頤坐在上階，阿念仰臉坐在低一階，膝上補丁正對鏡頭；貓坐在兩人正中，眼睛看鏡頭。兩塊半玉在畫面中央併攏，斷口對上。",
      continuity:
        "認親：不是靠名字，是靠玉的斷口。",
      sceneNote: "two-shot on the steps, jade halves meeting at the center, cat between them"
    },

    /* ------------------------------------------------------------------ 場四 */
    {
      key: "market_night",
      title: "場四：暗訪（上元夜）",
      loc: "loc_market_night",
      chars: ["char_anian", "char_zhaoning", "char_cat"],
      props: ["prop_cat_mask"],
      context:
        "上元夜長街，阿念拉貓車，昭寧披黑斗篷尾隨兩條街。",
      visual:
        "長街兩側燈棚連成河，白貓面具掛在左攤、貓腳印幡子在右側；阿念拉小木車回頭，貓坐車上竹籃；昭寧在人群後方，黑斗篷兜帽壓低。",
      continuity:
        "昭寧第一次走進市井；她身上的香出賣了她。",
      sceneNote: "night market depth, cart with cat in a basket, hooded figure two stalls behind"
    },
    {
      key: "embroidery_confession",
      title: "場四：暗訪（繡坊相知）",
      loc: "loc_embroidery",
      chars: ["char_anian", "char_zhaoning", "char_cat"],
      props: ["prop_fan_cat"],
      context:
        "繡坊，阿念繡並蒂蓮；昭寧換淡紫常服旁觀，兩人互相看穿。",
      visual:
        "繡架佔畫面中央，牡丹與並蒂蓮繡樣半成；阿念坐著運針，昭寧立於她身後，淡紫常服、手持貓扇。貓趴在布料堆上，半閉眼。午後斜光把兩個影子疊在布上。",
      continuity:
        "阿念早知道她是誰；不揭穿，是因為看見了她的孤單。",
      sceneNote: "embroidery frame centered, seated needlework, standing figure behind with a fan"
    },

    /* ------------------------------------------------------------------ 場五 */
    {
      key: "rain_steps",
      title: "場五：雨夜之約",
      loc: "loc_rain_steps",
      chars: ["char_zhaoning", "char_anian", "char_cat"],
      props: ["prop_umbrella_red", "prop_umbrella_paper"],
      context:
        "雨夜長階，紅傘與破紙傘；昭寧提出交換身份三天。",
      visual:
        "長階在雨裡向下延伸，燈籠一團團化開，紅葉貼在濕石上；昭寧撐紅傘自高處下來，裙襬沾水；阿念坐在階下，破紙傘撐在膝上，懷裡抱著貓。兩把傘的邊緣在同一個畫面裡。",
      continuity:
        "交換的邀約在雨裡成立；她把傘遞出去，等於先認輸。",
      sceneNote: "rain stairs from above, red umbrella descending, patched umbrella below, wet leaves"
    },

    /* ------------------------------------------------------------------ 場六 */
    {
      key: "map_table",
      title: "場六：一盤棋（燭下布局）",
      loc: "loc_study_night",
      chars: ["char_zhaoning", "char_anian", "char_cat"],
      props: ["prop_map_portraits", "prop_fan_cat"],
      context:
        "燭光下桌案，手繪雙臉圖與雙向箭頭；三天交換的計畫。",
      visual:
        "桌面被燭光壓成暖橙色，地圖鋪開，紙上兩張女子側臉與一個雙向箭頭；昭寧執筆指向宮城，阿念一手支頤。貓坐在桌子正中，壓住地圖一角。",
      continuity:
        "計畫是昭寧畫的，但回不回來的箭頭她不敢畫。",
      sceneNote: "candlelit table, map between them, cat pinning one corner"
    },
    {
      key: "carriage_night",
      title: "場六：一盤棋（夜行車廂）",
      loc: "loc_carriage",
      chars: ["char_zhaoning", "char_anian", "char_cat"],
      props: [],
      context:
        "夜行車廂，窗外流動的城燈；兩人第一次平視。",
      visual:
        "車廂內壁是深色木與軟墊，窗外城燈拖成流動光帶；昭寧與阿念分坐兩側，貓坐在中間錦墊上。兩人隔著貓對看，誰也沒先開口。",
      continuity:
        "從『大人』到『你比我想的寂寞』，關係第一次對等。",
      sceneNote: "carriage interior, two facing benches, cat on the middle cushion, moving lights"
    },
    {
      key: "boat_cabin",
      title: "場六：一盤棋（黃昏船艙）",
      loc: "loc_boat_cabin",
      chars: ["char_zhaoning", "char_anian", "char_cat"],
      props: ["prop_jade_tokens", "prop_jade_half", "prop_fan_cat", "prop_osmanthus_candy", "prop_sewing_scissors"],
      context:
        "黃昏船艙，阿念交出全部家當；兩塊成對玉牌躺在錦盒裡。",
      visual:
        "船窗框住水與遠山，桌面攤著地圖、卷軸、玉鐲、香爐；打開的錦盒裡兩塊成對玉牌並排。阿念抱布包坐艙門口，昭寧坐裡面執貓扇，貓趴桌中央。",
      continuity:
        "交換身份的信物先亮相：玉牌、半玉、剪刀、桂花糖。",
      sceneNote: "boat cabin dusk, window with water, open brocade box on the table, cat centered"
    },

    /* ------------------------------------------------------------------ 場七 */
    {
      key: "dressing_mirror",
      title: "場七：換衣（束帶）",
      loc: "loc_mirror_room",
      chars: ["char_anian", "char_zhaoning", "char_cat"],
      props: ["prop_cat_ear_crown", "prop_jade_tokens"],
      context:
        "鏡台前換衣：侍女替阿念束上十二斤紅金禮服，昭寧旁觀。",
      visual:
        "鏡台前立著兩具人形：阿念被侍女一層層收緊腰帶，紅金禮服堆在腳邊；昭寧穿另一襲紅衣站在側後方，手裡轉著戒指。貓趴在首飾盒旁軟墊上，眼睛半睜。",
      continuity:
        "十二斤的重量從昭寧身上轉移到阿念身上。",
      sceneNote: "dressing room wide, maid tightening the sash, princess behind, cat on the cushion"
    },
    {
      key: "hairpin_mirror",
      title: "場七：換衣（盤髮扣項圈）",
      loc: "loc_mirror_room",
      chars: ["char_zhaoning", "char_anian", "char_cat"],
      props: ["prop_jade_half", "prop_cat_ear_crown"],
      context:
        "昭寧替阿念盤髮、扣上紅寶石項圈；鏡中兩張一樣的臉。",
      visual:
        "銅鏡裡並排兩張相同的臉；昭寧站在阿念身後，手指停在頸後；紅寶石項圈扣上，半塊玉貼在鎖骨。貓坐在桌上，正對鏡子。",
      continuity:
        "戴上這張臉，就再也摘不下來——第一章的結束句。",
      sceneNote: "mirror two-shot, identical faces, hands at the nape, cat facing the glass"
    }
  ]
};

export const framing = {
  prologue:
    "wide symmetrical poster; the second shot is a locked wide two-shot with the chair and railing filling the frame",
  mirror_morning:
    "medium shot; the bronze mirror fills the right half, the red gauze and doorway stay in frame",
  throne_hall:
    "wide-to-medium from the foot of the dais; red columns and the twelve-step carpet fill the background",
  balcony_night:
    "wide shot from behind the railing; moon and city lights fill the upper and lower thirds, the railing stays sharp in the foreground",
  market_morning:
    "wide-to-medium tracking beside her; stalls, steam and awnings fill both sides and recede down the street",
  embroidery_letter:
    "medium shot; the lattice window, thread spools and cloth bolts stay behind her instead of dissolving into bokeh",
  palace_steps:
    "wide from below the steps; white stairs, guards and cherry trees fill the frame, the two women separated by the height",
  palace_steps_close:
    "medium two-shot on the steps; the balustrade and falling petals remain visible behind both faces",
  market_night:
    "wide-to-medium tracking; lanterns and stalls recede down the street, the cart and the hooded figure held in the same depth",
  embroidery_confession:
    "medium shot; the embroidery frame and hanging cloth fill the foreground, the workshop stays readable behind",
  rain_steps:
    "wide-to-medium from above the stairs; wet steps, red leaves and blurred lanterns fill the frame, both umbrellas visible",
  map_table:
    "medium top-down across the table; the map, candle and cat fill the frame, the dark study behind",
  carriage:
    "medium two-shot inside the carriage; windows on both sides keep the moving city lights in frame",
  boat_cabin:
    "wide-to-medium; the cabin window frames water and distant hills behind the table",
  dressing_mirror:
    "medium full shot; the bronze mirror and dressing table fill the background, the maid and the dress stay in frame",
  hairpin_mirror:
    "medium mirror two-shot; the room and the cat are reflected behind the two identical faces"
};

/* -------------------------------------------------------------------- beats */

chapter.scenes[0].beats = [
  s("黑底片名卡：別境 · 雙生換命。紅金與灰藍各一線，從畫面中央慢慢分開。", 4, {
    chars: [],
    framing: "full-frame black title card, no location, no people; the two colour lines are the only image"
  }),
  s("封面。紅金與灰藍各佔一半，兩個女人背靠背坐著，一隻灰白長毛波斯貓坐在正中央的繡墩上，胸前掛牌「波斯貓大人」，副題「雙生換命」。", 6),
  i("char_anian", "我娘說，撿到我的那天，天上沒下雨，地上卻全是水。我問她為什麼。她說，因為有人在宮裡哭，哭了一整夜。", {
    sourceTag: "（旁白）"
  }),
  i("char_zhaoning", "我從十四歲開始穿這件衣裳。它教會我怎麼站、怎麼看人、怎麼在笑的時候不動眼睛。它唯一沒教我的，是怎麼把一個和自己一樣的人，從地上扶起來。", {
    sourceTag: "（旁白）"
  }),
  s("同一張椅子，昭寧坐著，阿念坐在旁邊的石欄上，菜籃放在膝頭，貓在兩人中間的繡墩上。兩個人沒有看對方，看的都是鏡頭外的一個方向。", 5),
  i("char_cat", "左邊那個坐得太直，右邊那個坐得太隨意。本座坐在中間，剛好。"),
  d("char_anian", "大人，你說，天底下真有長得一模一樣的兩個人嗎？"),
  d("char_zhaoning", "有。只是其中一個，被藏起來了。", { stage: "沒有回頭" })
];

chapter.scenes[1].beats = [
  s("鏡台前，昭寧回頭，紅紗從肩上滑下，鏡子裡是另一個她。貓在軟墊上，尾巴壓著一盒珍珠。", 6, { key: "mirror_first" }),
  d("char_qinghe", "郡主，該上朝了。"),
  d("char_zhaoning", "青禾，你看看鏡子裡這個人。"),
  d("char_qinghe", "是郡主。"),
  d("char_zhaoning", "我認得她的臉。我不認得她的日子。"),
  d("char_qinghe", "……郡主今日，是不是沒睡？"),
  d("char_zhaoning", "睡了。夢裡有人叫我姊姊。"),
  d("char_qinghe", "郡主沒有姊妹。"),
  d("char_zhaoning", "是啊。所有人都這麼說。", { stage: "笑" })
];

chapter.scenes[2].beats = [
  s("金殿深處，龍椅旁，昭寧執扇而立，身後是十二折的紅金裙襬。貓坐在龍椅下首的錦墊上。", 6),
  d("char_cui", "長公主，鎮北侯的婚期，太后已經定了。入冬前。"),
  d("char_zhaoning", "這麼急。"),
  d("char_cui", "邊關也急。"),
  d("char_zhaoning", "崔內侍，你說，一個快要死的人，為什麼還要成親？"),
  d("char_cui", "……公主說笑了。"),
  d("char_zhaoning", "我沒說笑。我只是想知道，這樁婚事，是辦給活人看的，還是辦給死人看的。", { intense: true }),
  d("char_cui", "公主多慮了。", { stage: "躬身" }),
  i("char_cat", "本座聞到了。他袖口有鐵味，還有孝布的漿味。左邊的，妳的婚禮會有人流血。")
];

chapter.scenes[3].beats = [
  s("深夜，昭寧倚在欄上，月亮很大，燈籠很亮，城市在腳下發光。貓趴在欄杆上，與她並排看同一個方向。", 6),
  d("char_zhaoning", "大人，你說，這城裡有多少人，此刻也睡不著？"),
  i("char_cat", "很多。但只有妳，是因為床太軟。"),
  d("char_zhaoning", "我小的時候，以為宮牆外面是黑的。後來才知道，外面比裡面亮。"),
  i("char_cat", "那妳怎麼不出去？"),
  d("char_zhaoning", "因為沒有人替我站在這裡。", { stage: "很久" })
];

chapter.scenes[4].beats = [
  s("清晨的市集，阿念提著滿籃青菜走來，貓穿著小披風、繫著蝴蝶結，走在她右腳邊，尾巴翹得很高。她腰間掛著貓腳印的荷包。", 6),
  d("char_vendor", "阿念，今天的菜新鮮，給妳留了最嫩的一把。"),
  d("char_anian", "王伯，你留的是最貴的一把。"),
  d("char_vendor", "哎，妳這丫頭，眼睛比秤準。"),
  d("char_anian", "秤不準，日子才要準。"),
  d("char_vendor", "妳娘今天好些沒？"),
  d("char_anian", "好些了。今天還罵我呢。", { stage: "停了一下" }),
  d("char_vendor", "那就好。能罵人，就是能活。"),
  i("char_cat", "右邊的，妳說謊的時候，手會捏籃子。本座都看見了。")
];

chapter.scenes[5].beats = [
  s("繡坊內，午後的斜光。阿念站在桌前讀一封信，信上有朱紅火漆。桌上是剪刀、線軸、茶、一籃布頭；貓坐在桌上，正對著她，像在等她讀完。", 6),
  d("char_anian", "……聞城南蘇氏，繡藝冠絕，特召入府，為長公主繡嫁衣。三日內至。附太醫院令牌一枚。", {
    stage: "讀"
  }),
  d("char_anian", "大人，宮裡的人，怎麼會知道我的名字？", { stage: "抬頭" }),
  i("char_cat", "因為妳的臉，比妳的名字早二十四年就進了宮。"),
  d("char_anian", "我娘說，這輩子別進宮門。"),
  d("char_anian", "可是她的藥，只剩七天了。", { stage: "把信折好，放進懷裡" })
];

chapter.scenes[6].beats = [
  s("宮階，櫻花與花瓣。昭寧站在高處，侍女捧盤、禁軍按刀；阿念跪在低處的石階上，仰著頭。貓坐在兩人之間的錦墊上，正好在階梯的轉角。兩個人的衣服，一個紅金，一個灰藍補丁。", 6),
  d("char_guard", "跪下！見長公主，還不跪！", { intense: true }),
  d("char_anian", "大人，小女只是來送繡樣的。籃子裡是菜，不是刀。", { stage: "已經跪著" }),
  d("char_zhaoning", "抬起頭來。", { stage: "自階上" }),
  d("char_anian", "小女不敢。怕嚇著貴人。"),
  d("char_zhaoning", "我命你抬頭。", { intense: true }),
  s("阿念抬頭。很長的沉默。風把花瓣吹到兩個人的中間。", 6),
  d("char_zhaoning", "……青禾，退下。所有人都退下。"),
  d("char_qinghe", "郡主——"),
  d("char_zhaoning", "我說，退下。", { intense: true })
];

chapter.scenes[7].beats = [
  s("兩人近距離對坐，昭寧單手支頤，阿念仰著臉，膝上還有補丁。貓坐在兩人正中間，眼睛看著鏡頭。", 6),
  d("char_zhaoning", "你叫什麼名字？"),
  d("char_anian", "蘇念。街坊叫我阿念。"),
  d("char_zhaoning", "念。哪個念？"),
  d("char_anian", "懷念的念。我娘說，撿到我的那天，她一直在念一個人的名字，念到忘了自己要念誰。"),
  d("char_zhaoning", "你脖子上那塊玉，給我看看。", { stage: "伸手" }),
  d("char_anian", "這是我娘給的。", { stage: "護住" }),
  d("char_zhaoning", "我不搶。我這裡，也有一塊。"),
  s("昭寧取出自己頸上的半塊玉。兩塊玉併在一起，斷口對得上。", 6, { key: "jade_reveal" }),
  d("char_anian", "……大人。"),
  d("char_zhaoning", "別叫大人。"),
  d("char_anian", "那叫什麼？"),
  d("char_zhaoning", "叫……先叫大人。我還不習慣。", { stage: "收回手" }),
  i("char_cat", "本座等了二十四年，就等這一聲。結果被妳們兩個傻子拖到現在。")
];

chapter.scenes[8].beats = [
  s("上元夜，長街全是燈。阿念拉著一輛小木車，貓坐在車上的竹籃裡；她回頭看，身後跟著一個披黑斗篷、戴兜帽的女人。左邊攤上掛著白貓面具，右邊幡子上印著貓腳印。", 6),
  d("char_anian", "跟了兩條街了。", { stage: "不回頭" }),
  s("昭寧在斗篷裡沉默。", 4),
  d("char_anian", "貴人走路沒有聲音，可你身上的香，比燈籠還亮。"),
  d("char_zhaoning", "……我只是路過。"),
  d("char_anian", "路過的人不會跟著一輛菜車走兩條街。"),
  s("昭寧沉默。", 4),
  d("char_anian", "要買菜嗎？今晚的蘿蔔很甜。不買就別擋著人家的道。"),
  d("char_zhaoning", "你這籃子裡，裝的是貓，還是主意？"),
  d("char_anian", "都裝。大人要哪一樣？"),
  d("char_zhaoning", "……我要那個不說話的。"),
  d("char_anian", "那你要失望了。牠話最多。", { stage: "笑" })
];

chapter.scenes[9].beats = [
  s("繡坊內，阿念在繡架上繡一朵牡丹，針腳細得像髮絲；昭寧換了身淡紫常服，站在她身後看，手裡拿著一柄繡著貓的團扇。貓趴在布料堆上，半閉著眼。", 6),
  d("char_zhaoning", "這是什麼花？"),
  d("char_anian", "並蒂蓮。一根線劈成十六股，兩朵花才繡得一樣。"),
  d("char_zhaoning", "為什麼要一樣？不一樣，才分得出哪朵是真的。"),
  d("char_anian", "分得出，就有一朵要被剪掉。", { stage: "針停了一下" }),
  s("昭寧沒有說話。", 4),
  d("char_anian", "大人站遠些，線會勾到你的袖子。這件衣裳，是給一位貴人做的。"),
  d("char_zhaoning", "給誰？"),
  d("char_anian", "給一個……和我長得一樣的人。"),
  s("昭寧的手停在扇面上。", 4),
  d("char_anian", "我從第一眼就看出來了。大人不必裝。", { stage: "低頭繼續繡" }),
  d("char_zhaoning", "那你為什麼不揭穿我？"),
  d("char_anian", "因為你看著我繡花的樣子，像一個從來沒被人縫過衣服的人。")
];

chapter.scenes[10].beats = [
  s("雨夜的長階，燈籠在雨裡一團一團地化開，地上全是紅葉與水光。昭寧撐一把紅傘拾級而下，黑紅色的裙襬被雨打濕；阿念坐在階下，撐一把破紙傘，懷裡抱著貓，仰頭看她。", 7),
  d("char_zhaoning", "起來。"),
  d("char_anian", "地上涼，坐著舒服。"),
  d("char_zhaoning", "我說，起來。", { intense: true }),
  d("char_anian", "大人，你的傘很好。可你腳下的水，跟我腳下的水，是同一場雨。"),
  s("昭寧沉默，往下走了兩階。", 4),
  d("char_anian", "你來做什麼？"),
  d("char_zhaoning", "我來給你一樣東西。"),
  d("char_anian", "什麼？"),
  d("char_zhaoning", "我的臉。"),
  s("雨聲變大。", 4),
  d("char_anian", "……三天？"),
  d("char_zhaoning", "三天。"),
  d("char_anian", "三天之後呢？"),
  d("char_zhaoning", "三天之後，你要嘛恨我，要嘛謝我。"),
  d("char_anian", "要是我既不恨，也不謝呢？"),
  d("char_zhaoning", "那你就還是阿念。這一回，我替你擋。", { stage: "把傘往前遞了一寸" }),
  d("char_anian", "大人，你這樣的人，也會替別人擋嗎？", { stage: "看著她" }),
  d("char_zhaoning", "我不會。所以我得學。"),
  d("char_anian", "……你的手好冰。", { stage: "接過傘" }),
  d("char_zhaoning", "天冷。", { key: "rain_cold_hands" }),
  d("char_anian", "現在是十月。"),
  i("char_cat", "右邊的接了傘。左邊的輸了。本座記下了。")
];

chapter.scenes[11].beats = [
  s("燭光下的桌案，攤開一張手繪圖，紙上畫著兩張女子的側臉，中間是一個雙向箭頭；昭寧執筆指向圖上的宮城，阿念一手支頤聽著。貓坐在兩人正中間，壓著地圖的一角。", 6),
  d("char_zhaoning", "初一到初三，你在宮裡，我在市井。初四天亮，換回來。"),
  d("char_anian", "要是初四天亮，我死了呢？"),
  d("char_zhaoning", "那你就死在金床上，比死在街上體面。"),
  d("char_anian", "大人真會說話。"),
  d("char_zhaoning", "我不會說話。我只會安排。"),
  d("char_anian", "這張紙上畫了兩張臉，卻只有一個箭頭。另一個箭頭呢？", { stage: "指著圖" }),
  s("昭寧停筆。", 4),
  d("char_anian", "你沒畫。"),
  d("char_zhaoning", "因為我不知道，回來的那個人，還想不想回來。"),
  d("char_anian", "那你呢？你想回來嗎？"),
  d("char_zhaoning", "我從來沒有離開過，談什麼回來。"),
  d("char_anian", "那就把另一個箭頭補上。我替你畫。", { stage: "把圖轉正" }),
  s("阿念拿過筆，在圖上補了一個箭頭。兩個箭頭，一個向左，一個向右，中間是那隻貓。", 6)
];

chapter.scenes[12].beats = [
  s("夜行的車廂，窗外是流動的城燈。昭寧與阿念分坐兩側，貓坐在中間的錦墊上。兩個人都看著對方，誰也沒先開口。", 5),
  d("char_anian", "這車好穩。"),
  d("char_zhaoning", "六匹馬拉的，當然穩。"),
  d("char_anian", "我從前以為，有錢人坐在車裡，是因為懶得走路。"),
  d("char_zhaoning", "現在呢？"),
  d("char_anian", "現在覺得，是因為路太顛，坐車的人不敢下來。"),
  d("char_zhaoning", "……你比我想的聰明。", { stage: "看向窗外" }),
  d("char_anian", "你比我想的寂寞。")
];

chapter.scenes[13].beats = [
  s("黃昏的船艙，窗外是水與遠山。阿念抱著一個布包坐在艙門口，昭寧坐在裡面，執一柄繡貓的團扇。桌上攤著地圖、卷軸、玉鐲、香爐；一只打開的錦盒裡，躺著兩塊成對的玉牌。貓趴在桌子中央。", 7),
  d("char_anian", "我全部的家當，都在這裡了。", { stage: "把布包放在膝上" }),
  d("char_zhaoning", "打開。"),
  s("阿念打開布包：半塊玉、一把剪刀、一包桂花糖。", 5),
  d("char_zhaoning", "……桂花糖？"),
  d("char_anian", "我娘說，苦日子要含著甜的過。"),
  d("char_zhaoning", "太甜。", { stage: "拿了一顆放進嘴裡" }),
  d("char_anian", "大人沒吃過苦，當然嫌甜。"),
  d("char_zhaoning", "……我吃過。只是沒有人給我糖。"),
  s("阿念把整包糖推到她面前。", 4),
  d("char_anian", "那現在有了。")
];

chapter.scenes[14].beats = [
  s("鏡台前，侍女正替阿念換上那件紅金禮服，腰帶一層層收緊；昭寧穿著另一襲紅衣站在旁邊看，手裡轉著一枚戒指。貓趴在首飾盒旁的軟墊上，眼睛半睜。", 6),
  d("char_anian", "這衣裳好重。"),
  d("char_zhaoning", "一件十二斤。我從十四歲穿到現在。", {
    refs: [
      {
        key: "mirror_first",
        why: "她在鏡台前說過「我認得她的臉，我不認得她的日子」；十二斤的重量就是那句話的實體。",
        manifestation: "清晨鏡台前滑落的紅紗，與此刻堆在阿念腳邊的紅金禮服是同一件"
      }
    ]
  }),
  d("char_anian", "難怪你走路那麼慢。"),
  d("char_zhaoning", "不是慢。是不能走快——走快了，頭上的東西會掉；掉了一地，撿的人比看的人多。"),
  d("char_anian", "那我要是走快了怎麼辦？", { stage: "被腰帶勒得吸氣" }),
  d("char_zhaoning", "你不會。我會讓所有人走在你後面。"),
  d("char_anian", "那前面呢？"),
  d("char_zhaoning", "前面有我。", { stage: "替她理了理領口" })
];

chapter.scenes[15].beats = [
  s("昭寧站在阿念身後，替她把辮子盤起，扣上那條墜著紅寶石的項圈。鏡子裡映出兩張一樣的臉。貓坐在桌上，正對著鏡子。", 6),
  d("char_zhaoning", "這塊玉，戴好。它認人。", {
    refs: [
      {
        key: "jade_reveal",
        why: "兩塊半玉在宮階上併合過，斷口對得上；現在她把其中一塊交出去。",
        manifestation: "兩塊半玉併攏時對上的斷口"
      }
    ]
  }),
  d("char_anian", "它認的是玉，還是我？"),
  d("char_zhaoning", "它認的是……我們。"),
  s("昭寧的手在她頸後停了一瞬。", 4),
  d("char_anian", "你的手在抖。"),
  d("char_zhaoning", "天冷。"),
  d("char_anian", "現在是十月。", {
    refs: [
      {
        key: "rain_cold_hands",
        why: "雨夜遞傘時她說手冰是因為「天冷」，被阿念用同一句「現在是十月」拆穿；此刻是同一段對話的第二次。",
        manifestation: "雨夜紅傘下遞出的那隻手"
      }
    ]
  }),
  d("char_zhaoning", "……那就當我在怕。", { stage: "低聲" }),
  d("char_anian", "怕什麼？"),
  d("char_zhaoning", "怕妳戴上這張臉以後，就再也摘不下來。"),
  i("char_cat", "本座提醒過妳們。這張臉不是面具，是戶籍。戴上就歸宮裡管了。")
];
