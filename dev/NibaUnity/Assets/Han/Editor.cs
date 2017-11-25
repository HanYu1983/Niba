using System;
using System.IO;
using UnityEngine;
using System.Collections.Generic;
using UnityEditor;

namespace Model
{
	public class Editor
	{
		[MenuItem ("Niba/GenerateConfig")]
		public static void GenConfig(){
			GenCode ("ConfigMonster", null, new string[]{
				"ID", "string",
				"Name", "string",
				"Description", "string", 
				"Item","string",
				"Str", "int",
				"Vit", "int",
				"Agi", "int",
				"Dex", "int", 
				"Int","int",
				"Luc","int",
			}, "CSV/gameData - monster.tsv");

			GenCode ("ConfigResource", null, new string[]{
				"ID", "string",
				"Name", "string",
				"Description", "string", 
				"Item","string",
			}, "CSV/gameData - resource.tsv");

			GenCode ("ConfigItem", null, new string[]{
				"ID", "string",
				"Name", "string",
				"Description", "string", 
				"Type","string",
				"MaxCount","int",
				"FusionRequire","string",
				"SkillRequire","string",
				"Ability","string",
				"Position","string",
			}, "CSV/gameData - item.tsv");

			GenCode ("ConfigAbility", null, new string[]{
				"ID", "string",
				"Str", "float",
				"Vit", "float",
				"Agi", "float",
				"Dex", "float", 
				"Int","float",
				"Luc","float",
			}, "CSV/gameData - ability.tsv");

			AssetDatabase.Refresh();
		}

		public static void GenCode(string clzName, string parent, string[] typeInfo, string fileName){
			var csv = ReadCSV (Application.dataPath+"/Han/"+fileName, '\t');
			var code = WriteClass (
				           clzName + (parent != null ? (" :" + parent) : ""), 
				           clzName, 
				           typeInfo,
				           csv
			           );
			File.WriteAllText(Application.dataPath + "/Han/Config/"+clzName+".cs", code);
		}

		public static string WriteClass(string clz, string retClz, string[] typeInfo, string[][] csv){
			var str = "";
			str += "using System;\n";
			str += string.Format("public class {0} {{\n", clz);
			{
				// getter setter
				for (var i = 0; i < typeInfo.Length; i += 2) {
					var key = typeInfo [i];
					var type = typeInfo [i + 1];
					str += string.Format ("public {0} {1} {{ get; set; }}\n", type, key);
				}
				// count
				str += "public const int ID_COUNT = " + (csv.Length-1)+";\n";
				for (var i = 1; i < csv.Length; ++i) {
					var id = csv [i][0];
					str += string.Format ("public const string ID_{0} = \"{0}\";\n", id);
				}
				// int key
				str += string.Format ("public static {0} Get(int key){{\n", retClz);
				{
					str += "switch(key){\n";
					{
						for (var i = 1; i < csv.Length; ++i) {
							var id = i-1;
							str += string.Format ("case {0}: return new {1} {{{2}}};\n", id, clz, WriteAssignment(typeInfo, i, csv));
						}
						str += "default: throw new Exception(\"\");\n";
					}
					str += "}";
				}
				str += "}";
				// str key
				str += string.Format ("public static {0} Get(string key){{\n", retClz);
				{
					str += "switch(key){\n";
					{
						for (var i = 1; i < csv.Length; ++i) {
							var id = csv [i][0];
							str += string.Format ("case \"{0}\": return new {1} {{{2}}};\n", id, clz, WriteAssignment(typeInfo, i, csv));
						}
						str += "default: throw new Exception(\"\");\n";
					}
					str += "}";
				}
				str += "}";
			}
			str += "}";
			return str;
		}

		public static string WriteAssignment(string[] info, int i, string[][] data){
			var fieldsAry = new List<string>();
			for(var j=0; j<data[0].Length; ++j){
				if (j*2 >= info.Length) {
					continue;
				}
				var value = data [i] [j];
				if (value.Length == 0) {
					continue;
				}
				var key = info [j*2];
				var type = info [j*2+1];
				switch (type) {
				case "float":
					try{
						float.Parse(value);
					}catch(Exception){
						throw new Exception ("欄位格式錯誤:"+key+":"+value);
					}
					fieldsAry.Add (string.Format ("{0}={1}f", key, value));
					break;
				case "int":
					try{
						int.Parse(value);
					}catch(Exception){
						throw new Exception ("欄位格式錯誤:"+key+":"+value);
					}
					fieldsAry.Add(string.Format ("{0}={1}", key, value));
					break;
				case "string":
					fieldsAry.Add(string.Format ("{0}=\"{1}\"", key, value));
					break;
				}
			}
			return string.Join (",", fieldsAry.ToArray ());
		}

		public static string[][] ReadCSV(string fileName, char split = ','){
			var lineArray = File.ReadAllLines (fileName);
			string[][] strArray = new string [lineArray.Length][];  
			for (int i=0;i<lineArray.Length;i++){
				var line = lineArray [i];
				var needSpecialProcess = line.IndexOf ("\"") != -1;
				if (needSpecialProcess) {
					// ==== 處理""內的文字 ====
					var curr = 0;
					while (true) {
						var id1 = line.IndexOf ("\"", curr);
						if (id1 == -1) {
							break;
						}
						var id2 = line.IndexOf ("\"", id1 + 1);
						if (id2 == -1) {
							throw new Exception ("格式錯誤，少一個\"");
						}
						var contentBetweenId12 = line.Substring (id1 + 1, (id2 - id1) - 1);
						line = line.Replace ("\"" + contentBetweenId12 + "\"", WWW.EscapeURL (contentBetweenId12));

						curr = id2 + 1;
					}
					var tempAry = line.Split (split); 
					for (var j = 0; j < tempAry.Length; ++j) {
						var tempStr = tempAry [j];
						var replaceMark = "anystringforreplace";
						// 先將%符號換掉，不然在UnEscapeURL的時候會解析成????
						tempStr = tempStr.Replace ("%", replaceMark);
						tempStr = WWW.UnEscapeURL (tempStr);
						// 再置換回來
						tempStr = tempStr.Replace (replaceMark, "%");
						tempAry [j] = tempStr;
					}
					strArray [i] = tempAry;
				} else {
					strArray [i] = line.Split (split);
				}
			}
			return strArray;
		}
	}
}

