using System;
namespace RobotWar{
public class ConfigItem {
public string id { get; set; }
public string name { get; set; }
public string description { get; set; }
public int unitPowerCost { get; set; }
public const int ID_COUNT = -1;
public static ConfigItem Get(int key){
switch(key){
default: throw new Exception(key+"");
}}public static ConfigItem Get(string key){
switch(key){
default: throw new Exception(key);
}}}}