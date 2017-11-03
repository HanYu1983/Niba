using System;
public class ConfigResource {
public string ID { get; set; }
public string Name { get; set; }
public string Description { get; set; }
public string Item { get; set; }
public const int ID_COUNT = 3;
public const string ID_grass = "grass";
public const string ID_tree = "tree";
public const string ID_stone = "stone";
public static ConfigResource Get(int key){
switch(key){
case 0: return new ConfigResource {ID="grass",Name="草",Item="grass"};
case 1: return new ConfigResource {ID="tree",Name="樹",Item="wood"};
case 2: return new ConfigResource {ID="stone",Name="石",Item="stone"};
default: throw new Exception("");
}}public static ConfigResource Get(string key){
switch(key){
case "grass": return new ConfigResource {ID="grass",Name="草",Item="grass"};
case "tree": return new ConfigResource {ID="tree",Name="樹",Item="wood"};
case "stone": return new ConfigResource {ID="stone",Name="石",Item="stone"};
default: throw new Exception("");
}}}