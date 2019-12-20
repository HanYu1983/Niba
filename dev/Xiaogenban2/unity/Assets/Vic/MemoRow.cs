using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class MemoRow : MonoBehaviour
{
    public Image ImgBack;
    public Text TxtMemo;
    public Button BtnSelect;

    public int Id { get; set; }
    public string Memo
    {
        get
        {
            return TxtMemo.text;
        }
        set
        {
            TxtMemo.text = value;
        }
    }
    public bool isSelect
    {
        get
        {
            return ImgBack.color == Color.red;
        }
        set
        {
            ImgBack.color = value ? Color.red : Color.white;
        }
    }
}
