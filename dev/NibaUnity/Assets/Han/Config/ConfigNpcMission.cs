using System;
public class ConfigNpcMission {
public string ID { get; set; }
public string Npc { get; set; }
public int Level { get; set; }
public string RequireItem { get; set; }
public string RequireKill { get; set; }
public string RequireStatus { get; set; }
public string Reward { get; set; }
public string Dependency { get; set; }
public string Dialog { get; set; }
public const int ID_COUNT = 21;
public const string ID_0 = "0";
public const string ID_1 = "1";
public const string ID_2 = "2";
public const string ID_3 = "3";
public const string ID_4 = "4";
public const string ID_5 = "5";
public const string ID_6 = "6";
public const string ID_7 = "7";
public const string ID_8 = "8";
public const string ID_9 = "9";
public const string ID_10 = "10";
public const string ID_11 = "11";
public const string ID_12 = "12";
public const string ID_13 = "13";
public const string ID_14 = "14";
public const string ID_15 = "15";
public const string ID_16 = "16";
public const string ID_17 = "17";
public const string ID_18 = "18";
public const string ID_19 = "19";
public const string ID_20 = "20";
public static ConfigNpcMission Get(int key){
switch(key){
case 0: return new ConfigNpcMission {ID="0",Npc="guide",Level=0,RequireItem="grass_10",Dialog="幫我拿10個草"};
case 1: return new ConfigNpcMission {ID="1",Npc="guide",Level=0,RequireItem="wood_10",Reward="woodworkerBook1",Dependency="0",Dialog="幫我拿10個木"};
case 2: return new ConfigNpcMission {ID="2",Npc="guide",Level=0,RequireKill="ant_10",Dialog="幫殺10隻螞蟻"};
case 3: return new ConfigNpcMission {ID="3",Npc="guide",Level=1,RequireStatus="money_1000",Dialog="請存到1000元"};
case 4: return new ConfigNpcMission {ID="4",Npc="guide",Level=1,RequireStatus="atk_100",Dialog="請將攻擊力加到100"};
case 5: return new ConfigNpcMission {ID="5"};
case 6: return new ConfigNpcMission {ID="6"};
case 7: return new ConfigNpcMission {ID="7"};
case 8: return new ConfigNpcMission {ID="8"};
case 9: return new ConfigNpcMission {ID="9"};
case 10: return new ConfigNpcMission {ID="10"};
case 11: return new ConfigNpcMission {ID="11"};
case 12: return new ConfigNpcMission {ID="12"};
case 13: return new ConfigNpcMission {ID="13"};
case 14: return new ConfigNpcMission {ID="14"};
case 15: return new ConfigNpcMission {ID="15"};
case 16: return new ConfigNpcMission {ID="16"};
case 17: return new ConfigNpcMission {ID="17"};
case 18: return new ConfigNpcMission {ID="18"};
case 19: return new ConfigNpcMission {ID="19"};
case 20: return new ConfigNpcMission {ID="20"};
default: throw new Exception(key+"");
}}public static ConfigNpcMission Get(string key){
switch(key){
case "0": return new ConfigNpcMission {ID="0",Npc="guide",Level=0,RequireItem="grass_10",Dialog="幫我拿10個草"};
case "1": return new ConfigNpcMission {ID="1",Npc="guide",Level=0,RequireItem="wood_10",Reward="woodworkerBook1",Dependency="0",Dialog="幫我拿10個木"};
case "2": return new ConfigNpcMission {ID="2",Npc="guide",Level=0,RequireKill="ant_10",Dialog="幫殺10隻螞蟻"};
case "3": return new ConfigNpcMission {ID="3",Npc="guide",Level=1,RequireStatus="money_1000",Dialog="請存到1000元"};
case "4": return new ConfigNpcMission {ID="4",Npc="guide",Level=1,RequireStatus="atk_100",Dialog="請將攻擊力加到100"};
case "5": return new ConfigNpcMission {ID="5"};
case "6": return new ConfigNpcMission {ID="6"};
case "7": return new ConfigNpcMission {ID="7"};
case "8": return new ConfigNpcMission {ID="8"};
case "9": return new ConfigNpcMission {ID="9"};
case "10": return new ConfigNpcMission {ID="10"};
case "11": return new ConfigNpcMission {ID="11"};
case "12": return new ConfigNpcMission {ID="12"};
case "13": return new ConfigNpcMission {ID="13"};
case "14": return new ConfigNpcMission {ID="14"};
case "15": return new ConfigNpcMission {ID="15"};
case "16": return new ConfigNpcMission {ID="16"};
case "17": return new ConfigNpcMission {ID="17"};
case "18": return new ConfigNpcMission {ID="18"};
case "19": return new ConfigNpcMission {ID="19"};
case "20": return new ConfigNpcMission {ID="20"};
default: throw new Exception(key);
}}}