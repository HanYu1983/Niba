using System;
namespace RedAlert{
public struct ConfigEntityType {
public string Id;
public string Name;
public string Description;
public const int ID_COUNT = 4;
public const string ID_building = "building";
public const string ID_unit = "unit";
public const string ID_solider = "solider";
public const string ID_aircraft = "aircraft";
public static ConfigEntityType Get(int key){
switch(key){
case 0: return new ConfigEntityType {Id="building",Name="建物"};
case 1: return new ConfigEntityType {Id="unit",Name="單位"};
case 2: return new ConfigEntityType {Id="solider",Name="士兵"};
case 3: return new ConfigEntityType {Id="aircraft",Name="飛機"};
default: throw new Exception(key+"");
}}public static ConfigEntityType Get(string key){
switch(key){
case "building": return new ConfigEntityType {Id="building",Name="建物"};
case "unit": return new ConfigEntityType {Id="unit",Name="單位"};
case "solider": return new ConfigEntityType {Id="solider",Name="士兵"};
case "aircraft": return new ConfigEntityType {Id="aircraft",Name="飛機"};
default: throw new Exception(key);
}}}}