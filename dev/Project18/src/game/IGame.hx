package game;

import game.GameIds;

/**
 * 根入口：依關卡鍵建立一局 {@link IGameMatch}。
 * 零件工廠方法見 {@link IGameMatch}（須取得賽局後再組立選單／資源視圖等）。
 */
interface IGame {
    /** level_key：關卡／劇本／種子組態之穩定識別（實作側解析並組立棋盤與君主）。 */
    function createGameMatch(level_key:LevelKey):IGameMatch;
}
