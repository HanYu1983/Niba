using System;
namespace WordCard{
public struct ConfigCard {
public string Id;
public string Name;
public string Description;
public string Match;
public const int ID_COUNT = -1;
public static ConfigCard Get(int key){
switch(key){
default: throw new Exception(key+"");
}}public static ConfigCard Get(string key){
switch(key){
default: throw new Exception(key);
}}}}