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
    public Text Money;
    public GameObject EarnRow;
    public GameObject EarnList;
    public int MaxRow = 10;

    List<GameObject> earnRows = new List<GameObject>();

    string[] timeTypes = new string[4]
    {
        "單","日","月","年"
    };

    int currentTimeType = 0;

    public void ChangeShowType()
    {
        if (++currentTimeType > 3) currentTimeType = 0;
        ShowType.text = timeTypes[currentTimeType];
        RefreshList();
    }


    public void Buy()
    {
        Debug.Log("支出" + GetCar().ShowMoney());
        
        Model.AddEarn(GetCar().GetMoney() * -1, "", "", delegate (object error, List<Item> list)
        {
            RefreshList();
            ClearMoney();
        });
    }

    public void Earn()
    {
        Debug.Log("收入" + GetCar().ShowMoney());
        Model.AddEarn(GetCar().GetMoney(), "", "", delegate (object error, List<Item> list)
        {
            RefreshList();
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
        RefreshList();
    }
    
    public void RefreshList(string memo = "")
    {
        Model.GetItemList(MaxRow, currentTimeType, memo, delegate (object error, List<Item> list)
        {
            UpdateItemList(list);
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

    public void UpdateItemList(List<Item> list)
    {
        ClearList();
        foreach (Item itemModel in list)
        {
            GameObject item = Instantiate(EarnRow, EarnList.transform);
            item.name = "item_" + itemModel.Id;
            item.SetActive(true);

            EarnRow er = item.GetComponent<EarnRow>();
            er.id = itemModel.Id;
            er.memo.text = itemModel.Memo.ToString();
            er.time.text = itemModel.Time.ToString();
            er.money.text = itemModel.Money.ToString();
            er.Btn_edit.onClick.AddListener(onBtnEditClick(er));
            er.Btn_delete.onClick.AddListener(onBtnDeleteClick(er));
            er.Btn_note.onClick.AddListener(onBtnNoteClick(er));

            earnRows.Add(item);
        }
    }

    UnityAction onBtnEditClick(EarnRow er)
    {
        return delegate ()
        {
            View.OnMainPageItemEditClick(er.id);
        };
    }

    UnityAction onBtnNoteClick(EarnRow er)
    {
        return delegate ()
        {
            View.OnMainPageItemMemoClick(er.id);
        };
    }

    UnityAction onBtnDeleteClick(EarnRow er)
    {
        return delegate ()
        {
            View.OnMainPageItemDeleteClick(er.id);
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

    public int CurrentMoney()
    {
        return GetCar().GetMoney();
    }
}
