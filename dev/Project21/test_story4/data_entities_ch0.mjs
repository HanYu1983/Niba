/**
 * Entity inventory for plan.ch0.json（別境 · 雙生換命：相遇與換命）.
 *
 * Rules (same as test_story3):
 *   - characters carry only constant physical traits, never wardrobe;
 *   - every entity owns exactly one reference folder;
 *   - `anchor_en` is the 8–15 word feature anchor used verbatim in t2v prompts.
 *     It contains no name, no camera, no light, no wardrobe, no expression.
 *   - `voice` is the TTS profile; inner monologue binds to the POV character,
 *     never to a generic narrator.
 */

export const entities = {
  characters: [
    {
      id: "char_anian",
      name: "蘇念（阿念）",
      aliases: ["蘇念", "阿念", "阿念姑娘"],
      source_label: "阿念",
      traits:
        "24, East Asian, the same face as the princess, sun-touched skin, long black braid with cloth strips and dried flowers, clear round eyes, soft jaw, small and quick",
      anchor_en:
        "the market woman (S1), 24, East Asian, sun-touched, same face as the princess, long black braid with cloth strips, grey-blue patchwork",
      voice: {
        gender: "female",
        age: "24",
        timbre: "soft and warm with a faint market-town edge, never hurried, low volume"
      },
      reference: {
        image: "refs/char_anian",
        status: "ready",
        prompt:
          "Neutral front-facing reference portrait of a 24-year-old East Asian woman, sun-touched skin, long black braid wound with cloth strips and dried flowers, clear round eyes, soft jaw, small frame, plain grey-blue patchwork robe, head-and-shoulders framing, plain grey backdrop, soft key light, sharp focus, no text"
      }
    },
    {
      id: "char_zhaoning",
      name: "沈昭寧（長公主）",
      aliases: ["沈昭寧", "昭寧", "長公主", "郡主", "公主"],
      source_label: "昭寧",
      traits:
        "24, East Asian, the same face as the market woman, tall and slender, pale skin, sharp phoenix eyes, straight nose, thin lips, long black hair in a high gold-crowned updo",
      anchor_en:
        "the princess (S2), 24, East Asian, tall and slender, pale, sharp phoenix eyes, long black hair in a high gold-crowned updo",
      voice: {
        gender: "female",
        age: "24",
        timbre: "low and clipped, hard consonants, little breath, every sentence lands like an order"
      },
      reference: {
        image: "refs/char_zhaoning",
        status: "ready",
        prompt:
          "Neutral front-facing reference portrait of a 24-year-old East Asian woman, tall and slender, pale skin, sharp phoenix eyes, straight nose, thin lips, long black hair in an elaborate high updo, plain dark red robe with no embroidery, head-and-shoulders framing, plain grey backdrop, soft key light, sharp focus, no text"
      }
    },
    {
      id: "char_cat",
      name: "波斯貓大人",
      aliases: ["波斯貓大人", "大人", "貓"],
      source_label: "波斯貓大人",
      traits:
        "Long-haired grey-white Persian cat, flat face, amber eyes, heavy and calm, red ribbon bow and small gold bell at the neck",
      anchor_en:
        "the grey-white long-haired Persian cat (S3), flat face, amber eyes, red ribbon bow and gold bell at the neck",
      voice: {
        gender: "male",
        age: "ageless",
        timbre: "low, amused, close and dry, a little theatrical, never breathy"
      },
      reference: {
        image: "refs/char_cat",
        status: "ready",
        prompt:
          "Neutral front-facing reference portrait of a long-haired grey-white Persian cat, flat face, amber eyes, heavy calm posture, red ribbon bow and small gold bell at the neck, plain grey studio backdrop, soft key light, sharp focus, no text"
      }
    },
    {
      id: "char_qinghe",
      name: "青禾",
      aliases: ["青禾"],
      source_label: "青禾",
      traits:
        "18, East Asian, small and round-faced, neat double bun, quick careful eyes, teal palace maid robe",
      anchor_en:
        "the maid (S4), 18, East Asian, small and round-faced, neat double bun, quick careful eyes, teal palace robe",
      voice: {
        gender: "female",
        age: "18",
        timbre: "light and quick, careful, always a little out of breath, voice drops at the end"
      },
      reference: {
        image: "refs/char_qinghe",
        status: "ready",
        prompt:
          "Neutral front-facing reference portrait of an 18-year-old East Asian woman, small and round-faced, neat double bun, quick careful eyes, plain teal palace maid robe with no embroidery, head-and-shoulders framing, plain grey backdrop, soft key light, sharp focus, no text"
      }
    },
    {
      id: "char_cui",
      name: "崔內侍",
      aliases: ["崔內侍", "崔"],
      source_label: "崔內侍",
      traits:
        "50s, East Asian, thin and tall, pale narrow face, thin moustache, dark red eunuch robe, black gauze cap",
      anchor_en:
        "the court eunuch (S5), 50s, East Asian, thin and tall, pale narrow face, thin moustache, black gauze cap",
      voice: {
        gender: "male",
        age: "50s",
        timbre: "thin and dry, courtly, every sentence ends downward, almost a whisper"
      },
      reference: {
        image: "refs/char_cui",
        status: "ready",
        prompt:
          "Neutral front-facing reference portrait of a thin 55-year-old East Asian court eunuch, pale narrow face, thin moustache, black gauze cap, plain dark red robe, head-and-shoulders framing, plain grey backdrop, soft key light, sharp focus, no text"
      }
    },
    {
      id: "char_vendor",
      name: "菜販王伯",
      aliases: ["王伯", "菜販"],
      source_label: "菜販",
      traits:
        "60s, East Asian, stout and weathered, grey stubble, deep laugh lines, brown cotton jacket, straw hat pushed back",
      anchor_en:
        "the vegetable vendor (S6), 60s, East Asian, stout and weathered, grey stubble, deep laugh lines, straw hat pushed back",
      voice: {
        gender: "male",
        age: "60s",
        timbre: "rough and warm, loud enough for the whole street, laughs inside the words"
      },
      reference: {
        image: "refs/char_vendor",
        status: "ready",
        prompt:
          "Neutral front-facing reference portrait of a stout 65-year-old East Asian vegetable vendor, weathered skin, grey stubble, deep laugh lines, brown cotton jacket, straw hat pushed back, head-and-shoulders framing, plain grey backdrop, soft key light, sharp focus, no text"
      }
    },
    {
      id: "char_guard",
      name: "禁軍統領",
      aliases: ["禁軍統領", "統領"],
      source_label: "禁軍統領",
      traits:
        "30s, East Asian, broad and square-faced, short black beard, dark lamellar armour, red tasselled helmet",
      anchor_en:
        "the guard captain (S7), 30s, East Asian, broad and square-faced, short black beard, dark lamellar armour",
      voice: {
        gender: "male",
        age: "30s",
        timbre: "hard parade-ground bark, chest voice, no softness"
      },
      reference: {
        image: "refs/char_guard",
        status: "ready",
        prompt:
          "Neutral front-facing reference portrait of a broad 32-year-old East Asian guard captain, square face, short black beard, dark lamellar armour, red tasselled helmet under one arm, head-and-shoulders framing, plain grey backdrop, soft key light, sharp focus, no text"
      }
    }
  ],

  props: [
    {
      id: "prop_jade_half",
      name: "雙生半玉",
      aliases: ["半塊玉", "玉"],
      traits:
        "Two halves of a white jade pendant, the broken edge matching, one half on a red cord, the other kept in cloth",
      reference: {
        image: "refs/prop_jade_half",
        status: "ready",
        prompt:
          "Top-down product plate of two halves of a white jade pendant, matching broken edges, one half on a red cord, soft warm light, no people, no text, 35mm film grain"
      }
    },
    {
      id: "prop_jade_tokens",
      name: "成對玉牌",
      aliases: ["玉牌", "錦盒"],
      traits:
        "A pair of matched white jade identity tokens lying in an open brocade box, carved edges, silk lining",
      reference: {
        image: "refs/prop_jade_tokens",
        status: "ready",
        prompt:
          "Top-down product plate of a pair of matched white jade identity tokens in an open brocade box, silk lining, carved edges, candlelight, no people, no legible text, 35mm film grain"
      }
    },
    {
      id: "prop_fan_cat",
      name: "貓扇",
      aliases: ["團扇", "扇子", "貓扇"],
      traits:
        "Round silk fan, pale ground, a grey-white cat painted on it, dark bamboo handle, a few gold flecks",
      reference: {
        image: "refs/prop_fan_cat",
        status: "ready",
        prompt:
          "Product plate of a round silk fan, pale ground, a grey-white cat painted on it, dark bamboo handle, gold flecks, no people, no text, 35mm film grain"
      }
    },
    {
      id: "prop_umbrella_red",
      name: "紅油紙傘",
      aliases: ["紅傘"],
      traits: "Red oil-paper umbrella, bamboo ribs, wet glossy surface, gold-painted rim",
      reference: {
        image: "refs/prop_umbrella_red",
        status: "ready",
        prompt:
          "Product plate of a red oil-paper umbrella, bamboo ribs, wet glossy surface, gold-painted rim, rain, no people, no text, 35mm film grain"
      }
    },
    {
      id: "prop_umbrella_paper",
      name: "破紙傘",
      aliases: ["破紙傘", "紙傘"],
      traits: "Torn oil-paper umbrella, faded ochre, patched with grey cloth, bent bamboo ribs",
      reference: {
        image: "refs/prop_umbrella_paper",
        status: "ready",
        prompt:
          "Product plate of a torn oil-paper umbrella, faded ochre, patched with grey cloth, bent bamboo ribs, rain, no people, no text, 35mm film grain"
      }
    },
    {
      id: "prop_letter_summon",
      name: "宮中召信",
      aliases: ["召信", "信"],
      traits:
        "Folded rice-paper letter sealed with red wax, a small bronze medical token resting beside it",
      reference: {
        image: "refs/prop_letter_summon",
        status: "ready",
        prompt:
          "Top-down plate of a folded rice-paper letter sealed with red wax, a small bronze medical token beside it, afternoon light on a wooden table, no legible text, no people, 35mm film grain"
      }
    },
    {
      id: "prop_map_portraits",
      name: "雙臉圖",
      aliases: ["圖", "地圖", "手繪圖"],
      traits:
        "Hand-drawn map on rice paper, two female profiles facing each other, a double-headed arrow between them, ink brush marks",
      reference: {
        image: "refs/prop_map_portraits",
        status: "ready",
        prompt:
          "Top-down plate of a hand-drawn map on rice paper, two female profiles facing each other, a double-headed arrow between them, ink brush marks, candlelight, no legible text, 35mm film grain"
      }
    },
    {
      id: "prop_cat_mask",
      name: "白貓面具",
      aliases: ["貓面具", "面具"],
      traits: "White paper cat mask hanging on a stall, painted whiskers, empty eye holes",
      reference: {
        image: "refs/prop_cat_mask",
        status: "ready",
        prompt:
          "Product plate of a white paper cat mask hanging on a night-market stall, painted whiskers, empty eye holes, lantern light, no people, no text, 35mm film grain"
      }
    },
    {
      id: "prop_basket_greens",
      name: "菜籃",
      aliases: ["籃子", "菜籃"],
      traits: "Woven bamboo basket heaped with fresh greens, a strip of blue cloth tied to the handle",
      reference: {
        image: "refs/prop_basket_greens",
        status: "ready",
        prompt:
          "Product plate of a woven bamboo basket heaped with fresh greens, a strip of blue cloth tied to the handle, morning market light, no people, no text, 35mm film grain"
      }
    },
    {
      id: "prop_osmanthus_candy",
      name: "桂花糖",
      aliases: ["糖", "桂花糖"],
      traits: "Small paper packet of osmanthus candy, opened, pale amber pieces, a few crumbs",
      reference: {
        image: "refs/prop_osmanthus_candy",
        status: "ready",
        prompt:
          "Top-down plate of a small opened paper packet of osmanthus candy, pale amber pieces, a few crumbs, warm lamplight, no people, no text, 35mm film grain"
      }
    },
    {
      id: "prop_sewing_scissors",
      name: "繡剪",
      aliases: ["剪刀"],
      traits: "Small steel sewing scissors with worn brass handles, sharp points",
      reference: {
        image: "refs/prop_sewing_scissors",
        status: "ready",
        prompt:
          "Product plate of small steel sewing scissors with worn brass handles, sharp points, cloth scraps behind, no people, no text, 35mm film grain"
      }
    },
    {
      id: "prop_cat_ear_crown",
      name: "貓耳金冠",
      aliases: ["金冠", "貓耳冠"],
      traits:
        "Gold crown with two pointed cat-ear shapes, nine trailing tails, small red gems, heavy and bright",
      reference: {
        image: "refs/prop_cat_ear_crown",
        status: "ready",
        prompt:
          "Product plate of a gold crown with two pointed cat-ear shapes, nine trailing tails and small red gems, dark red silk background, no people, no text, 35mm film grain"
      }
    }
  ],

  locations: [
    {
      id: "loc_poster_split",
      name: "序章海報",
      aliases: ["海報", "封面"],
      traits:
        "Split studio backdrop, left half crimson and gold, right half grey-blue, a plain wooden chair and a carved stone railing, one embroidered cushion",
      reference: {
        image: "refs/loc_poster_split",
        status: "ready",
        prompt:
          "Wide poster plate split vertically, left half deep crimson and gold silk, right half grey-blue patched cloth, a plain wooden chair and a carved stone railing, one embroidered cushion at the seam, no people, no text, 35mm film grain"
      }
    },
    {
      id: "loc_mirror_room",
      name: "公主寢殿鏡台",
      aliases: ["鏡台", "寢殿"],
      traits:
        "Bronze mirror on a dark wood dressing table, jewelry boxes, red gauze curtains, a low couch, one warm lamp",
      reference: {
        image: "refs/loc_mirror_room",
        status: "ready",
        prompt:
          "Wide establishing plate of a princess's dressing room, bronze mirror on a dark wood table, jewelry boxes, red gauze curtains, low couch, warm lamp, no people, no text, 35mm film grain, 16:9"
      }
    },
    {
      id: "loc_palace_hall",
      name: "金殿",
      aliases: ["金殿", "龍椅", "朝堂"],
      traits:
        "Deep throne hall, red lacquer columns, gold dragon throne on a raised dais, twelve steps of red-gold carpet, incense smoke",
      reference: {
        image: "refs/loc_palace_hall",
        status: "ready",
        prompt:
          "Wide establishing plate of a deep palace throne hall, red lacquer columns, gold dragon throne on a raised dais, red-gold carpeted steps, incense smoke, no people, no legible text, 35mm film grain, 16:9"
      }
    },
    {
      id: "loc_balcony_night",
      name: "宮中高樓夜欄",
      aliases: ["欄杆", "高樓"],
      traits:
        "High palace balcony at night, carved stone railing, hanging lanterns, a large moon, city lights far below",
      reference: {
        image: "refs/loc_balcony_night",
        status: "ready",
        prompt:
          "Wide establishing plate of a high palace balcony at night, carved stone railing, hanging lanterns, large moon, city lights far below, no people, no text, 35mm film grain, 16:9"
      }
    },
    {
      id: "loc_market_day",
      name: "清晨市集",
      aliases: ["市集", "菜市"],
      traits:
        "Morning market street, vegetable stalls, steam from food pots, hanging cloth awnings, baskets, wet stone paving",
      reference: {
        image: "refs/loc_market_day",
        status: "ready",
        prompt:
          "Wide establishing plate of a morning market street, vegetable stalls, steam, hanging cloth awnings, baskets, wet stone paving, no people, no legible text, 35mm film grain, 16:9"
      }
    },
    {
      id: "loc_embroidery",
      name: "城南繡坊",
      aliases: ["繡坊"],
      traits:
        "Embroidery workshop, long wooden table, standing embroidery frame, thread spools, scissors, bolts of cloth, lattice window with afternoon light",
      reference: {
        image: "refs/loc_embroidery",
        status: "ready",
        prompt:
          "Wide establishing plate of an embroidery workshop, long wooden table, standing embroidery frame, thread spools, scissors, bolts of cloth, lattice window, afternoon light, no people, no legible text, 35mm film grain, 16:9"
      }
    },
    {
      id: "loc_palace_steps",
      name: "宮階",
      aliases: ["石階", "金階"],
      traits:
        "White stone palace stairs, wide steps, carved balustrades, cherry trees shedding petals, guards along both sides",
      reference: {
        image: "refs/loc_palace_steps",
        status: "ready",
        prompt:
          "Wide establishing plate of white stone palace stairs, wide steps, carved balustrades, cherry trees shedding petals, no people, no legible text, 35mm film grain, 16:9"
      }
    },
    {
      id: "loc_market_night",
      name: "上元夜長街",
      aliases: ["夜市", "上元夜"],
      traits:
        "Lantern-lit night market street, paper lanterns, stalls, hanging cat masks, streamers, a dense crowd",
      reference: {
        image: "refs/loc_market_night",
        status: "ready",
        prompt:
          "Wide establishing plate of a lantern-lit night market street, paper lanterns, stalls, hanging cat masks, streamers, dense crowd out of focus, no legible text, 35mm film grain, 16:9"
      }
    },
    {
      id: "loc_rain_steps",
      name: "雨夜長階",
      aliases: ["雨階", "長階"],
      traits:
        "Rain-soaked stone stairs at night, red leaves on wet steps, lanterns blurred by rain, dark trees, shallow puddles",
      reference: {
        image: "refs/loc_rain_steps",
        status: "ready",
        prompt:
          "Wide establishing plate of rain-soaked stone stairs at night, red leaves on wet steps, lanterns blurred by rain, dark trees, shallow puddles, no people, no text, 35mm film grain, 16:9"
      }
    },
    {
      id: "loc_study_night",
      name: "燭下書案",
      aliases: ["書案", "桌案"],
      traits:
        "Candlelit study, low wooden table, maps and scrolls, brush and ink, a chessboard at the edge, deep shadows",
      reference: {
        image: "refs/loc_study_night",
        status: "ready",
        prompt:
          "Wide establishing plate of a candlelit study, low wooden table, maps and scrolls, brush and ink, chessboard at the edge, deep shadows, no people, no legible text, 35mm film grain, 16:9"
      }
    },
    {
      id: "loc_carriage",
      name: "夜行車廂",
      aliases: ["車廂", "馬車"],
      traits:
        "Interior of a six-horse carriage at night, dark wood, padded benches, a small hanging lamp, city lights moving past the window",
      reference: {
        image: "refs/loc_carriage",
        status: "ready",
        prompt:
          "Wide plate of a six-horse carriage interior at night, dark wood, padded benches, small hanging lamp, city lights moving past the window, no people, no text, 35mm film grain, 16:9"
      }
    },
    {
      id: "loc_boat_cabin",
      name: "黃昏船艙",
      aliases: ["船艙", "船上"],
      traits:
        "Dusk boat cabin, wooden interior, window framing water and distant hills, low table with maps, scrolls, jade bracelets and an incense burner",
      reference: {
        image: "refs/loc_boat_cabin",
        status: "ready",
        prompt:
          "Wide plate of a dusk boat cabin, wooden interior, window framing water and distant hills, low table with maps, scrolls, jade bracelets and an incense burner, no people, no legible text, 35mm film grain, 16:9"
      }
    }
  ]
};
