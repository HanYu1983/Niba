/**
 * Entity inventory for plan.ch0.json (序章：驟變之前).
 *
 * Rule from NOVEL_TO_JSON_WORKFLOW.md 1.2: characters carry only constant physical
 * traits (no wardrobe); props carry appearance; locations carry fixed spatial features.
 * Every entity owns one reference folder — ComfyUI names the files, so the JSON records
 * the folder, never a filename.
 */

export const entities = {
  characters: [
    {
      id: "char_frost",
      name: "佛羅斯上校 (Colonel Frost)",
      aliases: ["佛羅斯上校", "佛羅斯", "上校", "老狐狸", "老不修", "死老頭"],
      traits:
        "Late 50s, broad-shouldered and barrel-chested, weathered square face, short iron-grey buzz cut, thick neck, heavy brows, booming voice, commanding presence",
      reference: {
        image: "refs/char_frost",
        status: "ready",
        prompt:
          "Head-and-shoulders reference photograph of a hardened 58-year-old East Asian man, deeply lined forehead, crow's feet, strong nasolabial folds, weathered leathery skin, grey stubble, short iron-grey buzz cut with a receding hairline, heavy brows, broad shoulders, thick neck, plain olive military uniform with no insignia, plain grey studio backdrop, soft key light, sharp focus, no text"
      }
    },
    {
      id: "char_taylor",
      name: "泰洛伊上士 (Staff Sergeant Taylor)",
      aliases: ["泰洛伊上士", "泰洛伊", "大姑娘"],
      traits:
        "Mid 20s, athletic and lean, high black ponytail, sharp dark eyes, strong jaw, sun-tanned skin, upright military posture",
      reference: {
        image: "refs/char_taylor",
        status: "ready",
        prompt:
          "Neutral front-facing reference portrait of a 25-year-old East Asian woman, athletic and lean, high black ponytail, sharp dark eyes, strong jaw, sun-tanned skin, plain olive military undershirt with no insignia, head-and-shoulders framing, plain grey backdrop, soft key light, sharp focus, no text"
      }
    },
    {
      id: "char_contractor",
      name: "女殺手 (The Contractor)",
      aliases: ["女殺手", "殺手"],
      traits:
        "Early 30s, lean and wiry, pale cold face, sharp cheekbones, flat dead eyes, short black hair tied back tight",
      reference: {
        image: "refs/char_contractor",
        status: "ready",
        prompt:
          "Neutral front-facing reference portrait of a lean 32-year-old East Asian woman, pale cold face, sharp cheekbones, flat dead eyes, short black hair tied back tight, plain black tactical top, head-and-shoulders framing, plain grey backdrop, hard side light, sharp focus, no text"
      }
    },
    {
      id: "char_yang",
      name: "楊董 (Chairman Yang)",
      aliases: ["楊董"],
      traits:
        "Late 50s, obese, round sweaty face, heavy jowls, thinning black hair combed over, small sharp eyes, expensive dark suit",
      reference: {
        image: "refs/char_yang",
        status: "ready",
        prompt:
          "Neutral front-facing reference portrait of an obese 58-year-old East Asian man, round sweaty face, heavy jowls, thinning black hair combed over, small sharp eyes, expensive dark suit, head-and-shoulders framing, plain grey backdrop, soft key light, sharp focus, no text"
      }
    },
    {
      id: "char_xiao_liu",
      name: "小劉 (Xiao Liu)",
      aliases: ["小劉"],
      traits:
        "Late 20s, slim, eager nervous face, short neat black hair, cheap ill-fitting navy suit",
      reference: {
        image: "refs/char_xiao_liu",
        status: "ready",
        prompt:
          "Neutral front-facing reference portrait of a slim 28-year-old East Asian man, eager nervous face, short neat black hair, cheap ill-fitting navy suit, head-and-shoulders framing, plain grey backdrop, soft key light, sharp focus, no text"
      }
    },
    {
      id: "char_zhuang",
      name: "小莊 (Xiao Zhuang)",
      aliases: ["小莊"],
      traits:
        "Early 30s, handsome, confident smirk, slicked-back black hair, tailored charcoal suit",
      reference: {
        image: "refs/char_zhuang",
        status: "ready",
        prompt:
          "Neutral front-facing reference portrait of a handsome 32-year-old East Asian man, confident smirk, slicked-back black hair, tailored charcoal suit, head-and-shoulders framing, plain grey backdrop, soft key light, sharp focus, no text"
      }
    },
    {
      id: "char_engineer",
      name: "外骨骼技術員 (Exo Technician)",
      aliases: ["技術員", "工兵"],
      traits:
        "30s, stocky, close-cropped hair, grease-stained olive coveralls, safety goggles pushed up on the forehead",
      reference: {
        image: "refs/char_engineer",
        status: "ready",
        prompt:
          "Neutral front-facing reference portrait of a stocky 35-year-old East Asian man, close-cropped hair, grease-stained olive coveralls, safety goggles pushed up on his forehead, head-and-shoulders framing, plain grey backdrop, soft key light, sharp focus, no text"
      }
    },
    {
      id: "char_father",
      name: "少女的父親 (The Father)",
      aliases: ["父親", "爸爸"],
      traits:
        "Late 40s, lean, gentle tired eyes, short greying black hair, thin rimless glasses, clean white research coat",
      reference: {
        image: "refs/char_father",
        status: "ready",
        prompt:
          "Neutral front-facing reference portrait of a lean 48-year-old East Asian man, gentle tired eyes, short greying black hair, thin rimless glasses, clean white research coat, head-and-shoulders framing, plain grey backdrop, soft morning light, sharp focus, no text"
      }
    },
    {
      id: "char_daughter",
      name: "少女 (The Daughter)",
      aliases: ["少女", "小寶貝"],
      traits:
        "14, small and slight, shoulder-length black hair, round face, clear expressive eyes, plain grey hoodie",
      reference: {
        image: "refs/char_daughter",
        status: "ready",
        prompt:
          "Neutral front-facing reference portrait of a fourteen-year-old East Asian girl, small and slight, shoulder-length black hair, round face, clear expressive eyes, plain grey hoodie, head-and-shoulders framing, plain grey backdrop, soft morning light, sharp focus, no text"
      }
    },
    {
      id: "char_taxi_driver",
      name: "計程車司機 (Taxi Driver)",
      aliases: ["司機"],
      traits: "50s, heavyset, tired eyes, grey stubble, flat cap, plain grey jacket",
      reference: {
        image: "refs/char_taxi_driver",
        status: "ready",
        prompt:
          "Neutral front-facing reference portrait of a heavyset 55-year-old East Asian man, tired eyes, grey stubble, flat cap, plain grey jacket, head-and-shoulders framing, plain grey backdrop, soft key light, sharp focus, no text"
      }
    },
    {
      id: "char_infected_driver",
      name: "肇事駕駛 (The Infected Driver)",
      aliases: ["肇事駕駛", "肇事者"],
      traits:
        "30s male, gaunt, grey-purple necrotic skin, bloodshot eyes, torn dark jacket, fresh road rash on one cheek",
      reference: {
        image: "refs/char_infected_driver",
        status: "ready",
        prompt:
          "Neutral front-facing reference portrait of a gaunt 32-year-old East Asian man as a freshly turned infected, grey-purple necrotic skin, bloodshot eyes, torn dark jacket, road rash on one cheek, practical-effects makeup, head-and-shoulders framing, plain grey backdrop, hard overhead light, sharp focus, no text"
      }
    },
    {
      id: "char_bitten_rider",
      name: "外送員 (The Delivery Rider)",
      aliases: ["外送員"],
      traits:
        "20s, slim, young frightened face, delivery uniform with reflective stripes, black helmet with visor",
      reference: {
        image: "refs/char_bitten_rider",
        status: "ready",
        prompt:
          "Neutral front-facing reference portrait of a slim 23-year-old East Asian man in a reflective-striped delivery uniform, black helmet under one arm, young frightened face, head-and-shoulders framing, plain grey backdrop, hard street light, sharp focus, no text"
      }
    },
    {
      id: "char_crawling_man",
      name: "渾身是血的男子 (The Crawling Man)",
      aliases: ["渾身是血的男子"],
      traits:
        "30s male, blood-soaked shirt, torn jeans, matted black hair, grey pallor after turning",
      reference: {
        image: "refs/char_crawling_man",
        status: "ready",
        prompt:
          "Neutral front-facing reference portrait of a blood-soaked 32-year-old East Asian man, torn shirt and jeans, matted black hair, grey pallor, practical-effects blood, head-and-shoulders framing, plain grey backdrop, hard overhead light, sharp focus, no text"
      }
    },
    {
      id: "char_infected_attacker",
      name: "人形野獸 (The Infected Attacker)",
      aliases: ["怪物", "怪人", "人形野獸", "那人影"],
      traits:
        "Emaciated humanoid, grey-purple necrotic skin, deep open wounds with exposed sinew, bloodshot eyes, torn work clothes",
      reference: {
        image: "refs/char_infected_attacker",
        status: "ready",
        prompt:
          "Neutral front-facing reference portrait of an emaciated infected humanoid, grey-purple necrotic skin, deep open wounds with exposed sinew, bloodshot eyes, torn work clothes, practical-effects makeup, head-and-shoulders framing, plain grey backdrop, hard overhead light, sharp focus, no text"
      }
    }
  ],

  props: [
    {
      id: "prop_leave_form",
      name: "休長假假單",
      aliases: ["假單"],
      traits: "Printed military leave request form, typed rows, signature line, red stamp box",
      reference: {
        image: "refs/prop_leave_form",
        status: "ready",
        prompt:
          "Top-down plate of a printed military leave request form with typed rows and a signature line, no legible text, on a steel desk, 35mm film grain"
      }
    },
    {
      id: "prop_exo_suit",
      name: "外骨骼裝甲",
      aliases: ["外骨骼裝甲", "外骨骼"],
      traits: "Open hydraulic exoskeleton frame, olive drab metal, exposed cables and pistons, worn edges",
      reference: {
        image: "refs/prop_exo_suit",
        status: "ready",
        prompt:
          "Product plate of an open hydraulic exoskeleton frame, olive drab metal, exposed cables and pistons, worn edges, no person, no text, 35mm film grain"
      }
    },
    {
      id: "prop_exo_rifle",
      name: "特製大口徑步槍",
      aliases: ["大口徑步槍", "步槍"],
      traits: "Large-caliber rifle, long heavy barrel, matte black, oversized muzzle brake",
      reference: {
        image: "refs/prop_exo_rifle",
        status: "ready",
        prompt:
          "Side product plate of a large-caliber rifle with a long heavy barrel, matte black, oversized muzzle brake, no text, 35mm film grain"
      }
    },
    {
      id: "prop_target_sheet",
      name: "靶紙",
      aliases: ["靶紙", "靶心"],
      traits: "Paper target sheet, three bullet holes overlapping at the center, ragged edges",
      reference: {
        image: "refs/prop_target_sheet",
        status: "ready",
        prompt:
          "Top-down plate of a paper shooting target with three overlapping bullet holes at the center, ragged edges, no text, 35mm film grain"
      }
    },
    {
      id: "prop_whisky_glass",
      name: "威士忌杯",
      aliases: ["威士忌", "酒杯"],
      traits: "Crystal tumbler, two ice cubes, amber whisky, condensation on the glass",
      reference: {
        image: "refs/prop_whisky_glass",
        status: "ready",
        prompt:
          "Product plate of a crystal tumbler with two ice cubes and amber whisky, condensation on the glass, dark table, 35mm film grain"
      }
    },
    {
      id: "prop_vaccine_syringe",
      name: "疫苗針管",
      aliases: ["疫苗", "針管"],
      traits: "Prefilled medical syringe, amber liquid, capped needle, torn sterile packaging",
      reference: {
        image: "refs/prop_vaccine_syringe",
        status: "ready",
        prompt:
          "Top-down plate of a prefilled medical syringe with amber liquid, capped needle, torn sterile packaging, no legible text, 35mm film grain"
      }
    },
    {
      id: "prop_contractor_phone",
      name: "殺手的手機",
      aliases: ["帳戶畫面"],
      traits: "Smartphone screen showing a blurred bank balance, a long row of glowing digits",
      reference: {
        image: "refs/prop_contractor_phone",
        status: "ready",
        prompt:
          "Close-up plate of a smartphone screen showing an abstract bank balance with a long row of glowing blurred digits, no legible text, dark room, 35mm film grain"
      }
    },
    {
      id: "prop_motorcycle",
      name: "黑色摩托車",
      aliases: ["摩托車"],
      traits: "Black sport motorcycle, matte fairings, single headlight",
      reference: {
        image: "refs/prop_motorcycle",
        status: "ready",
        prompt:
          "Three-quarter product plate of a black sport motorcycle, matte fairings, single headlight, wet asphalt at night, no text, 35mm film grain"
      }
    },
    {
      id: "prop_qr_ticket",
      name: "方舟門票",
      aliases: ["門票", "二維碼"],
      traits: "Phone screen with a glowing blue QR code against a dark club background",
      reference: {
        image: "refs/prop_qr_ticket",
        status: "ready",
        prompt:
          "Close-up plate of a phone screen with a glowing blue QR code, no legible text, dark club background, 35mm film grain"
      }
    },
    {
      id: "prop_ark_phone",
      name: "新手機與行動電源",
      aliases: ["新手機", "行動電源", "通行證"],
      traits: "Brand-new smartphone with a power bank, screen showing an abstract facility map and a pass icon",
      reference: {
        image: "refs/prop_ark_phone",
        status: "ready",
        prompt:
          "Top-down plate of a brand-new smartphone and a small power bank, screen showing an abstract underground facility map and a pass icon, no legible text, 35mm film grain"
      }
    },
    {
      id: "prop_steel_rod",
      name: "祖傳不鏽鋼棍",
      aliases: ["不鏽鋼棍", "棍子"],
      traits: "Long stainless steel rod, worn cloth grip, dull silver",
      reference: {
        image: "refs/prop_steel_rod",
        status: "ready",
        prompt:
          "Product plate of a long stainless steel rod with a worn cloth grip, dull silver, no text, 35mm film grain"
      }
    },
    {
      id: "prop_taylor_car",
      name: "泰洛伊的車",
      aliases: ["車子", "車"],
      traits: "Silver compact SUV, rental, mud on the wheel arches",
      reference: {
        image: "refs/prop_taylor_car",
        status: "ready",
        prompt:
          "Three-quarter plate of a silver compact SUV, mud on the wheel arches, no text, 35mm film grain"
      }
    },
    {
      id: "prop_news_feed",
      name: "手機新聞畫面",
      aliases: ["新聞", "新聞畫面"],
      traits: "Phone news feed texture, blurred thumbnails, red breaking-news bar",
      reference: {
        image: "refs/prop_news_feed",
        status: "ready",
        prompt:
          "Close-up plate of a phone news feed with blurred thumbnails and a red breaking-news bar, no legible text, 35mm film grain"
      }
    },
    {
      id: "prop_tactical_backpack",
      name: "戰術背包",
      aliases: ["戰術背包", "背包"],
      traits: "Black tactical backpack, straps and pouches, packed full",
      reference: {
        image: "refs/prop_tactical_backpack",
        status: "ready",
        prompt:
          "Product plate of a black tactical backpack, straps and pouches, packed full, no text, 35mm film grain"
      }
    }
  ],

  locations: [
    {
      id: "loc_prologue_title",
      name: "序章字卡",
      aliases: ["字卡"],
      traits: "Abstract black 35mm slate texture, dust, scratches, faint vignette",
      reference: {
        image: "refs/loc_prologue_title",
        status: "ready",
        prompt:
          "Abstract black 35mm film slate texture, dust motes, scratches, faint vignette, no text, no people, 16:9"
      }
    },
    {
      id: "loc_training_ground",
      name: "軍營操場",
      aliases: ["操場", "營區"],
      traits: "Wide military parade ground, obstacle course, shooting range, distant barracks, morning haze",
      reference: {
        image: "refs/loc_training_ground",
        status: "ready",
        prompt:
          "Wide establishing plate of a military parade ground at morning, obstacle course, shooting range, distant barracks, morning haze, no people, no text, 35mm film grain, 16:9"
      }
    },
    {
      id: "loc_colonel_lounge_night",
      name: "上校的深夜休息室",
      aliases: ["休息室", "深夜辦公室"],
      traits: "Dark officers' lounge, leather sofa, low table with whisky, tall windows over a city at night, one warm lamp",
      reference: {
        image: "refs/loc_colonel_lounge_night",
        status: "ready",
        prompt:
          "Wide establishing plate of a dark officers' lounge at night, leather sofa, low table with a whisky glass, tall windows over a city, single warm lamp, no people, no text, 35mm film grain, 16:9"
      }
    },
    {
      id: "loc_reservoir_night",
      name: "水庫夜景",
      aliases: ["水庫"],
      traits: "Concrete dam edge, black water, mist, distant lights",
      reference: {
        image: "refs/loc_reservoir_night",
        status: "ready",
        prompt:
          "Wide establishing plate of a reservoir at night, concrete dam edge, black water, mist, distant lights, no people, no text, 35mm film grain, 16:9"
      }
    },
    {
      id: "loc_contractor_room",
      name: "殺手的安全屋",
      aliases: ["安全屋", "裝備間"],
      traits: "Dim room, gear laid out on a table, weapon crate, single bulb, map on the wall",
      reference: {
        image: "refs/loc_contractor_room",
        status: "ready",
        prompt:
          "Wide establishing plate of a dim safehouse room, gear laid out on a table, weapon crate, single bulb, map on the wall, no people, no text, 35mm film grain, 16:9"
      }
    },
    {
      id: "loc_club_penthouse",
      name: "俱樂部頂層",
      aliases: ["俱樂部", "頂層"],
      traits: "Luxury club top floor, pink neon haze, cigar smoke, floor-to-ceiling windows over the city, velvet booths",
      reference: {
        image: "refs/loc_club_penthouse",
        status: "ready",
        prompt:
          "Wide establishing plate of a luxury penthouse club, pink neon haze, cigar smoke, floor-to-ceiling windows over the city, velvet booths, no people, no legible text, 35mm film grain, 16:9"
      }
    },
    {
      id: "loc_city_street_night",
      name: "夜晚街道",
      aliases: ["夜晚街道", "樓下街道"],
      traits: "Busy city street at night, neon signs, crosswalk, parked scooters, wet asphalt",
      reference: {
        image: "refs/loc_city_street_night",
        status: "ready",
        prompt:
          "Wide establishing plate of a busy East Asian city street at night, neon signs with no legible text, crosswalk, parked scooters, wet asphalt, no people, no text, 35mm film grain, 16:9"
      }
    },
    {
      id: "loc_apartment_morning",
      name: "清晨的公寓",
      aliases: ["公寓", "家裡"],
      traits: "Small modest apartment, rain-streaked window, table, coat rack, warm morning lamp",
      reference: {
        image: "refs/loc_apartment_morning",
        status: "ready",
        prompt:
          "Wide establishing plate of a small modest apartment on a rainy morning, rain-streaked window, table, coat rack, warm lamp, no people, no text, 35mm film grain, 16:9"
      }
    },
    {
      id: "loc_taxi_interior",
      name: "計程車內",
      aliases: ["計程車", "車內"],
      traits: "Rainy taxi rear seat, fogged windows, rear-view mirror, worn upholstery",
      reference: {
        image: "refs/loc_taxi_interior",
        status: "ready",
        prompt:
          "Wide plate of a rainy taxi interior, rear seat, fogged windows, rear-view mirror, worn upholstery, no people, no text, 35mm film grain, 16:9"
      }
    },
    {
      id: "loc_taylor_car_interior",
      name: "泰洛伊的車內",
      aliases: ["車內", "駕駛座"],
      traits: "Silver compact SUV interior, driver's seat, rain on the windshield, phone mount on the dash",
      reference: {
        image: "refs/loc_taylor_car_interior",
        status: "ready",
        prompt:
          "Wide plate of a silver compact SUV interior, driver's seat, rain on the windshield, phone mount on the dash, no people, no text, 35mm film grain, 16:9"
      }
    },
    {
      id: "loc_city_street_morning",
      name: "清晨雨街",
      aliases: ["清晨街道", "街上"],
      traits: "Rainy morning street, umbrellas, puddles, gutters, low clouds",
      reference: {
        image: "refs/loc_city_street_morning",
        status: "ready",
        prompt:
          "Wide establishing plate of a rainy morning city street, umbrellas, puddles, gutters, low clouds, no people, no text, 35mm film grain, 16:9"
      }
    },
    {
      id: "loc_bridge_traffic",
      name: "塞車的橋面",
      aliases: ["橋面", "橋上"],
      traits: "Long elevated bridge packed with cars and scooters, grey sky, city skyline",
      reference: {
        image: "refs/loc_bridge_traffic",
        status: "ready",
        prompt:
          "Wide establishing plate of a long elevated bridge packed with cars and scooters, grey sky, city skyline, no people, no text, 35mm film grain, 16:9"
      }
    },
    {
      id: "loc_bridge_collapse",
      name: "斷裂的橋面",
      aliases: ["斷橋"],
      traits: "Bridge deck cracking and tilting, dust, falling debris, cars sliding",
      reference: {
        image: "refs/loc_bridge_collapse",
        status: "ready",
        prompt:
          "Wide plate of a collapsing bridge deck, deep cracks, dust, falling debris, cars sliding, no people, no text, 35mm film grain, 16:9"
      }
    },
    {
      id: "loc_riverbed_wreck",
      name: "河床殘骸",
      aliases: ["河床", "運河岸邊"],
      traits: "Dry riverbed under a broken bridge, rubble, overturned silver SUV, concrete debris, harsh noon light",
      reference: {
        image: "refs/loc_riverbed_wreck",
        status: "ready",
        prompt:
          "Wide establishing plate of a dry riverbed under a broken bridge, rubble, overturned silver SUV, concrete debris, harsh noon light, no people, no text, 35mm film grain, 16:9"
      }
    },
    {
      id: "loc_city_skyline_noon",
      name: "平靜的城市天際線",
      aliases: ["城市天際線", "艾伯塔市"],
      traits: "Distant calm city skyline at noon, haze, intact towers, no smoke",
      reference: {
        image: "refs/loc_city_skyline_noon",
        status: "ready",
        prompt:
          "Wide establishing plate of a distant calm city skyline at noon, haze, intact towers, no smoke, no people, no text, 35mm film grain, 16:9"
      }
    }
  ]
};
