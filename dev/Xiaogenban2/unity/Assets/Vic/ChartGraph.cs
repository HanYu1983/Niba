using ChartUtil;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ChartGraph : MonoBehaviour
{
    public Chart chart;

    ChartData charData;


    public void UpdateChart(List<Item> earns)
    {
        List<string> categories = new List<string>();

        charData = this.chart.GetComponent<ChartData>();
        this.charData.series[0].data.Clear();

        for (int i = 0; i < 30; ++i)
        {
            if(i < earns.Count - 1)
            {
                Item item = earns[i];
                DateTime time = new System.DateTime(item.Time).ToLocalTime();
                categories.Add(time.Year + "/" + time.Month + "/" + time.Day + " ");

                Data money = new Data();
                money.value = item.Money;
                this.charData.series[0].data.Add(money);
            }
        }
        charData.categories = categories;
        this.chart.UpdateChart();
    }

}
