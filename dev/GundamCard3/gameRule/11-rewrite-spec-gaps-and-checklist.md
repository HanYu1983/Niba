# 11 — 重寫規格檢核表與已知缺口

## 給 AI／工程師的使用方式

建議實作順序：**狀態與牌桌（07）→ 移動與セット（08）→ Flow 協議（09）→ 階段與規定效果（01–04）→ CardText／Bridge（10）→ 單卡資料（06）**。  
每完成一層，用本檔「檢核」打勾；**缺口**列為下一迭代或產品決策。

## 檢核表（最小可玩）

- [ ] `Table.cardStack` 鍵格式與 **index 0 = 頂** 語意與現版一致  
- [ ] `initState`、開局洗牌、起手 6 張、`activePlayerID` 初始值  
- [ ] `PhaseFn.getNext` 循環與 `applyFlow`+`queryFlow` 雙軌一致  
- [ ] 自由時機 **雙方 PassPhase**；堆疊 **PassCut** 與優先權  
- [ ] `immediateEffect` 與 `stackEffect` **前插**順序  
- [ ] `checkIsBattle` 更新 `battleSnapshot` 的時點  
- [ ] `doPlayerAttack` 雙向、`doRuleBattleDamage` 速攻／強襲／本國門檻  
- [ ] `destroyEffect` → `FlowMakeDestroyOrder` → 主堆疊  
- [ ] `GameRule` 假卡 ID 不暴露給玩家當實卡  
- [ ] `getItemIsCanReroll` 現況為恆 true（若要對齊紙規需改）

## 檢核表（完整對戰）

- [ ] 所有 `GlobalEffectTitle` 分支（或宣告不支援子集）  
- [ ] `EventCenterFn` 掛鉤與規則互動（移動前後、破壞狀態、回合結束清 flag…）— 見 `EventCenter.ts` 全文  
- [ ] `ItemState` 的回合／步驟結束清理（`globalEffects`、`varNamesRemoveOnTurnEnd` 等）對應 `doEffect`／階段轉換  
- [ ] 硬幣、`CoinTableComponent` 與戰鬥修正語意  
- [ ] `Chip` 與 `isCardLike` 路徑  
- [ ] 訊息／觀戰：`MessageComponent`  
- [ ] `SiYouTiming` 與 `inTiming` 完整語意（`createPlayEffects`）

## 原始碼中明示的 TODO／不完整（不可忽略）

| 來源 | 摘要 |
|------|------|
| `SetGroupComponent.ts` | 移動到本国／捨て山順序、失對象、起動每回合一次、改装複數、先頭替換、對抗無效後再支付… |
| `doEffect.ts` | `addImmediateEffectIfCanPayCost` 內「起動一回合一次」區塊標 **TODO 未驗証** |
| `card.ts` | `getItemIsCanReroll`／`getItemIsCanRoll` 恆 true |
| `Timing`／產品 | `whoFirst` 互動薄弱；先手寫死 `PlayerA` |

## 「規則書完整度」結論（給委託方）

- **僅閱 01–06**：不足以重寫同等引擎，因缺 **狀態模型、Flow 協議、CardText 執行模型**。  
- **閱 01–11**：足以 **架構級重寫** 並對齊現版行為；**單卡完全一致**仍依賴 **全量 CardText／JSON／ext 腳本** 與未完成的 TODO 行為定案。  
- **與官方紙本規則書**：本專案是 **實作真相**；紙本僅在註解中對照頁碼，**不能**當驗收紙規的唯一依據。

## 橫向檢查

- 若新引擎省略 **eval+Bridge**，必須另寫 **效果相容層** 或 **資料遷移**，否則與現有卡資料不相容。  
- 終局條件目前僅見 **本国無牌**（`queryFlow`）；其他勝負（如分數、投降）屬產品擴充。
