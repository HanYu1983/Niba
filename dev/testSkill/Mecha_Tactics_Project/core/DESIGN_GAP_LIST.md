# 設計文件與實作對齊 — 未完成項目清單

> 對照：`core/action_menu.md`、`core/combat_ui.md`、`core/combat_logic.md`、`core/event_handler.md`、`core/systems.md`、`data/terrain.md`  
> 實作：`elm/src/`（Main、Combat、CombatView、Types、GameData 等）

---

## 一、已對齊或部分對齊

| 項目 | 設計出處 | 目前狀態 |
|------|----------|----------|
| 行動狀態 Active / Post_Move / Finished | action_menu §1 | ✅ 已實作 |
| 移動、結束回合、指令列條件 | action_menu §2 | ✅ 已實作 |
| 切換武器（僅 Active 可用） | action_menu §2 | ✅ 已實作（註：目前為「不結束移動權」為先前需求變更） |
| 攻擊條件（射程、State ≠ Finished）、架勢 Direct_Fire 需靜止 | action_menu、combat_ui、attributes | ✅ 已實作 |
| 反擊選單（僅被攻擊方為我方時顯示） | event_handler §2、combat_ui §2.6 | ✅ 已實作 |
| 敵方被攻擊時不顯示選單、自動反擊 | event_handler §2 | ✅ 已實作 |
| 狙擊 Overwatch（敵方移動後觸發、我方確認、敵方自動） | event_handler §1、systems §3 | ✅ 已實作 |
| 攻擊結果面板（outcome、damage、defenseNote、evadeNote） | combat_ui §2.4 | ✅ 已實作 |
| 頂部資訊列（回合、階段、任務名） | combat_ui §2.1 | ✅ 已實作 |
| 格子語意（cell--reachable、cell--current-unit、cell--player/enemy） | combat_ui §2.2 | ✅ 已實作 |
| 當前單位簡訊、可攻擊目標列表 | combat_ui §2.3 | ✅ 已實作 |
| EN/彈藥消耗（攻擊、反擊、狙擊時扣除） | combat_logic §5 | ✅ 已實作（spendWeaponCost） |

---

## 二、尚未對齊或未實作

### 1. 戰鬥演算（combat_logic）

| 項目 | 設計內容 | 目前實作 |
|------|----------|----------|
| **命中判定** | Hit_Rate 公式（Base_Hit + Attacker_Mod - Defender_Mod + 地形/天氣/距離），擲骰決定 Hit/Miss | 固定視為命中，無 Hit_Rate 與擲骰 |
| **暴擊** | 命中後依 Crit_Rate 擲骰，暴擊時傷害乘 Crit_Multiplier | 無暴擊，isCrit 恆為 False |
| **傷害計算** | Final_Damage = Σ max(0, Atk_n - Res_n)，依武器 Atk_Vector、目標 Armor_Matrix、地形抗性、環境 | 固定傷害 25，未使用 Atk_Vector / Armor_Matrix / 地形／天氣 |
| **攻擊前檢查** | 目標在 RNG 內、**攻擊方 EN/彈藥足夠**、狀態非 Finished | 未檢查 EN、彈藥是否足夠才允許攻擊 |

### 2. 戰鬥 UI（combat_ui）

| 項目 | 設計內容 | 目前實作 |
|------|----------|----------|
| **狀態指令與狀態視窗** | 指令列有「狀態」按鈕，隨時可點；由 `statusUnitId : Maybe String` 驅動**彈窗/側欄**，內容見 §2.5 | 無「狀態」按鈕；僅有當前單位的 `viewCombatUnitStatus` 常駐顯示，且**未**含裝甲摘要、武器架勢/射程/傷害摘要、駕駛鬥志等 §2.5 揭露程度 |
| **viewUnitStatusDetail** | §2.5：機體 HP/EN/**MOV**、**裝甲摘要**（五屬或弱點/強項）、武器**架勢/射程/傷害摘要**/EN或彈藥、駕駛**鬥志**、配件摘要 | 未實作獨立狀態視窗與上述完整欄位 |
| **攻擊結果面板顯示時長** | 約 2～3 秒後**自動關閉**，或玩家點擊關閉 | 僅手動點「關閉」，無自動關閉 |
| **攻擊結果與反擊選單順序** | 先顯示**本次攻擊結果** → 關閉 → 若觸發反擊再顯示反擊選單；反擊結算後再顯示一次結果面板 | 目前為「先出反擊選單、選完才結算並顯示結果」，與設計「先結果、後反擊選單」順序相反 |
| **射程高亮** | 可選：`cell--attack-range`，當前武器射程內格子視覺區分 | 未實作 |
| **Finished 單位視覺** | 已行動單位以灰階或遮罩標示 | 未區分（無專用 class/樣式） |
| **頂部可選** | 下一動單位預覽、本回合尚未行動單位列表 | 未實作 |
| **點擊單位開啟狀態** | 可選：點擊地圖上單位 → 開啟該單位狀態視窗 | 未實作 |

### 3. 事件與系統（event_handler、systems）

| 項目 | 設計內容 | 目前實作 |
|------|----------|----------|
| **Unit_Death_Listener** | HP ≤ 0 → 清除格子單位、觸發掉落/經驗邏輯 | 僅 HP 歸零，無掉落/經驗等後續 |
| **Evade 選項** | 重新擲一次迴避；未命中則傷害 0 | 已實作為「傷害直接 0」，無重新擲命中公式 |
| **Defend 可選** | 耗 EN 強化減傷（如 0.5→0.3） | 僅固定 0.6 乘數，無耗 EN 強化 |

### 4. 地形與環境（terrain、combat_logic）

| 項目 | 設計內容 | 目前實作 |
|------|----------|----------|
| **地形標籤** | 每格 Terrain_Tag（Plain/Forest/Sea/Mountain 等），影響 Evade/Defense/命中/抗性、Move_Cost | 地圖無地形資料，無地形效應 |
| **天氣／環境** | 任務 Weather_Tag，整圖效應（如 Sandstorm 遠程命中 -30%） | 任務有欄位，戰鬥演算未使用 |
| **移動成本** | 依格子地形與機體適性 (systems §2) 計算 MC，影響可移動範圍 | 目前為固定 MOV 距離，無地形 MC |

### 5. 其他（action_menu、資料）

| 項目 | 設計內容 | 目前實作 |
|------|----------|----------|
| **切換武器與 Post_Move** | 設計：切換武器後狀態變 Post_Move，移動/切換武器禁用 | 已改為「不結束移動權」（依先前需求），與原設計不一致 |
| **Special_Ability Counter_Expert** | 防禦方無 Melee 但具 Counter_Expert 時仍可觸發反擊選單 | 僅檢查 Stance == "Melee"，未檢查被動能力 |

---

## 三、建議實作優先順序（對齊設計）

1. **高**：攻擊前檢查 EN/彈藥；狀態指令（「狀態」按鈕 + `statusUnitId` + 狀態視窗含 §2.5 揭露）。
2. **中**：攻擊結果面板 2～3 秒自動關閉；「先顯示攻擊結果 → 關閉後再顯示反擊選單」流程；Finished 單位灰階/遮罩；可選射程高亮。
3. **後續**：命中率/暴擊/傷害公式（combat_logic 完整演算）；地形與天氣；Unit_Death_Listener 掉落/經驗；頂部下一動預覽。

以上為依設計文件整理之差距清單，可依優先順序逐步對齊。
