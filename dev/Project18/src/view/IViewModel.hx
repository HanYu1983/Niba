package view;

import game.IGameMatchGetter;
import game.GameIds;
import view.UiSnapshot;

/**
 * ViewModel 的最小生命週期契約。
 * 之後每個 ViewComponent 都可以依賴這個介面注入/釋放 ViewModel。
 */
interface IViewModel extends IGameMatchGetter {
  public function dispose():Void;

  /** UI/AI：該君主是否由 AI 控制（僅影響 UI 自動操作，不改變規則）。 */
  public function isAiMonarch(monarchId:MonarchId):Bool;

  /** UI：設定/清除「呈現快照覆寫層」（未覆寫的欄位委派給 match）。 */
  public function setPresentationSnapshot(snapshot:Null<UiSnapshot>):Void;

  public function presentationSnapshot():Null<UiSnapshot>;
}

