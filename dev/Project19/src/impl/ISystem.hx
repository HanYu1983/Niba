package impl;

/**
 * 系統介面 (System Contract)
 *
 * 把「外部世界發生的事」分發給遊戲內的子系統。
 * EventCenter 將 view / pointer / 流程事件統一轉成 Event;
 * 各 ISystem 實作則依需要實作以下回呼, 不關心事件來源。
 *
 * 對應關係 (view.EventCenter.Event → ISystem):
 *   P5Setup(p5)          → onSetup()
 *   OnClick(id)          → onClick(id)
 *   P5Tick(frameCount)   → onTick(frameCount)
 *   P5MousePressed(x,y)  → onMousePressed(x,y)
 *   P5MouseReleased      → onMouseRelease()
 *   P5MouseMoved(x,y)    → onMouseMoved(x,y)
 *   P5MouseDragged(x,y)  → onMouseDragged(x,y)
 *
 * onSetup / onTick 的分工:
 *   - onSetup: 系統建立時呼叫一次, 用於初始化內部狀態 / 訂閱外部資源。
 *              整個生命週期通常只觸發一次, 不依賴 render frame。
 *   - onTick:  與 render frame 對齊的回呼, 帶 frameCount;
 *              每個 render frame 呼叫一次, 通常用於與顯示 / 動畫同步的更新。
 *
 * 設計慣例:
 *   - 所有 callback 為非破壞性回傳 (Void); 系統若需推送結果, 應透過自己持有的
 *     Subject / EventCenter / World 修改, 而非靠回傳值。
 *   - 介面不限制注入順序; runtime 可依需要多次包裝同一個 System
 *     (例如優先處理輸入, 再跑邏輯, 最後跑動畫)。
 *   - 若實作不需要某個事件, 給空實作即可 (Haxe 沒有 default method,
 *     可考慮在 impl 端寫一個 SystemBase abstract class 提供預設空實作)。
 */
interface ISystem {
	/**
	 * 場上物件被點選時呼叫。
	 *
	 * @param id 被點選物件的 id (對應 FieldObject.id / Machine.id 等)
	 */
	public function onClick(id:String):Void;

	/**
	 * 系統建立後的一次性初始化回呼。
	 *
	 * 通常在 view 端的 P5Setup 完成、或系統被掛入 runtime 後觸發一次,
	 * 實作端可在此訂閱事件來源 / 建立內部資料結構。
	 */
	public function onSetup():Void;

	/**
	 * 一個 render tick (與畫面更新對齊)。
	 *
	 * @param frameCount 目前已累積的 frame 數, 由 P5 / 主迴圈提供
	 */
	public function onTick(frameCount:Int):Void;

	/**
	 * 滑鼠按下。
	 *
	 * @param x 螢幕座標 x (像素)
	 * @param y 螢幕座標 y (像素)
	 */
	public function onMousePressed(x:Float, y:Float):Void;

	/** 滑鼠釋放 (無座標資訊, 與 view.EventCenter.Event.P5MouseReleased 對齊) */
	public function onMouseRelease():Void;

	/**
	 * 滑鼠移動 (未按住任何鍵)。
	 *
	 * @param x 螢幕座標 x (像素)
	 * @param y 螢幕座標 y (像素)
	 */
	public function onMouseMoved(x:Float, y:Float):Void;

	/**
	 * 滑鼠拖曳 (按住按鍵移動)。
	 *
	 * @param x 螢幕座標 x (像素)
	 * @param y 螢幕座標 y (像素)
	 */
	public function onMouseDragged(x:Float, y:Float):Void;
}
