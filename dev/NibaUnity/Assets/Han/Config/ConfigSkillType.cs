using System;
public class ConfigSkillType {
public string ID { get; set; }
public string Name { get; set; }
public string Description { get; set; }
public const int ID_COUNT = 5;
public const string ID_tailor = "tailor";
public const string ID_woodworker = "woodworker";
public const string ID_ironworker = "ironworker";
public const string ID_fencingArt = "fencingArt";
public const string ID_karate = "karate";
public static ConfigSkillType Get(int key){
switch(key){
case 0: return new ConfigSkillType {ID="tailor",Name="裁縫"};
case 1: return new ConfigSkillType {ID="woodworker",Name="木工"};
case 2: return new ConfigSkillType {ID="ironworker",Name="鐵匠"};
case 3: return new ConfigSkillType {ID="fencingArt",Name="劍術"};
case 4: return new ConfigSkillType {ID="karate",Name="拳術"};
default: throw new Exception("");
}}public static ConfigSkillType Get(string key){
switch(key){
case "tailor": return new ConfigSkillType {ID="tailor",Name="裁縫"};
case "woodworker": return new ConfigSkillType {ID="woodworker",Name="木工"};
case "ironworker": return new ConfigSkillType {ID="ironworker",Name="鐵匠"};
case "fencingArt": return new ConfigSkillType {ID="fencingArt",Name="劍術"};
case "karate": return new ConfigSkillType {ID="karate",Name="拳術"};
default: throw new Exception("");
}}}