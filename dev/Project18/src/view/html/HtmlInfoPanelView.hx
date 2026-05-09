package view.html;

import game.GeneralStat;
import game.HistoricalPeople;
import game.IEquipment;
import game.IMonarch;
import game.TileKind;
import game.CityLevel;
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
  var activeTab:String = "monarch"; // "monarch" | "generals" | "weapons" | "jice" | "territories"

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
    tabs.appendChild(tabBtn("weapons", "武器列表", vm));
    tabs.appendChild(tabBtn("jice", "計策列表", vm));
    tabs.appendChild(tabBtn("territories", "領地資源庫", vm));
    root.appendChild(tabs);

    // content
    var body = Browser.document.createDivElement();
    body.className = "ui-tab-body";
    root.appendChild(body);

    switch activeTab {
      case "generals":
        body.appendChild(renderGenerals(vm, a));
      case "weapons":
        body.appendChild(renderWeapons(a));
      case "jice":
        body.appendChild(renderJiCe(vm, a));
      case "territories":
        body.appendChild(renderTerritories(vm, a));
      default:
        body.appendChild(renderMonarch(a));
    }
  }

  function renderMonarch(a:IMonarch):Element {
    var wrap = Browser.document.createDivElement();

    var stats = Browser.document.createDivElement();
    stats.className = "info-stats";
    stats.appendChild(badge("主公", HistoricalPeople.monarchName(a.id()), null));
    stats.appendChild(badge("席位", Std.string(a.seat()), null));
    stats.appendChild(badge("位置", Std.string(a.pawnIndex()), null));
    stats.appendChild(badge("兵力", Std.string(a.troops()), "red"));
    stats.appendChild(badge("糧食", Std.string(a.grain()), "gold"));
    stats.appendChild(badge("金錢", Std.string(a.gold()), null));
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
      b.textContent = HistoricalPeople.generalName(g.id());
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

  function renderGenerals(vm:IViewModel, a:IMonarch):Element {
    var wrap = Browser.document.createDivElement();

    // generalId -> [cityTileIndex...]
    var garrisonByGeneral = new Map<String, Array<Int>>();
    var len = vm.board().length();
    for (i in 0...len) {
      var t = vm.tileAt(i);
      switch t.kind() {
        case City:
          var gids = vm.forceGetCityGarrisonGeneralIds(i);
          if (gids != null && gids.length > 0)
            for (gid in gids) {
              var xs = garrisonByGeneral.exists(gid) ? garrisonByGeneral.get(gid) : [];
              xs.push(i);
              garrisonByGeneral.set(gid, xs);
            }
        default:
      }
    }

    var table = Browser.document.createTableElement();
    table.className = "ui-table";

    var thead = Browser.document.createTableSectionElement();
    var hr = Browser.document.createTableRowElement();
    for (h in ["姓名", "統御", "勇武", "智謀", "政理", "體力", "忠誠", "功績", "職位", "進駐城池"]) {
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
      td0.colSpan = 10;
      td0.className = "ui-td ui-empty";
      td0.textContent = "（目前沒有武將）";
      r0.appendChild(td0);
      tbody.appendChild(r0);
    } else {
      for (g in roster) {
        var r = Browser.document.createTableRowElement();
        var gid = g.id();
        r.appendChild(td(HistoricalPeople.generalName(gid), true));
        r.appendChild(td(Std.string(g.stat(Command)), false));
        r.appendChild(td(Std.string(g.stat(Might)), false));
        r.appendChild(td(Std.string(g.stat(Wit)), false));
        r.appendChild(td(Std.string(g.stat(Stewardship)), false));
        r.appendChild(td(Std.string(g.stamina()), false));
        r.appendChild(td(Std.string(g.loyalty()), false));
        r.appendChild(td(Std.string(g.merit()), false));
        r.appendChild(td(Std.string(g.positionRank()), true));
        var xs = garrisonByGeneral.exists(gid) ? garrisonByGeneral.get(gid) : null;
        var cap = (xs == null || xs.length == 0) ? "（無）" : xs.join(", ");
        r.appendChild(td(cap, true));
        tbody.appendChild(r);
      }
    }
    table.appendChild(tbody);
    wrap.appendChild(table);
    return wrap;
  }

  function renderWeapons(a:IMonarch):Element {
    var wrap = Browser.document.createDivElement();

    var table = Browser.document.createTableElement();
    table.className = "ui-table";

    var thead = Browser.document.createTableSectionElement();
    var hr = Browser.document.createTableRowElement();
    for (h in ["裝備", "類型", "稀有度", "加成", "忠誠+", "價格", "所裝備武將"]) {
      var th = Browser.document.createTableCellElement();
      th.className = "ui-th";
      th.textContent = h;
      hr.appendChild(th);
    }
    thead.appendChild(hr);
    table.appendChild(thead);

    var tbody = Browser.document.createTableSectionElement();
    var rows:Array<{ eq:IEquipment, gid:String }> = [];
    for (g in a.roster()) {
      var eqs = g.equipments();
      if (eqs != null) {
        for (eq in eqs)
          rows.push({ eq: eq, gid: g.id() });
      }
    }

    if (rows.length == 0) {
      var r0 = Browser.document.createTableRowElement();
      var td0 = Browser.document.createTableCellElement();
      td0.colSpan = 7;
      td0.className = "ui-td ui-empty";
      td0.textContent = "（目前沒有武器/裝備）";
      r0.appendChild(td0);
      tbody.appendChild(r0);
    } else {
      for (x in rows) {
        var eq = x.eq;
        var r = Browser.document.createTableRowElement();
        r.appendChild(td(eq.name(), true));
        r.appendChild(td(Std.string(eq.type()), false));
        r.appendChild(td(Std.string(eq.rarity()), false));
        r.appendChild(td(Std.string(eq.bonusStat()) + " +" + eq.bonusValue(), false));
        r.appendChild(td(Std.string(eq.loyaltyBonus()), false));
        r.appendChild(td(Std.string(eq.price()), false));
        r.appendChild(td(HistoricalPeople.generalName(x.gid), true));
        tbody.appendChild(r);
      }
    }
    table.appendChild(tbody);
    wrap.appendChild(table);
    return wrap;
  }

  function renderJiCe(vm:IViewModel, a:IMonarch):Element {
    var wrap = Browser.document.createDivElement();

    var lab = Browser.document.createSpanElement();
    lab.className = "ui-label";
    lab.textContent = "所持計策（依使用階段顯示）";
    wrap.appendChild(lab);

    var table = Browser.document.createTableElement();
    table.className = "ui-table";

    var thead = Browser.document.createTableSectionElement();
    var hr = Browser.document.createTableRowElement();
    for (h in ["名稱", "Key", "可用階段"]) {
      var th = Browser.document.createTableCellElement();
      th.className = "ui-th";
      th.textContent = h;
      hr.appendChild(th);
    }
    thead.appendChild(hr);
    table.appendChild(thead);

    var tbody = Browser.document.createTableSectionElement();
    var cards = vm.availableJiCe(a.id());
    if (cards.length == 0) {
      var r0 = Browser.document.createTableRowElement();
      var td0 = Browser.document.createTableCellElement();
      td0.colSpan = 3;
      td0.className = "ui-td ui-empty";
      td0.textContent = "（目前沒有計策）";
      r0.appendChild(td0);
      tbody.appendChild(r0);
    } else {
      for (c in cards) {
        var r = Browser.document.createTableRowElement();
        r.appendChild(td(c.designLabel(), true));
        r.appendChild(td(c.registryKey(), true));
        var ps = c.allowedPhases();
        var pTxt = [];
        for (p in ps)
          pTxt.push(p == PreMove ? "移動前" : "移動後");
        r.appendChild(td(pTxt.length > 0 ? pTxt.join(" / ") : "（無）", true));
        tbody.appendChild(r);
      }
    }
    table.appendChild(tbody);
    wrap.appendChild(table);
    return wrap;
  }

  function renderTerritories(vm:IViewModel, a:IMonarch):Element {
    var wrap = Browser.document.createDivElement();

    var lab = Browser.document.createSpanElement();
    lab.className = "ui-label";
    lab.textContent = "我方領地（城池/村落）資源庫";
    wrap.appendChild(lab);

    var table = Browser.document.createTableElement();
    table.className = "ui-table";

    var thead = Browser.document.createTableSectionElement();
    var hr = Browser.document.createTableRowElement();
    for (h in ["格", "類型", "等級", "金庫", "糧庫", "兵庫", "地形", "成長(金/糧/兵)"]) {
      var th = Browser.document.createTableCellElement();
      th.className = "ui-th";
      th.textContent = h;
      hr.appendChild(th);
    }
    thead.appendChild(hr);
    table.appendChild(thead);

    var tbody = Browser.document.createTableSectionElement();
    var any = false;
    var len = vm.board().length();
    for (i in 0...len) {
      var t = vm.tileAt(i);
      switch t.kind() {
        case City:
          var owner = vm.forceGetCityOwner(i);
          if (owner != null && owner == a.id()) {
            any = true;
            var r = Browser.document.createTableRowElement();
            r.appendChild(td(Std.string(i), true));
            r.appendChild(td("城池", true));
            r.appendChild(td(Std.string(vm.forceGetCityLevel(i)), false));
            r.appendChild(td(Std.string(vm.forceGetCityStoredGold(i)), false));
            r.appendChild(td(Std.string(vm.forceGetCityStoredGrain(i)), false));
            r.appendChild(td(Std.string(vm.forceGetCityStoredTroops(i)), false));
            r.appendChild(td(Std.string(vm.forceGetTileTerrain(i)), false));
            var g = vm.forceGetTileGrowth(i);
            r.appendChild(td('${g.gold}/${g.grain}/${g.troops}', false));
            tbody.appendChild(r);
          }
        case Village:
          var vOwner = vm.forceGetVillageOwner(i);
          if (vOwner != null && vOwner == a.id()) {
            any = true;
            var r = Browser.document.createTableRowElement();
            r.appendChild(td(Std.string(i), true));
            r.appendChild(td("村落", true));
            r.appendChild(td(Std.string(vm.forceGetVillageLevel(i)), false));
            r.appendChild(td(Std.string(vm.forceGetVillageStoredGold(i)), false));
            r.appendChild(td(Std.string(vm.forceGetVillageStoredGrain(i)), false));
            r.appendChild(td(Std.string(vm.forceGetVillageStoredTroops(i)), false));
            r.appendChild(td(Std.string(vm.forceGetTileTerrain(i)), false));
            var g = vm.forceGetTileGrowth(i);
            r.appendChild(td('${g.gold}/${g.grain}/${g.troops}', false));
            tbody.appendChild(r);
          }
        default:
      }
    }

    if (!any) {
      var r0 = Browser.document.createTableRowElement();
      var td0 = Browser.document.createTableCellElement();
      td0.colSpan = 8;
      td0.className = "ui-td ui-empty";
      td0.textContent = "（目前沒有領地資源庫）";
      r0.appendChild(td0);
      tbody.appendChild(r0);
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

