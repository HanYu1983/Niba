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
  public static function monarchPresets():Array<MonarchPreset> {
    return [
      {id: "m_oda_nobunaga", name: "織田信長"},
      {id: "m_takeda_shingen", name: "武田信玄"},
      {id: "m_tokugawa_ieyasu", name: "德川家康"},
      {id: "m_cao_cao", name: "曹操"},
      {id: "m_liu_bei", name: "劉備"},
      {id: "m_sun_quan", name: "孫權"},
    ];
  }

  public static function monarchIds():Array<MonarchId> {
    var xs:Array<MonarchId> = [];
    for (p in monarchPresets())
      xs.push(p.id);
    return xs;
  }

  public static function monarchName(id:MonarchId):String {
    for (p in monarchPresets())
      if (p.id == id)
        return p.name;
    return id;
  }

  public static function generalPresets():Array<GeneralPreset> {
    // 數值範圍：對齊目前程式常用 10~100（越高越強）
    return [
      // --- 三國（偏智/統/武）---
      gp("g_guan_yu", "關羽", 88, 96, 70, 55, Legendary),
      gp("g_zhang_fei", "張飛", 72, 98, 35, 30, Epic),
      gp("g_zhao_yun", "趙雲", 90, 93, 62, 58, Epic),
      gp("g_zhuge_liang", "諸葛亮", 95, 35, 99, 98, Legendary),
      gp("g_sima_yi", "司馬懿", 92, 45, 97, 90, Epic),
      gp("g_zhou_yu", "周瑜", 88, 60, 96, 82, Epic),
      gp("g_lu_bu", "呂布", 60, 100, 28, 15, Legendary),
      gp("g_zhang_liao", "張遼", 90, 86, 65, 45, Epic),
      gp("g_guo_jia", "郭嘉", 78, 30, 98, 85, Epic),
      gp("g_xun_yu", "荀彧", 72, 25, 92, 95, Epic),
      gp("g_xiahou_dun", "夏侯惇", 82, 87, 40, 35, Fine),
      gp("g_huang_zhong", "黃忠", 75, 88, 45, 40, Fine),
      gp("g_ma_chao", "馬超", 78, 92, 50, 35, Fine),
      gp("g_xu_chu", "許褚", 70, 94, 28, 20, Fine),
      gp("g_jiang_wei", "姜維", 80, 70, 90, 72, Fine),

      // --- 戰國（偏武/統/政）---
      gp("g_honda_tadakatsu", "本多忠勝", 92, 95, 45, 40, Epic),
      gp("g_sanada_yukimura", "真田幸村", 88, 92, 55, 45, Epic),
      gp("g_uesugi_kenshin", "上杉謙信", 96, 85, 70, 62, Legendary),
      gp("g_oda_nobunaga", "織田信長", 88, 72, 85, 90, Epic),
      gp("g_toyotomi_hideyoshi", "豐臣秀吉", 78, 45, 80, 95, Epic),
      gp("g_akechi_mitsuhide", "明智光秀", 75, 40, 88, 85, Fine),
      gp("g_maeda_toshiie", "前田利家", 80, 85, 55, 50, Fine),
      gp("g_ishida_mitsunari", "石田三成", 60, 25, 80, 96, Epic),
      gp("g_date_masamune", "伊達政宗", 86, 88, 70, 55, Epic),
      gp("g_shimazu_yoshihiro", "島津義弘", 90, 85, 55, 45, Epic),
      gp("g_tachibana_muneshige", "立花宗茂", 88, 87, 60, 50, Fine),
      gp("g_kuroda_kanbei", "黑田官兵衛", 80, 35, 95, 88, Epic),
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

  public static function generalName(id:GeneralId):String {
    for (p in generalPresets())
      if (p.id == id)
        return p.name;
    return id;
  }

  static inline function gp(id:GeneralId, name:String, command:Int, might:Int, wit:Int, stewardship:Int, rarity:Rarity):GeneralPreset {
    return {id: id, name: name, command: command, might: might, wit: wit, stewardship: stewardship, rarity: rarity};
  }
}

typedef MonarchPreset = {
  var id:MonarchId;
  var name:String;
};

typedef GeneralPreset = {
  var id:GeneralId;
  var name:String;
  var command:Int;
  var might:Int;
  var wit:Int;
  var stewardship:Int;
  var rarity:Rarity;
};

