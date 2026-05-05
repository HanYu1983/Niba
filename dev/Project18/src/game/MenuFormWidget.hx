package game;

/**
 * 嵌於 {@link IPlayerMenuNode} 之表單元件語意；UI 依序繪製並可在送出前 **就地改寫** enum 取值（如 {@link Slider} 之 {@code value}、{@link GeneralMultiPick} 之 {@code selectedGeneralIds}）。
 * 結算經 {@link IGameMatch#applyMenuLeaf} 傳入 **含已修改 widgets 之節點**；同節點有多個 {@link Button} 時須 {@link IPlayerMenuNode#setActivationEntry} 標記所按之葉。
 */
enum MenuFormWidget {
    /** 數值須落於 [min,max]；送出前 UI 將 {@code value} 設為玩家設定值。 */
    Slider(label:String, min:Int, max:Int, step:Int, value:Int);

    Button(entry:IPlayerMenuEntry);

    /**
     * 送出前 UI 將 {@code selectedMonarchIds} 設為選取結果；目前約定為「單選」（陣列長度須為 1）。
     * 用於計策/事件等需要玩家指定目標君主之表單。
     */
    MonarchSinglePick(label:String, choices:Array<MenuMonarchChoice>, selectedMonarchIds:Array<String>);

    /** 送出前 UI 將 {@code selectedGeneralIds} 設為勾選結果（順序保留）。 */
    GeneralMultiPick(label:String, choices:Array<MenuGeneralChoice>, selectedGeneralIds:Array<String>);

    /**
     * 指定格子：送出前 UI 將 {@code selectedTileIndexes} 設為選取結果；目前約定為「單選」（陣列長度須為 1）。
     */
    TileSinglePick(label:String, choices:Array<MenuTileChoice>, selectedTileIndexes:Array<Int>);
}
