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
public float BuildTime;
public int Energy;
public const int ID_COUNT = 9;
public const string ID_gdiHome = "gdiHome";
public const string ID_gdiPowerPlent = "gdiPowerPlent";
public const string ID_gdiFactory = "gdiFactory";
public const string ID_gdiTank = "gdiTank";
public const string ID_gdiFireTank = "gdiFireTank";
public const string ID_gdiFireBase = "gdiFireBase";
public const string ID_gdiGoldFactory = "gdiGoldFactory";
public const string ID_gdiGoldCollector = "gdiGoldCollector";
public const string ID_105mm = "105mm";
public static ConfigEntity Get(int key){
switch(key){
case 0: return new ConfigEntity {Id="gdiHome",Name="GDI Home",EntityType="building",Cost=3000,Hp=1000,BuildTime=10f,Energy=10};
case 1: return new ConfigEntity {Id="gdiPowerPlent",Name="GDI 電廠",EntityType="building",Cost=500,TechDependencies="gdiFoundation",Hp=500,HostBuilding="gdiHome",BuildTime=3f,Energy=10};
case 2: return new ConfigEntity {Id="gdiFactory",Name="GDI Factory",EntityType="building",Cost=1000,TechDependencies="gdiFoundation",Hp=800,HostBuilding="gdiHome",BuildTime=3f,Energy=-5};
case 3: return new ConfigEntity {Id="gdiTank",Name="Tank",EntityType="unit",Cost=700,TechDependencies="gdiArmorFoundation",Hp=200,HostBuilding="gdiFactory",BuildTime=1f};
case 4: return new ConfigEntity {Id="gdiFireTank",Name="FireTank",EntityType="unit",Cost=1100,TechDependencies="gdiFireTech",Hp=200,HostBuilding="gdiFactory",BuildTime=3f};
case 5: return new ConfigEntity {Id="gdiFireBase",Name="炮塔",EntityType="building",Cost=1500,TechDependencies="gdiFoundation",Hp=500,HostBuilding="gdiHome",BuildTime=3f,Energy=-1};
case 6: return new ConfigEntity {Id="gdiGoldFactory",Name="GDI Gold Factory",EntityType="building",Cost=1500,TechDependencies="gdiFoundation",Hp=800,HostBuilding="gdiHome",BuildTime=3f,Energy=-3};
case 7: return new ConfigEntity {Id="gdiGoldCollector",Name="gdiGoldCollector",EntityType="unit",Cost=700,TechDependencies="gdiFoundation",Hp=500,HostBuilding="gdiFactory",BuildTime=3f};
case 8: return new ConfigEntity {Id="105mm",Name="105mmBullet",EntityType="bullet"};
default: throw new Exception(key+"");
}}public static ConfigEntity Get(string key){
switch(key){
case "gdiHome": return new ConfigEntity {Id="gdiHome",Name="GDI Home",EntityType="building",Cost=3000,Hp=1000,BuildTime=10f,Energy=10};
case "gdiPowerPlent": return new ConfigEntity {Id="gdiPowerPlent",Name="GDI 電廠",EntityType="building",Cost=500,TechDependencies="gdiFoundation",Hp=500,HostBuilding="gdiHome",BuildTime=3f,Energy=10};
case "gdiFactory": return new ConfigEntity {Id="gdiFactory",Name="GDI Factory",EntityType="building",Cost=1000,TechDependencies="gdiFoundation",Hp=800,HostBuilding="gdiHome",BuildTime=3f,Energy=-5};
case "gdiTank": return new ConfigEntity {Id="gdiTank",Name="Tank",EntityType="unit",Cost=700,TechDependencies="gdiArmorFoundation",Hp=200,HostBuilding="gdiFactory",BuildTime=1f};
case "gdiFireTank": return new ConfigEntity {Id="gdiFireTank",Name="FireTank",EntityType="unit",Cost=1100,TechDependencies="gdiFireTech",Hp=200,HostBuilding="gdiFactory",BuildTime=3f};
case "gdiFireBase": return new ConfigEntity {Id="gdiFireBase",Name="炮塔",EntityType="building",Cost=1500,TechDependencies="gdiFoundation",Hp=500,HostBuilding="gdiHome",BuildTime=3f,Energy=-1};
case "gdiGoldFactory": return new ConfigEntity {Id="gdiGoldFactory",Name="GDI Gold Factory",EntityType="building",Cost=1500,TechDependencies="gdiFoundation",Hp=800,HostBuilding="gdiHome",BuildTime=3f,Energy=-3};
case "gdiGoldCollector": return new ConfigEntity {Id="gdiGoldCollector",Name="gdiGoldCollector",EntityType="unit",Cost=700,TechDependencies="gdiFoundation",Hp=500,HostBuilding="gdiFactory",BuildTime=3f};
case "105mm": return new ConfigEntity {Id="105mm",Name="105mmBullet",EntityType="bullet"};
default: throw new Exception(key);
}}}}