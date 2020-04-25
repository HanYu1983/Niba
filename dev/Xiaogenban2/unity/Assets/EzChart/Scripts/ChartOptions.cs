using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
#if CHART_TMPRO
using TMPro;
#endif

namespace ChartUtil
{
    public enum ChartType
    {
        PieChart, BarChart, LineChart, RoseChart
    }

    public enum DataDisplayFormat
    {
        Name, Value, Percentage, Name_Value, Name_Percentage
    }

    public enum ColumnStacking
    {
        None, Normal, Percent
    }

    public class ChartOptions : MonoBehaviour
    {
        [System.Serializable]
        public struct ChartTextOptions
        {
            public Color color;
            public int fontSize;
#if CHART_TMPRO
            public TMP_FontAsset font;
            public TextMeshProUGUI customizedText;
            public ChartTextOptions(Color c, TMP_FontAsset f, int fs, TextMeshProUGUI ct = null)
#else
            public Font font;
            public Text customizedText;
            public ChartTextOptions(Color c, Font f, int fs, Text ct = null)
#endif
            {
                color = c;
                font = f;
                fontSize = fs;
                customizedText = ct;
            }
        }

        [System.Serializable]
        public class BarChartOptions
        {
            public bool colorByCategories = false;
            public float barWidth = 10.0f;
            public float itemSeparation = 3.0f;
        }

        [System.Serializable]
        public class LineChartOptions
        {
            public float pointSize = 10.0f;
            public bool enableLine = true;
            public float lineWidth = 5.0f;
            public bool enableShade = false;
            public float shadeTransparency = 0.5f;
            public bool enablePointOutline = false;
            public float pointOutlineWidth = 1.0f;
            public Color pointOutlineColor = new Color(0.3f, 0.3f, 0.3f, 0.7f);
        }

        [System.Serializable]
        public class PieChartOptions
        {
            public float itemSeparation = 0.0f;
            [Range(0.0f, 1.0f)] public float innerSize = 0.0f;
            [Range(0.0f, 1.0f)] public float outerSize = 1.0f;
        }

        [System.Serializable]
        public class RoseChartOptions
        {
            public bool colorByCategories = false;
            public float barWidth = 10.0f;
            public float itemSeparation = 3.0f;
            [Range(0.0f, 1.0f)] public float innerSize = 0.0f;
            [Range(0.0f, 1.0f)] public float outerSize = 1.0f;
        }

        [System.Serializable]
        public class PlotOptions
        {
            public Color[] dataColor = new Color[11]
            {
                new Color32 (125, 180, 240, 255),
                new Color32 (255, 125, 80, 255),
                new Color32 (144, 237, 125, 255),
                new Color32 (247, 163, 92, 255),
                new Color32 (128, 133, 233, 255),
                new Color32 (241, 92, 128, 255),
                new Color32 (228, 211, 84, 255),
                new Color32 (43, 144, 143, 255),
                new Color32 (244, 91, 91, 255),
                new Color32 (190, 110, 240, 255),
                new Color32 (170, 240, 240, 255)
            };

#if CHART_TMPRO
            public TMP_FontAsset generalFont = null;
#else
            public Font generalFont = null;
#endif
            public bool inverted = false;
            public bool reverseSeries = false;
            public bool enableMouseTracking = true;
            public ColumnStacking columnStacking = ColumnStacking.None;
            public Color itemHighlightColor = new Color32(173, 219, 238, 100);
            public Color backgroundColor = Color.clear;
            public Color gridLineColor = new Color(0.3f, 0.3f, 0.3f, 1.0f);
            public float gridLineWidth = 2;
            public Color minorGridLineColor = new Color(0.5f, 0.5f, 0.5f, 1.0f);
            public float minorGridLineWidth = 1;
            public BarChartOptions barChartOption;
            public LineChartOptions lineChartOption;
            public PieChartOptions pieChartOption;
            public RoseChartOptions roseChartOption;
        }
        
        [System.Serializable]
        public class Title
        {
            public bool enableMainTitle = true;
            public string mainTitle = "Main Title";
            public ChartTextOptions mainTitleOption = new ChartTextOptions(new Color(0.2f, 0.2f, 0.2f, 1.0f), null, 18);
            public bool enableSubTitle = false;
            public string subTitle = "Sub Title";
            public ChartTextOptions subTitleOption = new ChartTextOptions(new Color(0.2f, 0.2f, 0.2f, 1.0f), null, 12);
        }

        [System.Serializable]
        public class XAxis
        {
            public bool enableTitle = false;
            public string title = "xAxis";
            public ChartTextOptions titleOption = new ChartTextOptions(new Color(0.2f, 0.2f, 0.2f, 1.0f), null, 14);
            public bool enableLabel = true;
            public ChartTextOptions labelOption = new ChartTextOptions(new Color(0.2f, 0.2f, 0.2f, 1.0f), null, 12);
            public bool forceHorizontalLabel = false;
            public int forceSkipLabel = -1;
        }

        [System.Serializable]
        public class YAxis
        {
            public bool enableTitle = true;
            public string title = "yAxis";
            public ChartTextOptions titleOption = new ChartTextOptions(new Color(0.2f, 0.2f, 0.2f, 1.0f), null, 14);
            public bool enableLabel = true;
            public ChartTextOptions labelOption = new ChartTextOptions(new Color(0.2f, 0.2f, 0.2f, 1.0f), null, 12);
            public bool startFromZero = true;
            public int minRangeDivision = 4;
            [Header("Fixed Range Options")]
            public bool fixedRange = false;
            public float fixedMinRange = 0.0f;
            public float fixedMaxRange = 100.0f;
            public int fixedRangeDivision = 4;
        }

        [System.Serializable]
        public class Tooltip
        {
            public bool enable = true;
            public DataDisplayFormat format = DataDisplayFormat.Name_Value;
            public ChartTextOptions textOption = new ChartTextOptions(new Color(0.9f, 0.9f, 0.9f, 1.0f), null, 14);
            public Color backgroundColor = new Color(0.2f, 0.2f, 0.2f, 0.7f);
        }

        [System.Serializable]
        public class Legend
        {
            public bool enable = true;
            public TextAnchor alignment = TextAnchor.LowerCenter;
            public RectTransform.Axis itemLayout = RectTransform.Axis.Horizontal;
            public ChartTextOptions textOption = new ChartTextOptions(new Color(0.2f, 0.2f, 0.2f, 1.0f), null, 14);
            public Sprite iconImage = null;
            public Color backgroundColor = Color.clear;
            public Color highlightColor = new Color(0.8f, 0.8f, 0.8f, 0.7f);
            public Color dimmedColor = new Color(0.5f, 0.5f, 0.5f, 1.0f);
        }

        [System.Serializable]
        public class Label
        {
            public bool enable = false;
            public DataDisplayFormat format = DataDisplayFormat.Value;
            public ChartTextOptions textOption = new ChartTextOptions(new Color(0.2f, 0.2f, 0.2f, 1.0f), null, 14);
            public float offset = 12.0f;
            public bool bestFit = true;
            //public bool enableStackLabel = false;
            //public ChartTextOptions stackLabelOption = new ChartTextOptions(new Color(0.2f, 0.2f, 0.2f, 1.0f), null, 14);
        }

        public PlotOptions plotOptions = new PlotOptions();
        public Title title = new Title();
        public XAxis xAxis = new XAxis();
        public YAxis yAxis = new YAxis();
        public Tooltip tooltip = new Tooltip();
        public Legend legend = new Legend();
        public Label label = new Label();

        private void Reset()
        {
#if CHART_TMPRO
            plotOptions.generalFont = Resources.Load("Fonts & Materials/LiberationSans SDF", typeof(TMP_FontAsset)) as TMP_FontAsset;
#else
            plotOptions.generalFont = Resources.GetBuiltinResource<Font>("Arial.ttf");
#endif
            legend.iconImage = Resources.Load<Sprite>("Images/Chart_Circle_128x128");
        }
    }
}
