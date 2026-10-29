# 注意
* 提示詞在使用前先把註解都拿掉, 不然會讓模型誤認
* 若寫出subtitles欄位時, 不要同時寫出zh_TW和en-US, 不然會被誤認為對話. 或者就不要寫出subtitles欄位
```
"subtitles": {
  "zh-TW": "我最喜歡那種想當聖人的法官，他們判得越重，我就越安全。",
  "en-US": "I love judges who want to play saints. The heavier their sentences, the safer I am."
}
```

# 第一章：核心架構設計與巢狀指涉機制 (Core Architecture & Nested Reference Mechanism)

本章將深入探討本系統的核心基石：**非線性邏輯解耦**、**段落拆解（Block Chunking）**與**巢狀指涉機制（Nested References）**。透過這套架構，我們能夠將龐大、跨時空且充滿因果交錯的小說劇本，安全且精準地轉譯為可供 AI 影片模型渲染的微觀分鏡。

---

## 1.1 非線性邏輯解耦（Non-linear Logic Decoupling）

在傳統的視頻生成工作流中，創作者往往直接將整段長篇劇情塞進單一提示詞（Prompt），這會導致 AI 模型在面對多重時間線、插敘或回憶時發生邏輯錯亂。

本系統採用「宏觀劇本與微觀生成解耦」的原則：

* **巨集觀全景（Macro Layer）**：由大語言模型（LLM）閱讀完整小說，建立全域的實體資料庫與時序關係網，儲存為結構化的主 JSON。
* **微觀編譯渲染（Micro Layer）**：透過傳統程式碼（Compiler），依據使用者的需求動態擷取單一分鏡，並將關聯的上下文、外觀與音軌「原地展開（Hydrate & Unpack）」，生成獨立、時長受控且語意自洽的渲染專用 Prompt。

---

## 1.2 段落拆解法則（Block Chunking Rules）

要將文學文字轉化為 AI 視訊模型的輸入，第一步是進行「時空與視角切割」。每一個 `block` 代表一段連續且不中斷的鏡頭時空。

### 拆分觸發條件（滿足其一即須切分新 Block）：

1. **時間轉折**：發生時間改變（例如從「法庭宣判」跳到「一年後」）。
2. **空間/地點切換**：場景轉移（例如從「審判席」移至「警局偵訊室」或「家中書房」）。
3. **視覺焦點與主體變換**：鏡頭的主導權轉移或出現新的核心觀察道具（例如從「法官簽名」切換到「特寫桌上的一張關鍵逮捕照片」）。

---

## 1.3 巢狀指涉機制（Nested References）

當後續的劇情需要回顧、呼應或引用過去的事件時，若將舊情節全部重新描述，不僅會浪費 Token，更會造成 AI 畫面風格走樣。因此，我們在 JSON 中引入了 **`referenced_blocks`** 與 **`block_reference`** 實體型態。

### 核心運作邏輯：

* **指標代換**：後續的 Block 不需要重寫過去發生了什麼，只需透過 `ref_id` 指向對應的舊 Block ID。
* **視覺與聲學載體映射（Manifestation）**：在編譯時，系統會將被指涉的區塊轉化為當前畫面的**具體載體**（例如：報紙頭條新聞、案卷照片、或者是腦海中迴盪的聲音殘響）。

---

## 1.4 章節範例：完整巢狀指涉 JSON 架構示範

以下為第一章的核心範例，展示如何透過 `entities` 宣告全域資產，並在 `blocks` 中透過 `referenced_blocks` 實作跨時空的巢狀指涉與物件載體轉換：

```json
{
  "version": "1.8",
  "project_title": "Judge_Xu_Nested_Reference_Example",
  "global_settings": {
    "aspect_ratio": "16:9",
    "style": "Cinematic court drama, 35mm film grain, moody shadows",
    "default_audio_design": "Continuous warm analog room tone and vintage optical film hiss."
  },

  "entities": {
    "characters": [
      {
        "id": "char_judge_xu",
        "name": "許法官 (Judge Xu)",
        "identity_features": {
          "ethnicity": "East Asian (Taiwanese)",
          "age": "Late 50s",
          "face_and_hair": "Sharp jawline, tired yet observant dark eyes, short slicked-back black hair with silver streaks at temples",
          "physique": "Slender build, upright posture",
          "vibe": "Reserved, stoic, analytical"
        }
      }
    ],
    "props": [
      {
        "id": "prop_case_file_and_photo",
        "name": "卷宗與證物照片",
        "appearance": "Open heavy paper case file on a wooden desk, featuring a printed black-and-white police evidence photograph."
      }
    ],
    "locations": [
      {
        "id": "loc_study_desk",
        "name": "許法官書房桌前",
        "description": "Aged dark wooden desk, old brass desk lamp casting a warm downward pool of light."
      }
    ]
  },

  "blocks": [
    {
      "id": "block_1_verdict",
      "timeframe": { "start_sec": 0, "end_sec": 5 },
      "location_ref": "loc_study_desk",
      "present_characters": [
        {
          "entity_ref": "char_judge_xu",
          "outfit": "Dark casual collar shirt",
          "facial_state": "Calm, analytical expression"
        }
      ],
      "action": {
        "subject_ref": "char_judge_xu",
        "description": "Judge Xu reviews the case file and signs the official document remanding the case."
      }
    },
    {
      "id": "block_2_nested_realization",
      "timeframe": { "start_sec": 5, "end_sec": 12 },
      "location_ref": "loc_study_desk",
      "present_characters": [
        {
          "entity_ref": "char_judge_xu",
          "outfit": "Dark casual collar shirt",
          "facial_state": "Lips firmly sealed tight, motionless jaw, expression shifting to deep realization"
        }
      ],
      "present_props": [
        { "entity_ref": "prop_case_file_and_photo" }
      ],
      /* 巢狀指涉：本區塊透過 ID 鏈結了前一個區塊的上下文脈絡 */
      "referenced_blocks": ["block_1_verdict"],
      "action": {
        "subject_ref": "char_judge_xu",
        "target_ref": "prop_case_file_and_photo",
        "description": "Just as his pen hovers over block_1's documents, his gaze drops sharply onto the evidence photograph, recognizing the true fear in the suspect's eyes."
      },
      "audio_control": {
        "audio_mode": "vintage_film_room_tone",
        "speech_present": false,
        "lip_sync_enabled": false,
        "soundtrack_specification": "Continuous heavy 35mm optical film projector hiss, warm analog room tone filling the background."
      }
    }
  ]
}

```

---

# 第二章：單一語態與 MiniMax H3 適應原則 (Single Intent Principle & Model Adaptation)

在處理如 MiniMax H3 等先進的影片與多模態生成模型時，開發者常會面臨一個核心痛點：**模型在處理過於複雜、包含多重意圖（Intent）的單一鏡頭時，極易發生語意錯亂、角色對嘴與內部獨白打架、或語言切換失敗的問題。**

本章將確立「單一鏡頭單一語態原則」，並提供針對模型特性的分段架構解法。

---

## 2.1 複雜語態交織的痛點與挑戰

當一段劇本中同時包含「角色情緒激動的現場咆哮」**與**「隨之而來的角色震驚與內心冷酷獨白」時，若試圖將其壓縮在同一個 `block` 內送給影片模型，常會導致以下災難：

1. **對嘴與閉唇衝突**：模型無法分清楚哪一段時間角色需要張嘴說話（Lip-sync），哪一段時間必須閉嘴聆聽內心獨白，導致嘴型胡亂開合。
2. **語音與語言混淆**：多角色或雙語切換時，語音擴散模組（Audio Diffusion）會將不同角色的聲線混淆，甚至在無對白區塊噴出亂碼怪音。
3. **時長與節奏失控**：單一 Block 負載過多劇情動作，超過模型單次高質量生成的秒數極限（如超出 5~7 秒甜點區）。

---

## 2.2 拆段鐵律：一個 Block = 一種語態（Single Voice / Intent per Block）

為適應模型極限，本指南強制規定：**當畫面中的「發聲模式（Audio Mode）」、「說話主體（Speaker）」或「心理意圖（Intent）」發生轉折時，必須嚴格拆分為獨立的 Blocks。**

### 實戰拆分對照範例：

* **錯誤示範（單一 Block 塞入對白與內心話）**：
* 畫面中阿傑在大喊大叫，同時許法官在心裡想著惡毒的計謀。*(模型會直接錯亂，讓法官的嘴跟著阿傑一起動，或是發出奇怪的人聲)*


* **正確示範（拆為兩段獨立 Block）**：
* **第 1 段**：專門給阿傑的現場咆哮（`spoken_on_screen` / `lip_sync_enabled: true`）。
* **第 2 段**：專門給許法官的靜默震撼與內心獨白（`internal_monologue` / `lip_sync_enabled: false`）。



---

## 2.3 章節範例：雙段拆分（以審訊室衝突為例）

以下展示如何將一場「阿傑咆哮 $\rightarrow$ 法官內心獨白」的連續衝突，拆解為獨立運作的 2 個區塊，確保 MiniMax H3 等模型能完美渲染每一段的視覺與音軌：

### 🎬 第 1 段：阿傑現場咆哮（Spoken on Screen）

```json
{
  "id": "block_ajie_outburst_solo",
  "timeframe": { "start_sec": 0, "end_sec": 5 },
  "location_ref": "loc_private_chambers",
  "present_characters": [
    {
      "entity_ref": "char_ajie",
      "facial_state": "Face flushed with intense anger, mouth opening and closing dynamically while shouting aggressively"
    },
    {
      "entity_ref": "char_judge_xu",
      "facial_state": "Stunned, lips sealed tight in surprise, motionless"
    }
  ],
  "action": {
    "subject_ref": "char_ajie",
    "target_ref": "char_judge_xu",
    "description": "A-Jie suddenly erupts with raw emotion, slamming his hands on the metal table and yelling furiously into Judge Xu's face."
  },
  "audio_control": {
    "audio_mode": "clean_dialogue_with_room_tone",
    "speech_present": true,
    "lip_sync_enabled": true,
    "dialogue": {
      "speaker_ref": "char_ajie",
      "type": "shouted_on_screen",
      "language": "zh-TW",
      "original_text": "法官！你怎麼這麼多廢話？我說了是我就是我！你判我啊！",
      "voice_prompt": "Hysterical, aggressive, defiant young male voice"
    }
  }
}

```

### 🧠 第 2 段：許法官內心獨白（Internal Monologue - 嚴格閉唇）

```json
{
  "id": "block_xu_internal_thought_solo",
  "timeframe": { "start_sec": 0, "end_sec": 7 },
  "location_ref": "loc_private_chambers",
  "present_characters": [
    {
      "entity_ref": "char_judge_xu",
      "facial_state": "Lips firmly sealed tight and motionless, eyes narrowing with cold calculation, static closed mouth"
    }
  ],
  "action": {
    "subject_ref": "char_judge_xu",
    "description": "Judge Xu freezes in absolute shock, his expression twisting into a chilling, cynical internal realization as he stares silently with closed lips."
  },
  "audio_control": {
    "audio_mode": "internal_monologue_with_room_tone",
    "speech_present": true,
    "lip_sync_enabled": false,
    "dialogue": {
      "speaker_ref": "char_judge_xu",
      "type": "internal_monologue",
      "language": "zh-TW",
      "original_text": "他想求刑，他想犧牲。既然當事人自己都要求了，我為什麼要拒絕這種『完美的權衡』？",
      "voice_prompt": "Deep, cold, cynical internal male voice, close-mic whisper with slight low-pass room filter"
    }
  }
}

```
# 第三章：全局實體庫與角色外貌解耦 (Entities & Consistency Decoupling)

在 AI 影視生成工作流中，最大的惡夢莫過於「換鏡頭就換臉（Identity Drift）」，或者當角色在不同場景更換服裝時，模型因 Prompt 衝突而導致五官走樣。

本章將建立「單一真理來源（Single Source of Truth）」**的全局實體庫，並實作**「恆定生理特徵與動態狀態的解耦機制」。

---

## 3.1 為什麼服裝與狀態不能寫死在角色設定中？

若在全域角色設定中直接寫死服裝（例如：「穿著黑色法官袍的 50 歲男性」），當故事推進到「法官深夜在家中穿著休閒毛衣」的區塊時，影片模型的 Prompt 就會同時接收到「法官袍」與「毛衣」兩種衝突指令，導致生成的衣服疊穿或人臉崩壞。

因此，我們必須將角色的屬性拆分為兩大維度：

1. **恆定外貌（Identity & Face）**：決定你是誰（臉型、人種、髮型、眼神）。這部分放在全局 `entities` 永久不變。
2. **動態穿搭與狀態（Outfit & Condition）**：決定你現在穿什麼、在做什麼表情（法袍、睡衣、冷汗、驚恐）。這部分放在各個 `block` 內獨立宣告。

---

## 3.2 實體庫（Entities）的架構設計

在 JSON 的最外層（與 `blocks` 平級），建立 `entities` 結構，統一管理全劇的**角色（Characters）**、**關鍵道具（Props）**與**場景（Locations）**：

* **`entities.characters`**：專注於生理特徵與基礎氣質描述（服裝佔比歸零）。
* **`entities.props`**：宣告如判決書、證物照片、報紙等貫穿劇情的關鍵物件。
* **`entities.locations`**：宣告法庭、書房、偵訊室等固定空間的背景特徵。

---

## 3.3 章節範例：全局 Entities 與動態 Block 搭配示範

以下展示如何透過 `entities` 定義恆定長相，並在不同的 `blocks` 中透過 `entity_ref` 引用，同時自由切換不同的服裝與表情狀態：

```json
{
  "version": "1.11",
  "project_title": "Entity_Decoupling_Example",
  "global_settings": {
    "aspect_ratio": "16:9",
    "style": "Cinematic court drama, 35mm film grain"
  },

  /* 1. 【全局實體資料庫】只定義恆定生理特徵與基礎資產 */
  "entities": {
    "characters": [
      {
        "id": "char_judge_xu",
        "name": "許法官 (Judge Xu)",
        "identity_features": {
          "ethnicity": "East Asian (Taiwanese)",
          "age": "Late 50s",
          "face_and_hair": "Sharp jawline, tired yet observant dark eyes, short slicked-back black hair with silver streaks at temples",
          "physique": "Slender build, upright posture",
          "vibe": "Reserved, stoic, analytical"
        }
      }
    ],
    "props": [
      {
        "id": "prop_verdict",
        "name": "判決書",
        "appearance": "Official court paper with highlighted key phrases."
      }
    ],
    "locations": [
      {
        "id": "loc_courtroom",
        "name": "肅穆法庭",
        "description": "Deep wooden judicial bench, cold top lighting."
      },
      {
        "id": "loc_home_study",
        "name": "法官書房",
        "description": "Aged wooden desk, warm brass desk lamp."
      }
    ]
  },

  /* 2. 【時序分鏡】引用實體 ID，並在 Block 內動態賦予當前服裝與狀態 */
  "blocks": [
    {
      "id": "block_court_scene",
      "timeframe": { "start_sec": 0, "end_sec": 5 },
      "location_ref": "loc_courtroom",
      "present_characters": [
        {
          "entity_ref": "char_judge_xu",
          "outfit": "Formal dark judicial robe with white collar trim",
          "facial_state": "Calm, composed expression, lips sealed"
        }
      ],
      "present_props": [
        { "entity_ref": "prop_verdict" }
      ],
      "action": {
        "subject_ref": "char_judge_xu",
        "target_ref": "prop_verdict",
        "description": "Judge Xu calmly signs the verdict document in court."
      }
    },
    {
      "id": "block_home_scene",
      "timeframe": { "start_sec": 5, "end_sec": 10 },
      "location_ref": "loc_home_study",
      "present_characters": [
        {
          "entity_ref": "char_judge_xu",
          "outfit": "Casual dark grey knit sweater, relaxed home attire",
          "facial_state": "Sweat glinting on forehead, pale skin, visibly relieved"
        }
      ],
      "action": {
        "subject_ref": "char_judge_xu",
        "description": "Judge Xu stands by the window at home, exhaling a long sigh of relief."
      }
    }
  ]
}

```
# 第四章：底片白噪音音軌填滿防護網 (Vintage Film Room Tone Anti-Gibberish)

在影片生成模型（特別是原生支援音效與多模態的生成器）中，創作者經常面臨一個棘手的現象：**當畫面處於安靜、無對白或僅有肢體動作時，AI 的音訊擴散模型（Audio Diffusion）會因為音軌「留白（Audio Vacuum）」而自動產生隨機的人聲幻覺、亂碼怪音（Gibberish Speech）或背景呢喃。**

本章將捨棄無效的負向限制詞，引入好萊塢經典膠片時代的「白噪音與底噪填滿（Room Tone & Film Hiss）」聲學設計，徹底封印幻覺怪音。

---

## 4.1 為什麼傳統負向提示詞（Negative Prompts）經常失效？

多數開發者在遇到怪音時，會嘗試在 Prompt 中加入 `no speech`, `silent`, `no background voices` 等指令。然而，對 AI 模型而言：

1. **負向詞反向觸發**：模型神經元在解析 `speech` 這個詞彙時，反而更容易去激活語音生成區塊。
2. **音軌真空誘發幻覺**：正如海綿需要水分填滿，當音訊軌道完全沒有具體物理聲音時，AI 為了「完成任務」便會自行猜測並填補亂碼聲音。

---

## 4.2 核心策略：以「高密度經典底噪」淹沒音軌

我們的解法是：**不追求絕對的死寂（Absolute Silence），而是用連續、厚實且具備電影高級感的物理白噪音（Room Tone & Foley）將整個音訊頻段徹底填滿。**

當 AI 的音訊海綿被「35mm 底片嘶嘶聲（Film Hiss）」與「環境底噪（Room Tone）」完全佔滿時，它就再也沒有多餘的運算空間去生出多餘的亂碼人聲。

---

## 4.3 視覺與聽覺的雙重防護鎖定

為了達到 100% 的無怪音效果，我們必須同時在聽覺（Audio）**與**視覺（Visual）進行雙重宣告：

1. **聽覺填充**：在 `audio_control` 中明確定義長效的底噪規格（例如：`Continuous heavy 35mm optical film projector hiss`）。
2. **視覺嘴唇死鎖**：在角色的 `facial_state` 中明確宣告 `Lips sealed tight, motionless jaw, absolutely no talking`。AI 只要確認嘴唇沒有開合，便不會啟動對嘴與語音對應模組。

---

## 4.4 章節範例：無對白分鏡的白噪音防護 JSON 示範

以下展示如何在一個純視覺、無對白的動作鏡頭中，透過 `audio_control` 注入經典電影底噪，達到完美防護：

```json
{
  "version": "1.12",
  "project_title": "Vintage_Film_Noise_Protection_Example",
  "blocks": [
    {
      "id": "block_silent_realization",
      "timeframe": { "start_sec": 0, "end_sec": 6 },
      "location_ref": "loc_study_desk",
      "present_characters": [
        {
          "entity_ref": "char_judge_xu",
          "facial_state": "Lips firmly sealed tight, motionless jaw, absolutely no talking, subtle focus in eyes",
          "condition": "Deeply focused on the document"
        }
      ],
      "action": {
        "subject_ref": "char_judge_xu",
        "description": "Judge Xu stares intensely down at the evidence photograph in absolute silence."
      },
      
      /* 🎞️ 經典電影白噪音與底噪填滿宣告 */
      "audio_control": {
        "audio_mode": "vintage_film_room_tone",
        "speech_present": false,
        "lip_sync_enabled": false,
        
        /* 用高密度、連續的類比雜訊與環境音填滿整個頻段 */
        "soundtrack_specification": "Continuous heavy 35mm optical film projector hiss, warm analog room tone filling the entire frequency spectrum, faint low-frequency distant outdoor rain rumble, subtle crisp sound of paper turning under steady ambient design.",
        
        /* 視覺與聲音協同防護：完全排除人聲與對白 */
        "visual_sound_sync": "Purely mechanical and environmental acoustic design, closed sealed lips, zero vocalization, zero speech."
      }
    }
  ]
}

```
# 第五章：多維度發聲模式與音軌控制 (Multi-Modal Audio Control Matrix)

在建構完整的影視生成管線時，單靠畫面與靜態白噪音並不足以應付複雜的戲劇張力。我們必須透過結構化的 **`audio_control` 矩陣**，精準控管影片中各種發聲情境（如現場對話、內心獨白、旁白敘事）與視聽對齊（Lip-sync）開關。

本章將完整定義 **4 種核心發聲模式** 及其對應的 JSON 結構規範。

---

## 5.1 四種發聲情境與控制矩陣

不同的敘事需求對應不同的聲學與視覺約束。以下為各發聲模式的細節規範：

### 1. 現場對話 (`clean_dialogue`)

* **適用情境**：角色正面交談、情緒激動咆哮。
* **對嘴開關**：`lip_sync_enabled: true`。
* **視覺嘴唇狀態**：動態開合，配合語音對齊。
* **聲學特色**：乾淨近麥收音 (Close-mic)，帶有輕微環境殘響。

### 2. 內心獨白 (`internal_monologue`)

* **適用情境**：角色沈思、內心冷酷計算。
* **對嘴開關**：`lip_sync_enabled: false`。
* **視覺嘴唇狀態**：嚴格緊閉 (`Lips sealed tight`)，嚴禁開口。
* **聲學特色**：些微低通濾鏡 (Low-pass filter)，營造私密親密感。

### 3. 客觀旁白 (`narrator_voiceover`)

* **適用情境**：非畫面角色的宏觀敘事、背景交代。
* **對嘴開關**：`lip_sync_enabled: false`。
* **視覺嘴唇狀態**：畫面人物靜默或維持劇情動作。
* **聲學特色**：廣播級清澈音質，獨立於場景外 (Non-diegetic)。

### 4. 純白噪音 (`vintage_film_room_tone`)

* **適用情境**：無對白動作鏡頭、純環境鋪陳。
* **對嘴開關**：`lip_sync_enabled: false`。
* **視覺嘴唇狀態**：緊閉或無關口部動作。
* **聲學特色**：35mm 底片嘶嘶聲 (Film Hiss) 填滿頻段。

---

## 5.2 結構化音軌宣告的 JSON 範例

以下展示如何在 Block 內宣告進階的音軌控制，確保當切換至**內心獨白**或**現場對話**時，模型能夠正確執行：

### 示範 A：內心獨白模式（嚴格禁絕嘴唇開合）

```json
{
  "id": "block_internal_thought_example",
  "timeframe": { "start_sec": 0, "end_sec": 6 },
  "present_characters": [
    {
      "entity_ref": "char_judge_xu",
      "facial_state": "Lips firmly sealed tight and motionless, eyes narrowing in cold calculation"
    }
  ],
  "audio_control": {
    "audio_mode": "internal_monologue_with_room_tone",
    "speech_present": true,
    "lip_sync_enabled": false,
    "dialogue": {
      "speaker_ref": "char_judge_xu",
      "type": "internal_monologue",
      "language": "zh-TW",
      "original_text": "既然當事人自己都要求了，我為什麼要拒絕這種完美的權衡？",
      "voice_prompt": "Deep, cold, cynical internal male voice, close-mic whisper with slight low-pass room filter"
    },
    "soundtrack_specification": "Intimate cognitive internal voiceover, subtle low-pass acoustic filter, accompanied by continuous warm 35mm film analog room tone. Character lips remain strictly sealed."
  }
}

```

### 示範 B：現場對話模式（啟用對嘴同步）

```json
{
  "id": "block_live_dialogue_example",
  "timeframe": { "start_sec": 0, "end_sec": 5 },
  "present_characters": [
    {
      "entity_ref": "char_ajie",
      "facial_state": "Face flushed with intense anger, mouth opening and closing dynamically while shouting"
    }
  ],
  "audio_control": {
    "audio_mode": "clean_dialogue_with_room_tone",
    "speech_present": true,
    "lip_sync_enabled": true,
    "dialogue": {
      "speaker_ref": "char_ajie",
      "type": "shouted_on_screen",
      "language": "zh-TW",
      "original_text": "你判我啊！你不是很有正義感嗎？",
      "voice_prompt": "Hysterical, aggressive, defiant young male voice, filled with frantic rage"
    },
    "soundtrack_specification": "Aggressive close-mic shouting dialogue, sharp acoustic projection, layered with vintage analog room tone."
  }
}

```
# 第六章：全自動編譯管線與實作 (Automated Compiler Pipeline)

在前面的章節中，我們建立了宏觀的 **JSON 全局架構**、**實體解耦機制**、**單一語態拆段原則** 以及 **白噪音/多模態音軌控制**。然而，這些結構化的巢狀 JSON 對於直接投遞給 AI 影片生成模型（如 MiniMax H3、Omni Flash 等）而言過於龐大。

本章將確立「大語言模型（LLM）與傳統程式碼（Python Compiler）的最佳分工管線」，透過自動化編譯器將巨集觀劇本「原地展開（Hydrate & Unpack）」，產出 100% 確定性且精準的微觀渲染 Prompt。

---

## 6.1 LLM 與編譯器的權責分工

在整個自動化影視生成管線中，我們將任務嚴格切分為「非確定性（Creative）」與「確定性（Deterministic）」兩大類：

### 1. LLM 創作層（非確定性）

* **核心任務**：閱讀文學小說或劇本。
* **執行動作**：
* 提取全劇的角色、道具、場景，建立 `entities` 總表。
* 依據「時空轉折」與「單一語態原則」將劇情切分為獨立的 `blocks`。
* 建立跨時空的 `referenced_blocks` 巢狀指涉與發聲模式矩陣。


* **產出**：結構完整的專案主 JSON。

### 2. Python 程式碼編譯層（確定性）

* **核心任務**：將主 JSON「還原並降維」為單一鏡頭的 API 請求負載（Payload）。
* **執行動作**：
* **實體還原（Hydration）**：將 Block 中的 `entity_ref`（例如 `char_judge_xu`）自動替換回該實體在 `entities` 中定義的詳細外貌與特徵文字。
* **巢狀展開（Unpacking References）**：若 Block 包含 `referenced_blocks`，自動將對應的歷史情境與載體（如證物照片、報紙）融合進當前視覺描述中。
* **時間軸重算（Timeframe Reset）**：將每一個獨立輸出的 Block 時間軸重置為從 `0` 開始（符合各大影片 API 對單次生成的秒數限制）。
* **白噪音與 Prompt 拼裝**：將動作描述、`facial_state` 與 `soundtrack_specification` 自動合併為最終傳遞給模型的字串。



---

## 6.2 編譯器核心邏輯實作（Python 示範）

以下為支援本系統架構的編譯器核心 Python 程式碼，能夠自動讀取 JSON Block 並轉譯為符合 MiniMax H3 規範的 API 請求：

```python
import json

def compile_block_to_prompt(project_data: dict, block_id: str) -> dict:
    """
    將全局專案 JSON 中的指定 Block 進行實體還原與音軌封裝，產出最終 API 請求格式。
    """
    # 1. 尋找對應的 Block
    target_block = next((b for b in project_data["blocks"] if b["id"] == block_id), None)
    if not target_block:
        raise ValueError(f"Block ID '{block_id}' not found in project data.")
    
    entities = project_data["entities"]
    
    # 2. 實體還原 (Hydration): 組合角色外貌特徵
    character_prompts = []
    for p_char in target_block.get("present_characters", []):
        char_entity = next((c for c in entities["characters"] if c["id"] == p_char["entity_ref"]), {})
        features = char_entity.get("identity_features", {})
        
        # 結合恆定長相與當前 Block 的動態服裝/表情
        char_desc = (
            f"{char_entity.get('name', 'Character')} "
            f"({features.get('age')}, {features.get('face_and_hair')}): "
            f"Outfit: {p_char.get('outfit', 'standard')}. "
            f"Facial State: {p_char.get('facial_state', 'neutral')}."
        )
        character_prompts.append(char_desc)
        
    # 3. 提取核心動作
    action_desc = target_block["action"]["description"]
    
    # 4. 提取白噪音與音軌控制規格
    audio_cfg = target_block.get("audio_control", {})
    soundtrack_spec = audio_cfg.get("soundtrack_specification", "")
    
    # 5. 組裝最終視覺與音訊 Prompt
    final_visual_prompt = (
        f"{action_desc} "
        f"Characters involved: {' '.join(character_prompts)}. "
        f"Acoustic & Soundtrack Environment: {soundtrack_spec}"
    )
    
    # 6. 建構最終輸出的 API Payload
    api_payload = {
        "prompt": final_visual_prompt,
        "duration_sec": target_block["timeframe"]["end_sec"] - target_block["timeframe"]["start_sec"],
        "lip_sync_enabled": audio_cfg.get("lip_sync_enabled", False),
        "speech_present": audio_cfg.get("speech_present", False),
    }
    
    # 若有對白或旁白，一併帶入
    if "dialogue" in audio_cfg:
        api_payload["dialogue_script"] = audio_cfg["dialogue"]["original_text"]
        api_payload["voice_prompt"] = audio_cfg["dialogue"].get("voice_prompt", "")
        
    return api_payload

# === 測試執行範例 ===
# sample_project = { ... 載入我們前面的完整專案 JSON ... }
# compiled_payload = compile_block_to_prompt(sample_project, "block_xu_internal_thought_solo")
# print(json.dumps(compiled_payload, indent=2, ensure_ascii=False))

```

---

## 6.3 總結與最佳實踐工作流

透過本指南建立的完整系統，您的 AI 影視生成管線將擁有以下優勢：

1. **零怪音**：透過 35mm 底片白噪音（Room Tone）與視覺嘴唇死鎖（`Lips sealed tight`），徹底根除亂碼語音幻覺。
2. **零崩臉**：透過全局 `entities` 與 `blocks` 的動態解耦，確保角色跨場景換裝時五官與身分不變。
3. **模型高度適應**：透過「單一語態拆段原則」，完美駕馭 MiniMax H3 等不擅長複雜交錯語態的影片模型。
4. **自動化擴充**：透過 LLM 負責故事結構化、Python 編譯器負責精準轉譯，實現高效率、工業化的 AI 影視生成自動化流程！