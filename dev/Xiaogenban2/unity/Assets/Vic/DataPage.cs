using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

public class DataPage : Page
{
    public Text TxtID;
    public Text TxtShowID;
    public InputField TxtInput;

    public string ID
    {
        get
        {
            return TxtID.text;
        }
        set
        {
            TxtID.text = value;
        }
    }

    public string ShowID
    {
        set
        {
            TxtShowID.text = value;
        }
    }

    public string InputID
    {
        get
        {
            return TxtInput.text;
        }
    }
    
    public void ShowClearID()
    {
        ShowID = Model.GetShowID(TxtInput.text);
    }

    public override void Open()
    {
        base.Open();
        ID = Model.GetUserID();
    }
}
