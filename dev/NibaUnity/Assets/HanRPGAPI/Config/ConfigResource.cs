using System;
namespace HanRPGAPI{
public class ConfigResource {
public string ID { get; set; }
public string Name { get; set; }
public string Description { get; set; }
public string Item { get; set; }
public const int ID_COUNT = 4;
public const string ID_grass = "grass";
public const string ID_tree = "tree";
public const string ID_stone = "stone";
public const string ID_iron = "iron";
public static ConfigResource Get(int key){
switch(key){
case 0: return new ConfigResource {ID="grass",Name="草",Item="grass_3"};
case 1: return new ConfigResource {ID="tree",Name="樹",Item="wood_1"};
case 2: return new ConfigResource {ID="stone",Name="石",Item="stone_1"};
case 3: return new ConfigResource {ID="iron",Name="鐵礦",Item="iron_1"};
default: throw new Exception(key+"");
}}public static ConfigResource Get(string key){
switch(key){
case "grass": return new ConfigResource {ID="grass",Name="草",Item="grass_3"};
case "tree": return new ConfigResource {ID="tree",Name="樹",Item="wood_1"};
case "stone": return new ConfigResource {ID="stone",Name="石",Item="stone_1"};
case "iron": return new ConfigResource {ID="iron",Name="鐵礦",Item="iron_1"};
default: throw new Exception(key);
}}}}