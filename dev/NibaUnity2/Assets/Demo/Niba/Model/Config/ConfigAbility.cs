using System;
namespace Niba{
public struct ConfigAbility {
public string ID;
public float Str;
public float Vit;
public float Agi;
public float Dex;
public float Int;
public float Luc;
public const int ID_COUNT = 20;
public const string ID_hp = "hp";
public const string ID_mp = "mp";
public const string ID_atk = "atk";
public const string ID_def = "def";
public const string ID_matk = "matk";
public const string ID_mdef = "mdef";
public const string ID_accuracy = "accuracy";
public const string ID_dodge = "dodge";
public const string ID_critical = "critical";
public const string ID_tailor = "tailor";
public const string ID_woodworker = "woodworker";
public const string ID_ironworker = "ironworker";
public const string ID_fencingArt = "fencingArt";
public const string ID_karate = "karate";
public const string ID_shield = "shield";
public const string ID_armor = "armor";
public const string ID_speed = "speed";
public const string ID_move = "move";
public const string ID_subtle = "subtle";
public const string ID_cooker = "cooker";
public static ConfigAbility Get(int key){
switch(key){
case 0: return new ConfigAbility {ID="hp",Vit=12f};
case 1: return new ConfigAbility {ID="mp",Int=2f};
case 2: return new ConfigAbility {ID="atk",Str=3f};
case 3: return new ConfigAbility {ID="def",Vit=3f};
case 4: return new ConfigAbility {ID="matk",Int=3f};
case 5: return new ConfigAbility {ID="mdef",Int=1f};
case 6: return new ConfigAbility {ID="accuracy",Dex=3f,Luc=1.5f};
case 7: return new ConfigAbility {ID="dodge",Agi=3f,Luc=1.5f};
case 8: return new ConfigAbility {ID="critical",Luc=3f};
case 9: return new ConfigAbility {ID="tailor",Vit=0.1f,Dex=0.2f,Int=0.2f};
case 10: return new ConfigAbility {ID="woodworker",Str=0.1f,Vit=0.2f,Dex=0.1f,Int=0.1f};
case 11: return new ConfigAbility {ID="ironworker",Str=0.2f,Vit=0.3f};
case 12: return new ConfigAbility {ID="fencingArt",Str=0.3f,Vit=0.1f,Agi=0.1f};
case 13: return new ConfigAbility {ID="karate",Str=0.1f,Vit=0.1f,Agi=0.2f};
case 14: return new ConfigAbility {ID="shield",Str=0.1f,Vit=0.3f};
case 15: return new ConfigAbility {ID="armor",Str=0.1f,Vit=0.5f};
case 16: return new ConfigAbility {ID="speed",Vit=0.1f,Agi=0.3f};
case 17: return new ConfigAbility {ID="move",Vit=0.1f,Agi=0.05f};
case 18: return new ConfigAbility {ID="subtle",Int=0.1f,Luc=0.1f};
case 19: return new ConfigAbility {ID="cooker",Int=0.1f,Luc=0.1f};
default: throw new Exception(key+"");
}}public static ConfigAbility Get(string key){
switch(key){
case "hp": return new ConfigAbility {ID="hp",Vit=12f};
case "mp": return new ConfigAbility {ID="mp",Int=2f};
case "atk": return new ConfigAbility {ID="atk",Str=3f};
case "def": return new ConfigAbility {ID="def",Vit=3f};
case "matk": return new ConfigAbility {ID="matk",Int=3f};
case "mdef": return new ConfigAbility {ID="mdef",Int=1f};
case "accuracy": return new ConfigAbility {ID="accuracy",Dex=3f,Luc=1.5f};
case "dodge": return new ConfigAbility {ID="dodge",Agi=3f,Luc=1.5f};
case "critical": return new ConfigAbility {ID="critical",Luc=3f};
case "tailor": return new ConfigAbility {ID="tailor",Vit=0.1f,Dex=0.2f,Int=0.2f};
case "woodworker": return new ConfigAbility {ID="woodworker",Str=0.1f,Vit=0.2f,Dex=0.1f,Int=0.1f};
case "ironworker": return new ConfigAbility {ID="ironworker",Str=0.2f,Vit=0.3f};
case "fencingArt": return new ConfigAbility {ID="fencingArt",Str=0.3f,Vit=0.1f,Agi=0.1f};
case "karate": return new ConfigAbility {ID="karate",Str=0.1f,Vit=0.1f,Agi=0.2f};
case "shield": return new ConfigAbility {ID="shield",Str=0.1f,Vit=0.3f};
case "armor": return new ConfigAbility {ID="armor",Str=0.1f,Vit=0.5f};
case "speed": return new ConfigAbility {ID="speed",Vit=0.1f,Agi=0.3f};
case "move": return new ConfigAbility {ID="move",Vit=0.1f,Agi=0.05f};
case "subtle": return new ConfigAbility {ID="subtle",Int=0.1f,Luc=0.1f};
case "cooker": return new ConfigAbility {ID="cooker",Int=0.1f,Luc=0.1f};
default: throw new Exception(key);
}}}}