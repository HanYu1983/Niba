# mygame2 效果分類與缺口分析（Effects Taxonomy）

> 建立日期：2026-08-23
> 目的：盤點遊戲中所有影響玩法的效果（道具／功法／裝備／Buff／事件／建築／設施／政策），分類列表並估算占比，
> 供 AI 擴充內容時判斷：**該補哪個缺、何時該發明新類型效果**。
> 配套：`content-expansion-playbook.md`（流程）、`catalogs-extension.md`（實作手法）。

## 1. 效果載體總量盤點

| 載體 | 條目數 | 承載效果的方式 |
|---|---|---|
| 道具 itemCatalog | 53 | `ItemEffectType`（10 種）＋分類欄位 |
| Buff buffCatalog | 55 | 22 個解譯欄位（屬性修正/乘區/地形/復活/週期回復…） |
| 功法 | 74 | 內功 14（傷害公式閉包）、傷害外功 14、功能外功 46 |
| 裝備 equipmentCatalog | 60 | **純五維 modifiers**，無特殊效果 |
| 探索事件 eventCatalog | 41 型／約 79 選項 | `EventEffect` 12 種＋`EventRequirement` 6 種 |
| 建築 buildingCatalog | 25 | bonus 欄位 3 種＋actions 3 種＋特例邏輯（含 12 座門派武館） |
| 防禦設施 defenseStructureCatalog | 9 | 視野/阻擋/攻擊/改地形四種能力旗標 |
| 政策 governancePolicyCatalog | 4 | 僅 3 條有效果（±5%，寫死在 policyRules） |
| 全局靈氣 GLOBAL_BUFF_POOL | 6 | 商店價/收入/醫療/城防/回合回復/練功經驗 |

## 2. 各載體內部占比

### 2.1 道具（53 件）
| 分類 | 數量 | 占比 | 內容 |
|---|---|---|---|
| 元素爆發 | 24 | **45%** | 六元素×四階＋無元素爆破線，數值 15/30/50/75 |
| 恢復 | 12 | 23% | 三資源×四階，矩陣完整 |
| 資源取捨 | 6 | 11% | 以 A 資源換 B 資源，不掉落專用 |
| 戰場操控 | 5 | 9% | 陷阱×2、探地、鳴鑼、回營 |
| 屬性丹 | 5 | 9% | 五維各一顆永久+1 |
| 特殊 | 1 | 2% | 回光玉（瀕死復活） |

### 2.2 Buff（55 條）
| 語義 | 數量 | 代表 |
|---|---|---|
| 移動/地形消耗 | 13 | 六步功＋驛路步、swift-wind-movement、主場×5 的移動部分 |
| 屬性修正 | 8 | 五維常駐×5、home-turf-water/ruin 的加值、烈陽戰意 |
| 傷害乘區 | 8 | break-army/vigor、主場三兄弟的 +15%、共鳴迴避、凌厲劍勢、烈目凝芒 |
| 減益/控場 | 7 | burning×2、cold-poison×2、immobilize、reflection×2、腐骨毒 |
| 資源吸取回復 | 5 | bloodthirst、spring-return、qi-transformation、inner-power-drain、雨潤回春 |
| 條件觸發 | 4 | back-to-water、nurture-qi、all-in、孤影決絕 |
| 防禦減免 | 7 | iron-wall-art、home-turf-mountain/ruin、影匿（迴避）、護體罡氣（免疫）、雨幕遮身、幽影蔽身 |
| 復活 | 1 | return-light |
| ⚠️ 零使用欄位 | — | `terrainStaminaCostMultipliers`（乘算版地形消耗）無任何條目使用 |

### 2.3 功能外功（31 種 effect）
| 語義 | 數量 |
|---|---|
| 移動/地形適應 | 8（terrain-adaptation＋七步） |
| 資源吸取/週期回復 | 6（血飲/回春/化氣/汲元＋體力回復＋內力回復） |
| 傷害增益 | 3（critical/damage-dealt/external-damage） |
| 條件爆發 | 3 |
| 屬性爆發 | 1（berserk：增益附反噬） |
| 攻擊附著減益 | 3（burning/poison/attribute-reduction） |
| 防禦反震/迴避/免疫 | 4（damage-reduction/reflection/evasion/debuff-immunity） |
| 瞬發實用（無 Buff） | 3（experience-gain/cleanse/recover） |
| 成長 | 1（experience-gain） |

### 2.4 事件效果（基礎事件池約 60 個選項的效果實例統計）
| EventEffect | 實例數 | 占比 | 備註 |
|---|---|---|---|
| prestige | ~46 | 42% | 幾乎每個選項都送聲望 |
| item | ~40 | 36% | 全部是既有道具，多為恢復線 |
| money | ~28 | 26% | 正負皆有 |
| learn-skill | 4 | 4% | 石刻/秘笈/乞者/武人 |
| spawn-creature/nest/base/event | **0** | **0%** | 引擎完整支援卻零內容使用！ |
| start-dialogue | 0 | 0% | 僅劇情模式使用 |
| equipment | — | 未接線 | 型別已定義未實作 |

---

## 3. 跨載體效果家族總表（合計約 235 個效果承載條目）

占比為跨所有載體的粗估，用於判斷飽和度。

| # | 效果家族 | 約數 | 占比 | 主要承載者 |
|---|---|---|---|---|
| F1 | 屬性修正／成長 | ~59 | **26%** | 裝備 45、屬性丹 5、五維常駐 Buff 7、經驗加成功法 |
| F2 | 傷害輸出 | ~46 | 21% | 元素爆發道具 24、傷害功法 16、傷害乘區 Buff、箭塔 3 |
| F3 | 經濟／聲望 | ~33 | 16% | 事件 money/prestige、政策 3、全局靈氣 2、商隊事件 |
| F4 | 資源管理（恢復／轉換） | ~24 | 11% | 恢復丹 12、取捨藥 6、吸取回復 Buff 4、休整/醫療 |
| F5 | 機動／地形互動 | ~15 | 7% | 步法×7、輕功 6、官道、回營符 |
| F6 | 防禦／生存 | ~13 | 6% | 減免/反震/閃避 Buff 8、城牆兵營、城防靈氣 |
| F7 | 控場／減益 | ~8 | **4%** | 定身索×2、燃燒×2、寒毒×2、屬性削減功法 |
| F8 | 視野／情報 | ~6 | **3%** | 探地符、鳴鑼符、瞭望類設施 4 |
| F9 | 敘事／進度推進 | ~4 | 2% | start-dialogue、學藝事件 4、聲望解鎖政策 |
| F10 | 世界變動（召喚／生成） | **0** | **0%** | 引擎支援 spawn-creature/nest/base/event，**零內容使用** |

## 4. 缺口分析

### 4.1 飽和區——不再新增同質條目
| 區域 | 證據 | 指令 |
|---|---|---|
| 元素爆發 | 道具端 45%、六元素四階齊全 | 不再加元素符；新戰鬥消耗品應轉向控場/情報家族 |
| 恢復 | 三資源×四階矩陣完整＋休整/醫療/回氣 Buff | 只在引入新資源時擴充 |
| 純屬性裝備 | 39 件全為 modifiers、每級+2/$30 曲線固定 | 裝備差異化應走向特殊詞綴（=新類型，見 4.3） |
| 聲望發放 | 事件 42% 選項送 prestige | prestige 已是硬通貨，勿再稀釋 |

### 4.2 補缺優先序——現有欄位即可表達（零～低程式碼成本）
1. **世界變動事件（F10＝0%）**：`spawn-creature`/`spawn-nest`/`spawn-base`/`spawn-event` 引擎完整、基礎池零使用。最高 CP 值補缺：做「妖氣異動」「伏擊」「賊巢現蹤」類高風險事件，讓探索有代價。
2. **控場／減益（F7＝4%）**：`immobilized`/`maxHealthDamagePercent`/`attributeMultiplier` 欄位現成，但多被門派專屬功法佔用。可補：通用江湖控場功法、事件獎勵發放陷阱類道具（事件端目前零發放控場品）。
3. **防禦生存（F6＝6%）**：`damageReductionPercent`/`reflectionPercent`/`evasionRateBonus` 可自由組合，主場/共鳴已有先例。可補防禦型食物 Buff、鐵布衫類江湖功法。
4. **零使用欄位**：BuffDefinition.`terrainStaminaCostMultipliers`（乘算版地形適應，與步法的 override 語義不同）——做「負面地形 debuff」（如沼澤纏足）即可啟用。
5. **未接線效果**：EventEffect `equipment` 已定型別未實作 resolver case——補上後事件可直接獎勵裝備。
6. **政策線**：僅 3 條有效果且寫死在 policyRules；GLOBAL_BUFF_POOL 六種靈氣可一一對照設計成政策（如「養精蓄銳令」），形成政策↔靈氣鏡像擴充。
7. **視野情報（F8＝3%）**：道具/建築有，功法/Buff 端完全沒有——但 Buff 無視野欄位，嚴格說是跨界項（見 4.3 第 7 條）。

### 4.3 新類型候選——需動規則層（按 master-plan 需求排序）
| 新類型 | 現狀限制 | 牽動範圍 |
|---|---|---|
| AoE／多目標傷害 | 攻擊 target 僅 self/target/nest | combatRules 目標解析、UI 選取、master-plan 明列需求 |
| 護盾／臨時吸收 | damageReduction 是乘算%，非定值池 | PlayerState 加 shield 欄位＋回合衰減規則 |
| 行動經濟（額外行動／玩家側禁手） | immobilized 只有怪物側語義 | 回合流程規則 |
| 驅散／淨化 | 唯一移除前例 clearDebuffsOnRevive | 新 action 或戰鬥附帶效果 |
| 臨時友軍／召喚物 | spawn-* 只產世界實體（怪/巢/據點/事件） | 實體生命週期管理 |
| 玩家側地形改造 | road 由防禦設施改地形，唯一前例 | 地圖 cell 變更＋存檔相容 |
| 視野 Buff 化 | revealedCreatureCellIds 是即時快照非持續狀態 | 視野計算規則 |
| 嘲諷／仇恨操控 | creatureBehaviorRules 目標選擇固定 | selectCreatureTarget 加權 |

## 5. 給 AI 的決策流程

```
新內容點子
 ├─ 歸入哪個效果家族？（查 §3）
 ├─ 家族占比 ≥20% 且與既有條目同質？ ──是──▶ 否決或轉向缺口家族（§4.1）
 ├─ 能用現有欄位/效果組合表達？ ──是──▶ 【補缺】走 playbook 三階段（§4.2 清單優先）
 ├─ 需要新 Buff 欄位？ ──是──▶ 檢查是否與既有欄位語義重疊；
 │                              確認新穎後：types 加欄位 → rules 解譯 → scaling 表 → 測試
 ├─ 需要新 EventEffect / ItemEffectType 成員？ ──▶ resolver 加 case ＋ spawner ＋ 測試
 └─ 需要 §4.3 級引擎機制？ ──▶ 先在 reports/development-log.md 提案，
                               確認影響面（存檔相容/UI/平衡）後再實作
```

**成本對照**：補缺＝只寫 catalog＋測試（小時級）；新欄位＝catalog＋rules＋scaling＋測試（半天級）；新引擎機制＝全層貫穿＋存檔遷移考量（天級以上）。擴充時一律先耗盡低成本層級。

## 6. 維護約定

- 本文件數據基於 2026-08-23 盤點；每次大幅擴充 catalogs 後更新 §2/§3 占比。
- 新增效果欄位或 union 成員時，同步在 §4.2/§4.3 移動對應條目（新類型落地後降級為「已支援」）。
- 相關文件：`content-expansion-playbook.md`（研究→構思→聯關流程）、`catalogs-extension.md`（各 catalog 寫入手冊）、`mygame2-architecture.md`（規則層架構）。

