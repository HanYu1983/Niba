using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class CarRow : MonoBehaviour
{
    public Button BtnRemove;
    public Text Memo;
    public Text Money;
    public Text Time;

    public void SetMemo(string memo)
    {
        Memo.text = memo;
    }

    public void SetMoney(string money)
    {
        Money.text = money;
    }

    public void SetTime(string time)
    {
        Time.text = time;
    }
}
