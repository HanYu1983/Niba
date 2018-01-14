using System.Collections;
using System.Collections.Generic;
using UnityEditor;
using UnityEngine;
using UnityEditorInternal;
using System.Linq;
using System;

namespace Niba{
	public class TestEditor : EditorWindow {
		[MenuItem("Niba/DataEditor")]
		public static void DataEditor()
		{
			EditorWindow.GetWindow<TestEditor> ("DataEditor");
		}

		void OnGUI (){


		}
	}
}