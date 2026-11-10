// Plan-stage segments. `start`/`end` are exact substrings of doc/story.md;
// the builder turns them into source slices and verifies the join + sha256.
export const OUTFITS = {
  MOMO_TRAVEL:
    "Weathered cream sleeveless kimono-style tunic with peach motifs, short rust-red haori vest, dark sash with a peach pouch, red-and-black corded arm wraps, strappy straw sandals, katana at the left hip",
  MOMO_REST:
    "Loose cream yukata with red floral patterns, red ribbon in her ponytail, bare feet",
  MOMO_POSTER:
    "Sleeveless reddish-brown vest over a white under-layer, short layered pale skirt, dark leather arm bracers with red lacing, katana at the left hip",
  MOMO_BATTLE:
    "Torn cream and rust sleeveless warrior outfit, dirt and blood stains, red ribbon, dark leather bracers, katana at the left hip",
  MOMO_WET:
    "Cream sleeveless tunic soaked at the shoulders, short rust vest, red ribbon, bare arms",
  SHIRO_BLUE: "Blue patterned saddlecloth with a peach emblem",
  SHIRO_RED: "Small red leather armor vest with a red neck scarf",
  SHIRO_PLAIN: "No saddle, natural tan and cream coat",
  GON_SCARF: "Red cloth scarf, small woven travel pack",
  GON_PLAIN: "Red cloth scarf",
  PEACH_PLAIN: "No outfit",
  GRANDMA_KIMONO:
    "Dark indigo kimono with a subdued weave pattern, wide sleeves, wooden geta",
  KIHA_WORK:
    "Mud-stained dark work kimono, rope belt, cloth headband, bare feet",
  GENZO_RAGS:
    "Tattered grey prison robe, bare scarred hands, iron shackles",
  ONI_KING_ARMOR:
    "Massive black iron plate armor with shoulder spikes, twin black horns, no helmet",
  ONI_GENERAL_ARMOR:
    "Heavy dark iron armor over red skin, twin horns, spiked club",
  ONI_CUB_ARMOR: "Small leather armor vest, short horns, long spear",
  ONI_SOLDIER_ARMOR:
    "Dark leather and iron scrap armor, short horns, torch or spear",
  AKITA_NATURAL: "Matted brown and white fur, mud and dried blood",
  VILLAGER_WORK: "Dark work clothes, straw hat, bare arms",
};

export const SEGMENTS = [
  {
    key: "seg_001",
    start: "【圖 01 — 片頭預告】",
    end: "> 旁白（畫外）：",
    kind: "dialogue",
    split: "chapter_start",
    loc: "loc_dock",
    chars: ["char_momo", "char_shiro"],
    props: [],
    context:
      "片頭：桃坐在木欄邊吃飯糰，柴犬把鼻子湊到鏡頭前；她對著鏡頭說話，疲憊但滿足。",
    visual:
      "手持近景，暖色黃昏光，桃的馬尾鬆了但紅緞帶仍繫著，柴犬佔左前景。",
    continuity: "建立桃的直接對鏡頭語氣與「拍片」框架，片尾會回到同一顆鏡頭。",
    voice: "spoken_on_screen",
    speaker: "char_momo",
    spoken:
      "「鬼退治のあとで……就是說，打完鬼以後囉。」\n「勝ったけど、ちょっと疲れた。」\n「まだ撮るの？」\n「また、どこかへ♡」",
    outfits: { char_momo: OUTFITS.MOMO_REST, char_shiro: OUTFITS.SHIRO_PLAIN },
    sound:
      "Warm dusk village ambience, wooden railing creak, soft chewing, the dog's wet breathing close to the lens, a distant film-projector hum.",
    voicePrompt:
      "Young Japanese woman, warm and tired but playful, close-mic, natural Japanese, slight smile in the voice",
    sync:
      "Her mouth moves with the Japanese lines; the dog only pants, no human voice from the dog.",
    refs: [],
  },
  {
    key: "seg_002",
    start: "> 旁白（畫外）：",
    end: "【圖 02 — 主視覺海報】",
    kind: "narration",
    split: "voice_change",
    loc: "loc_dock",
    chars: ["char_momo"],
    props: [],
    context: "畫外旁白把片頭訪談收束成片名與主視覺。",
    visual: "畫面由木欄邊溶接成 90s 復古海報，桃側身按刀，書法標題在背後。",
    continuity: "從「拍片現場」轉成「電影海報」，宣告故事開始。",
    voice: "narrator",
    speaker: null,
    spoken: "「新たな冒険は、まだ終わっていない——『新·桃太娘』。」",
    outfits: { char_momo: OUTFITS.MOMO_POSTER },
    sound:
      "Non-diegetic narrator over a warm analog room tone; the projector hum rises as the poster locks up.",
    voicePrompt:
      "Measured Japanese narrator, warm and cinematic, broadcast-clear, slightly nostalgic",
    sync: "No on-screen mouth movement; the poster is a still title card.",
    refs: [
      {
        segment_ref: "seg_001",
        why: "片頭訪談直接變成海報標語",
        manifestation: "海報上以書法寫出的「鬼退治のあとで。」字樣",
      },
    ],
  },
  {
    key: "seg_003",
    start: "【圖 02 — 主視覺海報】",
    end: "【圖 03 — 碼頭／伙伴齊聚】",
    kind: "action",
    split: "focus_change",
    loc: "loc_dock",
    chars: ["char_momo"],
    props: ["prop_katana"],
    context: "主視覺海報定格，鏡頭緩推，確立桃的英雄形象。",
    visual: "海報細節：眼神、刀柄、桃紋、書法標題；印刷顆粒與投影機閃爍。",
    continuity: "把片頭的手持感收成正式主視覺，情緒由疲憊轉為堅定。",
    voice: "none",
    speaker: null,
    spoken: null,
    outfits: { char_momo: OUTFITS.MOMO_POSTER },
    sound:
      "Continuous 35mm optical film projector hiss, warm analog room tone, a faint paper texture rustle as the poster holds.",
    voicePrompt: null,
    sync: "Purely mechanical and environmental sound; no voice, lips closed.",
    refs: [
      {
        segment_ref: "seg_002",
        why: "延續旁白鎖定的海報",
        manifestation: "同一張主視覺海報的細節特寫",
      },
    ],
  },
  {
    key: "seg_004",
    start: "【圖 03 — 碼頭／伙伴齊聚】",
    end: "【圖 04 — 出發前夜·伸展】",
    kind: "dialogue",
    split: "location_change",
    loc: "loc_dock",
    chars: ["char_momo", "char_shiro", "char_gon", "char_peach"],
    props: ["prop_travel_orb"],
    context: "晴天木碼頭，桃與犬、猿、雉齊聚；她手上的白球寫著「旅」。",
    visual: "桃盤腿坐在碼頭邊，柴犬吐舌，猴從她頭後探出，雉停在肩上；背景有酒桶、破桃旗與閃亮海面。",
    continuity: "建立四人（加雉）旅行小隊的構圖與各自位置。",
    voice: "spoken_on_screen",
    speaker: "char_momo",
    spoken:
      "「大家都到齊了吧？」\n『……那個球，可以寫「食」嗎。』\n「寫著『旅』才有意義嘛。走吧——我們的旅行，才不是為了吃。」",
    outfits: {
      char_momo: OUTFITS.MOMO_TRAVEL,
      char_shiro: OUTFITS.SHIRO_BLUE,
      char_gon: OUTFITS.GON_SCARF,
      char_peach: OUTFITS.PEACH_PLAIN,
    },
    sound:
      "Bright seaside ambience, waves against pilings, seagulls, flag fabric snapping, the dog's happy panting.",
    voicePrompt:
      "Young Japanese woman, bright teasing tone; a small boyish monkey voice, curious and deadpan",
    sync:
      "Momo and Gon move their mouths with their own lines; Shiro pants, Peach only chirps.",
    refs: [],
  },
  {
    key: "seg_005",
    start: "【圖 04 — 出發前夜·伸展】",
    end: "【圖 05 — 拜別婆婆】",
    kind: "dialogue",
    split: "paragraph_break",
    loc: "loc_veranda",
    chars: ["char_momo"],
    props: ["prop_bundle"],
    context: "出發前夜，桃在木廊上伸展，說出對未知地方的期待。",
    visual: "午後木廊，桃一手高舉過頭伸懶腰，紅緞帶晃動，行囊在旁。",
    continuity: "從碼頭的熱鬧轉為獨處的柔軟，補上她「想去看世界」的動機。",
    voice: "spoken_on_screen",
    speaker: "char_momo",
    spoken: "「明天開始，就要去很多很多沒見過的地方了。」",
    outfits: { char_momo: OUTFITS.MOMO_TRAVEL },
    sound:
      "Quiet afternoon veranda, distant birds, leaves rustling, light cotton stretch, a soft exhale.",
    voicePrompt:
      "Young Japanese woman, soft dreamy tone, close-mic, a small smile",
    sync: "Her mouth moves gently with the line; no other voice.",
    refs: [],
  },
  {
    key: "seg_006",
    start: "【圖 05 — 拜別婆婆】",
    end: "【圖 06 — 出發】",
    kind: "dialogue",
    split: "location_change",
    loc: "loc_village_gate",
    chars: ["char_momo", "char_grandma"],
    props: [],
    context: "村口拜別：桃單膝跪地，向婆婆說出一直想說的話。",
    visual: "黃昏村口，桃跪在泥地上，婆婆站在屋簷下；背後是桃太郎旗、石階與遠山。",
    continuity: "全片的「家」第一次具體出現，後段木匣與返家都回指這裡。",
    voice: "spoken_on_screen",
    speaker: "char_momo",
    spoken:
      "「婆婆……那句話，我一直想說。」\n「坐在桃樹下等我回來的孩子啊。」\n『我會好好活著回來。活著回來，聽你罵我怎麼搞得到處都是泥。』",
    outfits: {
      char_momo: OUTFITS.MOMO_TRAVEL,
      char_grandma: OUTFITS.GRANDMA_KIMONO,
    },
    sound:
      "Rural village ambience, wind through leaves, banner flapping, a distant dog bark, soft dirt underfoot.",
    voicePrompt:
      "Young Japanese woman, shy then earnest; an aged gentle Japanese grandmother, warm and frayed",
    sync:
      "Momo and Grandma move their mouths with their own lines; no narration.",
    refs: [],
  },
  {
    key: "seg_007",
    start: "【圖 06 — 出發】",
    end: "【圖 07 — 背上行囊】",
    kind: "dialogue",
    split: "paragraph_break",
    loc: "loc_village_gate",
    chars: ["char_momo", "char_grandma", "char_shiro"],
    props: ["prop_bundle"],
    context: "桃背上行囊上路，婆婆在屋簷下大聲叮嚀。",
    visual: "桃在山路上回頭，婆婆在門口揮手；樹影、石階、遠山都照成暖金色。",
    continuity: "把告別推到行動：她真的走了。",
    voice: "spoken_on_screen",
    speaker: "char_grandma",
    spoken: "「衣服破了自己補！別忘了帶飯糰！」\n「知道啦——！」",
    outfits: {
      char_momo: OUTFITS.MOMO_TRAVEL,
      char_grandma: OUTFITS.GRANDMA_KIMONO,
      char_shiro: OUTFITS.SHIRO_BLUE,
    },
    sound:
      "Golden-hour countryside, wind through paddy and bamboo, footsteps on dirt, a voice carried across the distance.",
    voicePrompt:
      "Aged Japanese grandmother calling out, fond and scolding; young woman calling back, laughing",
    sync:
      "Grandma calls from the doorway, Momo turns her head to answer; both mouths move with their own lines.",
    refs: [],
  },
  {
    key: "seg_008",
    start: "【圖 07 — 背上行囊】",
    end: "【圖 08 — 神社喝水】",
    kind: "dialogue",
    split: "focus_change",
    loc: "loc_mountain_trail",
    chars: ["char_momo", "char_shiro"],
    props: ["prop_bundle"],
    context: "桃在路邊蹲下摸柴犬的頭，把行囊綁妥，宣告四人之旅。",
    visual: "山路近景，柴犬戴藍色鞍布仰頭，桃摸牠的頭；桃紋行囊與桃太郎旗在背上。",
    continuity: "把「旅」從口號變成具體的同行關係。",
    voice: "spoken_on_screen",
    speaker: "char_momo",
    spoken:
      "「接下來就是我們四個人的旅途了。寫一篇讓婆婆也看得懂的『旅の記録』吧。」",
    outfits: {
      char_momo: OUTFITS.MOMO_TRAVEL,
      char_shiro: OUTFITS.SHIRO_BLUE,
    },
    sound:
      "Forest path ambience, leaves, a dog's soft tail wag against cloth, a bundle strap creaking.",
    voicePrompt:
      "Young Japanese woman, affectionate and steady, close-mic",
    sync: "Her mouth moves with the line; the dog only looks up.",
    refs: [],
  },
  {
    key: "seg_009",
    start: "【圖 08 — 神社喝水】",
    end: "【圖 09 — 溪谷早餐】",
    kind: "dialogue",
    split: "location_change",
    loc: "loc_shrine",
    chars: ["char_momo", "char_shiro", "char_gon", "char_peach"],
    props: ["prop_gourd", "prop_basket"],
    context: "神社石階休息：桃喝水，ゴン偷咬飯糰，ピーチ放哨。",
    visual: "桃坐在石沿，雙手捧大葫蘆仰頭喝水；柴犬伏左，猴蹲右啃飯糰，雉停石燈籠。",
    continuity: "建立旅途的日常節奏與三個伙伴各自的性格。",
    voice: "spoken_on_screen",
    speaker: "char_momo",
    spoken:
      "『啊——活過來了。ゴン，你為什麼每顆飯糰都要先偷咬一口。』\n『……試毒。』",
    outfits: {
      char_momo: OUTFITS.MOMO_TRAVEL,
      char_shiro: OUTFITS.SHIRO_BLUE,
      char_gon: OUTFITS.GON_SCARF,
      char_peach: OUTFITS.PEACH_PLAIN,
    },
    sound:
      "Shrine hush, trickling stone-spout water, cicadas, a long satisfied gulp, a monkey's soft crunch.",
    voicePrompt:
      "Young Japanese woman, relieved and teasing; small boyish monkey voice, utterly deadpan",
    sync:
      "Momo and Gon move their mouths with their own lines; the dog and pheasant do not speak.",
    refs: [],
  },
  {
    key: "seg_010",
    start: "【圖 09 — 溪谷早餐】",
    end: "【圖 10 — 對地圖的決心】",
    kind: "dialogue",
    split: "paragraph_break",
    loc: "loc_stream",
    chars: ["char_momo", "char_shiro", "char_gon", "char_peach"],
    props: ["prop_basket"],
    context: "溪邊洗臉休息，桃說水甜風也甜，ピーチ叫了一聲附和。",
    visual: "淺溪、長苔石頭、竹籃米糕；桃蹲在溪邊掬水，柴犬嗅籃子，雉在巨石上。",
    continuity: "旅途的短暫喘息，下一段就轉進鬼島的決心。",
    voice: "spoken_on_screen",
    speaker: "char_momo",
    spoken:
      "「走了一上午，在這裡歇一下吧。水是甜的，風也是甜的。」\n「咕咕——！」\n「你看，連ピーチ都說好。」",
    outfits: {
      char_momo: OUTFITS.MOMO_TRAVEL,
      char_shiro: OUTFITS.SHIRO_BLUE,
      char_gon: OUTFITS.GON_SCARF,
      char_peach: OUTFITS.PEACH_PLAIN,
    },
    sound:
      "Stream ambience, small waterfall, water drips, a pheasant's two-note call, soft cloth.",
    voicePrompt:
      "Young Japanese woman, refreshed and light; the pheasant call is a bird call, not a voice",
    sync:
      "Momo's mouth moves with her lines; Peach only calls, no human voice.",
    refs: [],
  },
  {
    key: "seg_011",
    start: "【圖 10 — 對地圖的決心】",
    end: "【圖 11 — 山徑指路】",
    kind: "dialogue",
    split: "location_change",
    loc: "loc_inn_veranda",
    chars: ["char_momo", "char_shiro", "char_gon", "char_peach"],
    props: ["prop_map", "prop_travel_guide"],
    context: "客棧簷廊攤開舊地圖，桃的指尖落在鬼ヶ島的紅叉上，決定先去救人也回家。",
    visual: "低矮簷廊、強烈陽光、舊地圖與《旅の手引》；桃、柴犬、猴、雉圍著地圖。",
    continuity: "全片目標正式確立：先去鬼ヶ島，再回來。",
    voice: "spoken_on_screen",
    speaker: "char_momo",
    spoken:
      "「婆婆說，我的『桃』和鬼島的那些人一樣，都是從『別的地方』來的。」\n「汪。」\n「……那就決定啦。先去鬼ヶ島，看看那些被關起來的人。然後——再回來。」",
    outfits: {
      char_momo: OUTFITS.MOMO_TRAVEL,
      char_shiro: OUTFITS.SHIRO_BLUE,
      char_gon: OUTFITS.GON_SCARF,
      char_peach: OUTFITS.PEACH_PLAIN,
    },
    sound:
      "Inn veranda in hard sunlight, wind, distant village, a single confident dog bark, parchment rustle.",
    voicePrompt:
      "Young Japanese woman, thoughtful then resolved, close-mic",
    sync:
      "Momo moves her mouth with her lines; the dog barks once, no human voice.",
    refs: [
      {
        segment_ref: "seg_006",
        why: "婆婆說過她的來歷，這裡第一次把身世連到鬼島",
        manifestation: "地圖上被指尖壓住的鬼ヶ島紅叉",
      },
    ],
  },
  {
    key: "seg_012",
    start: "【圖 11 — 山徑指路】",
    end: "【圖 12 — 桃太郎の湯】",
    kind: "dialogue",
    split: "location_change",
    loc: "loc_mountain_trail",
    chars: ["char_momo", "char_shiro", "char_gon"],
    props: ["prop_bundle"],
    context: "山徑路標寫著「鬼ヶ島 →」，桃拍著木牌回頭笑，隊伍往海邊出發。",
    visual: "陽光山徑、藍海、路標；柴犬背馱包、猴背行李排成一列。",
    continuity: "把決心變成腳步，往海邊移動。",
    voice: "spoken_on_screen",
    speaker: "char_momo",
    spoken:
      "「出發！」\n「（小小聲）……你連島長什麼樣都不知道。」\n「所以才更要去看看啊！」",
    outfits: {
      char_momo: OUTFITS.MOMO_TRAVEL,
      char_shiro: OUTFITS.SHIRO_BLUE,
      char_gon: OUTFITS.GON_SCARF,
    },
    sound:
      "Mountain trail wind, seabirds, footsteps on gravel, a pack strap creaking.",
    voicePrompt:
      "Young Japanese woman, bright and stubborn; small boyish monkey voice, muttering",
    sync:
      "Momo and Gon move their mouths with their own lines; Shiro only trots.",
    refs: [],
  },
  {
    key: "seg_013",
    start: "【圖 12 — 桃太郎の湯】",
    end: "【圖 13 — 旅館夜宴】",
    kind: "dialogue",
    split: "location_change",
    loc: "loc_onsen",
    chars: ["char_momo", "char_shiro", "char_gon"],
    props: [],
    context: "露天溫泉「桃太郎の湯」：桃泡湯，ゴン提醒前面就是鬼島。",
    visual: "蒸氣、木牌、石池；桃曲膝泡在水裡，猴趴在池沿，柴犬穿小綠背心泡到想睡。",
    continuity: "用一個喜劇喘息段把遠航前的緊張壓下來。",
    voice: "spoken_on_screen",
    speaker: "char_momo",
    spoken:
      "『哇——好舒服。這就是『いい湯、いい島』吧。』\n『喂，前面就是鬼島了，你還有心情泡湯喔。』\n『就是了鬼島才要泡。把力氣存好，明天好上路。』",
    outfits: {
      char_momo: OUTFITS.MOMO_WET,
      char_shiro: OUTFITS.SHIRO_PLAIN,
      char_gon: OUTFITS.GON_PLAIN,
    },
    sound:
      "Hot spring lapping, steam hush, a wooden sign creaking, a sleepy dog sigh.",
    voicePrompt:
      "Young Japanese woman, blissful and lazy; small boyish monkey voice, flat and unimpressed",
    sync:
      "Momo and Gon move their mouths with their own lines; Shiro only dozes.",
    refs: [],
  },
  {
    key: "seg_014",
    start: "【圖 13 — 旅館夜宴】",
    end: "【圖 14 — 房內夜談·牌局】",
    kind: "dialogue",
    split: "location_change",
    loc: "loc_inn_night",
    chars: ["char_momo", "char_shiro", "char_gon"],
    props: ["prop_fish"],
    context: "夜晚旅館飯桌，桃夾烤魚對鏡頭獻寶，ゴン吐槽她講第三遍。",
    visual: "燈籠搖曳、地魚の炭火焼；桃眨眼獻魚，柴犬繫小兜兜，猴的手伸向下一碟。",
    continuity: "把伙伴關係從「隊友」寫成「家人式的吐槽」。",
    voice: "spoken_on_screen",
    speaker: "char_momo",
    spoken:
      "「這是今天的收穫！一口咬下去，海的味道——」\n「（帶著魚）你已經講第三遍了。」",
    outfits: {
      char_momo: OUTFITS.MOMO_REST,
      char_shiro: OUTFITS.SHIRO_BLUE,
      char_gon: OUTFITS.GON_SCARF,
    },
    sound:
      "Lantern-lit inn, soft chatter, chopstick clinks, charcoal grill crackle, a dog licking its chops.",
    voicePrompt:
      "Young Japanese woman, playful presenter voice; small boyish monkey voice, mouth full and bored",
    sync:
      "Momo and Gon move their mouths with their own lines; Shiro only watches the fish.",
    refs: [],
  },
  {
    key: "seg_015",
    start: "【圖 14 — 房內夜談·牌局】",
    end: "【圖 15 — 染血的鬼旗】",
    kind: "dialogue",
    split: "focus_change",
    loc: "loc_inn_room",
    chars: ["char_momo", "char_shiro", "char_gon"],
    props: ["prop_cards"],
    context: "客房榻榻米上玩牌，桃許下四個人一起去看更大的海的約定。",
    visual: "桃趴著、腳丫在空中晃，手捏桃花牌；猴舉牌，柴犬趴在旁。",
    continuity: "把「勝利後一起回家」的承諾先種下，決戰與片尾都要回收。",
    voice: "spoken_on_screen",
    speaker: "char_momo",
    spoken:
      "「說好囉——去鬼ヶ島，把該救的人救回來，然後我們四個就一起去看更大的海。」\n「汪。」\n『要是鬼王很兇呢？』\n「那就打贏他，再回來泡湯。」",
    outfits: {
      char_momo: OUTFITS.MOMO_REST,
      char_shiro: OUTFITS.SHIRO_BLUE,
      char_gon: OUTFITS.GON_SCARF,
    },
    sound:
      "Tatami room hush, paper-screen rustle, cards flicked onto straw, a lantern wick ticking.",
    voicePrompt:
      "Young Japanese woman, playful then sincere; small boyish monkey voice, worried",
    sync:
      "Momo and Gon move their mouths with their own lines; the dog barks once.",
    refs: [],
  },
  {
    key: "seg_016",
    start: "【圖 15 — 染血的鬼旗】",
    end: "【圖 16 — 鬼ヶ島へ出発】",
    kind: "dialogue",
    split: "location_change",
    loc: "loc_warehouse",
    chars: ["char_momo", "char_kiha", "char_shiro", "char_gon"],
    props: ["prop_oni_banner"],
    context: "村長倉房，喜八抖開染血鬼面旗，說出鬼ヶ島其實是鬼王的城堡。",
    visual: "火盆光、長影、掛軸「鬼ヶ島」；喜八滿身泥指著旗，桃蹲在旗前第一次沉下臉。",
    continuity: "全片基調由明亮冒險轉為沉重遠征；桃借走鬼旗。",
    voice: "spoken_on_screen",
    speaker: "char_kiha",
    spoken:
      "「老夫年輕時跟著船朝北走，被浪打上鬼ヶ島。那島啊——根本不是島，是『城堡』。島中央有座山，山頂像顆骷髏。鬼王把山下的人都關進籠子裡，替他搬石頭。」\n「那島上的人……都還在嗎？」\n『只要你還活著一只，就都還在。老夫是游水回來的，全村只有老夫一個人回來。』\n「這面旗，我借了。回來再還你。」",
    outfits: {
      char_momo: OUTFITS.MOMO_TRAVEL,
      char_kiha: OUTFITS.KIHA_WORK,
      char_shiro: OUTFITS.SHIRO_BLUE,
      char_gon: OUTFITS.GON_SCARF,
    },
    sound:
      "Brazier crackle, rough whisper of old cloth, a heavy silence after Kiha's words, distant night wind.",
    voicePrompt:
      "Old Japanese fisherman, rustic formal speech, gravelly and grave; young woman, quiet and steady",
    sync:
      "Kiha and Momo move their mouths with their own lines; no narration.",
    refs: [
      {
        segment_ref: "seg_015",
        why: "上一段的輕鬆牌局被這面旗打斷",
        manifestation: "火盆旁突然抖開的染血鬼面旗",
      },
    ],
  },
  {
    key: "seg_017",
    start: "【圖 16 — 鬼ヶ島へ出発】",
    end: "【圖 17 — 海上·望見鬼島】",
    kind: "dialogue",
    split: "location_change",
    loc: "loc_harbor",
    chars: ["char_momo", "char_shiro", "char_gon", "char_villager"],
    props: ["prop_oni_sail"],
    context: "出航港口，村民笑他們四個人能做什麼，桃大聲說我們有五個。",
    visual: "擠滿小船的港口、布幕「鬼ヶ島へ出発」、白色鬼面帆升起；桃坐在船舷回頭笑。",
    continuity: "把「五個人」的定義說出來：四個伙伴加上門口的婆婆。",
    voice: "spoken_on_screen",
    speaker: "char_villager",
    spoken:
      "「小桃！就你們四個能幹嘛！」\n『我們有五個！シロ、ゴン、ピーチ，還有我——加上婆婆在門口看著呢！』",
    outfits: {
      char_momo: OUTFITS.MOMO_TRAVEL,
      char_shiro: OUTFITS.SHIRO_BLUE,
      char_gon: OUTFITS.GON_SCARF,
      char_villager: OUTFITS.VILLAGER_WORK,
    },
    sound:
      "Bustling harbor, lapping water, rowdy crowd, canvas snapping, gulls.",
    voicePrompt:
      "Middle-aged Japanese fisherman, teasing shout; young woman, bright defiant shout",
    sync:
      "The villager shouts from the dock, Momo shouts back from the rail; both mouths move.",
    refs: [
      {
        segment_ref: "seg_016",
        why: "鬼旗上的鬼面變成船帆上的圖案",
        manifestation: "白色船帆上巨大的紅色鬼面",
      },
    ],
  },
  {
    key: "seg_018",
    start: "【圖 17 — 海上·望見鬼島】",
    end: "【圖 18 — 叢林遺跡】",
    kind: "dialogue",
    split: "focus_change",
    loc: "loc_sea",
    chars: ["char_momo", "char_shiro"],
    props: [],
    context: "海上望見骷髏山與冒煙鬼城，桃說她們是去把城拆下來的。",
    visual: "船尾、深藍海、遠方骷髏形山頂與黑城；桃的髮被風掃過臉，柴犬低吼。",
    continuity: "第一次讓鬼島完整入鏡，確定「攻城」的規模。",
    voice: "spoken_on_screen",
    speaker: "char_momo",
    spoken: "『……真的好像鬼。』\n『我知道。我們是去把那座城，拆下來的。』",
    outfits: {
      char_momo: OUTFITS.MOMO_TRAVEL,
      char_shiro: OUTFITS.SHIRO_RED,
    },
    sound:
      "Open sea wind, wave slap against the hull, rigging creak, one low long dog growl.",
    voicePrompt:
      "Young Japanese woman, hushed awe then hard resolve, close-mic against wind",
    sync:
      "Momo's mouth moves with her lines; the dog only growls, no human voice.",
    refs: [],
  },
  {
    key: "seg_019",
    start: "【圖 18 — 叢林遺跡】",
    end: "【圖 19 — 荊棘木門】",
    kind: "dialogue",
    split: "location_change",
    loc: "loc_jungle_ruins",
    chars: ["char_momo", "char_shiro", "char_gon"],
    props: [],
    context: "登島第二天，叢林遺跡裡出現發光的紅色腳印；桃判斷那是鬼的腳印。",
    visual: "墜落石柱、藤蔓長廊、明明滅滅的樹影；紅繩頭骨躺在腳邊，柴犬低伏嗅土。",
    continuity: "把鬼從傳說變成可追蹤的實體；跟蹤線開始。",
    voice: "spoken_on_screen",
    speaker: "char_momo",
    spoken:
      "『這些腳印……是那些被抓走的人留下的？不——太深了。這是鬼的腳印。』",
    outfits: {
      char_momo: OUTFITS.MOMO_TRAVEL,
      char_shiro: OUTFITS.SHIRO_RED,
      char_gon: OUTFITS.GON_SCARF,
    },
    sound:
      "Creeping jungle, dripping leaves, insect buzz, a low dog sniff, faint red-glow hum.",
    voicePrompt:
      "Young Japanese woman, low wary whisper, close-mic",
    sync:
      "Momo's lips move in a whisper; the dog and monkey only sniff and watch.",
    refs: [],
  },
];
