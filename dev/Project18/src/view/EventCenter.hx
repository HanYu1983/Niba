package view;

import rx.Subject;

/**
 * 視覺層事件中樞：集中管理 ViewModel 的事件流。
 * 之後 ViewComponent 可訂閱此 Subject 以取得被注入/切換的 ViewModel。
 */
class EventCenter {
  public static var viewModelSubject(default, null):Subject<IViewModel> = Subject.create();

  public static inline function publishViewModel(vm:IViewModel):Void {
    viewModelSubject.on_next(vm);
  }
}

