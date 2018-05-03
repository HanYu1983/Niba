using System;
namespace RedAlert{
public struct ConfigEntity {
public string Id;
public string Name;
public string Description;
public string EntityType;
public int Cost;
public string TechDependencies;
public string ArmorType;
public float ArmorPower;
public int Hp;
public string HostBuilding;
public const int ID_COUNT = -1;
public static ConfigEntity Get(int key){
switch(key){
default: throw new Exception(key+"");
}}public static ConfigEntity Get(string key){
switch(key){
default: throw new Exception(key);
}}}}