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

class HelloWorld {
  static function main() {
    impl_ver1.Ver1SmokeTest.run();
    debug_ver1.EmptyLevelFourPlayerLoopTest.run();
    debug_ver1.TwoPlayerJiCeStagingMoveConfirmTest.run();
    debug_ver1.TenEventTilesMenuFlowTest.run();
    debug_ver1.GeneralChestTileEventMenuTest.run();
    debug_ver1.EmptyCityVacantFormMenuTest.run();
    debug_ver1.FriendlyOwnedCityDispatchMenuTest.run();
    trace("Hello world");
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
    var _mjk:PlayerMenuKind = JiCeStagingSubmit;
    var _mec1:PlayerMenuKind = EmptyCityOccupySubmit;
    var _mec2:PlayerMenuKind = EmptyCityOccupyAbort;
    var _mfc1:PlayerMenuKind = FriendlyCityDispatchApply;
    var _mfc2:PlayerMenuKind = FriendlyCityVisitEnd;
    var _fw:MenuFormWidget = Slider("f", 0, 1, 1, 0);
    var _fwm:MenuFormWidget = GeneralMultiPick("x", ([] : Array<MenuGeneralChoice>), []);
    var _ver1Game:impl_ver1.Game = cast null;
    var _ver1Match:impl_ver1.GameMatchCore = cast null;
  }
}
