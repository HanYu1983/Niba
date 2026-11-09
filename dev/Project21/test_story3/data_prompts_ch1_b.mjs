/**
 * Chapter 1 prompt prose, part B (seg_037–seg_072): the body search, the hearing, the hunger,
 * the infection, the decision.
 */

const TAYW =
  "Taylor (S3), the same lean 25-year-old East Asian woman with the high black ponytail and sharp " +
  "dark eyes, now with two fresh claw wounds across both shoulders, a torn olive shirt and " +
  "blood-streaked, mud-caked skin";
const TURN =
  "The turned man (S10), the same gaunt 30-something man, now with bloodshot eyes, grey-purple " +
  "necrotic skin, a broken jaw and clawed grey hands";

export const promptsB = {
  /* ---------------------------------------------------------- 037 hungry already */
  seg_037: {
    shots: [
      {
        text:
          `${TAYW} moves low and fast along the bank, eyes sweeping the brush on both sides. Sweat has ` +
          "glued her collar to her neck, and she keeps the pack close against her back. The camera tracks " +
          "beside her at shoulder height.",
        say: "Taylor (S3) mutters, half joking and half not:"
      }
    ],
    sound:
      "Fast boots on gravel, dry leaves brushing her sleeve, the pack creaking, and her steady breath.",
    music: "A walking pulse with a thin, tired string line over it."
  },

  /* ---------------------------------------------------------- 038 calories */
  seg_038: {
    shots: [
      {
        text:
          "an extreme close-up of Taylor's eyes flicking left and right as she counts. Her pupils move " +
          "behind the shine of sweat on her lashes."
      },
      {
        text:
          "the inside of the open pack glimpsed over her shoulder: crushed snack wrappers, a half-flattened " +
          "bottle, a folded map. The image stays photographic, with no overlay, no numbers and no text of " +
          "any kind.",
        say: "Taylor's voice, close and internal, off-screen:"
      }
    ],
    sound:
      "Boots on gravel, the pack shifting, wind in the trees, and a faint stomach growl under her breath.",
    music: "A dry ticking pulse, like a clock with something wrong with it."
  },

  /* ---------------------------------------------------------- 039 water */
  seg_039: {
    shots: [
      {
        text:
          "Taylor's hand pats the side of the pack, locating the water bottle by feel. Her lips are dry " +
          "and cracked, and she swallows once with visible effort."
      },
      {
        text:
          "a close profile as she walks: the sun on her cheek, the tendon in her neck moving with the " +
          "swallow, her eyes fixed ahead. She does not open the pack.",
        say: "Taylor's voice, close and internal, off-screen:"
      }
    ],
    sound:
      "The bottle knocking softly inside canvas, dry gravel, cicadas, and her dry swallow close to the " +
      "microphone.",
    music: "The ticking pulse continues, slower."
  },

  /* ---------------------------------------------------------- 040 the sun takes its cut */
  seg_040: {
    shots: [
      {
        text:
          "a low angle on Taylor's boots stepping through loose gravel. Sweat drips from her jaw and lands " +
          "on the dry ground, vanishing almost immediately in the heat. Heat shimmer distorts the air at " +
          "ankle height.",
        say: "A calm narrator's voice, off-screen, speaks:"
      }
    ],
    sound:
      "Gravel under each step, cicadas at full volume, a faint hiss of heat, and her breath turning " +
      "ragged.",
    music: "A dry, sparse drone with no melody."
  },

  /* ---------------------------------------------------------- 041 not a video game */
  seg_041: {
    shots: [
      {
        text:
          "Taylor rolls her eyes at her own thought, then squints as the heat pushes back into her face. " +
          "The camera stays at eye level and the image remains completely photographic."
      },
      {
        text:
          "a wider shot of her trudging on, shoulders low under the pack, the bank empty in both " +
          "directions. No graphics, no overlays, no game-like effects.",
        say: "Taylor's voice, close and internal, off-screen:"
      }
    ],
    sound:
      "A dry laugh through the nose, gravel, wind, and the high continuous ring of cicadas.",
    music: "A single wry pizzicato note, then the dry pulse again."
  },

  /* ---------------------------------------------------------- 042 every direction is bad */
  seg_042: {
    shots: [
      {
        text:
          "Taylor's gaze sweeps the canal, then the treeline, then the distant city. Each direction holds " +
          "a different threat: pale bodies in the water, dark green cover, smoke on the skyline."
      },
      {
        text:
          "her face as she takes all three in and settles on the city. The camera holds static, " +
          "the heat shimmer moving behind her.",
        say: "A calm narrator's voice, off-screen, speaks:"
      }
    ],
    sound:
      "Water, wind in leaves, a distant siren and a far-off roar, all mixed at the same low level.",
    music: "Three low notes, one per direction, sustaining under the last shot."
  },

  /* ---------------------------------------------------------- 043 turn back */
  seg_043: {
    shots: [
      {
        text:
          "Taylor takes two steps, stops, and turns her head back toward the body. She looks at it for a " +
          "long beat, then walks back and crouches, forearms on her knees. The camera follows her down " +
          "and settles at ground level.",
        say: "Taylor (S3) says, quietly, to herself:"
      }
    ],
    sound:
      "Gravel under her boots, the pack settling as she crouches, flies rising, and the canal behind.",
    music: "A low hesitant figure, two notes repeating."
  },

  /* ---------------------------------------------------------- 044 no other wounds */
  seg_044: {
    shots: [
      {
        text:
          "Taylor's hands turn the body's arm, then its chest, then its neck. The skin is intact apart from " +
          "the raw abrasions on the forearms where he dragged himself. Her fingers are careful and " +
          "clinical."
      },
      {
        text:
          "a closer angle on the intact throat and collarbone, then the ruined legs at the edge of frame. " +
          "The contrast is the point: everything above the knees is unmarked.",
        say: "A calm narrator's voice, off-screen, speaks:"
      }
    ],
    sound:
      "Fabric and skin moving under her hands, flies, her controlled breathing, and a low wind.",
    music: "A quiet held string, almost still."
  },

  /* ---------------------------------------------------------- 045 strip the body */
  seg_045: {
    shots: [
      {
        text:
          "the knife tip slides under the shirt and lifts the cloth away. Taylor checks every inch of skin " +
          "with the flat of the blade and her free hand: no bite, no claw, nothing. Her mouth is set in a " +
          "hard line.",
        say: "Taylor (S3) says, half impressed, half appalled:"
      }
    ],
    sound:
      "Cloth parting under the blade, flies, a wet rasp of fabric, and her slow exhale.",
    music: "A low, unsettled pulse."
  },

  /* ---------------------------------------------------------- 046 other routes */
  seg_046: {
    shots: [
      {
        text:
          "Taylor looks up from the body to the water, then to the air above the bank, then back to the " +
          "corpse. The knife is still in her hand, hanging loose. The camera holds on her eyes as the " +
          "question lands.",
        say: "Taylor (S3) says, working it out:"
      }
    ],
    sound:
      "Water moving, flies, wind, and a distant cry that might be human.",
    music: "A single sustained note with a faint dissonant overtone."
  },

  /* ---------------------------------------------------------- 047 droplets, water, air */
  seg_047: {
    shots: [
      {
        text:
          "Taylor tilts her head, lips moving silently as she counts possibilities. The canal and the dust " +
          "behind her fall out of focus until only her face and the movement of her mouth are sharp.",
        say: "Taylor's voice, close and internal, off-screen; her lips move without sound:"
      }
    ],
    sound:
      "Water, dust, flies, and her breath almost inaudible under the ambience.",
    music: "Three soft muted notes, spaced far apart."
  },

  /* ---------------------------------------------------------- 048 should have been a medic */
  seg_048: {
    shots: [
      {
        text:
          "Taylor stands and wipes the blood from her palms down her trousers. She looks at the distant " +
          "city, which still looks calm from here, and her jaw tightens.",
        say: "Taylor (S3) says, rueful, then flat:"
      }
    ],
    sound:
      "Hands brushing cloth, gravel, wind, and the city's low continuous murmur far away.",
    music: "A tired two-note figure that resolves downward."
  },

  /* ---------------------------------------------------------- 049 sound comes too close */
  seg_049: {
    shots: [
      {
        text:
          "Taylor walks on, head tilting slightly as if following something. The bank around her is wide " +
          "and empty, but the sound mix pushes distant screams close to the microphone, intimate and " +
          "wrong."
      },
      {
        text:
          "a wide shot from behind her, the empty bank stretching away, treeline on one side and canal on " +
          "the other. Nothing is near her, and the sound says otherwise.",
        say: "A calm narrator's voice, off-screen, speaks:"
      }
    ],
    sound:
      "Screams and roars pushed unnaturally close and dry, while wind and footsteps sit far back in the " +
      "mix.",
    music: "A low tone bending slowly upward, almost below hearing."
  },

  /* ---------------------------------------------------------- 050 nobody there */
  seg_050: {
    shots: [
      {
        text:
          "Taylor whips her head around. The camera swings with her, sweeping across empty gravel, the " +
          "motionless treeline and the crowded canal. There is no one behind her.",
        say: "A calm narrator's voice, off-screen, speaks:"
      }
    ],
    sound:
      "The whip of her ponytail, a sharp inhale, gravel under a turning boot, and the close-pressed " +
      "screams continuing.",
    music: "A sudden high string, cut short."
  },

  /* ---------------------------------------------------------- 051 what is happening */
  seg_051: {
    shots: [
      {
        text:
          "Taylor stands completely still, fingers pressed to her temple. Her lips barely part around the " +
          "words, and her eyes are unfocused, listening past the visible world.",
        say: "Taylor (S3) says, under her breath:"
      }
    ],
    sound:
      "A thin ringing tone, wind, and the distant sounds refusing to stay distant.",
    music: "A single wavering high note over silence."
  },

  /* ---------------------------------------------------------- 052 no wind, too much sound */
  seg_052: {
    shots: [
      {
        text:
          "a completely still shot of the bank: grass upright, leaves motionless, no wind at all. A bead of " +
          "sweat runs off Taylor's chin and falls out of frame."
      },
      {
        text:
          "Taylor's head snapping toward a sound coming from beyond the treeline, off-screen. The camera holds on " +
          "the empty green where the sound should have a source.",
        say: "A calm narrator's voice, off-screen, speaks:"
      }
    ],
    sound:
      "Total stillness, then a distant cry arriving with unnatural clarity, and the sweat drop landing " +
      "somewhere below.",
    music: "Silence, then one low struck note at the turn."
  },

  /* ---------------------------------------------------------- 053 the world splits into tracks */
  seg_053: {
    shots: [
      {
        text:
          "Taylor's pupils lose focus. The camera stays on her face, close and steady, while the sound " +
          "field separates: a woman crying, an old man's last wet sob, overlapping roars, each one " +
          "distinct."
      },
      {
        text:
          "a tight shot of her eyes moving as if tracking several things at once, none of them visible in frame. The bank " +
          "behind her is unchanged and ordinary."
      },
      {
        text:
          "a tight profile, her ear filling the edge of frame, the tendon in her jaw tight. The image " +
          "remains completely realistic, with no visual effects.",
        say: "A calm narrator's voice, off-screen, speaks:"
      }
    ],
    sound:
      "Distinct layers in the mix: a woman's sobbing, an old man's rattling last breath, and several " +
      "roars at different distances, each one locatable.",
    music: "A cluster of separate sustained tones, one per sound layer, slowly detuning."
  },

  /* ---------------------------------------------------------- 054 too much information */
  seg_054: {
    shots: [
      {
        text:
          "Taylor staggers half a step and claps a hand behind her ear. The camera shakes faintly with her " +
          "balance, then settles. No visual distortion, no effects; only her body reacting.",
        say: "A calm narrator's voice, off-screen, speaks:"
      }
    ],
    sound:
      "A dense wash of layered voices and roars, a high ringing tone, and her pained breath close to the " +
      "microphone.",
    music: "A dissonant swell pressing against the top of the mix."
  },

  /* ---------------------------------------------------------- 055 shut up */
  seg_055: {
    shots: [
      {
        text:
          "Taylor drops to one knee and shoves the steel rod blindly into the pack's side pocket. Both " +
          "palms clamp over her ears, knuckles white, her whole body curling around the pressure.",
        say: "Taylor (S3) says, teeth clenched:"
      }
    ],
    sound:
      "The rod scraping into canvas, her knees hitting gravel, palms sealing her ears, and the sounds " +
      "refusing to muffle.",
    music: "A tight high drone, painful and unbroken."
  },

  /* ---------------------------------------------------------- 056 it comes through the hands */
  seg_056: {
    shots: [
      {
        text:
          "an extreme close-up of Taylor's hands pressed over her ears, the skin blanched at the knuckles. " +
          "The vein at her temple stands out and pulses visibly."
      },
      {
        text:
          "her face from the side, eyes squeezed shut, jaw locked. The sounds stay bright and close, " +
          "completely unmuffled by her palms.",
        say: "A calm narrator's voice, off-screen, speaks:"
      }
    ],
    sound:
      "The full layered mix unchanged, as if her hands were not there, plus the pulse in her temple " +
      "audible.",
    music: "A high sustained tone beating slowly against a lower one."
  },

  /* ---------------------------------------------------------- 057 the hunger */
  seg_057: {
    shots: [
      {
        text:
          "Taylor's head comes up. The pain in her eyes changes into something else, focused and greedy. " +
          "She rips the pack off her back and throws it down on the gravel."
      },
      {
        text:
          "the pack hitting the ground and the zipper bursting open, wrappers and bottles spilling out. Taylor " +
          "drops over it on both knees, hands already inside.",
        say: "A calm narrator's voice, off-screen, speaks:"
      }
    ],
    sound:
      "A strap tearing loose, the pack hitting gravel, a zip bursting, and her breath turning fast and " +
      "shallow.",
    music: "A low hungry pulse, accelerating."
  },

  /* ---------------------------------------------------------- 058 eat */
  seg_058: {
    shots: [
      {
        text:
          "chocolate, crisps, a rice ball and a soft bread roll are swept onto the gravel and snatched back " +
          "up. Taylor eats with both hands, crumbs stuck to her chin, throat working continuously, eyes " +
          "still open and watchful.",
        say: ""
      }
    ],
    sound:
      "Wrappers tearing, dry food crushed, loud swallowing, and her breath snorting through her nose.",
    music: "A fast, ugly percussion figure with no melody."
  },

  /* ---------------------------------------------------------- 059 eating and listening */
  seg_059: {
    shots: [
      {
        text:
          "Taylor's mouth is full, but her head keeps turning: left, right, behind, tracking sounds only " +
          "she can place. Her eyes scan the treeline while her hands keep feeding her."
      },
      {
        text:
          "a wide shot of her crouched over the scattered food, small on the open bank, head snapping from " +
          "side to side like a radar dish.",
        say: "A calm narrator's voice, off-screen, speaks:"
      }
    ],
    sound:
      "Chewing and swallowing, wrapper crackle, and the layered distant sounds being sorted in real time.",
    music: "A nervous ticking under a low sustained tone."
  },

  /* ---------------------------------------------------------- 060 nothing left */
  seg_060: {
    shots: [
      {
        text:
          "empty wrappers and a flattened bottle spread across the gravel. Taylor licks her lips and looks " +
          "around for more, one hand still turning a torn packet over."
      },
      {
        text:
          "a close shot of her face: crumbs at the corner of her mouth, eyes still searching, not " +
          "satisfied. The hunger has not gone anywhere.",
        say: "A calm narrator's voice, off-screen, speaks:"
      }
    ],
    sound:
      "A last wrapper crumpling, her tongue against dry lips, wind, and the distant roar of the bank.",
    music: "A low pulse that does not resolve."
  },

  /* ---------------------------------------------------------- 061 the shoulder */
  seg_061: {
    shots: [
      {
        text:
          "Taylor's hand wipes across her mouth and stops in mid-air. Her eyes have caught something. The " +
          "camera pushes in past her hand to her shoulder, where the claw marks sit in torn fabric.",
        say: ""
      }
    ],
    sound:
      "A wrapper dropping, her breath stopping, and a faint wet ticking under the skin.",
    music: "A single high note entering over silence."
  },

  /* ---------------------------------------------------------- 062 purple veins */
  seg_062: {
    shots: [
      {
        text:
          "the skin around the claw marks: dark purple veins have surfaced and are spreading outward under " +
          "the skin like fine roots. Taylor twists to look, fingers frozen before they touch it.",
        say: "Taylor (S3) blurts out:"
      }
    ],
    sound:
      "Her sharp inhale, fabric twisting, and the low ambience dropping away.",
    music: "One hard low hit, then a high sustained tone."
  },

  /* ---------------------------------------------------------- 063 the other shoulder */
  seg_063: {
    shots: [
      {
        text:
          "Taylor turns her head slowly toward her other shoulder, and the second wound enters frame. The " +
          "purple veins there mirror the first almost exactly."
      },
      {
        text:
          "a two-shot of both shoulders in the same frame, the symmetrical spread unmistakable. Her hands " +
          "hang at her sides.",
        say: "A calm narrator's voice, off-screen, speaks:"
      }
    ],
    sound:
      "Fabric shifting, her breath shallow and fast, wind, and a distant roar.",
    music: "Two identical tones, slightly out of phase."
  },

  /* ---------------------------------------------------------- 064 one minute of contact */
  seg_064: {
    shots: [
      {
        text:
          "Taylor raises both hands in front of her face. Her knuckles tremble, dried blood dark in the " +
          "lines of her palms. She turns them over and looks at them as if they belong to someone else."
      },
      {
        text:
          "her face above her hands, the composure draining out of it. The bank behind her is bright and " +
          "indifferent.",
        say: "A calm narrator's voice, off-screen, speaks:"
      }
    ],
    sound:
      "A faint tremor in her breath, dry skin rubbing, wind, and the canal sounds far away.",
    music: "A low string line bending downward."
  },

  /* ---------------------------------------------------------- 065 scream */
  seg_065: {
    shots: [
      {
        text:
          "Taylor throws her head back and screams at the empty bank, neck tendons standing out, spit " +
          "catching the light. The sound bounces off the treeline and comes back.",
        say: "Taylor (S3) screams, raw:"
      }
    ],
    sound:
      "A full-throated scream with a short slap-back echo from the trees, then her ragged breathing.",
    music: "Silence under the scream, then a single low struck tone."
  },

  /* ---------------------------------------------------------- 066 the signs line up */
  seg_066: {
    shots: [
      {
        text:
          "a close-up of the purple veins under the skin, the fine web visibly wider than before."
      },
      {
        text:
          "Taylor's face as the understanding arrives. Her eyes stop moving, and for a moment the sound " +
          "around her drops away entirely.",
        say: "A calm narrator's voice, off-screen, speaks:"
      }
    ],
    sound:
      "A brief hole in the ambience, then the layered sounds rushing back in.",
    music: "A held tone that fades to near silence and returns."
  },

  /* ---------------------------------------------------------- 067 on her knees */
  seg_067: {
    shots: [
      {
        text:
          "Taylor drops to her knees on the gravel and drives her fists into the ground, once, twice, " +
          "again. Blood seeps from her knuckles, and each blow lands softer than the last.",
        say: "Taylor (S3) says, voice breaking:"
      }
    ],
    sound:
      "Fists striking gravel, small stones scattering, her breath hitching, and the canal behind.",
    music: "A low piano note repeating, slower each time."
  },

  /* ---------------------------------------------------------- 068 something harder arrives */
  seg_068: {
    shots: [
      {
        text:
          "Taylor stays on her knees, head down, breathing gradually evening out. The camera holds on her " +
          "back and the scattered wrappers."
      },
      {
        text:
          "her face lifting. The panic is gone; what replaces it is cold and deliberate, and her eyes " +
          "have stopped looking for a way out.",
        say: "A calm narrator's voice, off-screen, speaks:"
      }
    ],
    sound:
      "Her breathing settling, wind returning, a distant roar, and the gravel shifting under her knees.",
    music: "A low drone resolving into a single hard note."
  },

  /* ---------------------------------------------------------- 069 take company */
  seg_069: {
    shots: [
      {
        text:
          "Taylor wipes blood from the corner of her mouth with the back of her wrist. Her voice is calm, " +
          "almost conversational, and that is worse than the screaming.",
        say: "Taylor (S3) says, perfectly level:"
      }
    ],
    sound:
      "A wrist brushing dry skin, wind, and the distant bank still falling apart.",
    music: "A quiet, cold pulse."
  },

  /* ---------------------------------------------------------- 070 the last cut */
  seg_070: {
    shots: [
      {
        text:
          "Taylor stands and rotates the knife sheath around to the front of her hip. She checks the draw " +
          "angle twice, then a third time, movements neat and methodical, like she is adjusting a uniform.",
        say: "Taylor (S3) says, to herself:"
      }
    ],
    sound:
      "The sheath clip turning, the knife settling, fabric adjusted, and her steady breath.",
    music: "A slow, deliberate pulse marking each check."
  },

  /* ---------------------------------------------------------- 071 listen */
  seg_071: {
    shots: [
      {
        text:
          "Taylor closes her eyes. The camera rises over her shoulder and pushes toward the bank, where the " +
          "grounded fishing boat sits half-tilted, its hull dark against the bright water. The boat looks " +
          "like a dead animal.",
        say: "Taylor (S3) says, eyes still closed:"
      }
    ],
    sound:
      "Wind dropping, the canal lapping, then a faint metallic scrape from inside the boat, repeating.",
    music: "A single high harmonic over a low drone."
  },

  /* ---------------------------------------------------------- 072 walk to the boat */
  seg_072: {
    shots: [
      {
        text:
          "Taylor's fist closes around the bloodstained steel rod, squeezing blood out from between her " +
          "fingers. She starts walking and does not stop."
      },
      {
        text:
          "a wide shot from behind: her small figure crossing the open bank toward the tilted boat, rod " +
          "hanging from one hand, stride even and unhurried.",
        say: "A calm narrator's voice, off-screen, speaks:"
      }
    ],
    sound:
      "Steady boots on gravel, the rod swinging, wind, and the scrape from the boat growing clearer.",
    music: "A low percussive march, gaining weight."
  }
};
