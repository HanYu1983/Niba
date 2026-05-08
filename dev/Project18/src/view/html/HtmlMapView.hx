package view.html;

import game.GameIds;
import game.TileKind;
import js.Browser;
import js.html.DivElement;
import js.html.Element;
import rx.disposables.ISubscription;
import view.EventCenter;
import view.IViewModel;
import view.UiEvent;
import view.html.HtmlTileView;

/**
 * 地圖（棋盤）顯示元件。
 *
 * 建構子只收「掛載點 elementId」，其餘資料靠 EventCenter 注入之 IViewModel 查詢。
 */
class HtmlMapView {
  final host:Element;
  final root:DivElement;
  var vmSub:Null<ISubscription> = null;
  var tileViews:Array<HtmlTileView> = [];
  var lastBoardLen:Int = -1;

  public function new(mountElementId:String) {
    var el = Browser.document.getElementById(mountElementId);
    if (el == null)
      throw 'HtmlMapView: mount element not found: "$mountElementId"';
    host = el;
    root = Browser.document.createDivElement();
    root.className = "map";
    host.appendChild(root);
    vmSub = EventCenter.viewModelSubject.subscribe(function(vm:IViewModel) {
      render(vm);
    });
    var vm = EventCenter.currentViewModel;
    if (vm != null) render(vm);
  }

  function render(vm:IViewModel):Void {
    var board = vm.board();
    if (board == null) {
      root.innerHTML = "";
      root.textContent = "(board not ready)";
      return;
    }

    // 玩家（君主）位置：tileIndex -> [monarchIds]
    var occ = new Map<Int, Array<MonarchId>>();
    for (m in vm.monarchs()) {
      var idx = m.pawnIndex();
      if (!occ.exists(idx))
        occ.set(idx, []);
      occ.get(idx).push(m.id());
    }

    // 只在 board 長度變更時重建每格 view（切換場景/新局）
    var len = board.length();
    if (len != lastBoardLen) {
      root.innerHTML = "";
      tileViews = [];
      lastBoardLen = len;
      for (i in 0...len) {
        var v = new HtmlTileView(i);
        tileViews.push(v);
        root.appendChild(v.element());
      }
    }

    // 更新每一格內容
    for (v in tileViews) {
      var i = v.tileIndex;
      var players = occ.exists(i) ? occ.get(i) : [];
      v.render(vm, players);
    }
  }

  public function element():Element
    return root;

  public function dispose():Void {
    if (vmSub != null) {
      vmSub.unsubscribe();
      vmSub = null;
    }
    tileViews = [];
    lastBoardLen = -1;
    if (root.parentElement != null)
      root.parentElement.removeChild(root);
  }
}

