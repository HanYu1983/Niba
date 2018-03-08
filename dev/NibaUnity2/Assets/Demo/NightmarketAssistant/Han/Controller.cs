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
        public EarnsInRangeRef earnsInRangeSelection;
        public NumPadControl numPadControl;
        public EditBoothControl editBoothControl;

        private void Start()
        {
            if (string.IsNullOrEmpty(initPage) == false)
            {
                ChangePage(initPage);
            }
            numPadControl.OnEnter += ClickNumPadEnter;
            editBoothControl.OnEnter += ClickEditBoothEnter;
        }
        
        public void ClickEarnDelete(EarnRef e)
        {
            storage.storage.earns.Remove(e.Ref);
            NMAEvent.OnEarnListChange();

            storage.Save();
        }

        public void ClickEarnEdit(EarnRef e)
        {
            e.Ref.money = numPadControl.Num;
            NMAEvent.OnEarnListChange();
            
            storage.Save();
        }

        public void ClickStartBooth()
        {
            storage.storage.OpenBooth(boothSelection.Ref.Key);
            ChangePage("CloseBoothPage");

            storage.Save();
        }

        public void ClickCloseBooth()
        {
            storage.storage.CloseBooth(boothSelection.Ref.Key);
            ChangePage("StartBoothPage");

            storage.Save();
        }

        public void ClickNumPadEnter(NumPadControl c)
        {
            var earn = storage.storage.NewEarn(boothSelection.Ref.Key);
            earn.money = numPadControl.Num;
            numPadControl.ClickClear();
            NMAEvent.OnEarnListChange();

            storage.Save();
        }

        public void ClickEditBoothEnter(EditBoothControl c)
        {
            var booth = editBoothControl.boothRef.Ref;
            var newBooth = storage.storage.NewBooth(booth.name);
            newBooth.comment = booth.comment;
            newBooth.rent = booth.rent;
            NMAEvent.OnBoothListChange();
            ChangePage("BoothListPage");
            storage.Save();
        }

        public void ClickEarnsInRangeView(EarnsInRangeRef e)
        {
            earnsInRangeSelection.refType = ObjectRefType.Ref;
            earnsInRangeSelection.objectRef = e;
            ChangePage("DetailScorePage");
        }

        public void ClickEarnsInRangeDelete(EarnsInRangeRef e)
        {
            var range = e.Ref;
            foreach(var earn in range.earns)
            {
                storage.storage.earns.Remove(earn);
            }
            NMAEvent.OnEarnListChange();
        }

        public void ClickEarnsInRangeContinue(EarnsInRangeRef e)
        {
            ChangePage("CloseBoothPage");
        }

        public void ClickBoothView(BoothRef booth)
        {
            boothSelection.refType = ObjectRefType.Ref;
            boothSelection.objectRef = booth;
            boothSelection.NotifyValueChange();
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