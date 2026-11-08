/**
 * Chapter 1 entities: only what ch1 adds or restates.
 *
 * `entities` in data_entities.mjs stays the single source of truth for the shared cast
 * (Taylor, the steel rod, the tactical backpack, the riverbed...). Duplicating those here
 * would create a second copy that drifts, so this file holds:
 *
 *   additions  — new characters / props / locations that first appear in ch1
 *   overrides  — optional patches for a shared entity, only when the whole chapter changes it
 *
 * State changes are modelled as separate ids (`char_taylor_wounded`) rather than by
 * overriding `char_taylor`, because one id maps to one reference folder. A variant keeps
 * the same face prompt and adds a state clause; `base` records where it came from.
 */

const ref = (image, prompt, status = "to_generate") => ({ image, prompt, status });

export const additions = {
  characters: [
    {
      id: "char_taylor_wounded",
      name: "泰洛伊（負傷） (Taylor, Wounded)",
      aliases: ["泰洛伊", "泰洛伊上士"],
      base: "char_taylor",
      state: "wounded",
      traits:
        "Same 25-year-old East Asian woman as char_taylor: athletic and lean, high black ponytail, sharp dark eyes, strong jaw, sun-tanned skin. After the struggle: two fresh claw wounds across both shoulders, torn olive shirt, blood beads and streaks, river mud and sweat, dishevelled ponytail, grim exhausted expression",
      reference: ref(
        "refs/char_taylor_wounded",
        "Neutral front-facing reference portrait of the same 25-year-old East Asian woman as the base Taylor plate, athletic and lean, high black ponytail, sharp dark eyes, strong jaw, sun-tanned skin; now two fresh claw wounds across both shoulders, torn olive military shirt, blood beads and streaks, river mud and sweat, dishevelled ponytail, grim exhausted expression, head-and-shoulders framing, plain grey backdrop, hard overhead light, sharp focus, no text"
      )
    },
    {
      id: "char_injured_man",
      name: "車禍傷者 (The Injured Man)",
      aliases: ["傷者", "男子", "老兄"],
      traits:
        "30s East Asian man, gaunt pale face, bloodless lips, sweat-soaked short black hair, blood-soaked work shirt and jeans, legs crushed below the knees, grey with shock",
      reference: ref(
        "refs/char_injured_man",
        "Neutral front-facing reference portrait of a 30-something East Asian man, gaunt pale face, bloodless lips, sweat-soaked short black hair, blood-soaked work shirt, grey with shock, head-and-shoulders framing, plain grey backdrop, hard overhead light, sharp focus, no text"
      )
    },
    {
      id: "char_injured_man_turned",
      name: "轉化傷者 (The Turned Man)",
      aliases: ["怪物", "那頭怪物", "男子"],
      base: "char_injured_man",
      state: "turned",
      traits:
        "Same man as char_injured_man, now turned: bloodshot eyes, grey-purple necrotic skin, broken jaw with shattered teeth, blood-flecked mouth, clawed hands, torn blood-soaked work shirt",
      reference: ref(
        "refs/char_injured_man_turned",
        "Neutral front-facing reference portrait of the same 30-something East Asian man as the injured-man plate, now turned: bloodshot eyes, grey-purple necrotic skin, broken jaw with shattered teeth, blood-flecked mouth, torn blood-soaked work shirt, practical-effects makeup, head-and-shoulders framing, plain grey backdrop, hard overhead light, sharp focus, no text"
      )
    },
    {
      id: "char_boat_girl",
      name: "恐龍背包少女 (The Girl with the Dinosaur Backpack)",
      aliases: ["少女", "小妞"],
      traits:
        "14-16-year-old East Asian girl, small and slight, shoulder-length black hair, dirt-smudged face, deathly pale grey hands, ragged hoodie and shorts, feral crouching posture",
      reference: ref(
        "refs/char_boat_girl",
        "Neutral front-facing reference portrait of a 14-16-year-old East Asian girl, small and slight, shoulder-length black hair, dirt-smudged face, deathly pale grey hands, ragged hoodie and shorts, feral guarded expression, head-and-shoulders framing, plain grey backdrop, hard overhead light, sharp focus, no text"
      )
    }
  ],

  props: [
    {
      id: "prop_dino_backpack",
      name: "暴龍造型背包 (The Dinosaur Backpack)",
      aliases: ["恐龍背包", "暴龍背包", "綠色背包"],
      traits: "Oversized bright green T-rex shaped backpack, plush cartoon head and tail, worn seams, mud at the base",
      reference: ref(
        "refs/prop_dino_backpack",
        "Product plate of an oversized bright green T-rex shaped backpack, plush cartoon head and tail, worn seams, mud at the base, no text, 35mm film grain"
      )
    },
    {
      id: "prop_medical_kit",
      name: "隨身醫療包 (Field Medical Kit)",
      aliases: ["醫療包", "繃帶", "止血帶"],
      traits: "Small olive field medical pouch, opened, gauze rolls and a black tourniquet, bloodstained",
      reference: ref(
        "refs/prop_medical_kit",
        "Product plate of a small olive field medical pouch, opened, gauze rolls and a black tourniquet, bloodstained, no text, 35mm film grain"
      )
    },
    {
      id: "prop_military_knife",
      name: "軍用匕首 (Military Knife)",
      aliases: ["匕首", "軍刀"],
      traits: "Black tactical fixed-blade knife, worn grip, blood on the blade",
      reference: ref(
        "refs/prop_military_knife",
        "Product plate of a black tactical fixed-blade knife, worn grip, blood on the blade, no text, 35mm film grain"
      )
    }
  ],

  locations: [
    {
      id: "loc_canal_water_noon",
      name: "正午運河水域 (Canal Water, Noon)",
      aliases: ["河面", "運河", "河水"],
      traits:
        "Wide canal water at harsh noon, survivors and infected thrashing near the bank, dark red blooms in the turbid current, concrete bridge debris, no text",
      reference: ref(
        "refs/loc_canal_water_noon",
        "Wide establishing plate of canal water at harsh noon, survivors and infected thrashing near the bank, dark red blooms in the turbid current, concrete bridge debris, no people in the foreground, no text, 35mm film grain, 16:9"
      )
    },
    {
      id: "loc_riverbank_noon",
      name: "正午河岸樹叢 (Riverbank Treeline, Noon)",
      aliases: ["河岸", "樹叢", "岸邊"],
      traits:
        "Riverside embankment at harsh noon, dense green tree line on one side, wide canal on the other, gravel and dry grass, hard short shadows, no shelter, no text",
      reference: ref(
        "refs/loc_riverbank_noon",
        "Wide establishing plate of a riverside embankment at harsh noon, dense green tree line on one side, wide canal on the other, gravel and dry grass, hard short shadows, no people, no text, 35mm film grain, 16:9"
      )
    },
    {
      id: "loc_fishing_boat_exterior",
      name: "擱淺漁船外觀 (Grounded Fishing Boat)",
      aliases: ["漁船", "船"],
      traits:
        "Large derelict fishing trawler grounded and half-tilted on the riverbank, barnacles crusting the hull, rusted rails, muddy waterline, harsh noon light, no text",
      reference: ref(
        "refs/loc_fishing_boat_exterior",
        "Wide establishing plate of a large derelict fishing trawler grounded and half-tilted on a riverbank, barnacles crusting the hull, rusted rails, muddy waterline, harsh noon light, no people, no text, 35mm film grain, 16:9"
      )
    },
    {
      id: "loc_fishing_boat_deck",
      name: "漁船船艙走道 (Flooded Boat Corridor)",
      aliases: ["船艙", "走道"],
      traits:
        "Flooded three-level fishing boat interior, narrow wet wooden corridor, turbid water rising in the lowest deck, peeling paint, dim light from hatch openings, no text",
      reference: ref(
        "refs/loc_fishing_boat_deck",
        "Wide establishing plate of a flooded three-level fishing boat interior, narrow wet wooden corridor, turbid water rising in the lowest deck, peeling paint, dim light from hatch openings, no people, no text, 35mm film grain, 16:9"
      )
    },
    {
      id: "loc_boat_captain_cabin",
      name: "船長室 (Captain's Cabin)",
      aliases: ["船長室", "艙房"],
      traits:
        "Small derelict captain's cabin, white door with faded Chinese nameplate, rotting wooden floor, scattered charts and a sailor's corpse, dim green-grey light, no text",
      reference: ref(
        "refs/loc_boat_captain_cabin",
        "Wide establishing plate of a small derelict captain's cabin, white door with a faded Chinese nameplate, rotting wooden floor, scattered charts, dim green-grey light, no people, no text, 35mm film grain, 16:9"
      )
    }
  ]
};

/**
 * Patch a shared entity for the whole chapter. Empty here: ch1 keeps the clean Taylor
 * until the shoulder reveal, then switches to `char_taylor_wounded`.
 */
export const overrides = {};
