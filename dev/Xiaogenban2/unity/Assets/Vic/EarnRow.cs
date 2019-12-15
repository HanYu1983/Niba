using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class EarnRow : MonoBehaviour
{
    public Button Btn_note;
    public Button Btn_edit;
    public Button Btn_delete;

    public int id;
    public Text memo;
    public Text money;
    public Text time;

    void ScrollCellIndex(int idx)
    {
        List<Item> list = View.Model.GetItemListCache();
        this.gameObject.SetActive(true);
        if (idx >= list.Count)
        {
            this.gameObject.SetActive(false);
            return;
        }
        else
        {
            this.gameObject.SetActive(true);
        }
        Item item = View.Model.GetItemCacheById(list[idx].Id);
        money.text = item.Money.ToString();
        memo.text = item.Memo.ToString();
        time.text = item.Time.ToString();

        //var key = keys[idx];
        //textDesc.text = iapDlg.langText.GetIAPDesc(iapDlg.lang, key.Idx);
        //textCost.text = iapDlg.langText.GetIAPCost(iapDlg.lang, key.Idx);

        //ButtonCtrl buyBtn = buyButton;
        //buyBtn.command = "IAPDlgBtn" + key.StringKey;
        //buyBtn.SetEnable(true);

        //try
        //{
        //    Util.Instance.GetPrefab(key.IAPPrefabName, anchorObj);
        //}
        //catch (Exception e)
        //{
        //    Debug.LogWarning(e.Message);
        //}
    }
}
