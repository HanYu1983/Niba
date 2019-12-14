using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class LoadingPage : Page
{
    public Text TxtContent;

    public string Content
    {
        get
        {
            return TxtContent.text;
        }
        set
        {
            TxtContent.text = value;
        }
    }
}
