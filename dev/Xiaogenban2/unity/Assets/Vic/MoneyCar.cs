using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class MoneyCar : MonoBehaviour
{
    private List<int> Moneys = new List<int>();

    public string AddMoney(int money)
    {
        if (Moneys.Count >= 6) return ShowMoney();
        if (Moneys.Count == 0 && money == 0)
        {
            return ShowMoney();
        }
        Moneys.Add(money);
        return ShowMoney();
    }

    public string BackMoney()
    {
        if (Moneys.Count > 0)
        {
            Moneys.RemoveAt(Moneys.Count - 1);
        }
        return ShowMoney();
    }

    public string ClearMoney()
    {
        Moneys.Clear();
        return ShowMoney();
    }

    public string DoubleZero()
    {
        AddMoney(0);
        AddMoney(0);
        return ShowMoney();
    }

    public string ShowMoney()
    {
        if (Moneys.Count == 0)
            return "0";
        string showText = "";
        foreach (int m in Moneys)
        {
            showText += m.ToString();
        }
        return showText;
    }

    public int GetMoney()
    {
        return int.Parse(ShowMoney());
    }
}
