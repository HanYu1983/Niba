using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using UnityEngine.Events;
using UnityEngine.UI;

class TagController : MonoBehaviour
{
    public int Id = -1;
    public string FilterString = "";
    public IModel Model;
    public InputField Content;
    public GameObject MemoListContainer;
    public GameObject PrefabMemoItem;

    public string ContentText
    {
        get
        {
            return Content.text;
        }
        set
        {
            Content.text = value;
        }
    }

    List<GameObject> MemoList = new List<GameObject>();

    public void SetTagList(bool usingTemp = false)
    {
        ClearList();
        
        List<MemoItem> list = null;

        if (usingTemp)
        {
            list = Model.GetMemoList();
        }
        else
        {
            if (Id != -1)
            {
                Item item = Model.GetItemCacheById(Id);
                list = Model.SelectMemo(item.Memo);
            }
            else
            {
                list = Model.GetMemoList();
            }
        }
        
        if (list == null) return;

        foreach (MemoItem tag in list)
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

    public void AddTag()
    {
        Model.AddMemo(ContentText);
        SetTagList();
    }

    public void EditTag()
    {
        Model.EditMemo(ContentText);
        SetTagList();
    }

    public void DeleteTag()
    {
        Model.DeleteMemo();
        SetTagList();
    }

    public void ClearContent()
    {
        this.ContentText = "";
    }

    public void ClearList()
    {
        foreach (GameObject row in MemoList)
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
            SetTagList(true);
        };
    }
}