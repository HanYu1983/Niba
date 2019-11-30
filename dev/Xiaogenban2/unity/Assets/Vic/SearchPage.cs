using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

public class SearchPage : Page
{
    public InputField Content;
    public GameObject MemoListContainer;
    public GameObject PrefabMemoItem;

    List<GameObject> MemoList = new List<GameObject>();

    public string GetContent()
    {
        return Content.text;
    }

    public override void Close()
    {
        base.Close();

        Content.text = "";
    }

    public override void Open()
    {
        base.Open();

        SetTagList();
    }

    public void AddTag()
    {
        Model.AddMemo(Content.text);
        SetTagList();
    }

    void SetTagList()
    {
        ClearList();
        List<MemoItem> list = Model.GetMemoList();
        foreach(MemoItem tag in list)
        {
            GameObject row = Instantiate(PrefabMemoItem, MemoListContainer.transform);
            row.SetActive(true);

            MemoRow memoRow = row.GetComponent<MemoRow>();
            memoRow.Memo = tag.Memo;
            memoRow.isSelect = tag.isSelect;
            memoRow.BtnSelect.onClick.RemoveAllListeners();
            memoRow.BtnSelect.onClick.AddListener(OnBtnSelectClick(memoRow));

            MemoList.Add(row);
        }
    }

    void ClearList()
    {
        foreach(GameObject row in MemoList)
        {
            row.GetComponent<MemoRow>().BtnSelect.onClick.RemoveAllListeners();
            Destroy(row);
        }
        MemoList.Clear();
    }

    UnityAction OnBtnSelectClick(MemoRow mr)
    {
        return delegate ()
        {
            if (mr.isSelect)
            {
                Model.UnSelectMemo(mr.Memo);
            }
            else
            {
                Model.SelectMemo(mr.Memo);
            }
        };
    }
}
