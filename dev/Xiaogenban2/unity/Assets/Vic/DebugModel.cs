using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class DebugModel : IModel
{
    public void AddEarn(int money, string memo, UnityAction<object, List<Item>> callback)
    {
        throw new System.NotImplementedException();
    }

    public void GetItemList(UnityAction<object, List<Item>> callback)
    {
        List<Item> items = new List<Item>();
        callback(null, items);
    }
    

}
