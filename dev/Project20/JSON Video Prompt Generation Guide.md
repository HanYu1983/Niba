這是一份專為 **AI（Large Language Model / Visual Generation Pipeline）** 閱讀與執行的系統級 JSON 視頻提示詞規格指南（Schema Specification Guide）。

指南採用明確的**系統指令（System Prompt Format）**，包含結構規範、欄位型態、巢狀指涉規則與驗證邏輯，AI 讀取後即可嚴格產出符合標準的 JSON 提示詞。

---

# 📄 JSON Video Prompt Generation Guide (for AI System)

> **Document Type**: Technical Specification & System Prompt Supplement
> **Target Audience**: AI Agents, LLMs, Text-to-Video Pipelines
> **Purpose**: Standardize non-linear, multi-block, nested-reference video prompt structures for cinematic AI video models (e.g., Omni Flash, Sora, Runway Gen-3).

---

## 1. System Prompt & Instruction

```text
You are an expert AI Video Prompt Architect. Your objective is to parse raw narrative descriptions, scripts, or multi-scene concepts and reconstruct them into a structured, highly compliant JSON video generation prompt.

Key Principles to Enforce:
1. Modular Isolation: Every camera cut, time range, or visual beat must be encapsulated in its own "block".
2. Nested Reference ($ref): Past blocks or entities can be referenced as context/objects within future blocks (e.g., flashbacks, newspaper news, voiceovers, mental memories).
3. Explicit Linking: Action targets, speakers, listeners, and impact effects must explicitly use `id` or `ref_id` strings rather than ambiguous pronouns.
4. Multilingual & Audio Compliance: Dialogues must explicitly specify BCP-47 language tags, voice prompts, and overlay links.

```

---

## 2. Full JSON Schema Definition

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "VideoPromptStructure",
  "type": "object",
  "properties": {
    "version": { "type": "string", "example": "1.3" },
    "project_title": { "type": "string" },
    "global_settings": {
      "type": "object",
      "properties": {
        "aspect_ratio": { "type": "string", "enum": ["16:9", "9:16", "21:9", "1:1"] },
        "duration_seconds": { "type": "number" },
        "style": { "type": "string", "description": "Global visual style, camera render, lighting mood" }
      },
      "required": ["aspect_ratio", "duration_seconds", "style"]
    },
    "blocks": {
      "type": "array",
      "items": { "$ref": "#/definitions/Block" }
    },
    "transitions": {
      "type": "array",
      "items": { "$ref": "#/definitions/Transition" }
    }
  },
  "required": ["version", "project_title", "global_settings", "blocks"],

  "definitions": {
    "Block": {
      "type": "object",
      "properties": {
        "id": { "type": "string", "description": "Unique block ID, e.g., block_1, block_memory" },
        "timeframe": {
          "type": "object",
          "properties": {
            "start_sec": { "type": "number" },
            "end_sec": { "type": "number" }
          },
          "required": ["start_sec", "end_sec"]
        },
        "characters": {
          "type": "array",
          "items": { "$ref": "#/definitions/Entity" }
        },
        "action": { "$ref": "#/definitions/Action" },
        "dialogue": { "$ref": "#/definitions/Dialogue" },
        "camera": { "$ref": "#/definitions/Camera" },
        "environment": { "$ref": "#/definitions/Environment" }
      },
      "required": ["id", "timeframe", "characters", "action", "environment"]
    },

    "Entity": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "name": { "type": "string" },
        "type": { "type": "string", "enum": ["character", "prop", "block_reference"] },
        "ref_id": { "type": "string", "description": "Points to an existing character ID or block ID" },
        "appearance": { "type": "string", "description": "Visual details if new entity" },
        "manifestation": { "type": "string", "description": "Required if type='block_reference'. How the referenced block appears visually (e.g., photo, newspaper, optical flashback)" }
      },
      "required": ["id"]
    },

    "Action": {
      "type": "object",
      "properties": {
        "subject_ref": { "type": "string", "description": "Entity ID performing the action" },
        "target_ref": { "type": "string", "description": "Entity ID or Block Reference receiving the action" },
        "description": { "type": "string" },
        "impact_effect": { "type": "string", "description": "VFX, debris, lighting reaction, or physical deformation" }
      },
      "required": ["subject_ref", "description"]
    },

    "Dialogue": {
      "type": "object",
      "properties": {
        "speaker_ref": { "type": "string" },
        "listener_ref": { "type": "string" },
        "type": { "type": "string", "enum": ["spoken_on_screen", "internal_whisper", "shouted_on_screen", "panting_whisper", "grunt_and_groan", "voiceover"] },
        "language": { "type": "string", "description": "BCP-47 code, e.g., en-US, zh-TW, ja-JP" },
        "original_text": { "type": "string" },
        "voice_prompt": { "type": "string", "description": "Acoustic characteristics, tone, pitch, emotional state" },
        "subtitles": {
          "type": "object",
          "additionalProperties": { "type": "string" }
        },
        "audio_overlay_ref": {
          "type": "object",
          "properties": {
            "source_block_id": { "type": "string" },
            "audio_type": { "type": "string" },
            "description": { "type": "string" }
          }
        }
      },
      "required": ["speaker_ref", "type", "language", "original_text"]
    },

    "Camera": {
      "type": "object",
      "properties": {
        "type": { "type": "string", "description": "e.g., whip_pan, handheld_tracking, dolly_zoom" },
        "movement": { "type": "string", "description": "Detailed motion vector and focus target" }
      }
    },

    "Environment": {
      "type": "object",
      "properties": {
        "location": { "type": "string" },
        "lighting": { "type": "string" }
      },
      "required": ["location", "lighting"]
    },

    "Transition": {
      "type": "object",
      "properties": {
        "from_block": { "type": "string" },
        "to_block": { "type": "string" },
        "type": { "type": "string", "enum": ["hard_cut", "whip_pan_cut", "dreamy_dissolve", "impact_match_cut", "speed_ramp"] },
        "camera_movement": { "type": "string" }
      },
      "required": ["from_block", "to_block", "type"]
    }
  }
}

```

---

## 3. Reference Rules for AI Agents (指涉規則規範)

AI 在產生或解析此格式時，必須遵循以下 **4 項硬性約束**：

### 規則 1：實體繼承 (Entity Inheritance)

若角色在後續 Block 重複出現，不可重新撰寫詳細外觀，必須使用 `ref_id` 指向先前定義的實體或區塊：

* **合規範例**: `{"id": "char_hero", "ref_id": "block_1.char_hero"}`

### 規則 2：巢狀區塊指涉 (Nested Block Reference)

當一個舊區塊（如 `block_1`）變成新區塊（`block_2`）中的物件或心智回憶時，必須設定：

* `type`: `"block_reference"`
* `ref_id`: `"block_1"`
* `manifestation`: 寫明視覺呈現媒介（如：`"Front-page newspaper article"`, `"Dreamy blurred memory overlay"`）

### 規則 3：語音與多語言鏈結 (Multilingual Audio Overlays)

當 Block 2 的角色在思考時，聽到 Block 1 角色的聲音，必須在 `dialogue.audio_overlay_ref` 指向 `block_1`：

* `source_block_id`: `"block_1"`
* `audio_type`: `"echoing_voiceover"`

### 規則 4：動作主客體綁定 (Action Subject-Target Binding)

`action.subject_ref` 與 `action.target_ref` **嚴禁**使用 "he", "she", "it" 等模糊代詞，必須帶入具體的 `id` 或 `ref_id`。

---

## 4. Minimal Validation Example (極簡驗證範例)

```json
{
  "version": "1.3",
  "project_title": "Minimal_Validation_Test",
  "global_settings": {
    "aspect_ratio": "16:9",
    "duration_seconds": 5,
    "style": "Cinematic"
  },
  "blocks": [
    {
      "id": "block_1",
      "timeframe": { "start_sec": 0, "end_sec": 2 },
      "characters": [
        { "id": "char_a", "name": "Alice", "appearance": "Woman in red coat" }
      ],
      "action": {
        "subject_ref": "char_a",
        "description": "Drops a brass key on the floor"
      },
      "environment": {
        "location": "Wooden hallway",
        "lighting": "Dim candle light"
      }
    },
    {
      "id": "block_2",
      "timeframe": { "start_sec": 2, "end_sec": 5 },
      "characters": [
        { "id": "char_b", "name": "Bob", "appearance": "Man in black suit" },
        { "id": "ref_event", "type": "block_reference", "ref_id": "block_1", "manifestation": "Sound of the key falling in his memory" }
      ],
      "action": {
        "subject_ref": "char_b",
        "target_ref": "ref_event",
        "description": "Turns around quickly upon hearing the remembered sound"
      },
      "dialogue": {
        "speaker_ref": "char_b",
        "type": "spoken_on_screen",
        "language": "en-US",
        "original_text": "Did you drop this?",
        "subtitles": { "zh-TW": "這是你掉的嗎？" }
      },
      "environment": {
        "location": "Wooden hallway",
        "lighting": "Dim candle light"
      }
    }
  ]
}

```