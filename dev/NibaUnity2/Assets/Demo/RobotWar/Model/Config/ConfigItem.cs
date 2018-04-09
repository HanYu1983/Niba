using System;
namespace RobotWar{
public class ConfigItem {
public string id { get; set; }
public string name { get; set; }
public string description { get; set; }
public int unitPowerCost { get; set; }
public int moneyCost { get; set; }
public const int ID_COUNT = 5;
public const string ID_1 = "1";
public const string ID_2 = "2";
public const string ID_3 = "3";
public const string ID_4 = "4";
public const string ID_5 = "5";
public static ConfigItem Get(int key){
switch(key){
case 0: return new ConfigItem {id="1",name="漂浮板",description="能在水上以正常速度行走",unitPowerCost=20,moneyCost=1000};
case 1: return new ConfigItem {id="2",name="修理包",description="血量+2000",unitPowerCost=10,moneyCost=1000};
case 2: return new ConfigItem {id="3",name="能量包",description="能量+2000",unitPowerCost=10,moneyCost=1000};
case 3: return new ConfigItem {id="4",name="登山包",description="能在山上以正常速度行走",unitPowerCost=10,moneyCost=1000};
case 4: return new ConfigItem {id="5",name="瞄準鏡",description="1格以上的武器射程+1,命中率+20%",unitPowerCost=20,moneyCost=1000};
default: throw new Exception(key+"");
}}public static ConfigItem Get(string key){
switch(key){
case "1": return new ConfigItem {id="1",name="漂浮板",description="能在水上以正常速度行走",unitPowerCost=20,moneyCost=1000};
case "2": return new ConfigItem {id="2",name="修理包",description="血量+2000",unitPowerCost=10,moneyCost=1000};
case "3": return new ConfigItem {id="3",name="能量包",description="能量+2000",unitPowerCost=10,moneyCost=1000};
case "4": return new ConfigItem {id="4",name="登山包",description="能在山上以正常速度行走",unitPowerCost=10,moneyCost=1000};
case "5": return new ConfigItem {id="5",name="瞄準鏡",description="1格以上的武器射程+1,命中率+20%",unitPowerCost=20,moneyCost=1000};
default: throw new Exception(key);
}}}}