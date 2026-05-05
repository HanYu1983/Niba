package game;

import game.GameIds;
import game.Rarity;

/**
 * GDD：武將為君主麾下之可指派單位；四維數值為規剘共用度量。
 */
interface IGeneral {
    /** 於君主麾下唯一。 */
    function id():GeneralId;

    /** 所屬君主。 */
    function owner():MonarchId;

    /**
     * 讀取指定維度之當前強度。
     * 暫時增益／賽場修正是否反映在返回值中，由實作契約載明。
     */
    function stat(which:GeneralStat):Int;

    /** 體力（策略消耗用）；上限語意由實作決定。 */
    function stamina():Int;

    /** 忠誠度（1~100）。 */
    function loyalty():Int;

    /** 功績（0~∞）。 */
    function merit():Int;

    /** 稀有度。 */
    function rarity():Rarity;
}
