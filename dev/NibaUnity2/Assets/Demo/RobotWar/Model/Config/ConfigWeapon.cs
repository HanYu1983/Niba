using System;
namespace RobotWar{
public class ConfigWeapon {
public string id { get; set; }
public string name { get; set; }
public string description { get; set; }
public int unitPowerCost { get; set; }
public string bulletType { get; set; }
public string weaponType { get; set; }
public int cost { get; set; }
public int useTime { get; set; }
public int minRange { get; set; }
public int maxRange { get; set; }
public string shape { get; set; }
public int HEPower { get; set; }
public int ATPower { get; set; }
public int prepareTime { get; set; }
public string ability { get; set; }
public const int ID_COUNT = -1;
public static ConfigWeapon Get(int key){
switch(key){
default: throw new Exception(key+"");
}}public static ConfigWeapon Get(string key){
switch(key){
default: throw new Exception(key);
}}}}