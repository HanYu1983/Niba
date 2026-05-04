package game;

/**
 * GDD：巢狀選單節點。分枝顯示 caption 並展開 children；葉節點綁定 IPlayerMenuEntry 以驅動實際指令。
 *
 * 慣例（測試與 UI 共用）：
 * - 葉：leaf() 非 null，children() 為空陣列。
 * - 分枝：leaf() 為 null，children() 至少一項。
 */
interface IPlayerMenuNode {
    function caption():String;

    /** 葉節點之條目；分枝節點為 null。 */
    function leaf():Null<IPlayerMenuEntry>;

    function children():Array<IPlayerMenuNode>;

    /**
     * 表單／複合節點專用之嵌件（滑桿等）；無則空陣列。
     * 慣例：同節點若帶 {@link #formWidgets}，多為 leaf=null 且 children 可空。
     */
    function formWidgets():Array<MenuFormWidget>;
}
