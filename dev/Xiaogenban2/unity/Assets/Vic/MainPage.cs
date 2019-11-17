using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

public class MainPage : Page
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

    public override void Init()
    {
        base.Init();
    }

    public override void open()
    {
        base.open();

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
        };
    }

    UnityAction onBtnDeleteClick(EarnRow er)
    {
        return delegate ()
        {
            print("刪除" + er.name);
        };
    }

}
