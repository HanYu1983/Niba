import { OUTFITS } from "./segments_a.mjs";

export const SEGMENTS_B = [
  {
    key: "seg_020",
    start: "【圖 19 — 荊棘木門】",
    end: "【圖 20 — 夜潛】",
    kind: "dialogue",
    split: "location_change",
    loc: "loc_spiked_gate",
    chars: ["char_momo", "char_shiro"],
    props: [],
    context: "荊棘木門前，桃與柴犬伏低，門上鬼面旗獵獵作響；她數到三準備進門。",
    visual: "低角度、尖樁木門、黑鬼面旗、樹頂漏光與漂浮塵埃。",
    continuity: "從遺跡跟蹤推進到入侵據點，潛入段開始。",
    voice: "spoken_on_screen",
    speaker: "char_momo",
    spoken: "「一進門就有哨位。我數到三——」",
    outfits: {
      char_momo: OUTFITS.MOMO_TRAVEL,
      char_shiro: OUTFITS.SHIRO_RED,
    },
    sound:
      "Hush of the forest floor, creaking wood, muffled wind over spikes, dust settling.",
    voicePrompt:
      "Young Japanese woman, tight tactical whisper, close-mic",
    sync:
      "Momo's lips move in a whisper; the dog is silent and low.",
    refs: [],
  },
  {
    key: "seg_021",
    start: "【圖 20 — 夜潛】",
    end: "【圖 21–22 — 攀牆】",
    kind: "dialogue",
    split: "location_change",
    loc: "loc_fortress_pillars",
    chars: ["char_momo", "char_gon"],
    props: ["prop_torch"],
    context: "夜裡鬼城木柱間，桃持火把貼柱前進；ゴン在橫樑上回報牆內有兩個人。",
    visual: "黑夜、巨大木柱、火把光、猴攀在橫樑上比劃。",
    continuity: "建立鬼城內部空間與「不吵醒人」的作戰原則。",
    voice: "spoken_on_screen",
    speaker: "char_gon",
    spoken:
      "『牆內有人。兩個。』\n「那就換邊走。我們是來救人的，不是來吵醒人的。」",
    outfits: {
      char_momo: OUTFITS.MOMO_BATTLE,
      char_gon: OUTFITS.GON_SCARF,
    },
    sound:
      "Inner keep quiet, torch hiss, soft pad of footsteps, a faint pigeon rustle in the rafters.",
    voicePrompt:
      "Small boyish monkey voice, urgent whisper; young woman, calm command whisper",
    sync:
      "Gon and Momo move their mouths with their own whispers; no other voice.",
    refs: [],
  },
  {
    key: "seg_022",
    start: "【圖 21–22 — 攀牆】",
    end: "【圖 23 — 木橋上的影子】",
    kind: "dialogue",
    split: "location_change",
    loc: "loc_stone_wall",
    chars: ["char_momo", "char_shiro"],
    props: [],
    context: "黎明前最暗的時刻，桃與柴犬沿石牆裂縫向上攀。",
    visual: "粗礪石牆、指節磨破、柴犬四爪摳住石縫；霧氣與藤蔓在下方。",
    continuity: "用肉體的吃力把攻城難度具體化。",
    voice: "spoken_on_screen",
    speaker: "char_momo",
    spoken: "『再高一點……牆裡面就是城了。』\n「汪。」",
    outfits: {
      char_momo: OUTFITS.MOMO_BATTLE,
      char_shiro: OUTFITS.SHIRO_RED,
    },
    sound:
      "Gritty scrape of hands and claws on stone, ragged breathing, creaking vines, early birdsong.",
    voicePrompt:
      "Young Japanese woman, breathless near-whisper, close-mic",
    sync:
      "Momo's lips move with the whisper; the dog barks once, no human voice.",
    refs: [],
  },
  {
    key: "seg_023",
    start: "【圖 23 — 木橋上的影子】",
    end: "【圖 24 — 以果結緣】",
    kind: "dialogue",
    split: "focus_change",
    loc: "loc_bridge",
    chars: ["char_momo", "char_shiro", "char_oni_soldier"],
    props: [],
    context: "窄木橋上，桃與柴犬伏低，等兩名持刀鬼武士的影子走過去。",
    visual: "橋板近景、下方長影、桃幾乎停止呼吸、柴犬連尾巴都不敢動。",
    continuity: "全片最緊繃的靜默段之一，下一段用果實解圍。",
    voice: "internal_monologue",
    speaker: "char_momo",
    spoken: "『等他們走過去——一個，兩個，三個——』",
    outfits: {
      char_momo: OUTFITS.MOMO_BATTLE,
      char_shiro: OUTFITS.SHIRO_RED,
      char_oni_soldier: OUTFITS.ONI_SOLDIER_ARMOR,
    },
    sound:
      "Armoured feet on the deck below, wood groaning, held breath, a distant spear clink.",
    voicePrompt:
      "Young Japanese woman, barely audible ventriloquist whisper, close-mic, almost no breath",
    sync:
      "Her lips barely move; the voice is an intimate whisper, not a lip-synced delivery.",
    refs: [],
  },
  {
    key: "seg_024",
    start: "【圖 24 — 以果結緣】",
    end: "【圖 25 — 第一戰】",
    kind: "dialogue",
    split: "location_change",
    loc: "loc_wall_base",
    chars: ["char_momo", "char_oni_cub"],
    props: ["prop_spear"],
    context: "牆根下，桃把果實高舉給戴皮甲的猴鬼小卒，換到一條暗門。",
    visual: "監視塔、長矛、桃單膝跪地把果子舉過頭；小卒盯了三秒一把抓過。",
    continuity: "用「不打架」解決第一個障礙，替後面的「鬼也能講道理」鋪路。",
    voice: "spoken_on_screen",
    speaker: "char_momo",
    spoken:
      "「給你。我們不打架，你讓路就好。」\n「……走那條路。」\n『你看，柿子比刀有用。』",
    outfits: {
      char_momo: OUTFITS.MOMO_BATTLE,
      char_oni_cub: OUTFITS.ONI_CUB_ARMOR,
    },
    sound:
      "Morning stillness at the wall, a spear shaft clink, cloth rustle, a juicy bite.",
    voicePrompt:
      "Young Japanese woman, calm and friendly; small squeaky oni-cub voice, suspicious then sulky",
    sync:
      "Momo and the cub move their mouths with their own lines; no narration.",
    refs: [],
  },
  {
    key: "seg_025",
    start: "【圖 25 — 第一戰】",
    end: "【圖 26 — 城門激戰】",
    kind: "dialogue",
    split: "focus_change",
    loc: "loc_corner_gate",
    chars: ["char_momo", "char_shiro", "char_gon", "char_oni_general"],
    props: ["prop_katana"],
    context: "角門被雙角巨漢攔住，桃拔刀踏前，說要帶牆裡的人回家。",
    visual: "巨漢披甲、臂粗如柱；桃橫刀護身、眼神銳利；柴犬與猴在後。",
    continuity: "第一次正面戰鬥，對手是鬼將。",
    voice: "spoken_on_screen",
    speaker: "char_oni_general",
    spoken:
      "「小娃娃也敢來拆牆？」\n『對。我來帶牆裡的人回家。』",
    outfits: {
      char_momo: OUTFITS.MOMO_BATTLE,
      char_shiro: OUTFITS.SHIRO_RED,
      char_gon: OUTFITS.GON_SCARF,
      char_oni_general: OUTFITS.ONI_GENERAL_ARMOR,
    },
    sound:
      "Tensed forest birds falling silent, gravel crunch, a blade leaving its sheath, a deep oni rumble.",
    voicePrompt:
      "Deep rumbling oni warrior voice; young Japanese woman, steady and unafraid",
    sync:
      "The general and Momo move their mouths with their own lines.",
    refs: [],
  },
  {
    key: "seg_026",
    start: "【圖 26 — 城門激戰】",
    end: "【圖 27 — 木匣】",
    kind: "dialogue",
    split: "focus_change",
    loc: "loc_gate_frame",
    chars: ["char_momo", "char_shiro", "char_oni_soldier"],
    props: ["prop_katana"],
    context: "桃攀在門框上死命把城門撞開一條縫，對柴犬喊「行け」。",
    visual: "門框、橫木、汗滴下頷；門縫外紅皮鬼卒舉火把湧來；柴犬死守退路木階。",
    continuity: "把「五人小隊」推入真正的戰鬥。",
    voice: "spoken_on_screen",
    speaker: "char_momo",
    spoken: "『シロ——好感！」",
    source_note: "原文「好感」疑為誤植；生成端以「シロ、行け。」配音。",
    outfits: {
      char_momo: OUTFITS.MOMO_BATTLE,
      char_shiro: OUTFITS.SHIRO_RED,
      char_oni_soldier: OUTFITS.ONI_SOLDIER_ARMOR,
    },
    sound:
      "Wood groaning under strain, torches crackling, distant oni shouts, a dog's snarling brace.",
    voicePrompt:
      "Young Japanese woman, shouted command through gritted teeth, close-mic",
    sync:
      "Momo's mouth opens in a shout; the dog snarls without human voice.",
    refs: [],
  },
  {
    key: "seg_027",
    start: "【圖 27 — 木匣】",
    end: "【圖 28 — 眺望鬼城】",
    kind: "dialogue",
    split: "location_change",
    loc: "loc_corridor",
    chars: ["char_momo"],
    props: ["prop_wooden_box", "prop_cloth_house"],
    context: "混戰間桃在血痕石燈下撿到刻著「桃」字的木匣，裡面是婆婆家舊屋的畫布。",
    visual: "長廊、石燈、木匣紅穗、畫布上的桃樹舊屋；遠處鬼兵喊聲逼近。",
    continuity: "第一次把桃的身世與鬼城連在一起；木匣成為後段護身物件。",
    voice: "spoken_on_screen",
    speaker: "char_momo",
    spoken:
      "『這是……婆婆說的，那間屋子？』\n『那孩子在那裡！』\n『總之——先保住這件東西。』",
    outfits: { char_momo: OUTFITS.MOMO_BATTLE },
    sound:
      "Dim corridor, distant drips, a wooden clasp click, cloth rustle, coarse oni shouts approaching.",
    voicePrompt:
      "Young Japanese woman, stunned whisper then urgent resolve; a distant coarse oni soldier shout",
    sync:
      "Momo whispers her own lines; the oni shout comes from off-screen with no visible mouth.",
    refs: [
      {
        segment_ref: "seg_006",
        why: "畫布上的舊屋正是婆婆家的樣子",
        manifestation: "木匣裡那塊畫著桃樹下舊屋的布",
      },
    ],
  },
  {
    key: "seg_028",
    start: "【圖 28 — 眺望鬼城】",
    end: "【圖 29 — 天牢】",
    kind: "dialogue",
    split: "location_change",
    loc: "loc_broken_tower",
    chars: ["char_momo", "char_peach"],
    props: ["prop_cloth_house"],
    context: "入夜，桃靠在殘塔木柱上，看著鬼王殿的火光，自言自語自己的來歷，然後下定決心明晚進殿。",
    visual: "殘塔、遠方最高層的火光、雉停肩頭；桃握緊懷中的布。",
    continuity: "把身世疑問暫時收起，轉成「先打完再說」的行動。",
    voice: "internal_monologue",
    speaker: "char_momo",
    spoken:
      "『那個人（婆婆）說，我是從桃樹下被撿到的。會不會，我家也跟這座城一樣，原本也是有屋簷的。』\n「不管怎樣，先打完再說。明晚，我們就進去。」",
    outfits: {
      char_momo: OUTFITS.MOMO_BATTLE,
      char_peach: OUTFITS.PEACH_PLAIN,
    },
    sound:
      "Night wind over the broken tower, creaking post, distant torch crackle, a soft cloth press.",
    voicePrompt:
      "Young Japanese woman, quiet internal voice, close-mic, reflective then hardening",
    sync:
      "Her lips stay nearly sealed; the voice is internal, no lip sync.",
    refs: [
      {
        segment_ref: "seg_027",
        why: "木匣裡的畫布引出她對「家」的疑問",
        manifestation: "她按在胸口的布與遠方鬼王殿的火光",
      },
    ],
  },
  {
    key: "seg_029",
    start: "【圖 29 — 天牢】",
    end: "【圖 30 — 突圍】",
    kind: "dialogue",
    split: "location_change",
    loc: "loc_dungeon",
    chars: ["char_momo", "char_genzo", "char_shiro"],
    props: [],
    context: "天牢重逢：桃隔著木柵握住源蔵的手，承諾要走也是大家一起走。",
    visual: "火把幽光、木柵、老人花白頭髮與舊繭手；桃跪在泥地湊近柵欄。",
    continuity: "把「救人」從抽象目標變成一個具體的老人；也第一次提出「鬼也能講道理」。",
    voice: "spoken_on_screen",
    speaker: "char_momo",
    spoken:
      "「您是島另一頭的上老，是不是？我是從村子裡來的，我叫桃。」\n『桃……你怎麼進得來。快走！鬼王會把你——』\n『要走也是大家一起走。我先把牢門劈開，再往大殿去討個說法。』\n『那大殿上……可是真的鬼王啊。』\n『我知道。婆婆說過，鬼也是能講道理的——只要你先動手。』",
    outfits: {
      char_momo: OUTFITS.MOMO_BATTLE,
      char_genzo: OUTFITS.GENZO_RAGS,
      char_shiro: OUTFITS.SHIRO_RED,
    },
    sound:
      "Dungeon hush, a single drip, the rasp of old hands on wood, chains rattling, torch hiss.",
    voicePrompt:
      "Young Japanese woman, urgent and gentle; old trembling Japanese elder voice, desperate",
    sync:
      "Momo and Genzo move their mouths with their own lines; Shiro only watches.",
    refs: [],
  },
  {
    key: "seg_030",
    start: "【圖 30 — 突圍】",
    end: "【圖 31–34 — 大殿對峙】",
    kind: "action",
    split: "focus_change",
    loc: "loc_passage",
    chars: ["char_momo", "char_oni_soldier"],
    props: ["prop_katana"],
    context: "桃在走道裡拔腿狂奔，身後是整排追兵，前面是微光的大殿入口；她沒有回頭。",
    visual: "長廊、火把殘影、緞帶直直拖在身後、塵土與汗。",
    continuity: "把天牢的情感壓力轉成純速度，衝進大殿。",
    voice: "none",
    speaker: null,
    spoken: null,
    outfits: {
      char_momo: OUTFITS.MOMO_BATTLE,
      char_oni_soldier: OUTFITS.ONI_SOLDIER_ARMOR,
    },
    sound:
      "Continuous heavy 35mm film hiss and warm analog room tone, bootfalls hammering stone, ragged breath, distant oni roars, torch flames streaking past.",
    voicePrompt: null,
    sync:
      "Purely mechanical and environmental sound; lips clamped, zero vocalization.",
    refs: [
      {
        segment_ref: "seg_029",
        why: "從天牢直接衝出",
        manifestation: "身後越來越遠的牢門與追兵吼聲",
      },
    ],
  },
  {
    key: "seg_031",
    start: "【圖 31–34 — 大殿對峙】",
    end: "> 鬼將們齊聲低吼",
    kind: "action",
    split: "location_change",
    loc: "loc_great_hall",
    chars: ["char_momo", "char_oni_soldier"],
    props: ["prop_katana"],
    context: "大殿內火把沿牆點到穹頂，穿甲鬼武士排出半圓；桃緩步走進中央。",
    visual: "巨大穹頂、黑木樑、兩排鬼武士、桃小小的身影走進火光中央。",
    continuity: "把「攻城」推到最後的儀式性對峙。",
    voice: "none",
    speaker: null,
    spoken: null,
    outfits: {
      char_momo: OUTFITS.MOMO_BATTLE,
      char_oni_soldier: OUTFITS.ONI_SOLDIER_ARMOR,
    },
    sound:
      "Continuous 35mm optical film hiss, cavernous hall room tone, torch flames swaying, armour shifting, her sandals on stone.",
    voicePrompt: null,
    sync:
      "Purely environmental sound; every mouth closed, zero speech.",
    refs: [],
  },
  {
    key: "seg_032",
    start: "> 鬼將們齊聲低吼",
    end: "> 一隻如山的身影從王座上站起",
    kind: "dialogue",
    split: "voice_change",
    loc: "loc_great_hall",
    chars: ["char_momo", "char_oni_soldier"],
    props: ["prop_katana"],
    context: "鬼將齊聲低吼，桃拔刀，對鬼王說「我要你做人」。",
    visual: "桃在火光中央拔刀，刀鋒映火；半圓鬼武士壓迫如山。",
    continuity: "全片主題句：不是殺鬼，是把鬼變回人。",
    voice: "spoken_on_screen",
    speaker: "char_momo",
    spoken: "『鬼王——我要你做人。』",
    outfits: {
      char_momo: OUTFITS.MOMO_BATTLE,
      char_oni_soldier: OUTFITS.ONI_SOLDIER_ARMOR,
    },
    sound:
      "Hall hush, many armoured bodies shifting, a blade drawing, a low collective oni growl.",
    voicePrompt:
      "Young Japanese woman, clear defiant declaration, close-mic, no shout",
    sync:
      "Momo's mouth moves with the line; the oni soldiers only growl.",
    refs: [],
  },
  {
    key: "seg_033",
    start: "> 一隻如山的身影從王座上站起",
    end: "【圖 35 — 斬落】",
    kind: "action",
    split: "focus_change",
    loc: "loc_throne_dais",
    chars: ["char_momo", "char_oni_king"],
    props: ["prop_greatsword"],
    context: "如山的身影從王座站起：黑甲、雙角、赤眼；整個大殿的重量壓在那道目光上。",
    visual: "低角度、王座、巨鬼站起、巨劍拖出火花；桃在前景顯得極小但不退。",
    continuity: "把最終敵人的尺度拉到最大。",
    voice: "none",
    speaker: null,
    spoken: null,
    outfits: {
      char_momo: OUTFITS.MOMO_BATTLE,
      char_oni_king: OUTFITS.ONI_KING_ARMOR,
    },
    sound:
      "Continuous 35mm film hiss, a colossal sub-bass room rumble, black plate armour groaning, the throne scraping stone, brazier fire roaring.",
    voicePrompt: null,
    sync:
      "No voice; the oni king's mouth stays closed, only armour and fire.",
    refs: [],
  },
  {
    key: "seg_034",
    start: "【圖 35 — 斬落】",
    end: "【圖 36 — 勝利】",
    kind: "dialogue",
    split: "focus_change",
    loc: "loc_great_hall",
    chars: ["char_momo", "char_oni_king"],
    props: ["prop_katana", "prop_greatsword"],
    context: "巨劍砸下，桃的刀刃逆勢由下往上斬開；鬼王倒下，她單膝落地說「你負責睡一覺」。",
    visual: "交錯的一瞬、上升的刀弧、鐵甲砸地；桃單膝著地、刀尖滴血。",
    continuity: "把主題付諸行動：她負責帶人回去，鬼王負責睡一覺。",
    voice: "spoken_on_screen",
    speaker: "char_momo",
    spoken: "『……我負責帶人回去。你負責，睡一覺。』",
    outfits: {
      char_momo: OUTFITS.MOMO_BATTLE,
      char_oni_king: OUTFITS.ONI_KING_ARMOR,
    },
    sound:
      "A groaning rush of air, the shock ring of steel, a rolling crash of armour on stone, then her ragged breathing.",
    voicePrompt:
      "Young Japanese woman, exhausted and quiet, close-mic, almost gentle",
    sync:
      "Momo's mouth moves with the line; the fallen king does not speak.",
    refs: [
      {
        segment_ref: "seg_033",
        why: "承接鬼王起身的壓迫",
        manifestation: "從上方砸下的巨劍與逆勢上斬的刀弧",
      },
    ],
  },
  {
    key: "seg_035",
    start: "【圖 36 — 勝利】",
    end: "【圖 37 — 戰後】",
    kind: "dialogue",
    split: "focus_change",
    loc: "loc_great_hall",
    chars: ["char_momo", "char_shiro"],
    props: ["prop_king_banner", "prop_katana"],
    context: "大殿靜下來，桃站在鬼王身上，刀尖挑起鬼王黑幡；柴犬長吠，她低聲說「婆婆，我回來囉」。",
    visual: "勝利構圖、黑幡「鬼王」、刀尖滴血、柴犬在腳邊長吠。",
    continuity: "戰役結束，情緒轉向返家。",
    voice: "spoken_on_screen",
    speaker: "char_momo",
    spoken: "『婆婆——我回來囉。』",
    outfits: {
      char_momo: OUTFITS.MOMO_BATTLE,
      char_shiro: OUTFITS.SHIRO_RED,
    },
    sound:
      "Dead quiet after the crash, a long dog howl, armour settling, embers popping, a barely audible tender breath.",
    voicePrompt:
      "Young Japanese woman, almost inaudible tender whisper, close-mic",
    sync:
      "Momo's lips barely move; the dog howls, no human voice.",
    refs: [],
  },
  {
    key: "seg_036",
    start: "【圖 37 — 戰後】",
    end: "【圖 01 — 片尾】",
    kind: "dialogue",
    split: "location_change",
    loc: "loc_courtyard_dawn",
    chars: ["char_momo", "char_akita"],
    props: [],
    context: "天亮前火還在燒，桃蹲下捧住秋田犬的下頷，說打完仗的人都要回家，然後決定回家。",
    visual: "廢墟庭院、餘燼、桃衣角乾血、大狗毛上泥血；她一下一下撫著狗。",
    continuity: "把「家」從婆婆擴大到所有打完仗的人；片尾返家。",
    voice: "spoken_on_screen",
    speaker: "char_momo",
    spoken:
      "「……你也想家吧。打完仗的人，都是要回家的。」\n「那我們也回家吧。回去泡婆婆的湯，回去坐在桃樹下，把這趟『旅の記録』講成整整三天三夜都講不完的故事。」",
    outfits: {
      char_momo: OUTFITS.MOMO_BATTLE,
      char_akita: OUTFITS.AKITA_NATURAL,
    },
    sound:
      "Ember crackle, her hand against matted fur, a low long dog whine, morning wind over broken walls.",
    voicePrompt:
      "Young Japanese woman, soft warm whisper, close-mic, tearful but smiling",
    sync:
      "Momo's mouth moves gently with her lines; the dog only whines.",
    refs: [
      {
        segment_ref: "seg_027",
        why: "木匣裡的舊屋畫布讓她終於理解「家」",
        manifestation: "她按在胸口的那塊布與眼前無家可歸的狗",
      },
    ],
  },
  {
    key: "seg_037",
    start: "【圖 01 — 片尾】",
    end: "> 片尾字卡：",
    kind: "dialogue",
    split: "time_shift",
    loc: "loc_dock",
    chars: ["char_momo", "char_shiro"],
    props: [],
    context: "片尾回到開頭木欄邊，桃對鏡頭外的某個人說「鬼退治のあとで」，然后推開鏡頭。",
    visual: "同一張木欄邊，桃下巴擱在飯糰上，柴犬鼻子靠近鏡頭；她伸懶腰，緞帶晃動。",
    continuity: "與片頭形成閉環：打完鬼之後，她還是那個會對鏡頭笑的人。",
    voice: "spoken_on_screen",
    speaker: "char_momo",
    spoken:
      "「鬼退治のあとで。」\n「勝ったけど、ちょっと疲れた。」\n「まだ撮るの？收了啦——」\n「また、どこかへ♡」",
    outfits: { char_momo: OUTFITS.MOMO_REST, char_shiro: OUTFITS.SHIRO_PLAIN },
    sound:
      "Warm dusk village ambience, wooden railing creak, a contented sigh, the dog's nose bumping the lens, projector hum returning.",
    voicePrompt:
      "Young Japanese woman, tired but playful, close-mic, laughing under the words",
    sync:
      "Momo's mouth moves with her lines; the dog only nudges the lens.",
    refs: [
      {
        segment_ref: "seg_001",
        why: "片尾直接回到片頭同一顆鏡頭",
        manifestation: "同一張木欄、同一顆飯糰、同一隻把鼻子湊近鏡頭的柴犬",
      },
    ],
  },
  {
    key: "seg_038",
    start: "> 片尾字卡：",
    end: "\n\n---\n\n## 4. 一句話主題",
    kind: "narration",
    split: "voice_change",
    loc: "loc_endcard",
    chars: [],
    props: [],
    context: "片尾字卡：新たな冒険は、まだ終わっていない。",
    visual: "黑底、投影機顆粒、書法標題「新·桃太娘」與片尾句。",
    continuity: "把「冒險未完」留成開放式收尾。",
    voice: "narrator",
    speaker: null,
    spoken: "「新たな冒険は、まだ終わっていない。」",
    outfits: {},
    sound:
      "Non-diegetic narrator over a warm projector hum and a single sustained piano chord.",
    voicePrompt:
      "Measured Japanese narrator, warm and cinematic, soft finality",
    sync:
      "No faces on screen; text card only, no lip sync.",
    refs: [
      {
        segment_ref: "seg_002",
        why: "與片頭旁白同一句式的收束",
        manifestation: "黑底字卡上的同一句「新たな冒険は、まだ終わっていない。」",
      },
    ],
  },
];
