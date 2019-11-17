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
            page.GetComponent<IPage>().close();
        }
        pages[(int)id].GetComponent<IPage>().open();
    }

    public void openMainPage()
    {
        openTargetPage(EPage.Main);
    }

    public void openCalculatePage()
    {
        openTargetPage(EPage.Calculate);
    }

    void initPages()
    {
        IModel model = new DebugModel();
        foreach (GameObject page in pages)
        {
            page.GetComponent<IPage>().setModel( model );
            page.GetComponent<IPage>().Init();
        }
    }
    
	void Start () {
        openMainPage();
	}
}
