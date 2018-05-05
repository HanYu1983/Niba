using System;
namespace RedAlert{
public struct ConfigResource {
public string Id;
public string Name;
public string Description;
public int Amount;
public int Value;
public const int ID_COUNT = 2;
public const string ID_gold = "gold";
public const string ID_blueGold = "blueGold";
public static ConfigResource Get(int key){
switch(key){
case 0: return new ConfigResource {Id="gold",Name="gold",Amount=500,Value=100};
case 1: return new ConfigResource {Id="blueGold",Name="blueGold",Amount=500,Value=200};
default: throw new Exception(key+"");
}}public static ConfigResource Get(string key){
switch(key){
case "gold": return new ConfigResource {Id="gold",Name="gold",Amount=500,Value=100};
case "blueGold": return new ConfigResource {Id="blueGold",Name="blueGold",Amount=500,Value=200};
default: throw new Exception(key);
}}}}