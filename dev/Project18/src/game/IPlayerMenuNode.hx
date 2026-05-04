package game;

/**
 * GDD：巢狀選單節點。分枝顯示 caption 並展開 children；葉節點綁定 IPlayerMenuEntry 以驅動實際指令。
 *
 * 慣例（測試與 UI 共用）：
 * - 葉：leaf() 非 null，children() 為空陣列。
 * - 分枝：leaf() 為 null，children() 至少一項。
 * - 表單節點：formWidgets() 非空；若有多個 {@link MenuFormWidget.Button}，送出 {@link IGameMatch#applyMenuLeaf} 前須 {@link #setActivationEntry} 指向被點擊之 {@link IPlayerMenuEntry}。
 */
interface IPlayerMenuNode {
    function caption():String;

    /** 葉節點之條目；分枝節點為 null；表單節點亦可能為 null（動作完全由 {@link #formWidgets} 內 Button 負責）。 */
    function leaf():Null<IPlayerMenuEntry>;

    function children():Array<IPlayerMenuNode>;

    /**
     * 表單嵌件；回傳與節點綁定之陣列（非防衛性複本），UI／測試得就地改寫 Slider／GeneralMultiPick 取值後送結算。
     */
    function formWidgets():Array<MenuFormWidget>;

    /** 表單同節點多 {@link MenuFormWidget.Button} 時必設；結算後由賽局清空。 */
    function activationEntry():Null<IPlayerMenuEntry>;

    function setActivationEntry(value:Null<IPlayerMenuEntry>):Void;
}
