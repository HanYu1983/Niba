package game;

/**
 * 嵌於 {@link IPlayerMenuNode} 之表單元件語意；UI 端依 type 繪製滑動條／按鈕，
 * 按鈕結算仍經 {@link IGameMatch#applyMenuLeaf}（必要時附 {@code formNumericFields}／{@code formStringListFields}）。
 */
enum MenuFormWidget {
    /** UI 初始游標位置；須落於 [min,max]（賽局組裝時應已夾限）。 */
    Slider(fieldId:String, label:String, min:Int, max:Int, step:Int, defaultValue:Int);

    /** 表單內按鈕；與一般選單葉共用同一 {@link IPlayerMenuEntry} 結算語意。 */
    Button(entry:IPlayerMenuEntry);

    /**
     * 武將複選（勾選框）；{@code defaultSelectedGeneralIds} 為 UI 預設勾選（通常為城中既有駐將，且應為候選之子集）。
     * 結算時附 {@code formStringListFields} 鍵為 {@code fieldId}，值為選中 id 列表（順序保留）。
     */
    GeneralMultiPick(fieldId:String, label:String, choices:Array<MenuGeneralChoice>, defaultSelectedGeneralIds:Array<String>);
}
