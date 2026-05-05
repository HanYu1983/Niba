package view;

import rx.Subject;

typedef UiClick = {id:String};
typedef UiSlider = {id:String, value:Int};

/**
 * 視覺層事件中樞：集中管理 ViewModel 的事件流。
 * 之後 ViewComponent 可訂閱此 Subject 以取得被注入/切換的 ViewModel。
 */
class EventCenter {
  public static var viewModelSubject(default, null):Subject<IViewModel> = Subject.create();
  public static var onClickSubject(default, null):Subject<UiClick> = Subject.create();
  public static var onSliderSubject(default, null):Subject<UiSlider> = Subject.create();
  public static var currentViewModel(default, null):Null<IViewModel> = null;

  public static inline function publishViewModel(vm:IViewModel):Void {
    currentViewModel = vm;
    viewModelSubject.on_next(vm);
  }

  public static inline function publishOnClick(id:String):Void {
    onClickSubject.on_next({id: id});
  }

  public static inline function publishOnSlider(id:String, value:Int):Void {
    onSliderSubject.on_next({id: id, value: value});
  }
}

