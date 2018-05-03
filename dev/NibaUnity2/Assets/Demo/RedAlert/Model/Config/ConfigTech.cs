using System;
namespace RedAlert{
public struct ConfigTech {
public string Id;
public string Name;
public string Description;
public int Cost;
public string HostEntity;
public string TechDependencies;
public string EffectEntities;
public const int ID_COUNT = 6;
public const string ID_gdiFoundation = "gdiFoundation";
public const string ID_gdiArmorFoundation = "gdiArmorFoundation";
public const string ID_gdiFireTech = "gdiFireTech";
public const string ID_gdiArmorPlus = "gdiArmorPlus";
public const string ID_gdiArmorSpeed = "gdiArmorSpeed";
public const string ID_gdi140mm = "gdi140mm";
public static ConfigTech Get(int key){
switch(key){
case 0: return new ConfigTech {Id="gdiFoundation",Name="GDI basic",HostEntity="gdiHome"};
case 1: return new ConfigTech {Id="gdiArmorFoundation",Name="GDI basic armor",HostEntity="gdiFactory"};
case 2: return new ConfigTech {Id="gdiFireTech",Name="GDI Fire Tech",Description="all bullet type is fire, power + 30",Cost=1000,HostEntity="gdiHome"};
case 3: return new ConfigTech {Id="gdiArmorPlus",Name="GDI Armor",Description="all tank armor power + 30",Cost=2000,HostEntity="gdiFactory"};
case 4: return new ConfigTech {Id="gdiArmorSpeed",Name="GDI Armor Speed",Description="all tank speed + 30",Cost=2000,HostEntity="gdiFactory"};
case 5: return new ConfigTech {Id="gdi140mm",Name="GDI 140 mm",Description="all tank weapon change to 140mm",HostEntity="gdiFactory"};
default: throw new Exception(key+"");
}}public static ConfigTech Get(string key){
switch(key){
case "gdiFoundation": return new ConfigTech {Id="gdiFoundation",Name="GDI basic",HostEntity="gdiHome"};
case "gdiArmorFoundation": return new ConfigTech {Id="gdiArmorFoundation",Name="GDI basic armor",HostEntity="gdiFactory"};
case "gdiFireTech": return new ConfigTech {Id="gdiFireTech",Name="GDI Fire Tech",Description="all bullet type is fire, power + 30",Cost=1000,HostEntity="gdiHome"};
case "gdiArmorPlus": return new ConfigTech {Id="gdiArmorPlus",Name="GDI Armor",Description="all tank armor power + 30",Cost=2000,HostEntity="gdiFactory"};
case "gdiArmorSpeed": return new ConfigTech {Id="gdiArmorSpeed",Name="GDI Armor Speed",Description="all tank speed + 30",Cost=2000,HostEntity="gdiFactory"};
case "gdi140mm": return new ConfigTech {Id="gdi140mm",Name="GDI 140 mm",Description="all tank weapon change to 140mm",HostEntity="gdiFactory"};
default: throw new Exception(key);
}}}}