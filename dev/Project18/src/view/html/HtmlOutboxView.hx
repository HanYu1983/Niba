package view.html;

import game.AnimationPayload;
import game.IOutboxMessage;
import game.OutboxPresentation;
import game.OutboxPresentationMode;
import game.GameIds;
import js.Browser;
import js.html.ButtonElement;
import js.html.DivElement;
import js.html.Element;
import rx.disposables.ISubscription;
import view.EventCenter;
import view.IViewModel;
import view.UiEvent;

/**
 * 統一 Outbox 元件：
 * - 讀取 pendingOutbox(activeMonarch)
 * - 嚴格只 ack head（保序）
 * - FanOut2：允許同時顯示 head + next（但仍只 ack head）
 */
class HtmlOutboxView {
  final host:Element;
  final root:DivElement;
  final popupRoot:DivElement;
  final animRoot:DivElement;
  var vmSub:Null<ISubscription> = null;
  var evSub:Null<ISubscription> = null;
  var currentVm:Null<IViewModel> = null;
  var playing:Bool = false;

  public function new(mountElementId:String) {
    var el = Browser.document.getElementById(mountElementId);
    if (el == null)
      throw 'HtmlOutboxView: mount element not found: "$mountElementId"';
    host = el;

    root = Browser.document.createDivElement();
    root.className = "outbox-root";
    host.appendChild(root);

    popupRoot = Browser.document.createDivElement();
    popupRoot.className = "popup-host";
    root.appendChild(popupRoot);

    animRoot = Browser.document.createDivElement();
    animRoot.className = "anim-host";
    root.appendChild(animRoot);

    vmSub = EventCenter.viewModelSubject.subscribe(function(vm:IViewModel) {
      currentVm = vm;
      tryAdvance();
    });
    evSub = EventCenter.eventSubject.subscribe(function(ev:UiEvent) {
      switch ev {
        case OutboxRefresh:
          tryAdvance();
        // 相容：舊事件也會觸發 outbox 重新處理
        case PopupRefresh:
          tryAdvance();
        case AnimationRefresh:
          tryAdvance();
        default:
      }
    });

    var vm = EventCenter.currentViewModel;
    if (vm != null) {
      currentVm = vm;
      tryAdvance();
    }
  }

  function clear():Void {
    popupRoot.innerHTML = "";
    animRoot.innerHTML = "";
    popupRoot.style.display = "none";
    animRoot.style.display = "none";
    root.style.display = "none";
  }

  function tryAdvance():Void {
    if (playing)
      return;
    var vm = currentVm;
    if (vm == null)
      return;
    var mid = vm.activeMonarch().id();
    var xs = vm.pendingOutbox(mid);
    if (xs == null || xs.length == 0) {
      clear();
      return;
    }

    root.style.display = "block";

    var head = xs[0];
    renderHeadAndMaybeNext(vm, mid, xs);

    switch head.presentation() {
      case Popup(_, _, _):
        // 阻塞：等待使用者按關閉（由 PopupClose → vm ack → OutboxRefresh 進行下一筆）
      case Animation(_, _, durationMs):
        playing = true;
        Browser.window.setTimeout(function() {
          vm.ackOutbox(mid, head.id());
          EventCenter.publishEvent(UiEvent.OutboxRefresh);
          playing = false;
          tryAdvance();
        }, durationMs);
    }
  }

  function renderHeadAndMaybeNext(vm:IViewModel, mid:MonarchId, xs:Array<IOutboxMessage>):Void {
    popupRoot.innerHTML = "";
    animRoot.innerHTML = "";
    popupRoot.style.display = "none";
    animRoot.style.display = "none";

    var head = xs[0];
    switch head.presentation() {
      case Popup(title, payload, _):
        popupRoot.style.display = "block";
        renderPopup(head.id(), title, payloadText(payload));
      case Animation(_, payload, _):
        animRoot.style.display = "block";
        var texts:Array<String> = [payloadTextAnim(payload)];
        if (head.presentationMode() == OutboxPresentationMode.FanOut2 && xs.length >= 2) {
          var next = xs[1];
          switch next.presentation() {
            case Animation(_, payload2, _):
              texts.push(payloadTextAnim(payload2));
            case Popup(_, _, _):
          }
        }
        renderAnimStack(texts);
    }
  }

  function renderPopup(outboxId:String, titleText:String, bodyText:String):Void {
    var overlay = Browser.document.createDivElement();
    overlay.className = "popup-overlay";

    var card = Browser.document.createDivElement();
    card.className = "popup-card";

    var title = Browser.document.createDivElement();
    title.className = "popup-title";
    title.textContent = titleText;
    card.appendChild(title);

    var body = Browser.document.createDivElement();
    body.className = "popup-body";
    body.textContent = bodyText;
    card.appendChild(body);

    var actions = Browser.document.createDivElement();
    actions.className = "popup-actions";
    var closeBtn:ButtonElement = Browser.document.createButtonElement();
    closeBtn.className = "popup-btn";
    closeBtn.type = "button";
    closeBtn.textContent = "關閉";
    closeBtn.onclick = function(_) {
      // 仍沿用 PopupClose 事件，payload 改承載 outboxId
      EventCenter.publishEvent(UiEvent.PopupClose(outboxId));
    };
    actions.appendChild(closeBtn);
    card.appendChild(actions);

    overlay.appendChild(card);
    popupRoot.appendChild(overlay);
  }

  function renderAnimStack(texts:Array<String>):Void {
    animRoot.innerHTML = "";
    for (i in 0...texts.length) {
      var card = Browser.document.createDivElement();
      card.className = i == 0 ? "anim-card" : "anim-card anim-card-next";
      card.textContent = texts[i];
      animRoot.appendChild(card);
    }
  }

  static function payloadText(p:game.PopupPayload):String {
    return switch p {
      case Plain(text): text;
    };
  }

  static function payloadTextAnim(p:AnimationPayload):String {
    return switch p {
      case PawnMove(from, to, delta):
        '移動：${from} → ${to}（${delta}步）';
      case Text(msg):
        msg;
    };
  }

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

