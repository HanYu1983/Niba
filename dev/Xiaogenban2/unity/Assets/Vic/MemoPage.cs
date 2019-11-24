using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class MemoPage : Page
{
    public InputField content;

    int _id;
    public int Id {
        get { return _id; }
        set {
            _id = value;
            Item item = Model.GetItemCacheById(_id);
            this.content.text = item.Memo;
        }
    }

    public string GetContent()
    {
        return content.text;
    }
    
}
