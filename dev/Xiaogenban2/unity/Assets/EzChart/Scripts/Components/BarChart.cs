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
    public class BarChart : ChartBase
    {
        public ChartGrid chartGrid;

        public override void UpdateChart()
        {
            if (!chartGrid.init)
            {
                chartGrid.chartSize = chartSize;
                chartGrid.chartRect = chartRect;
                chartGrid.chartOptions = chartOptions;
                chartGrid.chartData = chartData;
                chartGrid.useMidTick = false;
                chartGrid.UpdateGrid();
            }
            UpdateItems();
        }

        protected override int FindCurrentItem()
        {
            int index = 0;
            if (chartOptions.plotOptions.inverted)
            {
                float y = (mousePosition.y - chartGrid.transform.position.y) / chartGrid.transform.lossyScale.y;
                index = Mathf.FloorToInt(y / (chartGrid.chartSize.y / chartGrid.itemList.Count));
            }
            else
            {
                float x = (mousePosition.x - chartGrid.transform.position.x) / chartGrid.transform.lossyScale.x;
                index = Mathf.FloorToInt(x / (chartGrid.chartSize.x / chartGrid.itemList.Count));
            }
            index = Mathf.Clamp(index, 0, chartGrid.itemList.Count - 1);
            index = chartOptions.plotOptions.reverseSeries != chartOptions.plotOptions.inverted ? chartData.categories.Count - index - 1 : index;
            return index;
        }

        protected override void HighlightCurrentItem()
        {
            chartGrid.itemList[currItem].background.color = chartOptions.plotOptions.itemHighlightColor;
        }

        protected override void UnhighlightCurrentItem()
        {
            chartGrid.itemList[currItem].background.color = Color.clear;
        }

        protected override void ShowTooltip()
        {
            if (tooltip == null) return;
            tooltip.gameObject.SetActive(true);
            tooltip.tooltipText.text = chartGrid.itemList[currItem].label.text;
            for (int i = 0; i < chartData.series.Count; ++i)
            {
                if (!chartData.series[i].show || !IsValid(i, currItem)) continue;
                tooltip.tooltipText.text += "\n" + GetLabelText(i, currItem, chartOptions.tooltip.format);
            }
            tooltip.background.rectTransform.sizeDelta = new Vector2(tooltip.tooltipText.preferredWidth + 16, tooltip.tooltipText.preferredHeight + 6);
        }

        bool IsValid(int sIndex, int dIndex)
        {
            return dIndex < chartData.series[sIndex].data.Count && chartData.series[sIndex].data[dIndex].show;
        }

        float GetDataValue(int sIndex, int dIndex, float[] stackValueList, float[] stackValueListNeg)
        {
            float value = 0.0f;
            switch (chartOptions.plotOptions.columnStacking)
            {
                case ColumnStacking.None:
                    value = chartData.series[sIndex].data[dIndex].value;
                    break;
                case ColumnStacking.Normal:
                    if (chartData.series[sIndex].data[dIndex].value >= 0.0f)
                    {
                        value = stackValueList[dIndex] + chartData.series[sIndex].data[dIndex].value;
                        stackValueList[dIndex] = value;
                    }
                    else
                    {
                        value = stackValueListNeg[dIndex] + chartData.series[sIndex].data[dIndex].value;
                        stackValueListNeg[dIndex] = value;
                    }
                    break;
                case ColumnStacking.Percent:
                    if (chartData.series[sIndex].data[dIndex].value >= 0.0f)
                    {
                        value = stackValueList[dIndex] + chartData.series[sIndex].data[dIndex].value / chartGrid.positiveSum[dIndex];
                        stackValueList[dIndex] = value;
                    }
                    else
                    {
                        value = stackValueListNeg[dIndex] + chartData.series[sIndex].data[dIndex].value / chartGrid.negativeSum[dIndex];
                        stackValueListNeg[dIndex] = value;
                    }
                    break;
                default:
                    break;
            }
            return value;
        }

        string GetLabelText(int sIndex, int dIndex, DataDisplayFormat format)
        {
            string str;
            switch (format)
            {
                case DataDisplayFormat.Name:
                    str = chartData.series[sIndex].name;
                    break;
                case DataDisplayFormat.Name_Percentage:
                    str = chartData.series[sIndex].data[dIndex].value >= 0.0f ?
                        chartData.series[sIndex].name + ": " + (chartData.series[sIndex].data[dIndex].value / chartGrid.positiveSum[dIndex] * 100).ToString("f0") + "%" :
                        chartData.series[sIndex].name + ": " + (chartData.series[sIndex].data[dIndex].value / chartGrid.negativeSum[dIndex] * 100).ToString("f0") + "%";
                    break;
                case DataDisplayFormat.Name_Value:
                    str = chartData.series[sIndex].name + ": " + chartData.series[sIndex].data[dIndex].value.ToString(chartGrid.format);
                    break;
                case DataDisplayFormat.Percentage:
                    str = chartData.series[sIndex].data[dIndex].value >= 0.0f ? 
                        (chartData.series[sIndex].data[dIndex].value / chartGrid.positiveSum[dIndex] * 100).ToString("f0") + "%" :
                        (chartData.series[sIndex].data[dIndex].value / chartGrid.negativeSum[dIndex] * 100).ToString("f0") + "%";
                    break;
                case DataDisplayFormat.Value:
                    str = chartData.series[sIndex].data[dIndex].value.ToString(chartGrid.format);
                    break;
                default:
                    str = "";
                    break;
            }
            return str;
        }

        void UpdateItems()
        {
            //template
            Image barTemp = Helper.CreateImage("Bar", transform);
#if CHART_TMPRO
            TextMeshProUGUI labelTemp;
#else
            Text labelTemp;
#endif
            labelTemp = Helper.CreateText("Label", transform, chartOptions.label.textOption, chartOptions.plotOptions.generalFont);
            labelTemp.rectTransform.sizeDelta = Vector2.zero;

            //items
            float maxBarWidth = chartOptions.plotOptions.columnStacking == ColumnStacking.None ? chartGrid.unitWidth / chartData.series.Count : chartGrid.unitWidth;
            float barWidth = Mathf.Clamp(chartOptions.plotOptions.barChartOption.barWidth, 0.0f, maxBarWidth);
            float barSpace = Mathf.Clamp(chartOptions.plotOptions.barChartOption.itemSeparation, -barWidth * 0.5f, maxBarWidth - barWidth);
            float barUnit = barWidth + barSpace;

            int activeCount = 0;
            if (chartOptions.plotOptions.columnStacking == ColumnStacking.None)
            { for (int i = 0; i < chartData.series.Count; ++i) if (!skipSeries.Contains(i) && chartData.series[i].show) activeCount++; }
            else { activeCount = 1; }
            float x = -(activeCount - 1) * barUnit * 0.5f;

            activeCount = 0;
            float[] stackValueList = chartOptions.plotOptions.columnStacking == ColumnStacking.None ? null : new float[chartData.categories.Count];
            float[] stackValueListNeg = chartOptions.plotOptions.columnStacking == ColumnStacking.None ? null : new float[chartData.categories.Count];

            if (chartOptions.plotOptions.inverted)
            {
                barTemp.rectTransform.anchorMin = new Vector2(chartGrid.zeroRatio, 0.5f);
                barTemp.rectTransform.anchorMax = new Vector2(chartGrid.zeroRatio, 0.5f);
                barTemp.rectTransform.pivot = new Vector2(0.0f, 0.5f);
                labelTemp.rectTransform.anchorMin = barTemp.rectTransform.anchorMin;
                labelTemp.rectTransform.anchorMax = barTemp.rectTransform.anchorMax;

                for (int i = 0; i < chartData.series.Count; ++i)
                {
                    if (skipSeries.Contains(i) || !chartData.series[i].show) continue;
                    for (int j = 0; j < chartData.categories.Count; ++j)
                    {
                        if (!IsValid(i, j)) continue;
                        float value = GetDataValue(i, j, stackValueList, stackValueListNeg);
                        float ratio = Mathf.Clamp01((value - chartGrid.minRange) / (chartGrid.maxRange - chartGrid.minRange));
                        Vector2 size = new Vector2(chartGrid.chartSize.x * (ratio - chartGrid.zeroRatio), barWidth);
                        Vector3 barScale = Vector3.one;
                        if (size.x < 0.0f) { size.x = -size.x; barScale = new Vector3(-1.0f, 1.0f, 1.0f); }

                        Image bar = Instantiate(barTemp, chartGrid.itemList[j].transform).GetComponent<Image>();
                        bar.color = chartOptions.plotOptions.barChartOption.colorByCategories ?
                            chartOptions.plotOptions.dataColor[j % chartOptions.plotOptions.dataColor.Length] :
                            chartOptions.plotOptions.dataColor[i % chartOptions.plotOptions.dataColor.Length];
                        bar.rectTransform.anchoredPosition = new Vector2(0.0f, x + barUnit * activeCount);
                        bar.rectTransform.localScale = barScale;
                        bar.rectTransform.sizeDelta = size;
                        bar.transform.SetAsFirstSibling();

                        if (chartOptions.label.enable)
                        {
                            var label = Instantiate(labelTemp, chartGrid.itemList[j].transform);
                            label.text = GetLabelText(i, j, chartOptions.label.format);
                            label.rectTransform.anchoredPosition = new Vector2((size.x + chartOptions.label.offset) * bar.rectTransform.localScale.x, bar.rectTransform.anchoredPosition.y);
                        }
                    }
                    if (chartOptions.plotOptions.columnStacking == ColumnStacking.None) activeCount++;
                }
            }
            else
            {
                barTemp.rectTransform.anchorMin = new Vector2(0.5f, chartGrid.zeroRatio);
                barTemp.rectTransform.anchorMax = new Vector2(0.5f, chartGrid.zeroRatio);
                barTemp.rectTransform.pivot = new Vector2(0.5f, 0.0f);
                labelTemp.rectTransform.anchorMin = barTemp.rectTransform.anchorMin;
                labelTemp.rectTransform.anchorMax = barTemp.rectTransform.anchorMax;

                for (int i = 0; i < chartData.series.Count; ++i)
                {
                    if (skipSeries.Contains(i) || !chartData.series[i].show) continue;
                    for (int j = 0; j < chartData.categories.Count; ++j)
                    {
                        if (!IsValid(i, j)) continue;
                        float value = GetDataValue(i, j, stackValueList, stackValueListNeg);
                        float ratio = Mathf.Clamp01((value - chartGrid.minRange) / (chartGrid.maxRange - chartGrid.minRange));
                        Vector2 size = new Vector2(barWidth, chartGrid.chartSize.y * (ratio - chartGrid.zeroRatio));
                        Vector3 barScale = Vector3.one;
                        if (size.y < 0.0f) { size.y = -size.y; barScale = new Vector3(1.0f, -1.0f, 1.0f); }

                        Image bar = Instantiate(barTemp, chartGrid.itemList[j].transform).GetComponent<Image>();
                        bar.color = chartOptions.plotOptions.barChartOption.colorByCategories ?
                            chartOptions.plotOptions.dataColor[j % chartOptions.plotOptions.dataColor.Length] :
                            chartOptions.plotOptions.dataColor[i % chartOptions.plotOptions.dataColor.Length];
                        bar.rectTransform.anchoredPosition = new Vector2(x + barUnit * activeCount, 0.0f);
                        bar.rectTransform.localScale = barScale;
                        bar.rectTransform.sizeDelta = size;
                        bar.transform.SetAsFirstSibling();

                        if (chartOptions.label.enable)
                        {
                            var label = Instantiate(labelTemp, chartGrid.itemList[j].transform);
                            label.text = GetLabelText(i, j, chartOptions.label.format);
                            label.rectTransform.anchoredPosition = new Vector2(bar.rectTransform.anchoredPosition.x, (size.y + chartOptions.label.offset) * bar.rectTransform.localScale.y);
                        }
                    }
                    if (chartOptions.plotOptions.columnStacking == ColumnStacking.None) activeCount++;
                }
            }

            Helper.Destroy(barTemp.gameObject);
            Helper.Destroy(labelTemp.gameObject);
        }
    }
}