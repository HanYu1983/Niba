package rx;

/**
 * 最小版 Subject（暫時只滿足 view.EventCenter 的需求）。
 *
 * 注意：目前專案仍以 `-lib rxhaxe` 編譯，但因 classpath `src/` 優先，
 * 這個檔案會覆蓋 rxhaxe 的 `rx.Subject`，避免 rxhaxe 在 Haxe 4.3 下的編譯相容性問題。
 *
 * 之後若要完整 Rx operator/subscribe，再決定要：
 * - 修 rxhaxe 相容性，或
 * - 持續擴充此最小實作。
 */
class Subject<T> {
  public static function create<T>():Subject<T> {
    return new Subject<T>();
  }

  public function new() {}

  public function on_next(_:T):Void {}
}

