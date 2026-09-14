import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const PROMPT = `integrated_multimodal_description:
[Shot 1] The camera sits close and slightly handheld, framing a young Japanese woman (S1) with light brown hair in a loose, tired ponytail bound by a red ribbon, sitting on a weathered wooden railing edge; a fluffy Shiba Inu with its snout very close to the lens occupies the left foreground with shallow depth of field; warm dusk lamplight softens her slightly tired but smiling face as she holds a small rice ball snack near her lips and blinks playfully; soft banner silhouettes flicker out of focus behind her.
(S1): 鬼退治のあとで……就是說、打完鬼以後囉。
(S1): 勝ったけど、ちょっと疲れた。
[Shot 2] At 00:03.500, the camera pulls back fast and tilts up as the frame transforms into a 90s retro poster: (S1) stands side-on, determined, hand pressing on the katana hilt at her hip, red ribbon and ponytail flowing in a light breeze; bold black calligraphy reads visible on-screen text "新·桃太娘" behind her with the subtitle "鬼退治のあとで。" in smaller print; golden key light, film grain and soft 90s print texture, the composition holds like a static title card.
新たな冒険は、まだ終わっていない——新·桃太娘。

overall_soundscape:
Warm village ambience at dusk, wooden creak of the railing, a soft contented exhale and gentle munching from the girl, quiet panting from the dog; a faint film-projector hum fades in as the poster locks up. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music:
Retro 90s synthwave cue with soft analog strings and a music-box pulse, playful and nostalgic, resolving into one heroic brass chord exactly at the poster lock-up, then holding a single sustained note.`;

const F = "D:/han/Niba/dev/Project20/doc/image_story";
const FIRST = F + "/799279325_10165198413067376_6084801744728169900_n.jpg";
const LAST = F + "/802821497_10165198414532376_8458038109672805895_n.jpg";

const transport = new StdioClientTransport({
  command: process.execPath,
  args: ["D:/han/Niba/dev/Project20/ai_gen_video/mcp_server_stdio.mjs"],
  env: { ...process.env, COMFY_SERVER: "http://192.168.0.193:8000" }
});

const client = new Client({ name: "cli-mcp-b01", version: "1.0.0" });
await client.connect(transport);

async function call(name, a) {
  const res = await client.callTool({ name, arguments: a });
  const text = (res.content || []).map((c) => c.text || "").join("");
  return JSON.parse(text);
}

try {
  const args = {
    prompt: PROMPT,
    first_frame: FIRST,
    last_frame: LAST,
    duration: 8,
    seed: 110101,
    width: 832,
    height: 1248,
    out: "i2v_momotaro"
  };
  const submit = await call("gen_i2v_video", args);
  console.log("[submit]", JSON.stringify(submit));
  const pid = submit.prompt_id;
  if (!pid) process.exit(1);

  const deadline = Date.now() + 40 * 60 * 1000;
  let last = "";
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 8000));
    let r;
    try { r = await call("query_comfy_result", { prompt_id: pid }); }
    catch (e) { console.error("[query-error]", e.message); continue; }
    const line = `[poll] ${new Date().toISOString()} ${r.status}`;
    if (line !== last) { console.log(line); last = line; }
    if (r.status === "completed" || r.status === "error" || r.status === "timeout") {
      console.log("[result]", JSON.stringify(r, null, 2));
      if (r.status === "timeout") {
        try {
          const rec = await call("download_from_history", { prompt_id: pid, out: "i2v_momotaro" });
          console.log("[recovered]", JSON.stringify(rec, null, 2));
        } catch (e) { console.error("[recover-error]", e.message); }
      }
      break;
    }
  }
} finally {
  await client.close();
}
process.exit(0);