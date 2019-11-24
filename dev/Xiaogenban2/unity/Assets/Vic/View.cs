using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using UnityEngine.Events;

public class View : MonoBehaviour {

    public GameObject[] pages;

    public MonoBehaviour model;
    IModel Model;

    void OpenTargetPage(EPage id)
    {
        foreach (GameObject page in pages)
        {
            page.GetComponent<IPage>().Close();
        }
        pages[(int)id].GetComponent<IPage>().Open();
    }

    public void OpenMainPage()
    {
        OpenTargetPage(EPage.Main);
    }

    public void OnMainPageNoteClick()
    {
        OpenMemoPage(0);
    }

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
                    GetMainPage().UpdateItemList(list);
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
                    GetMainPage().UpdateItemList(list);
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
        OpenPopPage("確定結帳嗎？",
        delegate ()
        {
            object[] result = GetCalculatePage().GetCurrentResult();
            Model.AddEarn((int)result[2], result[3].ToString(), "", delegate (object error, List<Item> list)
            {
                CloseCalculatePage();
                ClosePopPage();

                GetMainPage().RefreshList();
            });
        },
        delegate ()
        {
            ClosePopPage();
        });
    }

    public void OnCalculatePageCancel()
    {
        OpenPopPage("確定離開嗎？",
        delegate ()
        {
            CloseCalculatePage();
            ClosePopPage();
        },
        delegate ()
        {
            ClosePopPage();
        });
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
        Model.ChangeItemMemo(id, content, delegate (object error, List<Item> list)
        {
            GetMainPage().UpdateItemList(list);
            CloseMemoPage();
        });
    }

    public void OnMemoPageCancel()
    {
        CloseMemoPage();
    }

    public void OnSearchPageConfirm()
    {
        string searchString = GetSearchPage().GetContent();
        if(searchString != "")
        {
            GetMainPage().RefreshList(GetSearchPage().GetContent());
        }
        CloseSearchPage();
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
        GetMemoPage().Open();
        GetMemoPage().Id = id;
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
    }
    
	void Start () {
        InitPages();
        OpenMainPage();
	}
}
