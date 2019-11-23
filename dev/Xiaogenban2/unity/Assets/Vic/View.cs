using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using UnityEngine.Events;

public class View : MonoBehaviour {

    public GameObject[] pages;

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

    public void OpenCalculatePage()
    {
        GetCalculatePage().Open();
    }

    public void OnCalculatePageConfirm()
    {
        GetCalculatePage().InputComplete();
    }

    public void OnCalculatePageCancel()
    {
        GetCalculatePage().Cancel();
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
        GetMemoPage().Confirm();
        CloseMemoPage();
    }

    public void OnMemoPageCancel()
    {
        GetMemoPage().Cancel();
        CloseMemoPage();
    }

    public void CloseCalculatePage()
    {
        GetCalculatePage().Close();
    }

    public void OpenMemoPage()
    {
        GetMemoPage().Open();
    }

    public void CloseMemoPage()
    {
        GetMemoPage().Close();
    }

    public void OnSearchPageConfirm()
    {
        GetSearchPage().Confirm();
        CloseSearchPage();
    }

    public void OnSearchPageCancel()
    {
        GetSearchPage().Cancel();
        CloseSearchPage();
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
        IModel model = new DebugModel();
        foreach (GameObject page in pages)
        {
            page.GetComponent<IPage>().Model = model;
            page.GetComponent<IPage>().View = this;
            page.GetComponent<IPage>().Init();
        }
    }
    
	void Start () {
        InitPages();
        OpenMainPage();
	}
}
