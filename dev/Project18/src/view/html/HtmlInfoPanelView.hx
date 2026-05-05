package view.html;

import game.GeneralStat;
import game.IMonarch;
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
  var activeTab:String = "monarch"; // "monarch" | "generals"

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
    var a:IMonarch = vm.activeMonarch();
    root.innerHTML = "";

    // header: title + round badge
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

    // tabs
    var tabs = Browser.document.createDivElement();
    tabs.className = "ui-tabs";
    tabs.appendChild(tabBtn("monarch", "君主資料", vm));
    tabs.appendChild(tabBtn("generals", "武將列表", vm));
    root.appendChild(tabs);

    // content
    var body = Browser.document.createDivElement();
    body.className = "ui-tab-body";
    root.appendChild(body);

    switch activeTab {
      case "generals":
        body.appendChild(renderGenerals(a));
      default:
        body.appendChild(renderMonarch(a));
    }
  }

  function renderMonarch(a:IMonarch):Element {
    var wrap = Browser.document.createDivElement();

    var stats = Browser.document.createDivElement();
    stats.className = "info-stats";
    stats.appendChild(badge("主公", a.id(), null));
    stats.appendChild(badge("席位", Std.string(a.seat()), null));
    stats.appendChild(badge("位置", Std.string(a.pawnIndex()), null));
    stats.appendChild(badge("兵力", Std.string(a.troops()), "red"));
    stats.appendChild(badge("糧食", Std.string(a.grain()), "gold"));
    wrap.appendChild(stats);

    var gens = Browser.document.createDivElement();
    gens.className = "info-generals";
    var lab = Browser.document.createSpanElement();
    lab.className = "ui-label";
    lab.textContent = "麾下武將（快速）";
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
    wrap.appendChild(gens);

    return wrap;
  }

  function renderGenerals(a:IMonarch):Element {
    var wrap = Browser.document.createDivElement();

    var table = Browser.document.createTableElement();
    table.className = "ui-table";

    var thead = Browser.document.createTableSectionElement();
    var hr = Browser.document.createTableRowElement();
    for (h in ["姓名", "統御", "勇武", "智謀", "政理", "體力", "忠誠"]) {
      var th = Browser.document.createTableCellElement();
      th.className = "ui-th";
      th.textContent = h;
      hr.appendChild(th);
    }
    thead.appendChild(hr);
    table.appendChild(thead);

    var tbody = Browser.document.createTableSectionElement();
    var roster = a.roster();
    if (roster.length == 0) {
      var r0 = Browser.document.createTableRowElement();
      var td0 = Browser.document.createTableCellElement();
      td0.colSpan = 7;
      td0.className = "ui-td ui-empty";
      td0.textContent = "（目前沒有武將）";
      r0.appendChild(td0);
      tbody.appendChild(r0);
    } else {
      for (g in roster) {
        var r = Browser.document.createTableRowElement();
        r.appendChild(td(g.id(), true));
        r.appendChild(td(Std.string(g.stat(Command)), false));
        r.appendChild(td(Std.string(g.stat(Might)), false));
        r.appendChild(td(Std.string(g.stat(Wit)), false));
        r.appendChild(td(Std.string(g.stat(Stewardship)), false));
        r.appendChild(td(Std.string(g.stamina()), false));
        r.appendChild(td(Std.string(g.loyalty()), false));
        tbody.appendChild(r);
      }
    }
    table.appendChild(tbody);
    wrap.appendChild(table);
    return wrap;
  }

  function td(text:String, isName:Bool):Element {
    var cell = Browser.document.createTableCellElement();
    cell.className = isName ? "ui-td ui-td-name" : "ui-td ui-td-num";
    cell.textContent = text;
    return cell;
  }

  function tabBtn(key:String, label:String, vm:IViewModel):Element {
    var b = Browser.document.createButtonElement();
    b.className = (activeTab == key) ? "ui-tab is-active" : "ui-tab";
    b.type = "button";
    b.textContent = label;
    b.onclick = function(_) {
      activeTab = key;
      render(vm);
    };
    return b;
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

