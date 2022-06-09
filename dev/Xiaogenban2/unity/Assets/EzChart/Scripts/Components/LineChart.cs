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
    public class LineChart : ChartBase
    {
        public ChartGrid chartGrid;
        Material ringMat = null;

        private void OnDestroy()
        {
            if (ringMat != null) Helper.Destroy(ringMat);
        }

        public override void UpdateChart()
        {
            if (!chartGrid.init)
            {
                chartGrid.chartSize = chartSize;
                chartGrid.chartRect = chartRect;
                chartGrid.chartOptions = chartOptions;
                chartGrid.chartData = chartData;
                chartGrid.useMidTick = true;
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

        float GetDataStackingValue(int sIndex, int dIndex, float[] stackValueList, float[] stackValueListNeg)
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
                        value = stackValueList[dIndex];
                    }
                    else
                    {
                        value = stackValueListNeg[dIndex];
                    }
                    break;
                case ColumnStacking.Percent:
                    if (chartData.series[sIndex].data[dIndex].value >= 0.0f)
                    {
                        value = stackValueList[dIndex];
                    }
                    else
                    {
                        value = stackValueListNeg[dIndex];
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
            RectTransform contentRect = Helper.CreateEmptyRect("ContentRect", chartGrid.transform, true);

            //template
            Image lineTemp = Helper.CreateImage("Line", transform);
            lineTemp.sprite = Resources.Load<Sprite>("Images/Chart_Line");
            lineTemp.type = Image.Type.Sliced;
            lineTemp.rectTransform.anchorMin = Vector2.zero;
            lineTemp.rectTransform.anchorMax = Vector2.zero;

            Image pointTemp = Helper.CreateImage("Point", transform);
            pointTemp.sprite = Resources.Load<Sprite>("Images/Chart_Circle_128x128");
            pointTemp.rectTransform.anchorMin = Vector2.zero;
            pointTemp.rectTransform.anchorMax = Vector2.zero;
            pointTemp.rectTransform.sizeDelta = new Vector2(chartOptions.plotOptions.lineChartOption.pointSize, chartOptions.plotOptions.lineChartOption.pointSize);
            if (chartOptions.plotOptions.lineChartOption.enablePointOutline)
            {
                if (ringMat == null) ringMat = new Material(Resources.Load<Material>("Materials/Chart_Ring"));
                Image ring = Helper.CreateImage("Ring", pointTemp.transform);
                ring.material = ringMat;
                float smoothness = Mathf.Clamp01(2.0f / chartOptions.plotOptions.lineChartOption.pointSize);
                float ringWidth = Mathf.Clamp01(1.0f - chartOptions.plotOptions.lineChartOption.pointOutlineWidth * 2.0f / chartOptions.plotOptions.lineChartOption.pointSize - smoothness);
                ring.material.SetFloat("_InnerRadius", ringWidth);
                ring.material.SetFloat("_Smoothness", smoothness);
                ring.color = chartOptions.plotOptions.lineChartOption.pointOutlineColor;
                float s = chartOptions.plotOptions.lineChartOption.pointSize + 2.0f;
                ring.rectTransform.sizeDelta = new Vector2(s, s);
            }

            LineChartShade shadeTemp = Helper.CreateEmptyRect("Shade", transform).gameObject.AddComponent<LineChartShade>();
            shadeTemp.rectTransform.sizeDelta = Vector2.zero;
            shadeTemp.rectTransform.anchoredPosition = Vector2.zero;

#if CHART_TMPRO
            TextMeshProUGUI labelTemp;
#else
            Text labelTemp;
#endif
            labelTemp = Helper.CreateText("Label", transform, chartOptions.label.textOption, chartOptions.plotOptions.generalFont);
            labelTemp.rectTransform.anchorMin = Vector2.zero;
            labelTemp.rectTransform.anchorMax = Vector2.zero;
            labelTemp.rectTransform.sizeDelta = Vector2.zero;

            //items
            float[] stackValueList = chartOptions.plotOptions.columnStacking == ColumnStacking.None ? null : new float[chartData.categories.Count];
            float[] stackValueListNeg = chartOptions.plotOptions.columnStacking == ColumnStacking.None ? null : new float[chartData.categories.Count];
            if (chartOptions.plotOptions.inverted)
            {
                lineTemp.rectTransform.pivot = new Vector2(0.5f, 0.0f);
                shadeTemp.rectTransform.anchorMin = new Vector2(chartGrid.zeroRatio, 0.0f);
                shadeTemp.rectTransform.anchorMax = new Vector2(chartGrid.zeroRatio, 0.0f);

                float unitWidth = !chartOptions.plotOptions.reverseSeries ? -chartGrid.unitWidth : chartGrid.unitWidth;
                for (int i = 0; i < chartData.series.Count; ++i)
                {
                    if (skipSeries.Contains(i) || !chartData.series[i].show) continue;
                    RectTransform seriesRect = Helper.CreateEmptyRect(chartData.series[i].name, contentRect, true);
                    seriesRect.SetAsFirstSibling();
                    RectTransform shadeLineRect = Helper.CreateEmptyRect("ShadeLineRect", seriesRect, true);

                    for (int j = 0; j < chartData.categories.Count; ++j)
                    {
                        //point
                        if (!IsValid(i, j)) continue;
                        float h0 = chartGrid.chartSize.x * chartGrid.zeroRatio;
                        float x = chartGrid.chartSize.y * (chartGrid.itemList[j].background.rectTransform.anchorMin.y + chartGrid.itemList[j].background.rectTransform.anchorMax.y) * 0.5f;
                        float value1 = GetDataValue(i, j, stackValueList, stackValueListNeg);
                        float r1 = Mathf.Clamp01((value1 - chartGrid.minRange) / (chartGrid.maxRange - chartGrid.minRange));
                        float h1 = chartGrid.chartSize.x * r1;

                        Image point = Instantiate(pointTemp, seriesRect).GetComponent<Image>();
                        point.rectTransform.anchoredPosition = new Vector2(h1, x);
                        point.color = chartOptions.plotOptions.dataColor[i % chartOptions.plotOptions.dataColor.Length];

                        if (chartOptions.label.enable)
                        {
                            float offdir = r1 > chartGrid.zeroRatio ? 1.0f : -1.0f;
                            var label = Instantiate(labelTemp, seriesRect);
                            label.text = GetLabelText(i, j, chartOptions.label.format);
                            label.rectTransform.anchoredPosition = new Vector2(h1 + chartOptions.label.offset * offdir, x);
                        }

                        //line and shade
                        if (j == 0 || !IsValid(i, j - 1)) continue;
                        float value2 = GetDataStackingValue(i, j - 1, stackValueList, stackValueListNeg);
                        float r2 = Mathf.Clamp01((value2 - chartGrid.minRange) / (chartGrid.maxRange - chartGrid.minRange));
                        float h2 = chartGrid.chartSize.x * r2;
                        Vector2 dir = new Vector2(h2 - h1, -unitWidth);

                        if (chartOptions.plotOptions.lineChartOption.enableShade)
                        {
                            LineChartShade shade = Instantiate(shadeTemp, shadeLineRect).GetComponent<LineChartShade>();
                            Color c = chartOptions.plotOptions.dataColor[i % chartOptions.plotOptions.dataColor.Length];
                            c.a = chartOptions.plotOptions.lineChartOption.shadeTransparency;
                            shade.color = c;
                            shade.points[0] = new Vector2(0.0f, x);
                            shade.points[1] = new Vector2(h1 - h0, x);
                            shade.points[2] = new Vector2(h2 - h0, x - unitWidth);
                            shade.points[3] = new Vector2(0.0f, x - unitWidth);
                        }

                        if (chartOptions.plotOptions.lineChartOption.enableLine)
                        {
                            Image line = Instantiate(lineTemp, shadeLineRect).GetComponent<Image>();
                            line.color = chartOptions.plotOptions.dataColor[i % chartOptions.plotOptions.dataColor.Length];
                            line.rectTransform.anchoredPosition = new Vector2(h1, x);
                            line.rectTransform.sizeDelta = new Vector2(chartOptions.plotOptions.lineChartOption.lineWidth, dir.magnitude);
                            line.rectTransform.localRotation = Quaternion.FromToRotation(Vector2.up, dir);
                        }
                    }
                }
            }
            else
            {
                lineTemp.rectTransform.pivot = new Vector2(0.5f, 0.0f);
                shadeTemp.rectTransform.anchorMin = new Vector2(0.0f, chartGrid.zeroRatio);
                shadeTemp.rectTransform.anchorMax = new Vector2(0.0f, chartGrid.zeroRatio);

                float unitWidth = chartOptions.plotOptions.reverseSeries ? -chartGrid.unitWidth : chartGrid.unitWidth;
                for (int i = 0; i < chartData.series.Count; ++i)
                {
                    if (skipSeries.Contains(i) || !chartData.series[i].show) continue;
                    RectTransform seriesRect = Helper.CreateEmptyRect(chartData.series[i].name, contentRect, true);
                    seriesRect.SetAsFirstSibling();
                    RectTransform shadeLineRect = Helper.CreateEmptyRect("ShadeLineRect", seriesRect, true);

                    for (int j = 0; j < chartData.categories.Count; ++j)
                    {
                        //point
                        if (!IsValid(i, j)) continue;
                        float h0 = chartGrid.chartSize.y * chartGrid.zeroRatio;
                        float x = chartGrid.chartSize.x * (chartGrid.itemList[j].background.rectTransform.anchorMin.x + chartGrid.itemList[j].background.rectTransform.anchorMax.x) * 0.5f;
                        float value1 = GetDataValue(i, j, stackValueList, stackValueListNeg);
                        float r1 = Mathf.Clamp01((value1 - chartGrid.minRange) / (chartGrid.maxRange - chartGrid.minRange));
                        float h1 = chartGrid.chartSize.y * r1;
                        Image point = Instantiate(pointTemp, seriesRect).GetComponent<Image>();
                        point.rectTransform.anchoredPosition = new Vector2(x, h1);
                        point.color = chartOptions.plotOptions.dataColor[i % chartOptions.plotOptions.dataColor.Length];

                        if (chartOptions.label.enable)
                        {
                            float offdir = r1 > chartGrid.zeroRatio ? 1.0f : -1.0f;
                            var label = Instantiate(labelTemp, seriesRect);
                            label.text = GetLabelText(i, j, chartOptions.label.format);
                            label.rectTransform.anchoredPosition = new Vector2(x, h1 + chartOptions.label.offset * offdir);
                        }

                        //shade and line
                        if (j == 0 || !IsValid(i, j - 1)) continue;
                        float value2 = GetDataStackingValue(i, j - 1, stackValueList, stackValueListNeg);
                        float r2 = Mathf.Clamp01((value2 - chartGrid.minRange) / (chartGrid.maxRange - chartGrid.minRange));
                        float h2 = chartGrid.chartSize.y * r2;
                        Vector2 dir = new Vector2(-unitWidth, h2 - h1);

                        if (chartOptions.plotOptions.lineChartOption.enableShade)
                        {
                            LineChartShade shade = Instantiate(shadeTemp, shadeLineRect).GetComponent<LineChartShade>();
                            Color c = chartOptions.plotOptions.dataColor[i % chartOptions.plotOptions.dataColor.Length];
                            c.a = chartOptions.plotOptions.lineChartOption.shadeTransparency;
                            shade.color = c;
                            shade.points[0] = new Vector2(x, 0.0f);
                            shade.points[1] = new Vector2(x, h1 - h0);
                            shade.points[2] = new Vector2(x - unitWidth, h2 - h0);
                            shade.points[3] = new Vector2(x - unitWidth, 0.0f);
                        }

                        if (chartOptions.plotOptions.lineChartOption.enableLine)
                        {
                            Image line = Instantiate(lineTemp, shadeLineRect).GetComponent<Image>();
                            line.color = chartOptions.plotOptions.dataColor[i % chartOptions.plotOptions.dataColor.Length];
                            line.rectTransform.anchoredPosition = new Vector2(x, h1);
                            line.rectTransform.sizeDelta = new Vector2(chartOptions.plotOptions.lineChartOption.lineWidth, dir.magnitude);
                            line.rectTransform.localRotation = Quaternion.FromToRotation(Vector2.up, dir);
                        }
                    }
                }
            }

            Helper.Destroy(lineTemp.gameObject);
            Helper.Destroy(pointTemp.gameObject);
            Helper.Destroy(shadeTemp.gameObject);
            Helper.Destroy(labelTemp.gameObject);
        }
    }
}
