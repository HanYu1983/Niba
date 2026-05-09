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
 * 統一 outbox 載荷（阻塞 Popup 與自動 ack 的 Animation 共用）：僅結構化資料，預設中文見 {@literal view.OutboxPopupBodyText}。
 */

typedef ResourceGrant = ResourceReward;

/** 批次招募結果之一列（對應清單上一名武將）。 */
typedef RecruitedGeneralLine = {
  var templateGeneralId:GeneralId;
  var rarity:Rarity;
  var costGold:Int;
};

enum FlowAckKind {
  EmptyCityOccupyAborted;
  StagingAborted;
  VillageInteractionEnded;
  VillageFriendlyVisitEnded;
  FriendlyCityVisitEnded;
  ResourceInteractionEndedWithoutBoost;
  GeneralTileLeft;
  ShopTileLeft;
}

enum TerritoryStoresKind {
  VillageStores;
  CityStores;
}

enum HostileSettlementBranch {
  PayToll;
  Negotiate;
  Attrition;
  Siege;
  Duel;
}

enum OutboxUiCopyKey {
  TestPage3JiCeIntro;
  TestPage4AiIntro;
}

enum OutboxPayload {
  FlowAck(kind:FlowAckKind);

  MoveCompleted(deltaSteps:Null<Int>, pawnTileIndex:TileIndex);

  /** 棋子移動動畫（from→to）。 */
  PawnMove(from:TileIndex, to:TileIndex, delta:Int);
  /** 動畫槽純文字（自動 ack）。 */
  AnimPlainText(message:String);

  EmptyCityOccupied(tileIndex:TileIndex, troopsCommitted:Int, grainCommitted:Int, garrisonGeneralIds:Array<GeneralId>);
  FriendlyCityDispatchCompleted(tileIndex:TileIndex, troops:Int, grain:Int, gold:Int);
  TerritoryStoresDispatchCompleted(surface:TerritoryStoresKind, tileIndex:TileIndex, troops:Int, grain:Int, gold:Int);

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

  GameRuleFeedback(?code:String, detail:String);

  UiCopy(key:OutboxUiCopyKey);
}
