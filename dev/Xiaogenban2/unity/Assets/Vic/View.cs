﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using UnityEngine.Events;

public class View : MonoBehaviour {

    public GameObject[] pages;

    public MonoBehaviour model;
    public static IModel Model;
    public static View Instance;

    public bool EnableFeature()
    {
        return GetMainPage().EnableFeature();
    }

    public bool EnableMemoMoney()
    {
        return GetMainPage().EnableMemoMoney();
    }

    void OpenTargetPage(EPage id)
    {
        foreach (GameObject page in pages)
        {
            page.GetComponent<IPage>().Close();
        }
        pages[(int)id].GetComponent<IPage>().Open();
    }
    
    public void OnDataPageConfirmClick()
    {
        bool isValid = Model.IsValidID(GetDataPage().InputID);
        if (isValid)
        {
            OpenPopPage("確定要取回資料嗎?本地的資料會丟失哦!",
            delegate () {
                OpenLoadingPage("取回資料中，請稍等…");
                Model.GetUserData(GetDataPage().InputID, delegate (bool success)
                {
                    if (success)
                    {
                        GetDataPage().Close();
                        GetPopPage().Close();
                        OpenMainPage();
                    }
                    CloseLoadingPage();
                });
            },
            delegate () {
                GetPopPage().Close();
            });
        }
        else
        {
            GetDataPage().ShowID = "內容有誤哦，請檢查！";
        }
    }

    public void OnDataPageCancelClick()
    {
        GetDataPage().Close();
    }

    public void OnDataPageInputChange()
    {
        GetDataPage().ShowClearID();
    }

    void OpenLoadingPage(string content)
    {
        GetLoadingPage().Open();
        GetLoadingPage().Content = content;
    }

    void CloseLoadingPage()
    {
        GetLoadingPage().Close();
    }

    public void OpenMainPage()
    {
        OpenTargetPage(EPage.Main);
    }

    public void OnMainPageBtnDataClick()
    {
        GetDataPage().Open();
    }

    public void OnMainPageSearchBackClick()
    {
        GetMainPage().IsSearch = false;
        GetMainPage().filterMemo = "";
        GetMainPage().RefreshList(true);
    }

    public void OnMainPageNoteClick()
    {
        OpenMemoPage(0);
    }

    //public void OnMainPageCountClick()
    //{
    //    GetMainPage().ChangeCountType();
    //}

    public void OnMainPageTypeClick()
    {
        GetMainPage().ChangeShowType();
    }

    public void OnMainPageCarClick()
    {
        OpenCalculatePage();
    }

    public void OnMainPageSearchClick()
    {
        OpenSearchPage();
    }

    public void OnMainPageNumberClick(int id)
    {
        GetMainPage().AddMoney(id);
    }

    public void OnMainPageFeatureClick(int id)
    {
        switch (id)
        {
            case 0:
                GetMainPage().ClearMoney();
                break;
            case 1:
                GetMainPage().BackMoney();
                break;
            case 2:
                GetMainPage().Buy();
                break;
            case 3:
                GetMainPage().Earn();
                break;
            case 4:
                GetMainPage().DoubleZero();
                break;
        }
    }

    public void OnMainPageItemMemoClick(int id)
    {
        OpenMemoPage(id);
    }

    public void OnMainPageItemEditClick(int id)
    {
        Item item = Model.GetItemCacheById(id);
        OpenPopPage("是否確定修改" + item.Money + " => " + GetMainPage().CurrentMoney(),
            delegate ()
            {
                Model.ChangeItemMoney(id, GetMainPage().CurrentMoney(), delegate (object error, List<Item> list)
                {
                    GetMainPage().RefreshList(false);
                    ClosePopPage();
                });
            },
            delegate ()
            {
                ClosePopPage();
            });
    }

    public void OnMainPageItemDeleteClick(int id)
    {
        Item item = Model.GetItemCacheById(id);
        OpenPopPage("是否確定刪除" + item.Money + "這個項目？",
            delegate ()
            {
                Model.DeleteItem(id, delegate (object error, List<Item> list)
                {
                    GetMainPage().RefreshList(true);
                    ClosePopPage();
                });
            },
            delegate ()
            {
                ClosePopPage();
            });
    }

    public void OpenCalculatePage()
    {
        GetCalculatePage().Open();
    }

    public void OnCalculatePageConfirm()
    {
        object[] result = GetCalculatePage().GetCurrentResult();
        if((int)result[2] < 0)
        {
            OpenPopPage("還沒有輸入客人所付的金錢哦!",
                delegate ()
                {
                    ClosePopPage();
                },
                delegate ()
                {
                    ClosePopPage();
                });
            return;
        }
        OpenPopPage("確定結帳嗎？",
        delegate ()
        {
            
            Model.AddEarn(Math.Abs((int)result[1]), result[3].ToString(), "", delegate (object error, List<Item> list)
            {
                CloseCalculatePage();
                ClosePopPage();

                GetMainPage().RefreshList(true);
            });
        },
        delegate ()
        {
            ClosePopPage();
        });
    }

    public void OnCalculatePageCancel()
    {
        CloseCalculatePage();
        ClosePopPage();
    }

    public void OnCalculatePageNumberClick(int id)
    {
        GetCalculatePage().AddMoney(id);
    }

    public void OnCalculateFeatureClick(int id)
    {
        switch (id)
        {
            case 0:
                GetCalculatePage().ClearMoney();
                break;
            case 1:
                GetCalculatePage().BackMoney();
                break;
            case 2:
                GetCalculatePage().GuestPay();
                break;
            case 3:
                GetCalculatePage().AddItem();
                break;
            case 4:
                GetCalculatePage().DoubleZero();
                break;
        }
    }

    public void OnMemoPageConfirm()
    {
        int id = GetMemoPage().Id;
        string content = GetMemoPage().GetContent();

        List<MemoItem> memos = Model.GetMemoList();
        Model.ChangeItemMemo(id, Model.MemoListToString(memos), delegate (object error, List<Item> list)
        {
            GetMainPage().RefreshList(false);
            CloseMemoPage();
        });
    }

    public void OnMemoPageCancel()
    {
        CloseMemoPage();
    }

    public void OnMemoPageAddTagClick()
    {
        GetMemoPage().AddTag();
    }

    public void OnSearchPageConfirm()
    {
        List<MemoItem> memos = Model.GetMemoList();
        string searchString = Model.MemoListToString(memos);
        GetMainPage().filterMemo = searchString;
        if (searchString != "")
        {
            GetMainPage().IsSearch = true;
            GetMainPage().RefreshList(true);
            GetMainPage().ItemListToTop();
        }
        CloseSearchPage();
    }
    
    public void OnSearchPageFilterChange()
    {
        GetSearchPage().FilterTag();
    }

    public void OnSearchPageCancel()
    {
        CloseSearchPage();
    }

    public void CloseCalculatePage()
    {
        GetCalculatePage().Close();
    }

    public void OpenMemoPage(int id)
    {
        GetMemoPage().Id = id;
        GetMemoPage().Open();
    }

    public void CloseMemoPage()
    {
        GetMemoPage().Close();
    }

    public void OpenSearchPage()
    {
        GetSearchPage().Open();
    }

    public void CloseSearchPage()
    {
        GetSearchPage().Close();
    }

    public void OpenPopPage(string content, UnityAction onConfirm, UnityAction onCancel)
    {
        PopPage popPage = GetPopPage();
        popPage.Open();
        popPage.SetContent(content);
        popPage.SetConfirm(onConfirm);
        popPage.SetCancel(onCancel);
    }

    public void ClosePopPage()
    {
        GetPopPage().Close();
    }

    LoadingPage GetLoadingPage()
    {
        return pages[(int)EPage.Loading].GetComponent<LoadingPage>();
    }

    DataPage GetDataPage()
    {
        return pages[(int)EPage.Data].GetComponent<DataPage>();
    }

    MainPage GetMainPage()
    {
        return pages[(int)EPage.Main].GetComponent<MainPage>();
    }

    CalculatePage GetCalculatePage()
    {
        return pages[(int)EPage.Calculate].GetComponent<CalculatePage>();
    }

    MemoPage GetMemoPage()
    {
        return pages[(int)EPage.Memo].GetComponent<MemoPage>();
    }

    SearchPage GetSearchPage()
    {
        return pages[(int)EPage.Search].GetComponent<SearchPage>();
    }

    public PopPage GetPopPage()
    {
        return pages[(int)EPage.Pop].GetComponent<PopPage>();
    }

    void InitPages()
    {
        Instance = this;
        if(model is IModel == false)
        {
            throw new Exception("xxxx");
        }
        Model = (IModel)model;
        foreach (GameObject page in pages)
        {
            page.GetComponent<IPage>().Model = Model;
            page.GetComponent<IPage>().View = this;
            page.GetComponent<IPage>().Init();
        }

        Model.SetErrorAction(delegate (string error)
        {
            OpenPopPage(error,
                delegate () {
                    ClosePopPage();
                },
                delegate ()
                {
                    ClosePopPage();
                });
        });
        Model.Load(delegate (bool success)
        {
            if (success)
            {
                OpenMainPage();
            }
        });
    }

    void Start () {
        
        InitPages();
	}
}
