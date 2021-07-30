using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class DebugModel : MonoBehaviour, IModel
{
    public void AddEarn(int money, string memo, string time, UnityAction<object, List<Item>> callback)
    {
        List<Item> items = new List<Item>();
        for (int i = 0; i < 3000; ++i)
        {
            items.Add(new Item(i, 100 * i, "新增項目_" + i, i));
        }
        callback(null, items);
    }

    public void AddItemToCar(int money, string memo, string time, UnityAction<object, List<Item>> callback)
    {
        List<Item> items = new List<Item>();
        for (int i = 0; i < 3000; ++i)
        {
            items.Add(new Item(i, 100 * i, "新增項目_" + i, i));
        }
        callback(null, items);
    }

    public void ChangeItemMemo(int id, string memo, UnityAction<object, List<Item>> callback)
    {
        List<Item> items = new List<Item>();
        for (int i = 0; i < 3000; ++i)
        {
            items.Add(new Item(i, 100 * i, "修改備註_" + i, i));
        }
        callback(null, items);
    }

    public void ChangeItemMoney(int id, int money, UnityAction<object, List<Item>> callback)
    {
        List<Item> items = new List<Item>();
        for (int i = 0; i < 3000; ++i)
        {
            items.Add(new Item(i, 100 * i, "修改金錢_" + i, i));
        }
        callback(null, items);
    }

    public void DeleteItem(int id, UnityAction<object, List<Item>> callback)
    {
        List<Item> items = new List<Item>();
        for (int i = 0; i < 3000; ++i)
        {
            items.Add(new Item(i, 100 * i, "刪除項目_" + i, i));
        }
        callback(null, items);
    }

    public void DeleteItemFromCar(int id, UnityAction<object, List<Item>> callback)
    {
        List<Item> items = new List<Item>();
        for (int i = 0; i < 3000; ++i)
        {
            items.Add(new Item(i, 100 * i, "刪除項目_" + i, i));
        }
        callback(null, items);
    }

    public List<Item> GetCarItemListCache()
    {
        List<Item> items = new List<Item>();
        for (int i = 0; i < 3000; ++i)
        {
            items.Add(new Item(i, 100 * i, "刪除項目_" + i, i));
        }
        return items;
    }

    public Item GetItemCacheById(int id)
    {
        return new Item(0,(int)(Random.RandomRange(.1f, .5f) * 10), "", 0);
    }

    public void GetItemList(int count, int timeType, string memo, UnityAction<object, List<Item>> callback)
    {
        List<Item> items = new List<Item>();
        for( int i = 0; i < 3000; ++i)
        {
            items.Add(new Item(i, 100 * i, "memo_" + i, i));
        }
        callback(null, items);
    }

    public List<Item> GetItemListCache()
    {
        List<Item> items = new List<Item>();
        for (int i = 0; i < 3000; ++i)
        {
            items.Add(new Item(i, 100 * i, "memo_" + i, i));
        }
        return items;
    }

    public List<MemoItem> GetMemoList()
    {
        List<MemoItem> items = new List<MemoItem>();
        for (int i = 0; i < 30; ++i)
        {
            items.Add(new MemoItem("tag_" + i, (Random.Range(0, 10) > 5)));
        }
        return items;
    }

    public List<MemoItem> UnSelectMemo(string memo)
    {
        List<MemoItem> items = new List<MemoItem>();
        for (int i = 0; i < 30; ++i)
        {
            items.Add(new MemoItem("tag_" + i, (Random.Range(0, 10) > 5)));
        }
        return items;
    }

    public List<MemoItem> SelectMemo(string memo)
    {
        List<MemoItem> items = new List<MemoItem>();
        for (int i = 0; i < 30; ++i)
        {
            items.Add(new MemoItem("tag_" + i, (Random.Range(0, 10) > 5)));
        }
        return items;
    }

    public List<MemoItem> AddMemo(string memo)
    {
        List<MemoItem> items = new List<MemoItem>();
        for (int i = 0; i < 30; ++i)
        {
            items.Add(new MemoItem("tag_" + i, (Random.Range(0, 10) > 5)));
        }
        return items;
    }

    public string MemoListToString(List<MemoItem> list)
    {
        return "a,b,c";
    }

    public List<MemoItem> FilterMemo(string memo)
    {
        throw new System.NotImplementedException();
    }

    public void SetFilterMemo(string filter)
    {
        Debug.Log("SetFilterMemo");
    }

    public void ClearSelectMemo()
    {
        
    }

    public string GetUserID()
    {
        return "1111-2222-3333-4444-55";
    }

    public string GetShowID(string id)
    {
        return "22-33-44";
    }

    public void GetUserData(string id, UnityAction<bool> callback)
    {
        callback(true);
    }

    public bool IsValidID(string id)
    {
        return true;
    }

    public void SetErrorAction(UnityAction<string> callback)
    {
        Debug.Log("註冊錯誤方法");
    }

    public void Load(UnityAction<bool> callback)
    {
        callback(true);
    }

    public List<MemoItem> DeleteMemo()
    {
        List<MemoItem> items = new List<MemoItem>();
        for (int i = 0; i < 30; ++i)
        {
            items.Add(new MemoItem("tag_delete_" + i, (Random.Range(0, 10) > 5)));
        }
        return items;
    }

    public List<MemoItem> EditMemo(string memo, bool removeOld)
    {
        List<MemoItem> items = new List<MemoItem>();
        for (int i = 0; i < 30; ++i)
        {
            items.Add(new MemoItem("tag_edit_" + i, (Random.Range(0, 10) > 5)));
        }
        return items;
    }

    public void ChangeItem(int id, Item item, UnityAction<object, List<Item>> callback)
    {

    }

    public bool IsCloudSaveDirty()
    {
        return true;
    }

    public bool IsPendingDirty()
    {
        return false;
    }
    public SaveWorkerState GetSaveWorkerState()
    {
        return SaveWorkerState.Pending;
    }
    public void ManuallySave()
    {

    }
    public bool IsDiskSaveDirty()
    {
        return true;
    }
    public void SetDebug(bool v)
    {
        
    }
    public bool IsDebug()
    {
        return true;
    }
}
