using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Id : MonoBehaviour{

    void Start()
    {
        EventManager.Singleton.Add(this);
    }
    void OnDestroy()
    {
        EventManager.Singleton.Remove(this);
    }

    public int id;
    public string tagName;
}
