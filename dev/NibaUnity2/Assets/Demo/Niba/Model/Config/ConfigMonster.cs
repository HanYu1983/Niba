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
public const int ID_COUNT = 6;
public const string ID_ant = "ant";
public const string ID_snack = "snack";
public const string ID_bear = "bear";
public const string ID_bird = "bird";
public const string ID_toxinSnack = "toxinSnack";
public const string ID_bigBear = "bigBear";
public static ConfigMonster Get(int key){
switch(key){
case 0: return new ConfigMonster {ID="ant",Name="螞蟻",Terrian="plain,wasteland,desert",Str=10,Vit=10,Agi=10,Dex=10,Int=10,Luc=10};
case 1: return new ConfigMonster {ID="snack",Name="蛇",Terrian="forest,wasteland,desert",Str=20,Vit=20,Agi=20,Dex=20,Int=20,Luc=20};
case 2: return new ConfigMonster {ID="bear",Name="熊",Terrian="forest",Str=30,Vit=30,Agi=30,Dex=30,Int=30,Luc=30};
case 3: return new ConfigMonster {ID="bird",Name="鳥",Terrian="plain,forest",Str=40,Vit=40,Agi=40,Dex=40,Int=40,Luc=40};
case 4: return new ConfigMonster {ID="toxinSnack",Name="毒蛇",Terrian="desert",Str=50,Vit=50,Agi=50,Dex=50,Int=50,Luc=50};
case 5: return new ConfigMonster {ID="bigBear",Name="大熊",Terrian="forest",Str=60,Vit=60,Agi=60,Dex=60,Int=60,Luc=60};
default: throw new Exception(key+"");
}}public static ConfigMonster Get(string key){
switch(key){
case "ant": return new ConfigMonster {ID="ant",Name="螞蟻",Terrian="plain,wasteland,desert",Str=10,Vit=10,Agi=10,Dex=10,Int=10,Luc=10};
case "snack": return new ConfigMonster {ID="snack",Name="蛇",Terrian="forest,wasteland,desert",Str=20,Vit=20,Agi=20,Dex=20,Int=20,Luc=20};
case "bear": return new ConfigMonster {ID="bear",Name="熊",Terrian="forest",Str=30,Vit=30,Agi=30,Dex=30,Int=30,Luc=30};
case "bird": return new ConfigMonster {ID="bird",Name="鳥",Terrian="plain,forest",Str=40,Vit=40,Agi=40,Dex=40,Int=40,Luc=40};
case "toxinSnack": return new ConfigMonster {ID="toxinSnack",Name="毒蛇",Terrian="desert",Str=50,Vit=50,Agi=50,Dex=50,Int=50,Luc=50};
case "bigBear": return new ConfigMonster {ID="bigBear",Name="大熊",Terrian="forest",Str=60,Vit=60,Agi=60,Dex=60,Int=60,Luc=60};
default: throw new Exception(key);
}}}}