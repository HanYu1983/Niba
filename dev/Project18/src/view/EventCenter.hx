package view;

import rx.Subject;
import view.UiEvent;
import view.UiCommand;

/**
 * 視覺層事件中樞：集中管理 ViewModel 的事件流。
 * 之後 ViewComponent 可訂閱此 Subject 以取得被注入/切換的 ViewModel。
 */
class EventCenter {
  public static var viewModelSubject(default, null):Subject<IViewModel> = Subject.create();
  /** 事件（one-to-many）：點擊/滑桿/選取等 UI 行為廣播。 */
  public static var eventSubject(default, null):Subject<UiEvent> = Subject.create();
  /** 指令（one-to-one）：如換頁/建局等「意圖」；由單一 controller 消費。 */
  public static var commandSubject(default, null):Subject<UiCommand> = Subject.create();
  public static var currentViewModel(default, null):Null<IViewModel> = null;

  public static inline function publishViewModel(vm:IViewModel):Void {
    currentViewModel = vm;
    viewModelSubject.on_next(vm);
  }

  public static inline function publishEvent(ev:UiEvent):Void {
    eventSubject.on_next(ev);
  }

  public static inline function publishCommand(cmd:UiCommand):Void {
    commandSubject.on_next(cmd);
  }
}

