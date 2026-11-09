/**
 * Chapter 1 prompt prose, part C (seg_073–seg_081): the boat, the cabin, the girl, the end card.
 */

const TAYW =
  "Taylor (S3), the same lean 25-year-old East Asian woman with the high black ponytail and sharp " +
  "dark eyes, now with two fresh claw wounds across both shoulders, a torn olive shirt and " +
  "blood-streaked, mud-caked skin";
const GIRL =
  "The girl (S11), a slight 14-to-16-year-old East Asian girl with shoulder-length black hair, a " +
  "dirt-smudged face, deathly grey hands and a ragged hoodie";

export const promptsC = {
  /* ---------------------------------------------------------- 073 the hull */
  seg_073: {
    shots: [
      {
        text:
          "a low angle looking up the tilted hull: rusted rails, paint cracked into dry plates, and a " +
          "white-grey ring of barnacles along the waterline. The boat groans very slightly against the " +
          "bank.",
        say: "A calm narrator's voice, off-screen, speaks:"
      }
    ],
    sound:
      "Water lapping the hull, metal ticking as it settles, wind through the rails, and the scrape from " +
      "inside, faint but regular.",
    music: "A low metallic drone, like a struck hull."
  },

  /* ---------------------------------------------------------- 074 into the boat */
  seg_074: {
    shots: [
      {
        text:
          `${TAYW} ducks through the hatch, the steel rod held low. The camera follows her into a dim ` +
          "corridor, water reflecting on the boards, dust turning slowly in the shafts of light from " +
          "above."
      },
      {
        text:
          "a deeper angle inside the boat: water seeping down the steps into the lowest deck, and the " +
          "sounds of the boat bounce off the narrow walls, small and close.",
        say: "A calm narrator's voice, off-screen, speaks:"
      }
    ],
    sound:
      "Water dripping and trickling, wood flexing, metal humming, and a distant roar folded into the " +
      "corridor's echo.",
    music: "A low resonant tone with irregular water-like ticks."
  },

  /* ---------------------------------------------------------- 075 sonar */
  seg_075: {
    shots: [
      {
        text:
          "an extreme close-up of a ripple crossing the flooded floorboards, then Taylor's ear as she " +
          "tilts her head to follow it."
      },
      {
        text:
          "a low tracking shot that creeps forward along the corridor, past closed doors and dark " +
          "openings, as if tracing floor lines only she can see.",
        say: "A calm narrator's voice, off-screen, speaks:"
      }
    ],
    sound:
      "Every ripple and drip isolated and clear, the hull ticking, and her slow breathing.",
    music: "A high sustained tone with a second tone answering it."
  },

  /* ---------------------------------------------------------- 076 none of them get out */
  seg_076: {
    shots: [
      {
        text:
          `${TAYW} stands in the middle of the corridor, the steel rod hanging at her thigh. Light from ` +
          "the hatch behind her stretches her shadow down the wet boards toward the camera.",
        say: "Taylor (S3) says, quietly:"
      }
    ],
    sound:
      "Water dripping, the hull settling, and somewhere above a single scrape dragging across wood.",
    music: "A low pulse with a thin high line over it."
  },

  /* ---------------------------------------------------------- 077 up the stairs */
  seg_077: {
    shots: [
      {
        text:
          "her boots push through standing water, each step pulling a sticky creak from the boards. The " +
          "camera follows her up the narrow stairs, the light changing as she climbs, and stops behind her " +
          "at a white door with a faded nameplate.",
        say: ""
      }
    ],
    sound:
      "Water sloshing, wet soles peeling off wood, the rod ticking against a rail, and the scrape on the " +
      "other side of the door.",
    music: "A single low note per step."
  },

  /* ---------------------------------------------------------- 078 kick the door */
  seg_078: {
    shots: [
      {
        text:
          `${TAYW} steps back half a pace and drives her boot into the rotten door. The wood bursts inward, ` +
          "splinters and dust blowing into the cabin light.",
        say: "Taylor (S3) shouts, low and savage:"
      }
    ],
    sound:
      "A boot heel striking wood, the door splitting, splinters clattering across the floor, and dust " +
      "settling.",
    music: "One hard hit, then a low sustained tone."
  },

  /* ---------------------------------------------------------- 079 the girl */
  seg_079: {
    shots: [
      {
        text:
          "the door falls away and the dust clears: a slight girl crouches beside a sailor's corpse, her " +
          "hands deathly grey, rifling the dead man's pockets in quick frantic movements. An oversized " +
          "bright green T-rex backpack covers most of her back, its plush head slumped against her " +
          "shoulder. The camera holds from the doorway.",
        say: ""
      }
    ],
    sound:
      "The door settling flat, dust sifting, quick hands patting cloth, and the girl's fast shallow " +
      "breathing.",
    music: "A high suspended note, refusing to resolve."
  },

  /* ---------------------------------------------------------- 080 the swing */
  seg_080: {
    shots: [
      {
        text:
          `${TAYW} crashes through the doorway, the steel rod already swinging. ${GIRL} is still turned ` +
          "away, the green T-rex backpack filling the centre of frame, and the rod blurs toward the back " +
          "of her head.",
        say: "Taylor (S3) roars:"
      }
    ],
    sound:
      "Boots breaking boards, the rod cutting air, and a single sharp intake of breath from the girl.",
    music: "A hard percussion hit on the swing, cut off before impact."
  },

  /* ---------------------------------------------------------- 081 end card */
  seg_081: {
    title: true,
    shots: [
      {
        text:
          "The grain drifts slowly through the black, with dust motes and a few fine scratches catching " +
          "the light. The camera holds completely static. There is no lettering and no image of any kind; " +
          "the slate stays empty so the end title can be laid over it in post."
      }
    ],
    sound:
      "Near silence. A faint optical film hiss, a distant low rumble, and the last of the boat's metal " +
      "ticks dying away.",
    music:
      "The low sub-bass drone returns, louder than the opening, then drops away to one sustained note and " +
      "stops."
  }
};
