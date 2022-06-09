using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
#if CHART_TMPRO
using TMPro;
#endif

namespace ChartUtil
{
    public class RoseChart : ChartBase
    {
        float size, innerSize;
        float tickLength;
        int numberOfSteps = 1;
        float stepSize = 0.0f;
        float minRange = 0.0f;
        float maxRange = 0.0f;
        float unitWidth = 0.0f;
        string format = "N0";

        List<GridItem> itemList = new List<GridItem>();
        List<float> positiveSum = new List<float>();
        GridRing innerRing;

        public override void UpdateChart()
        {
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
                        minRange = chartOptions.yAxis.fixedMinRange > 0.0f ? chartOptions.yAxis.fixedMinRange : 0.0f;
                        maxRange = chartOptions.yAxis.fixedMaxRange;
                        numberOfSteps = chartOptions.yAxis.fixedRangeDivision;
                        stepSize = (maxRange - minRange) / numberOfSteps;
                    }
                    else
                    {
                        Helper.FindMinMaxValue(chartData, out minValue, out maxValue);
                        if (minValue < 0.0f) minValue = 0.0f;
                        Helper.FindRange(chartOptions.yAxis.startFromZero, chartOptions.yAxis.minRangeDivision, minValue, maxValue, out minRange, out maxRange, out stepSize, out numberOfSteps);
                    }
                    break;
                case ColumnStacking.Normal:
                    for (int i = 0; i < chartData.categories.Count; ++i)
                    {
                        float pSum = Helper.GetPositiveSumByCategory(chartData, i);
                        if (pSum > maxValue) maxValue = pSum;
                    }
                    Helper.FindRange(chartOptions.yAxis.startFromZero, chartOptions.yAxis.minRangeDivision, minValue, maxValue, out minRange, out maxRange, out stepSize, out numberOfSteps);
                    break;
                case ColumnStacking.Percent:
                    for (int i = 0; i < chartData.categories.Count; ++i)
                    {
                        float pSum = Helper.GetPositiveSumByCategory(chartData, i);
                        positiveSum.Add(pSum);
                    }
                    minRange = 0.0f;
                    maxRange = 1.0f;
                    numberOfSteps = 5;
                    stepSize = 0.2f;
                    break;
                default:
                    break;
            }
            if (stepSize >= 1.0f) format = "N0";
            else format = "N" + Helper.FindFloatDisplayPrecision(stepSize).ToString();

            unitWidth = 360.0f / chartData.categories.Count;
            tickLength = chartOptions.plotOptions.minorGridLineWidth * 3.0f;
            size = (chartSize.x < chartSize.y ? chartSize.x : chartSize.y) * Mathf.Clamp01(chartOptions.plotOptions.roseChartOption.outerSize) * 0.95f;
            if (chartOptions.xAxis.enableLabel) size -= chartOptions.xAxis.labelOption.fontSize * 2;
            innerSize = size * Mathf.Clamp(chartOptions.plotOptions.roseChartOption.innerSize, 0.0f, chartOptions.plotOptions.roseChartOption.outerSize) / chartOptions.plotOptions.roseChartOption.outerSize;

            Image background = Helper.CreateImage("Background", transform, true);
            background.sprite = Resources.Load<Sprite>("Images/Chart_Circle_512x512");
            background.color = chartOptions.plotOptions.backgroundColor;
            background.rectTransform.sizeDelta = new Vector2(size + tickLength * 2.0f, size + tickLength * 2.0f);

            Image maskImg = Helper.CreateImage("Mask Image", transform);
            maskImg.material = Resources.Load<Material>("Materials/Chart_Mask");
            maskImg.sprite = Resources.Load<Sprite>("Images/Chart_Circle_2048x2048");
            maskImg.rectTransform.sizeDelta = new Vector2(innerSize, innerSize);

            if (chartData.categories.Count == 0) return;
            if (size > 0.01f) UpdateGrid();
            UpdateItems();
            innerRing.transform.SetAsLastSibling();
        }

        protected override int FindCurrentItem()
        {
            if (chartData.categories.Count < 1) return -1;
            Vector2 dir = new Vector2(mousePosition.x - transform.position.x, mousePosition.y - transform.position.y);
            dir.x *= transform.lossyScale.x;
            dir.y *= transform.lossyScale.y;
            if (dir.sqrMagnitude > 0.25f * size * size) return -1;
            int index = 0;
            float angle = 0.0f;
            if (dir.x < 0.0f) angle = 360.0f - Vector3.Angle(new Vector2(0.0f, 1.0f), dir);
            else angle = Vector3.Angle(new Vector2(0.0f, 1.0f), dir);
            float flag = angle / 360.0f;
            float temp = 0.0f;
            for (int i = 0; i < itemList.Count; ++i)
            {
                temp += itemList[i].background.fillAmount;
                if (flag < temp) { index = i; break; }
            }
            return index;
        }

        protected override void HighlightCurrentItem()
        {
            itemList[currItem].background.color = chartOptions.plotOptions.itemHighlightColor;
        }

        protected override void UnhighlightCurrentItem()
        {
            itemList[currItem].background.color = Color.clear;
        }

        protected override void ShowTooltip()
        {
            if (tooltip == null) return;
            tooltip.gameObject.SetActive(true);
            tooltip.tooltipText.text = itemList[currItem].label.text;
            for (int i = 0; i < chartData.series.Count; ++i)
            {
                if (!chartData.series[i].show || !IsValid(i, currItem)) continue;
                tooltip.tooltipText.text += "\n" + GetLabelText(i, currItem, chartOptions.tooltip.format);
            }
            tooltip.background.rectTransform.sizeDelta = new Vector2(tooltip.tooltipText.preferredWidth + 16, tooltip.tooltipText.preferredHeight + 6);
        }

        bool IsValid(int sIndex, int dIndex)
        {
            return dIndex < chartData.series[sIndex].data.Count && chartData.series[sIndex].data[dIndex].show && chartData.series[sIndex].data[dIndex].value >= 0.0f;
        }

        void UpdateGrid()
        {
            //template
            GridRing gridLineTemp = Helper.CreateEmptyRect("Ring", transform).gameObject.AddComponent<GridRing>();
            gridLineTemp.line = gridLineTemp.gameObject.AddComponent<Image>();
            gridLineTemp.line.sprite = Resources.Load<Sprite>("Images/Chart_Circle_512x512");
            gridLineTemp.line.color = chartOptions.plotOptions.minorGridLineColor;
            gridLineTemp.line.raycastTarget = false;
            gridLineTemp.label = Helper.CreateText("Label", gridLineTemp.transform, chartOptions.yAxis.labelOption, chartOptions.plotOptions.generalFont, TextAnchor.LowerCenter);
            gridLineTemp.label.rectTransform.anchorMin = new Vector2(0.5f, 1.0f);
            gridLineTemp.label.rectTransform.anchorMax = new Vector2(0.5f, 1.0f);
            gridLineTemp.label.rectTransform.sizeDelta = Vector2.zero;
            gridLineTemp.label.gameObject.SetActive(chartOptions.yAxis.enableLabel);

            //rings
            innerRing = Instantiate(gridLineTemp, transform);
            float gridSize = innerSize;
            float gridWidth = 0.0f, smoothness = 0.01f;
            if (gridSize > 0.001f)
            {
                gridSize += chartOptions.plotOptions.gridLineWidth;
                smoothness = Mathf.Clamp01(2.0f / gridSize);
                gridWidth = Mathf.Clamp01(1.0f - chartOptions.plotOptions.gridLineWidth * 2.0f / gridSize - smoothness);
                innerRing.ringMaterial.SetFloat("_InnerRadius", gridWidth);
                innerRing.ringMaterial.SetFloat("_Smoothness", smoothness);
            }
            innerRing.line.color = chartOptions.plotOptions.gridLineColor;
            innerRing.line.rectTransform.sizeDelta = new Vector2(gridSize, gridSize);
            innerRing.label.text = minRange.ToString(format);
            innerRing.label.transform.SetParent(chartRect);

            for (int i = 1; i <= numberOfSteps; ++i)
            {
                gridSize = Mathf.Lerp(innerSize, size, (float)i / numberOfSteps) + chartOptions.plotOptions.minorGridLineWidth;
                smoothness = Mathf.Clamp01(3.0f / gridSize);
                gridWidth = Mathf.Clamp01(1.0f - chartOptions.plotOptions.minorGridLineWidth * 2.0f / gridSize - smoothness);
                GridRing gLine = Instantiate(gridLineTemp, transform);
                gLine.ringMaterial.SetFloat("_InnerRadius", gridWidth);
                gLine.ringMaterial.SetFloat("_Smoothness", smoothness);
                gLine.line.rectTransform.sizeDelta = new Vector2(gridSize, gridSize);
                gLine.label.text = (minRange + stepSize * i).ToString(format);
                gLine.label.transform.SetParent(chartRect);
            }

            Helper.Destroy(gridLineTemp.gameObject);
        }

        string GetLabelText(int sIndex, int dIndex, DataDisplayFormat disFormat)
        {
            string str;
            switch (disFormat)
            {
                case DataDisplayFormat.Name:
                    str = chartData.series[sIndex].name;
                    break;
                case DataDisplayFormat.Name_Percentage:
                    str = chartData.series[sIndex].name + ": " + (chartData.series[sIndex].data[dIndex].value / positiveSum[dIndex] * 100).ToString("f0") + "%";
                    break;
                case DataDisplayFormat.Name_Value:
                    str = chartData.series[sIndex].name + ": " + chartData.series[sIndex].data[dIndex].value.ToString(format);
                    break;
                case DataDisplayFormat.Percentage:
                    str = (chartData.series[sIndex].data[dIndex].value / positiveSum[dIndex] * 100).ToString("f0") + "%";
                    break;
                case DataDisplayFormat.Value:
                    str = chartData.series[sIndex].data[dIndex].value.ToString(format);
                    break;
                default:
                    str = "";
                    break;
            }
            return str;
        }

        float GetDataValue(int sIndex, int dIndex, float[] stackValueList)
        {
            float value = 0.0f;
            switch (chartOptions.plotOptions.columnStacking)
            {
                case ColumnStacking.None:
                    value = chartData.series[sIndex].data[dIndex].value;
                    break;
                case ColumnStacking.Normal:
                    value = stackValueList[dIndex] + chartData.series[sIndex].data[dIndex].value;
                    stackValueList[dIndex] = value;
                    break;
                case ColumnStacking.Percent:
                    value = stackValueList[dIndex] + chartData.series[sIndex].data[dIndex].value / positiveSum[dIndex];
                    stackValueList[dIndex] = value;
                    break;
                default:
                    break;
            }
            return value;
        }

        void UpdateItems()
        {
            //template
            GridItem gridItemTemp = Helper.CreateEmptyRect("Item", transform).gameObject.AddComponent<GridItem>();
            gridItemTemp.background = gridItemTemp.gameObject.AddComponent<Image>();
            gridItemTemp.background.raycastTarget = false;
            gridItemTemp.background.color = Color.clear;
            gridItemTemp.background.material = new Material(Resources.Load<Material>("Materials/Chart_Masked"));
            gridItemTemp.background.sprite = Resources.Load<Sprite>("Images/Chart_Circle_512x512");
            gridItemTemp.background.type = Image.Type.Filled;
            gridItemTemp.background.fillMethod = Image.FillMethod.Radial360;
            gridItemTemp.background.fillOrigin = (int)Image.Origin360.Top;
            gridItemTemp.background.fillAmount = Mathf.Clamp01(1.0f / chartData.categories.Count);
            gridItemTemp.background.rectTransform.sizeDelta = new Vector2(size, size);

            float centerRotation = (90.0f - unitWidth * 0.5f) / 180.0f * 3.14159f;
            Vector2 dir = new Vector2(Mathf.Cos(centerRotation), Mathf.Sin(centerRotation)).normalized;
            gridItemTemp.label = Helper.CreateText("Label", gridItemTemp.transform, chartOptions.xAxis.labelOption, chartOptions.plotOptions.generalFont);
            gridItemTemp.label.rectTransform.localRotation = Quaternion.FromToRotation(Vector2.up, dir);
            gridItemTemp.label.rectTransform.sizeDelta = Vector2.zero;
            gridItemTemp.label.rectTransform.anchoredPosition = dir * ((size + chartOptions.xAxis.labelOption.fontSize) * 0.5f + tickLength);
            gridItemTemp.label.gameObject.SetActive(chartOptions.xAxis.enableLabel);

            gridItemTemp.tick = Helper.CreateImage("Grid Line", gridItemTemp.transform);
            gridItemTemp.tick.sprite = Resources.Load<Sprite>("Images/Chart_Line");
            gridItemTemp.tick.type = Image.Type.Sliced;
            gridItemTemp.tick.color = chartOptions.plotOptions.minorGridLineColor;
            gridItemTemp.tick.rectTransform.pivot = new Vector2(0.5f, 0.0f);
            gridItemTemp.tick.rectTransform.sizeDelta = new Vector2(chartOptions.plotOptions.minorGridLineWidth, (size - innerSize) * 0.5f + tickLength);
            gridItemTemp.tick.rectTransform.anchoredPosition = new Vector2(0.0f, innerSize * 0.5f);

#if CHART_TMPRO
        TextMeshProUGUI labelTemp;
#else
            Text labelTemp;
#endif
            labelTemp = Helper.CreateText("Label", transform, chartOptions.label.textOption, chartOptions.plotOptions.generalFont);
            labelTemp.rectTransform.sizeDelta = Vector2.zero;

            Image barTemp = Helper.CreateImage("Bar", transform);
            barTemp.sprite = Resources.Load<Sprite>("Images/Chart_Circle_512x512");
            barTemp.material = new Material(Resources.Load<Material>("Materials/Chart_Masked"));
            barTemp.type = Image.Type.Filled;
            barTemp.fillMethod = Image.FillMethod.Radial360;
            barTemp.fillOrigin = (int)Image.Origin360.Top;

            //grid items
            for (int i = 0; i < chartData.categories.Count; ++i)
            {
                int index = chartOptions.plotOptions.reverseSeries ? chartData.categories.Count - i - 1 : i;
                GridItem item = Instantiate(gridItemTemp, transform);
                item.transform.localRotation = Quaternion.Euler(0.0f, 0.0f, -unitWidth * index);
                item.label.text = chartData.categories[i];
                item.tick.transform.SetParent(innerRing.transform);
                itemList.Add(item);
            }

            //bars
            float maxBarWidth = chartOptions.plotOptions.columnStacking == ColumnStacking.None ? unitWidth / chartData.series.Count : unitWidth;
            float barWidth = Mathf.Clamp(chartOptions.plotOptions.roseChartOption.barWidth, 0.0f, maxBarWidth);
            float barSpace = Mathf.Clamp(chartOptions.plotOptions.roseChartOption.itemSeparation, -barWidth * 0.5f, maxBarWidth - barWidth);
            float barUnit = barWidth + barSpace;
            barTemp.fillAmount = barWidth / 360.0f;

            centerRotation = (90.0f - barWidth * 0.5f) / 180.0f * 3.14159f;
            dir = new Vector2(Mathf.Cos(centerRotation), Mathf.Sin(centerRotation)).normalized;
            labelTemp.rectTransform.localRotation = Quaternion.FromToRotation(Vector2.up, dir);

            int activeCount = 0;
            if (chartOptions.plotOptions.columnStacking == ColumnStacking.None)
            { for (int i = 0; i < chartData.series.Count; ++i) if (chartData.series[i].show) activeCount++; }
            else { activeCount = 1; }
            float x = (unitWidth - (barUnit * activeCount - barSpace)) * 0.5f;

            activeCount = 0;
            float[] stackValueList = chartOptions.plotOptions.columnStacking == ColumnStacking.None ? null : new float[chartData.categories.Count];
            for (int i = 0; i < chartData.series.Count; ++i)
            {
                if (!chartData.series[i].show) continue;
                for (int j = 0; j < chartData.categories.Count; ++j)
                {
                    if (!IsValid(i, j)) continue;
                    float value = GetDataValue(i, j, stackValueList);
                    float ratio = Mathf.Clamp01((value - minRange) / (maxRange - minRange));
                    float barSize = Mathf.Lerp(innerSize, size, ratio);

                    Image bar = Instantiate(barTemp, itemList[j].transform).GetComponent<Image>();
                    bar.color = chartOptions.plotOptions.roseChartOption.colorByCategories ?
                        chartOptions.plotOptions.dataColor[j % chartOptions.plotOptions.dataColor.Length] :
                        chartOptions.plotOptions.dataColor[i % chartOptions.plotOptions.dataColor.Length];
                    bar.rectTransform.localRotation = Quaternion.Euler(0.0f, 0.0f, -x - barUnit * activeCount);
                    bar.rectTransform.sizeDelta = new Vector2(barSize, barSize);
                    bar.transform.SetAsFirstSibling();

                    if (chartOptions.label.enable)
                    {
                        var label = Instantiate(labelTemp, bar.transform);
                        label.text = GetLabelText(i, j, chartOptions.label.format);
                        label.rectTransform.anchoredPosition = dir * (barSize * 0.5f + chartOptions.label.offset);
                        label.transform.SetParent(innerRing.transform);
                    }
                }
                if (chartOptions.plotOptions.columnStacking == ColumnStacking.None) activeCount++;
            }

            Helper.Destroy(gridItemTemp.gameObject);
            Helper.Destroy(labelTemp);
            Helper.Destroy(barTemp);
        }
    }
}