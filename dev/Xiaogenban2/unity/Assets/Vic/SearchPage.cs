using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class SearchPage : Page
{
    public InputField Content;

    public string GetContent()
    {
        return Content.text;
    }

    public override void Close()
    {
        base.Close();

        Content.text = "";
    }
}
