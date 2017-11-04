using System;
public class ConfigItem {
public string ID { get; set; }
public string Name { get; set; }
public string Description { get; set; }
public string Type { get; set; }
public int MaxCount { get; set; }
public string FusionRequire { get; set; }
public string SkillRequire { get; set; }
public const int ID_COUNT = 6;
public const string ID_grass = "grass";
public const string ID_wood = "wood";
public const string ID_gravel = "gravel";
public const string ID_feather = "feather";
public const string ID_bred = "bred";
public const string ID_arrows = "arrows";
public static ConfigItem Get(int key){
switch(key){
case 0: return new ConfigItem {ID="grass",Name="草",Type="resource",MaxCount=99};
case 1: return new ConfigItem {ID="wood",Name="木",Type="resource",MaxCount=10};
case 2: return new ConfigItem {ID="gravel",Name="礫石",Type="resource",MaxCount=10};
case 3: return new ConfigItem {ID="feather",Name="羽毛",Type="resource",MaxCount=99};
case 4: return new ConfigItem {ID="bred",Name="木板",Type="resource",MaxCount=10,FusionRequire="wood_3"};
case 5: return new ConfigItem {ID="arrows",Name="箭矢",Type="resource",MaxCount=1,FusionRequire="grass,wood,gravel"};
default: throw new Exception("");
}}public static ConfigItem Get(string key){
switch(key){
case "grass": return new ConfigItem {ID="grass",Name="草",Type="resource",MaxCount=99};
case "wood": return new ConfigItem {ID="wood",Name="木",Type="resource",MaxCount=10};
case "gravel": return new ConfigItem {ID="gravel",Name="礫石",Type="resource",MaxCount=10};
case "feather": return new ConfigItem {ID="feather",Name="羽毛",Type="resource",MaxCount=99};
case "bred": return new ConfigItem {ID="bred",Name="木板",Type="resource",MaxCount=10,FusionRequire="wood_3"};
case "arrows": return new ConfigItem {ID="arrows",Name="箭矢",Type="resource",MaxCount=1,FusionRequire="grass,wood,gravel"};
default: throw new Exception("");
}}}