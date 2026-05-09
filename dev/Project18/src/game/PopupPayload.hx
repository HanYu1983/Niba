package game;

import game.CityLevel;
import game.EquipmentType;
import game.GameIds;
import game.GeneralStat;
import game.Rarity;
import game.ResourceReward;
import game.StrategyCostTier;
import game.StrategyPhase;

/**
 * Outbox 阻塞型 Popup 之載荷：僅傳結構化資料，**不帶 UI 文案字串**（{@link PopupPayload} 以外的標題仍可由賽局帶入）。
 * 預設中文排版見 {@literal view.OutboxPopupBodyText}。
 */

typedef ResourceGrant = ResourceReward;

/** 批次招募結果之一列（對應清單上一名武將）。 */
typedef RecruitedGeneralLine = {
  var templateGeneralId:GeneralId;
  var displayName:String;
  var rarity:Rarity;
  var costGold:Int;
};

enum FlowAckKind {
  /** 空城進駐流程中取消。 */
  EmptyCityOccupyAborted;
  /** 取消計策／暫存 staging。 */
  StagingAborted;
  /** 村落互動回合結束（無派遣細節）。 */
  VillageInteractionEnded;
  /** 離開我方村落拜訪。 */
  VillageFriendlyVisitEnded;
  /** 離開我方城池拜訪。 */
  FriendlyCityVisitEnded;
  /** 資源格離開且未走加成。 */
  ResourceInteractionEndedWithoutBoost;
  /** 離開武將格。 */
  GeneralTileLeft;
  /** 離開商店格。 */
  ShopTileLeft;
}

enum TerritoryStoresKind {
  VillageStores;
  CityStores;
}

/** 敵城對峙攻方結算分支（與選項 token 對齊）。 */
enum HostileSettlementBranch {
  PayToll;
  Negotiate;
  Attrition;
  Siege;
  Duel;
}

/** 測試／教學用：UI 依鍵載入完整說明（不依賴賽局組字串）。 */
enum OutboxUiCopyKey {
  TestPage3JiCeIntro;
  TestPage4AiIntro;
}

enum PopupPayload {
  /** 純流程確認（無額外參數）。 */
  FlowAck(kind:FlowAckKind);

  /** 移動結束摘要（骰步與落地格）。 */
  MoveCompleted(deltaSteps:Null<Int>, pawnTileIndex:TileIndex);

  /** 成功進駐空城後資源配置摘要。 */
  EmptyCityOccupied(tileIndex:TileIndex, troopsCommitted:Int, grainCommitted:Int, garrisonGeneralIds:Array<GeneralId>);
  /** 我方城池調度結果。 */
  FriendlyCityDispatchCompleted(tileIndex:TileIndex, troops:Int, grain:Int, gold:Int);
  /** 村落調度結果。 */
  TerritoryStoresDispatchCompleted(surface:TerritoryStoresKind, tileIndex:TileIndex, troops:Int, grain:Int, gold:Int);

  /** 敵城對峙結算確認後之摘要（結構化分支 + 將領）。 */
  HostileCombatSettlement(kind:HostileSettlementBranch, tileIndex:Int, attackerLeadGeneralId:Null<GeneralId>, defenderGeneralId:Null<GeneralId>);

  TileEventAvoidanceSucceeded(generalId:GeneralId, stat:GeneralStat, statValue:Int, successRatePct:Int, effectMultiplier:Float);
  TileEventAvoidanceFailed(generalId:GeneralId, stat:GeneralStat, statValue:Int, successRatePct:Int);

  EpidemicResolved(staminaLossEach:Int, troopLoss:Int, effectMultiplier:Float);
  GranaryFireResolved(grainLoss:Int, effectMultiplier:Float);

  DefectionNoGeneralsSkipped;
  DefectionResolved(generalId:GeneralId, successRatePct:Int, effectMultiplier:Float);
  DefectionNotTriggered(successRatePct:Int, effectMultiplier:Float);

  AssassinationNoGeneralsSkipped;
  AssassinationResolved(generalId:GeneralId, stat:GeneralStat, permanentLoss:Int, effectMultiplier:Float);

  RingArmyFundBonus(hasLeadingGeneral:Bool, leadingGeneralId:Null<GeneralId>, troopGain:Int);
  RingSupplyBonus(grainGain:Int);
  RingRewardSkipped;

  ChestTroopReward(hasLeadingGeneral:Bool, leadingGeneralId:Null<GeneralId>, troopGrant:Int);

  ResourceClaimed(tileIndex:TileIndex, grant:ResourceGrant);
  ResourceBoostAssigned(
    tileIndex:TileIndex,
    generalId:GeneralId,
    stat:GeneralStat,
    statValue:Int,
    staminaBefore:Int,
    staminaAfter:Int,
    base:ResourceGrant,
    bonusAmount:Int,
    total:ResourceGrant
  );

  VillageTradeOutcome(
    success:Bool,
    villageTile:TileIndex,
    generalId:GeneralId,
    ratePct:Int,
    rollPct:Int,
    goldSpentOnSuccess:Int,
    grainGainedOnSuccess:Int,
    friendlyPrev:Int,
    friendlyNext:Int,
    ownerMonarchAfter:Null<MonarchId>
  );

  VillagePlunderOutcome(
    success:Bool,
    villageTile:TileIndex,
    generalId:GeneralId,
    ratePct:Int,
    gainGold:Int,
    gainGrain:Int,
    gainTroops:Int,
    friendlyPrev:Int,
    friendlyNext:Int,
    prestigeLoss:Int
  );

  VillageDevelopOutcome(
    success:Bool,
    villageTile:TileIndex,
    generalId:GeneralId,
    politics:Int,
    ratePct:Int,
    costGold:Int,
    costGrain:Int,
    levelBefore:CityLevel,
    levelAfter:CityLevel
  );

  VillageConquerOutcome(
    success:Bool,
    villageTile:TileIndex,
    generalId:GeneralId,
    committedTroops:Int,
    friendlyAfter:Int,
    lootGold:Int,
    lootGrain:Int,
    lootTroops:Int,
    troopLossOnFailure:Int
  );

  FriendlyCityDevelopOutcome(
    success:Bool,
    cityTile:TileIndex,
    generalId:GeneralId,
    politics:Int,
    ratePct:Int,
    costGold:Int,
    costGrain:Int,
    levelBefore:CityLevel,
    levelAfter:CityLevel
  );

  RestStamina(generalId:GeneralId, staminaBefore:Int, staminaAfter:Int, staminaCost:Int, territoryRest:Bool);

  GeneralBatchRecruited(tileIndex:TileIndex, recruits:Array<RecruitedGeneralLine>, totalGold:Int);

  ShopEquipmentPurchased(
    tileIndex:TileIndex,
    assignedGeneralId:GeneralId,
    priceGold:Int,
    equipName:String,
    equipType:EquipmentType,
    equipRarity:Rarity,
    bonusStat:GeneralStat,
    bonusValue:Int,
    loyaltyBonus:Int
  );

  JiCeCasterOutcome(
    cardLabel:String,
    phase:Null<StrategyPhase>,
    casterId:GeneralId,
    primaryStat:GeneralStat,
    tier:StrategyCostTier,
    success:Bool,
    rate:Float,
    roll:Float,
    staminaCost:Int,
    staminaBefore:Int,
    staminaAfter:Int,
    targetCaption:Null<String>,
    effectLines:Array<String>
  );

  JiCeTargetOutcome(cardLabel:String, attackerMonarchId:MonarchId, casterId:GeneralId, effectLines:Array<String>);

  /** 規剘拒絕：{@code code} 供 UI 對應模板；{@code detail} 為例外訊息（可展示為補充）。 */
  GameRuleFeedback(?code:String, detail:String);

  /** 場景說明鍵（僅測試／教學場）。 */
  UiCopy(key:OutboxUiCopyKey);
}
