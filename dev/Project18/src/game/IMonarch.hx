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
}
