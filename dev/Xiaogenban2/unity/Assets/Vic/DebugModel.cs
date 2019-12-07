using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class DebugModel : MonoBehaviour, IModel
{
    public void AddEarn(int money, string memo, string time, UnityAction<object, List<Item>> callback)
    {
        List<Item> items = new List<Item>();
        for (int i = 0; i < 20; ++i)
        {
            items.Add(new Item(i, 100 * i, "新增項目_" + i, "1/2/" + i));
        }
        callback(null, items);
    }

    public void AddItemToCar(int money, string memo, string time, UnityAction<object, List<Item>> callback)
    {
        List<Item> items = new List<Item>();
        for (int i = 0; i < 3; ++i)
        {
            items.Add(new Item(i, 100 * i, "新增項目_" + i, "1/2/" + i));
        }
        callback(null, items);
    }

    public void ChangeItemMemo(int id, string memo, UnityAction<object, List<Item>> callback)
    {
        List<Item> items = new List<Item>();
        for (int i = 0; i < 20; ++i)
        {
            items.Add(new Item(i, 100 * i, "修改備註_" + i, "1/2/" + i));
        }
        callback(null, items);
    }

    public void ChangeItemMoney(int id, int money, UnityAction<object, List<Item>> callback)
    {
        List<Item> items = new List<Item>();
        for (int i = 0; i < 20; ++i)
        {
            items.Add(new Item(i, 100 * i, "修改金錢_" + i, "1/2/" + i));
        }
        callback(null, items);
    }

    public void DeleteItem(int id, UnityAction<object, List<Item>> callback)
    {
        List<Item> items = new List<Item>();
        for (int i = 0; i < 5; ++i)
        {
            items.Add(new Item(i, 100 * i, "刪除項目_" + i, "1/2/" + i));
        }
        callback(null, items);
    }

    public void DeleteItemFromCar(int id, UnityAction<object, List<Item>> callback)
    {
        List<Item> items = new List<Item>();
        for (int i = 0; i < 3; ++i)
        {
            items.Add(new Item(i, 100 * i, "刪除項目_" + i, "1/2/" + i));
        }
        callback(null, items);
    }

    public List<Item> GetCarItemListCache()
    {
        return new List<Item>();
    }

    public Item GetItemCacheById(int id)
    {
        return new Item(0,10, "", "");
    }

    public void GetItemList(int count, int timeType, string memo, UnityAction<object, List<Item>> callback)
    {
        List<Item> items = new List<Item>();
        for( int i = 0; i < 20; ++i)
        {
            items.Add(new Item(i, 100 * i, "memo_" + i, "1/2/" + i));
        }
        callback(null, items);
    }

    public List<Item> GetItemListCache()
    {
        List<Item> items = new List<Item>();
        for (int i = 0; i < 20; ++i)
        {
            items.Add(new Item(i, 100 * i, "memo_" + i, "1/2/" + i));
        }
        return items;
    }

    public List<MemoItem> GetMemoList()
    {
        List<MemoItem> items = new List<MemoItem>();
        for (int i = 0; i < 20; ++i)
        {
            items.Add(new MemoItem("tag_" + i, (Random.Range(0, 10) > 5)));
        }
        return items;
    }

    public List<MemoItem> UnSelectMemo(string memo)
    {
        List<MemoItem> items = new List<MemoItem>();
        for (int i = 0; i < 20; ++i)
        {
            items.Add(new MemoItem("tag_" + i, (Random.Range(0, 10) > 5)));
        }
        return items;
    }

    public List<MemoItem> SelectMemo(string memo)
    {
        List<MemoItem> items = new List<MemoItem>();
        for (int i = 0; i < 20; ++i)
        {
            items.Add(new MemoItem("tag_" + i, (Random.Range(0, 10) > 5)));
        }
        return items;
    }

    public List<MemoItem> AddMemo(string memo)
    {
        List<MemoItem> items = new List<MemoItem>();
        for (int i = 0; i < 20; ++i)
        {
            items.Add(new MemoItem("tag_" + i, (Random.Range(0, 10) > 5)));
        }
        return items;
    }

    public string MemoListToString(List<MemoItem> list)
    {
        return "a,b,c";
    }
    /*
    public List<MemoItem> StringToMemoList(string memo)
    {
        List<MemoItem> items = new List<MemoItem>();
        for (int i = 0; i < 20; ++i)
        {
            items.Add(new MemoItem("tag_memo" + i, (Random.Range(0, 10) > 5)));
        }
        return items;
    }*/
}
