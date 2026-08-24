# SKILL: Terrain_Environment_Effects

> 地形標籤為全專案統一用詞；地圖格、適性、任務敘述皆使用本文件之 Tag。  
> 適性與 MC：`core/systems.md` § Terrain_Adaptability。機體適性鍵名：Land, Mountain, Sea, Air, Space。

---

## 1. 地形標籤總表 (Canonical Terrain_Tags)

以下為**地圖格**與**任務/關卡**唯一使用的標籤；程式與資料請勿再使用 Plain/Water 以外之名稱，若遇舊文件「Water」視同「Sea」。

| Tag | 說明 | 對應適性鍵 | 備註 |
|-----|------|------------|------|
| **Plain** | 一般平地 | Land | 預設陸地，無額外加成/懲罰。 |
| **Forest** | 森林 | Land | 掩體、迴避加成。 |
| **Sea** | 水域 | Sea | 與機體適性 Sea 對應；舊文件「Water」= Sea。 |
| **Mountain** | 山地／高處 | Mountain | 陸戰單位移動成本高。 |
| **Ruin** | 廢墟／掩體 | Land | 掩護、部分抗性。 |
| **Desert** | 沙漠 | Land | 命中懲罰、熱負荷。 |
| **Sand** | 沙灘／沿岸沙地 | Land | 平地移動感，常與 Sea 相鄰；關卡事件可改為 Sea。 |

- **適性鍵對應**：機體 Adaptability 使用 Land / Sea / Mountain / Air / Space。  
  - 格子在 **Land 系**（Plain, Forest, Ruin, Desert, Sand）→ 使用機體 **Land** 適性計算 MC。  
  - 格子為 **Sea** → 使用機體 **Sea** 適性。  
  - 格子為 **Mountain** → 使用機體 **Mountain** 適性。

---

## 2. Grid_Effect_Rules（格地形戰鬥效應）

每格地形對「站在該格單位」的效應（命中、迴避、抗性等）；與 `core/combat_logic.md` 命中/傷害公式對接。

| Terrain_Tag | Evade | Defense | 命中 (Accuracy) | 抗性／其他 |
|-------------|-------|---------|-----------------|-------------|
| **Plain** | — | — | — | — |
| **Forest** | +15% | +10% | — | Kin_Res: +5 |
| **Sea** | — | — | — | Fire_Res: +50, Elec_Res: -20；Move_Cost 依單位 Sea 適性 |
| **Mountain** | — | — | — | Move_Cost 依單位 Mountain 適性 |
| **Ruin** | +10% | — | — | Chem_Res: -5 |
| **Desert** | — | — | -10% | Heat_Build: +20% |
| **Sand** | — | — | — | 同 Plain，或自訂輕微 Evade（如 +5%） |

- **Move_Cost**：由 `core/systems.md` § 2 之適性等級 (S~E) 決定 MC，不在此表重複。

---

## 3. Environmental_States（環境狀態／天氣）

關卡層級效應，作用於整張地圖；用於任務的 **Environmental_Condition.Weather_Tag**。

| Weather_Tag | 效應 | 備註 |
|-------------|------|------|
| **Clear** | 無 | 預設。 |
| **Rain** | Beam_Atk -20%, Fire_Atk -50% | 與 combat_logic 傷害計算對接。 |
| **Sandstorm** | Ranged_Accuracy -30%, Max_RNG ≤ 3 | 遠程武器最大射程暫時上限 3 格。 |

### 3.1 觸發與優先級

- **預設**：由任務 **Mission_Header** 的 `Environmental_Condition.Weather_Tag` 決定，從任務開始即生效。
- **動態事件**：若關卡有「第 N 回合變更天氣」等事件，則在該事件觸發時覆寫當前 Weather_Tag；**事件優先於初始設定**。
- **地形變更與天氣**：例如「第 5 回合某區 Sand → Sea」僅改變格子的 **Terrain_Tag**，不自動改天氣；天氣若需連動，請在關卡事件中一併設定。

---

## 4. 與其他文件的對照

| 文件 | 使用方式 |
|------|----------|
| **data/attributes.md** § Terrain_Tags | 僅保留語意說明；實際 Tag 以本表為準（Plain, Forest, Sea, Mountain + Ruin, Desert, Sand）。 |
| **data/mecha_frames.md** § Adaptability | 機體 Land/Sea/Mountain/Air/Space 對應本文件 §1 之適性鍵。 |
| **data/missions.md** | Terrain_Layout 與 Weather 一律使用本文件之 Terrain_Tag、Weather_Tag。 |
| **core/systems.md** § 2 | MC 由「格 Terrain_Tag → 適性鍵對應 → 單位適性等級」取得。 |
