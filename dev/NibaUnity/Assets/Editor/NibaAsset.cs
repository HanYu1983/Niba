using System;
using UnityEditor;
using UnityEngine;
using UnityEditorInternal;
using System.Collections.Generic;

namespace Niba
{
	[CreateAssetMenu(menuName = "Niba/NibaAsset")]
	public class NibaAsset : ScriptableObject
	{
		public EditorItem[] items;
	}

	[Serializable]
	public class EditorItem {
		[TextArea(3, 5)]
		public string name;
		public int age;
		public bool enable;
	}

	[CustomPropertyDrawer (typeof(EditorItem))]
	public class ExampleDrawer : PropertyDrawer{
		public override void OnGUI (Rect position,
			SerializedProperty property, GUIContent label)
		{
			using (new EditorGUI.PropertyScope (position, label, property)) {
				EditorGUIUtility.labelWidth = 50;

				var rect = position;
				rect.height = EditorGUIUtility.singleLineHeight*3;
				rect.width = 100;

				var name = property.FindPropertyRelative ("name");
				EditorGUI.PropertyField (rect, name);
				rect.x += 100;
				//rect.y += EditorGUIUtility.singleLineHeight;

				var age = property.FindPropertyRelative ("age");
				EditorGUI.PropertyField (rect, age);
			}
		}
	}

	[CanEditMultipleObjects]
	[CustomEditor (typeof(NibaAsset))]
	public class NibaAssetInspector : UnityEditor.Editor
	{
		ReorderableList reorderableList;

		void OnEnable ()
		{
			var prop = serializedObject.FindProperty ("items");
			reorderableList = new ReorderableList (serializedObject, prop);

			reorderableList.drawHeaderCallback = (rect) =>
				EditorGUI.LabelField (rect, prop.displayName);


			reorderableList.elementHeight = 68;
			reorderableList.drawElementCallback = (rect, index, isActive, isFocused) => {
				var element = prop.GetArrayElementAtIndex (index);
				EditorGUI.PropertyField (rect, element);
			};
		}
		public override void OnInspectorGUI ()
		{
			base.OnInspectorGUI ();
			serializedObject.Update ();
			reorderableList.DoLayoutList ();
			serializedObject.ApplyModifiedProperties ();
		}
	}
}