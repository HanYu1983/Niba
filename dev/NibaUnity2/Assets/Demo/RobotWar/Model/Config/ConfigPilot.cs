using System;
namespace RobotWar{
public struct ConfigPilot {
public string id;
public string name;
public string description;
public int fighting;
public int shooting;
public int hitRate;
public int avoidanceRate;
public int technique;
public int lucky;
public const int ID_COUNT = 2;
public const string ID_kira = "kira";
public const string ID_solider1 = "solider1";
public static ConfigPilot Get(int key){
switch(key){
case 0: return new ConfigPilot {id="kira",name="主角",fighting=100,shooting=100,hitRate=100,avoidanceRate=100,technique=100,lucky=100};
case 1: return new ConfigPilot {id="solider1",name="士兵1",fighting=50,shooting=50,hitRate=50,avoidanceRate=50,technique=50,lucky=50};
default: throw new Exception(key+"");
}}public static ConfigPilot Get(string key){
switch(key){
case "kira": return new ConfigPilot {id="kira",name="主角",fighting=100,shooting=100,hitRate=100,avoidanceRate=100,technique=100,lucky=100};
case "solider1": return new ConfigPilot {id="solider1",name="士兵1",fighting=50,shooting=50,hitRate=50,avoidanceRate=50,technique=50,lucky=50};
default: throw new Exception(key);
}}}}