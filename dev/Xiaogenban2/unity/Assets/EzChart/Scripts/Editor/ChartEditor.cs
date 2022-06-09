#if UNITY_EDITOR
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
using UnityEngine.UI;

namespace ChartUtil
{
    public class EzChartWindow : EditorWindow
    {
        [MenuItem("Window/EzChart")]
        static void Init()
        {
            EzChartWindow window = (EzChartWindow)GetWindow(typeof(EzChartWindow), false, "EzChart");
            window.Show();
        }

        private void OnGUI()
        {
            if (GUILayout.Button("Update All Active Chart Previews"))
            {
                Chart[] charts = FindObjectsOfType<Chart>();
                foreach (Chart chart in charts)
                {
                    if (chart.gameObject.scene.name == null) continue;
                    try
                    {
                        chart.UpdateChart();
                    }
                    catch
                    {
                        continue;
                    }
                }
            }

            if (GUILayout.Button("Update All Chart Previews"))
            {
                Chart[] charts = Resources.FindObjectsOfTypeAll<Chart>();
                foreach (Chart chart in charts)
                {
                    if (chart.gameObject.scene.name == null) continue;
                    try
                    {
                        chart.UpdateChart();
                    }
                    catch
                    {
                        continue;
                    }
                }
            }

            if (GUILayout.Button("Clear All Chart Previews"))
            {
                Chart[] charts = Resources.FindObjectsOfTypeAll<Chart>();
                foreach (Chart chart in charts)
                {
                    if (chart.gameObject.scene.name == null) continue;
                    try
                    {
                        chart.Clear();
                    }
                    catch
                    {
                        continue;
                    }
                }
            }
        }
    }

    [CustomEditor(typeof(Chart))]
    [CanEditMultipleObjects]
    public class ChartEditor : Editor
    {
        public override void OnInspectorGUI()
        {
            DrawDefaultInspector();

            if (targets.Length == 1 && ((Chart)target).gameObject.scene.name == null) return;

            EditorGUILayout.HelpBox("Chart preview will conflict with prefab system, please clear chart preview if you need to save chart as a prefab/part of a prefab.", MessageType.Info);

            if (GUILayout.Button("Preview"))
            {
                foreach (Chart chart in targets)
                {
                    if (chart.gameObject.scene.name == null) continue;
                    chart.UpdateChart();
                }
            }

            if (GUILayout.Button("Clear"))
            {
                foreach (Chart chart in targets)
                {
                    if (chart.gameObject.scene.name == null) continue;
                    chart.Clear();
                }
            }
        }

        //Add chart to right click menu item
//        [MenuItem("GameObject/UI/EzChart - Chart", false)]
//        static void CreateChart(MenuCommand menuCommand)
//        {
//            GameObject context = menuCommand.context as GameObject;
//            Canvas canv = FindObjectOfType<Canvas>();
//            if (canv == null)
//            {
//                canv = new GameObject("Canvas").AddComponent<Canvas>();
//                canv.renderMode = RenderMode.ScreenSpaceOverlay;
//                canv.gameObject.AddComponent<CanvasScaler>();
//                canv.gameObject.AddComponent<GraphicRaycaster>();
//                canv.gameObject.layer = LayerMask.NameToLayer("UI");
//                context = canv.gameObject;
//            }
//            var es = FindObjectOfType<UnityEngine.EventSystems.EventSystem>();
//            if (es == null)
//            {
//                es = new GameObject("EventSystem").AddComponent<UnityEngine.EventSystems.EventSystem>();
//                es.gameObject.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
//            }
//            if (context == null || context.transform.GetComponentInParent<Canvas>() == null) context = canv.gameObject;

//            Chart chart = Helper.CreateEmptyRect("Chart", context.transform, true).gameObject.AddComponent<Chart>();
//            chart.chartOptions = chart.gameObject.AddComponent<ChartOptions>();
//            chart.chartData = chart.gameObject.AddComponent<ChartData>();
//            Undo.RegisterCreatedObjectUndo(chart.gameObject, "Create chart");
//            Selection.activeObject = chart.gameObject;

//#if CHART_TMPRO
//                    chart.chartOptions.plotOptions.generalFont = Resources.Load("Fonts & Materials/LiberationSans SDF", typeof(TMP_FontAsset)) as TMP_FontAsset;
//#else
//            chart.chartOptions.plotOptions.generalFont = Resources.GetBuiltinResource<Font>("Arial.ttf");
//#endif
//            chart.chartOptions.legend.iconImage = Resources.Load<Sprite>("Chart_Circle_128x128");
//        }
    }

    [CustomEditor(typeof(DataGenerator))]
    [CanEditMultipleObjects]
    public class DataGeneratorEditor : Editor
    {
        public override void OnInspectorGUI()
        {
            DrawDefaultInspector();

            Undo.RecordObjects(targets, "Generate random data");

            if (GUILayout.Button("Generate Random Data"))
            {
                foreach (DataGenerator dg in targets)
                {
                    if (dg.chartData == null) continue;
                    dg.GenerateRandomData();
                    PrefabUtility.RecordPrefabInstancePropertyModifications(dg.chartData);
                }
            }
        }
    }
}
#endif