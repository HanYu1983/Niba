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
import view.BasicViewModel;
import view.EventCenter;
import view.html.HtmlInfoPanelView;
import view.html.HtmlActiveMenuView;
import view.html.HtmlMapView;
import view.html.HtmlPlayersView;

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
    trace("Hello world");

    // --- HTML view demo ---
    // 建立一個最小 demo match，注入 ViewModel 並建出地圖與玩家組件。
    var game:IGame = new impl_ver1.Game();
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    var tiles:Array<ITile> = [];
    for (i in 0...12)
      tiles.push(match.createTile(i, City));
    match.createBoard(tiles);

    // 君主基本資源（兵力/糧食）
    match.createMonarch("m-a", 0, 0, 500, 80);
    match.createMonarch("m-b", 1, 5, 500, 80);

    // 每位君主各 3 名武將
    match.createGeneral("g-a-1", "m-a", 1, 40, 1, 1);
    match.createGeneral("g-a-2", "m-a", 1, 20, 1, 1);
    match.createGeneral("g-a-3", "m-a", 1, 10, 1, 1);
    match.createGeneral("g-b-1", "m-b", 1, 40, 1, 1);
    match.createGeneral("g-b-2", "m-b", 1, 20, 1, 1);
    match.createGeneral("g-b-3", "m-b", 1, 10, 1, 1);

    // 所有格位皆為城池：先交錯標記屬主
    for (i in 0...12)
      match.forceSetCityOwner(i, (i % 2 == 0) ? "m-a" : "m-b");

    var vm = new BasicViewModel(cast match);
    EventCenter.publishViewModel(vm);

    // 掛載點由 index.htm 提供
    new HtmlInfoPanelView("app-info");
    new HtmlActiveMenuView("app-menu");
    new HtmlMapView("app-map");
    new HtmlPlayersView("app-players");
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
