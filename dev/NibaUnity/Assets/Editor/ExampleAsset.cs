using UnityEngine;
using UnityEditor;

public class ExampleAsset : ScriptableObject
{
	[SerializeField]
	string str;

	[SerializeField, Range (0, 10)]
	int number;

	[SerializeField]
	ExampleAsset2 asset2;

	[MenuItem ("Niba/Create ExampleAsset Instance")]
	static void CreateExampleAssetInstance ()
	{
		var exampleAsset = CreateInstance<ExampleAsset> ();
		AssetDatabase.CreateAsset (exampleAsset, "Assets/Editor/ExampleAsset.asset");

		AssetDatabase.CreateAsset (CreateInstance<ExampleAsset2> (), "Assets/Editor/ExampleAsset2.asset");

		AssetDatabase.Refresh ();
	}

	[MenuItem ("Niba/Load ExampleAsset")]
	static void LoadExampleAsset ()
	{
		/*
		var exampleAsset = AssetDatabase.LoadAssetAtPath<ExampleAsset>("Assets/Editor/ExampleAsset.asset");
		Debug.LogError (exampleAsset.str +":"+ exampleAsset.number);
		*/

		var path = AssetDatabase.GetAssetPath (Selection.activeObject);
		Debug.LogError(path);
		//サブアセット含めすべて取得
		foreach (var item in AssetDatabase.LoadAllAssetsAtPath(path)) {
			//フラグをすべて None にして非表示設定を解除
			//item.hideFlags = HideFlags.None;
			Debug.LogError(item.name);
		}
	}

	[MenuItem ("Niba/Remove ChildScriptableObject")]
	static void Remove ()
	{
		//アセットの CarentScriptableObject を破棄
		Object.DestroyImmediate (AssetDatabase.LoadAssetAtPath<ExampleAsset> ("Assets/Editor/ExampleAsset.asset"), true);
		Object.DestroyImmediate (AssetDatabase.LoadAssetAtPath<ExampleAsset2> ("Assets/Editor/ExampleAsset2.asset"), true);


		//再インポートして最新の情報に更新
		AssetDatabase.Refresh();
	}
}