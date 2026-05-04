package game;

/**
 * 嵌於 {@link IPlayerMenuNode} 之表單元件語意；UI 端依 type 繪製滑動條／按鈕，
 * 按鈕結算仍經 {@link IGameMatch#applyMenuLeaf}（必要時附 {@code formNumericFields}）。
 */
enum MenuFormWidget {
    Slider(fieldId:String, label:String, min:Int, max:Int, step:Int);

    /** 表單內按鈕；與一般選單葉共用同一 {@link IPlayerMenuEntry} 結算語意。 */
    Button(entry:IPlayerMenuEntry);
}
