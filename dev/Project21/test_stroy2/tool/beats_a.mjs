// One block = one voice mode. A beat never mixes two speakers.
// `lines` are cleaned for TTS: no 「」『』：——, one sentence per line.
export const BEATS_A = [
  // seg_001 — opening railing
  {
    seg: "seg_001",
    slug: "railing_riceball",
    action:
      "Handheld close-up at the weathered dock railing: Momo sits with a rice ball at her lips, the Shiba's snout filling the left foreground in soft focus; warm dusk light, a tired but content smile, the red ribbon stirring.",
    facial: {
      char_momo: "Tired but content, cheeks full, eyes crinkling with a small smile",
      char_shiro: "Bright-eyed, panting softly, nose pushed toward the lens",
    },
    lines: [
      "鬼退治のあとで。",
      "つまり、鬼を倒したあとってことね。",
      "勝ったけど、ちょっと疲れた。",
    ],
    speaker: "char_momo",
  },
  {
    seg: "seg_001",
    slug: "railing_push_lens",
    action:
      "The camera nudges closer; Momo ducks her head away from the lens, laughing, then turns back and points at the camera; the red ribbon swings and the dog's nose bumps the glass.",
    facial: {
      char_momo: "Playful, laughing, eyes bright, one cheek still full",
      char_shiro: "Curious, ears forward, nose against the lens",
    },
    lines: ["まだ撮るの。", "また、どこかへ。"],
    speaker: "char_momo",
  },

  // seg_002 — narrator over the poster
  {
    seg: "seg_002",
    slug: "poster_narration",
    voice: "narrator",
    action:
      "The dock blurs into a 90s retro poster: Momo stands side-on, hand on the katana hilt, red ribbon and ponytail lifted by wind; bold brush calligraphy 新・桃太娘 and 鬼退治のあとで。 burn behind her, film grain and print texture.",
    facial: {
      char_momo: "Profile held still, determined, eyes forward",
    },
    lines: ["新たな冒険は、まだ終わっていない。", "新・桃太娘。"],
    refs: [["seg_001", "railing_push_lens"]],
  },

  // seg_003 — poster details, silent
  {
    seg: "seg_003",
    slug: "poster_detail",
    silent: true,
    secs: 5,
    action:
      "Slow push-in on the finished poster: Momo's determined profile, the katana hilt, the peach emblem, the black brush title 新・桃太娘; dust motes and projector flicker drift across the print.",
    facial: {
      char_momo: "Frozen heroic profile, eyes fixed ahead",
    },
    refs: [["seg_002", "poster_narration"]],
  },

  // seg_004 — dock roll call
  {
    seg: "seg_004",
    slug: "dock_roll_call",
    action:
      "Sunny wooden dock: Momo sits cross-legged at the edge holding a white orb marked 旅; Shiro pants beside her, Gon leans over her ponytail, Peach perched on her shoulder; barrels, a tattered peach flag, sparkling sea.",
    facial: {
      char_momo: "Bright, teasing, eyebrows raised",
      char_shiro: "Happy, tongue out",
      char_gon: "Innocent, hopeful, head tilted",
      char_peach: "Alert, watching the sea",
    },
    lines: ["みんな、そろってる？"],
    speaker: "char_momo",
    refs: [["seg_003", "poster_detail"]],
  },
  {
    seg: "seg_004",
    slug: "gon_food_ball",
    action:
      "Gon leans further over Momo's shoulder and taps the white orb with one finger, dead serious; Shiro's ears turn toward him, Peach ruffles its wings.",
    facial: {
      char_momo: "Caught off guard, mouth open",
      char_gon: "Innocent, hopeful, eyebrows lifted",
    },
    lines: ["その球、食って書いてもいい？"],
    speaker: "char_gon",
  },
  {
    seg: "seg_004",
    slug: "momo_travel_answer",
    action:
      "Momo hugs the orb, stands, and points it toward the open sea; Shiro and Gon scramble up, Peach flapping to her shoulder; the camera cranes with them.",
    facial: {
      char_momo: "Mock-stern, then grinning, chin up",
      char_shiro: "Excited, tail wagging",
      char_gon: "Sulky but following",
    },
    lines: [
      "旅って書いてこそ意味があるんだよ。",
      "行こう。",
      "俺たちの旅は、食べるためじゃないんだ。",
    ],
    speaker: "char_momo",
  },

  // seg_005 — veranda stretch
  {
    seg: "seg_005",
    slug: "veranda_stretch",
    action:
      "Late afternoon on the wooden veranda: Momo leans back with one arm stretched high overhead, eyes half closed, red ribbon swaying; warm sun rakes the slats, her travel bundle beside her.",
    facial: {
      char_momo: "Serene, dreamy, small smile, eyes half closed",
    },
    lines: ["明日から、知らない場所へ。", "たくさん歩いて、たくさん見るんだ。"],
    speaker: "char_momo",
  },

  // seg_006 — farewell at the village gate
  {
    seg: "seg_006",
    slug: "kneel_before_grandma",
    action:
      "Golden hour at the village entrance: Momo kneels on one knee before Grandma, head lowered; the 桃太郎 banner flaps behind them, thatched roofs and stone steps soft in the warm light.",
    facial: {
      char_momo: "Shy, earnest, eyes lowered",
      char_grandma: "Gentle, proud, eyes wet",
    },
    lines: ["おばあちゃん。", "ずっと言いたかったことがあるの。"],
    speaker: "char_momo",
  },
  {
    seg: "seg_006",
    slug: "grandma_peach_tree",
    action:
      "Grandma steps closer and rests a weathered hand on Momo's shoulder; the banner snaps once above them, and the last sun catches the grey in her hair.",
    facial: {
      char_momo: "Looking up, lips parted",
      char_grandma: "Soft, remembering, a sad smile",
    },
    lines: ["桃の木の下で、帰りを待っていた子だよ。"],
    speaker: "char_grandma",
  },
  {
    seg: "seg_006",
    slug: "momo_promise",
    action:
      "Momo lifts her face, voice steady; Grandma cups her cheek, then pulls her into a brief, fierce hug; the banner and the distant mountains blur behind them.",
    facial: {
      char_momo: "Determined, tears at the rim of her eyes",
      char_grandma: "Smiling through tears, holding on",
    },
    lines: [
      "ちゃんと生きて帰ってくるから。",
      "帰ってきたら、叱ってほしいの。",
      "泥だらけで何してるんだって。",
    ],
    speaker: "char_momo",
  },

  // seg_007 — the shout after her
  {
    seg: "seg_007",
    slug: "grandma_shout",
    action:
      "Momo walks the dirt path with her bundle, turning to call back; Grandma stands under the eaves waving hard, small against the thatched house; golden light, stone steps, distant mountains.",
    facial: {
      char_grandma: "Calling with a wide open mouth, fierce and fond",
      char_momo: "Half-turned, grinning",
    },
    lines: ["衣服破了自己補！", "別忘了帶飯糰！"],
    speaker: "char_grandma",
  },
  {
    seg: "seg_007",
    slug: "momo_calls_back",
    action:
      "Momo cups a hand beside her mouth and shouts back, then breaks into a run; Shiro bounds at her heels, the travel bundle bouncing.",
    facial: {
      char_momo: "Grinning, eyes squeezed with effort",
      char_shiro: "Joyful, ears back, running",
    },
    lines: ["知道啦。"],
    speaker: "char_momo",
  },

  // seg_008 — pat the dog
  {
    seg: "seg_008",
    slug: "pat_shiro",
    action:
      "Momo crouches on the mountain path and pats Shiro's head; the dog wears a blue saddlecloth, tail wagging; the peach-print bundle and 桃太郎 banner rise above her back, late sun through the trees.",
    facial: {
      char_momo: "Affectionate, soft, eyes on the dog",
      char_shiro: "Eyes bright, mouth open, tail blurred",
    },
    lines: [
      "これからは俺たち四人の旅だ。",
      "ばあちゃんにも分かるように。",
      "旅の記録を書いてみせよう。",
    ],
    speaker: "char_momo",
  },

  // seg_009 — shrine water
  {
    seg: "seg_009",
    slug: "shrine_drink",
    action:
      "Shrine stone ledge at midday: Momo lowers a large brown gourd from her lips with a satisfied sigh; Shiro lies at her left, Gon squats at her right with a half-bitten rice ball, Peach on a stone lantern; water trickles into a basin.",
    facial: {
      char_momo: "Relieved, eyes closed, then cutting sideways at Gon",
      char_shiro: "Lazy, content",
      char_gon: "Guileless, cheeks full",
      char_peach: "Watchful, perched high",
    },
    lines: [
      "あー、生き返った。",
      "ゴン、お前は毎回。",
      "どうして最初に一口齧るんだよ。",
    ],
    speaker: "char_momo",
  },
  {
    seg: "seg_009",
    slug: "gon_taste_test",
    action:
      "Gon chews with enormous dignity and swallows before answering; Momo stares at him, gourd forgotten in her hand.",
    facial: {
      char_momo: "Flat, unimpressed",
      char_gon: "Utterly deadpan, crumbs on his chin",
    },
    lines: ["毒見だ。"],
    speaker: "char_gon",
  },

  // seg_010 — stream rest
  {
    seg: "seg_010",
    slug: "stream_rest",
    action:
      "Shallow mountain stream: Momo crouches at the edge, cupping water to her face; Shiro sniffs a woven basket of rice cakes on mossy rocks; Peach on a boulder fluffs its wings.",
    facial: {
      char_momo: "Refreshed, eyes closed, water on her chin",
      char_shiro: "Curious, nose twitching",
      char_peach: "Proud, chest out",
    },
    lines: ["半日歩いたし、ここで休もう。", "水も甘いし、風も甘い。"],
    speaker: "char_momo",
  },
  {
    seg: "seg_010",
    slug: "peach_agrees",
    action:
      "Peach gives a two-note call and fans its tail; Momo opens one eye and points at the bird, laughing.",
    facial: {
      char_momo: "Amused, one eye open",
      char_peach: "Beak open mid-call",
    },
    lines: ["ほら、ピーチだってそう言ってる。"],
    speaker: "char_momo",
  },

  // seg_011 — map decision
  {
    seg: "seg_011",
    slug: "map_grandma",
    action:
      "Low inn veranda in hard sunlight: Momo crouches over an old parchment map, fingertip tracing the sea to an island marked with a red cross and the characters 鬼ヶ島; a travel guide 旅の手引 lies open; Shiro, Gon and Peach crowd the edges.",
    facial: {
      char_momo: "Focused, serious, a flicker of sadness",
      char_shiro: "Alert, ears up",
      char_gon: "Watching her, quiet",
    },
    lines: [
      "おばあちゃんが言ってたんだ。",
      "俺の桃も、鬼ヶ島の人たちと同じで。",
      "よそから来たものなんだって。",
    ],
    speaker: "char_momo",
  },
  {
    seg: "seg_011",
    slug: "map_decision",
    action:
      "Shiro barks once; Momo looks up from the map, jaw set, and folds it; the camera pushes past her toward the sunlit sea beyond the veranda.",
    facial: {
      char_momo: "Resolved, eyes bright",
      char_shiro: "Certain, tail stiff",
      char_gon: "Resigned, nodding",
    },
    lines: [
      "よし、決めた。",
      "鬼ヶ島に行って。",
      "囚われている人たちを見てくる。",
      "それから、帰ってくる。",
    ],
    speaker: "char_momo",
  },

  // seg_012 — trailhead
  {
    seg: "seg_012",
    slug: "trail_depart",
    action:
      "Mountain trailhead above a blue sea: Momo slaps the weathered signpost 鬼ヶ島 → and strides off; Shiro with a woven pack and Gon with a bundle fall in behind; Peach rides her shoulder; bright wind.",
    facial: {
      char_momo: "Grinning, chin up",
      char_shiro: "Eager, trotting",
      char_gon: "Skeptical, one eyebrow up",
    },
    lines: ["出発。"],
    speaker: "char_momo",
  },
  {
    seg: "seg_012",
    slug: "gon_skeptic",
    action:
      "Gon mutters under his breath while shifting his bundle; Shiro glances back at him, tongue out.",
    facial: {
      char_gon: "Skeptical, mouth barely moving",
      char_shiro: "Cheerful, oblivious",
    },
    lines: ["お前、島がどんな姿か知らないんだろ。"],
    speaker: "char_gon",
  },
  {
    seg: "seg_012",
    slug: "momo_answers",
    action:
      "Momo spins on her heel, walks backward along the trail, and throws her arms wide at the sea; the wind snaps her ribbon.",
    facial: {
      char_momo: "Bright, stubborn, laughing",
    },
    lines: ["だからこそ、見に行くんだよ。"],
    speaker: "char_momo",
  },

  // seg_013 — onsen
  {
    seg: "seg_013",
    slug: "onsen_bliss",
    action:
      "Steam rises around the wooden 桃太郎の湯 bath: Momo soaks to her shoulders, knees drawn up, head tilted back; Gon rests his chin on the pool edge; Shiro dozes in a small green vest, tongue out.",
    facial: {
      char_momo: "Blissful, eyes closed, mouth open in a sigh",
      char_gon: "Flat, unimpressed",
      char_shiro: "Asleep, tongue lolling",
    },
    lines: ["わあ、最高。", "これがいい湯、いい島ってやつだね。"],
    speaker: "char_momo",
  },
  {
    seg: "seg_013",
    slug: "gon_warning",
    action:
      "Gon lifts his chin from the pool edge and stares at her, steam curling between them; Shiro's ear twitches but the dog does not wake.",
    facial: {
      char_gon: "Flat, deadpan, deeply unimpressed",
      char_momo: "Eyes still closed, serene",
    },
    lines: ["おい、もうすぐ鬼島だぞ。", "のん気に湯なんか浸かってていいのかよ。"],
    speaker: "char_gon",
  },
  {
    seg: "seg_013",
    slug: "momo_onsen_answer",
    action:
      "Momo opens one eye and flicks water at Gon; steam curls through the bathhouse beams; the camera glides low over the water.",
    facial: {
      char_momo: "Smug, one eye open, corner of her mouth up",
      char_gon: "Wiping his face, annoyed",
    },
    lines: ["だからこそ浸かるんだよ。", "力をためて、明日に備える。"],
    speaker: "char_momo",
  },

  // seg_014 — inn dinner
  {
    seg: "seg_014",
    slug: "fish_offer",
    action:
      "Lantern-lit inn table at night: Momo in a loose yukata winks and lifts a skewer of grilled fish toward the lens with chopsticks; Shiro in a small bib sits upright, Gon's hand already reaching for the next plate; 地魚の炭火焼 sign behind.",
    facial: {
      char_momo: "Playful wink, tongue between teeth",
      char_shiro: "Delighted, tongue out",
      char_gon: "Distracted by the next plate",
    },
    lines: ["今日の収穫だよ。", "一口かじれば、海の味。"],
    speaker: "char_momo",
  },
  {
    seg: "seg_014",
    slug: "gon_third_time",
    action:
      "Gon speaks around a mouthful of fish, deadpan; Momo freezes mid-offer, then laughs; Shiro licks its chops; lantern light sways.",
    facial: {
      char_gon: "Flat, cheeks bulging",
      char_momo: "Caught out, laughing, chopsticks still raised",
    },
    lines: ["もう三回目だぜ、その台詞。"],
    speaker: "char_gon",
  },

  // seg_015 — cards and promise
  {
    seg: "seg_015",
    slug: "card_promise",
    action:
      "Tatami room at night: Momo lies on her stomach, feet kicked up, a peach card held near her face; Shiro lies on its side, Gon fans his cards; warm lantern glow, paper screens.",
    facial: {
      char_momo: "Mischievous then sincere, eyes on Gon",
      char_shiro: "Sleepy, calm",
      char_gon: "Listening, cards lowered",
    },
    lines: [
      "約束だよ。",
      "鬼ヶ島で、助けるべき人を助けて。",
      "それから四人で、大きな海を見に行く。",
    ],
    speaker: "char_momo",
  },
  {
    seg: "seg_015",
    slug: "gon_worry",
    action:
      "Gon lowers his fan of cards, unconvinced; Shiro's ears prick; the lantern flame gutters.",
    facial: {
      char_gon: "Wary, small frown",
      char_shiro: "Alert, head lifting",
    },
    lines: ["鬼王がすごく強い相手だったら？"],
    speaker: "char_gon",
  },
  {
    seg: "seg_015",
    slug: "momo_card_answer",
    action:
      "Momo slaps her card face-down on the tatami and grins; the cards scatter slightly; Gon stares at her, then snorts.",
    facial: {
      char_momo: "Cocky, chin on her hand",
      char_gon: "Half-convinced, half-amused",
    },
    lines: ["そのときは勝ってから。", "温泉に戻ってくるさ。"],
    speaker: "char_momo",
  },

  // seg_016 — Kiha and the blood banner
  {
    seg: "seg_016",
    slug: "kiha_unfurls",
    action:
      "Night storehouse lit by a brazier: Kiha, mud-caked and weathered, snaps open a torn banner embroidered with a red oni face and dark dried blood; Momo crouches before it, her smile gone; long shadows climb the walls.",
    facial: {
      char_kiha: "Grim, distant, eyes on the cloth",
      char_momo: "Alert, sober, smile fading",
      char_shiro: "Ears back, wary",
      char_gon: "Still, watching the banner",
    },
    lines: [
      "わしは若い頃、船で北へ向かった。",
      "鬼ヶ島へ流された。",
      "あの島は島なんかじゃない。",
      "城だ。",
    ],
    speaker: "char_kiha",
  },
  {
    seg: "seg_016",
    slug: "kiha_describes_island",
    action:
      "Kiha jabs a finger at the banner, then at a hanging scroll marked 鬼ヶ島; firelight catches the red oni face; Momo's hands tighten on her knees.",
    facial: {
      char_kiha: "Bitter, remembering",
      char_momo: "Pale, absorbed, lips parted",
    },
    lines: [
      "島の真ん中に山があって。",
      "てっぺんは髑髏みたいな形をしている。",
      "鬼王は麓の人々を檻に閉じ込めて。",
      "石を運ばせているんだ。",
    ],
    speaker: "char_kiha",
  },
  {
    seg: "seg_016",
    slug: "momo_asks_island",
    action:
      "Close on Momo's face as she asks; the brazier pops, sparks rising between her and the banner.",
    facial: {
      char_momo: "Searching, afraid of the answer",
    },
    lines: ["島の人たち、みんな、まだ生きてるの？"],
    speaker: "char_momo",
  },
  {
    seg: "seg_016",
    slug: "kiha_answer",
    action:
      "Kiha's scarred hands clutch the banner; he looks at the fire, not at her; the room seems to contract around his voice.",
    facial: {
      char_kiha: "Hollow, jaw tight",
      char_momo: "Bracing, eyes shining",
    },
    lines: [
      "生きている者がひとりでもいれば。",
      "みんな生きているんだ。",
      "わしは泳いで戻ってきた。",
      "村で戻ってこられたのは。",
      "わし一人だけだった。",
    ],
    speaker: "char_kiha",
  },
  {
    seg: "seg_016",
    slug: "momo_takes_banner",
    action:
      "Momo stands and takes the blood-stained banner, folding it carefully; Kiha watches, then bows his head; Shiro and Gon wait at the door.",
    facial: {
      char_momo: "Steady, respectful, eyes lowered",
      char_kiha: "Tired, grateful, head bowed",
    },
    lines: ["この旗、借りていくよ。", "帰ってきたら返すから。"],
    speaker: "char_momo",
  },

  // seg_017 — harbor departure
  {
    seg: "seg_017",
    slug: "villager_taunt",
    action:
      "Crowded harbor under hard sun: Momo sits on the boat railing, arm flung wide, grinning back at a villager on the dock; Shiro and Gon beside her, Peach on the rail; a white sail with a huge red oni face begins to rise.",
    facial: {
      char_villager: "Skeptical, half-laughing, hands on hips",
      char_momo: "Bright, defiant, chin up",
      char_shiro: "Alert, ears forward",
      char_gon: "Smug, arms folded",
    },
    lines: ["小桃！", "四人だけで何ができるんだ！"],
    speaker: "char_villager",
    refs: [["seg_016", "momo_takes_banner"]],
  },
  {
    seg: "seg_017",
    slug: "momo_five",
    action:
      "Momo points at each companion in turn, then back toward the village; the red oni sail snaps full and the crowd laughs and waves as the boat pulls away.",
    facial: {
      char_momo: "Laughing, eyes wet, arm still raised",
      char_shiro: "Barking happily",
      char_gon: "Embarrassed but proud",
    },
    lines: [
      "俺たちは五人だよ。",
      "シロ、ゴン、ピーチ、それに俺。",
      "それに、おばあちゃんもいる。",
      "門で見てくれてるんだから。",
    ],
    speaker: "char_momo",
  },

  // seg_018 — the island seen from the sea
  {
    seg: "seg_018",
    slug: "skull_island",
    action:
      "Open sea from the stern: Momo braced at the rail, wind whipping her hair; ahead a skull-shaped peak carries a black fortress with smoke climbing from it; Shiro growls low at her feet.",
    facial: {
      char_momo: "Calm wonder, then hard resolve",
      char_shiro: "Hackles up, low growl",
    },
    lines: ["ほんとに、鬼みたいだ。", "分かってる。", "俺たちはあの城を、壊しに行くんだ。"],
    speaker: "char_momo",
  },

  // seg_019 — glowing footprints
  {
    seg: "seg_019",
    slug: "footprints",
    action:
      "Jungle ruin in dappled light: Momo crouches low, fingers hovering over faintly glowing red footprints; a red-corded skull in the foreground; Shiro sniffs the dirt, Gon watches from a fallen pillar.",
    facial: {
      char_momo: "Wary, calculating, eyes narrowed",
      char_shiro: "Low, nose working",
      char_gon: "Unusually serious",
    },
    lines: [
      "この足跡、連れて行かれた人たちのもの？",
      "いや、深すぎる。",
      "これは鬼の足跡だ。",
    ],
    speaker: "char_momo",
  },
];
