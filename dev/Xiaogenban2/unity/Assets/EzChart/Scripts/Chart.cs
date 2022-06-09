using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
#if CHART_TMPRO
using TMPro;
#endif

namespace ChartUtil
{
    [ExecuteInEditMode]
    public class Chart : MonoBehaviour
    {
        public ChartOptions chartOptions = null;
        public ChartData chartData = null;
        public ChartType chartType = ChartType.BarChart;

        Vector2 chartSize;
        Vector2 offsetMin, offsetMax;
        Tooltip tooltip;

        public void Clear()
        {
            Helper.Clear(transform);
        }

        private void Start()
        {
#if UNITY_EDITOR
            if (Application.isPlaying)
#endif
            UpdateChart();
        }

        public void ToggleSeries(int index)
        {
            chartData.series[index].show = !chartData.series[index].show;
            UpdateChart();
        }

        public void UpdateChart()
        {
            if (chartOptions == null || chartData == null) return;
            Clear();
#if CHART_TMPRO
            if (chartOptions.plotOptions.generalFont == null)
                chartOptions.plotOptions.generalFont = Resources.Load("Fonts & Materials/LiberationSans SDF", typeof(TMP_FontAsset)) as TMP_FontAsset;
#else
            if (chartOptions.plotOptions.generalFont == null)
                chartOptions.plotOptions.generalFont = Resources.GetBuiltinResource<Font>("Arial.ttf");
#endif

            offsetMin = offsetMax = Vector2.zero;
            chartSize = GetComponent<RectTransform>().rect.size;

            if (chartOptions.tooltip.enable) UpdateTooltip();
            if (chartOptions.title.enableMainTitle) UpdateMainTitle();
            if (chartOptions.title.enableSubTitle) UpdateSubTitle();
            if (chartOptions.legend.enable) UpdateLegend();
            UpdateContent();
        }

        void UpdateTooltip()
        {
            tooltip = Helper.CreateEmptyRect("Tooltip", transform).gameObject.AddComponent<Tooltip>();
            tooltip.background = tooltip.gameObject.AddComponent<Image>();
            tooltip.background.rectTransform.anchorMin = Vector2.zero;
            tooltip.background.rectTransform.anchorMax = Vector2.zero;
            tooltip.background.rectTransform.pivot = new Vector2(0.5f, 0.0f);
            tooltip.background.sprite = Resources.Load<Sprite>("Images/Chart_Square");
            tooltip.background.color = chartOptions.tooltip.backgroundColor;
            tooltip.background.type = Image.Type.Sliced;
            tooltip.background.raycastTarget = false;
            Canvas c = tooltip.gameObject.AddComponent<Canvas>();
            c.overrideSorting = true;
            c.sortingOrder = 10000;
            tooltip.tooltipText = Helper.CreateText("TooltipText", tooltip.transform, chartOptions.tooltip.textOption, chartOptions.plotOptions.generalFont, TextAnchor.UpperLeft, true);
            tooltip.tooltipText.rectTransform.offsetMin = new Vector2(8, 3);
            tooltip.tooltipText.rectTransform.offsetMax = new Vector2(-8, -3);
            tooltip.gameObject.SetActive(false);
        }

        void UpdateMainTitle()
        {
            var mainTitle = Helper.CreateText("MainTitle", transform, chartOptions.title.mainTitleOption, chartOptions.plotOptions.generalFont);
            mainTitle.text = chartOptions.title.mainTitle;
            if (mainTitle.preferredWidth > chartSize.x) Helper.TruncateText(mainTitle, chartSize.x);

            float height = mainTitle.fontSize * 1.2f;
            mainTitle.rectTransform.anchorMin = new Vector2(0.0f, 1.0f);
            mainTitle.rectTransform.anchorMax = new Vector2(1.0f, 1.0f);
            mainTitle.rectTransform.offsetMin = new Vector2(0.0f, -height);
            mainTitle.rectTransform.offsetMax = new Vector2(0.0f, 0.0f);
            offsetMax.y -= height;
        }

        void UpdateSubTitle()
        {
            var subTitle = Helper.CreateText("SubTitle", transform, chartOptions.title.subTitleOption, chartOptions.plotOptions.generalFont);
            subTitle.text = chartOptions.title.subTitle;
            if (subTitle.preferredWidth > chartSize.x) Helper.TruncateText(subTitle, chartSize.x);

            float height = subTitle.fontSize * 1.2f;
            subTitle.rectTransform.anchorMin = new Vector2(0.0f, 1.0f);
            subTitle.rectTransform.anchorMax = new Vector2(1.0f, 1.0f);
            subTitle.rectTransform.offsetMin = new Vector2(0.0f, offsetMax.y - height);
            subTitle.rectTransform.offsetMax = new Vector2(0.0f, offsetMax.y);
            offsetMax.y -= height;
        }

        void UpdateLegend()
        {
            //legend template
            Legend legendTemp = Helper.CreateEmptyRect("Legend", transform).gameObject.AddComponent<Legend>();
            legendTemp.background = legendTemp.gameObject.AddComponent<Image>();
            legendTemp.background.sprite = Resources.Load<Sprite>("Images/Chart_Square");
            legendTemp.background.color = chartOptions.legend.backgroundColor;
            legendTemp.background.type = Image.Type.Sliced;
            legendTemp.text = Helper.CreateText("LegendLabel", legendTemp.transform, chartOptions.legend.textOption, chartOptions.plotOptions.generalFont, TextAnchor.MiddleLeft, true);
            legendTemp.text.rectTransform.offsetMin = new Vector2(chartOptions.legend.textOption.fontSize * 1.5f, 0.0f);
            legendTemp.icon = Helper.CreateImage("Icon", legendTemp.transform);
            legendTemp.icon.sprite = chartOptions.legend.iconImage;
            legendTemp.icon.rectTransform.anchorMin = new Vector2(0.0f, 0.5f);
            legendTemp.icon.rectTransform.anchorMax = new Vector2(0.0f, 0.5f);
            legendTemp.icon.rectTransform.sizeDelta = new Vector2(chartOptions.legend.textOption.fontSize * 0.75f, chartOptions.legend.textOption.fontSize * 0.75f);
            legendTemp.icon.rectTransform.anchoredPosition = new Vector2(chartOptions.legend.textOption.fontSize * 0.75f, 0.0f);
            if (chartType == ChartType.BarChart) legendTemp.icon.gameObject.SetActive(!chartOptions.plotOptions.barChartOption.colorByCategories);
            else if (chartType == ChartType.RoseChart) legendTemp.icon.gameObject.SetActive(!chartOptions.plotOptions.roseChartOption.colorByCategories);

            //update items
            RectTransform legendRect = Helper.CreateEmptyRect("Legends", transform);
            float itemMaxWidth = 0.0f;
            Vector2 itemSumSize = Vector2.zero;
            List<Legend> legendList = new List<Legend>();
            for (int i = 0; i < chartData.series.Count; ++i)
            {
                Legend legend = Instantiate(legendTemp, legendRect).GetComponent<Legend>();
                legend.text.text = chartData.series[i].name;

                float width = legend.text.preferredWidth;
                if (width > itemMaxWidth) itemMaxWidth = width;
                legend.background.rectTransform.sizeDelta = new Vector2(width + chartOptions.legend.textOption.fontSize * 2.0f, chartOptions.legend.textOption.fontSize * 1.5f);
                legend.Init(i, this);
                legend.SetStatus(chartData.series[i].show);
                itemSumSize += legend.background.rectTransform.sizeDelta;
                legendList.Add(legend);
            }

            //update rect
            itemMaxWidth += chartOptions.legend.textOption.fontSize * 2.0f;
            int alignment = 0;
            float limitW = 0.0f, limitH = 0.0f;
            bool controlW = false, controlH = false;
            float offset = 0.0f;
            if (chartOptions.legend.itemLayout == RectTransform.Axis.Horizontal)
            {
                switch (chartOptions.legend.alignment)
                {
                    case TextAnchor.LowerCenter:
                    case TextAnchor.LowerLeft:
                    case TextAnchor.LowerRight:
                        alignment = (int)chartOptions.legend.alignment % 3;
                        limitW = chartSize.x;
                        limitH = chartSize.y - chartSize.x > chartSize.x ? chartSize.y - chartSize.x : chartSize.y * 0.4f;
                        offset = Mathf.Clamp(chartOptions.legend.textOption.fontSize * 1.5f, 0.0f, limitH);
                        legendRect.anchorMin = new Vector2(0.0f, 0.0f);
                        legendRect.anchorMax = new Vector2(1.0f, 0.0f);
                        legendRect.offsetMin = new Vector2(0.0f, 0.0f);
                        legendRect.offsetMax = new Vector2(0.0f, offset);
                        offsetMin.y += offset;
                        break;
                    case TextAnchor.UpperCenter:
                    case TextAnchor.UpperLeft:
                    case TextAnchor.UpperRight:
                        alignment = (int)chartOptions.legend.alignment % 3;
                        limitW = chartSize.x;
                        limitH = chartSize.y - chartSize.x > chartSize.x ? chartSize.y - chartSize.x : chartSize.y * 0.4f;
                        offset = Mathf.Clamp(chartOptions.legend.textOption.fontSize * 1.5f, 0.0f, limitH);
                        legendRect.anchorMin = new Vector2(0.0f, 1.0f);
                        legendRect.anchorMax = new Vector2(1.0f, 1.0f);
                        legendRect.offsetMin = new Vector2(0.0f, offsetMax.y - offset);
                        legendRect.offsetMax = new Vector2(0.0f, offsetMax.y);
                        offsetMax.y -= offset;
                        break;
                    case TextAnchor.MiddleLeft:
                        alignment = 1;
                        limitW = chartSize.x - chartSize.y > chartSize.y ? chartSize.x - chartSize.y : chartSize.x * 0.4f;
                        limitH = chartSize.y;
                        offset = Mathf.Clamp(itemSumSize.x, 0.0f, limitW);
                        legendRect.anchorMin = new Vector2(0.0f, 0.0f);
                        legendRect.anchorMax = new Vector2(0.0f, 1.0f);
                        legendRect.offsetMin = new Vector2(0.0f, 0.0f);
                        legendRect.offsetMax = new Vector2(offset, offsetMax.y);
                        offsetMin.x += offset;
                        break;
                    case TextAnchor.MiddleRight:
                        alignment = 1;
                        limitW = chartSize.x - chartSize.y > chartSize.y ? chartSize.x - chartSize.y : chartSize.x * 0.4f;
                        limitH = chartSize.y;
                        offset = Mathf.Clamp(itemSumSize.x, 0.0f, limitW);
                        legendRect.anchorMin = new Vector2(1.0f, 0.0f);
                        legendRect.anchorMax = new Vector2(1.0f, 1.0f);
                        legendRect.offsetMin = new Vector2(-offset, 0.0f);
                        legendRect.offsetMax = new Vector2(0.0f, offsetMax.y);
                        offsetMax.x -= offset;
                        break;
                    default:
                        alignment = 1;
                        limitW = chartSize.x;
                        limitH = chartSize.y;
                        legendRect.anchorMin = new Vector2(0.0f, 0.0f);
                        legendRect.anchorMax = new Vector2(1.0f, 1.0f);
                        legendRect.offsetMin = new Vector2(0.0f, 0.0f);
                        legendRect.offsetMax = new Vector2(0.0f, offsetMax.y);
                        break;
                }
                if (itemSumSize.x > limitW)
                {
                    controlW = true;
                    float wLimit = limitW / legendList.Count - chartOptions.legend.textOption.fontSize * 1.5f;
                    foreach (Legend l in legendList) if (l.text.preferredWidth > wLimit) Helper.TruncateText(l.text, wLimit);
                }
                Helper.AddHorizontalLayout(legendRect.gameObject, controlW, controlH, alignment);
            }
            else
            {
                limitH = Mathf.Clamp(itemSumSize.y, 0.0f, chartSize.y * 0.4f);
                switch (chartOptions.legend.alignment)
                {
                    case TextAnchor.MiddleLeft:
                    case TextAnchor.UpperLeft:
                    case TextAnchor.LowerLeft:
                        alignment = (int)chartOptions.legend.alignment / 3;
                        limitW = chartSize.x - chartSize.y > chartSize.y ? chartSize.x - chartSize.y : chartSize.x * 0.4f;
                        limitH = chartSize.y;
                        offset = Mathf.Clamp(itemMaxWidth, 0.0f, limitW);
                        legendRect.anchorMin = new Vector2(0.0f, 0.0f);
                        legendRect.anchorMax = new Vector2(0.0f, 1.0f);
                        legendRect.offsetMin = new Vector2(0.0f, 0.0f);
                        legendRect.offsetMax = new Vector2(offset, offsetMax.y);
                        offsetMin.x += offset;
                        break;
                    case TextAnchor.MiddleRight:
                    case TextAnchor.UpperRight:
                    case TextAnchor.LowerRight:
                        alignment = (int)chartOptions.legend.alignment / 3;
                        limitW = chartSize.x - chartSize.y > chartSize.y ? chartSize.x - chartSize.y : chartSize.x * 0.4f;
                        limitH = chartSize.y;
                        offset = Mathf.Clamp(itemMaxWidth, 0.0f, limitW);
                        legendRect.anchorMin = new Vector2(1.0f, 0.0f);
                        legendRect.anchorMax = new Vector2(1.0f, 1.0f);
                        legendRect.offsetMin = new Vector2(-offset, 0.0f);
                        legendRect.offsetMax = new Vector2(0.0f, offsetMax.y);
                        offsetMax.x -= offset;
                        break;
                    case TextAnchor.LowerCenter:
                        alignment = 1;
                        limitW = chartSize.x;
                        limitH = chartSize.y - chartSize.x > chartSize.x ? chartSize.y - chartSize.x : chartSize.y * 0.4f;
                        offset = Mathf.Clamp(itemSumSize.y, 0.0f, limitH);
                        legendRect.anchorMin = new Vector2(0.0f, 0.0f);
                        legendRect.anchorMax = new Vector2(1.0f, 0.0f);
                        legendRect.offsetMin = new Vector2(0.0f, 0.0f);
                        legendRect.offsetMax = new Vector2(0.0f, offset);
                        offsetMin.y += offset;
                        break;
                    case TextAnchor.UpperCenter:
                        alignment = 1;
                        limitW = chartSize.x;
                        limitH = chartSize.y - chartSize.x > chartSize.x ? chartSize.y - chartSize.x : chartSize.y * 0.4f;
                        offset = Mathf.Clamp(itemSumSize.y, 0.0f, limitH);
                        legendRect.anchorMin = new Vector2(0.0f, 1.0f);
                        legendRect.anchorMax = new Vector2(1.0f, 1.0f);
                        legendRect.offsetMin = new Vector2(0.0f, offsetMax.y - offset);
                        legendRect.offsetMax = new Vector2(0.0f, offsetMax.y);
                        offsetMax.y -= offset;
                        break;
                    default:
                        alignment = 1;
                        limitW = chartSize.x;
                        limitH = chartSize.y;
                        legendRect.anchorMin = new Vector2(0.0f, 0.0f);
                        legendRect.anchorMax = new Vector2(1.0f, 1.0f);
                        legendRect.offsetMin = new Vector2(0.0f, 0.0f);
                        legendRect.offsetMax = new Vector2(0.0f, offsetMax.y);
                        break;
                }
                if (itemMaxWidth > limitW)
                {
                    controlW = true;
                    foreach (Legend l in legendList) if (l.text.preferredWidth > limitW) Helper.TruncateText(l.text, limitW);
                }
                if (itemSumSize.y > limitH) controlH = true;
                Helper.AddVerticalLayout(legendRect.gameObject, controlW, controlH, alignment);
            }

            Helper.Destroy(legendTemp.gameObject);
        }

        void UpdateContent()
        {
            if (chartType != ChartType.PieChart)
            {
                offsetMax -= new Vector2(chartOptions.xAxis.labelOption.fontSize * 0.7f, chartOptions.yAxis.labelOption.fontSize * 0.7f);
            }
            offsetMin.x = Mathf.Clamp(offsetMin.x, 0.0f, chartSize.x * 0.4f);
            offsetMin.y = Mathf.Clamp(offsetMin.y, 0.0f, chartSize.y * 0.4f);
            offsetMax.x = Mathf.Clamp(offsetMax.x, -chartSize.x * 0.4f, 0.0f);
            offsetMax.y = Mathf.Clamp(offsetMax.y, -chartSize.y * 0.4f, 0.0f);
            chartSize -= offsetMin - offsetMax;

            RectTransform chartRect = Helper.CreateEmptyRect("Content", transform);
            chartRect.anchorMin = Vector2.zero;
            chartRect.anchorMax = Vector2.one;
            chartRect.offsetMin = offsetMin;
            chartRect.offsetMax = offsetMax;
            chartRect.transform.SetAsFirstSibling();

            ChartBase chart = null;
            RectTransform chartContent = Helper.CreateEmptyRect("ChartContent", chartRect, true);
            switch (chartType)
            {
                case ChartType.BarChart:
                    chart = chartContent.gameObject.AddComponent<BarChart>();
                    ((BarChart)chart).chartGrid = chart.gameObject.AddComponent<ChartGrid>();
                    chartContent.pivot = Vector2.zero;
                    break;
                case ChartType.LineChart:
                    chart = chartContent.gameObject.AddComponent<LineChart>();
                    ((LineChart)chart).chartGrid = chart.gameObject.AddComponent<ChartGrid>();
                    chartContent.pivot = Vector2.zero;
                    break;
                case ChartType.PieChart:
                    chart = chartContent.gameObject.AddComponent<PieChart>();
                    break;
                case ChartType.RoseChart:
                    chart = chartContent.gameObject.AddComponent<RoseChart>();
                    break;
            }
            chart.chartSize = chartSize;
            chart.tooltip = tooltip;
            chart.chartRect = chartRect;
            chart.chartData = chartData;
            chart.chartOptions = chartOptions;
            ChartModifier modifier = GetComponent<ChartModifier>();
            if (modifier == null) chart.UpdateChart();
            else modifier.UpdateChart(chart);
        }
    }
}
