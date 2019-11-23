using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Page : MonoBehaviour, IPage
{
    IModel model;

    public void Close()
    {
        this.gameObject.SetActive(false);
    }

    public virtual void Init()
    {
        
    }

    public virtual void Open()
    {
        this.gameObject.SetActive(true);
    }
    
    public IModel Model
    {
        get;set;
    }

    public View View
    {
        get;
        set;
    }
}
