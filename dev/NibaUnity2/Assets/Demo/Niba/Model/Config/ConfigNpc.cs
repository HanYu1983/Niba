using System;
namespace Niba{
public struct ConfigNpc {
public string ID;
public string Name;
public string Description;
public const int ID_COUNT = 1;
public const string ID_guide = "guide";
public static ConfigNpc Get(int key){
switch(key){
case 0: return new ConfigNpc {ID="guide",Name="新手指引"};
default: throw new Exception(key+"");
}}public static ConfigNpc Get(string key){
switch(key){
case "guide": return new ConfigNpc {ID="guide",Name="新手指引"};
default: throw new Exception(key);
}}}}