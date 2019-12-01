﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class MemoPage : Page
{
    int _id;
    public int Id {
        get { return _id; }
        set {
            _id = value;
            Item item = Model.GetItemCacheById(_id);
            GetTagController().ContentText = item.Memo;
        }
    }

    public string GetContent()
    {
        return GetTagController().ContentText;
    }

    public override void Init()
    {
        base.Init();

        GetTagController().Model = Model;
    }

    public override void Open()
    {
        base.Open();

        GetTagController().SetTagList();
    }

    public override void Close()
    {
        base.Close();

        GetTagController().ClearContent();
    }

    public void AddTag()
    {
        GetTagController().AddTag();
    }

    TagController GetTagController()
    {
        return GetComponent<TagController>();
    }
}
