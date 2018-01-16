using System;
using UnityEditor;
using UnityEngine;

public class HanRPGAPIConfig : ScriptableObject{
	public string csvPath;
	public string classPath;

	[MenuItem("Niba/HanRPGAPIConfig")]
	public static void CreateAsset()
	{
		var ObjSample = ScriptableObject.CreateInstance<HanRPGAPIConfig>();
		string path = AssetDatabase.GenerateUniqueAssetPath("Assets/HanRPGAPI/HanRPGAPIConfig.asset");

		AssetDatabase.CreateAsset(ObjSample, path);
		AssetDatabase.SaveAssets();
		AssetDatabase.Refresh();
	}
}
