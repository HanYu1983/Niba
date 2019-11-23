using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

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

    public void OpenCalculatePage()
    {
        pages[(int)EPage.Calculate].GetComponent<IPage>().Open();
    }

    public void OnCalculatePageConfirm()
    {
        pages[(int)EPage.Calculate].GetComponent<CalculatePage>().InputComplete();
        CloseCalculatePage();
    }

    public void OnCalculatePageCancel()
    {
        pages[(int)EPage.Calculate].GetComponent<CalculatePage>().Cancel();
        CloseCalculatePage();
    }

    public void CloseCalculatePage()
    {
        pages[(int)EPage.Calculate].GetComponent<IPage>().Close();
    }

    public void OpenMemoPage()
    {
        pages[(int)EPage.Memo].GetComponent<IPage>().Open();
    }

    public void CloseMemoPage()
    {
        pages[(int)EPage.Memo].GetComponent<IPage>().Close();
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
