using System;
namespace RobotWar{
public class ConfigWeapon {
public string id { get; set; }
public string name { get; set; }
public string description { get; set; }
public int unitPowerCost { get; set; }
public int bulletCount { get; set; }
public string weaponType { get; set; }
public int cost { get; set; }
public float hitRateBonus { get; set; }
public int minRange { get; set; }
public int maxRange { get; set; }
public string shape { get; set; }
public int shapeRange { get; set; }
public int power { get; set; }
public float prepareTime { get; set; }
public string ability { get; set; }
public const int ID_COUNT = 7;
public const string ID_lightSword = "lightSword";
public const string ID_lightGun = "lightGun";
public const string ID_bomb = "bomb";
public const string ID_bomb500kg = "bomb500kg";
public const string ID_bigGun = "bigGun";
public const string ID_bigSword = "bigSword";
public const string ID_handGun = "handGun";
public static ConfigWeapon Get(int key){
switch(key){
case 0: return new ConfigWeapon {id="lightSword",name="光束刀",unitPowerCost=10,weaponType="energy",cost=20,minRange=1,maxRange=1,power=10};
case 1: return new ConfigWeapon {id="lightGun",name="光束鎗",unitPowerCost=10,weaponType="energy",cost=20,minRange=2,maxRange=5,power=10,prepareTime=0.1f};
case 2: return new ConfigWeapon {id="bomb",name="高爆彈",unitPowerCost=20,bulletCount=10,weaponType="bullet",cost=1,minRange=3,maxRange=5,shape="center",shapeRange=3,power=4,prepareTime=0.2f};
case 3: return new ConfigWeapon {id="bomb500kg",name="500KG炸彈x6",unitPowerCost=30,bulletCount=10,weaponType="bullet",cost=1,hitRateBonus=0.05f,minRange=2,maxRange=4,shape="center",shapeRange=3,power=3,prepareTime=0.2f};
case 4: return new ConfigWeapon {id="bigGun",name="粒子砲",unitPowerCost=50,weaponType="energy",cost=50,minRange=2,maxRange=5,shape="forward",shapeRange=3,power=20,prepareTime=0.5f};
case 5: return new ConfigWeapon {id="bigSword",name="大型光束刀",unitPowerCost=15,weaponType="energy",cost=40,minRange=1,maxRange=1,shape="forward",shapeRange=3,power=20,prepareTime=0.05f};
case 6: return new ConfigWeapon {id="handGun",name="手鎗",unitPowerCost=10,weaponType="bullet",cost=1,minRange=2,maxRange=5,power=8,prepareTime=0.1f};
default: throw new Exception(key+"");
}}public static ConfigWeapon Get(string key){
switch(key){
case "lightSword": return new ConfigWeapon {id="lightSword",name="光束刀",unitPowerCost=10,weaponType="energy",cost=20,minRange=1,maxRange=1,power=10};
case "lightGun": return new ConfigWeapon {id="lightGun",name="光束鎗",unitPowerCost=10,weaponType="energy",cost=20,minRange=2,maxRange=5,power=10,prepareTime=0.1f};
case "bomb": return new ConfigWeapon {id="bomb",name="高爆彈",unitPowerCost=20,bulletCount=10,weaponType="bullet",cost=1,minRange=3,maxRange=5,shape="center",shapeRange=3,power=4,prepareTime=0.2f};
case "bomb500kg": return new ConfigWeapon {id="bomb500kg",name="500KG炸彈x6",unitPowerCost=30,bulletCount=10,weaponType="bullet",cost=1,hitRateBonus=0.05f,minRange=2,maxRange=4,shape="center",shapeRange=3,power=3,prepareTime=0.2f};
case "bigGun": return new ConfigWeapon {id="bigGun",name="粒子砲",unitPowerCost=50,weaponType="energy",cost=50,minRange=2,maxRange=5,shape="forward",shapeRange=3,power=20,prepareTime=0.5f};
case "bigSword": return new ConfigWeapon {id="bigSword",name="大型光束刀",unitPowerCost=15,weaponType="energy",cost=40,minRange=1,maxRange=1,shape="forward",shapeRange=3,power=20,prepareTime=0.05f};
case "handGun": return new ConfigWeapon {id="handGun",name="手鎗",unitPowerCost=10,weaponType="bullet",cost=1,minRange=2,maxRange=5,power=8,prepareTime=0.1f};
default: throw new Exception(key);
}}}}