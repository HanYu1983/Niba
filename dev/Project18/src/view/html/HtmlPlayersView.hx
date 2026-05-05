package view.html;

import js.Browser;
import js.html.Element;
import rx.disposables.ISubscription;
import view.EventCenter;
import view.IViewModel;

/**
 * 玩家面板容器：負責取得掛載點、建立 slot，並產生每個 HtmlPlayerView。
 *
 * HelloWorld 只需 new 一次，不必再直接操作 DOM/append。
 */
class HtmlPlayersView {
  final host:Element;
  var vmSub:Null<ISubscription> = null;

  public function new(mountElementId:String) {
    var el = Browser.document.getElementById(mountElementId);
    if (el == null)
      throw 'HtmlPlayersView: mount element not found: "$mountElementId"';
    host = el;

    vmSub = EventCenter.viewModelSubject.subscribe(function(vm:IViewModel) {
      render(vm);
    });
    var vm = EventCenter.currentViewModel;
    if (vm != null) render(vm);
  }

  function render(vm:IViewModel):Void {
    host.innerHTML = "";
    for (m in vm.monarchs()) {
      var id = "player-" + m.id();
      var slot = Browser.document.createDivElement();
      slot.id = id;
      host.appendChild(slot);
      new HtmlPlayerView(id, m.id());
    }
  }

  public function dispose():Void {
    if (vmSub != null) {
      vmSub.unsubscribe();
      vmSub = null;
    }
    host.innerHTML = "";
  }
}

