using System;
public class ConfigItem {
public string ID { get; set; }
public string Name { get; set; }
public string Description { get; set; }
public string Type { get; set; }
public int MaxCount { get; set; }
public string FusionRequire { get; set; }
public string SkillRequire { get; set; }
public string Ability { get; set; }
public string Position { get; set; }
public const int ID_COUNT = 16;
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
public static ConfigItem Get(int key){
switch(key){
case 0: return new ConfigItem {ID="grass",Name="草",Type="material",MaxCount=99};
case 1: return new ConfigItem {ID="wood",Name="木",Type="material",MaxCount=10};
case 2: return new ConfigItem {ID="gravel",Name="礫石",Type="material",MaxCount=10};
case 3: return new ConfigItem {ID="feather",Name="羽毛",Type="material",MaxCount=99};
case 4: return new ConfigItem {ID="bred",Name="木板",Type="material",MaxCount=10,FusionRequire="wood_2"};
case 5: return new ConfigItem {ID="iron",Name="鐵",Type="material",MaxCount=10};
case 6: return new ConfigItem {ID="woodSword",Name="木劍",Type="weapon",MaxCount=1,FusionRequire="wood_3",Ability="atk+2",Position="hand"};
case 7: return new ConfigItem {ID="woodShield",Name="木盾",Type="weapon",MaxCount=1,FusionRequire="wood_3",Ability="def+2",Position="hand"};
case 8: return new ConfigItem {ID="powerRing",Name="加量戒指",Type="weapon",MaxCount=1,Ability="str+2",Position="accessory"};
case 9: return new ConfigItem {ID="ironSword",Name="鐵劍",Type="weapon",MaxCount=1,FusionRequire="iron_2",Ability="atk+4",Position="hand"};
case 10: return new ConfigItem {ID="ironShield",Name="鐵盾",Type="weapon",MaxCount=1,FusionRequire="iron_2",Ability="def+4",Position="hand"};
case 11: return new ConfigItem {ID="arrows",Name="箭矢",Type="weapon",MaxCount=99,FusionRequire="feather,wood,gravel",Position="hand"};
case 12: return new ConfigItem {ID="bigIronSword",Name="雙手劍",Type="weapon",MaxCount=1,FusionRequire="iron_4",Ability="atk+8,dodge-2",Position="hand"};
case 13: return new ConfigItem {ID="nightShield",Name="騎士盾",Type="weapon",MaxCount=1,FusionRequire="iron_4",Ability="def+8",Position="hand"};
case 14: return new ConfigItem {ID="woodKen",Name="木指虎",Type="weapon",MaxCount=1,FusionRequire="wood_1",Ability="atk+1,dodge+2",Position="hand"};
case 15: return new ConfigItem {ID="ironKen",Name="鐵指虎",Type="weapon",MaxCount=1,FusionRequire="iron_2",Ability="atk+3,dodge+2",Position="hand"};
default: throw new Exception("");
}}public static ConfigItem Get(string key){
switch(key){
case "grass": return new ConfigItem {ID="grass",Name="草",Type="material",MaxCount=99};
case "wood": return new ConfigItem {ID="wood",Name="木",Type="material",MaxCount=10};
case "gravel": return new ConfigItem {ID="gravel",Name="礫石",Type="material",MaxCount=10};
case "feather": return new ConfigItem {ID="feather",Name="羽毛",Type="material",MaxCount=99};
case "bred": return new ConfigItem {ID="bred",Name="木板",Type="material",MaxCount=10,FusionRequire="wood_2"};
case "iron": return new ConfigItem {ID="iron",Name="鐵",Type="material",MaxCount=10};
case "woodSword": return new ConfigItem {ID="woodSword",Name="木劍",Type="weapon",MaxCount=1,FusionRequire="wood_3",Ability="atk+2",Position="hand"};
case "woodShield": return new ConfigItem {ID="woodShield",Name="木盾",Type="weapon",MaxCount=1,FusionRequire="wood_3",Ability="def+2",Position="hand"};
case "powerRing": return new ConfigItem {ID="powerRing",Name="加量戒指",Type="weapon",MaxCount=1,Ability="str+2",Position="accessory"};
case "ironSword": return new ConfigItem {ID="ironSword",Name="鐵劍",Type="weapon",MaxCount=1,FusionRequire="iron_2",Ability="atk+4",Position="hand"};
case "ironShield": return new ConfigItem {ID="ironShield",Name="鐵盾",Type="weapon",MaxCount=1,FusionRequire="iron_2",Ability="def+4",Position="hand"};
case "arrows": return new ConfigItem {ID="arrows",Name="箭矢",Type="weapon",MaxCount=99,FusionRequire="feather,wood,gravel",Position="hand"};
case "bigIronSword": return new ConfigItem {ID="bigIronSword",Name="雙手劍",Type="weapon",MaxCount=1,FusionRequire="iron_4",Ability="atk+8,dodge-2",Position="hand"};
case "nightShield": return new ConfigItem {ID="nightShield",Name="騎士盾",Type="weapon",MaxCount=1,FusionRequire="iron_4",Ability="def+8",Position="hand"};
case "woodKen": return new ConfigItem {ID="woodKen",Name="木指虎",Type="weapon",MaxCount=1,FusionRequire="wood_1",Ability="atk+1,dodge+2",Position="hand"};
case "ironKen": return new ConfigItem {ID="ironKen",Name="鐵指虎",Type="weapon",MaxCount=1,FusionRequire="iron_2",Ability="atk+3,dodge+2",Position="hand"};
default: throw new Exception("");
}}}