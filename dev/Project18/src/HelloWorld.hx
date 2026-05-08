import game.IGame;
import game.GameIds;
import game.GeneralStat;
import game.TileKind;
import game.IBoard;
import game.ITile;
import game.IGeneral;
import game.IMonarch;
import game.IJiCe;
import game.IGameMatch;
import game.MatchTerminationReason;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.MenuGeneralChoice;
import game.MenuFormWidget;
import game.PlayerMenuKind;
import game.EquipmentType;
import game.IEquipment;
import game.PositionRank;
import game.LevelKeys;
import view.AppController;
import view.EventCenter;
import view.html.HtmlRouterView;
import impl_ver1.core.GameMatchCore;
import view.UiCommand;

class HelloWorld {
  static function main() {
    impl_ver1.Ver1SmokeTest.run();
    debug_ver1.EmptyLevelFourPlayerLoopTest.testEmptyLevelFourPlayerLoop(new impl_ver1.Game());
    debug_ver1.TwoPlayerJiCeStagingMoveConfirmTest.testTwoPlayerJiCeStagingMoveConfirm(new impl_ver1.Game());
    debug_ver1.TenEventTilesMenuFlowTest.testTenEventTilesMenuFlow(new impl_ver1.Game());
    debug_ver1.GeneralChestTileEventMenuTest.testGeneralChestTileEventMenuFlow(new impl_ver1.Game());
    debug_ver1.EmptyCityVacantFormMenuTest.testVacantCitySingleFormOccupy(new impl_ver1.Game());
    debug_ver1.EmptyCityVacantFormMenuTest.testOccupiedCitySkipsForm(new impl_ver1.Game());
    debug_ver1.FriendlyOwnedCityDispatchMenuTest.testFriendlyCityPersistentMenuUntilVisitEnd(new impl_ver1.Game());
    debug_ver1.HostileCityConfrontMenuTest.testPayTollThenDefenderAckThenSettlement(new impl_ver1.Game());
    debug_ver1.HostileCityConfrontMenuTest.testNegotiateWithGeneralPickThenSettlement(new impl_ver1.Game());
    debug_ver1.HostileCityConfrontMenuTest.testDuelBothSidesPickGeneralThenSettlement(new impl_ver1.Game());
    debug_ver1.RoadblockJiCeMovementTest.testEnemyHaltedByRoadblockJiCe(new impl_ver1.Game());
    debug_ver1.RoadblockJiCeMovementTest.testPlacerPassesHookTile(new impl_ver1.Game());
    debug_ver1.MoveMenuHiddenUntilConfirmTest.testMoveMenuHiddenUntilConfirm(new impl_ver1.Game());
    debug_ver1.RestMenuFlowTest.testRestMenuFlow(new impl_ver1.Game());
    debug_ver1.VillageMenuFlowTest.testVillageMenuFlow(new impl_ver1.Game());
    debug_ver1.VillagePlunderMenuFlowTest.testVillagePlunderMenuFlow(new impl_ver1.Game());
    debug_ver1.FriendlyCityDevelopRestMenuFlowTest.testFriendlyCityDevelopRestMenuFlow(new impl_ver1.Game());
    debug_ver1.PostMoveLandingWindowMenuTest.testPostMoveLandingWindow(new impl_ver1.Game());
    debug_ver1.PlayerTargetJiCeMenuFlowTest.testPlayerTargetJiCeMenuFlow(new impl_ver1.Game());
    debug_ver1.StrategyPhaseRestrictionTest.testStrategyPhaseRestriction(new impl_ver1.Game());
    debug_ver1.EndOfRoundSettlementTest.testEndOfRoundSettlement(new impl_ver1.Game());
    debug_ver1.VillageFriendlyTradeSettlementTest.testVillageFriendlyTradeSettlement(new impl_ver1.Game());
    debug_ver1.VillagePlunderSettlementTest.testVillagePlunderSettlement(new impl_ver1.Game());
    debug_ver1.VillageConquerSettlementTest.testVillageConquerSettlement(new impl_ver1.Game());
    debug_ver1.VillageIncomeAtEndOfRoundTest.testVillageIncomeAtEndOfRound(new impl_ver1.Game());
    debug_ver1.HostileCitySiegeCityLevelDefenseTest.testHostileCitySiegeCityLevelDefense(new impl_ver1.Game());
    debug_ver1.ResourceTileSettlementTest.testResourceTileSettlement(new impl_ver1.Game());
    debug_ver1.StartTileRewardTest.testStartTileReward(new impl_ver1.Game());
    debug_ver1.GeneralTileMenuFlowTest.testGeneralTileMenuFlow(new impl_ver1.Game());
    debug_ver1.ShopTileMenuFlowTest.testShopTileMenuFlow(new impl_ver1.Game());
    debug_ver1.TileEventAvoidanceMenuFlowTest.testTileEventAvoidanceMenuFlow(new impl_ver1.Game());
    debug_ver1.NegativeTileEventsAlignmentTest.testNegativeTileEventsAlignment(new impl_ver1.Game());
    debug_ver1.PopupLifecycleTest.testPopupLifecycle(new impl_ver1.Game());
    debug_ver1.JiCePreviewRowsTest.testJiCePreviewRows(new impl_ver1.Game());
    debug_ver1.PostMoveTileTargetRestrictionTest.testPostMoveTileTargetRestriction(new impl_ver1.Game());
    debug_ver1.EconomyUpkeepAndCityIncomeTest.testEconomyUpkeepAndCityIncome(new impl_ver1.Game());
    debug_ver1.GrainShortageTroopDesertionTest.testGrainShortageTroopDesertion(new impl_ver1.Game());
    debug_ver1.StartTileTerritoryGrowthTest.testStartTileTerritoryGrowth(new impl_ver1.Game());
    debug_ver1.CityGrowthAffectedByLevelAndGarrisonTest.testCityGrowthAffectedByLevelAndGarrison(new impl_ver1.Game());
    debug_ver1.FriendlyCityDevelopSettlementTest.testFriendlyCityDevelopSettlement(new impl_ver1.Game());
    debug_ver1.OwnedVillageDispatchMenuTest.testOwnedVillagePersistentMenuUntilVisitEnd(new impl_ver1.Game());
    debug_ver1.VillageDevelopSettlementTest.testVillageDevelopSettlement(new impl_ver1.Game());
    debug_ver1.VillageGrowthAffectedByLevelTest.testVillageGrowthAffectedByLevel(new impl_ver1.Game());
    debug_ver1.TerminationConquestVictoryTest.testTerminationConquestVictory(new impl_ver1.Game());
    debug_ver1.TerminationTerritoryVictoryTest.testTerminationTerritoryVictory(new impl_ver1.Game());
    debug_ver1.TerminationWealthVictoryTest.testTerminationWealthVictory(new impl_ver1.Game());
    debug_ver1.TerminationTimeLimitVictoryTest.testTerminationTimeLimitVictory(new impl_ver1.Game());
    debug_ver1.AiFourPlayersToTerminationTest.testAiFourPlayersToTermination(new impl_ver1.Game());
    debug_ver1.ProbTileKindGenerationTest.testProbTileKindGeneration(new impl_ver1.Game());
    debug_ver1.EquipmentBonusRangeTest.testEquipmentBonusRange();
    debug_ver1.GeneralGenerationByRarityTest.testGeneralGenerationByRarity();
    debug_ver1.MeritAndRankPromotionTest.testMeritAndRankPromotion();
    debug_ver1.StrategyStaminaCostRangeTest.testStrategyStaminaCostRange();
    debug_ver1.ShopRarityProgressionTest.testShopRarityProgression();
    debug_ver1.TerrainGenerationWeightsTest.testTerrainGenerationWeights();
    debug_ver1.StrategyEffectMultiplierTest.testStrategyEffectMultiplier();
    debug_ver1.PlayerTargetStrategyEffectTest.testPlayerTargetStrategyEffect();
    debug_ver1.StrategyUnlockByRankTest.testStrategyUnlockByRank(new impl_ver1.Game());
    debug_ver1.StrategyAutoGrantByRankTest.testStrategyAutoGrantByRank(new impl_ver1.Game());
    trace("Hello world");

    // --- HTML view demo ---
    // 建立一個最小 demo match，注入 ViewModel 並建出地圖與玩家組件。
    // 注意：runHelloJs.bat 以 node 執行（無 window/document），因此需 guard。
    var hasWindow:Bool = untyped __js__("typeof window !== 'undefined' && typeof window.document !== 'undefined'");
    if (!hasWindow)
      return;
    var game:IGame = new impl_ver1.Game();
    var controller = new AppController(game);
    new HtmlRouterView();
    // 啟動：建立第一局並注入 ViewModel
    EventCenter.publishCommand(view.UiCommand.NewGame(LevelKeys.EMPTY));
  }

  /** 強制將架構符號納入編譯檢查（無執行語意）。 */
  static function __architectureCompileCheck():Void {
    var _tid:TileKind = Plain;
    var _stat:GeneralStat = Command;
    var _mid:MonarchId = "";
    var _gid:GeneralId = "";
    var _jk:JiCeKey = "";
    var _ti:TileIndex = 0;
    var _tile:ITile = cast null;
    var _board:IBoard = cast null;
    var _general:IGeneral = cast null;
    var _monarch:IMonarch = cast null;
    var _jice:IJiCe = cast null;
    var _match:IGameMatch = cast null;
    var _term:MatchTerminationReason = NotEnded;
    var _root:IGame = cast null;
    var _player:IPlayer = cast null;
    var _menu:IPlayerMenu = cast null;
    var _menuNode:IPlayerMenuNode = cast null;
    var _menuRow:IPlayerMenuEntry = cast null;
    var _mk:PlayerMenuKind = Move;
    var _mtk:PlayerMenuKind = TileEventPick;
    var _mjk:PlayerMenuKind = StagingSubmit;
    var _mec1:PlayerMenuKind = EmptyCityOccupySubmit;
    var _mec2:PlayerMenuKind = EmptyCityOccupyAbort;
    var _mfc1:PlayerMenuKind = FriendlyCityDispatchApply;
    var _mfc2:PlayerMenuKind = FriendlyCityVisitEnd;
    var _mhc1:PlayerMenuKind = HostileCityAttackerPick;
    var _mhc2:PlayerMenuKind = HostileCityDefenderAck;
    var _mhc3:PlayerMenuKind = HostileCityDefenderPickSubmit;
    var _mhc4:PlayerMenuKind = HostileCitySettlementAck;
    var _mv:PlayerMenuKind = VillageTrade;
    var _mvc:PlayerMenuKind = VillageConquer;
    var _fw:MenuFormWidget = Slider("f", 0, 1, 1, 0);
    var _fwm:MenuFormWidget = GeneralMultiPick("x", ([] : Array<MenuGeneralChoice>), []);
    var _ver1Game:impl_ver1.Game = cast null;
    var _ver1Match:impl_ver1.core.GameMatchCore = cast null;
    var _et:EquipmentType = Weapon;
    var _eq:IEquipment = cast null;
    var _pr:PositionRank = Soldier;
  }
}
