using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace NightmarketAssistant
{
    public class Controller : MonoBehaviour
    {
        public StorageComponent storage;
        public List<string> pageNames;
        public GameObject[] pages;
        public GameObject currPage;

        public string initPage;

        private void Start()
        {
            if (string.IsNullOrEmpty(initPage) == false)
            {
                ChangePage(initPage);
            }
        }

        private void OnEnable()
        {
            Start();
        }

        private void OnDisable()
        {
            
        }

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
                throw new System.Exception("XXXX");
            }
            currPage = pages[idx];
            currPage.SetActive(true);

            /*
            if(currPage != null)
            {
                Destroy(currPage);
                currPage = null;
            }
            var idx = pageNames.IndexOf(name);
            if(idx == -1)
            {
                throw new System.Exception("XXXX");
            }
            currPage = Instantiate(pages[idx], pages[idx].transform.parent, false);
            currPage.SetActive(true);
            */
        }

        public void DeleteBooth(BoothHolder booth)
        {
            storage.storage.RemoveBooth(booth.booth.Key);
            if (currPage != null)
            {
                currPage.SetActive(false);
                currPage.SetActive(true);
            }
        }
    }
}