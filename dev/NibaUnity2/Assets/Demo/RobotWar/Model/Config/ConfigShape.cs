using System;
namespace RobotWar{
public class ConfigShape {
public string id { get; set; }
public string name { get; set; }
public string description { get; set; }
public const int ID_COUNT = 2;
public const string ID_center = "center";
public const string ID_forward = "forward";
public static ConfigShape Get(int key){
switch(key){
case 0: return new ConfigShape {id="center",name="定點中定擴散"};
case 1: return new ConfigShape {id="forward",name="直線"};
default: throw new Exception(key+"");
}}public static ConfigShape Get(string key){
switch(key){
case "center": return new ConfigShape {id="center",name="定點中定擴散"};
case "forward": return new ConfigShape {id="forward",name="直線"};
default: throw new Exception(key);
}}}}