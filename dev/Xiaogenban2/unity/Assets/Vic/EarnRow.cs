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
        if (idx < 0) return;
        List<Item> list = View.Model.GetItemListCache();
        if (idx >= list.Count)
        {
            this.gameObject.SetActive(false);
            return;
        }
        else
        {
            this.gameObject.SetActive(true);
        }

        int itemId = list[idx].Id;
        Debug.Log("idx:" + idx);
        Debug.Log("itemID:" + itemId);
        Item item = View.Model.GetItemCacheById(itemId);
        money.text = item.Money.ToString();
        memo.text = item.Memo.ToString();
        time.text = item.Time.ToString();

        Btn_delete.onClick.RemoveAllListeners();
        Btn_delete.onClick.AddListener(delegate ()
        {
            View.Instance.OnMainPageItemDeleteClick(itemId);
        });

        Btn_edit.onClick.RemoveAllListeners();
        Btn_edit.onClick.AddListener(delegate ()
        {
            View.Instance.OnMainPageItemEditClick(itemId);
        });

        Btn_note.onClick.RemoveAllListeners();
        Btn_note.onClick.AddListener(delegate ()
        {
            View.Instance.OnMainPageItemMemoClick(itemId);
        });
    }
}
