package view;

import rx.Subject;
import view.UiEvent;

/**
 * 視覺層事件中樞：集中管理 ViewModel 的事件流。
 * 之後 ViewComponent 可訂閱此 Subject 以取得被注入/切換的 ViewModel。
 */
class EventCenter {
  public static var viewModelSubject(default, null):Subject<IViewModel> = Subject.create();
  public static var onEventSubject(default, null):Subject<UiEvent> = Subject.create();
  public static var currentViewModel(default, null):Null<IViewModel> = null;

  public static inline function publishViewModel(vm:IViewModel):Void {
    currentViewModel = vm;
    viewModelSubject.on_next(vm);
  }

  public static inline function publishEvent(ev:UiEvent):Void {
    onEventSubject.on_next(ev);
  }
}

