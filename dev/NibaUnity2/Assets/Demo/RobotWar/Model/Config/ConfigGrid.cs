using System;
namespace RobotWar{
public class ConfigGrid {
public string id { get; set; }
public string name { get; set; }
public string description { get; set; }
public int cost { get; set; }
public float deffence { get; set; }
public float energy { get; set; }
public const int ID_COUNT = 6;
public const string ID_plain = "plain";
public const string ID_city = "city";
public const string ID_mountain = "mountain";
public const string ID_mori = "mori";
public const string ID_ocean = "ocean";
public const string ID_deepOcean = "deepOcean";
public static ConfigGrid Get(int key){
switch(key){
case 0: return new ConfigGrid {id="plain",name="平原",cost=10,deffence=0f,energy=0f};
case 1: return new ConfigGrid {id="city",name="城市",cost=30,deffence=0.2f,energy=0.1f};
case 2: return new ConfigGrid {id="mountain",name="山脈",cost=50,deffence=0.5f,energy=0f};
case 3: return new ConfigGrid {id="mori",name="森林",cost=30,deffence=0.3f,energy=0f};
case 4: return new ConfigGrid {id="ocean",name="沿海",cost=10,deffence=0.2f,energy=0f};
case 5: return new ConfigGrid {id="deepOcean",name="深海",cost=30,deffence=0.5f,energy=0f};
default: throw new Exception(key+"");
}}public static ConfigGrid Get(string key){
switch(key){
case "plain": return new ConfigGrid {id="plain",name="平原",cost=10,deffence=0f,energy=0f};
case "city": return new ConfigGrid {id="city",name="城市",cost=30,deffence=0.2f,energy=0.1f};
case "mountain": return new ConfigGrid {id="mountain",name="山脈",cost=50,deffence=0.5f,energy=0f};
case "mori": return new ConfigGrid {id="mori",name="森林",cost=30,deffence=0.3f,energy=0f};
case "ocean": return new ConfigGrid {id="ocean",name="沿海",cost=10,deffence=0.2f,energy=0f};
case "deepOcean": return new ConfigGrid {id="deepOcean",name="深海",cost=30,deffence=0.5f,energy=0f};
default: throw new Exception(key);
}}}}