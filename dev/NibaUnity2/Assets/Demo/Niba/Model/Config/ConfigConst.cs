using System;
namespace Niba{
public struct ConfigConst {
public string ID;
public float Float;
public int Int;
public string String;
public const int ID_COUNT = 3;
public const string ID_moveConsumpation = "moveConsumpation";
public const string ID_workConsumpation = "workConsumpation";
public const string ID_visibleRange = "visibleRange";
public static ConfigConst Get(int key){
switch(key){
case 0: return new ConfigConst {ID="moveConsumpation",Int=20};
case 1: return new ConfigConst {ID="workConsumpation",Int=3};
case 2: return new ConfigConst {ID="visibleRange",Int=2};
default: throw new Exception(key+"");
}}public static ConfigConst Get(string key){
switch(key){
case "moveConsumpation": return new ConfigConst {ID="moveConsumpation",Int=20};
case "workConsumpation": return new ConfigConst {ID="workConsumpation",Int=3};
case "visibleRange": return new ConfigConst {ID="visibleRange",Int=2};
default: throw new Exception(key);
}}}}