using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

[RequireComponent(typeof(MoneyCar))]
public class CalculatePage : Page, IHasMoneyCar
{
    public List<GameObject> CarRows = new List<GameObject>();
    public Text Money;
    public Text CurrentCalculate;

    public GameObject PrefabCarRow;
    public GameObject CarRowContainer;

    int guestPay = 0;

    public override void Open()
    {
        base.Open();
        ClearMoney();
        ShowCurrentCalculate();
        guestPay = 0;
    }

    public override void Close()
    {
        base.Close();

        ClearMoney();
        ClearRows();
        guestPay = 0;
    }

    public void InputComplete()
    {
        View.OpenPopPage("確定結帳嗎？", 
        delegate ()
        {
            int[] result = GetCurrentResult();
            Debug.Log("結帳:" + result.ToString());

            View.CloseCalculatePage();
            View.ClosePopPage();
        }, 
        delegate ()
        {
            View.ClosePopPage();
        });
    }

    public void Cancel()
    {
        View.OpenPopPage("確定離開嗎？",
        delegate ()
        {
            View.CloseCalculatePage();
            View.ClosePopPage();
        },
        delegate ()
        {
            View.ClosePopPage();
        });
    }

    public void AddItem()
    {
        GameObject carRow = Instantiate(PrefabCarRow, CarRowContainer.transform);
        carRow.SetActive(true);
        CarRows.Add(carRow);

        CarRow cr = carRow.GetComponent<CarRow>();
        cr.SetMoney(GetCar().ShowMoney());
        
        ClearMoney();
        ShowCurrentCalculate();
    }

    public void GuestPay()
    {
        guestPay = int.Parse(GetCar().ShowMoney());
        ShowCurrentCalculate();
        ClearMoney();
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

    void ClearRows()
    {
        foreach (GameObject obj in CarRows) Destroy(obj);
        CarRows.Clear();
    }

    void ShowCurrentCalculate()
    {
        int[] result = GetCurrentResult();
        CurrentCalculate.text = result[0].ToString() + " - " + result[1].ToString() + " = " + result[2];
    }

    int[] GetCurrentResult()
    {
        int earns = 0;
        foreach (GameObject row in CarRows)
        {
            earns += int.Parse(row.GetComponent<CarRow>().Money.text);
        }
        int remain = guestPay - earns;
        return new int[] { guestPay, earns, remain };
    }
}
