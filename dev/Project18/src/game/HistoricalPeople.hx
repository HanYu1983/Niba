package game;

import game.GameIds;
import game.Rarity;

/**
 * 歷史人物名庫（先行建立：GDD 3.2）。
 * - 主公：固定名單（含中/日兩時代）
 * - 武將：固定名單 + 能力值（依常識粗略給值；之後可改成資料檔/程序化生成）
 *
 * 注意：此檔只提供「名庫＋預設數值」，不涉及規則。
 */
class HistoricalPeople {
  /** GDD 3.2.1：可選主公（玩家角色）。 */
  public static function monarchIds():Array<MonarchId> {
    return [
      "織田信長",
      "武田信玄",
      "德川家康",
      "曹操",
      "劉備",
      "孫權",
    ];
  }

  public static function generalPresets():Array<GeneralPreset> {
    // 數值範圍：對齊目前程式常用 10~100（越高越強）
    return [
      // --- 三國（偏智/統/武）---
      gp("關羽", 88, 96, 70, 55, Legendary),
      gp("張飛", 72, 98, 35, 30, Epic),
      gp("趙雲", 90, 93, 62, 58, Epic),
      gp("諸葛亮", 95, 35, 99, 98, Legendary),
      gp("司馬懿", 92, 45, 97, 90, Epic),
      gp("周瑜", 88, 60, 96, 82, Epic),
      gp("呂布", 60, 100, 28, 15, Legendary),
      gp("張遼", 90, 86, 65, 45, Epic),
      gp("郭嘉", 78, 30, 98, 85, Epic),
      gp("荀彧", 72, 25, 92, 95, Epic),
      gp("夏侯惇", 82, 87, 40, 35, Fine),
      gp("黃忠", 75, 88, 45, 40, Fine),
      gp("馬超", 78, 92, 50, 35, Fine),
      gp("許褚", 70, 94, 28, 20, Fine),
      gp("姜維", 80, 70, 90, 72, Fine),

      // --- 戰國（偏武/統/政）---
      gp("本多忠勝", 92, 95, 45, 40, Epic),
      gp("真田幸村", 88, 92, 55, 45, Epic),
      gp("上杉謙信", 96, 85, 70, 62, Legendary),
      gp("織田信長(武將)", 88, 72, 85, 90, Epic),
      gp("豐臣秀吉", 78, 45, 80, 95, Epic),
      gp("明智光秀", 75, 40, 88, 85, Fine),
      gp("前田利家", 80, 85, 55, 50, Fine),
      gp("石田三成", 60, 25, 80, 96, Epic),
      gp("伊達政宗", 86, 88, 70, 55, Epic),
      gp("島津義弘", 90, 85, 55, 45, Epic),
      gp("立花宗茂", 88, 87, 60, 50, Fine),
      gp("黑田官兵衛", 80, 35, 95, 88, Epic),
    ];
  }

  public static function generalIds():Array<GeneralId> {
    var xs:Array<GeneralId> = [];
    for (p in generalPresets())
      xs.push(p.id);
    return xs;
  }

  public static function generalPresetById(id:GeneralId):Null<GeneralPreset> {
    for (p in generalPresets())
      if (p.id == id)
        return p;
    return null;
  }

  static inline function gp(id:GeneralId, command:Int, might:Int, wit:Int, stewardship:Int, rarity:Rarity):GeneralPreset {
    return {id: id, command: command, might: might, wit: wit, stewardship: stewardship, rarity: rarity};
  }
}

typedef GeneralPreset = {
  var id:GeneralId;
  var command:Int;
  var might:Int;
  var wit:Int;
  var stewardship:Int;
  var rarity:Rarity;
};

