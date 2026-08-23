package view.html;

import game.MatchTerminationReason;
import js.Browser;
import js.html.ButtonElement;
import js.html.DivElement;
import js.html.Element;
import rx.disposables.ISubscription;
import view.EventCenter;
import view.IViewModel;
import view.UiCommand;
import view.ViewState;
import game.LevelKeys;

/**
 * 終局覆蓋層：
 * - 當 match.getTerminationReason() != NotEnded 時顯示
 * - 提供「重開」「新局」「回主畫面」等操作
 */
class HtmlEndgameView {
  final host:Element;
  final root:DivElement;
  var vmSub:Null<ISubscription> = null;
  var currentVm:Null<IViewModel> = null;

  public function new(mountElementId:String) {
    var el = Browser.document.getElementById(mountElementId);
    if (el == null)
      throw 'HtmlEndgameView: mount element not found: "$mountElementId"';
    host = el;
    root = Browser.document.createDivElement();
    root.className = "endgame-host";
    host.appendChild(root);

    vmSub = EventCenter.viewModelSubject.subscribe(function(vm:IViewModel) {
      currentVm = vm;
      renderIfNeeded();
    });

    var vm = EventCenter.currentViewModel;
    if (vm != null) {
      currentVm = vm;
      renderIfNeeded();
    }
  }

  function renderIfNeeded():Void {
    var vm = currentVm;
    if (vm == null)
      return;
    var reason = vm.getTerminationReason();
    switch reason {
      case NotEnded:
        root.innerHTML = "";
        root.style.display = "none";
        return;
      case _:
    }

    root.style.display = "block";
    root.innerHTML = "";

    var overlay = Browser.document.createDivElement();
    overlay.className = "endgame-overlay";

    var card = Browser.document.createDivElement();
    card.className = "endgame-card";

    var title = Browser.document.createDivElement();
    title.className = "endgame-title";
    title.textContent = "終局";
    card.appendChild(title);

    var body = Browser.document.createDivElement();
    body.className = "endgame-body";
    body.textContent = reasonText(vm, reason);
    card.appendChild(body);

    var actions = Browser.document.createDivElement();
    actions.className = "endgame-actions";

    var btnReset:ButtonElement = Browser.document.createButtonElement();
    btnReset.className = "popup-btn";
    btnReset.type = "button";
    btnReset.textContent = "重開此場景";
    btnReset.onclick = function(_) {
      EventCenter.publishCommand(UiCommand.ResetGame);
      EventCenter.publishCommand(UiCommand.ChangePage(ViewState.Main));
    };
    actions.appendChild(btnReset);

    var btnNew:ButtonElement = Browser.document.createButtonElement();
    btnNew.className = "popup-btn";
    btnNew.type = "button";
    btnNew.textContent = "新局（EMPTY）";
    btnNew.onclick = function(_) {
      EventCenter.publishCommand(UiCommand.NewGame(LevelKeys.EMPTY));
      EventCenter.publishCommand(UiCommand.ChangePage(ViewState.Main));
    };
    actions.appendChild(btnNew);

    var btnClose:ButtonElement = Browser.document.createButtonElement();
    btnClose.className = "popup-btn";
    btnClose.type = "button";
    btnClose.textContent = "回主畫面（保留終局）";
    btnClose.onclick = function(_) {
      EventCenter.publishCommand(UiCommand.ChangePage(ViewState.Main));
    };
    actions.appendChild(btnClose);

    card.appendChild(actions);
    overlay.appendChild(card);
    root.appendChild(overlay);
  }

  static function reasonText(vm:IViewModel, reason:MatchTerminationReason):String {
    var round = vm.roundNumber();
    return switch reason {
      case Victory(mid):
        var score = vm.scoreOfMonarch(mid);
        '勝利者：${mid}\n回合：${round}\n評分：${score}';
      case Draw:
        '平局\n回合：${round}';
      case NotEnded:
        '（進行中）';
    };
  }

  public function dispose():Void {
    if (vmSub != null) {
      vmSub.unsubscribe();
      vmSub = null;
    }
    if (root.parentElement != null)
      root.parentElement.removeChild(root);
  }
}

