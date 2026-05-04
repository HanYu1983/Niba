package game;

/**
 * GDD：主選單單一列；caption 為當下語境之純展示字串（實作可再套 i18n）。
 * isEnabled==false 時仍可列示，用於「存在但暫不可用」之教學／灰階 UX。
 */
interface IPlayerMenuEntry {
    function kind():PlayerMenuKind;

    function caption():String;

    /** 當前賽局狀態下是否允許進入該分支。 */
    function isEnabled():Bool;

    /** 機械選項鍵（例如 {@link ITileEvent#resolveChoice}／{@link IJiCe#resolveChoice} 所傳入之 leaf 可取此欄）；非選項類葉為 null。 */
    function decisionToken():Null<String>;

    /**
     * UI 於送出與 {@link MenuFormWidget.Slider} 對齊之數值後寫入；{@link IGameMatch#applyMenuLeaf} 讀取後會清空。
     * 鍵與組裝選單時各 Slider 之 {@code fieldId} 一致。
     */
    function formNumericFields():Null<Map<String, Int>>;

    /**
     * UI 於送出 {@link MenuFormWidget.GeneralMultiPick} 勾選結果後寫入；{@link IGameMatch#applyMenuLeaf} 讀取後會清空。
     * 鍵與組裝選單時該元件之 {@code fieldId} 一致。
     */
    function formStringListFields():Null<Map<String, Array<String>>>;

    function setFormNumericFields(value:Null<Map<String, Int>>):Void;

    function setFormStringListFields(value:Null<Map<String, Array<String>>>):Void;
}
