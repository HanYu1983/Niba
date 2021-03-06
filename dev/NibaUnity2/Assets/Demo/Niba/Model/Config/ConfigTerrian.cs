using System;
namespace Niba{
public struct ConfigTerrian {
public string ID;
public string Name;
public string Description;
public string Require;
public int Class;
public string MoveRequire;
public const int ID_COUNT = 12;
public const string ID_wasteland = "wasteland";
public const string ID_frozenSoil = "frozenSoil";
public const string ID_desert = "desert";
public const string ID_iceField = "iceField";
public const string ID_hills = "hills";
public const string ID_plain = "plain";
public const string ID_treeLand = "treeLand";
public const string ID_forest = "forest";
public const string ID_mountant = "mountant";
public const string ID_coast = "coast";
public const string ID_epicontinentalSea = "epicontinentalSea";
public const string ID_deepSea = "deepSea";
public static ConfigTerrian Get(int key){
switch(key){
case 0: return new ConfigTerrian {ID="wasteland",Name="荒地"};
case 1: return new ConfigTerrian {ID="frozenSoil",Name="凍土",Require="symTemperature1",Class=1};
case 2: return new ConfigTerrian {ID="desert",Name="沙漠",Require="symTemperature3",Class=1};
case 3: return new ConfigTerrian {ID="iceField",Name="冰原",Require="grass,symTemperature1",Class=2};
case 4: return new ConfigTerrian {ID="hills",Name="丘陵",Require="symSmallMountain",Class=2};
case 5: return new ConfigTerrian {ID="plain",Name="草原",Require="grass",Class=3};
case 6: return new ConfigTerrian {ID="treeLand",Name="木原",Require="tree",Class=3};
case 7: return new ConfigTerrian {ID="forest",Name="森林",Require="grass,tree",Class=4};
case 8: return new ConfigTerrian {ID="mountant",Name="高山",Require="symSmallMountain_3",Class=5};
case 9: return new ConfigTerrian {ID="coast",Name="沿岸",Require="symWater_1",Class=6};
case 10: return new ConfigTerrian {ID="epicontinentalSea",Name="淺海",Require="symWater_2",Class=7,MoveRequire="woodBoat"};
case 11: return new ConfigTerrian {ID="deepSea",Name="深海",Require="symWater_3",Class=8,MoveRequire="woodBoat,compass"};
default: throw new Exception(key+"");
}}public static ConfigTerrian Get(string key){
switch(key){
case "wasteland": return new ConfigTerrian {ID="wasteland",Name="荒地"};
case "frozenSoil": return new ConfigTerrian {ID="frozenSoil",Name="凍土",Require="symTemperature1",Class=1};
case "desert": return new ConfigTerrian {ID="desert",Name="沙漠",Require="symTemperature3",Class=1};
case "iceField": return new ConfigTerrian {ID="iceField",Name="冰原",Require="grass,symTemperature1",Class=2};
case "hills": return new ConfigTerrian {ID="hills",Name="丘陵",Require="symSmallMountain",Class=2};
case "plain": return new ConfigTerrian {ID="plain",Name="草原",Require="grass",Class=3};
case "treeLand": return new ConfigTerrian {ID="treeLand",Name="木原",Require="tree",Class=3};
case "forest": return new ConfigTerrian {ID="forest",Name="森林",Require="grass,tree",Class=4};
case "mountant": return new ConfigTerrian {ID="mountant",Name="高山",Require="symSmallMountain_3",Class=5};
case "coast": return new ConfigTerrian {ID="coast",Name="沿岸",Require="symWater_1",Class=6};
case "epicontinentalSea": return new ConfigTerrian {ID="epicontinentalSea",Name="淺海",Require="symWater_2",Class=7,MoveRequire="woodBoat"};
case "deepSea": return new ConfigTerrian {ID="deepSea",Name="深海",Require="symWater_3",Class=8,MoveRequire="woodBoat,compass"};
default: throw new Exception(key);
}}}}