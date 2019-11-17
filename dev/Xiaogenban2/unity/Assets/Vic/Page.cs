using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Page : MonoBehaviour, IPage
{
    IModel model;

    public void close()
    {
        this.gameObject.SetActive(false);
    }

    public IModel getModel()
    {
        return model;
    }

    public virtual void Init()
    {
        
    }

    public virtual void open()
    {
        this.gameObject.SetActive(true);
    }

    public void setModel(IModel model)
    {
        this.model = model;
    }
}
