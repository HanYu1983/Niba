using System;
namespace WordCard{
public struct ConfigEn2Ch {
public string id;
public string name;
public string description;
public const int ID_COUNT = 3;
public const string ID_good = "good";
public const string ID_middle = "middle";
public const string ID_hard = "hard";
public static ConfigEn2Ch Get(int key){
switch(key){
case 0: return new ConfigEn2Ch {id="good",name="好"};
case 1: return new ConfigEn2Ch {id="middle",name="中間"};
case 2: return new ConfigEn2Ch {id="hard",name="難"};
default: throw new Exception(key+"");
}}public static ConfigEn2Ch Get(string key){
switch(key){
case "good": return new ConfigEn2Ch {id="good",name="好"};
case "middle": return new ConfigEn2Ch {id="middle",name="中間"};
case "hard": return new ConfigEn2Ch {id="hard",name="難"};
default: throw new Exception(key);
}}}}