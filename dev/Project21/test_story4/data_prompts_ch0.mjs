/**
 * Authored prompt beats for ch0 — action, camera, sound, music.
 *
 * Everything that must stay identical across the chapter is NOT here: the style lock,
 * the scene nouns, the character feature anchors and the <d> lines are injected by
 * build_prompts_ch0.mjs from the plan. This file only holds what changes shot to shot.
 *
 *   a  action / expression / state change, observable, English only
 *   c  camera: framing, position, movement (builder prefixes "The camera")
 *   s  environment, action sound, non-verbal voice (no dialogue, no music)
 *   m  non-diegetic music (instrument, rhythm, dynamics)
 *
 * Optional: shots / cast / tone / wear / set / palette / light.
 *
 * The dressing room appears twice, at dawn in scene one and at night in scene seven:
 * only the time in the set, the light and the wardrobe change, never the fixed nouns.
 */

export const beats = {
  seg_001: {
    set: "The frame is pure black, with no texture, no edge and no object in it.",
    palette: "",
    light: "the light is only what the two lines carry",
    cast: [],
    a: "A thin crimson line and a thin grey-blue line rest together on the exact centre of the black, then draw slowly apart, opening a widening black gap between them. No figures and no lettering.",
    c: "holds dead still, full frame, and lets the two lines separate by themselves.",
    s: "A near-silent room tone, one soft fabric shift, and nothing else.",
    m: "A single low bowed note, held without vibrato, fading as the gap opens.",
  },

  seg_002: {
    a: "Two women sit back to back on the wooden chair, one in crimson and gold, one in grey-blue, neither looking at the other; the grey-white cat sits on the cushion exactly on the seam between the two halves, a small blank plaque hanging at its neck, no legible text anywhere in frame.",
    c: "holds a wide symmetrical plate, the seam and the cushion on the centre line, then drifts a few centimetres closer.",
    s: "A quiet studio silence with one soft cat breath, cloth settling, and a faint bell.",
    m: "A slow two-note figure on a plucked zither, repeating once, unresolved.",
  },

  seg_003: {
    cast: ["char_anian","char_cat"],
    a: "The market woman (S1) sits on the low stone railing with the basket on her knees, her eyes on something off frame, her lips together and her jaw still while the words run under the image.",
    c: "holds a medium shot from the grey-blue side, the cat and the cushion sharp between her and the empty chair.",
    s: "A market street far away, a basket creaking once, her slow breath.",
    m: "A single plucked string under the voice, no rhythm.",
    shots: [{"at":"00:06.000","a":"Closer on the railing: her hand resting flat on the basket lid, the cat's eyes opening and settling on her, the crimson chair just inside the frame, her mouth still closed.","c":"drifts slowly along the railing, keeping the cat and her hand in the same plane, the empty chair soft at the edge."}],
  },

  seg_004: {
    cast: ["char_zhaoning","char_cat"],
    a: "The princess (S2) sits upright in the wooden chair, spine straight, hands folded, her lips closed and her eyes fixed ahead while the words run under the image.",
    c: "holds the same wide plate from the crimson side, the gold silk flat behind her, the cat still on the seam.",
    s: "Silk moving against silk, a distant hall tone, her even breath.",
    m: "The same plucked figure, a fourth lower, held longer.",
    shots: [{"at":"00:06.000","a":"Closer on her folded hands and the crimson silk across her lap, the gold ground flat behind, her jaw completely still.","c":"drifts down to the hands and holds, her face soft at the top of frame."},{"at":"00:11.000","a":"Back out to the wide plate: she is still sitting straight, the cat still on the seam, the two halves of the poster exactly as they were, the empty space beside her lit and unused.","c":"eases back to the symmetrical wide and stops."}],
  },

  seg_005: {
    a: "The princess (S2) sits in the chair and the market woman (S1) sits on the railing beside her, the basket on her knees, the cat on the cushion between them; neither turns her head, both looking past the frame in different directions.",
    c: "holds static, a wide two-shot with the chair, the railing and the cushion all inside the frame.",
    s: "One cat breath, the basket settling, cloth brushing stone.",
    m: "The two-note figure completes itself and stops.",
  },

  seg_006: {
    cast: ["char_cat"],
    a: "The grey-white cat sits alone on the embroidered cushion, tail wrapped around its paws, eyes half shut, mouth closed, the small bell at its neck completely still.",
    c: "holds a low medium shot at cat height, the two women soft and out of focus on either side of the frame.",
    s: "A cat's slow breath, one soft blink of cloth, the bell touching once.",
    m: "A dry plucked note, amused, played alone.",
  },

  seg_007: {
    cast: ["char_anian","char_cat"],
    a: "The market woman (S1) turns her face a few degrees toward the chair beside her, one hand flat on the basket lid, and speaks without leaning in.",
    c: "holds a medium shot from her side of the seam, the cat and the crimson sleeve staying in frame.",
    s: "The basket handle creaking under her hand, a far market murmur, her breath before the line.",
    m: "A single low pluck on the beat she starts speaking.",
  },

  seg_008: {
    cast: ["char_zhaoning","char_cat"],
    a: "The princess (S2) keeps her face forward and does not turn her head; only her eyes move toward the woman beside her, and her hands stay folded in her lap.",
    c: "holds static in a medium shot, both profiles in frame, the cat sharp on the seam between them.",
    s: "Silk shifting once, a distant hall tone, a shallow breath.",
    m: "One held low note under the line, then silence.",
  },

  seg_009: {
    cast: ["char_zhaoning","char_cat","char_qinghe"],
    a: "The princess (S2) turns her head over her shoulder toward the camera, and the red gauze slides off one shoulder as she moves; in the bronze mirror behind her the same face is already looking back, a beat out of step with her body. The cat lies on the cushion beside a box of pearls, one paw hooked over the lid.",
    c: "holds a medium shot, the bronze mirror filling the right half of the frame, the gauze and the doorway still readable on the left.",
    s: "Gauze sliding off silk, one pearl rolling in its box, a cat's heavy exhale, a maid's footsteps stopping at the threshold.",
    m: "A low sustained cello note entering under the mirror's reflection.",
  },

  seg_010: {
    cast: ["char_qinghe","char_zhaoning"],
    a: "The maid (S4) stands at the doorway with her hands folded, chin lowered, and speaks to the woman at the mirror without stepping inside.",
    c: "holds a medium shot from inside the room, the mirror edge and the red gauze in the foreground, the maid framed in the lit doorway.",
    s: "A door curtain settling, a distant bell from the corridor, the maid's light breath.",
    m: "A quiet plucked pulse, one note per two seconds.",
  },

  seg_011: {
    cast: ["char_zhaoning","char_cat"],
    a: "The princess (S2) lifts one hand and tilts her chin toward the glass, her eyes on the reflection rather than on the maid.",
    c: "holds a medium shot with the mirror filling the right half, so both the back of her head and the reflected face are in frame.",
    s: "A bracelet sliding down her wrist, the cat's tail tapping the cushion once.",
    m: "The pulse thins to a single held note.",
  },

  seg_012: {
    cast: ["char_qinghe"],
    a: "The maid (S4) glances at the mirror, then back at her mistress, and answers with her hands still folded.",
    c: "holds a medium shot over the princess's shoulder, the maid small in the lit doorway, the corridor receding behind her.",
    s: "Her quick breath, cloth at her waist, the corridor draught in the curtain.",
    m: "N/A",
  },

  seg_013: {
    cast: ["char_zhaoning","char_cat"],
    a: "The princess (S2) looks straight into the mirror and holds there, her expression unchanged, one fingertip resting on the table edge.",
    c: "pushes in slowly toward the glass until her reflected eyes fill the right third, the room still visible around them.",
    s: "A fingertip on lacquer, the pearl box lid settling, a slow breath.",
    m: "A low string swell rising and stopping short.",
  },

  seg_014: {
    cast: ["char_qinghe","char_zhaoning"],
    a: "The maid (S4) takes half a step forward, then stops herself, her hands tightening on each other.",
    c: "holds a medium shot from the doorway side, the princess's shoulder dark in the left foreground.",
    s: "One step on boards, cloth pressed between her palms, a held breath.",
    m: "A single muted pluck.",
  },

  seg_015: {
    cast: ["char_zhaoning","char_cat"],
    a: "The princess (S2) does not turn around; her eyes stay on the glass and one corner of her mouth moves very slightly while she speaks.",
    c: "holds the mirror two-shot, her back in the foreground and her face reflected in the glass.",
    s: "The cat shifting its weight on the cushion, gauze whispering, a faint bell.",
    m: "A warm low chord, brief.",
  },

  seg_016: {
    cast: ["char_qinghe"],
    a: "The maid (S4) lifts her head quickly, then lowers it again, her mouth closing on the answer.",
    c: "holds a medium shot, the lattice window behind her throwing soft bars across the wall.",
    s: "Her sharp intake of breath, the tray edge knocking her sleeve.",
    m: "N/A",
  },

  seg_017: {
    cast: ["char_zhaoning","char_cat"],
    a: "The princess (S2) smiles with her mouth only, her eyes staying flat, and turns the pearl box a quarter turn with one finger.",
    c: "holds static in a medium shot, the bronze mirror and her reflection both in frame.",
    s: "The pearl box turning on wood, one pearl rolling, the cat's tail dragging the cushion.",
    m: "A single low note, sour at the edge, left to decay.",
  },

  seg_018: {
    a: "The princess (S2) stands beside the gold throne with the round silk fan held against her waist, her twelve-fold skirt spread down the top step; the court eunuch (S5) waits at the foot of the dais, and the cat sits on a brocade cushion below the throne like a second occupant.",
    c: "holds a wide shot from the foot of the dais, the red columns and the twelve-step carpet filling the frame down to the camera.",
    s: "Incense shifting in a burner, a robe hem settling on stone, a bell from the far end of the hall, the cat's slow breath.",
    m: "A low drum hit, then a sustained drone under the hall.",
  },

  seg_019: {
    cast: ["char_cui","char_zhaoning"],
    a: "The court eunuch (S5) bows from the waist with his sleeves folded, his eyes on the carpet rather than on her face.",
    c: "holds a medium shot from the side of the dais, the eunuch low in frame and the throne base rising behind him.",
    s: "Sleeves folding, one sandal scuffing the carpet, incense ticking in the burner.",
    m: "The drone develops a slow pulse.",
  },

  seg_020: {
    cast: ["char_zhaoning"],
    a: "The princess (S2) turns the fan a few degrees in her hand and looks down the steps at him, her chin lifting slightly.",
    c: "holds a medium shot from below, the dais steps and a red column behind her.",
    s: "The fan's bamboo rib clicking once against her palm.",
    m: "The pulse stops on her line.",
  },

  seg_021: {
    cast: ["char_cui","char_zhaoning"],
    a: "The court eunuch (S5) keeps his bow and answers without raising his head, one hand appearing from his sleeve.",
    c: "holds static, a medium shot with the eunuch in the lower third and the carpet running out of frame.",
    s: "Fabric over fabric, a low hall echo, his dry breath.",
    m: "N/A",
  },

  seg_022: {
    cast: ["char_zhaoning","char_cui"],
    a: "The princess (S2) steps down one stair, the fan now hanging at her side, and looks at him levelly.",
    c: "holds a wide-to-medium shot, the whole dais and the standing eunuch in the same frame, the cat sharp at the left edge.",
    s: "One silk hem brushing stone, incense, a distant door.",
    m: "A single low bowed note entering.",
  },

  seg_023: {
    cast: ["char_cui"],
    a: "The court eunuch (S5) lifts his head just enough to show his eyes, then lowers it again; his hands stay inside his sleeves.",
    c: "holds a medium shot on him, the red column behind and the carpet below.",
    s: "A sleeve shifting, a swallow, the burner ticking.",
    m: "N/A",
  },

  seg_024: {
    cast: ["char_zhaoning","char_cui","char_cat"],
    tone: "flat and quiet, every word placed",
    a: "The princess (S2) stands very still at the edge of the top step, the fan held against her skirt, and speaks without raising her voice; the eunuch's shoulders do not move and the cat's head turns toward her.",
    c: "holds static in a wide-to-medium shot, the throne, the eunuch and the cat all inside the frame.",
    s: "A hall so quiet the incense can be heard, one robe hem settling, a cat's soft exhale.",
    m: "A low drone swelling very slightly, no rhythm.",
  },

  seg_025: {
    cast: ["char_cui"],
    a: "The court eunuch (S5) bows lower than before, his forehead nearly to his sleeve, and stays there.",
    c: "holds static, a medium shot from the side, the dais steps filling the upper frame.",
    s: "Sleeves folding twice, a knee settling on carpet, a dry breath.",
    m: "N/A",
  },

  seg_026: {
    cast: ["char_cat","char_cui","char_zhaoning"],
    a: "The cat sits upright on its cushion, nose lifted, whiskers forward, mouth closed, and does not look at either of them while the words run under the image.",
    c: "holds a low close-to-medium shot at cat height, the eunuch's red sleeve and the princess's skirt soft behind it.",
    s: "A cat sniffing twice, the bell at its neck touching once, incense, cloth.",
    m: "A dry plucked note, then a low held tone.",
  },

  seg_027: {
    a: "The princess (S2) leans on the carved stone railing with both forearms, her wide sleeves moving in the night wind; the cat lies along the railing beside her, chin on its paws, both facing the same direction. The moon sits high over the roofs, and the city lights run out below the balustrade.",
    c: "holds a wide shot from behind the railing, the moon and roofs in the upper third, the railing sharp in the foreground.",
    s: "Wind through the eaves, a lantern rope creaking, distant city noise far below, the cat's breathing.",
    m: "A sparse high harmonic over a low held string.",
  },

  seg_028: {
    cast: ["char_zhaoning"],
    a: "The princess (S2) turns her head a little toward the cat and speaks into the night, her hands still on the stone.",
    c: "holds a medium shot from her shoulder side, the moon and roof line staying in the right third.",
    s: "Wind in her sleeve, a lantern ticking against its bracket, her breath.",
    m: "The harmonic continues alone.",
  },

  seg_029: {
    cast: ["char_cat"],
    a: "The cat keeps its chin on its paws and looks out over the city, mouth closed, tail lying still along the stone.",
    c: "holds a close-to-medium shot at railing height, the city lights soft and wide behind its head.",
    s: "The cat's slow breath, wind over the balustrade, a far-off cart.",
    m: "A single low pluck under the voice.",
  },

  seg_030: {
    cast: ["char_zhaoning"],
    a: "The princess (S2) lifts one hand from the railing and points her chin at the lights below, her expression loosening for the first time.",
    c: "holds a medium shot that keeps the drop beyond the railing in frame, the city small and bright under her sightline.",
    s: "Wind, a distant night bell, fabric flapping once.",
    m: "A warm low chord, unresolved.",
  },

  seg_031: {
    cast: ["char_cat"],
    a: "The cat turns its head toward her, ears forward, mouth closed, and stays looking at her face.",
    c: "holds a medium shot at cat height, her sleeve and the railing both sharp in the same plane.",
    s: "A tail tapping stone twice, wind, a lantern creak.",
    m: "N/A",
  },

  seg_032: {
    cast: ["char_zhaoning","char_cat"],
    a: "The princess (S2) keeps looking out, and after a long pause her grip on the railing tightens; she answers without turning her head.",
    c: "holds static in a wide two-shot, railing, moon and the two silhouettes on the same line.",
    s: "Wind, a long silence, the cat's exhale, a lantern rope creaking.",
    m: "The low string returns and holds under the last word.",
  },

  seg_033: {
    a: "The market woman (S1) walks toward the camera with a full basket of greens on her hip, the cat keeping pace at her right foot with its tail high; the vegetable vendor (S6) leans out over his stall as she passes, hands still wet from the water jar.",
    c: "tracks back ahead of her at walking pace, a wide-to-medium shot with the stalls, the steam and the awnings filling both sides and receding down the street.",
    s: "A market waking up: vendors calling far off, steam hissing from a pot, water thrown on stone, the cat's claws on paving.",
    m: "A light plucked pattern, two notes, warm and unhurried.",
  },

  seg_034: {
    cast: ["char_vendor","char_anian"],
    a: "The vegetable vendor (S6) lifts a bundle of greens off the pile and holds it out, water running off his wrist, grinning at her.",
    c: "holds a medium shot from her side, his stall and the hanging awnings filling the background, the wet stone at the bottom of frame.",
    s: "Water dripping off a hand, greens rustling, a stall board creaking.",
    m: "The plucked pattern continues under his voice.",
  },

  seg_035: {
    cast: ["char_anian","char_vendor"],
    a: "The market woman (S1) stops, shifts the basket onto her hip, and looks at the bundle rather than at him, one eyebrow lifting.",
    c: "holds a medium shot at her shoulder, the stall and his hands still in frame.",
    s: "The basket handle creaking, a woman laughing two stalls down, her breath.",
    m: "N/A",
  },

  seg_036: {
    cast: ["char_vendor","char_anian"],
    a: "The vegetable vendor (S6) laughs with his whole chest and slaps the stall board once, his straw hat shifting back.",
    c: "holds a medium shot from across the stall, the greens stacked in the foreground.",
    s: "A palm hitting wood, his laugh, greens settling.",
    m: "One warm plucked phrase, then out.",
  },

  seg_037: {
    cast: ["char_anian","char_vendor"],
    a: "The market woman (S1) answers without smiling, thumbing a leaf off the bundle and putting it back on his pile.",
    c: "holds a medium shot, both faces in profile at the stall edge, the street still moving behind them.",
    s: "A leaf snapping off, the basket shifting, cart wheels on stone nearby.",
    m: "N/A",
  },

  seg_038: {
    cast: ["char_vendor","char_anian"],
    a: "The vegetable vendor (S6) sobers, wiping his hands on his apron, his voice dropping into something quieter.",
    c: "holds a medium shot on him, the stall posts framing him, her shoulder dark in the foreground.",
    s: "Hands dried on cloth, a distant cart, street noise softening.",
    m: "A low plucked note under the question.",
  },

  seg_039: {
    cast: ["char_anian","char_vendor"],
    a: "The market woman (S1) pauses half a beat before answering, and her fingers close hard around the basket rim, knuckles whitening.",
    c: "holds a medium shot and drifts down slightly, so the hand on the basket rim is in the lower third.",
    s: "Wicker creaking under her grip, a breath held, the market continuing behind her.",
    m: "The plucked note holds and does not resolve.",
  },

  seg_040: {
    cast: ["char_vendor","char_anian"],
    a: "The vegetable vendor (S6) nods once, satisfied, and turns back to his pile to weigh out the bundle.",
    c: "holds a medium shot, the scales and the greens in the foreground, her back going out of frame.",
    s: "A brass weight set down, greens packed, his humming.",
    m: "N/A",
  },

  seg_041: {
    cast: ["char_cat","char_anian"],
    a: "The cat sits down in the middle of the paving and looks up at her hand on the basket, mouth closed, tail wrapping around its own feet while the words run under the image.",
    c: "holds a low shot at cat height, her hand and the basket rim sharp above it, the market soft behind.",
    s: "The cat's slow breath, a stall shutter banging once, water running in a gutter.",
    m: "A single dry pluck, almost a laugh.",
  },

  seg_042: {
    a: "The market woman (S1) stands at the long table with a folded letter open in both hands, a red wax seal broken at the fold; the cat sits on the table facing her. The lattice window throws a grid of light across the boards, the thread spools and the small scissors.",
    c: "holds a medium shot from across the table, the lattice light and the cloth bolts staying readable behind her.",
    s: "Paper unfolding, a thread spool rolling to a stop, the cat's tail sweeping the table.",
    m: "A single sustained note on a bowed string.",
  },

  seg_043: {
    cast: ["char_anian","char_cat"],
    a: "The market woman (S1) reads aloud with her eyes moving down the page, one finger tracking under the lines, her voice flat with the effort of getting the words right.",
    c: "holds a medium shot, the letter sharp in her hands, the cat's head in the lower corner of frame.",
    s: "Paper shifting under her finger, her voice close, the workshop creaking.",
    m: "The sustained note thins out.",
  },

  seg_044: {
    cast: ["char_anian","char_cat"],
    a: "The market woman (S1) lifts her head from the letter and looks directly at the cat, the paper still open in her hands.",
    c: "holds a two-shot across the table, her face and the cat's face on the same level, the workshop behind.",
    s: "Paper lowering, a stool leg scraping, the cat's exhale.",
    m: "N/A",
  },

  seg_045: {
    cast: ["char_cat","char_anian"],
    a: "The cat does not move, mouth closed, eyes fixed on her face while the words run under the image; one ear turns toward the window.",
    c: "holds a close-to-medium shot on the cat across the table, her hands and the letter soft in the foreground.",
    s: "The cat's breathing, paper edge ticking, a distant street seller.",
    m: "A low plucked note, held.",
  },

  seg_046: {
    cast: ["char_anian","char_cat"],
    a: "The market woman (S1) folds the letter in half along its old crease, presses it flat with her palm, and speaks to the table more than to the cat.",
    c: "holds a medium shot from slightly above, the table, the letter and her hands filling the lower frame.",
    s: "Paper creasing, her palm on wood, a thread spool settling.",
    m: "A single low note under the line.",
  },

  seg_047: {
    cast: ["char_anian","char_cat"],
    a: "The market woman (S1) folds the letter again, smaller, and tucks it inside her robe at the breast, then holds her hand flat over it for a moment.",
    c: "holds a close medium shot on her hands and chest, the workshop and the cat still visible at the frame edges.",
    s: "Cloth folding over paper, one breath, the cat's tail on the boards.",
    m: "The sustained note returns and stops when her hand settles.",
  },

  seg_048: {
    cast: ["char_zhaoning","char_anian","char_guard","char_cat"],
    a: "The princess (S2) stands high on the stone stairs with her skirt spread down two steps; the market woman (S1) kneels far below, her basket beside her knees, and the guard captain (S7) stands over her with a hand on his hilt; the cat sits on a cushion at the turn of the steps. Cherry petals cross the gap between the two women.",
    c: "holds a wide shot from below the steps, the stairs, the balustrades and both ranks of guards filling the frame, the height difference the whole composition.",
    s: "Petals in the wind, armour plates shifting, a basket settling on stone, a distant gate bell.",
    m: "A low drum under a high thin string.",
  },

  seg_049: {
    cast: ["char_guard","char_anian"],
    tone: "hard and loud, parade-ground",
    a: "The guard captain (S7) steps in and slams his palm onto the kneeling woman's shoulder, forcing her lower; his other hand stays on the hilt.",
    c: "holds a low medium shot from the side, the steps rising steeply behind them, armour filling the left of frame.",
    s: "A palm on cloth, armour plates clashing, a boot grinding stone.",
    m: "The drum strikes once with the hand.",
  },

  seg_050: {
    cast: ["char_anian","char_guard"],
    a: "The market woman (S1) is already on both knees, palms flat on the stone, her head down and her voice careful; the basket sits upright beside her, greens spilling over the rim.",
    c: "holds a medium shot from low on the steps, her hands on the stone in the foreground, the guard's boots behind.",
    s: "Her palms on stone, greens shifting, the guard's breath above her.",
    m: "N/A",
  },

  seg_051: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) looks down the length of the stairs at the kneeling figure and speaks without moving from her step.",
    c: "holds a wide-to-medium shot from below, her figure at the top of frame and the kneeling woman small at the bottom.",
    s: "Wind through the balustrade, petals, a distant gate bell.",
    m: "The high string rises a tone.",
  },

  seg_052: {
    cast: ["char_anian","char_guard"],
    a: "The market woman (S1) keeps her head down and her shoulders rounded, her voice barely carrying up the steps.",
    c: "holds a close-to-medium shot from above and behind her, the stone steps filling the frame beyond.",
    s: "Her voice near the stone, a petal landing, armour creaking.",
    m: "N/A",
  },

  seg_053: {
    cast: ["char_zhaoning","char_anian"],
    tone: "flat, hard, no breath",
    a: "The princess (S2) does not raise her voice; she lifts one hand an inch from her skirt and holds it there, and every guard on the stairs goes still.",
    c: "holds static, a wide shot from below, the whole stair and both rows of guards, her raised hand at the centre.",
    s: "Armour going quiet, wind, one petal tapping stone.",
    m: "The drum and string both cut to silence on her line.",
  },

  seg_054: {
    a: "The market woman (S1) lifts her face and looks straight up the stairs. The princess (S2) looks back. Neither moves; wind pushes a drift of petals between them and the guards hold their positions around the silence.",
    c: "holds a long wide two-shot from the side of the stairs, both faces readable, the balustrade and the petals crossing the middle of the frame.",
    s: "Wind, petals, a single bird, the smallest shift of silk.",
    m: "A single low note fading in under the silence.",
  },

  seg_055: {
    cast: ["char_zhaoning","char_qinghe"],
    a: "The princess (S2) turns her head slightly toward the maid without taking her eyes off the woman below, and speaks quietly.",
    c: "holds a medium two-shot from behind the maid's shoulder, the princess and the stair behind her.",
    s: "A tray shifting in the maid's hands, wind, the retreat of a guard's boot.",
    m: "N/A",
  },

  seg_056: {
    cast: ["char_qinghe","char_zhaoning"],
    a: "The maid (S4) takes a half step forward and stops, the tray tilted in her hands, her mouth open on the protest.",
    c: "holds a medium shot on her, the princess's sleeve sharp at the edge of frame.",
    s: "A tray edge ticking, her quick breath, cloth twisting.",
    m: "N/A",
  },

  seg_057: {
    cast: ["char_zhaoning","char_qinghe"],
    tone: "low, level, final",
    a: "The princess (S2) turns her head fully toward the maid this time; the guards behind her begin to withdraw, boots finding the steps one after another.",
    c: "holds a wide-to-medium shot, the maid backing out of the foreground, the princess fixed at the top of the stairs.",
    s: "Boots on stone, armour receding, wind, a gate bell far off.",
    m: "The drum returns once, soft, and stops.",
  },

  seg_058: {
    cast: ["char_zhaoning","char_anian","char_cat"],
    a: "The princess (S2) sits on a step with one hand propping her chin; the market woman (S1) sits a step lower, her face lifted, the patch on her knee facing the camera; the cat sits on the stone exactly between them, eyes on the space between their faces.",
    c: "holds a medium two-shot from the side, the balustrade and the falling petals still visible behind both faces.",
    s: "Petals, silk settling on stone, the cat's tail tapping twice, distant footsteps gone.",
    m: "A single plucked note, then a held low string.",
  },

  seg_059: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) lowers her hand from her chin and studies the other woman's face without any expression at all.",
    c: "holds a medium shot from over the kneeling woman's shoulder, the princess's face centred, the stairs behind.",
    s: "A petal landing on silk, wind, a shallow breath.",
    m: "N/A",
  },

  seg_060: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) answers at once, her hands flat on her own knees, her chin lifting a little.",
    c: "holds a medium shot from over the princess's shoulder, her face in the right third, the stone steps leading away.",
    s: "Her breath, cloth under her palms, wind in the balustrade.",
    m: "N/A",
  },

  seg_061: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) tilts her head a fraction, repeating the single syllable back at her, and waits.",
    c: "holds a close-to-medium shot on the princess, the other woman's shoulder soft in the foreground.",
    s: "Silence, a petal, one bird far off.",
    m: "A single low pluck under the question.",
  },

  seg_062: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) looks down at her own hands while she answers, then up again at the end, her voice staying level the whole way.",
    c: "holds a medium shot on her, the stairs and the drifting petals behind, the princess's skirt at the frame edge.",
    s: "Wind, cloth, a long breath taken before the last words.",
    m: "A low string enters under the middle of the line and holds.",
  },

  seg_063: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) reaches out with one hand, palm up, and waits for it, her eyes dropping to the other woman's collar.",
    c: "holds a medium shot from the side, both hands in the lower frame, both faces above.",
    s: "A bracelet sliding, wind, a held breath.",
    m: "N/A",
  },

  seg_064: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) closes one hand over her own collar and leans back a few centimetres, her chin tucking.",
    c: "holds a close medium shot, her hand and collar sharp, the outstretched hand soft in the foreground.",
    s: "Cloth pulled tight, a quick breath, wind.",
    m: "A low note, held.",
  },

  seg_065: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) withdraws her hand and opens the collar of her own robe instead, two fingers hooking the red cord underneath.",
    c: "holds a medium shot, her hands at her own throat, the other woman watching from the lower frame.",
    s: "Cloth opening, a cord drawn out, wind, a petal.",
    m: "N/A",
  },

  seg_066: {
    cast: ["char_zhaoning","char_anian","char_cat"],
    a: "The princess (S2) draws out the half of a white jade pendant on its red cord and holds it flat on her palm; the market woman (S1) lifts the matching half from her own collar, and the two broken edges meet in the middle of the frame and fit. The cat leans in, nose almost touching the stone.",
    c: "holds a medium two-shot with the hands and the joined jade at dead centre, both faces above and the cat below.",
    s: "Jade touching jade, one soft click, a cord tightening, the cat's sniff.",
    m: "A single clear struck note, left to ring.",
  },

  seg_067: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) keeps her eyes on the joined jade and speaks very quietly, her hand still open under it.",
    c: "holds a close-to-medium shot from the side, both hands and both faces in the same plane.",
    s: "A held breath, wind, the faint click of the cord.",
    m: "The struck note decays into a low string.",
  },

  seg_068: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) closes her fingers over both halves, then looks up at her and shakes her head once.",
    c: "holds a medium shot on the princess, the joined jade caught in her fist in the lower frame.",
    s: "Fingers closing on jade, a breath, a petal landing.",
    m: "N/A",
  },

  seg_069: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) frowns slightly, one hand still raised, and asks the question straight at her.",
    c: "holds a medium shot on her, the balustrade and the petals behind.",
    s: "Her voice close, wind in the balustrade.",
    m: "N/A",
  },

  seg_070: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) looks away down the stairs, her jaw working once, and answers without turning back.",
    c: "holds a medium shot from her profile, the long stairs falling away behind her.",
    s: "Wind, a far gate bell, silk moving once.",
    m: "A low plucked figure, unresolved.",
  },

  seg_071: {
    cast: ["char_cat","char_zhaoning","char_anian"],
    a: "The cat sits between them with its eyes half closed, mouth shut, and slowly wraps its tail around its own paws while the words run under the image.",
    c: "holds a low medium shot at cat height, the two women's knees and hands above it, the petals still crossing frame.",
    s: "A cat's exhale, jade settling against cloth, wind.",
    m: "One dry plucked note and a low held tone beneath it.",
  },

  seg_072: {
    a: "The market woman (S1) pulls a small wooden cart down the lantern-lit street, the cat sitting upright in a bamboo basket on the cart; a white paper cat mask hangs on the left stall, and two stalls back the hooded figure keeps the same distance from her. The lantern lines run away into the crowd.",
    c: "tracks with her at walking pace, a wide-to-medium shot holding the cart, the cat and the hooded figure in the same depth of frame.",
    s: "A crowd around them, a cart wheel on stone, lantern paper ticking, a vendor calling a price, the cat's bell.",
    m: "A bright plucked pattern over a soft crowd hum, festive and slightly thin.",
  },

  seg_073: {
    cast: ["char_anian","char_cat"],
    a: "The market woman (S1) keeps walking and does not look back; she speaks over her shoulder to the cat in the basket, her hand steady on the cart rope.",
    c: "holds a medium shot from in front of the cart, her face lit by lanterns, the street out of focus past her shoulder.",
    s: "A cart wheel, the crowd, her voice low under the noise.",
    m: "The plucked pattern continues, quieter.",
  },

  seg_074: {
    cast: ["char_zhaoning"],
    a: "The hooded figure (S2) keeps walking inside the crowd, the hood low, her hands hidden in the cloak, and says nothing at all.",
    c: "holds a medium shot at the edge of the crowd, lanterns passing in front of her face, the stall cloth behind.",
    s: "Footsteps in a crowd, lantern paper, a distant drum.",
    m: "N/A",
  },

  seg_075: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) slows the cart and turns her head just enough to speak sideways, still not looking back.",
    c: "holds a medium two-shot along the line of the street, her face in the foreground and the hooded figure small and sharp behind.",
    s: "Cart wheel slowing, the crowd, her breath before the line.",
    m: "The plucked pattern drops away to a held note.",
  },

  seg_076: {
    cast: ["char_zhaoning","char_anian"],
    a: "The hooded figure (S2) stops, then takes one more step, her voice muffled by the hood and the crowd.",
    c: "holds a medium shot on her, lantern light sliding over the hood and off it.",
    s: "Cloth shifting, the crowd, a lantern creaking above.",
    m: "N/A",
  },

  seg_077: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) stops the cart entirely and turns around, one hand on the handle, and looks at the hooded figure without any deference at all.",
    c: "holds a medium shot from her side, the cart and the cat in the foreground, the crowd parting behind.",
    s: "A wheel stopping, the crowd flowing around them, a cat's bell.",
    m: "N/A",
  },

  seg_078: {
    cast: ["char_zhaoning"],
    a: "The hooded figure (S2) stays where she is, her chin lowering inside the hood, and offers nothing.",
    c: "holds static in a medium shot, lanterns moving behind her, the crowd crossing the frame in front.",
    s: "Crowd noise, lantern paper, a child laughing far off.",
    m: "A low note, held under the crowd.",
  },

  seg_079: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) lifts one shoulder in a shrug and sweeps a hand toward the dark street beyond the stalls, her mouth curving.",
    c: "holds a medium shot from her side, the stall row receding into the lanterns behind her.",
    s: "The crowd, a stall shutter, her cart rope creaking.",
    m: "The bright plucked pattern returns, mocking.",
  },

  seg_080: {
    cast: ["char_zhaoning","char_anian"],
    a: "The hooded figure (S2) looks at the basket on the cart, then at her, and speaks from inside the hood.",
    c: "holds a medium shot on her, the cat and cart soft in the foreground.",
    s: "Cloth, crowd, a lantern ticking.",
    m: "N/A",
  },

  seg_081: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) steps back into the cart handle, one hand on the basket, and answers with her chin up.",
    c: "holds a medium two-shot from the side of the cart, both faces at the same height.",
    s: "The basket shifting, a cat's bell, the crowd.",
    m: "N/A",
  },

  seg_082: {
    cast: ["char_zhaoning","char_anian"],
    a: "The hooded figure (S2) tilts her head toward the cat in the basket and stays looking at it while she answers.",
    c: "holds a medium shot with the cat sharp between the two women, lanterns behind.",
    s: "Crowd, a lantern rope, the cat's breathing.",
    m: "A single low pluck.",
  },

  seg_083: {
    cast: ["char_anian","char_zhaoning","char_cat"],
    a: "The market woman (S1) laughs out loud and lifts the cart handle again, and the cat turns its head toward the hooded figure as if agreeing.",
    c: "holds a wide-to-medium shot, the cart moving off, the hooded figure standing still as the crowd closes past her.",
    s: "Her laugh, the cart wheel starting, the crowd, the cat's bell.",
    m: "The plucked pattern wins out and runs on.",
  },

  seg_084: {
    a: "The market woman (S1) sits at the embroidery frame with a needle between her fingers, a half-worked peony and two lotus blooms on the silk; the princess (S2) stands behind her in a pale violet robe with a cat-painted round fan held against her waist, and the cat lies across a pile of cloth with its eyes half shut. The lattice light throws the same grid across both shadows on the silk.",
    c: "holds a medium shot with the frame centred, the standing figure and the hanging cloth readable behind, the two shadows overlapping on the fabric.",
    s: "A needle pulling through silk, thread running off a spool, the cat's slow breathing, the workshop timber creaking.",
    m: "A quiet plucked figure, patient, one note at a time.",
  },

  seg_085: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) leans in a little over the frame, the fan pointing at the silk, her eyes on the stitched petals.",
    c: "holds a medium shot from over the seated woman's shoulder, the silk and the needle in the foreground, the standing figure behind.",
    s: "Silk under the needle, the fan rib ticking her sleeve, a breath.",
    m: "N/A",
  },

  seg_086: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) answers without lifting her eyes from the frame, drawing the needle through and pulling the thread tight in one motion.",
    c: "holds a medium shot on her hands and face, the threads and the frame edge filling the lower frame.",
    s: "Thread pulled through, a spool turning, her voice low.",
    m: "The plucked figure continues.",
  },

  seg_087: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) turns the fan slowly between her fingers and watches the seated woman's face rather than the work.",
    c: "holds a medium shot on her, the workshop wall and the bolts of cloth behind, the frame edge in the foreground.",
    s: "The fan turning, cloth settling, a distant cart in the street.",
    m: "N/A",
  },

  seg_088: {
    cast: ["char_anian","char_zhaoning"],
    a: "The needle stops halfway through a stitch. The market woman (S1) holds it there, then finishes the stitch and only then answers.",
    c: "holds a close medium shot on her hands and the half-made stitch, her face above and slightly soft.",
    s: "Silence, one stitch drawn through, the cat's exhale.",
    m: "The plucked note stops on the still needle.",
  },

  seg_089: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) says nothing; the fan comes to rest against her waist and she stays standing exactly where she is.",
    c: "pushes in very slowly, the two women and the frame held in one medium shot.",
    s: "The workshop timber, a thread spool settling, the lattice ticking in the wind.",
    m: "N/A",
  },

  seg_090: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) turns her head just enough to speak back over her shoulder, one hand holding the silk flat.",
    c: "holds a medium shot from the standing woman's side, the seated figure and the frame filling the left of frame.",
    s: "Silk flattened under a palm, her voice, the cat shifting on the cloth.",
    m: "A low string enters under the line.",
  },

  seg_091: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) does not move her eyes from the back of the seated woman's head, and asks the question quietly.",
    c: "holds a close-to-medium shot on her, the frame and the seated woman's shoulder in the foreground.",
    s: "A breath, cloth, the street beyond the lattice.",
    m: "N/A",
  },

  seg_092: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) keeps her eyes down on the silk and answers flatly, one thumb pressing the needle against her finger.",
    c: "holds a medium shot on her, the embroidery frame and the lattice light behind.",
    s: "The needle pressed on a thumb, a thread pulled, her breath.",
    m: "The low string holds.",
  },

  seg_093: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) stops turning the fan. Her hand stays on the painted fan and does not move again.",
    c: "holds a medium shot on her hand and the fan, then the whole figure, the workshop dark around her.",
    s: "A fan surface settling, one breath, the cat's tail on cloth.",
    m: "N/A",
  },

  seg_094: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) lowers her needle and looks up at her directly for the first time since she sat down, her expression calm.",
    c: "holds a medium two-shot, the seated woman in the foreground looking up, the standing woman above her.",
    s: "The needle set down on cloth, the frame creaking, her voice.",
    m: "N/A",
  },

  seg_095: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) holds the fan still against her waist and asks it of the room rather than of her.",
    c: "holds a medium shot on her, the lattice grid across her sleeve, the seated woman's shoulder in the foreground.",
    s: "A breath, cloth, the street cart far away.",
    m: "A single low pluck under the question.",
  },

  seg_096: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) looks back down at the half-finished lotus and answers without any mockery in her face at all, then picks the needle up again.",
    c: "holds a medium shot, the frame and the silk in the foreground, the standing figure soft behind.",
    s: "Needle lifted off cloth, a thread drawn, the cat's slow exhale.",
    m: "The plucked figure returns, one octave lower, and stops.",
  },

  seg_097: {
    a: "The princess (S2) comes down the wet stone stairs under a red oil-paper umbrella, her skirt dark with rain at the hem; the market woman (S1) sits at the bottom of them, looking up. The lanterns behind them are dissolving into soft discs of light, and red leaves lie flat on the wet stone.",
    c: "holds a wide-to-medium shot from above the stairs, the wet steps, the leaves and both umbrellas filling the frame, the lanterns receding into rain behind.",
    s: "Rain on umbrella fabric, water running down stone, a lantern ticking in the wind, the cat's breathing.",
    m: "A slow low string, almost drowned by the rain.",
  },

  seg_098: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) stops three steps above her, the red umbrella tilted so the rain runs off one edge, and speaks down at her without moving closer.",
    c: "holds a medium shot from below, the red umbrella canopy cutting the top of frame, the rain visible against the lanterns.",
    s: "Rain on paper, water on stone, her voice under it.",
    m: "The low string thins away.",
  },

  seg_099: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) does not get up; she shifts the cat in her arms and leans back against the stone, the torn umbrella resting on her knees.",
    c: "holds a medium shot on her, the wet steps rising behind her shoulder, the red umbrella edge in the foreground.",
    s: "Rain on the torn umbrella, cloth shifting, the cat's breath.",
    m: "N/A",
  },

  seg_100: {
    cast: ["char_zhaoning","char_anian"],
    tone: "low, hard, patience gone",
    a: "The princess (S2) comes down one more step, and the water on the stone splashes under her shoe; she says it again without raising her voice.",
    c: "holds a medium shot from the side, both figures on the same stair, the rain between them.",
    s: "A shoe in a puddle, rain, the umbrella tilting.",
    m: "A single low drum beat.",
  },

  seg_101: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) looks up at her steadily, one hand moving on the cat's back, and answers with the rain running off her own torn canopy onto her shoulder.",
    c: "holds a medium shot from low on the stairs, her face lifted, the red umbrella and the princess above her.",
    s: "Rain on two different umbrellas, water dripping off the torn edge, the cat's breathing.",
    m: "A low string, one held note.",
  },

  seg_102: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) says nothing. She comes down two more steps and stands in the rain at the same level as the seated woman, the red umbrella now low enough to cover them both.",
    c: "holds static in a wide-to-medium shot, the two of them and both umbrellas in one frame, the wet steps running away below.",
    s: "Water running off two canopies, rain on stone, a long breath.",
    m: "N/A",
  },

  seg_103: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) watches her settle, then asks the question flatly, one hand still on the cat.",
    c: "holds a medium two-shot under the joined umbrellas, the rain visible past their edges.",
    s: "Rain, the cat shifting, her voice close.",
    m: "N/A",
  },

  seg_104: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) looks straight at her and answers at once, without any of her usual pause.",
    c: "holds a close-to-medium shot on her, the red umbrella rib above her head, rain falling past the edge.",
    s: "Rain on paper, one drop hitting stone, her breath.",
    m: "A low plucked note under the line.",
  },

  seg_105: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) frowns and shifts her grip on the umbrella handle, waiting.",
    c: "holds a medium shot on her, the torn canopy filling the upper frame.",
    s: "Rain, wicker and bamboo creaking in her hand.",
    m: "N/A",
  },

  seg_106: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) does not gesture, does not smile; she simply holds her own face still and says it.",
    c: "holds a close-to-medium shot on her, the rain and the lanterns soft behind her shoulder.",
    s: "Rain, the umbrella ticking, a single distant bell.",
    m: "The low string drops out entirely.",
  },

  seg_107: {
    cast: ["char_zhaoning","char_anian"],
    a: "Neither of them moves. The rain thickens and drums harder on both canopies; the cat turns its face into the woman's sleeve.",
    c: "holds a wide two-shot from the side of the stairs, the two umbrellas and the wet leaves in frame.",
    s: "Rain getting heavier on paper and cloth, water sheeting off the steps, the cat's small protest.",
    m: "N/A",
  },

  seg_108: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) sits up straighter, her free hand flattening on the wet stone beside her.",
    c: "holds a medium shot on her, her palm on the wet stone in the foreground.",
    s: "A palm on wet stone, rain, her quick breath.",
    m: "A single low pluck.",
  },

  seg_109: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) nods once, the umbrella tilting with the movement, rain running off the rim.",
    c: "holds a medium shot on her, the red canopy and the falling water filling the upper frame.",
    s: "Water off a rim, rain, cloth.",
    m: "N/A",
  },

  seg_110: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) holds her eyes and asks the next question without looking away.",
    c: "holds a medium shot on her, the stair and the rain behind, the red umbrella at the frame edge.",
    s: "Rain, the cat's breathing, her voice.",
    m: "N/A",
  },

  seg_111: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) answers with her chin slightly lifted and her eyes flat, the way she speaks in the throne hall.",
    c: "holds a medium shot on her, the lantern discs blurred behind, the rain sharp in front of the lens.",
    s: "Rain, a lantern ticking, her breath.",
    m: "A low held string enters.",
  },

  seg_112: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) tilts her head, one eyebrow up, and puts it to her like a stall price.",
    c: "holds a medium shot on her, the torn umbrella and the wet stone in frame.",
    s: "Rain on the torn canopy, the cat's tail moving, her voice.",
    m: "N/A",
  },

  seg_113: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) moves the red umbrella forward a few centimetres, the way she moved her hand on the stairs, and answers without softening her voice.",
    c: "holds a medium two-shot, the red canopy now covering the seated woman's shoulder, the torn one still in frame.",
    s: "Two canopies almost touching, rain, water dripping between them.",
    m: "The string holds and does not resolve.",
  },

  seg_114: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) looks up at the red umbrella above her, then at the face under it, and asks it plainly.",
    c: "holds a close-to-medium shot on her lifted face, the red paper glowing above her, rain on the lens.",
    s: "Rain, a drop falling from the red rim onto stone, her breath.",
    m: "N/A",
  },

  seg_115: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) looks away at the wet steps below and admits it to the rain rather than to her.",
    c: "holds a medium shot from her profile, the stairs falling away behind, the red umbrella dark against them.",
    s: "Rain, water running down steps, a far bell.",
    m: "A low plucked note, alone.",
  },

  seg_116: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) reaches up and closes her hand around the umbrella handle above her own head; her fingers touch the other woman's hand as she takes it, and she keeps holding it for a second.",
    c: "holds a medium shot with both hands on the handle in the centre of frame, the rain and the red paper above them.",
    s: "A handle changing hands, rain on paper, a held breath, the cat's small sound.",
    m: "A warm low chord entering under the touch.",
  },

  seg_117: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) withdraws her hand and lets it hang at her side, the rain running off her fingers, and answers without looking at her.",
    c: "holds a medium shot on her hand and then her face, the wet stairs behind, the red umbrella now above the other woman.",
    s: "Rain, water off fingers, cloth.",
    m: "N/A",
  },

  seg_118: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) looks at the hand hanging at the princess's side and says it without any heat at all.",
    c: "holds a medium two-shot under the red umbrella, both of them on the same step, the torn umbrella now furled at her knee.",
    s: "Rain, a canopy being furled, a small laugh under her breath.",
    m: "A single dry pluck under the line.",
  },

  seg_119: {
    cast: ["char_cat","char_anian","char_zhaoning"],
    a: "The cat lifts its head from the woman's sleeve and looks from one to the other, mouth closed, tail curling tighter while the words run under the image.",
    c: "holds a medium shot at chest height, both women's hands and the umbrella handle above the cat's head.",
    s: "Rain on paper, the cat's breath, water running off the rim.",
    m: "A dry plucked figure, satisfied, and a low held tone.",
  },

  seg_120: {
    a: "The princess (S2) sits across the low table with a brush held upright in her hand, a hand-drawn map spread flat between them with two women's profiles facing each other and one arrow between them; the market woman (S1) sits opposite with her chin on one hand, and the cat sits in the middle of the table with one paw on the map's corner.",
    c: "holds a medium top-down shot across the table, the map, the candle and the cat filling the frame, the dark study beyond the light.",
    s: "A candle wick ticking, brush hair touching paper, the cat's tail dragging the tabletop, the room's timber settling.",
    m: "A single low bowed note, held very quiet.",
  },

  seg_121: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) sets the brush down and points at two places on the map with her finger, speaking evenly, her eyes on the paper.",
    c: "holds a medium shot from above and to the side, the map and her hand in the lower frame, her face in the upper.",
    s: "A finger on paper, the candle ticking, cloth.",
    m: "N/A",
  },

  seg_122: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) takes her chin off her hand and leans over the map, her finger resting on the arrow's tip.",
    c: "holds a medium shot from her side, the map and the candle between them, the cat's paw holding the corner.",
    s: "A stool creaking, paper under a fingertip, the candle.",
    m: "A single low pluck.",
  },

  seg_123: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) does not look up from the map; her answer comes out flat and immediate, and she moves her brush to the edge of the paper.",
    c: "holds a medium shot on her, the candle flame at the edge of frame throwing her shadow onto the wall.",
    s: "A brush rolling on the table, the candle, a far night watchman's clapper.",
    m: "N/A",
  },

  seg_124: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) laughs under her breath and sits back, arms folded on the table edge.",
    c: "holds a medium two-shot across the table, the cat between them, the candle in the middle of frame.",
    s: "Her short laugh, a stool leg, the candle.",
    m: "The plucked note answers her laugh.",
  },

  seg_125: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) keeps her eyes on the map and answers without any change of expression at all.",
    c: "holds a medium shot on her, the wall shadow behind and the map edge in the foreground.",
    s: "Paper, candle, a breath.",
    m: "N/A",
  },

  seg_126: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) turns the map a quarter turn toward herself so the arrow runs upright between them, then taps the empty end of it with one finger.",
    c: "holds a top-down medium shot, the map filling the frame, both faces at the edges, the cat's paw still on the corner.",
    s: "Paper turning, a fingertip on paper, the candle guttering, the cat's exhale.",
    m: "A low string entering under the question.",
  },

  seg_127: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) stops the brush in the middle of a stroke. The tip stays on the paper and the ink begins to spread into a small dark bloom.",
    c: "pushes in slowly to the brush tip and the spreading ink, her hand still above it.",
    s: "Silence, the candle ticking, one drop of ink soaking into paper.",
    m: "N/A",
  },

  seg_128: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) looks at the still brush and then at her face, and says it without accusation.",
    c: "holds a medium shot on her, the map and the ink bloom in the foreground.",
    s: "A breath, paper, the candle.",
    m: "N/A",
  },

  seg_129: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) lifts the brush off the paper and sets it down again without wiping the tip, and answers with her eyes still down.",
    c: "holds a medium shot across the table, both profiles and the cat between them.",
    s: "A brush set down, the candle, a distant gate closing.",
    m: "A single low note under the line.",
  },

  seg_130: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) leans forward onto both elbows, her face close to the map, and asks it quietly.",
    c: "holds a close-to-medium shot on her face, the candle flame reflected in the table's polish below her.",
    s: "Her breath, a stool creaking, the candle.",
    m: "N/A",
  },

  seg_131: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) looks at her for the first time in the scene, then answers with her hand flat on the map.",
    c: "holds a medium two-shot, the candle between them in the centre of frame, the cat's eyes catching the light.",
    s: "A palm on paper, the candle, cloth.",
    m: "A low held string.",
  },

  seg_132: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) reaches across the table, takes the brush out of the princess's hand, and turns the map straight with her other hand.",
    c: "holds a medium shot from the princess's side, the brush passing between their hands in the middle of frame.",
    s: "A brush changing hands, paper turned, the cat's paw sliding off the corner.",
    m: "The plucked figure returns, warmer.",
  },

  seg_133: {
    a: "The market woman (S1) draws a second arrow on the map, from the palace back to the market, the brush moving in one steady stroke; then she sets the brush down and sits back. The cat puts its paw back on the corner of the paper.",
    c: "holds a top-down close shot of the map while the arrow is drawn, then eases up to include both faces above it.",
    s: "Brush hair on paper, the candle, the cat's paw settling, one long breath from the princess.",
    m: "A single warm plucked phrase, then a low held chord.",
  },

  seg_134: {
    a: "The princess (S2) sits on one padded bench and the market woman (S1) on the other, the cat curled on the cushion between them; the city lights slide across both faces from the windows, and neither of them looks away first.",
    c: "holds a medium two-shot from the carriage's end wall, both benches, both windows and the cat all inside the frame.",
    s: "Hooves on stone, wheels on paving, harness creaking, the lamp ticking above them.",
    m: "A slow low string, one note per bar, over the road noise.",
  },

  seg_135: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) looks up at the ceiling of the carriage and shifts on the bench, one hand flat on the padding.",
    c: "holds a medium shot on her, the window behind her shoulder streaked with moving lights.",
    s: "Wheels, hooves, her hand moving on the padding.",
    m: "The string continues.",
  },

  seg_136: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) answers without turning from the window, one finger lifting in a small gesture at the ceiling.",
    c: "holds a medium shot on her, the window light moving across her profile.",
    s: "Hooves, the lamp ticking, cloth.",
    m: "N/A",
  },

  seg_137: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) settles back against the padding and looks around the inside of the carriage as if counting what it cost.",
    c: "holds a medium shot from her side, the bench, the lamp and the panelling receding behind her.",
    s: "Wheels, harness, her breath.",
    m: "The string thins to a held note.",
  },

  seg_138: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) turns her head from the window, and the passing light crosses her eyes.",
    c: "holds a close-to-medium shot on her, the window frame and the moving lights still in frame.",
    s: "A lamp swinging, hooves, cloth shifting.",
    m: "N/A",
  },

  seg_139: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) tilts her head toward the floor of the carriage and then at the other bench, and answers in a low voice.",
    c: "holds a medium two-shot, the cat between them, the window lights crossing both faces.",
    s: "Wheels on stone, a jolt of the carriage, the cat's claws on fabric.",
    m: "A low plucked note under the line.",
  },

  seg_140: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) looks at her for a moment longer than she has all night, then turns back to the window as the light passes over her face.",
    c: "holds a medium shot on her, the window lights moving across the panelling behind.",
    s: "Hooves, wheels, the lamp, a distant street seller.",
    m: "N/A",
  },

  seg_141: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) says it plainly, without sympathy in her face, and lets the silence sit afterwards.",
    c: "holds a medium two-shot across the carriage, the cat lifting its head between them as the carriage takes a corner.",
    s: "Wheels dropping on a turn, hooves, the cat's bell touching once, a long silence.",
    m: "A single warm note, held to the end of the shot.",
  },

  seg_142: {
    a: "The market woman (S1) sits at the cabin door with a cloth bundle against her chest; the princess (S2) sits deeper inside with a cat-painted fan on her knee. On the low table a brocade box lies open with two matched white jade tokens side by side, beside a map, scrolls, jade bracelets and an incense burner. The cat lies flat in the middle of the table.",
    c: "holds a wide-to-medium shot, the cabin window framing water and distant hills behind the table, the open box catching the light.",
    s: "Water against the hull, a rope creaking, the incense burner ticking, the cat's slow breathing.",
    m: "A low bowed string over the water sound.",
  },

  seg_143: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) sets the bundle down on the table in front of her and folds both hands on top of it.",
    c: "holds a medium shot from across the table, the bundle in the foreground, the other woman framed by the window behind.",
    s: "Cloth bundle set on wood, the hull, water.",
    m: "N/A",
  },

  seg_144: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) does not lean forward; she watches the bundle and says one word.",
    c: "holds a medium shot on her, the fan and the open brocade box at the edge of frame.",
    s: "Water, the incense burner, cloth.",
    m: "A single low pluck.",
  },

  seg_145: {
    a: "The market woman (S1) opens the bundle in three folds: the half of a white jade pendant on its red cord, a small pair of steel sewing scissors, and a paper packet of osmanthus candy. She lays each one out separately on the cloth.",
    c: "holds a top-down close shot of the opened bundle, then eases up to include both faces above it.",
    s: "Cloth unfolding, metal scissors set on wood, paper opening, water under the hull.",
    m: "A plucked figure, one note per object, then silence.",
  },

  seg_146: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) looks at the candy packet and then at her, one hand already moving on the fan.",
    c: "holds a medium shot on her, the open box and the window behind.",
    s: "A fan rib ticking, water, a breath.",
    m: "N/A",
  },

  seg_147: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) pushes the candy packet a centimetre toward her and keeps her hand on the table beside it.",
    c: "holds a medium shot from her side, the table and the two hands in the lower frame.",
    s: "Paper on wood, the hull, her voice.",
    m: "N/A",
  },

  seg_148: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) picks one piece out of the packet and puts it in her mouth, then sets her hand back on the fan without any change of face.",
    c: "holds a close-to-medium shot on her hand and mouth, the window light on her jaw.",
    s: "Paper rustling, a small crunch, the incense burner.",
    m: "A single low pluck, dry.",
  },

  seg_149: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) watches her chew and answers with her chin on her hand, one eyebrow lifted.",
    c: "holds a medium shot on her, the table and the opened bundle in the foreground.",
    s: "The hull, water, her voice.",
    m: "N/A",
  },

  seg_150: {
    cast: ["char_zhaoning","char_anian"],
    a: "The princess (S2) stops chewing, looks out of the window at the water, and answers quietly without turning back.",
    c: "holds a medium shot from her side, the window and the hills behind her, the fan flat on her knee.",
    s: "Water, a gull far off, a quiet breath.",
    m: "A low string enters and stays.",
  },

  seg_151: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) picks up the whole candy packet and slides it across the table until it touches the princess's hand, then takes her own hand back.",
    c: "holds a close shot of the packet crossing the table, the two hands at either end of the move.",
    s: "Paper on wood, the table edge, water under the hull.",
    m: "N/A",
  },

  seg_152: {
    cast: ["char_anian","char_zhaoning"],
    a: "The market woman (S1) sits back with her arms folded and says it simply, and the princess closes her hand over the packet.",
    c: "holds a medium two-shot, the cat lifting its head on the table between them.",
    s: "Paper in a closed hand, the hull, the cat's exhale, water.",
    m: "The plucked figure returns, warm, and fades under the water sound.",
  },

  seg_153: {
    set: "A princess's dressing room at night: a bronze mirror on a dark wood table, a row of jewellery boxes, red gauze curtains at the window, a low couch with one cushion, and the room falling away into lamp shadow behind it.",
    light: "the same low lamp light lies across her shoulder, the gauze and the rim of the bronze mirror behind her",
    wear: {"char_zhaoning":"in a plain crimson robe, a ring on her finger"},
    a: "Two palace maids kneel at the market woman's waist, drawing a twelve-fold crimson and gold robe closed and lacing the sash tighter with each pull; her own grey-blue robe lies folded on a stool behind them. The princess (S2) stands behind and to the side in a plain crimson robe, turning a ring on her finger, and the cat lies on a cushion beside the jewellery box with its eyes half shut.",
    c: "holds a medium full shot, the bronze mirror and the dressing table filling the background, the kneeling maids and the standing princess both in frame.",
    s: "Sash laces pulled through, silk dragged across the floor, a ring turning, the cat's breathing.",
    m: "A slow low string with a single ticking pulse.",
  },

  seg_154: {
    set: "A princess's dressing room at night: a bronze mirror on a dark wood table, a row of jewellery boxes, red gauze curtains at the window, a low couch with one cushion, and the room falling away into lamp shadow behind it.",
    light: "the same low lamp light lies across her shoulder, the gauze and the rim of the bronze mirror behind her",
    cast: ["char_anian","char_zhaoning"],
    wear: {"char_zhaoning":"in a plain crimson robe, a ring on her finger"},
    a: "The market woman (S1) braces her hands on her own ribs and exhales as the sash comes tight, her shoulders lifting.",
    c: "holds a medium shot on her from the front, the maids' hands at her waist, the mirror behind her shoulder.",
    s: "A sharp breath out, silk cinching, a lace pulled.",
    m: "The ticking pulse continues.",
  },

  seg_155: {
    set: "A princess's dressing room at night: a bronze mirror on a dark wood table, a row of jewellery boxes, red gauze curtains at the window, a low couch with one cushion, and the room falling away into lamp shadow behind it.",
    light: "the same low lamp light lies across her shoulder, the gauze and the rim of the bronze mirror behind her",
    cast: ["char_zhaoning","char_anian"],
    wear: {"char_zhaoning":"in a plain crimson robe, a ring on her finger"},
    a: "The princess (S2) stops turning the ring and looks at the robe being laced onto the other woman: it is the same twelve-fold crimson and gold she stepped out of, the same red gauze that slid off her own shoulder at this mirror that morning, now being pulled tight around someone else's ribs.",
    c: "holds a medium shot from behind the maids, the crimson robe and the mirror in one frame, the princess's face sharp behind.",
    s: "Silk settling, one lace pulled through, the cat's tail moving on the cushion.",
    m: "A low string, the same figure from the first mirror scene, one octave lower.",
  },

  seg_156: {
    set: "A princess's dressing room at night: a bronze mirror on a dark wood table, a row of jewellery boxes, red gauze curtains at the window, a low couch with one cushion, and the room falling away into lamp shadow behind it.",
    light: "the same low lamp light lies across her shoulder, the gauze and the rim of the bronze mirror behind her",
    cast: ["char_anian","char_zhaoning"],
    wear: {"char_zhaoning":"in a plain crimson robe, a ring on her finger"},
    a: "The market woman (S1) looks down at the hem now pooling around her feet and lifts one shoulder.",
    c: "holds a medium shot on her, the robe and the maids' hands in the lower frame, the mirror behind.",
    s: "A hem dragging, a small laugh, silk.",
    m: "N/A",
  },

  seg_157: {
    set: "A princess's dressing room at night: a bronze mirror on a dark wood table, a row of jewellery boxes, red gauze curtains at the window, a low couch with one cushion, and the room falling away into lamp shadow behind it.",
    light: "the same low lamp light lies across her shoulder, the gauze and the rim of the bronze mirror behind her",
    cast: ["char_zhaoning","char_anian"],
    wear: {"char_zhaoning":"in a plain crimson robe, a ring on her finger"},
    a: "The princess (S2) crosses to the mirror, takes the weight of the crown off its stand, and speaks to the reflection rather than to the woman in the robe.",
    c: "holds a medium shot with the mirror splitting the frame, her reflection on one side and the laced robe on the other.",
    s: "Gold on wood, a hairpin ticking the stand, silk being smoothed.",
    m: "A single low pluck under the line.",
  },

  seg_158: {
    set: "A princess's dressing room at night: a bronze mirror on a dark wood table, a row of jewellery boxes, red gauze curtains at the window, a low couch with one cushion, and the room falling away into lamp shadow behind it.",
    light: "the same low lamp light lies across her shoulder, the gauze and the rim of the bronze mirror behind her",
    cast: ["char_anian","char_zhaoning"],
    wear: {"char_zhaoning":"in a plain crimson robe, a ring on her finger"},
    a: "The market woman (S1) takes half a step and stops, because the hem is under her foot, and looks down at it.",
    c: "holds a medium shot from the side, the robe stretched between her and the mirror.",
    s: "A hem pulled, a footstep stopped, a lace creaking.",
    m: "N/A",
  },

  seg_159: {
    set: "A princess's dressing room at night: a bronze mirror on a dark wood table, a row of jewellery boxes, red gauze curtains at the window, a low couch with one cushion, and the room falling away into lamp shadow behind it.",
    light: "the same low lamp light lies across her shoulder, the gauze and the rim of the bronze mirror behind her",
    cast: ["char_zhaoning","char_anian"],
    wear: {"char_zhaoning":"in a plain crimson robe, a ring on her finger"},
    a: "The princess (S2) answers without lifting the crown, and the maids at the waist go still to listen.",
    c: "holds a medium two-shot, the crown held at chest height between them, the mirror behind.",
    s: "A held breath in the room, silk, the cat's tail.",
    m: "N/A",
  },

  seg_160: {
    set: "A princess's dressing room at night: a bronze mirror on a dark wood table, a row of jewellery boxes, red gauze curtains at the window, a low couch with one cushion, and the room falling away into lamp shadow behind it.",
    light: "the same low lamp light lies across her shoulder, the gauze and the rim of the bronze mirror behind her",
    cast: ["char_anian","char_zhaoning"],
    wear: {"char_zhaoning":"in a plain crimson robe, a ring on her finger"},
    a: "The market woman (S1) lifts her chin toward the mirror's edge, at the space in front of her own reflection.",
    c: "holds a medium shot on her, the mirror and the empty foreground in frame.",
    s: "Silk, a breath, the ring turning again.",
    m: "A low held string.",
  },

  seg_161: {
    set: "A princess's dressing room at night: a bronze mirror on a dark wood table, a row of jewellery boxes, red gauze curtains at the window, a low couch with one cushion, and the room falling away into lamp shadow behind it.",
    light: "the same low lamp light lies across her shoulder, the gauze and the rim of the bronze mirror behind her",
    cast: ["char_zhaoning","char_anian"],
    wear: {"char_zhaoning":"in a plain crimson robe, a ring on her finger"},
    a: "The princess (S2) steps in and straightens the collar at the other woman's throat with two fingers, and answers into the mirror.",
    c: "holds a medium two-shot in the mirror, both faces side by side in the glass, their backs in the foreground.",
    s: "Cloth at a collar, a breath, silk settling.",
    m: "The string resolves onto a low chord.",
  },

  seg_162: {
    set: "A princess's dressing room at night: a bronze mirror on a dark wood table, a row of jewellery boxes, red gauze curtains at the window, a low couch with one cushion, and the room falling away into lamp shadow behind it.",
    light: "the same low lamp light lies across her shoulder, the gauze and the rim of the bronze mirror behind her",
    wear: {"char_zhaoning":"in a plain crimson robe, a ring on her finger"},
    a: "The princess (S2) stands behind the market woman (S1), lifting her braid and winding it up at the back of her head; the crimson sleeve slides back from her wrist. The cat sits on the table facing the bronze mirror. In the glass the two faces above the same robe are already identical.",
    c: "holds a medium mirror two-shot, both faces and the cat's reflection in the glass, the dressing room still readable behind them.",
    s: "Hair pulled through fingers, a pin set down, silk at a wrist, the cat's breathing.",
    m: "A single sustained note on a bowed string.",
  },

  seg_163: {
    set: "A princess's dressing room at night: a bronze mirror on a dark wood table, a row of jewellery boxes, red gauze curtains at the window, a low couch with one cushion, and the room falling away into lamp shadow behind it.",
    light: "the same low lamp light lies across her shoulder, the gauze and the rim of the bronze mirror behind her",
    cast: ["char_zhaoning","char_anian"],
    wear: {"char_zhaoning":"in a plain crimson robe, a ring on her finger"},
    a: "The princess (S2) lifts the half of a white jade pendant on its red cord over the other woman's head and settles it flat at her collarbone, the broken edge turned inward, the way the two halves met on the palace steps.",
    c: "holds a close-to-medium shot of the hands and the jade at the throat, both faces above in the mirror.",
    s: "A cord drawn over hair, jade touching skin, a small click, a breath.",
    m: "A clear struck note, left to ring.",
  },

  seg_164: {
    set: "A princess's dressing room at night: a bronze mirror on a dark wood table, a row of jewellery boxes, red gauze curtains at the window, a low couch with one cushion, and the room falling away into lamp shadow behind it.",
    light: "the same low lamp light lies across her shoulder, the gauze and the rim of the bronze mirror behind her",
    cast: ["char_anian","char_zhaoning"],
    wear: {"char_zhaoning":"in a plain crimson robe, a ring on her finger"},
    a: "The market woman (S1) looks at the jade in the mirror rather than down at it, and asks without turning her head.",
    c: "holds a medium shot of her reflection, the princess's hands still at her shoulders.",
    s: "A breath, silk, the candle.",
    m: "The struck note decays.",
  },

  seg_165: {
    set: "A princess's dressing room at night: a bronze mirror on a dark wood table, a row of jewellery boxes, red gauze curtains at the window, a low couch with one cushion, and the room falling away into lamp shadow behind it.",
    light: "the same low lamp light lies across her shoulder, the gauze and the rim of the bronze mirror behind her",
    cast: ["char_zhaoning","char_anian"],
    wear: {"char_zhaoning":"in a plain crimson robe, a ring on her finger"},
    a: "The princess (S2) keeps both hands on her shoulders and answers to the glass, her eyes on the reflection rather than on the woman.",
    c: "holds the mirror two-shot, both faces level in the frame.",
    s: "A quiet room, a breath, the cat's tail tapping the table.",
    m: "N/A",
  },

  seg_166: {
    set: "A princess's dressing room at night: a bronze mirror on a dark wood table, a row of jewellery boxes, red gauze curtains at the window, a low couch with one cushion, and the room falling away into lamp shadow behind it.",
    light: "the same low lamp light lies across her shoulder, the gauze and the rim of the bronze mirror behind her",
    cast: ["char_zhaoning","char_anian"],
    wear: {"char_zhaoning":"in a plain crimson robe, a ring on her finger"},
    a: "The princess (S2) stops her hand at the nape of the other woman's neck, the pin still between her fingers, and stays there.",
    c: "pushes in slowly on the hand and the nape, the mirror behind still holding both faces.",
    s: "Silence, one pin held, a slow breath in.",
    m: "N/A",
  },

  seg_167: {
    set: "A princess's dressing room at night: a bronze mirror on a dark wood table, a row of jewellery boxes, red gauze curtains at the window, a low couch with one cushion, and the room falling away into lamp shadow behind it.",
    light: "the same low lamp light lies across her shoulder, the gauze and the rim of the bronze mirror behind her",
    cast: ["char_anian","char_zhaoning"],
    wear: {"char_zhaoning":"in a plain crimson robe, a ring on her finger"},
    a: "The market woman (S1) watches her in the mirror and says it without moving her shoulders.",
    c: "holds a medium shot of her reflection, the hand at her nape in the lower frame.",
    s: "A breath, silk, the jade ticking against cloth.",
    m: "A single low pluck.",
  },

  seg_168: {
    set: "A princess's dressing room at night: a bronze mirror on a dark wood table, a row of jewellery boxes, red gauze curtains at the window, a low couch with one cushion, and the room falling away into lamp shadow behind it.",
    light: "the same low lamp light lies across her shoulder, the gauze and the rim of the bronze mirror behind her",
    cast: ["char_zhaoning","char_anian"],
    wear: {"char_zhaoning":"in a plain crimson robe, a ring on her finger"},
    a: "The princess (S2) takes her hand away and sets the pin down on the table, and answers without meeting her eyes in the glass.",
    c: "holds a medium shot from the side, the pin leaving frame, the mirror still in view.",
    s: "A pin set on wood, a breath, the cat shifting.",
    m: "N/A",
  },

  seg_169: {
    set: "A princess's dressing room at night: a bronze mirror on a dark wood table, a row of jewellery boxes, red gauze curtains at the window, a low couch with one cushion, and the room falling away into lamp shadow behind it.",
    light: "the same low lamp light lies across her shoulder, the gauze and the rim of the bronze mirror behind her",
    cast: ["char_anian","char_zhaoning"],
    wear: {"char_zhaoning":"in a plain crimson robe, a ring on her finger"},
    a: "The market woman (S1) turns her head and looks at the hand that set the pin down, the same hand that held the red umbrella out in the rain on the stone stairs, and says the same words back to her.",
    c: "holds a medium two-shot in the mirror, the hand resting on the table in the foreground.",
    s: "A breath, a small laugh under it, silk.",
    m: "A low string, the rain phrase from the stairs, returning quietly.",
  },

  seg_170: {
    set: "A princess's dressing room at night: a bronze mirror on a dark wood table, a row of jewellery boxes, red gauze curtains at the window, a low couch with one cushion, and the room falling away into lamp shadow behind it.",
    light: "the same low lamp light lies across her shoulder, the gauze and the rim of the bronze mirror behind her",
    cast: ["char_zhaoning","char_anian"],
    wear: {"char_zhaoning":"in a plain crimson robe, a ring on her finger"},
    a: "The princess (S2) lifts her chin and answers very low, her hand closing on the table edge.",
    c: "holds a close-to-medium shot on her reflection, the other woman's shoulder in the foreground.",
    s: "A hand on wood, a breath, the candle.",
    m: "N/A",
  },

  seg_171: {
    set: "A princess's dressing room at night: a bronze mirror on a dark wood table, a row of jewellery boxes, red gauze curtains at the window, a low couch with one cushion, and the room falling away into lamp shadow behind it.",
    light: "the same low lamp light lies across her shoulder, the gauze and the rim of the bronze mirror behind her",
    cast: ["char_anian","char_zhaoning"],
    wear: {"char_zhaoning":"in a plain crimson robe, a ring on her finger"},
    a: "The market woman (S1) keeps her eyes on the reflection and waits, her hands still in her lap.",
    c: "holds a medium shot of her reflection, the princess behind her in the same glass.",
    s: "Silence, the candle, the cat's slow breath.",
    m: "A held low note.",
  },

  seg_172: {
    set: "A princess's dressing room at night: a bronze mirror on a dark wood table, a row of jewellery boxes, red gauze curtains at the window, a low couch with one cushion, and the room falling away into lamp shadow behind it.",
    light: "the same low lamp light lies across her shoulder, the gauze and the rim of the bronze mirror behind her",
    cast: ["char_zhaoning","char_anian"],
    wear: {"char_zhaoning":"in a plain crimson robe, a ring on her finger"},
    a: "The princess (S2) looks at the two identical faces in the mirror and answers it without any softening at all, and her hand comes up to the jade at her own throat.",
    c: "holds the mirror two-shot, both faces filling the frame, the clasp in the lower third.",
    s: "A cord drawn tight, jade settling, one long breath.",
    m: "A low string rising and stopping.",
  },

  seg_173: {
    set: "A princess's dressing room at night: a bronze mirror on a dark wood table, a row of jewellery boxes, red gauze curtains at the window, a low couch with one cushion, and the room falling away into lamp shadow behind it.",
    light: "the same low lamp light lies across her shoulder, the gauze and the rim of the bronze mirror behind her",
    cast: ["char_cat","char_zhaoning","char_anian"],
    wear: {"char_zhaoning":"in a plain crimson robe, a ring on her finger"},
    a: "The cat sits on the table facing the mirror, mouth closed, eyes on the two reflections, tail curled around its paws while the words run under the image.",
    c: "holds a low medium shot at cat height, the mirror above it holding both women's faces, the cat sharp in the foreground.",
    s: "A cat's exhale, a clasp settling, silk, the candle guttering.",
    m: "One dry plucked note and a low chord held under the mirror.",
  },
};
