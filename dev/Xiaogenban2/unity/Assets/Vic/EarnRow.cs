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
            //用以下的方式會讓套件找不到ScrollCellIndex而產生錯誤
            //this.gameObject.SetActive(false);

            this.gameObject.transform.localScale = new Vector3(0, 0, 0);
            return;
        }
        else
        {
            //用以下的方式會讓套件找不到ScrollCellIndex而產生錯誤
            //this.gameObject.SetActive(true);

            this.gameObject.transform.localScale = new Vector3(1, 1, 1);
        }

        int itemId = list[idx].Id;
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
