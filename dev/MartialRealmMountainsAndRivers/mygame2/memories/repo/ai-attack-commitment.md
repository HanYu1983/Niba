# AI 攻擊承諾（Attack Commitment）筆記

## 目的
解決 AI「打一下就跑/分散攻擊」：讓 AI 集火同一隻生物直到殺死（除非高威脅）。

## 修改檔案：`src/game/ai/aiStepRunner.ts`
1. `rememberMovementCommitment`：接受 `attack` action（原本只接受 move/transport），記錄承諾。
2. `selectFuzzyCandidateWithMomentum`：
   - `committed` 匹配從 `eligible`（僅 move 候選）擴充，攻擊承諾從 `rankedGoals` 找「有 attack action 且 targetKey 相同」的候選。
   - 匹配命中時更新 commitment 的 score，持續維持。
   - `isHighThreat`（selfPreservation >= 0.6）仍可強制中斷承諾逃生。
   - 新目標需 `score >= committed.score + AI_MOVEMENT_MOMENTUM_MARGIN (0.2)` 才切換。
3. `getGoalTargetKey`：**對 `kind==='attack'` 目標僅用 `targetId` 建 key**（忽略 position），因為怪物在 step 間會移動，含 position 會導致承諾失配無法集火。巢穴攻擊 `targetId` 空白則走完整 JSON key（巢穴不移動，安全）。

## 效果（level-5 單局測試，seed 20260910）
- 擊殺成本 attack/kill：25 → **2.0**
- 擊殺效率 1/6 → **4/6**；行動產出率 18.7% → **37.3%**
- 單局可達 Lv.5（過去卡 Lv3）

## 仍存在瓶頸（未解決）
- **單局不穩定**：連續多跑 result 3/4/4/5，未可靠達 Lv5。
- 根因：安全時 AI 常「無可執行 action」→ end-turn 空轉（大量 hold/end-turn）。這與生物重生數量（`Math.random` 主導 nest spawn）疊加造成等級波動。
- 真正卡點：非戰鬥效率，而是「無生物時不知做什麼」的結構性空轉 + nest spawn 隨機。

## 空轉/體力浪費分析（2026-09-02 基線 trace）
- **探索目標太遠蠕動**：玩家在 (5,1) 卻往 (12,12)（對角 20+ 格）探索，每回合僅爬 1 格、體力耗盡目標仍遠；曾出現 destination=自己位置的無效 move。
- **目標無序切換/折返**：學招據點→探索(12,12)→收集→練功據點→清障→防禦建設，在據點附近 (5,1)(5,2)(6,1) 打轉不推進。
- **忽視可打之怪**：巢穴第 1 回合就生怪，玩家卻花體力往遠方探索。
- 行動產出率僅 31%，此為等級卡 4 主因之一（扣除攻擊承諾只解決「集火」，未解決「空轉」。

## 中期目標機制（2026-09-02，成功）
新檔 `src/game/ai/fuzzy/midTermGoal.ts` + 接線 `aiStepRunner.ts`（每步 evaluateAllGoals 後、選目標前 call）。
- **概念**：把「達成可量化狀態」當執行單元，跨 fuzzy step 持久存活（module Map）。用 `overrideScoreForMidTermGoal` 把對應 goal 分數抬到 1.0，優先執行。
- **擊殺目標（主打）**：視野內有「damageRatio≥0.4 + 扛得住 + 距離≤6」最佳獵物 → 鎖定 `{type:'kill', targetId}`，抬 engageCombat 到 1.0，追殺到該怪死亡（不可見）才換。`KILL_DAMAGE_RATIO=0.4`, `KILL_MAX_DISTANCE=6`，體力<0.1 不鎖定。
- **存錢目標**：缺錢(<80) + 有告示牌 + 可打工 → 鎖定打工到 $100。但常不觸發（據點遠/未發現，missionBaseId 空）。
- **效果（5 次連續）**：3 次 Lv5（60% 成功率），對比之前 0%（3/3/4/3）。攻擊承諾讓集火 25→2，但沒解決「不主動追異地獵物」；擊殺目標補上「主動鎖定追殺」後升級穩定性大升。

## 未來優化點
- 上局 trace `practice-skill=55` 異常高 + `end-turn=61` 高 → 部分局花太多時間練功/空轉。
- 單局仍不穩定（Lv2/Lv4 也有），受巢穴 spawn 隨機影響大。

## 打工經濟循環（2026-09-02，驗證成功）
新增測試「AI 缺錢且在相鄰據點有告示牌時：會主動打工存錢，金錢明顯上升」（`aiBeginnerSandboxVictory.test.ts`）。
- 受控環境：玩家 money:0 + 相鄰基地含 board+item-shop。
- 結果：AI 連續 `use-facility mission` ×4、money 0→40、行動產出率 100%。**存錢中期目標在真實 trigger**。
- 證明打工→存錢循環可行（只要「據點近、有告示牌、缺錢」三條件成立）。
- 既有 4 個通關測試（標準勝利/簡單難度/level-5）仍失敗=已知瓶頸，與本次無關，勿誤判為回歸。

## 未補經濟鏈（有待做）
- **買裝備機制完全缺失**：`findEquipmentCandidates` 只從背包庫存挑，無「去 equipment-shop 買」動機。標準地圖基地初始只有 board，無 shop，需 AI 自蓋。
- AI 只在「受傷買藥 / 打巢穴買爆發符」時才 buy-item，無「純買裝變強」動機。

## 買道具變強（2026-09-02，完整循環成功）
新增輸入 `buyableUsefulItem`（fuzzyInputs）+ goal `buyConsumable`（goals.ts）+ actionMapper `buyConsumable`→`buildBuyItemActions`（買 item）+ decision `PRIORITY_ORDER` + personality `ALL_GOALS`。
- `findBuyableUsefulItem`：優先永久屬性丹(attribute-up)，其次缺血買回血藥。需 money≥price。
- **循環驗證成功**（受控測試）：打工42次 → buy-item 5次（大力丸/輕身丸/續命丹）→ use-item 3次吃掉 → 屬性 8/8/8→9/9/9 → 再買再吃。行動產出率 83%。
- 完整達成「打工→存錢→買道具→變強」，money 充分轉為戰力。

## 生存優先買道具（2026-09-02，更新）
`findBuyableUsefulItem` 改為**生存優先**：
1. 優先確保身上「回血(health) / 回內力(inner-power) / 回體力(stamina)」三類各≥1（續航=生存率根本）。
2. 三類都齊才買永久屬性丹。
- trace 實證：AI 先買回氣丹(回體力)補生存，再買大力丸(屬性丹)。測試斷言購物 + 持有回血道具都通過。

## 經濟循環的遺留課題
- 打工→買裝（equipment-shop buy-equipment AI 管線）仍缺失；標準地圖無商店需自蓋、且無 buy-equipment AI action。

## 買裝備管線（2026-09-02，完成）
新增 AI action `buy-equipment` + 執行(executeAiAction→buyEquipment) + 輸入 `buyableEquipment`(fuzzyInputs.findBuyableEquipment) + goal `buyEquipment` + actionMapper `buildBuyEquipmentActions` + validation + actionCost(shop) + labels。
- `findBuyableEquipment`：用 `canBuyEquipment`(商店鄰近+級別+錢)驗證，選「空槽或有增益>0」的可負擔裝備；**排除已持有同 id**避免重複買。
- 測試「AI 在相鄰據點有裝備商店且錢夠時：會購買並裝備武器變強」通過。
- trace：買不同武器（精鐵劍→青銅刀→青竹杖→門派武器），會 equip。
- 已知小問題：`equip` 會在兩把「對彼此都增益>0」的武器間反覆切換（findEquipmentCandidates 只要 gain>0 就納入），非阻塞買裝主線，列待改。

## 買裝備持有邏輯「三槽各一」+ 反覆切換修復（2026-09-02）
`findBuyableEquipment` 改為**「有就停」**策略：
- 武器/防具/配件三槽，**只補「完全空槽」**的槽（優先序武器>防具>配件），買該槽最便宜一件。
- 槽位已持有（已穿戴或背包有）→ 不再為該槽買更強裝備（更強靠道具點/掉落）。
- **順帶修復反覆切換**：不再用「增益>0」判斷，而是「空槽才值得買」，且一次只補一槽。

trace 實證：買精鐵劍(weapon)→行者護衣(armor)→溫玉佩(accessory) 各一，equip 各一。
- 之前：buy-equipment=6, equip=18（反覆換）；現在：buy=3, equip=3（三槽穿齊即停）。
- 測試斷言「買過≥2種不同槽位」通過。

## 買道具/買裝經濟體系全貌（已打通）
打工存錢 →（生存優先買回血/回內力/回體力道具）→ 買永久屬性丹 → 買三槽裝備各一 → 更強裝備靠道具點撿。

## 已回退的失敗調整（2026-09-02）
嘗試「安全時靠據點打工賺錢買裝」但失敗，已全部回退：
1. `goals.ts` 打工加 `f_moneyNeed` 動機 → 打工分數達 1.0 壓過磨血戰鬥，AI 不打怪。
2. `constructionValue.ts` 缺錢升告示牌 benefit 提升。
3. 打工分數封頂 0.48 → 過度壓抑，打工也停、怪也打不死（Lv2）。

**關鍵洞察**：
- 打工分數若高於「可磨血戰鬥」(0.45+) 會搶走 XP 來源；低於則打工不觸發。係數極敏感。
- 真實卡點是 **`needsLeveling` 練功分 0.6×stamina 蓋過磨血戰鬥 + 傷害太低(10)打不死巢穴怪**，導致 AI 蹲門派練功卻不清場。
- 結論：單一係數調整在隨機巢穴重生下意義有限，且與練功/戰鬥/打工互相纏繞。下次應先「量化 AI 傷害 vs 怪物血量」再決定調傷害或調行為。