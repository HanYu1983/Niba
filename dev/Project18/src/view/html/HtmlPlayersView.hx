package view.html;

import js.Browser;
import js.html.Element;
import view.EventCenter;

/**
 * 玩家面板容器：負責取得掛載點、建立 slot，並產生每個 HtmlPlayerView。
 *
 * HelloWorld 只需 new 一次，不必再直接操作 DOM/append。
 */
class HtmlPlayersView {
  final host:Element;

  public function new(mountElementId:String) {
    var el = Browser.document.getElementById(mountElementId);
    if (el == null)
      throw 'HtmlPlayersView: mount element not found: "$mountElementId"';
    host = el;

    // 先求簡單：依 currentViewModel 立即建一次
    var vm = EventCenter.currentViewModel;
    if (vm == null)
      return;

    for (m in vm.monarchs()) {
      var id = "player-" + m.id();
      var slot = Browser.document.createDivElement();
      slot.id = id;
      host.appendChild(slot);
      new HtmlPlayerView(id, m.id());
    }
  }
}

