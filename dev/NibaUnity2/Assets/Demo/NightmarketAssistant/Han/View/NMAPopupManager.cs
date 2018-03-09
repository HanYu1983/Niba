using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace NightmarketAssistant
{
    public class NMAPopupManager : MonoBehaviour
    {
        public List<string> popupNames;
        public GameObject[] popups;
        public List<GameObject> activePopups;

        public GameObject OpenPopup(string name)
        {
            var idx = popupNames.IndexOf(name);
            if (idx == -1)
            {
                throw new System.Exception("沒有這個頁:" + name);
            }
            var prefab = popups[idx];
            var currPage = Instantiate(prefab, prefab.transform.parent, false);
            var zui = currPage.GetComponent<Popup>();
            if (zui != null)
            {
                zui.ChangeVisibility(true);
            }
            else
            {
                currPage.SetActive(true);
            }
            activePopups.Add(currPage);
            return currPage;
        }

        public void ClosePopup()
        {
            if (activePopups.Count == 0)
            {
                return;
            }
            var top = activePopups[activePopups.Count - 1];
            activePopups.Remove(top);
            Destroy(top);
        }
    }
}