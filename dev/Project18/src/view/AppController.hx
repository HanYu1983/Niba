package view;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.ITile;
import game.LevelKeys;
import game.TileKind;
import debug_ver1.EpidemicAvoidableTileEvent;
import debug_ver1.GranaryFireAvoidableTileEvent;
import impl_ver1.core.GameMatchCore;
import rx.disposables.ISubscription;
import view.BasicViewModel;
import view.EventCenter;
import view.UiCommand;
import view.ViewState;

/**
 * View 層協調者：
 * - 訂閱 UiEvent（NewGame/ResetGame 等意圖）
 * - 負責建立/替換 IGameMatch
 * - 將新的 BasicViewModel publish 到 EventCenter
 */
class AppController {
  final game:IGame;
  var currentLevelKey:String = LevelKeys.EMPTY;
  var vm:Null<BasicViewModel> = null;
  var sub:Null<ISubscription> = null;

  public function new(game:IGame) {
    this.game = game;
    sub = EventCenter.commandSubject.subscribe(onUiCommand);
  }

  function onUiCommand(cmd:UiCommand):Void {
    switch cmd {
      case NewGame(levelKey):
        currentLevelKey = levelKey;
        startNewMatch(levelKey);
      case ResetGame:
        startNewMatch(currentLevelKey);
      case ChangePage(next):
        switch next {
          case TestPage2:
            startTestPage2Match();
          default:
        }
      default:
    }
  }

  function startNewMatch(levelKey:String):Void {
    // dispose 舊 vm（解除其對 EventCenter 的訂閱）
    if (vm != null) {
      vm.dispose();
      vm = null;
    }

    var match:IGameMatch = game.createGameMatch(levelKey);
    // Demo/測試用初始化：先保留既有 HelloWorld 的內容
    initDemoMatch(match);

    vm = new BasicViewModel(match);
    EventCenter.publishViewModel(vm);
  }

  function startTestPage2Match():Void {
    // dispose 舊 vm
    if (vm != null) {
      vm.dispose();
      vm = null;
    }
    // 目前用 EMPTY match 做容器，場景由 initTestPage2Match 組立
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    initTestPage2Match(match);
    vm = new BasicViewModel(match);
    EventCenter.publishViewModel(vm);
  }

  // TODO(router-command): 目前 ChangePage(TestPage2) 會「重建 match」並 publish 新 VM。
  // 後續如果要支持更多測試頁/關卡：
  // - 建議引入一個 `SceneKey`（或直接用 LevelKeys）統一描述「要載入的場景」
  // - AppController 只做 key → buildMatch 的 mapping（避免 switch 越來越長）
  //
  // TODO(router-command): 若未來要支持「同場景內切換 Inspector/Debug」這種純 UI 導航，
  // ChangePage 應只改 ViewState，不重建 match；而 NewGame/ResetGame/LoadScene 才重建 match。

  static function initDemoMatch(match:IGameMatch):Void {
    var tiles:Array<ITile> = [];
    for (i in 0...12)
      tiles.push(match.createTile(i, TileKind.City));
    match.createBoard(tiles);

    match.createMonarch("m-a", 0, 0, 500, 80);
    match.createMonarch("m-b", 1, 5, 500, 80);

    match.createGeneral("g-a-1", "m-a", 1, 40, 1, 1);
    match.createGeneral("g-a-2", "m-a", 1, 20, 1, 1);
    match.createGeneral("g-a-3", "m-a", 1, 10, 1, 1);
    match.createGeneral("g-b-1", "m-b", 1, 40, 1, 1);
    match.createGeneral("g-b-2", "m-b", 1, 20, 1, 1);
    match.createGeneral("g-b-3", "m-b", 1, 10, 1, 1);

    // 裝備 demo
    var core = cast(match, GameMatchCore);
    core.forceEquipWeaponByName("g-a-1", "eq-a-1", "村正");
    core.forceEquipWeaponByName("g-a-2", "eq-a-2", "長槍");
    core.forceEquipWeaponByName("g-b-1", "eq-b-1", "青龍偃月刀");

    for (i in 0...12)
      match.forceSetCityOwner(i, (i % 2 == 0) ? "m-a" : "m-b");
  }

  /**
   * UI 測試頁2：在同一張小地圖放入多種 TileKind，並綁定事件，便於手動點選/操作。
   */
  static function initTestPage2Match(match:IGameMatch):Void {
    // 16 格環：混合 Start/Resource/Event/General/Shop/Village/City 等
    var kinds:Array<TileKind> = [
      Start,   // 0
      Plain,   // 1
      Resource,// 2
      Event,   // 3
      General, // 4
      Shop,    // 5
      Village, // 6
      City,    // 7
      Plain,   // 8
      Event,   // 9
      City,    // 10
      Resource,// 11
      Plain,   // 12
      Shop,    // 13
      General, // 14
      Plain,   // 15
    ];
    var tiles:Array<ITile> = [];
    for (i in 0...kinds.length)
      tiles.push(match.createTile(i, kinds[i]));
    match.createBoard(tiles);

    // 兩位君主放在不同區塊，方便觀察占位 badge
    match.createMonarch("m-a", 0, 0, 800, 200);
    match.createMonarch("m-b", 1, 7, 800, 200);

    // 武將：給足夠 roster 以測試商店裝備、事件規避、資源加成等
    match.createGeneral("g-a-1", "m-a", 60, 40, 55, 70);
    match.createGeneral("g-a-2", "m-a", 30, 80, 25, 20);
    match.createGeneral("g-a-3", "m-a", 45, 35, 90, 30);
    match.createGeneral("g-b-1", "m-b", 70, 60, 30, 40);
    match.createGeneral("g-b-2", "m-b", 20, 25, 80, 75);
    match.createGeneral("g-b-3", "m-b", 55, 55, 55, 55);

    // 裝備 demo
    var core = cast(match, GameMatchCore);
    core.forceEquipWeaponByName("g-a-1", "eq-a-1", "村正");
    core.forceEquipWeaponByName("g-b-2", "eq-b-2", "青龍偃月刀");

    // 城池屬主交錯
    match.forceSetCityOwner(7, "m-b");
    match.forceSetCityOwner(10, "m-a");

    // 綁定負面事件（可規避）：讓 UI 可直接測「規避→倍率→事件結算」
    match.forceBindTileEvent(3, new GranaryFireAvoidableTileEvent(match, 120));
    match.forceBindTileEvent(9, new EpidemicAvoidableTileEvent(match));
  }

  public function dispose():Void {
    if (sub != null) {
      sub.unsubscribe();
      sub = null;
    }
    if (vm != null) {
      vm.dispose();
      vm = null;
    }
  }
}

