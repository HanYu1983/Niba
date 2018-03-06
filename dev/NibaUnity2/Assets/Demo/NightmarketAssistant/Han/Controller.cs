using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace NightmarketAssistant
{
    public class Controller : MonoBehaviour
    {
        public StorageComponent storage;
        public PageManager pageManager;
        public string initPage;
        public BoothRef boothSelection;

        private void Start()
        {
            if (string.IsNullOrEmpty(initPage) == false)
            {
                ChangePage(initPage);
            }
        }

        public void ClickBoothView(BoothRef booth)
        {
            boothSelection.refType = ObjectRefType.Ref;
            boothSelection.objectRef = booth;
            ChangePage("StartBoothPage");
        }

        public void ChangePage(string name)
        {
            pageManager.ChangePage(name);
        }

        public void DeleteBooth(BoothRef booth)
        {
            storage.storage.RemoveBooth(booth.Ref.Key);
            NMAEvent.OnBoothListChange();
        }
    }
}