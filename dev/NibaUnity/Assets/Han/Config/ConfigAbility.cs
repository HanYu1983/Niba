using System;
public class ConfigAbility {
public string ID { get; set; }
public float Str { get; set; }
public float Vit { get; set; }
public float Agi { get; set; }
public float Dex { get; set; }
public float Int { get; set; }
public float Luc { get; set; }
public const int ID_COUNT = 9;
public const string ID_hp = "hp";
public const string ID_mp = "mp";
public const string ID_atk = "atk";
public const string ID_def = "def";
public const string ID_matk = "matk";
public const string ID_mdef = "mdef";
public const string ID_accuracy = "accuracy";
public const string ID_dodge = "dodge";
public const string ID_critical = "critical";
public static ConfigAbility Get(int key){
switch(key){
case 0: return new ConfigAbility {ID="hp",Str=1f,Vit=3f};
case 1: return new ConfigAbility {ID="mp",Int=1f};
case 2: return new ConfigAbility {ID="atk",Str=4f,Agi=2f};
case 3: return new ConfigAbility {ID="def",Str=1f,Vit=1.5f,Dex=0.5f};
case 4: return new ConfigAbility {ID="matk",Int=3f};
case 5: return new ConfigAbility {ID="mdef",Vit=1.5f,Dex=0.5f,Int=2f};
case 6: return new ConfigAbility {ID="accuracy",Agi=1f,Dex=3f,Luc=1.5f};
case 7: return new ConfigAbility {ID="dodge",Agi=3f,Dex=1f,Luc=1.5f};
case 8: return new ConfigAbility {ID="critical",Dex=1f,Luc=3f};
default: throw new Exception("");
}}public static ConfigAbility Get(string key){
switch(key){
case "hp": return new ConfigAbility {ID="hp",Str=1f,Vit=3f};
case "mp": return new ConfigAbility {ID="mp",Int=1f};
case "atk": return new ConfigAbility {ID="atk",Str=4f,Agi=2f};
case "def": return new ConfigAbility {ID="def",Str=1f,Vit=1.5f,Dex=0.5f};
case "matk": return new ConfigAbility {ID="matk",Int=3f};
case "mdef": return new ConfigAbility {ID="mdef",Vit=1.5f,Dex=0.5f,Int=2f};
case "accuracy": return new ConfigAbility {ID="accuracy",Agi=1f,Dex=3f,Luc=1.5f};
case "dodge": return new ConfigAbility {ID="dodge",Agi=3f,Dex=1f,Luc=1.5f};
case "critical": return new ConfigAbility {ID="critical",Dex=1f,Luc=3f};
default: throw new Exception("");
}}}