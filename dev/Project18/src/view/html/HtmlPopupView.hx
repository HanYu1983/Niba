package view.html;

import game.IPopupMessage;
import game.PopupPayload;
import js.Browser;
import js.html.ButtonElement;
import js.html.DivElement;
import js.html.Element;
import rx.disposables.ISubscription;
import view.EventCenter;
import view.IViewModel;
import view.UiEvent;

/**
 * Popup 元件：接收 UiEvent.PopupRefresh 後讀取 pendingPopups 並顯示第一筆。
 * 關閉按鈕會送出 UiEvent.PopupClose(popupId)，由 ViewModel ack 後再觸發下一筆。
 */
class HtmlPopupView {
  final host:Element;
  final root:DivElement;
  var vmSub:Null<ISubscription> = null;
  var evSub:Null<ISubscription> = null;
  var currentVm:Null<IViewModel> = null;

  public function new(mountElementId:String) {
    var el = Browser.document.getElementById(mountElementId);
    if (el == null)
      throw 'HtmlPopupView: mount element not found: "$mountElementId"';
    host = el;
    root = Browser.document.createDivElement();
    root.className = "popup-host";
    host.appendChild(root);

    vmSub = EventCenter.viewModelSubject.subscribe(function(vm:IViewModel) {
      currentVm = vm;
      // 初次注入也可以嘗試渲染（避免 reload 後漏顯示）
      renderIfAny();
    });
    evSub = EventCenter.onEventSubject.subscribe(function(ev:UiEvent) {
      switch ev {
        case PopupRefresh:
          renderIfAny();
        default:
      }
    });

    var vm = EventCenter.currentViewModel;
    if (vm != null) {
      currentVm = vm;
      renderIfAny();
    }
  }

  function renderIfAny():Void {
    var vm = currentVm;
    if (vm == null)
      return;
    var mid = vm.activeMonarch().id();
    var xs = vm.pendingPopups(mid);
    if (xs == null || xs.length == 0) {
      root.innerHTML = "";
      root.style.display = "none";
      return;
    }
    root.style.display = "block";
    renderPopup(xs[0]);
  }

  function renderPopup(p:IPopupMessage):Void {
    root.innerHTML = "";

    var overlay = Browser.document.createDivElement();
    overlay.className = "popup-overlay";

    var card = Browser.document.createDivElement();
    card.className = "popup-card";

    var title = Browser.document.createDivElement();
    title.className = "popup-title";
    title.textContent = p.title();
    card.appendChild(title);

    var body = Browser.document.createDivElement();
    body.className = "popup-body";
    body.textContent = payloadText(p.payload());
    card.appendChild(body);

    var actions = Browser.document.createDivElement();
    actions.className = "popup-actions";
    var closeBtn:ButtonElement = Browser.document.createButtonElement();
    closeBtn.className = "popup-btn";
    closeBtn.type = "button";
    closeBtn.textContent = "關閉";
    closeBtn.onclick = function(_) {
      EventCenter.publishEvent(UiEvent.PopupClose(p.id()));
    };
    actions.appendChild(closeBtn);
    card.appendChild(actions);

    overlay.appendChild(card);
    root.appendChild(overlay);
  }

  static function payloadText(p:PopupPayload):String {
    return switch p {
      case Plain(text): text;
    };
  }

  public function element():Element
    return root;

  public function dispose():Void {
    if (vmSub != null) {
      vmSub.unsubscribe();
      vmSub = null;
    }
    if (evSub != null) {
      evSub.unsubscribe();
      evSub = null;
    }
    if (root.parentElement != null)
      root.parentElement.removeChild(root);
  }
}

