using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;
using System.Linq;
using System;
using System.IO;
using System.Threading;

public class Model : MonoBehaviour, IModel
{

    void Start()
    {
        SetPersistentDataPath(Application.persistentDataPath);
        StartCoroutine(SaveWorker());
    }

    void OnApplicationQuit()
    {
        Debug.Log("OnApplicationQuit");
        CloseSaveWorker();
    }

    void OnAddEarn(Earn earn)
    {
        ClearCar();
        OnDataChange();
    }

    void OnDeleteEarn()
    {
        OnDataChange();
    }

    void OnAddMemo()
    {
        OnDataChange();
    }

    void OnDataChange()
    {
        RequestSave(GetMemonto());
    }

    void OnEarnMoneyChange()
    {
        OnDataChange();
    }

    void OnEarnMemoChange(string memo)
    {
        UpdateMemoLastUTC(memo);
        OnDataChange();
    }

    void OnDeleteMemo(List<string> selectedMomoList)
    {
        foreach (var deleteMemo in selectedMomoList)
        {
            var selectedEarns = GetEarns().Values.Where(d =>
            {
                if (d.memo == null)
                {
                    return false;
                }
                return d.memo.Contains(deleteMemo);
            }).ToList();

            foreach (var earn in selectedEarns)
            {
                var willDelete = StringToMemoList(earn.memo).Select(d => d.Memo).Where(d => d == deleteMemo).ToList();
                if (willDelete.Count == 0)
                {
                    continue;
                }
                var newMemos = StringToMemoList(earn.memo).Where(d => d.Memo != deleteMemo);
                // MemoListToString 只會選擇isSelect為真的. 所以先設為真
                var memoStr = MemoListToString(newMemos.Select(d => new MemoItem(d.Memo, true)).ToList());
                ChangeItemMemo(earn.id, memoStr, (err, items) => { });
            }
        }
        OnDataChange();
    }

    void OnEditMemo(List<string> selectedMomoList, string memo)
    {
        foreach (var deleteMemo in selectedMomoList)
        {
            var selectedEarns = GetEarns().Values.Where(d =>
            {
                if (d.memo == null)
                {
                    return false;
                }
                return d.memo.Contains(deleteMemo);
            }).ToList();

            foreach (var earn in selectedEarns)
            {
                var willDelete = StringToMemoList(earn.memo).Select(d => d.Memo).Where(d => d == deleteMemo).ToList();
                if (willDelete.Count == 0)
                {
                    continue;
                }
                var newMemos = StringToMemoList(earn.memo).Select(d => d.Memo).Where(d => d != deleteMemo).ToList();
                newMemos.Add(memo);
                // 去掉重復的
                newMemos = newMemos.Distinct().ToList();

                // MemoListToString 只會選擇isSelect為真的. 所以先設為真
                var memoStr = MemoListToString(newMemos.Select(d => new MemoItem(d, true)).ToList());
                ChangeItemMemo(earn.id, memoStr, (err, items) => { });
            }
        }
        OnDataChange();
    }

    void OnEarnChange(Earn earn)
    {
        OnDataChange();
    }

    #region save worker

    public void ManuallySave()
    {
        RequestSave(GetMemonto());
    }

    private Memonto isDirty;
    private bool saveWorkDone;
    public bool IsPendingDirty()
    {
        return isDirty != null;
    }

    private void RequestSave(Memonto memonto)
    {
        isDirty = memonto;
    }

    private void CloseSaveWorker()
    {
        saveWorkDone = true;
    }

    private bool isDiskSaveDirty = false;

    public bool IsDiskSaveDirty()
    {
        return isDiskSaveDirty;
    }

    private IEnumerator SaveDisk(Memonto memonto)
    {
        yield return null;
        var isDone = false;
        Exception err = null;
        isDiskSaveDirty = true;
        var saveWroker = new Thread(() =>
        {
            try
            {
                Save(memonto);
            }
            catch (Exception e)
            {
                err = e;
            }
            finally
            {
                isDone = true;
            }
        });
        saveWroker.Start();
        yield return new WaitUntil(() => isDone);
        if (err != null)
        {
            InvokeErrorAction(err);
            err = null;
        }
        else
        {
            isDiskSaveDirty = false;
        }
    }

    private SaveWorkerState saveState;
    public SaveWorkerState GetSaveWorkerState()
    {
        return saveState;
    }

    private IEnumerator SaveWorker()
    {
        saveState = SaveWorkerState.Starting;
        yield return null;
        while (saveWorkDone == false)
        {
            saveState = SaveWorkerState.Checking;
            yield return new WaitForSeconds(1);
            if (isDirty == null)
            {
                continue;
            }
            saveState = SaveWorkerState.Saving;
            var temp = isDirty;
            isDirty = null;
            yield return SaveDisk(temp);
            yield return InvokeSaveToCloud();
            saveState = SaveWorkerState.Saved;
        }
        saveState = SaveWorkerState.Checking;
        if (isDirty == null)
        {
            yield break;
        }
        saveState = SaveWorkerState.Saving;
        yield return SaveDisk(isDirty);
        yield return InvokeSaveToCloud();
        saveState = SaveWorkerState.Saved;
    }
    #endregion



    #region earn
    public Dictionary<int, Earn> earns = new Dictionary<int, Earn>();
    private int seqId = 0;
    private Earn lastInputEarn;

    public static Item Earn2Item(Earn earn)
    {
        return new Item(earn.id, earn.money, earn.memo, earn.createUTC);
    }

    private Dictionary<int, Earn> GetEarns()
    {
        return earns;
    }

    public void AddEarn(int money, string memo, string time, UnityAction<object, List<Item>> callback)
    {
        try
        {
            var earn = Earn.empty;
            earn.id = seqId++;
            earn.money = money;
            if (memo == null)
            {
                // 不使用最後一個memo
                // earn.memo = lastInputEarn.memo;
                if (earn.memo == null)
                {
                    earn.memo = "";
                }
            }
            else
            {
                earn.memo = memo;
            }
            earn.createUTC = System.DateTime.UtcNow.Ticks;
            earns[earn.id] = earn;

            lastInputEarn = earn;

            callback(null, GenItemList());
            OnAddEarn(earn);
        }
        catch (Exception e)
        {
            InvokeErrorAction(e);
        }
    }

    public static long String2DateTime(int year, int month, int day)
    {
        DateTime d = new DateTime(year, month, day);
        return d.Ticks;
    }

    public void ChangeItem(int id, Item item, UnityAction<object, List<Item>> callback)
    {
        try
        {
            if (earns.ContainsKey(id) == false)
            {
                throw new Exception(id + " not found");
            }
            var earn = earns[id];
            earn.memo = item.Memo;
            earn.money = item.Money;
            earn.createUTC = item.Time;

            earns[id] = earn;
            lastInputEarn = earn;
            callback(null, GenItemList());
            OnEarnChange(earn);
        }
        catch (Exception e)
        {
            InvokeErrorAction(e);
        }
    }

    public void ChangeItemMemo(int id, string memo, UnityAction<object, List<Item>> callback)
    {
        try
        {
            if (earns.ContainsKey(id) == false)
            {
                throw new Exception(id + " not found");
            }
            var earn = earns[id];
            earn.memo = memo;
            earns[id] = earn;
            lastInputEarn = earn;
            callback(null, GenItemList());
            OnEarnMemoChange(memo);
        }
        catch (Exception e)
        {
            InvokeErrorAction(e);
        }
    }

    public void ChangeItemMoney(int id, int money, UnityAction<object, List<Item>> callback)
    {
        try
        {
            if (earns.ContainsKey(id) == false)
            {
                throw new Exception(id + " not found");
            }
            var earn = earns[id];
            earn.money = money;
            earns[id] = earn;
            callback(null, GenItemList());
            OnEarnMoneyChange();
        }
        catch (Exception e)
        {
            InvokeErrorAction(e);
        }
    }

    public void DeleteItem(int id, UnityAction<object, List<Item>> callback)
    {
        try
        {
            if (earns.ContainsKey(id) == false)
            {
                throw new Exception(id + " not found. can not delete");
            }
            earns.Remove(id);
            callback(null, GenItemList());
            OnDeleteEarn();
        }
        catch (Exception e)
        {
            InvokeErrorAction(e);
        }
    }

    public Item GetItemCacheById(int id)
    {
        try
        {
            return _GetItemCacheById(id);
        }
        catch (Exception e)
        {
            InvokeErrorAction(e);
        }
        return new Item(0, 0, "", 0);
    }

    public static Func<Earn, bool> MemoContains(string memo)
    {
        if (memo == null)
        {
            return (Earn earn) => true;
        }
        var tags = memo.Split(SplitTag);
        return (Earn earn) =>
        {
            if (string.IsNullOrEmpty(memo))
            {
                if (earn.memo == null)
                {
                    return true;
                }
            }
            return tags.Select(tag => earn.memo.Contains(tag)).Aggregate((acc, c) => acc || c);
        };
    }

    private int tempSeqId = 0;

    public void GetItemList(int count, int timeType, string memo, UnityAction<object, List<Item>> callback)
    {
        switch (timeType)
        {
            case ETimeType.ITEM:
                {
                    callback(
                        null,
                        SetItemListCache(earns.Values
                            .Where(MemoContains(memo))
                            .OrderByDescending(earn => earn.createUTC)
                            .Take(count)
                            .Select(Earn2Item).ToList())
                    );
                    return;
                }
            case ETimeType.DAY:
                {
                    tempSeqId = 0;
                    callback(
                        null,
                        SetItemListCache(earns.Values
                            .Where(MemoContains(memo))
                            .GroupBy(earn =>
                            {
                                var d = new DateTime(earn.createUTC).ToLocalTime();
                                return Tuple.Create(d.Year, d.Month, d.Day);
                            })
                            .Select(o =>
                            {
                                var year = o.Key.Item1;
                                var month = o.Key.Item2;
                                var day = o.Key.Item3;

                                var earn = Earn.empty;
                                earn.id = tempSeqId++;
                                earn.createUTC = new DateTime(year, month, day).ToUniversalTime().Ticks;
                                earn.money = o.Sum(e => e.money);
                                //earn.memo = new DateTime(year, month, day).ToUniversalTime().ToString("yyyy/MM/dd");
                                earn.memo = year + "年" + month + "月" + day + "日";
                                return earn;
                            })
                            .OrderByDescending(earn => earn.createUTC)
                            .Take(count)
                            .Select(Earn2Item).ToList())
                    );
                    return;
                }
            case ETimeType.MONTH:
                {
                    tempSeqId = 0;
                    callback(
                        null,
                        SetItemListCache(earns.Values
                            .Where(MemoContains(memo))
                            .GroupBy(earn =>
                            {
                                var d = new DateTime(earn.createUTC).ToLocalTime();
                                return Tuple.Create(d.Year, d.Month);
                            })
                            .Select(o =>
                            {
                                var year = o.Key.Item1;
                                var month = o.Key.Item2;

                                var earn = Earn.empty;
                                earn.id = tempSeqId++;
                                earn.createUTC = new DateTime(year, month, 1).ToUniversalTime().Ticks;
                                earn.money = o.Sum(e => e.money);
                                //earn.memo = new DateTime(year, month, 1).ToUniversalTime().ToString("yyyy/MM");
                                earn.memo = year + "年" + month + "月";
                                return earn;
                            })
                            .OrderByDescending(earn => earn.createUTC)
                            .Take(count)
                            .Select(Earn2Item).ToList())
                    );
                    return;
                }
            case ETimeType.YEAR:
                {
                    tempSeqId = 0;
                    callback(
                        null,
                        SetItemListCache(earns.Values
                            .Where(MemoContains(memo))
                            .GroupBy(earn =>
                            {
                                var d = new DateTime(earn.createUTC).ToLocalTime();
                                return Tuple.Create(d.Year);
                            })
                            .Select(o =>
                            {
                                var year = o.Key.Item1;

                                var earn = Earn.empty;
                                earn.id = tempSeqId++;
                                earn.createUTC = new DateTime(year, 1, 1).ToUniversalTime().Ticks;
                                earn.money = o.Sum(e => e.money);
                                //earn.memo = new DateTime(year, 1, 1).ToUniversalTime().ToString("yyyy");
                                earn.memo = year + "年";
                                return earn;
                            })
                            .OrderByDescending(earn => earn.createUTC)
                            .Take(count)
                            .Select(Earn2Item).ToList())
                    );
                    return;
                }
            default:
                {
                    callback(new Exception("not implement yet"), null);
                }
                break;
        }
    }

    private List<Item> itemListCache;
    private Dictionary<int, Item> itemMapCache = new Dictionary<int, Item>();

    private List<Item> SetItemListCache(List<Item> list)
    {
        itemListCache = list;

        itemMapCache.Clear();
        foreach (var item in itemListCache)
        {
            itemMapCache.Add(item.Id, item);
        }
        return list;
    }

    private List<Item> GenItemList()
    {
        itemListCache = earns.Values.OrderByDescending(d => d.createUTC).Select(Earn2Item).ToList();

        itemMapCache.Clear();
        foreach (var item in itemListCache)
        {
            itemMapCache.Add(item.Id, item);
        }
        return itemListCache;
    }

    public List<Item> GetItemListCache()
    {
        if (itemListCache == null)
        {
            return GenItemList();
        }
        return itemListCache;
    }

    private Item _GetItemCacheById(int id)
    {
        if (itemMapCache.ContainsKey(id) == false)
        {
            throw new Exception(id + " not found");
        }
        return itemMapCache[id];
    }
    #endregion

    #region car
    private Dictionary<int, Item> car = new Dictionary<int, Item>();

    public void ClearCar()
    {
        car.Clear();
    }

    public void AddItemToCar(int money, string memo, string time, UnityAction<object, List<Item>> callback)
    {
        try
        {
            var id = seqId++;
            car[id] = new Item(id, money, memo, 0);
            callback(null, GetCarItemListCache());
        }
        catch (Exception e)
        {
            InvokeErrorAction(e);
        }
    }

    public void DeleteItemFromCar(int id, UnityAction<object, List<Item>> callback)
    {
        try
        {
            if (car.ContainsKey(id) == false)
            {
                throw new Exception(id + " not found. can not delete");
            }
            car.Remove(id);
            callback(null, GetCarItemListCache());
        }
        catch (Exception e)
        {
            InvokeErrorAction(e);
        }
    }

    public List<Item> GetCarItemListCache()
    {
        var ret = car.Values.ToList();
        ret.Reverse();
        return ret;
    }
    #endregion

    #region memo
    private Dictionary<string, MemoItem> memoItems = new Dictionary<string, MemoItem>();
    private static char[] SplitTag = new char[] { ';' };
    private string memoFilter;

    public void SetFilterMemo(string filter)
    {
        memoFilter = filter;
    }

    public List<MemoItem> GetMemoList()
    {
        if (string.IsNullOrEmpty(memoFilter))
        {
            return memoItems.Values
                //.OrderByDescending(d => d.LastSelectUTC)
                .OrderBy(d => d.Memo)
                .ToList();
        }
        return memoItems.Values
            .Where(d => d.Memo != null && d.Memo.Contains(memoFilter))
            //.OrderByDescending(d => d.LastSelectUTC)
            .OrderBy(d => d.Memo)
            .ToList();
    }

    public void ClearSelectMemo()
    {
        try
        {
            foreach (var m in memoItems.Values)
            {
                m.isSelect = false;
            }
        }
        catch (Exception e)
        {
            InvokeErrorAction(e);
        }
    }

    public List<MemoItem> SelectMemo(string memo)
    {
        try
        {
            var datas = memo.Split(SplitTag);
            foreach (string m in datas)
            {
                if (memoItems.ContainsKey(m) == false)
                {
                    Debug.LogFormat("{0} not found.", m);
                    continue;
                }
                if (memoItems[m].isSelect)
                {
                    Debug.LogFormat("{0} already selected.", m);
                    continue;
                }
                memoItems[m].isSelect = true;
            }
        }
        catch (Exception e)
        {
            InvokeErrorAction(e);
        }
        return GetMemoList();
    }

    public List<MemoItem> UnSelectMemo(string memo)
    {
        try
        {
            var datas = memo.Split(SplitTag);
            foreach (string m in datas)
            {
                if (memoItems.ContainsKey(m) == false)
                {
                    Debug.LogFormat("{0} not found.", m);
                    continue;
                }
                if (memoItems[m].isSelect == false)
                {
                    Debug.LogFormat("{0} already unselected.", m);
                    continue;
                }
                memoItems[m].isSelect = false;
            }
        }
        catch (Exception e)
        {
            InvokeErrorAction(e);
        }
        return GetMemoList();
    }


    public List<MemoItem> AddMemo(string memo)
    {
        try
        {
            var memos = StringToMemoList(memo);
            foreach (var m in memos)
            {
                if (memoItems.ContainsKey(memo))
                {
                    continue;
                }
                memoItems.Add(m.Memo, m);
            }
            OnAddMemo();
        }
        catch (Exception e)
        {
            InvokeErrorAction(e);
        }
        return GetMemoList();
    }

    public string MemoListToString(List<MemoItem> list)
    {
        return string.Join(";", list.Where(d => d.isSelect).Select(d => d.Memo).ToArray());
    }

    private List<MemoItem> StringToMemoList(string memo)
    {
        var datas = memo.Split(SplitTag);
        var memos = datas.Distinct().Select(d =>
        {
            return new MemoItem(d.Trim(), false);
        }).Where(m =>
        {
            return string.IsNullOrEmpty(m.Memo) == false;
        });
        return memos.ToList();
    }

    private List<string> GetSelectedMemoListKeys()
    {
        return memoItems.Values.Where(d => d.isSelect).Select(d => d.Memo).ToList();
    }

    public List<MemoItem> DeleteMemo()
    {
        try
        {
            var selectedMemoList = GetSelectedMemoListKeys();
            foreach (var selected in selectedMemoList)
            {
                memoItems.Remove(selected);
            }
            OnDeleteMemo(selectedMemoList);
        }
        catch (Exception e)
        {
            InvokeErrorAction(e);
        }
        return GetMemoList();
    }

    public List<MemoItem> EditMemo(string memo, bool removeOld)
    {
        try
        {
            if (memo.Split(SplitTag).Length > 1)
            {
                throw new Exception(memo + " should not have " + SplitTag);
            }
            var selectedMemoList = GetSelectedMemoListKeys();
            if (removeOld)
            {
                foreach (var selected in selectedMemoList)
                {
                    memoItems.Remove(selected);
                }
            }
            memoItems.Add(memo, new MemoItem(memo, false));
            OnEditMemo(selectedMemoList, memo);
        }
        catch (Exception e)
        {
            InvokeErrorAction(e);
        }
        return GetMemoList();
    }

    private void UpdateMemoLastUTC(string memo)
    {
        var datas = memo.Split(SplitTag);
        foreach (var d in datas)
        {
            if (memoItems.ContainsKey(d) == false)
            {
                continue;
            }
            memoItems[d].LastSelectUTC = System.DateTime.UtcNow.Ticks;
        }
    }

    #endregion


    #region save
    public string fileName = "save.json";
    private string persistentDataPath;

    private void SetPersistentDataPath(string path)
    {
        persistentDataPath = path;
    }

    private void SetMemonto(Memonto temp)
    {
        seqId = temp.seqId;
        earns.Clear();
        foreach (var earn in temp.earns)
        {
            earns.Add(earn.id, earn);
        }
        memoItems.Clear();
        foreach (var m in temp.memo)
        {
            memoItems.Add(m, new MemoItem(m, false));
        }
    }

    public Memonto GetMemonto()
    {
        var temp = new Memonto();
        temp.seqId = this.seqId;
        temp.earns = new List<Earn>(earns.Values);
        temp.memo = new List<string>(memoItems.Values.Select(d => d.Memo));
        return temp;
    }

    private void Save(Memonto temp)
    {
        string json = JsonUtility.ToJson(temp, true);
        var filePath = persistentDataPath + "/" + fileName;
        Debug.LogFormat("save to {0}", filePath);
        File.WriteAllText(filePath, json);
    }

    private void Load()
    {
        var filePath = persistentDataPath + "/" + fileName;
        Debug.LogFormat("load from {0}", filePath);
        if (File.Exists(filePath) == false)
        {
            Debug.LogFormat("{0} not found", filePath);
            return;
        }
        string json = File.ReadAllText(filePath);
        var temp = JsonUtility.FromJson<Memonto>(json);
        SetMemonto(temp);
    }
    #endregion

    #region cloud save
    public CloudSave cloudSave;
    private string lastInputCloudId;
    private bool isCloudSaveDirty = false;

    public bool IsCloudSaveDirty()
    {
        return isCloudSaveDirty;
    }

    private bool isCloudSaveLock = false;
    // 注意, 這個方法不能在執行完畢前同時呼叫多次
    private IEnumerator InvokeSaveToCloud()
    {
        if (isCloudSaveLock)
        {
            InvokeErrorAction(new Exception("isCloudSaveLock"));
            yield break;
        }
        isCloudSaveLock = true;

        isCloudSaveDirty = true;
        yield return cloudSave.SaveToCloud();
        try
        {
            cloudSave.CheckError();
            isCloudSaveDirty = false;
        }
        catch (Exception e)
        {
            // 離線使用不中斷程式
            // 前端必須要顯示isCloudSaveDirty狀態來讓使用者判斷有沒有成功同步網路資料
            Debug.Log(e.Message);
            InvokeErrorAction(e);
        }
        isCloudSaveLock = false;
    }

    public string GetUserID()
    {
        return GetShowID(cloudSave.GetId());
    }

    public string GetShowID(string id)
    {
        var buf = new List<string>();
        for (var i = 0; i < id.Length; i += 4)
        {
            buf.Add(id.Substring(i, Math.Min(id.Length, i + 4) - i));
        }
        return string.Join("-", buf);
    }

    public void GetUserData(string id, UnityAction<bool> callback)
    {
        StartCoroutine(LoadFromCloud(callback));
    }

    private IEnumerator LoadFromCloud(UnityAction<bool> callback)
    {
        yield return cloudSave.LoadFromCloud(lastInputCloudId);
        try
        {
            var memonto = cloudSave.GetModelMemonto();
            SetMemonto(memonto);
            Save(memonto);
            callback(true);
        }
        catch (Exception e)
        {
            InvokeErrorAction(e);
            callback(false);
        }

    }

    public bool IsValidID(string id)
    {
        if (id == "0000")
        {
            lastInputCloudId = id;
            return true;
        }
        lastInputCloudId = id;
        return true;
    }

    private UnityAction<string> errorAction;

    public void InvokeErrorAction(Exception e)
    {
        Debug.Log(e.StackTrace);
        Debug.Log(e.Message);
        if (errorAction != null)
        {
            errorAction(e.Message);
        }
    }

    public void SetErrorAction(UnityAction<string> callback)
    {
        errorAction = callback;
    }

    public void Load(UnityAction<bool> callback)
    {
        try
        {
            Load();
            callback(true);
        }
        catch (Exception e)
        {
            Debug.Log(e.Message);
            InvokeErrorAction(e);
            callback(false);
        }
    }

    #endregion
}
