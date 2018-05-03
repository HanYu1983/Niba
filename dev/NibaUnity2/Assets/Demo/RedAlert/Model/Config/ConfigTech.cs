using System;
namespace RedAlert{
public struct ConfigTech {
public string Id;
public string Name;
public string Description;
public int Cost;
public string HostEntity;
public string TechDependencies;
public const int ID_COUNT = -1;
public static ConfigTech Get(int key){
switch(key){
default: throw new Exception(key+"");
}}public static ConfigTech Get(string key){
switch(key){
default: throw new Exception(key);
}}}}