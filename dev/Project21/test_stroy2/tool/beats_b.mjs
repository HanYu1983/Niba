export const BEATS_B = [
  // seg_020 — spiked gate
  {
    seg: "seg_020",
    slug: "gate_count",
    action:
      "Low angle before a spike-studded wooden gate: Momo and Shiro pressed to the ground, dust drifting in shafts of light; a black oni banner hangs above; Momo raises three fingers.",
    facial: {
      char_momo: "Tense, eyes fixed forward, lips moving in a low whisper",
      char_shiro: "Low, ears flat, muscles bunched",
    },
    lines: ["一進門就有哨位。", "我數到三。"],
    speaker: "char_momo",
  },

  // seg_021 — night inside the fortress
  {
    seg: "seg_021",
    slug: "gon_reports",
    action:
      "Night inside the fortress: Momo crouches against a huge wooden pillar with a low torch; Gon hangs from a crossbeam above, pointing down the corridor.",
    facial: {
      char_momo: "Alert, listening",
      char_gon: "Urgent, whispering, head tilted down",
    },
    lines: ["壁の中に人がいる。", "二人。"],
    speaker: "char_gon",
  },
  {
    seg: "seg_021",
    slug: "momo_changes_route",
    action:
      "Momo presses the torch against the pillar and points back the way they came; the flame bends; Gon drops silently to a lower beam.",
    facial: {
      char_momo: "Calm command, jaw set",
      char_gon: "Nodding, already moving",
    },
    lines: [
      "じゃあ、別の道を行こう。",
      "俺たちは人を救いに来たんだ。",
      "起こしに来たんじゃない。",
    ],
    speaker: "char_momo",
  },

  // seg_022 — climbing the wall
  {
    seg: "seg_022",
    slug: "wall_climb",
    action:
      "Pre-dawn stone wall: Momo hauls herself up a crack, knuckles white, sweat streaking her temple; Shiro claws up a parallel seam in a red leather vest; mist and vines below.",
    facial: {
      char_momo: "Strained, jaw clenched, eyes on the top",
      char_shiro: "Focused, paws gripping stone",
    },
    lines: ["もう少し。", "この壁の奥が城の中だ。"],
    speaker: "char_momo",
  },

  // seg_023 — bridge
  {
    seg: "seg_023",
    slug: "bridge_count",
    voice: "internal_monologue",
    action:
      "Narrow wooden bridge between watchtowers: Momo lies flat on the planks, chin almost touching the wood; Shiro pressed beside her; below, two horned oni warriors cross with long shadows.",
    facial: {
      char_momo: "Lips sealed tight, jaw motionless, eyes fixed forward",
      char_shiro: "Frozen, tail tucked",
    },
    lines: ["向こうへ行くまで待つ。", "一、二、三。"],
    speaker: "char_momo",
  },

  // seg_024 — the persimmon
  {
    seg: "seg_024",
    slug: "offer_fruit",
    action:
      "Fortress wall base in morning light: Momo kneels and raises a brown persimmon overhead to an armored oni cub on a watchtower; the cub's spear wavers, hunger fighting suspicion.",
    facial: {
      char_momo: "Open, calm, arms steady",
      char_oni_cub: "Wide-eyed, torn, spear tip dipping",
    },
    lines: ["ほら、やるよ。", "戦わない。", "道を空けてくれればそれでいい。"],
    speaker: "char_momo",
  },
  {
    seg: "seg_024",
    slug: "cub_lets_them_pass",
    action:
      "The cub snatches the fruit and points its spear toward a side door, trying to look bored.",
    facial: {
      char_oni_cub: "Sulky, cheeks already full",
    },
    lines: ["あっちの道を行け。"],
    speaker: "char_oni_cub",
  },
  {
    seg: "seg_024",
    slug: "momo_persimmon_quip",
    action:
      "Momo sheathes her katana and pats Shiro; the cub bites the persimmon, juice on its chin; the side door creaks open.",
    facial: {
      char_momo: "Amused, eyebrows up",
      char_oni_cub: "Ignoring her, eating",
    },
    lines: ["見ろよ、柿のほうが刀より役に立つんだ。"],
    speaker: "char_momo",
  },

  // seg_025 — first fight
  {
    seg: "seg_025",
    slug: "oni_general_taunt",
    action:
      "Corner gate: a horned oni general in heavy armor towers over Momo, arms like pillars; Momo squares off with her blade across her body; Shiro and Gon brace behind her.",
    facial: {
      char_oni_general: "Contemptuous, tusked mouth curling",
      char_momo: "Sharp, unafraid",
      char_shiro: "Snarling, low",
      char_gon: "Watching from a barrel",
    },
    lines: ["小娘風情が、壁を壊そうってか。"],
    speaker: "char_oni_general",
  },
  {
    seg: "seg_025",
    slug: "momo_first_answer",
    action:
      "Momo steps forward, blade low, eyes locked on the general; the wind pulls at Shiro's red scarf.",
    facial: {
      char_momo: "Steady, cold, small smile",
      char_oni_general: "Amused, then uncertain",
    },
    lines: ["ああ。", "壁の向こうの人たちを。", "連れ帰りに来たんだ。"],
    speaker: "char_momo",
  },

  // seg_026 — gate frame
  {
    seg: "seg_026",
    slug: "gate_heave",
    action:
      "Momo clings to the gate's crossbar and heaves; through the gap a corridor of torchlight and red oni soldiers; Shiro braces on the stair behind her, snarling.",
    facial: {
      char_momo: "Teeth gritted, sweat flying, eyes on the gap",
      char_shiro: "Fierce, guarding the stair",
    },
    lines: ["シロ、行け。"],
    speaker: "char_momo",
  },

  // seg_027 — the wooden box
  {
    seg: "seg_027",
    slug: "box_recognition",
    action:
      "Blood-streaked stone lantern in a dark corridor: Momo kneels, cradling a small wooden box carved 桃 with a red tassel; inside, a cloth painted with a house under a peach tree; distant oni shouts echo.",
    facial: {
      char_momo: "Stunned, recognition dawning, lips parted",
    },
    lines: ["これ、ばあちゃんが話してた、あの家？"],
    speaker: "char_momo",
    refs: [["seg_006", "momo_promise"]],
  },
  {
    seg: "seg_027",
    slug: "keep_the_box",
    action:
      "Momo tucks the cloth into her breast and closes the box; torchlight approaches at the far end of the corridor; she rises and runs.",
    facial: {
      char_momo: "Set, protective, jaw tight",
    },
    lines: ["とにかく、これを守る。"],
    speaker: "char_momo",
  },

  // seg_028 — broken tower self-talk
  {
    seg: "seg_028",
    slug: "tower_monologue",
    voice: "internal_monologue",
    action:
      "Night on the broken tower: Momo leans against a charred post, gazing at the oni king's hall burning at the fortress peak; Peach on her shoulder watches the rear; she presses the cloth to her chest.",
    facial: {
      char_momo: "Lips sealed tight, jaw motionless, quiet wistful eyes",
      char_peach: "Still, watchful",
    },
    lines: [
      "ばあちゃんが言ってた。",
      "俺は桃の木の下で拾われたって。",
      "もしかしたら俺の家も。",
      "この城みたいに。",
      "もともと屋根があったのかもしれない。",
    ],
    speaker: "char_momo",
    refs: [["seg_027", "box_recognition"]],
  },
  {
    seg: "seg_028",
    slug: "tower_resolve",
    voice: "internal_monologue",
    action:
      "Momo straightens, tucks the cloth away, and looks down at the lit hall; wind pulls at her ribbon; the camera tilts up to the burning peak.",
    facial: {
      char_momo: "Hard, resolved, eyes dry",
    },
    lines: ["まあいい。", "まず戦いを終わらせる。", "明日の夜、中に入るぞ。"],
    speaker: "char_momo",
  },

  // seg_029 — dungeon reunion
  {
    seg: "seg_029",
    slug: "momo_genzo_intro",
    action:
      "Dungeon before wooden bars: Momo kneels in mud, hands clasping Genzo's scarred hands through the bars; torchlight sways; Shiro waits behind her.",
    facial: {
      char_momo: "Urgent, gentle, searching his face",
      char_genzo: "Startled, disbelieving",
      char_shiro: "Quiet, watchful",
    },
    lines: ["あんたは島の向こう側の上老だろう？", "村から来たんだ。", "俺は桃だ。"],
    speaker: "char_momo",
  },
  {
    seg: "seg_029",
    slug: "genzo_warning",
    action:
      "Genzo grips her hands and pulls her closer to the bars, glancing down the cell block in panic.",
    facial: {
      char_genzo: "Terrified, trembling, eyes wide",
      char_momo: "Listening, holding on",
    },
    lines: ["桃、どうして入ってこられたんだ。", "早く逃げろ。", "鬼王に目をつけられるぞ。"],
    speaker: "char_genzo",
  },
  {
    seg: "seg_029",
    slug: "momo_plan",
    action:
      "Momo shakes her head and looks down the cell block; her free hand rests on the katana at her hip.",
    facial: {
      char_momo: "Steady, stubborn, jaw set",
      char_genzo: "Desperate, shaking his head",
    },
    lines: [
      "逃げるなら皆で逃げる。",
      "まず牢の扉を斬り開けて。",
      "それから大殿へ話をつけに行く。",
    ],
    speaker: "char_momo",
  },
  {
    seg: "seg_029",
    slug: "genzo_doubt",
    action:
      "Genzo's chains rattle as he leans back; the torch throws their shadows across the stone.",
    facial: {
      char_genzo: "Hollow, afraid",
    },
    lines: ["あの大殿には、本物の鬼王がいるんだぞ。"],
    speaker: "char_genzo",
  },
  {
    seg: "seg_029",
    slug: "momo_final_answer",
    action:
      "Momo draws her katana and sets it against the lock; Genzo stares at her; the blade catches the flame.",
    facial: {
      char_momo: "Cold, certain, faint smile",
      char_genzo: "Stunned, then a flicker of hope",
    },
    lines: [
      "分かってる。",
      "ばあちゃんも言ってた。",
      "鬼だって道理は通じる。",
      "こっちが先に手を出すならな。",
    ],
    speaker: "char_momo",
  },

  // seg_030 — sprint
  {
    seg: "seg_030",
    slug: "sprint",
    silent: true,
    secs: 5,
    action:
      "Torch-lit passage: Momo sprints flat-out, red ribbon streaming, dust and sparks flying; behind her a wall of oni roars; ahead a faint hall light; the camera races beside her.",
    facial: {
      char_momo: "Mouth open, breath ragged, eyes locked ahead",
    },
    refs: [["seg_029", "momo_final_answer"]],
  },

  // seg_031 — great hall approach
  {
    seg: "seg_031",
    slug: "hall_walk",
    silent: true,
    secs: 6,
    action:
      "Vaulted great hall: torchlight climbs the black timbers; armored oni line the walls in a semicircle; Momo walks alone into the open center, small and sweat-stained, chin lifted.",
    facial: {
      char_momo: "Exhausted, defiant, chin up",
      char_oni_soldier: "Still, faceless behind iron",
    },
  },

  // seg_032 — draw the blade
  {
    seg: "seg_032",
    slug: "draw_and_declare",
    action:
      "Momo stops in the pool of light and draws her katana halfway; the steel rings; every oni in the hall turns; the camera pushes in on her face.",
    facial: {
      char_momo: "Bloodied, defiant, small smile",
      char_oni_soldier: "Turning, grips tightening on spears",
    },
    lines: ["鬼王、お前を、人間に戻してみせる。"],
    speaker: "char_momo",
  },

  // seg_033 — the king rises
  {
    seg: "seg_033",
    slug: "king_rises",
    silent: true,
    secs: 6,
    action:
      "The throne groans: a colossal black-armored oni rises, twin horns, burning red eyes; the hall seems to sink under his gaze; his great sword drags sparks from the floor.",
    facial: {
      char_momo: "Small, still, unflinching",
      char_oni_king: "Cold, enormous, eyes burning",
    },
    refs: [["seg_032", "draw_and_declare"]],
  },

  // seg_034 — the cut
  {
    seg: "seg_034",
    slug: "blade_crossing",
    silent: true,
    secs: 4,
    action:
      "The oni king's greatsword falls; Momo's katana meets it edge-on and cuts upward in a clean ascending arc; the frame holds on the crossing, sparks suspended.",
    facial: {
      char_momo: "Teeth bared, eyes wide",
      char_oni_king: "Triumphant, then astonished",
    },
    refs: [["seg_033", "king_rises"]],
  },
  {
    seg: "seg_034",
    slug: "landing_line",
    action:
      "Momo lands on one knee, blade dripping; behind her the giant topples, armor crashing; dust rolls across the hall.",
    facial: {
      char_momo: "Exhausted, calm, eyes down",
      char_oni_king: "Lifeless, slumped, eyes closed",
    },
    lines: ["俺は人を連れて帰る。", "お前は、眠ってろ。"],
    speaker: "char_momo",
  },

  // seg_035 — victory
  {
    seg: "seg_035",
    slug: "victory_stand",
    silent: true,
    secs: 4,
    action:
      "Momo stands on the fallen king's breastplate, katana raised; the black 鬼王 banner tears loose and flares in the torchlight; Shiro plants itself at her feet and howls.",
    facial: {
      char_momo: "Tired, distant, eyes on the banner",
      char_shiro: "Head thrown back, howling",
    },
    refs: [["seg_034", "landing_line"]],
  },
  {
    seg: "seg_035",
    slug: "victory_whisper",
    action:
      "Momo lowers the blade and whispers toward the broken ceiling; the howl echoes; embers drift.",
    facial: {
      char_momo: "Tender, tired, almost smiling",
    },
    lines: ["ばあちゃん、ただいま。"],
    speaker: "char_momo",
  },

  // seg_036 — aftermath
  {
    seg: "seg_036",
    slug: "comfort_akita",
    action:
      "Before dawn in the burnt courtyard: Momo crouches, cupping the chin of a huge mud-and-blood-matted Akita; she strokes under its jaw; smoke and embers behind.",
    facial: {
      char_momo: "Soft, grieving, eyes on the dog",
      char_akita: "Exhausted, leaning into her hand",
    },
    lines: ["お前も家に帰りたいんだろ。", "戦が終われば、みんな家に帰るんだ。"],
    speaker: "char_momo",
    refs: [["seg_027", "box_recognition"]],
  },
  {
    seg: "seg_036",
    slug: "home_speech",
    action:
      "Momo looks up at the grey sky, then back at the dog; the Akita leans into her knee with a low whine; dawn light spreads over the ruined walls.",
    facial: {
      char_momo: "Warm, tearful smile, eyes bright",
      char_akita: "Mournful, pressed against her",
    },
    lines: [
      "じゃあ俺たちも帰ろう。",
      "ばあちゃんの湯に入って。",
      "桃の木の下に座って。",
      "この旅の記録を。",
      "三日三晩話しても終わらない。",
      "そんな話にしよう。",
    ],
    speaker: "char_momo",
  },
  {
    seg: "seg_036",
    slug: "dawn_wide",
    silent: true,
    secs: 5,
    action:
      "Wide shot: Momo and the Akita small in the wrecked courtyard, dawn breaking over the fortress and a distant strip of sea; smoke thinning.",
    facial: {
      char_momo: "Still, small, exhausted",
      char_akita: "Sitting close beside her",
    },
  },

  // seg_037 — end railing
  {
    seg: "seg_037",
    slug: "railing_return",
    action:
      "The image dissolves back to the weathered dock railing: Momo with a rice ball under her chin, Shiro's nose near the lens; warm dusk, film grain.",
    facial: {
      char_momo: "Tired, content, eyes soft",
      char_shiro: "Calm, nose to the glass",
    },
    lines: ["鬼退治のあとで。", "勝ったけど、ちょっと疲れた。"],
    speaker: "char_momo",
    refs: [["seg_001", "railing_riceball"]],
  },
  {
    seg: "seg_037",
    slug: "railing_push_lens",
    action:
      "Momo laughs and pushes the lens away, then glances back with a sly smile; the red ribbon swings; the frame softens.",
    facial: {
      char_momo: "Playful, laughing, eyes crinkled",
      char_shiro: "Startled by the movement, ears up",
    },
    lines: ["まだ撮るの。", "もう終わりでしょ。", "また、どこかへ。"],
    speaker: "char_momo",
  },

  // seg_038 — end card
  {
    seg: "seg_038",
    slug: "end_card",
    voice: "narrator",
    action:
      "Fade to a dark 90s title card: 新・桃太娘 in brush calligraphy, the line 新たな冒険は、まだ終わっていない。 beneath; projector grain, slow fade to black.",
    facial: {},
    lines: ["新たな冒険は、まだ終わっていない。"],
    refs: [["seg_002", "poster_narration"]],
  },
];
