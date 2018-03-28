using System;
namespace RobotWar{
public class ConfigGrid {
public string id { get; set; }
public string name { get; set; }
public string description { get; set; }
public int cost { get; set; }
public float deffence { get; set; }
public float energy { get; set; }
public const int ID_COUNT = -1;
public static ConfigGrid Get(int key){
switch(key){
default: throw new Exception(key+"");
}}public static ConfigGrid Get(string key){
switch(key){
default: throw new Exception(key);
}}}}