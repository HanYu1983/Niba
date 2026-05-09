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
          case TestPage3:
            startTestPage3Match();
          case TestPage4AI:
            startTestPage4AiMatch();
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
    // Demo/測試用初始化：只在 EMPTY level 才補上手工組局
    // 其他 level（如 PROB_GEN_32）應由 Game.configureFromLevel 完整組立，避免覆蓋。
    if (levelKey == LevelKeys.EMPTY)
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

  function startTestPage3Match():Void {
    // dispose 舊 vm
    if (vm != null) {
      vm.dispose();
      vm = null;
    }
    // 目前用 EMPTY match 做容器，場景由 initTestPage3Match 組立
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    initTestPage3Match(match);
    vm = new BasicViewModel(match);
    EventCenter.publishViewModel(vm);
  }

  function startTestPage4AiMatch():Void {
    // dispose 舊 vm
    if (vm != null) {
      vm.dispose();
      vm = null;
    }
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    initTestPage4AiMatch(match);
    vm = new BasicViewModel(match);
    EventCenter.publishViewModel(vm);
  }

  // NOTE(router-command): 目前 ChangePage(TestPage2) 會「重建 match」並 publish 新 VM。
  // 後續如果要支持更多測試頁/關卡：
  // - 建議引入一個 `SceneKey`（或直接用 LevelKeys）統一描述「要載入的場景」
  // - AppController 只做 key → buildMatch 的 mapping（避免 switch 越來越長）
  //
  // NOTE(router-command): 若未來要支持「同場景內切換 Inspector/Debug」這種純 UI 導航，
  // ChangePage 應只改 ViewState，不重建 match；而 NewGame/ResetGame/LoadScene 才重建 match。

  static function initDemoMatch(match:IGameMatch):Void {
    var tiles:Array<ITile> = [];
    for (i in 0...12)
      tiles.push(match.createTile(i, TileKind.City));
    match.createBoard(tiles);

    match.createMonarch("m-a", 0, 0, 500, 80);
    match.createMonarch("m-b", 1, 5, 500, 80);
    match.linkPlayerToMonarch("m-a", match.createPlayer("m-a", false));
    match.linkPlayerToMonarch("m-b", match.createPlayer("m-b", true));

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
    match.linkPlayerToMonarch("m-a", match.createPlayer("m-a", false));
    match.linkPlayerToMonarch("m-b", match.createPlayer("m-b", false));

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

  /**
   * UI 測試頁3：計策（JiCe）測試場景。
   * - 給玩家一組常用計策（含指定玩家/指定格子/指定武將）
   * - 小地圖混合 City/Plain/Event/Resource，便於測試移動前/移動後策略限制
   */
  static function initTestPage3Match(match:IGameMatch):Void {
    var kinds:Array<TileKind> = [
      Start,   // 0
      Plain,   // 1
      City,    // 2
      Resource,// 3
      Plain,   // 4
      Event,   // 5
      City,    // 6
      Plain,   // 7
    ];
    var tiles:Array<ITile> = [];
    for (i in 0...kinds.length)
      tiles.push(match.createTile(i, kinds[i]));
    match.createBoard(tiles);

    match.createMonarch("m-a", 0, 0, 800, 200);
    match.createMonarch("m-b", 1, 6, 800, 200);
    match.linkPlayerToMonarch("m-a", match.createPlayer("m-a", false));
    match.linkPlayerToMonarch("m-b", match.createPlayer("m-b", false));

    match.createGeneral("g-a-1", "m-a", 60, 40, 55, 70);
    match.createGeneral("g-a-2", "m-a", 30, 80, 25, 20);
    match.createGeneral("g-a-3", "m-a", 45, 35, 90, 30);
    match.createGeneral("g-b-1", "m-b", 70, 60, 30, 40);
    match.createGeneral("g-b-2", "m-b", 20, 25, 80, 75);

    // 城池屬主：一城我方、一城敵方（方便測試「移動後」策略的目標限制）
    match.forceSetCityOwner(2, "m-a");
    match.forceSetCityOwner(6, "m-b");

    // 綁定負面事件（可規避），方便測試「移動後策略」與「事件規避」並存
    match.forceBindTileEvent(5, new GranaryFireAvoidableTileEvent(match, 120));

    // 給攻方（m-a）一組測試計策
    match.createJiCe("jice_dissension", "m-a"); // 指定玩家（PreMove only）
    match.createJiCe("jice_rumor", "m-a");      // 指定玩家（PreMove only）
    match.createJiCe("jice_fire", "m-a");       // 指定格子（Pre+Post）
    match.createJiCe("jice_farm", "m-a");       // 指定格子（Pre+Post）
    match.createJiCe("jice_inspire", "m-a");    // 指定武將（PreMove）

    // 提示：讓玩家一進來就知道怎麼測
    var core = cast(match, GameMatchCore);
    core.pushOutboxPlain(
      "m-a",
      "測試頁3：計策測試",
      game.PopupPayload.Plain(
        "目標：測試策略（移動前/移動後）與計策暫存流程。\n\n"
        + "建議步驟：\n"
        + "1) 右側『Menu』→『本回合』→『策略（移動前）』：測試指定玩家/格子/武將類計策。\n"
        + "2) 點『移動』後（仍在落地前窗口）再用『策略（移動後）』：應只能指定『所站格子』。\n"
        + "3) 進入暫存後，可用『取消（返回）』退出 staging。\n"
      ),
      "test3-jice"
    );
  }

  /**
   * UI 測試頁4：AI 測試場景。
   * - 4 位君主皆標記為 AI 席位；選單繪製後會自動排程 AiStep
   */
  static function initTestPage4AiMatch(match:IGameMatch):Void {
    var kinds:Array<TileKind> = [
      Start,   // 0
      Plain,   // 1
      City,    // 2
      Plain,   // 3
      Village, // 4
      Plain,   // 5
      Resource,// 6
      Plain,   // 7
      Event,   // 8
      Plain,   // 9
      City,    // 10
      Plain,   // 11
    ];
    var tiles:Array<ITile> = [];
    for (i in 0...kinds.length)
      tiles.push(match.createTile(i, kinds[i]));
    match.createBoard(tiles);

    // 4 君主分散起點
    match.createMonarch("m-a", 0, 0, 800, 400);
    match.createMonarch("m-b", 1, 3, 800, 400);
    match.createMonarch("m-c", 2, 6, 800, 400);
    match.createMonarch("m-d", 3, 9, 800, 400);
    match.linkPlayerToMonarch("m-a", match.createPlayer("m-a", true));
    match.linkPlayerToMonarch("m-b", match.createPlayer("m-b", true));
    match.linkPlayerToMonarch("m-c", match.createPlayer("m-c", true));
    match.linkPlayerToMonarch("m-d", match.createPlayer("m-d", true));

    // 給每人 3 武將（能力分布刻意不同，便於之後加權）
    match.createGeneral("g-a-1", "m-a", 60, 40, 55, 70);
    match.createGeneral("g-a-2", "m-a", 30, 80, 25, 20);
    match.createGeneral("g-a-3", "m-a", 45, 35, 90, 30);

    match.createGeneral("g-b-1", "m-b", 70, 60, 30, 40);
    match.createGeneral("g-b-2", "m-b", 20, 25, 80, 75);
    match.createGeneral("g-b-3", "m-b", 55, 55, 55, 55);

    match.createGeneral("g-c-1", "m-c", 40, 70, 40, 30);
    match.createGeneral("g-c-2", "m-c", 75, 25, 45, 55);
    match.createGeneral("g-c-3", "m-c", 35, 35, 90, 25);

    match.createGeneral("g-d-1", "m-d", 50, 50, 20, 80);
    match.createGeneral("g-d-2", "m-d", 25, 85, 25, 25);
    match.createGeneral("g-d-3", "m-d", 65, 35, 65, 35);

    // 城池屬主：交錯，讓領地互動容易出現
    match.forceSetCityOwner(2, "m-a");
    match.forceSetCityOwner(10, "m-b");

    // 綁定可規避事件，方便測 AI 對 pending/選單分支的處理
    match.forceBindTileEvent(8, new GranaryFireAvoidableTileEvent(match, 120));

    // 避免糧食維持費導致兵力快速歸零 → 提早征服勝利（UI 看起來像 AI「卡住」）
    // 用現有 monarchs() 迭代，避免場景/重開造成 id 不一致時拋錯。
    for (m in match.monarchs())
      match.forceGrantMonarchGrain(m.id(), 5000);

    var core = cast(match, GameMatchCore);
    core.pushOutboxPlain(
      "m-a",
      "測試頁4：AI 測試",
      game.PopupPayload.Plain(
        "目標：測試 aiSuggest + AI 自動操作是否能推進回合並收束。\n\n"
        + "本場四名君主皆為 AI 席位：載入選單後會自動排程 AiStep（無需手動按鈕）。\n"
        + "可觀察是否自動完成 Move→落地→互動→ConfirmDone 並輪轉四家。\n"
      ),
      "test4-ai"
    );
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

