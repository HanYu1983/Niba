using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using System.IO;
using UnityEditor;
using UnityEngine.Serialization;

namespace HanUtil
{
    public enum CSVKeyType
    {
        Int, Float, String
    }

    public enum CSVSplitType
    {
        Tap, Space, Dot, Custom
    }

    [Serializable]
    public class KeyType
    {
        public string key;
        public CSVKeyType type;
        public string[] Format
        {
            get
            {
                return new string[] { key, type.ToString().ToLower() };
            }
        }
    }

    [Serializable]
    public class CSVFile
    {
        [Tooltip("generateClassName")]
        public string key;
        public string fileName;
        public List<KeyType> types;

        public string[] Format
        {
            get
            {
                var ret = new List<string>();
                foreach(var t in types)
                {
                    ret.AddRange(t.Format);
                }
                return ret.ToArray();
            }
        }
    }

    public class CSVClassCreator : ScriptableObject
    {
        public string csvPath;
        public string generatePath;
        public List<CSVFile> csvFiles;
        public CSVSplitType splitType;
        public string split;
        public bool isFirstLetterUpper;
        public string ns;

        public string selectFile;
        public string selectRow;
        [ContextMenu("FileMoveUp")]
        public void FileMoveUp()
        {
            var find = csvFiles.Find(f => f.key == selectFile);
            if(find == null)
            {
                Debug.LogWarning("xxx");
                return;
            }
            var idx = csvFiles.IndexOf(find);
            if(idx == 0)
            {
                return;
            }
            var prevFile = csvFiles[idx - 1];
            csvFiles[idx] = prevFile;
            csvFiles[idx - 1] = find;
        }
        [ContextMenu("FileMoveDown")]
        public void FileMoveDown()
        {
            var find = csvFiles.Find(f => f.key == selectFile);
            if (find == null)
            {
                Debug.LogWarning("xxx");
                return;
            }
            var idx = csvFiles.IndexOf(find);
            if (idx == csvFiles.Count-1)
            {
                return;
            }
            var nextFile = csvFiles[idx + 1];
            csvFiles[idx] = nextFile;
            csvFiles[idx + 1] = find;
        }
        [ContextMenu("RowMoveUp")]
        public void RowMoveUp()
        {
            var find = csvFiles.Find(f => f.key == selectFile);
            if (find == null)
            {
                Debug.LogWarning("xxx");
                return;
            }
            var findRow = find.types.Find(f => f.key == selectRow);
            var idx = find.types.IndexOf(findRow);
            if (idx == 0)
            {
                return;
            }
            var prevRow = find.types[idx - 1];
            find.types[idx] = prevRow;
            find.types[idx - 1] = findRow;
        }
        [ContextMenu("RowMoveDown")]
        public void RowMoveDown()
        {
            var find = csvFiles.Find(f => f.key == selectFile);
            if (find == null)
            {
                Debug.LogWarning("xxx");
                return;
            }
            var findRow = find.types.Find(f => f.key == selectRow);
            var idx = find.types.IndexOf(findRow);
            if (idx == find.types.Count - 1)
            {
                return;
            }
            var nextRow = find.types[idx + 1];
            find.types[idx] = nextRow;
            find.types[idx + 1] = findRow;
        }
        [ContextMenu("Generate")]
        public void Generate()
        {
            if (string.IsNullOrEmpty(ns))
            {
                throw new Exception("enter ns");
            }
            if (string.IsNullOrEmpty(generatePath))
            {
                throw new Exception("enter generatePath");
            }
            var split = "\t";
            switch (splitType)
            {
                case CSVSplitType.Tap:
                    split = "\t";
                    break;
                case CSVSplitType.Space:
                    split = " ";
                    break;
                case CSVSplitType.Dot:
                    split = ",";
                    break;
                case CSVSplitType.Custom:
                    split = this.split;
                    break;
            }

            foreach(var f in csvFiles)
            {
                Debug.Log("generate "+f.fileName);
                if (string.IsNullOrEmpty(f.key))
                {
                    throw new Exception("enter generateClassName");
                }
                var filePath = Application.dataPath + "/" + csvPath +"/"+f.fileName;
                var generatePath = Application.dataPath + "/" + this.generatePath;
                GenCode(split, ns, f.key, null, f.Format, filePath, generatePath, isFirstLetterUpper);
            }
            AssetDatabase.Refresh();
        }

        [MenuItem("HanUtil/CSVClassCreator")]
        static void CreateExampleAssetInstance()
        {
            var exampleAsset = CreateInstance<CSVClassCreator>();
            AssetDatabase.CreateAsset(exampleAsset, "Assets/CSVClassCreator.asset");
            AssetDatabase.Refresh();
            EditorUtility.FocusProjectWindow();
            Selection.activeObject = exampleAsset;
        }

        public static void GenCode(string split, string ns, string clzName, string parent, string[] typeInfo, string fileName, string savePath, bool isFirstLetterUpper)
        {
            try
            {
                var csv = ReadCSV(fileName, split);
                var code = WriteClass(
                    ns,
                    clzName + (parent != null ? (" :" + parent) : ""),
                    clzName,
                    typeInfo,
                    csv,
                    isFirstLetterUpper
                );
                File.WriteAllText(savePath + "/" + clzName + ".cs", code);
            }
            catch (Exception e)
            {
                Debug.LogWarning(e.Message);

                Debug.LogWarning("XXXX");
                var code2 = WriteClass(
                    ns,
                    clzName + (parent != null ? (" :" + parent) : ""),
                    clzName,
                    typeInfo,
                    new string[][] { },
                    isFirstLetterUpper
                );
                File.WriteAllText(savePath + "/" + clzName + ".cs", code2);
            }
        }

        public static string WriteClass(string ns, string clz, string retClz, string[] typeInfo, string[][] csv, bool isFirstLetterUpper)
        {
            var str = "";
            str += "using System;\n";
            str += string.Format("namespace {0}{{\n", ns);
            str += string.Format("public struct {0} {{\n", clz);
            {
                // getter setter
                for (var i = 0; i < typeInfo.Length; i += 2)
                {
                    var key = typeInfo[i];
                    if (isFirstLetterUpper)
                    {
                        key = FirstLetterToUpper(key);
                    }
                    var type = typeInfo[i + 1];
                    str += string.Format("public {0} {1};\n", type, key);
                }
                // count
                str += "public const int ID_COUNT = " + (csv.Length - 1) + ";\n";
                for (var i = 1; i < csv.Length; ++i)
                {
                    var id = csv[i][0];
                    str += string.Format("public const string ID_{0} = \"{0}\";\n", id);
                }
                // int key
                str += string.Format("public static {0} Get(int key){{\n", retClz);
                {
                    str += "switch(key){\n";
                    {
                        for (var i = 1; i < csv.Length; ++i)
                        {
                            var id = i - 1;
                            str += string.Format("case {0}: return new {1} {{{2}}};\n", id, clz, WriteAssignment(typeInfo, i, csv, isFirstLetterUpper));
                        }
                        str += "default: throw new Exception(key+\"\");\n";
                    }
                    str += "}";
                }
                str += "}";
                // str key
                str += string.Format("public static {0} Get(string key){{\n", retClz);
                {
                    str += "switch(key){\n";
                    {
                        for (var i = 1; i < csv.Length; ++i)
                        {
                            var id = csv[i][0];
                            str += string.Format("case \"{0}\": return new {1} {{{2}}};\n", id, clz, WriteAssignment(typeInfo, i, csv, isFirstLetterUpper));
                        }
                        str += "default: throw new Exception(key);\n";
                    }
                    str += "}";
                }
                str += "}";
            }
            str += "}";
            str += "}";
            return str;
        }

        public static string WriteAssignment(string[] info, int i, string[][] data, bool isFirstLetterUpper)
        {
            var fieldsAry = new List<string>();
            for (var j = 0; j < data[0].Length; ++j)
            {
                if (j * 2 >= info.Length)
                {
                    continue;
                }
                var value = data[i][j];
                if (value.Length == 0)
                {
                    continue;
                }
                var key = info[j * 2];
                var type = info[j * 2 + 1];
                if (isFirstLetterUpper)
                {
                    key = FirstLetterToUpper(key);
                }
                switch (type)
                {
                    case "float":
                        try
                        {
                            float.Parse(value);
                        }
                        catch (Exception)
                        {
                            throw new Exception("欄位格式錯誤:" + key + ":" + value);
                        }
                        fieldsAry.Add(string.Format("{0}={1}f", key, value));
                        break;
                    case "int":
                        try
                        {
                            int.Parse(value);
                        }
                        catch (Exception)
                        {
                            throw new Exception("欄位格式錯誤:" + key + ":" + value);
                        }
                        fieldsAry.Add(string.Format("{0}={1}", key, value));
                        break;
                    case "string":
                        fieldsAry.Add(string.Format("{0}=\"{1}\"", key, value));
                        break;
                }
            }
            return string.Join(",", fieldsAry.ToArray());
        }

        public static string[][] ReadCSV(string fileName, string split)
        {
            var lineArray = File.ReadAllLines(fileName);
            string[][] strArray = new string[lineArray.Length][];
            for (int i = 0; i < lineArray.Length; i++)
            {
                var line = lineArray[i];
                var needSpecialProcess = line.IndexOf("\"") != -1;
                if (needSpecialProcess)
                {
                    // ==== 處理""內的文字 ====
                    var curr = 0;
                    while (true)
                    {
                        var id1 = line.IndexOf("\"", curr);
                        if (id1 == -1)
                        {
                            break;
                        }
                        var id2 = line.IndexOf("\"", id1 + 1);
                        if (id2 == -1)
                        {
                            throw new Exception("格式錯誤，少一個\"");
                        }
                        var contentBetweenId12 = line.Substring(id1 + 1, (id2 - id1) - 1);
                        line = line.Replace("\"" + contentBetweenId12 + "\"", WWW.EscapeURL(contentBetweenId12));

                        curr = id2 + 1;
                    }
                    var tempAry = line.Split(new string[] { split }, StringSplitOptions.None);
                    for (var j = 0; j < tempAry.Length; ++j)
                    {
                        var tempStr = tempAry[j];
                        var replaceMark = "anystringforreplace";
                        // 先將%符號換掉，不然在UnEscapeURL的時候會解析成????
                        tempStr = tempStr.Replace("%", replaceMark);
                        tempStr = WWW.UnEscapeURL(tempStr);
                        // 再置換回來
                        tempStr = tempStr.Replace(replaceMark, "%");
                        tempAry[j] = tempStr;
                    }
                    strArray[i] = tempAry;
                }
                else
                {
                    strArray[i] = line.Split(new string[] { split }, StringSplitOptions.None);
                }
            }
            return strArray;
        }

        public static string FirstLetterToUpper(string str)
        {
            if (str == null)
                return null;

            if (str.Length > 1)
                return char.ToUpper(str[0]) + str.Substring(1);

            return str.ToUpper();
        }
    }
}