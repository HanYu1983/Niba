using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

[RequireComponent(typeof(TagController))]
public class SearchPage : Page
{

    public string GetContent()
    {
        return GetTagController().ContentText;
    }

    public override void Close()
    {
        base.Close();

        GetTagController().ClearContent();
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

    public void FilterTag()
    {
        Model.SetFilterMemo(GetTagController().ContentText);
        GetTagController().SetTagList();
    }

    TagController GetTagController()
    {
        return GetComponent<TagController>();
    }
}
