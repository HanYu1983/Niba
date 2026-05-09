package view.html;

import game.GameIds;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.MatchTerminationReason;
import game.MenuFormWidget;
import js.Browser;
import js.html.DivElement;
import js.html.Element;
import rx.disposables.ISubscription;
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
  var vmSub:Null<ISubscription> = null;

  public function new(mountElementId:String) {
    var el = Browser.document.getElementById(mountElementId);
    if (el == null)
      throw 'HtmlActiveMenuView: mount element not found: "$mountElementId"';
    host = el;
    root = Browser.document.createDivElement();
    root.className = "active-menu";
    host.appendChild(root);

    vmSub = EventCenter.viewModelSubject.subscribe(function(vm:IViewModel) {
      render(vm);
    });
    var vm = EventCenter.currentViewModel;
    if (vm != null)
      render(vm);
  }

  function render(vm:IViewModel):Void {
    root.innerHTML = "";

    var a = vm.activeMonarch();
    var actor:IPlayer = vm.playerForMonarch(a.id());
    var menu:IPlayerMenu = vm.createPlayerMenu(actor);
    // AI 席位：每次取得並繪製選單後自動走一步（延後一個 macrotask，避免與 publishViewModel 訂閱鏈同步重入）
    if (actor.isAi()) {
      switch vm.getTerminationReason() {
        case NotEnded:
          Browser.window.setTimeout(function() EventCenter.publishEvent(UiEvent.AiStep), 0);
        case Draw | Victory(_):
      }
    }

    var title = Browser.document.createDivElement();
    title.className = "active-menu-title";
    var tMain = Browser.document.createDivElement();
    tMain.className = "title-main";
    tMain.textContent = "指令";
    title.appendChild(tMain);
    var tSub = Browser.document.createSpanElement();
    tSub.className = "ui-badge";
    tSub.setAttribute("data-tone", "gold");
    tSub.textContent = "主公 " + a.id();
    title.appendChild(tSub);
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
      row.appendChild(renderEntryButton(n, leaf, "leaf"));
    }

    var widgets = n.formWidgets();
    if (widgets != null && widgets.length > 0) {
      var form = Browser.document.createDivElement();
      form.className = "menu-form";
      for (i in 0...widgets.length) {
        var w = widgets[i];
        switch w {
          case Button(e):
            form.appendChild(renderEntryButton(n, e, "button"));
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
              var vv = v == null ? value : v;
              lab.textContent = lbl + " (" + vv + ")";
              EventCenter.publishEvent(UiEvent.Slider(n, i, vv));
            };
            wrap.appendChild(input);
            form.appendChild(wrap);
          case MonarchSinglePick(lbl, choices, selected):
            var wrap = Browser.document.createDivElement();
            wrap.className = "menu-pick";
            var lab = Browser.document.createDivElement();
            lab.className = "menu-pick-label";
            lab.textContent = lbl;
            wrap.appendChild(lab);
            var sel = Browser.document.createSelectElement();
            sel.className = "menu-select";
            for (c in choices) {
              var opt = Browser.document.createOptionElement();
              opt.value = c.monarchId;
              opt.text = c.caption;
              sel.add(opt);
            }
            if (selected != null && selected.length > 0)
              sel.value = selected[0];
            sel.onchange = function(_) {
              var v = sel.value;
              var xs:Array<String> = v != null && v.length > 0 ? [v] : [];
              EventCenter.publishEvent(UiEvent.MonarchSinglePick(n, i, xs));
            };
            wrap.appendChild(sel);
            form.appendChild(wrap);
          case GeneralMultiPick(lbl, _, selected):
            // 複選武將：渲染成 checkbox 列表，勾選變更時送 UiEvent.GeneralMultiPick 以便就地改寫 widgets
            var wrap = Browser.document.createDivElement();
            wrap.className = "menu-multipick";
            var head = Browser.document.createDivElement();
            head.className = "menu-pick";
            var selNow = selected != null ? selected.copy() : [];
            head.textContent = lbl + " = " + selNow.join(",");
            wrap.appendChild(head);
            switch w {
              case GeneralMultiPick(_, choices, _):
                for (c in choices) {
                  var row2 = Browser.document.createDivElement();
                  row2.className = "menu-pick-row";
                  var cb = Browser.document.createInputElement();
                  cb.type = "checkbox";
                  cb.checked = selNow.indexOf(c.generalId) >= 0;
                  cb.onchange = function(_) {
                    if (cb.checked) {
                      if (selNow.indexOf(c.generalId) < 0)
                        selNow.push(c.generalId);
                    } else {
                      var j = selNow.indexOf(c.generalId);
                      if (j >= 0)
                        selNow.splice(j, 1);
                    }
                    head.textContent = lbl + " = " + selNow.join(",");
                    EventCenter.publishEvent(UiEvent.GeneralMultiPick(n, i, selNow));
                  };
                  row2.appendChild(cb);
                  var txt = Browser.document.createSpanElement();
                  txt.textContent = c.caption;
                  row2.appendChild(txt);
                  wrap.appendChild(row2);
                }
              default:
            }
            form.appendChild(wrap);
          case TileSinglePick(lbl, choices, selected):
            var wrap = Browser.document.createDivElement();
            wrap.className = "menu-pick";
            var lab = Browser.document.createDivElement();
            lab.className = "menu-pick-label";
            lab.textContent = lbl;
            wrap.appendChild(lab);
            var sel = Browser.document.createSelectElement();
            sel.className = "menu-select";
            for (c in choices) {
              var opt = Browser.document.createOptionElement();
              opt.value = Std.string(c.tileIndex);
              opt.text = c.caption;
              sel.add(opt);
            }
            if (selected != null && selected.length > 0)
              sel.value = Std.string(selected[0]);
            sel.onchange = function(_) {
              var v = Std.parseInt(sel.value);
              var xs:Array<Int> = v == null ? [] : [v];
              EventCenter.publishEvent(UiEvent.TileSinglePick(n, i, xs));
            };
            wrap.appendChild(sel);
            form.appendChild(wrap);
        }
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

  function renderEntryButton(node:IPlayerMenuNode, e:IPlayerMenuEntry, role:String):Element {
    var btn = Browser.document.createButtonElement();
    btn.className = "menu-entry";
    btn.textContent = e.caption();
    btn.disabled = !e.isEnabled();
    btn.onclick = function(_) {
      EventCenter.publishEvent(UiEvent.MenuClick(node, e));
    };
    btn.setAttribute("data-role", role);
    btn.setAttribute("data-kind", Std.string(e.kind()));
    var tok = e.decisionToken();
    if (tok != null)
      btn.setAttribute("data-token", tok);
    return btn;
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
