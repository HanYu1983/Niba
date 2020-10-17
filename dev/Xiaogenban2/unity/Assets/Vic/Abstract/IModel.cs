using System.Collections.Generic;
using UnityEngine.Events;

public interface IModel
{
    void SetErrorAction(UnityAction<string> callback);

    void GetItemList(int count, int timeType, string memo, UnityAction<object, List<Item>> callback);
    void AddEarn(int money, string memo, string time, UnityAction<object, List<Item>> callback);
    void ChangeItemMoney(int id, int money, UnityAction<object, List<Item>> callback);
    void ChangeItemMemo(int id, string memo, UnityAction<object, List<Item>> callback);
    void ChangeItem(int id, Item item, UnityAction<object, List<Item>> callback);
    void DeleteItem(int id, UnityAction<object, List<Item>> callback);
    List<Item> GetItemListCache();
    Item GetItemCacheById(int id);
    
    void AddItemToCar(int money, string memo, string time, UnityAction<object, List<Item>> callback);
    void DeleteItemFromCar(int id, UnityAction<object, List<Item>> callback);
    List<Item> GetCarItemListCache();

    List<MemoItem> GetMemoList();
    List<MemoItem> AddMemo(string memo);
    List<MemoItem> DeleteMemo();
    List<MemoItem> EditMemo(string memo, bool removeOld);
    List<MemoItem> SelectMemo(string memo);
    List<MemoItem> UnSelectMemo(string memo);
    void SetFilterMemo(string filter);
    void ClearSelectMemo();

    string MemoListToString(List<MemoItem> list);

    bool IsValidID(string id);
    string GetUserID();
    string GetShowID(string id);
    void GetUserData(string id, UnityAction<bool> callback);

    void Load(UnityAction<bool> callback);
    bool IsCloudSaveDirty();
}
