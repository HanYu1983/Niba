package rx;

import rx.disposables.ISubscription;

/**
 * 最小版 Subject（暫時只滿足 view.EventCenter 的需求）。
 *
 * 目前提供最基本的 pub-sub：subscribe / unsubscribe / on_next。
 */
class Subject<T> {
  public static function create<T>():Subject<T> {
    return new Subject<T>();
  }

  var listeners:Array<T->Void> = [];

  public function new() {}

  public function subscribe(fn:T->Void):ISubscription {
    listeners.push(fn);
    return new SimpleSubscription(function() {
      var i = listeners.length;
      while (i-- > 0)
        if (Reflect.compareMethods(listeners[i], fn)) {
          listeners.splice(i, 1);
          break;
        }
    });
  }

  public function on_next(v:T):Void {
    // 用快照避免 listener 內 unsubscribe 影響迭代
    var snap = listeners.copy();
    for (fn in snap)
      fn(v);
  }
}

private class SimpleSubscription implements ISubscription {
  var f:Null<Void->Void>;
  public function new(f:Void->Void) this.f = f;
  public function unsubscribe():Void {
    if (f != null) {
      f();
      f = null;
    }
  }
}

