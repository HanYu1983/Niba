using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Opsive.ThirdPersonController;

public class TestInve : MonoBehaviour {

    public Inventory inventory;

    private void Awake()
    {
        SharedManager.Register(this);
        EventHandler.RegisterEvent<System.Type, bool>(gameObject, "OnAnimatorItemUsed", OnUsed);
    }

    private void OnUsed(System.Type itemType, bool extensionItem)
    {
        var item = inventory.GetCurrentItem(typeof(PrimaryItemType));
        if (item is IUseableItem)
        {
            var useableItem = item as IUseableItem;
            useableItem.Used();
        }
        else
        {
            Debug.Log("can not use");
        }
    }

    private bool SharedMethod_IndependentLook()
    {
        return true;
    }

    private bool SharedMethod_AIAgent()
    {
        return true;
    }

    IEnumerator FakeAnimatorItemUse()
    {
        EventHandler.ExecuteEvent<System.Type, bool>(gameObject, "OnAnimatorItemUsed", typeof(PrimaryItemType), false);
        yield return new WaitForSeconds(1);
        EventHandler.ExecuteEvent(gameObject, "OnAnimatorItemEndUse");
    }

    public void Switch()
    {
        inventory.SwitchItem(true, true);
    }

    public void TryUse()
    {
        var item = inventory.GetCurrentItem(typeof(PrimaryItemType));
        if(item is IUseableItem)
        {
            var useableItem = item as IUseableItem;

            if (useableItem.TryUse())
            {
                StartCoroutine(FakeAnimatorItemUse());
            }
        }
        else
        {
            Debug.Log("can not use");
        }
    }
}
