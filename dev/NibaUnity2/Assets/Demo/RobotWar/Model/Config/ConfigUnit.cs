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
public const int ID_COUNT = -1;
public static ConfigUnit Get(int key){
switch(key){
default: throw new Exception(key+"");
}}public static ConfigUnit Get(string key){
switch(key){
default: throw new Exception(key);
}}}}