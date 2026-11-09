/**
 * Chapter 1 prompt prose, part A (seg_001–seg_036).
 *
 * One entry per plan segment. `text` is the English picture description; dialogue is *not*
 * written here — the builder mirrors `spoken_text` from the plan into the `<d>` block.
 * `say` marks the shot that carries the speech, so a two-shot segment can split a long line.
 *
 * Character phrases are deliberately repeated verbatim: they are the text-only identity anchor
 * described in workspace/VIDEO_PROMPT_METHOD_1_T2V.md §2.2.
 */

const TAY =
  "Taylor (S3), 25, a lean athletic East Asian woman with a high black ponytail, sharp dark eyes, " +
  "a strong jaw and sun-tanned skin";
const TAYW =
  "Taylor (S3), the same lean 25-year-old East Asian woman with the high black ponytail and sharp " +
  "dark eyes, now with two fresh claw wounds across both shoulders, a torn olive shirt and " +
  "blood-streaked, mud-caked skin";
const INJ =
  "The injured man (S10), a gaunt 30-something East Asian man with a bloodless face, sweat-soaked " +
  "short black hair and a blood-soaked work shirt";
const TURN =
  "The turned man (S10), the same gaunt 30-something man, now with bloodshot eyes, grey-purple " +
  "necrotic skin, a broken jaw and clawed grey hands";

export const promptsA = {
  /* ---------------------------------------------------------- 001 title card */
  seg_001: {
    title: true,
    shots: [
      {
        text:
          "The grain is the only movement in the frame, drifting almost imperceptibly, with the blacks " +
          "deep but never crushed and a very slight warm cast in the highlights of the dust. The camera " +
          "holds completely static, no subject and no movement other than the film texture itself."
      }
    ],
    sound:
      "Near silence. A soft room tone with a faint optical film hiss, occasional tiny dust ticks, and a " +
      "very distant low rumble that slowly rises under the last two seconds.",
    music:
      "A low, ominous sub-bass drone emerging from silence, with a single distant metallic hit around " +
      "the two-second mark, holding on a quiet sustained tone into the next shot."
  },

  /* ---------------------------------------------------------- 002 distant crash */
  seg_002: {
    shots: [
      {
        text:
          "A long lens pushes slowly through a gap in the riverbank treeline toward the distant city. " +
          "Brake lights flare and lock as traffic freezes mid-intersection, and a thin column of black " +
          "smoke lifts from a block of rooftops. The image lags half a beat behind the sound, as if the " +
          "heat haze carries the noise before the event arrives. The camera creeps forward with a faint " +
          "handheld sway and settles on the smoke."
      }
    ],
    sound:
      "A sharp tyre screech tearing across the distance, then a heavy impact, a ripple of car alarms and " +
      "overlapping screams, all flattened by distance and heat, with dry leaves ticking in the " +
      "foreground.",
    music:
      "A single sustained high string, thin and anxious, rising under the distant crash and cutting to " +
      "silence as the smoke clears."
  },

  /* ---------------------------------------------------------- 003 Taylor complains */
  seg_003: {
    shots: [
      {
        text:
          `${TAY} stands on the gravel with a long dull steel rod tucked under one arm. She drags the back ` +
          "of her hand across her forehead, flicks the sweat away and looks off toward the smoke. Her " +
          "olive shirt is damp at the collar. A medium shot holds on her, the treeline and the distant " +
          "smoke soft behind her.",
        say: "Taylor (S3) says, breathless and annoyed:"
      }
    ],
    sound:
      "Wind pushing through dry leaves, gravel shifting under her boots, a faint siren far off in the " +
      "city, and her short, irritated exhale.",
    music: "A low percussive pulse, muted and restless, keeping time under her line."
  },

  /* ---------------------------------------------------------- 004 the canal, first look */
  seg_004: {
    shots: [
      {
        text:
          "An over-the-shoulder view past Taylor's ponytail and shoulder, down the bank to the canal. " +
          "Dozens of heads bob in the turbid green-brown water, arms reaching for the concrete edge. The " +
          "camera pushes in slowly, losing her shoulder, until the water fills the frame."
      },
      {
        text:
          "a closer angle low over the water: among the survivors, several faces have no colour left at " +
          "all, grey-white and slack, turned away from the lens as they drift with the current. Broken " +
          "bridge debris knocks softly against the bank.",
        say: "A calm narrator's voice, off-screen, speaks. Taylor's lips stay closed:"
      }
    ],
    sound:
      "Water slapping concrete, ragged breathing and splashing, debris knocking, and the low constant " +
      "roar of the current.",
    music: "A cold sustained string note, almost motionless, with a faint pulse under the second shot."
  },

  /* ---------------------------------------------------------- 005 the attack in the water */
  seg_005: {
    shots: [
      {
        text:
          "a wide shot across the canal surface. A grey hand breaks the water beside a swimmer's shoulder " +
          "and clamps down; the swimmer's head goes under. The camera holds still, letting the struggle " +
          "happen at the edge of the frame."
      },
      {
        text:
          "closer, at water level: dark red blooms open under the surface and are pulled apart by the " +
          "current, thinning into threads and vanishing downstream. More pale figures turn toward the " +
          "bank.",
        say: "A calm narrator's voice, off-screen, speaks:"
      }
    ],
    sound:
      "A shrill inhuman scream cutting over the water, frantic splashing, choked breaths, and the " +
      "current dragging everything downstream.",
    music:
      "A low brass swell, dissonant and slow, rising as the red spreads and cutting to a held note."
  },

  /* ---------------------------------------------------------- 006 close call */
  seg_006: {
    shots: [
      {
        text:
          `${TAY} walks fast along the bank, her knuckles pale around the rod. The camera tracks beside ` +
          "the rod at hip height, the dull steel filling the foreground, then tilts up to her face as she " +
          "speaks without breaking stride.",
        say: "Taylor (S3) says, half to herself:"
      }
    ],
    sound:
      "Boots crunching gravel in a fast rhythm, the rod humming faintly as it swings, water behind her, " +
      "and her breath still catching up.",
    music: "The same low pulse, tighter now, matching her stride."
  },

  /* ---------------------------------------------------------- 007 field diagnosis */
  seg_007: {
    shots: [
      {
        text:
          "a handheld half-shot that walks with her. Taylor glances at the water between sentences, sweat " +
          "running down her temple and jaw. Her free hand turns the rod slowly, thumb rubbing the worn " +
          "grip, as if the habit keeps her thinking straight.",
        say: "Taylor (S3) says, thinking out loud:"
      }
    ],
    sound:
      "Wind over the canal, distant screams thinning into the city noise, gravel under her boots, and a " +
      "short breath between phrases.",
    music: "A sparse two-note figure, repeating and unresolved."
  },

  /* ---------------------------------------------------------- 008 internal: do not get bitten */
  seg_008: {
    shots: [
      {
        text:
          "an extreme close-up of the lower half of Taylor's face, her back teeth clenched so hard the jaw " +
          "muscle stands out. Tree shadows sweep across her cheek as she walks, and a bead of sweat cuts " +
          "through the dust on her skin. Her lips do not move.",
        say: "Taylor's voice, close and internal, off-screen:"
      }
    ],
    sound:
      "Wind muffled as if heard through concentration, her footsteps distant, and a slow heartbeat-like " +
      "thud under the ambience.",
    music: "A single low pulse, almost inaudible, synced to the heartbeat."
  },

  /* ---------------------------------------------------------- 009 the treeline */
  seg_009: {
    shots: [
      {
        text:
          "Taylor slows, the rod lifting slightly in her grip. Dense bushes press in on both sides of the " +
          "path, and deep inside the green something shivers and settles, though nothing is visible. The " +
          "camera stays just behind her shoulder."
      },
      {
        text:
          "a tighter shot of the treeline. Leaves tremble, then a thin branch springs back into place. In " +
          "the foreground her shoulder tightens, fabric pulling at the sudden movement.",
        say: "A calm narrator's voice, off-screen, speaks. Taylor's lips stay closed:"
      }
    ],
    sound:
      "Dry rustle and branches ticking, insects sawing in the heat, then one deliberate snap deep in the " +
      "brush.",
    music: "A sparse high string, held and wavering, with silence around it."
  },

  /* ---------------------------------------------------------- 010 no way by water */
  seg_010: {
    shots: [
      {
        text:
          "a lateral pan that starts on the treeline and drags across the path to the canal: survivors and " +
          "pale figures crowd the bank, climbing over one another, hands hooked on the concrete lip."
      },
      {
        text:
          "Taylor's hands tightening on the rod, then tilting up to her face as she reads the water and " +
          "dismisses it. Behind her the canal stays crowded and loud.",
        say: "A calm narrator's voice, off-screen, speaks:"
      }
    ],
    sound:
      "Water and bodies scraping concrete, overlapping cries, and the rod's grip creaking under her " +
      "fingers.",
    music: "A low pulse under the pan, stopping as she turns away from the water."
  },

  /* ---------------------------------------------------------- 011 exposed at noon */
  seg_011: {
    shots: [
      {
        text:
          "a high overhead shot: Taylor's shadow has shrunk to a dark coin at her boots. The gravel bank " +
          "is completely open, heat shimmer twisting the far treeline, dry grass bleached pale at the " +
          "edges."
      },
      {
        text:
          "a very wide shot from the bank, Taylor a small upright figure between the dense green on one " +
          "side and the crowded canal on the other, nothing overhead but white noon sky.",
        say: "A calm narrator's voice, off-screen, speaks:"
      }
    ],
    sound:
      "Cicadas sawing without pause, a low heat hum, gravel shifting, and the canal sounds pushed far " +
      "back.",
    music: "A thin, dry drone with a faint irregular pulse."
  },

  /* ---------------------------------------------------------- 012 a hand in the brush */
  seg_012: {
    shots: [
      {
        text:
          "an empty stretch of bank, leaves trembling at the edge of the brush. A hand parts the green, " +
          "then a man drags himself out on his elbows, legs trailing. Taylor stops dead in the " +
          "foreground, the rod coming up across her body. The camera holds, letting the distance between " +
          "them read."
      }
    ],
    sound:
      "Brush snapping back, cloth dragging over gravel, a laboured wet breath, and the rod ticking " +
      "against her belt as she stops.",
    music: "One low struck note on the hand, then a held suspense tone."
  },

  /* ---------------------------------------------------------- 013 the call for help */
  seg_013: {
    shots: [
      {
        text:
          "a low angle at ground level: fingers dig into the gravel, and a bloodless face lifts toward the " +
          "lens. Taylor stands out of focus behind him, rod held ready. Dust hangs in the hard noon light " +
          "between them.",
        say: `${INJ} lifts his head and says, barely audible:`
      }
    ],
    sound:
      "Dry dragging, a weak voice cracking with effort, wind over gravel, and the distant canal.",
    music: "A sparse, wavering string line, almost drowned by the ambience."
  },

  /* ---------------------------------------------------------- 014 drag him clear */
  seg_014: {
    shots: [
      {
        text:
          "Taylor drops to one knee, presses a finger to her lips, sets the rod on the gravel and takes " +
          "the man's wrists. She hauls him backward, boots braced, and the camera follows her gaze down " +
          "his body to what is left of his legs.",
        say: "Taylor (S3) says, sharp and low:"
      }
    ],
    sound:
      "Gravel scraping under his weight, cloth tearing, her short effortful breaths, and the rod ringing " +
      "softly as it hits the ground.",
    music: "A low pulse that stops on the wordless beat at the end of her line."
  },

  /* ---------------------------------------------------------- 015 the legs */
  seg_015: {
    shots: [
      {
        text:
          "an insert that begins on his crushed lower legs, white bone showing through mud and blood, then " +
          "tilts slowly up the long red trail that leads back into the brush and finally to his white " +
          "lips. Flies are already at the wound.",
        say: `${INJ} says, voice shaking apart:`
      }
    ],
    sound:
      "Flies circling, his wet uneven breath, a weak voice, and the canal very far away.",
    music: "A low held cello note, barely moving."
  },

  /* ---------------------------------------------------------- 016 first aid */
  seg_016: {
    shots: [
      {
        text:
          "Taylor presses one hand flat on his shoulder and pulls the olive medical pouch open with the " +
          "other. She strips out a roll of gauze and a black tourniquet, eyes on the wound, never looking " +
          "up at his face. The camera holds close on her hands.",
        say: "Taylor (S3) says, flat and quick:"
      }
    ],
    sound:
      "A zip tearing open, gauze unwinding, the tourniquet's metal buckle clicking, and his ragged " +
      "breathing under her voice.",
    music: "A tight low pulse, businesslike and steady."
  },

  /* ---------------------------------------------------------- 017 the tourniquet */
  seg_017: {
    shots: [
      {
        text:
          "the tourniquet cinched high at his thigh, the strap pulled hard and locked. His fingers claw " +
          "into the mud, his throat fighting to keep the sound in. Her hands stay completely steady, " +
          "working with practised speed.",
        say: `${INJ} grinds out, jaw clamped:`
      }
    ],
    sound:
      "The strap creaking as it tightens, a choked groan, fingers scraping wet mud, and her controlled " +
      "breathing.",
    music: "A low sustained tone under the strain."
  },

  /* ---------------------------------------------------------- 018 not bitten */
  seg_018: {
    shots: [
      {
        text:
          `${INJ} grabs her forearm, knuckles white, his eyes going past her to the canal. He is trying ` +
          "to sit up and failing. Taylor's face is close to his, watching him, reading the truth of it.",
        say: `${INJ} says, words breaking apart:`
      }
    ],
    sound:
      "A weak grip on fabric, his uneven voice, water and distant cries, and wind crossing the gravel.",
    music: "A low drone with a faint rising edge."
  },

  /* ---------------------------------------------------------- 019 get him to a hospital */
  seg_019: {
    shots: [
      {
        text:
          "Taylor stuffs the remaining gauze back into the pouch and pulls the zip shut. She looks at him " +
          "directly now, her tone somewhere between comfort and an order, and shifts her weight to stand.",
        say: "Taylor (S3) says, firm:"
      }
    ],
    sound:
      "The pouch zip closing, gauze compressing, a boot finding purchase in the gravel, and his shallow " +
      "breathing.",
    music: "The pulse lifts a half-step, then settles."
  },

  /* ---------------------------------------------------------- 020 the piggyback */
  seg_020: {
    shots: [
      {
        text:
          "the steel rod slides into the side pocket of a black tactical backpack, the straps pulled tight " +
          "across her chest. Taylor crouches, drags the man's arm over her shoulder and stands; her knees " +
          "dip under the weight before she finds her balance.",
        say: "Taylor (S3) says, already out of breath:"
      }
    ],
    sound:
      "The rod sliding into canvas, buckles tightening, his weight settling against her back, and one hard " +
      "exhale as she stands.",
    music: "Low strings under the physical effort, then a steady walking pulse."
  },

  /* ---------------------------------------------------------- 021 no stairs */
  seg_021: {
    shots: [
      {
        text:
          "a long lens watches Taylor walk bowed under the man's weight along the bank. Ahead there is no " +
          "stair, no ramp, only an endless seam of treeline and concrete embankment. Her speed has dropped " +
          "visibly, each step placed rather than taken.",
        say: "Taylor (S3) says, turning her head toward him:"
      }
    ],
    sound:
      "Slow boots on gravel, her laboured breath, the man's weight shifting in the straps, and water " +
      "running beside them.",
    music: "A slow, plodding pulse with a thin string above it."
  },

  /* ---------------------------------------------------------- 022 his head drops */
  seg_022: {
    shots: [
      {
        text:
          "over Taylor's shoulder: the man's head has lolled against her neck, his lips grey, the side of " +
          "his face slack. She turns her head, jostles him with an elbow and tries to look at him without " +
          "stopping.",
        say: "Taylor (S3) says, low and urgent:"
      }
    ],
    sound:
      "Her boots slowing, fabric shifting as she jostles him, her voice kept low, and no answer at all.",
    music: "A low tremolo entering under the ambience."
  },

  /* ---------------------------------------------------------- 023 he starts to move */
  seg_023: {
    shots: [
      {
        text:
          "Taylor's free hand reaches back and pats his cheek, once, twice, no response. The camera drops " +
          "to his dangling fingers, which begin to twitch in a slow unnatural rhythm, joints bending in " +
          "the wrong order.",
        say: ""
      }
    ],
    sound:
      "A soft slap of palm on cheek, cloth shifting, her breath catching, and a faint dry crack of joints.",
    music: "A dissonant swell, quiet but rising, with no rhythm."
  },

  /* ---------------------------------------------------------- 024 he turns */
  seg_024: {
    shots: [
      {
        text:
          "his face snaps up from her neck, eyes flooded with bloodshot red, jaw opening far past its " +
          "natural limit. Taylor's pupil contracts to a point. The camera holds tight on both faces in " +
          "profile.",
        say: `${TURN} roars, raw and inhuman:`
      }
    ],
    sound:
      "A tearing animal roar an inch from her ear, fabric ripping at the shoulders, and her sharp intake " +
      "of breath.",
    music: "One hard low hit, then a fast rising cluster."
  },

  /* ---------------------------------------------------------- 025 the headbutt */
  seg_025: {
    shots: [
      {
        text:
          "ten fingers sink into Taylor's shoulders, the fabric pulled taut. She whips her head back and " +
          "drives her forehead into his mouth; several teeth fly out of frame. The camera shakes with the " +
          "impact and stays close.",
        say: "Taylor (S3) shouts, voice ripped out of her:"
      }
    ],
    sound:
      "A dense bone-on-bone impact, teeth clattering on gravel, a pained grunt, and his fingers digging " +
      "deeper.",
    music: "A hard percussion hit on the impact, then a driving pulse."
  },

  /* ---------------------------------------------------------- 026 it feels nothing */
  seg_026: {
    shots: [
      {
        text:
          "Taylor rears back and strikes again, then again. Blood and spit fly from his mouth, but his " +
          "fingers only hook deeper into her shoulders. The camera stays tight, refusing to cut away from " +
          "the work."
      }
    ],
    sound:
      "Repeated dull impacts, wet breath, a low gurgle, and the gravel shifting under their combined " +
      "weight.",
    music: "A relentless mid-tempo percussion figure, no melody."
  },

  /* ---------------------------------------------------------- 027 keep hitting */
  seg_027: {
    shots: [
      {
        text:
          "Taylor's ponytail whips across the frame as her forehead slams down again and again. His jaw " +
          "deforms under the blows, the skin splitting at the corner of his mouth.",
        say: "Taylor (S3) grunts, each word punctuated by a strike:"
      }
    ],
    sound:
      "Dense impacts in a broken rhythm, his wet gargle, her breath tearing in and out.",
    music: "Percussion locked to the impacts, tightening with each one."
  },

  /* ---------------------------------------------------------- 028 reach for the blade */
  seg_028: {
    shots: [
      {
        text:
          "Taylor's forehead is slick with blood, but her eyes are completely calm. While his head is " +
          "knocked to one side, her hand slides down and finds the sheath at her hip. The camera pushes " +
          "in on the movement.",
        say: ""
      }
    ],
    sound:
      "Her breath, his fingers shifting on her shoulders, and leather creaking as the sheath is found.",
    music: "The percussion drops away to a single low held note."
  },

  /* ---------------------------------------------------------- 029 the thumb */
  seg_029: {
    shots: [
      {
        text:
          "the blade flashes in a short reverse arc and his left thumb spins away with a thread of blood. " +
          "His grip collapses; Taylor pitches forward and throws him off her back onto the gravel.",
        say: ""
      }
    ],
    sound:
      "A short blade slice, a body hitting the ground, gravel spraying, and his limbs flopping loose.",
    music: "One sharp hit on the slice, then a low accelerating pulse."
  },

  /* ---------------------------------------------------------- 030 the first stab */
  seg_030: {
    shots: [
      {
        text:
          "Taylor straddles him, reverses the knife and drives it down through the crown of his skull. His " +
          "hands keep clawing at the ground, fingers raking lines in the gravel.",
        say: "Taylor (S3) snarls:"
      }
    ],
    sound:
      "A wet impact, the hilt seating, gravel raked by nails, and his body still thrashing.",
    music: "A low struck tone under her voice."
  },

  /* ---------------------------------------------------------- 031 the blade is not enough */
  seg_031: {
    shots: [
      {
        text:
          "the knife buried to the guard, a muffled crack travelling through the skull. His hands continue " +
          "to rake the gravel, heels kicking, chest still working. The camera holds on the impossible " +
          "movement.",
        say: ""
      }
    ],
    sound:
      "A muffled internal crack, nails scraping stone, heels drumming, and his wet broken breathing.",
    music: "A sustained low cluster, rising very slowly."
  },

  /* ---------------------------------------------------------- 032 the rod */
  seg_032: {
    shots: [
      {
        text:
          "Taylor rips the steel rod from her back, the dull length pulling a blunt arc of light through " +
          "the air. The first blow lands on his skull and bone chips spray across the gravel.",
        say: "Taylor (S3) shouts:"
      }
    ],
    sound:
      "The rod clearing canvas, a heavy whoosh, then a flat cracking impact with debris scattering.",
    music: "A hard percussion stab on the first blow."
  },

  /* ---------------------------------------------------------- 033 twenty blows */
  seg_033: {
    shots: [
      {
        text:
          "the rod becomes a blur, stroke after stroke, blood and grey tissue spattering Taylor's face and " +
          "collar. The camera stays close and never looks away. After the last blow the frame holds only " +
          "on her back, heaving, the rod hanging at her side.",
        say: ""
      }
    ],
    sound:
      "A long series of heavy impacts, wet bursts, gravel scattering, her ragged breathing, then nothing " +
      "but breath.",
    music: "Percussion building with the blows, then cutting to one sustained low tone."
  },

  /* ---------------------------------------------------------- 034 the shoulders */
  seg_034: {
    shots: [
      {
        text:
          `${TAYW} wipes the sweat from her neck and yanks the pack straps straight. Her face twists` +
          "mid-motion. The camera drops to her shoulder: the shirt is torn open and several claw marks " +
          "bead bright red against the skin.",
        say: "Taylor (S3) says, breathless and disgusted:"
      }
    ],
    sound:
      "Her breath slowing, a strap pulled tight, fabric parting, and the gravel settling.",
    music: "The low tone thins out, leaving a faint pulse."
  },

  /* ---------------------------------------------------------- 035 not bitten */
  seg_035: {
    shots: [
      {
        text:
          "Taylor turns her head to look at the wounds, wipes a bead of blood away with her thumb and " +
          "studies the smear. Her eyes do not soften. Behind her the bank is still and bright.",
        say: "Taylor (S3) says, through her teeth:"
      }
    ],
    sound:
      "Wind moving through dry grass, distant screams carrying over the water, and her slow exhale.",
    music: "A quiet drone with a single unresolved string note."
  },

  /* ---------------------------------------------------------- 036 the bank gets worse */
  seg_036: {
    shots: [
      {
        text:
          "Taylor looks back. Far down the bank the crowd is running, falling, pulled down in twos and " +
          "threes. The pale figures move between them without hurry."
      },
      {
        text:
          "a close shot of her face as the layered sounds press in from every direction. She holds still " +
          "for one beat, then turns forward again and starts walking.",
        say: "A calm narrator's voice, off-screen, speaks:"
      }
    ],
    sound:
      "Layered screams and inhuman roars rising over the water, running feet on gravel, and the current " +
      "under everything.",
    music: "A low orchestral swell that does not resolve."
  }
};
