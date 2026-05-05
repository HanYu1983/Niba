package view;

/**
 * ViewModel 的最小生命週期契約。
 * 之後每個 ViewComponent 都可以依賴這個介面注入/釋放 ViewModel。
 */
interface IViewModel {
  public function dispose():Void;
}

