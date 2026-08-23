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

  /** {@link game.IGameMatchGetter#playerForMonarch}{@code (...).isAi()}。 */
  public function isAiMonarch(monarchId:MonarchId):Bool;

  /** UI：設定/清除「呈現快照覆寫層」（未覆寫的欄位委派給 match）。 */
  public function setPresentationSnapshot(snapshot:Null<UiSnapshot>):Void;

  public function presentationSnapshot():Null<UiSnapshot>;
}

