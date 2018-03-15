using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using System.Linq;

namespace NightmarketAssistant
{
    public class Controller : MonoBehaviour
    {
        [Header("持久性資料")]
        public StorageComponent storage;
        [Header("基本功能")]
        public PageManager pageManager;
        public NMAPopupManager popupManager;
        [Tooltip("首頁, 可以留空")]
        public string initPage;
        [Tooltip("是否自動讀取資料")]
        public bool loadOnStart;
        [Header("暫存區")]
        public BoothRef boothSelection;
        public EarnsInRangeRef earnsInRangeSelection;
        public EarnListRef earnListSelection;
        public EarnRef earnSelection;
        public EarnListRef costEarnListSelection;
        [Header("外部引用")]
        public NumPadControl numPadControl;

        private void Start()
        {
            Application.runInBackground = true;

            if (loadOnStart)
            {
                storage.Load();
            }
            // 使用ZUI的換頁, 要比Start晚才行
            StartCoroutine(StartInitPage());
        }

        #region score earn
        Earn CalcEarn(string booth)
        {
            var earns = storage.storage.GetEarns(storage.storage.earns, booth, DateTime.MinValue);
            var total = earns.Sum(e => e.money);
            return new Earn(DateTime.Now.Ticks, booth) { money = total, comment = "收入" };
        }

        public void ClickCostNumPadEnter(NumPadControl c)
        {
            if(c.Num == 0)
            {
                Debug.LogWarning("ignore 0");
                return;
            }
            try
            {
                var earn = storage.storage.ForceNewEarn(storage.storage.costEarns);
                earn.money = c.Num;
                c.ClickClear();

                storage.Save();

                costEarnListSelection.value = storage.storage.costEarns;
                costEarnListSelection.OnValueChange();
            }
            catch(Exception e)
            {
                OnException(e);
            }
        }

        public void ClickCostNumPadExpend(NumPadControl c)
        {
            if (c.Num == 0)
            {
                Debug.LogWarning("ignore 0");
                return;
            }
            try {
                var earn = storage.storage.ForceNewEarn(storage.storage.costEarns);
                earn.money = -c.Num;
                c.ClickClear();

                storage.Save();

                costEarnListSelection.value = storage.storage.costEarns;
                costEarnListSelection.OnValueChange();
            }
            catch (Exception e)
            {
                OnException(e);
            }
        }

        public void ClickCostEarnDelete(EarnRef earnRef)
        {
            Action cmd = () =>
            {
                try
                {
                    storage.storage.costEarns.Remove(earnRef.Ref);
                    storage.Save();

                    costEarnListSelection.value = storage.storage.costEarns;
                    costEarnListSelection.OnValueChange();
                }
                catch (Exception e)
                {
                    OnException(e);
                }
            };
            StoreCommand("是否確定刪除" + earnRef.Ref.money, cmd);
        }

        public void ClickCostEarnMemo(EarnRef earn)
        {
            earnSelection.refType = ObjectRefType.Static;
            earnSelection.value = earn.Ref;
            popupManager.OpenPopup("MemoPopup");
        }
        #endregion

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
                numPadControl.ClickClear();
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

                earnListSelection.Ref.Clear();
                earnListSelection.OnValueChange();

                numPadControl.ClickClear();

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

                var earn = storage.storage.NewEarn(storage.storage.earns, boothSelection.Ref.Key);
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

                var earn = storage.storage.NewEarn(storage.storage.earns, boothSelection.Ref.Key);
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
                var booth = c.boothRef.Ref;
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

            numPadControl.ClickClear();
            ChangePage("CloseBoothPage");
        }

        public void ClickEarnsInRangeContinue(EarnsInRangeRef e)
        {
            earnsInRangeSelection.refType = ObjectRefType.Static;
            earnsInRangeSelection.value = e.Ref;

            earnListSelection.refType = ObjectRefType.Static;
            earnListSelection.value = e.Ref.earns;

            numPadControl.ClickClear();
            ChangePage("CloseBoothPage");
        }

        public void ClickEarnsInRangeDelete(EarnsInRangeRef e)
        {
            Action cmd = () =>
            {
                try
                {
                    earnListSelection.Ref.Clear();
                    earnListSelection.OnValueChange();

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

        public void ClickBoothContinue(BoothRef booth)
        {
            try
            {
                boothSelection.refType = ObjectRefType.Static;
                boothSelection.value = booth.Ref;
                boothSelection.NotifyValueChange();

                var ranges = Alg.GroupEarns(storage.storage, booth.Ref.Key);
                if (ranges.Count == 0)
                {
                    throw new Exception("必須有開結市資料, 程式有誤, 請等待程式更新");
                }
                var lastRange = ranges[ranges.Count - 1];
                if (lastRange.IsProgressing == false)
                {
                    throw new Exception("必須是開市狀態, 程式有誤, 請等待程式更新");
                }
                
                earnsInRangeSelection.refType = ObjectRefType.Static;
                earnsInRangeSelection.value = lastRange;

                earnListSelection.refType = ObjectRefType.Static;
                earnListSelection.value = lastRange.earns;

                numPadControl.ClickClear();
                ChangePage("CloseBoothPage");
            }
            catch(Exception e)
            {
                OnException(e);
            }
        }

        public void ClickBoothScore(BoothRef booth)
        {
            boothSelection.refType = ObjectRefType.Static;
            boothSelection.value = booth.Ref;
            boothSelection.NotifyValueChange();

            earnListSelection.refType = ObjectRefType.Static;
            earnListSelection.value = storage.storage.GetEarns(storage.storage.earns, boothSelection.Ref.Key, DateTime.MinValue);

            ChangePage("ScorePage");
        }

        public void ClickCost()
        {
            costEarnListSelection.refType = ObjectRefType.Static;
            costEarnListSelection.value = storage.storage.costEarns;
            costEarnListSelection.OnValueChange();

            earnListSelection.refType = ObjectRefType.Static;
            earnListSelection.value = storage.storage.earns;

            ChangePage("CostPage");
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
            costEarnListSelection.OnValueChange();

            storage.Save();

            popupManager.ClosePopup();
        }

        public void ClickCalculateFinish(CalculatePage calc)
        {
            // toList()讓它立即求值, 不然很像會有奇怪的情況
            var earns = calc.GetIncomeEarn().ToList();
            var sum = earns.Sum(e=>e.money);
            var comment = string.Join("+", earns.Select(e => e.money+"").ToArray());
            try
            {
                if (earnsInRangeSelection.Ref.IsProgressing == false)
                {
                    throw new Exception("開市中的才能新增");
                }
                var num = sum;
                if (num == 0)
                {
                    Debug.LogWarning("輸入為0, 所以忽略新增");
                    return;
                }

                var earn = storage.storage.NewEarn(storage.storage.earns, boothSelection.Ref.Key);
                earn.money = num;
                earn.comment = comment;

                storage.Save();

                numPadControl.ClickClear();
                calc.ClearEarns();

                NMAEvent.OnEarnListChange();

                earnListSelection.Ref.Add(earn);
                earnListSelection.OnValueChange();

                ChangePage("CloseBoothPage");
            }
            catch (Exception e)
            {
                OnException(e);
            }
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