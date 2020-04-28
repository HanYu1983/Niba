using ChartUtil;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ChartGraph : MonoBehaviour
{
    public Chart chart;
    public Chart chartMonth;

    public GameObject BtnContainer;
    public Button btnOpenCompare;

    int currentOpenCompareType = -1;

    public void UpdateChart(List<Item> earns)
    {
        List<string> categories = new List<string>();

        ChartData charData = this.chart.GetComponent<ChartData>();
        charData.series[0].data.Clear();

        for (int i = 0; i < 30; ++i)
        {
            if(i < earns.Count - 1)
            {
                Item item = earns[i];
                DateTime time = new System.DateTime(item.Time).ToLocalTime();
                categories.Add(time.Year + "/" + time.Month + "/" + time.Day + " ");

                Data money = new Data();
                money.value = item.Money;
                charData.series[0].data.Add(money);
            }
        }
        charData.categories = categories;
        this.chart.UpdateChart();
    }

    public void UpdateBtnCompare(int timeType)
    {
        if(timeType == 1 || timeType == 2)
        {
            btnOpenCompare.interactable = true;
        }
        else
        {
            btnOpenCompare.interactable = false;
        }
        BtnContainer.gameObject.SetActive(currentOpenCompareType != timeType);
    }

    public void UpdateChartMonth(List<Item> earns, int timeType)
    {
        BtnContainer.SetActive(false);
        currentOpenCompareType = timeType;
        if ( timeType == 1)
        {
            ChartData charData = this.chartMonth.GetComponent<ChartData>();
            charData.series.Clear();

            List<string> categories = new List<string>();
            for (int i = 1; i < 32; ++i)
            {
                categories.Add(i + "日");
            }

            charData.categories = categories;
            string currentDataSeries = "";
            foreach (Item item in earns)
            {
                DateTime time = new System.DateTime(item.Time).ToLocalTime();
                string seriesName = time.Year + "_" + time.Month;
                if (currentDataSeries != seriesName)
                {
                    charData.series.Add(new Series());
                    currentDataSeries = seriesName;

                    for (int i = 1; i < 32; ++i)
                    {
                        charData.series[charData.series.Count - 1].data.Add(new Data());
                    }
                }
                charData.series[charData.series.Count - 1].data[time.Day - 1].value = item.Money;
            }

            this.chartMonth.UpdateChart();
        }
        else if(timeType == 2)
        {
            ChartData charData = this.chartMonth.GetComponent<ChartData>();
            charData.series.Clear();

            List<string> categories = new List<string>();
            for (int i = 1; i < 13; ++i)
            {
                categories.Add(i + "月");
            }

            charData.categories = categories;
            string currentDataSeries = "";
            foreach (Item item in earns)
            {
                DateTime time = new System.DateTime(item.Time).ToLocalTime();
                string seriesName = time.Year + "";
                if (currentDataSeries != seriesName)
                {
                    charData.series.Add(new Series());
                    currentDataSeries = seriesName;

                    for (int i = 1; i < 13; ++i)
                    {
                        charData.series[charData.series.Count - 1].data.Add(new Data());
                    }
                }
                charData.series[charData.series.Count - 1].data[time.Month-1].value = item.Money;
            }

            this.chartMonth.UpdateChart();
        }
    }
}
