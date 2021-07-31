using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using UnityEngine.Events;
using System.Linq;

public class View : MonoBehaviour {

    public GameObject[] pages;

    public MonoBehaviour model;
    public static IModel ModelInst;
    public static View Instance;
    
    public bool EnableFeature()
    {
        return GetMainPage().EnableFeature();
    }

    public bool EnableMemoMoney()
    {
        return GetMainPage().EnableMemoMoney();
    }

    void OpenTargetPage(EPage id)
    {
        foreach (GameObject page in pages)
        {
            page.GetComponent<IPage>().Close();
        }
        pages[(int)id].GetComponent<IPage>().Open();
    }

    public void OnDataPageSaveClick()
    {
        ModelInst.ManuallySave();
    }

    public void OnDataPageArchiveClick()
    {
        List<Item> items = ModelInst.GetItemListCache();
        OpenPopPage("目前資料筆數為:" + items.Count + "，打包后剩餘" + Math.Max(items.Count - 1000, 0) + "筆，確定打包嗎？", delegate ()
        {
            ClosePopPage();
            ModelInst.InvokeArchive(delegate (object obj, List<Item> newItems) {
                GetMainPage().RefreshList(true);
                GetDataPage().Close();
                //OpenPopPage("打包完畢，目前資料筆數為" + newItems.Count, delegate ()
                //{
                //    ClosePopPage();
                //}, delegate ()
                //{
                //    ClosePopPage();
                //});
            });
        }, delegate ()
        {
            ClosePopPage();
        });
    }

    public void OnDataPageDebugClick()
    {
        ModelInst.SetDebug(!ModelInst.IsDebug());
        //string text = ModelInst.IsDebug() ? "開啓除錯模式" : "關閉除錯模式";
        //OpenPopPage(text, delegate ()
        //{
        //    ClosePopPage();
        //}, delegate ()
        //{
        //    ClosePopPage();
        //});
    }
    
    public void OnDataPageConfirmClick()
    {
        bool isValid = ModelInst.IsValidID(GetDataPage().InputID);
        if (isValid)
        {
            OpenPopPage("確定要取回資料嗎?本地的資料會丟失哦!",
            delegate () {
                OpenLoadingPage("取回資料中，請稍等…");
                ModelInst.GetUserData(GetDataPage().InputID, delegate (bool success)
                {
                    if (success)
                    {
                        GetDataPage().Close();
                        GetPopPage().Close();
                        OpenMainPage();
                    }
                    CloseLoadingPage();
                });
            },
            delegate () {
                GetPopPage().Close();
            });
        }
        else
        {
            GetDataPage().ShowID = "內容有誤哦，請檢查！";
        }
    }

    public void OnDataPageCancelClick()
    {
        GetDataPage().Close();
    }

    public void OnDataPageInputChange()
    {
        GetDataPage().ShowClearID();
    }

    void OpenLoadingPage(string content)
    {
        GetLoadingPage().Open();
        GetLoadingPage().Content = content;
    }

    void CloseLoadingPage()
    {
        GetLoadingPage().Close();
    }

    public void OpenMainPage()
    {
        OpenTargetPage(EPage.Main);
    }

    public void OnMainPageBtnDataClick()
    {
        GetDataPage().Open();
    }

    public void OnMainPageSearchBackClick()
    {
        GetMainPage().IsSearch = false;
        GetMainPage().filterMemo = "";
        GetMainPage().RefreshList(true);
    }

    public void OnMainPageNoteClick()
    {
        OpenMemoPage(0);
    }

    //public void OnMainPageCountClick()
    //{
    //    GetMainPage().ChangeCountType();
    //}

    public void OnMainPageTypeClick()
    {
        GetMainPage().ChangeShowType();
    }

    public void OnMainPageCarClick()
    {
        OpenCalculatePage();
    }

    public void OnMainPageSearchClick()
    {
        OpenSearchPage();
    }

    public void OnMainPageNumberClick(int id)
    {
        GetMainPage().AddMoney(id);
    }

    public void OnMainPageFeatureClick(int id)
    {
        switch (id)
        {
            case 0:
                GetMainPage().ClearMoney();
                break;
            case 1:
                GetMainPage().BackMoney();
                break;
            case 2:
                GetMainPage().Buy();
                break;
            case 3:
                GetMainPage().Earn();
                break;
            case 4:
                GetMainPage().DoubleZero();
                break;
        }
    }

    public void OnMainPageItemMemoClick(int id)
    {
        OpenMemoPage(id);
    }

    public void OnMainPageItemEditClick(int id)
    {
        Item item = ModelInst.GetItemCacheById(id);
        OpenPopPage("是否確定修改" + item.Money + " => " + GetMainPage().CurrentMoney(),
            delegate ()
            {
                ModelInst.ChangeItemMoney(id, GetMainPage().CurrentMoney(), delegate (object error, List<Item> list)
                {
                    GetMainPage().RefreshList(false);
                    GetMainPage().ClearMoney();
                    ClosePopPage();
                });
            },
            delegate ()
            {
                ClosePopPage();
            });
    }

    public void OnMainPageItemEditTimeClick(int id)
    {
        Item item = ModelInst.GetItemCacheById(id);

        DateTime time = new System.DateTime(item.Time).ToLocalTime();
        string timestr = time.Year + "/" + time.Month + "/" + time.Day;
       
        int toYear = 0;
        int toMonth = 0;
        int toDay = 0;
        string currentTimeStr = GetMainPage().CurrentMoney().ToString();
        if (currentTimeStr.Length >= 6)
        {
            toYear = Int32.Parse("20" + currentTimeStr.Substring(0, 2));
            toMonth = Int32.Parse(currentTimeStr.Substring(2, 2));
            toDay = Int32.Parse(currentTimeStr.Substring(4, 2));
        }
        else
        {
            toYear = time.Year;
            toMonth = time.Month;
            toDay = time.Day;
        }
        string toTimeStr = toYear + "/" + toMonth + "/" + toDay;

        OpenPopPage("日期\n" + timestr + "\n => \n" + toTimeStr,
            delegate ()
            {
                try
                {
                    item.Time = Model.String2DateTime(toYear, toMonth, toDay);
                }
                catch (Exception e)
                {
                    // no change
                }
                ModelInst.ChangeItem(id, item, delegate (object error, List<Item> list)
                {
                    GetMainPage().RefreshList(false);
                    GetMainPage().ClearMoney();
                    ClosePopPage();
                });
            },
            delegate ()
            {
                ClosePopPage();
            });
    }

    public void OnMainPageItemDeleteClick(int id)
    {
        Item item = ModelInst.GetItemCacheById(id);
        OpenPopPage("是否確定刪除" + item.Money + "這個項目？",
            delegate ()
            {
                ModelInst.DeleteItem(id, delegate (object error, List<Item> list)
                {
                    GetMainPage().RefreshList(true);
                    ClosePopPage();
                });
            },
            delegate ()
            {
                ClosePopPage();
            });
    }

    public void OnMainPageIconClick()
    {
        GetMainPage().ToggleChartGraph();
    }

    public void OnMainPageOpenCompareGraphClick()
    {
        GetMainPage().OpenCompareChart();
    }

    public void OnMainPageSaveClick()
    {
        //先不要用，可能會出錯
        //ModelInst.ManuallySave();
    }

    public void OpenCalculatePage()
    {
        GetCalculatePage().Open();
    }

    public void OnCalculatePageConfirm()
    {
        object[] result = GetCalculatePage().GetCurrentResult();
        if((int)result[2] < 0)
        {
            OpenPopPage("還沒有輸入客人所付的金錢哦!",
                delegate ()
                {
                    ClosePopPage();
                },
                delegate ()
                {
                    ClosePopPage();
                });
            return;
        }
        OpenPopPage("確定結帳嗎？",
        delegate ()
        {
            
            ModelInst.AddEarn(Math.Abs((int)result[1]), result[3].ToString(), "", delegate (object error, List<Item> list)
            {
                CloseCalculatePage();
                ClosePopPage();

                GetMainPage().RefreshList(true);
            });
        },
        delegate ()
        {
            ClosePopPage();
        });
    }

    public void OnCalculatePageCancel()
    {
        CloseCalculatePage();
        ClosePopPage();
    }

    public void OnCalculatePageNumberClick(int id)
    {
        GetCalculatePage().AddMoney(id);
    }

    public void OnCalculateFeatureClick(int id)
    {
        switch (id)
        {
            case 0:
                GetCalculatePage().ClearMoney();
                break;
            case 1:
                GetCalculatePage().BackMoney();
                break;
            case 2:
                GetCalculatePage().GuestPay();
                break;
            case 3:
                GetCalculatePage().AddItem();
                break;
            case 4:
                GetCalculatePage().DoubleZero();
                break;
        }
    }

    public void OnMemoPageConfirm()
    {
        int id = GetMemoPage().Id;
        string content = GetMemoPage().GetContent();

        List<MemoItem> memos = ModelInst.GetMemoList();
        ModelInst.ChangeItemMemo(id, ModelInst.MemoListToString(memos), delegate (object error, List<Item> list)
        {
            GetMainPage().RefreshList(false);
            CloseMemoPage();
        });
    }

    public void OnMemoPageCancel()
    {
        CloseMemoPage();
    }

    public void OnMemoPageAddTagClick()
    {
        string memo = GetMemoPage().GetContent();
        if(memo != "")
        {
            GetMemoPage().AddTag();
        }
        
    }

    public void OnMemoPageEditTagClick()
    {
        string memo = GetMemoPage().GetContent();
        if (memo != "")
        {
            OpenPopPage("確定要修改為" + memo + "嗎?",
            delegate ()
            {
                GetMemoPage().EditTag();
                GetMainPage().RefreshList(true);
                ClosePopPage();
            },
            delegate ()
            {
                ClosePopPage();
            });
        }
        
    }

    public void OnMemoPageDeleteTagClick()
    {
        List<MemoItem> listMemo = ModelInst.GetMemoList();
        if(listMemo.Count > 0)
        {
            OpenPopPage("確定要刪除嗎?",
                delegate ()
                {
                    GetMemoPage().DeleteTag();
                    GetMainPage().RefreshList(true);
                    ClosePopPage();
                },
                delegate ()
                {
                    ClosePopPage();
                });
        }
    }

    public void OnSearchPageConfirm()
    {
        List<MemoItem> memos = ModelInst.GetMemoList();
        string searchString = ModelInst.MemoListToString(memos);
        GetMainPage().filterMemo = searchString;
        if (searchString != "")
        {
            GetMainPage().IsSearch = true;
            GetMainPage().RefreshList(true);
            GetMainPage().ItemListToTop();
        }
        CloseSearchPage();
    }
    
    public void OnSearchPageFilterChange()
    {
        GetSearchPage().FilterTag();
    }

    public void OnSearchPageCancel()
    {
        CloseSearchPage();
    }

    public void CloseCalculatePage()
    {
        GetCalculatePage().Close();
    }

    public void OpenMemoPage(int id)
    {
        GetMemoPage().Id = id;
        GetMemoPage().Open();
    }

    public void CloseMemoPage()
    {
        GetMemoPage().Close();
    }

    public void OpenSearchPage()
    {
        GetSearchPage().Open();
    }

    public void CloseSearchPage()
    {
        GetSearchPage().Close();
    }

    public void OpenPopPage(string content, UnityAction onConfirm, UnityAction onCancel)
    {
        PopPage popPage = GetPopPage();
        popPage.Open();
        popPage.SetContent(content);
        popPage.SetConfirm(onConfirm);
        popPage.SetCancel(onCancel);
    }

    public void ClosePopPage()
    {
        GetPopPage().Close();
    }

    LoadingPage GetLoadingPage()
    {
        return pages[(int)EPage.Loading].GetComponent<LoadingPage>();
    }

    DataPage GetDataPage()
    {
        return pages[(int)EPage.Data].GetComponent<DataPage>();
    }

    MainPage GetMainPage()
    {
        return pages[(int)EPage.Main].GetComponent<MainPage>();
    }

    CalculatePage GetCalculatePage()
    {
        return pages[(int)EPage.Calculate].GetComponent<CalculatePage>();
    }

    MemoPage GetMemoPage()
    {
        return pages[(int)EPage.Memo].GetComponent<MemoPage>();
    }

    SearchPage GetSearchPage()
    {
        return pages[(int)EPage.Search].GetComponent<SearchPage>();
    }

    public PopPage GetPopPage()
    {
        return pages[(int)EPage.Pop].GetComponent<PopPage>();
    }

    void InitPages()
    {
        Instance = this;
        if(model is IModel == false)
        {
            throw new Exception("xxxx");
        }
        ModelInst = (IModel)model;
        foreach (GameObject page in pages)
        {
            page.GetComponent<IPage>().Model = ModelInst;
            page.GetComponent<IPage>().View = this;
            page.GetComponent<IPage>().Init();
        }

        ModelInst.SetErrorAction(delegate (string error)
        {
            OpenPopPage(error,
                delegate () {
                    ClosePopPage();
                },
                delegate ()
                {
                    ClosePopPage();
                });
        });
        ModelInst.Load(delegate (bool success)
        {
            if (success)
            {
                OpenMainPage();
            }
        });
    }

    void Start () {
        
        InitPages();
	}

    int ErrorOccurType = 0;

    private void Update()
    {
        if (ErrorOccurType == 0)
        {
            bool isArchiving = ModelInst.IsArchiving();
            if (isArchiving)
            {
                GetMainPage().StateColor.color = Color.red;
                GetMainPage().State.text = "打包中...";
                GetDataPage().SetSaveEnable(false);
                //GetDataPage().SetArchiveEnable(false);
                GetLoadingPage().Open();
            }
            else
            {
                GetLoadingPage().Close();
                
                bool isDiskSave = ModelInst.IsDiskSaveDirty();
                bool isCloudSave = ModelInst.IsCloudSaveDirty();
                bool isPending = ModelInst.IsPendingDirty();
                var text = "pending";
                if (isPending)
                {
                    GetMainPage().StateColor.color = Color.red;
                    GetDataPage().SetSaveEnable(false);
                    //GetDataPage().SetArchiveEnable(false);
                    text = "等待儲存";
                }
                else
                {
                    GetMainPage().StateColor.color = Color.green;
                    SaveWorkerState state = ModelInst.GetSaveWorkerState();
                    switch (state)
                    {
                        case SaveWorkerState.Saved:
                            text = "儲存完畢";
                            GetDataPage().SetSaveEnable(true);
                            //GetDataPage().SetArchiveEnable(true);
                            break;
                        case SaveWorkerState.Starting:
                            text = "初使化";
                            GetDataPage().SetSaveEnable(false);
                            //GetDataPage().SetArchiveEnable(false);
                            break;
                        case SaveWorkerState.Checking:
                            text = "小跟班";
                            GetDataPage().SetSaveEnable(true);
                            //GetDataPage().SetArchiveEnable(true);
                            break;
                        case SaveWorkerState.Pending:
                            GetDataPage().SetSaveEnable(false);
                            //GetDataPage().SetArchiveEnable(false);
                            text = "等待中";
                            break;
                        case SaveWorkerState.Saving:
                            text = "儲存中";
                            GetMainPage().StateColor.color = Color.yellow;
                            GetDataPage().SetSaveEnable(false);
                            //GetDataPage().SetArchiveEnable(false);
                            break;
                        default:
                            break;
                    }
                }
                text = text + (isDiskSave == false ? "O" : "X") + (isCloudSave == false ? "O" : "X");
                GetMainPage().State.text = text;
            }
            
        }
        else
        {
            GetDataPage().SetSaveEnable(false);
            //GetDataPage().SetArchiveEnable(false);
            OpenPopPage("儲存失敗，請洽工程師。不再顯示儲存狀態",
            delegate ()
            {
                ClosePopPage();
            },
            delegate ()
            {
                ClosePopPage();
            });
        }
    }
}
