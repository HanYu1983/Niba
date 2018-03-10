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
        public NMAPopupManager popupManager;
        public string initPage;
        public BoothRef boothSelection;
        public EarnsInRangeRef earnsInRangeSelection;
        public EarnListRef earnListSelection;
        public EarnRef earnSelection;
        public NumPadControl numPadControl;
        public EditBoothControl editBoothControl;
        public bool loadOnStart;

        private void Start()
        {
            Application.runInBackground = true;

            if (loadOnStart)
            {
                storage.Load();
            }
            
            numPadControl.OnEnter += ClickNumPadEnter;
            numPadControl.OnExpend += ClickNumPadExpend;
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

                earnListSelection.Ref.Remove(e.Ref);
                earnListSelection.OnValueChange();

                storage.Save();
            };
            StoreCommand("是否確定刪除"+e.Ref.money, cmd);
        }

        public void ClickEarnEdit(EarnRef e)
        {
            var isShouldReEnter = numPadControl.Num == 0;
            if (isShouldReEnter)
            {
                OpenMessagePopup("請輸入大於0的數字");
                return;
            }
            var isSameNum = numPadControl.Num == e.Ref.money;
            if (isSameNum)
            {
                OpenMessagePopup("請輸入不一樣的值");
                return;
            }
            Action cmd = () =>
            {
                e.Ref.money = numPadControl.Num;
                NMAEvent.OnEarnListChange();

                earnListSelection.OnValueChange();

                storage.Save();
            };
            StoreCommand("是否確定修改" + e.Ref.money +" => " + numPadControl.Num, cmd);
        }

        public void ClickEarnMemo(EarnRef earn)
        {
            earnSelection.refType = ObjectRefType.Static;
            earnSelection.value = earn.Ref;
            popupManager.OpenPopup("MemoPopup");
        }

        public void ClickStartBooth()
        {
            try
            {
                storage.storage.OpenBooth(boothSelection.Ref.Key);

                var s = storage.storage.GetBoothStateByBooth(boothSelection.Ref.Key);
                earnsInRangeSelection.refType = ObjectRefType.Static;
                earnsInRangeSelection.value = new EarnsInRange(boothSelection.Ref.Key, new DateTime(s.date));


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
                if (earnsInRangeSelection.Ref.IsProgressing == false)
                {
                    throw new Exception("開市中的才能新增");
                }

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

                earnListSelection.Ref.Add(earn);
                earnListSelection.OnValueChange();

                storage.Save();
            }catch(Exception e)
            {
                OnException(e);
            }
        }

        public void ClickNumPadExpend(NumPadControl c)
        {
            try
            {
                if (earnsInRangeSelection.Ref.IsProgressing == false)
                {
                    throw new Exception("開市中的才能新增");
                }

                var num = numPadControl.Num;
                if (num == 0)
                {
                    Debug.LogWarning("輸入為0, 所以忽略新增");
                    return;
                }

                var earn = storage.storage.NewEarn(boothSelection.Ref.Key);
                earn.money = -num;
                numPadControl.ClickClear();
                NMAEvent.OnEarnListChange();

                earnListSelection.Ref.Add(earn);
                earnListSelection.OnValueChange();

                storage.Save();
            }
            catch (Exception e)
            {
                OnException(e);
            }
        }

        public void ClickEditBoothEnter(EditBoothControl c)
        {
            try
            {
                var booth = editBoothControl.boothRef.Ref;
                if (string.IsNullOrEmpty(booth.name))
                {
                    throw new Exception("新填上攤位名稱");
                }
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
            earnsInRangeSelection.refType = ObjectRefType.Static;
            earnsInRangeSelection.value = e.Ref;

            earnListSelection.refType = ObjectRefType.Static;
            earnListSelection.value = e.Ref.earns;
            ChangePage("CloseBoothPage");
        }

        public void ClickEarnsInRangeContinue(EarnsInRangeRef e)
        {
            earnsInRangeSelection.refType = ObjectRefType.Static;
            earnsInRangeSelection.value = e.Ref;

            earnListSelection.refType = ObjectRefType.Static;
            earnListSelection.value = e.Ref.earns;
            ChangePage("CloseBoothPage");
        }

        public void ClickEarnsInRangeDelete(EarnsInRangeRef e)
        {
            Action cmd = () =>
            {
                try
                {
                    var range = e.Ref;
                    if (range.IsProgressing)
                    {
                        storage.storage.DeleteLastOpenState(range.booth);
                    }
                    else
                    {
                        storage.storage.DeleteStateAtTargetRange(range.booth, range.open.Ticks, range.close.Ticks);
                    }
                    foreach (var earn in range.earns)
                    {
                        storage.storage.earns.Remove(earn);
                    }
                    NMAEvent.OnEarnListChange();

                    storage.Save();
                }
                catch(Exception e2)
                {
                    OnException(e2);
                }
            };
            StoreCommand("是否確定刪除"+e.Ref.earns.Count+"筆資料", cmd);
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

        public void ClickMemoEnter(MemoView memoView)
        {
            earnSelection.Ref.comment = memoView.Memo;
            NMAEvent.OnEarnListChange();

            storage.Save();

            popupManager.ClosePopup();
        }

        void OnException(Exception e)
        {
            Debug.LogWarning("OnException:"+e.Message);
            OpenMessagePopup(e.Message);
#if UNITY_EDITOR
            throw e;
#endif
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
            view.UpdateView(null, content);
        }
    }
}