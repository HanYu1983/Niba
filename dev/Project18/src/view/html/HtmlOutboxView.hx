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
import view.OutboxPopupBodyText;
import view.UiEvent;
import view.UiSnapshot;

/**
 * 統一 Outbox 元件：
 * - 讀取 pendingOutbox(activeMonarch)
 * - 嚴格只 ack head（保序）
 * - FanOut2：允許同時顯示 head + next（但仍只 ack head）
 * - activeMonarch 為 AI 時，阻塞型項目會在數秒後自動送出 OutboxAck（與手動關閉同路徑）
 */
class HtmlOutboxView {
  static inline final AI_POPUP_AUTOCLOSE_MS = 3000;

  final host:Element;
  final root:DivElement;
  final popupRoot:DivElement;
  final animRoot:DivElement;
  var vmSub:Null<ISubscription> = null;
  var evSub:Null<ISubscription> = null;
  var currentVm:Null<IViewModel> = null;
  var playing:Bool = false;
  /** AI popup 自動關閉計時；重新渲染／手動關閉／dispose 時清除 */
  var popupAutoCloseHandle:Null<Int> = null;

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
        default:
      }
    });

    var vm = EventCenter.currentViewModel;
    if (vm != null) {
      currentVm = vm;
      tryAdvance();
    }
  }

  function cancelPopupAutoClose():Void {
    if (popupAutoCloseHandle != null) {
      Browser.window.clearTimeout(popupAutoCloseHandle);
      popupAutoCloseHandle = null;
    }
  }

  function clear():Void {
    cancelPopupAutoClose();
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
        // 阻塞：等待使用者按關閉（OutboxAck → vm ackOutbox → OutboxRefresh）
      case Animation(_, _, durationMs):
        playing = true;

        // 動畫期間：套用「過程快照」（目前先支援 PawnMove：把棋子暫時顯示在 from）
        applySnapshotForHeadIfAny(vm, mid, head);

        Browser.window.setTimeout(function() {
          // 動畫結束：清除快照，回到 match 真實狀態
          vm.setPresentationSnapshot(null);
          EventCenter.publishViewModel(vm);

          vm.ackOutbox(mid, head.id());
          EventCenter.publishEvent(UiEvent.OutboxRefresh);
          playing = false;
          tryAdvance();
        }, durationMs);
    }
  }

  function applySnapshotForHeadIfAny(vm:IViewModel, mid:MonarchId, head:IOutboxMessage):Void {
    switch head.presentation() {
      case Animation(_, payload, _):
        switch payload {
          case PawnMove(from, _, _):
            var mp = new Map<MonarchId, TileIndex>();
            mp.set(mid, from);
            var s:UiSnapshot = { monarchPawnIndexById: mp };
            vm.setPresentationSnapshot(s);
            EventCenter.publishViewModel(vm);
          case _:
        }
      case _:
    }
  }

  function renderHeadAndMaybeNext(vm:IViewModel, mid:MonarchId, xs:Array<IOutboxMessage>):Void {
    cancelPopupAutoClose();
    popupRoot.innerHTML = "";
    animRoot.innerHTML = "";
    popupRoot.style.display = "none";
    animRoot.style.display = "none";

    var head = xs[0];
    switch head.presentation() {
      case Popup(title, payload, _):
        popupRoot.style.display = "block";
        renderPopup(vm, mid, head.id(), title, OutboxPopupBodyText.format(payload));
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

  function renderPopup(vm:IViewModel, mid:MonarchId, outboxId:String, titleText:String, bodyText:String):Void {
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
    function closePopup():Void {
      cancelPopupAutoClose();
      EventCenter.publishEvent(UiEvent.OutboxAck(outboxId));
    }
    closeBtn.onclick = function(_) closePopup();
    actions.appendChild(closeBtn);
    card.appendChild(actions);

    overlay.appendChild(card);
    popupRoot.appendChild(overlay);

    if (vm.isAiMonarch(mid)) {
      popupAutoCloseHandle = Browser.window.setTimeout(function() closePopup(), AI_POPUP_AUTOCLOSE_MS);
    }
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

  static function payloadTextAnim(p:AnimationPayload):String {
    return switch p {
      case PawnMove(from, to, delta):
        '移動：${from} → ${to}（${delta}步）';
      case Text(msg):
        msg;
    };
  }

  public function dispose():Void {
    cancelPopupAutoClose();
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

