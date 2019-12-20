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
public float CostHot;
public const int ID_COUNT = 1;
public const string ID_105mm = "105mm";
public static ConfigWeapon Get(int key){
switch(key){
case 0: return new ConfigWeapon {Id="105mm",Name="tankPao",MinRange=0.5f,MaxRange=3f,BulletPower=1000f,HostEntities="gdiTank",CostHot=5f};
default: throw new Exception(key+"");
}}public static ConfigWeapon Get(string key){
switch(key){
case "105mm": return new ConfigWeapon {Id="105mm",Name="tankPao",MinRange=0.5f,MaxRange=3f,BulletPower=1000f,HostEntities="gdiTank",CostHot=5f};
default: throw new Exception(key);
}}}}