using System;
namespace RobotWar{
public class ConfigWeapon {
public string id { get; set; }
public string name { get; set; }
public string description { get; set; }
public int unitPowerCost { get; set; }
public string bulletType { get; set; }
public string weaponType { get; set; }
public int cost { get; set; }
public int useTime { get; set; }
public int minRange { get; set; }
public int maxRange { get; set; }
public string shape { get; set; }
public int HEPower { get; set; }
public int ATPower { get; set; }
public int prepareTime { get; set; }
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
case 0: return new ConfigWeapon {id="lightSword",name="光束刀",unitPowerCost=10,bulletType="HE",weaponType="energy",cost=20,useTime=1,minRange=1,maxRange=1,HEPower=0,ATPower=10,prepareTime=0};
case 1: return new ConfigWeapon {id="lightGun",name="光束鎗",unitPowerCost=10,bulletType="HE",weaponType="energy",cost=20,useTime=1,minRange=2,maxRange=5,HEPower=0,ATPower=10,prepareTime=10};
case 2: return new ConfigWeapon {id="bomb",name="高爆彈",unitPowerCost=20,bulletType="AT",weaponType="bullet",cost=1,useTime=1,minRange=3,maxRange=5,shape="center_3",HEPower=10,ATPower=4,prepareTime=20};
case 3: return new ConfigWeapon {id="bomb500kg",name="500KG炸彈x6",unitPowerCost=30,bulletType="HE",weaponType="bullet",cost=1,useTime=6,minRange=1,maxRange=1,shape="center_3",HEPower=5,ATPower=3,prepareTime=20};
case 4: return new ConfigWeapon {id="bigGun",name="粒子砲",unitPowerCost=50,bulletType="HE",weaponType="energy",cost=50,useTime=1,minRange=2,maxRange=5,shape="forward_1",HEPower=0,ATPower=20,prepareTime=50};
case 5: return new ConfigWeapon {id="bigSword",name="大型光束刀",unitPowerCost=15,bulletType="HE",weaponType="energy",cost=40,useTime=1,minRange=1,maxRange=1,shape="forward_3",HEPower=0,ATPower=20,prepareTime=5};
case 6: return new ConfigWeapon {id="handGun",name="手鎗",unitPowerCost=10,bulletType="AT",weaponType="bullet",cost=1,useTime=1,minRange=2,maxRange=5,HEPower=0,ATPower=8,prepareTime=10};
default: throw new Exception(key+"");
}}public static ConfigWeapon Get(string key){
switch(key){
case "lightSword": return new ConfigWeapon {id="lightSword",name="光束刀",unitPowerCost=10,bulletType="HE",weaponType="energy",cost=20,useTime=1,minRange=1,maxRange=1,HEPower=0,ATPower=10,prepareTime=0};
case "lightGun": return new ConfigWeapon {id="lightGun",name="光束鎗",unitPowerCost=10,bulletType="HE",weaponType="energy",cost=20,useTime=1,minRange=2,maxRange=5,HEPower=0,ATPower=10,prepareTime=10};
case "bomb": return new ConfigWeapon {id="bomb",name="高爆彈",unitPowerCost=20,bulletType="AT",weaponType="bullet",cost=1,useTime=1,minRange=3,maxRange=5,shape="center_3",HEPower=10,ATPower=4,prepareTime=20};
case "bomb500kg": return new ConfigWeapon {id="bomb500kg",name="500KG炸彈x6",unitPowerCost=30,bulletType="HE",weaponType="bullet",cost=1,useTime=6,minRange=1,maxRange=1,shape="center_3",HEPower=5,ATPower=3,prepareTime=20};
case "bigGun": return new ConfigWeapon {id="bigGun",name="粒子砲",unitPowerCost=50,bulletType="HE",weaponType="energy",cost=50,useTime=1,minRange=2,maxRange=5,shape="forward_1",HEPower=0,ATPower=20,prepareTime=50};
case "bigSword": return new ConfigWeapon {id="bigSword",name="大型光束刀",unitPowerCost=15,bulletType="HE",weaponType="energy",cost=40,useTime=1,minRange=1,maxRange=1,shape="forward_3",HEPower=0,ATPower=20,prepareTime=5};
case "handGun": return new ConfigWeapon {id="handGun",name="手鎗",unitPowerCost=10,bulletType="AT",weaponType="bullet",cost=1,useTime=1,minRange=2,maxRange=5,HEPower=0,ATPower=8,prepareTime=10};
default: throw new Exception(key);
}}}}