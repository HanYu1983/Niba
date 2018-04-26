using System;
namespace WordCard{
public struct ConfigCard {
public string Id;
public string Name;
public string Description;
public string Match;
public const int ID_COUNT = 9;
public const string ID_strong = "strong";
public const string ID_power = "power";
public const string ID_robust = "robust";
public const string ID_home = "home";
public const string ID_dwelling = "dwelling";
public const string ID_water = "water";
public const string ID_sea = "sea";
public const string ID_game = "game";
public const string ID_pastime = "pastime";
public static ConfigCard Get(int key){
switch(key){
case 0: return new ConfigCard {Id="strong",Name="strong",Description="強力",Match="power,robust"};
case 1: return new ConfigCard {Id="power",Name="power",Description="強力",Match="strong,robust"};
case 2: return new ConfigCard {Id="robust",Name="robust",Description="強力",Match="power,strong"};
case 3: return new ConfigCard {Id="home",Name="home",Description="家",Match="dwelling"};
case 4: return new ConfigCard {Id="dwelling",Name="dwelling",Description="家",Match="home"};
case 5: return new ConfigCard {Id="water",Name="water",Description="水",Match="sea"};
case 6: return new ConfigCard {Id="sea",Name="sea",Description="水",Match="water"};
case 7: return new ConfigCard {Id="game",Name="game",Description="遊戲",Match="pastime"};
case 8: return new ConfigCard {Id="pastime",Name="pastime",Description="遊戲",Match="game"};
default: throw new Exception(key+"");
}}public static ConfigCard Get(string key){
switch(key){
case "strong": return new ConfigCard {Id="strong",Name="strong",Description="強力",Match="power,robust"};
case "power": return new ConfigCard {Id="power",Name="power",Description="強力",Match="strong,robust"};
case "robust": return new ConfigCard {Id="robust",Name="robust",Description="強力",Match="power,strong"};
case "home": return new ConfigCard {Id="home",Name="home",Description="家",Match="dwelling"};
case "dwelling": return new ConfigCard {Id="dwelling",Name="dwelling",Description="家",Match="home"};
case "water": return new ConfigCard {Id="water",Name="water",Description="水",Match="sea"};
case "sea": return new ConfigCard {Id="sea",Name="sea",Description="水",Match="water"};
case "game": return new ConfigCard {Id="game",Name="game",Description="遊戲",Match="pastime"};
case "pastime": return new ConfigCard {Id="pastime",Name="pastime",Description="遊戲",Match="game"};
default: throw new Exception(key);
}}}}