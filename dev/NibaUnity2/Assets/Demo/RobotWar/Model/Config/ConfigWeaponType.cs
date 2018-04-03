using System;
namespace RobotWar{
public class ConfigWeaponType {
public string id { get; set; }
public string name { get; set; }
public string description { get; set; }
public const int ID_COUNT = 2;
public const string ID_energy = "energy";
public const string ID_bullet = "bullet";
public static ConfigWeaponType Get(int key){
switch(key){
case 0: return new ConfigWeaponType {id="energy",name="能量"};
case 1: return new ConfigWeaponType {id="bullet",name="彈藥"};
default: throw new Exception(key+"");
}}public static ConfigWeaponType Get(string key){
switch(key){
case "energy": return new ConfigWeaponType {id="energy",name="能量"};
case "bullet": return new ConfigWeaponType {id="bullet",name="彈藥"};
default: throw new Exception(key);
}}}}