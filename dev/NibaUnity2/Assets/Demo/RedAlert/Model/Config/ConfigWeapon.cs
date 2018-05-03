using System;
namespace RedAlert{
public struct ConfigWeapon {
public string Id;
public string Name;
public string Description;
public string RangeType;
public float MinRange;
public float MaxRange;
public string BulletType;
public float BulletPower;
public string HostEntities;
public string TechDependencies;
public float CostHot;
public const int ID_COUNT = -1;
public static ConfigWeapon Get(int key){
switch(key){
default: throw new Exception(key+"");
}}public static ConfigWeapon Get(string key){
switch(key){
default: throw new Exception(key);
}}}}