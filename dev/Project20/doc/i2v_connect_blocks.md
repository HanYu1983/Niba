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

## 圖片對照（01–04）

| 區塊 | 首幀圖 | 末幀圖 |
|---|---|---|
| B1 | 01 `799279325_10165198413067376_6084801744728169900_n.jpg` | 02 `802821497_10165198414532376_8458038109672805895_n.jpg` |
| B2 | 02（僅首幀浮動） | —（轉場） |
| B3 | 03 `799831424_10165198413637376_7116621751776862137_n.jpg` | 04 `803828299_10165198414117376_2027390180660065037_n.jpg` |

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