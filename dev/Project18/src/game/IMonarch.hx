package game;

import game.GameIds;

/**
 * GDD：君主即玩家席位；每位君主輪流行軍並結算停留格。
 * 開局麾下固定三名武將（規剘允許後續變動時仍沿用 roster 視圖）。
 */
interface IMonarch {
    /** 君主辨識，等同玩家鍵。 */
    function id():MonarchId;

    /**
     * 座位順序 0…3；決定起手方位與回合輪換順序。
     * 與棋盤幾何／起手索引對齊方式由規剘記述。
     */
    function seat():Int;

    /** 環狀棋盤上代表棋子當前停留之索引。 */
    function pawnIndex():TileIndex;

    /** 麾下武將列表（開局語意為長度三）。 */
    function roster():Array<IGeneral>;

    /** 當前兵力（規剘整數刻度）。 */
    function troops():Int;

    /** 當前糧食（規剘整數刻度）。 */
    function grain():Int;

    /** 聲望（0~100，規剘刻度；影響招募/外交等後續系統）。 */
    function prestige():Int;

    /**
     * 規剘/事件結算：增加兵力（不得為負）。
     * 備註：此為「對局進行中」必要的可變動操作，不是測試專用 force API。
     */
    function grantTroops(n:Int):Void;

    /**
     * 規剘/事件結算：增加糧食（不得為負）。
     * 備註：此為「對局進行中」必要的可變動操作，不是測試專用 force API。
     */
    function grantGrain(n:Int):Void;

    /** 規剘/事件結算：增加聲望（不得為負；上限由實作約束）。 */
    function grantPrestige(n:Int):Void;
}
