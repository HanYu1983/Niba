using System;
namespace RobotWar{
public class ConfigUnit {
public string id { get; set; }
public string name { get; set; }
public string description { get; set; }
public int hp { get; set; }
public int en { get; set; }
public int armor { get; set; }
public int speed { get; set; }
public int power { get; set; }
public const int ID_COUNT = 2;
public const string ID_test01 = "test01";
public const string ID_jimu = "jimu";
public static ConfigUnit Get(int key){
switch(key){
case 0: return new ConfigUnit {id="test01",name="試做1號機",hp=100,en=100,armor=10,speed=10,power=100};
case 1: return new ConfigUnit {id="jimu",name="吉姆",hp=50,en=50,armor=5,speed=5,power=50};
default: throw new Exception(key+"");
}}public static ConfigUnit Get(string key){
switch(key){
case "test01": return new ConfigUnit {id="test01",name="試做1號機",hp=100,en=100,armor=10,speed=10,power=100};
case "jimu": return new ConfigUnit {id="jimu",name="吉姆",hp=50,en=50,armor=5,speed=5,power=50};
default: throw new Exception(key);
}}}}