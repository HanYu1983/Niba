package view;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.ITile;
import game.LevelKeys;
import game.TileKind;
import impl_ver1.core.GameMatchCore;
import rx.disposables.ISubscription;
import view.BasicViewModel;
import view.EventCenter;
import view.UiEvent;

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
    sub = EventCenter.onEventSubject.subscribe(onUiEvent);
  }

  function onUiEvent(ev:UiEvent):Void {
    switch ev {
      case NewGame(levelKey):
        currentLevelKey = levelKey;
        startNewMatch(levelKey);
      case ResetGame:
        startNewMatch(currentLevelKey);
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

    vm = new BasicViewModel(cast match);
    EventCenter.publishViewModel(vm);
  }

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

