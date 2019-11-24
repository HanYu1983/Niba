﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;
using System.Linq;
using System;

public class Model : MonoBehaviour, IModel{

    public Dictionary<int, Earn> earns = new Dictionary<int, Earn>();
    private int seqId = 0;
    private Earn lastInputEarn;

    void OnAddEarn(Earn earn)
    {
        ClearCar();
    }

    public static Item Earn2Item(Earn earn)
    {
        var time = new DateTime(earn.createUTC);
        var timeStr = time.ToLongDateString() + time.ToLongTimeString();
        return new Item(earn.id, earn.money, earn.memo, timeStr);
    }

    public void AddEarn(int money, string memo, string time, UnityAction<object, List<Item>> callback)
    {
        var earn = Earn.empty;
        earn.id = seqId++;
        earn.money = money;
        earn.memo = memo;
        if(earn.memo == null)
        {
            earn.memo = lastInputEarn.memo;
        }
        earn.createUTC = System.DateTime.UtcNow.Ticks;
        earns[earn.id] = earn;

        lastInputEarn = earn;
        OnAddEarn(earn);
        callback(null, earns.Values.Select(Earn2Item).ToList());
    }

    

    public void ChangeItemMemo(int id, string memo, UnityAction<object, List<Item>> callback)
    {
        if (earns.ContainsKey(id) == false)
        {
            callback(new System.Exception(id + " not found"), null);
            return;
        }
        var earn = earns[id];
        earn.memo = memo;
        earns[id] = earn;
        callback(null, earns.Values.Select(Earn2Item).ToList());
    }

    public void ChangeItemMoney(int id, int money, UnityAction<object, List<Item>> callback)
    {
        if (earns.ContainsKey(id) == false)
        {
            callback(new System.Exception(id + " not found"), null);
            return;
        }
        var earn = earns[id];
        earn.money = money;
        earns[id] = earn;
        callback(null, earns.Values.Select(Earn2Item).ToList());
    }

    public void DeleteItem(int id, UnityAction<object, List<Item>> callback)
    {
        if (earns.ContainsKey(id) == false)
        {
            Debug.LogWarning(id + " not found. can not delete");
            callback(null, earns.Values.Select(Earn2Item).ToList());
            return;
        }
        earns.Remove(id);
        callback(null, earns.Values.Select(Earn2Item).ToList());
    }

    

    public Item GetItemCacheById(int id)
    {
        if (earns.ContainsKey(id) == false)
        {
            throw new System.Exception(id + " not found");
        }
        return Earn2Item(earns[id]);
    }

    public static Func<Earn, bool> MemoContains(string memo)
    {
        return (Earn earn) =>
        {
            return earn.memo.Contains(memo);
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
        return earns.Values.Select(Earn2Item).ToList();
    }


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
        callback(null, car.Values.ToList());
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
        callback(null, car.Values.ToList());
    }

    public List<Item> GetCarItemListCache()
    {
        return car.Values.ToList();
    }

    #endregion
}
