using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

[RequireComponent(typeof(MoneyCar))]
public class MainPage : Page, IHasMoneyCar
{
    public Text ShowType;
    public Text ShowCountType;
    public Text Money;
    public LoopVerticalScrollRect ItemScroller;
    public ChartGraph Chart;
    public int MaxRow = 10;

    public Button BtnEarn;
    public Button BtnPay;
    public Button BtnBack;
    public Button BtnSearch;
    public Button BtnCar;
    public Button BtnTime;
    public Button BtnCount;

    public string filterMemo
    {
        get;set;
    }

    bool _isSearch;
    public bool IsSearch
    {
        get { return _isSearch; }
        set
        {
            _isSearch = value;
            UpdateBtn();
        }
    }

    List<GameObject> earnRows = new List<GameObject>();

    string[] timeTypes = new string[4]
    {
        "單","日","月","年"
    };
    int currentTimeType = 0;

    ECount[] countTypes = new ECount[3]
    {
        ECount.TEN,
        ECount.THIRTY,
        ECount.HUNDRED
    };

    public void ToggleChartGraph()
    {
        this.Chart.gameObject.SetActive(!this.Chart.gameObject.active);
        if (this.Chart.gameObject.active)
        {
            UpdateChart();
        }
    }

    public void ChangeShowType()
    {
        if (++currentTimeType > timeTypes.Length - 1) currentTimeType = 0;
        ShowType.text = timeTypes[currentTimeType];
        RefreshList(true);
        ItemListToTop();
    }

    public void Buy()
    {
        int money = GetCar().GetMoney();
        if (money == 0)
        {
            return;
        }
        Model.AddEarn(money * -1, null, "", delegate (object error, List<Item> list)
        {
            RefreshList(true);
            ClearMoney();
        });
    }

    public void Earn()
    {
        int money = GetCar().GetMoney();
        if (money == 0)
        {
            return;
        }
        Model.AddEarn(money, null, "", delegate (object error, List<Item> list)
        {
            RefreshList(true);
            ClearMoney();
        });
    }

    public override void Init()
    {
        base.Init();
    }

    public override void Open()
    {
        base.Open();

        ClearMoney();
        RefreshList(true);
    }
    
    public void RefreshList(bool forceUpdate)
    {
        Model.GetItemList(int.MaxValue, currentTimeType, filterMemo, delegate (object error, List<Item> list)
        {
            UpdateItemList(forceUpdate);
        });
    }

    void ClearList()
    {
        foreach(GameObject row in earnRows)
        {
            row.GetComponent<EarnRow>().Btn_edit.onClick.RemoveAllListeners();
            row.GetComponent<EarnRow>().Btn_delete.onClick.RemoveAllListeners();
            row.GetComponent<EarnRow>().Btn_note.onClick.RemoveAllListeners();
            Destroy(row);
        }

        earnRows.Clear();
    }

    public void UpdateItemList( bool forceUpdate)
    {
        ItemScroller.totalCount = Model.GetItemListCache().Count;
        if (forceUpdate)
        {
            ItemScroller.RefillCells();
        }
        else
        {
            ItemScroller.RefreshCells();
        }
        UpdateChart();
        UpdateBtn();
    }

    public void ItemListToTop()
    {
        ItemScroller.SrollToCell(0, 20000);
    }

    void UpdateChart()
    {
        if (this.Chart.gameObject.active)
        {
            this.Chart.UpdateChart(Model.GetItemListCache());
        }
    }

    void UpdateBtn()
    {
        BtnBack.gameObject.SetActive(_isSearch);
        BtnSearch.interactable = !_isSearch;
        BtnEarn.interactable = EnableFeature();
        BtnPay.interactable = EnableFeature();
        BtnCar.interactable = EnableFeature();
    }

    public bool EnableFeature()
    {
        return !IsSearch && currentTimeType == ETimeType.ITEM;
    }

    public bool EnableMemoMoney()
    {
        return currentTimeType == ETimeType.ITEM;
    }

    public void AddMoney(int money)
    {
        Money.text = GetCar().AddMoney(money);
    }

    public void BackMoney()
    {
        Money.text = GetCar().BackMoney();
    }

    public void ClearMoney()
    {
        Money.text = GetCar().ClearMoney();
    }

    public void DoubleZero()
    {
        Money.text = GetCar().DoubleZero();
    }

    public MoneyCar GetCar()
    {
        return GetComponent<MoneyCar>();
    }

    public int CurrentMoney()
    {
        return GetCar().GetMoney();
    }
}
