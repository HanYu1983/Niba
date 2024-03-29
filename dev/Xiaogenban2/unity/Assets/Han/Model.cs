﻿using System.Collections;
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
        Log("Start");
        SetPersistentDataPath(Application.persistentDataPath);
        StartCoroutine(SaveWorker());
    }

    void OnApplicationQuit()
    {
        Log("OnApplicationQuit");
        CloseSaveWorker();
    }

    void OnAddEarn(Earn earn)
    {
        Log("OnAddEarn");
        ClearCar();
        OnDataChange();
    }

    void OnDeleteEarn()
    {
        Log("OnDeleteEarn");
        OnDataChange();
    }

    void OnAddMemo()
    {
        Log("OnAddMemo");
        OnDataChange();
    }

    void OnDataChange()
    {
        Log("OnDataChange");
        RequestSave(GetLastInputEarn().id);
    }

    void OnEarnMoneyChange()
    {
        Log("OnEarnMoneyChange");
        OnDataChange();
    }

    void OnEarnMemoChange(string memo)
    {
        Log("OnEarnMemoChange");
        UpdateMemoLastUTC(memo);
        OnDataChange();
    }

    void OnDeleteMemo(List<string> selectedMomoList)
    {
        Log("OnDeleteMemo");
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
        Log("OnEditMemo");
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
        Log("OnEarnChange");
        OnDataChange();
    }

    #region save worker

    public void ManuallySave()
    {
        RequestSave(0);
    }

    private readonly List<int> isDirty = new List<int>();
    private bool saveWorkDone;
    public bool IsPendingDirty()
    {
        return isDirty.Count > 0;
    }

    private void RequestSave(int triggerId)
    {
        isDirty.Add(triggerId);
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
        Log("SaveDisk Start");
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
        Log("SaveDisk End");
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
            if (isDirty.Count == 0)
            {
                continue;
            }
            saveState = SaveWorkerState.Saving;
            // save only triggerId
            var tempTriggerId = isDirty[0];
            isDirty.RemoveAt(0);
            var tempMemonto = GetMemonto(tempTriggerId);
            yield return SaveDisk(tempMemonto);
            yield return InvokeSaveToCloud(tempTriggerId);
            saveState = SaveWorkerState.Saved;
        }
        saveState = SaveWorkerState.Checking;
        if (isDirty.Count == 0)
        {
            yield break;
        }
        saveState = SaveWorkerState.Saving;
        // save all (triggerId 0)
        isDirty.Clear();
        var triggerId = 0;
        var temp = GetMemonto(triggerId);
        yield return SaveDisk(temp);
        yield return InvokeSaveToCloud(0);
        saveState = SaveWorkerState.Saved;
    }
    #endregion



    #region earn
    private readonly Dictionary<int, Earn> earns = new Dictionary<int, Earn>();
    private int seqId = 0;
    private Earn lastInputEarn;

    public Earn GetLastInputEarn()
    {
        return lastInputEarn;
    }

    public int NextSeqId()
    {
        return seqId++;
    }

    public int GetSeqId()
    {
        return seqId;
    }

    public void SetSeqId(int id)
    {
        seqId = id;
    }

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
            if (IsArchiving())
            {
                throw new Exception("打包中請勿操作");
            }
            var earn = Earn.empty;
            earn.id = NextSeqId();
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
            if (IsArchiving())
            {
                throw new Exception("打包中請勿操作");
            }
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
            if (IsArchiving())
            {
                throw new Exception("打包中請勿操作");
            }
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
            if (IsArchiving())
            {
                throw new Exception("打包中請勿操作");
            }
            if (earns.ContainsKey(id) == false)
            {
                throw new Exception(id + " not found");
            }
            var earn = earns[id];
            earn.money = money;
            earns[id] = earn;
            lastInputEarn = earn;
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
            if (IsArchiving())
            {
                throw new Exception("打包中請勿操作");
            }
            if (earns.ContainsKey(id) == false)
            {
                throw new Exception(id + " not found. can not delete");
            }
            lastInputEarn = earns[id];
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
            var id = NextSeqId();
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
                    Log(string.Format("{0} not found.", m));
                    continue;
                }
                if (memoItems[m].isSelect)
                {
                    Log(string.Format("{0} already selected.", m));
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
                    Log(string.Format("{0} not found.", m));
                    continue;
                }
                if (memoItems[m].isSelect == false)
                {
                    Log(string.Format("{0} already unselected.", m));
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
            if (IsArchiving())
            {
                throw new Exception("打包中請勿操作");
            }
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
            if (IsArchiving())
            {
                throw new Exception("打包中請勿操作");
            }
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
            if (IsArchiving())
            {
                throw new Exception("打包中請勿操作");
            }
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
    private string persistentDataPath;

    private void SetPersistentDataPath(string path)
    {
        persistentDataPath = path;
    }

    private void SetMemonto(Memonto temp)
    {
        SetSeqId(temp.seqId);
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

    private static int CompareEarnByID(Earn x, Earn y)
    {
        return x.id.CompareTo(y.id);
    }

    public Memonto GetMemonto(int triggerId)
    {
        var temp = new Memonto();
        temp.triggerId = triggerId;
        temp.seqId = GetSeqId();
        temp.earns = new List<Earn>(earns.Values);
        temp.earns.Sort(CompareEarnByID);
        temp.memo = new List<string>(memoItems.Values.Select(d => d.Memo));
        return temp;
    }

    private void Save(Memonto temp)
    {
        // save earns
        var bucketSize = Config.BucketSize;
        var triggerBucketId = temp.triggerId / bucketSize;
        for (var bucketId = 0; bucketId * bucketSize < temp.seqId; bucketId++)
        {
            if (triggerBucketId > 0 && triggerBucketId != bucketId)
            {
                continue;
            }
            var bucketEarns = temp.earns.Where(e =>
            {
                var earnBucketId = e.id / bucketSize;
                return earnBucketId == bucketId;
            });
            var earnsMemonto = new Memonto();
            earnsMemonto.earns = bucketEarns.ToList();
            var earnsJson = JsonUtility.ToJson(earnsMemonto, true);
            var earnsFilePath = $"{persistentDataPath}/earns{bucketId}.json";
            Log(string.Format("save to {0}", earnsFilePath));
            File.WriteAllText(earnsFilePath, earnsJson);
        }
        // save other
        temp.earns.Clear();
        var otherJson = JsonUtility.ToJson(temp, true);
        var otherFilePath = $"{persistentDataPath}/other.json";
        Log(string.Format("save to {0}", otherFilePath));
        File.WriteAllText(otherFilePath, otherJson);
    }

    private void Load()
    {
        // load others
        var filePath = $"{persistentDataPath}/other.json";
        Log(string.Format("load from {0}", filePath));
        if (File.Exists(filePath) == false)
        {
            // no need alert
            Log(string.Format("{0} not found", filePath));
            return;
        }
        var memontoJson = File.ReadAllText(filePath);
        var memonto = JsonUtility.FromJson<Memonto>(memontoJson);
        // load earns
        var info = new DirectoryInfo(persistentDataPath);
        foreach (var file in info.GetFiles())
        {
            Log($"Detect File: {file.Name}");
            if (file.Name.StartsWith("earns"))
            {
                Log($"Load Earns: {file.Name}");
                var earnsFilePath = $"{persistentDataPath}/{file.Name}";
                var earnsJson = File.ReadAllText(earnsFilePath);
                var earnsMemonto = JsonUtility.FromJson<Memonto>(earnsJson);
                memonto.earns.AddRange(earnsMemonto.earns);
            }
        }
        SetMemonto(memonto);
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
    private IEnumerator InvokeSaveToCloud(int triggerId)
    {
        Log("InvokeSaveToCloud Start");
        if (isCloudSaveLock)
        {
            InvokeErrorAction(new Exception("isCloudSaveLock"));
            yield break;
        }
        isCloudSaveLock = true;

        isCloudSaveDirty = true;
        yield return cloudSave.SaveToCloud(triggerId);
        try
        {
            cloudSave.CheckError();
            isCloudSaveDirty = false;
        }
        catch (Exception e)
        {
            // 離線使用時不跳alert
            // InvokeErrorAction(e);
            // 前端必須要顯示isCloudSaveDirty狀態來讓使用者判斷有沒有成功同步網路資料
            Log(e.Message);
        }
        isCloudSaveLock = false;
        Log("InvokeSaveToCloud End");
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
            ManuallySave();
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
        Log(e.StackTrace);
        Log(e.Message);
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
            Log(e.Message);
            InvokeErrorAction(e);
            callback(false);
        }
    }

    #endregion


    #region debug
    private bool isDebug = false;
    private List<string> msgs = new List<string>();
    public void SetDebug(bool v)
    {
        isDebug = v;
    }
    public bool IsDebug()
    {
        return isDebug;
    }
    void Log(string t)
    {
        Debug.Log(t);
        msgs.Insert(0, string.Format("[{0}] {1}", DateTime.Now.ToLocalTime(), t));
        while (msgs.Count > 50)
        {
            msgs.RemoveAt(msgs.Count - 1);
        }
        stringToEdit = string.Join("\n", msgs);
    }
    private string stringToEdit = "";
    // private Vector2 scrollPosition = Vector2.zero;
    private void OnGUI()
    {
        //if (GUI.Button(new Rect(0, 0, 100, 20), "log"))
        //{
        //    SetDebug(!IsDebug());
        //}
        if (IsDebug())
        {
            //if (GUI.Button(new Rect(0, 20, 100, 20), "archive"))
            //{
            //    InvokeArchive(delegate (object error, List<Item> list) { });
            //}
            //scrollPosition = GUI.BeginScrollView(new Rect(0, 20, 400, 800), scrollPosition, new Rect(0, 0, 400, 800));
            stringToEdit = GUI.TextArea(new Rect(0, 40, 400, 800), stringToEdit);
            //GUI.EndScrollView();
        }
    }
    #endregion


    #region archive

    private static int CompareEarnByTime(Earn x, Earn y)
    {
        return x.createUTC.CompareTo(y.createUTC);
    }

    private bool isArchiving = false;
    public bool IsArchiving()
    {
        return isArchiving;
    }
    public void InvokeArchive(UnityAction<object, List<Item>> callback)
    {
        if (GetSaveWorkerState() != SaveWorkerState.Checking)
        {
            InvokeErrorAction(new Exception("平常狀態下才能打包"));
            callback(null, GetItemListCache());
            return;
        }
        StartCoroutine(Archive(1000, callback));
    }

    IEnumerator Archive(int count, UnityAction<object, List<Item>> callback)
    {
        if (isArchiving)
        {
            InvokeErrorAction(new Exception("archiving"));
            callback(null, GetItemListCache());
            yield break;
        }
        Log(string.Format("Archive Start"));
        isArchiving = true;
        var memonto = GetMemonto(0);
        // add seqId for version control
        memonto.seqId++;
        var s = 0;
        var e = Math.Min(count, memonto.earns.Count);
        memonto.earns.Sort(CompareEarnByTime);
        var removedEarns = memonto.earns.GetRange(s, e);
        if (removedEarns.Count == 0)
        {
            InvokeErrorAction(new Exception("no need archive"));
            isArchiving = false;
            callback(null, GetItemListCache());
            yield break;
        }
        // archive
        var archiveMemonto = memonto.SimpleCopy();
        archiveMemonto.earns = removedEarns;
        // save
        var archiveString = JsonUtility.ToJson(archiveMemonto, true);
        var archivePath = cloudSave.GetPath(cloudSave.GetId(), archiveMemonto.seqId + "");
        Debug.Log("Archive:" + archivePath);
        yield return cloudSave.SaveToCloud(archivePath, archiveString);
        if (cloudSave.GetError() != null)
        {
            InvokeErrorAction(cloudSave.GetError());
            isArchiving = false;
            callback(null, GetItemListCache());
            yield break;
        }
        // if no error, apply
        memonto.earns.RemoveRange(s, e);
        // set memonto with new version
        SetMemonto(memonto);
        RequestSave(0);
        isArchiving = false;
        callback(null, GenItemList());
        Log(string.Format("Archive End"));
    }

    #endregion
}
