package view.html;

import game.GameIds;
import game.TileKind;
import js.Browser;
import js.html.DivElement;
import js.html.Element;
import view.EventCenter;
import view.IViewModel;
import view.UiEvent;

/**
 * 地圖（棋盤）顯示元件。
 *
 * 建構子只收「掛載點 elementId」，其餘資料靠 EventCenter 注入之 IViewModel 查詢。
 */
class HtmlMapView {
  final host:Element;
  final root:DivElement;

  public function new(mountElementId:String) {
    var el = Browser.document.getElementById(mountElementId);
    if (el == null)
      throw 'HtmlMapView: mount element not found: "$mountElementId"';
    host = el;
    root = Browser.document.createDivElement();
    root.className = "map";
    host.appendChild(root);
    var vm = EventCenter.currentViewModel;
    if (vm != null)
      render(vm);
  }

  function render(vm:IViewModel):Void {
    // 清空並重建（先求簡單；之後再做 diff/patch）
    root.innerHTML = "";

    var board = vm.board();
    if (board == null) {
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

    for (i in 0...board.length()) {
      var tile = vm.tileAt(i);
      var cell = Browser.document.createDivElement();
      cell.className = "tile";
      cell.setAttribute("data-tile-index", Std.string(i));

      var kind:TileKind = tile.kind();
      var players = occ.exists(i) ? occ.get(i) : [];

      var label = '#$i ' + Std.string(kind);
      if (players.length > 0)
        label += ' @' + players.join(",");
      cell.textContent = label;

      cell.onclick = function(_) {
        EventCenter.publishEvent(UiEvent.TileClick(i));
      };

      root.appendChild(cell);
    }
  }

  public function element():Element
    return root;

  public function dispose():Void {
    if (root.parentElement != null)
      root.parentElement.removeChild(root);
  }
}

