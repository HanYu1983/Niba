using UnityEngine;
using UnityEditor;

public class ExampleAsset2 : ScriptableObject
{
	[SerializeField]
	string str;

	[SerializeField, Range (0, 10)]
	int number;
}