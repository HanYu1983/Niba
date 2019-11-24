using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class Model : MonoBehaviour, IModel{
    public void AddEarn(int money, string memo, string time, UnityAction<object, List<Item>> callback)
    {
        throw new System.NotImplementedException();
    }

    public void AddItemToCar(int money, string memo, string time, UnityAction<object, List<Item>> callback)
    {
        throw new System.NotImplementedException();
    }

    public void ChangeItemMemo(int id, string memo, UnityAction<object, List<Item>> callback)
    {
        throw new System.NotImplementedException();
    }

    public void ChangeItemMoney(int id, int money, UnityAction<object, List<Item>> callback)
    {
        throw new System.NotImplementedException();
    }

    public void DeleteItem(int id, UnityAction<object, List<Item>> callback)
    {
        throw new System.NotImplementedException();
    }

    public void DeleteItemFromCar(int id, UnityAction<object, List<Item>> callback)
    {
        throw new System.NotImplementedException();
    }

    public List<Item> GetCarItemListCache()
    {
        throw new System.NotImplementedException();
    }

    public Item GetItemCacheById(int id)
    {
        throw new System.NotImplementedException();
    }

    public void GetItemList(int count, int timeType, string memo, UnityAction<object, List<Item>> callback)
    {
        throw new System.NotImplementedException();
    }

    public List<Item> GetItemListCache()
    {
        throw new System.NotImplementedException();
    }

    // Use this for initialization
    void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		
	}
}
