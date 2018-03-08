using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace NightmarketAssistant
{
    public class PageManager : MonoBehaviour
    {
        public List<string> pageNames;
        public GameObject[] pages;
        public GameObject currPage;
        public ZUIManager zuiMgr;

        public void ChangePage(string name)
        {
            if (currPage != null)
            {
                currPage.SetActive(false);
                currPage = null;
            }
            var idx = pageNames.IndexOf(name);
            if (idx == -1)
            {
                throw new System.Exception("沒有這個頁:"+name);
            }
            currPage = pages[idx];
            if (zuiMgr != null)
            {
                var zui = currPage.GetComponent<Menu>();
                if (zui != null)
                {
                    zuiMgr.OpenMenu(zui);
                } else
                {
                    currPage.SetActive(true);
                }
            } else
            {
                currPage.SetActive(true);
            }
        }
    }
}