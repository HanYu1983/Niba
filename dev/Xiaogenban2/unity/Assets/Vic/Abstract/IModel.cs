using System.Collections.Generic;
using UnityEngine.Events;

public interface IModel
{
    void GetItemList(UnityAction<object, List<Item>> callback);
    void AddEarn(int money, string memo, UnityAction<object, List<Item>> callback);
}
