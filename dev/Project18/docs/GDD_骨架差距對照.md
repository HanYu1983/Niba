# GDD 骨架差距對照（最新版，以代碼為準）

> 目的：把 `docs/GDD_富甲天下.md` 中「**骨架（最小可玩閉環）**」與「**擴充（延後豐富）**」分開，並以目前 `src/` 實作現況為準，列出**仍需補齊的骨架差距**與下一輪建議順序。
>
> 本文件是「現況報表」：每個條目都力求能在代碼中找到對應位置或測試。

---

## 一、目前已具備的最小閉環（骨架已落地）

### 1) 回合循環：玩家輪替／回合推進（已完成）
- **現況**：`ConfirmDone` 推進 active monarch、回合狀態重置。
- **主要位置**：`src/impl_ver1/core/GameMatchCore.hx`
- **驗證**：多個 `debug_ver1/*FlowTest.hx` 以及 `runHelloJs.bat` 全綠。

### 2) 移動：擲骰 1~6 + 測試固定骰點（已完成）
- **現況**：
  - 移動步數改為擲骰 1~6。
  - 測試可用 `forceSetFixedMoveDelta(delta)` 固定骰點（設 null 回到隨機）。
- **主要位置**：`src/impl_ver1/core/GameMatchCore.hx`、`src/impl_ver1/rules/GameMatchVer1Ops.hx`

### 3) 起點獎勵 + 回合末結算點（已完成最小骨架）
- **現況**：
  - **經過起點獎勵**：移動逐步時經過 index=0 會給獎勵。
  - **回合末結算**：新回合開始時觸發（seat 回到 0）：
    - 全體武將體力回復（+`Balance.STAMINA_RECOVER_PER_TURN`）。
    - 套用並清除 next-turn 領地 bonus（目前 gold/grain 方向）。
- **主要位置**：`src/impl_ver1/core/GameMatchCore.hx`、`src/impl_ver1/rules/GameMatchVer1Ops.hx`
- **驗證**：`src/debug_ver1/EndOfRoundSettlementTest.hx`

### 4) 資源：君主 troops / grain / gold / prestige（已完成最小可增減）
- **現況**：`IMonarch` / `Monarch` 已具備 troops、grain、gold、prestige 的最小 API（grant / reduce）。
- **主要位置**：`src/game/IMonarch.hx`、`src/impl_ver1/model/Monarch.hx`

### 5) 策略/計策：移動前/後階段 + 每張牌使用時機限制（已完成骨架）
- **現況**：
  - 移動前 / 移動後兩階段，各每回合一次。
  - `IJiCe.allowedPhases()`：每張牌宣告可用時機。
  - 建選單時過濾 + Core 打出時硬檢查（避免 UI 漏網）。
- **主要位置**：`src/game/IJiCe.hx`、`src/impl_ver1/commands/Ver1MainCommands.hx`、`src/impl_ver1/core/GameMatchCore.hx`
- **驗證**：`src/debug_ver1/StrategyPhaseRestrictionTest.hx`

### 6) 村落：友好度（每村落×每玩家）+ 至少一條真結算線（已完成）
- **現況**：
  - 友好度模型：`tile × monarch`（0~100）。
  - `VillageTrade` 已有真結算：花 gold 換 grain + 友好度上升。
- **主要位置**：`src/impl_ver1/core/GameMatchCore.hx`、`src/impl_ver1/staging/VillageTradeStagingAction.hx`
- **驗證**：`src/debug_ver1/VillageFriendlyTradeSettlementTest.hx`

### 7) 城池：等級/防禦模型最小落地（已完成）＋ 接入一條戰鬥/攻占結算線（已完成最小）
- **現況**：
  - 城池等級資料：`forceGetCityLevel/forceSetCityLevel`（預設 SmallCity）。
  - 防禦加成：`Balance.cityDefenseBonus(level)` 已接入「敵城對峙」的 `siege` 結算線。
- **主要位置**：`src/impl_ver1/core/GameMatchCore.hx`、`src/impl_ver1/rules/GameMatchVer1Ops.hx`、`src/game/Balance.hx`
- **驗證**：`src/debug_ver1/HostileCitySiegeCityLevelDefenseTest.hx`

---

## 二、仍存在的骨架差距（下一輪應優先補）

### A) 棋盤格子類型仍不完整（骨架缺口）
- **現況**：`TileKind` 只有 `Plain/City/Village/Battle/Scheme/Event`，落地分流主要覆蓋 `Event/City/Village/Plain`。
- **差距（對照 GDD 的最小玩法閉環）**
  - **起點作為正式格子語意**：目前以「經過 index=0」做獎勵，但仍非 `TileKind`。
  - **資源格 / 武將格 / 商店格**：尚未落地成 `TileKind` 與落地流程。
  - `Battle/Scheme`：型別存在，但缺少可持續玩的落地規則鏈（目前仍偏骨架空殼）。

### B) 策略系統仍缺「成功率預覽」與「目標限制」（骨架缺口）
- **成功率預覽（staging preview rows）**
  - 現況：只有少數牌有預覽列，其餘多未接。
- **移動後策略目標限制**
  - 現況：tile 類策略多仍可任選格（僅預設在自己所站格），尚未落地「移動後只能針對所站格」/己方敵方領地等規則約束。

### C) 村落互動仍偏「只有 trade 真結算」的狀態（骨架可延伸）
- 已達到「至少一條真結算線」要求，但：
  - `VillagePlunder` / `VillageConquer` 若要符合 GDD 的最小可玩性，仍需補上更一致的守軍/投入/結果/友好度變化與占領線。

### D) 經濟閉環尚未完整（骨架缺口）
- **士兵→糧食每回合消耗**：尚未落地。
- **領地產出（依地形/等級/友好度等）**：目前僅有部分 next-turn bonus 機制，尚未形成完整經濟循環。

---

## 三、建議的下一輪「骨架補齊順序」（更新版）
1. **補棋盤格子骨架**：新增至少一個缺口 `TileKind`（推薦：資源格或商店格），並接一條可測的落地結算線。
2. **補策略成功率預覽**：讓主要幾張牌在 staging 顯示成功率與關鍵影響值。
3. **補策略目標限制**：先落地「移動後策略只能針對所站格」的硬檢查 + 選單過濾。
4. **補經濟閉環**：回合末士兵耗糧 + 領地產出（最小規則即可）。

