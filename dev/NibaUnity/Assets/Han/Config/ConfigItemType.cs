using System;
public class ConfigItemType {
public string ID { get; set; }
public string Name { get; set; }
public string Description { get; set; }
public const int ID_COUNT = 3;
public const string ID_material = "material";
public const string ID_weapon = "weapon";
public const string ID_support = "support";
public static ConfigItemType Get(int key){
switch(key){
case 0: return new ConfigItemType {ID="material",Name="原料"};
case 1: return new ConfigItemType {ID="weapon",Name="武器"};
case 2: return new ConfigItemType {ID="support",Name="支援"};
default: throw new Exception("");
}}public static ConfigItemType Get(string key){
switch(key){
case "material": return new ConfigItemType {ID="material",Name="原料"};
case "weapon": return new ConfigItemType {ID="weapon",Name="武器"};
case "support": return new ConfigItemType {ID="support",Name="支援"};
default: throw new Exception("");
}}}