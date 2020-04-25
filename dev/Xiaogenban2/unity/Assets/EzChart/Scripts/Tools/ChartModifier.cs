using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace ChartUtil
{
    public enum ChartModifierType
    {
        None, ToLineChart, ToBarChart
    }

    public class ChartModifier : MonoBehaviour
    {
        [SerializeField] ChartModifierType modifierType;
        [SerializeField] List<int> seriesToModify;

        public void UpdateChart(ChartBase chart)
        {
            if (seriesToModify.Count == 0) { chart.UpdateChart(); return; }

            switch (modifierType)
            {
                case ChartModifierType.ToLineChart:
                    LineChart lineChart = Helper.CreateEmptyRect("LineChart", chart.chartRect, true).gameObject.AddComponent<LineChart>();
                    lineChart.tooltip = chart.tooltip;
                    lineChart.chartRect = chart.chartRect;
                    lineChart.chartData = chart.chartData;
                    lineChart.chartOptions = chart.chartOptions;
                    for (int i = 0; i < chart.chartData.series.Count; ++i)
                    {
                        if (seriesToModify.Contains(i)) chart.skipSeries.Add(i);
                        else lineChart.skipSeries.Add(i);
                    }
                    chart.UpdateChart();
                    lineChart.chartGrid = chart.GetComponent<ChartGrid>();
                    lineChart.UpdateChart();
                    lineChart.gameObject.SetActive(false);
                    break;
                case ChartModifierType.ToBarChart:
                    BarChart barChart = Helper.CreateEmptyRect("BarChart", chart.chartRect, true).gameObject.AddComponent<BarChart>();
                    barChart.tooltip = chart.tooltip;
                    barChart.chartRect = chart.chartRect;
                    barChart.chartData = chart.chartData;
                    barChart.chartOptions = chart.chartOptions;
                    for (int i = 0; i < chart.chartData.series.Count; ++i)
                    {
                        if (seriesToModify.Contains(i)) chart.skipSeries.Add(i);
                        else barChart.skipSeries.Add(i);
                    }
                    chart.UpdateChart();
                    barChart.chartGrid = chart.GetComponent<ChartGrid>();
                    barChart.UpdateChart();
                    barChart.gameObject.SetActive(false);
                    break;
                default:
                    chart.UpdateChart();
                    break;
            }
        }
    }
}