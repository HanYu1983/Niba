using System;
namespace RedAlert{
public struct ConfigEntityType {
public string Id;
public string Name;
public string Description;
public const int ID_COUNT = -1;
public static ConfigEntityType Get(int key){
switch(key){
default: throw new Exception(key+"");
}}public static ConfigEntityType Get(string key){
switch(key){
default: throw new Exception(key);
}}}}