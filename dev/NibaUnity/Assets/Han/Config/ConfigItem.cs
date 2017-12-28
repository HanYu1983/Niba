using System;
public class ConfigItem {
public string ID { get; set; }
public string Name { get; set; }
public string Description { get; set; }
public string Type { get; set; }
public string SkillType { get; set; }
public int MaxCount { get; set; }
public string FusionRequire { get; set; }
public string SkillRequire { get; set; }
public string Ability { get; set; }
public string Position { get; set; }
public int UseCount { get; set; }
public const int ID_COUNT = 25;
public const string ID_grass = "grass";
public const string ID_wood = "wood";
public const string ID_gravel = "gravel";
public const string ID_feather = "feather";
public const string ID_bred = "bred";
public const string ID_iron = "iron";
public const string ID_woodSword = "woodSword";
public const string ID_woodShield = "woodShield";
public const string ID_powerRing = "powerRing";
public const string ID_ironSword = "ironSword";
public const string ID_ironShield = "ironShield";
public const string ID_arrows = "arrows";
public const string ID_bigIronSword = "bigIronSword";
public const string ID_nightShield = "nightShield";
public const string ID_woodKen = "woodKen";
public const string ID_ironKen = "ironKen";
public const string ID_woodHelmet = "woodHelmet";
public const string ID_woodArmor = "woodArmor";
public const string ID_woodShoe = "woodShoe";
public const string ID_woodworkerBook1 = "woodworkerBook1";
public const string ID_studio = "studio";
public const string ID_ironWork = "ironWork";
public const string ID_buhuku = "buhuku";
public const string ID_bumau = "bumau";
public const string ID_piken = "piken";
public static ConfigItem Get(int key){
switch(key){
case 0: return new ConfigItem {ID="grass",Name="草",Type="material",MaxCount=99};
case 1: return new ConfigItem {ID="wood",Name="木",Type="material",MaxCount=10};
case 2: return new ConfigItem {ID="gravel",Name="礫石",Type="material",MaxCount=10};
case 3: return new ConfigItem {ID="feather",Name="羽毛",Type="material",MaxCount=99};
case 4: return new ConfigItem {ID="bred",Name="木板",Type="material",MaxCount=10,FusionRequire="wood_2"};
case 5: return new ConfigItem {ID="iron",Name="鐵",Type="material",MaxCount=10};
case 6: return new ConfigItem {ID="woodSword",Name="木劍",Type="weapon",SkillType="fencingArt",MaxCount=1,FusionRequire="wood_3",SkillRequire="woodworker_1",Ability="atk+2",Position="hand",UseCount=10};
case 7: return new ConfigItem {ID="woodShield",Name="木盾",Type="weapon",MaxCount=1,FusionRequire="wood_3",SkillRequire="woodworker_2",Ability="def+2",Position="hand",UseCount=10};
case 8: return new ConfigItem {ID="powerRing",Name="加量戒指",Type="weapon",MaxCount=1,Ability="str+2",Position="accessory",UseCount=100};
case 9: return new ConfigItem {ID="ironSword",Name="鐵劍",Type="weapon",SkillType="fencingArt",MaxCount=1,FusionRequire="iron_2",SkillRequire="ironworker_1",Ability="atk+4",Position="hand",UseCount=15};
case 10: return new ConfigItem {ID="ironShield",Name="鐵盾",Type="weapon",MaxCount=1,FusionRequire="iron_2",SkillRequire="ironworker_1",Ability="def+4",Position="hand",UseCount=15};
case 11: return new ConfigItem {ID="arrows",Name="木箭矢",Type="weapon",MaxCount=99,FusionRequire="feather,wood,gravel",Ability="str+1",Position="hand",UseCount=0};
case 12: return new ConfigItem {ID="bigIronSword",Name="雙手劍",Type="weapon",SkillType="fencingArt",MaxCount=1,FusionRequire="iron_4",Ability="atk+8,dodge-2",Position="hand",UseCount=20};
case 13: return new ConfigItem {ID="nightShield",Name="騎士盾",Type="weapon",MaxCount=1,FusionRequire="iron_4",Ability="def+8",Position="hand",UseCount=20};
case 14: return new ConfigItem {ID="woodKen",Name="木指虎",Type="weapon",SkillType="karate",MaxCount=1,FusionRequire="wood_1",Ability="atk+1,dodge+2",Position="hand",UseCount=10};
case 15: return new ConfigItem {ID="ironKen",Name="鐵指虎",Type="weapon",SkillType="karate",MaxCount=1,FusionRequire="iron_2",Ability="atk+3,dodge+2",Position="hand",UseCount=15};
case 16: return new ConfigItem {ID="woodHelmet",Name="木盔",Type="weapon",MaxCount=1,FusionRequire="wood_2",Ability="def+2",Position="head",UseCount=100};
case 17: return new ConfigItem {ID="woodArmor",Name="木甲",Type="weapon",MaxCount=1,FusionRequire="wood_2",Ability="def+4",Position="body",UseCount=100};
case 18: return new ConfigItem {ID="woodShoe",Name="木鞋",Type="weapon",MaxCount=1,FusionRequire="wood_2",Ability="def+1",Position="foot",UseCount=100};
case 19: return new ConfigItem {ID="woodworkerBook1",Name="木工知識1",Type="important",MaxCount=10,Ability="woodworker+1"};
case 20: return new ConfigItem {ID="studio",Name="工作間",Type="important",MaxCount=1,FusionRequire="wood_10,iron_10",SkillRequire="woodworker_3",Ability="woodworker+1"};
case 21: return new ConfigItem {ID="ironWork",Name="鍊鋼廠",Type="important",MaxCount=1,FusionRequire="wood_10,iron_20",SkillRequire="woodworker_5",Ability="ironworker+1"};
case 22: return new ConfigItem {ID="buhuku",Name="布服",Type="weapon",MaxCount=1};
case 23: return new ConfigItem {ID="bumau",Name="布帽",Type="weapon",MaxCount=1};
case 24: return new ConfigItem {ID="piken",Name="皮製拳套",Type="weapon",MaxCount=1};
default: throw new Exception(key+"");
}}public static ConfigItem Get(string key){
switch(key){
case "grass": return new ConfigItem {ID="grass",Name="草",Type="material",MaxCount=99};
case "wood": return new ConfigItem {ID="wood",Name="木",Type="material",MaxCount=10};
case "gravel": return new ConfigItem {ID="gravel",Name="礫石",Type="material",MaxCount=10};
case "feather": return new ConfigItem {ID="feather",Name="羽毛",Type="material",MaxCount=99};
case "bred": return new ConfigItem {ID="bred",Name="木板",Type="material",MaxCount=10,FusionRequire="wood_2"};
case "iron": return new ConfigItem {ID="iron",Name="鐵",Type="material",MaxCount=10};
case "woodSword": return new ConfigItem {ID="woodSword",Name="木劍",Type="weapon",SkillType="fencingArt",MaxCount=1,FusionRequire="wood_3",SkillRequire="woodworker_1",Ability="atk+2",Position="hand",UseCount=10};
case "woodShield": return new ConfigItem {ID="woodShield",Name="木盾",Type="weapon",MaxCount=1,FusionRequire="wood_3",SkillRequire="woodworker_2",Ability="def+2",Position="hand",UseCount=10};
case "powerRing": return new ConfigItem {ID="powerRing",Name="加量戒指",Type="weapon",MaxCount=1,Ability="str+2",Position="accessory",UseCount=100};
case "ironSword": return new ConfigItem {ID="ironSword",Name="鐵劍",Type="weapon",SkillType="fencingArt",MaxCount=1,FusionRequire="iron_2",SkillRequire="ironworker_1",Ability="atk+4",Position="hand",UseCount=15};
case "ironShield": return new ConfigItem {ID="ironShield",Name="鐵盾",Type="weapon",MaxCount=1,FusionRequire="iron_2",SkillRequire="ironworker_1",Ability="def+4",Position="hand",UseCount=15};
case "arrows": return new ConfigItem {ID="arrows",Name="木箭矢",Type="weapon",MaxCount=99,FusionRequire="feather,wood,gravel",Ability="str+1",Position="hand",UseCount=0};
case "bigIronSword": return new ConfigItem {ID="bigIronSword",Name="雙手劍",Type="weapon",SkillType="fencingArt",MaxCount=1,FusionRequire="iron_4",Ability="atk+8,dodge-2",Position="hand",UseCount=20};
case "nightShield": return new ConfigItem {ID="nightShield",Name="騎士盾",Type="weapon",MaxCount=1,FusionRequire="iron_4",Ability="def+8",Position="hand",UseCount=20};
case "woodKen": return new ConfigItem {ID="woodKen",Name="木指虎",Type="weapon",SkillType="karate",MaxCount=1,FusionRequire="wood_1",Ability="atk+1,dodge+2",Position="hand",UseCount=10};
case "ironKen": return new ConfigItem {ID="ironKen",Name="鐵指虎",Type="weapon",SkillType="karate",MaxCount=1,FusionRequire="iron_2",Ability="atk+3,dodge+2",Position="hand",UseCount=15};
case "woodHelmet": return new ConfigItem {ID="woodHelmet",Name="木盔",Type="weapon",MaxCount=1,FusionRequire="wood_2",Ability="def+2",Position="head",UseCount=100};
case "woodArmor": return new ConfigItem {ID="woodArmor",Name="木甲",Type="weapon",MaxCount=1,FusionRequire="wood_2",Ability="def+4",Position="body",UseCount=100};
case "woodShoe": return new ConfigItem {ID="woodShoe",Name="木鞋",Type="weapon",MaxCount=1,FusionRequire="wood_2",Ability="def+1",Position="foot",UseCount=100};
case "woodworkerBook1": return new ConfigItem {ID="woodworkerBook1",Name="木工知識1",Type="important",MaxCount=10,Ability="woodworker+1"};
case "studio": return new ConfigItem {ID="studio",Name="工作間",Type="important",MaxCount=1,FusionRequire="wood_10,iron_10",SkillRequire="woodworker_3",Ability="woodworker+1"};
case "ironWork": return new ConfigItem {ID="ironWork",Name="鍊鋼廠",Type="important",MaxCount=1,FusionRequire="wood_10,iron_20",SkillRequire="woodworker_5",Ability="ironworker+1"};
case "buhuku": return new ConfigItem {ID="buhuku",Name="布服",Type="weapon",MaxCount=1};
case "bumau": return new ConfigItem {ID="bumau",Name="布帽",Type="weapon",MaxCount=1};
case "piken": return new ConfigItem {ID="piken",Name="皮製拳套",Type="weapon",MaxCount=1};
default: throw new Exception(key);
}}}