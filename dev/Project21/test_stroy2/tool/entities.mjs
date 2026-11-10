// Constant appearance only. Outfits are assigned per block.
export const ENTITIES = {
  characters: [
    {
      id: "char_momo",
      name: "桃 (Momo)",
      aliases: ["桃", "小桃", "桃太娘", "她"],
      traits:
        "East Asian Japanese woman, about 20, fair skin, long light-brown hair in a high ponytail tied with a red ribbon, straight bangs, large warm dark eyes, athletic slim build, light freckles, determined and open expression",
      reference: {
        image: "refs/char_momo",
        status: "ready",
        prompt:
          "Neutral front-facing portrait of a young Japanese woman about twenty, fair skin, long light-brown hair in a high ponytail tied with a red ribbon, straight bangs, large warm dark eyes, athletic slim build, calm determined expression, plain warm-grey backdrop, soft key light, 35mm film grain, no text",
      },
    },
    {
      id: "char_shiro",
      name: "シロ (Shiro)",
      aliases: ["シロ", "白", "柴犬", "犬", "狗"],
      traits:
        "Japanese Shiba Inu, tan and cream fur, compact sturdy body, pointed ears, bright intelligent eyes, curled tail, alert and loyal",
      reference: {
        image: "refs/char_shiro",
        status: "ready",
        prompt:
          "Neutral full-body reference plate of a Japanese Shiba Inu with tan and cream fur, pointed ears, bright intelligent eyes, curled tail, standing alert, plain warm-grey backdrop, soft key light, 35mm film grain, no text",
      },
    },
    {
      id: "char_gon",
      name: "ゴン (Gon)",
      aliases: ["ゴン", "猴", "獼猴", "猴子"],
      traits:
        "Japanese macaque, reddish-brown fur, pale face, expressive dark eyes, lean wiry body, mischievous and quick",
      reference: {
        image: "refs/char_gon",
        status: "ready",
        prompt:
          "Neutral full-body reference plate of a Japanese macaque with reddish-brown fur and a pale face, expressive dark eyes, lean wiry body, curious alert posture, plain warm-grey backdrop, soft key light, 35mm film grain, no text",
      },
    },
    {
      id: "char_peach",
      name: "ピーチ (Peach the pheasant)",
      aliases: ["ピーチ", "雉", "雉雞", "桃鳥"],
      traits:
        "Japanese green pheasant, iridescent green and copper plumage, long sweeping tail, red face wattles, bright watchful eye",
      reference: {
        image: "refs/char_peach",
        status: "ready",
        prompt:
          "Neutral full-body reference plate of a Japanese green pheasant with iridescent green and copper plumage, long sweeping tail, red face wattles, bright watchful eye, perched upright, plain warm-grey backdrop, soft key light, 35mm film grain, no text",
      },
    },
    {
      id: "char_grandma",
      name: "おばあさん (Grandma)",
      aliases: ["おばあさん", "婆婆", "奶奶"],
      traits:
        "Elderly Japanese farm woman, late seventies, silver hair in a low bun, deep kind wrinkles, small stooped frame, weathered hands, gentle steady eyes",
      reference: {
        image: "refs/char_grandma",
        status: "ready",
        prompt:
          "Neutral front-facing portrait of an elderly Japanese farm woman in her late seventies, silver hair in a low bun, deep kind wrinkles, weathered hands, small stooped frame, gentle steady eyes, plain warm-grey backdrop, soft key light, 35mm film grain, no text",
      },
    },
    {
      id: "char_kiha",
      name: "喜八 (Kiha)",
      aliases: ["喜八", "村長", "老漁夫", "鬍髯漢子"],
      traits:
        "Old Japanese fisherman and village chief, late sixties, wind-burnt face, grey stubble, matted dark hair, broad work-hardened hands, missing teeth, wary deep-set eyes",
      reference: {
        image: "refs/char_kiha",
        status: "ready",
        prompt:
          "Neutral front-facing portrait of an old Japanese fisherman in his late sixties, wind-burnt weathered face, grey stubble, matted dark hair, broad work-hardened hands, wary deep-set eyes, plain warm-grey backdrop, soft key light, 35mm film grain, no text",
      },
    },
    {
      id: "char_genzo",
      name: "源蔵 (Genzo)",
      aliases: ["源蔵", "上老", "老者", "老人"],
      traits:
        "Old island elder, late seventies, long white hair and beard, gaunt frame, deep scars and calluses on his hands, hollow but proud eyes",
      reference: {
        image: "refs/char_genzo",
        status: "ready",
        prompt:
          "Neutral front-facing portrait of an old island elder in his late seventies, long white hair and beard, gaunt weathered face, deep scars and calluses, hollow but proud eyes, plain warm-grey backdrop, soft key light, 35mm film grain, no text",
      },
    },
    {
      id: "char_oni_king",
      name: "鬼王 (Oni King)",
      aliases: ["鬼王", "大鬼", "巨大鬼"],
      traits:
        "Colossal oni, deep red skin, two black curved horns, burning red eyes, heavy brow and tusks, mountain-like muscular build",
      reference: {
        image: "refs/char_oni_king",
        status: "ready",
        prompt:
          "Neutral full-body reference plate of a colossal oni king, deep red skin, two black curved horns, burning red eyes, heavy brow and tusks, mountain-like muscular build, standing still, plain dark-grey backdrop, dramatic low key light, 35mm film grain, no text",
      },
    },
    {
      id: "char_oni_general",
      name: "鬼將 (Oni General)",
      aliases: ["鬼將", "鬼武士", "守門鬼", "巨漢"],
      traits:
        "Horned oni warrior, red skin, one broken tusk, scarred face, pillar-thick arms, massive armoured build",
      reference: {
        image: "refs/char_oni_general",
        status: "ready",
        prompt:
          "Neutral full-body reference plate of a horned oni warrior, red skin, one broken tusk, scarred face, pillar-thick arms, massive armoured build, standing still, plain dark-grey backdrop, dramatic low key light, 35mm film grain, no text",
      },
    },
    {
      id: "char_oni_cub",
      name: "猴鬼小卒 (Oni cub)",
      aliases: ["猴鬼", "小卒", "鬼兵"],
      traits:
        "Small monkey-like oni, red skin and fur, short horns, round yellow eyes, wiry body, nervous bravado",
      reference: {
        image: "refs/char_oni_cub",
        status: "ready",
        prompt:
          "Neutral full-body reference plate of a small monkey-like oni, red skin and fur, short horns, round yellow eyes, wiry body, nervous bravado, standing with a spear, plain dark-grey backdrop, dramatic low key light, 35mm film grain, no text",
      },
    },
    {
      id: "char_oni_soldier",
      name: "紅皮鬼卒 (Oni soldier)",
      aliases: ["鬼卒", "紅皮鬼", "鬼兵"],
      traits:
        "Red-skinned oni soldier, squat muscular body, short horns, tusks, dark leather and iron scrap armour",
      reference: {
        image: "refs/char_oni_soldier",
        status: "ready",
        prompt:
          "Neutral full-body reference plate of a red-skinned oni soldier, squat muscular body, short horns, tusks, dark leather and iron scrap armour, standing with a torch, plain dark-grey backdrop, dramatic low key light, 35mm film grain, no text",
      },
    },
    {
      id: "char_akita",
      name: "秋田犬 (Akita)",
      aliases: ["秋田犬", "大狗", "狗"],
      traits:
        "Large Japanese Akita, thick brown and white coat, broad head, dark small eyes, heavy build",
      reference: {
        image: "refs/char_akita",
        status: "ready",
        prompt:
          "Neutral full-body reference plate of a large Japanese Akita with thick brown and white coat, broad head, dark small eyes, heavy build, sitting calmly, plain warm-grey backdrop, soft key light, 35mm film grain, no text",
      },
    },
    {
      id: "char_villager",
      name: "村民 (Villager)",
      aliases: ["村民", "村民甲", "岸上的人"],
      traits:
        "Middle-aged Japanese fisherman, weathered round face, short black hair, stubble, stocky build, work clothes",
      reference: {
        image: "refs/char_villager",
        status: "ready",
        prompt:
          "Neutral front-facing portrait of a middle-aged Japanese fisherman, weathered round face, short black hair, stubble, stocky build, work clothes, plain warm-grey backdrop, soft key light, 35mm film grain, no text",
      },
    },
  ],
  props: [
    {
      id: "prop_travel_orb",
      name: "旅字白球",
      aliases: ["白球", "旅之球", "球"],
      traits: "Smooth white lacquered ball, one large black brush character 旅, slight wear",
      reference: {
        image: "refs/prop_travel_orb",
        status: "ready",
        prompt:
          "Top-down studio photograph of a smooth white lacquered ball with one large black brush character 旅, slight wear, warm daylight, 35mm film grain, no people, no other text",
      },
    },
    {
      id: "prop_bundle",
      name: "桃紋行囊",
      aliases: ["行囊", "行李", "旅の記録", "包袱"],
      traits:
        "Large cloth bundle in peach-print fabric, lashed to a bamboo frame, small wooden writing box tucked inside",
      reference: {
        image: "refs/prop_bundle",
        status: "ready",
        prompt:
          "Studio product photograph of a large peach-print cloth travel bundle lashed to a bamboo frame, small wooden writing box tucked in, warm daylight, 35mm film grain, no people, no text",
      },
    },
    {
      id: "prop_gourd",
      name: "大葫蘆",
      aliases: ["葫蘆", "水葫蘆"],
      traits: "Large brown dried gourd, braided cord, stopper, water beading on the rim",
      reference: {
        image: "refs/prop_gourd",
        status: "ready",
        prompt:
          "Studio product photograph of a large brown dried gourd water flask with a braided cord and stopper, water beading on the rim, warm daylight, 35mm film grain, no people, no text",
      },
    },
    {
      id: "prop_map",
      name: "鬼ヶ島地圖",
      aliases: ["地圖", "舊地圖", "海圖"],
      traits: "Old parchment map, hand-inked coastlines, one island marked with a red cross and 鬼ヶ島",
      reference: {
        image: "refs/prop_map",
        status: "ready",
        prompt:
          "Top-down studio photograph of an old parchment sea map with hand-inked coastlines, one island marked with a red cross and the characters 鬼ヶ島, worn edges, warm lamp light, 35mm film grain, no people",
      },
    },
    {
      id: "prop_travel_guide",
      name: "旅の手引",
      aliases: ["旅の手引", "旅行指南", "書"],
      traits: "Small worn Japanese travel guide, cloth cover, brush title 旅の手引, loose pages",
      reference: {
        image: "refs/prop_travel_guide",
        status: "ready",
        prompt:
          "Top-down studio photograph of a small worn Japanese travel guide with a cloth cover and the brush title 旅の手引, loose pages, warm daylight, 35mm film grain, no people",
      },
    },
    {
      id: "prop_oni_banner",
      name: "染血鬼面旗",
      aliases: ["鬼旗", "鬼面旗", "染血的旗"],
      traits: "Torn dark cloth banner, embroidered snarling red oni face, black horns, dark dried blood along the edges",
      reference: {
        image: "refs/prop_oni_banner",
        status: "ready",
        prompt:
          "Studio product photograph of a torn dark cloth war banner embroidered with a snarling red oni face and black horns, dark dried blood along the edges, firelight, 35mm film grain, no people, no other text",
      },
    },
    {
      id: "prop_oni_sail",
      name: "鬼面船帆",
      aliases: ["船帆", "鬼面帆", "帆"],
      traits: "White canvas sail, huge red oni face painted across it, rope seams, wind-filled",
      reference: {
        image: "refs/prop_oni_sail",
        status: "ready",
        prompt:
          "Studio product photograph of a white canvas boat sail with a huge red oni face painted across it, rope seams, wind-filled, bright daylight, 35mm film grain, no people, no other text",
      },
    },
    {
      id: "prop_wooden_box",
      name: "桃字木匣",
      aliases: ["木匣", "匣子", "盒子"],
      traits: "Small dark wooden box, carved character 桃 on the lid, red tassel, worn brass clasp",
      reference: {
        image: "refs/prop_wooden_box",
        status: "ready",
        prompt:
          "Top-down studio photograph of a small dark wooden box with the carved character 桃 on the lid, red tassel, worn brass clasp, firelight, 35mm film grain, no people",
      },
    },
    {
      id: "prop_cloth_house",
      name: "桃樹舊屋畫布",
      aliases: ["畫布", "布", "舊屋圖"],
      traits: "Small painted cloth, a thatched house under a peach tree, faded inks, creased folds",
      reference: {
        image: "refs/prop_cloth_house",
        status: "ready",
        prompt:
          "Top-down studio photograph of a small painted cloth showing a thatched house under a peach tree, faded inks, creased folds, warm lantern light, 35mm film grain, no people, no text",
      },
    },
    {
      id: "prop_katana",
      name: "桃的刀",
      aliases: ["刀", "武士刀", "katana"],
      traits: "Japanese katana, worn black scabbard, red cord wrap, plain iron guard, nicked edge",
      reference: {
        image: "refs/prop_katana",
        status: "ready",
        prompt:
          "Studio product photograph of a Japanese katana with a worn black scabbard, red cord wrap, plain iron guard, nicked edge, lying on dark wood, 35mm film grain, no people, no text",
      },
    },
    {
      id: "prop_king_banner",
      name: "鬼王大幡",
      aliases: ["黑幡", "鬼王幡", "大幡"],
      traits: "Tall black war banner, two white brush characters 鬼王, ragged lower edge, soot-stained pole",
      reference: {
        image: "refs/prop_king_banner",
        status: "ready",
        prompt:
          "Studio product photograph of a tall black war banner with two white brush characters 鬼王, ragged lower edge, soot-stained pole, torchlight, 35mm film grain, no people",
      },
    },
    {
      id: "prop_greatsword",
      name: "鬼王巨劍",
      aliases: ["巨劍", "大劍", "鬼王之劍"],
      traits: "Massive black iron greatsword, chipped edge, horned guard, longer than a man",
      reference: {
        image: "refs/prop_greatsword",
        status: "ready",
        prompt:
          "Studio product photograph of a massive black iron greatsword with a chipped edge and horned guard, longer than a man, resting against stone, torchlight, 35mm film grain, no people, no text",
      },
    },
    {
      id: "prop_spear",
      name: "鬼卒長矛",
      aliases: ["長矛", "矛", "槍"],
      traits: "Crude iron-tipped spear, dark wooden shaft, leather grip, bent tip",
      reference: {
        image: "refs/prop_spear",
        status: "ready",
        prompt:
          "Studio product photograph of a crude iron-tipped spear with a dark wooden shaft, leather grip, bent tip, morning light, 35mm film grain, no people, no text",
      },
    },
    {
      id: "prop_basket",
      name: "竹籃米糕",
      aliases: ["竹籃", "米糕", "飯糰", "籃子"],
      traits: "Woven bamboo basket, rice cakes wrapped in green leaves, steam, coarse cloth cover",
      reference: {
        image: "refs/prop_basket",
        status: "ready",
        prompt:
          "Top-down studio photograph of a woven bamboo basket with rice cakes wrapped in green leaves, faint steam, coarse cloth cover, mossy stone, 35mm film grain, no people, no text",
      },
    },
    {
      id: "prop_torch",
      name: "火把",
      aliases: ["火把", "火炬", "松明"],
      traits: "Pitch-soaked wooden torch, iron basket, orange flame, smoke trail",
      reference: {
        image: "refs/prop_torch",
        status: "ready",
        prompt:
          "Studio product photograph of a pitch-soaked wooden torch with an iron basket, orange flame and smoke trail, dark stone background, 35mm film grain, no people, no text",
      },
    },
    {
      id: "prop_cards",
      name: "桃花牌",
      aliases: ["牌", "卡牌", "桃花卡"],
      traits: "Hand-sized playing cards, cream paper, peach-blossom emblem, worn corners",
      reference: {
        image: "refs/prop_cards",
        status: "ready",
        prompt:
          "Top-down studio photograph of hand-sized playing cards with a peach-blossom emblem on cream paper, worn corners, lantern light, 35mm film grain, no people, no text",
      },
    },
    {
      id: "prop_fish",
      name: "炭火烤魚",
      aliases: ["烤魚", "魚", "地魚の炭火焼"],
      traits: "Whole grilled fish on a skewer, charred skin, coarse salt, small ceramic plate",
      reference: {
        image: "refs/prop_fish",
        status: "ready",
        prompt:
          "Top-down studio photograph of a whole grilled fish on a skewer with charred skin and coarse salt on a small ceramic plate, lantern light, 35mm film grain, no people, no text",
      },
    },
  ],
  locations: [
    { id: "loc_dock", name: "木碼頭", aliases: ["碼頭", "船艔", "木欄邊"], traits: "Weathered wooden dock, pilings, barrels, a tattered peach flag, bright sea", prompt: "Wide establishing plate of a weathered wooden dock in a 90s Japanese seaside village, pilings, barrels, a tattered peach flag, sparkling blue sea, warm sunlight, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_veranda", name: "婆婆家木廊", aliases: ["木廊", "簷廊", "走廊"], traits: "Old wooden veranda, sun-warmed slats, thatched house behind, mountain view", prompt: "Wide establishing plate of an old Japanese farmhouse wooden veranda, sun-warmed slats, thatched roof behind, green mountains beyond, late afternoon light, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_village_gate", name: "村口", aliases: ["村口", "門口", "山路口"], traits: "Packed dirt road, stone steps, thatched roofs, a tall 桃太郎 banner, distant mountains", prompt: "Wide establishing plate of a rural Japanese village entrance, packed dirt road, stone steps, thatched roofs, a tall 桃太郎 banner on a wooden pole, distant green mountains, golden hour, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_shrine", name: "神社石階", aliases: ["神社", "石階", "石沿"], traits: "Rustic shrine, mossy stone ledge, stone water spout and basin, wooden banner frame, forest", prompt: "Wide establishing plate of a rustic Japanese shrine, mossy stone ledge, stone water spout and basin, wooden banner frame, deep green forest, midday light, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_stream", name: "山溪", aliases: ["溪谷", "溪邊", "山溪"], traits: "Shallow clear mountain stream, mossy boulders, small waterfall, sun-dappled forest", prompt: "Wide establishing plate of a shallow clear mountain stream, mossy boulders, a small waterfall, sun-dappled forest, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_inn_veranda", name: "客棧簷廊", aliases: ["客棧", "簷廊", "旅館廊下"], traits: "Low inn veranda, worn planks, open sea view, hanging travel banners", prompt: "Wide establishing plate of a low Japanese inn veranda, worn wooden planks, open view of a blue sea, hanging travel banners, hard sunlight, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_mountain_trail", name: "山徑", aliases: ["山徑", "山路", "路標"], traits: "Rocky mountain trail above the sea, weathered signpost, wind-bent grass, distant islands", prompt: "Wide establishing plate of a rocky Japanese mountain trail above a blue sea, weathered wooden signpost, wind-bent grass, distant islands, bright daylight, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_onsen", name: "桃太郎の湯", aliases: ["溫泉", "露天溫泉", "浴池"], traits: "Rustic outdoor hot spring, steam, wooden bathhouse beams, stone pool edge, forest", prompt: "Wide establishing plate of a rustic Japanese outdoor hot spring, rising steam, wooden bathhouse beams, stone pool edge, forest behind, soft afternoon light, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_inn_night", name: "旅館夜宴", aliases: ["旅館", "夜宴", "飯桌"], traits: "Lantern-lit inn dining room, low table, grilled fish, ceramic plates, paper screens", prompt: "Wide establishing plate of a lantern-lit Japanese inn dining room at night, low table with grilled fish and ceramic plates, paper screens, warm amber light, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_inn_room", name: "客房榻榻米", aliases: ["客房", "榻榻米", "房間"], traits: "Tatami bedroom, futon, low lantern, peach-print cards, paper walls", prompt: "Wide establishing plate of a Japanese tatami bedroom at night, futon, low paper lantern, scattered peach-print cards, paper walls, warm amber light, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_warehouse", name: "村長倉房", aliases: ["倉房", "倉庫", "喜八家"], traits: "Dark storehouse, brazier fire, hanging scroll 鬼ヶ島, old beams, long shadows", prompt: "Wide establishing plate of a dark Japanese storehouse at night, brazier fire, hanging scroll marked 鬼ヶ島, old wooden beams, long shadows, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_harbor", name: "出航港口", aliases: ["港口", "岸邊", "碼頭"], traits: "Crowded wooden harbor, small boats, paper curtain bunting 鬼ヶ島へ出発, white sail, bright sun", prompt: "Wide establishing plate of a crowded Japanese fishing harbor, wooden boats, paper curtain bunting reading 鬼ヶ島へ出発, a white sail, bright hard sunlight, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_sea", name: "海上", aliases: ["海", "海面", "船尾"], traits: "Open choppy sea, wooden boat deck and rail, skull-shaped mountain and smoking fortress ahead", prompt: "Wide establishing plate of open choppy sea from a wooden boat deck, a skull-shaped mountain with a dark smoking fortress on the horizon, bright hard sunlight, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_jungle_ruins", name: "叢林遺跡", aliases: ["叢林", "遺跡", "石柱"], traits: "Jungle ruins, fallen stone pillars, vine-wrapped corridor, glowing red footprints, a red-corded skull", prompt: "Wide establishing plate of jungle ruins with fallen stone pillars, vine-wrapped corridor, faint glowing red footprints in the dirt, a red-corded skull in the foreground, dappled light, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_spiked_gate", name: "荊棘木門", aliases: ["木門", "尖樁門", "鬼門"], traits: "Massive wooden gate studded with sharp spikes, black oni banner, moss, dusty light shafts", prompt: "Wide establishing plate of a massive wooden gate studded with sharp spikes, black oni banner above, moss-covered walls, dusty shafts of light, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_fortress_pillars", name: "鬼城柱廊（夜）", aliases: ["鬼城", "柱廊", "城內"], traits: "Night inside an oni fortress, huge wooden pillars, torchlight, rafters, deep shadow", prompt: "Wide establishing plate of the interior of an oni fortress at night, huge wooden pillars, torchlight, heavy rafters, deep shadow, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_stone_wall", name: "鬼城石牆", aliases: ["石牆", "城牆", "攀牆"], traits: "Steep ancient stone fortress wall, cracks, vines, pre-dawn mist, forest below", prompt: "Wide establishing plate of a steep ancient stone fortress wall with cracks and vines, pre-dawn mist, dark forest below, cold blue light, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_bridge", name: "箭樓木橋", aliases: ["木橋", "橋", "箭樓"], traits: "Narrow wooden bridge between watchtowers, rope rails, deep drop, banner shadows", prompt: "Wide establishing plate of a narrow wooden bridge between two watchtowers, rope rails, deep drop below, hanging banner shadows, early light, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_wall_base", name: "城牆腳", aliases: ["牆根", "城牆下", "監視塔"], traits: "Fortress wall base, watchtower above, packed earth, morning light, spear racks", prompt: "Wide establishing plate of a fortress wall base with a watchtower above, packed earth, spear racks, morning light, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_corner_gate", name: "角門", aliases: ["角門", "側門", "第一戰"], traits: "Heavy corner gate, packed-earth yard, dappled forest light, oni banner", prompt: "Wide establishing plate of a heavy wooden corner gate in an oni fortress, packed-earth yard, dappled forest light, an oni banner, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_gate_frame", name: "城門門框", aliases: ["門框", "城門", "橫木"], traits: "Massive gate frame and crossbar, gap of torchlit corridor beyond, battle smoke", prompt: "Wide establishing plate of a massive wooden gate frame and crossbar, a narrow gap of torchlit corridor beyond, battle smoke, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_corridor", name: "鬼城長廊", aliases: ["長廊", "走廊", "通道"], traits: "Dark stone corridor, blood-streaked stone lantern, torch brackets, distant hall glow", prompt: "Wide establishing plate of a dark stone fortress corridor, a blood-streaked stone lantern, torch brackets, distant hall glow, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_broken_tower", name: "殘塔", aliases: ["殘塔", "塔", "高處"], traits: "Broken fortress tower at night, charred post, view of the burning oni king hall above", prompt: "Wide establishing plate of a broken fortress tower at night, charred wooden post, view of a burning hall at the fortress peak, cold wind, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_dungeon", name: "天牢", aliases: ["天牢", "牢房", "牢門"], traits: "Dungeon of wooden bars, mud floor, torchlight, stone walls, chains", prompt: "Wide establishing plate of a fortress dungeon with wooden bars, mud floor, torchlight, stone walls, hanging chains, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_passage", name: "突圍通道", aliases: ["通道", "走道", "大殿入口"], traits: "Long torch-lit stone passage, wooden beams, dust, distant hall entrance", prompt: "Wide establishing plate of a long torch-lit stone passage inside a fortress, wooden beams, dust in the air, a distant hall entrance, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_great_hall", name: "鬼王殿", aliases: ["大殿", "鬼王殿", "王座廳"], traits: "Vast vaulted hall, black timbers, torch sconces, semicircle of oni warriors, throne at the far end", prompt: "Wide establishing plate of a vast vaulted oni king's hall, black timbers, torch sconces, a semicircle of empty armoured stands, a throne at the far end, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_throne_dais", name: "王座台階", aliases: ["王座", "台階", "高台"], traits: "High stone throne dais, black iron throne, burning braziers, horned silhouettes", prompt: "Wide establishing plate of a high stone throne dais with a black iron throne, burning braziers, horned silhouettes carved into the wall, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_courtyard_dawn", name: "破城庭院（黎明）", aliases: ["庭院", "戰後", "廢墟"], traits: "Burnt fortress courtyard at dawn, embers, broken walls, grey sky, distant sea", prompt: "Wide establishing plate of a burnt fortress courtyard at dawn, glowing embers, broken walls, grey sky, a distant strip of sea, 35mm film grain, 16:9, no people, no text" },
    { id: "loc_endcard", name: "片尾字卡", aliases: ["字卡", "片尾", "標題卡"], traits: "Abstract 90s title card, black background, projector grain, brush calligraphy", prompt: "Abstract 90s Japanese film title card, deep black background, warm projector grain and faint dust, empty space for brush calligraphy, no text, 16:9", },
  ].map((loc) => ({
    ...loc,
    reference: {
      image: `refs/${loc.id}`,
      status: "ready",
      prompt: loc.prompt,
    },
  })),
};

// Fill character/prop reference folders in the same shape as locations.
for (const group of ["characters", "props"]) {
  for (const entity of ENTITIES[group]) {
    if (!entity.reference) {
      entity.reference = {
        image: `refs/${entity.id}`,
        status: "ready",
        prompt: entity.traits,
      };
    }
  }
}
