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
public const int ID_COUNT = 6;
public const string ID_gdiHome = "gdiHome";
public const string ID_gdiPowerPlent = "gdiPowerPlent";
public const string ID_gdiFactory = "gdiFactory";
public const string ID_gdiTank = "gdiTank";
public const string ID_gdiFireTank = "gdiFireTank";
public const string ID_gdiFireBase = "gdiFireBase";
public static ConfigEntity Get(int key){
switch(key){
case 0: return new ConfigEntity {Id="gdiHome",Name="GDI Home",EntityType="building",Cost=3000,Hp=1000};
case 1: return new ConfigEntity {Id="gdiPowerPlent",Name="GDI 電廠",EntityType="building",Cost=500,TechDependencies="gdiFoundation",HostBuilding="gdiHome"};
case 2: return new ConfigEntity {Id="gdiFactory",Name="GDI Factory",EntityType="building",Cost=1000,TechDependencies="gdiFoundation",HostBuilding="gdiHome"};
case 3: return new ConfigEntity {Id="gdiTank",Name="Tank",EntityType="unit",Cost=700,TechDependencies="gdiArmorFoundation",HostBuilding="gdiFactory"};
case 4: return new ConfigEntity {Id="gdiFireTank",Name="FireTank",EntityType="unit",Cost=1100,TechDependencies="gdiFireTech"};
case 5: return new ConfigEntity {Id="gdiFireBase",Name="炮塔",EntityType="building",Cost=1500,TechDependencies="gdiFoundation"};
default: throw new Exception(key+"");
}}public static ConfigEntity Get(string key){
switch(key){
case "gdiHome": return new ConfigEntity {Id="gdiHome",Name="GDI Home",EntityType="building",Cost=3000,Hp=1000};
case "gdiPowerPlent": return new ConfigEntity {Id="gdiPowerPlent",Name="GDI 電廠",EntityType="building",Cost=500,TechDependencies="gdiFoundation",HostBuilding="gdiHome"};
case "gdiFactory": return new ConfigEntity {Id="gdiFactory",Name="GDI Factory",EntityType="building",Cost=1000,TechDependencies="gdiFoundation",HostBuilding="gdiHome"};
case "gdiTank": return new ConfigEntity {Id="gdiTank",Name="Tank",EntityType="unit",Cost=700,TechDependencies="gdiArmorFoundation",HostBuilding="gdiFactory"};
case "gdiFireTank": return new ConfigEntity {Id="gdiFireTank",Name="FireTank",EntityType="unit",Cost=1100,TechDependencies="gdiFireTech"};
case "gdiFireBase": return new ConfigEntity {Id="gdiFireBase",Name="炮塔",EntityType="building",Cost=1500,TechDependencies="gdiFoundation"};
default: throw new Exception(key);
}}}}