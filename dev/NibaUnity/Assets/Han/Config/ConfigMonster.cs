using System;
public class ConfigMonster {
public string ID { get; set; }
public string Name { get; set; }
public string Description { get; set; }
public string Item { get; set; }
public int Str { get; set; }
public int Vit { get; set; }
public int Agi { get; set; }
public int Dex { get; set; }
public int Int { get; set; }
public int Luc { get; set; }
public string Characteristic { get; set; }
public const int ID_COUNT = 4;
public const string ID_ant = "ant";
public const string ID_bird = "bird";
public const string ID_snack = "snack";
public const string ID_bear = "bear";
public static ConfigMonster Get(int key){
switch(key){
case 0: return new ConfigMonster {ID="ant",Name="螞蟻",Str=1,Vit=1,Agi=1,Dex=1,Int=1,Luc=1,Characteristic="fly"};
case 1: return new ConfigMonster {ID="bird",Name="小鳥",Item="feather_10",Str=2,Vit=1,Agi=3,Dex=3,Int=1,Luc=1};
case 2: return new ConfigMonster {ID="snack",Name="蛇",Str=3,Vit=3,Agi=3,Dex=3,Int=1,Luc=1};
case 3: return new ConfigMonster {ID="bear",Name="熊",Str=30,Vit=50,Agi=10,Dex=20,Int=0,Luc=0,Characteristic="boss"};
default: throw new Exception(key+"");
}}public static ConfigMonster Get(string key){
switch(key){
case "ant": return new ConfigMonster {ID="ant",Name="螞蟻",Str=1,Vit=1,Agi=1,Dex=1,Int=1,Luc=1,Characteristic="fly"};
case "bird": return new ConfigMonster {ID="bird",Name="小鳥",Item="feather_10",Str=2,Vit=1,Agi=3,Dex=3,Int=1,Luc=1};
case "snack": return new ConfigMonster {ID="snack",Name="蛇",Str=3,Vit=3,Agi=3,Dex=3,Int=1,Luc=1};
case "bear": return new ConfigMonster {ID="bear",Name="熊",Str=30,Vit=50,Agi=10,Dex=20,Int=0,Luc=0,Characteristic="boss"};
default: throw new Exception(key);
}}}