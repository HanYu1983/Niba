package view.html;

import game.GameIds;
import js.Browser;
import js.html.DivElement;
import js.html.Element;
import rx.disposables.ISubscription;
import view.EventCenter;
import view.IViewModel;
import view.UiEvent;

/**
 * 單一玩家（君主）資訊顯示元件。
 *
 * 建構子只收 monarchId（或 playerId=monarchId），其餘資料自行向 IViewModel 查詢。
 */
class HtmlPlayerView {
  final monarchId:MonarchId;
  final host:Element;
  final root:DivElement;
  var vmSub:Null<ISubscription> = null;

  public function new(mountElementId:String, monarchId:MonarchId) {
    this.monarchId = monarchId;
    var el = Browser.document.getElementById(mountElementId);
    if (el == null)
      throw 'HtmlPlayerView: mount element not found: "$mountElementId"';
    host = el;
    root = Browser.document.createDivElement();
    root.className = "player";
    root.setAttribute("data-monarch-id", monarchId);
    host.appendChild(root);

    root.onclick = function(_) {
      EventCenter.publishEvent(UiEvent.PlayerClick(monarchId));
    };
    vmSub = EventCenter.viewModelSubject.subscribe(function(vm:IViewModel) {
      render(vm);
    });
    var vm = EventCenter.currentViewModel;
    if (vm != null) render(vm);
  }

  function render(vm:IViewModel):Void {
    var m = vm.monarchById(monarchId);
    root.innerHTML = "";

    var head = Browser.document.createDivElement();
    head.className = "player-head";

    var name = Browser.document.createDivElement();
    name.className = "player-name";
    name.textContent = m.id();
    head.appendChild(name);

    var seat = Browser.document.createSpanElement();
    seat.className = "ui-badge";
    seat.textContent = "席位 " + m.seat();
    head.appendChild(seat);

    root.appendChild(head);

    var meta = Browser.document.createDivElement();
    meta.className = "player-meta";
    meta.appendChild(badge("位置", Std.string(m.pawnIndex()), null));
    meta.appendChild(badge("兵力", Std.string(m.troops()), "red"));
    meta.appendChild(badge("糧食", Std.string(m.grain()), "gold"));
    meta.appendChild(badge("金錢", Std.string(m.gold()), null));
    root.appendChild(meta);
  }

  static function badge(k:String, v:String, tone:Null<String>):Element {
    var s = Browser.document.createSpanElement();
    s.className = "ui-badge";
    if (tone != null) s.setAttribute("data-tone", tone);
    s.textContent = k + " " + v;
    return s;
  }

  public function element():Element
    return root;

  public function dispose():Void {
    if (vmSub != null) {
      vmSub.unsubscribe();
      vmSub = null;
    }
    if (root.parentElement != null)
      root.parentElement.removeChild(root);
  }
}

