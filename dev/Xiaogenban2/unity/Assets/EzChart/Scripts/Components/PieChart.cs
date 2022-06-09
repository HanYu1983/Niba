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
    public class PieChart : ChartBase
    {
        float size;
        float sum = 0.0f;
        Image highlight;
        Image background;
        List<Image> itemList = new List<Image>();
        List<Vector2> dirList = new List<Vector2>();

        Material pieMat = null;

        private void OnDestroy()
        {
            if (pieMat != null) Helper.Destroy(pieMat);
        }

        bool IsValid(int index)
        {
            return chartData.series[index].show && chartData.series[index].data.Count > 0 && chartData.series[index].data[0].show && chartData.series[index].data[0].value > 0.0f;
        }

        public override void UpdateChart()
        {
            size = (chartSize.x < chartSize.y ? chartSize.x : chartSize.y) * Mathf.Clamp01(chartOptions.plotOptions.pieChartOption.outerSize) * 0.9f;

            background = Helper.CreateImage("Background", transform, true);
            background.sprite = Resources.Load<Sprite>("Images/Chart_Circle_512x512");
            background.color = chartOptions.plotOptions.backgroundColor;
            background.rectTransform.sizeDelta = new Vector2(size, size);

            highlight = Helper.CreateImage("Background", transform);
            highlight.sprite = Resources.Load<Sprite>("Images/Chart_Circle_512x512");
            highlight.color = Color.clear;
            highlight.rectTransform.sizeDelta = new Vector2(size, size);

            UpdateItems();
            if (chartOptions.label.enable) UpdateLabels();
        }

        protected override int FindCurrentItem()
        {
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
                temp += itemList[i].fillAmount;
                if (flag < temp) { index = i; break; }
            }
            return index;
        }

        protected override void HighlightCurrentItem()
        {
            highlight.color = chartOptions.plotOptions.itemHighlightColor;
            itemList[currItem].rectTransform.localScale *= 1.05f;
        }

        protected override void UnhighlightCurrentItem()
        {
            highlight.color = Color.clear;
            itemList[currItem].rectTransform.localScale = Vector3.one;
        }

        protected override void ShowTooltip()
        {
            if (tooltip == null) return;
            tooltip.gameObject.SetActive(true);
            int index = chartOptions.plotOptions.reverseSeries ? chartData.series.Count - currItem - 1 : currItem;
            tooltip.tooltipText.text = GetLabelText(index, chartOptions.tooltip.format);
            tooltip.background.rectTransform.sizeDelta = new Vector2(tooltip.tooltipText.preferredWidth + 16.0f, tooltip.tooltipText.preferredHeight + 6.0f);
        }

        void UpdateItems()
        {
            //templates
            Image sepLineTemp = Helper.CreateImage("SeparationMask", transform);
            sepLineTemp.material = Resources.Load<Material>("Materials/Chart_Mask");
            sepLineTemp.rectTransform.pivot = new Vector2(0.5f, 0.0f);
            sepLineTemp.rectTransform.sizeDelta = new Vector2(chartOptions.plotOptions.pieChartOption.itemSeparation, size * 0.5f);

            float outerSize = size / 1.05f;
            float innerSize = Mathf.Clamp(chartOptions.plotOptions.pieChartOption.innerSize, 0.0f, chartOptions.plotOptions.pieChartOption.outerSize) / chartOptions.plotOptions.pieChartOption.outerSize;
            Image itemTemp = Helper.CreateImage("Item", transform);
            if (innerSize > 0.001f)
            {
                if (pieMat == null) pieMat = new Material(Resources.Load<Material>("Materials/Chart_RingMasked"));
                itemTemp.material = pieMat;
                float smoothness = Mathf.Clamp01(3.0f / outerSize);
                itemTemp.material.SetFloat("_Smoothness", smoothness);
                itemTemp.material.SetFloat("_InnerRadius", innerSize);
            }
            itemTemp.sprite = Resources.Load<Sprite>("Images/Chart_Circle_512x512");
            itemTemp.type = Image.Type.Filled;
            itemTemp.fillMethod = Image.FillMethod.Radial360;
            itemTemp.fillOrigin = (int)Image.Origin360.Top;
            itemTemp.rectTransform.sizeDelta = new Vector2(outerSize, outerSize);

            //items
            sum = Helper.GetPositiveSumByCategory(chartData, 0);
            float rot = 0.0f;
            for (int i = 0; i < chartData.series.Count; ++i)
            {
                int index = chartOptions.plotOptions.reverseSeries ? chartData.series.Count - i - 1 : i;
                if (!IsValid(index)) continue;

                Image circle = Instantiate(itemTemp, transform);
                circle.color = chartOptions.plotOptions.dataColor[index % chartOptions.plotOptions.dataColor.Length];
                circle.transform.localRotation = Quaternion.Euler(0.0f, 0.0f, -rot);
                circle.fillAmount = Mathf.Clamp01(chartData.series[index].data[0].value / sum);

                Image separation = Instantiate(sepLineTemp, transform);
                separation.rectTransform.localRotation = circle.transform.localRotation;
                separation.rectTransform.SetSiblingIndex(i);

                float centerRotation = (90.0f - (rot + circle.fillAmount * 180.0f)) / 180.0f * 3.14159f;
                Vector2 dir = new Vector2(Mathf.Cos(centerRotation), Mathf.Sin(centerRotation)).normalized;
                rot += circle.fillAmount * 360.0f;
                dirList.Add(dir);
                itemList.Add(circle);
            }

            Helper.Destroy(itemTemp.gameObject);
            Helper.Destroy(sepLineTemp.gameObject);
        }

        string GetLabelText(int sIndex, DataDisplayFormat disFormat)
        {
            string str;
            switch (disFormat)
            {
                case DataDisplayFormat.Name:
                    str = chartData.series[sIndex].name;
                    break;
                case DataDisplayFormat.Name_Percentage:
                    str = chartData.series[sIndex].name + ": " + (100 * itemList[sIndex].fillAmount).ToString("f2") + "%";
                    break;
                case DataDisplayFormat.Name_Value:
                    str = chartData.series[sIndex].name + ": " + Helper.FloatToString(chartData.series[sIndex].data[0].value / sum);
                    break;
                case DataDisplayFormat.Percentage:
                    str = (100 * itemList[sIndex].fillAmount).ToString("f2") + "%";
                    break;
                case DataDisplayFormat.Value:
                    str = Helper.FloatToString(chartData.series[sIndex].data[0].value / sum);
                    break;
                default:
                    str = "";
                    break;
            }
            return str;
        }

        void UpdateLabels()
        {
            //template
#if CHART_TMPRO
            TextMeshProUGUI labelTemp;
            List<TextMeshProUGUI> labelList = new List<TextMeshProUGUI>();
#else
            Text labelTemp;
            List<Text> labelList = new List<Text>();
#endif
            labelTemp = Helper.CreateText("Label", transform, chartOptions.label.textOption, chartOptions.plotOptions.generalFont);
            labelTemp.rectTransform.sizeDelta = Vector2.zero;

            Image lineTemp = Helper.CreateImage("Line", transform);
            lineTemp.sprite = Resources.Load<Sprite>("Images/Chart_Line");
            lineTemp.type = Image.Type.Sliced;
            lineTemp.rectTransform.pivot = new Vector2(0.5f, 0.0f);

            List<Image> lineList = new List<Image>();

            //labels
            float outerSizeHalf = size / 2.1f;
            float outerSizeHalfOffset = outerSizeHalf + chartOptions.label.offset;
            List<int> label_right = new List<int>();
            List<int> label_left = new List<int>();
            for (int i = 0; i < itemList.Count; ++i)
            {
                var label = Instantiate(labelTemp, transform);
                label.gameObject.SetActive(itemList[i].fillAmount > 0.01f);
                labelList.Add(label);
                if (chartOptions.label.offset > 0.0f)
                {
                    Image line = Instantiate(lineTemp, transform);
                    line.gameObject.SetActive(label.gameObject.activeSelf);
                    lineList.Add(line);
                }
                if (!label.gameObject.activeSelf) continue;

                label.rectTransform.pivot = dirList[i].x > 0.0f ? new Vector2(0.0f, 0.5f) : new Vector2(1.0f, 0.5f);
                label.text = GetLabelText(i, chartOptions.label.format);

                //find label position
                label.rectTransform.anchoredPosition = dirList[i] * outerSizeHalfOffset;
                if (dirList[i].x > 0.0f) label_right.Add(i);
                else label_left.Add(i);
            }
            label_left.Reverse();

            float height = chartOptions.label.textOption.fontSize * 1.2f;
            if (chartOptions.label.offset > 0.0f)
            {
                //right
                float y = 99999.0f;
                foreach (int i in label_right)
                {
                    if (labelList[i].rectTransform.anchoredPosition.y < y - height)
                    {
                        y = labelList[i].rectTransform.anchoredPosition.y;
                    }
                    else
                    {
                        y -= height;
                        if (y < -outerSizeHalfOffset) break;
                        float x = Mathf.Sqrt(outerSizeHalfOffset * outerSizeHalfOffset - y * y);
                        labelList[i].rectTransform.anchoredPosition = new Vector2(x, y);
                    }
                }

                //reverse right
                y = -99999.0f;
                label_right.Reverse();
                foreach (int i in label_right)
                {
                    if (labelList[i].rectTransform.anchoredPosition.y > y + height)
                    {
                        y = labelList[i].rectTransform.anchoredPosition.y;
                        labelList[i].rectTransform.anchoredPosition = new Vector2(labelList[i].rectTransform.anchoredPosition.x + chartOptions.label.offset * 0.5f, y);
                    }
                    else
                    {
                        y += height;
                        if (y > outerSizeHalfOffset) break;
                        float x = Mathf.Sqrt(outerSizeHalfOffset * outerSizeHalfOffset - y * y);
                        labelList[i].rectTransform.anchoredPosition = new Vector2(x + chartOptions.label.offset * 0.5f, y);
                    }
                }

                //left
                y = 99999.0f;
                foreach (int i in label_left)
                {
                    if (labelList[i].rectTransform.anchoredPosition.y < y - height)
                    {
                        y = labelList[i].rectTransform.anchoredPosition.y;
                    }
                    else
                    {
                        y -= height;
                        if (y <= -outerSizeHalfOffset) break;
                        float x = -Mathf.Sqrt(outerSizeHalfOffset * outerSizeHalfOffset - y * y);
                        labelList[i].rectTransform.anchoredPosition = new Vector2(x, y);
                    }
                }

                //reverse left
                y = -99999.0f;
                label_left.Reverse();
                foreach (int i in label_left)
                {
                    if (labelList[i].rectTransform.anchoredPosition.y > y + height)
                    {
                        y = labelList[i].rectTransform.anchoredPosition.y;
                        labelList[i].rectTransform.anchoredPosition = new Vector2(labelList[i].rectTransform.anchoredPosition.x - chartOptions.label.offset * 0.5f, y);
                    }
                    else
                    {
                        y += height;
                        if (y > outerSizeHalfOffset) break;
                        float x = -Mathf.Sqrt(outerSizeHalfOffset * outerSizeHalfOffset - y * y);
                        labelList[i].rectTransform.anchoredPosition = new Vector2(x - chartOptions.label.offset * 0.5f, y);
                    }
                }

                //find max delta
                float delta_xMax = 0.0f, delta_yMax = 0.0f;
                for (int i = 0; i < labelList.Count; ++i)
                {
                    if (!labelList[i].gameObject.activeSelf) continue;

                    float wLimit = chartOptions.label.bestFit ? chartSize.x * 0.3f : Mathf.Clamp(chartSize.x * 0.5f - Mathf.Abs(labelList[i].rectTransform.anchoredPosition.x), 0.0f, chartSize.x * 0.3f);
                    float width = labelList[i].preferredWidth;
                    if (width > wLimit) { width = wLimit; Helper.TruncateText(labelList[i], wLimit); }
                    labelList[i].rectTransform.sizeDelta = new Vector2(width, height);

                    float delta_x = Mathf.Abs(labelList[i].rectTransform.anchoredPosition.x) + width - chartSize.x * 0.5f;
                    if (delta_x > delta_xMax) delta_xMax = delta_x;
                    float delta_y = Mathf.Abs(labelList[i].rectTransform.anchoredPosition.y) + height * 0.5f - chartSize.y * 0.5f;
                    if (delta_y > delta_yMax) delta_yMax = delta_y;
                }
                delta_xMax = Mathf.Clamp(delta_xMax, 0.0f, chartSize.x * 0.3f);
                delta_yMax = Mathf.Clamp(delta_yMax, 0.0f, chartSize.y * 0.3f);

                float delta = delta_xMax > delta_yMax ? delta_xMax : delta_yMax;
                float ratio = (outerSizeHalf - delta) / outerSizeHalf;
                outerSizeHalf *= ratio;
                background.rectTransform.sizeDelta *= ratio;
                highlight.rectTransform.sizeDelta *= ratio;
                for (int i = 0; i < itemList.Count; ++i)
                {
                    itemList[i].rectTransform.sizeDelta *= ratio;
                    labelList[i].rectTransform.anchoredPosition *= ratio;
                }

                //update line
                for (int i = 0; i < lineList.Count; ++i)
                {
                    if (!lineList[i].gameObject.activeSelf) continue;

                    Vector2 p1 = dirList[i] * outerSizeHalf;
                    Vector2 p2 = labelList[i].rectTransform.anchoredPosition;
                    Vector2 dif = p2 - p1;

                    lineList[i].color = itemList[i].color;
                    lineList[i].rectTransform.anchoredPosition = p1;
                    lineList[i].rectTransform.sizeDelta = new Vector2(chartOptions.label.textOption.fontSize / 6.0f, dif.magnitude);
                    lineList[i].rectTransform.localRotation = Quaternion.FromToRotation(Vector2.up, dif);
                }
            }

            Helper.Destroy(lineTemp.gameObject);
            Helper.Destroy(labelTemp.gameObject);
        }
    }
}
