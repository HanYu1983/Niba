using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

[RequireComponent(typeof(MoneyCar))]
public class CalculatePage : Page, IHasMoneyCar
{
    public List<GameObject> CarRows = new List<GameObject>();
    public Text Money;
    public Text CurrentCalculate;

    public GameObject PrefabCarRow;
    public GameObject CarRowContainer;

    public override void Open()
    {
        base.Open();
        ClearMoney();
        ShowCurrentCalculate();
        UpdateList(Model.GetCarItemListCache());
    }

    public override void Close()
    {
        base.Close();

        ClearMoney();
        ClearRows();
    }

    public void AddItem()
    {
        int money = GetCar().GetMoney();
        if (money == 0)
        {
            return;
        }
        Model.AddItemToCar(money * -1, "價錢", DateTime.Now.ToString(), delegate (object error, List<Item> list)
        {
            UpdateList(list);
            ClearMoney();
            ShowCurrentCalculate();
        });
    }

    public void GuestPay()
    {
        int money = GetCar().GetMoney();
        if (money == 0)
        {
            return;
        }
        Model.AddItemToCar(money, "客人支付", DateTime.Now.ToString(), delegate (object error, List<Item> list)
        {
            UpdateList(list);
            ClearMoney();
            ShowCurrentCalculate();
        });
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

    void UpdateList(List<Item> list)
    {
        ClearRows();
        foreach(Item item in list)
        {
            GameObject carRow = Instantiate(PrefabCarRow, CarRowContainer.transform);
            carRow.SetActive(true);
            CarRows.Add(carRow);

            CarRow cr = carRow.GetComponent<CarRow>();
            cr.SetMoney(item.Money);
            cr.SetMemo(item.Memo);
            cr.SetTime(item.Time);
            cr.BtnRemove.onClick.RemoveAllListeners();
            cr.BtnRemove.onClick.AddListener(OnRemoveClick(item.Id));
        }
    }

    UnityAction OnRemoveClick(int id)
    {
        return delegate ()
        {
            Model.DeleteItemFromCar(id, delegate (object error, List<Item> list)
            {
                UpdateList(list);
            });
        };
    }

    void ClearRows()
    {
        foreach (GameObject obj in CarRows) Destroy(obj);
        CarRows.Clear();
    }

    void ShowCurrentCalculate()
    {
        object[] result = GetCurrentResult();
        CurrentCalculate.text = result[0].ToString() + " - " + Mathf.Abs((int)result[1]).ToString() + " = " + result[2];
    }

    public object[] GetCurrentResult()
    {
        int guestPay = 0;
        int totalMoney = 0;
        string memo = "";
        List<Item> list = Model.GetCarItemListCache();
        foreach(Item item in list)
        {
            if (item.Money > 0)
            {
                guestPay += item.Money;
            }
            else
            {
                totalMoney += item.Money;
                memo += "+" + Mathf.Abs(item.Money).ToString();
            }
        }
        return new object[] { guestPay, totalMoney, guestPay + totalMoney, memo };
    }

    public int CurrentMoney()
    {
        return GetCar().GetMoney();
    }
}
