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
    var gs:Array<String> = [];
    for (g in a.roster())
      gs.push(g.id());
    root.textContent =
      'round=' + vm.roundNumber()
      + ' active=' + a.id()
      + ' seat=' + a.seat()
      + ' pos=' + a.pawnIndex()
      + ' troops=' + a.troops()
      + ' grain=' + a.grain()
      + ' generals=' + gs.join(",");
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

