using System;
namespace HanRPGAPI{
public struct ConfigItem {
public string ID;
public string Name;
public string Description;
public string Type;
public string SkillType;
public int MaxCount;
public string FusionRequire;
public string SkillRequire;
public string Ability;
public string Position;
public int UseCount;
public const int ID_COUNT = 11;
public const string ID_grass = "grass";
public const string ID_wood = "wood";
public const string ID_stone = "stone";
public const string ID_iron = "iron";
public const string ID_grassHat = "grassHat";
public const string ID_grassBody = "grassBody";
public const string ID_grassShoe = "grassShoe";
public const string ID_grassKen = "grassKen";
public const string ID_woodSword = "woodSword";
public const string ID_woodBoat = "woodBoat";
public const string ID_compass = "compass";
public static ConfigItem Get(int key){
switch(key){
case 0: return new ConfigItem {ID="grass",Name="草",Type="material",SkillType="tailor",MaxCount=99};
case 1: return new ConfigItem {ID="wood",Name="木",Type="material",SkillType="woodworker",MaxCount=10};
case 2: return new ConfigItem {ID="stone",Name="石",Type="material",SkillType="ironworker",MaxCount=10};
case 3: return new ConfigItem {ID="iron",Name="鉄礦",Type="material",SkillType="ironworker",MaxCount=10};
case 4: return new ConfigItem {ID="grassHat",Name="草帽",Type="weapon",SkillType="speed",MaxCount=1,FusionRequire="grass_10",SkillRequire="tailor_1",Ability="def+2",Position="hand",UseCount=20};
case 5: return new ConfigItem {ID="grassBody",Name="布衣",Type="weapon",SkillType="speed",MaxCount=1,FusionRequire="grass_30",SkillRequire="tailor_1",Ability="def+4",Position="body",UseCount=20};
case 6: return new ConfigItem {ID="grassShoe",Name="草鞋",Type="weapon",SkillType="speed",MaxCount=1,FusionRequire="grass_10",SkillRequire="tailor_1",Ability="def+2",Position="foot",UseCount=20};
case 7: return new ConfigItem {ID="grassKen",Name="布拳套",Type="weapon",SkillType="karate",MaxCount=1,FusionRequire="grass_10",SkillRequire="tailor_1",Ability="atk+2",Position="hand",UseCount=20};
case 8: return new ConfigItem {ID="woodSword",Name="木劍",Type="weapon",SkillType="fencingArt",MaxCount=1,FusionRequire="wood_5",SkillRequire="woodworker_1",Ability="atk+5",Position="hand",UseCount=40};
case 9: return new ConfigItem {ID="woodBoat",Name="木伐",Description="可以通過淺海",Type="material",SkillType="woodworker",MaxCount=1,FusionRequire="wood_10"};
case 10: return new ConfigItem {ID="compass",Name="羅盤",Description="通過深海的必要道具",Type="material",SkillType="ironworker",MaxCount=1,FusionRequire="iron,stone"};
default: throw new Exception(key+"");
}}public static ConfigItem Get(string key){
switch(key){
case "grass": return new ConfigItem {ID="grass",Name="草",Type="material",SkillType="tailor",MaxCount=99};
case "wood": return new ConfigItem {ID="wood",Name="木",Type="material",SkillType="woodworker",MaxCount=10};
case "stone": return new ConfigItem {ID="stone",Name="石",Type="material",SkillType="ironworker",MaxCount=10};
case "iron": return new ConfigItem {ID="iron",Name="鉄礦",Type="material",SkillType="ironworker",MaxCount=10};
case "grassHat": return new ConfigItem {ID="grassHat",Name="草帽",Type="weapon",SkillType="speed",MaxCount=1,FusionRequire="grass_10",SkillRequire="tailor_1",Ability="def+2",Position="hand",UseCount=20};
case "grassBody": return new ConfigItem {ID="grassBody",Name="布衣",Type="weapon",SkillType="speed",MaxCount=1,FusionRequire="grass_30",SkillRequire="tailor_1",Ability="def+4",Position="body",UseCount=20};
case "grassShoe": return new ConfigItem {ID="grassShoe",Name="草鞋",Type="weapon",SkillType="speed",MaxCount=1,FusionRequire="grass_10",SkillRequire="tailor_1",Ability="def+2",Position="foot",UseCount=20};
case "grassKen": return new ConfigItem {ID="grassKen",Name="布拳套",Type="weapon",SkillType="karate",MaxCount=1,FusionRequire="grass_10",SkillRequire="tailor_1",Ability="atk+2",Position="hand",UseCount=20};
case "woodSword": return new ConfigItem {ID="woodSword",Name="木劍",Type="weapon",SkillType="fencingArt",MaxCount=1,FusionRequire="wood_5",SkillRequire="woodworker_1",Ability="atk+5",Position="hand",UseCount=40};
case "woodBoat": return new ConfigItem {ID="woodBoat",Name="木伐",Description="可以通過淺海",Type="material",SkillType="woodworker",MaxCount=1,FusionRequire="wood_10"};
case "compass": return new ConfigItem {ID="compass",Name="羅盤",Description="通過深海的必要道具",Type="material",SkillType="ironworker",MaxCount=1,FusionRequire="iron,stone"};
default: throw new Exception(key);
}}}}