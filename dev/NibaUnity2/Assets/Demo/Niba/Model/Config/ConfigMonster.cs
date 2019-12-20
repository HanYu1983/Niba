using System;
namespace Niba{
public struct ConfigMonster {
public string ID;
public string Name;
public string Description;
public string Item;
public string Terrian;
public int Str;
public int Vit;
public int Agi;
public int Dex;
public int Int;
public int Luc;
public string Characteristic;
public int ActiveRate;
public string AppearRate;
public string ItemAppearRate;
public const int ID_COUNT = 8;
public const string ID_ant = "ant";
public const string ID_snack = "snack";
public const string ID_xie = "xie";
public const string ID__unplan_ = "_unplan_";
public const string ID_bear = "bear";
public const string ID_bird = "bird";
public const string ID_toxinSnack = "toxinSnack";
public const string ID_bigBear = "bigBear";
public static ConfigMonster Get(int key){
switch(key){
case 0: return new ConfigMonster {ID="ant",Name="螞蟻",Item="yizhi",Terrian="plain,wasteland,desert",Str=7,Vit=3,Agi=7,Dex=7,Int=7,Luc=7,AppearRate="desert_60",ItemAppearRate="yizhi_80"};
case 1: return new ConfigMonster {ID="snack",Name="蛇",Item="shepi,shedan",Terrian="forest,wasteland,desert",Str=10,Vit=8,Agi=9,Dex=10,Int=12,Luc=7,ActiveRate=5,AppearRate="forest_70",ItemAppearRate="shepi_90,shedan_5"};
case 2: return new ConfigMonster {ID="xie",Name="蟹",Item="xieke",Terrian="coast",Str=13,Vit=15,Agi=5,Dex=10,Int=8,Luc=7,ActiveRate=5,ItemAppearRate="xieke_70"};
case 3: return new ConfigMonster {ID="_unplan_"};
case 4: return new ConfigMonster {ID="bear",Name="熊",Terrian="forest",Str=40,Vit=30,Agi=8,Dex=13,Int=8,Luc=7,ActiveRate=5};
case 5: return new ConfigMonster {ID="bird",Name="鳥",Terrian="plain,forest",Str=15,Vit=5,Agi=30,Dex=30,Int=20,Luc=7,Characteristic="fly"};
case 6: return new ConfigMonster {ID="toxinSnack",Name="毒蛇",Terrian="forest",Str=16,Vit=8,Agi=15,Dex=15,Int=15,Luc=7,ActiveRate=100};
case 7: return new ConfigMonster {ID="bigBear",Name="大熊",Terrian="forest",Str=60,Vit=50,Agi=8,Dex=13,Int=8,Luc=7,ActiveRate=5};
default: throw new Exception(key+"");
}}public static ConfigMonster Get(string key){
switch(key){
case "ant": return new ConfigMonster {ID="ant",Name="螞蟻",Item="yizhi",Terrian="plain,wasteland,desert",Str=7,Vit=3,Agi=7,Dex=7,Int=7,Luc=7,AppearRate="desert_60",ItemAppearRate="yizhi_80"};
case "snack": return new ConfigMonster {ID="snack",Name="蛇",Item="shepi,shedan",Terrian="forest,wasteland,desert",Str=10,Vit=8,Agi=9,Dex=10,Int=12,Luc=7,ActiveRate=5,AppearRate="forest_70",ItemAppearRate="shepi_90,shedan_5"};
case "xie": return new ConfigMonster {ID="xie",Name="蟹",Item="xieke",Terrian="coast",Str=13,Vit=15,Agi=5,Dex=10,Int=8,Luc=7,ActiveRate=5,ItemAppearRate="xieke_70"};
case "_unplan_": return new ConfigMonster {ID="_unplan_"};
case "bear": return new ConfigMonster {ID="bear",Name="熊",Terrian="forest",Str=40,Vit=30,Agi=8,Dex=13,Int=8,Luc=7,ActiveRate=5};
case "bird": return new ConfigMonster {ID="bird",Name="鳥",Terrian="plain,forest",Str=15,Vit=5,Agi=30,Dex=30,Int=20,Luc=7,Characteristic="fly"};
case "toxinSnack": return new ConfigMonster {ID="toxinSnack",Name="毒蛇",Terrian="forest",Str=16,Vit=8,Agi=15,Dex=15,Int=15,Luc=7,ActiveRate=100};
case "bigBear": return new ConfigMonster {ID="bigBear",Name="大熊",Terrian="forest",Str=60,Vit=50,Agi=8,Dex=13,Int=8,Luc=7,ActiveRate=5};
default: throw new Exception(key);
}}}}