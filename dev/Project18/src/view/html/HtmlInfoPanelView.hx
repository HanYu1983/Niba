package view.html;

import js.Browser;
import js.html.DivElement;
import js.html.Element;
import rx.disposables.ISubscription;
import view.EventCenter;
import view.IViewModel;

/**
 * 資訊面板：顯示當前玩家（activeMonarch）資訊與回合數。
 *
 * 建構子只收掛載點 id；資料由 EventCenter.currentViewModel 查詢。
 */
class HtmlInfoPanelView {
  final host:Element;
  final root:DivElement;
  var vmSub:Null<ISubscription> = null;

  public function new(mountElementId:String) {
    var el = Browser.document.getElementById(mountElementId);
    if (el == null)
      throw 'HtmlInfoPanelView: mount element not found: "$mountElementId"';
    host = el;
    root = Browser.document.createDivElement();
    root.className = "info-panel";
    host.appendChild(root);

    vmSub = EventCenter.viewModelSubject.subscribe(function(vm:IViewModel) {
      render(vm);
    });
    var vm = EventCenter.currentViewModel;
    if (vm != null)
      render(vm);
  }

  function render(vm:IViewModel):Void {
    var a = vm.activeMonarch();
    root.innerHTML = "";

    var head = Browser.document.createDivElement();
    head.className = "info-row";
    var title = Browser.document.createDivElement();
    title.className = "ui-title";
    title.textContent = "資訊";
    head.appendChild(title);
    var round = Browser.document.createSpanElement();
    round.className = "ui-badge";
    round.setAttribute("data-tone", "gold");
    round.textContent = "回合 " + vm.roundNumber();
    head.appendChild(round);
    root.appendChild(head);

    var stats = Browser.document.createDivElement();
    stats.className = "info-stats";
    stats.appendChild(badge("主公", a.id(), null));
    stats.appendChild(badge("席位", Std.string(a.seat()), null));
    stats.appendChild(badge("位置", Std.string(a.pawnIndex()), null));
    stats.appendChild(badge("兵力", Std.string(a.troops()), "red"));
    stats.appendChild(badge("糧食", Std.string(a.grain()), "gold"));
    root.appendChild(stats);

    var gens = Browser.document.createDivElement();
    gens.className = "info-generals";
    var lab = Browser.document.createSpanElement();
    lab.className = "ui-label";
    lab.textContent = "武將：";
    gens.appendChild(lab);
    var any = false;
    for (g in a.roster()) {
      any = true;
      var b = Browser.document.createSpanElement();
      b.className = "ui-badge";
      b.textContent = g.id();
      gens.appendChild(b);
    }
    if (!any) {
      var none = Browser.document.createSpanElement();
      none.className = "ui-label";
      none.textContent = "(無)";
      gens.appendChild(none);
    }
    root.appendChild(gens);
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

