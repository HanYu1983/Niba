using System;
namespace WordCard{
public struct ConfigCard {
public string Id;
public string Name;
public string Description;
public string Match;
public const int ID_COUNT = 3;
public const string ID_strong = "strong";
public const string ID_power = "power";
public const string ID_robust = "robust";
public static ConfigCard Get(int key){
switch(key){
case 0: return new ConfigCard {Id="strong",Name="strong",Description="強力",Match="power,robust"};
case 1: return new ConfigCard {Id="power",Name="power",Description="強力",Match="strong,robust"};
case 2: return new ConfigCard {Id="robust",Name="robut",Description="強力",Match="power,strong"};
default: throw new Exception(key+"");
}}public static ConfigCard Get(string key){
switch(key){
case "strong": return new ConfigCard {Id="strong",Name="strong",Description="強力",Match="power,robust"};
case "power": return new ConfigCard {Id="power",Name="power",Description="強力",Match="strong,robust"};
case "robust": return new ConfigCard {Id="robust",Name="robut",Description="強力",Match="power,strong"};
default: throw new Exception(key);
}}}}