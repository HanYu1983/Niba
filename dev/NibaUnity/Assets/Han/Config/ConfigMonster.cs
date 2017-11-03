using System;
public class ConfigMonster {
public string ID { get; set; }
public string Name { get; set; }
public string Description { get; set; }
public string Item { get; set; }
public int Atk { get; set; }
public int Def { get; set; }
public int Spd { get; set; }
public const int ID_COUNT = 3;
public const string ID_ant = "ant";
public const string ID_bird = "bird";
public const string ID_snack = "snack";
public static ConfigMonster Get(int key){
switch(key){
case 0: return new ConfigMonster {ID="ant",Name="螞蟻",Item="1",Atk=1,Def=1,Spd=1};
case 1: return new ConfigMonster {ID="bird",Name="小鳥",Item="1",Atk=2,Def=1,Spd=3};
case 2: return new ConfigMonster {ID="snack",Name="蛇",Item="1",Atk=3,Def=3,Spd=2};
default: throw new Exception("");
}}public static ConfigMonster Get(string key){
switch(key){
case "ant": return new ConfigMonster {ID="ant",Name="螞蟻",Item="1",Atk=1,Def=1,Spd=1};
case "bird": return new ConfigMonster {ID="bird",Name="小鳥",Item="1",Atk=2,Def=1,Spd=3};
case "snack": return new ConfigMonster {ID="snack",Name="蛇",Item="1",Atk=3,Def=3,Spd=2};
default: throw new Exception("");
}}}