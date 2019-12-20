using System;
namespace Niba{
public struct ConfigNpcMission {
public string ID;
public string Name;
public string Description;
public string Npc;
public int Level;
public string RequireItem;
public string RequireKill;
public string RequireStatus;
public string Reward;
public string Dependency;
public const int ID_COUNT = 3;
public const string ID_0 = "0";
public const string ID_1 = "1";
public const string ID_2 = "2";
public static ConfigNpcMission Get(int key){
switch(key){
case 0: return new ConfigNpcMission {ID="0",Name="請給我12個草",Description="請給我12個草",Npc="guide",Level=0,RequireItem="grass_12",Reward="money_300"};
case 1: return new ConfigNpcMission {ID="1",Name="請給我4個草繩",Description="請給我4個草繩",Npc="guide",Level=0,RequireItem="grassLine_4",Reward="money_300",Dependency="0"};
case 2: return new ConfigNpcMission {ID="2",Name="請給我2個綳帶",Description="請給我2個綳帶",Npc="guide",Level=0,RequireItem="bengdai_2",Reward="money_300",Dependency="1"};
default: throw new Exception(key+"");
}}public static ConfigNpcMission Get(string key){
switch(key){
case "0": return new ConfigNpcMission {ID="0",Name="請給我12個草",Description="請給我12個草",Npc="guide",Level=0,RequireItem="grass_12",Reward="money_300"};
case "1": return new ConfigNpcMission {ID="1",Name="請給我4個草繩",Description="請給我4個草繩",Npc="guide",Level=0,RequireItem="grassLine_4",Reward="money_300",Dependency="0"};
case "2": return new ConfigNpcMission {ID="2",Name="請給我2個綳帶",Description="請給我2個綳帶",Npc="guide",Level=0,RequireItem="bengdai_2",Reward="money_300",Dependency="1"};
default: throw new Exception(key);
}}}}