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
public const int ID_COUNT = 6;
public const string ID_0 = "0";
public const string ID_1 = "1";
public const string ID_2 = "2";
public const string ID_3 = "3";
public const string ID_4 = "4";
public const string ID_5 = "5";
public static ConfigNpcMission Get(int key){
switch(key){
case 0: return new ConfigNpcMission {ID="0",Name="請給我10個草",Description="請給我10個草",Npc="guide",Level=0,RequireItem="grass_10",Reward="money_300"};
case 1: return new ConfigNpcMission {ID="1",Name="請給我3個木",Description="請給我3個木",Npc="guide",Level=0,RequireItem="wood_3",Reward="woodworkerBook1,money_300",Dependency="0"};
case 2: return new ConfigNpcMission {ID="2",Name="去殺3隻螞蟻",Description="去殺3隻螞蟻",Npc="guide",Level=0,RequireKill="ant_3",Reward="posion,money_300"};
case 3: return new ConfigNpcMission {ID="3",Name="請存到500元",Description="請存到500元",Npc="guide",Level=0,RequireStatus="money_500"};
case 4: return new ConfigNpcMission {ID="4",Name="請將腕力加到20",Description="請將腕力加到20",Npc="guide",Level=0,RequireStatus="str_20"};
case 5: return new ConfigNpcMission {ID="5",Name="請合成木劍1個",Description="請合成木劍1個",Npc="guide",Level=0,RequireStatus="woodSword",Reward="woodBoat"};
default: throw new Exception(key+"");
}}public static ConfigNpcMission Get(string key){
switch(key){
case "0": return new ConfigNpcMission {ID="0",Name="請給我10個草",Description="請給我10個草",Npc="guide",Level=0,RequireItem="grass_10",Reward="money_300"};
case "1": return new ConfigNpcMission {ID="1",Name="請給我3個木",Description="請給我3個木",Npc="guide",Level=0,RequireItem="wood_3",Reward="woodworkerBook1,money_300",Dependency="0"};
case "2": return new ConfigNpcMission {ID="2",Name="去殺3隻螞蟻",Description="去殺3隻螞蟻",Npc="guide",Level=0,RequireKill="ant_3",Reward="posion,money_300"};
case "3": return new ConfigNpcMission {ID="3",Name="請存到500元",Description="請存到500元",Npc="guide",Level=0,RequireStatus="money_500"};
case "4": return new ConfigNpcMission {ID="4",Name="請將腕力加到20",Description="請將腕力加到20",Npc="guide",Level=0,RequireStatus="str_20"};
case "5": return new ConfigNpcMission {ID="5",Name="請合成木劍1個",Description="請合成木劍1個",Npc="guide",Level=0,RequireStatus="woodSword",Reward="woodBoat"};
default: throw new Exception(key);
}}}}