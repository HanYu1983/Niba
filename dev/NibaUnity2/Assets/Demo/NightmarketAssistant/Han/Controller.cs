using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

namespace NightmarketAssistant
{
    public class Controller : MonoBehaviour
    {
        public StorageComponent storage;
        public PageManager pageManager;
        public PopupManager popupManager;
        public string initPage;
        public BoothRef boothSelection;
        public EarnListRef earnListSelection;
        public NumPadControl numPadControl;
        public EditBoothControl editBoothControl;
        public bool loadOnStart;

        private void Start()
        {
            if (loadOnStart)
            {
                storage.Load();
            }
            
            numPadControl.OnEnter += ClickNumPadEnter;
            editBoothControl.OnEnter += ClickEditBoothEnter;
            // 使用ZUI的換頁, 要比Start晚才行
            StartCoroutine(StartInitPage());
        }

        IEnumerator StartInitPage()
        {
            yield return null;
            if (string.IsNullOrEmpty(initPage) == false)
            {
                ChangePage(initPage);
            }
        }
        
        public void ClickEarnDelete(EarnRef e)
        {
            Action cmd = () =>
            {
                storage.storage.earns.Remove(e.Ref);
                NMAEvent.OnEarnListChange();

                storage.Save();
            };
            StoreCommand("是否確定刪除"+e.Ref.money, cmd);
        }

        public void ClickEarnEdit(EarnRef e)
        {
            Action cmd = () =>
            {
                e.Ref.money = numPadControl.Num;
                NMAEvent.OnEarnListChange();

                storage.Save();
            };
            StoreCommand("是否確定修改" + e.Ref.money +" => " + numPadControl.Num, cmd);
        }

        public void ClickStartBooth()
        {
            try
            {
                storage.storage.OpenBooth(boothSelection.Ref.Key);
                ChangePage("CloseBoothPage");

                storage.Save();
            }
            catch(Exception e)
            {
                OnException(e);
            }
        }

        public void ClickCloseBooth()
        {
            Action cmd = () =>
            {
                try
                {
                    storage.storage.CloseBooth(boothSelection.Ref.Key);
                    ChangePage("StartBoothPage");

                    storage.Save();
                }
                catch (Exception e)
                {
                    OnException(e);
                }
            };
            StoreCommand("是否確定結市", cmd);
        }

        public void ClickNumPadEnter(NumPadControl c)
        {
            try
            {
                var num = numPadControl.Num;
                if (num == 0)
                {
                    Debug.LogWarning("輸入為0, 所以忽略新增");
                    return;
                }
                var earn = storage.storage.NewEarn(boothSelection.Ref.Key);
                earn.money = num;
                numPadControl.ClickClear();
                NMAEvent.OnEarnListChange();

                storage.Save();
            }catch(Exception e)
            {
                OnException(e);
            }
        }

        public void ClickEditBoothEnter(EditBoothControl c)
        {
            try
            {
                var booth = editBoothControl.boothRef.Ref;
                var newBooth = storage.storage.NewBooth(booth.name);
                newBooth.comment = booth.comment;
                newBooth.rent = booth.rent;
                NMAEvent.OnBoothListChange();
                ChangePage("BoothListPage");
                storage.Save();
            }catch(Exception e)
            {
                OnException(e);
            }
        }

        public void ClickEarnsInRangeView(EarnsInRangeRef e)
        {
            earnListSelection.refType = ObjectRefType.Static;
            earnListSelection.value = e.Ref.earns;
            ChangePage("DetailScorePage");
        }

        public void ClickEarnsInRangeDelete(EarnsInRangeRef e)
        {
            Action cmd = () =>
            {
                var range = e.Ref;
                foreach (var earn in range.earns)
                {
                    storage.storage.earns.Remove(earn);
                }
                NMAEvent.OnEarnListChange();

                storage.Save();
            };
            StoreCommand("是否確定刪除"+e.Ref.earns.Count+"筆資料", cmd);

        }

        public void ClickEarnsInRangeContinue(EarnsInRangeRef e)
        {
            ChangePage("CloseBoothPage");
        }

        public void ClickBoothView(BoothRef booth)
        {
            boothSelection.refType = ObjectRefType.Static;
            boothSelection.value = booth.Ref;
            boothSelection.NotifyValueChange();
            ChangePage("StartBoothPage");
        }

        public void ClickBoothScore(BoothRef booth)
        {
            earnListSelection.refType = ObjectRefType.Static;
            earnListSelection.value = storage.storage.GetEarns(booth.Ref.Key, DateTime.MinValue);
            ChangePage("ScorePage");
        }

        public void ChangePage(string name)
        {
            pageManager.ChangePage(name);
        }

        public void DeleteBooth(BoothRef booth)
        {
            Action cmd = () =>
            {
                try
                {
                    storage.storage.RemoveBooth(booth.Ref.Key);
                    NMAEvent.OnBoothListChange();

                    storage.Save();
                }
                catch (Exception e)
                {
                    OnException(e);
                }
            };
            StoreCommand("是否確定刪除" + booth.Ref.name, cmd);
        }

        Action command;

        void StoreCommand(string ask, Action cmd)
        {
            command = cmd;
            OpenMessagePopup(ask);
        }

        public void ClickMessageEnter()
        {
            if(command == null)
            {
                popupManager.ClosePopup();
                return;
            }
            command();
            command = null;
            popupManager.ClosePopup();
        }
        
        void OnException(Exception e)
        {
            OpenMessagePopup(e.Message);
        }
        void OpenMessagePopup(string content)
        {
            var popup = popupManager.OpenPopup("MessagePopup");
            var view = popup.GetComponent<MessageView>();
            if(view == null)
            {
                Debug.LogWarning("no message view can show");
                Debug.LogWarning(content);
                return;
            }
            view.UpdateView("System", content);
        }
    }
}