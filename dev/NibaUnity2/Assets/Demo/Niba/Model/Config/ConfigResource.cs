using System;
namespace Niba{
public struct ConfigResource {
public string ID;
public string Name;
public string Description;
public string Item;
public int UseCount;
public const int ID_COUNT = 10;
public const string ID_grass = "grass";
public const string ID_tree = "tree";
public const string ID_stone = "stone";
public const string ID_iron = "iron";
public const string ID_water = "water";
public const string ID_symTemperature1 = "symTemperature1";
public const string ID_symTemperature2 = "symTemperature2";
public const string ID_symTemperature3 = "symTemperature3";
public const string ID_symSmallMountain = "symSmallMountain";
public const string ID_symWater = "symWater";
public static ConfigResource Get(int key){
switch(key){
case 0: return new ConfigResource {ID="grass",Name="草",Item="grass_3",UseCount=3};
case 1: return new ConfigResource {ID="tree",Name="樹",Item="wood_1",UseCount=3};
case 2: return new ConfigResource {ID="stone",Name="石",Item="stone_1",UseCount=3};
case 3: return new ConfigResource {ID="iron",Name="鐵礦",Item="iron_1",UseCount=3};
case 4: return new ConfigResource {ID="water",Name="水",Item="water_3",UseCount=3};
case 5: return new ConfigResource {ID="symTemperature1",Name="低溫"};
case 6: return new ConfigResource {ID="symTemperature2",Name="適溫"};
case 7: return new ConfigResource {ID="symTemperature3",Name="高溫"};
case 8: return new ConfigResource {ID="symSmallMountain",Name="小山丘"};
case 9: return new ConfigResource {ID="symWater"};
default: throw new Exception(key+"");
}}public static ConfigResource Get(string key){
switch(key){
case "grass": return new ConfigResource {ID="grass",Name="草",Item="grass_3",UseCount=3};
case "tree": return new ConfigResource {ID="tree",Name="樹",Item="wood_1",UseCount=3};
case "stone": return new ConfigResource {ID="stone",Name="石",Item="stone_1",UseCount=3};
case "iron": return new ConfigResource {ID="iron",Name="鐵礦",Item="iron_1",UseCount=3};
case "water": return new ConfigResource {ID="water",Name="水",Item="water_3",UseCount=3};
case "symTemperature1": return new ConfigResource {ID="symTemperature1",Name="低溫"};
case "symTemperature2": return new ConfigResource {ID="symTemperature2",Name="適溫"};
case "symTemperature3": return new ConfigResource {ID="symTemperature3",Name="高溫"};
case "symSmallMountain": return new ConfigResource {ID="symSmallMountain",Name="小山丘"};
case "symWater": return new ConfigResource {ID="symWater"};
default: throw new Exception(key);
}}}}