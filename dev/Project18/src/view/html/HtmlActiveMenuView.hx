package view.html;

import game.GameIds;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.MenuFormWidget;
import js.Browser;
import js.html.DivElement;
import js.html.Element;
import view.EventCenter;
import view.IViewModel;
import view.UiEvent;

/**
 * 當前玩家（activeMonarch）選單顯示元件。
 *
 * 目前先做「顯示＋送出 click/slider 事件」，不直接呼叫 applyMenuLeaf。
 */
class HtmlActiveMenuView {
  final host:Element;
  final root:DivElement;

  public function new(mountElementId:String) {
    var el = Browser.document.getElementById(mountElementId);
    if (el == null)
      throw 'HtmlActiveMenuView: mount element not found: "$mountElementId"';
    host = el;
    root = Browser.document.createDivElement();
    root.className = "active-menu";
    host.appendChild(root);

    var vm = EventCenter.currentViewModel;
    if (vm != null)
      render(vm);
  }

  function render(vm:IViewModel):Void {
    root.innerHTML = "";

    var a = vm.activeMonarch();
    var actor:IPlayer = new LocalPlayer(a.id(), "active");
    var menu:IPlayerMenu = vm.createPlayerMenu(actor);

    var title = Browser.document.createDivElement();
    title.className = "active-menu-title";
    title.textContent = "Menu (active=" + a.id() + ")";
    root.appendChild(title);

    var tree = Browser.document.createDivElement();
    tree.className = "active-menu-tree";
    root.appendChild(tree);

    for (n in menu.rootNodes())
      tree.appendChild(renderNode(n, 0));
  }

  function renderNode(n:IPlayerMenuNode, depth:Int):Element {
    var row = Browser.document.createDivElement();
    row.className = "menu-node";
    row.setAttribute("data-depth", Std.string(depth));

    var cap = Browser.document.createDivElement();
    cap.className = "menu-caption";
    cap.textContent = n.caption();
    row.appendChild(cap);

    var leaf = n.leaf();
    if (leaf != null) {
      row.appendChild(renderEntryButton(leaf, "leaf"));
    }

    var widgets = n.formWidgets();
    if (widgets != null && widgets.length > 0) {
      var form = Browser.document.createDivElement();
      form.className = "menu-form";
      for (w in widgets)
        switch w {
          case Button(e):
            form.appendChild(renderEntryButton(e, "button"));
          case Slider(lbl, min, max, step, value):
            var wrap = Browser.document.createDivElement();
            wrap.className = "menu-slider";
            var lab = Browser.document.createDivElement();
            lab.textContent = lbl + " (" + value + ")";
            wrap.appendChild(lab);
            var input = Browser.document.createInputElement();
            input.type = "range";
            input.min = Std.string(min);
            input.max = Std.string(max);
            input.step = Std.string(step);
            input.value = Std.string(value);
            input.oninput = function(_) {
              var v = Std.parseInt(input.value);
              EventCenter.publishEvent(UiEvent.Slider(lbl, v == null ? value : v));
            };
            wrap.appendChild(input);
            form.appendChild(wrap);
          case MonarchSinglePick(lbl, choices, selected):
            var p = Browser.document.createDivElement();
            p.className = "menu-pick";
            p.textContent = lbl + " = " + (selected != null && selected.length > 0 ? selected[0] : "(none)");
            form.appendChild(p);
          case GeneralMultiPick(lbl, _, selected):
            var p = Browser.document.createDivElement();
            p.className = "menu-pick";
            p.textContent = lbl + " = " + (selected != null ? selected.join(",") : "");
            form.appendChild(p);
        }
      row.appendChild(form);
    }

    var kids = n.children();
    if (kids != null && kids.length > 0) {
      var box = Browser.document.createDivElement();
      box.className = "menu-children";
      for (c in kids)
        box.appendChild(renderNode(c, depth + 1));
      row.appendChild(box);
    }

    return row;
  }

  function renderEntryButton(e:IPlayerMenuEntry, role:String):Element {
    var btn = Browser.document.createButtonElement();
    btn.className = "menu-entry";
    btn.textContent = e.caption();
    btn.disabled = !e.isEnabled();
    var tok = e.decisionToken();
    btn.onclick = function(_) {
      EventCenter.publishEvent(UiEvent.MenuClick(e.kind(), tok));
    };
    btn.setAttribute("data-role", role);
    btn.setAttribute("data-kind", Std.string(e.kind()));
    if (tok != null)
      btn.setAttribute("data-token", tok);
    return btn;
  }

  public function element():Element
    return root;

  public function dispose():Void {
    if (root.parentElement != null)
      root.parentElement.removeChild(root);
  }
}

private class LocalPlayer implements IPlayer {
  final mid:MonarchId;
  final name:String;
  public function new(mid:MonarchId, name:String) {
    this.mid = mid;
    this.name = name;
  }
  public function monarchId():MonarchId return mid;
  public function displayName():String return name;
}

