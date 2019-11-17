using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class View : MonoBehaviour {

    public GameObject[] pages;

    void openTargetPage(EPage id)
    {
        foreach (GameObject page in pages)
        {
            page.SetActive(false);
        }
        pages[(int)id].SetActive(true);
    }

    public void openMainPage()
    {
        openTargetPage(EPage.Main);
    }

    public void openCalculatePage()
    {
        openTargetPage(EPage.Calculate);
    }
    
	void Start () {
        openMainPage();
	}
}
