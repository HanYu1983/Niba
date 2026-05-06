package view.html;

import game.GameIds;
import js.Browser;
import js.html.ButtonElement;
import js.html.DivElement;
import js.html.Element;
import rx.disposables.ISubscription;
import view.EventCenter;
import view.IViewModel;
import view.UiEvent;
import view.ViewState;

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
  final overlay:DivElement;

  var vmSub:Null<ISubscription> = null;
  var evSub:Null<ISubscription> = null;

  public function new() {
    // 主視圖常駐
    info = new HtmlInfoPanelView("app-info");
    menu = new HtmlActiveMenuView("app-menu");
    map = new HtmlMapView("app-map");
    players = new HtmlPlayersView("app-players");
    popup = new HtmlPopupView("app-popup");

    overlayHost = ensureDiv("app-overlay");
    overlay = Browser.document.createDivElement();
    overlay.className = "router-overlay";
    overlayHost.appendChild(overlay);

    // 事件驅動導航：點格子/點玩家 → Inspector
    evSub = EventCenter.onEventSubject.subscribe(function(ev:UiEvent) {
      switch ev {
        case TileClick(i):
          setState(InspectorTile(i));
        case PlayerClick(mid):
          setState(InspectorMonarch(mid));
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

  function renderOverlay(vm:IViewModel):Void {
    overlay.innerHTML = "";

    switch state {
      case Main:
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
      case InspectorTile(ti):
        var t = vm.tileAt(ti);
        body.textContent = '格 $ti｜${Std.string(t.kind())}';
      case InspectorMonarch(mid):
        var m = vm.monarchById(mid);
        body.textContent = '主公 $mid｜位置 ${m.pawnIndex()}｜兵 ${m.troops()}｜糧 ${m.grain()}｜金 ${m.gold()}';
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

    info.dispose();
    menu.dispose();
    map.dispose();
    players.dispose();
    popup.dispose();

    if (overlay.parentElement != null)
      overlay.parentElement.removeChild(overlay);
  }
}

