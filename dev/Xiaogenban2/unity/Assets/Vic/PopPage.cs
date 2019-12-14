using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using UnityEngine.Events;

public class PopPage : Page
{
    public Text TxtContent;
    public Button BtnConfirm;
    public Button BtnCancel;

    public void SetContent(string content)
    {
        TxtContent.text = content;
    }

    public void SetConfirm(UnityAction method)
    {
        BtnConfirm.onClick.RemoveAllListeners();
        BtnConfirm.onClick.AddListener(method);
    }

    public void SetCancel(UnityAction method)
    {
        BtnCancel.onClick.RemoveAllListeners();
        BtnCancel.onClick.AddListener(method);
    }
    
    public override void Close()
    {
        base.Close();

        if (BtnConfirm)  BtnConfirm.onClick.RemoveAllListeners();
        if(BtnCancel)   BtnCancel.onClick.RemoveAllListeners();
    }
}
