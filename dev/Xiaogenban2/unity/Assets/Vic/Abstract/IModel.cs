using System.Collections.Generic;
using UnityEngine.Events;

public interface IModel
{
     void GetItemList(UnityAction<object, List<Item>> callback);
}
