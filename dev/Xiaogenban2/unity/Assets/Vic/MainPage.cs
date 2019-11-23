using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

[RequireComponent(typeof(MoneyCar))]
public class MainPage : Page, IHasMoneyCar
{
    /*
    ETimeType[] timeTypes = new ETimeType[4]
    {
        ETimeType.ITEM,
        ETimeType.DAY,
        ETimeType.MONTH,
        ETimeType.YEAR,
    };

    ETimeType currentTimeType = ETimeType.ITEM;
    */

    public Text ShowType;
    public Text Money;
    public GameObject EarnRow;
    public GameObject EarnList;
    public int MaxRow = 20;

    string[] timeTypes = new string[4]
    {
        "單","日","月","年"
    };

    int currentTimeType = 0;

    public void ChangeShowType()
    {
        if (++currentTimeType > 3) currentTimeType = 0;
        ShowType.text = timeTypes[currentTimeType];
    }

    public void Buy()
    {
        Debug.Log("支出" + GetCar().ShowMoney());
        ClearMoney();
    }

    public void Earn()
    {
        Debug.Log("收入" + GetCar().ShowMoney());
        ClearMoney();
    }

    public override void Init()
    {
        base.Init();
    }

    public override void Open()
    {
        base.Open();

        ClearMoney();

        for ( int i = 0; i < MaxRow; ++i)
        {
            GameObject item = Instantiate(EarnRow, EarnList.transform);
            item.name = "item_" + i;
            item.SetActive(true);

            EarnRow er = item.GetComponent<EarnRow>();
            er.Btn_edit.onClick.AddListener(onBtnEditClick(er));
            er.Btn_delete.onClick.AddListener(onBtnDeleteClick(er));
            er.Btn_note.onClick.AddListener(onBtnNoteClick(er));
        }
    }

    UnityAction onBtnEditClick(EarnRow er)
    {
        return delegate ()
        {
            print("編輯" + er.name);
        };
    }

    UnityAction onBtnNoteClick(EarnRow er)
    {
        return delegate ()
        {
            print("註解" + er.name);
            View.OpenMemoPage();
        };
    }

    UnityAction onBtnDeleteClick(EarnRow er)
    {
        return delegate ()
        {
            print("刪除" + er.name);
        };
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
}
