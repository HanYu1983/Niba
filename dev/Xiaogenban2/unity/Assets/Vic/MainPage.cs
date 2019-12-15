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
    public GameObject EarnRow;
    public GameObject EarnList;
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
    int currentCountType = 0;

    public void ChangeShowType()
    {
        if (++currentTimeType > timeTypes.Length - 1) currentTimeType = 0;
        ShowType.text = timeTypes[currentTimeType];
        RefreshList();
        ItemListToTop();
    }

    public void ChangeCountType()
    {
        if (++currentCountType > countTypes.Length - 1) currentCountType = 0;
        ShowCountType.text = ((int)countTypes[currentCountType]).ToString();
        
        RefreshList();
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
            RefreshList();
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
    
    public void RefreshList()
    {
        Model.GetItemList((int)countTypes[currentCountType], currentTimeType, filterMemo, delegate (object error, List<Item> list)
        {
            UpdateItemList();
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

    public void UpdateItemList()
    {
        ItemScroller.totalCount = (int)countTypes[currentCountType];
        ItemScroller.RefreshCells();
        //if (list == null) return;
        //ClearList();
        //foreach (Item itemModel in list)
        //{
        //    GameObject item = Instantiate(EarnRow, EarnList.transform);
        //    item.name = "item_" + itemModel.Id;
        //    item.SetActive(true);

        //    EarnRow er = item.GetComponent<EarnRow>();
        //    er.id = itemModel.Id;
        //    er.memo.text = itemModel.Memo.ToString();
        //    er.time.text = itemModel.Time.ToString();
        //    er.money.text = itemModel.Money.ToString();
        //    er.Btn_edit.onClick.AddListener(onBtnEditClick(er));
        //    er.Btn_delete.onClick.AddListener(onBtnDeleteClick(er));
        //    er.Btn_note.onClick.AddListener(onBtnNoteClick(er));

        //    er.Btn_edit.interactable = !IsSearch && currentTimeType == ETimeType.ITEM;
        //    er.Btn_delete.interactable = !IsSearch && currentTimeType == ETimeType.ITEM;
        //    er.Btn_note.interactable = !IsSearch && currentTimeType == ETimeType.ITEM;

        //    earnRows.Add(item);
        //}
        //UpdateBtn();
    }

    public void ItemListToTop()
    {
        ItemScroller.SrollToCell(0, 20000);
    }

    void UpdateBtn()
    {
        BtnBack.gameObject.SetActive(_isSearch);
        BtnSearch.interactable = !_isSearch;
        BtnEarn.interactable = !IsSearch && currentTimeType == ETimeType.ITEM;
        BtnPay.interactable = !IsSearch && currentTimeType == ETimeType.ITEM;
        BtnCar.interactable = !IsSearch && currentTimeType == ETimeType.ITEM;
    }

    //UnityAction onBtnEditClick(EarnRow er)
    //{
    //    return delegate ()
    //    {
    //        View.OnMainPageItemEditClick(er.id);
    //    };
    //}

    //UnityAction onBtnNoteClick(EarnRow er)
    //{
    //    return delegate ()
    //    {
    //        View.OnMainPageItemMemoClick(er.id);
    //    };
    //}

    //UnityAction onBtnDeleteClick(EarnRow er)
    //{
    //    return delegate ()
    //    {
    //        View.OnMainPageItemDeleteClick(er.id);
    //    };
    //}

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
