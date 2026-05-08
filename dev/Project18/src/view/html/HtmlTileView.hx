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
 * 單一格子（Tile）視圖元件。
 *
 * - 由 HtmlMapView 負責建立/銷毀與呼叫 render
 * - 本元件不訂閱 EventCenter（避免 N 格訂閱造成成本）；只處理自身 DOM 與 click 事件
 */
class HtmlTileView {
  public final tileIndex:TileIndex;
  final root:DivElement;

  public function new(tileIndex:TileIndex) {
    this.tileIndex = tileIndex;
    root = Browser.document.createDivElement();
    root.className = "tile";
    root.setAttribute("data-tile-index", Std.string(tileIndex));
    root.onclick = function(_) {
      EventCenter.publishEvent(UiEvent.TileClick(tileIndex));
    };
  }

  public function element():Element
    return root;

  public function render(vm:IViewModel, occupants:Array<MonarchId>):Void {
    var tile = vm.tileAt(tileIndex);
    var kind:TileKind = tile.kind();

    root.innerHTML = "";
    root.className = "tile kind-" + Std.string(kind);

    var top = Browser.document.createDivElement();
    top.className = "tile-top";

    var idx = Browser.document.createDivElement();
    idx.className = "tile-index";
    idx.textContent = '#${tileIndex}';
    top.appendChild(idx);

    var k = Browser.document.createDivElement();
    k.className = "tile-kind";
    k.textContent = Std.string(kind);
    top.appendChild(k);

    root.appendChild(top);

    var occBox = Browser.document.createDivElement();
    occBox.className = "tile-occupants";
    if (occupants != null && occupants.length > 0) {
      for (pid in occupants) {
        var m = vm.monarchById(pid);
        var seat = m != null ? m.seat() : 0;
        var tone = switch seat {
          case 0: "p0";
          case 1: "p1";
          case 2: "p2";
          case 3: "p3";
          default: "p0";
        };
        var b = Browser.document.createSpanElement();
        b.className = "ui-badge";
        b.setAttribute("data-tone", tone);
        b.textContent = pid;
        occBox.appendChild(b);
      }
    } else {
      var none = Browser.document.createSpanElement();
      none.className = "ui-label";
      none.textContent = "（空）";
      occBox.appendChild(none);
    }
    root.appendChild(occBox);

    // 依格子類型顯示相應數值（可視化 debug 用；正式 UI 之後可再調整）
    var stats = Browser.document.createDivElement();
    stats.className = "tile-stats";

    // 通用：地形 + 成長
    var terrain = vm.forceGetTileTerrain(tileIndex);
    var growth = vm.forceGetTileGrowth(tileIndex);
    stats.appendChild(kv("地形", Std.string(terrain)));
    stats.appendChild(kv("成長", '${growth.gold}/${growth.grain}/${growth.troops}'));

    switch kind {
      case City:
        var owner = vm.forceGetCityOwner(tileIndex);
        var lvl = vm.forceGetCityLevel(tileIndex);
        stats.appendChild(kv("屬主", owner != null ? owner : "（無）"));
        stats.appendChild(kv("等級", Std.string(lvl)));
        stats.appendChild(kv("金庫", Std.string(vm.forceGetCityStoredGold(tileIndex))));
        stats.appendChild(kv("糧庫", Std.string(vm.forceGetCityStoredGrain(tileIndex))));
        stats.appendChild(kv("兵庫", Std.string(vm.forceGetCityStoredTroops(tileIndex))));
      case Village:
        var owner = vm.forceGetVillageOwner(tileIndex);
        var lvl = vm.forceGetVillageLevel(tileIndex);
        stats.appendChild(kv("屬主", owner != null ? owner : "（無）"));
        stats.appendChild(kv("等級", Std.string(lvl)));
        stats.appendChild(kv("金庫", Std.string(vm.forceGetVillageStoredGold(tileIndex))));
        stats.appendChild(kv("糧庫", Std.string(vm.forceGetVillageStoredGrain(tileIndex))));
        stats.appendChild(kv("兵庫", Std.string(vm.forceGetVillageStoredTroops(tileIndex))));
      default:
        // 其他格子目前文件未規定要顯示的數值；先只顯示通用資訊
    }

    root.appendChild(stats);
  }

  static function kv(k:String, v:String):Element {
    var row = Browser.document.createDivElement();
    row.className = "tile-kv";
    row.textContent = k + " " + v;
    return row;
  }
}

