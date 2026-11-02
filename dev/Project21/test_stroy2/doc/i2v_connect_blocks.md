# 首尾幀連接法（i2v Connect）— B1~B3

- 靈感來源：`doc/image_story_prompts.md`（37 張圖各自的提示詞）。
- 不參照任何故事腳本（不引用 `story.md` / `story_i2v_blocks.md`）。
- 做法：由「單一張圖的提示詞」發想它的「開頭幀」與「結尾幀」，用 i2v 的首幀→末幀動畫拼出連續短區塊。
- 每區塊 1–2 秒（若能就 1 秒），一次只呈現「一個」連續小動作。
- **無對白**：取消所有臺詞／字詞；只允許氣息聲與短促喉音（ふぅ…、はっ、むふっ、あっ…），不構成字詞。

## 方法規則

1. **首尾幀鏈**：圖 N 同時是「B(N-1) 的末幀」與「BN 的首幀」，用以保證段落黏著。
2. **連接判定**：
   - **直接連接**：兩圖的構圖、人物姿態、動物位置相近 → 給「首幀＋末幀」，動作延續。
   - **轉場連接**：兩圖場景／光線／姿勢跳幅過大 → **仍給「首幀＋末幀」**，但在提示詞內描述一個「同一鏡頭內的過渡」（甩鏡、花瓣風、光暈滑過、推進落定），讓畫面在一個連續鏡頭內自然變化，**不做硬切、不用首幀-only**。
3. **語音錨點**：無對白；僅允許不構成字詞的氣息／短促喉音（ふぅ…、はっ、むふっ…、あっ…）。
4. **畫面尺寸**：384×512（3:4），與既有輸出一致（僅供參考，非本文件規範）。

## 圖片對照（01–37）

| 區塊 | 首幀圖 | 末幀圖 |
|---|---|---|
| B1 | 01 `frame01.jpg` | 02 `frame02.jpg` |
| B2 | 02 `frame02.jpg` | 03 `frame03.jpg` |
| B3 | 03 `frame03.jpg` | 04 `frame04.jpg` |
| B4 | 04 `frame04.jpg` | 05 `frame05.jpg` |
| B5 | 05 `frame05.jpg` | 06 `frame06.jpg` |
| B6 | 06 `frame06.jpg` | 07 `frame07.jpg` |
| B7 | 07 `frame07.jpg` | 08 `frame08.jpg` |
| B8 | 08 `frame08.jpg` | 09 `frame09.jpg` |
| B9 | 09 `frame09.jpg` | 10 `frame10.jpg` |
| B10 | 10 `frame10.jpg` | 11 `frame11.jpg` |
| B11 | 11 `frame11.jpg` | 12 `frame12.jpg` |
| B12 | 12 `frame12.jpg` | 13 `frame13.jpg` |
| B13 | 13 `frame13.jpg` | 14 `frame14.jpg` |
| B14 | 14 `frame14.jpg` | 15 `frame15.jpg` |
| B15 | 15 `frame15.jpg` | 16 `frame16.jpg` |
| B16 | 16 `frame16.jpg` | 17 `frame17.jpg` |
| B17 | 17 `frame17.jpg` | 18 `frame18.jpg` |
| B18 | 18 `frame18.jpg` | 19 `frame19.jpg` |
| B19 | 19 `frame19.jpg` | 20 `frame20.jpg` |
| B20 | 20 `frame20.jpg` | 21 `frame21.jpg` |
| B21 | 21 `frame21.jpg` | 22 `frame22.jpg` |
| B22 | 22 `frame22.jpg` | 23 `frame23.jpg` |
| B23 | 23 `frame23.jpg` | 24 `frame24.jpg` |
| B24 | 24 `frame24.jpg` | 25 `frame25.jpg` |
| B25 | 25 `frame25.jpg` | 26 `frame26.jpg` |
| B26 | 26 `frame26.jpg` | 27 `frame27.jpg` |
| B27 | 27 `frame27.jpg` | 28 `frame28.jpg` |
| B28 | 28 `frame28.jpg` | 29 `frame29.jpg` |
| B29 | 29 `frame29.jpg` | 30 `frame30.jpg` |
| B30 | 30 `frame30.jpg` | 31 `frame31.jpg` |
| B31 | 31 `frame31.jpg` | 32 `frame32.jpg` |
| B32 | 32 `frame32.jpg` | 33 `frame33.jpg` |
| B33 | 33 `frame33.jpg` | 34 `frame34.jpg` |
| B34 | 34 `frame34.jpg` | 35 `frame35.jpg` |
| B35 | 35 `frame35.jpg` | 36 `frame36.jpg` |
| B36 | 36 `frame36.jpg` | 37 `frame37.jpg` |
| B37 | 37 `frame37.jpg` | —（收尾浮鏡） |

---

## B1（圖01 → 圖02，直接連接）

- **類型**：直接連接。同一人、氛圍延續；由「鏡前疲憊但滿足」轉為「挺身的英雄站姿」。
- **長度**：1–2 秒。
- **連接設計**：視線由鏡頭移開 → 斂起疲態、肩背挺直 → 一手落上刀柄 → 定出堅定站姿。柴犬維持在腳側近景。
- **語音**：僅一聲輕嘆「ふぅ……」。
- **i2v 提示詞草稿**：
  ```
  The tired-but-content girl holds her gaze at the camera for a moment, blinks, looks away,
  straightens from the shoulders, and plants one hand on the katana hilt, settling into a
  determined hero stance; the Shiba Inu stays low at her feet.
  Speech: no words, only a soft sigh 「ふぅ……」.
  ```

## B2（圖02 → 圖03，轉場）

- **類型**：轉場（含首尾幀）。英雄站姿 → 棧橋坐姿，姿態跳幅大，用提示詞在同一連續鏡頭內過渡。
- **長度**：2 秒。
- **連接設計**：首幀（圖02）＋末幀（圖03）：鏡頭「甩過去」、桃瓣與暖光橫掃畫面，畫面落定時她已盤坐在棧橋、白色「旅」字球在手中；狗在側、猴在後、雉在肩。
- **語音**：無。
- **i2v 提示詞草稿**：
  ```
  A continuous whip-pan from the girl's standing hero pose: a gust of wind carries peach
  petals and a flash of warm light across the frame, and as the motion settles she rests
  cross-legged on the wooden dock, Shiba Inu beside her, monkey behind, pheasant on her
  shoulder, a white travel orb in her hands. One flowing camera move, no cut, no hard jump.
  No speech.
  ```

## B3（圖03 → 圖04，直接連接）

- **類型**：直接連接。同為坐姿、手部動作延續：捧球 → 拋球 → 仰身伸展。
- **長度**：1–2 秒。
- **連接設計**：她雙手捧白色「旅」字球順勢往上拋 → 視線跟著球的弧線 → 順勢仰身、單臂高舉伸展（對應圖04 的舒展姿）；柴犬視線隨球、猴與雉也抬頭看。
- **語音**：僅一聲短促「はっ！」。
- **i2v 提示詞草稿**：
  ```
  Seated on the dock, she tosses the white travel orb upward and follows its arc with her
  eyes, then lets herself lean back in a lazy stretch, one arm rising overhead; the Shiba Inu
  watches the orb and the monkey and pheasant tilt their heads up.
  Speech: no words, only a sharp breath 「はっ！」.
  ```

## B4（圖04 → 圖05，直接連接）

- **類型**：直接連接。同為貼地姿態：由「仰身單臂舒展」轉為「單膝跪地、抬望長輩」。
- **長度**：1 秒。
- **連接設計**：放下高舉的手臂 → 順勢前傾、單膝跪上泥土 → 抬眸望向門前長輩；旗幟在後輕晃。
- **語音**：僅一聲輕嘆「ふぅ……」。
- **i2v 提示詞草稿**：
  ```
  Stretching with one arm raised overhead against the warm platform, the girl lets the arm
  fall as she shifts forward, coming down onto one knee on the packed dirt, then lifts her
  eyes toward the elder standing in the gate ahead; the banner sways gently behind her.
  Speech: no words, only a light exhale 「ふぅ……」.
  ```

## B5（圖05 → 圖06，直接連接）

- **類型**：直接連接。同一場域（村口長輩同框）、站姿→起步。
- **長度**：2 秒。
- **連接設計**：由跪姿起身 → 踏上土路邁步 → 回頭望一眼門口的長輩；柴犬在腳側小跑。
- **語音**：僅一聲輕吸「あっ…」。
- **i2v 提示詞草稿**：
  ```
  She rises from the kneel, steps onto the dirt path and starts walking, then glances back
  over her shoulder past the trotting Shiba Inu at the elder waving warmly from the doorway,
  a gentle smile on her face.
  Speech: no words, only a small breath 「あっ…」.
  ```

## B6（圖06 → 圖07，直接連接）

- **類型**：直接連接。頭部視線一氣呵成：回望 → 轉正 → 低望柴犬。
- **長度**：1 秒。
- **連接設計**：把視線從後方收回、落向腳邊柴犬，彎身伸手輕撫狗頭；背上的桃太郎行囊隨之輕晃。
- **語音**：僅一聲細微吐息「ふ…」。
- **i2v 提示詞草稿**：
  ```
  She turns her gaze forward and down to the Shiba Inu at her feet, bending slightly and
  reaching a hand toward its head with a soft, affectionate expression; the travel bundle
  shifts on her back.
  Speech: no words, only a small breathy exhale 「ふ…」.
  ```

## B7（圖07 → 圖08，轉場）

- **類型**：轉場（含首尾幀）。站著撫狗 → 坐在石階飲水（加入水缽、猴、雉），用提示詞過渡。
- **長度**：2 秒。
- **連接設計**：她沿鏡頭落座到石階；一記暖光橫掃，水缽流水、側躺的柴犬、岩石上的猴與木柱上的雉隨之安定入鏡，她舉起葫蘆飲水。
- **語音**：無。
- **i2v 提示詞草稿**：
  ```
  One continuous camera move: as she lowers herself onto the stone ledge, a sweep of warm
  light passes across the frame and the stone spout basin, the reclining Shiba Inu, the
  monkey on the rock and the perched pheasant settle around her; she lifts the gourd and
  drinks with eyes closed.
  Speech: none.
  ```

## B8（圖08 → 圖09，直接連接）

- **類型**：直接連接。水主題延續：飲水 → 溪邊掬水，同伴構圖相近。
- **長度**：2 秒。
- **連接設計**：放下葫蘆 → 挪到清淺溪邊蹲下 → 伸手掬起冰涼溪水；柴犬在苔岩旁聞著盛粢粑的竹籃。
- **語音**：僅一聲輕嘆「ふぅ……」。
- **i2v 提示詞草稿**：
  ```
  She lowers the gourd, steps to the edge of the mountain stream and crouches there, cupping
  clear water in her hands; the Shiba Inu sniffs near the rice-cake basket on the mossy
  rocks beside her, serene and sun-dappled.
  Speech: no words, only a quiet sigh 「ふぅ……」.
  ```

## B9（圖09 → 圖10，轉場）

- **類型**：轉場（含首尾幀）。溪畔蹲姿 → 木廊據地圖，環境跳幅大，用提示詞過渡。
- **長度**：2 秒。
- **連接設計**：鏡頭上揚並橫移，把她從溪畔帶到木廊；暖光與花瓣掠過，落定時她已在攤開的地圖前蹲下，指尖朝「鬼ヶ島」紅叉描去。
- **語音**：無。
- **i2v 提示詞草稿**：
  ```
  A continuous rising and swinging camera move carries her from the streamside to the wooden
  porch; warm light and a few drifting petals sweep past, and as the motion settles she
  crouches over the parchment map, one fingertip tracing toward the island marked with a red
  cross.
  Speech: none.
  ```

## B10（圖10 → 圖11，直接連接）

- **類型**：直接連接。蹲姿延續、指尖由地圖移到路標、畫面打開到山徑。
- **長度**：2 秒。
- **連接設計**：她從地圖上直起身、站起；畫面推向陽光山徑，手掌落在指向「鬼島」的路標上，柴犬背著行囊並肩前行，盡頭是藍海。
- **語音**：僅一聲平穩呼氣「ふぅ……」。
- **i2v 提示詞草稿**：
  ```
  She lifts from the map and rises; the view opens onto the sunlit mountain trail and her
  hand lands on the wooden signpost pointing toward Oni Island, the Shiba Inu walking
  alongside with its pack, the trail winding toward a blue sea.
  Speech: no words, only a steady breath 「ふぅ……」.
  ```

## B11（圖11 → 圖12，轉場）

- **類型**：轉場。山徑路標 → 露天溫泉，蒸汽與暖光過渡。
- **長度**：2 秒。
- **連接設計**：她自路標前踏下；蒸汽與暖光橫掃，落入溫泉，沉坐水中、曲膝，狗與猴在側泡著。
- **語音**：無。
- **i2v 提示詞草稿**：
  ```
  A continuous camera drop with rising steam and a sweep of warm light carries her from the
  signpost mountain trail down into the open-air hot spring; as it settles she rests in the
  water with knees drawn up, the Shiba Inu and the monkey lounging beside her.
  Speech: none.
  ```

## B12（圖12 → 圖13，轉場）

- **類型**：轉場。露天浴 → 夜晚旅館飯桌，燈籠暖光過渡。
- **長度**：2 秒。
- **連接設計**：燈籠光與蒸汽把畫面從外浴帶進夜館；她眨眼俏皮、以筷子獻上烤魚，狗與猴饞望。
- **語音**：無。
- **i2v 提示詞草稿**：
  ```
  A warm lantern glow and rising steam carry the frame from the open-air bath to the night
  inn table; she settles into a playful wink, chopsticks offering grilled fish while the dog
  and monkey watch the food.
  Speech: none.
  ```

## B13（圖13 → 圖14，直接連接）

- **類型**：直接連接。同為夜間內室、玩心延續：飯桌 → 鋪上玩牌。
- **長度**：2 秒。
- **連接設計**：她從飯桌退開、翻上榻榻米趴下、踢起雙腳，將桃符牌貼近臉旁眨眼；猴也來湊一扇牌。
- **語音**：僅一聲輕笑氣「むふっ」。
- **i2v 提示詞草稿**：
  ```
  She turns from the inn table, slips onto the futon onto her stomach with feet kicked up,
  flicking a peach-symbol playing card near her face with a playful look; the monkey mirrors
  her with its fan of cards.
  Speech: no words, only a light giggle-breath 「むふっ」.
  ```

## B14（圖14 → 圖15，轉場）

- **類型**：轉場。打牌玩樂 → 手持血染鬼面旗、神情凝重，燭光陰影過渡。
- **長度**：2 秒。
- **連接設計**：牌影一暗，她端正坐起，雙手捧起染血的鬼面旗，凝重注視；鬍髯漢子在旁指點。
- **語音**：無。
- **i2v 提示詞草稿**：
  ```
  The playful cards flicker out as candlelight and shadow sweep the frame; she sits upright
  in the rustic hall, raising a torn, blood-stained oni banner with a serious, concerned
  look while the bearded man points beside her.
  Speech: none.
  ```

## B15（圖15 → 圖16，轉場）

- **類型**：轉場。室內 → 船艔，鏡頭帶出艔與鬼面帆。
- **長度**：2 秒。
- **連接設計**：她放下旗、起身；鏡頭把她送出屋簷、落在金光船艔上，回頭燦笑，鬼面帆在金色光中揚起。
- **語音**：僅一聲輕笑氣「はっ」。
- **i2v 提示詞草稿**：
  ```
  She lowers the torn banner and rises; a swinging camera carries her out of the hall and
  onto the sunlit boat, where she turns back over her shoulder with a bright smile, the oni
  sail catching golden light.
  Speech: no words, only a breathy laugh 「はっ」.
  ```

## B16（圖16 → 圖17，直接連接）

- **類型**：直接連接。同立船艔、回首望，情緒由燦爛轉沉靜。
- **長度**：2 秒。
- **連接設計**：她自船欄邊直起身，笑意收斂成沉靜好奇，回頭望向海平線上的骷髏山與冒煙城堡；狗與猴穩立身側。
- **語音**：無。
- **i2v 提示詞草稿**：
  ```
  She straightens from the railing lean, her smile settling into calm curiosity as she looks
  back over her shoulder at the skull-shaped mountain and the smoking fortress on the
  horizon, the dog and monkey steady beside her.
  Speech: none.
  ```

## B17（圖17 → 圖18，轉場）

- **類型**：轉場。船艔 → 叢林遺跡，鏡頭穿過藤葉落地。
- **長度**：2 秒。
- **連接設計**：鏡頭自船艔掃下、穿過垂藤落到苔地；她下船跪落，目光鎖住泥土上隱隱發光的紅印，狗湊向她手邊嗅聞。
- **語音**：無。
- **i2v 提示詞草稿**：
  ```
  A swinging camera sweep drops from the boat deck through hanging foliage onto the mossy
  jungle floor; she steps off and kneels, eyes locked on faint glowing red symbols in the
  dirt, the dog sniffing at her hand.
  Speech: none.
  ```

## B18（圖18 → 圖19，直接連接）

- **類型**：直接連接。蹲姿與戰備延續，視線由地上紅印轉向前方門。
- **長度**：2 秒。
- **連接設計**：她循著紅光目光前移、壓低進入備戰蹲姿，一手探向前方立著尖刺的木門；狗低伏並進。
- **語音**：僅一聲繃緊呼吸「はっ」。
- **i2v 提示詞草稿**：
  ```
  Still following the glow with her eyes, she pushes forward low into a ready crouch, one
  hand reaching toward the spiked wooden gate ahead, the dog hunkering low beside her.
  Speech: no words, only a tense breath 「はっ」.
  ```

## B19（圖19 → 圖20，轉場）

- **類型**：轉場。日光門前 → 暗處持火把，光線收暗過渡。
- **長度**：2 秒。
- **連接設計**：她穿過尖刺門、日光滑落；火把在暗處亮起，她貼柱側伏、握著火把、目光警覺。
- **語音**：無。
- **i2v 提示詞草稿**：
  ```
  As she edges past the spiked gate the daylight falls away; a torch flares in the dark, and
  she settles into a stealthy crouch against the pillar, gripping the torch with alert eyes.
  Speech: none.
  ```

## B20（圖20 → 圖21，直接連接）

- **類型**：直接連接。蹲伏前行延續，火光角落 → 粗礪地形抓岩。
- **長度**：2 秒。
- **連接設計**：她離開火光照亮的角落、踏上崎嶇地，低蹲探步，一手抓向苔岩借力前行。
- **語音**：僅一聲低吐「ふっ」。
- **i2v 提示詞草稿**：
  ```
  She moves out of the torch-lit corner onto the rough terrain, dropping to grip the mossy
  log for support, crouching low and moving forward.
  Speech: no words, only a low exhale 「ふっ」.
  ```

## B21（圖21 → 圖22，直接連接）

- **類型**：直接連接。攀爬一氣呵成：抓岩 → 上爬峭壁。
- **長度**：2 秒。
- **連接設計**：她自岩旁縱身上攀，奮力沿石壁攀升，狗並行同爬，汗珠與專注並存。
- **語音**：僅喘息「ふっ、ふっ…」。
- **i2v 提示詞草稿**：
  ```
  She pulls herself up from the rock and climbs the rough stone cliff, the dog crawling
  alongside, hauling herself higher with focused effort.
  Speech: no words, only effortful breaths 「ふっ、ふっ…」.
  ```

## B22（圖22 → 圖23，轉場）

- **類型**：轉場。攀到牆頂 → 木桁橋上低伏望守衛，鏡頭橫切過橋。
- **長度**：2 秒。
- **連接設計**：她翻上牆頂，鏡頭橫移落在木桁橋；她低伏，目光落在橋下旗旁的兩道武士黑影。
- **語音**：無。
- **i2v 提示詞草稿**：
  ```
  She crests the wall and the camera swings across onto the plank bridge; she crouches low,
  eyes dropping to the shadowy samurai guards below the banner.
  Speech: none.
  ```

## B23（圖23 → 圖24，直接連接）

- **類型**：直接連接。動物連結：橋上戒備 → 跪地獻果給猴。
- **長度**：2 秒。
- **連接設計**：她收斂蹲姿、抬身單膝跪地；猴子從上方探頭，她舉果相遞，人與動物之間一個柔和的默契。
- **語音**：僅一聲輕吸「あっ…」。
- **i2v 提示詞草稿**：
  ```
  Her hunch eases as she rises onto one knee; the monkey peers from above and she offers it
  the fruit, a soft connection passing between them, the dog watching.
  Speech: no words, only a soft breath 「あっ」.
  ```

## B24（圖24 → 圖25，轉場）

- **類型**：轉場。獻果柔情 → 村門前備戰，畫面拉開過渡。
- **長度**：2 秒。
- **連接設計**：果子被接走、她起身；一道廣鏡暖掃把畫面拉開到村子大門與紅鬼面旗，她踏入備戰架式，面對側旁帶角鎧甲的巨影。
- **語音**：無。
- **i2v 提示詞草稿**：
  ```
  The offered fruit slips away as she straightens; a wide warm sweep opens the frame onto the
  village gate with the red demon banner, and she settles into a combat stance facing the
  horned armored figure.
  Speech: none.
  ```

## B25（圖25 → 圖26，直接連接）

- **類型**：直接連接。備戰姿態進到閘樓，狗奔走助陣。
- **長度**：2 秒。
- **連接設計**：她旋身踏上閘樓木台，雙手握住粗木樑、奮力繃身，戰亂在木欄外翻湧，柴犬在近景踏步。
- **語音**：僅急促呼吸「はっ…」。
- **i2v 提示詞草稿**：
  ```
  She pivots onto the weathered gate platform, both hands gripping a wooden beam, straining
  as the battle churns beyond the slats, the dog mid-stride in the foreground.
  Speech: no words, only sharp breaths 「はっ…」.
  ```

## B26（圖26 → 圖27，直接連接）

- **類型**：直接連接。戰鬪繃身 → 蹲地檢視木匣，張力收斂。
- **長度**：2 秒。
- **連接設計**：她自梁上退力、低身蹲下，喧囂沉落；從地上捧起一只小木匣，神情專注地端詳。
- **語音**：僅一聲悶哼「む…」。
- **i2v 提示詞草稿**：
  ```
  She eases off the beam and crouches low, the clamor settling as she lifts a small wooden
  box from the ground, eyes serious as she inspects it.
  Speech: no words, only a quiet breath 「む…」.
  ```

## B27（圖27 → 圖28，直接連接）

- **類型**：直接連接。蹲看木匣 → 倚柱遠望，氛圍轉鬆。
- **長度**：1 秒。
- **連接設計**：她收好木匣、起身靠向木柱，緩緩吐氣，目光飄向遠方；雉跳上她的肩，狗倚身坐下。
- **語音**：僅一聲緩吐「ふぅ……」。
- **i2v 提示詞草稿**：
  ```
  She tucks the box away and rises to lean back against the post, exhaling as her gaze drifts
  toward the distance, the pheasant hopping onto her shoulder, the dog settling close.
  Speech: no words, only a slow exhale 「ふぅ……」.
  ```

## B28（圖28 → 圖29，轉場）

- **類型**：轉場。靜眺 → 牢柵前哀求，白光轉暗、鐵欄滑入。
- **長度**：2 秒。
- **連接設計**：靜默日光黯淡、鐵欄滑過畫面；她跪在燭光牢前，雙手穿欄握住老人枯手，滿身泥汙、神情懇求。
- **語音**：無。
- **i2v 提示詞草稿**：
  ```
  The calm daylight dims and iron bars slide across the frame; she kneels in the candlelit
  cell, reaching both hands through to hold the old man's hands pleadingly, mud-stained.
  Speech: none.
  ```

## B29（圖29 → 圖30，直接連接）

- **類型**：直接連接。跪禱 → 奮力奔跑，一躍而出。
- **長度**：2 秒。
- **連接設計**：她鬆開鐵欄、驟然起身衝出，髮絲飛散、踏開大步，全速奔進。
- **語音**：僅硬喘「ふっ、ふっ」。
- **i2v 提示詞草稿**：
  ```
  She releases the bars and breaks into a run, hair streaming, legs pumping, bursting
  forward at full energy.
  Speech: no words, only hard breaths 「ふっ、ふっ」.
  ```

## B30（圖30 → 圖31，直接連接）

- **類型**：直接連接。狂奔 → 收步站定，喘息中拿出意志。
- **長度**：1 秒。
- **連接設計**：她自奔跑中收步、胸口起伏，穩住身形、瞪大雙眼定立，衣破而不折。
- **語音**：僅一聲重喘「はぁ…」。
- **i2v 提示詞草稿**：
  ```
  She slows from the run, chest heaving, and steadies into a wide-eyed determined stand,
  tattered but unbroken.
  Speech: no words, only a heavy breath 「はぁ…」.
  ```

## B31（圖31 → 圖32，直接連接）

- **類型**：直接連接。意志 → 攻塔攀牆，動作同向。
- **長度**：2 秒。
- **連接設計**：她撲向攻城塔、抓住粗木梁，沿城牆奮力攀上，向下一處扶手探去。
- **語音**：僅喘息「はっ、はっ」。
- **i2v 提示詞草稿**：
  ```
  She lunges at the siege tower and catches the rough beam, scrambling up the fortress wall,
  reaching out toward the next hold.
  Speech: no words, only effortful gasps 「はっ、はっ」.
  ```

## B32（圖32 → 圖33，轉場）

- **類型**：轉場。攀牆白晝 → 夜戰場拖梁，暮色沉降過渡。
- **長度**：2 秒。
- **連接設計**：日暮覆上爬升的動作，她翻身攀住夜裡的粗梁、弓身使力，身後鳥居與燈籠輝映的城堡泛光。
- **語音**：無。
- **i2v 提示詞草稿**：
  ```
  Dusk falls across the climb; the camera swings as she pulls herself onto the thick beam at
  night, straining with one leg braced, the torii and lanterns of a castle glowing behind
  her.
  Speech: none.
  ```

## B33（圖33 → 圖34，直接連接）

- **類型**：直接連接。拉梁使力 → 推身前出，面對圍攏的甲士。
- **長度**：1 秒。
- **連接設計**：她蹬離木梁、朝空處挺身推進，臂膀撐在閘前，面向半圓圍攏的武士與鬼眾。
- **語音**：僅一聲短促「くっ…」。
- **i2v 提示詞草稿**：
  ```
  She drives off the beam and pushes forward into the open, braced against the gate, facing
  the ring of armored samurai and oni figures closing in.
  Speech: no words, only a sharp breath 「くっ…」.
  ```

## B34（圖34 → 圖35，直接連接）

- **類型**：直接連接。推禦 → 拔刀揮斬，戰意升格。
- **長度**：2 秒。
- **連接設計**：她自僵持中拔刀、揮出弧光，巨鬼在殿內凌然壓來，柴犬撲向鬼腿狂吠。
- **語音**：僅一聲戰息「はぁっ！」。
- **i2v 提示詞草稿**：
  ```
  She draws and swings, the blade arcing as the colossal armored ogre looms over the temple
  hall, the dog barking at its leg.
  Speech: no words, only a battle breath 「はぁっ！」.
  ```

## B35（圖35 → 圖36，轉場）

- **類型**：轉場。揮斬瞬間 → 勝後立在倒地者之上，光爆過渡。
- **長度**：2 秒。
- **連接設計**：一道亮閃橫掃畫面；光落時她已立在頹倒的鎧甲首領身上，刀尖滴血、頭微垂，在鬼王旗下沉著疲憊。
- **語音**：無。
- **i2v 提示詞草稿**：
  ```
  A bright impact flash sweeps the frame; as it clears she stands over the slumped defeated
  warrior, katana dripping, head bowed and weary beneath the oni banners.
  Speech: none.
  ```

## B36（圖36 → 圖37，轉場）

- **類型**：轉場。戰殿勝景 → 靜處撫犬，戰塵消散過渡。
- **長度**：2 秒。
- **連接設計**：戰殿煙塵轉淡，她低身跪到大秋田犬身前，捧起狗的下巴輕撫，悲傷柔和了她的神情。
- **語音**：僅一聲顫嘆「ふぅ……」。
- **i2v 提示詞草稿**：
  ```
  The war-hall haze dissolves into a quiet hush; she kneels low before the great Akita,
  gently cupping its chin and stroking it, sorrow softening her face.
  Speech: no words, only a trembling sigh 「ふぅ……」.
  ```

## B37（圖37，收尾浮鏡）

- **類型**：收尾。僅首幀，浮鏡凝結，不設末幀。
- **長度**：2 秒。
- **連接設計**：她靜靜撫著犬的下巴，呼吸沉穩，光線漸柔，畫面如道別般停駐。
- **語音**：僅一聲軟息「はぁ…」。
- **i2v 提示詞草稿**：
  ```
  Slow close: she breathes quietly as she strokes the Akita's chin, weariness settling, a
  farewell moment lingering as the light softens.
  Speech: no words, only a soft breath 「はぁ…」.
  ```