using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;
using System.Linq;
using System;
using System.IO;

public class Model : MonoBehaviour, IModel{

    void Start()
    {
        try
        {
            Load();
        }
        catch (Exception e)
        {
            Debug.Log(e.Message);
            throw e;
        }
    }

    void OnApplicationQuit()
    {
        Debug.Log("OnApplicationQuit");
    }

    void OnAddEarn(Earn earn)
    {
        OnDataChange();
        ClearCar();
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
        try
        {
            Save(GetMemonto());
            SaveToCloud();
        }
        catch (Exception e)
        {
            Debug.Log(e.Message);
        }
    }

    void OnEarnMemoChange()
    {
        OnDataChange();
    }

    #region earn
    public Dictionary<int, Earn> earns = new Dictionary<int, Earn>();
    private int seqId = 0;
    private Earn lastInputEarn;

    public static Item Earn2Item(Earn earn)
    {
        var time = new DateTime(earn.createUTC).ToLocalTime();
        var timeStr = time.ToString(new System.Globalization.CultureInfo("zh-TW"));
        return new Item(earn.id, earn.money, earn.memo, timeStr);
    }

    public void AddEarn(int money, string memo, string time, UnityAction<object, List<Item>> callback)
    {
        var earn = Earn.empty;
        earn.id = seqId++;
        earn.money = money;
        if(memo == null)
        {
            earn.memo = lastInputEarn.memo;
            if(earn.memo == null)
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
        OnAddEarn(earn);
        callback(null, GetItemListCache());
    }

    public void ChangeItemMemo(int id, string memo, UnityAction<object, List<Item>> callback)
    {
        if (earns.ContainsKey(id) == false)
        {
            InvokeErrorAction(id + " not found");
            callback(null, null);
            return;
        }
        var earn = earns[id];
        earn.memo = memo;
        earns[id] = earn;
        lastInputEarn = earn;
        OnEarnMemoChange();
        callback(null, GetItemListCache());
    }

    public void ChangeItemMoney(int id, int money, UnityAction<object, List<Item>> callback)
    {
        if (earns.ContainsKey(id) == false)
        {
            InvokeErrorAction(id + " not found");
            return;
        }
        var earn = earns[id];
        earn.money = money;
        earns[id] = earn;
        callback(null, GetItemListCache());
    }

    public void DeleteItem(int id, UnityAction<object, List<Item>> callback)
    {
        if (earns.ContainsKey(id) == false)
        {
            Debug.LogWarning(id + " not found. can not delete");
            callback(null, GetItemListCache());
            return;
        }
        earns.Remove(id);
        OnDeleteEarn();
        callback(null, GetItemListCache());
    }

    public Item GetItemCacheById(int id)
    {
        if (earns.ContainsKey(id) == false)
        {
            InvokeErrorAction(id + " not found");
            throw new Exception("");
        }
        return Earn2Item(earns[id]);
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

    public void GetItemList(int count, int timeType, string memo, UnityAction<object, List<Item>> callback)
    {
        switch (timeType)
        {
            case ETimeType.ITEM:
                {
                    callback(
                        null, 
                        earns.Values
                            .Where(MemoContains(memo))
                            .OrderByDescending(earn => earn.createUTC)
                            .Take(count)
                            .Select(Earn2Item).ToList()
                    );
                    return;
                }
            case ETimeType.DAY:
                {
                    callback(
                        null,
                        earns.Values
                            .Where(MemoContains(memo))
                            .GroupBy(earn =>
                            {
                                var d = new DateTime(earn.createUTC);
                                return Tuple.Create(d.Year, d.Month, d.Day);
                            })
                            .Select(o =>
                            {
                                var year = o.Key.Item1;
                                var month = o.Key.Item2;
                                var day = o.Key.Item3;

                                var earn = Earn.empty;
                                earn.createUTC = new DateTime(year, month, day).Ticks;
                                earn.money = o.Sum(e => e.money);
                                earn.memo = new DateTime(year, month, day).ToLocalTime().ToString("yyyy/MM/dd");
                                return earn;
                            })
                            .OrderByDescending(earn => earn.createUTC)
                            .Take(count)
                            .Select(Earn2Item).ToList()
                    );
                    return;
                }
            case ETimeType.MONTH:
                {
                    callback(
                        null,
                        earns.Values
                            .Where(MemoContains(memo))
                            .GroupBy(earn =>
                            {
                                var d = new DateTime(earn.createUTC);
                                return Tuple.Create(d.Year, d.Month);
                            })
                            .Select(o =>
                            {
                                var year = o.Key.Item1;
                                var month = o.Key.Item2;

                                var earn = Earn.empty;
                                earn.createUTC = new DateTime(year, month, 1).Ticks;
                                earn.money = o.Sum(e => e.money);
                                earn.memo = new DateTime(year, month, 1).ToLocalTime().ToString("yyyy/MM");
                                return earn;
                            })
                            .OrderByDescending(earn => earn.createUTC)
                            .Take(count)
                            .Select(Earn2Item).ToList()
                    );
                    return;
                }
            case ETimeType.YEAR:
                {
                    callback(
                        null,
                        earns.Values
                            .Where(MemoContains(memo))
                            .GroupBy(earn =>
                            {
                                var d = new DateTime(earn.createUTC);
                                return Tuple.Create(d.Year);
                            })
                            .Select(o =>
                            {
                                var year = o.Key.Item1;

                                var earn = Earn.empty;
                                earn.createUTC = new DateTime(year, 1, 1).Ticks;
                                earn.money = o.Sum(e => e.money);
                                earn.memo = new DateTime(year, 1, 1).ToLocalTime().ToString("yyyy");
                                return earn;
                            })
                            .OrderBy(earn => earn.createUTC)
                            .Take(count)
                            .Select(Earn2Item).ToList()
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

    public List<Item> GetItemListCache()
    {
        return earns.Values.OrderByDescending(d => d.createUTC).Select(Earn2Item).ToList();
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
        var id = seqId++;
        car[id] = new Item(id, money, memo, null);
        callback(null, GetCarItemListCache());
    }

    public void DeleteItemFromCar(int id, UnityAction<object, List<Item>> callback)
    {
        if (car.ContainsKey(id) == false)
        {
            Debug.LogWarning(id + " not found. can not delete");
            callback(null, earns.Values.Select(Earn2Item).ToList());
            return;
        }
        car.Remove(id);
        callback(null, GetCarItemListCache());
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
    private static char[] SplitTag = new char[] {';'};
    private string memoFilter;

    public void SetFilterMemo(string filter)
    {
        memoFilter = filter;
    }

    public List<MemoItem> GetMemoList()
    {
        if (string.IsNullOrEmpty(memoFilter))
        {
            return memoItems.Values.ToList();
        }
        return memoItems.Values.Where(d=>d.Memo != null && d.Memo.Contains(memoFilter)).ToList();
    }

    public void ClearSelectMemo()
    {
        foreach (var m in memoItems.Values)
        {
            m.isSelect = false;
        }
    }

    public List<MemoItem> SelectMemo(string memo)
    {
        var datas = memo.Split(SplitTag);
        foreach (string m in datas)
        {
            if(memoItems.ContainsKey(m) == false)
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
        return GetMemoList();
    }

    public List<MemoItem> UnSelectMemo(string memo)
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
        return GetMemoList();
    }

    
    public List<MemoItem> AddMemo(string memo)
    {
        var datas = memo.Split(SplitTag);
        var memos = datas.Distinct().Select(d =>
        {
            return new MemoItem(d.Trim(), true);
        }).Where(m =>
        {
            return string.IsNullOrEmpty(m.Memo) == false;
        });

        foreach(var m in memos)
        {
            memoItems.Add(m.Memo, m);
        }
        OnAddMemo();
        return GetMemoList();
    }

    public string MemoListToString(List<MemoItem> list)
    {
        return string.Join(";", list.Where(d=>d.isSelect).Select(d => d.Memo).ToArray());
    }

    #endregion


    #region save
    private const string fileName = "save.json";

    public void SetMemonto(Memonto temp)
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
        Memonto temp;
        temp.seqId = this.seqId;
        temp.earns = new List<Earn>(earns.Values);
        temp.memo = new List<string>(memoItems.Values.Select(d => d.Memo));
        return temp;
    }

    public void Save(Memonto temp)
    {
        string json = JsonUtility.ToJson(temp, true);
        var filePath = Application.persistentDataPath + "/" + fileName;
        Debug.LogFormat("save to {0}", filePath);
        File.WriteAllText(filePath, json);
    }

    public void Load()
    {
        var filePath = Application.persistentDataPath + "/" + fileName;
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

    public void SaveToCloud()
    {
        StartCoroutine(InvokeSaveToCloud());
    }

    private IEnumerator InvokeSaveToCloud()
    {
        yield return cloudSave.SaveToCloud();
        try
        {
            cloudSave.CheckError();
        }
        catch (Exception e)
        {
            Debug.Log(e.Message);
            // InvokeErrorAction(e.Message);
        }
    }

    public string GetUserID()
    {
        return GetShowID(cloudSave.GetId());
    }

    public string GetShowID(string id)
    {
        var buf = new List<string>();
        for(var i=0; i<id.Length; i += 4)
        {
            buf.Add(id.Substring(i, Math.Min(id.Length, i+4) - i));
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
            InvokeErrorAction(e.Message);
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

    public void InvokeErrorAction(string msg)
    {
        Debug.Log(msg);
        if (errorAction != null)
        {
            errorAction(msg);
        }
    }

    public void SetErrorAction(UnityAction<string> callback)
    {
        errorAction = callback;
    }

    #endregion
}
