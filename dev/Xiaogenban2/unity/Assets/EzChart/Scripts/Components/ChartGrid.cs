using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
#if CHART_TMPRO
using TMPro;
#endif

namespace ChartUtil
{
    public class ChartGrid : MonoBehaviour
    {
        [HideInInspector] public Vector2 chartSize;
        [HideInInspector] public RectTransform chartRect;
        [HideInInspector] public ChartOptions chartOptions;
        [HideInInspector] public ChartData chartData;
        [HideInInspector] public bool useMidTick = false;
        [HideInInspector] public bool init = false;

        [HideInInspector] public int numberOfSteps = 1;
        [HideInInspector] public float stepSize = 0.0f;
        [HideInInspector] public float minRange = 0.0f;
        [HideInInspector] public float maxRange = 0.0f;
        [HideInInspector] public float zeroLine = 0.0f;
        [HideInInspector] public float zeroRatio = 0.0f;
        [HideInInspector] public float unitWidth = 0.0f;
        [HideInInspector] public string format = "N0";

        [HideInInspector] public List<float> positiveSum = new List<float>();
        [HideInInspector] public List<float> negativeSum = new List<float>();
        [HideInInspector] public List<GridItem> itemList = new List<GridItem>();

        float tickLength;
        Vector2 offsetMin = new Vector2();
#if CHART_TMPRO
        public TextMeshProUGUI xTitle, yTitle;
#else
        Text xTitle, yTitle;
#endif

        public void UpdateGrid()
        {
            if (init) return;
            init = true;

            gameObject.AddComponent<Image>().color = chartOptions.plotOptions.backgroundColor;
            tickLength = chartOptions.plotOptions.gridLineWidth * 2.5f;

            float minValue = 0.0f, maxValue = 0.0f;
            switch (chartOptions.plotOptions.columnStacking)
            {
                case ColumnStacking.None:
                    for (int i = 0; i < chartData.categories.Count; ++i)
                    {
                        float pSum = Helper.GetPositiveSumByCategory(chartData, i);
                        positiveSum.Add(pSum);
                    }
                    if (chartOptions.yAxis.fixedRange)
                    {
                        minRange = chartOptions.yAxis.fixedMinRange;
                        maxRange = chartOptions.yAxis.fixedMaxRange;
                        numberOfSteps = chartOptions.yAxis.fixedRangeDivision;
                        stepSize = (maxRange - minRange) / numberOfSteps;
                    }
                    else
                    {
                        Helper.FindMinMaxValue(chartData, out minValue, out maxValue);
                        Helper.FindRange(chartOptions.yAxis.startFromZero, chartOptions.yAxis.minRangeDivision, minValue, maxValue, out minRange, out maxRange, out stepSize, out numberOfSteps);
                    }
                    break;
                case ColumnStacking.Normal:
                    for (int i = 0; i < chartData.categories.Count; ++i)
                    {
                        float pSum, nSum;
                        Helper.GetSumByCategory(chartData, i, out pSum, out nSum);
                        if (pSum > maxValue) maxValue = pSum;
                        if (nSum < minValue) minValue = nSum;
                    }
                    Helper.FindRange(chartOptions.yAxis.startFromZero, chartOptions.yAxis.minRangeDivision, minValue, maxValue, out minRange, out maxRange, out stepSize, out numberOfSteps);
                    break;
                case ColumnStacking.Percent:
                    for (int i = 0; i < chartData.categories.Count; ++i)
                    {
                        float pSum, nSum;
                        Helper.GetSumByCategory(chartData, i, out pSum, out nSum);
                        if (pSum > maxValue) maxValue = pSum;
                        if (nSum < minValue) minValue = nSum;
                        positiveSum.Add(pSum);
                        negativeSum.Add(-nSum);
                    }
                    minRange = minValue < 0.0f ? -1.0f : 0.0f;
                    maxRange = maxValue > 0.0f ? 1.0f : 0.0f;
                    numberOfSteps = minRange < 0.0f && maxRange > 0.0f ? 10 : 5;
                    stepSize = 0.2f;
                    break;
                default:
                    break;
            }
            if (stepSize >= 1.0f) format = "N0";
            else format = "N" + Helper.FindFloatDisplayPrecision(stepSize).ToString();
            if (minRange >= 0.0f) zeroLine = minRange;
            else if (maxRange < 0.0f) zeroLine = maxRange - stepSize;
            zeroRatio = (zeroLine - minRange) / (maxRange - minRange);

            if (chartOptions.yAxis.enableTitle) UpdateYAxisTitle();
            if (chartOptions.xAxis.enableTitle) UpdateXAxisTitle();
            UpdateGridLines();
            UpdateItems();
            if (xTitle != null)
                xTitle.rectTransform.anchoredPosition = chartOptions.plotOptions.inverted ? 
                    new Vector2(xTitle.rectTransform.anchoredPosition.x, offsetMin.y * 0.5f) : 
                    new Vector2(offsetMin.x * 0.5f, xTitle.rectTransform.anchoredPosition.y);
            if (yTitle != null)
                yTitle.rectTransform.anchoredPosition = chartOptions.plotOptions.inverted ?
                    new Vector2(offsetMin.x * 0.5f, yTitle.rectTransform.anchoredPosition.y) :
                    new Vector2(yTitle.rectTransform.anchoredPosition.x, offsetMin.y * 0.5f);
            GetComponent<RectTransform>().offsetMin = offsetMin;
            chartSize -= offsetMin;
        }

        void UpdateYAxisTitle()
        {
            yTitle = Helper.CreateText("YTitle", chartRect, chartOptions.yAxis.titleOption, chartOptions.plotOptions.generalFont);
            yTitle.text = chartData.unit == "" ? chartOptions.yAxis.title : chartOptions.yAxis.title + " (" + chartData.unit + ")";

            float height = yTitle.fontSize * 1.2f;
            float width = yTitle.preferredWidth;
            if (chartOptions.plotOptions.inverted)
            {
                yTitle.rectTransform.anchorMin = new Vector2(0.5f, 0.0f);
                yTitle.rectTransform.anchorMax = new Vector2(0.5f, 0.0f);
                yTitle.rectTransform.sizeDelta = new Vector2(width, height);
                yTitle.rectTransform.anchoredPosition = new Vector2(height * 0.5f, height * 0.5f);
                offsetMin.y = height;
            }
            else
            {
                yTitle.rectTransform.anchorMin = new Vector2(0.0f, 0.5f);
                yTitle.rectTransform.anchorMax = new Vector2(0.0f, 0.5f);
                yTitle.rectTransform.sizeDelta = new Vector2(width, height);
                yTitle.rectTransform.anchoredPosition = new Vector2(height * 0.5f, height * 0.5f);
                yTitle.rectTransform.localRotation = Quaternion.Euler(0.0f, 0.0f, 90.0f);
                offsetMin.x = height;
            }
        }

        void UpdateXAxisTitle()
        {
            xTitle = Helper.CreateText("XTitle", chartRect, chartOptions.xAxis.titleOption, chartOptions.plotOptions.generalFont);
            xTitle.text = chartOptions.xAxis.title;

            float height = xTitle.fontSize * 1.2f;
            float width = xTitle.preferredWidth;
            if (chartOptions.plotOptions.inverted)
            {
                xTitle.rectTransform.anchorMin = new Vector2(0.0f, 0.5f);
                xTitle.rectTransform.anchorMax = new Vector2(0.0f, 0.5f);
                xTitle.rectTransform.sizeDelta = new Vector2(width, height);
                xTitle.rectTransform.anchoredPosition = new Vector2(height * 0.5f, height * 0.5f);
                xTitle.rectTransform.localRotation = Quaternion.Euler(0.0f, 0.0f, 90.0f);
                offsetMin.x = height;
            }
            else
            {
                xTitle.rectTransform.anchorMin = new Vector2(0.5f, 0.0f);
                xTitle.rectTransform.anchorMax = new Vector2(0.5f, 0.0f);
                xTitle.rectTransform.sizeDelta = new Vector2(width, height);
                xTitle.rectTransform.anchoredPosition = new Vector2(height * 0.5f, height * 0.5f);
                offsetMin.y = height;
            }
        }

        void UpdateGridLines()
        {
            RectTransform gridRect = Helper.CreateEmptyRect("GridRect", transform, true);

            //template
            GridLine gridLineTemp = Helper.CreateEmptyRect("Line", gridRect).gameObject.AddComponent<GridLine>();
            gridLineTemp.line = gridLineTemp.gameObject.AddComponent<Image>();
            gridLineTemp.line.raycastTarget = false;
            gridLineTemp.line.color = chartOptions.plotOptions.minorGridLineColor;
            gridLineTemp.line.rectTransform.anchoredPosition = Vector2.zero;
            gridLineTemp.label = Helper.CreateText("Label", gridLineTemp.transform, chartOptions.yAxis.labelOption, chartOptions.plotOptions.generalFont);
            gridLineTemp.label.rectTransform.sizeDelta = Vector2.zero;
            gridLineTemp.label.gameObject.SetActive(chartOptions.yAxis.enableLabel);

            float spacing = 1.0f / numberOfSteps;
            int zeroLineIndex = 0;
            List<GridLine> gridList = new List<GridLine>();

            if (chartOptions.plotOptions.inverted)
            {
                gridLineTemp.line.rectTransform.sizeDelta = new Vector2(chartOptions.plotOptions.minorGridLineWidth, 0.0f);
                gridLineTemp.label.rectTransform.anchorMin = new Vector2(0.5f, 0.0f);
                gridLineTemp.label.rectTransform.anchorMax = new Vector2(0.5f, 0.0f);
                gridLineTemp.label.rectTransform.anchoredPosition = new Vector2(0.0f, -tickLength);
                gridLineTemp.label.rectTransform.pivot = new Vector2(0.5f, 1.0f);
                gridLineTemp.label.alignment = Helper.ConvertAlignment(TextAnchor.UpperCenter);

                for (int i = 0; i < numberOfSteps + 1; ++i)
                {
                    GridLine gLine = Instantiate(gridLineTemp, gridRect).GetComponent<GridLine>();
                    gLine.line.rectTransform.anchorMin = new Vector2(spacing * i, 0.0f);
                    gLine.line.rectTransform.anchorMax = new Vector2(spacing * i, 1.0f);
                    gLine.label.text = (minRange + stepSize * i).ToString(format);
                    if (Mathf.Approximately(minRange + stepSize * i, zeroLine)) zeroLineIndex = i;
                    gridList.Add(gLine);
                }
                gridList[zeroLineIndex].line.color = chartOptions.plotOptions.gridLineColor;
                gridList[zeroLineIndex].line.rectTransform.sizeDelta = new Vector2(chartOptions.plotOptions.gridLineWidth, 0.0f);

                if (chartOptions.yAxis.enableLabel)
                {
                    float height = chartOptions.yAxis.labelOption.fontSize * 1.2f + tickLength;
                    offsetMin.y += height;
                    offsetMin.y = Mathf.Clamp(offsetMin.y, 0.0f, chartSize.y * 0.5f);
                }

                Image yAxis = Helper.CreateImage("YAxis", gridRect);
                yAxis.color = chartOptions.plotOptions.gridLineColor;
                yAxis.rectTransform.anchorMin = new Vector2(0.0f, 0.0f);
                yAxis.rectTransform.anchorMax = new Vector2(1.0f, 0.0f);
                yAxis.rectTransform.anchoredPosition = Vector2.zero;
                yAxis.rectTransform.sizeDelta = new Vector2(0.0f, chartOptions.plotOptions.gridLineWidth);
                yAxis.rectTransform.offsetMin -= new Vector2(tickLength, 0.0f);
            }
            else
            {
                gridLineTemp.line.rectTransform.sizeDelta = new Vector2(0.0f, chartOptions.plotOptions.minorGridLineWidth);
                gridLineTemp.label.rectTransform.anchorMin = new Vector2(0.0f, 0.5f);
                gridLineTemp.label.rectTransform.anchorMax = new Vector2(0.0f, 0.5f);
                gridLineTemp.label.rectTransform.anchoredPosition = new Vector2(-tickLength, 0.0f);
                gridLineTemp.label.rectTransform.pivot = new Vector2(1.0f, 0.5f);
                gridLineTemp.label.alignment = Helper.ConvertAlignment(TextAnchor.MiddleRight);

                for (int i = 0; i < numberOfSteps + 1; ++i)
                {
                    GridLine gLine = Instantiate(gridLineTemp, gridRect).GetComponent<GridLine>();
                    gLine.line.rectTransform.anchorMin = new Vector2(0.0f, spacing * i);
                    gLine.line.rectTransform.anchorMax = new Vector2(1.0f, spacing * i);
                    gLine.label.text = (minRange + stepSize * i).ToString(format);
                    if (Mathf.Approximately(minRange + stepSize * i, zeroLine)) zeroLineIndex = i;
                    gridList.Add(gLine);
                }
                gridList[zeroLineIndex].line.color = chartOptions.plotOptions.gridLineColor;
                gridList[zeroLineIndex].line.rectTransform.sizeDelta = new Vector2(0.0f, chartOptions.plotOptions.gridLineWidth);

                if (chartOptions.yAxis.enableLabel)
                {
                    var temp = gridList[0].label.text.Length > gridList[gridList.Count - 1].label.text.Length ? gridList[0].label : gridList[gridList.Count - 1].label;
                    float width = temp.preferredWidth + tickLength * 2.0f;
                    offsetMin.x += width;
                    offsetMin.x = Mathf.Clamp(offsetMin.x, 0.0f, chartSize.x * 0.5f);
                }

                Image yAxis = Helper.CreateImage("YAxis", gridRect);
                yAxis.color = chartOptions.plotOptions.gridLineColor;
                yAxis.rectTransform.anchorMin = new Vector2(0.0f, 0.0f);
                yAxis.rectTransform.anchorMax = new Vector2(0.0f, 1.0f);
                yAxis.rectTransform.anchoredPosition = Vector2.zero;
                yAxis.rectTransform.sizeDelta = new Vector2(chartOptions.plotOptions.gridLineWidth, 0.0f);
                yAxis.rectTransform.offsetMin -= new Vector2(0.0f, tickLength);
            }

            Helper.Destroy(gridLineTemp.gameObject);
        }

        void UpdateItems()
        {
            RectTransform itemRect = Helper.CreateEmptyRect("ItemRect", transform, true);

            //template
            GridItem gridItemTemp = Helper.CreateEmptyRect("Item", itemRect).gameObject.AddComponent<GridItem>();
            gridItemTemp.background = gridItemTemp.gameObject.AddComponent<Image>();
            gridItemTemp.background.raycastTarget = false;
            gridItemTemp.background.color = Color.clear;
            gridItemTemp.background.rectTransform.anchoredPosition = Vector2.zero;
            gridItemTemp.background.rectTransform.sizeDelta = Vector2.zero;
            gridItemTemp.label = Helper.CreateText("Label", gridItemTemp.transform, chartOptions.xAxis.labelOption, chartOptions.plotOptions.generalFont);
            gridItemTemp.label.rectTransform.sizeDelta = Vector2.zero;
            gridItemTemp.label.gameObject.SetActive(chartOptions.xAxis.enableLabel);
            gridItemTemp.tick = Helper.CreateImage("Tick", gridItemTemp.transform);
            gridItemTemp.tick.color = chartOptions.plotOptions.gridLineColor;

            float spacing = 1.0f / chartData.categories.Count;
            float maxWidth = 0.0f;
            if (chartOptions.plotOptions.inverted)
            {
                gridItemTemp.background.rectTransform.pivot = new Vector2(0.0f, 0.5f);
                gridItemTemp.label.rectTransform.anchorMin = new Vector2(0.0f, 0.5f);
                gridItemTemp.label.rectTransform.anchorMax = new Vector2(0.0f, 0.5f);
                gridItemTemp.label.rectTransform.anchoredPosition = new Vector2(-tickLength * 1.2f, 0.0f);
                gridItemTemp.label.rectTransform.pivot = new Vector2(1.0f, 0.5f);
                gridItemTemp.label.alignment = Helper.ConvertAlignment(TextAnchor.MiddleRight);
                gridItemTemp.tick.rectTransform.pivot = new Vector2(1.0f, 0.5f);
                gridItemTemp.tick.rectTransform.sizeDelta = new Vector2(tickLength, chartOptions.plotOptions.gridLineWidth);
                if (useMidTick)
                {
                    gridItemTemp.tick.rectTransform.anchorMin = new Vector2(0.0f, 0.5f);
                    gridItemTemp.tick.rectTransform.anchorMax = new Vector2(0.0f, 0.5f);
                }
                else
                {
                    gridItemTemp.tick.rectTransform.anchorMin = new Vector2(0.0f, 1.0f);
                    gridItemTemp.tick.rectTransform.anchorMax = new Vector2(0.0f, 1.0f);
                }

                unitWidth = (chartSize.y - offsetMin.y) / chartData.categories.Count;
                for (int i = 0; i < chartData.categories.Count; ++i)
                {
                    int index = !chartOptions.plotOptions.reverseSeries ? chartData.categories.Count - i - 1 : i;
                    GridItem item = Instantiate(gridItemTemp, itemRect).GetComponent<GridItem>();
                    item.background.rectTransform.anchorMin = new Vector2(0.0f, spacing * index);
                    item.background.rectTransform.anchorMax = new Vector2(1.0f, spacing * (index + 1));
                    item.label.text = chartData.categories[i];
                    float width = item.label.preferredWidth + tickLength * 2;
                    if (width > maxWidth) maxWidth = width;
                    itemList.Add(item);
                }

                if (chartOptions.xAxis.enableLabel)
                {
                    maxWidth += tickLength * 1.2f;
                    offsetMin.x += maxWidth;
                    offsetMin.x = Mathf.Clamp(offsetMin.x, 0.0f, chartSize.x * 0.5f);

                    float skipCounter = 0.0f;
                    for (int i = 0; i < chartData.categories.Count; ++i)
                    {
                        if (chartOptions.xAxis.forceSkipLabel < 0)
                        {
                            skipCounter -= unitWidth;
                            if (skipCounter < 0.0f)
                            {
                                skipCounter = chartOptions.xAxis.labelOption.fontSize * 1.25f;
                            }
                            else itemList[i].label.gameObject.SetActive(false);
                        }
                        else
                        {
                            skipCounter -= 1.0f;
                            if (skipCounter < 0.0f)
                            {
                                skipCounter = chartOptions.xAxis.forceSkipLabel;
                            }
                            else itemList[i].label.gameObject.SetActive(false);
                        }
                    }
                }
            }
            else
            {
                gridItemTemp.background.rectTransform.pivot = new Vector2(0.5f, 0.0f);
                gridItemTemp.label.rectTransform.anchorMin = new Vector2(0.5f, 0.0f);
                gridItemTemp.label.rectTransform.anchorMax = new Vector2(0.5f, 0.0f);
                gridItemTemp.label.rectTransform.anchoredPosition = new Vector2(0.0f, -tickLength * 1.2f);
                gridItemTemp.label.rectTransform.pivot = new Vector2(0.5f, 1.0f);
                gridItemTemp.label.alignment = Helper.ConvertAlignment(TextAnchor.UpperCenter);
                gridItemTemp.tick.rectTransform.pivot = new Vector2(0.5f, 1.0f);
                gridItemTemp.tick.rectTransform.sizeDelta = new Vector2(chartOptions.plotOptions.gridLineWidth, tickLength);
                if (useMidTick)
                {
                    gridItemTemp.tick.rectTransform.anchorMin = new Vector2(0.5f, 0.0f);
                    gridItemTemp.tick.rectTransform.anchorMax = new Vector2(0.5f, 0.0f);
                }
                else
                {
                    gridItemTemp.tick.rectTransform.anchorMin = new Vector2(1.0f, 0.0f);
                    gridItemTemp.tick.rectTransform.anchorMax = new Vector2(1.0f, 0.0f);
                }

                unitWidth = (chartSize.x - offsetMin.x) / chartData.categories.Count;
                for (int i = 0; i < chartData.categories.Count; ++i)
                {
                    int index = chartOptions.plotOptions.reverseSeries ? chartData.categories.Count - i - 1 : i;
                    GridItem item = Instantiate(gridItemTemp, itemRect).GetComponent<GridItem>();
                    item.background.rectTransform.anchorMin = new Vector2(spacing * index, 0.0f);
                    item.background.rectTransform.anchorMax = new Vector2(spacing * (index + 1), 1.0f);
                    item.label.text = chartData.categories[i];
                    float width = item.label.preferredWidth;
                    if (width > maxWidth) maxWidth = width;
                    itemList.Add(item);
                }

                if (chartOptions.xAxis.enableLabel)
                {
                    bool useLongLabel = maxWidth > unitWidth * 0.8f && !chartOptions.xAxis.forceHorizontalLabel;
                    float height = useLongLabel ? maxWidth * 0.8f : chartOptions.xAxis.labelOption.fontSize * 1.2f;
                    height += tickLength * 1.2f;
                    offsetMin.y += height;
                    offsetMin.y = Mathf.Clamp(offsetMin.y, 0.0f, chartSize.y * 0.5f);

                    float skipCounter = 0.0f;
                    for (int i = 0; i < chartData.categories.Count; ++i)
                    {
                        if (chartOptions.xAxis.forceSkipLabel < 0)
                        {
                            skipCounter -= unitWidth;
                            if (skipCounter < 0.0f)
                            {
                                itemList[i].UseLongLabel(useLongLabel, -tickLength * 1.2f);
                                skipCounter = chartOptions.xAxis.labelOption.fontSize * 1.25f;
                            }
                            else itemList[i].label.gameObject.SetActive(false);
                        }
                        else
                        {
                            skipCounter -= 1.0f;
                            if (skipCounter < 0.0f)
                            {
                                itemList[i].UseLongLabel(useLongLabel, -tickLength * 1.2f);
                                skipCounter = chartOptions.xAxis.forceSkipLabel;
                            }
                            else itemList[i].label.gameObject.SetActive(false);
                        }
                    }
                }
            }

            Helper.Destroy(gridItemTemp.gameObject);
        }
    }
}