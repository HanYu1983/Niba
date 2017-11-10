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
public const int ID_COUNT = 3;
public const string ID_ant = "ant";
public const string ID_bird = "bird";
public const string ID_snack = "snack";
public static ConfigMonster Get(int key){
switch(key){
case 0: return new ConfigMonster {ID="ant",Name="螞蟻",Item="1",Str=1,Vit=1,Agi=1};
case 1: return new ConfigMonster {ID="bird",Name="小鳥",Item="1",Str=2,Vit=1,Agi=3};
case 2: return new ConfigMonster {ID="snack",Name="蛇",Item="1",Str=3,Vit=3,Agi=2};
default: throw new Exception("");
}}public static ConfigMonster Get(string key){
switch(key){
case "ant": return new ConfigMonster {ID="ant",Name="螞蟻",Item="1",Str=1,Vit=1,Agi=1};
case "bird": return new ConfigMonster {ID="bird",Name="小鳥",Item="1",Str=2,Vit=1,Agi=3};
case "snack": return new ConfigMonster {ID="snack",Name="蛇",Item="1",Str=3,Vit=3,Agi=2};
default: throw new Exception("");
}}}