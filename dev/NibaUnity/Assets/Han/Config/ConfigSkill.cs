using System;
public class ConfigSkill {
public string ID { get; set; }
public string Name { get; set; }
public string Description { get; set; }
public string SkillRequire { get; set; }
public string IsRequireWeapon { get; set; }
public string Effect { get; set; }
public string Values { get; set; }
public float TriggerBouns { get; set; }
public const int ID_COUNT = 10;
public const string ID_seiken = "seiken";
public const string ID_tripleKick = "tripleKick";
public const string ID_renzokugen = "renzokugen";
public const string ID_hanngeki = "hanngeki";
public const string ID_tiauci = "tiauci";
public const string ID_zengmianpi = "zengmianpi";
public const string ID_zyuzizan = "zyuzizan";
public const string ID_zihazan = "zihazan";
public const string ID_bukikakuto = "bukikakuto";
public const string ID_bokyoryokuhakai = "bokyoryokuhakai";
public static ConfigSkill Get(int key){
switch(key){
case 0: return new ConfigSkill {ID="seiken",Name="正拳",SkillRequire="karate_5",IsRequireWeapon="1",Effect="atk{0}倍，爆擊率提升{1}百分比",Values="1.2,20"};
case 1: return new ConfigSkill {ID="tripleKick",Name="三段踢",SkillRequire="karate_10",IsRequireWeapon="1",Effect="atk{0}倍，爆擊率提升{1}百分比",Values="1.4,20"};
case 2: return new ConfigSkill {ID="renzokugen",Name="無呼吸連打",SkillRequire="karate_20",IsRequireWeapon="1",Effect="atk{0}倍，爆擊率提升{1}百分比",Values="2,20"};
case 3: return new ConfigSkill {ID="hanngeki",Name="迎擊",SkillRequire="karate_30",Effect="機率修正{0}倍。取消對方的攻擊，並對對方造成{1}倍普攻傷害.",Values="0.2,1.1"};
case 4: return new ConfigSkill {ID="tiauci",Name="調息",SkillRequire="karate_20",Effect="每執行一次互動{0}增加{1}",Values="hp,5%"};
case 5: return new ConfigSkill {ID="zengmianpi",Name="正面劈",SkillRequire="fencingArt_5",IsRequireWeapon="1"};
case 6: return new ConfigSkill {ID="zyuzizan",Name="十字斬",SkillRequire="fencingArt_10",IsRequireWeapon="1"};
case 7: return new ConfigSkill {ID="zihazan",Name="居合斬",SkillRequire="fencingArt_20",IsRequireWeapon="1"};
case 8: return new ConfigSkill {ID="bukikakuto",Name="武器格檔",SkillRequire="fencingArt_10",Effect="機率修正{0}倍。取消對方的攻擊.",Values="0.5"};
case 9: return new ConfigSkill {ID="bokyoryokuhakai",Name="防禦力破壞",SkillRequire="fencingArt_10",Effect="對象防禦力下降{0}倍。",Values="0.1"};
default: throw new Exception("");
}}public static ConfigSkill Get(string key){
switch(key){
case "seiken": return new ConfigSkill {ID="seiken",Name="正拳",SkillRequire="karate_5",IsRequireWeapon="1",Effect="atk{0}倍，爆擊率提升{1}百分比",Values="1.2,20"};
case "tripleKick": return new ConfigSkill {ID="tripleKick",Name="三段踢",SkillRequire="karate_10",IsRequireWeapon="1",Effect="atk{0}倍，爆擊率提升{1}百分比",Values="1.4,20"};
case "renzokugen": return new ConfigSkill {ID="renzokugen",Name="無呼吸連打",SkillRequire="karate_20",IsRequireWeapon="1",Effect="atk{0}倍，爆擊率提升{1}百分比",Values="2,20"};
case "hanngeki": return new ConfigSkill {ID="hanngeki",Name="迎擊",SkillRequire="karate_30",Effect="機率修正{0}倍。取消對方的攻擊，並對對方造成{1}倍普攻傷害.",Values="0.2,1.1"};
case "tiauci": return new ConfigSkill {ID="tiauci",Name="調息",SkillRequire="karate_20",Effect="每執行一次互動{0}增加{1}",Values="hp,5%"};
case "zengmianpi": return new ConfigSkill {ID="zengmianpi",Name="正面劈",SkillRequire="fencingArt_5",IsRequireWeapon="1"};
case "zyuzizan": return new ConfigSkill {ID="zyuzizan",Name="十字斬",SkillRequire="fencingArt_10",IsRequireWeapon="1"};
case "zihazan": return new ConfigSkill {ID="zihazan",Name="居合斬",SkillRequire="fencingArt_20",IsRequireWeapon="1"};
case "bukikakuto": return new ConfigSkill {ID="bukikakuto",Name="武器格檔",SkillRequire="fencingArt_10",Effect="機率修正{0}倍。取消對方的攻擊.",Values="0.5"};
case "bokyoryokuhakai": return new ConfigSkill {ID="bokyoryokuhakai",Name="防禦力破壞",SkillRequire="fencingArt_10",Effect="對象防禦力下降{0}倍。",Values="0.1"};
default: throw new Exception("");
}}}