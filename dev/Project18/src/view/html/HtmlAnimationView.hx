package view.html;

import game.AnimationPayload;
import game.IAnimationMessage;
import game.GameIds;
import js.Browser;
import js.html.DivElement;
import js.html.Element;
import rx.disposables.ISubscription;
import view.EventCenter;
import view.IViewModel;
import view.UiEvent;

/**
 * （不使用）動畫元件 — 已由 {@link HtmlOutboxView} 統一 queue；{@link HtmlRouterView} 未掛載本類別。
 *
 * 動畫元件（最小版）：
 * - 讀取 pendingAnimations(activeMonarch)
 * - 以非阻塞 overlay 呈現第一筆訊息（文字版）
 * - 自動 ack 後播放下一筆
 */
@:deprecated("不使用：動畫已由 HtmlOutboxView 統一處理，HtmlRouterView 未建立此類別。")
class HtmlAnimationView {
  final host:Element;
  final root:DivElement;
  var vmSub:Null<ISubscription> = null;
  var evSub:Null<ISubscription> = null;
  var currentVm:Null<IViewModel> = null;
  var playing:Bool = false;

  public function new(mountElementId:String) {
    var el = Browser.document.getElementById(mountElementId);
    if (el == null)
      throw 'HtmlAnimationView: mount element not found: "$mountElementId"';
    host = el;
    root = Browser.document.createDivElement();
    root.className = "anim-host";
    host.appendChild(root);

    vmSub = EventCenter.viewModelSubject.subscribe(function(vm:IViewModel) {
      currentVm = vm;
      tryStart();
    });
    evSub = EventCenter.eventSubject.subscribe(function(ev:UiEvent) {
      switch ev {
        case AnimationRefresh:
          tryStart();
        default:
      }
    });

    var vm = EventCenter.currentViewModel;
    if (vm != null) {
      currentVm = vm;
      tryStart();
    }
  }

  function tryStart():Void {
    if (playing)
      return;
    var vm = currentVm;
    if (vm == null)
      return;
    var mid = vm.activeMonarch().id();
    var xs = vm.pendingAnimations(mid);
    if (xs == null || xs.length == 0) {
      root.innerHTML = "";
      root.style.display = "none";
      return;
    }
    playing = true;
    root.style.display = "block";
    playOne(vm, mid, xs[0]);
  }

  function playOne(vm:IViewModel, mid:MonarchId, a:IAnimationMessage):Void {
    root.innerHTML = "";
    var card = Browser.document.createDivElement();
    card.className = "anim-card";
    card.textContent = payloadText(a.payload());
    root.appendChild(card);

    // 最小版：固定停留 450ms（之後可依 kind/payload 調整）
    Browser.window.setTimeout(function() {
      vm.ackAnimation(mid, a.id());
      EventCenter.publishEvent(UiEvent.AnimationRefresh);
      playing = false;
      tryStart();
    }, 450);
  }

  static function payloadText(p:AnimationPayload):String {
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

