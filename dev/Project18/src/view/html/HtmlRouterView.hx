package view.html;

import game.GameIds;
import js.Browser;
import js.html.ButtonElement;
import js.html.DivElement;
import js.html.Element;
import rx.disposables.ISubscription;
import view.EventCenter;
import view.IViewModel;
import view.UiCommand;
import view.UiEvent;
import view.ViewState;
import game.LevelKeys;

/**
 * HTML Router（狀態模式但不拆 page 類）：
 * - 常駐建立主要 UI 元件（map/menu/info/players/popup）
 * - 以 overlay 方式呈現 Inspector / Debug 等「換頁狀態」
 * - 集中管理訂閱與 dispose，避免重複訂閱導致事件/渲染爆炸
 */
class HtmlRouterView {
  var state:ViewState = Main;

  final info:HtmlInfoPanelView;
  final menu:HtmlActiveMenuView;
  final map:HtmlMapView;
  final players:HtmlPlayersView;
  final popup:HtmlPopupView;

  final overlayHost:Element;
  final bar:DivElement;
  final overlay:DivElement;

  var vmSub:Null<ISubscription> = null;
  var evSub:Null<ISubscription> = null;
  var cmdSub:Null<ISubscription> = null;

  public function new() {
    // 主視圖常駐
    info = new HtmlInfoPanelView("app-info");
    menu = new HtmlActiveMenuView("app-menu");
    map = new HtmlMapView("app-map");
    players = new HtmlPlayersView("app-players");
    popup = new HtmlPopupView("app-popup");

    overlayHost = ensureDiv("app-overlay");
    bar = Browser.document.createDivElement();
    bar.className = "router-bar";
    overlayHost.appendChild(bar);
    overlay = Browser.document.createDivElement();
    overlay.className = "router-overlay";
    overlayHost.appendChild(overlay);
    renderBar();

    // 事件驅動導航：點格子/點玩家 → Inspector
    evSub = EventCenter.eventSubject.subscribe(function(ev:UiEvent) {
      switch ev {
        case TileClick(i):
          setState(InspectorTile(i));
        case PlayerClick(mid):
          setState(InspectorMonarch(mid));
        default:
      }
    });

    // 指令：外部可要求換頁
    cmdSub = EventCenter.commandSubject.subscribe(function(cmd:UiCommand) {
      switch cmd {
        case ChangePage(next):
          setState(next);
        default:
      }
    });

    vmSub = EventCenter.viewModelSubject.subscribe(function(vm:IViewModel) {
      renderOverlay(vm);
    });

    // 初次渲染
    var vm = EventCenter.currentViewModel;
    if (vm != null)
      renderOverlay(vm);
  }

  function ensureDiv(id:String):Element {
    var el = Browser.document.getElementById(id);
    if (el != null)
      return el;
    var d = Browser.document.createDivElement();
    d.id = id;
    Browser.document.body.appendChild(d);
    return d;
  }

  public function setState(next:ViewState):Void {
    state = next;
    var vm = EventCenter.currentViewModel;
    if (vm != null)
      renderOverlay(vm);
  }

  function renderBar():Void {
    bar.innerHTML = "";
    var btnMain:ButtonElement = Browser.document.createButtonElement();
    btnMain.className = "ui-btn";
    btnMain.type = "button";
    btnMain.textContent = "主畫面";
    btnMain.onclick = function(_) setState(Main);
    bar.appendChild(btnMain);

    var btnDebug:ButtonElement = Browser.document.createButtonElement();
    btnDebug.className = "ui-btn";
    btnDebug.type = "button";
    btnDebug.textContent = "Debug";
    btnDebug.onclick = function(_) setState(Debug);
    bar.appendChild(btnDebug);

    var btnP2:ButtonElement = Browser.document.createButtonElement();
    btnP2.className = "ui-btn";
    btnP2.type = "button";
    btnP2.textContent = "測試頁2";
    // 以指令要求 controller 建立「頁2場景」，並同步切換 router state
    btnP2.onclick = function(_) EventCenter.publishCommand(UiCommand.ChangePage(ViewState.TestPage2));
    bar.appendChild(btnP2);

    var btnP3:ButtonElement = Browser.document.createButtonElement();
    btnP3.className = "ui-btn";
    btnP3.type = "button";
    btnP3.textContent = "測試頁3";
    // 以指令要求 controller 建立「頁3場景」（計策測試），並同步切換 router state
    btnP3.onclick = function(_) EventCenter.publishCommand(UiCommand.ChangePage(ViewState.TestPage3));
    bar.appendChild(btnP3);

    // TODO(router-ui): 「測試頁2」目前用 ChangePage(TestPage2) 觸發 controller 重建 match。
    // 若後續要新增更多測試場景，建議改成下拉選單：
    // - 選擇 SceneKey/LevelKey 後送 `UiCommand.NewGame(key)` 或新增 `UiCommand.LoadScene(sceneKey)`
    // - ChangePage 保持純 UI 導航（Main/Debug/Inspector...）

    var btnNew:ButtonElement = Browser.document.createButtonElement();
    btnNew.className = "ui-btn";
    btnNew.type = "button";
    btnNew.textContent = "新局";
    btnNew.onclick = function(_) EventCenter.publishCommand(UiCommand.NewGame(LevelKeys.EMPTY));
    bar.appendChild(btnNew);

    var btnReset:ButtonElement = Browser.document.createButtonElement();
    btnReset.className = "ui-btn";
    btnReset.type = "button";
    btnReset.textContent = "重開";
    btnReset.onclick = function(_) EventCenter.publishCommand(UiCommand.ResetGame);
    bar.appendChild(btnReset);
  }

  function renderOverlay(vm:IViewModel):Void {
    overlay.innerHTML = "";

    switch state {
      case Main:
        overlay.style.display = "none";
        return;
      case TestPage2:
        // TestPage2 是「場景切換」而非覆蓋式頁面，因此不顯示 overlay
        overlay.style.display = "none";
        return;
      case TestPage3:
        // TestPage3 是「場景切換」而非覆蓋式頁面，因此不顯示 overlay
        overlay.style.display = "none";
        return;
      default:
        overlay.style.display = "block";
    }

    var head = Browser.document.createDivElement();
    head.className = "overlay-head";
    var title = Browser.document.createDivElement();
    title.className = "ui-title";
    title.textContent = switch state {
      case Debug: "Debug";
      case InspectorTile(_), InspectorMonarch(_): "Inspector";
      case TestPage2: "TestPage2";
      case TestPage3: "TestPage3";
      case Main: "Main";
    };
    head.appendChild(title);

    var back:ButtonElement = Browser.document.createButtonElement();
    back.className = "ui-btn";
    back.type = "button";
    back.textContent = "返回主畫面";
    back.onclick = function(_) setState(Main);
    head.appendChild(back);

    overlay.appendChild(head);

    var body = Browser.document.createDivElement();
    body.className = "overlay-body";
    overlay.appendChild(body);

    switch state {
      case Debug:
        body.textContent = "（debug view placeholder）";
      case TestPage2:
        body.textContent = "（TestPage2：此狀態不顯示 overlay，若看到此文字代表 renderOverlay 分支未被短路）";
      case TestPage3:
        body.textContent = "（TestPage3：此狀態不顯示 overlay，若看到此文字代表 renderOverlay 分支未被短路）";
      case InspectorTile(ti):
        var t = vm.tileAt(ti);
        var terrain = vm.forceGetTileTerrain(ti);
        var growth = vm.forceGetTileGrowth(ti);
        var lines:Array<String> = [];
        lines.push('格 $ti｜${Std.string(t.kind())}');
        lines.push('地形｜${Std.string(terrain)}');
        lines.push('成長｜金 ${growth.gold}｜糧 ${growth.grain}｜兵 ${growth.troops}');
        switch t.kind() {
          case City:
            var owner = vm.forceGetCityOwner(ti);
            var lvl = vm.forceGetCityLevel(ti);
            var gold = vm.forceGetCityStoredGold(ti);
            var grain = vm.forceGetCityStoredGrain(ti);
            var troops = vm.forceGetCityStoredTroops(ti);
            lines.push('屬主｜' + (owner != null ? owner : "（無）"));
            lines.push('等級｜${Std.string(lvl)}');
            lines.push('資源庫｜金 ${gold}｜糧 ${grain}｜兵 ${troops}');
          case Village:
            var owner = vm.forceGetVillageOwner(ti);
            var lvl = vm.forceGetVillageLevel(ti);
            var gold = vm.forceGetVillageStoredGold(ti);
            var grain = vm.forceGetVillageStoredGrain(ti);
            var troops = vm.forceGetVillageStoredTroops(ti);
            lines.push('屬主｜' + (owner != null ? owner : "（無）"));
            lines.push('等級｜${Std.string(lvl)}');
            lines.push('資源庫｜金 ${gold}｜糧 ${grain}｜兵 ${troops}');
          default:
        }
        body.textContent = lines.join("\n");
      case InspectorMonarch(mid):
        var m = vm.monarchById(mid);
        var lines:Array<String> = [];
        lines.push('主公 $mid');
        lines.push('位置｜${m.pawnIndex()}');
        lines.push('隨身｜兵 ${m.troops()}｜糧 ${m.grain()}｜金 ${m.gold()}');

        var cityN = 0;
        var villageN = 0;
        var stockGold = 0;
        var stockGrain = 0;
        var stockTroops = 0;
        var len = vm.board().length();
        for (i in 0...len) {
          var t = vm.tileAt(i);
          switch t.kind() {
            case City:
              var owner = vm.forceGetCityOwner(i);
              if (owner != null && owner == mid) {
                cityN++;
                stockGold += vm.forceGetCityStoredGold(i);
                stockGrain += vm.forceGetCityStoredGrain(i);
                stockTroops += vm.forceGetCityStoredTroops(i);
              }
            case Village:
              var owner = vm.forceGetVillageOwner(i);
              if (owner != null && owner == mid) {
                villageN++;
                stockGold += vm.forceGetVillageStoredGold(i);
                stockGrain += vm.forceGetVillageStoredGrain(i);
                stockTroops += vm.forceGetVillageStoredTroops(i);
              }
            default:
          }
        }
        lines.push('領地｜城池 ${cityN}｜村落 ${villageN}');
        lines.push('領地庫｜金 ${stockGold}｜糧 ${stockGrain}｜兵 ${stockTroops}');
        lines.push('總計｜金 ${m.gold() + stockGold}｜糧 ${m.grain() + stockGrain}｜兵 ${m.troops() + stockTroops}');
        body.textContent = lines.join("\n");
      case Main:
    }
  }

  public function dispose():Void {
    // 依序釋放訂閱（避免 unsubscribe 後又被 render 觸發）
    if (vmSub != null) {
      vmSub.unsubscribe();
      vmSub = null;
    }
    if (evSub != null) {
      evSub.unsubscribe();
      evSub = null;
    }
    if (cmdSub != null) {
      cmdSub.unsubscribe();
      cmdSub = null;
    }

    info.dispose();
    menu.dispose();
    map.dispose();
    players.dispose();
    popup.dispose();

    if (bar.parentElement != null)
      bar.parentElement.removeChild(bar);
    if (overlay.parentElement != null)
      overlay.parentElement.removeChild(overlay);
  }
}

