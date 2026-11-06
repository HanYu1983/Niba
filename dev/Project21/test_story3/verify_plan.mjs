import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const txt = readFileSync("story_ch0.txt", "utf8");
const plan = JSON.parse(readFileSync("plan.ch0.json", "utf8"));

const joined = plan.segments.map((s) => s.source).join("");
const checks = {
  hash_matches:
    createHash("sha256").update(joined).digest("hex") === plan.source.sha256 &&
    createHash("sha256").update(txt).digest("hex") === plan.source.sha256,
  join_matches_file: joined === txt,
  contiguous: plan.segments.every((s, i) => i === 0 || plan.segments[i - 1].source_end === s.source_start),
  span_matches_length: plan.segments.every((s) => s.source_end - s.source_start === s.source.length),
  scene_first: plan.segments.every((s) => s.reference_images[0]?.role === "scene"),
  entities_have_first_seen: [...plan.entities.characters, ...plan.entities.props, ...plan.entities.locations].every(
    (e) => typeof e.first_seen === "string"
  ),
  max_refs: Math.max(...plan.segments.map((s) => s.reference_images.length))
};

console.log(checks);
console.log(
  "\nfixed segments:\n" +
    plan.segments
      .filter((s) => ["seg_044", "seg_045", "seg_046", "seg_047"].includes(s.id))
      .map((s) => `${s.id} ${s.kind}/${s.location_ref} ${JSON.stringify(s.source.slice(0, 30))}`)
      .join("\n")
);
console.log(
  "\nfirst_seen:\n" +
    [...plan.entities.characters, ...plan.entities.props, ...plan.entities.locations]
      .map((e) => `${e.id.padEnd(24)} ${e.first_seen}`)
      .join("\n")
);
